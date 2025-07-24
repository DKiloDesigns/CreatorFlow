import { Post, SocialAccount } from '@prisma/client';
import { PlatformResult } from '../publishing';
import { decrypt } from '@/lib/crypto';

export interface MailchimpPostData {
  subject: string;
  content: string;
  listId?: string;
  campaignType?: 'regular' | 'plaintext' | 'absplit' | 'rss' | 'variate';
}

export class MailchimpPublisher {
  private accessToken: string;
  private serverPrefix: string;

  constructor(account: SocialAccount) {
    const decryptedToken = decrypt(account.encryptedAccessToken || '');
    if (!decryptedToken) {
      throw new Error('No valid Mailchimp access token found');
    }
    this.accessToken = decryptedToken;
    this.serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX || 'us1';
  }

  async post(data: MailchimpPostData): Promise<boolean> {
    try {
      const listId = data.listId || process.env.MAILCHIMP_DEFAULT_LIST_ID;
      
      if (!listId) {
        throw new Error('No Mailchimp list specified');
      }

      // Create campaign
      const campaignData = {
        type: data.campaignType || 'regular',
        recipients: {
          list_id: listId,
        },
        settings: {
          subject_line: data.subject,
          title: data.subject,
          from_name: process.env.MAILCHIMP_FROM_NAME || 'CreatorFlow',
          reply_to: process.env.MAILCHIMP_REPLY_TO || 'noreply@creatorflow.com',
        },
      };

      const campaignResponse = await fetch(`https://${this.serverPrefix}.api.mailchimp.com/3.0/campaigns`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignData),
      });

      if (!campaignResponse.ok) {
        const error = await campaignResponse.text();
        throw new Error(`Mailchimp API error: ${error}`);
      }

      const campaign = await campaignResponse.json();

      // Set campaign content
      const contentData = {
        html: `<div>${data.content}</div>`,
      };

      const contentResponse = await fetch(`https://${this.serverPrefix}.api.mailchimp.com/3.0/campaigns/${campaign.id}/content`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contentData),
      });

      if (!contentResponse.ok) {
        const error = await contentResponse.text();
        throw new Error(`Mailchimp content API error: ${error}`);
      }

      // Send campaign
      const sendResponse = await fetch(`https://${this.serverPrefix}.api.mailchimp.com/3.0/campaigns/${campaign.id}/actions/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      if (!sendResponse.ok) {
        const error = await sendResponse.text();
        throw new Error(`Mailchimp send API error: ${error}`);
      }

      console.log('✅ Email sent via Mailchimp successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to send via Mailchimp:', error);
      return false;
    }
  }

  async getLists(): Promise<Array<{ id: string; name: string }>> {
    try {
      const response = await fetch(`https://${this.serverPrefix}.api.mailchimp.com/3.0/lists`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Mailchimp lists');
      }

      const result = await response.json();
      
      return result.lists.map((list: any) => ({
        id: list.id,
        name: list.name,
      }));
    } catch (error) {
      console.error('❌ Failed to get Mailchimp lists:', error);
      return [];
    }
  }

  async validateCredentials(): Promise<boolean> {
    try {
      const response = await fetch(`https://${this.serverPrefix}.api.mailchimp.com/3.0/ping`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export async function publishToMailchimp(
  post: Post,
  account: SocialAccount
): Promise<PlatformResult> {
  try {
    const publisher = new MailchimpPublisher(account);
    
    const success = await publisher.post({
      subject: post.contentText?.split('\n')[0] || 'CreatorFlow Update',
      content: post.contentText || 'CreatorFlow Post',
      listId: (account as any).metadata?.listId,
    });

    if (success) {
      return {
        platform: 'mailchimp',
        success: true,
        platformPostId: `mailchimp_${Date.now()}`,
      };
    } else {
      return {
        platform: 'mailchimp',
        success: false,
        error: 'Failed to send via Mailchimp',
      };
    }
  } catch (error) {
    return {
      platform: 'mailchimp',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown Mailchimp API error',
    };
  }
} 