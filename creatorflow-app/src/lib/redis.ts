import { createClient, RedisClientType } from 'redis';

let redis: RedisClientType | null = null;

export async function getRedisClient(): Promise<RedisClientType | null> {
  if (redis) {
    return redis;
  }

  try {
    redis = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        connectTimeout: 5000,
        lazyConnect: true,
      },
    });

    redis.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    redis.on('connect', () => {
      console.log('✅ Redis connected successfully');
    });

    redis.on('ready', () => {
      console.log('✅ Redis ready for operations');
    });

    redis.on('end', () => {
      console.log('❌ Redis connection ended');
    });

    await redis.connect();
    return redis;
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    return null;
  }
}

export async function closeRedisConnection(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
  }
}

// Cache utility functions
export class CacheManager {
  private static instance: CacheManager;
  private redis: RedisClientType | null = null;

  private constructor() {}

  public static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  public async init(): Promise<void> {
    this.redis = await getRedisClient();
  }

  public async get<T>(key: string): Promise<T | null> {
    if (!this.redis) {
      return null;
    }

    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  public async set(key: string, value: any, ttlSeconds: number = 300): Promise<boolean> {
    if (!this.redis) {
      return false;
    }

    try {
      await this.redis.setEx(key, ttlSeconds, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  public async del(key: string): Promise<boolean> {
    if (!this.redis) {
      return false;
    }

    try {
      await this.redis.del(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  public async exists(key: string): Promise<boolean> {
    if (!this.redis) {
      return false;
    }

    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  public async flush(): Promise<boolean> {
    if (!this.redis) {
      return false;
    }

    try {
      await this.redis.flushAll();
      return true;
    } catch (error) {
      console.error('Cache flush error:', error);
      return false;
    }
  }
}

// Cache key generators
export const CacheKeys = {
  user: (id: string) => `user:${id}`,
  userPosts: (userId: string) => `user:${userId}:posts`,
  userNotifications: (userId: string) => `user:${userId}:notifications`,
  analytics: (type: string, userId: string) => `analytics:${type}:${userId}`,
  aiContent: (prompt: string) => `ai:content:${Buffer.from(prompt).toString('base64')}`,
  apiResponse: (endpoint: string, params: string) => `api:${endpoint}:${Buffer.from(params).toString('base64')}`,
  dashboard: (userId: string) => `dashboard:${userId}`,
  announcements: () => 'announcements:all',
} as const;

// Cache TTL constants (in seconds)
export const CacheTTL = {
  SHORT: 300,      // 5 minutes
  MEDIUM: 900,     // 15 minutes
  LONG: 3600,      // 1 hour
  VERY_LONG: 86400, // 24 hours
} as const;