import { RateLimiter } from '../rateLimit';
import { redis } from '../../redis';
import '@jest/globals';

// Mock Redis
jest.mock('../../redis', () => ({
  redis: {
    zrange: jest.fn(),
    zremrangebyscore: jest.fn(),
    zadd: jest.fn(),
    expire: jest.fn(),
    hincrby: jest.fn(),
    hgetall: jest.fn(),
  },
}));

describe('RateLimiter', () => {
  let rateLimiter: RateLimiter;
  const mockUserId = 'test-user';
  const mockEndpoint = 'test-endpoint';
  const mockConfig = {
    maxRequests: 100,
    windowMs: 60000, // 1 minute
  };

  beforeEach(() => {
    rateLimiter = RateLimiter.getInstance();
    rateLimiter.setConfig(mockConfig);
    jest.clearAllMocks();
    // Mock successful Redis operations
    (redis.hincrby as jest.Mock).mockResolvedValue(1);
    (redis.hgetall as jest.Mock).mockResolvedValue({
      totalRequests: '100',
      blockedRequests: '10',
      totalResponseTime: '1000',
      errorCount: '1'
    });
  });

  describe('checkLimit', () => {
    it('should allow request within rate limit', async () => {
      const now = Date.now();
      (redis.zrange as jest.Mock).mockResolvedValue([now - 1000, now - 2000]); // 2 requests in window
      (redis.zadd as jest.Mock).mockResolvedValue(1);
      (redis.expire as jest.Mock).mockResolvedValue(1);
      
      const result = await rateLimiter.checkLimit(mockUserId, mockEndpoint);
      
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(98); // maxRequests - 2
      expect(result.reset).toBeGreaterThan(now);
      expect(redis.zrange).toHaveBeenCalled();
      expect(redis.zadd).toHaveBeenCalled();
      expect(redis.expire).toHaveBeenCalled();
      expect(redis.hincrby).toHaveBeenCalled();
    });

    it('should block request exceeding rate limit', async () => {
      const now = Date.now();
      const requests = Array(101).fill(0).map((_, i) => now - i * 1000); // 101 requests in window
      (redis.zrange as jest.Mock).mockResolvedValue(requests);
      (redis.zadd as jest.Mock).mockResolvedValue(1);
      (redis.expire as jest.Mock).mockResolvedValue(1);
      
      const result = await rateLimiter.checkLimit(mockUserId, mockEndpoint);
      
      expect(result.success).toBe(false);
      expect(result.remaining).toBe(0);
      expect(result.reset).toBeGreaterThan(now);
      expect(redis.zrange).toHaveBeenCalled();
      expect(redis.zadd).toHaveBeenCalled();
      expect(redis.expire).toHaveBeenCalled();
      expect(redis.hincrby).toHaveBeenCalled();
    });

    it('should handle Redis errors', async () => {
      (redis.zrange as jest.Mock).mockRejectedValue(new Error('Redis error'));
      
      const result = await rateLimiter.checkLimit(mockUserId, mockEndpoint);
      
      expect(result.success).toBe(true); // Fail open
      expect(result.remaining).toBe(mockConfig.maxRequests); // Default remaining when Redis fails
      expect(result.reset).toBeGreaterThan(Date.now());
    });
  });

  describe('handleRateLimit', () => {
    it('should return 429 response when rate limit exceeded', async () => {
      const now = Date.now();
      const requests = Array(101).fill(0).map((_, i) => now - i * 1000); // 101 requests in window
      (redis.zrange as jest.Mock).mockResolvedValue(requests);
      (redis.zadd as jest.Mock).mockResolvedValue(1);
      (redis.expire as jest.Mock).mockResolvedValue(1);
      
      const response = await rateLimiter.handleRateLimit(mockUserId, mockEndpoint);
      
      expect(response).not.toBeNull();
      expect(response?.status).toBe(429);
      expect(response?.headers.get('X-RateLimit-Limit')).toBe(mockConfig.maxRequests.toString());
      expect(response?.headers.get('X-RateLimit-Remaining')).toBe('0');
      expect(response?.headers.get('Retry-After')).toBeDefined();
      expect(redis.hincrby).toHaveBeenCalled();
    });

    it('should return null when within rate limit', async () => {
      const now = Date.now();
      (redis.zrange as jest.Mock).mockResolvedValue([now - 1000, now - 2000]); // 2 requests in window
      (redis.zadd as jest.Mock).mockResolvedValue(1);
      (redis.expire as jest.Mock).mockResolvedValue(1);
      
      const response = await rateLimiter.handleRateLimit(mockUserId, mockEndpoint);
      
      expect(response).toBeNull();
      expect(redis.hincrby).toHaveBeenCalled();
    });
  });
}); 