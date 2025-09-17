/**
 * Platform API Manager - Unified API abstraction layer
 * Handles all social media platform API integrations with consistent interface
 */

import { PrismaClient } from '@prisma/client';
import { InstagramAPI } from './instagram-api';
import { YouTubeAPI } from './youtube-api';
import { TwitterAPI } from './twitter-api';
import { TikTokAPI } from './tiktok-api';
import { LinkedInAPI } from './linkedin-api';

const prisma = new PrismaClient();

export interface PlatformAPIClient {
  createPost(data: CreatePostData): Promise<PostResult>;
  uploadMedia(data: UploadMediaData): Promise<MediaResult>;
  getUserInfo(): Promise<UserInfoResult>;
  getAnalytics(data: AnalyticsData): Promise<AnalyticsResult>;
  refreshToken(): Promise<TokenResult>;
}

export interface CreatePostData {
  content: string;
  mediaUrls?: string[];
  hashtags?: string[];
  location?: string;
  scheduledTime?: Date;
  platformSpecific?: Record<string, any>;
}

export interface UploadMediaData {
  file: File | Buffer;
  type: 'image' | 'video' | 'carousel';
  caption?: string;
  altText?: string;
}

export interface PostResult {
  success: boolean;
  postId?: string;
  url?: string;
  error?: string;
  platformData?: Record<string, any>;
}

export interface MediaResult {
  success: boolean;
  mediaId?: string;
  url?: string;
  error?: string;
  platformData?: Record<string, any>;
}

export interface UserInfoResult {
  success: boolean;
  user?: {
    id: string;
    username: string;
    displayName: string;
    profileImage?: string;
    followers?: number;
    following?: number;
  };
  error?: string;
}

export interface AnalyticsResult {
  success: boolean;
  analytics?: {
    impressions?: number;
    reach?: number;
    engagement?: number;
    likes?: number;
    comments?: number;
    shares?: number;
    saves?: number;
    clicks?: number;
    views?: number;
    watchTime?: number;
  };
  error?: string;
}

export interface TokenResult {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  error?: string;
}

export interface AnalyticsData {
  postId?: string;
  startDate?: Date;
  endDate?: Date;
  metrics?: string[];
}

export class PlatformAPIManager {
  private clients: Map<string, PlatformAPIClient> = new Map();

  constructor() {
    this.initializeClients();
  }

  private initializeClients() {
    this.clients.set('instagram', new InstagramAPI());
    this.clients.set('youtube', new YouTubeAPI());
    this.clients.set('twitter', new TwitterAPI());
    this.clients.set('tiktok', new TikTokAPI());
    this.clients.set('linkedin', new LinkedInAPI());
  }

  /**
   * Get API client for specific platform
   */
  async getClient(platform: string, userId: string): Promise<PlatformAPIClient | null> {
    try {
      // Get user's social account for this platform
      const account = await prisma.socialAccount.findFirst({
        where: {
          userId,
          platform: platform.toLowerCase(),
          status: 'active',
        },
      });

      if (!account) {
        throw new Error(`No active ${platform} account found for user`);
      }

      // Check if token is expired and refresh if needed
      if (account.tokenExpiresAt && account.tokenExpiresAt < new Date()) {
        await this.refreshToken(platform, account.id);
      }

      const client = this.clients.get(platform.toLowerCase());
      if (!client) {
        throw new Error(`Unsupported platform: ${platform}`);
      }

      return client;
    } catch (error) {
      console.error(`Failed to get ${platform} client:`, error);
      return null;
    }
  }

  /**
   * Create post on platform
   */
  async createPost(platform: string, userId: string, data: CreatePostData): Promise<PostResult> {
    try {
      const client = await this.getClient(platform, userId);
      if (!client) {
        return { success: false, error: 'Failed to get platform client' };
      }

      return await client.createPost(data);
    } catch (error) {
      console.error(`Failed to create ${platform} post:`, error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Upload media to platform
   */
  async uploadMedia(platform: string, userId: string, data: UploadMediaData): Promise<MediaResult> {
    try {
      const client = await this.getClient(platform, userId);
      if (!client) {
        return { success: false, error: 'Failed to get platform client' };
      }

      return await client.uploadMedia(data);
    } catch (error) {
      console.error(`Failed to upload ${platform} media:`, error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Get user info from platform
   */
  async getUserInfo(platform: string, userId: string): Promise<UserInfoResult> {
    try {
      const client = await this.getClient(platform, userId);
      if (!client) {
        return { success: false, error: 'Failed to get platform client' };
      }

      return await client.getUserInfo();
    } catch (error) {
      console.error(`Failed to get ${platform} user info:`, error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Get analytics from platform
   */
  async getAnalytics(platform: string, userId: string, data: AnalyticsData): Promise<AnalyticsResult> {
    try {
      const client = await this.getClient(platform, userId);
      if (!client) {
        return { success: false, error: 'Failed to get platform client' };
      }

      return await client.getAnalytics(data);
    } catch (error) {
      console.error(`Failed to get ${platform} analytics:`, error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(platform: string, accountId: string): Promise<TokenResult> {
    try {
      const account = await prisma.socialAccount.findUnique({
        where: { id: accountId },
      });

      if (!account) {
        throw new Error('Account not found');
      }

      const client = this.clients.get(platform.toLowerCase());
      if (!client) {
        throw new Error(`Unsupported platform: ${platform}`);
      }

      const result = await client.refreshToken();
      
      if (result.success && result.accessToken) {
        // Update account with new tokens
        await prisma.socialAccount.update({
          where: { id: accountId },
          data: {
            encryptedAccessToken: result.accessToken, // TODO: Encrypt this
            encryptedRefreshToken: result.refreshToken || account.encryptedRefreshToken,
            tokenExpiresAt: result.expiresAt || new Date(Date.now() + 3600 * 1000),
            status: 'active',
          },
        });
      }

      return result;
    } catch (error) {
      console.error(`Failed to refresh ${platform} token:`, error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Get supported platforms
   */
  getSupportedPlatforms(): string[] {
    return Array.from(this.clients.keys());
  }

  /**
   * Check platform health
   */
  async checkPlatformHealth(platform: string, userId: string): Promise<{ healthy: boolean; error?: string }> {
    try {
      const client = await this.getClient(platform, userId);
      if (!client) {
        return { healthy: false, error: 'Client not available' };
      }

      // Try to get user info as a health check
      const userInfo = await client.getUserInfo();
      return { healthy: userInfo.success, error: userInfo.error };
    } catch (error) {
      return { 
        healthy: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}

// Export singleton instance
export const platformAPIManager = new PlatformAPIManager();
