import { BskyAgent } from '@atproto/api';
import { Post, SocialAccount } from '@prisma/client';
import { PlatformResult } from '../publishing';

export async function publishToBluesky(
  post: Post,
  account: SocialAccount
): Promise<PlatformResult> {
  try {
    // Get Bluesky credentials from environment
    const handle = process.env.BLUESKY_HANDLE;
    const password = process.env.BLUESKY_PASSWORD;

    if (!handle || !password) {
      return {
        platform: 'bluesky',
        success: false,
        error: 'Bluesky credentials not configured'
      };
    }

    // Create Bluesky agent
    const agent = new BskyAgent({
      service: 'https://bsky.social'
    });

    // Login with credentials
    await agent.login({
      identifier: handle,
      password: password
    });

    // Prepare post data
    const postData: any = {
      text: post.contentText || 'CreatorFlow Post',
      createdAt: new Date().toISOString()
    };

    // Add media if provided
    if (post.mediaUrls && post.mediaUrls.length > 0) {
      // Note: Bluesky media upload requires additional steps
      // For now, we'll post text only
      console.log('Media upload not yet implemented for Bluesky');
    }

    // Create the post
    const result = await agent.post(postData);

    return {
      platform: 'bluesky',
      success: true,
      platformPostId: result.uri
    };

  } catch (error) {
    console.error('Bluesky publishing error:', error);
    return {
      platform: 'bluesky',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Helper function to validate Bluesky credentials
export async function validateBlueskyCredentials(): Promise<{ valid: boolean; error?: string }> {
  try {
    const handle = process.env.BLUESKY_HANDLE;
    const password = process.env.BLUESKY_PASSWORD;

    if (!handle || !password) {
      return {
        valid: false,
        error: 'Bluesky credentials not configured'
      };
    }

    const agent = new BskyAgent({
      service: 'https://bsky.social'
    });

    await agent.login({
      identifier: handle,
      password: password
    });

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Invalid credentials'
    };
  }
} 