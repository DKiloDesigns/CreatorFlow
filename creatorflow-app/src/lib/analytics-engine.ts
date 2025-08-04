import { prisma } from '@/lib/prisma';
import { defaultCache as cache } from './cache';
import { performanceMonitor } from './performance-monitor';

interface AnalyticsEvent {
  id: string;
  userId: string;
  eventType: string;
  eventData: any;
  timestamp: Date;
  platform?: string;
  metadata?: any;
}

interface AnalyticsMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  dimensions?: Record<string, any>;
}

interface PredictiveInsight {
  type: 'trend' | 'anomaly' | 'opportunity' | 'risk';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  recommendations: string[];
  data: any;
}

interface UserSegment {
  id: string;
  name: string;
  criteria: Record<string, any>;
  userCount: number;
  engagementScore: number;
  lifetimeValue: number;
  churnRisk: number;
}

class AnalyticsEngine {
  private eventQueue: AnalyticsEvent[] = [];
  private processingInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startEventProcessing();
  }

  // Event tracking
  async trackEvent(userId: string, eventType: string, eventData: any, platform?: string, metadata?: any): Promise<void> {
    const event: AnalyticsEvent = {
      id: this.generateEventId(),
      userId,
      eventType,
      eventData,
      timestamp: new Date(),
      platform,
      metadata,
    };

    // Add to processing queue
    this.eventQueue.push(event);

    // Store in database
    try {
      await prisma.analyticsEvent.create({
        data: {
          userId,
          eventType,
          eventData: JSON.stringify(eventData),
          timestamp: event.timestamp,
          platform,
          metadata: metadata ? JSON.stringify(metadata) : null,
        },
      });
    } catch (error) {
      console.error('Failed to store analytics event:', error);
    }

    // Trigger real-time processing for high-priority events
    if (this.isHighPriorityEvent(eventType)) {
      await this.processEventImmediately(event);
    }
  }

  // User engagement tracking
  async trackUserEngagement(userId: string, action: string, platform: string, metadata?: any): Promise<void> {
    await this.trackEvent(userId, 'USER_ENGAGEMENT', {
      action,
      platform,
      timestamp: new Date(),
    }, platform, metadata);
  }

  // Content performance tracking
  async trackContentPerformance(userId: string, contentId: string, platform: string, metrics: any): Promise<void> {
    await this.trackEvent(userId, 'CONTENT_PERFORMANCE', {
      contentId,
      platform,
      metrics,
      timestamp: new Date(),
    }, platform);
  }

  // Platform integration tracking
  async trackPlatformIntegration(userId: string, platform: string, action: string, success: boolean): Promise<void> {
    await this.trackEvent(userId, 'PLATFORM_INTEGRATION', {
      platform,
      action,
      success,
      timestamp: new Date(),
    }, platform);
  }

  // Revenue tracking
  async trackRevenue(userId: string, amount: number, source: string, metadata?: any): Promise<void> {
    await this.trackEvent(userId, 'REVENUE', {
      amount,
      source,
      timestamp: new Date(),
    }, undefined, metadata);
  }

  // Predictive analytics
  async generatePredictiveInsights(userId: string): Promise<PredictiveInsight[]> {
    const insights: PredictiveInsight[] = [];
    
    try {
      // Get user's historical data
      const userEvents = await this.getUserEvents(userId, 30); // Last 30 days
      const userMetrics = await this.calculateUserMetrics(userId);
      
      // Engagement trend analysis
      const engagementTrend = this.analyzeEngagementTrend(userEvents);
      if (engagementTrend.trend === 'declining' && engagementTrend.confidence > 0.7) {
        insights.push({
          type: 'risk',
          title: 'Declining User Engagement',
          description: `Your engagement has decreased by ${engagementTrend.declineRate}% over the last 30 days.`,
          confidence: engagementTrend.confidence,
          impact: 'high',
          recommendations: [
            'Increase content frequency',
            'Try new content formats',
            'Engage with your audience more actively',
          ],
          data: engagementTrend,
        });
      }

      // Optimal posting time analysis
      const optimalTimes = await this.analyzeOptimalPostingTimes(userId);
      if (optimalTimes.recommendations.length > 0) {
        insights.push({
          type: 'opportunity',
          title: 'Optimal Posting Times Identified',
          description: 'AI analysis suggests better posting times for maximum engagement.',
          confidence: 0.8,
          impact: 'medium',
          recommendations: optimalTimes.recommendations,
          data: optimalTimes,
        });
      }

      // Content performance prediction
      const contentPrediction = await this.predictContentPerformance(userId);
      if (contentPrediction.score > 0.7) {
        insights.push({
          type: 'opportunity',
          title: 'High-Performing Content Pattern',
          description: `Content with ${contentPrediction.pattern} performs ${contentPrediction.improvement}% better.`,
          confidence: contentPrediction.score,
          impact: 'medium',
          recommendations: [
            'Focus on this content type',
            'Optimize similar content',
            'Scale this pattern',
          ],
          data: contentPrediction,
        });
      }

      // Churn risk analysis
      const churnRisk = await this.calculateChurnRisk(userId);
      if (churnRisk.risk > 0.6) {
        insights.push({
          type: 'risk',
          title: 'High Churn Risk Detected',
          description: `User shows signs of disengagement with ${Math.round(churnRisk.risk * 100)}% churn risk.`,
          confidence: churnRisk.confidence,
          impact: 'high',
          recommendations: [
            'Send re-engagement campaign',
            'Offer personalized content',
            'Provide support or incentives',
          ],
          data: churnRisk,
        });
      }

    } catch (error) {
      console.error('Failed to generate predictive insights:', error);
    }

    return insights;
  }

  // User segmentation
  async createUserSegments(): Promise<UserSegment[]> {
    const segments: UserSegment[] = [];

    try {
      // Get all users with their metrics
      const users = await prisma.user.findMany({
        include: {
          analyticsEvents: {
            where: {
              timestamp: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
              },
            },
          },
          posts: {
            include: {
              analytics: true,
            },
          },
        },
      });

      // High-engagement users
      const highEngagementUsers = users.filter(user => {
        const engagementScore = this.calculateUserEngagementScore(user);
        return engagementScore > 0.8;
      });

      if (highEngagementUsers.length > 0) {
        segments.push({
          id: 'high_engagement',
          name: 'High Engagement Users',
          criteria: { engagementScore: { gt: 0.8 } },
          userCount: highEngagementUsers.length,
          engagementScore: 0.9,
          lifetimeValue: this.calculateAverageLTV(highEngagementUsers),
          churnRisk: 0.1,
        });
      }

      // New users (last 7 days)
      const newUsers = users.filter(user => 
        user.createdAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );

      if (newUsers.length > 0) {
        segments.push({
          id: 'new_users',
          name: 'New Users (Last 7 Days)',
          criteria: { createdAt: { gt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
          userCount: newUsers.length,
          engagementScore: this.calculateAverageEngagement(newUsers),
          lifetimeValue: this.calculateAverageLTV(newUsers),
          churnRisk: 0.3,
        });
      }

      // At-risk users
      const atRiskUsers = users.filter(user => {
        const lastActivity = this.getLastActivityDate(user);
        const daysSinceActivity = (Date.now() - lastActivity.getTime()) / (24 * 60 * 60 * 1000);
        return daysSinceActivity > 14; // No activity for 14+ days
      });

      if (atRiskUsers.length > 0) {
        segments.push({
          id: 'at_risk',
          name: 'At-Risk Users',
          criteria: { lastActivity: { lt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) } },
          userCount: atRiskUsers.length,
          engagementScore: this.calculateAverageEngagement(atRiskUsers),
          lifetimeValue: this.calculateAverageLTV(atRiskUsers),
          churnRisk: 0.8,
        });
      }

    } catch (error) {
      console.error('Failed to create user segments:', error);
    }

    return segments;
  }

  // Real-time analytics
  async getRealTimeMetrics(): Promise<Record<string, any>> {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    try {
      const [
        activeUsers,
        newUsers,
        totalEvents,
        platformUsage,
        topContent,
      ] = await Promise.all([
        this.getActiveUsers(oneHourAgo),
        this.getNewUsers(oneHourAgo),
        this.getTotalEvents(oneHourAgo),
        this.getPlatformUsage(oneHourAgo),
        this.getTopContent(oneHourAgo),
      ]);

      return {
        activeUsers,
        newUsers,
        totalEvents,
        platformUsage,
        topContent,
        timestamp: now,
      };
    } catch (error) {
      console.error('Failed to get real-time metrics:', error);
      return {};
    }
  }

  // Advanced analytics queries
  async getFunnelAnalysis(userId: string): Promise<any> {
    try {
      const userEvents = await this.getUserEvents(userId, 90); // Last 90 days
      
      const funnel = {
        signup: 0,
        firstPost: 0,
        platformConnection: 0,
        contentCreation: 0,
        engagement: 0,
        conversion: 0,
      };

      for (const event of userEvents) {
        switch (event.eventType) {
          case 'USER_SIGNUP':
            funnel.signup++;
            break;
          case 'FIRST_POST':
            funnel.firstPost++;
            break;
          case 'PLATFORM_CONNECTED':
            funnel.platformConnection++;
            break;
          case 'CONTENT_CREATED':
            funnel.contentCreation++;
            break;
          case 'USER_ENGAGEMENT':
            funnel.engagement++;
            break;
          case 'REVENUE':
            funnel.conversion++;
            break;
        }
      }

      return {
        funnel,
        conversionRates: {
          signupToFirstPost: funnel.signup > 0 ? (funnel.firstPost / funnel.signup) * 100 : 0,
          firstPostToPlatform: funnel.firstPost > 0 ? (funnel.platformConnection / funnel.firstPost) * 100 : 0,
          platformToContent: funnel.platformConnection > 0 ? (funnel.contentCreation / funnel.platformConnection) * 100 : 0,
          contentToEngagement: funnel.contentCreation > 0 ? (funnel.engagement / funnel.contentCreation) * 100 : 0,
          engagementToConversion: funnel.engagement > 0 ? (funnel.conversion / funnel.engagement) * 100 : 0,
        },
      };
    } catch (error) {
      console.error('Failed to get funnel analysis:', error);
      return {};
    }
  }

  // Helper methods
  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private isHighPriorityEvent(eventType: string): boolean {
    const highPriorityEvents = ['REVENUE', 'USER_CHURN', 'CRITICAL_ERROR'];
    return highPriorityEvents.includes(eventType);
  }

  private async processEventImmediately(event: AnalyticsEvent): Promise<void> {
    // Process high-priority events immediately
    if (event.eventType === 'REVENUE') {
      await this.updateRevenueMetrics(event);
    } else if (event.eventType === 'USER_CHURN') {
      await this.updateChurnMetrics(event);
    }
  }

  private startEventProcessing(): void {
    this.processingInterval = setInterval(async () => {
      if (this.eventQueue.length > 0) {
        const events = this.eventQueue.splice(0, 100); // Process up to 100 events
        await this.processEventBatch(events);
      }
    }, 5000); // Process every 5 seconds
  }

  private async processEventBatch(events: AnalyticsEvent[]): Promise<void> {
    // Process events in batches for efficiency
    for (const event of events) {
      await this.updateAggregateMetrics(event);
    }
  }

  private async updateAggregateMetrics(event: AnalyticsEvent): Promise<void> {
    // Update various aggregate metrics based on event type
    const cacheKey = `analytics:aggregate:${event.eventType}`;
    const currentMetrics = await cache.get(cacheKey) || { count: 0, totalValue: 0 };
    
    currentMetrics.count++;
    if (event.eventData?.value) {
      currentMetrics.totalValue += event.eventData.value;
    }
    
    await cache.set(cacheKey, currentMetrics, 3600000); // 1 hour TTL
  }

  private async updateRevenueMetrics(event: AnalyticsEvent): Promise<void> {
    const revenueData = event.eventData;
    if (revenueData?.amount) {
      // Update revenue tracking
      await prisma.analyticsMetric.create({
        data: {
          name: 'revenue',
          value: revenueData.amount,
          unit: 'USD',
          timestamp: event.timestamp,
          metadata: JSON.stringify(revenueData),
        },
      });
    }
  }

  private async updateChurnMetrics(event: AnalyticsEvent): Promise<void> {
    // Update churn tracking
    await prisma.analyticsMetric.create({
      data: {
        name: 'churn',
        value: 1,
        unit: 'count',
        timestamp: event.timestamp,
        metadata: JSON.stringify(event.eventData),
      },
    });
  }

  private async getUserEvents(userId: string, days: number): Promise<AnalyticsEvent[]> {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    const events = await prisma.analyticsEvent.findMany({
      where: {
        userId,
        timestamp: { gte: startDate },
      },
      orderBy: { timestamp: 'asc' },
    });

    return events.map(event => ({
      id: event.id,
      userId: event.userId,
      eventType: event.eventType,
      eventData: JSON.parse(event.eventData),
      timestamp: event.timestamp,
      platform: event.platform,
      metadata: event.metadata ? JSON.parse(event.metadata) : undefined,
    }));
  }

  private calculateUserEngagementScore(user: any): number {
    const events = user.analyticsEvents || [];
    const posts = user.posts || [];
    
    let score = 0;
    
    // Event-based scoring
    score += events.length * 0.1;
    
    // Post-based scoring
    score += posts.length * 0.2;
    
    // Engagement-based scoring
    const engagementEvents = events.filter(e => e.eventType === 'USER_ENGAGEMENT');
    score += engagementEvents.length * 0.3;
    
    return Math.min(1, score);
  }

  private calculateAverageLTV(users: any[]): number {
    if (users.length === 0) return 0;
    
    const totalLTV = users.reduce((sum, user) => {
      const revenueEvents = user.analyticsEvents?.filter(e => e.eventType === 'REVENUE') || [];
      const userLTV = revenueEvents.reduce((total, event) => {
        const data = JSON.parse(event.eventData);
        return total + (data.amount || 0);
      }, 0);
      return sum + userLTV;
    }, 0);
    
    return totalLTV / users.length;
  }

  private calculateAverageEngagement(users: any[]): number {
    if (users.length === 0) return 0;
    
    const totalEngagement = users.reduce((sum, user) => {
      return sum + this.calculateUserEngagementScore(user);
    }, 0);
    
    return totalEngagement / users.length;
  }

  private getLastActivityDate(user: any): Date {
    const events = user.analyticsEvents || [];
    if (events.length === 0) return user.createdAt;
    
    const latestEvent = events.reduce((latest, event) => {
      return event.timestamp > latest.timestamp ? event : latest;
    });
    
    return latestEvent.timestamp;
  }

  private analyzeEngagementTrend(events: AnalyticsEvent[]): any {
    // Simple trend analysis
    const recentEvents = events.filter(e => 
      e.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );
    const olderEvents = events.filter(e => 
      e.timestamp <= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) &&
      e.timestamp > new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    );
    
    const recentCount = recentEvents.length;
    const olderCount = olderEvents.length;
    
    if (olderCount === 0) return { trend: 'stable', confidence: 0.5 };
    
    const change = ((recentCount - olderCount) / olderCount) * 100;
    
    return {
      trend: change > 10 ? 'increasing' : change < -10 ? 'declining' : 'stable',
      declineRate: Math.abs(change),
      confidence: 0.8,
    };
  }

  private async analyzeOptimalPostingTimes(userId: string): Promise<any> {
    // Mock optimal posting time analysis
    return {
      recommendations: [
        'Post between 9-11 AM for maximum engagement',
        'Tuesday and Thursday show highest performance',
        'Video content performs 40% better than images',
      ],
      data: {
        bestHours: [9, 10, 11, 19, 20],
        bestDays: ['Tuesday', 'Thursday'],
        contentTypes: ['video', 'image', 'text'],
      },
    };
  }

  private async predictContentPerformance(userId: string): Promise<any> {
    // Mock content performance prediction
    return {
      score: 0.85,
      pattern: 'video content with hashtags',
      improvement: 40,
    };
  }

  private async calculateChurnRisk(userId: string): Promise<any> {
    // Mock churn risk calculation
    return {
      risk: 0.3,
      confidence: 0.7,
      factors: ['reduced engagement', 'no recent posts'],
    };
  }

  private async getActiveUsers(since: Date): Promise<number> {
    const result = await prisma.analyticsEvent.groupBy({
      by: ['userId'],
      where: {
        timestamp: { gte: since },
      },
    });
    return result.length;
  }

  private async getNewUsers(since: Date): Promise<number> {
    const result = await prisma.user.count({
      where: {
        createdAt: { gte: since },
      },
    });
    return result;
  }

  private async getTotalEvents(since: Date): Promise<number> {
    const result = await prisma.analyticsEvent.count({
      where: {
        timestamp: { gte: since },
      },
    });
    return result;
  }

  private async getPlatformUsage(since: Date): Promise<Record<string, number>> {
    const result = await prisma.analyticsEvent.groupBy({
      by: ['platform'],
      _count: { platform: true },
      where: {
        timestamp: { gte: since },
        platform: { not: null },
      },
    });
    
    return result.reduce((acc, item) => {
      acc[item.platform!] = item._count.platform;
      return acc;
    }, {} as Record<string, number>);
  }

  private async getTopContent(since: Date): Promise<any[]> {
    const result = await prisma.post.findMany({
      where: {
        createdAt: { gte: since },
      },
      include: {
        analytics: true,
      },
      orderBy: {
        analytics: {
          engagement: 'desc',
        },
      },
      take: 5,
    });
    
    return result.map(post => ({
      id: post.id,
      content: post.content,
      engagement: post.analytics?.engagement || 0,
      platform: post.platform,
    }));
  }
}

// Export analytics engine instance
export const analyticsEngine = new AnalyticsEngine(); 