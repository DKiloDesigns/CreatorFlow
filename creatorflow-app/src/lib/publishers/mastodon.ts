import { PrismaClient, Post, SocialAccount } from '@prisma/client';
import { decrypt, encrypt } from '@/lib/crypto';
import { PlatformResult } from '../publishing';

const prisma = new PrismaClient();

type PublishResult = PlatformResult;

interface MastodonError {
  error?: string;
  message?: string;
}

// Helper: Get Authenticated Mastodon Client
async function getMastodonApiClient(account: SocialAccount): Promise<{ accessToken: string | null; error?: string }> {
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
 * Publishes a post to Mastodon.
 * 
 * Mastodon API supports:
 * - Text posts (toots)
 * - Media attachments
 * - Visibility settings
 * - Content warnings
 * - Polls
 * 
 * @param post The post data from Prisma.
 * @param account The user's Mastodon social account data.
 * @param visibility Optional visibility setting (public, unlisted, private, direct)
 * @returns A promise resolving to a PlatformResult object.
 */
export async function publishToMastodon(
  post: Post,
  account: SocialAccount,
  visibility: 'public' | 'unlisted' | 'private' | 'direct' = 'public'
): Promise<PlatformResult> {
  const { accessToken, error: authError } = await getMastodonApiClient(account);

  if (authError || !accessToken) {
    return { platform: 'mastodon', success: false, error: authError || 'Authentication failed' };
  }

  try {
    const mastodonInstance = process.env.MASTODON_INSTANCE || 'mastodon.social';
    const content = post.contentText || 'CreatorFlow Post';
    const hasMedia = post.mediaUrls && post.mediaUrls.length > 0;

    // Prepare post data
    const postData: any = {
      status: content,
      visibility: visibility,
    };

    // Handle media if present
    if (hasMedia && post.mediaUrls) {
      const mediaIds: string[] = [];
      
      for (const mediaUrl of post.mediaUrls.slice(0, 4)) { // Mastodon allows up to 4 media attachments
        try {
          // Fetch media from URL
          const mediaResponse = await fetch(mediaUrl);
          if (!mediaResponse.ok) {
            throw new Error(`Failed to fetch media: ${mediaResponse.statusText}`);
          }
          
          const mediaBuffer = await mediaResponse.arrayBuffer();
          const formData = new FormData();
          formData.append('file', new Blob([mediaBuffer]), 'media.jpg');
          
          // Upload media to Mastodon
          const uploadResponse = await fetch(`https://${mastodonInstance}/api/v1/media`, {
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
          mediaIds.push(uploadResult.id);
          
        } catch (mediaError) {
          // Continue with other media items
        }
      }
      
      if (mediaIds.length > 0) {
        postData.media_ids = mediaIds;
      }
    }

    // Post to Mastodon
    const response = await fetch(`https://${mastodonInstance}/api/v1/statuses`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const errorData = await response.json() as MastodonError;
      const errorMessage = errorData.error || errorData.message || 'Unknown Mastodon API error';
      throw new Error(`Failed to publish Mastodon post: ${errorMessage}`);
    }

    const result = await response.json();
    const platformPostId = result.id;

    return {
      platform: 'mastodon',
      success: true,
      platformPostId: platformPostId,
    };

  } catch (error: unknown) {
    const mastodonError = error as MastodonError;
    return {
      platform: 'mastodon',
      success: false,
      error: mastodonError.message || 'Unknown Mastodon API error',
    };
  }
}

/**
 * Alternative: Post with content warning
 */
export async function publishToMastodonWithWarning(
  post: Post,
  account: SocialAccount,
  contentWarning: string,
  visibility: 'public' | 'unlisted' | 'private' | 'direct' = 'public'
): Promise<PlatformResult> {
  const { accessToken, error: authError } = await getMastodonApiClient(account);

  if (authError || !accessToken) {
    return { platform: 'mastodon', success: false, error: authError || 'Authentication failed' };
  }

  try {
    const mastodonInstance = process.env.MASTODON_INSTANCE || 'mastodon.social';
    const content = post.contentText || 'CreatorFlow Post';

    const postData = {
      status: content,
      visibility: visibility,
      spoiler_text: contentWarning,
    };

    const response = await fetch(`https://${mastodonInstance}/api/v1/statuses`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const errorData = await response.json() as MastodonError;
      const errorMessage = errorData.error || errorData.message || 'Unknown Mastodon API error';
      throw new Error(`Failed to publish Mastodon post: ${errorMessage}`);
    }

    const result = await response.json();
    const platformPostId = result.id;

    return {
      platform: 'mastodon',
      success: true,
      platformPostId: platformPostId,
    };

  } catch (error: unknown) {
    const mastodonError = error as MastodonError;
    return {
      platform: 'mastodon',
      success: false,
      error: mastodonError.message || 'Unknown Mastodon API error',
    };
  }
} 