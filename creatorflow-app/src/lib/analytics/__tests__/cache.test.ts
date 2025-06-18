import { AnalyticsCache } from '../cache';
import { redis } from '../../redis';
import '@jest/globals';

// Mock Redis
jest.mock('../../redis', () => ({
  redis: {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    keys: jest.fn(),
    expire: jest.fn(),
    hincrby: jest.fn(),
    hgetall: jest.fn(),
  },
}));

describe('AnalyticsCache', () => {
  let cache: AnalyticsCache;
  const mockUserId = 'test-user';
  const mockEndpoint = 'test-endpoint';
  const mockParams = { param1: 'value1' };
  const mockData = {
    data: { result: 'test' },
    timestamp: Date.now(),
  };

  beforeEach(() => {
    cache = AnalyticsCache.getInstance();
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return cached data from Redis', async () => {
      (redis.get as jest.Mock).mockResolvedValue(mockData);
      
      const result = await cache.get(mockUserId, mockEndpoint, mockParams);
      
      expect(result).toEqual(mockData);
      expect(redis.get).toHaveBeenCalledWith(
        `cache:${mockUserId}:${mockEndpoint}:${JSON.stringify(mockParams)}`
      );
    });

    it('should return null when no cache exists', async () => {
      (redis.get as jest.Mock).mockResolvedValue(null);
      
      const result = await cache.get(mockUserId, mockEndpoint, mockParams);
      
      expect(result).toBeNull();
    });

    it('should handle Redis errors', async () => {
      (redis.get as jest.Mock).mockRejectedValue(new Error('Redis error'));
      
      const result = await cache.get(mockUserId, mockEndpoint, mockParams);
      
      expect(result).toBeNull();
    });
  });

  describe('set', () => {
    it('should cache data in Redis', async () => {
      await cache.set(mockUserId, mockEndpoint, mockParams, mockData);
      
      expect(redis.set).toHaveBeenCalledWith(
        `cache:${mockUserId}:${mockEndpoint}:${JSON.stringify(mockParams)}`,
        mockData
      );
      expect(redis.expire).toHaveBeenCalled();
    });

    it('should handle Redis errors', async () => {
      (redis.set as jest.Mock).mockRejectedValue(new Error('Redis error'));
      
      await cache.set(mockUserId, mockEndpoint, mockParams, mockData);
      
      // Should not throw
    });
  });

  describe('invalidate', () => {
    it('should invalidate specific cache', async () => {
      await cache.invalidate(mockUserId, mockEndpoint);
      
      expect(redis.del).toHaveBeenCalledWith(
        `cache:${mockUserId}:${mockEndpoint}:*`
      );
    });

    it('should handle Redis errors', async () => {
      (redis.del as jest.Mock).mockRejectedValue(new Error('Redis error'));
      
      await cache.invalidate(mockUserId, mockEndpoint);
      
      // Should not throw
    });
  });

  describe('clear', () => {
    it('should clear all caches', async () => {
      (redis.keys as jest.Mock).mockResolvedValue(['test-key']);
      
      await cache.clear();
      
      expect(redis.del).toHaveBeenCalledWith('test-key');
    });

    it('should handle Redis errors', async () => {
      (redis.keys as jest.Mock).mockRejectedValue(new Error('Redis error'));
      
      await cache.clear();
      
      // Should not throw
    });
  });
}); 