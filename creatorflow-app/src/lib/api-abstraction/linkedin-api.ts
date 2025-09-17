/**
 * LinkedIn API Integration
 * Handles LinkedIn posts and analytics
 */

import { PlatformAPIClient, CreatePostData, UploadMediaData, PostResult, MediaResult, UserInfoResult, AnalyticsResult, TokenResult, AnalyticsData } from './platform-api-manager';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class LinkedInAPI implements PlatformAPIClient {
  private baseUrl = 'https://api.linkedin.com/v2';
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
   * Create LinkedIn post
   */
  async createPost(data: CreatePostData): Promise<PostResult> {
    try {
      if (!this.accessToken) {
        return { success: false, error: 'No access token available' };
      }

      // Get the user's LinkedIn profile ID
      const profileId = await this.getProfileId();
      if (!profileId) {
        return { success: false, error: 'LinkedIn profile not found' };
      }

      // Upload media if provided
      let mediaId: string | null = null;
      if (data.mediaUrls && data.mediaUrls.length > 0) {
        const mediaResult = await this.uploadMedia({
          file: data.mediaUrls[0] as any, // This would be a file or URL
          type: 'image',
          caption: data.content,
        });
        
        if (mediaResult.success && mediaResult.mediaId) {
          mediaId = mediaResult.mediaId;
        }
      }

      // Create post data
      const postData: any = {
        author: `urn:li:person:${profileId}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: data.content,
            },
            shareMediaCategory: mediaId ? 'IMAGE' : 'NONE',
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
      };

      if (mediaId) {
        postData.specificContent['com.linkedin.ugc.ShareContent'].media = [
          {
            status: 'READY',
            description: {
              text: data.content,
            },
            media: mediaId,
            title: {
              text: data.content,
            },
          },
        ];
      }

      const response = await fetch(`${this.baseUrl}/ugcPosts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
        },
        body: JSON.stringify(postData),
      });

      const result = await response.json();

      if (!response.ok) {
        return { 
          success: false, 
          error: result.message || 'Failed to create LinkedIn post' 
        };
      }

      return {
        success: true,
        postId: result.id,
        url: `https://www.linkedin.com/feed/update/${result.id}/`,
        platformData: result,
      };
    } catch (error) {
      console.error('LinkedIn createPost error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Upload media to LinkedIn
   */
  async uploadMedia(data: UploadMediaData): Promise<MediaResult> {
    try {
      if (!this.accessToken) {
        return { success: false, error: 'No access token available' };
      }

      // LinkedIn media upload is a two-step process
      // Step 1: Register upload
      const registerResponse = await fetch(`${this.baseUrl}/assets?action=registerUpload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
        },
        body: JSON.stringify({
          registerUploadRequest: {
            recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
            owner: await this.getProfileId(),
            serviceRelationships: [
              {
                relationshipType: 'OWNER',
                identifier: 'urn:li:userGeneratedContent',
              },
            ],
          },
        }),
      });

      const registerResult = await registerResponse.json();

      if (!registerResponse.ok) {
        return { 
          success: false, 
          error: registerResult.message || 'Failed to register media upload' 
        };
      }

      const uploadUrl = registerResult.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
      const assetId = registerResult.value.asset;

      // Step 2: Upload the file
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
        body: data.file,
      });

      if (!uploadResponse.ok) {
        return { 
          success: false, 
          error: 'Failed to upload media file' 
        };
      }

      return {
        success: true,
        mediaId: assetId,
        platformData: registerResult,
      };
    } catch (error) {
      console.error('LinkedIn uploadMedia error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get LinkedIn user info
   */
  async getUserInfo(): Promise<UserInfoResult> {
    try {
      if (!this.accessToken) {
        return { success: false, error: 'No access token available' };
      }

      const profileId = await this.getProfileId();
      if (!profileId) {
        return { success: false, error: 'LinkedIn profile not found' };
      }

      const response = await fetch(
        `${this.baseUrl}/people/(id:${profileId})?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))`,
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
          error: result.message || 'Failed to get user info' 
        };
      }

      const profilePicture = result.profilePicture?.['displayImage~']?.elements?.[0]?.identifiers?.[0]?.identifier;

      return {
        success: true,
        user: {
          id: result.id,
          username: `${result.firstName.localized.en_US} ${result.lastName.localized.en_US}`,
          displayName: `${result.firstName.localized.en_US} ${result.lastName.localized.en_US}`,
          profileImage: profilePicture,
          followers: 0, // LinkedIn doesn't provide follower count in basic API
          following: 0,
        },
      };
    } catch (error) {
      console.error('LinkedIn getUserInfo error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get LinkedIn analytics
   */
  async getAnalytics(data: AnalyticsData): Promise<AnalyticsResult> {
    try {
      if (!this.accessToken) {
        return { success: false, error: 'No access token available' };
      }

      // LinkedIn analytics require specific post ID
      if (!data.postId) {
        return { success: false, error: 'Post ID is required for LinkedIn analytics' };
      }

      const response = await fetch(
        `${this.baseUrl}/socialActions/${data.postId}/comments?count=100`,
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
          error: result.message || 'Failed to get analytics' 
        };
      }

      // LinkedIn analytics are limited in the basic API
      // We can only get comment count and basic engagement
      const comments = result.elements || [];

      return {
        success: true,
        analytics: {
          comments: comments.length,
          // LinkedIn doesn't provide likes, shares, or views in basic API
        },
      };
    } catch (error) {
      console.error('LinkedIn getAnalytics error:', error);
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
          platform: 'linkedin',
          encryptedAccessToken: this.accessToken,
        },
      });

      if (!account?.encryptedRefreshToken) {
        return { success: false, error: 'No refresh token available' };
      }

      const refreshToken = account.encryptedRefreshToken; // TODO: Decrypt this

      const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: process.env.LINKEDIN_CLIENT_ID!,
          client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
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
      console.error('LinkedIn refreshToken error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get LinkedIn profile ID
   */
  private async getProfileId(): Promise<string | null> {
    try {
      if (!this.accessToken) {
        return null;
      }

      const response = await fetch(
        `${this.baseUrl}/people/~?projection=(id)`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        return null;
      }

      return result.id;
    } catch (error) {
      console.error('Failed to get LinkedIn profile ID:', error);
      return null;
    }
  }
}
