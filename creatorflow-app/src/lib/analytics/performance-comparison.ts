/**
 * Performance Comparison Engine
 * Compare content performance across platforms
 */

export interface PerformanceComparison {
  id: string;
  contentId: string;
  platforms: string[];
  metrics: ComparisonMetrics;
  results: PlatformResult[];
  insights: ComparisonInsight[];
  recommendations: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ComparisonMetrics {
  primary: {
    name: string;
    description: string;
    unit: string;
  };
  secondary: Array<{
    name: string;
    description: string;
    unit: string;
  }>;
  custom: Array<{
    name: string;
    description: string;
    unit: string;
    formula: string;
  }>;
}

export interface PlatformResult {
  platform: string;
  metrics: {
    primary: number;
    secondary: Record<string, number>;
    custom: Record<string, number>;
  };
  performance: {
    score: number;
    rank: number;
    percentile: number;
    trend: 'up' | 'down' | 'stable';
    change: number; // percentage
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
      percentage: number;
    }>;
  };
  timing: {
    bestPerformingHour: number;
    bestPerformingDay: string;
    peakEngagementTime: string;
  };
  content: {
    type: string;
    format: string;
    length: number;
    hashtags: string[];
    mentions: string[];
  };
  engagement: {
    rate: number;
    quality: number;
    sentiment: number;
    virality: number;
  };
}

export interface ComparisonInsight {
  type: 'performance' | 'demographics' | 'timing' | 'content' | 'engagement';
  title: string;
  description: string;
  platforms: string[];
  metric: string;
  value: number;
  significance: 'high' | 'medium' | 'low';
  actionable: boolean;
  recommendation?: string;
}

export interface CrossPlatformAnalytics {
  totalComparisons: number;
  averagePerformance: number;
  bestPerformingPlatform: string;
  worstPerformingPlatform: string;
  platformRankings: Array<{
    platform: string;
    averageScore: number;
    totalContent: number;
    growth: number;
  }>;
  commonInsights: string[];
  bestPractices: Array<{
    platform: string;
    practice: string;
    impact: number;
  }>;
  trends: Array<{
    platform: string;
    trend: string;
    direction: 'up' | 'down' | 'stable';
    confidence: number;
  }>;
}

export interface PlatformBenchmark {
  platform: string;
  category: string;
  metrics: {
    average: number;
    median: number;
    topQuartile: number;
    bottomQuartile: number;
    standardDeviation: number;
  };
  sampleSize: number;
  lastUpdated: string;
}

export class PerformanceComparisonEngine {
  private comparisons: Map<string, PerformanceComparison> = new Map();
  private benchmarks: Map<string, PlatformBenchmark> = new Map();
  private analytics: Map<string, CrossPlatformAnalytics> = new Map();

  constructor() {
    this.initializeBenchmarks();
  }

  // Create performance comparison
  async createComparison(
    contentId: string,
    platforms: string[],
    metrics: ComparisonMetrics
  ): Promise<PerformanceComparison> {
    const comparisonId = `comparison_${Date.now()}`;
    
    const comparison: PerformanceComparison = {
      id: comparisonId,
      contentId,
      platforms,
      metrics,
      results: [],
      insights: [],
      recommendations: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.comparisons.set(comparisonId, comparison);
    return comparison;
  }

  // Add platform data to comparison
  async addPlatformData(
    comparisonId: string,
    platform: string,
    data: {
      metrics: Record<string, number>;
      demographics: PlatformResult['demographics'];
      timing: PlatformResult['timing'];
      content: PlatformResult['content'];
      engagement: PlatformResult['engagement'];
    }
  ): Promise<boolean> {
    const comparison = this.comparisons.get(comparisonId);
    if (!comparison) {
      return false;
    }

    const benchmark = this.benchmarks.get(platform);
    const performance = this.calculatePerformance(data.metrics, benchmark);
    
    const result: PlatformResult = {
      platform,
      metrics: {
        primary: data.metrics[comparison.metrics.primary.name] || 0,
        secondary: Object.fromEntries(
          comparison.metrics.secondary.map(m => [m.name, data.metrics[m.name] || 0])
        ),
        custom: Object.fromEntries(
          comparison.metrics.custom.map(m => [m.name, data.metrics[m.name] || 0])
        )
      },
      performance,
      demographics: data.demographics,
      timing: data.timing,
      content: data.content,
      engagement: data.engagement
    };

    comparison.results.push(result);
    comparison.updatedAt = new Date().toISOString();
    
    this.comparisons.set(comparisonId, comparison);
    
    // Generate insights and recommendations
    await this.generateInsights(comparisonId);
    
    return true;
  }

  // Get comparison
  async getComparison(comparisonId: string): Promise<PerformanceComparison | null> {
    return this.comparisons.get(comparisonId) || null;
  }

  // Get comparisons
  async getComparisons(filters?: {
    contentId?: string;
    platforms?: string[];
    dateRange?: {
      start: string;
      end: string;
    };
  }): Promise<PerformanceComparison[]> {
    let comparisons = Array.from(this.comparisons.values());

    if (filters) {
      if (filters.contentId) {
        comparisons = comparisons.filter(c => c.contentId === filters.contentId);
      }
      if (filters.platforms) {
        comparisons = comparisons.filter(c => 
          c.platforms.some(p => filters.platforms!.includes(p))
        );
      }
      if (filters.dateRange) {
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        comparisons = comparisons.filter(c => {
          const createdAt = new Date(c.createdAt);
          return createdAt >= startDate && createdAt <= endDate;
        });
      }
    }

    return comparisons.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Compare platforms for content
  async comparePlatforms(
    contentId: string,
    platforms: string[],
    metrics: ComparisonMetrics
  ): Promise<PerformanceComparison> {
    const comparison = await this.createComparison(contentId, platforms, metrics);
    
    // Add mock data for each platform
    for (const platform of platforms) {
      const mockData = this.generateMockPlatformData(platform, metrics);
      await this.addPlatformData(comparison.id, platform, mockData);
    }

    return comparison;
  }

  // Get cross-platform analytics
  async getCrossPlatformAnalytics(): Promise<CrossPlatformAnalytics> {
    const comparisons = Array.from(this.comparisons.values());
    const allResults = comparisons.flatMap(c => c.results);

    const totalComparisons = comparisons.length;
    const averagePerformance = allResults.length > 0 
      ? allResults.reduce((sum, r) => sum + r.performance.score, 0) / allResults.length 
      : 0;

    const platformScores = new Map<string, { total: number; count: number; content: number }>();
    
    allResults.forEach(result => {
      const current = platformScores.get(result.platform) || { total: 0, count: 0, content: 0 };
      platformScores.set(result.platform, {
        total: current.total + result.performance.score,
        count: current.count + 1,
        content: current.content + 1
      });
    });

    const platformRankings = Array.from(platformScores.entries())
      .map(([platform, data]) => ({
        platform,
        averageScore: data.count > 0 ? data.total / data.count : 0,
        totalContent: data.content,
        growth: Math.random() * 20 - 10 // Mock growth data
      }))
      .sort((a, b) => b.averageScore - a.averageScore);

    const bestPerformingPlatform = platformRankings[0]?.platform || 'Unknown';
    const worstPerformingPlatform = platformRankings[platformRankings.length - 1]?.platform || 'Unknown';

    const commonInsights = this.generateCommonInsights(comparisons);
    const bestPractices = this.generateBestPractices(comparisons);
    const trends = this.generateTrends(comparisons);

    return {
      totalComparisons,
      averagePerformance: Math.round(averagePerformance * 100) / 100,
      bestPerformingPlatform,
      worstPerformingPlatform,
      platformRankings,
      commonInsights,
      bestPractices,
      trends
    };
  }

  // Get platform benchmark
  async getPlatformBenchmark(platform: string, category: string): Promise<PlatformBenchmark | null> {
    const key = `${platform}_${category}`;
    return this.benchmarks.get(key) || null;
  }

  // Update platform benchmark
  async updatePlatformBenchmark(
    platform: string,
    category: string,
    data: PlatformBenchmark['metrics']
  ): Promise<void> {
    const key = `${platform}_${category}`;
    const benchmark: PlatformBenchmark = {
      platform,
      category,
      metrics: data,
      sampleSize: 1000, // Mock sample size
      lastUpdated: new Date().toISOString()
    };
    
    this.benchmarks.set(key, benchmark);
  }

  // Private helper methods
  private calculatePerformance(
    metrics: Record<string, number>,
    benchmark?: PlatformBenchmark
  ): PlatformResult['performance'] {
    const primaryMetric = Object.values(metrics)[0] || 0;
    
    // Calculate performance score (0-100)
    let score = Math.min(primaryMetric / 10, 100); // Simple normalization
    
    if (benchmark) {
      // Compare against benchmark
      const percentile = this.calculatePercentile(primaryMetric, benchmark);
      score = percentile;
    }

    const rank = Math.floor(Math.random() * 10) + 1; // Mock rank
    const percentile = Math.floor(Math.random() * 100); // Mock percentile
    const trend = ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable';
    const change = (Math.random() - 0.5) * 40; // Mock change percentage

    return {
      score: Math.round(score * 100) / 100,
      rank,
      percentile,
      trend,
      change: Math.round(change * 100) / 100
    };
  }

  private calculatePercentile(value: number, benchmark: PlatformBenchmark): number {
    const { average, standardDeviation } = benchmark.metrics;
    const zScore = (value - average) / standardDeviation;
    
    // Convert z-score to percentile (simplified)
    if (zScore >= 2) return 95;
    if (zScore >= 1) return 85;
    if (zScore >= 0) return 70;
    if (zScore >= -1) return 50;
    if (zScore >= -2) return 30;
    return 15;
  }

  private async generateInsights(comparisonId: string): Promise<void> {
    const comparison = this.comparisons.get(comparisonId);
    if (!comparison || comparison.results.length < 2) {
      return;
    }

    const insights: ComparisonInsight[] = [];
    const recommendations: string[] = [];

    // Performance insights
    const sortedResults = comparison.results.sort((a, b) => b.performance.score - a.performance.score);
    const bestPlatform = sortedResults[0];
    const worstPlatform = sortedResults[sortedResults.length - 1];

    if (bestPlatform && worstPlatform) {
      const improvement = ((bestPlatform.performance.score - worstPlatform.performance.score) / worstPlatform.performance.score) * 100;
      
      insights.push({
        type: 'performance',
        title: 'Performance Gap',
        description: `${bestPlatform.platform} performs ${improvement.toFixed(1)}% better than ${worstPlatform.platform}`,
        platforms: [bestPlatform.platform, worstPlatform.platform],
        metric: comparison.metrics.primary.name,
        value: improvement,
        significance: improvement > 50 ? 'high' : improvement > 20 ? 'medium' : 'low',
        actionable: true,
        recommendation: `Focus on ${bestPlatform.platform} for similar content`
      });
    }

    // Demographics insights
    const demographicsInsight = this.generateDemographicsInsight(comparison.results);
    if (demographicsInsight) {
      insights.push(demographicsInsight);
    }

    // Timing insights
    const timingInsight = this.generateTimingInsight(comparison.results);
    if (timingInsight) {
      insights.push(timingInsight);
    }

    // Content insights
    const contentInsight = this.generateContentInsight(comparison.results);
    if (contentInsight) {
      insights.push(contentInsight);
    }

    // Engagement insights
    const engagementInsight = this.generateEngagementInsight(comparison.results);
    if (engagementInsight) {
      insights.push(engagementInsight);
    }

    // Generate recommendations
    recommendations.push(...this.generateRecommendations(comparison.results));

    comparison.insights = insights;
    comparison.recommendations = recommendations;
    comparison.updatedAt = new Date().toISOString();
    
    this.comparisons.set(comparisonId, comparison);
  }

  private generateDemographicsInsight(results: PlatformResult[]): ComparisonInsight | null {
    if (results.length < 2) return null;

    const platforms = results.map(r => r.platform);
    const ageGroups = results.map(r => r.demographics.ageGroups[0]?.group).filter(Boolean);
    
    if (ageGroups.length > 0) {
      return {
        type: 'demographics',
        title: 'Age Group Performance',
        description: `Different platforms attract different age groups`,
        platforms,
        metric: 'age_group',
        value: 0,
        significance: 'medium',
        actionable: true,
        recommendation: 'Tailor content to platform-specific demographics'
      };
    }

    return null;
  }

  private generateTimingInsight(results: PlatformResult[]): ComparisonInsight | null {
    if (results.length < 2) return null;

    const platforms = results.map(r => r.platform);
    const bestTimes = results.map(r => r.timing.bestPerformingHour);
    
    return {
      type: 'timing',
      title: 'Optimal Posting Times',
      description: `Different platforms have different optimal posting times`,
      platforms,
      metric: 'posting_time',
      value: 0,
      significance: 'high',
      actionable: true,
      recommendation: 'Schedule content at platform-specific optimal times'
    };
  }

  private generateContentInsight(results: PlatformResult[]): ComparisonInsight | null {
    if (results.length < 2) return null;

    const platforms = results.map(r => r.platform);
    const contentTypes = results.map(r => r.content.type);
    
    return {
      type: 'content',
      title: 'Content Type Performance',
      description: `Different content types perform better on different platforms`,
      platforms,
      metric: 'content_type',
      value: 0,
      significance: 'high',
      actionable: true,
      recommendation: 'Optimize content format for each platform'
    };
  }

  private generateEngagementInsight(results: PlatformResult[]): ComparisonInsight | null {
    if (results.length < 2) return null;

    const platforms = results.map(r => r.platform);
    const engagementRates = results.map(r => r.engagement.rate);
    const avgEngagement = engagementRates.reduce((sum, rate) => sum + rate, 0) / engagementRates.length;
    
    return {
      type: 'engagement',
      title: 'Engagement Rate Comparison',
      description: `Average engagement rate across platforms: ${avgEngagement.toFixed(2)}%`,
      platforms,
      metric: 'engagement_rate',
      value: avgEngagement,
      significance: 'medium',
      actionable: true,
      recommendation: 'Focus on platforms with higher engagement rates'
    };
  }

  private generateRecommendations(results: PlatformResult[]): string[] {
    const recommendations: string[] = [];
    
    if (results.length > 0) {
      const bestPlatform = results.reduce((best, current) => 
        current.performance.score > best.performance.score ? current : best
      );
      
      recommendations.push(`Focus on ${bestPlatform.platform} for maximum performance`);
      recommendations.push('Test different content formats on each platform');
      recommendations.push('Optimize posting times for each platform');
      recommendations.push('Monitor cross-platform performance regularly');
    }

    return recommendations;
  }

  private generateMockPlatformData(
    platform: string,
    metrics: ComparisonMetrics
  ): {
    metrics: Record<string, number>;
    demographics: PlatformResult['demographics'];
    timing: PlatformResult['timing'];
    content: PlatformResult['content'];
    engagement: PlatformResult['engagement'];
  } {
    return {
      metrics: {
        [metrics.primary.name]: Math.floor(Math.random() * 1000) + 100,
        ...Object.fromEntries(
          metrics.secondary.map(m => [m.name, Math.floor(Math.random() * 100) + 10])
        ),
        ...Object.fromEntries(
          metrics.custom.map(m => [m.name, Math.floor(Math.random() * 50) + 5])
        )
      },
      demographics: {
        ageGroups: [
          { group: '18-24', percentage: Math.floor(Math.random() * 30) + 20 },
          { group: '25-34', percentage: Math.floor(Math.random() * 40) + 30 },
          { group: '35-44', percentage: Math.floor(Math.random() * 30) + 20 },
          { group: '45+', percentage: Math.floor(Math.random() * 20) + 10 }
        ],
        genders: [
          { gender: 'Female', percentage: Math.floor(Math.random() * 40) + 40 },
          { gender: 'Male', percentage: Math.floor(Math.random() * 40) + 40 }
        ],
        locations: [
          { country: 'United States', percentage: Math.floor(Math.random() * 50) + 30 },
          { country: 'Canada', percentage: Math.floor(Math.random() * 20) + 10 },
          { country: 'United Kingdom', percentage: Math.floor(Math.random() * 15) + 5 }
        ]
      },
      timing: {
        bestPerformingHour: Math.floor(Math.random() * 12) + 8,
        bestPerformingDay: ['Monday', 'Wednesday', 'Friday'][Math.floor(Math.random() * 3)],
        peakEngagementTime: `${Math.floor(Math.random() * 12) + 8}:00 AM`
      },
      content: {
        type: ['post', 'story', 'reel', 'video'][Math.floor(Math.random() * 4)],
        format: ['image', 'video', 'carousel'][Math.floor(Math.random() * 3)],
        length: Math.floor(Math.random() * 200) + 50,
        hashtags: ['#trending', '#viral', '#content'],
        mentions: ['@user1', '@user2']
      },
      engagement: {
        rate: Math.random() * 10 + 2,
        quality: Math.random() * 100,
        sentiment: Math.random() * 100,
        virality: Math.random() * 100
      }
    };
  }

  private generateCommonInsights(comparisons: PerformanceComparison[]): string[] {
    const insights: string[] = [];
    
    if (comparisons.length > 0) {
      insights.push(`${comparisons.length} cross-platform comparisons analyzed`);
      insights.push('Instagram typically performs best for visual content');
      insights.push('LinkedIn shows higher engagement for professional content');
      insights.push('Timing significantly impacts performance across all platforms');
    }
    
    return insights;
  }

  private generateBestPractices(comparisons: PerformanceComparison[]): Array<{
    platform: string;
    practice: string;
    impact: number;
  }> {
    return [
      {
        platform: 'Instagram',
        practice: 'Use high-quality visuals with consistent branding',
        impact: 85
      },
      {
        platform: 'LinkedIn',
        practice: 'Share professional insights and industry knowledge',
        impact: 90
      },
      {
        platform: 'Twitter',
        practice: 'Keep content concise and use trending hashtags',
        impact: 75
      },
      {
        platform: 'Facebook',
        practice: 'Encourage community engagement and discussion',
        impact: 80
      }
    ];
  }

  private generateTrends(comparisons: PerformanceComparison[]): Array<{
    platform: string;
    trend: string;
    direction: 'up' | 'down' | 'stable';
    confidence: number;
  }> {
    return [
      {
        platform: 'Instagram',
        trend: 'Video content engagement increasing',
        direction: 'up',
        confidence: 85
      },
      {
        platform: 'LinkedIn',
        trend: 'Professional content performance stable',
        direction: 'stable',
        confidence: 90
      },
      {
        platform: 'Twitter',
        trend: 'Thread content gaining popularity',
        direction: 'up',
        confidence: 70
      }
    ];
  }

  private initializeBenchmarks(): void {
    const platforms = ['instagram', 'facebook', 'twitter', 'linkedin', 'tiktok'];
    const categories = ['general', 'business', 'entertainment', 'education'];
    
    platforms.forEach(platform => {
      categories.forEach(category => {
        const key = `${platform}_${category}`;
        const benchmark: PlatformBenchmark = {
          platform,
          category,
          metrics: {
            average: Math.floor(Math.random() * 500) + 100,
            median: Math.floor(Math.random() * 400) + 80,
            topQuartile: Math.floor(Math.random() * 800) + 200,
            bottomQuartile: Math.floor(Math.random() * 200) + 50,
            standardDeviation: Math.floor(Math.random() * 100) + 50
          },
          sampleSize: Math.floor(Math.random() * 5000) + 1000,
          lastUpdated: new Date().toISOString()
        };
        
        this.benchmarks.set(key, benchmark);
      });
    });
  }
}
