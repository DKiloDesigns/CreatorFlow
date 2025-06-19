import { PrismaClient, Post, SocialAccount } from '@prisma/client';
import { decrypt, encrypt } from '@/lib/crypto';
import { PlatformResult } from '../publishing';

const prisma = new PrismaClient();

type PublishResult = PlatformResult;

interface RedditError {
  code?: number;
  message: string;
}

// Helper: Get Authenticated Reddit Client
async function getRedditApiClient(account: SocialAccount): Promise<{ accessToken: string | null; error?: string }> {
  if (!account.encryptedAccessToken) {
    return { accessToken: null, error: 'Missing encrypted access token' };
  }

  // Decrypt token
  const accessToken = decrypt(account.encryptedAccessToken);
  if (!accessToken) {
    return { accessToken: null, error: 'Failed to decrypt access token' };
  }

  // Check if token is expired (Reddit tokens typically last 1 hour)
  const isExpired = account.tokenExpiresAt ? new Date(account.tokenExpiresAt) < new Date() : false;
  
  if (isExpired) {
    console.log(`[Reddit Publisher] Token for account ${account.id} expired. Marking for re-auth...`);
    try {
      await prisma.socialAccount.update({
        where: { id: account.id },
        data: { status: 'needs_reauth' }
      });
    } catch (dbError) {
      console.error('Failed to update account status:', dbError);
    }
    return { accessToken: null, error: 'Token expired. Account needs re-authentication.' };
  }

  return { accessToken };
}

/**
 * Publishes a post to Reddit.
 * 
 * Reddit API supports:
 * - Text posts
 * - Link posts
 * - Image posts (via imgur or direct links)
 * - Video posts
 * 
 * @param post The post data from Prisma.
 * @param account The user's Reddit social account data.
 * @param subreddit Optional subreddit to post to (defaults to user's profile)
 * @returns A promise resolving to a PublishResult object.
 */
export async function publishToReddit(
  post: Post,
  account: SocialAccount,
  subreddit?: string
): Promise<PublishResult> {
  console.log(`[Reddit Publisher] Publishing post ${post.id} for user ${account.userId} to account ${account.username}`);

  const { accessToken, error: authError } = await getRedditApiClient(account);

  if (authError || !accessToken) {
    console.error(`[Reddit Publisher] Authentication failed for account ${account.id}: ${authError}`);
    return { platform: 'reddit', success: false, error: authError || 'Authentication failed' };
  }

  try {
    // Determine post type and content
    let postData: any = {
      title: post.contentText?.substring(0, 300) || 'CreatorFlow Post', // Reddit title limit
      text: post.contentText || '',
      kind: 'self', // Default to text post
    };

    // Handle media if present
    if (post.mediaUrls && post.mediaUrls.length > 0) {
      const mediaUrl = post.mediaUrls[0];
      console.log(`[Reddit Publisher] Processing media: ${mediaUrl}`);
      
      // Determine if it's an image, video, or link
      const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(mediaUrl);
      const isVideo = /\.(mp4|mov|avi|webm)$/i.test(mediaUrl);
      
      if (isImage || isVideo) {
        // For images/videos, we need to use a link post
        postData.kind = 'link';
        postData.url = mediaUrl;
        postData.text = ''; // Remove text content for link posts
      } else {
        // For other URLs, treat as link post
        postData.kind = 'link';
        postData.url = mediaUrl;
        postData.text = '';
      }
    }

    // Determine target (subreddit or user profile)
    const target = subreddit || 'u_' + account.username; // Post to user profile if no subreddit specified
    
    console.log(`[Reddit Publisher] Posting to: ${target}`);

    // Create the post
    const postResponse = await fetch(`https://oauth.reddit.com/api/submit`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'CreatorFlow/1.0 (by /u/creatorflow_bot)',
      },
      body: new URLSearchParams({
        sr: target,
        title: postData.title,
        kind: postData.kind,
        ...(postData.kind === 'self' ? { text: postData.text } : { url: postData.url }),
        api_type: 'json',
      }),
    });

    if (!postResponse.ok) {
      const errorData = await postResponse.json();
      throw new Error(`Failed to create Reddit post: ${errorData.json?.errors?.[0]?.[1] || 'Unknown error'}`);
    }

    const postResult = await postResponse.json();
    
    // Reddit API returns the post ID in a nested structure
    const platformPostId = postResult.json?.data?.id || postResult.json?.data?.name;
    
    if (!platformPostId) {
      throw new Error('Failed to get post ID from Reddit response');
    }

    console.log(`[Reddit Publisher] Successfully published post ${post.id}. Platform ID: ${platformPostId}`);

    return {
      platform: 'reddit',
      success: true,
      platformPostId: platformPostId,
    };

  } catch (error: unknown) {
    const redditError = error as RedditError;
    console.error(`[Reddit Publisher] Failed to publish post ${post.id}:`, redditError);
    return {
      platform: 'reddit',
      success: false,
      error: redditError.message || 'Unknown Reddit API error',
    };
  }
}

/**
 * Alternative implementation for posting to specific subreddits
 * This provides more control over subreddit targeting
 */
export async function publishToSubreddit(
  post: Post,
  account: SocialAccount,
  subreddit: string
): Promise<PublishResult> {
  console.log(`[Reddit Subreddit Publisher] Publishing post ${post.id} to r/${subreddit}`);

  // Validate subreddit name
  if (!subreddit || !/^[a-zA-Z0-9_]{3,21}$/.test(subreddit)) {
    return { platform: 'reddit', success: false, error: 'Invalid subreddit name' };
  }

  return publishToReddit(post, account, subreddit);
}

/**
 * Helper function to get user's subscribed subreddits
 * This can be used to suggest subreddits for posting
 */
export async function getSubscribedSubreddits(account: SocialAccount): Promise<string[]> {
  const { accessToken, error: authError } = await getRedditApiClient(account);

  if (authError || !accessToken) {
    console.error(`[Reddit Publisher] Authentication failed for account ${account.id}: ${authError}`);
    return [];
  }

  try {
    const response = await fetch('https://oauth.reddit.com/subreddits/mine/subscriber', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': 'CreatorFlow/1.0 (by /u/creatorflow_bot)',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch subscribed subreddits');
    }

    const data = await response.json();
    return data.data.children.map((subreddit: any) => subreddit.data.display_name);
  } catch (error) {
    console.error('[Reddit Publisher] Failed to fetch subscribed subreddits:', error);
    return [];
  }
} 