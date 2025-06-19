import { PrismaClient, Post, SocialAccount } from '@prisma/client';
import { decrypt, encrypt } from '@/lib/crypto';
import { PlatformResult } from '../publishing';

const prisma = new PrismaClient();

type PublishResult = PlatformResult;

interface YouTubeError extends Error {
  code?: number;
  errors?: Array<{
    domain: string;
    reason: string;
    message: string;
  }>;
}

// Helper: Get Authenticated YouTube Client
async function getYouTubeApiClient(account: SocialAccount): Promise<{ accessToken: string | null; error?: string }> {
  if (!account.encryptedAccessToken) {
    return { accessToken: null, error: 'Missing encrypted access token' };
  }

  // Decrypt token
  const accessToken = decrypt(account.encryptedAccessToken);
  if (!accessToken) {
    return { accessToken: null, error: 'Failed to decrypt access token' };
  }

  // Check if token is expired (Google tokens typically last 1 hour)
  const isExpired = account.tokenExpiresAt ? new Date(account.tokenExpiresAt) < new Date() : false;
  
  if (isExpired) {
    console.log(`[YouTube Publisher] Token for account ${account.id} expired. Attempting refresh...`);
    
    if (!account.encryptedRefreshToken) {
      try {
        await prisma.socialAccount.update({
          where: { id: account.id },
          data: { status: 'needs_reauth' }
        });
      } catch (dbError) {
        console.error('Failed to update account status:', dbError);
      }
      return { accessToken: null, error: 'Token expired and no refresh token available' };
    }

    // Attempt to refresh the token
    const refreshToken = decrypt(account.encryptedRefreshToken);
    if (!refreshToken) {
      return { accessToken: null, error: 'Failed to decrypt refresh token' };
    }

    try {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        throw new Error('Missing Google OAuth credentials');
      }

      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: clientId,
          client_secret: clientSecret,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const refreshData = await response.json();
      const newAccessToken = refreshData.access_token;
      const newRefreshToken = refreshData.refresh_token || refreshToken;
      const expiresIn = refreshData.expires_in || 3600;

      // Encrypt and store new tokens
      const encryptedNewAccess = encrypt(newAccessToken);
      const encryptedNewRefresh = encrypt(newRefreshToken);

      if (encryptedNewAccess && encryptedNewRefresh) {
        await prisma.socialAccount.update({
          where: { id: account.id },
          data: {
            encryptedAccessToken: encryptedNewAccess,
            encryptedRefreshToken: encryptedNewRefresh,
            tokenExpiresAt: new Date(Date.now() + (expiresIn * 1000)),
            status: 'active',
          },
        });
        console.log(`[YouTube Publisher] Token refreshed for account ${account.id}`);
        return { accessToken: newAccessToken };
      } else {
        throw new Error('Failed to encrypt refreshed tokens');
      }
    } catch (refreshError) {
      console.error('[YouTube Publisher] Token refresh failed:', refreshError);
      try {
        await prisma.socialAccount.update({
          where: { id: account.id },
          data: { status: 'needs_reauth' }
        });
      } catch (dbError) {
        console.error('Failed to update account status:', dbError);
      }
      return { accessToken: null, error: 'Failed to refresh token' };
    }
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
    case 'webm':
      return 'video/webm';
    default:
      return 'video/mp4'; // Default fallback
  }
}

/**
 * Publishes a post to YouTube.
 * 
 * YouTube Data API v3 supports video uploads with the following flow:
 * 1. Upload video file
 * 2. Set video metadata (title, description, etc.)
 * 
 * @param post The post data from Prisma.
 * @param account The user's YouTube social account data.
 * @returns A promise resolving to a PublishResult object.
 */
export async function publishToYouTube(
  post: Post,
  account: SocialAccount
): Promise<PublishResult> {
  console.log(`[YouTube Publisher] Publishing post ${post.id} for user ${account.userId} to account ${account.username}`);

  const { accessToken, error: authError } = await getYouTubeApiClient(account);

  if (authError || !accessToken) {
    console.error(`[YouTube Publisher] Authentication failed for account ${account.id}: ${authError}`);
    return { platform: 'youtube', success: false, error: authError || 'Authentication failed' };
  }

  try {
    // YouTube requires video content for posting
    if (!post.mediaUrls || post.mediaUrls.length === 0) {
      return { platform: 'youtube', success: false, error: 'YouTube requires video content for posting' };
    }

    const videoUrl = post.mediaUrls[0]; // YouTube typically supports one video per post
    console.log(`[YouTube Publisher] Processing video: ${videoUrl}`);

    // 1. Fetch video from source
    console.log('[YouTube Publisher] Fetching video from source...');
    const videoResponse = await fetch(videoUrl);
    if (!videoResponse.ok) {
      throw new Error(`Failed to fetch video from ${videoUrl}`);
    }

    const videoBuffer = Buffer.from(await videoResponse.arrayBuffer());
    const mimeType = getMimeType(videoUrl);

    console.log(`[YouTube Publisher] Video size: ${videoBuffer.length} bytes, type: ${mimeType}`);

    // 2. Upload video to YouTube
    console.log('[YouTube Publisher] Uploading video to YouTube...');
    
    // Create multipart form data for upload
    const boundary = '----WebKitFormBoundary' + Math.random().toString(16).substr(2);
    const formData = Buffer.concat([
      Buffer.from(`--${boundary}\r\n`),
      Buffer.from('Content-Disposition: form-data; name="metadata"\r\n'),
      Buffer.from('Content-Type: application/json; charset=UTF-8\r\n\r\n'),
      Buffer.from(JSON.stringify({
        snippet: {
          title: post.contentText || 'CreatorFlow Video',
          description: post.contentText || 'Uploaded via CreatorFlow',
          tags: ['CreatorFlow'],
          categoryId: '22', // People & Blogs
        },
        status: {
          privacyStatus: 'private', // or 'public', 'unlisted'
          selfDeclaredMadeForKids: false,
        },
      })),
      Buffer.from(`\r\n--${boundary}\r\n`),
      Buffer.from('Content-Disposition: form-data; name="file"; filename="video.mp4"\r\n'),
      Buffer.from(`Content-Type: ${mimeType}\r\n\r\n`),
      videoBuffer,
      Buffer.from(`\r\n--${boundary}--\r\n`),
    ]);

    const uploadResponse = await fetch('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': formData.length.toString(),
      },
      body: formData,
    });

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      throw new Error(`Failed to upload video: ${errorData.error?.message || 'Unknown error'}`);
    }

    const uploadData = await uploadResponse.json();
    const platformPostId = uploadData.id;

    console.log(`[YouTube Publisher] Successfully published post ${post.id}. Platform ID: ${platformPostId}`);

    return {
      platform: 'youtube',
      success: true,
      platformPostId: platformPostId,
    };

  } catch (error: unknown) {
    const youtubeError = error as YouTubeError;
    console.error(`[YouTube Publisher] Failed to publish post ${post.id}:`, youtubeError);
    return {
      platform: 'youtube',
      success: false,
      error: youtubeError.message || 'Unknown YouTube API error',
    };
  }
} 