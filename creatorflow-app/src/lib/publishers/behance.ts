import { PrismaClient, Post, SocialAccount } from '@prisma/client';
import { decrypt, encrypt } from '@/lib/crypto';
import { PlatformResult } from '../publishing';

const prisma = new PrismaClient();

type PublishResult = PlatformResult;

interface BehanceError {
  error?: string;
  message?: string;
}

// Helper: Get Authenticated Behance Client
async function getBehanceApiClient(account: SocialAccount): Promise<{ accessToken: string | null; error?: string }> {
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
 * Publishes content to Behance.
 * 
 * Behance API supports:
 * - Project creation
 * - Collection creation
 * - Media uploads
 * - Project updates
 * 
 * @param post The post data from Prisma.
 * @param account The user's Behance social account data.
 * @param projectType Optional project type (project, collection)
 * @returns A promise resolving to a PlatformResult object.
 */
export async function publishToBehance(
  post: Post,
  account: SocialAccount,
  projectType: 'project' | 'collection' = 'project'
): Promise<PlatformResult> {
  console.log(`[Behance Publisher] Publishing post ${post.id} for user ${account.userId} to account ${account.username}`);

  const { accessToken, error: authError } = await getBehanceApiClient(account);

  if (authError || !accessToken) {
    console.error(`[Behance Publisher] Authentication failed for account ${account.id}: ${authError}`);
    return { platform: 'behance', success: false, error: authError || 'Authentication failed' };
  }

  try {
    const content = post.contentText || 'CreatorFlow Project';
    const hasMedia = post.mediaUrls && post.mediaUrls.length > 0;

    if (!hasMedia || !post.mediaUrls || post.mediaUrls.length === 0) {
      return { platform: 'behance', success: false, error: 'Behance requires at least one image for a project' };
    }

    // Get user's Behance user ID
    const userResponse = await fetch('https://www.behance.net/v2/users/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch Behance user info');
    }

    const userData = await userResponse.json();
    const userId = userData.user.id;

    if (projectType === 'project') {
      // Create a new project
      console.log(`[Behance Publisher] Creating project with ${post.mediaUrls.length} media items...`);

      const projectData = {
        name: content.substring(0, 100), // Behance title limit
        description: content,
        tags: [], // Could be extracted from post content
        modules: post.mediaUrls.map((mediaUrl, index) => ({
          type: 'image',
          src: mediaUrl,
          title: `Image ${index + 1}`,
        })),
        published_on: new Date().toISOString(),
      };

      const response = await fetch(`https://www.behance.net/v2/projects`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorData = await response.json() as BehanceError;
        const errorMessage = errorData.error || errorData.message || 'Unknown Behance API error';
        throw new Error(`Failed to create Behance project: ${errorMessage}`);
      }

      const result = await response.json();
      const platformPostId = result.project.id.toString();

      console.log(`[Behance Publisher] Successfully created project. Project ID: ${platformPostId}`);

      return {
        platform: 'behance',
        success: true,
        platformPostId: platformPostId,
      };

    } else {
      // Create a collection
      console.log(`[Behance Publisher] Creating collection...`);

      const collectionData = {
        name: content.substring(0, 100),
        description: content,
        published_on: new Date().toISOString(),
      };

      const response = await fetch(`https://www.behance.net/v2/collections`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(collectionData),
      });

      if (!response.ok) {
        const errorData = await response.json() as BehanceError;
        const errorMessage = errorData.error || errorData.message || 'Unknown Behance API error';
        throw new Error(`Failed to create Behance collection: ${errorMessage}`);
      }

      const result = await response.json();
      const platformPostId = result.collection.id.toString();

      console.log(`[Behance Publisher] Successfully created collection. Collection ID: ${platformPostId}`);

      return {
        platform: 'behance',
        success: true,
        platformPostId: platformPostId,
      };
    }

  } catch (error: unknown) {
    const behanceError = error as BehanceError;
    console.error(`[Behance Publisher] Failed to publish post ${post.id}:`, behanceError);
    return {
      platform: 'behance',
      success: false,
      error: behanceError.message || 'Unknown Behance API error',
    };
  }
}

/**
 * Alternative: Create project with detailed metadata
 */
export async function publishToBehanceWithMetadata(
  post: Post,
  account: SocialAccount,
  metadata: {
    name: string;
    description: string;
    tags: string[];
    category: string;
    tools: string[];
    fields: string[];
  }
): Promise<PlatformResult> {
  console.log(`[Behance Publisher] Creating project with detailed metadata`);

  const { accessToken, error: authError } = await getBehanceApiClient(account);

  if (authError || !accessToken) {
    console.error(`[Behance Publisher] Authentication failed for account ${account.id}: ${authError}`);
    return { platform: 'behance', success: false, error: authError || 'Authentication failed' };
  }

  try {
    const hasMedia = post.mediaUrls && post.mediaUrls.length > 0;

    if (!hasMedia || !post.mediaUrls || post.mediaUrls.length === 0) {
      return { platform: 'behance', success: false, error: 'Behance requires at least one image for a project' };
    }

    const projectData = {
      name: metadata.name.substring(0, 100),
      description: metadata.description,
      tags: metadata.tags,
      category: metadata.category,
      tools: metadata.tools,
      fields: metadata.fields,
      modules: post.mediaUrls.map((mediaUrl, index) => ({
        type: 'image',
        src: mediaUrl,
        title: `Image ${index + 1}`,
      })),
      published_on: new Date().toISOString(),
    };

    const response = await fetch(`https://www.behance.net/v2/projects`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });

    if (!response.ok) {
      const errorData = await response.json() as BehanceError;
      const errorMessage = errorData.error || errorData.message || 'Unknown Behance API error';
      throw new Error(`Failed to create Behance project: ${errorMessage}`);
    }

    const result = await response.json();
    const platformPostId = result.project.id.toString();

    console.log(`[Behance Publisher] Successfully created project with metadata. Project ID: ${platformPostId}`);

    return {
      platform: 'behance',
      success: true,
      platformPostId: platformPostId,
    };

  } catch (error: unknown) {
    const behanceError = error as BehanceError;
    console.error(`[Behance Publisher] Failed to create project with metadata:`, behanceError);
    return {
      platform: 'behance',
      success: false,
      error: behanceError.message || 'Unknown Behance API error',
    };
  }
} 