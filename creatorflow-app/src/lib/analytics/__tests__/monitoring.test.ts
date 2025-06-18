import { AnalyticsMonitoring } from '../monitoring';
import { redis } from '../../redis';
import '@jest/globals';

// Mock Redis
jest.mock('../../redis', () => ({
  redis: {
    hincrby: jest.fn().mockResolvedValue(1),
    hgetall: jest.fn().mockResolvedValue({}),
    del: jest.fn().mockResolvedValue(1),
    keys: jest.fn().mockResolvedValue([]),
    expire: jest.fn().mockResolvedValue(1),
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue('OK'),
  },
}));

describe('AnalyticsMonitoring', () => {
  let monitoring: AnalyticsMonitoring;
  const mockUserId = 'test-user';
  const mockEndpoint = 'test-endpoint';

  beforeEach(() => {
    monitoring = AnalyticsMonitoring.getInstance();
    jest.clearAllMocks();
  });

  describe('trackCacheOperation', () => {
    it('should track cache hit', async () => {
      await monitoring.trackCacheOperation(mockUserId, mockEndpoint, 'hit', 100);
      
      expect(redis.hincrby).toHaveBeenCalledWith(
        `monitoring:cache:${mockUserId}:${mockEndpoint}`,
        'hit',
        1
      );
      expect(redis.hincrby).toHaveBeenCalledWith(
        `monitoring:cache:${mockUserId}:${mockEndpoint}`,
        'totalResponseTime',
        100
      );
      expect(redis.hincrby).toHaveBeenCalledWith(
        `monitoring:cache:${mockUserId}:${mockEndpoint}`,
        'operationCount',
        1
      );
    });

    it('should track cache miss', async () => {
      await monitoring.trackCacheOperation(mockUserId, mockEndpoint, 'miss', 100);
      
      expect(redis.hincrby).toHaveBeenCalledWith(
        `monitoring:cache:${mockUserId}:${mockEndpoint}`,
        'miss',
        1
      );
      expect(redis.hincrby).toHaveBeenCalledWith(
        `monitoring:cache:${mockUserId}:${mockEndpoint}`,
        'totalResponseTime',
        100
      );
      expect(redis.hincrby).toHaveBeenCalledWith(
        `monitoring:cache:${mockUserId}:${mockEndpoint}`,
        'operationCount',
        1
      );
    });

    it('should track cache error', async () => {
      await monitoring.trackCacheOperation(mockUserId, mockEndpoint, 'error', 100);
      
      expect(redis.hincrby).toHaveBeenCalledWith(
        `monitoring:cache:${mockUserId}:${mockEndpoint}`,
        'error',
        1
      );
      expect(redis.hincrby).toHaveBeenCalledWith(
        `monitoring:cache:${mockUserId}:${mockEndpoint}`,
        'totalResponseTime',
        100
      );
      expect(redis.hincrby).toHaveBeenCalledWith(
        `monitoring:cache:${mockUserId}:${mockEndpoint}`,
        'operationCount',
        1
      );
    });
  });

  describe('trackRateLimitOperation', () => {
    it('should track successful request', async () => {
      await monitoring.trackRateLimitOperation(mockUserId, mockEndpoint, true, 100);
      
      expect(redis.hincrby).toHaveBeenCalledWith(
        `monitoring:ratelimit:${mockUserId}:${mockEndpoint}`,
        'totalRequests',
        1
      );
      expect(redis.hincrby).toHaveBeenCalledWith(
        `monitoring:ratelimit:${mockUserId}:${mockEndpoint}`,
        'totalResponseTime',
        100
      );
    });

    it('should track blocked request', async () => {
      await monitoring.trackRateLimitOperation(mockUserId, mockEndpoint, false, 100);
      
      expect(redis.hincrby).toHaveBeenCalledWith(
        `monitoring:ratelimit:${mockUserId}:${mockEndpoint}`,
        'blockedRequests',
        1
      );
      expect(redis.hincrby).toHaveBeenCalledWith(
        `monitoring:ratelimit:${mockUserId}:${mockEndpoint}`,
        'totalResponseTime',
        100
      );
    });
  });

  describe('getCacheMetrics', () => {
    it('should return cache metrics', async () => {
      const mockMetrics = {
        hit: '10',
        miss: '5',
        error: '1',
        totalResponseTime: '1000',
        operationCount: '16',
      };
      
      (redis.hgetall as jest.Mock).mockResolvedValueOnce(mockMetrics);
      
      const result = await monitoring.getCacheMetrics(mockUserId, mockEndpoint);
      
      expect(result).toEqual({
        hits: 10,
        misses: 5,
        errors: 1,
        hitRate: 0.625,
        averageResponseTime: 62.5,
        totalOperations: 16,
        invalidationCount: 0,
      });
    });

    it('should handle missing metrics', async () => {
      (redis.hgetall as jest.Mock).mockResolvedValueOnce({});
      
      const result = await monitoring.getCacheMetrics(mockUserId, mockEndpoint);
      
      expect(result).toEqual({
        hits: 0,
        misses: 0,
        errors: 0,
        hitRate: 0,
        averageResponseTime: 0,
        totalOperations: 0,
        invalidationCount: 0,
      });
    });
  });

  describe('getRateLimitMetrics', () => {
    it('should return rate limit metrics', async () => {
      const mockMetrics = {
        totalRequests: '100',
        blockedRequests: '10',
        errorCount: '1',
        totalResponseTime: '1000',
      };
      
      (redis.hgetall as jest.Mock).mockResolvedValueOnce(mockMetrics);
      
      const result = await monitoring.getRateLimitMetrics(mockUserId, mockEndpoint);
      
      expect(result).toEqual({
        totalRequests: 100,
        blockedRequests: 10,
        errorCount: 1,
        blockRate: 0.1,
        averageResponseTime: 10,
      });
    });

    it('should handle missing metrics', async () => {
      (redis.hgetall as jest.Mock).mockResolvedValueOnce({});
      
      const result = await monitoring.getRateLimitMetrics(mockUserId, mockEndpoint);
      
      expect(result).toEqual({
        totalRequests: 0,
        blockedRequests: 0,
        errorCount: 0,
        blockRate: 0,
        averageResponseTime: 0,
      });
    });
  });

  describe('clearMetrics', () => {
    it('should clear all metrics', async () => {
      (redis.keys as jest.Mock).mockResolvedValue(['test-key']);
      
      await monitoring.clearMetrics();
      
      expect(redis.del).toHaveBeenCalledWith('test-key');
    });
  });
}); 