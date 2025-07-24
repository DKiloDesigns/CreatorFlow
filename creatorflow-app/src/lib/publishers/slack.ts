import { Post, SocialAccount } from '@prisma/client';
import { PlatformResult } from '../publishing';
import { decrypt } from '@/lib/crypto';

export interface SlackPostData {
  content: string;
  channelId?: string;
  attachments?: any[];
}

export class SlackPublisher {
  private accessToken: string;
  private botToken?: string;

  constructor(account: SocialAccount) {
    const decryptedToken = decrypt(account.encryptedAccessToken || '');
    if (!decryptedToken) {
      throw new Error('No valid Slack access token found');
    }
    this.accessToken = decryptedToken;
  }

  async post(data: SlackPostData): Promise<boolean> {
    try {
      const channelId = data.channelId || process.env.SLACK_DEFAULT_CHANNEL;
      
      if (!channelId) {
        throw new Error('No Slack channel specified');
      }

      const message = {
        channel: channelId,
        text: data.content,
        ...(data.attachments && { attachments: data.attachments })
      };

      const response = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      const result = await response.json();
      
      if (!result.ok) {
        throw new Error(`Slack API error: ${result.error}`);
      }

      console.log('✅ Message posted to Slack successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to post to Slack:', error);
      return false;
    }
  }

  async getChannels(): Promise<Array<{ id: string; name: string }>> {
    try {
      const response = await fetch('https://slack.com/api/conversations.list', {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      const result = await response.json();
      
      if (!result.ok) {
        throw new Error(`Slack API error: ${result.error}`);
      }

      return result.channels.map((channel: any) => ({
        id: channel.id,
        name: channel.name,
      }));
    } catch (error) {
      console.error('❌ Failed to get Slack channels:', error);
      return [];
    }
  }

  async validateCredentials(): Promise<boolean> {
    try {
      const response = await fetch('https://slack.com/api/auth.test', {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      const result = await response.json();
      return result.ok;
    } catch (error) {
      return false;
    }
  }
}

export async function publishToSlack(
  post: Post,
  account: SocialAccount
): Promise<PlatformResult> {
  try {
    const publisher = new SlackPublisher(account);
    
    const success = await publisher.post({
      content: post.contentText || 'CreatorFlow Post',
      channelId: (account as any).metadata?.channelId,
    });

    if (success) {
      return {
        platform: 'slack',
        success: true,
        platformPostId: `slack_${Date.now()}`,
      };
    } else {
      return {
        platform: 'slack',
        success: false,
        error: 'Failed to post to Slack',
      };
    }
  } catch (error) {
    return {
      platform: 'slack',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown Slack API error',
    };
  }
} 