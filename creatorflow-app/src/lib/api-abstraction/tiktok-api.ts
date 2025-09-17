/**
 * TikTok for Business API Integration
 * Handles TikTok video uploads and analytics
 */

import { PlatformAPIClient, CreatePostData, UploadMediaData, PostResult, MediaResult, UserInfoResult, AnalyticsResult, TokenResult, AnalyticsData } from './platform-api-manager';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TikTokAPI implements PlatformAPIClient {
  private baseUrl = 'https://open.tiktokapis.com/v2';
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
   * Create TikTok video post
   */
  async createPost(data: CreatePostData): Promise<PostResult> {
    try {
      if (!this.accessToken) {
        return { success: false, error: 'No access token available' };
      }

      // For TikTok, we need to upload a video file
      if (!data.mediaUrls || data.mediaUrls.length === 0) {
        return { success: false, error: 'TikTok requires a video file' };
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
        url: `https://www.tiktok.com/@user/video/${mediaResult.mediaId}`,
        platformData: mediaResult.platformData,
      };
    } catch (error) {
      console.error('TikTok createPost error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Upload video to TikTok
   */
  async uploadMedia(data: UploadMediaData): Promise<MediaResult> {
    try {
      if (!this.accessToken) {
        return { success: false, error: 'No access token available' };
      }

      if (data.type !== 'video') {
        return { success: false, error: 'TikTok only supports video uploads' };
      }

      // TikTok video upload is a multi-step process
      // Step 1: Initialize upload
      const initResponse = await fetch(`${this.baseUrl}/post/publish/video/init/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source_info: {
            source: 'FILE_UPLOAD',
            video_size: data.file instanceof Buffer ? data.file.length : 0,
            chunk_size: 10000000, // 10MB chunks
            total_chunk_count: Math.ceil((data.file instanceof Buffer ? data.file.length : 0) / 10000000),
          },
          post_info: {
            title: data.caption || 'Untitled Video',
            description: data.altText || '',
            privacy_level: 'PUBLIC_TO_EVERYONE',
            disable_duet: false,
            disable_comment: false,
            disable_stitch: false,
            video_cover_timestamp_ms: 1000,
          },
        }),
      });

      const initResult = await initResponse.json();

      if (!initResponse.ok) {
        return { 
          success: false, 
          error: initResult.error?.message || 'Failed to initialize video upload' 
        };
      }

      const publishId = initResult.data.publish_id;
      const uploadUrl = initResult.data.upload_url;

      // Step 2: Upload video file in chunks
      const chunkSize = 10000000; // 10MB
      const totalChunks = Math.ceil((data.file instanceof Buffer ? data.file.length : 0) / chunkSize);
      
      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, data.file instanceof Buffer ? data.file.length : 0);
        const chunk = data.file instanceof Buffer ? data.file.slice(start, end) : Buffer.alloc(0);

        const chunkResponse = await fetch(uploadUrl, {
          method: 'PUT',
          headers: {
            'Content-Range': `bytes ${start}-${end - 1}/${data.file instanceof Buffer ? data.file.length : 0}`,
            'Content-Type': 'video/mp4',
          },
          body: chunk,
        });

        if (!chunkResponse.ok) {
          return { 
            success: false, 
            error: `Failed to upload chunk ${i + 1}/${totalChunks}` 
          };
        }
      }

      // Step 3: Publish the video
      const publishResponse = await fetch(`${this.baseUrl}/post/publish/video/publish/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          publish_id: publishId,
        }),
      });

      const publishResult = await publishResponse.json();

      if (!publishResponse.ok) {
        return { 
          success: false, 
          error: publishResult.error?.message || 'Failed to publish video' 
        };
      }

      return {
        success: true,
        mediaId: publishResult.data.publish_id,
        url: `https://www.tiktok.com/@user/video/${publishResult.data.publish_id}`,
        platformData: publishResult,
      };
    } catch (error) {
      console.error('TikTok uploadMedia error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get TikTok user info
   */
  async getUserInfo(): Promise<UserInfoResult> {
    try {
      if (!this.accessToken) {
        return { success: false, error: 'No access token available' };
      }

      const response = await fetch(
        `${this.baseUrl}/user/info/?fields=open_id,union_id,avatar_url,display_name,follower_count,following_count,likes_count,video_count`,
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
          error: result.error?.message || 'Failed to get user info' 
        };
      }

      const user = result.data.user;

      return {
        success: true,
        user: {
          id: user.open_id,
          username: user.display_name,
          displayName: user.display_name,
          profileImage: user.avatar_url,
          followers: user.follower_count || 0,
          following: user.following_count || 0,
        },
      };
    } catch (error) {
      console.error('TikTok getUserInfo error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get TikTok analytics
   */
  async getAnalytics(data: AnalyticsData): Promise<AnalyticsResult> {
    try {
      if (!this.accessToken) {
        return { success: false, error: 'No access token available' };
      }

      // TikTok analytics require specific date ranges
      const startDate = data.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
      const endDate = data.endDate || new Date();

      const response = await fetch(
        `${this.baseUrl}/video/query/?fields=id,create_time,cover_image_url,share_url,title,video_description,like_count,comment_count,share_count,view_count&start_date=${startDate.toISOString().split('T')[0]}&end_date=${endDate.toISOString().split('T')[0]}`,
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
          error: result.error?.message || 'Failed to get analytics' 
        };
      }

      // Aggregate analytics from all videos
      const videos = result.data.videos || [];
      const analytics = videos.reduce((acc: any, video: any) => {
        acc.views = (acc.views || 0) + (video.view_count || 0);
        acc.likes = (acc.likes || 0) + (video.like_count || 0);
        acc.comments = (acc.comments || 0) + (video.comment_count || 0);
        acc.shares = (acc.shares || 0) + (video.share_count || 0);
        return acc;
      }, {});

      return {
        success: true,
        analytics,
      };
    } catch (error) {
      console.error('TikTok getAnalytics error:', error);
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
          platform: 'tiktok',
          encryptedAccessToken: this.accessToken,
        },
      });

      if (!account?.encryptedRefreshToken) {
        return { success: false, error: 'No refresh token available' };
      }

      const refreshToken = account.encryptedRefreshToken; // TODO: Decrypt this

      const response = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_key: process.env.TIKTOK_CLIENT_KEY!,
          client_secret: process.env.TIKTOK_CLIENT_SECRET!,
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
      console.error('TikTok refreshToken error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}
