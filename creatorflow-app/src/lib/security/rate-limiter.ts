import { NextRequest, NextResponse } from 'next/server';
import { getRedisClient } from '../redis';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyGenerator?: (req: NextRequest) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

class RateLimiter {
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = {
      keyGenerator: (req) => req.ip || 'anonymous',
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
      ...config,
    };
  }

  async checkLimit(req: NextRequest): Promise<RateLimitResult> {
    const key = this.config.keyGenerator!(req);
    const redisKey = `rate_limit:${key}`;
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    try {
      const client = await getRedisClient();
      if (!client) {
        // Fallback: allow request if Redis is unavailable
        return {
          success: true,
          limit: this.config.maxRequests,
          remaining: this.config.maxRequests - 1,
          resetTime: now + this.config.windowMs,
        };
      }

      // Get current requests in window
      const requests = await client.zrangebyscore(redisKey, windowStart, '+inf');
      const currentCount = requests.length;

      if (currentCount >= this.config.maxRequests) {
        // Rate limit exceeded
        const oldestRequest = await client.zrange(redisKey, 0, 0, 'WITHSCORES');
        const resetTime = oldestRequest.length > 0 
          ? parseInt(oldestRequest[1]) + this.config.windowMs
          : now + this.config.windowMs;

        return {
          success: false,
          limit: this.config.maxRequests,
          remaining: 0,
          resetTime,
          retryAfter: Math.ceil((resetTime - now) / 1000),
        };
      }

      // Add current request
      await client.zadd(redisKey, now, `${now}-${Math.random()}`);
      await client.expire(redisKey, Math.ceil(this.config.windowMs / 1000));

      // Clean up old requests
      await client.zremrangebyscore(redisKey, '-inf', windowStart);

      return {
        success: true,
        limit: this.config.maxRequests,
        remaining: this.config.maxRequests - currentCount - 1,
        resetTime: now + this.config.windowMs,
      };
    } catch (error) {
      console.error('Rate limiter error:', error);
      // Fallback: allow request on error
      return {
        success: true,
        limit: this.config.maxRequests,
        remaining: this.config.maxRequests - 1,
        resetTime: now + this.config.windowMs,
      };
    }
  }

  middleware() {
    return async (req: NextRequest) => {
      const result = await this.checkLimit(req);
      
      if (!result.success) {
        return new NextResponse(
          JSON.stringify({
            error: 'Rate limit exceeded',
            message: 'Too many requests. Please try again later.',
            retryAfter: result.retryAfter,
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'X-RateLimit-Limit': result.limit.toString(),
              'X-RateLimit-Remaining': result.remaining.toString(),
              'X-RateLimit-Reset': result.resetTime.toString(),
              'Retry-After': result.retryAfter?.toString() || '60',
            },
          }
        );
      }

      // Add rate limit headers to successful responses
      const response = NextResponse.next();
      response.headers.set('X-RateLimit-Limit', result.limit.toString());
      response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
      response.headers.set('X-RateLimit-Reset', result.resetTime.toString());

      return response;
    };
  }
}

// Pre-configured rate limiters
export const apiRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 requests per 15 minutes
  keyGenerator: (req) => {
    const ip = req.ip || 'anonymous';
    const userAgent = req.headers.get('user-agent') || '';
    return `${ip}:${Buffer.from(userAgent).toString('base64').slice(0, 10)}`;
  },
});

export const authRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 auth attempts per 15 minutes
  keyGenerator: (req) => {
    const ip = req.ip || 'anonymous';
    return `auth:${ip}`;
  },
});

export const uploadRateLimiter = new RateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 10, // 10 uploads per hour
  keyGenerator: (req) => {
    const ip = req.ip || 'anonymous';
    return `upload:${ip}`;
  },
});

export { RateLimiter, type RateLimitConfig, type RateLimitResult };
