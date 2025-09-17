/**
 * Advanced Scheduling Engine
 * Handles complex scheduling logic including recurring posts, optimal timing, and bulk operations
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface RecurringPattern {
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  interval: number; // Every N days/weeks/months
  daysOfWeek?: number[]; // 0-6 (Sunday-Saturday)
  dayOfMonth?: number; // 1-31
  endDate?: Date;
  maxOccurrences?: number;
}

export interface OptimalTiming {
  platform: string;
  bestTimes: Date[];
  confidence: number;
  reasoning: string;
}

export interface BulkScheduleData {
  content: string;
  platforms: string[];
  mediaUrls?: string[];
  hashtags?: string[];
  location?: string;
  startDate: Date;
  endDate: Date;
  pattern: RecurringPattern;
  timezone: string;
}

export interface ScheduleConflict {
  type: 'time_overlap' | 'platform_limit' | 'content_similarity';
  severity: 'low' | 'medium' | 'high';
  message: string;
  conflictingPostId?: string;
}

export class SchedulingEngine {
  /**
   * Generate recurring post schedule
   */
  async generateRecurringSchedule(
    userId: string,
    content: string,
    platforms: string[],
    pattern: RecurringPattern,
    startDate: Date,
    timezone: string,
    options?: {
      mediaUrls?: string[];
      hashtags?: string[];
      location?: string;
    }
  ): Promise<{ scheduledPosts: any[]; conflicts: ScheduleConflict[] }> {
    try {
      const scheduledPosts = [];
      const conflicts = [];
      let currentDate = new Date(startDate);
      let occurrenceCount = 0;

      // Calculate end date
      const endDate = pattern.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year default
      const maxOccurrences = pattern.maxOccurrences || 1000;

      while (currentDate <= endDate && occurrenceCount < maxOccurrences) {
        // Check for conflicts
        const conflict = await this.checkScheduleConflict(
          userId,
          currentDate,
          platforms,
          content
        );

        if (conflict) {
          conflicts.push(conflict);
        } else {
          // Create scheduled post
          const scheduledPost = await prisma.scheduledPost.create({
            data: {
              userId,
              content,
              platforms,
              scheduledTime: currentDate,
              status: 'pending',
              mediaUrls: options?.mediaUrls || [],
              hashtags: options?.hashtags || [],
              location: options?.location,
            },
          });

          scheduledPosts.push(scheduledPost);
        }

        // Calculate next occurrence
        currentDate = this.calculateNextOccurrence(currentDate, pattern);
        occurrenceCount++;
      }

      return { scheduledPosts, conflicts };
    } catch (error) {
      console.error('Generate recurring schedule error:', error);
      throw error;
    }
  }

  /**
   * Calculate optimal posting times for platforms
   */
  async calculateOptimalTiming(
    userId: string,
    platforms: string[],
    content: string,
    timezone: string
  ): Promise<OptimalTiming[]> {
    try {
      const optimalTimings: OptimalTiming[] = [];

      for (const platform of platforms) {
        // Get historical performance data
        const performanceData = await this.getHistoricalPerformance(userId, platform);
        
        // Calculate best times based on historical data
        const bestTimes = this.analyzeOptimalTimes(performanceData, timezone);
        
        // Get AI-powered suggestions
        const aiSuggestions = await this.getAITimingSuggestions(content, platform, timezone);
        
        // Combine historical data with AI suggestions
        const combinedTimes = this.combineTimingSuggestions(bestTimes, aiSuggestions);

        optimalTimings.push({
          platform,
          bestTimes: combinedTimes,
          confidence: this.calculateConfidence(performanceData, aiSuggestions),
          reasoning: this.generateTimingReasoning(performanceData, aiSuggestions),
        });
      }

      return optimalTimings;
    } catch (error) {
      console.error('Calculate optimal timing error:', error);
      throw error;
    }
  }

  /**
   * Bulk schedule multiple posts
   */
  async bulkSchedule(
    userId: string,
    scheduleData: BulkScheduleData
  ): Promise<{ scheduledPosts: any[]; conflicts: ScheduleConflict[] }> {
    try {
      const { content, platforms, startDate, endDate, pattern, timezone, ...options } = scheduleData;
      
      // Generate recurring schedule
      const result = await this.generateRecurringSchedule(
        userId,
        content,
        platforms,
        pattern,
        startDate,
        timezone,
        options
      );

      // Filter posts within the specified date range
      const filteredPosts = result.scheduledPosts.filter(post => 
        post.scheduledTime >= startDate && post.scheduledTime <= endDate
      );

      return {
        scheduledPosts: filteredPosts,
        conflicts: result.conflicts,
      };
    } catch (error) {
      console.error('Bulk schedule error:', error);
      throw error;
    }
  }

  /**
   * Check for scheduling conflicts
   */
  private async checkScheduleConflict(
    userId: string,
    scheduledTime: Date,
    platforms: string[],
    content: string
  ): Promise<ScheduleConflict | null> {
    try {
      // Check for time overlap (posts within 5 minutes)
      const timeBuffer = 5 * 60 * 1000; // 5 minutes
      const startTime = new Date(scheduledTime.getTime() - timeBuffer);
      const endTime = new Date(scheduledTime.getTime() + timeBuffer);

      const overlappingPosts = await prisma.scheduledPost.findMany({
        where: {
          userId,
          scheduledTime: {
            gte: startTime,
            lte: endTime,
          },
          status: 'pending',
        },
      });

      if (overlappingPosts.length > 0) {
        // Check for platform overlap
        const overlappingPlatforms = overlappingPosts.some(post =>
          post.platforms.some(platform => platforms.includes(platform))
        );

        if (overlappingPlatforms) {
          return {
            type: 'time_overlap',
            severity: 'medium',
            message: 'Scheduled time conflicts with existing post',
            conflictingPostId: overlappingPosts[0].id,
          };
        }
      }

      // Check for content similarity
      const similarPosts = await prisma.scheduledPost.findMany({
        where: {
          userId,
          content: {
            contains: content.substring(0, 50), // Check first 50 characters
          },
          status: 'pending',
        },
      });

      if (similarPosts.length > 0) {
        return {
          type: 'content_similarity',
          severity: 'low',
          message: 'Similar content already scheduled',
          conflictingPostId: similarPosts[0].id,
        };
      }

      return null;
    } catch (error) {
      console.error('Check schedule conflict error:', error);
      return null;
    }
  }

  /**
   * Calculate next occurrence based on pattern
   */
  private calculateNextOccurrence(currentDate: Date, pattern: RecurringPattern): Date {
    const nextDate = new Date(currentDate);

    switch (pattern.type) {
      case 'daily':
        nextDate.setDate(nextDate.getDate() + pattern.interval);
        break;
      
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + (pattern.interval * 7));
        break;
      
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + pattern.interval);
        break;
      
      case 'custom':
        if (pattern.daysOfWeek) {
          // Find next occurrence of specified days
          const currentDay = nextDate.getDay();
          const nextDays = pattern.daysOfWeek.filter(day => day > currentDay);
          
          if (nextDays.length > 0) {
            const daysToAdd = nextDays[0] - currentDay;
            nextDate.setDate(nextDate.getDate() + daysToAdd);
          } else {
            // Next week
            const daysToAdd = (7 - currentDay) + pattern.daysOfWeek[0];
            nextDate.setDate(nextDate.getDate() + daysToAdd);
          }
        } else if (pattern.dayOfMonth) {
          // Next month, same day
          nextDate.setMonth(nextDate.getMonth() + 1);
          nextDate.setDate(pattern.dayOfMonth);
        }
        break;
    }

    return nextDate;
  }

  /**
   * Get historical performance data
   */
  private async getHistoricalPerformance(userId: string, platform: string): Promise<any[]> {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      const posts = await prisma.scheduledPost.findMany({
        where: {
          userId,
          platforms: {
            has: platform,
          },
          scheduledTime: {
            gte: thirtyDaysAgo,
          },
          status: 'published',
        },
        include: {
          results: true,
        },
      });

      return posts;
    } catch (error) {
      console.error('Get historical performance error:', error);
      return [];
    }
  }

  /**
   * Analyze optimal posting times from historical data
   */
  private analyzeOptimalTimes(performanceData: any[], timezone: string): Date[] {
    // Group posts by hour of day
    const hourlyPerformance = new Map<number, { count: number; totalEngagement: number }>();
    
    performanceData.forEach(post => {
      const hour = new Date(post.scheduledTime).getHours();
      const engagement = this.calculateEngagement(post.results);
      
      if (!hourlyPerformance.has(hour)) {
        hourlyPerformance.set(hour, { count: 0, totalEngagement: 0 });
      }
      
      const current = hourlyPerformance.get(hour)!;
      current.count++;
      current.totalEngagement += engagement;
    });

    // Calculate average engagement per hour
    const avgEngagement = Array.from(hourlyPerformance.entries())
      .map(([hour, data]) => ({
        hour,
        avgEngagement: data.totalEngagement / data.count,
        count: data.count,
      }))
      .sort((a, b) => b.avgEngagement - a.avgEngagement);

    // Return top 3 hours
    return avgEngagement.slice(0, 3).map(item => {
      const date = new Date();
      date.setHours(item.hour, 0, 0, 0);
      return date;
    });
  }

  /**
   * Get AI-powered timing suggestions
   */
  private async getAITimingSuggestions(
    content: string,
    platform: string,
    timezone: string
  ): Promise<Date[]> {
    // This would integrate with an AI service to analyze content and suggest optimal times
    // For now, return some mock suggestions based on platform
    const suggestions: Date[] = [];
    const now = new Date();

    switch (platform) {
      case 'instagram':
        // Instagram: 6-9 AM, 12-2 PM, 5-7 PM
        suggestions.push(
          new Date(now.getTime() + 6 * 60 * 60 * 1000), // 6 AM
          new Date(now.getTime() + 12 * 60 * 60 * 1000), // 12 PM
          new Date(now.getTime() + 17 * 60 * 60 * 1000) // 5 PM
        );
        break;
      
      case 'twitter':
        // Twitter: 8-10 AM, 12-1 PM, 5-6 PM
        suggestions.push(
          new Date(now.getTime() + 8 * 60 * 60 * 1000), // 8 AM
          new Date(now.getTime() + 12 * 60 * 60 * 1000), // 12 PM
          new Date(now.getTime() + 17 * 60 * 60 * 1000) // 5 PM
        );
        break;
      
      case 'linkedin':
        // LinkedIn: 8-10 AM, 12-1 PM, 5-6 PM (business hours)
        suggestions.push(
          new Date(now.getTime() + 8 * 60 * 60 * 1000), // 8 AM
          new Date(now.getTime() + 12 * 60 * 60 * 1000), // 12 PM
          new Date(now.getTime() + 17 * 60 * 60 * 1000) // 5 PM
        );
        break;
      
      case 'youtube':
        // YouTube: 2-4 PM, 8-9 PM (prime viewing times)
        suggestions.push(
          new Date(now.getTime() + 14 * 60 * 60 * 1000), // 2 PM
          new Date(now.getTime() + 20 * 60 * 60 * 1000) // 8 PM
        );
        break;
      
      case 'tiktok':
        // TikTok: 6-10 AM, 7-9 PM (peak usage times)
        suggestions.push(
          new Date(now.getTime() + 6 * 60 * 60 * 1000), // 6 AM
          new Date(now.getTime() + 19 * 60 * 60 * 1000) // 7 PM
        );
        break;
    }

    return suggestions;
  }

  /**
   * Combine historical data with AI suggestions
   */
  private combineTimingSuggestions(historical: Date[], ai: Date[]): Date[] {
    // Combine and deduplicate suggestions
    const combined = [...historical, ...ai];
    const unique = combined.filter((date, index, self) => 
      index === self.findIndex(d => d.getHours() === date.getHours())
    );
    
    return unique.slice(0, 5); // Return top 5 suggestions
  }

  /**
   * Calculate engagement score from results
   */
  private calculateEngagement(results: any): number {
    if (!results || !Array.isArray(results)) return 0;
    
    return results.reduce((total, result) => {
      if (!result.success) return total;
      
      const analytics = result.platformData?.analytics || {};
      return total + (analytics.likes || 0) + (analytics.comments || 0) + (analytics.shares || 0);
    }, 0);
  }

  /**
   * Calculate confidence score
   */
  private calculateConfidence(historical: any[], ai: any[]): number {
    const historicalWeight = Math.min(historical.length / 10, 1); // Max weight at 10 posts
    const aiWeight = 0.7; // AI suggestions have good weight
    
    return Math.min((historicalWeight * 0.6) + (aiWeight * 0.4), 1);
  }

  /**
   * Generate timing reasoning
   */
  private generateTimingReasoning(historical: any[], ai: any[]): string {
    const historicalCount = historical.length;
    
    if (historicalCount === 0) {
      return "Based on platform best practices and AI analysis";
    } else if (historicalCount < 5) {
      return `Based on ${historicalCount} historical posts and platform best practices`;
    } else {
      return `Based on ${historicalCount} historical posts with strong performance data`;
    }
  }

  /**
   * Get scheduling analytics
   */
  async getSchedulingAnalytics(
    userId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<{
    totalScheduled: number;
    published: number;
    pending: number;
    failed: number;
    averageEngagement: number;
    bestPerformingTimes: Array<{ hour: number; engagement: number }>;
    platformBreakdown: Record<string, { scheduled: number; published: number; failed: number }>;
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
        include: { results: true },
      });

      const totalScheduled = posts.length;
      const published = posts.filter(p => p.status === 'published').length;
      const pending = posts.filter(p => p.status === 'pending').length;
      const failed = posts.filter(p => p.status === 'failed').length;

      // Calculate average engagement
      const publishedPosts = posts.filter(p => p.status === 'published');
      const totalEngagement = publishedPosts.reduce((total, post) => {
        return total + this.calculateEngagement(post.results);
      }, 0);
      const averageEngagement = publishedPosts.length > 0 ? totalEngagement / publishedPosts.length : 0;

      // Best performing times
      const hourlyEngagement = new Map<number, { count: number; totalEngagement: number }>();
      publishedPosts.forEach(post => {
        const hour = new Date(post.scheduledTime).getHours();
        const engagement = this.calculateEngagement(post.results);
        
        if (!hourlyEngagement.has(hour)) {
          hourlyEngagement.set(hour, { count: 0, totalEngagement: 0 });
        }
        
        const current = hourlyEngagement.get(hour)!;
        current.count++;
        current.totalEngagement += engagement;
      });

      const bestPerformingTimes = Array.from(hourlyEngagement.entries())
        .map(([hour, data]) => ({
          hour,
          engagement: data.totalEngagement / data.count,
        }))
        .sort((a, b) => b.engagement - a.engagement)
        .slice(0, 5);

      // Platform breakdown
      const platformBreakdown: Record<string, { scheduled: number; published: number; failed: number }> = {};
      posts.forEach(post => {
        post.platforms.forEach(platform => {
          if (!platformBreakdown[platform]) {
            platformBreakdown[platform] = { scheduled: 0, published: 0, failed: 0 };
          }
          
          platformBreakdown[platform].scheduled++;
          if (post.status === 'published') {
            platformBreakdown[platform].published++;
          } else if (post.status === 'failed') {
            platformBreakdown[platform].failed++;
          }
        });
      });

      return {
        totalScheduled,
        published,
        pending,
        failed,
        averageEngagement,
        bestPerformingTimes,
        platformBreakdown,
      };
    } catch (error) {
      console.error('Get scheduling analytics error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const schedulingEngine = new SchedulingEngine();
