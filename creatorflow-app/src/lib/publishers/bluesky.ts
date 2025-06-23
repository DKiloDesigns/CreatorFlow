import { PrismaClient, Post, SocialAccount } from '@prisma/client';
import { decrypt, encrypt } from '@/lib/crypto';
import { PlatformResult } from '../publishing';

const prisma = new PrismaClient();

type PublishResult = PlatformResult;

interface BlueskyError {
  error?: string;
  message?: string;
}

// Helper: Get Authenticated Bluesky Client
async function getBlueskyApiClient(account: SocialAccount): Promise<{ accessToken: string | null; error?: string }> {
  if (!account.encryptedAccessToken) {
    return { accessToken: null, error: 'Missing encrypted access token' };
  }

  // Decrypt token
  const accessToken = decrypt(account.encryptedAccessToken);
  if (!accessToken) {
    return { accessToken: null, error: 'Failed to decrypt access token' };
  }

  return { accessToken };
}

/**
 * Publishes a post to Bluesky.
 * 
 * Bluesky API supports:
 * - Text posts (skeets)
 * - Media attachments
 * - Rich text formatting
 * - Threading
 * 
 * @param post The post data from Prisma.
 * @param account The user's Bluesky social account data.
 * @returns A promise resolving to a PlatformResult object.
 */
export async function publishToBluesky(
  post: Post,
  account: SocialAccount
): Promise<PlatformResult> {
  const { accessToken, error: authError } = await getBlueskyApiClient(account);

  if (authError || !accessToken) {
    return { platform: 'bluesky', success: false, error: authError || 'Authentication failed' };
  }

  try {
    // Get user's DID (Decentralized Identifier)
    const sessionResponse = await fetch('https://bsky.social/xrpc/com.atproto.server.getSession', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!sessionResponse.ok) {
      throw new Error('Failed to get Bluesky session');
    }

    const sessionData = await sessionResponse.json();
    const did = sessionData.did;
    const handle = sessionData.handle;

    const content = post.contentText || 'CreatorFlow Post';
    const hasMedia = post.mediaUrls && post.mediaUrls.length > 0;

    // Prepare post data
    const postData: any = {
      repo: did,
      collection: 'app.bsky.feed.post',
      record: {
        text: content,
        createdAt: new Date().toISOString(),
      },
    };

    // Handle media if present
    if (hasMedia && post.mediaUrls) {
      const mediaEmbed: any = {
        $type: 'app.bsky.embed.images',
        images: [],
      };
      
      for (const mediaUrl of post.mediaUrls.slice(0, 4)) { // Bluesky allows up to 4 images
        try {
          // Fetch media from URL
          const mediaResponse = await fetch(mediaUrl);
          if (!mediaResponse.ok) {
            throw new Error(`Failed to fetch media: ${mediaResponse.statusText}`);
          }
          
          const mediaBuffer = await mediaResponse.arrayBuffer();
          const formData = new FormData();
          formData.append('input', new Blob([mediaBuffer]), 'media.jpg');
          
          // Upload media to Bluesky
          const uploadResponse = await fetch('https://bsky.social/xrpc/com.atproto.repo.uploadBlob', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
            body: formData,
          });
          
          if (!uploadResponse.ok) {
            throw new Error(`Failed to upload media: ${uploadResponse.statusText}`);
          }
          
          const uploadResult = await uploadResponse.json();
          mediaEmbed.images.push({
            alt: 'CreatorFlow media',
            image: uploadResult.blob,
          });
          
        } catch (mediaError) {
          // Continue with other media items
        }
      }
      
      if (mediaEmbed.images.length > 0) {
        postData.record.embed = mediaEmbed;
      }
    }

    // Post to Bluesky
    const response = await fetch('https://bsky.social/xrpc/com.atproto.repo.createRecord', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const errorData = await response.json() as BlueskyError;
      const errorMessage = errorData.error || errorData.message || 'Unknown Bluesky API error';
      throw new Error(`Failed to publish Bluesky post: ${errorMessage}`);
    }

    const result = await response.json();
    const platformPostId = result.uri;

    return {
      platform: 'bluesky',
      success: true,
      platformPostId: platformPostId,
    };

  } catch (error: unknown) {
    const blueskyError = error as BlueskyError;
    return {
      platform: 'bluesky',
      success: false,
      error: blueskyError.message || 'Unknown Bluesky API error',
    };
  }
}

/**
 * Alternative: Post with rich text formatting
 */
export async function publishToBlueskyWithFormatting(
  post: Post,
  account: SocialAccount,
  facets?: Array<{ index: { byteStart: number; byteEnd: number }; features: Array<any> }>
): Promise<PlatformResult> {
  const { accessToken, error: authError } = await getBlueskyApiClient(account);

  if (authError || !accessToken) {
    return { platform: 'bluesky', success: false, error: authError || 'Authentication failed' };
  }

  try {
    const sessionResponse = await fetch('https://bsky.social/xrpc/com.atproto.server.getSession', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!sessionResponse.ok) {
      throw new Error('Failed to get Bluesky session');
    }

    const sessionData = await sessionResponse.json();
    const did = sessionData.did;

    const content = post.contentText || 'CreatorFlow Post';

    const postData = {
      repo: did,
      collection: 'app.bsky.feed.post',
      record: {
        text: content,
        createdAt: new Date().toISOString(),
        facets: facets || [],
      },
    };

    const response = await fetch('https://bsky.social/xrpc/com.atproto.repo.createRecord', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const errorData = await response.json() as BlueskyError;
      const errorMessage = errorData.error || errorData.message || 'Unknown Bluesky API error';
      throw new Error(`Failed to publish Bluesky post: ${errorMessage}`);
    }

    const result = await response.json();
    const platformPostId = result.uri;

    return {
      platform: 'bluesky',
      success: true,
      platformPostId: platformPostId,
    };

  } catch (error: unknown) {
    const blueskyError = error as BlueskyError;
    return {
      platform: 'bluesky',
      success: false,
      error: blueskyError.message || 'Unknown Bluesky API error',
    };
  }
} 