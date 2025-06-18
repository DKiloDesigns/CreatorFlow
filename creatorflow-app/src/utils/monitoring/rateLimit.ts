import { metrics } from './metrics';
import { logger } from './logger';

const rateLimitLabelNames = ['operation', 'endpoint'];

export const rateLimitMetrics = {
  requests: metrics.counter('rate_limit_requests_total', 'Total number of rate limit requests', ['endpoint']),
  blocked: metrics.counter('rate_limit_blocked_total', 'Total number of blocked requests', ['endpoint']),
  errors: metrics.counter('rate_limit_errors_total', 'Total number of rate limit errors', ['operation', 'endpoint']),
  latency: metrics.histogram('rate_limit_operation_duration_seconds', 'Rate limit operation latency in seconds', ['operation', 'endpoint']),
};

export const monitorRateLimitOperation = async <T>(
  operation: () => Promise<T>,
  operationName: string,
  tags: Record<string, string> = {}
): Promise<T> => {
  const startTime = Date.now();
  try {
    const result = await operation();
    const duration = (Date.now() - startTime) / 1000;
    rateLimitMetrics.latency.observe({ operation: operationName, ...tags }, duration);
    return result;
  } catch (error) {
    rateLimitMetrics.errors.inc({ operation: operationName, ...tags });
    logger.error('Rate limit operation failed', {
      operation: operationName,
      error,
      tags,
    });
    throw error;
  }
};

export const recordRateLimitRequest = (tags: Record<string, string> = {}) => {
  rateLimitMetrics.requests.inc(tags);
};

export const recordRateLimitBlocked = (tags: Record<string, string> = {}) => {
  rateLimitMetrics.blocked.inc(tags);
}; 