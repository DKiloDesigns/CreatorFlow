import { Post, SocialAccount } from '@prisma/client';
import { PlatformResult } from '../publishing';
import { decrypt } from '@/lib/crypto';

export interface NotionPostData {
  title: string;
  content: string;
  databaseId?: string;
  properties?: any;
}

export class NotionPublisher {
  private accessToken: string;

  constructor(account: SocialAccount) {
    const decryptedToken = decrypt(account.encryptedAccessToken || '');
    if (!decryptedToken) {
      throw new Error('No valid Notion access token found');
    }
    this.accessToken = decryptedToken;
  }

  async post(data: NotionPostData): Promise<boolean> {
    try {
      const databaseId = data.databaseId || process.env.NOTION_DEFAULT_DATABASE_ID;
      
      if (!databaseId) {
        throw new Error('No Notion database specified');
      }

      const pageData = {
        parent: { database_id: databaseId },
        properties: {
          Name: {
            title: [
              {
                text: {
                  content: data.title,
                },
              },
            ],
          },
          ...data.properties,
        },
        children: [
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: data.content,
                  },
                },
              ],
            },
          },
        ],
      };

      const response = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pageData),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Notion API error: ${error}`);
      }

      console.log('✅ Page created in Notion successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to post to Notion:', error);
      return false;
    }
  }

  async getDatabases(): Promise<Array<{ id: string; title: string }>> {
    try {
      const response = await fetch('https://api.notion.com/v1/search', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filter: {
            property: 'object',
            value: 'database',
          },
        }),
      });

      const result = await response.json();
      
      return result.results.map((db: any) => ({
        id: db.id,
        title: db.title?.[0]?.plain_text || 'Untitled Database',
      }));
    } catch (error) {
      console.error('❌ Failed to get Notion databases:', error);
      return [];
    }
  }

  async validateCredentials(): Promise<boolean> {
    try {
      const response = await fetch('https://api.notion.com/v1/users/me', {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Notion-Version': '2022-06-28',
        },
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export async function publishToNotion(
  post: Post,
  account: SocialAccount
): Promise<PlatformResult> {
  try {
    const publisher = new NotionPublisher(account);
    
    const success = await publisher.post({
      title: post.contentText?.split('\n')[0] || 'CreatorFlow Post',
      content: post.contentText || 'CreatorFlow Post',
      databaseId: (account as any).metadata?.databaseId,
    });

    if (success) {
      return {
        platform: 'notion',
        success: true,
        platformPostId: `notion_${Date.now()}`,
      };
    } else {
      return {
        platform: 'notion',
        success: false,
        error: 'Failed to post to Notion',
      };
    }
  } catch (error) {
    return {
      platform: 'notion',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown Notion API error',
    };
  }
} 