import { PrismaClient, Post, SocialAccount } from '@prisma/client';
import { decrypt, encrypt } from '@/lib/crypto';
import { PlatformResult } from '../publishing';

const prisma = new PrismaClient();

type PublishResult = PlatformResult;

interface PinterestError extends Error {
  code?: number;
  message?: string;
}

// Helper: Get Authenticated Pinterest Client
async function getPinterestApiClient(account: SocialAccount): Promise<{ accessToken: string | null; error?: string }> {
  if (!account.encryptedAccessToken) {
    return { accessToken: null, error: 'Missing encrypted access token' };
  }

  // Decrypt token
  const accessToken = decrypt(account.encryptedAccessToken);
  if (!accessToken) {
    return { accessToken: null, error: 'Failed to decrypt access token' };
  }

  // Check if token is expired (Pinterest tokens typically last 30 days)
  const isExpired = account.tokenExpiresAt ? new Date(account.tokenExpiresAt) < new Date() : false;
  
  if (isExpired) {
    console.log(`[Pinterest Publisher] Token for account ${account.id} expired. Marking for re-auth...`);
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
    case 'webp':
      return 'image/webp';
    default:
      return 'image/jpeg'; // Default fallback
  }
}

/**
 * Publishes a pin to Pinterest.
 * 
 * Pinterest API v5 supports:
 * - Creating pins with images
 * - Adding descriptions and links
 * - Pinning to specific boards
 * 
 * @param post The post data from Prisma.
 * @param account The user's Pinterest social account data.
 * @returns A promise resolving to a PublishResult object.
 */
export async function publishToPinterest(
  post: Post,
  account: SocialAccount
): Promise<PublishResult> {
  console.log(`[Pinterest Publisher] Publishing post ${post.id} for user ${account.userId} to account ${account.username}`);

  const { accessToken, error: authError } = await getPinterestApiClient(account);

  if (authError || !accessToken) {
    console.error(`[Pinterest Publisher] Authentication failed for account ${account.id}: ${authError}`);
    return { platform: 'pinterest', success: false, error: authError || 'Authentication failed' };
  }

  try {
    // Pinterest requires at least one image for a pin
    if (!post.mediaUrls || post.mediaUrls.length === 0) {
      return { platform: 'pinterest', success: false, error: 'Pinterest requires at least one image for a pin' };
    }

    const imageUrl = post.mediaUrls[0]; // Pinterest typically uses one image per pin
    console.log(`[Pinterest Publisher] Processing image: ${imageUrl}`);

    // 1. Get user's boards (we'll use the first available board)
    console.log('[Pinterest Publisher] Fetching user boards...');
    const boardsResponse = await fetch('https://api.pinterest.com/v5/user_account/boards', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!boardsResponse.ok) {
      const errorData = await boardsResponse.json();
      throw new Error(`Failed to fetch boards: ${errorData.message || 'Unknown error'}`);
    }

    const boardsData = await boardsResponse.json();
    if (!boardsData.items || boardsData.items.length === 0) {
      throw new Error('No boards found. Please create a board first.');
    }

    const boardId = boardsData.items[0].id; // Use the first board
    console.log(`[Pinterest Publisher] Using board: ${boardId}`);

    // 2. Create the pin
    console.log('[Pinterest Publisher] Creating pin...');
    const pinData = {
      board_id: boardId,
      title: post.contentText?.substring(0, 100) || 'CreatorFlow Pin', // Pinterest title limit
      description: post.contentText || '',
      link: '', // Optional link
      media_source: {
        source_type: 'image_url',
        url: imageUrl,
      },
    };

    const pinResponse = await fetch('https://api.pinterest.com/v5/pins', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pinData),
    });

    if (!pinResponse.ok) {
      const errorData = await pinResponse.json();
      throw new Error(`Failed to create pin: ${errorData.message || 'Unknown error'}`);
    }

    const pinResult = await pinResponse.json();
    const platformPostId = pinResult.id;

    console.log(`[Pinterest Publisher] Successfully published pin ${post.id}. Platform ID: ${platformPostId}`);

    return {
      platform: 'pinterest',
      success: true,
      platformPostId: platformPostId,
    };

  } catch (error: unknown) {
    const pinterestError = error as PinterestError;
    console.error(`[Pinterest Publisher] Failed to publish post ${post.id}:`, pinterestError);
    return {
      platform: 'pinterest',
      success: false,
      error: pinterestError.message || 'Unknown Pinterest API error',
    };
  }
}

/**
 * Alternative implementation for creating pins with local image upload
 * This would be used when you want to upload images directly to Pinterest
 */
export async function publishToPinterestWithUpload(
  post: Post,
  account: SocialAccount
): Promise<PublishResult> {
  console.log(`[Pinterest Upload Publisher] Publishing post ${post.id} with image upload`);

  const { accessToken, error: authError } = await getPinterestApiClient(account);

  if (authError || !accessToken) {
    console.error(`[Pinterest Upload Publisher] Authentication failed for account ${account.id}: ${authError}`);
    return { platform: 'pinterest', success: false, error: authError || 'Authentication failed' };
  }

  try {
    if (!post.mediaUrls || post.mediaUrls.length === 0) {
      return { platform: 'pinterest', success: false, error: 'Pinterest requires at least one image for a pin' };
    }

    const imageUrl = post.mediaUrls[0];
    console.log(`[Pinterest Upload Publisher] Processing image: ${imageUrl}`);

    // 1. Fetch image from source
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image from ${imageUrl}`);
    }

    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
    const mimeType = getMimeType(imageUrl);

    // 2. Get user's boards
    const boardsResponse = await fetch('https://api.pinterest.com/v5/user_account/boards', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!boardsResponse.ok) {
      const errorData = await boardsResponse.json();
      throw new Error(`Failed to fetch boards: ${errorData.message || 'Unknown error'}`);
    }

    const boardsData = await boardsResponse.json();
    if (!boardsData.items || boardsData.items.length === 0) {
      throw new Error('No boards found. Please create a board first.');
    }

    const boardId = boardsData.items[0].id;

    // 3. Create pin with uploaded image
    const formData = new FormData();
    formData.append('board_id', boardId);
    formData.append('title', post.contentText?.substring(0, 100) || 'CreatorFlow Pin');
    formData.append('description', post.contentText || '');
    formData.append('image', new Blob([imageBuffer], { type: mimeType }), 'image.jpg');

    const pinResponse = await fetch('https://api.pinterest.com/v5/pins', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!pinResponse.ok) {
      const errorData = await pinResponse.json();
      throw new Error(`Failed to create pin: ${errorData.message || 'Unknown error'}`);
    }

    const pinResult = await pinResponse.json();
    const platformPostId = pinResult.id;

    console.log(`[Pinterest Upload Publisher] Successfully published pin ${post.id}. Platform ID: ${platformPostId}`);

    return {
      platform: 'pinterest',
      success: true,
      platformPostId: platformPostId,
    };

  } catch (error: unknown) {
    const pinterestError = error as PinterestError;
    console.error(`[Pinterest Upload Publisher] Failed to publish post ${post.id}:`, pinterestError);
    return {
      platform: 'pinterest',
      success: false,
      error: pinterestError.message || 'Unknown Pinterest API error',
    };
  }
} 