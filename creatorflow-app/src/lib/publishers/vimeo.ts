import { PrismaClient, Post, SocialAccount } from '@prisma/client';
import { decrypt, encrypt } from '@/lib/crypto';
import { PlatformResult } from '../publishing';

const prisma = new PrismaClient();

type PublishResult = PlatformResult;

interface VimeoError {
  error?: string;
  message?: string;
}

// Helper: Get Authenticated Vimeo Client
async function getVimeoApiClient(account: SocialAccount): Promise<{ accessToken: string | null; error?: string }> {
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
 * Publishes content to Vimeo.
 * 
 * Vimeo API supports:
 * - Video uploads
 * - Video metadata updates
 * - Privacy settings
 * - Thumbnail uploads
 * 
 * @param post The post data from Prisma.
 * @param account The user's Vimeo social account data.
 * @param privacy Optional privacy setting (anybody, contacts, disable, nobody, password, unlisted, users)
 * @returns A promise resolving to a PlatformResult object.
 */
export async function publishToVimeo(
  post: Post,
  account: SocialAccount,
  privacy: 'anybody' | 'contacts' | 'disable' | 'nobody' | 'password' | 'unlisted' | 'users' = 'anybody'
): Promise<PlatformResult> {
  console.log(`[Vimeo Publisher] Publishing post ${post.id} for user ${account.userId} to account ${account.username}`);

  const { accessToken, error: authError } = await getVimeoApiClient(account);

  if (authError || !accessToken) {
    console.error(`[Vimeo Publisher] Authentication failed for account ${account.id}: ${authError}`);
    return { platform: 'vimeo', success: false, error: authError || 'Authentication failed' };
  }

  try {
    const content = post.contentText || 'CreatorFlow Video';
    const hasMedia = post.mediaUrls && post.mediaUrls.length > 0;

    if (!hasMedia || !post.mediaUrls || post.mediaUrls.length === 0) {
      return { platform: 'vimeo', success: false, error: 'Vimeo requires video content for posting' };
    }

    // Get the first video URL (Vimeo typically handles one video at a time)
    const videoUrl = post.mediaUrls[0];
    
    console.log(`[Vimeo Publisher] Processing video: ${videoUrl}`);

    // Step 1: Create upload
    const createUploadResponse = await fetch('https://api.vimeo.com/me/videos', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        upload: {
          approach: 'pull',
          link: videoUrl,
        },
        name: content.substring(0, 128), // Vimeo title limit
        description: content,
        privacy: {
          view: privacy,
        },
      }),
    });

    if (!createUploadResponse.ok) {
      const errorData = await createUploadResponse.json() as VimeoError;
      const errorMessage = errorData.error || errorData.message || 'Unknown Vimeo API error';
      throw new Error(`Failed to create Vimeo upload: ${errorMessage}`);
    }

    const uploadData = await createUploadResponse.json();
    const videoId = uploadData.uri.split('/').pop();
    const platformPostId = videoId;

    console.log(`[Vimeo Publisher] Video upload created. Video ID: ${videoId}`);

    // Step 2: Check upload status (optional - for pull uploads, this might be immediate)
    // For pull uploads, the video is typically available immediately
    // For other upload methods, you might need to poll the status

    console.log(`[Vimeo Publisher] Successfully published post ${post.id}. Platform ID: ${platformPostId}`);

    return {
      platform: 'vimeo',
      success: true,
      platformPostId: platformPostId,
    };

  } catch (error: unknown) {
    const vimeoError = error as VimeoError;
    console.error(`[Vimeo Publisher] Failed to publish post ${post.id}:`, vimeoError);
    return {
      platform: 'vimeo',
      success: false,
      error: vimeoError.message || 'Unknown Vimeo API error',
    };
  }
}

/**
 * Alternative: Upload video with custom settings
 */
export async function publishToVimeoWithSettings(
  post: Post,
  account: SocialAccount,
  settings: {
    privacy?: 'anybody' | 'contacts' | 'disable' | 'nobody' | 'password' | 'unlisted' | 'users';
    password?: string;
    embed?: 'public' | 'whitelist';
    download?: boolean;
    add?: boolean;
    comments?: 'anybody' | 'contacts' | 'nobody';
  } = {}
): Promise<PlatformResult> {
  console.log(`[Vimeo Publisher] Publishing video with custom settings`);

  const { accessToken, error: authError } = await getVimeoApiClient(account);

  if (authError || !accessToken) {
    console.error(`[Vimeo Publisher] Authentication failed for account ${account.id}: ${authError}`);
    return { platform: 'vimeo', success: false, error: authError || 'Authentication failed' };
  }

  try {
    const content = post.contentText || 'CreatorFlow Video';
    const hasMedia = post.mediaUrls && post.mediaUrls.length > 0;

    if (!hasMedia || !post.mediaUrls || post.mediaUrls.length === 0) {
      return { platform: 'vimeo', success: false, error: 'Vimeo requires video content for posting' };
    }

    const videoUrl = post.mediaUrls[0];
    
    // Prepare video data with custom settings
    const videoData: any = {
      upload: {
        approach: 'pull',
        link: videoUrl,
      },
      name: content.substring(0, 128),
      description: content,
      privacy: {
        view: settings.privacy || 'anybody',
        embed: settings.embed || 'public',
        download: settings.download !== false,
        add: settings.add !== false,
        comments: settings.comments || 'anybody',
      },
    };

    // Add password if specified
    if (settings.password) {
      videoData.privacy.view = 'password';
      videoData.password = settings.password;
    }

    const response = await fetch('https://api.vimeo.com/me/videos', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(videoData),
    });

    if (!response.ok) {
      const errorData = await response.json() as VimeoError;
      const errorMessage = errorData.error || errorData.message || 'Unknown Vimeo API error';
      throw new Error(`Failed to create Vimeo upload: ${errorMessage}`);
    }

    const result = await response.json();
    const videoId = result.uri.split('/').pop();

    console.log(`[Vimeo Publisher] Successfully published video with custom settings. Video ID: ${videoId}`);

    return {
      platform: 'vimeo',
      success: true,
      platformPostId: videoId,
    };

  } catch (error: unknown) {
    const vimeoError = error as VimeoError;
    console.error(`[Vimeo Publisher] Failed to publish video with custom settings:`, vimeoError);
    return {
      platform: 'vimeo',
      success: false,
      error: vimeoError.message || 'Unknown Vimeo API error',
    };
  }
} 