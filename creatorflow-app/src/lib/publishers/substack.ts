import { PrismaClient, Post, SocialAccount } from '@prisma/client';
import { decrypt, encrypt } from '@/lib/crypto';
import { PlatformResult } from '../publishing';

const prisma = new PrismaClient();

type PublishResult = PlatformResult;

interface SubstackError {
  error?: string;
  message?: string;
}

// Helper: Get Authenticated Substack Client
async function getSubstackApiClient(account: SocialAccount): Promise<{ accessToken: string | null; error?: string }> {
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
 * Publishes a newsletter/article to Substack.
 * 
 * Substack API supports:
 * - Newsletter publishing
 * - Draft creation
 * - Publication management
 * - Subscriber management
 * 
 * @param post The post data from Prisma.
 * @param account The user's Substack social account data.
 * @param publicationId Optional publication ID to post to (defaults to user's main publication)
 * @returns A promise resolving to a PublishResult object.
 */
export async function publishToSubstack(
  post: Post,
  account: SocialAccount,
  publicationId?: string
): Promise<PlatformResult> {
  console.log(`[Substack Publisher] Publishing post ${post.id} for user ${account.userId} to account ${account.username}`);

  const { accessToken, error: authError } = await getSubstackApiClient(account);

  if (authError || !accessToken) {
    console.error(`[Substack Publisher] Authentication failed for account ${account.id}: ${authError}`);
    return { platform: 'substack', success: false, error: authError || 'Authentication failed' };
  }

  try {
    // Get user's publications
    const publicationsResponse = await fetch('https://substack.com/api/v1/publications', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!publicationsResponse.ok) {
      throw new Error('Failed to fetch Substack publications');
    }

    const publicationsData = await publicationsResponse.json();
    
    if (publicationsData.length === 0) {
      return { platform: 'substack', success: false, error: 'No Substack publications found. Please create a publication first.' };
    }

    // Use provided publication ID or the first available publication
    const targetPublicationId = publicationId || publicationsData[0].id;

    // Prepare newsletter content
    const title = 'CreatorFlow Newsletter'; // Post model doesn't have title field
    const content = post.contentText || '';
    const hasMedia = post.mediaUrls && post.mediaUrls.length > 0;
    const mediaUrl = hasMedia ? post.mediaUrls[0] : null;

    // Build Substack newsletter content
    let newsletterContent = content;

    // Add media if present
    if (hasMedia && mediaUrl) {
      console.log(`[Substack Publisher] Processing media: ${mediaUrl}`);
      newsletterContent += `\n\n![${title}](${mediaUrl})`;
    }

    // Prepare newsletter data
    const newsletterData = {
      title: title,
      subtitle: '', // Optional subtitle
      body: newsletterContent,
      is_draft: false, // Set to true for drafts
      send_email: true, // Send to subscribers
      published_at: new Date().toISOString(),
    };

    console.log('[Substack Publisher] Publishing newsletter...');
    const newsletterResponse = await fetch(`https://substack.com/api/v1/publications/${targetPublicationId}/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newsletterData),
    });

    if (!newsletterResponse.ok) {
      const errorData = await newsletterResponse.json() as SubstackError;
      const errorMessage = errorData.error || errorData.message || 'Unknown Substack API error';
      throw new Error(`Failed to publish Substack newsletter: ${errorMessage}`);
    }

    const newsletterResult = await newsletterResponse.json();
    const platformPostId = newsletterResult.id;

    console.log(`[Substack Publisher] Successfully published post ${post.id}. Platform ID: ${platformPostId}`);

    return {
      platform: 'substack',
      success: true,
      platformPostId: platformPostId,
    };

  } catch (error: unknown) {
    const substackError = error as SubstackError;
    console.error(`[Substack Publisher] Failed to publish post ${post.id}:`, substackError);
    return {
      platform: 'substack',
      success: false,
      error: substackError.message || 'Unknown Substack API error',
    };
  }
}

/**
 * Creates a draft newsletter on Substack.
 * 
 * @param post The post data from Prisma.
 * @param account The user's Substack social account data.
 * @returns A promise resolving to a PublishResult object.
 */
export async function createSubstackDraft(
  post: Post,
  account: SocialAccount
): Promise<PlatformResult> {
  console.log(`[Substack Draft Publisher] Creating draft for post ${post.id}`);

  const { accessToken, error: authError } = await getSubstackApiClient(account);

  if (authError || !accessToken) {
    console.error(`[Substack Draft Publisher] Authentication failed for account ${account.id}: ${authError}`);
    return { platform: 'substack', success: false, error: authError || 'Authentication failed' };
  }

  try {
    // Get user's publications
    const publicationsResponse = await fetch('https://substack.com/api/v1/publications', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!publicationsResponse.ok) {
      throw new Error('Failed to fetch Substack publications');
    }

    const publicationsData = await publicationsResponse.json();
    
    if (publicationsData.length === 0) {
      return { platform: 'substack', success: false, error: 'No Substack publications found. Please create a publication first.' };
    }

    const publicationId = publicationsData[0].id;

    // Prepare draft content
    const title = 'CreatorFlow Draft'; // Post model doesn't have title field
    const content = post.contentText || '';
    const hasMedia = post.mediaUrls && post.mediaUrls.length > 0;
    const mediaUrl = hasMedia ? post.mediaUrls[0] : null;

    let newsletterContent = content;

    if (hasMedia && mediaUrl) {
      newsletterContent += `\n\n![${title}](${mediaUrl})`;
    }

    const draftData = {
      title: title,
      subtitle: '',
      body: newsletterContent,
      is_draft: true,
      send_email: false,
    };

    const draftResponse = await fetch(`https://substack.com/api/v1/publications/${publicationId}/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(draftData),
    });

    if (!draftResponse.ok) {
      const errorData = await draftResponse.json() as SubstackError;
      const errorMessage = errorData.error || errorData.message || 'Unknown Substack API error';
      throw new Error(`Failed to create Substack draft: ${errorMessage}`);
    }

    const draftResult = await draftResponse.json();
    const platformPostId = draftResult.id;

    console.log(`[Substack Draft Publisher] Successfully created draft for post ${post.id}. Platform ID: ${platformPostId}`);

    return {
      platform: 'substack',
      success: true,
      platformPostId: platformPostId,
    };

  } catch (error: unknown) {
    const substackError = error as SubstackError;
    console.error(`[Substack Draft Publisher] Failed to create draft for post ${post.id}:`, substackError);
    return {
      platform: 'substack',
      success: false,
      error: substackError.message || 'Unknown Substack API error',
    };
  }
} 