// Request caching and deduplication utilities

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface PendingRequest<T> {
  promise: Promise<T>;
  timestamp: number;
}

class RequestCache {
  private cache = new Map<string, CacheEntry<any>>();
  private pendingRequests = new Map<string, PendingRequest<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  // Generate cache key from URL and options
  private generateKey(url: string, options?: RequestInit): string {
    const method = options?.method || 'GET';
    const body = options?.body ? JSON.stringify(options.body) : '';
    return `${method}:${url}:${body}`;
  }

  // Check if cache entry is still valid
  private isCacheValid(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp < entry.ttl;
  }

  // Get cached data
  get<T>(url: string, options?: RequestInit): T | null {
    const key = this.generateKey(url, options);
    const entry = this.cache.get(key);
    
    if (entry && this.isCacheValid(entry)) {
      return entry.data;
    }
    
    if (entry) {
      this.cache.delete(key);
    }
    
    return null;
  }

  // Set cached data
  set<T>(url: string, data: T, ttl?: number, options?: RequestInit): void {
    const key = this.generateKey(url, options);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    });
  }

  // Clear cache
  clear(): void {
    this.cache.clear();
  }

  // Clear expired entries
  clearExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (!this.isCacheValid(entry)) {
        this.cache.delete(key);
      }
    }
  }

  // Get cache size
  size(): number {
    return this.cache.size;
  }

  // Check if request is pending
  isPending(url: string, options?: RequestInit): boolean {
    const key = this.generateKey(url, options);
    return this.pendingRequests.has(key);
  }

  // Add pending request
  addPending<T>(url: string, promise: Promise<T>, options?: RequestInit): void {
    const key = this.generateKey(url, options);
    this.pendingRequests.set(key, {
      promise,
      timestamp: Date.now(),
    });
  }

  // Get pending request
  getPending<T>(url: string, options?: RequestInit): Promise<T> | null {
    const key = this.generateKey(url, options);
    const pending = this.pendingRequests.get(key);
    
    if (pending) {
      // Clean up old pending requests (older than 30 seconds)
      if (Date.now() - pending.timestamp > 30000) {
        this.pendingRequests.delete(key);
        return null;
      }
      return pending.promise;
    }
    
    return null;
  }

  // Remove pending request
  removePending(url: string, options?: RequestInit): void {
    const key = this.generateKey(url, options);
    this.pendingRequests.delete(key);
  }
}

// Global cache instance
const requestCache = new RequestCache();

// Enhanced fetch with caching and deduplication
export async function cachedFetch<T>(
  url: string,
  options?: RequestInit,
  ttl?: number
): Promise<T> {
  // Check cache first
  const cached = requestCache.get<T>(url, options);
  if (cached) {
    return cached;
  }

  // Check if request is already pending
  const pending = requestCache.getPending<T>(url, options);
  if (pending) {
    return pending;
  }

  // Make the request
  const promise = fetch(url, options)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Cache the result
      requestCache.set(url, data, ttl, options);
      // Remove from pending
      requestCache.removePending(url, options);
      return data;
    })
    .catch(error => {
      // Remove from pending on error
      requestCache.removePending(url, options);
      throw error;
    });

  // Add to pending requests
  requestCache.addPending(url, promise, options);

  return promise;
}

// Batch multiple requests
export async function batchFetch<T>(
  requests: Array<{ url: string; options?: RequestInit; ttl?: number }>
): Promise<T[]> {
  const promises = requests.map(({ url, options, ttl }) =>
    cachedFetch<T>(url, options, ttl)
  );
  
  return Promise.all(promises);
}

// Prefetch data
export function prefetch<T>(
  url: string,
  options?: RequestInit,
  ttl?: number
): void {
  cachedFetch<T>(url, options, ttl).catch(console.error);
}

// Clear cache utilities
export function clearCache(): void {
  requestCache.clear();
}

export function clearExpiredCache(): void {
  requestCache.clearExpired();
}

export function getCacheSize(): number {
  return requestCache.size();
}

// Cache statistics
export function getCacheStats() {
  return {
    size: requestCache.size(),
    pendingRequests: requestCache.pendingRequests.size,
  };
}

// Optimized API client
export class OptimizedAPIClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;

  constructor(baseURL: string, defaultHeaders?: HeadersInit) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders,
    };
  }

  async get<T>(endpoint: string, ttl?: number): Promise<T> {
    return cachedFetch<T>(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: this.defaultHeaders,
    }, ttl);
  }

  async post<T>(endpoint: string, data: any, ttl?: number): Promise<T> {
    return cachedFetch<T>(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.defaultHeaders,
      body: JSON.stringify(data),
    }, ttl);
  }

  async put<T>(endpoint: string, data: any, ttl?: number): Promise<T> {
    return cachedFetch<T>(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.defaultHeaders,
      body: JSON.stringify(data),
    }, ttl);
  }

  async delete<T>(endpoint: string, ttl?: number): Promise<T> {
    return cachedFetch<T>(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.defaultHeaders,
    }, ttl);
  }

  // Batch operations
  async batchGet<T>(endpoints: string[], ttl?: number): Promise<T[]> {
    const requests = endpoints.map(endpoint => ({
      url: `${this.baseURL}${endpoint}`,
      options: {
        method: 'GET',
        headers: this.defaultHeaders,
      },
      ttl,
    }));
    
    return batchFetch<T>(requests);
  }
}

// Create default API client instance
export const apiClient = new OptimizedAPIClient('/api'); 