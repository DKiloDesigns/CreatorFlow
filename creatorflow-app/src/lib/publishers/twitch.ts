import { PrismaClient, Post, SocialAccount } from '@prisma/client';
import { decrypt, encrypt } from '@/lib/crypto';
import { PlatformResult } from '../publishing';

const prisma = new PrismaClient();

type PublishResult = PlatformResult;

interface TwitchError {
  status?: number;
  message: string;
}

// Helper: Get Authenticated Twitch Client
async function getTwitchApiClient(account: SocialAccount): Promise<{ accessToken: string | null; error?: string }> {
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
 * Publishes content to Twitch.
 * 
 * Twitch API supports:
 * - Stream announcements
 * - Clip creation
 * - Channel updates
 * - Chat messages (via IRC)
 * 
 * @param post The post data from Prisma.
 * @param account The user's Twitch social account data.
 * @returns A promise resolving to a PublishResult object.
 */
export async function publishToTwitch(
  post: Post,
  account: SocialAccount
): Promise<PlatformResult> {
  console.log(`[Twitch Publisher] Publishing post ${post.id} for user ${account.userId} to account ${account.username}`);

  const { accessToken, error: authError } = await getTwitchApiClient(account);

  if (authError || !accessToken) {
    console.error(`[Twitch Publisher] Authentication failed for account ${account.id}: ${authError}`);
    return { platform: 'twitch', success: false, error: authError || 'Authentication failed' };
  }

  try {
    // Get user's channel information
    const userResponse = await fetch('https://api.twitch.tv/helix/users', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Client-Id': process.env.TWITCH_CLIENT_ID!,
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch Twitch user info');
    }

    const userData = await userResponse.json();
    const user = userData.data[0];
    const broadcasterId = user.id;

    // Check if user is currently streaming
    const streamResponse = await fetch(`https://api.twitch.tv/helix/streams?user_id=${broadcasterId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Client-Id': process.env.TWITCH_CLIENT_ID!,
      },
    });

    if (!streamResponse.ok) {
      throw new Error('Failed to fetch Twitch stream info');
    }

    const streamData = await streamResponse.json();
    const isLive = streamData.data.length > 0;

    let platformPostId: string;
    const content = post.contentText || 'CreatorFlow Post';

    if (isLive) {
      // If live, create a clip
      console.log('[Twitch Publisher] User is live, creating clip...');
      
      const clipResponse = await fetch('https://api.twitch.tv/helix/clips', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Client-Id': process.env.TWITCH_CLIENT_ID!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          broadcaster_id: broadcasterId,
          has_delay: false,
        }),
      });

      if (!clipResponse.ok) {
        throw new Error('Failed to create Twitch clip');
      }

      const clipData = await clipResponse.json();
      platformPostId = clipData.data[0].id;

      // Update clip title with post content
      const editClipResponse = await fetch(`https://api.twitch.tv/helix/clips?id=${platformPostId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Client-Id': process.env.TWITCH_CLIENT_ID!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: content.substring(0, 140), // Twitch clip title limit
        }),
      });

      if (!editClipResponse.ok) {
        console.warn('[Twitch Publisher] Failed to update clip title, but clip was created');
      }

    } else {
      // If not live, update channel information
      console.log('[Twitch Publisher] User is not live, updating channel info...');
      
      const updateResponse = await fetch(`https://api.twitch.tv/helix/channels?broadcaster_id=${broadcasterId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Client-Id': process.env.TWITCH_CLIENT_ID!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: content.substring(0, 140), // Twitch title limit
        }),
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update Twitch channel');
      }

      platformPostId = `channel_update_${Date.now()}`;
    }

    console.log(`[Twitch Publisher] Successfully published post ${post.id}. Platform ID: ${platformPostId}`);

    return {
      platform: 'twitch',
      success: true,
      platformPostId: platformPostId,
    };

  } catch (error: unknown) {
    const twitchError = error as TwitchError;
    console.error(`[Twitch Publisher] Failed to publish post ${post.id}:`, twitchError);
    return {
      platform: 'twitch',
      success: false,
      error: twitchError.message || 'Unknown Twitch API error',
    };
  }
}

/**
 * Alternative: Post to Twitch chat (requires IRC connection)
 * This is more complex and requires maintaining a persistent connection
 */
export async function publishToTwitchChat(
  post: Post,
  account: SocialAccount,
  channelName: string
): Promise<PlatformResult> {
  console.log(`[Twitch Chat Publisher] Publishing post ${post.id} to chat in #${channelName}`);

  // Note: This would require implementing IRC connection to Twitch
  // For now, return a placeholder implementation
  return {
    platform: 'twitch',
    success: false,
    error: 'Twitch chat posting requires IRC implementation (not yet implemented)',
  };
} 