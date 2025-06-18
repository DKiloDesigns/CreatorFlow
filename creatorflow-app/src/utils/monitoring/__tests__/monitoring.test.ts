import { metrics } from '../metrics';
import { cacheMetrics, monitorCacheOperation, recordCacheHit, recordCacheMiss } from '../cache';
import { MetricValue } from 'prom-client';

describe('Monitoring Utilities', () => {
  beforeEach(() => {
    // Reset metrics before each test
    metrics['registry'].clear();
  });

  describe('Cache Monitoring', () => {
    it('should record cache hits', async () => {
      recordCacheHit({ type: 'test' });
      const metrics = await cacheMetrics.hits.get();
      const value = metrics.values.find((v: MetricValue<string>) => v.labels.type === 'test');
      expect(value).not.toBeUndefined();
      expect(value?.value).toBe(1);
    });

    it('should record cache misses', async () => {
      recordCacheMiss({ type: 'test' });
      const metrics = await cacheMetrics.misses.get();
      const value = metrics.values.find((v: MetricValue<string>) => v.labels.type === 'test');
      expect(value).not.toBeUndefined();
      expect(value?.value).toBe(1);
    });

    it('should monitor cache operations', async () => {
      const operation = async () => 'test';
      const result = await monitorCacheOperation(operation, 'test_operation', { type: 'test' });
      expect(result).toBe('test');
      const latencyMetrics = await cacheMetrics.latency.get();
      const value = latencyMetrics.values.find((v: MetricValue<string>) => v.labels.operation === 'test_operation' && v.labels.type === 'test');
      expect(value).not.toBeUndefined();
    });

    it('should record errors in failed operations', async () => {
      const operation = async () => {
        throw new Error('Test error');
      };
      await expect(monitorCacheOperation(operation, 'test_operation', { type: 'test' }))
        .rejects.toThrow('Test error');
      const errorMetrics = await cacheMetrics.errors.get();
      const value = errorMetrics.values.find((v: MetricValue<string>) => v.labels.operation === 'test_operation' && v.labels.type === 'test');
      expect(value).not.toBeUndefined();
      expect(value?.value).toBe(1);
    });
  });
}); 