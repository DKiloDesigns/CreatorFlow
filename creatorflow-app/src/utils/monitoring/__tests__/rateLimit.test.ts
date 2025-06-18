import { metrics } from '../metrics';
import { rateLimitMetrics, monitorRateLimitOperation, recordRateLimitRequest, recordRateLimitBlocked } from '../rateLimit';
import { MetricValue } from 'prom-client';

describe('Rate Limit Monitoring', () => {
  beforeEach(() => {
    // Reset metrics before each test
    metrics['registry'].clear();
  });

  it('should record rate limit requests', async () => {
    recordRateLimitRequest({ endpoint: '/api/test' });
    const metrics = await rateLimitMetrics.requests.get();
    const value = metrics.values.find((v: MetricValue<string>) => v.labels.endpoint === '/api/test');
    expect(value).not.toBeUndefined();
    expect(value?.value).toBe(1);
  });

  it('should record blocked requests', async () => {
    recordRateLimitBlocked({ endpoint: '/api/test' });
    const metrics = await rateLimitMetrics.blocked.get();
    const value = metrics.values.find((v: MetricValue<string>) => v.labels.endpoint === '/api/test');
    expect(value).not.toBeUndefined();
    expect(value?.value).toBe(1);
  });

  it('should monitor rate limit operations', async () => {
    const operation = async () => ({ allowed: true });
    const result = await monitorRateLimitOperation(operation, 'check_rate_limit', { endpoint: '/api/test' });
    expect(result).toEqual({ allowed: true });
    const latencyMetrics = await rateLimitMetrics.latency.get();
    const value = latencyMetrics.values.find((v: MetricValue<string>) => v.labels.operation === 'check_rate_limit' && v.labels.endpoint === '/api/test');
    expect(value).not.toBeUndefined();
  });

  it('should record errors in failed operations', async () => {
    const operation = async () => {
      throw new Error('Rate limit check failed');
    };
    await expect(monitorRateLimitOperation(operation, 'check_rate_limit', { endpoint: '/api/test' }))
      .rejects.toThrow('Rate limit check failed');
    const errorMetrics = await rateLimitMetrics.errors.get();
    const value = errorMetrics.values.find((v: MetricValue<string>) => v.labels.operation === 'check_rate_limit' && v.labels.endpoint === '/api/test');
    expect(value).not.toBeUndefined();
    expect(value?.value).toBe(1);
  });
}); 