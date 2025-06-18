import { metrics } from './metrics';
import { logger } from './logger';

const cacheLabelNames = ['operation', 'type'];

export const cacheMetrics = {
  hits: metrics.counter('cache_hits_total', 'Total number of cache hits', ['type']),
  misses: metrics.counter('cache_misses_total', 'Total number of cache misses', ['type']),
  errors: metrics.counter('cache_errors_total', 'Total number of cache errors', ['operation', 'type']),
  latency: metrics.histogram('cache_operation_duration_seconds', 'Cache operation latency in seconds', ['operation', 'type']),
};

export const monitorCacheOperation = async <T>(
  operation: () => Promise<T>,
  operationName: string,
  tags: Record<string, string> = {}
): Promise<T> => {
  const startTime = Date.now();
  try {
    const result = await operation();
    const duration = (Date.now() - startTime) / 1000;
    cacheMetrics.latency.observe({ operation: operationName, ...tags }, duration);
    return result;
  } catch (error) {
    cacheMetrics.errors.inc({ operation: operationName, ...tags });
    logger.error('Cache operation failed', {
      operation: operationName,
      error,
      tags,
    });
    throw error;
  }
};

export const recordCacheHit = (tags: Record<string, string> = {}) => {
  cacheMetrics.hits.inc(tags);
};

export const recordCacheMiss = (tags: Record<string, string> = {}) => {
  cacheMetrics.misses.inc(tags);
}; 