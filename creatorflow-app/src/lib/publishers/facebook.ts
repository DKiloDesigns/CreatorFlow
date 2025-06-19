import { PrismaClient, Post, SocialAccount } from '@prisma/client';
import { decrypt, encrypt } from '@/lib/crypto';
import { PlatformResult } from '../publishing';

const prisma = new PrismaClient();

type PublishResult = PlatformResult;

interface FacebookError extends Error {
  code?: number;
  error_subcode?: number;
}

// Helper: Get Authenticated Facebook Client
async function getFacebookApiClient(account: SocialAccount): Promise<{ accessToken: string | null; error?: string }> {
  if (!account.encryptedAccessToken) {
    return { accessToken: null, error: 'Missing encrypted access token' };
  }

  // Decrypt token
  const accessToken = decrypt(account.encryptedAccessToken);
  if (!accessToken) {
    return { accessToken: null, error: 'Failed to decrypt access token' };
  }

  // Check if token is expired (Facebook tokens typically last 60 days)
  const isExpired = account.tokenExpiresAt ? new Date(account.tokenExpiresAt) < new Date() : false;
  
  if (isExpired) {
    console.log(`[Facebook Publisher] Token for account ${account.id} expired. Marking for re-auth...`);
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

// Helper: Get MIME type from URL
function getMimeType(url: string): string {
  const extension = url.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'mp4':
      return 'video/mp4';
    case 'mov':
      return 'video/quicktime';
    default:
      return 'image/jpeg'; // Default fallback
  }
}

/**
 * Publishes a post to Facebook.
 * 
 * Facebook Graph API supports posting to:
 * - User profile
 * - Pages (if user has admin access)
 * - Groups (if user has permission)
 * 
 * @param post The post data from Prisma.
 * @param account The user's Facebook social account data.
 * @returns A promise resolving to a PublishResult object.
 */
export async function publishToFacebook(
  post: Post,
  account: SocialAccount
): Promise<PublishResult> {
  console.log(`[Facebook Publisher] Publishing post ${post.id} for user ${account.userId} to account ${account.username}`);

  const { accessToken, error: authError } = await getFacebookApiClient(account);

  if (authError || !accessToken) {
    console.error(`[Facebook Publisher] Authentication failed for account ${account.id}: ${authError}`);
    return { platform: 'facebook', success: false, error: authError || 'Authentication failed' };
  }

  try {
    // Facebook supports both text and media posts
    let postData: any = {
      message: post.contentText || '',
    };

    // Handle media upload if present
    if (post.mediaUrls && post.mediaUrls.length > 0) {
      console.log(`[Facebook Publisher] Processing ${post.mediaUrls.length} media items...`);
      
      // Facebook supports multiple images/videos in a single post
      const mediaIds: string[] = [];
      
      for (const mediaUrl of post.mediaUrls) {
        try {
          console.log(`[Facebook Publisher] Uploading media from ${mediaUrl}...`);
          
          // 1. Fetch media from source
          const mediaResponse = await fetch(mediaUrl);
          if (!mediaResponse.ok) {
            throw new Error(`Failed to fetch media (${mediaResponse.status}): ${mediaResponse.statusText}`);
          }
          
          const mediaBuffer = Buffer.from(await mediaResponse.arrayBuffer());
          const mimeType = getMimeType(mediaUrl);
          
          // 2. Upload to Facebook
          const formData = new FormData();
          formData.append('source', new Blob([mediaBuffer], { type: mimeType }));
          formData.append('access_token', accessToken);
          
          const uploadResponse = await fetch(`https://graph.facebook.com/v18.0/me/photos`, {
            method: 'POST',
            body: formData,
          });
          
          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json();
            throw new Error(`Media upload failed: ${errorData.error?.message || 'Unknown error'}`);
          }
          
          const uploadData = await uploadResponse.json();
          mediaIds.push(uploadData.id);
          console.log(`[Facebook Publisher] Media uploaded successfully. ID: ${uploadData.id}`);
          
        } catch (mediaError) {
          console.error(`[Facebook Publisher] Failed to upload media from ${mediaUrl}:`, mediaError);
          // Continue with other media items
        }
      }
      
      // If we have media IDs, use them in the post
      if (mediaIds.length > 0) {
        if (mediaIds.length === 1) {
          postData.attached_media = [{ media_fbid: mediaIds[0] }];
        } else {
          // For multiple media items, we need to create a multi-photo post
          postData.attached_media = mediaIds.map(id => ({ media_fbid: id }));
        }
      }
    }

    // 3. Create the post
    console.log('[Facebook Publisher] Creating post...');
    const postResponse = await fetch(`https://graph.facebook.com/v18.0/me/feed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...postData,
        access_token: accessToken,
      }),
    });

    if (!postResponse.ok) {
      const errorData = await postResponse.json();
      throw new Error(`Failed to create post: ${errorData.error?.message || 'Unknown error'}`);
    }

    const postResult = await postResponse.json();
    const platformPostId = postResult.id;

    console.log(`[Facebook Publisher] Successfully published post ${post.id}. Platform ID: ${platformPostId}`);

    return {
      platform: 'facebook',
      success: true,
      platformPostId: platformPostId,
    };

  } catch (error: unknown) {
    const facebookError = error as FacebookError;
    console.error(`[Facebook Publisher] Failed to publish post ${post.id}:`, facebookError);
    return {
      platform: 'facebook',
      success: false,
      error: facebookError.message || 'Unknown Facebook API error',
    };
  }
}

/**
 * Alternative implementation for posting to Facebook Pages
 * This would be used for business accounts with page access
 */
export async function publishToFacebookPage(
  post: Post,
  account: SocialAccount,
  pageId: string
): Promise<PublishResult> {
  console.log(`[Facebook Page Publisher] Publishing post ${post.id} to page ${pageId}`);

  const { accessToken, error: authError } = await getFacebookApiClient(account);

  if (authError || !accessToken) {
    console.error(`[Facebook Page Publisher] Authentication failed for account ${account.id}: ${authError}`);
    return { platform: 'facebook', success: false, error: authError || 'Authentication failed' };
  }

  try {
    // Similar implementation but posts to page instead of user profile
    const postData: any = {
      message: post.contentText || '',
    };

    // Handle media upload similar to user posts
    if (post.mediaUrls && post.mediaUrls.length > 0) {
      // Media upload logic for pages
      // ... (similar to above)
    }

    const postResponse = await fetch(`https://graph.facebook.com/v18.0/${pageId}/feed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...postData,
        access_token: accessToken,
      }),
    });

    if (!postResponse.ok) {
      const errorData = await postResponse.json();
      throw new Error(`Failed to create page post: ${errorData.error?.message || 'Unknown error'}`);
    }

    const postResult = await postResponse.json();
    const platformPostId = postResult.id;

    return {
      platform: 'facebook',
      success: true,
      platformPostId: platformPostId,
    };

  } catch (error: unknown) {
    const facebookError = error as FacebookError;
    console.error(`[Facebook Page Publisher] Failed to publish post ${post.id}:`, facebookError);
    return {
      platform: 'facebook',
      success: false,
      error: facebookError.message || 'Unknown Facebook API error',
    };
  }
} 