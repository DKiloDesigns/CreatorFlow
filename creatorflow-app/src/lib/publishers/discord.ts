import { PrismaClient, Post, SocialAccount } from '@prisma/client';
import { decrypt, encrypt } from '@/lib/crypto';
import { PlatformResult } from '../publishing';

const prisma = new PrismaClient();

type PublishResult = PlatformResult;

interface DiscordError {
  code?: number;
  message: string;
}

// Helper: Get Authenticated Discord Client
async function getDiscordApiClient(account: SocialAccount): Promise<{ accessToken: string | null; error?: string }> {
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
 * Publishes a message to a Discord channel.
 * 
 * Discord API supports:
 * - Text messages
 * - Embeds with images, videos, and links
 * - File attachments
 * - Webhook messages
 * 
 * @param post The post data from Prisma.
 * @param account The user's Discord social account data.
 * @param channelId Optional channel ID to post to (defaults to user's default channel)
 * @returns A promise resolving to a PublishResult object.
 */
export async function publishToDiscord(
  post: Post,
  account: SocialAccount,
  channelId?: string
): Promise<PlatformResult> {
  console.log(`[Discord Publisher] Publishing post ${post.id} for user ${account.userId} to account ${account.username}`);

  const { accessToken, error: authError } = await getDiscordApiClient(account);

  if (authError || !accessToken) {
    console.error(`[Discord Publisher] Authentication failed for account ${account.id}: ${authError}`);
    return { platform: 'discord', success: false, error: authError || 'Authentication failed' };
  }

  try {
    // Use provided channel ID or get user's guilds and use first available channel
    let targetChannel = channelId;
    
    if (!targetChannel) {
      console.log('[Discord Publisher] No channel specified, fetching user guilds...');
      
      // Get user's guilds (servers)
      const guildsResponse = await fetch('https://discord.com/api/users/@me/guilds', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!guildsResponse.ok) {
        throw new Error('Failed to fetch Discord guilds');
      }

      const guildsData = await guildsResponse.json();
      
      if (guildsData.length === 0) {
        return { platform: 'discord', success: false, error: 'No Discord servers found. Please join a server first.' };
      }

      // Get channels from the first guild
      const guildId = guildsData[0].id;
      const channelsResponse = await fetch(`https://discord.com/api/guilds/${guildId}/channels`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!channelsResponse.ok) {
        throw new Error('Failed to fetch Discord channels');
      }

      const channelsData = await channelsResponse.json();
      const textChannels = channelsData.filter((channel: any) => channel.type === 0); // Text channels

      if (textChannels.length === 0) {
        return { platform: 'discord', success: false, error: 'No text channels found in the server.' };
      }

      targetChannel = textChannels[0].id;
      console.log(`[Discord Publisher] Using channel: ${targetChannel}`);
    }

    // Prepare message content
    const content = post.contentText || 'CreatorFlow Post';
    const hasMedia = post.mediaUrls && post.mediaUrls.length > 0;
    const mediaUrl = hasMedia ? post.mediaUrls[0] : null;

    let messageData: any = {
      content: content,
    };

    // Handle media if present
    if (hasMedia && mediaUrl) {
      console.log(`[Discord Publisher] Processing media: ${mediaUrl}`);
      
      // Create an embed with the media
      messageData.embeds = [{
        title: 'CreatorFlow Post',
        description: content,
        image: {
          url: mediaUrl,
        },
        color: 0x5865F2, // Discord brand color
        timestamp: new Date().toISOString(),
      }];
      
      // Clear content since it's in the embed
      messageData.content = '';
    }

    // Send the message
    console.log('[Discord Publisher] Sending message...');
    const messageResponse = await fetch(`https://discord.com/api/channels/${targetChannel}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bot ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData),
    });

    if (!messageResponse.ok) {
      const errorData = await messageResponse.json();
      throw new Error(`Failed to send Discord message: ${errorData.message || 'Unknown error'}`);
    }

    const messageResult = await messageResponse.json();
    const platformPostId = messageResult.id;

    console.log(`[Discord Publisher] Successfully published post ${post.id}. Platform ID: ${platformPostId}`);

    return {
      platform: 'discord',
      success: true,
      platformPostId: platformPostId,
    };

  } catch (error: unknown) {
    const discordError = error as DiscordError;
    console.error(`[Discord Publisher] Failed to publish post ${post.id}:`, discordError);
    return {
      platform: 'discord',
      success: false,
      error: discordError.message || 'Unknown Discord API error',
    };
  }
}

/**
 * Alternative implementation using Discord webhooks
 * This is simpler and doesn't require bot permissions
 */
export async function publishToDiscordWebhook(
  post: Post,
  account: SocialAccount,
  webhookUrl: string
): Promise<PlatformResult> {
  console.log(`[Discord Webhook Publisher] Publishing post ${post.id} via webhook`);

  try {
    const content = post.contentText || 'CreatorFlow Post';
    const hasMedia = post.mediaUrls && post.mediaUrls.length > 0;
    const mediaUrl = hasMedia ? post.mediaUrls[0] : null;

    let webhookData: any = {
      content: content,
      username: 'CreatorFlow',
      avatar_url: 'https://creatorflow.com/logo.png', // Optional: set custom avatar
    };

    // Handle media if present
    if (hasMedia && mediaUrl) {
      console.log(`[Discord Webhook Publisher] Processing media: ${mediaUrl}`);
      
      webhookData.embeds = [{
        title: 'CreatorFlow Post',
        description: content,
        image: {
          url: mediaUrl,
        },
        color: 0x5865F2,
        timestamp: new Date().toISOString(),
      }];
      
      webhookData.content = '';
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData),
    });

    if (!response.ok) {
      throw new Error(`Webhook request failed: ${response.statusText}`);
    }

    const platformPostId = `webhook_${Date.now()}`;

    console.log(`[Discord Webhook Publisher] Successfully published post ${post.id}. Platform ID: ${platformPostId}`);

    return {
      platform: 'discord',
      success: true,
      platformPostId: platformPostId,
    };

  } catch (error: unknown) {
    const discordError = error as DiscordError;
    console.error(`[Discord Webhook Publisher] Failed to publish post ${post.id}:`, discordError);
    return {
      platform: 'discord',
      success: false,
      error: discordError.message || 'Unknown Discord webhook error',
    };
  }
} 