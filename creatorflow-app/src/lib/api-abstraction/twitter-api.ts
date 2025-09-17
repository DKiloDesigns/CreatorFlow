/**
 * Twitter API v2 Integration
 * Handles tweets, media uploads, and analytics
 */

import { PlatformAPIClient, CreatePostData, UploadMediaData, PostResult, MediaResult, UserInfoResult, AnalyticsResult, TokenResult, AnalyticsData } from './platform-api-manager';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TwitterAPI implements PlatformAPIClient {
  private baseUrl = 'https://api.twitter.com/2';
  private uploadUrl = 'https://upload.twitter.com/1.1';
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
   * Create Twitter post (tweet)
   */
  async createPost(data: CreatePostData): Promise<PostResult> {
    try {
      if (!this.accessToken) {
        return { success: false, error: 'No access token available' };
      }

      // Upload media if provided
      let mediaIds: string[] = [];
      if (data.mediaUrls && data.mediaUrls.length > 0) {
        for (const mediaUrl of data.mediaUrls) {
          const mediaResult = await this.uploadMedia({
            file: mediaUrl as any, // This would be a file or URL
            type: 'image',
            caption: data.content,
          });
          
          if (mediaResult.success && mediaResult.mediaId) {
            mediaIds.push(mediaResult.mediaId);
          }
        }
      }

      // Create tweet data
      const tweetData: any = {
        text: data.content,
      };

      if (mediaIds.length > 0) {
        tweetData.media = {
          media_ids: mediaIds,
        };
      }

      const response = await fetch(`${this.baseUrl}/tweets`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tweetData),
      });

      const result = await response.json();

      if (!response.ok) {
        return { 
          success: false, 
          error: result.errors?.[0]?.detail || 'Failed to create tweet' 
        };
      }

      return {
        success: true,
        postId: result.data.id,
        url: `https://twitter.com/user/status/${result.data.id}`,
        platformData: result,
      };
    } catch (error) {
      console.error('Twitter createPost error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Upload media to Twitter
   */
  async uploadMedia(data: UploadMediaData): Promise<MediaResult> {
    try {
      if (!this.accessToken) {
        return { success: false, error: 'No access token available' };
      }

      // Twitter media upload is a two-step process
      // Step 1: Initialize upload
      const initResponse = await fetch(`${this.uploadUrl}/media/upload.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          command: 'INIT',
          total_bytes: data.file instanceof Buffer ? data.file.length.toString() : '0',
          media_type: data.type === 'image' ? 'image/jpeg' : 'video/mp4',
        }),
      });

      const initResult = await initResponse.json();

      if (!initResponse.ok) {
        return { 
          success: false, 
          error: initResult.errors?.[0]?.message || 'Failed to initialize media upload' 
        };
      }

      const mediaId = initResult.media_id_string;

      // Step 2: Upload media data
      const uploadResponse = await fetch(`${this.uploadUrl}/media/upload.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
        body: new FormData().append('command', 'APPEND')
          .append('media_id', mediaId)
          .append('segment_index', '0')
          .append('media_data', data.file as any),
      });

      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok) {
        return { 
          success: false, 
          error: uploadResult.errors?.[0]?.message || 'Failed to upload media data' 
        };
      }

      // Step 3: Finalize upload
      const finalizeResponse = await fetch(`${this.uploadUrl}/media/upload.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          command: 'FINALIZE',
          media_id: mediaId,
        }),
      });

      const finalizeResult = await finalizeResponse.json();

      if (!finalizeResponse.ok) {
        return { 
          success: false, 
          error: finalizeResult.errors?.[0]?.message || 'Failed to finalize media upload' 
        };
      }

      return {
        success: true,
        mediaId: mediaId,
        platformData: finalizeResult,
      };
    } catch (error) {
      console.error('Twitter uploadMedia error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get Twitter user info
   */
  async getUserInfo(): Promise<UserInfoResult> {
    try {
      if (!this.accessToken) {
        return { success: false, error: 'No access token available' };
      }

      const response = await fetch(
        `${this.baseUrl}/users/me?user.fields=id,username,name,profile_image_url,public_metrics`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        return { 
          success: false, 
          error: result.errors?.[0]?.detail || 'Failed to get user info' 
        };
      }

      const user = result.data;
      const metrics = user.public_metrics;

      return {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          displayName: user.name,
          profileImage: user.profile_image_url,
          followers: metrics.followers_count || 0,
          following: metrics.following_count || 0,
        },
      };
    } catch (error) {
      console.error('Twitter getUserInfo error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get Twitter analytics
   */
  async getAnalytics(data: AnalyticsData): Promise<AnalyticsResult> {
    try {
      if (!this.accessToken) {
        return { success: false, error: 'No access token available' };
      }

      if (!data.postId) {
        return { success: false, error: 'Post ID is required for Twitter analytics' };
      }

      const response = await fetch(
        `${this.baseUrl}/tweets/${data.postId}?tweet.fields=public_metrics`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        return { 
          success: false, 
          error: result.errors?.[0]?.detail || 'Failed to get analytics' 
        };
      }

      const metrics = result.data.public_metrics;

      return {
        success: true,
        analytics: {
          impressions: metrics.impression_count || 0,
          likes: metrics.like_count || 0,
          comments: metrics.reply_count || 0,
          shares: metrics.retweet_count || 0,
          clicks: metrics.url_link_clicks || 0,
        },
      };
    } catch (error) {
      console.error('Twitter getAnalytics error:', error);
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
      // Get refresh token from database
      const account = await prisma.socialAccount.findFirst({
        where: {
          platform: 'twitter',
          encryptedAccessToken: this.accessToken,
        },
      });

      if (!account?.encryptedRefreshToken) {
        return { success: false, error: 'No refresh token available' };
      }

      const refreshToken = account.encryptedRefreshToken; // TODO: Decrypt this

      const response = await fetch('https://api.twitter.com/2/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: process.env.TWITTER_CLIENT_ID!,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        return { 
          success: false, 
          error: result.error_description || 'Failed to refresh token' 
        };
      }

      return {
        success: true,
        accessToken: result.access_token,
        refreshToken: result.refresh_token || refreshToken,
        expiresAt: new Date(Date.now() + (result.expires_in * 1000)),
      };
    } catch (error) {
      console.error('Twitter refreshToken error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}
