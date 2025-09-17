/**
 * Advanced Analytics Engine
 * Comprehensive data aggregation, processing, and insights generation
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AnalyticsTimeRange {
  startDate: Date;
  endDate: Date;
  granularity: 'hour' | 'day' | 'week' | 'month' | 'year';
}

export interface PlatformMetrics {
  platform: string;
  posts: number;
  engagement: number;
  reach: number;
  impressions: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  clicks: number;
  views: number;
  watchTime?: number;
  followers: number;
  following: number;
  growth: number;
  engagementRate: number;
  clickThroughRate: number;
  saveRate: number;
}

export interface ContentPerformance {
  contentId: string;
  content: string;
  platforms: string[];
  publishedAt: Date;
  metrics: {
    totalEngagement: number;
    totalReach: number;
    totalImpressions: number;
    engagementRate: number;
    bestPerformingPlatform: string;
    worstPerformingPlatform: string;
  };
  platformBreakdown: Record<string, PlatformMetrics>;
}

export interface TrendAnalysis {
  metric: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  changePercentage: number;
  confidence: number;
  period: string;
  dataPoints: Array<{ date: Date; value: number }>;
}

export interface AIInsight {
  type: 'performance' | 'optimization' | 'trend' | 'recommendation';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  actionable: boolean;
  actionItems?: string[];
  relatedMetrics: string[];
  timeframe: string;
}

export interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'gauge' | 'trend';
  title: string;
  description?: string;
  config: any;
  position: { x: number; y: number; w: number; h: number };
  refreshInterval?: number;
  filters?: Record<string, any>;
}

export interface CustomDashboard {
  id: string;
  name: string;
  description?: string;
  widgets: DashboardWidget[];
  isDefault: boolean;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class AnalyticsEngine {
  /**
   * Get comprehensive analytics for a user
   */
  async getComprehensiveAnalytics(
    userId: string,
    timeRange: AnalyticsTimeRange,
    platforms?: string[]
  ): Promise<{
    overview: {
      totalPosts: number;
      totalEngagement: number;
      totalReach: number;
      totalImpressions: number;
      averageEngagementRate: number;
      totalFollowers: number;
      followerGrowth: number;
    };
    platformMetrics: PlatformMetrics[];
    contentPerformance: ContentPerformance[];
    trends: TrendAnalysis[];
    insights: AIInsight[];
  }> {
    try {
      // Get all scheduled posts in time range
      const posts = await prisma.scheduledPost.findMany({
        where: {
          userId,
          scheduledTime: {
            gte: timeRange.startDate,
            lte: timeRange.endDate,
          },
          status: 'published',
        },
        include: { results: true },
      });

      // Filter by platforms if specified
      const filteredPosts = platforms 
        ? posts.filter(post => post.platforms.some(p => platforms.includes(p)))
        : posts;

      // Calculate overview metrics
      const overview = await this.calculateOverviewMetrics(filteredPosts, userId, timeRange);

      // Calculate platform-specific metrics
      const platformMetrics = await this.calculatePlatformMetrics(filteredPosts, platforms);

      // Analyze content performance
      const contentPerformance = await this.analyzeContentPerformance(filteredPosts);

      // Generate trend analysis
      const trends = await this.generateTrendAnalysis(filteredPosts, timeRange);

      // Generate AI insights
      const insights = await this.generateAIInsights(filteredPosts, overview, trends);

      return {
        overview,
        platformMetrics,
        contentPerformance,
        trends,
        insights,
      };
    } catch (error) {
      console.error('Get comprehensive analytics error:', error);
      throw error;
    }
  }

  /**
   * Calculate overview metrics
   */
  private async calculateOverviewMetrics(
    posts: any[],
    userId: string,
    timeRange: AnalyticsTimeRange
  ): Promise<any> {
    const totalPosts = posts.length;
    
    // Calculate total engagement
    const totalEngagement = posts.reduce((total, post) => {
      if (!post.results || !Array.isArray(post.results)) return total;
      
      return total + post.results.reduce((postTotal: number, result: any) => {
        if (!result.success) return postTotal;
        
        const metrics = result.platformData?.analytics || {};
        return postTotal + (metrics.likes || 0) + (metrics.comments || 0) + (metrics.shares || 0);
      }, 0);
    }, 0);

    // Calculate total reach and impressions
    const totalReach = posts.reduce((total, post) => {
      if (!post.results || !Array.isArray(post.results)) return total;
      
      return total + post.results.reduce((postTotal: number, result: any) => {
        if (!result.success) return postTotal;
        
        const metrics = result.platformData?.analytics || {};
        return postTotal + (metrics.reach || 0);
      }, 0);
    }, 0);

    const totalImpressions = posts.reduce((total, post) => {
      if (!post.results || !Array.isArray(post.results)) return total;
      
      return total + post.results.reduce((postTotal: number, result: any) => {
        if (!result.success) return postTotal;
        
        const metrics = result.platformData?.analytics || {};
        return postTotal + (metrics.impressions || 0);
      }, 0);
    }, 0);

    // Calculate average engagement rate
    const averageEngagementRate = totalImpressions > 0 ? (totalEngagement / totalImpressions) * 100 : 0;

    // Get follower data
    const socialAccounts = await prisma.socialAccount.findMany({
      where: { userId, status: 'active' },
    });

    const totalFollowers = socialAccounts.reduce((total, account) => {
      const metadata = account.metadata as any;
      return total + (metadata?.followers || 0);
    }, 0);

    // Calculate follower growth (simplified - would need historical data)
    const followerGrowth = 0; // TODO: Implement follower growth calculation

    return {
      totalPosts,
      totalEngagement,
      totalReach,
      totalImpressions,
      averageEngagementRate,
      totalFollowers,
      followerGrowth,
    };
  }

  /**
   * Calculate platform-specific metrics
   */
  private async calculatePlatformMetrics(
    posts: any[],
    platforms?: string[]
  ): Promise<PlatformMetrics[]> {
    const platformData = new Map<string, any>();

    // Initialize platform data
    const targetPlatforms = platforms || ['instagram', 'youtube', 'twitter', 'linkedin', 'tiktok'];
    targetPlatforms.forEach(platform => {
      platformData.set(platform, {
        platform,
        posts: 0,
        engagement: 0,
        reach: 0,
        impressions: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        saves: 0,
        clicks: 0,
        views: 0,
        watchTime: 0,
        followers: 0,
        following: 0,
        growth: 0,
        engagementRate: 0,
        clickThroughRate: 0,
        saveRate: 0,
      });
    });

    // Process posts
    posts.forEach(post => {
      post.platforms.forEach((platform: string) => {
        if (!platformData.has(platform)) return;

        const data = platformData.get(platform);
        data.posts++;

        if (post.results && Array.isArray(post.results)) {
          const platformResult = post.results.find((r: any) => r.platform === platform);
          if (platformResult && platformResult.success) {
            const metrics = platformResult.platformData?.analytics || {};
            
            data.engagement += (metrics.likes || 0) + (metrics.comments || 0) + (metrics.shares || 0);
            data.reach += metrics.reach || 0;
            data.impressions += metrics.impressions || 0;
            data.likes += metrics.likes || 0;
            data.comments += metrics.comments || 0;
            data.shares += metrics.shares || 0;
            data.saves += metrics.saves || 0;
            data.clicks += metrics.clicks || 0;
            data.views += metrics.views || 0;
            data.watchTime += metrics.watchTime || 0;
          }
        }
      });
    });

    // Calculate rates
    const result: PlatformMetrics[] = [];
    platformData.forEach((data, platform) => {
      if (data.posts > 0) {
        data.engagementRate = data.impressions > 0 ? (data.engagement / data.impressions) * 100 : 0;
        data.clickThroughRate = data.impressions > 0 ? (data.clicks / data.impressions) * 100 : 0;
        data.saveRate = data.impressions > 0 ? (data.saves / data.impressions) * 100 : 0;
      }
      result.push(data);
    });

    return result;
  }

  /**
   * Analyze content performance
   */
  private async analyzeContentPerformance(posts: any[]): Promise<ContentPerformance[]> {
    return posts.map(post => {
      const platformBreakdown: Record<string, PlatformMetrics> = {};
      let totalEngagement = 0;
      let totalReach = 0;
      let totalImpressions = 0;

      post.platforms.forEach((platform: string) => {
        const platformResult = post.results?.find((r: any) => r.platform === platform);
        if (platformResult && platformResult.success) {
          const metrics = platformResult.platformData?.analytics || {};
          const engagement = (metrics.likes || 0) + (metrics.comments || 0) + (metrics.shares || 0);
          
          platformBreakdown[platform] = {
            platform,
            posts: 1,
            engagement,
            reach: metrics.reach || 0,
            impressions: metrics.impressions || 0,
            likes: metrics.likes || 0,
            comments: metrics.comments || 0,
            shares: metrics.shares || 0,
            saves: metrics.saves || 0,
            clicks: metrics.clicks || 0,
            views: metrics.views || 0,
            watchTime: metrics.watchTime || 0,
            followers: 0,
            following: 0,
            growth: 0,
            engagementRate: metrics.impressions > 0 ? (engagement / metrics.impressions) * 100 : 0,
            clickThroughRate: metrics.impressions > 0 ? ((metrics.clicks || 0) / metrics.impressions) * 100 : 0,
            saveRate: metrics.impressions > 0 ? ((metrics.saves || 0) / metrics.impressions) * 100 : 0,
          };

          totalEngagement += engagement;
          totalReach += metrics.reach || 0;
          totalImpressions += metrics.impressions || 0;
        }
      });

      const engagementRate = totalImpressions > 0 ? (totalEngagement / totalImpressions) * 100 : 0;
      
      // Find best and worst performing platforms
      const platformMetrics = Object.values(platformBreakdown);
      const bestPlatform = platformMetrics.reduce((best, current) => 
        current.engagementRate > best.engagementRate ? current : best, platformMetrics[0] || { platform: 'none', engagementRate: 0 }
      );
      const worstPlatform = platformMetrics.reduce((worst, current) => 
        current.engagementRate < worst.engagementRate ? current : best, platformMetrics[0] || { platform: 'none', engagementRate: 0 }
      );

      return {
        contentId: post.id,
        content: post.content,
        platforms: post.platforms,
        publishedAt: post.scheduledTime,
        metrics: {
          totalEngagement,
          totalReach,
          totalImpressions,
          engagementRate,
          bestPerformingPlatform: bestPlatform.platform,
          worstPerformingPlatform: worstPlatform.platform,
        },
        platformBreakdown,
      };
    });
  }

  /**
   * Generate trend analysis
   */
  private async generateTrendAnalysis(
    posts: any[],
    timeRange: AnalyticsTimeRange
  ): Promise<TrendAnalysis[]> {
    const trends: TrendAnalysis[] = [];
    
    // Group posts by time granularity
    const groupedPosts = this.groupPostsByTime(posts, timeRange.granularity);
    
    // Calculate engagement trend
    const engagementData = groupedPosts.map(group => ({
      date: group.date,
      value: group.posts.reduce((total, post) => {
        if (!post.results || !Array.isArray(post.results)) return total;
        return total + post.results.reduce((postTotal: number, result: any) => {
          if (!result.success) return postTotal;
          const metrics = result.platformData?.analytics || {};
          return postTotal + (metrics.likes || 0) + (metrics.comments || 0) + (metrics.shares || 0);
        }, 0);
      }, 0),
    }));

    if (engagementData.length >= 2) {
      const engagementTrend = this.calculateTrend(engagementData);
      trends.push({
        metric: 'engagement',
        trend: engagementTrend.trend,
        change: engagementTrend.change,
        changePercentage: engagementTrend.changePercentage,
        confidence: engagementTrend.confidence,
        period: timeRange.granularity,
        dataPoints: engagementData,
      });
    }

    // Calculate reach trend
    const reachData = groupedPosts.map(group => ({
      date: group.date,
      value: group.posts.reduce((total, post) => {
        if (!post.results || !Array.isArray(post.results)) return total;
        return total + post.results.reduce((postTotal: number, result: any) => {
          if (!result.success) return postTotal;
          const metrics = result.platformData?.analytics || {};
          return postTotal + (metrics.reach || 0);
        }, 0);
      }, 0),
    }));

    if (reachData.length >= 2) {
      const reachTrend = this.calculateTrend(reachData);
      trends.push({
        metric: 'reach',
        trend: reachTrend.trend,
        change: reachTrend.change,
        changePercentage: reachTrend.changePercentage,
        confidence: reachTrend.confidence,
        period: timeRange.granularity,
        dataPoints: reachData,
      });
    }

    return trends;
  }

  /**
   * Generate AI insights
   */
  private async generateAIInsights(
    posts: any[],
    overview: any,
    trends: TrendAnalysis[]
  ): Promise<AIInsight[]> {
    const insights: AIInsight[] = [];

    // Engagement insight
    const engagementTrend = trends.find(t => t.metric === 'engagement');
    if (engagementTrend) {
      if (engagementTrend.trend === 'up' && engagementTrend.changePercentage > 20) {
        insights.push({
          type: 'performance',
          title: 'Engagement on the Rise!',
          description: `Your engagement has increased by ${engagementTrend.changePercentage.toFixed(1)}% over the last period. Keep up the great work!`,
          impact: 'high',
          confidence: engagementTrend.confidence,
          actionable: true,
          actionItems: [
            'Continue with current content strategy',
            'Analyze top-performing posts for patterns',
            'Consider increasing posting frequency'
          ],
          relatedMetrics: ['engagement', 'likes', 'comments', 'shares'],
          timeframe: 'recent',
        });
      } else if (engagementTrend.trend === 'down' && engagementTrend.changePercentage < -20) {
        insights.push({
          type: 'optimization',
          title: 'Engagement Needs Attention',
          description: `Your engagement has decreased by ${Math.abs(engagementTrend.changePercentage).toFixed(1)}%. Let's optimize your content strategy.`,
          impact: 'high',
          confidence: engagementTrend.confidence,
          actionable: true,
          actionItems: [
            'Review recent content performance',
            'Try different posting times',
            'Experiment with new content formats',
            'Engage more with your audience'
          ],
          relatedMetrics: ['engagement', 'timing', 'content_type'],
          timeframe: 'recent',
        });
      }
    }

    // Posting frequency insight
    const avgPostsPerDay = posts.length / 30; // Assuming 30-day period
    if (avgPostsPerDay < 1) {
      insights.push({
        type: 'recommendation',
        title: 'Increase Posting Frequency',
        description: 'You\'re posting less than once per day. Increasing frequency can help grow your audience.',
        impact: 'medium',
        confidence: 0.8,
        actionable: true,
        actionItems: [
          'Aim for at least 1 post per day',
          'Use scheduling to maintain consistency',
          'Create content in batches'
        ],
        relatedMetrics: ['posting_frequency', 'audience_growth'],
        timeframe: 'ongoing',
      });
    }

    // Platform performance insight
    const platformMetrics = await this.calculatePlatformMetrics(posts);
    const bestPlatform = platformMetrics.reduce((best, current) => 
      current.engagementRate > best.engagementRate ? current : best, platformMetrics[0]
    );
    const worstPlatform = platformMetrics.reduce((worst, current) => 
      current.engagementRate < worst.engagementRate ? current : worst, platformMetrics[0]
    );

    if (bestPlatform && worstPlatform && bestPlatform.engagementRate > worstPlatform.engagementRate * 2) {
      insights.push({
        type: 'optimization',
        title: 'Platform Performance Gap',
        description: `${bestPlatform.platform} is performing ${(bestPlatform.engagementRate / worstPlatform.engagementRate).toFixed(1)}x better than ${worstPlatform.platform}.`,
        impact: 'medium',
        confidence: 0.9,
        actionable: true,
        actionItems: [
          `Focus more content on ${bestPlatform.platform}`,
          `Optimize content for ${worstPlatform.platform}`,
          'Analyze platform-specific best practices'
        ],
        relatedMetrics: ['platform_performance', 'engagement_rate'],
        timeframe: 'recent',
      });
    }

    return insights;
  }

  /**
   * Group posts by time granularity
   */
  private groupPostsByTime(posts: any[], granularity: string): Array<{ date: Date; posts: any[] }> {
    const groups = new Map<string, any[]>();

    posts.forEach(post => {
      const date = new Date(post.scheduledTime);
      let key: string;

      switch (granularity) {
        case 'hour':
          key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
          break;
        case 'day':
          key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
          break;
        case 'week':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = `${weekStart.getFullYear()}-${weekStart.getMonth()}-${weekStart.getDate()}`;
          break;
        case 'month':
          key = `${date.getFullYear()}-${date.getMonth()}`;
          break;
        case 'year':
          key = `${date.getFullYear()}`;
          break;
        default:
          key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      }

      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(post);
    });

    return Array.from(groups.entries()).map(([key, posts]) => ({
      date: new Date(key),
      posts,
    })).sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  /**
   * Calculate trend from data points
   */
  private calculateTrend(dataPoints: Array<{ date: Date; value: number }>): {
    trend: 'up' | 'down' | 'stable';
    change: number;
    changePercentage: number;
    confidence: number;
  } {
    if (dataPoints.length < 2) {
      return { trend: 'stable', change: 0, changePercentage: 0, confidence: 0 };
    }

    const firstValue = dataPoints[0].value;
    const lastValue = dataPoints[dataPoints.length - 1].value;
    const change = lastValue - firstValue;
    const changePercentage = firstValue > 0 ? (change / firstValue) * 100 : 0;

    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (changePercentage > 10) trend = 'up';
    else if (changePercentage < -10) trend = 'down';

    // Calculate confidence based on data consistency
    const values = dataPoints.map(d => d.value);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    const confidence = Math.max(0, Math.min(1, 1 - (variance / (mean + 1))));

    return { trend, change, changePercentage, confidence };
  }

  /**
   * Create custom dashboard
   */
  async createCustomDashboard(
    userId: string,
    name: string,
    description: string,
    widgets: DashboardWidget[]
  ): Promise<CustomDashboard> {
    try {
      const dashboard = await prisma.customDashboard.create({
        data: {
          userId,
          name,
          description,
          widgets: widgets as any,
          isDefault: false,
          isPublic: false,
        },
      });

      return {
        id: dashboard.id,
        name: dashboard.name,
        description: dashboard.description,
        widgets: dashboard.widgets as any,
        isDefault: dashboard.isDefault,
        isPublic: dashboard.isPublic,
        createdAt: dashboard.createdAt,
        updatedAt: dashboard.updatedAt,
      };
    } catch (error) {
      console.error('Create custom dashboard error:', error);
      throw error;
    }
  }

  /**
   * Get user's dashboards
   */
  async getUserDashboards(userId: string): Promise<CustomDashboard[]> {
    try {
      const dashboards = await prisma.customDashboard.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      return dashboards.map(dashboard => ({
        id: dashboard.id,
        name: dashboard.name,
        description: dashboard.description,
        widgets: dashboard.widgets as any,
        isDefault: dashboard.isDefault,
        isPublic: dashboard.isPublic,
        createdAt: dashboard.createdAt,
        updatedAt: dashboard.updatedAt,
      }));
    } catch (error) {
      console.error('Get user dashboards error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const analyticsEngine = new AnalyticsEngine();
