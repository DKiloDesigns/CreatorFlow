/**
 * Enterprise Analytics Service
 * Advanced analytics and reporting for enterprise teams
 */

import { PrismaClient } from '@prisma/client';
import { analyticsEngine } from './analytics-engine';

const prisma = new PrismaClient();

export interface EnterpriseMetrics {
  teamId: string;
  totalUsers: number;
  activeUsers: number;
  totalPosts: number;
  totalEngagement: number;
  totalReach: number;
  totalImpressions: number;
  averageEngagementRate: number;
  topPerformingContent: ContentPerformance[];
  platformBreakdown: PlatformMetrics[];
  userActivity: UserActivity[];
  teamGrowth: TeamGrowthMetrics;
  contentTrends: ContentTrend[];
  engagementInsights: EngagementInsight[];
  performanceScore: number;
  recommendations: Recommendation[];
}

export interface ContentPerformance {
  id: string;
  content: string;
  author: string;
  platforms: string[];
  publishedAt: Date;
  metrics: {
    engagement: number;
    reach: number;
    impressions: number;
    engagementRate: number;
    clickThroughRate: number;
    saveRate: number;
  };
  performance: 'excellent' | 'good' | 'average' | 'poor';
  insights: string[];
}

export interface PlatformMetrics {
  platform: string;
  posts: number;
  engagement: number;
  reach: number;
  impressions: number;
  engagementRate: number;
  clickThroughRate: number;
  saveRate: number;
  growth: number;
  bestPerformingContent: string[];
  recommendations: string[];
}

export interface UserActivity {
  userId: string;
  userName: string;
  role: string;
  lastActive: Date;
  postsCreated: number;
  postsPublished: number;
  engagementGenerated: number;
  reachGenerated: number;
  performanceScore: number;
  activityTrend: 'increasing' | 'stable' | 'decreasing';
  topContent: string[];
}

export interface TeamGrowthMetrics {
  period: string;
  userGrowth: number;
  contentGrowth: number;
  engagementGrowth: number;
  reachGrowth: number;
  platformGrowth: Record<string, number>;
  milestones: GrowthMilestone[];
}

export interface GrowthMilestone {
  type: 'users' | 'content' | 'engagement' | 'reach' | 'platform';
  value: number;
  achievedAt: Date;
  description: string;
}

export interface ContentTrend {
  type: 'content_type' | 'platform' | 'timing' | 'hashtag' | 'format';
  trend: string;
  performance: number;
  change: number;
  changePercentage: number;
  confidence: number;
  data: TrendDataPoint[];
  insights: string[];
}

export interface TrendDataPoint {
  date: Date;
  value: number;
  metadata?: any;
}

export interface EngagementInsight {
  type: 'timing' | 'content' | 'platform' | 'audience' | 'competition';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  actionable: boolean;
  actionItems: string[];
  relatedMetrics: string[];
  timeframe: string;
  data: any;
}

export interface Recommendation {
  type: 'content' | 'timing' | 'platform' | 'team' | 'strategy';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: number;
  effort: 'low' | 'medium' | 'high';
  timeframe: string;
  actionItems: string[];
  successMetrics: string[];
  relatedInsights: string[];
}

export interface EnterpriseReport {
  id: string;
  teamId: string;
  type: 'executive' | 'operational' | 'detailed' | 'custom';
  period: {
    startDate: Date;
    endDate: Date;
    granularity: string;
  };
  metrics: EnterpriseMetrics;
  insights: EngagementInsight[];
  recommendations: Recommendation[];
  generatedAt: Date;
  generatedBy: string;
  recipients: string[];
  status: 'draft' | 'ready' | 'sent' | 'archived';
}

export interface TeamComparison {
  teamId: string;
  teamName: string;
  metrics: {
    totalPosts: number;
    totalEngagement: number;
    totalReach: number;
    averageEngagementRate: number;
    activeUsers: number;
    performanceScore: number;
  };
  ranking: number;
  percentile: number;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
}

export class EnterpriseAnalyticsService {
  /**
   * Get comprehensive enterprise metrics
   */
  async getEnterpriseMetrics(
    teamId: string,
    timeRange: { startDate: Date; endDate: Date }
  ): Promise<EnterpriseMetrics> {
    try {
      // Get team members
      const teamMembers = await this.getTeamMembers(teamId);
      const userIds = teamMembers.map(member => member.userId);

      // Get team analytics
      const teamAnalytics = await this.getTeamAnalytics(teamId, timeRange);
      
      // Get user activity
      const userActivity = await this.getUserActivity(teamId, userIds, timeRange);
      
      // Get team growth metrics
      const teamGrowth = await this.getTeamGrowthMetrics(teamId, timeRange);
      
      // Get content trends
      const contentTrends = await this.getContentTrends(teamId, timeRange);
      
      // Get engagement insights
      const engagementInsights = await this.getEngagementInsights(teamId, timeRange);
      
      // Get recommendations
      const recommendations = await this.getRecommendations(teamId, timeRange);
      
      // Calculate performance score
      const performanceScore = await this.calculatePerformanceScore(teamId, timeRange);

      return {
        teamId,
        totalUsers: teamMembers.length,
        activeUsers: userActivity.filter(u => u.lastActive > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
        totalPosts: teamAnalytics.totalPosts,
        totalEngagement: teamAnalytics.totalEngagement,
        totalReach: teamAnalytics.totalReach,
        totalImpressions: teamAnalytics.totalImpressions,
        averageEngagementRate: teamAnalytics.averageEngagementRate,
        topPerformingContent: teamAnalytics.topPerformingContent,
        platformBreakdown: teamAnalytics.platformBreakdown,
        userActivity,
        teamGrowth,
        contentTrends,
        engagementInsights,
        performanceScore,
        recommendations,
      };
    } catch (error) {
      console.error('Get enterprise metrics error:', error);
      throw error;
    }
  }

  /**
   * Generate enterprise report
   */
  async generateEnterpriseReport(
    teamId: string,
    type: 'executive' | 'operational' | 'detailed' | 'custom',
    timeRange: { startDate: Date; endDate: Date },
    generatedBy: string,
    recipients: string[] = []
  ): Promise<EnterpriseReport> {
    try {
      const metrics = await this.getEnterpriseMetrics(teamId, timeRange);
      
      const report: EnterpriseReport = {
        id: `report_${Date.now()}`,
        teamId,
        type,
        period: {
          startDate: timeRange.startDate,
          endDate: timeRange.endDate,
          granularity: 'day',
        },
        metrics,
        insights: metrics.engagementInsights,
        recommendations: metrics.recommendations,
        generatedAt: new Date(),
        generatedBy,
        recipients,
        status: 'ready',
      };

      // Store report in database
      await this.storeEnterpriseReport(report);

      return report;
    } catch (error) {
      console.error('Generate enterprise report error:', error);
      throw error;
    }
  }

  /**
   * Get team comparison data
   */
  async getTeamComparison(
    teamId: string,
    timeRange: { startDate: Date; endDate: Date }
  ): Promise<TeamComparison> {
    try {
      const metrics = await this.getEnterpriseMetrics(teamId, timeRange);
      
      // Get industry benchmarks (mock data for now)
      const industryBenchmarks = await this.getIndustryBenchmarks();
      
      // Calculate ranking and percentile
      const ranking = await this.calculateTeamRanking(teamId, metrics);
      const percentile = await this.calculateTeamPercentile(teamId, metrics);
      
      // Generate strengths and improvements
      const strengths = this.identifyStrengths(metrics);
      const improvements = this.identifyImprovements(metrics);
      const recommendations = this.generateTeamRecommendations(metrics);

      return {
        teamId,
        teamName: await this.getTeamName(teamId),
        metrics: {
          totalPosts: metrics.totalPosts,
          totalEngagement: metrics.totalEngagement,
          totalReach: metrics.totalReach,
          averageEngagementRate: metrics.averageEngagementRate,
          activeUsers: metrics.activeUsers,
          performanceScore: metrics.performanceScore,
        },
        ranking,
        percentile,
        strengths,
        improvements,
        recommendations,
      };
    } catch (error) {
      console.error('Get team comparison error:', error);
      throw error;
    }
  }

  /**
   * Get team members
   */
  private async getTeamMembers(teamId: string): Promise<any[]> {
    try {
      const members = await prisma.teamMember.findMany({
        where: { teamId, status: 'active' },
        include: { user: true },
      });

      return members;
    } catch (error) {
      console.error('Get team members error:', error);
      return [];
    }
  }

  /**
   * Get team analytics
   */
  private async getTeamAnalytics(
    teamId: string,
    timeRange: { startDate: Date; endDate: Date }
  ): Promise<any> {
    try {
      // Get team members
      const teamMembers = await this.getTeamMembers(teamId);
      const userIds = teamMembers.map(member => member.userId);

      // Get all posts from team members
      const posts = await prisma.scheduledPost.findMany({
        where: {
          userId: { in: userIds },
          scheduledTime: {
            gte: timeRange.startDate,
            lte: timeRange.endDate,
          },
          status: 'published',
        },
      });

      // Calculate metrics
      const totalPosts = posts.length;
      const totalEngagement = posts.reduce((total, post) => {
        if (!post.results || !Array.isArray(post.results)) return total;
        return total + post.results.reduce((postTotal: number, result: any) => {
          if (!result.success) return postTotal;
          const metrics = result.platformData?.analytics || {};
          return postTotal + (metrics.likes || 0) + (metrics.comments || 0) + (metrics.shares || 0);
        }, 0);
      }, 0);

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

      const averageEngagementRate = totalImpressions > 0 ? (totalEngagement / totalImpressions) * 100 : 0;

      // Get top performing content
      const topPerformingContent = await this.getTopPerformingContent(posts);

      // Get platform breakdown
      const platformBreakdown = await this.getPlatformBreakdown(posts);

      return {
        totalPosts,
        totalEngagement,
        totalReach,
        totalImpressions,
        averageEngagementRate,
        topPerformingContent,
        platformBreakdown,
      };
    } catch (error) {
      console.error('Get team analytics error:', error);
      throw error;
    }
  }

  /**
   * Get user activity
   */
  private async getUserActivity(
    teamId: string,
    userIds: string[],
    timeRange: { startDate: Date; endDate: Date }
  ): Promise<UserActivity[]> {
    try {
      const userActivity: UserActivity[] = [];

      for (const userId of userIds) {
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (!user) continue;

        // Get user's posts
        const userPosts = await prisma.scheduledPost.findMany({
          where: {
            userId,
            scheduledTime: {
              gte: timeRange.startDate,
              lte: timeRange.endDate,
            },
            status: 'published',
          },
        });

        // Calculate user metrics
        const postsCreated = userPosts.length;
        const postsPublished = userPosts.filter(p => p.status === 'published').length;
        
        const engagementGenerated = userPosts.reduce((total, post) => {
          if (!post.results || !Array.isArray(post.results)) return total;
          return total + post.results.reduce((postTotal: number, result: any) => {
            if (!result.success) return postTotal;
            const metrics = result.platformData?.analytics || {};
            return postTotal + (metrics.likes || 0) + (metrics.comments || 0) + (metrics.shares || 0);
          }, 0);
        }, 0);

        const reachGenerated = userPosts.reduce((total, post) => {
          if (!post.results || !Array.isArray(post.results)) return total;
          return total + post.results.reduce((postTotal: number, result: any) => {
            if (!result.success) return postTotal;
            const metrics = result.platformData?.analytics || {};
            return postTotal + (metrics.reach || 0);
          }, 0);
        }, 0);

        // Calculate performance score
        const performanceScore = this.calculateUserPerformanceScore(
          postsCreated,
          engagementGenerated,
          reachGenerated
        );

        // Get activity trend
        const activityTrend = await this.calculateUserActivityTrend(userId, timeRange);

        // Get top content
        const topContent = userPosts
          .sort((a, b) => {
            const aEngagement = this.calculatePostEngagement(a);
            const bEngagement = this.calculatePostEngagement(b);
            return bEngagement - aEngagement;
          })
          .slice(0, 3)
          .map(post => post.content.substring(0, 50) + '...');

        userActivity.push({
          userId,
          userName: user.name || user.email,
          role: 'member', // TODO: Get actual role
          lastActive: user.lastActiveAt || user.createdAt,
          postsCreated,
          postsPublished,
          engagementGenerated,
          reachGenerated,
          performanceScore,
          activityTrend,
          topContent,
        });
      }

      return userActivity.sort((a, b) => b.performanceScore - a.performanceScore);
    } catch (error) {
      console.error('Get user activity error:', error);
      return [];
    }
  }

  /**
   * Get team growth metrics
   */
  private async getTeamGrowthMetrics(
    teamId: string,
    timeRange: { startDate: Date; endDate: Date }
  ): Promise<TeamGrowthMetrics> {
    try {
      // Get previous period for comparison
      const periodLength = timeRange.endDate.getTime() - timeRange.startDate.getTime();
      const previousStartDate = new Date(timeRange.startDate.getTime() - periodLength);
      const previousEndDate = new Date(timeRange.endDate.getTime() - periodLength);

      // Get current period metrics
      const currentMetrics = await this.getTeamAnalytics(teamId, timeRange);
      
      // Get previous period metrics
      const previousMetrics = await this.getTeamAnalytics(teamId, {
        startDate: previousStartDate,
        endDate: previousEndDate,
      });

      // Calculate growth percentages
      const userGrowth = this.calculateGrowthPercentage(
        previousMetrics.totalUsers || 0,
        currentMetrics.totalUsers || 0
      );

      const contentGrowth = this.calculateGrowthPercentage(
        previousMetrics.totalPosts || 0,
        currentMetrics.totalPosts
      );

      const engagementGrowth = this.calculateGrowthPercentage(
        previousMetrics.totalEngagement || 0,
        currentMetrics.totalEngagement
      );

      const reachGrowth = this.calculateGrowthPercentage(
        previousMetrics.totalReach || 0,
        currentMetrics.totalReach
      );

      // Get platform growth
      const platformGrowth: Record<string, number> = {};
      for (const platform of currentMetrics.platformBreakdown || []) {
        const previousPlatform = previousMetrics.platformBreakdown?.find(
          p => p.platform === platform.platform
        );
        platformGrowth[platform.platform] = this.calculateGrowthPercentage(
          previousPlatform?.posts || 0,
          platform.posts
        );
      }

      // Get milestones
      const milestones = await this.getGrowthMilestones(teamId, timeRange);

      return {
        period: `${timeRange.startDate.toISOString().split('T')[0]} to ${timeRange.endDate.toISOString().split('T')[0]}`,
        userGrowth,
        contentGrowth,
        engagementGrowth,
        reachGrowth,
        platformGrowth,
        milestones,
      };
    } catch (error) {
      console.error('Get team growth metrics error:', error);
      throw error;
    }
  }

  /**
   * Get content trends
   */
  private async getContentTrends(
    teamId: string,
    timeRange: { startDate: Date; endDate: Date }
  ): Promise<ContentTrend[]> {
    try {
      const trends: ContentTrend[] = [];

      // Get team members
      const teamMembers = await this.getTeamMembers(teamId);
      const userIds = teamMembers.map(member => member.userId);

      // Get posts
      const posts = await prisma.scheduledPost.findMany({
        where: {
          userId: { in: userIds },
          scheduledTime: {
            gte: timeRange.startDate,
            lte: timeRange.endDate,
          },
          status: 'published',
        },
      });

      // Analyze content type trends
      const contentTypeTrend = await this.analyzeContentTypeTrend(posts);
      if (contentTypeTrend) trends.push(contentTypeTrend);

      // Analyze platform trends
      const platformTrend = await this.analyzePlatformTrend(posts);
      if (platformTrend) trends.push(platformTrend);

      // Analyze timing trends
      const timingTrend = await this.analyzeTimingTrend(posts);
      if (timingTrend) trends.push(timingTrend);

      // Analyze hashtag trends
      const hashtagTrend = await this.analyzeHashtagTrend(posts);
      if (hashtagTrend) trends.push(hashtagTrend);

      return trends;
    } catch (error) {
      console.error('Get content trends error:', error);
      return [];
    }
  }

  /**
   * Get engagement insights
   */
  private async getEngagementInsights(
    teamId: string,
    timeRange: { startDate: Date; endDate: Date }
  ): Promise<EngagementInsight[]> {
    try {
      const insights: EngagementInsight[] = [];

      // Get team analytics
      const teamAnalytics = await this.getTeamAnalytics(teamId, timeRange);

      // Timing insights
      const timingInsight = await this.generateTimingInsight(teamAnalytics);
      if (timingInsight) insights.push(timingInsight);

      // Content insights
      const contentInsight = await this.generateContentInsight(teamAnalytics);
      if (contentInsight) insights.push(contentInsight);

      // Platform insights
      const platformInsight = await this.generatePlatformInsight(teamAnalytics);
      if (platformInsight) insights.push(platformInsight);

      // Audience insights
      const audienceInsight = await this.generateAudienceInsight(teamAnalytics);
      if (audienceInsight) insights.push(audienceInsight);

      return insights;
    } catch (error) {
      console.error('Get engagement insights error:', error);
      return [];
    }
  }

  /**
   * Get recommendations
   */
  private async getRecommendations(
    teamId: string,
    timeRange: { startDate: Date; endDate: Date }
  ): Promise<Recommendation[]> {
    try {
      const recommendations: Recommendation[] = [];

      // Get team analytics
      const teamAnalytics = await this.getTeamAnalytics(teamId, timeRange);

      // Content recommendations
      const contentRecommendations = await this.generateContentRecommendations(teamAnalytics);
      recommendations.push(...contentRecommendations);

      // Timing recommendations
      const timingRecommendations = await this.generateTimingRecommendations(teamAnalytics);
      recommendations.push(...timingRecommendations);

      // Platform recommendations
      const platformRecommendations = await this.generatePlatformRecommendations(teamAnalytics);
      recommendations.push(...platformRecommendations);

      // Team recommendations
      const teamRecommendations = await this.generateTeamRecommendations(teamAnalytics);
      recommendations.push(...teamRecommendations);

      return recommendations.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
    } catch (error) {
      console.error('Get recommendations error:', error);
      return [];
    }
  }

  /**
   * Calculate performance score
   */
  private async calculatePerformanceScore(
    teamId: string,
    timeRange: { startDate: Date; endDate: Date }
  ): Promise<number> {
    try {
      const teamAnalytics = await this.getTeamAnalytics(teamId, timeRange);
      
      // Calculate score based on multiple factors
      let score = 0;
      
      // Engagement rate score (0-40 points)
      const engagementRateScore = Math.min(40, (teamAnalytics.averageEngagementRate / 10) * 40);
      score += engagementRateScore;
      
      // Content volume score (0-20 points)
      const contentVolumeScore = Math.min(20, (teamAnalytics.totalPosts / 100) * 20);
      score += contentVolumeScore;
      
      // Reach score (0-20 points)
      const reachScore = Math.min(20, (teamAnalytics.totalReach / 10000) * 20);
      score += reachScore;
      
      // Platform diversity score (0-20 points)
      const platformDiversityScore = Math.min(20, (teamAnalytics.platformBreakdown?.length || 0) * 5);
      score += platformDiversityScore;
      
      return Math.round(score);
    } catch (error) {
      console.error('Calculate performance score error:', error);
      return 0;
    }
  }

  // Helper methods
  private calculateGrowthPercentage(previous: number, current: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }

  private calculateUserPerformanceScore(
    postsCreated: number,
    engagementGenerated: number,
    reachGenerated: number
  ): number {
    const engagementScore = Math.min(50, (engagementGenerated / 1000) * 50);
    const reachScore = Math.min(30, (reachGenerated / 5000) * 30);
    const contentScore = Math.min(20, (postsCreated / 10) * 20);
    
    return Math.round(engagementScore + reachScore + contentScore);
  }

  private calculateUserActivityTrend(
    userId: string,
    timeRange: { startDate: Date; endDate: Date }
  ): Promise<'increasing' | 'stable' | 'decreasing'> {
    // TODO: Implement activity trend calculation
    return Promise.resolve('stable');
  }

  private calculatePostEngagement(post: any): number {
    if (!post.results || !Array.isArray(post.results)) return 0;
    return post.results.reduce((total: number, result: any) => {
      if (!result.success) return total;
      const metrics = result.platformData?.analytics || {};
      return total + (metrics.likes || 0) + (metrics.comments || 0) + (metrics.shares || 0);
    }, 0);
  }

  private async getTopPerformingContent(posts: any[]): Promise<ContentPerformance[]> {
    // TODO: Implement top performing content analysis
    return [];
  }

  private async getPlatformBreakdown(posts: any[]): Promise<PlatformMetrics[]> {
    // TODO: Implement platform breakdown analysis
    return [];
  }

  private async getGrowthMilestones(teamId: string, timeRange: { startDate: Date; endDate: Date }): Promise<GrowthMilestone[]> {
    // TODO: Implement growth milestones
    return [];
  }

  private async analyzeContentTypeTrend(posts: any[]): Promise<ContentTrend | null> {
    // TODO: Implement content type trend analysis
    return null;
  }

  private async analyzePlatformTrend(posts: any[]): Promise<ContentTrend | null> {
    // TODO: Implement platform trend analysis
    return null;
  }

  private async analyzeTimingTrend(posts: any[]): Promise<ContentTrend | null> {
    // TODO: Implement timing trend analysis
    return null;
  }

  private async analyzeHashtagTrend(posts: any[]): Promise<ContentTrend | null> {
    // TODO: Implement hashtag trend analysis
    return null;
  }

  private async generateTimingInsight(teamAnalytics: any): Promise<EngagementInsight | null> {
    // TODO: Implement timing insight generation
    return null;
  }

  private async generateContentInsight(teamAnalytics: any): Promise<EngagementInsight | null> {
    // TODO: Implement content insight generation
    return null;
  }

  private async generatePlatformInsight(teamAnalytics: any): Promise<EngagementInsight | null> {
    // TODO: Implement platform insight generation
    return null;
  }

  private async generateAudienceInsight(teamAnalytics: any): Promise<EngagementInsight | null> {
    // TODO: Implement audience insight generation
    return null;
  }

  private async generateContentRecommendations(teamAnalytics: any): Promise<Recommendation[]> {
    // TODO: Implement content recommendations
    return [];
  }

  private async generateTimingRecommendations(teamAnalytics: any): Promise<Recommendation[]> {
    // TODO: Implement timing recommendations
    return [];
  }

  private async generatePlatformRecommendations(teamAnalytics: any): Promise<Recommendation[]> {
    // TODO: Implement platform recommendations
    return [];
  }

  private generateTeamRecommendations(metrics: EnterpriseMetrics): Recommendation[] {
    // TODO: Implement team recommendations
    return [];
  }

  private identifyStrengths(metrics: EnterpriseMetrics): string[] {
    // TODO: Implement strengths identification
    return [];
  }

  private identifyImprovements(metrics: EnterpriseMetrics): string[] {
    // TODO: Implement improvements identification
    return [];
  }

  private async getIndustryBenchmarks(): Promise<any> {
    // TODO: Implement industry benchmarks
    return {};
  }

  private async calculateTeamRanking(teamId: string, metrics: EnterpriseMetrics): Promise<number> {
    // TODO: Implement team ranking calculation
    return 1;
  }

  private async calculateTeamPercentile(teamId: string, metrics: EnterpriseMetrics): Promise<number> {
    // TODO: Implement team percentile calculation
    return 50;
  }

  private async getTeamName(teamId: string): Promise<string> {
    try {
      const team = await prisma.team.findUnique({
        where: { id: teamId },
        select: { name: true },
      });
      return team?.name || 'Unknown Team';
    } catch (error) {
      return 'Unknown Team';
    }
  }

  private async storeEnterpriseReport(report: EnterpriseReport): Promise<void> {
    try {
      await prisma.enterpriseReport.create({
        data: {
          teamId: report.teamId,
          type: report.type,
          period: report.period as any,
          metrics: report.metrics as any,
          insights: report.insights as any,
          recommendations: report.recommendations as any,
          generatedAt: report.generatedAt,
          generatedBy: report.generatedBy,
          recipients: report.recipients,
          status: report.status,
        },
      });
    } catch (error) {
      console.error('Store enterprise report error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const enterpriseAnalyticsService = new EnterpriseAnalyticsService();
