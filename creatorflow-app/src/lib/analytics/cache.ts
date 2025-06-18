import { AnalyticsResponse } from './types';
import { redis as redisClient, CACHE_TTL } from '../redis';
import { AnalyticsMonitoring } from './monitoring';

export class AnalyticsCache {
  private static instance: AnalyticsCache;
  private cache: Map<string, { data: any; timestamp: number }>;
  private monitoring: AnalyticsMonitoring;

  private constructor() {
    this.cache = new Map();
    this.monitoring = AnalyticsMonitoring.getInstance();
  }

  static getInstance(): AnalyticsCache {
    if (!AnalyticsCache.instance) {
      AnalyticsCache.instance = new AnalyticsCache();
    }
    return AnalyticsCache.instance;
  }

  private generateKey(userId: string, endpoint: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = params[key];
        return acc;
      }, {} as Record<string, any>);
    
    return `analytics:${userId}:${endpoint}:${JSON.stringify(sortedParams)}`;
  }

  async get<T>(userId: string, endpoint: string, params: Record<string, any>): Promise<AnalyticsResponse<T> | null> {
    const startTime = Date.now();
    const key = this.generateKey(userId, endpoint, params);
    
    try {
      // Try Redis first
      const cached = await redisClient.get<AnalyticsResponse<T>>(key);
      if (cached) {
        await this.monitoring.trackCacheOperation(
          userId,
          endpoint,
          'hit',
          Date.now() - startTime
        );
        return cached;
      }

      // Fallback to memory cache
      const memoryCached = this.cache.get(key);
      if (memoryCached && Date.now() - memoryCached.timestamp < CACHE_TTL * 1000) {
        await this.monitoring.trackCacheOperation(
          userId,
          endpoint,
          'hit',
          Date.now() - startTime
        );
        return {
          data: memoryCached.data,
          timestamp: new Date(memoryCached.timestamp).toISOString(),
          cached: true
        };
      }

      await this.monitoring.trackCacheOperation(
        userId,
        endpoint,
        'miss',
        Date.now() - startTime
      );
      return null;
    } catch (error) {
      console.error('Redis cache error:', error);
      await this.monitoring.trackCacheOperation(
        userId,
        endpoint,
        'error',
        Date.now() - startTime
      );
      return null;
    }
  }

  async set<T>(userId: string, endpoint: string, params: Record<string, any>, data: T): Promise<void> {
    const startTime = Date.now();
    const key = this.generateKey(userId, endpoint, params);
    const response: AnalyticsResponse<T> = {
      data,
      timestamp: new Date().toISOString(),
      cached: true
    };

    try {
      // Set in Redis
      await redisClient.set(key, response, { ex: CACHE_TTL });

      // Set in memory cache
      this.cache.set(key, {
        data,
        timestamp: Date.now()
      });

      await this.monitoring.trackCacheOperation(
        userId,
        endpoint,
        'hit',
        Date.now() - startTime
      );
    } catch (error) {
      console.error('Redis cache error:', error);
      await this.monitoring.trackCacheOperation(
        userId,
        endpoint,
        'error',
        Date.now() - startTime
      );
    }
  }

  async invalidate(userId: string, endpoint?: string): Promise<void> {
    const startTime = Date.now();
    const pattern = endpoint 
      ? `analytics:${userId}:${endpoint}:*`
      : `analytics:${userId}:*`;

    try {
      // Invalidate Redis cache
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(...keys);
      }

      // Invalidate memory cache
      for (const key of this.cache.keys()) {
        if (key.startsWith(`analytics:${userId}:${endpoint || ''}`)) {
          this.cache.delete(key);
        }
      }

      await this.monitoring.trackCacheOperation(
        userId,
        endpoint || 'all',
        'invalidate',
        Date.now() - startTime
      );
    } catch (error) {
      console.error('Redis cache invalidation error:', error);
      await this.monitoring.trackCacheOperation(
        userId,
        endpoint || 'all',
        'error',
        Date.now() - startTime
      );
    }
  }

  async clear(): Promise<void> {
    const startTime = Date.now();
    try {
      // Clear Redis cache
      const keys = await redisClient.keys('analytics:*');
      if (keys.length > 0) {
        await redisClient.del(...keys);
      }

      // Clear memory cache
      this.cache.clear();

      await this.monitoring.trackCacheOperation(
        'system',
        'all',
        'invalidate',
        Date.now() - startTime
      );
    } catch (error) {
      console.error('Redis cache clear error:', error);
      await this.monitoring.trackCacheOperation(
        'system',
        'all',
        'error',
        Date.now() - startTime
      );
    }
  }
} 