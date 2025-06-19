import { PrismaClient, Post, SocialAccount } from '@prisma/client';
import { decrypt, encrypt } from '@/lib/crypto';
import { PlatformResult } from '../publishing';

const prisma = new PrismaClient();

type PublishResult = PlatformResult;

interface TelegramError {
  code?: number;
  message: string;
}

// Helper: Get Authenticated Telegram Client
async function getTelegramApiClient(account: SocialAccount): Promise<{ botToken: string | null; error?: string }> {
  if (!account.encryptedAccessToken) {
    return { botToken: null, error: 'Missing encrypted bot token' };
  }

  // Decrypt token
  const botToken = decrypt(account.encryptedAccessToken);
  if (!botToken) {
    return { botToken: null, error: 'Failed to decrypt bot token' };
  }

  return { botToken };
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
    case 'mp3':
      return 'audio/mpeg';
    case 'ogg':
      return 'audio/ogg';
    default:
      return 'image/jpeg'; // Default fallback
  }
}

/**
 * Publishes a message to a Telegram channel.
 * 
 * Telegram Bot API supports:
 * - Text messages
 * - Photo messages
 * - Video messages
 * - Audio messages
 * - Document messages
 * 
 * @param post The post data from Prisma.
 * @param account The user's Telegram social account data.
 * @param channelId Optional channel ID to post to (defaults to bot's default channel)
 * @returns A promise resolving to a PublishResult object.
 */
export async function publishToTelegram(
  post: Post,
  account: SocialAccount,
  channelId?: string
): Promise<PublishResult> {
  console.log(`[Telegram Publisher] Publishing post ${post.id} for user ${account.userId} to account ${account.username}`);

  const { botToken, error: authError } = await getTelegramApiClient(account);

  if (authError || !botToken) {
    console.error(`[Telegram Publisher] Authentication failed for account ${account.id}: ${authError}`);
    return { platform: 'telegram', success: false, error: authError || 'Authentication failed' };
  }

  try {
    // Use provided channel ID or default to bot's channel
    const targetChannel = channelId || '@' + account.username;
    console.log(`[Telegram Publisher] Posting to channel: ${targetChannel}`);

    // Determine message type and content
    const hasMedia = post.mediaUrls && post.mediaUrls.length > 0;
    const mediaUrl = hasMedia ? post.mediaUrls[0] : null;
    const text = post.contentText || '';

    let platformPostId: string;

    if (hasMedia && mediaUrl) {
      console.log(`[Telegram Publisher] Processing media: ${mediaUrl}`);
      
      // Determine media type
      const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(mediaUrl);
      const isVideo = /\.(mp4|mov|avi|webm)$/i.test(mediaUrl);
      const isAudio = /\.(mp3|ogg|wav)$/i.test(mediaUrl);
      
      if (isImage) {
        // Send photo with caption
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: targetChannel,
            photo: mediaUrl,
            caption: text,
            parse_mode: 'HTML', // Support basic HTML formatting
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to send photo: ${errorData.description || 'Unknown error'}`);
        }

        const result = await response.json();
        platformPostId = result.result.message_id.toString();
        
      } else if (isVideo) {
        // Send video with caption
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendVideo`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: targetChannel,
            video: mediaUrl,
            caption: text,
            parse_mode: 'HTML',
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to send video: ${errorData.description || 'Unknown error'}`);
        }

        const result = await response.json();
        platformPostId = result.result.message_id.toString();
        
      } else {
        // Send as document
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: targetChannel,
            document: mediaUrl,
            caption: text,
            parse_mode: 'HTML',
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to send document: ${errorData.description || 'Unknown error'}`);
        }

        const result = await response.json();
        platformPostId = result.result.message_id.toString();
      }
      
    } else {
      // Send text message only
      console.log('[Telegram Publisher] Sending text message...');
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: targetChannel,
          text: text || 'CreatorFlow Post',
          parse_mode: 'HTML', // Support basic HTML formatting
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to send message: ${errorData.description || 'Unknown error'}`);
      }

      const result = await response.json();
      platformPostId = result.result.message_id.toString();
    }

    console.log(`[Telegram Publisher] Successfully published post ${post.id}. Platform ID: ${platformPostId}`);

    return {
      platform: 'telegram',
      success: true,
      platformPostId: platformPostId,
    };

  } catch (error: unknown) {
    const telegramError = error as TelegramError;
    console.error(`[Telegram Publisher] Failed to publish post ${post.id}:`, telegramError);
    return {
      platform: 'telegram',
      success: false,
      error: telegramError.message || 'Unknown Telegram API error',
    };
  }
}

/**
 * Alternative implementation for posting to specific channels
 * This provides more control over channel targeting
 */
export async function publishToTelegramChannel(
  post: Post,
  account: SocialAccount,
  channelId: string
): Promise<PublishResult> {
  console.log(`[Telegram Channel Publisher] Publishing post ${post.id} to channel ${channelId}`);

  // Validate channel ID format
  if (!channelId || (!channelId.startsWith('@') && !channelId.startsWith('-100'))) {
    return { platform: 'telegram', success: false, error: 'Invalid channel ID format' };
  }

  return publishToTelegram(post, account, channelId);
}

/**
 * Helper function to get bot's available chats
 * This can be used to list available channels/groups for posting
 */
export async function getTelegramChats(account: SocialAccount): Promise<any[]> {
  const { botToken, error: authError } = await getTelegramApiClient(account);

  if (authError || !botToken) {
    console.error(`[Telegram Publisher] Authentication failed for account ${account.id}: ${authError}`);
    return [];
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Telegram chats');
    }

    const data = await response.json();
    
    // Extract unique chats from updates
    const chats = new Map();
    data.result.forEach((update: any) => {
      if (update.message?.chat) {
        const chat = update.message.chat;
        chats.set(chat.id, {
          id: chat.id,
          title: chat.title || chat.first_name,
          type: chat.type,
          username: chat.username,
        });
      }
    });

    return Array.from(chats.values());
  } catch (error) {
    console.error('[Telegram Publisher] Failed to fetch chats:', error);
    return [];
  }
} 