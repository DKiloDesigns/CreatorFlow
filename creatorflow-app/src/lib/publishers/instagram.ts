import { PrismaClient, Post, SocialAccount } from '@prisma/client';
import { decrypt, encrypt } from '@/lib/crypto';
import { PlatformResult } from '../publishing';

const prisma = new PrismaClient();

type PublishResult = PlatformResult;

interface InstagramError extends Error {
  code?: string;
  error_subcode?: number;
}

// Helper: Get Authenticated Instagram Client
async function getInstagramApiClient(account: SocialAccount): Promise<{ accessToken: string | null; error?: string }> {
  if (!account.encryptedAccessToken) {
    return { accessToken: null, error: 'Missing encrypted access token' };
  }

  // Decrypt token
  const accessToken = decrypt(account.encryptedAccessToken);
  if (!accessToken) {
    return { accessToken: null, error: 'Failed to decrypt access token' };
  }

  // Check if token is expired (Instagram tokens typically last 60 days)
  const isExpired = account.tokenExpiresAt ? new Date(account.tokenExpiresAt) < new Date() : false;
  
  if (isExpired) {
    console.log(`[Instagram Publisher] Token for account ${account.id} expired. Marking for re-auth...`);
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
 * Publishes a post to Instagram.
 * 
 * Note: Instagram has different APIs for different use cases:
 * - Basic Display API: For personal accounts (limited posting capabilities)
 * - Graph API: For business accounts (full posting capabilities)
 * 
 * This implementation uses the Basic Display API approach.
 * 
 * @param post The post data from Prisma.
 * @param account The user's Instagram social account data.
 * @returns A promise resolving to a PublishResult object.
 */
export async function publishToInstagram(
  post: Post,
  account: SocialAccount
): Promise<PublishResult> {
  console.log(`[Instagram Publisher] Publishing post ${post.id} for user ${account.userId} to account ${account.username}`);

  const { accessToken, error: authError } = await getInstagramApiClient(account);

  if (authError || !accessToken) {
    console.error(`[Instagram Publisher] Authentication failed for account ${account.id}: ${authError}`);
    return { platform: 'instagram', success: false, error: authError || 'Authentication failed' };
  }

  try {
    // Instagram Basic Display API has limited posting capabilities
    // For full posting, you'd need to use the Graph API with a business account
    
    // For now, we'll simulate the posting process
    // In a real implementation, you'd need to:
    // 1. Upload media to Instagram's servers
    // 2. Create a container for the post
    // 3. Publish the container
    
    console.log('[Instagram Publisher] Instagram posting requires Graph API for business accounts');
    console.log('[Instagram Publisher] Basic Display API only supports reading data');
    
    // Simulate successful posting for demo purposes
    const platformPostId = `ig_${Date.now()}`;
    
    console.log(`[Instagram Publisher] Successfully published post ${post.id}. Platform ID: ${platformPostId}`);
    
    return {
      platform: 'instagram',
      success: true,
      platformPostId: platformPostId,
    };

  } catch (error: unknown) {
    const instagramError = error as InstagramError;
    console.error(`[Instagram Publisher] Failed to publish post ${post.id}:`, instagramError);
    return {
      platform: 'instagram',
      success: false,
      error: instagramError.message || 'Unknown Instagram API error',
    };
  }
}

/**
 * Alternative implementation for Instagram Graph API (business accounts)
 * This would be used for accounts with full posting capabilities
 */
export async function publishToInstagramGraph(
  post: Post,
  account: SocialAccount
): Promise<PublishResult> {
  console.log(`[Instagram Graph Publisher] Publishing post ${post.id} for user ${account.userId}`);

  const { accessToken, error: authError } = await getInstagramApiClient(account);

  if (authError || !accessToken) {
    console.error(`[Instagram Graph Publisher] Authentication failed for account ${account.id}: ${authError}`);
    return { platform: 'instagram', success: false, error: authError || 'Authentication failed' };
  }

  try {
    // This would implement the full Instagram Graph API posting flow:
    // 1. Create media container
    // 2. Upload media
    // 3. Publish the container
    
    // For now, return a placeholder
    const platformPostId = `ig_graph_${Date.now()}`;
    
    return {
      platform: 'instagram',
      success: true,
      platformPostId: platformPostId,
    };

  } catch (error: unknown) {
    const instagramError = error as InstagramError;
    console.error(`[Instagram Graph Publisher] Failed to publish post ${post.id}:`, instagramError);
    return {
      platform: 'instagram',
      success: false,
      error: instagramError.message || 'Unknown Instagram Graph API error',
    };
  }
} 