import { PrismaClient, Post, SocialAccount } from '@prisma/client';
import { decrypt, encrypt } from '@/lib/crypto';
import { PlatformResult } from '../publishing';

const prisma = new PrismaClient();

type PublishResult = PlatformResult;

interface DribbbleError {
  error?: string;
  message?: string;
}

// Helper: Get Authenticated Dribbble Client
async function getDribbbleApiClient(account: SocialAccount): Promise<{ accessToken: string | null; error?: string }> {
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
 * Publishes content to Dribbble.
 * 
 * Dribbble API supports:
 * - Shot creation
 * - Project creation
 * - Media uploads
 * - Shot updates
 * 
 * @param post The post data from Prisma.
 * @param account The user's Dribbble social account data.
 * @param shotType Optional shot type (shot, project)
 * @returns A promise resolving to a PlatformResult object.
 */
export async function publishToDribbble(
  post: Post,
  account: SocialAccount,
  shotType: 'shot' | 'project' = 'shot'
): Promise<PlatformResult> {
  console.log(`[Dribbble Publisher] Publishing post ${post.id} for user ${account.userId} to account ${account.username}`);

  const { accessToken, error: authError } = await getDribbbleApiClient(account);

  if (authError || !accessToken) {
    console.error(`[Dribbble Publisher] Authentication failed for account ${account.id}: ${authError}`);
    return { platform: 'dribbble', success: false, error: authError || 'Authentication failed' };
  }

  try {
    const content = post.contentText || 'CreatorFlow Shot';
    const hasMedia = post.mediaUrls && post.mediaUrls.length > 0;

    if (!hasMedia || !post.mediaUrls || post.mediaUrls.length === 0) {
      return { platform: 'dribbble', success: false, error: 'Dribbble requires at least one image for a shot' };
    }

    // Get the first image URL (Dribbble typically handles one image per shot)
    const imageUrl = post.mediaUrls[0];
    
    console.log(`[Dribbble Publisher] Processing image: ${imageUrl}`);

    if (shotType === 'shot') {
      // Create a new shot
      const shotData = {
        title: content.substring(0, 100), // Dribbble title limit
        description: content,
        tags: [], // Could be extracted from post content
        image: imageUrl,
        published: true,
      };

      const response = await fetch('https://api.dribbble.com/v2/shots', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shotData),
      });

      if (!response.ok) {
        const errorData = await response.json() as DribbbleError;
        const errorMessage = errorData.error || errorData.message || 'Unknown Dribbble API error';
        throw new Error(`Failed to create Dribbble shot: ${errorMessage}`);
      }

      const result = await response.json();
      const platformPostId = result.id.toString();

      console.log(`[Dribbble Publisher] Successfully created shot. Shot ID: ${platformPostId}`);

      return {
        platform: 'dribbble',
        success: true,
        platformPostId: platformPostId,
      };

    } else {
      // Create a project (collection of shots)
      const projectData = {
        name: content.substring(0, 100),
        description: content,
        published: true,
      };

      const response = await fetch('https://api.dribbble.com/v2/projects', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorData = await response.json() as DribbbleError;
        const errorMessage = errorData.error || errorData.message || 'Unknown Dribbble API error';
        throw new Error(`Failed to create Dribbble project: ${errorMessage}`);
      }

      const result = await response.json();
      const platformPostId = result.id.toString();

      console.log(`[Dribbble Publisher] Successfully created project. Project ID: ${platformPostId}`);

      return {
        platform: 'dribbble',
        success: true,
        platformPostId: platformPostId,
      };
    }

  } catch (error: unknown) {
    const dribbbleError = error as DribbbleError;
    console.error(`[Dribbble Publisher] Failed to publish post ${post.id}:`, dribbbleError);
    return {
      platform: 'dribbble',
      success: false,
      error: dribbbleError.message || 'Unknown Dribbble API error',
    };
  }
}

/**
 * Alternative: Create shot with detailed metadata
 */
export async function publishToDribbbleWithMetadata(
  post: Post,
  account: SocialAccount,
  metadata: {
    title: string;
    description: string;
    tags: string[];
    team_id?: number;
    low_profile?: boolean;
  }
): Promise<PlatformResult> {
  console.log(`[Dribbble Publisher] Creating shot with detailed metadata`);

  const { accessToken, error: authError } = await getDribbbleApiClient(account);

  if (authError || !accessToken) {
    console.error(`[Dribbble Publisher] Authentication failed for account ${account.id}: ${authError}`);
    return { platform: 'dribbble', success: false, error: authError || 'Authentication failed' };
  }

  try {
    const hasMedia = post.mediaUrls && post.mediaUrls.length > 0;

    if (!hasMedia || !post.mediaUrls || post.mediaUrls.length === 0) {
      return { platform: 'dribbble', success: false, error: 'Dribbble requires at least one image for a shot' };
    }

    const imageUrl = post.mediaUrls[0];

    const shotData = {
      title: metadata.title.substring(0, 100),
      description: metadata.description,
      tags: metadata.tags,
      image: imageUrl,
      published: true,
      team_id: metadata.team_id,
      low_profile: metadata.low_profile || false,
    };

    const response = await fetch('https://api.dribbble.com/v2/shots', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(shotData),
    });

    if (!response.ok) {
      const errorData = await response.json() as DribbbleError;
      const errorMessage = errorData.error || errorData.message || 'Unknown Dribbble API error';
      throw new Error(`Failed to create Dribbble shot: ${errorMessage}`);
    }

    const result = await response.json();
    const platformPostId = result.id.toString();

    console.log(`[Dribbble Publisher] Successfully created shot with metadata. Shot ID: ${platformPostId}`);

    return {
      platform: 'dribbble',
      success: true,
      platformPostId: platformPostId,
    };

  } catch (error: unknown) {
    const dribbbleError = error as DribbbleError;
    console.error(`[Dribbble Publisher] Failed to create shot with metadata:`, dribbbleError);
    return {
      platform: 'dribbble',
      success: false,
      error: dribbbleError.message || 'Unknown Dribbble API error',
    };
  }
} 