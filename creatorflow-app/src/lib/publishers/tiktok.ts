import { PrismaClient, Post, SocialAccount } from '@prisma/client';
import { decrypt, encrypt } from '@/lib/crypto';
import { PlatformResult } from '../publishing';

const prisma = new PrismaClient();

type PublishResult = PlatformResult;

interface TikTokError extends Error {
  code?: string;
  log_id?: string;
}

// Helper: Get Authenticated TikTok Client
async function getTikTokApiClient(account: SocialAccount): Promise<{ accessToken: string | null; error?: string }> {
  if (!account.encryptedAccessToken) {
    return { accessToken: null, error: 'Missing encrypted access token' };
  }

  // Decrypt token
  const accessToken = decrypt(account.encryptedAccessToken);
  if (!accessToken) {
    return { accessToken: null, error: 'Failed to decrypt access token' };
  }

  // Check if token is expired (TikTok tokens typically last 24 hours)
  const isExpired = account.tokenExpiresAt ? new Date(account.tokenExpiresAt) < new Date() : false;
  
  if (isExpired) {
    console.log(`[TikTok Publisher] Token for account ${account.id} expired. Marking for re-auth...`);
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
    case 'mp4':
      return 'video/mp4';
    case 'mov':
      return 'video/quicktime';
    case 'avi':
      return 'video/x-msvideo';
    default:
      return 'video/mp4'; // Default fallback
  }
}

/**
 * Publishes a post to TikTok.
 * 
 * TikTok API v2 supports video posting with the following flow:
 * 1. Initialize upload
 * 2. Upload video in chunks
 * 3. Create post with video
 * 
 * @param post The post data from Prisma.
 * @param account The user's TikTok social account data.
 * @returns A promise resolving to a PublishResult object.
 */
export async function publishToTikTok(
  post: Post,
  account: SocialAccount
): Promise<PublishResult> {
  console.log(`[TikTok Publisher] Publishing post ${post.id} for user ${account.userId} to account ${account.username}`);

  const { accessToken, error: authError } = await getTikTokApiClient(account);

  if (authError || !accessToken) {
    console.error(`[TikTok Publisher] Authentication failed for account ${account.id}: ${authError}`);
    return { platform: 'tiktok', success: false, error: authError || 'Authentication failed' };
  }

  try {
    // TikTok requires video content for posting
    if (!post.mediaUrls || post.mediaUrls.length === 0) {
      return { platform: 'tiktok', success: false, error: 'TikTok requires video content for posting' };
    }

    const videoUrl = post.mediaUrls[0]; // TikTok typically supports one video per post
    console.log(`[TikTok Publisher] Processing video: ${videoUrl}`);

    // 1. Initialize upload
    console.log('[TikTok Publisher] Initializing video upload...');
    const initResponse = await fetch('https://open.tiktokapis.com/v2/post/publish/video/init/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        post_info: {
          title: post.contentText || 'CreatorFlow Post',
          privacy_level: 'SELF_ONLY', // or 'MUTUAL_FOLLOW_FRIENDS', 'PUBLIC'
          disable_duet: false,
          disable_comment: false,
          disable_stitch: false,
          video_cover_timestamp_ms: 0,
        },
        source_info: {
          source: 'FILE_UPLOAD',
          video_size: 0, // Will be set after fetching video
          chunk_size: 0, // Will be set after fetching video
          total_chunk_count: 0, // Will be set after fetching video
        },
      }),
    });

    if (!initResponse.ok) {
      const errorData = await initResponse.json();
      throw new Error(`Failed to initialize upload: ${errorData.error?.message || 'Unknown error'}`);
    }

    const initData = await initResponse.json();
    const uploadUrl = initData.data.upload_url;
    const publishId = initData.data.publish_id;

    console.log(`[TikTok Publisher] Upload initialized. Publish ID: ${publishId}`);

    // 2. Fetch and upload video
    console.log('[TikTok Publisher] Fetching video from source...');
    const videoResponse = await fetch(videoUrl);
    if (!videoResponse.ok) {
      throw new Error(`Failed to fetch video from ${videoUrl}`);
    }

    const videoBuffer = Buffer.from(await videoResponse.arrayBuffer());
    const videoSize = videoBuffer.length;
    const chunkSize = 5 * 1024 * 1024; // 5MB chunks
    const totalChunks = Math.ceil(videoSize / chunkSize);

    console.log(`[TikTok Publisher] Video size: ${videoSize} bytes, chunks: ${totalChunks}`);

    // Upload video in chunks
    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, videoSize);
      const chunk = videoBuffer.slice(start, end);

      console.log(`[TikTok Publisher] Uploading chunk ${i + 1}/${totalChunks}...`);

      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Range': `bytes ${start}-${end - 1}/${videoSize}`,
        },
        body: chunk,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Failed to upload chunk ${i + 1}: ${uploadResponse.statusText}`);
      }
    }

    console.log('[TikTok Publisher] Video upload completed');

    // 3. Create post
    console.log('[TikTok Publisher] Creating post...');
    const createResponse = await fetch('https://open.tiktokapis.com/v2/post/publish/video/create/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        publish_id: publishId,
        post_info: {
          title: post.contentText || 'CreatorFlow Post',
          privacy_level: 'SELF_ONLY',
          disable_duet: false,
          disable_comment: false,
          disable_stitch: false,
          video_cover_timestamp_ms: 0,
        },
      }),
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.json();
      throw new Error(`Failed to create post: ${errorData.error?.message || 'Unknown error'}`);
    }

    const createData = await createResponse.json();
    const platformPostId = createData.data.share_id;

    console.log(`[TikTok Publisher] Successfully published post ${post.id}. Platform ID: ${platformPostId}`);

    return {
      platform: 'tiktok',
      success: true,
      platformPostId: platformPostId,
    };

  } catch (error: unknown) {
    const tiktokError = error as TikTokError;
    console.error(`[TikTok Publisher] Failed to publish post ${post.id}:`, tiktokError);
    return {
      platform: 'tiktok',
      success: false,
      error: tiktokError.message || 'Unknown TikTok API error',
    };
  }
} 