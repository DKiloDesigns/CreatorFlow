import { prisma } from '@/lib/prisma';
import { defaultCache as cache } from './cache';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (req: any) => string;
  handler?: (req: any, res: any) => void;
}

interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

class RateLimiter {
  private configs: Map<string, RateLimitConfig> = new Map();

  constructor() {
    this.initializeDefaultConfigs();
  }

  private initializeDefaultConfigs() {
    // API rate limits
    this.addConfig('api', {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 1000,
    });

    // Platform-specific limits
    this.addConfig('instagram', {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 200,
    });

    this.addConfig('twitter', {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 300,
    });

    this.addConfig('youtube', {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 50,
    });

    this.addConfig('tiktok', {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 100,
    });

    // User-specific limits
    this.addConfig('user', {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 500,
    });

    // Authentication limits
    this.addConfig('auth', {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 10,
    });
  }

  addConfig(name: string, config: RateLimitConfig) {
    this.configs.set(name, config);
  }

  async checkLimit(key: string, configName: string): Promise<RateLimitInfo> {
    const config = this.configs.get(configName);
    if (!config) {
      throw new Error(`Rate limit config '${configName}' not found`);
    }

    const now = Date.now();
    const windowStart = now - config.windowMs;
    const cacheKey = `rate_limit:${configName}:${key}`;

    // Get current requests from cache
    let requests = await cache.get<number[]>(cacheKey) || [];
    
    // Filter out old requests outside the window
    requests = requests.filter(timestamp => timestamp > windowStart);

    const currentCount = requests.length;
    const limit = config.maxRequests;
    const remaining = Math.max(0, limit - currentCount);
    const reset = now + config.windowMs;

    return {
      limit,
      remaining,
      reset,
      retryAfter: remaining === 0 ? Math.ceil((reset - now) / 1000) : undefined,
    };
  }

  async increment(key: string, configName: string): Promise<RateLimitInfo> {
    const config = this.configs.get(configName);
    if (!config) {
      throw new Error(`Rate limit config '${configName}' not found`);
    }

    const now = Date.now();
    const windowStart = now - config.windowMs;
    const cacheKey = `rate_limit:${configName}:${key}`;

    // Get current requests
    let requests = await cache.get<number[]>(cacheKey) || [];
    
    // Filter out old requests
    requests = requests.filter(timestamp => timestamp > windowStart);
    
    // Add current request
    requests.push(now);

    // Store updated requests
    await cache.set(cacheKey, requests, config.windowMs);

    const limit = config.maxRequests;
    const remaining = Math.max(0, limit - requests.length);
    const reset = now + config.windowMs;

    // Log rate limit event
    await this.logRateLimitEvent(key, configName, requests.length, limit);

    return {
      limit,
      remaining,
      reset,
      retryAfter: remaining === 0 ? Math.ceil((reset - now) / 1000) : undefined,
    };
  }

  async isLimited(key: string, configName: string): Promise<boolean> {
    const info = await this.checkLimit(key, configName);
    return info.remaining === 0;
  }

  async getRemaining(key: string, configName: string): Promise<number> {
    const info = await this.checkLimit(key, configName);
    return info.remaining;
  }

  async reset(key: string, configName: string): Promise<void> {
    const cacheKey = `rate_limit:${configName}:${key}`;
    await cache.delete(cacheKey);
  }

  private async logRateLimitEvent(key: string, configName: string, currentCount: number, limit: number) {
    try {
      await prisma.rateLimitEvent.create({
        data: {
          key,
          configName,
          currentCount,
          limit,
          timestamp: new Date(),
        },
      });
    } catch (error) {
      console.error('Failed to log rate limit event:', error);
    }
  }

  // Platform-specific rate limiting
  async checkPlatformLimit(userId: string, platform: string): Promise<RateLimitInfo> {
    const key = `${userId}:${platform}`;
    return this.checkLimit(key, platform);
  }

  async incrementPlatformLimit(userId: string, platform: string): Promise<RateLimitInfo> {
    const key = `${userId}:${platform}`;
    return this.increment(key, platform);
  }

  // User-specific rate limiting
  async checkUserLimit(userId: string): Promise<RateLimitInfo> {
    return this.checkLimit(userId, 'user');
  }

  async incrementUserLimit(userId: string): Promise<RateLimitInfo> {
    return this.increment(userId, 'user');
  }

  // API rate limiting
  async checkAPILimit(identifier: string): Promise<RateLimitInfo> {
    return this.checkLimit(identifier, 'api');
  }

  async incrementAPILimit(identifier: string): Promise<RateLimitInfo> {
    return this.increment(identifier, 'api');
  }

  // Authentication rate limiting
  async checkAuthLimit(identifier: string): Promise<RateLimitInfo> {
    return this.checkLimit(identifier, 'auth');
  }

  async incrementAuthLimit(identifier: string): Promise<RateLimitInfo> {
    return this.increment(identifier, 'auth');
  }

  // Get rate limit statistics
  async getStats(): Promise<any> {
    try {
      const stats = await prisma.rateLimitEvent.groupBy({
        by: ['configName'],
        _count: { id: true },
        _max: { currentCount: true },
        where: {
          timestamp: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
      });

      return stats.map(stat => ({
        configName: stat.configName,
        totalEvents: stat._count.id,
        maxConcurrent: stat._max.currentCount,
      }));
    } catch (error) {
      console.error('Failed to get rate limit stats:', error);
      return [];
    }
  }
}

// Middleware for Express/Next.js
export function rateLimitMiddleware(configName: string, keyGenerator?: (req: any) => string) {
  const rateLimiter = new RateLimiter();

  return async (req: any, res: any, next: any) => {
    try {
      const key = keyGenerator ? keyGenerator(req) : req.ip || 'unknown';
      const info = await rateLimiter.increment(key, configName);

      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', info.limit);
      res.setHeader('X-RateLimit-Remaining', info.remaining);
      res.setHeader('X-RateLimit-Reset', info.reset);

      if (info.remaining === 0) {
        res.setHeader('Retry-After', info.retryAfter);
        return res.status(429).json({
          error: 'Too Many Requests',
          message: 'Rate limit exceeded',
          retryAfter: info.retryAfter,
        });
      }

      next();
    } catch (error) {
      console.error('Rate limit middleware error:', error);
      next();
    }
  };
}

// Platform-specific middleware
export function platformRateLimitMiddleware(platform: string) {
  return rateLimitMiddleware(platform, (req) => {
    const userId = req.user?.id || req.session?.user?.id || 'anonymous';
    return `${userId}:${platform}`;
  });
}

// User rate limit middleware
export function userRateLimitMiddleware() {
  return rateLimitMiddleware('user', (req) => {
    return req.user?.id || req.session?.user?.id || req.ip;
  });
}

// API rate limit middleware
export function apiRateLimitMiddleware() {
  return rateLimitMiddleware('api', (req) => {
    return req.ip || req.headers['x-forwarded-for'] || 'unknown';
  });
}

// Authentication rate limit middleware
export function authRateLimitMiddleware() {
  return rateLimitMiddleware('auth', (req) => {
    return req.ip || req.headers['x-forwarded-for'] || 'unknown';
  });
}

// Export rate limiter instance
export const rateLimiter = new RateLimiter();

// Utility functions
export const rateLimitUtils = {
  // Check if user can make a request to a platform
  canMakePlatformRequest: async (userId: string, platform: string): Promise<boolean> => {
    return !(await rateLimiter.isLimited(`${userId}:${platform}`, platform));
  },

  // Get remaining requests for a platform
  getPlatformRemaining: async (userId: string, platform: string): Promise<number> => {
    return await rateLimiter.getRemaining(`${userId}:${platform}`, platform);
  },

  // Reset rate limit for a user/platform
  resetPlatformLimit: async (userId: string, platform: string): Promise<void> => {
    await rateLimiter.reset(`${userId}:${platform}`, platform);
  },

  // Get rate limit info without incrementing
  getPlatformLimitInfo: async (userId: string, platform: string): Promise<RateLimitInfo> => {
    return await rateLimiter.checkPlatformLimit(userId, platform);
  },
}; 