/**
 * Content Publishing Service
 * Handles cross-platform content publishing using the unified API
 */

import { platformAPIManager } from '../api-abstraction/platform-api-manager';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface PublishContentData {
  content: string;
  mediaUrls?: string[];
  hashtags?: string[];
  location?: string;
  scheduledTime?: Date;
  platforms: string[];
  userId: string;
}

export interface PublishResult {
  success: boolean;
  results: {
    platform: string;
    success: boolean;
    postId?: string;
    url?: string;
    error?: string;
  }[];
  totalSuccess: number;
  totalFailed: number;
}

export interface ScheduledPost {
  id: string;
  content: string;
  mediaUrls: string[];
  platforms: string[];
  scheduledTime: Date;
  status: 'pending' | 'published' | 'failed';
  results?: {
    platform: string;
    success: boolean;
    postId?: string;
    url?: string;
    error?: string;
  }[];
}

export class ContentPublishingService {
  /**
   * Publish content to multiple platforms
   */
  async publishContent(data: PublishContentData): Promise<PublishResult> {
    try {
      const results = [];
      let totalSuccess = 0;
      let totalFailed = 0;

      // Publish to each platform
      for (const platform of data.platforms) {
        try {
          const result = await platformAPIManager.createPost(platform, data.userId, {
            content: data.content,
            mediaUrls: data.mediaUrls,
            hashtags: data.hashtags,
            location: data.location,
            scheduledTime: data.scheduledTime,
          });

          results.push({
            platform,
            success: result.success,
            postId: result.postId,
            url: result.url,
            error: result.error,
          });

          if (result.success) {
            totalSuccess++;
          } else {
            totalFailed++;
          }
        } catch (error) {
          results.push({
            platform,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
          totalFailed++;
        }
      }

      return {
        success: totalSuccess > 0,
        results,
        totalSuccess,
        totalFailed,
      };
    } catch (error) {
      console.error('Content publishing error:', error);
      return {
        success: false,
        results: [],
        totalSuccess: 0,
        totalFailed: data.platforms.length,
      };
    }
  }

  /**
   * Schedule content for future publishing
   */
  async scheduleContent(data: PublishContentData): Promise<{ success: boolean; scheduledPostId?: string; error?: string }> {
    try {
      if (!data.scheduledTime) {
        return { success: false, error: 'Scheduled time is required' };
      }

      // Store scheduled post in database
      const scheduledPost = await prisma.scheduledPost.create({
        data: {
          userId: data.userId,
          content: data.content,
          mediaUrls: data.mediaUrls || [],
          platforms: data.platforms,
          scheduledTime: data.scheduledTime,
          status: 'pending',
          hashtags: data.hashtags || [],
          location: data.location,
        },
      });

      return {
        success: true,
        scheduledPostId: scheduledPost.id,
      };
    } catch (error) {
      console.error('Content scheduling error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Process scheduled posts (should be called by a cron job)
   */
  async processScheduledPosts(): Promise<{ processed: number; successful: number; failed: number }> {
    try {
      const now = new Date();
      
      // Get pending scheduled posts that are due
      const scheduledPosts = await prisma.scheduledPost.findMany({
        where: {
          status: 'pending',
          scheduledTime: {
            lte: now,
          },
        },
      });

      let processed = 0;
      let successful = 0;
      let failed = 0;

      for (const post of scheduledPosts) {
        try {
          // Publish the content
          const result = await this.publishContent({
            content: post.content,
            mediaUrls: post.mediaUrls,
            hashtags: post.hashtags,
            location: post.location,
            platforms: post.platforms,
            userId: post.userId,
          });

          // Update the scheduled post with results
          await prisma.scheduledPost.update({
            where: { id: post.id },
            data: {
              status: result.success ? 'published' : 'failed',
              results: result.results,
            },
          });

          processed++;
          if (result.success) {
            successful++;
          } else {
            failed++;
          }
        } catch (error) {
          console.error(`Failed to process scheduled post ${post.id}:`, error);
          
          await prisma.scheduledPost.update({
            where: { id: post.id },
            data: {
              status: 'failed',
              results: [{
                platform: 'all',
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
              }],
            },
          });

          processed++;
          failed++;
        }
      }

      return { processed, successful, failed };
    } catch (error) {
      console.error('Process scheduled posts error:', error);
      return { processed: 0, successful: 0, failed: 0 };
    }
  }

  /**
   * Get user's scheduled posts
   */
  async getScheduledPosts(userId: string, status?: 'pending' | 'published' | 'failed'): Promise<ScheduledPost[]> {
    try {
      const where: any = { userId };
      if (status) {
        where.status = status;
      }

      const posts = await prisma.scheduledPost.findMany({
        where,
        orderBy: { scheduledTime: 'desc' },
      });

      return posts.map(post => ({
        id: post.id,
        content: post.content,
        mediaUrls: post.mediaUrls,
        platforms: post.platforms,
        scheduledTime: post.scheduledTime,
        status: post.status as 'pending' | 'published' | 'failed',
        results: post.results as any,
      }));
    } catch (error) {
      console.error('Get scheduled posts error:', error);
      return [];
    }
  }

  /**
   * Cancel a scheduled post
   */
  async cancelScheduledPost(postId: string, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const post = await prisma.scheduledPost.findFirst({
        where: { id: postId, userId },
      });

      if (!post) {
        return { success: false, error: 'Scheduled post not found' };
      }

      if (post.status !== 'pending') {
        return { success: false, error: 'Cannot cancel a post that has already been processed' };
      }

      await prisma.scheduledPost.update({
        where: { id: postId },
        data: { status: 'failed' },
      });

      return { success: true };
    } catch (error) {
      console.error('Cancel scheduled post error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get publishing analytics
   */
  async getPublishingAnalytics(userId: string, startDate?: Date, endDate?: Date): Promise<{
    totalPosts: number;
    successfulPosts: number;
    failedPosts: number;
    platformBreakdown: Record<string, { success: number; failed: number }>;
    dailyStats: Array<{ date: string; posts: number; success: number; failed: number }>;
  }> {
    try {
      const where: any = { userId };
      if (startDate || endDate) {
        where.scheduledTime = {};
        if (startDate) where.scheduledTime.gte = startDate;
        if (endDate) where.scheduledTime.lte = endDate;
      }

      const posts = await prisma.scheduledPost.findMany({
        where,
        orderBy: { scheduledTime: 'desc' },
      });

      const totalPosts = posts.length;
      const successfulPosts = posts.filter(p => p.status === 'published').length;
      const failedPosts = posts.filter(p => p.status === 'failed').length;

      // Platform breakdown
      const platformBreakdown: Record<string, { success: number; failed: number }> = {};
      posts.forEach(post => {
        post.platforms.forEach(platform => {
          if (!platformBreakdown[platform]) {
            platformBreakdown[platform] = { success: 0, failed: 0 };
          }
          
          if (post.status === 'published') {
            platformBreakdown[platform].success++;
          } else if (post.status === 'failed') {
            platformBreakdown[platform].failed++;
          }
        });
      });

      // Daily stats
      const dailyStats: Record<string, { posts: number; success: number; failed: number }> = {};
      posts.forEach(post => {
        const date = post.scheduledTime.toISOString().split('T')[0];
        if (!dailyStats[date]) {
          dailyStats[date] = { posts: 0, success: 0, failed: 0 };
        }
        
        dailyStats[date].posts++;
        if (post.status === 'published') {
          dailyStats[date].success++;
        } else if (post.status === 'failed') {
          dailyStats[date].failed++;
        }
      });

      const dailyStatsArray = Object.entries(dailyStats).map(([date, stats]) => ({
        date,
        ...stats,
      })).sort((a, b) => a.date.localeCompare(b.date));

      return {
        totalPosts,
        successfulPosts,
        failedPosts,
        platformBreakdown,
        dailyStats: dailyStatsArray,
      };
    } catch (error) {
      console.error('Get publishing analytics error:', error);
      return {
        totalPosts: 0,
        successfulPosts: 0,
        failedPosts: 0,
        platformBreakdown: {},
        dailyStats: [],
      };
    }
  }
}

// Export singleton instance
export const contentPublishingService = new ContentPublishingService();
