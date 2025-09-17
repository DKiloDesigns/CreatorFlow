/**
 * Instagram Graph API Integration
 * Handles Instagram posts, stories, reels, and analytics
 */

import { PlatformAPIClient, CreatePostData, UploadMediaData, PostResult, MediaResult, UserInfoResult, AnalyticsResult, TokenResult, AnalyticsData } from './platform-api-manager';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class InstagramAPI implements PlatformAPIClient {
  private baseUrl = 'https://graph.facebook.com/v18.0';
  private accessToken: string | null = null;

  constructor() {
    // Access token will be set by the platform manager
  }

  /**
   * Set access token for API calls
   */
  setAccessToken(token: string) {
    this.accessToken = token;
  }

  /**
   * Create Instagram post
   */
  async createPost(data: CreatePostData): Promise<PostResult> {
    try {
      if (!this.accessToken) {
        return { success: false, error: 'No access token available' };
      }

      // First, get the Instagram Business Account ID
      const accountId = await this.getInstagramAccountId();
      if (!accountId) {
        return { success: false, error: 'Instagram Business Account not found' };
      }

      // If media is provided, upload it first
      let mediaId: string | null = null;
      if (data.mediaUrls && data.mediaUrls.length > 0) {
        const mediaResult = await this.uploadMedia({
          file: data.mediaUrls[0] as any, // This would be a URL in this case
          type: 'image',
          caption: data.content,
        });
        
        if (!mediaResult.success || !mediaResult.mediaId) {
          return { success: false, error: mediaResult.error || 'Failed to upload media' };
        }
        
        mediaId = mediaResult.mediaId;
      }

      // Create the post
      const postData: any = {
        message: data.content,
        access_token: this.accessToken,
      };

      if (mediaId) {
        postData.object_attachment = mediaId;
      }

      const response = await fetch(`${this.baseUrl}/${accountId}/feed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(postData),
      });

      const result = await response.json();

      if (!response.ok) {
        return { 
          success: false, 
          error: result.error?.message || 'Failed to create Instagram post' 
        };
      }

      return {
        success: true,
        postId: result.id,
        url: `https://www.instagram.com/p/${result.id}/`,
        platformData: result,
      };
    } catch (error) {
      console.error('Instagram createPost error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Upload media to Instagram
   */
  async uploadMedia(data: UploadMediaData): Promise<MediaResult> {
    try {
      if (!this.accessToken) {
        return { success: false, error: 'No access token available' };
      }

      const accountId = await this.getInstagramAccountId();
      if (!accountId) {
        return { success: false, error: 'Instagram Business Account not found' };
      }

      // For Instagram, we need to create a media container first
      const containerData: any = {
        access_token: this.accessToken,
        image_url: data.file, // Assuming this is a URL
      };

      if (data.caption) {
        containerData.caption = data.caption;
      }

      // Create media container
      const containerResponse = await fetch(`${this.baseUrl}/${accountId}/media`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(containerData),
      });

      const containerResult = await containerResponse.json();

      if (!containerResponse.ok) {
        return { 
          success: false, 
          error: containerResult.error?.message || 'Failed to create media container' 
        };
      }

      // Publish the media
      const publishResponse = await fetch(`${this.baseUrl}/${accountId}/media_publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          creation_id: containerResult.id,
          access_token: this.accessToken,
        }),
      });

      const publishResult = await publishResponse.json();

      if (!publishResponse.ok) {
        return { 
          success: false, 
          error: publishResult.error?.message || 'Failed to publish media' 
        };
      }

      return {
        success: true,
        mediaId: publishResult.id,
        url: `https://www.instagram.com/p/${publishResult.id}/`,
        platformData: publishResult,
      };
    } catch (error) {
      console.error('Instagram uploadMedia error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get Instagram user info
   */
  async getUserInfo(): Promise<UserInfoResult> {
    try {
      if (!this.accessToken) {
        return { success: false, error: 'No access token available' };
      }

      const accountId = await this.getInstagramAccountId();
      if (!accountId) {
        return { success: false, error: 'Instagram Business Account not found' };
      }

      const response = await fetch(
        `${this.baseUrl}/${accountId}?fields=id,username,name,profile_picture_url,followers_count,follows_count,media_count&access_token=${this.accessToken}`
      );

      const result = await response.json();

      if (!response.ok) {
        return { 
          success: false, 
          error: result.error?.message || 'Failed to get user info' 
        };
      }

      return {
        success: true,
        user: {
          id: result.id,
          username: result.username,
          displayName: result.name,
          profileImage: result.profile_picture_url,
          followers: result.followers_count,
          following: result.follows_count,
        },
      };
    } catch (error) {
      console.error('Instagram getUserInfo error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get Instagram analytics
   */
  async getAnalytics(data: AnalyticsData): Promise<AnalyticsResult> {
    try {
      if (!this.accessToken) {
        return { success: false, error: 'No access token available' };
      }

      const accountId = await this.getInstagramAccountId();
      if (!accountId) {
        return { success: false, error: 'Instagram Business Account not found' };
      }

      // Get insights for the account
      const insightsResponse = await fetch(
        `${this.baseUrl}/${accountId}/insights?metric=impressions,reach,profile_views,website_clicks&period=day&access_token=${this.accessToken}`
      );

      const insightsResult = await insightsResponse.json();

      if (!insightsResponse.ok) {
        return { 
          success: false, 
          error: insightsResult.error?.message || 'Failed to get analytics' 
        };
      }

      // Process insights data
      const analytics: any = {};
      insightsResult.data.forEach((insight: any) => {
        if (insight.name === 'impressions') analytics.impressions = insight.values[0]?.value || 0;
        if (insight.name === 'reach') analytics.reach = insight.values[0]?.value || 0;
        if (insight.name === 'profile_views') analytics.profileViews = insight.values[0]?.value || 0;
        if (insight.name === 'website_clicks') analytics.clicks = insight.values[0]?.value || 0;
      });

      return {
        success: true,
        analytics,
      };
    } catch (error) {
      console.error('Instagram getAnalytics error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<TokenResult> {
    try {
      // Instagram uses long-lived tokens that don't need refresh
      // But we can validate the current token
      const response = await fetch(
        `${this.baseUrl}/me?access_token=${this.accessToken}`
      );

      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, error: 'Token is invalid or expired' };
      }
    } catch (error) {
      console.error('Instagram refreshToken error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get Instagram Business Account ID
   */
  private async getInstagramAccountId(): Promise<string | null> {
    try {
      if (!this.accessToken) {
        return null;
      }

      // First get the Facebook page
      const pagesResponse = await fetch(
        `${this.baseUrl}/me/accounts?access_token=${this.accessToken}`
      );

      const pagesResult = await pagesResponse.json();

      if (!pagesResponse.ok || !pagesResult.data || pagesResult.data.length === 0) {
        return null;
      }

      // Get the first page's Instagram account
      const pageId = pagesResult.data[0].id;
      const instagramResponse = await fetch(
        `${this.baseUrl}/${pageId}?fields=instagram_business_account&access_token=${this.accessToken}`
      );

      const instagramResult = await instagramResponse.json();

      if (!instagramResponse.ok || !instagramResult.instagram_business_account) {
        return null;
      }

      return instagramResult.instagram_business_account.id;
    } catch (error) {
      console.error('Failed to get Instagram account ID:', error);
      return null;
    }
  }
}
