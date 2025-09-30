import { NextRequest, NextResponse } from 'next/server';
import { CacheManager, CacheKeys, CacheTTL } from './redis';

const cacheManager = CacheManager.getInstance();

// Initialize cache manager
cacheManager.init();

export interface CacheOptions {
  ttl?: number;
  keyGenerator?: (req: NextRequest) => string;
  skipCache?: (req: NextRequest) => boolean;
  cacheCondition?: (response: NextResponse) => boolean;
}

export function withCache(options: CacheOptions = {}) {
  return function (handler: (req: NextRequest) => Promise<NextResponse>) {
    return async function (req: NextRequest): Promise<NextResponse> {
      const {
        ttl = CacheTTL.MEDIUM,
        keyGenerator = defaultKeyGenerator,
        skipCache = () => false,
        cacheCondition = (res) => res.status === 200,
      } = options;

      // Skip cache if condition is met
      if (skipCache(req)) {
        return handler(req);
      }

      // Generate cache key
      const cacheKey = keyGenerator(req);

      try {
        // Try to get from cache
        const cachedResponse = await cacheManager.get<{
          status: number;
          headers: Record<string, string>;
          body: any;
        }>(cacheKey);

        if (cachedResponse) {
          console.log(`✅ Cache hit for key: ${cacheKey}`);
          return new NextResponse(JSON.stringify(cachedResponse.body), {
            status: cachedResponse.status,
            headers: {
              'Content-Type': 'application/json',
              'X-Cache': 'HIT',
              ...cachedResponse.headers,
            },
          });
        }

        // Cache miss - execute handler
        console.log(`❌ Cache miss for key: ${cacheKey}`);
        const response = await handler(req);

        // Only cache successful responses
        if (cacheCondition(response)) {
          const responseBody = await response.clone().json().catch(() => null);
          
          if (responseBody) {
            await cacheManager.set(
              cacheKey,
              {
                status: response.status,
                headers: Object.fromEntries(response.headers.entries()),
                body: responseBody,
              },
              ttl
            );
            console.log(`💾 Cached response for key: ${cacheKey}`);
          }
        }

        // Add cache headers to response
        response.headers.set('X-Cache', 'MISS');
        return response;
      } catch (error) {
        console.error('Cache middleware error:', error);
        // Fallback to handler if cache fails
        return handler(req);
      }
    };
  };
}

function defaultKeyGenerator(req: NextRequest): string {
  const url = new URL(req.url);
  const pathname = url.pathname;
  const searchParams = url.searchParams.toString();
  
  // Create a hash of the request
  const requestHash = Buffer.from(`${pathname}:${searchParams}`).toString('base64');
  return `api:${requestHash}`;
}

// Specific cache key generators for different endpoints
export const cacheKeyGenerators = {
  user: (req: NextRequest) => {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId') || 'anonymous';
    return CacheKeys.user(userId);
  },
  
  analytics: (req: NextRequest) => {
    const url = new URL(req.url);
    const type = url.searchParams.get('type') || 'overview';
    const userId = url.searchParams.get('userId') || 'anonymous';
    return CacheKeys.analytics(type, userId);
  },
  
  notifications: (req: NextRequest) => {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId') || 'anonymous';
    return CacheKeys.userNotifications(userId);
  },
  
  posts: (req: NextRequest) => {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId') || 'anonymous';
    return CacheKeys.userPosts(userId);
  },
};

// Skip cache conditions
export const skipCacheConditions = {
  // Skip cache for POST, PUT, DELETE requests
  skipNonGet: (req: NextRequest) => req.method !== 'GET',
  
  // Skip cache for requests with no-cache header
  skipNoCache: (req: NextRequest) => 
    req.headers.get('cache-control')?.includes('no-cache') || false,
  
  // Skip cache for authenticated requests that might be user-specific
  skipAuthenticated: (req: NextRequest) => 
    req.headers.get('authorization') !== null,
};

// Cache condition helpers
export const cacheConditions = {
  // Only cache successful responses
  onlySuccess: (response: NextResponse) => response.status === 200,
  
  // Cache successful responses and client errors (for rate limiting)
  successAndClientError: (response: NextResponse) => 
    response.status >= 200 && response.status < 500,
};
