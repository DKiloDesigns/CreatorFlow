/**
 * Advanced Analytics Engine
 * Comprehensive analytics and performance tracking
 */

export interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'stable';
  trend: 'up' | 'down' | 'stable';
  period: 'hour' | 'day' | 'week' | 'month' | 'year';
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface PerformanceData {
  platform: string;
  contentId: string;
  contentType: 'text' | 'image' | 'video' | 'carousel' | 'story';
  publishedAt: string;
  metrics: {
    reach: number;
    impressions: number;
    engagement: number;
    likes: number;
    shares: number;
    comments: number;
    clicks: number;
    saves: number;
    views: number;
    completionRate: number;
    clickThroughRate: number;
    engagementRate: number;
    conversionRate: number;
  };
  demographics: {
    ageGroups: Record<string, number>;
    genders: Record<string, number>;
    locations: Record<string, number>;
    interests: Record<string, number>;
  };
  timing: {
    bestPerformingHour: number;
    bestPerformingDay: string;
    optimalPostingTime: string;
  };
  hashtags: string[];
  mentions: string[];
  callToAction?: string;
}

export interface AnalyticsFilter {
  dateRange: {
    start: string;
    end: string;
  };
  platforms?: string[];
  contentTypes?: string[];
  campaigns?: string[];
  hashtags?: string[];
  minEngagement?: number;
  minReach?: number;
}

export interface AnalyticsInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'recommendation' | 'warning' | 'opportunity';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number; // 0-100
  data: any;
  actionable: boolean;
  action?: string;
  createdAt: string;
}

export interface BenchmarkData {
  platform: string;
  industry: string;
  metrics: {
    avgEngagement: number;
    avgReach: number;
    avgClicks: number;
    avgShares: number;
    avgComments: number;
    avgLikes: number;
    avgCTR: number;
    avgConversion: number;
  };
  percentiles: {
    p25: number;
    p50: number;
    p75: number;
    p90: number;
    p95: number;
  };
  sampleSize: number;
  lastUpdated: string;
}

export interface PredictiveForecast {
  metric: string;
  currentValue: number;
  forecast: {
    nextWeek: number;
    nextMonth: number;
    nextQuarter: number;
  };
  confidence: number;
  factors: string[];
  recommendations: string[];
}

export class AdvancedAnalytics {
  private performanceData: Map<string, PerformanceData> = new Map();
  private insights: AnalyticsInsight[] = [];
  private benchmarks: Map<string, BenchmarkData> = new Map();

  // Track performance data
  trackPerformance(data: PerformanceData) {
    const key = `${data.platform}-${data.contentId}`;
    this.performanceData.set(key, data);
    this.generateInsights();
  }

  // Get analytics metrics
  getMetrics(filter?: AnalyticsFilter): AnalyticsMetric[] {
    const data = this.getFilteredData(filter);
    const metrics: AnalyticsMetric[] = [];

    // Engagement Rate
    const avgEngagement = this.calculateAverage(data, 'metrics.engagement');
    const prevEngagement = this.calculatePreviousPeriod(data, 'metrics.engagement');
    metrics.push({
      id: 'engagement_rate',
      name: 'Engagement Rate',
      value: avgEngagement,
      change: avgEngagement - prevEngagement,
      changeType: this.getChangeType(avgEngagement, prevEngagement),
      trend: this.getTrend(avgEngagement, prevEngagement),
      period: 'week',
      timestamp: new Date().toISOString()
    });

    // Reach
    const avgReach = this.calculateAverage(data, 'metrics.reach');
    const prevReach = this.calculatePreviousPeriod(data, 'metrics.reach');
    metrics.push({
      id: 'reach',
      name: 'Reach',
      value: avgReach,
      change: avgReach - prevReach,
      changeType: this.getChangeType(avgReach, prevReach),
      trend: this.getTrend(avgReach, prevReach),
      period: 'week',
      timestamp: new Date().toISOString()
    });

    // Click-Through Rate
    const avgCTR = this.calculateAverage(data, 'metrics.clickThroughRate');
    const prevCTR = this.calculatePreviousPeriod(data, 'metrics.clickThroughRate');
    metrics.push({
      id: 'ctr',
      name: 'Click-Through Rate',
      value: avgCTR,
      change: avgCTR - prevCTR,
      changeType: this.getChangeType(avgCTR, prevCTR),
      trend: this.getTrend(avgCTR, prevCTR),
      period: 'week',
      timestamp: new Date().toISOString()
    });

    // Conversion Rate
    const avgConversion = this.calculateAverage(data, 'metrics.conversionRate');
    const prevConversion = this.calculatePreviousPeriod(data, 'metrics.conversionRate');
    metrics.push({
      id: 'conversion_rate',
      name: 'Conversion Rate',
      value: avgConversion,
      change: avgConversion - prevConversion,
      changeType: this.getChangeType(avgConversion, prevConversion),
      trend: this.getTrend(avgConversion, prevConversion),
      period: 'week',
      timestamp: new Date().toISOString()
    });

    return metrics;
  }

  // Get performance insights
  getInsights(filter?: AnalyticsFilter): AnalyticsInsight[] {
    const data = this.getFilteredData(filter);
    const insights: AnalyticsInsight[] = [];

    // High performing content
    const highPerformers = data.filter(d => d.metrics.engagement > this.calculateAverage(data, 'metrics.engagement') * 1.5);
    if (highPerformers.length > 0) {
      insights.push({
        id: 'high_performers',
        type: 'opportunity',
        title: 'High Performing Content Detected',
        description: `${highPerformers.length} posts are performing significantly above average. Analyze what makes them successful.`,
        impact: 'high',
        confidence: 85,
        data: { count: highPerformers.length, avgEngagement: this.calculateAverage(highPerformers, 'metrics.engagement') },
        actionable: true,
        action: 'Analyze high-performing content patterns',
        createdAt: new Date().toISOString()
      });
    }

    // Declining performance
    const recentData = data.filter(d => new Date(d.publishedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    const olderData = data.filter(d => new Date(d.publishedAt) <= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    
    if (recentData.length > 0 && olderData.length > 0) {
      const recentAvg = this.calculateAverage(recentData, 'metrics.engagement');
      const olderAvg = this.calculateAverage(olderData, 'metrics.engagement');
      
      if (recentAvg < olderAvg * 0.8) {
        insights.push({
          id: 'declining_performance',
          type: 'warning',
          title: 'Performance Decline Detected',
          description: `Recent content is performing 20% below average. Consider reviewing your content strategy.`,
          impact: 'high',
          confidence: 90,
          data: { recentAvg, olderAvg, decline: ((olderAvg - recentAvg) / olderAvg) * 100 },
          actionable: true,
          action: 'Review and adjust content strategy',
          createdAt: new Date().toISOString()
        });
      }
    }

    // Optimal posting times
    const timeAnalysis = this.analyzeOptimalTimes(data);
    if (timeAnalysis.bestHour !== null) {
      insights.push({
        id: 'optimal_timing',
        type: 'recommendation',
        title: 'Optimal Posting Time Identified',
        description: `Content posted at ${timeAnalysis.bestHour}:00 performs ${timeAnalysis.improvement}% better than average.`,
        impact: 'medium',
        confidence: 75,
        data: timeAnalysis,
        actionable: true,
        action: 'Schedule more content during optimal hours',
        createdAt: new Date().toISOString()
      });
    }

    // Platform performance
    const platformAnalysis = this.analyzePlatformPerformance(data);
    const bestPlatform = platformAnalysis.find(p => p.performance === 'excellent');
    if (bestPlatform) {
      insights.push({
        id: 'platform_performance',
        type: 'recommendation',
        title: 'Platform Performance Insight',
        description: `${bestPlatform.platform} is your best performing platform with ${bestPlatform.avgEngagement}% engagement rate.`,
        impact: 'medium',
        confidence: 80,
        data: bestPlatform,
        actionable: true,
        action: 'Increase content frequency on high-performing platforms',
        createdAt: new Date().toISOString()
      });
    }

    return insights;
  }

  // Get benchmark comparison
  getBenchmarkComparison(platform: string, industry: string): {
    yourMetrics: Record<string, number>;
    industryMetrics: Record<string, number>;
    percentile: Record<string, number>;
    recommendations: string[];
  } {
    const yourData = Array.from(this.performanceData.values()).filter(d => d.platform === platform);
    const benchmark = this.benchmarks.get(`${platform}-${industry}`);

    if (!benchmark) {
      return {
        yourMetrics: {},
        industryMetrics: {},
        percentile: {},
        recommendations: ['No benchmark data available for this platform/industry combination']
      };
    }

    const yourMetrics = {
      engagement: this.calculateAverage(yourData, 'metrics.engagement'),
      reach: this.calculateAverage(yourData, 'metrics.reach'),
      ctr: this.calculateAverage(yourData, 'metrics.clickThroughRate'),
      conversion: this.calculateAverage(yourData, 'metrics.conversionRate')
    };

    const industryMetrics = {
      engagement: benchmark.metrics.avgEngagement,
      reach: benchmark.metrics.avgReach,
      ctr: benchmark.metrics.avgCTR,
      conversion: benchmark.metrics.avgConversion
    };

    const percentile = {
      engagement: this.calculatePercentile(yourMetrics.engagement, benchmark.percentiles),
      reach: this.calculatePercentile(yourMetrics.reach, benchmark.percentiles),
      ctr: this.calculatePercentile(yourMetrics.ctr, benchmark.percentiles),
      conversion: this.calculatePercentile(yourMetrics.conversion, benchmark.percentiles)
    };

    const recommendations = this.generateBenchmarkRecommendations(yourMetrics, industryMetrics, percentile);

    return {
      yourMetrics,
      industryMetrics,
      percentile,
      recommendations
    };
  }

  // Get predictive forecast
  getPredictiveForecast(metric: string, days: number = 30): PredictiveForecast {
    const data = Array.from(this.performanceData.values());
    const historicalData = data.map(d => ({
      date: new Date(d.publishedAt),
      value: this.getMetricValue(d, metric)
    })).sort((a, b) => a.date.getTime() - b.date.getTime());

    const currentValue = historicalData[historicalData.length - 1]?.value || 0;
    
    // Simple linear regression for forecasting
    const forecast = this.calculateLinearForecast(historicalData, days);
    
    const factors = this.identifyInfluencingFactors(data, metric);
    const recommendations = this.generateForecastRecommendations(forecast, factors);

    return {
      metric,
      currentValue,
      forecast: {
        nextWeek: forecast.week,
        nextMonth: forecast.month,
        nextQuarter: forecast.quarter
      },
      confidence: this.calculateForecastConfidence(historicalData),
      factors,
      recommendations
    };
  }

  // Generate custom dashboard
  generateCustomDashboard(widgets: string[], filter?: AnalyticsFilter): Record<string, any> {
    const data = this.getFilteredData(filter);
    const dashboard: Record<string, any> = {};

    widgets.forEach(widget => {
      switch (widget) {
        case 'engagement_trend':
          dashboard.engagement_trend = this.generateEngagementTrend(data);
          break;
        case 'platform_comparison':
          dashboard.platform_comparison = this.generatePlatformComparison(data);
          break;
        case 'content_performance':
          dashboard.content_performance = this.generateContentPerformance(data);
          break;
        case 'demographics':
          dashboard.demographics = this.generateDemographics(data);
          break;
        case 'hashtag_analysis':
          dashboard.hashtag_analysis = this.generateHashtagAnalysis(data);
          break;
        case 'timing_analysis':
          dashboard.timing_analysis = this.generateTimingAnalysis(data);
          break;
      }
    });

    return dashboard;
  }

  // Private helper methods
  private getFilteredData(filter?: AnalyticsFilter): PerformanceData[] {
    let data = Array.from(this.performanceData.values());

    if (filter) {
      if (filter.platforms) {
        data = data.filter(d => filter.platforms!.includes(d.platform));
      }
      if (filter.contentTypes) {
        data = data.filter(d => filter.contentTypes!.includes(d.contentType));
      }
      if (filter.dateRange) {
        const start = new Date(filter.dateRange.start);
        const end = new Date(filter.dateRange.end);
        data = data.filter(d => {
          const date = new Date(d.publishedAt);
          return date >= start && date <= end;
        });
      }
      if (filter.minEngagement) {
        data = data.filter(d => d.metrics.engagement >= filter.minEngagement!);
      }
      if (filter.minReach) {
        data = data.filter(d => d.metrics.reach >= filter.minReach!);
      }
    }

    return data;
  }

  private calculateAverage(data: PerformanceData[], path: string): number {
    if (data.length === 0) return 0;
    const sum = data.reduce((acc, item) => acc + this.getNestedValue(item, path), 0);
    return sum / data.length;
  }

  private calculatePreviousPeriod(data: PerformanceData[], path: string): number {
    const cutoff = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    const previousData = data.filter(d => new Date(d.publishedAt) < cutoff);
    return this.calculateAverage(previousData, path);
  }

  private getNestedValue(obj: any, path: string): number {
    return path.split('.').reduce((current, key) => current?.[key], obj) || 0;
  }

  private getChangeType(current: number, previous: number): 'increase' | 'decrease' | 'stable' {
    const change = ((current - previous) / previous) * 100;
    if (change > 5) return 'increase';
    if (change < -5) return 'decrease';
    return 'stable';
  }

  private getTrend(current: number, previous: number): 'up' | 'down' | 'stable' {
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'stable';
  }

  private analyzeOptimalTimes(data: PerformanceData[]): {
    bestHour: number | null;
    bestDay: string | null;
    improvement: number;
  } {
    const hourlyPerformance: Record<number, number[]> = {};
    const dailyPerformance: Record<string, number[]> = {};

    data.forEach(d => {
      const date = new Date(d.publishedAt);
      const hour = date.getHours();
      const day = date.toLocaleDateString('en-US', { weekday: 'long' });

      if (!hourlyPerformance[hour]) hourlyPerformance[hour] = [];
      if (!dailyPerformance[day]) dailyPerformance[day] = [];

      hourlyPerformance[hour].push(d.metrics.engagement);
      dailyPerformance[day].push(d.metrics.engagement);
    });

    const avgEngagement = this.calculateAverage(data, 'metrics.engagement');
    let bestHour: number | null = null;
    let bestDay: string | null = null;
    let maxImprovement = 0;

    Object.entries(hourlyPerformance).forEach(([hour, values]) => {
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const improvement = ((avg - avgEngagement) / avgEngagement) * 100;
      if (improvement > maxImprovement) {
        maxImprovement = improvement;
        bestHour = parseInt(hour);
      }
    });

    Object.entries(dailyPerformance).forEach(([day, values]) => {
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const improvement = ((avg - avgEngagement) / avgEngagement) * 100;
      if (improvement > maxImprovement) {
        maxImprovement = improvement;
        bestDay = day;
      }
    });

    return { bestHour, bestDay, improvement: maxImprovement };
  }

  private analyzePlatformPerformance(data: PerformanceData[]): Array<{
    platform: string;
    avgEngagement: number;
    performance: 'excellent' | 'good' | 'average' | 'poor';
  }> {
    const platformData: Record<string, number[]> = {};

    data.forEach(d => {
      if (!platformData[d.platform]) platformData[d.platform] = [];
      platformData[d.platform].push(d.metrics.engagement);
    });

    return Object.entries(platformData).map(([platform, values]) => {
      const avgEngagement = values.reduce((a, b) => a + b, 0) / values.length;
      let performance: 'excellent' | 'good' | 'average' | 'poor';
      
      if (avgEngagement > 5) performance = 'excellent';
      else if (avgEngagement > 3) performance = 'good';
      else if (avgEngagement > 1) performance = 'average';
      else performance = 'poor';

      return { platform, avgEngagement, performance };
    });
  }

  private calculatePercentile(value: number, percentiles: Record<string, number>): number {
    if (value >= percentiles.p95) return 95;
    if (value >= percentiles.p90) return 90;
    if (value >= percentiles.p75) return 75;
    if (value >= percentiles.p50) return 50;
    if (value >= percentiles.p25) return 25;
    return 10;
  }

  private generateBenchmarkRecommendations(
    yourMetrics: Record<string, number>,
    industryMetrics: Record<string, number>,
    percentile: Record<string, number>
  ): string[] {
    const recommendations: string[] = [];

    Object.entries(yourMetrics).forEach(([metric, value]) => {
      const industryValue = industryMetrics[metric];
      const percentileValue = percentile[metric];

      if (percentileValue < 25) {
        recommendations.push(`Your ${metric} is in the bottom 25% of the industry. Consider optimizing your content strategy.`);
      } else if (percentileValue > 75) {
        recommendations.push(`Your ${metric} is in the top 25% of the industry. Great job! Consider scaling successful strategies.`);
      }
    });

    return recommendations;
  }

  private getMetricValue(data: PerformanceData, metric: string): number {
    return this.getNestedValue(data, `metrics.${metric}`);
  }

  private calculateLinearForecast(historicalData: Array<{ date: Date; value: number }>, days: number): {
    week: number;
    month: number;
    quarter: number;
  } {
    // Simple linear regression implementation
    const n = historicalData.length;
    if (n < 2) return { week: 0, month: 0, quarter: 0 };

    const x = historicalData.map((_, i) => i);
    const y = historicalData.map(d => d.value);

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
    const sumXX = x.reduce((acc, xi) => acc + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const week = slope * (n + 7) + intercept;
    const month = slope * (n + 30) + intercept;
    const quarter = slope * (n + 90) + intercept;

    return { week, month, quarter };
  }

  private identifyInfluencingFactors(data: PerformanceData[], metric: string): string[] {
    const factors: string[] = [];
    
    // Analyze hashtag impact
    const withHashtags = data.filter(d => d.hashtags.length > 0);
    const withoutHashtags = data.filter(d => d.hashtags.length === 0);
    
    if (withHashtags.length > 0 && withoutHashtags.length > 0) {
      const withAvg = this.calculateAverage(withHashtags, `metrics.${metric}`);
      const withoutAvg = this.calculateAverage(withoutHashtags, `metrics.${metric}`);
      
      if (withAvg > withoutAvg * 1.2) {
        factors.push('Hashtag usage');
      }
    }

    // Analyze content type impact
    const contentTypes = [...new Set(data.map(d => d.contentType))];
    if (contentTypes.length > 1) {
      factors.push('Content type variation');
    }

    // Analyze timing impact
    const hours = data.map(d => new Date(d.publishedAt).getHours());
    const hourVariation = new Set(hours).size;
    if (hourVariation > 5) {
      factors.push('Posting time diversity');
    }

    return factors;
  }

  private generateForecastRecommendations(forecast: any, factors: string[]): string[] {
    const recommendations: string[] = [];

    if (forecast.week > forecast.month) {
      recommendations.push('Short-term performance looks strong. Consider increasing content frequency.');
    } else if (forecast.week < forecast.month) {
      recommendations.push('Performance may decline. Review and optimize your content strategy.');
    }

    if (factors.includes('Hashtag usage')) {
      recommendations.push('Continue using hashtags as they positively impact performance.');
    }

    return recommendations;
  }

  private calculateForecastConfidence(historicalData: Array<{ date: Date; value: number }>): number {
    if (historicalData.length < 3) return 30;
    if (historicalData.length < 7) return 50;
    if (historicalData.length < 30) return 70;
    return 85;
  }

  private generateEngagementTrend(data: PerformanceData[]): any {
    // Implementation for engagement trend visualization
    return { data: [], labels: [] };
  }

  private generatePlatformComparison(data: PerformanceData[]): any {
    // Implementation for platform comparison visualization
    return { data: [], labels: [] };
  }

  private generateContentPerformance(data: PerformanceData[]): any {
    // Implementation for content performance visualization
    return { data: [], labels: [] };
  }

  private generateDemographics(data: PerformanceData[]): any {
    // Implementation for demographics visualization
    return { data: [], labels: [] };
  }

  private generateHashtagAnalysis(data: PerformanceData[]): any {
    // Implementation for hashtag analysis visualization
    return { data: [], labels: [] };
  }

  private generateTimingAnalysis(data: PerformanceData[]): any {
    // Implementation for timing analysis visualization
    return { data: [], labels: [] };
  }

  private generateInsights() {
    // Generate insights based on current data
    // This would typically run asynchronously
  }
}
