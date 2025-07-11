import { monitoring } from '@/lib/monitoring';

export interface CacheEntry<T = any> {
  key: string;
  value: T | string;
  ttl: number; // seconds
  createdAt: Date;
  lastAccessed: Date;
  accessCount: number;
  tags: string[];
  priority: 'high' | 'medium' | 'low';
}

export interface CacheConfig {
  defaultTTL: number;
  maxSize: number;
  enableCompression: boolean;
  enableCDN: boolean;
  cdnEndpoint?: string;
  warmupEnabled: boolean;
  invalidationStrategy: 'lru' | 'ttl' | 'hybrid';
}

export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  hitRate: number;
  avgResponseTime: number;
  evictions: number;
  warmupSuccess: number;
  warmupFailures: number;
}

class AdvancedCache {
  private static instance: AdvancedCache;
  private cache: Map<string, CacheEntry> = new Map();
  private config: CacheConfig;
  private stats: CacheStats;
  private warmupQueue: string[] = [];
  private invalidationQueue: string[] = [];

  constructor() {
    this.config = {
      defaultTTL: 3600, // 1 hour
      maxSize: 1000,
      enableCompression: true,
      enableCDN: false,
      warmupEnabled: true,
      invalidationStrategy: 'hybrid',
    };

    this.stats = {
      hits: 0,
      misses: 0,
      size: 0,
      hitRate: 0,
      avgResponseTime: 0,
      evictions: 0,
      warmupSuccess: 0,
      warmupFailures: 0,
    };

    this.startMaintenance();
  }

  static getInstance(): AdvancedCache {
    if (!AdvancedCache.instance) {
      AdvancedCache.instance = new AdvancedCache();
    }
    return AdvancedCache.instance;
  }

  // Set cache configuration
  configure(config: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...config };
    monitoring.info('Cache configuration updated', { config: this.config });
  }

  // Set a cache entry
  async set<T>(
    key: string,
    value: T,
    options?: {
      ttl?: number;
      tags?: string[];
      priority?: CacheEntry['priority'];
      compress?: boolean;
    }
  ): Promise<void> {
    const startTime = Date.now();

    try {
      // Check if we need to evict entries
      if (this.cache.size >= this.config.maxSize) {
        await this.evictEntries();
      }

      const entry: CacheEntry<T> = {
        key,
        value: options?.compress && this.config.enableCompression 
          ? await this.compress(value) 
          : value,
        ttl: options?.ttl || this.config.defaultTTL,
        createdAt: new Date(),
        lastAccessed: new Date(),
        accessCount: 0,
        tags: options?.tags || [],
        priority: options?.priority || 'medium',
      };

      this.cache.set(key, entry);
      this.stats.size = this.cache.size;

      // Update CDN if enabled
      if (this.config.enableCDN) {
        await this.updateCDN(key, value);
      }

      const responseTime = Date.now() - startTime;
      this.updateResponseTimeStats(responseTime);

      monitoring.info('Cache entry set', {
        key,
        ttl: entry.ttl,
        tags: entry.tags,
        priority: entry.priority,
        responseTime,
      });
    } catch (error) {
      monitoring.error('Failed to set cache entry', {
        key,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  // Get a cache entry
  async get<T>(key: string): Promise<T | string | null> {
    const startTime = Date.now();

    try {
      const entry = this.cache.get(key) as CacheEntry<T> | undefined;

      if (!entry) {
        this.stats.misses++;
        this.updateHitRate();
        return null;
      }

      // Check if entry has expired
      if (this.isExpired(entry)) {
        this.cache.delete(key);
        this.stats.misses++;
        this.updateHitRate();
        return null;
      }

      // Update access statistics
      entry.lastAccessed = new Date();
      entry.accessCount++;
      this.stats.hits++;
      this.updateHitRate();

      const responseTime = Date.now() - startTime;
      this.updateResponseTimeStats(responseTime);

      // Decompress if needed
      const value = entry.value;
      if (this.config.enableCompression && typeof value === 'string') {
        return await this.decompress(value) as T;
      }

      return value;
    } catch (error) {
      monitoring.error('Failed to get cache entry', {
        key,
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  }

  // Delete a cache entry
  async delete(key: string): Promise<boolean> {
    try {
      const deleted = this.cache.delete(key);
      if (deleted) {
        this.stats.size = this.cache.size;

        // Remove from CDN if enabled
        if (this.config.enableCDN) {
          await this.removeFromCDN(key);
        }

        monitoring.info('Cache entry deleted', { key });
      }

      return deleted;
    } catch (error) {
      monitoring.error('Failed to delete cache entry', {
        key,
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }

  // Invalidate cache entries by tags
  async invalidateByTags(tags: string[]): Promise<number> {
    try {
      let invalidatedCount = 0;

      for (const [key, entry] of this.cache.entries()) {
        if (tags.some(tag => entry.tags.includes(tag))) {
          this.cache.delete(key);
          invalidatedCount++;
        }
      }

      this.stats.size = this.cache.size;

      monitoring.info('Cache entries invalidated by tags', {
        tags,
        invalidatedCount,
      });

      return invalidatedCount;
    } catch (error) {
      monitoring.error('Failed to invalidate cache by tags', {
        tags,
        error: error instanceof Error ? error.message : String(error),
      });
      return 0;
    }
  }

  // Warm up cache with frequently accessed data
  async warmup(keys: string[], dataProvider: (key: string) => Promise<any>): Promise<void> {
    if (!this.config.warmupEnabled) return;

    monitoring.info('Starting cache warmup', { keyCount: keys.length });

    const warmupPromises = keys.map(async (key) => {
      try {
        const value = await dataProvider(key);
        await this.set(key, value, { priority: 'high' });
        this.stats.warmupSuccess++;
      } catch (error) {
        this.stats.warmupFailures++;
        monitoring.error('Cache warmup failed for key', {
          key,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    });

    await Promise.allSettled(warmupPromises);

    monitoring.info('Cache warmup completed', {
      success: this.stats.warmupSuccess,
      failures: this.stats.warmupFailures,
    });
  }

  // Get cache statistics
  getStats(): CacheStats {
    return { ...this.stats };
  }

  // Clear all cache entries
  async clear(): Promise<void> {
    try {
      const size = this.cache.size;
      this.cache.clear();
      this.stats.size = 0;

      // Clear CDN if enabled
      if (this.config.enableCDN) {
        await this.clearCDN();
      }

      monitoring.info('Cache cleared', { previousSize: size });
    } catch (error) {
      monitoring.error('Failed to clear cache', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // Get cache entries by pattern
  async getByPattern(pattern: string): Promise<CacheEntry[]> {
    const regex = new RegExp(pattern);
    const entries: CacheEntry[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (regex.test(key)) {
        entries.push(entry);
      }
    }

    return entries;
  }

  // Preload cache with data
  async preload(data: Array<{ key: string; value: any; ttl?: number }>): Promise<void> {
    monitoring.info('Starting cache preload', { entryCount: data.length });

    const preloadPromises = data.map(async ({ key, value, ttl }) => {
      try {
        await this.set(key, value, { ttl });
      } catch (error) {
        monitoring.error('Failed to preload cache entry', {
          key,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    });

    await Promise.allSettled(preloadPromises);

    monitoring.info('Cache preload completed');
  }

  private isExpired(entry: CacheEntry): boolean {
    const now = new Date();
    const expirationTime = new Date(entry.createdAt.getTime() + entry.ttl * 1000);
    return now > expirationTime;
  }

  private async evictEntries(): Promise<void> {
    const entries = Array.from(this.cache.entries());
    let evictedCount = 0;

    switch (this.config.invalidationStrategy) {
      case 'lru':
        // Evict least recently used entries
        entries.sort((a, b) => a[1].lastAccessed.getTime() - b[1].lastAccessed.getTime());
        break;
      case 'ttl':
        // Evict expired entries first, then by TTL
        entries.sort((a, b) => {
          if (this.isExpired(a[1]) && !this.isExpired(b[1])) return -1;
          if (!this.isExpired(a[1]) && this.isExpired(b[1])) return 1;
          return a[1].ttl - b[1].ttl;
        });
        break;
      case 'hybrid':
        // Combine LRU and priority
        entries.sort((a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          const aScore = priorityOrder[a[1].priority] * a[1].accessCount;
          const bScore = priorityOrder[b[1].priority] * b[1].accessCount;
          return aScore - bScore;
        });
        break;
    }

    // Evict entries until we're under the limit
    const targetSize = Math.floor(this.config.maxSize * 0.8); // Keep 80% capacity
    for (const [key] of entries) {
      if (this.cache.size <= targetSize) break;
      
      this.cache.delete(key);
      evictedCount++;
    }

    this.stats.evictions += evictedCount;
    this.stats.size = this.cache.size;

    if (evictedCount > 0) {
      monitoring.info('Cache entries evicted', { evictedCount });
    }
  }

  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;
  }

  private updateResponseTimeStats(responseTime: number): void {
    const totalRequests = this.stats.hits + this.stats.misses;
    this.stats.avgResponseTime = totalRequests > 0 
      ? (this.stats.avgResponseTime * (totalRequests - 1) + responseTime) / totalRequests
      : responseTime;
  }

  private async compress(data: any): Promise<string> {
    // Simple compression - in production, use a proper compression library
    return JSON.stringify(data);
  }

  private async decompress(data: string): Promise<any> {
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  }

  private async updateCDN(key: string, value: any): Promise<void> {
    if (!this.config.cdnEndpoint) return;

    try {
      // Implementation would integrate with CDN API
      monitoring.info('CDN updated', { key });
    } catch (error) {
      monitoring.error('Failed to update CDN', {
        key,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  private async removeFromCDN(key: string): Promise<void> {
    if (!this.config.cdnEndpoint) return;

    try {
      // Implementation would integrate with CDN API
      monitoring.info('CDN entry removed', { key });
    } catch (error) {
      monitoring.error('Failed to remove from CDN', {
        key,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  private async clearCDN(): Promise<void> {
    if (!this.config.cdnEndpoint) return;

    try {
      // Implementation would integrate with CDN API
      monitoring.info('CDN cleared');
    } catch (error) {
      monitoring.error('Failed to clear CDN', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  private startMaintenance(): void {
    // Run maintenance every 5 minutes
    setInterval(() => {
      this.performMaintenance();
    }, 5 * 60 * 1000);
  }

  private async performMaintenance(): Promise<void> {
    try {
      // Clean up expired entries
      let expiredCount = 0;
      for (const [key, entry] of this.cache.entries()) {
        if (this.isExpired(entry)) {
          this.cache.delete(key);
          expiredCount++;
        }
      }

      if (expiredCount > 0) {
        this.stats.size = this.cache.size;
        monitoring.info('Cache maintenance completed', { expiredCount });
      }

      // Log statistics periodically
      monitoring.info('Cache statistics', {
        size: this.stats.size,
        hitRate: this.stats.hitRate.toFixed(2),
        avgResponseTime: this.stats.avgResponseTime.toFixed(2),
      });
    } catch (error) {
      monitoring.error('Cache maintenance failed', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

export const advancedCache = AdvancedCache.getInstance(); 