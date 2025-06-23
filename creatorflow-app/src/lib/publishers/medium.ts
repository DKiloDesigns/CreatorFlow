import { PrismaClient, Post, SocialAccount } from '@prisma/client';
import { decrypt, encrypt } from '@/lib/crypto';
import { PlatformResult } from '../publishing';

const prisma = new PrismaClient();

type PublishResult = PlatformResult;

interface MediumError {
  errors?: Array<{ message: string; code?: number }>;
  message?: string;
}

// Helper: Get Authenticated Medium Client
async function getMediumApiClient(account: SocialAccount): Promise<{ accessToken: string | null; error?: string }> {
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
 * Publishes an article to Medium.
 * 
 * Medium API supports:
 * - Article publishing
 * - Draft creation
 * - Publication posting
 * - Image uploads
 * 
 * @param post The post data from Prisma.
 * @param account The user's Medium social account data.
 * @param publicationId Optional publication ID to post to (defaults to user's profile)
 * @returns A promise resolving to a PublishResult object.
 */
export async function publishToMedium(
  post: Post,
  account: SocialAccount,
  publicationId?: string
): Promise<PlatformResult> {
  const { accessToken, error: authError } = await getMediumApiClient(account);

  if (authError || !accessToken) {
    return { platform: 'medium', success: false, error: authError || 'Authentication failed' };
  }

  try {
    // Get user's Medium user ID
    const userResponse = await fetch('https://api.medium.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch Medium user info');
    }

    const userData = await userResponse.json();
    const userId = userData.data.id;

    // Prepare article content
    const title = 'CreatorFlow Post'; // Post model doesn't have title field
    const content = post.contentText || '';
    const hasMedia = post.mediaUrls && post.mediaUrls.length > 0;
    const mediaUrl = hasMedia ? post.mediaUrls[0] : null;

    // Build Medium article content
    let articleContent = content;

    // Add media if present
    if (hasMedia && mediaUrl) {
      articleContent += `\n\n![${title}](${mediaUrl})`;
    }

    // Note: Post model doesn't have tags field, so we skip tag processing
    // Tags would need to be added to the Post model or passed separately

    // Prepare article data
    const articleData = {
      title: title,
      contentFormat: 'markdown',
      content: articleContent,
      publishStatus: 'public', // or 'draft' for drafts
    };

    // Determine the endpoint based on whether we're posting to a publication or user profile
    const endpoint = publicationId 
      ? `https://api.medium.com/v1/publications/${publicationId}/posts`
      : `https://api.medium.com/v1/users/${userId}/posts`;

    const articleResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData),
    });

    if (!articleResponse.ok) {
      const errorData = await articleResponse.json() as MediumError;
      const errorMessage = errorData.errors?.[0]?.message || errorData.message || 'Unknown Medium API error';
      throw new Error(`Failed to publish Medium article: ${errorMessage}`);
    }

    const articleResult = await articleResponse.json();
    const platformPostId = articleResult.data.id;
    const articleUrl = articleResult.data.url;

    return {
      platform: 'medium',
      success: true,
      platformPostId: platformPostId,
    };

  } catch (error: unknown) {
    const mediumError = error as MediumError;
    return {
      platform: 'medium',
      success: false,
      error: mediumError.message || 'Unknown Medium API error',
    };
  }
}

/**
 * Creates a draft article on Medium.
 * 
 * @param post The post data from Prisma.
 * @param account The user's Medium social account data.
 * @returns A promise resolving to a PublishResult object.
 */
export async function createMediumDraft(
  post: Post,
  account: SocialAccount
): Promise<PlatformResult> {
  const { accessToken, error: authError } = await getMediumApiClient(account);

  if (authError || !accessToken) {
    return { platform: 'medium', success: false, error: authError || 'Authentication failed' };
  }

  try {
    // Get user's Medium user ID
    const userResponse = await fetch('https://api.medium.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch Medium user info');
    }

    const userData = await userResponse.json();
    const userId = userData.data.id;

    // Prepare draft content
    const title = 'CreatorFlow Draft'; // Post model doesn't have title field
    const content = post.contentText || '';
    const hasMedia = post.mediaUrls && post.mediaUrls.length > 0;
    const mediaUrl = hasMedia ? post.mediaUrls[0] : null;

    let articleContent = content;

    if (hasMedia && mediaUrl) {
      articleContent += `\n\n![${title}](${mediaUrl})`;
    }

    // Note: Post model doesn't have tags field, so we skip tag processing

    const draftData = {
      title: title,
      contentFormat: 'markdown',
      content: articleContent,
      publishStatus: 'draft',
    };

    const draftResponse = await fetch(`https://api.medium.com/v1/users/${userId}/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(draftData),
    });

    if (!draftResponse.ok) {
      const errorData = await draftResponse.json() as MediumError;
      const errorMessage = errorData.errors?.[0]?.message || errorData.message || 'Unknown Medium API error';
      throw new Error(`Failed to create Medium draft: ${errorMessage}`);
    }

    const draftResult = await draftResponse.json();
    const platformPostId = draftResult.data.id;

    return {
      platform: 'medium',
      success: true,
      platformPostId: platformPostId,
    };

  } catch (error: unknown) {
    const mediumError = error as MediumError;
    return {
      platform: 'medium',
      success: false,
      error: mediumError.message || 'Unknown Medium API error',
    };
  }
} 