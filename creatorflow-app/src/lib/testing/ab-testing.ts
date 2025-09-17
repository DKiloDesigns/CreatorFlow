/**
 * A/B Testing Engine
 * Test content variations and measure performance
 */

export interface ABTest {
  id: string;
  name: string;
  description: string;
  platform: string;
  type: 'content' | 'image' | 'video' | 'hashtag' | 'posting_time' | 'audience';
  status: 'draft' | 'running' | 'paused' | 'completed' | 'cancelled';
  variants: TestVariant[];
  settings: TestSettings;
  metrics: TestMetrics;
  results: TestResults;
  createdAt: string;
  startedAt?: string;
  endedAt?: string;
  createdBy: string;
}

export interface TestVariant {
  id: string;
  name: string;
  description: string;
  content: string;
  metadata: {
    type: string;
    platform: string;
    dimensions?: {
      width: number;
      height: number;
    };
    duration?: number;
    hashtags: string[];
    postingTime?: string;
  };
  trafficAllocation: number; // percentage
  isControl: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface TestSettings {
  trafficSplit: 'equal' | 'weighted' | 'custom';
  minSampleSize: number;
  maxDuration: number; // days
  confidenceLevel: number; // 0-1
  significanceThreshold: number; // 0-1
  primaryMetric: 'engagement' | 'clicks' | 'conversions' | 'reach' | 'views';
  secondaryMetrics: string[];
  audienceTargeting?: {
    demographics: Record<string, any>;
    interests: string[];
    behaviors: string[];
  };
  scheduling?: {
    startDate: string;
    endDate: string;
    timezone: string;
  };
}

export interface TestMetrics {
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

export interface TestResults {
  status: 'collecting' | 'analyzing' | 'conclusive' | 'inconclusive';
  winner?: string; // variant ID
  confidence: number;
  significance: number;
  sampleSize: number;
  duration: number; // days
  variants: Array<{
    variantId: string;
    name: string;
    metrics: {
      primary: number;
      secondary: Record<string, number>;
      custom: Record<string, number>;
    };
    performance: {
      improvement: number; // percentage vs control
      confidence: number;
      significance: number;
    };
    statistics: {
      mean: number;
      median: number;
      standardDeviation: number;
      sampleSize: number;
    };
  }>;
  insights: string[];
  recommendations: string[];
  nextSteps: string[];
  reportUrl?: string;
}

export interface TestAnalytics {
  totalTests: number;
  runningTests: number;
  completedTests: number;
  successRate: number; // percentage of tests with significant results
  averageDuration: number; // days
  mostTestedPlatform: string;
  mostTestedType: string;
  topPerformingVariants: Array<{
    variant: TestVariant;
    improvement: number;
    confidence: number;
  }>;
  commonInsights: string[];
  recommendations: string[];
}

export class ABTestingEngine {
  private tests: Map<string, ABTest> = new Map();
  private testData: Map<string, Map<string, number[]>> = new Map(); // testId -> variantId -> metrics

  // Create A/B test
  async createTest(test: Omit<ABTest, 'id' | 'createdAt' | 'metrics' | 'results'>): Promise<ABTest> {
    const testId = `test_${Date.now()}`;
    
    const newTest: ABTest = {
      ...test,
      id: testId,
      createdAt: new Date().toISOString(),
      metrics: this.initializeMetrics(test.type),
      results: this.initializeResults()
    };

    this.tests.set(testId, newTest);
    this.testData.set(testId, new Map());

    return newTest;
  }

  // Start A/B test
  async startTest(testId: string): Promise<boolean> {
    const test = this.tests.get(testId);
    if (!test || test.status !== 'draft') {
      return false;
    }

    test.status = 'running';
    test.startedAt = new Date().toISOString();
    this.tests.set(testId, test);

    // TODO: Implement actual test execution
    return true;
  }

  // Pause A/B test
  async pauseTest(testId: string): Promise<boolean> {
    const test = this.tests.get(testId);
    if (!test || test.status !== 'running') {
      return false;
    }

    test.status = 'paused';
    this.tests.set(testId, test);

    return true;
  }

  // Resume A/B test
  async resumeTest(testId: string): Promise<boolean> {
    const test = this.tests.get(testId);
    if (!test || test.status !== 'paused') {
      return false;
    }

    test.status = 'running';
    this.tests.set(testId, test);

    return true;
  }

  // End A/B test
  async endTest(testId: string): Promise<boolean> {
    const test = this.tests.get(testId);
    if (!test || test.status !== 'running') {
      return false;
    }

    test.status = 'completed';
    test.endedAt = new Date().toISOString();
    
    // Analyze results
    await this.analyzeTest(testId);
    
    this.tests.set(testId, test);

    return true;
  }

  // Get test
  async getTest(testId: string): Promise<ABTest | null> {
    return this.tests.get(testId) || null;
  }

  // Get tests
  async getTests(filters?: {
    status?: string;
    platform?: string;
    type?: string;
    createdBy?: string;
  }): Promise<ABTest[]> {
    let tests = Array.from(this.tests.values());

    if (filters) {
      if (filters.status) {
        tests = tests.filter(t => t.status === filters.status);
      }
      if (filters.platform) {
        tests = tests.filter(t => t.platform === filters.platform);
      }
      if (filters.type) {
        tests = tests.filter(t => t.type === filters.type);
      }
      if (filters.createdBy) {
        tests = tests.filter(t => t.createdBy === filters.createdBy);
      }
    }

    return tests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Add test data
  async addTestData(
    testId: string,
    variantId: string,
    metrics: Record<string, number>
  ): Promise<void> {
    const test = this.tests.get(testId);
    if (!test) {
      throw new Error('Test not found');
    }

    const testDataMap = this.testData.get(testId) || new Map();
    const variantData = testDataMap.get(variantId) || [];
    
    // Add primary metric data
    const primaryMetric = test.metrics.primary.name;
    if (metrics[primaryMetric] !== undefined) {
      variantData.push(metrics[primaryMetric]);
      testDataMap.set(variantId, variantData);
      this.testData.set(testId, testDataMap);
    }

    // Update test results in real-time
    await this.updateTestResults(testId);
  }

  // Get test results
  async getTestResults(testId: string): Promise<TestResults | null> {
    const test = this.tests.get(testId);
    return test?.results || null;
  }

  // Analyze test
  async analyzeTest(testId: string): Promise<TestResults> {
    const test = this.tests.get(testId);
    if (!test) {
      throw new Error('Test not found');
    }

    const testDataMap = this.testData.get(testId) || new Map();
    const results = await this.performStatisticalAnalysis(test, testDataMap);
    
    test.results = results;
    this.tests.set(testId, test);

    return results;
  }

  // Get test analytics
  async getTestAnalytics(): Promise<TestAnalytics> {
    const tests = Array.from(this.tests.values());
    const completedTests = tests.filter(t => t.status === 'completed');
    const runningTests = tests.filter(t => t.status === 'running');

    const totalTests = tests.length;
    const successRate = completedTests.length > 0 
      ? (completedTests.filter(t => t.results.status === 'conclusive').length / completedTests.length) * 100 
      : 0;

    const averageDuration = completedTests.length > 0
      ? completedTests.reduce((sum, t) => {
          const start = new Date(t.startedAt || t.createdAt);
          const end = new Date(t.endedAt || new Date());
          return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
        }, 0) / completedTests.length
      : 0;

    const platformCounts = new Map<string, number>();
    const typeCounts = new Map<string, number>();
    
    tests.forEach(test => {
      platformCounts.set(test.platform, (platformCounts.get(test.platform) || 0) + 1);
      typeCounts.set(test.type, (typeCounts.get(test.type) || 0) + 1);
    });

    const mostTestedPlatform = Array.from(platformCounts.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown';
    
    const mostTestedType = Array.from(typeCounts.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown';

    const topPerformingVariants = this.getTopPerformingVariants(completedTests);
    const commonInsights = this.getCommonInsights(completedTests);
    const recommendations = this.getRecommendations(completedTests);

    return {
      totalTests,
      runningTests: runningTests.length,
      completedTests: completedTests.length,
      successRate: Math.round(successRate * 100) / 100,
      averageDuration: Math.round(averageDuration * 100) / 100,
      mostTestedPlatform,
      mostTestedType,
      topPerformingVariants,
      commonInsights,
      recommendations
    };
  }

  // Clone test
  async cloneTest(testId: string, newName: string): Promise<ABTest> {
    const originalTest = this.tests.get(testId);
    if (!originalTest) {
      throw new Error('Test not found');
    }

    const clonedTest: ABTest = {
      ...originalTest,
      id: `test_${Date.now()}`,
      name: newName,
      status: 'draft',
      createdAt: new Date().toISOString(),
      startedAt: undefined,
      endedAt: undefined,
      results: this.initializeResults()
    };

    this.tests.set(clonedTest.id, clonedTest);
    this.testData.set(clonedTest.id, new Map());

    return clonedTest;
  }

  // Private helper methods
  private initializeMetrics(type: string): TestMetrics {
    const baseMetrics = {
      primary: {
        name: 'engagement',
        description: 'Total engagement (likes + shares + comments)',
        unit: 'count'
      },
      secondary: [
        {
          name: 'views',
          description: 'Number of views',
          unit: 'count'
        },
        {
          name: 'clicks',
          description: 'Number of clicks',
          unit: 'count'
        }
      ],
      custom: []
    };

    switch (type) {
      case 'content':
        return baseMetrics;
      case 'image':
        return {
          ...baseMetrics,
          secondary: [
            ...baseMetrics.secondary,
            {
              name: 'image_views',
              description: 'Number of image views',
              unit: 'count'
            }
          ]
        };
      case 'video':
        return {
          ...baseMetrics,
          secondary: [
            ...baseMetrics.secondary,
            {
              name: 'video_views',
              description: 'Number of video views',
              unit: 'count'
            },
            {
              name: 'completion_rate',
              description: 'Video completion rate',
              unit: 'percentage'
            }
          ]
        };
      default:
        return baseMetrics;
    }
  }

  private initializeResults(): TestResults {
    return {
      status: 'collecting',
      confidence: 0,
      significance: 0,
      sampleSize: 0,
      duration: 0,
      variants: [],
      insights: [],
      recommendations: [],
      nextSteps: []
    };
  }

  private async performStatisticalAnalysis(
    test: ABTest,
    testDataMap: Map<string, number[]>
  ): Promise<TestResults> {
    const variants = test.variants.map(variant => {
      const data = testDataMap.get(variant.id) || [];
      const metrics = this.calculateVariantMetrics(data, test.metrics);
      const statistics = this.calculateStatistics(data);
      
      return {
        variantId: variant.id,
        name: variant.name,
        metrics,
        performance: {
          improvement: 0, // Will be calculated after control comparison
          confidence: 0,
          significance: 0
        },
        statistics
      };
    });

    // Find control variant
    const controlVariant = variants.find(v => 
      test.variants.find(tv => tv.id === v.variantId)?.isControl
    );

    if (controlVariant) {
      // Calculate improvement vs control
      variants.forEach(variant => {
        if (variant.variantId !== controlVariant.variantId) {
          const improvement = ((variant.metrics.primary - controlVariant.metrics.primary) / controlVariant.metrics.primary) * 100;
          variant.performance.improvement = Math.round(improvement * 100) / 100;
        }
      });
    }

    // Determine winner
    const winner = variants.reduce((best, current) => 
      current.metrics.primary > best.metrics.primary ? current : best
    );

    // Calculate overall confidence and significance
    const confidence = this.calculateConfidence(variants);
    const significance = this.calculateSignificance(variants);

    // Determine test status
    let status: TestResults['status'] = 'collecting';
    if (variants.length >= 2 && variants.every(v => v.statistics.sampleSize >= test.settings.minSampleSize)) {
      if (significance >= test.settings.significanceThreshold) {
        status = 'conclusive';
      } else {
        status = 'inconclusive';
      }
    }

    const insights = this.generateInsights(variants, test);
    const recommendations = this.generateRecommendations(variants, test);
    const nextSteps = this.generateNextSteps(status, winner, test);

    return {
      status,
      winner: status === 'conclusive' ? winner.variantId : undefined,
      confidence,
      significance,
      sampleSize: variants.reduce((sum, v) => sum + v.statistics.sampleSize, 0),
      duration: test.startedAt ? 
        (new Date().getTime() - new Date(test.startedAt).getTime()) / (1000 * 60 * 60 * 24) : 0,
      variants,
      insights,
      recommendations,
      nextSteps
    };
  }

  private calculateVariantMetrics(data: number[], metrics: TestMetrics): {
    primary: number;
    secondary: Record<string, number>;
    custom: Record<string, number>;
  } {
    const primary = data.length > 0 ? data.reduce((sum, value) => sum + value, 0) / data.length : 0;
    
    return {
      primary: Math.round(primary * 100) / 100,
      secondary: {},
      custom: {}
    };
  }

  private calculateStatistics(data: number[]): {
    mean: number;
    median: number;
    standardDeviation: number;
    sampleSize: number;
  } {
    if (data.length === 0) {
      return { mean: 0, median: 0, standardDeviation: 0, sampleSize: 0 };
    }

    const sorted = [...data].sort((a, b) => a - b);
    const mean = data.reduce((sum, value) => sum + value, 0) / data.length;
    const median = sorted.length % 2 === 0 
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];
    
    const variance = data.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / data.length;
    const standardDeviation = Math.sqrt(variance);

    return {
      mean: Math.round(mean * 100) / 100,
      median: Math.round(median * 100) / 100,
      standardDeviation: Math.round(standardDeviation * 100) / 100,
      sampleSize: data.length
    };
  }

  private calculateConfidence(variants: TestResults['variants']): number {
    // Simplified confidence calculation
    const totalSampleSize = variants.reduce((sum, v) => sum + v.statistics.sampleSize, 0);
    return Math.min(totalSampleSize / 1000, 0.95); // Max 95% confidence
  }

  private calculateSignificance(variants: TestResults['variants']): number {
    // Simplified significance calculation
    if (variants.length < 2) return 0;
    
    const control = variants.find(v => v.variantId.includes('control'));
    const test = variants.find(v => !v.variantId.includes('control'));
    
    if (!control || !test) return 0;
    
    const difference = Math.abs(test.metrics.primary - control.metrics.primary);
    const pooledStd = Math.sqrt(
      (control.statistics.standardDeviation ** 2 + test.statistics.standardDeviation ** 2) / 2
    );
    
    if (pooledStd === 0) return 0;
    
    const tStatistic = difference / pooledStd;
    return Math.min(tStatistic / 2, 0.99); // Simplified t-test approximation
  }

  private generateInsights(variants: TestResults['variants'], test: ABTest): string[] {
    const insights: string[] = [];
    
    if (variants.length >= 2) {
      const winner = variants.reduce((best, current) => 
        current.metrics.primary > best.metrics.primary ? current : best
      );
      const loser = variants.reduce((worst, current) => 
        current.metrics.primary < worst.metrics.primary ? current : worst
      );
      
      const improvement = ((winner.metrics.primary - loser.metrics.primary) / loser.metrics.primary) * 100;
      
      insights.push(`${winner.name} performed ${improvement.toFixed(1)}% better than ${loser.name}`);
      insights.push(`Winner: ${winner.name} with ${winner.metrics.primary} ${test.metrics.primary.unit}`);
    }
    
    return insights;
  }

  private generateRecommendations(variants: TestResults['variants'], test: ABTest): string[] {
    const recommendations: string[] = [];
    
    if (variants.length >= 2) {
      const winner = variants.reduce((best, current) => 
        current.metrics.primary > best.metrics.primary ? current : best
      );
      
      recommendations.push(`Implement ${winner.name} as the primary variant`);
      recommendations.push('Consider running follow-up tests to validate results');
      recommendations.push('Monitor performance over time to ensure consistency');
    }
    
    return recommendations;
  }

  private generateNextSteps(
    status: TestResults['status'],
    winner: TestResults['variants'][0],
    test: ABTest
  ): string[] {
    const nextSteps: string[] = [];
    
    switch (status) {
      case 'collecting':
        nextSteps.push('Continue collecting data until minimum sample size is reached');
        nextSteps.push('Monitor test progress and check for any issues');
        break;
      case 'conclusive':
        nextSteps.push(`Implement winning variant: ${winner.name}`);
        nextSteps.push('Document learnings and insights');
        nextSteps.push('Plan follow-up tests based on results');
        break;
      case 'inconclusive':
        nextSteps.push('Extend test duration to collect more data');
        nextSteps.push('Consider increasing sample size or traffic allocation');
        nextSteps.push('Review test setup and metrics');
        break;
    }
    
    return nextSteps;
  }

  private async updateTestResults(testId: string): Promise<void> {
    const test = this.tests.get(testId);
    if (!test) return;

    const testDataMap = this.testData.get(testId) || new Map();
    const results = await this.performStatisticalAnalysis(test, testDataMap);
    
    test.results = results;
    this.tests.set(testId, test);
  }

  private getTopPerformingVariants(completedTests: ABTest[]): Array<{
    variant: TestVariant;
    improvement: number;
    confidence: number;
  }> {
    const topVariants: Array<{
      variant: TestVariant;
      improvement: number;
      confidence: number;
    }> = [];

    completedTests.forEach(test => {
      if (test.results.status === 'conclusive' && test.results.winner) {
        const winnerVariant = test.variants.find(v => v.id === test.results.winner);
        if (winnerVariant) {
          const winnerResult = test.results.variants.find(v => v.variantId === test.results.winner);
          if (winnerResult) {
            topVariants.push({
              variant: winnerVariant,
              improvement: winnerResult.performance.improvement,
              confidence: test.results.confidence
            });
          }
        }
      }
    });

    return topVariants
      .sort((a, b) => b.improvement - a.improvement)
      .slice(0, 10);
  }

  private getCommonInsights(completedTests: ABTest[]): string[] {
    const insights: string[] = [];
    
    const conclusiveTests = completedTests.filter(t => t.results.status === 'conclusive');
    if (conclusiveTests.length > 0) {
      insights.push(`${conclusiveTests.length} tests produced conclusive results`);
      insights.push('Most tests showed improvement with optimized content');
      insights.push('Image and video tests tend to perform better than text-only tests');
    }
    
    return insights;
  }

  private getRecommendations(completedTests: ABTest[]): string[] {
    const recommendations: string[] = [];
    
    const conclusiveTests = completedTests.filter(t => t.results.status === 'conclusive');
    if (conclusiveTests.length > 0) {
      recommendations.push('Continue running A/B tests to optimize content performance');
      recommendations.push('Focus on testing high-impact changes first');
      recommendations.push('Document successful patterns for future reference');
    }
    
    return recommendations;
  }
}
