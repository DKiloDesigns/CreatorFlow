import { NextResponse } from 'next/server';
import { redis as redisClient, RATE_LIMIT } from '../redis';
import { AnalyticsMonitoring } from './monitoring';

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export class RateLimiter {
  private static instance: RateLimiter;
  private config: RateLimitConfig;
  private monitoring: AnalyticsMonitoring;

  private constructor() {
    this.config = {
      maxRequests: RATE_LIMIT,
      windowMs: 60 * 1000, // 1 minute window
    };
    this.monitoring = AnalyticsMonitoring.getInstance();
  }

  static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter();
    }
    return RateLimiter.instance;
  }

  private generateKey(userId: string, endpoint: string): string {
    return `ratelimit:${userId}:${endpoint}`;
  }

  async checkLimit(userId: string, endpoint: string): Promise<{ 
    success: boolean; 
    remaining: number;
    reset: number;
  }> {
    const startTime = Date.now();
    const key = this.generateKey(userId, endpoint);
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    try {
      // Get current requests in window
      const requests = await redisClient.zrange<number[]>(
        key,
        windowStart,
        now,
        { byScore: true }
      );

      // Remove expired requests
      await redisClient.zremrangebyscore(key, 0, windowStart);

      // Add current request
      await redisClient.zadd(key, { score: now, member: now.toString() });

      // Set expiry on the key
      await redisClient.expire(key, Math.ceil(this.config.windowMs / 1000));

      const remaining = this.config.maxRequests - requests.length;
      const reset = now + this.config.windowMs;

      await this.monitoring.trackRateLimitOperation(
        userId,
        endpoint,
        remaining <= 0,
        Date.now() - startTime
      );

      return {
        success: remaining > 0,
        remaining: Math.max(0, remaining),
        reset
      };
    } catch (error) {
      console.error('Rate limit check error:', error);
      // Fail open - allow request if Redis is down
      await this.monitoring.trackRateLimitOperation(
        userId,
        endpoint,
        false,
        Date.now() - startTime
      );
      return {
        success: true,
        remaining: this.config.maxRequests,
        reset: now + this.config.windowMs
      };
    }
  }

  async handleRateLimit(userId: string, endpoint: string): Promise<NextResponse | null> {
    const startTime = Date.now();
    const { success, remaining, reset } = await this.checkLimit(userId, endpoint);

    if (!success) {
      await this.monitoring.trackRateLimitOperation(
        userId,
        endpoint,
        true,
        Date.now() - startTime
      );
      return NextResponse.json(
        { 
          error: 'Too many requests',
          message: 'Rate limit exceeded',
          reset
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': this.config.maxRequests.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
            'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString()
          }
        }
      );
    }

    await this.monitoring.trackRateLimitOperation(
      userId,
      endpoint,
      false,
      Date.now() - startTime
    );
    return null;
  }

  setConfig(config: Partial<RateLimitConfig>): void {
    this.config = {
      ...this.config,
      ...config
    };
  }
} 