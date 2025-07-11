import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface LogEntry {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  userId?: string;
  action?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

export interface PerformanceMetric {
  endpoint: string;
  method: string;
  duration: number;
  statusCode: number;
  userId?: string;
  timestamp: Date;
}

export interface ErrorReport {
  error: Error;
  userId?: string;
  context?: Record<string, any>;
  timestamp: Date;
  stack?: string;
}

class MonitoringService {
  private static instance: MonitoringService;
  private logs: LogEntry[] = [];
  private metrics: PerformanceMetric[] = [];
  private errors: ErrorReport[] = [];

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  // Logging methods
  log(level: LogEntry['level'], message: string, metadata?: Record<string, any>, userId?: string) {
    const entry: LogEntry = {
      level,
      message,
      userId,
      metadata,
      timestamp: new Date(),
    };

    this.logs.push(entry);
    console.log(`[${level.toUpperCase()}] ${message}`, metadata || '');
    
    // In production, send to external logging service
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalService(entry);
    }
  }

  info(message: string, metadata?: Record<string, any>, userId?: string) {
    this.log('info', message, metadata, userId);
  }

  warn(message: string, metadata?: Record<string, any>, userId?: string) {
    this.log('warn', message, metadata, userId);
  }

  error(message: string, metadata?: Record<string, any>, userId?: string) {
    this.log('error', message, metadata, userId);
  }

  debug(message: string, metadata?: Record<string, any>, userId?: string) {
    this.log('debug', message, metadata, userId);
  }

  // Performance monitoring
  recordMetric(endpoint: string, method: string, duration: number, statusCode: number, userId?: string) {
    const metric: PerformanceMetric = {
      endpoint,
      method,
      duration,
      statusCode,
      userId,
      timestamp: new Date(),
    };

    this.metrics.push(metric);
    
    // Alert on slow requests
    if (duration > 5000) { // 5 seconds
      this.warn(`Slow API request: ${method} ${endpoint} took ${duration}ms`, { duration, statusCode }, userId);
    }
  }

  // Error tracking
  trackError(error: Error, userId?: string, context?: Record<string, any>) {
    const errorReport: ErrorReport = {
      error,
      userId,
      context,
      timestamp: new Date(),
      stack: error.stack,
    };

    this.errors.push(errorReport);
    this.error(`Application error: ${error.message}`, { 
      name: error.name, 
      stack: error.stack,
      context 
    }, userId);
  }

  // Health checks
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    checks: Record<string, boolean>;
    metrics: {
      totalLogs: number;
      totalMetrics: number;
      totalErrors: number;
      avgResponseTime: number;
    };
  }> {
    const checks = {
      database: false,
      externalServices: false,
    };

    try {
      // Database health check
      await prisma.$queryRaw`SELECT 1`;
      checks.database = true;
    } catch (error) {
      this.error('Database health check failed', { error: error instanceof Error ? error.message : String(error) });
    }

    // Calculate metrics
    const avgResponseTime = this.metrics.length > 0 
      ? this.metrics.reduce((sum, m) => sum + m.duration, 0) / this.metrics.length 
      : 0;

    const status = checks.database && checks.externalServices ? 'healthy' : 
                   checks.database || checks.externalServices ? 'degraded' : 'unhealthy';

    return {
      status,
      checks,
      metrics: {
        totalLogs: this.logs.length,
        totalMetrics: this.metrics.length,
        totalErrors: this.errors.length,
        avgResponseTime,
      },
    };
  }

  // Analytics
  getAnalytics(timeRange: '1h' | '24h' | '7d' | '30d' = '24h') {
    const now = new Date();
    const cutoff = new Date();
    
    switch (timeRange) {
      case '1h':
        cutoff.setHours(cutoff.getHours() - 1);
        break;
      case '24h':
        cutoff.setDate(cutoff.getDate() - 1);
        break;
      case '7d':
        cutoff.setDate(cutoff.getDate() - 7);
        break;
      case '30d':
        cutoff.setDate(cutoff.getDate() - 30);
        break;
    }

    const recentLogs = this.logs.filter(log => log.timestamp >= cutoff);
    const recentMetrics = this.metrics.filter(metric => metric.timestamp >= cutoff);
    const recentErrors = this.errors.filter(error => error.timestamp >= cutoff);

    return {
      logs: {
        total: recentLogs.length,
        byLevel: recentLogs.reduce((acc, log) => {
          acc[log.level] = (acc[log.level] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      },
      metrics: {
        total: recentMetrics.length,
        avgResponseTime: recentMetrics.length > 0 
          ? recentMetrics.reduce((sum, m) => sum + m.duration, 0) / recentMetrics.length 
          : 0,
        byEndpoint: recentMetrics.reduce((acc, metric) => {
          acc[metric.endpoint] = (acc[metric.endpoint] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      },
      errors: {
        total: recentErrors.length,
        byType: recentErrors.reduce((acc, error) => {
          acc[error.error.name] = (acc[error.error.name] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      },
    };
  }

  // External service integration (placeholder)
  private async sendToExternalService(entry: LogEntry) {
    // In production, send to Sentry, LogRocket, etc.
    if (process.env.SENTRY_DSN) {
      // Sentry integration
    }
    if (process.env.LOGROCKET_APP_ID) {
      // LogRocket integration
    }
  }

  // Cleanup old data
  cleanup(maxAge: number = 7 * 24 * 60 * 60 * 1000) { // 7 days default
    const cutoff = new Date(Date.now() - maxAge);
    
    this.logs = this.logs.filter(log => log.timestamp >= cutoff);
    this.metrics = this.metrics.filter(metric => metric.timestamp >= cutoff);
    this.errors = this.errors.filter(error => error.timestamp >= cutoff);
  }
}

export const monitoring = MonitoringService.getInstance();

// Performance monitoring middleware
export function withPerformanceMonitoring<T extends (...args: any[]) => any>(
  fn: T,
  endpoint: string,
  method: string = 'GET'
): T {
  return ((...args: any[]) => {
    const start = Date.now();
    const result = fn(...args);
    
    if (result instanceof Promise) {
      return result.finally(() => {
        const duration = Date.now() - start;
        monitoring.recordMetric(endpoint, method, duration, 200);
      });
    } else {
      const duration = Date.now() - start;
      monitoring.recordMetric(endpoint, method, duration, 200);
      return result;
    }
  }) as T;
} 