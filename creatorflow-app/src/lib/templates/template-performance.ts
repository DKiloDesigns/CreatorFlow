/**
 * Template Performance Analytics
 * Track and analyze template performance metrics
 */

export interface TemplatePerformance {
  templateId: string;
  templateName: string;
  category: string;
  industry: string;
  platform: string;
  metrics: {
    usageCount: number;
    successRate: number;
    avgEngagement: number;
    avgReach: number;
    avgClicks: number;
    avgShares: number;
    avgComments: number;
    avgLikes: number;
    conversionRate: number;
    lastUsed: string;
    firstUsed: string;
  };
  trends: {
    usageTrend: 'increasing' | 'decreasing' | 'stable';
    engagementTrend: 'increasing' | 'decreasing' | 'stable';
    performanceScore: number; // 0-100
  };
  topVariations: TemplateVariation[];
  recommendations: string[];
}

export interface TemplateVariation {
  id: string;
  content: string;
  performance: {
    usageCount: number;
    avgEngagement: number;
    successRate: number;
  };
  changes: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
}

export interface PerformanceFilter {
  dateRange?: {
    start: string;
    end: string;
  };
  platforms?: string[];
  categories?: string[];
  industries?: string[];
  minUsageCount?: number;
  minPerformanceScore?: number;
}

export interface PerformanceInsight {
  type: 'trend' | 'recommendation' | 'warning' | 'opportunity';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  action?: string;
  data?: any;
}

export class TemplatePerformanceAnalytics {
  private performanceData: Map<string, TemplatePerformance> = new Map();

  // Track template usage
  trackTemplateUsage(templateId: string, platform: string, success: boolean, engagement: number) {
    const existing = this.performanceData.get(templateId);
    if (existing) {
      existing.metrics.usageCount++;
      existing.metrics.successRate = this.calculateSuccessRate(
        existing.metrics.successRate,
        existing.metrics.usageCount - 1,
        success
      );
      existing.metrics.avgEngagement = this.calculateAverage(
        existing.metrics.avgEngagement,
        existing.metrics.usageCount - 1,
        engagement
      );
      existing.metrics.lastUsed = new Date().toISOString();
    }
  }

  // Get template performance
  getTemplatePerformance(templateId: string): TemplatePerformance | null {
    return this.performanceData.get(templateId) || null;
  }

  // Get all template performances with filters
  getTemplatePerformances(filter?: PerformanceFilter): TemplatePerformance[] {
    let performances = Array.from(this.performanceData.values());

    if (filter) {
      performances = performances.filter(perf => {
        // Date range filter
        if (filter.dateRange) {
          const lastUsed = new Date(perf.metrics.lastUsed);
          const start = new Date(filter.dateRange.start);
          const end = new Date(filter.dateRange.end);
          if (lastUsed < start || lastUsed > end) return false;
        }

        // Platform filter
        if (filter.platforms && !filter.platforms.includes(perf.platform)) {
          return false;
        }

        // Category filter
        if (filter.categories && !filter.categories.includes(perf.category)) {
          return false;
        }

        // Industry filter
        if (filter.industries && !filter.industries.includes(perf.industry)) {
          return false;
        }

        // Min usage count filter
        if (filter.minUsageCount && perf.metrics.usageCount < filter.minUsageCount) {
          return false;
        }

        // Min performance score filter
        if (filter.minPerformanceScore && perf.trends.performanceScore < filter.minPerformanceScore) {
          return false;
        }

        return true;
      });
    }

    return performances.sort((a, b) => b.trends.performanceScore - a.trends.performanceScore);
  }

  // Get performance insights
  getPerformanceInsights(templateId?: string): PerformanceInsight[] {
    const insights: PerformanceInsight[] = [];
    const performances = templateId 
      ? [this.performanceData.get(templateId)].filter(Boolean) as TemplatePerformance[]
      : Array.from(this.performanceData.values());

    performances.forEach(perf => {
      // High usage, low performance
      if (perf.metrics.usageCount > 10 && perf.trends.performanceScore < 50) {
        insights.push({
          type: 'warning',
          title: 'Underperforming Template',
          description: `${perf.templateName} is used frequently but has low performance. Consider optimizing or replacing.`,
          impact: 'high',
          action: 'Review and optimize template content',
          data: { templateId: perf.templateId, performanceScore: perf.trends.performanceScore }
        });
      }

      // High performance, low usage
      if (perf.metrics.usageCount < 5 && perf.trends.performanceScore > 80) {
        insights.push({
          type: 'opportunity',
          title: 'Underutilized High Performer',
          description: `${perf.templateName} performs well but is rarely used. Consider promoting it.`,
          impact: 'medium',
          action: 'Promote template to increase usage',
          data: { templateId: perf.templateId, performanceScore: perf.trends.performanceScore }
        });
      }

      // Declining trend
      if (perf.trends.usageTrend === 'decreasing' && perf.metrics.usageCount > 5) {
        insights.push({
          type: 'trend',
          title: 'Declining Usage',
          description: `${perf.templateName} usage is declining. Consider updating or retiring.`,
          impact: 'medium',
          action: 'Update template or create new version',
          data: { templateId: perf.templateId, trend: perf.trends.usageTrend }
        });
      }

      // High engagement trend
      if (perf.trends.engagementTrend === 'increasing' && perf.metrics.avgEngagement > 5) {
        insights.push({
          type: 'recommendation',
          title: 'Rising Engagement',
          description: `${perf.templateName} engagement is increasing. Consider using more frequently.`,
          impact: 'high',
          action: 'Increase template usage frequency',
          data: { templateId: perf.templateId, engagement: perf.metrics.avgEngagement }
        });
      }
    });

    return insights.sort((a, b) => {
      const impactOrder = { high: 3, medium: 2, low: 1 };
      return impactOrder[b.impact] - impactOrder[a.impact];
    });
  }

  // Get top performing templates
  getTopPerformingTemplates(limit: number = 10): TemplatePerformance[] {
    return this.getTemplatePerformances()
      .slice(0, limit);
  }

  // Get performance summary
  getPerformanceSummary(): {
    totalTemplates: number;
    avgPerformanceScore: number;
    topPerformer: TemplatePerformance | null;
    worstPerformer: TemplatePerformance | null;
    totalUsage: number;
    avgEngagement: number;
  } {
    const performances = Array.from(this.performanceData.values());
    
    if (performances.length === 0) {
      return {
        totalTemplates: 0,
        avgPerformanceScore: 0,
        topPerformer: null,
        worstPerformer: null,
        totalUsage: 0,
        avgEngagement: 0
      };
    }

    const totalUsage = performances.reduce((sum, perf) => sum + perf.metrics.usageCount, 0);
    const avgPerformanceScore = performances.reduce((sum, perf) => sum + perf.trends.performanceScore, 0) / performances.length;
    const avgEngagement = performances.reduce((sum, perf) => sum + perf.metrics.avgEngagement, 0) / performances.length;

    const sorted = performances.sort((a, b) => b.trends.performanceScore - a.trends.performanceScore);

    return {
      totalTemplates: performances.length,
      avgPerformanceScore,
      topPerformer: sorted[0],
      worstPerformer: sorted[sorted.length - 1],
      totalUsage,
      avgEngagement
    };
  }

  // Calculate performance score
  calculatePerformanceScore(perf: TemplatePerformance): number {
    const weights = {
      usageCount: 0.2,
      successRate: 0.3,
      avgEngagement: 0.3,
      conversionRate: 0.2
    };

    const normalizedUsage = Math.min(perf.metrics.usageCount / 100, 1);
    const normalizedSuccess = perf.metrics.successRate / 100;
    const normalizedEngagement = Math.min(perf.metrics.avgEngagement / 10, 1);
    const normalizedConversion = perf.metrics.conversionRate / 100;

    return Math.round(
      (normalizedUsage * weights.usageCount +
       normalizedSuccess * weights.successRate +
       normalizedEngagement * weights.avgEngagement +
       normalizedConversion * weights.conversionRate) * 100
    );
  }

  // Update performance trends
  updateTrends(templateId: string) {
    const perf = this.performanceData.get(templateId);
    if (!perf) return;

    // Calculate trends based on recent usage patterns
    // This is a simplified implementation - in reality, you'd analyze historical data
    const recentUsage = this.getRecentUsage(templateId, 30); // Last 30 days
    const previousUsage = this.getRecentUsage(templateId, 60, 30); // Previous 30 days

    if (recentUsage > previousUsage * 1.1) {
      perf.trends.usageTrend = 'increasing';
    } else if (recentUsage < previousUsage * 0.9) {
      perf.trends.usageTrend = 'decreasing';
    } else {
      perf.trends.usageTrend = 'stable';
    }

    // Update performance score
    perf.trends.performanceScore = this.calculatePerformanceScore(perf);
  }

  // Private helper methods
  private calculateSuccessRate(currentRate: number, currentCount: number, newSuccess: boolean): number {
    const totalSuccesses = currentRate * currentCount + (newSuccess ? 1 : 0);
    return totalSuccesses / (currentCount + 1) * 100;
  }

  private calculateAverage(currentAvg: number, currentCount: number, newValue: number): number {
    return (currentAvg * currentCount + newValue) / (currentCount + 1);
  }

  private getRecentUsage(templateId: string, days: number, offsetDays: number = 0): number {
    // This would typically query a database for actual usage data
    // For now, return a mock value
    return Math.floor(Math.random() * 20);
  }

  // Initialize template performance
  initializeTemplatePerformance(templateId: string, templateName: string, category: string, industry: string, platform: string) {
    this.performanceData.set(templateId, {
      templateId,
      templateName,
      category,
      industry,
      platform,
      metrics: {
        usageCount: 0,
        successRate: 0,
        avgEngagement: 0,
        avgReach: 0,
        avgClicks: 0,
        avgShares: 0,
        avgComments: 0,
        avgLikes: 0,
        conversionRate: 0,
        lastUsed: new Date().toISOString(),
        firstUsed: new Date().toISOString()
      },
      trends: {
        usageTrend: 'stable',
        engagementTrend: 'stable',
        performanceScore: 0
      },
      topVariations: [],
      recommendations: []
    });
  }
}
