import { Post, SocialAccount } from '@prisma/client';
import { PlatformResult } from '../publishing';
import { decrypt } from '@/lib/crypto';

export interface KlaviyoPostData {
  subject: string;
  content: string;
  listId?: string;
  templateId?: string;
}

export class KlaviyoPublisher {
  private apiKey: string;

  constructor(account: SocialAccount) {
    const decryptedToken = decrypt(account.encryptedAccessToken || '');
    if (!decryptedToken) {
      throw new Error('No valid Klaviyo API key found');
    }
    this.apiKey = decryptedToken;
  }

  async post(data: KlaviyoPostData): Promise<boolean> {
    try {
      const listId = data.listId || process.env.KLAVIYO_DEFAULT_LIST_ID;
      
      if (!listId) {
        throw new Error('No Klaviyo list specified');
      }

      // Create campaign
      const campaignData = {
        data: {
          type: 'campaign',
          attributes: {
            name: data.subject,
            subject: data.subject,
            from_email: process.env.KLAVIYO_FROM_EMAIL || 'noreply@creatorflow.com',
            from_name: process.env.KLAVIYO_FROM_NAME || 'CreatorFlow',
            status: 'draft',
            ...(data.templateId && { template_id: data.templateId }),
          },
          relationships: {
            list: {
              data: {
                type: 'list',
                id: listId,
              },
            },
          },
        },
      };

      const campaignResponse = await fetch('https://a.klaviyo.com/api/campaigns/', {
        method: 'POST',
        headers: {
          'Authorization': `Klaviyo-API-Key ${this.apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Revision': '2023-12-15',
        },
        body: JSON.stringify(campaignData),
      });

      if (!campaignResponse.ok) {
        const error = await campaignResponse.text();
        throw new Error(`Klaviyo API error: ${error}`);
      }

      const campaign = await campaignResponse.json();

      // Update campaign content
      const contentData = {
        data: {
          type: 'campaign-message',
          attributes: {
            html_content: `<div>${data.content}</div>`,
            text_content: data.content,
          },
        },
      };

      const contentResponse = await fetch(`https://a.klaviyo.com/api/campaign-messages/${campaign.data.id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Klaviyo-API-Key ${this.apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Revision': '2023-12-15',
        },
        body: JSON.stringify(contentData),
      });

      if (!contentResponse.ok) {
        const error = await contentResponse.text();
        throw new Error(`Klaviyo content API error: ${error}`);
      }

      // Send campaign
      const sendData = {
        data: {
          type: 'campaign-send-job',
          attributes: {
            send_time: new Date().toISOString(),
          },
        },
      };

      const sendResponse = await fetch(`https://a.klaviyo.com/api/campaign-send-jobs/`, {
        method: 'POST',
        headers: {
          'Authorization': `Klaviyo-API-Key ${this.apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Revision': '2023-12-15',
        },
        body: JSON.stringify(sendData),
      });

      if (!sendResponse.ok) {
        const error = await sendResponse.text();
        throw new Error(`Klaviyo send API error: ${error}`);
      }

      console.log('✅ Email sent via Klaviyo successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to send via Klaviyo:', error);
      return false;
    }
  }

  async getLists(): Promise<Array<{ id: string; name: string }>> {
    try {
      const response = await fetch('https://a.klaviyo.com/api/lists/', {
        headers: {
          'Authorization': `Klaviyo-API-Key ${this.apiKey}`,
          'Accept': 'application/json',
          'Revision': '2023-12-15',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Klaviyo lists');
      }

      const result = await response.json();
      
      return result.data.map((list: any) => ({
        id: list.id,
        name: list.attributes.name,
      }));
    } catch (error) {
      console.error('❌ Failed to get Klaviyo lists:', error);
      return [];
    }
  }

  async validateCredentials(): Promise<boolean> {
    try {
      const response = await fetch('https://a.klaviyo.com/api/accounts/', {
        headers: {
          'Authorization': `Klaviyo-API-Key ${this.apiKey}`,
          'Accept': 'application/json',
          'Revision': '2023-12-15',
        },
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export async function publishToKlaviyo(
  post: Post,
  account: SocialAccount
): Promise<PlatformResult> {
  try {
    const publisher = new KlaviyoPublisher(account);
    
    const success = await publisher.post({
      subject: post.contentText?.split('\n')[0] || 'CreatorFlow Update',
      content: post.contentText || 'CreatorFlow Post',
      listId: (account as any).metadata?.listId,
    });

    if (success) {
      return {
        platform: 'klaviyo',
        success: true,
        platformPostId: `klaviyo_${Date.now()}`,
      };
    } else {
      return {
        platform: 'klaviyo',
        success: false,
        error: 'Failed to send via Klaviyo',
      };
    }
  } catch (error) {
    return {
      platform: 'klaviyo',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown Klaviyo API error',
    };
  }
} 