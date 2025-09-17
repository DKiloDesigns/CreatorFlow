/**
 * YouTube Data API v3 Integration
 * Handles YouTube video uploads, playlist management, and analytics
 */

import { PlatformAPIClient, CreatePostData, UploadMediaData, PostResult, MediaResult, UserInfoResult, AnalyticsResult, TokenResult, AnalyticsData } from './platform-api-manager';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class YouTubeAPI implements PlatformAPIClient {
  private baseUrl = 'https://www.googleapis.com/youtube/v3';
  private uploadUrl = 'https://www.googleapis.com/upload/youtube/v3';
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
   * Create YouTube video post
   */
  async createPost(data: CreatePostData): Promise<PostResult> {
    try {
      if (!this.accessToken) {
        return { success: false, error: 'No access token available' };
      }

      // For YouTube, we need to upload a video file
      if (!data.mediaUrls || data.mediaUrls.length === 0) {
        return { success: false, error: 'YouTube requires a video file' };
      }

      // Upload the video
      const mediaResult = await this.uploadMedia({
        file: data.mediaUrls[0] as any, // This would be a video file
        type: 'video',
        caption: data.content,
      });

      if (!mediaResult.success || !mediaResult.mediaId) {
        return { success: false, error: mediaResult.error || 'Failed to upload video' };
      }

      return {
        success: true,
        postId: mediaResult.mediaId,
        url: `https://www.youtube.com/watch?v=${mediaResult.mediaId}`,
        platformData: mediaResult.platformData,
      };
    } catch (error) {
      console.error('YouTube createPost error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Upload video to YouTube
   */
  async uploadMedia(data: UploadMediaData): Promise<MediaResult> {
    try {
      if (!this.accessToken) {
        return { success: false, error: 'No access token available' };
      }

      if (data.type !== 'video') {
        return { success: false, error: 'YouTube only supports video uploads' };
      }

      // Get the channel ID first
      const channelId = await this.getChannelId();
      if (!channelId) {
        return { success: false, error: 'YouTube channel not found' };
      }

      // Create video metadata
      const videoMetadata = {
        snippet: {
          title: data.caption || 'Untitled Video',
          description: data.altText || '',
          tags: this.extractHashtags(data.caption || ''),
          categoryId: '22', // People & Blogs
        },
        status: {
          privacyStatus: 'public',
        },
      };

      // Step 1: Create upload session
      const uploadResponse = await fetch(
        `${this.uploadUrl}/videos?part=snippet,status&uploadType=resumable`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
            'X-Upload-Content-Type': 'video/*',
            'X-Upload-Content-Length': data.file instanceof Buffer ? data.file.length.toString() : '0',
          },
          body: JSON.stringify(videoMetadata),
        }
      );

      if (!uploadResponse.ok) {
        const error = await uploadResponse.json();
        return { 
          success: false, 
          error: error.error?.message || 'Failed to create upload session' 
        };
      }

      const uploadUrl = uploadResponse.headers.get('Location');
      if (!uploadUrl) {
        return { success: false, error: 'No upload URL received' };
      }

      // Step 2: Upload the video file
      const videoResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'video/*',
        },
        body: data.file,
      });

      if (!videoResponse.ok) {
        const error = await videoResponse.json();
        return { 
          success: false, 
          error: error.error?.message || 'Failed to upload video' 
        };
      }

      const videoResult = await videoResponse.json();

      return {
        success: true,
        mediaId: videoResult.id,
        url: `https://www.youtube.com/watch?v=${videoResult.id}`,
        platformData: videoResult,
      };
    } catch (error) {
      console.error('YouTube uploadMedia error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get YouTube user info
   */
  async getUserInfo(): Promise<UserInfoResult> {
    try {
      if (!this.accessToken) {
        return { success: false, error: 'No access token available' };
      }

      const channelId = await this.getChannelId();
      if (!channelId) {
        return { success: false, error: 'YouTube channel not found' };
      }

      const response = await fetch(
        `${this.baseUrl}/channels?part=snippet,statistics&id=${channelId}&access_token=${this.accessToken}`
      );

      const result = await response.json();

      if (!response.ok) {
        return { 
          success: false, 
          error: result.error?.message || 'Failed to get user info' 
        };
      }

      if (!result.items || result.items.length === 0) {
        return { success: false, error: 'Channel not found' };
      }

      const channel = result.items[0];
      const stats = channel.statistics;

      return {
        success: true,
        user: {
          id: channel.id,
          username: channel.snippet.customUrl || channel.snippet.title,
          displayName: channel.snippet.title,
          profileImage: channel.snippet.thumbnails?.high?.url,
          followers: parseInt(stats.subscriberCount) || 0,
          following: 0, // YouTube doesn't provide following count
        },
      };
    } catch (error) {
      console.error('YouTube getUserInfo error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get YouTube analytics
   */
  async getAnalytics(data: AnalyticsData): Promise<AnalyticsResult> {
    try {
      if (!this.accessToken) {
        return { success: false, error: 'No access token available' };
      }

      const channelId = await this.getChannelId();
      if (!channelId) {
        return { success: false, error: 'YouTube channel not found' };
      }

      // Get video analytics
      const analyticsResponse = await fetch(
        `${this.baseUrl}/videos?part=statistics&id=${data.postId || channelId}&access_token=${this.accessToken}`
      );

      const analyticsResult = await analyticsResponse.json();

      if (!analyticsResponse.ok) {
        return { 
          success: false, 
          error: analyticsResult.error?.message || 'Failed to get analytics' 
        };
      }

      if (!analyticsResult.items || analyticsResult.items.length === 0) {
        return { success: false, error: 'No analytics data found' };
      }

      const stats = analyticsResult.items[0].statistics;

      return {
        success: true,
        analytics: {
          views: parseInt(stats.viewCount) || 0,
          likes: parseInt(stats.likeCount) || 0,
          comments: parseInt(stats.commentCount) || 0,
        },
      };
    } catch (error) {
      console.error('YouTube getAnalytics error:', error);
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
          platform: 'youtube',
          encryptedAccessToken: this.accessToken,
        },
      });

      if (!account?.encryptedRefreshToken) {
        return { success: false, error: 'No refresh token available' };
      }

      const refreshToken = account.encryptedRefreshToken; // TODO: Decrypt this

      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        return { 
          success: false, 
          error: result.error?.message || 'Failed to refresh token' 
        };
      }

      return {
        success: true,
        accessToken: result.access_token,
        refreshToken: result.refresh_token || refreshToken,
        expiresAt: new Date(Date.now() + (result.expires_in * 1000)),
      };
    } catch (error) {
      console.error('YouTube refreshToken error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get YouTube channel ID
   */
  private async getChannelId(): Promise<string | null> {
    try {
      if (!this.accessToken) {
        return null;
      }

      const response = await fetch(
        `${this.baseUrl}/channels?part=id&mine=true&access_token=${this.accessToken}`
      );

      const result = await response.json();

      if (!response.ok || !result.items || result.items.length === 0) {
        return null;
      }

      return result.items[0].id;
    } catch (error) {
      console.error('Failed to get YouTube channel ID:', error);
      return null;
    }
  }

  /**
   * Extract hashtags from text
   */
  private extractHashtags(text: string): string[] {
    const hashtagRegex = /#[\w\u0590-\u05ff]+/g;
    return text.match(hashtagRegex) || [];
  }
}
