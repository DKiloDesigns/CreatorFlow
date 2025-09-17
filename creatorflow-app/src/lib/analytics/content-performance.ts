/**
 * Content Performance Tracking
 * Individual content piece performance tracking and analytics
 */

export interface ContentPerformance {
  contentId: string;
  title: string;
  platform: string;
  type: 'post' | 'story' | 'reel' | 'video' | 'image' | 'carousel';
  publishedAt: string;
  metrics: {
    views: number;
    likes: number;
    shares: number;
    comments: number;
    saves: number;
    clicks: number;
    reach: number;
    impressions: number;
    engagement: number;
    engagementRate: number;
    clickThroughRate: number;
    saveRate: number;
    shareRate: number;
  };
  demographics: {
    ageGroups: Array<{
      group: string;
      percentage: number;
    }>;
    genders: Array<{
      gender: string;
      percentage: number;
    }>;
    locations: Array<{
      country: string;
      city?: string;
      percentage: number;
    }>;
    devices: Array<{
      device: string;
      percentage: number;
    }>;
  };
  timing: {
    bestPerformingHour: number;
    bestPerformingDay: string;
    peakEngagementTime: string;
    averageViewDuration: number; // seconds
    completionRate: number; // percentage
  };
  hashtags: Array<{
    hashtag: string;
    performance: number;
    reach: number;
    engagement: number;
  }>;
  competitors: Array<{
    contentId: string;
    title: string;
    platform: string;
    performance: number;
    comparison: 'better' | 'worse' | 'similar';
  }>;
  trends: Array<{
    metric: string;
    value: number;
    change: number;
    period: string;
  }>;
  insights: string[];
  recommendations: string[];
  lastUpdated: string;
}

export interface PerformanceComparison {
  content1: ContentPerformance;
  content2: ContentPerformance;
  comparison: {
    views: { difference: number; percentage: number };
    engagement: { difference: number; percentage: number };
    reach: { difference: number; percentage: number };
    clicks: { difference: number; percentage: number };
  };
  winner: 'content1' | 'content2' | 'tie';
  insights: string[];
}

export interface PerformanceBenchmark {
  platform: string;
  type: string;
  category: string;
  metrics: {
    averageViews: number;
    averageEngagement: number;
    averageReach: number;
    averageClicks: number;
    topQuartileViews: number;
    topQuartileEngagement: number;
    topQuartileReach: number;
    topQuartileClicks: number;
  };
  sampleSize: number;
  lastUpdated: string;
}

export interface PerformanceReport {
  contentId: string;
  period: {
    start: string;
    end: string;
  };
  summary: {
    totalViews: number;
    totalEngagement: number;
    totalReach: number;
    averageEngagementRate: number;
    bestPerformingDay: string;
    bestPerformingHour: number;
    topHashtag: string;
    topLocation: string;
  };
  trends: Array<{
    date: string;
    views: number;
    engagement: number;
    reach: number;
  }>;
  insights: string[];
  recommendations: string[];
  generatedAt: string;
}

export class ContentPerformanceTracker {
  private performances: Map<string, ContentPerformance> = new Map();
  private benchmarks: Map<string, PerformanceBenchmark> = new Map();

  // Track content performance
  async trackPerformance(
    contentId: string,
    platform: string,
    type: string,
    publishedAt: string,
    metrics: Partial<ContentPerformance['metrics']>
  ): Promise<ContentPerformance> {
    const existing = this.performances.get(contentId);
    
    if (existing) {
      // Update existing performance
      const updated: ContentPerformance = {
        ...existing,
        metrics: {
          ...existing.metrics,
          ...metrics,
          engagement: this.calculateEngagement(metrics),
          engagementRate: this.calculateEngagementRate(metrics),
          clickThroughRate: this.calculateCTR(metrics),
          saveRate: this.calculateSaveRate(metrics),
          shareRate: this.calculateShareRate(metrics)
        },
        lastUpdated: new Date().toISOString()
      };
      
      this.performances.set(contentId, updated);
      return updated;
    }

    // Create new performance tracking
    const performance: ContentPerformance = {
      contentId,
      title: `Content ${contentId}`,
      platform,
      type: type as any,
      publishedAt,
      metrics: {
        views: metrics.views || 0,
        likes: metrics.likes || 0,
        shares: metrics.shares || 0,
        comments: metrics.comments || 0,
        saves: metrics.saves || 0,
        clicks: metrics.clicks || 0,
        reach: metrics.reach || 0,
        impressions: metrics.impressions || 0,
        engagement: this.calculateEngagement(metrics),
        engagementRate: this.calculateEngagementRate(metrics),
        clickThroughRate: this.calculateCTR(metrics),
        saveRate: this.calculateSaveRate(metrics),
        shareRate: this.calculateShareRate(metrics)
      },
      demographics: await this.getDemographics(contentId, platform),
      timing: await this.getTimingData(contentId, platform),
      hashtags: await this.getHashtagPerformance(contentId, platform),
      competitors: await this.getCompetitorData(contentId, platform),
      trends: await this.getTrendData(contentId, platform),
      insights: await this.generateInsights(contentId, platform),
      recommendations: await this.generateRecommendations(contentId, platform),
      lastUpdated: new Date().toISOString()
    };

    this.performances.set(contentId, performance);
    return performance;
  }

  // Get content performance
  async getPerformance(contentId: string): Promise<ContentPerformance | null> {
    return this.performances.get(contentId) || null;
  }

  // Get performances by platform
  async getPerformancesByPlatform(platform: string): Promise<ContentPerformance[]> {
    return Array.from(this.performances.values())
      .filter(p => p.platform === platform)
      .sort((a, b) => b.metrics.engagement - a.metrics.engagement);
  }

  // Get top performing content
  async getTopPerformingContent(
    platform?: string,
    type?: string,
    limit: number = 10
  ): Promise<ContentPerformance[]> {
    let performances = Array.from(this.performances.values());

    if (platform) {
      performances = performances.filter(p => p.platform === platform);
    }

    if (type) {
      performances = performances.filter(p => p.type === type);
    }

    return performances
      .sort((a, b) => b.metrics.engagement - a.metrics.engagement)
      .slice(0, limit);
  }

  // Compare content performance
  async comparePerformance(
    contentId1: string,
    contentId2: string
  ): Promise<PerformanceComparison> {
    const content1 = this.performances.get(contentId1);
    const content2 = this.performances.get(contentId2);

    if (!content1 || !content2) {
      throw new Error('One or both content pieces not found');
    }

    const comparison = {
      views: {
        difference: content2.metrics.views - content1.metrics.views,
        percentage: ((content2.metrics.views - content1.metrics.views) / content1.metrics.views) * 100
      },
      engagement: {
        difference: content2.metrics.engagement - content1.metrics.engagement,
        percentage: ((content2.metrics.engagement - content1.metrics.engagement) / content1.metrics.engagement) * 100
      },
      reach: {
        difference: content2.metrics.reach - content1.metrics.reach,
        percentage: ((content2.metrics.reach - content1.metrics.reach) / content1.metrics.reach) * 100
      },
      clicks: {
        difference: content2.metrics.clicks - content1.metrics.clicks,
        percentage: ((content2.metrics.clicks - content1.metrics.clicks) / content1.metrics.clicks) * 100
      }
    };

    const totalScore1 = content1.metrics.views + content1.metrics.engagement + content1.metrics.reach;
    const totalScore2 = content2.metrics.views + content2.metrics.engagement + content2.metrics.reach;

    let winner: 'content1' | 'content2' | 'tie' = 'tie';
    if (totalScore1 > totalScore2) {
      winner = 'content1';
    } else if (totalScore2 > totalScore1) {
      winner = 'content2';
    }

    const insights = this.generateComparisonInsights(content1, content2, comparison);

    return {
      content1,
      content2,
      comparison,
      winner,
      insights
    };
  }

  // Get performance benchmark
  async getBenchmark(platform: string, type: string, category: string): Promise<PerformanceBenchmark> {
    const key = `${platform}_${type}_${category}`;
    let benchmark = this.benchmarks.get(key);

    if (!benchmark) {
      benchmark = await this.calculateBenchmark(platform, type, category);
      this.benchmarks.set(key, benchmark);
    }

    return benchmark;
  }

  // Generate performance report
  async generateReport(
    contentId: string,
    startDate: string,
    endDate: string
  ): Promise<PerformanceReport> {
    const performance = this.performances.get(contentId);
    if (!performance) {
      throw new Error('Content not found');
    }

    const trends = await this.getTrendData(contentId, performance.platform);
    const insights = await this.generateInsights(contentId, performance.platform);
    const recommendations = await this.generateRecommendations(contentId, performance.platform);

    const summary = {
      totalViews: performance.metrics.views,
      totalEngagement: performance.metrics.engagement,
      totalReach: performance.metrics.reach,
      averageEngagementRate: performance.metrics.engagementRate,
      bestPerformingDay: performance.timing.bestPerformingDay,
      bestPerformingHour: performance.timing.bestPerformingHour,
      topHashtag: performance.hashtags[0]?.hashtag || 'N/A',
      topLocation: performance.demographics.locations[0]?.country || 'N/A'
    };

    return {
      contentId,
      period: { start: startDate, end: endDate },
      summary,
      trends,
      insights,
      recommendations,
      generatedAt: new Date().toISOString()
    };
  }

  // Get performance analytics
  async getAnalytics(platform?: string): Promise<{
    totalContent: number;
    averageEngagement: number;
    topPerformingContent: ContentPerformance[];
    platformBreakdown: Array<{
      platform: string;
      count: number;
      averageEngagement: number;
    }>;
    typeBreakdown: Array<{
      type: string;
      count: number;
      averageEngagement: number;
    }>;
    trends: Array<{
      date: string;
      totalViews: number;
      totalEngagement: number;
    }>;
  }> {
    let performances = Array.from(this.performances.values());

    if (platform) {
      performances = performances.filter(p => p.platform === platform);
    }

    const totalContent = performances.length;
    const averageEngagement = performances.length > 0 
      ? performances.reduce((sum, p) => sum + p.metrics.engagement, 0) / performances.length 
      : 0;

    const topPerformingContent = performances
      .sort((a, b) => b.metrics.engagement - a.metrics.engagement)
      .slice(0, 10);

    const platformBreakdown = this.calculatePlatformBreakdown(performances);
    const typeBreakdown = this.calculateTypeBreakdown(performances);
    const trends = this.calculateTrends(performances);

    return {
      totalContent,
      averageEngagement: Math.round(averageEngagement * 100) / 100,
      topPerformingContent,
      platformBreakdown,
      typeBreakdown,
      trends
    };
  }

  // Private helper methods
  private calculateEngagement(metrics: Partial<ContentPerformance['metrics']>): number {
    const { likes = 0, shares = 0, comments = 0, saves = 0 } = metrics;
    return likes + (shares * 2) + (comments * 3) + (saves * 2);
  }

  private calculateEngagementRate(metrics: Partial<ContentPerformance['metrics']>): number {
    const { views = 0, likes = 0, shares = 0, comments = 0, saves = 0 } = metrics;
    if (views === 0) return 0;
    return ((likes + shares + comments + saves) / views) * 100;
  }

  private calculateCTR(metrics: Partial<ContentPerformance['metrics']>): number {
    const { clicks = 0, impressions = 0 } = metrics;
    if (impressions === 0) return 0;
    return (clicks / impressions) * 100;
  }

  private calculateSaveRate(metrics: Partial<ContentPerformance['metrics']>): number {
    const { saves = 0, views = 0 } = metrics;
    if (views === 0) return 0;
    return (saves / views) * 100;
  }

  private calculateShareRate(metrics: Partial<ContentPerformance['metrics']>): number {
    const { shares = 0, views = 0 } = metrics;
    if (views === 0) return 0;
    return (shares / views) * 100;
  }

  private async getDemographics(contentId: string, platform: string): Promise<ContentPerformance['demographics']> {
    // Mock demographics data - in production, fetch from platform APIs
    return {
      ageGroups: [
        { group: '18-24', percentage: 25 },
        { group: '25-34', percentage: 35 },
        { group: '35-44', percentage: 25 },
        { group: '45+', percentage: 15 }
      ],
      genders: [
        { gender: 'Female', percentage: 60 },
        { gender: 'Male', percentage: 40 }
      ],
      locations: [
        { country: 'United States', city: 'New York', percentage: 30 },
        { country: 'United States', city: 'Los Angeles', percentage: 20 },
        { country: 'Canada', percentage: 15 },
        { country: 'United Kingdom', percentage: 10 }
      ],
      devices: [
        { device: 'Mobile', percentage: 70 },
        { device: 'Desktop', percentage: 25 },
        { device: 'Tablet', percentage: 5 }
      ]
    };
  }

  private async getTimingData(contentId: string, platform: string): Promise<ContentPerformance['timing']> {
    // Mock timing data - in production, analyze actual performance data
    return {
      bestPerformingHour: 14, // 2 PM
      bestPerformingDay: 'Wednesday',
      peakEngagementTime: '2:00 PM',
      averageViewDuration: 45, // seconds
      completionRate: 75 // percentage
    };
  }

  private async getHashtagPerformance(contentId: string, platform: string): Promise<ContentPerformance['hashtags']> {
    // Mock hashtag performance - in production, analyze hashtag data
    return [
      { hashtag: '#marketing', performance: 85, reach: 1000, engagement: 150 },
      { hashtag: '#socialmedia', performance: 75, reach: 800, engagement: 120 },
      { hashtag: '#content', performance: 65, reach: 600, engagement: 90 }
    ];
  }

  private async getCompetitorData(contentId: string, platform: string): Promise<ContentPerformance['competitors']> {
    // Mock competitor data - in production, analyze competitor content
    return [
      {
        contentId: 'comp_1',
        title: 'Competitor Content 1',
        platform,
        performance: 80,
        comparison: 'better'
      },
      {
        contentId: 'comp_2',
        title: 'Competitor Content 2',
        platform,
        performance: 60,
        comparison: 'worse'
      }
    ];
  }

  private async getTrendData(contentId: string, platform: string): Promise<ContentPerformance['trends']> {
    // Mock trend data - in production, analyze historical performance
    return [
      { metric: 'views', value: 1000, change: 15, period: '7 days' },
      { metric: 'engagement', value: 150, change: 25, period: '7 days' },
      { metric: 'reach', value: 800, change: 10, period: '7 days' }
    ];
  }

  private async generateInsights(contentId: string, platform: string): Promise<string[]> {
    // Mock insights - in production, use AI to generate insights
    return [
      'This content performed 25% better than your average posts',
      'Peak engagement occurred at 2:00 PM on Wednesday',
      'Mobile users generated 70% of total engagement',
      'Hashtag #marketing drove the most engagement'
    ];
  }

  private async generateRecommendations(contentId: string, platform: string): Promise<string[]> {
    // Mock recommendations - in production, use AI to generate recommendations
    return [
      'Post similar content on Wednesdays at 2:00 PM',
      'Include more mobile-optimized visuals',
      'Use #marketing hashtag in future posts',
      'Consider creating a series based on this content'
    ];
  }

  private async calculateBenchmark(platform: string, type: string, category: string): Promise<PerformanceBenchmark> {
    // Mock benchmark calculation - in production, calculate from actual data
    return {
      platform,
      type,
      category,
      metrics: {
        averageViews: 500,
        averageEngagement: 75,
        averageReach: 400,
        averageClicks: 25,
        topQuartileViews: 1000,
        topQuartileEngagement: 150,
        topQuartileReach: 800,
        topQuartileClicks: 50
      },
      sampleSize: 100,
      lastUpdated: new Date().toISOString()
    };
  }

  private generateComparisonInsights(
    content1: ContentPerformance,
    content2: ContentPerformance,
    comparison: PerformanceComparison['comparison']
  ): string[] {
    const insights: string[] = [];

    if (comparison.views.percentage > 0) {
      insights.push(`Content 2 has ${Math.abs(comparison.views.percentage).toFixed(1)}% more views`);
    } else {
      insights.push(`Content 1 has ${Math.abs(comparison.views.percentage).toFixed(1)}% more views`);
    }

    if (comparison.engagement.percentage > 0) {
      insights.push(`Content 2 has ${Math.abs(comparison.engagement.percentage).toFixed(1)}% higher engagement`);
    } else {
      insights.push(`Content 1 has ${Math.abs(comparison.engagement.percentage).toFixed(1)}% higher engagement`);
    }

    return insights;
  }

  private calculatePlatformBreakdown(performances: ContentPerformance[]): Array<{ platform: string; count: number; averageEngagement: number }> {
    const breakdown = new Map<string, { count: number; totalEngagement: number }>();

    performances.forEach(p => {
      const current = breakdown.get(p.platform) || { count: 0, totalEngagement: 0 };
      breakdown.set(p.platform, {
        count: current.count + 1,
        totalEngagement: current.totalEngagement + p.metrics.engagement
      });
    });

    return Array.from(breakdown.entries()).map(([platform, data]) => ({
      platform,
      count: data.count,
      averageEngagement: data.totalEngagement / data.count
    }));
  }

  private calculateTypeBreakdown(performances: ContentPerformance[]): Array<{ type: string; count: number; averageEngagement: number }> {
    const breakdown = new Map<string, { count: number; totalEngagement: number }>();

    performances.forEach(p => {
      const current = breakdown.get(p.type) || { count: 0, totalEngagement: 0 };
      breakdown.set(p.type, {
        count: current.count + 1,
        totalEngagement: current.totalEngagement + p.metrics.engagement
      });
    });

    return Array.from(breakdown.entries()).map(([type, data]) => ({
      type,
      count: data.count,
      averageEngagement: data.totalEngagement / data.count
    }));
  }

  private calculateTrends(performances: ContentPerformance[]): Array<{ date: string; totalViews: number; totalEngagement: number }> {
    // Mock trend calculation - in production, group by date and calculate totals
    const trends: Array<{ date: string; totalViews: number; totalEngagement: number }> = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      trends.push({
        date: date.toISOString().split('T')[0],
        totalViews: Math.floor(Math.random() * 1000) + 500,
        totalEngagement: Math.floor(Math.random() * 200) + 100
      });
    }

    return trends;
  }
}
