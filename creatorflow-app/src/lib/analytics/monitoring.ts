import { redis } from '../redis';

export interface CacheMetrics {
  hits: number;
  misses: number;
  errors: number;
  invalidationCount: number;
  averageResponseTime: number;
}

export interface RateLimitMetrics {
  totalRequests: number;
  blockedRequests: number;
  averageResponseTime: number;
  errorCount: number;
}

type RedisMetrics = Record<string, string>;

export class AnalyticsMonitoring {
  private static instance: AnalyticsMonitoring;
  private cacheMetrics: Map<string, CacheMetrics>;
  private rateLimitMetrics: Map<string, RateLimitMetrics>;
  private readonly METRICS_TTL = 60 * 60 * 24; // 24 hours

  private constructor() {
    this.cacheMetrics = new Map();
    this.rateLimitMetrics = new Map();
  }

  static getInstance(): AnalyticsMonitoring {
    if (!AnalyticsMonitoring.instance) {
      AnalyticsMonitoring.instance = new AnalyticsMonitoring();
    }
    return AnalyticsMonitoring.instance;
  }

  private generateKey(type: 'cache' | 'ratelimit', userId: string, endpoint: string): string {
    return `monitoring:${type}:${userId}:${endpoint}`;
  }

  async trackCacheOperation(
    userId: string,
    endpoint: string,
    operation: 'hit' | 'miss' | 'error' | 'invalidate',
    responseTime: number
  ): Promise<void> {
    const key = this.generateKey('cache', userId, endpoint);
    const timestamp = new Date().toISOString();

    try {
      // Update Redis metrics
      await redis.hincrby(key, operation, 1);
      await redis.hincrby(key, 'totalResponseTime', responseTime);
      await redis.hincrby(key, 'operationCount', 1);
      await redis.expire(key, this.METRICS_TTL);

      // Update memory metrics
      const metrics = this.cacheMetrics.get(key) || {
        hits: 0,
        misses: 0,
        errors: 0,
        invalidationCount: 0,
        averageResponseTime: 0,
      };

      metrics[operation === 'hit' ? 'hits' : 
              operation === 'miss' ? 'misses' : 
              operation === 'error' ? 'errors' : 'invalidationCount']++;
      
      metrics.averageResponseTime = 
        (metrics.averageResponseTime * (metrics.hits + metrics.misses) + responseTime) / 
        (metrics.hits + metrics.misses + 1);

      this.cacheMetrics.set(key, metrics);
    } catch (error) {
      // Log operation
      console.error('Error tracking cache metrics:', error);
    }
  }

  async trackRateLimitOperation(
    userId: string,
    endpoint: string,
    blocked: boolean,
    responseTime: number
  ): Promise<void> {
    const key = this.generateKey('ratelimit', userId, endpoint);
    const timestamp = new Date().toISOString();

    try {
      // Update Redis metrics
      await redis.hincrby(key, 'totalRequests', 1);
      if (blocked) {
        await redis.hincrby(key, 'blockedRequests', 1);
      }
      await redis.hincrby(key, 'totalResponseTime', responseTime);
      await redis.expire(key, this.METRICS_TTL);

      // Update memory metrics
      const metrics = this.rateLimitMetrics.get(key) || {
        totalRequests: 0,
        blockedRequests: 0,
        averageResponseTime: 0,
        errorCount: 0,
      };

      metrics.totalRequests++;
      if (blocked) {
        metrics.blockedRequests++;
      }
      metrics.averageResponseTime = 
        (metrics.averageResponseTime * (metrics.totalRequests - 1) + responseTime) / 
        metrics.totalRequests;

      this.rateLimitMetrics.set(key, metrics);
    } catch (error) {
      console.error('Error tracking rate limit metrics:', error);
    }
  }

  async getCacheMetrics(userId: string, endpoint: string): Promise<CacheMetrics | null> {
    const key = this.generateKey('cache', userId, endpoint);
    
    try {
      const metrics = await redis.hgetall<RedisMetrics>(key);
      if (!metrics) return null;

      return {
        hits: parseInt(metrics.hits || '0', 10),
        misses: parseInt(metrics.misses || '0', 10),
        errors: parseInt(metrics.errors || '0', 10),
        invalidationCount: parseInt(metrics.invalidate || '0', 10),
        averageResponseTime: parseInt(metrics.totalResponseTime || '0', 10) / 
          parseInt(metrics.operationCount || '1', 10),
      };
    } catch (error) {
      console.error('Error getting cache metrics:', error);
      return this.cacheMetrics.get(key) || null;
    }
  }

  async getRateLimitMetrics(userId: string, endpoint: string): Promise<RateLimitMetrics | null> {
    const key = this.generateKey('ratelimit', userId, endpoint);
    
    try {
      const metrics = await redis.hgetall<RedisMetrics>(key);
      if (!metrics) return null;

      return {
        totalRequests: parseInt(metrics.totalRequests || '0', 10),
        blockedRequests: parseInt(metrics.blockedRequests || '0', 10),
        averageResponseTime: parseInt(metrics.totalResponseTime || '0', 10) / 
          parseInt(metrics.totalRequests || '1', 10),
        errorCount: parseInt(metrics.errorCount || '0', 10),
      };
    } catch (error) {
      console.error('Error getting rate limit metrics:', error);
      return this.rateLimitMetrics.get(key) || null;
    }
  }

  async clearMetrics(): Promise<void> {
    try {
      const keys = await redis.keys('monitoring:*');
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      console.error('Error clearing metrics:', error);
    }
    this.cacheMetrics.clear();
    this.rateLimitMetrics.clear();
  }
} 