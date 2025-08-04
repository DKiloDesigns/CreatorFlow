import { prisma } from '@/lib/prisma';
import { defaultCache as cache } from './cache';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  metadata?: any;
}

interface PerformanceAlert {
  id: string;
  type: 'warning' | 'error' | 'critical';
  message: string;
  metric: string;
  value: number;
  threshold: number;
  timestamp: Date;
  resolved?: boolean;
}

interface SystemHealth {
  cpu: number;
  memory: number;
  database: number;
  cache: number;
  api: number;
  overall: number;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private alerts: PerformanceAlert[] = [];
  private thresholds: Map<string, { warning: number; error: number; critical: number }> = new Map();

  constructor() {
    this.initializeThresholds();
  }

  private initializeThresholds() {
    // API response time thresholds (ms)
    this.thresholds.set('api_response_time', { warning: 500, error: 1000, critical: 2000 });
    
    // Database query time thresholds (ms)
    this.thresholds.set('db_query_time', { warning: 100, error: 500, critical: 1000 });
    
    // Cache hit rate thresholds (%)
    this.thresholds.set('cache_hit_rate', { warning: 80, error: 60, critical: 40 });
    
    // Memory usage thresholds (%)
    this.thresholds.set('memory_usage', { warning: 70, error: 85, critical: 95 });
    
    // CPU usage thresholds (%)
    this.thresholds.set('cpu_usage', { warning: 70, error: 85, critical: 95 });
    
    // Error rate thresholds (%)
    this.thresholds.set('error_rate', { warning: 5, error: 10, critical: 20 });
  }

  async recordMetric(name: string, value: number, unit: string, metadata?: any): Promise<void> {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: new Date(),
      metadata,
    };

    // Store in memory
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(metric);

    // Keep only last 1000 metrics per name
    const metrics = this.metrics.get(name)!;
    if (metrics.length > 1000) {
      metrics.splice(0, metrics.length - 1000);
    }

    // Store in database
    try {
      await prisma.performanceMetric.create({
        data: {
          name,
          value,
          unit,
          timestamp: metric.timestamp,
          metadata: metadata ? JSON.stringify(metadata) : null,
        },
      });
    } catch (error) {
      console.error('Failed to store performance metric:', error);
    }

    // Check thresholds and create alerts
    await this.checkThresholds(name, value);
  }

  async recordAPIMetric(endpoint: string, responseTime: number, statusCode: number): Promise<void> {
    await this.recordMetric('api_response_time', responseTime, 'ms', {
      endpoint,
      statusCode,
    });

    if (statusCode >= 400) {
      await this.recordMetric('api_errors', 1, 'count', {
        endpoint,
        statusCode,
      });
    }
  }

  async recordDatabaseMetric(query: string, executionTime: number): Promise<void> {
    await this.recordMetric('db_query_time', executionTime, 'ms', {
      query: query.substring(0, 100), // Truncate long queries
    });
  }

  async recordCacheMetric(hit: boolean, key: string): Promise<void> {
    await this.recordMetric('cache_operation', hit ? 1 : 0, 'hit', {
      key: key.substring(0, 50), // Truncate long keys
    });
  }

  async recordMemoryUsage(usage: number): Promise<void> {
    await this.recordMetric('memory_usage', usage, 'percent');
  }

  async recordCPUUsage(usage: number): Promise<void> {
    await this.recordMetric('cpu_usage', usage, 'percent');
  }

  private async checkThresholds(metricName: string, value: number): Promise<void> {
    const threshold = this.thresholds.get(metricName);
    if (!threshold) return;

    let alertType: 'warning' | 'error' | 'critical' | null = null;

    if (value >= threshold.critical) {
      alertType = 'critical';
    } else if (value >= threshold.error) {
      alertType = 'error';
    } else if (value >= threshold.warning) {
      alertType = 'warning';
    }

    if (alertType) {
      const alert: PerformanceAlert = {
        id: `${metricName}_${Date.now()}`,
        type: alertType,
        message: `${metricName} exceeded ${alertType} threshold: ${value} (threshold: ${threshold[alertType]})`,
        metric: metricName,
        value,
        threshold: threshold[alertType],
        timestamp: new Date(),
      };

      this.alerts.push(alert);

      // Store alert in database
      try {
        await prisma.performanceAlert.create({
          data: {
            type: alert.type,
            message: alert.message,
            metric: alert.metric,
            value: alert.value,
            threshold: alert.threshold,
            timestamp: alert.timestamp,
          },
        });
      } catch (error) {
        console.error('Failed to store performance alert:', error);
      }
    }
  }

  async getMetrics(name: string, timeRange: { start: Date; end: Date }): Promise<PerformanceMetric[]> {
    try {
      const metrics = await prisma.performanceMetric.findMany({
        where: {
          name,
          timestamp: {
            gte: timeRange.start,
            lte: timeRange.end,
          },
        },
        orderBy: { timestamp: 'asc' },
      });

      return metrics.map(metric => ({
        name: metric.name,
        value: metric.value,
        unit: metric.unit,
        timestamp: metric.timestamp,
        metadata: metric.metadata ? JSON.parse(metric.metadata) : undefined,
      }));
    } catch (error) {
      console.error('Failed to get metrics:', error);
      return [];
    }
  }

  async getAlerts(resolved?: boolean): Promise<PerformanceAlert[]> {
    try {
      const alerts = await prisma.performanceAlert.findMany({
        where: resolved !== undefined ? { resolved } : {},
        orderBy: { timestamp: 'desc' },
        take: 100,
      });

      return alerts.map(alert => ({
        id: alert.id,
        type: alert.type as 'warning' | 'error' | 'critical',
        message: alert.message,
        metric: alert.metric,
        value: alert.value,
        threshold: alert.threshold,
        timestamp: alert.timestamp,
        resolved: alert.resolved || false,
      }));
    } catch (error) {
      console.error('Failed to get alerts:', error);
      return [];
    }
  }

  async getSystemHealth(): Promise<SystemHealth> {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // Get recent metrics
    const apiMetrics = await this.getMetrics('api_response_time', { start: oneHourAgo, end: now });
    const dbMetrics = await this.getMetrics('db_query_time', { start: oneHourAgo, end: now });
    const cacheMetrics = await this.getMetrics('cache_operation', { start: oneHourAgo, end: now });
    const memoryMetrics = await this.getMetrics('memory_usage', { start: oneHourAgo, end: now });

    // Calculate health scores
    const apiHealth = this.calculateHealthScore(apiMetrics, 1000); // Target: < 1000ms
    const dbHealth = this.calculateHealthScore(dbMetrics, 500); // Target: < 500ms
    const cacheHealth = this.calculateCacheHealthScore(cacheMetrics);
    const memoryHealth = this.calculateHealthScore(memoryMetrics, 80, true); // Target: < 80%

    // Get CPU usage (mock for now)
    const cpuHealth = 85; // This would come from system monitoring

    const overall = Math.round((apiHealth + dbHealth + cacheHealth + memoryHealth + cpuHealth) / 5);

    return {
      cpu: cpuHealth,
      memory: memoryHealth,
      database: dbHealth,
      cache: cacheHealth,
      api: apiHealth,
      overall,
    };
  }

  private calculateHealthScore(metrics: PerformanceMetric[], target: number, lowerIsBetter: boolean = false): number {
    if (metrics.length === 0) return 100;

    const avgValue = metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length;
    
    if (lowerIsBetter) {
      return Math.max(0, Math.min(100, 100 - (avgValue / target) * 100));
    } else {
      return Math.max(0, Math.min(100, (avgValue / target) * 100));
    }
  }

  private calculateCacheHealthScore(metrics: PerformanceMetric[]): number {
    if (metrics.length === 0) return 100;

    const hits = metrics.filter(m => m.value === 1).length;
    const total = metrics.length;
    const hitRate = (hits / total) * 100;

    return Math.max(0, Math.min(100, hitRate));
  }

  async getOptimizationRecommendations(): Promise<string[]> {
    const recommendations: string[] = [];
    const health = await this.getSystemHealth();

    if (health.api < 70) {
      recommendations.push('API response times are slow. Consider implementing caching or optimizing database queries.');
    }

    if (health.database < 70) {
      recommendations.push('Database queries are slow. Consider adding database indexes or optimizing query patterns.');
    }

    if (health.cache < 70) {
      recommendations.push('Cache hit rate is low. Consider expanding cache coverage or adjusting cache TTL.');
    }

    if (health.memory > 80) {
      recommendations.push('Memory usage is high. Consider implementing memory cleanup or scaling resources.');
    }

    if (health.cpu > 80) {
      recommendations.push('CPU usage is high. Consider optimizing code or scaling horizontally.');
    }

    return recommendations;
  }

  async getPerformanceStats(timeRange: { start: Date; end: Date }): Promise<any> {
    const apiMetrics = await this.getMetrics('api_response_time', timeRange);
    const dbMetrics = await this.getMetrics('db_query_time', timeRange);
    const cacheMetrics = await this.getMetrics('cache_operation', timeRange);

    return {
      api: {
        count: apiMetrics.length,
        avgResponseTime: apiMetrics.length > 0 ? apiMetrics.reduce((sum, m) => sum + m.value, 0) / apiMetrics.length : 0,
        maxResponseTime: apiMetrics.length > 0 ? Math.max(...apiMetrics.map(m => m.value)) : 0,
        minResponseTime: apiMetrics.length > 0 ? Math.min(...apiMetrics.map(m => m.value)) : 0,
      },
      database: {
        count: dbMetrics.length,
        avgQueryTime: dbMetrics.length > 0 ? dbMetrics.reduce((sum, m) => sum + m.value, 0) / dbMetrics.length : 0,
        maxQueryTime: dbMetrics.length > 0 ? Math.max(...dbMetrics.map(m => m.value)) : 0,
      },
      cache: {
        total: cacheMetrics.length,
        hits: cacheMetrics.filter(m => m.value === 1).length,
        misses: cacheMetrics.filter(m => m.value === 0).length,
        hitRate: cacheMetrics.length > 0 ? (cacheMetrics.filter(m => m.value === 1).length / cacheMetrics.length) * 100 : 0,
      },
    };
  }
}

// Performance monitoring decorator
export function monitorPerformance(metricName: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    const monitor = new PerformanceMonitor();

    descriptor.value = async function (...args: any[]) {
      const startTime = performance.now();
      
      try {
        const result = await method.apply(this, args);
        const executionTime = performance.now() - startTime;
        
        await monitor.recordMetric(metricName, executionTime, 'ms', {
          method: propertyName,
          success: true,
        });
        
        return result;
      } catch (error) {
        const executionTime = performance.now() - startTime;
        
        await monitor.recordMetric(metricName, executionTime, 'ms', {
          method: propertyName,
          success: false,
          error: error.message,
        });
        
        throw error;
      }
    };
  };
}

// Export performance monitor instance
export const performanceMonitor = new PerformanceMonitor(); 