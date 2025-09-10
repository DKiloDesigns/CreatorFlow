import { prisma } from '@/lib/prisma';

interface CacheEntry<T = any> {
  value: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  memoryUsage: number;
  averageAccessTime: number;
}

class MemoryCache {
  private cache = new Map<string, CacheEntry>();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    size: 0,
    memoryUsage: 0,
    averageAccessTime: 0,
  };
  private maxSize = 1000; // Maximum cache entries
  private maxMemoryUsage = 50 * 1024 * 1024; // 50MB

  async get<T>(key: string): Promise<T | null> {
    const startTime = performance.now();
    
    const entry = this.cache.get(key);
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      this.updateStats();
      return null;
    }

    // Update access stats
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    this.stats.hits++;
    
    const accessTime = performance.now() - startTime;
    this.stats.averageAccessTime = (this.stats.averageAccessTime + accessTime) / 2;
    
    this.updateStats();
    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttl: number = 300000): Promise<void> {
    // Check if we need to evict entries
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }

    const entry: CacheEntry<T> = {
      value,
      timestamp: Date.now(),
      ttl,
      accessCount: 0,
      lastAccessed: Date.now(),
    };

    this.cache.set(key, entry);
    this.updateStats();
  }

  async delete(key: string): Promise<boolean> {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.updateStats();
    }
    return deleted;
  }

  async clear(): Promise<void> {
    this.cache.clear();
    this.updateStats();
  }

  async has(key: string): Promise<boolean> {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  async keys(pattern?: string): Promise<string[]> {
    const keys = Array.from(this.cache.keys());
    if (!pattern) return keys;
    
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    return keys.filter(key => regex.test(key));
  }

  getStats(): CacheStats {
    return { ...this.stats };
  }

  private evictLRU(): void {
    // Find least recently used entry
    let lruKey: string | null = null;
    let lruTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < lruTime) {
        lruTime = entry.lastAccessed;
        lruKey = key;
      }
    }

    if (lruKey) {
      this.cache.delete(lruKey);
    }
  }

  private updateStats(): void {
    this.stats.size = this.cache.size;
    this.stats.memoryUsage = this.estimateMemoryUsage();
  }

  private estimateMemoryUsage(): number {
    let totalSize = 0;
    for (const [key, entry] of this.cache.entries()) {
      totalSize += key.length * 2; // UTF-16 characters
      totalSize += JSON.stringify(entry.value).length * 2;
      totalSize += 100; // Overhead for entry structure
    }
    return totalSize;
  }
}

// Database-backed cache for persistence
class DatabaseCache {
  async get<T>(key: string): Promise<T | null> {
    try {
      const cacheEntry = await prisma.cacheEntry.findUnique({
        where: { key },
      });

      if (!cacheEntry) return null;

      // Check if expired
      if (Date.now() > cacheEntry.expiresAt.getTime()) {
        await this.delete(key);
        return null;
      }

      // Update access count
      await prisma.cacheEntry.update({
        where: { key },
        data: {
          accessCount: cacheEntry.accessCount + 1,
          lastAccessed: new Date(),
        },
      });

      return JSON.parse(cacheEntry.value);
    } catch (error) {
      console.error('Database cache get error:', error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl: number = 300000): Promise<void> {
    try {
      const expiresAt = new Date(Date.now() + ttl);
      const serializedValue = JSON.stringify(value);

      await prisma.cacheEntry.upsert({
        where: { key },
        update: {
          value: serializedValue,
          expiresAt,
          accessCount: { increment: 1 },
          lastAccessed: new Date(),
        },
        create: {
          key,
          value: serializedValue,
          expiresAt,
          accessCount: 1,
          lastAccessed: new Date(),
        },
      });
    } catch (error) {
      console.error('Database cache set error:', error);
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      await prisma.cacheEntry.delete({
        where: { key },
      });
      return true;
    } catch (error) {
      console.error('Database cache delete error:', error);
      return false;
    }
  }

  async clear(): Promise<void> {
    try {
      await prisma.cacheEntry.deleteMany({});
    } catch (error) {
      console.error('Database cache clear error:', error);
    }
  }

  async has(key: string): Promise<boolean> {
    try {
      const entry = await prisma.cacheEntry.findUnique({
        where: { key },
        select: { expiresAt: true },
      });

      if (!entry) return false;
      return Date.now() <= entry.expiresAt.getTime();
    } catch (error) {
      console.error('Database cache has error:', error);
      return false;
    }
  }
}

// Hybrid cache that uses memory for hot data and database for persistence
class HybridCache {
  private memoryCache = new MemoryCache();
  // Temporarily disable database cache until CacheEntry model is added to schema
  // private dbCache = new DatabaseCache();

  async get<T>(key: string): Promise<T | null> {
    // Try memory cache first
    let value = await this.memoryCache.get<T>(key);
    if (value !== null) {
      return value;
    }

    // Database cache disabled until CacheEntry model is added
    // value = await this.dbCache.get<T>(key);
    // if (value !== null) {
    //   // Store in memory cache for faster future access
    //   await this.memoryCache.set(key, value, 60000); // 1 minute TTL in memory
    //   return value;
    // }

    return null;
  }

  async set<T>(key: string, value: T, ttl: number = 300000): Promise<void> {
    // Store in memory cache only for now
    await this.memoryCache.set(key, value, Math.min(ttl, 60000)); // Max 1 minute in memory
    // Database cache disabled until CacheEntry model is added
    // await this.dbCache.set(key, value, ttl);
  }

  async delete(key: string): Promise<boolean> {
    const memoryResult = await this.memoryCache.delete(key);
    // Database cache disabled until CacheEntry model is added
    // const dbResult = await this.dbCache.delete(key);
    return memoryResult; // || dbResult;
  }

  async clear(): Promise<void> {
    await this.memoryCache.clear();
    // Database cache disabled until CacheEntry model is added
    // await this.dbCache.clear();
  }

  async has(key: string): Promise<boolean> {
    return await this.memoryCache.has(key); // || await this.dbCache.has(key);
  }

  getStats() {
    return this.memoryCache.getStats();
  }
}

// Cache decorator for automatic caching
export function cacheDecorator(ttl: number = 300000, keyGenerator?: (args: any[]) => string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    const cacheInstance = new HybridCache();

    descriptor.value = async function (...args: any[]) {
      const cacheKey = keyGenerator 
        ? keyGenerator(args)
        : `${target.constructor.name}:${propertyName}:${JSON.stringify(args)}`;

      // Try to get from cache
      let result = await cacheInstance.get(cacheKey);
      if (result !== null) {
        return result;
      }

      // Execute method and cache result
      result = await method.apply(this, args);
      await cacheInstance.set(cacheKey, result, ttl);
      
      return result;
    };
  };
}

// Cache utilities
export const cacheUtils = {
  // Generate cache key from function name and arguments
  generateKey: (functionName: string, args: any[]): string => {
    return `${functionName}:${JSON.stringify(args)}`;
  },

  // Cache with automatic key generation
  cache: <T>(fn: (...args: any[]) => Promise<T>, ttl: number = 300000) => {
    const cacheInstance = new HybridCache();
    
    return async (...args: any[]): Promise<T> => {
      const key = cacheUtils.generateKey(fn.name, args);
      
      let result = await cacheInstance.get<T>(key);
      if (result !== null) {
        return result;
      }

      result = await fn(...args);
      await cacheInstance.set(key, result, ttl);
      
      return result;
    };
  },

  // Batch cache operations
  batchGet: async <T>(keys: string[], cacheInstance: HybridCache): Promise<(T | null)[]> => {
    return Promise.all(keys.map(key => cacheInstance.get<T>(key)));
  },

  batchSet: async <T>(entries: Array<{ key: string; value: T; ttl?: number }>, cacheInstance: HybridCache): Promise<void> => {
    await Promise.all(entries.map(({ key, value, ttl }) => cacheInstance.set(key, value, ttl)));
  },
};

// Export cache instances
export const memoryCache = new MemoryCache();
export const databaseCache = new DatabaseCache();
export const hybridCache = new HybridCache();

// Default cache instance
export const defaultCache = hybridCache; 