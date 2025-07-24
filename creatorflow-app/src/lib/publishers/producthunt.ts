import { Post, SocialAccount } from '@prisma/client';
import { PlatformResult } from '../publishing';
import { decrypt } from '@/lib/crypto';

export interface ProductHuntPostData {
  title: string;
  description: string;
  url?: string;
  category?: string;
}

export class ProductHuntPublisher {
  private accessToken: string;

  constructor(account: SocialAccount) {
    const decryptedToken = decrypt(account.encryptedAccessToken || '');
    if (!decryptedToken) {
      throw new Error('No valid Product Hunt access token found');
    }
    this.accessToken = decryptedToken;
  }

  async post(data: ProductHuntPostData): Promise<boolean> {
    try {
      // Product Hunt API for posting products
      const productData = {
        name: data.title,
        tagline: data.description,
        ...(data.url && { url: data.url }),
        ...(data.category && { category: data.category }),
      };

      const response = await fetch('https://api.producthunt.com/v2/api/graphql', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation CreatePost($input: CreatePostInput!) {
              createPost(input: $input) {
                post {
                  id
                  name
                  tagline
                }
              }
            }
          `,
          variables: {
            input: productData,
          },
        }),
      });

      const result = await response.json();
      
      if (result.errors) {
        throw new Error(`Product Hunt API error: ${result.errors[0].message}`);
      }

      console.log('✅ Product posted to Product Hunt successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to post to Product Hunt:', error);
      return false;
    }
  }

  async validateCredentials(): Promise<boolean> {
    try {
      const response = await fetch('https://api.producthunt.com/v2/api/graphql', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query {
              me {
                id
                name
              }
            }
          `,
        }),
      });

      const result = await response.json();
      return !result.errors;
    } catch (error) {
      return false;
    }
  }
}

export async function publishToProductHunt(
  post: Post,
  account: SocialAccount
): Promise<PlatformResult> {
  try {
    const publisher = new ProductHuntPublisher(account);
    
    const success = await publisher.post({
      title: post.contentText?.split('\n')[0] || 'CreatorFlow Post',
      description: post.contentText || 'CreatorFlow Post',
      url: post.mediaUrls?.[0],
    });

    if (success) {
      return {
        platform: 'producthunt',
        success: true,
        platformPostId: `producthunt_${Date.now()}`,
      };
    } else {
      return {
        platform: 'producthunt',
        success: false,
        error: 'Failed to post to Product Hunt',
      };
    }
  } catch (error) {
    return {
      platform: 'producthunt',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown Product Hunt API error',
    };
  }
} 