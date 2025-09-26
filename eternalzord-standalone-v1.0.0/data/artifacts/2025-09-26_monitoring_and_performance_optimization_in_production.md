# Monitoring and Performance Optimization in Production

**A comprehensive guide to implementing comprehensive monitoring and performance optimization strategies for Next.js applications in production, featuring real-world monitoring solutions from CreatorFlow's production environment.**

*Published: September 26, 2025*
*Author: Darrell Mayberry*
*Tags: Monitoring, Performance, Next.js, Production, APM, Observability, Optimization, Analytics*

## Introduction

Effective monitoring and performance optimization are critical for maintaining a healthy, fast, and reliable production application. In this comprehensive guide, we'll explore advanced monitoring strategies, performance optimization techniques, and observability patterns for Next.js applications, drawing from our experience optimizing CreatorFlow's production performance.

## Table of Contents

1. [Monitoring Philosophy and Strategy](#monitoring-philosophy-and-strategy)
2. [Application Performance Monitoring (APM)](#application-performance-monitoring-apm)
3. [Real-time Monitoring and Alerting](#real-time-monitoring-and-alerting)
4. [Performance Metrics and KPIs](#performance-metrics-and-kpis)
5. [Database Performance Monitoring](#database-performance-monitoring)
6. [Frontend Performance Optimization](#frontend-performance-optimization)
7. [Backend Performance Optimization](#backend-performance-optimization)
8. [Caching Strategies and Optimization](#caching-strategies-and-optimization)
9. [Error Tracking and Debugging](#error-tracking-and-debugging)
10. [Performance Testing and Load Testing](#performance-testing-and-load-testing)

## Monitoring Philosophy and Strategy

### The Three Pillars of Observability

1. **Metrics**: Quantitative data about system behavior
2. **Logs**: Detailed records of events and activities
3. **Traces**: Request flows through distributed systems

### Monitoring Strategy

- **Proactive Monitoring**: Detect issues before they impact users
- **Comprehensive Coverage**: Monitor all system components
- **Actionable Alerts**: Alerts should trigger specific actions
- **Performance Baselines**: Establish and track performance baselines
- **Continuous Improvement**: Regular review and optimization

## Application Performance Monitoring (APM)

### Sentry Integration

```typescript
// lib/monitoring/sentry.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  beforeSend(event) {
    // Filter sensitive data
    if (event.request?.cookies) {
      delete event.request.cookies;
    }
    if (event.user?.email) {
      event.user.email = event.user.email.replace(/(.{2}).*(@.*)/, '$1***$2');
    }
    return event;
  },
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app: require('express') }),
  ],
});

// Custom performance monitoring
export const performanceMonitor = {
  startTransaction(name: string, op: string) {
    return Sentry.startTransaction({ name, op });
  },
  
  addBreadcrumb(message: string, category: string, level: Sentry.SeverityLevel = 'info') {
    Sentry.addBreadcrumb({
      message,
      category,
      level,
      timestamp: Date.now() / 1000,
    });
  },
  
  setUser(user: { id: string; email: string; username?: string }) {
    Sentry.setUser(user);
  },
  
  captureException(error: Error, context?: any) {
    Sentry.withScope((scope) => {
      if (context) {
        scope.setContext('additional_info', context);
      }
      Sentry.captureException(error);
    });
  },
};

export { Sentry };
```

### Custom Performance Metrics

```typescript
// lib/monitoring/metrics.ts
import { register, Counter, Histogram, Gauge, Summary } from 'prom-client';

// HTTP Request Metrics
export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code', 'environment'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
});

export const httpRequestTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code', 'environment'],
});

export const httpRequestSize = new Histogram({
  name: 'http_request_size_bytes',
  help: 'Size of HTTP requests in bytes',
  labelNames: ['method', 'route'],
  buckets: [100, 1000, 10000, 100000, 1000000],
});

// Database Metrics
export const databaseQueryDuration = new Histogram({
  name: 'database_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation', 'table', 'status'],
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
});

export const databaseConnections = new Gauge({
  name: 'database_connections_active',
  help: 'Number of active database connections',
  labelNames: ['pool'],
});

// Business Metrics
export const userRegistrations = new Counter({
  name: 'user_registrations_total',
  help: 'Total number of user registrations',
  labelNames: ['source', 'plan'],
});

export const contentCreations = new Counter({
  name: 'content_creations_total',
  help: 'Total number of content creations',
  labelNames: ['type', 'platform'],
});

export const apiCalls = new Counter({
  name: 'api_calls_total',
  help: 'Total number of API calls',
  labelNames: ['service', 'endpoint', 'status'],
});

// WebSocket Metrics
export const websocketConnections = new Gauge({
  name: 'websocket_connections_active',
  help: 'Number of active WebSocket connections',
  labelNames: ['type'],
});

export const websocketMessages = new Counter({
  name: 'websocket_messages_total',
  help: 'Total number of WebSocket messages',
  labelNames: ['type', 'direction'],
});

// Register all metrics
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(httpRequestSize);
register.registerMetric(databaseQueryDuration);
register.registerMetric(databaseConnections);
register.registerMetric(userRegistrations);
register.registerMetric(contentCreations);
register.registerMetric(apiCalls);
register.registerMetric(websocketConnections);
register.registerMetric(websocketMessages);
```

### Performance Middleware

```typescript
// middleware/performance.ts
import { NextRequest, NextResponse } from 'next/server';
import { httpRequestDuration, httpRequestTotal } from '@/lib/monitoring/metrics';

export function performanceMiddleware(request: NextRequest) {
  const start = Date.now();
  
  return (response: NextResponse) => {
    const duration = (Date.now() - start) / 1000;
    const method = request.method;
    const route = request.nextUrl.pathname;
    const statusCode = response.status.toString();
    const environment = process.env.NODE_ENV || 'development';
    
    // Record metrics
    httpRequestDuration
      .labels(method, route, statusCode, environment)
      .observe(duration);
    
    httpRequestTotal
      .labels(method, route, statusCode, environment)
      .inc();
    
    // Add performance headers
    response.headers.set('X-Response-Time', `${duration.toFixed(3)}s`);
    response.headers.set('X-Request-ID', request.headers.get('x-request-id') || 'unknown');
    
    return response;
  };
}
```

## Real-time Monitoring and Alerting

### Grafana Dashboard Configuration

```json
{
  "dashboard": {
    "title": "CreatorFlow Production Dashboard",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{route}}"
          }
        ]
      },
      {
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          },
          {
            "expr": "histogram_quantile(0.50, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "50th percentile"
          }
        ]
      },
      {
        "title": "Error Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total{status_code=~\"5..\"}[5m])",
            "legendFormat": "5xx errors"
          }
        ]
      },
      {
        "title": "Database Connections",
        "type": "graph",
        "targets": [
          {
            "expr": "database_connections_active",
            "legendFormat": "Active connections"
          }
        ]
      },
      {
        "title": "Memory Usage",
        "type": "graph",
        "targets": [
          {
            "expr": "process_resident_memory_bytes",
            "legendFormat": "RSS Memory"
          }
        ]
      }
    ]
  }
}
```

### Alert Rules

```yaml
# alerting/rules.yml
groups:
  - name: creatorflow.rules
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status_code=~"5.."}[5m]) > 0.1
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} errors per second"

      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High response time detected"
          description: "95th percentile response time is {{ $value }}s"

      - alert: DatabaseConnectionHigh
        expr: database_connections_active > 80
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "High database connection count"
          description: "Database connections: {{ $value }}"

      - alert: MemoryUsageHigh
        expr: process_resident_memory_bytes > 1000000000
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage"
          description: "Memory usage: {{ $value }} bytes"
```

### Custom Alerting System

```typescript
// lib/monitoring/alerts.ts
import { WebhookClient } from 'discord.js';
import { createTransport } from 'nodemailer';

interface AlertConfig {
  name: string;
  condition: () => Promise<boolean>;
  severity: 'low' | 'medium' | 'high' | 'critical';
  cooldown: number; // minutes
  channels: ('email' | 'slack' | 'discord')[];
}

class AlertManager {
  private alerts: Map<string, AlertConfig> = new Map();
  private lastTriggered: Map<string, number> = new Map();
  private webhookClient: WebhookClient;
  private emailTransport: any;

  constructor() {
    this.webhookClient = new WebhookClient({
      url: process.env.DISCORD_WEBHOOK_URL!,
    });
    
    this.emailTransport = createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT!),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  registerAlert(config: AlertConfig) {
    this.alerts.set(config.name, config);
  }

  async checkAlerts() {
    for (const [name, config] of this.alerts) {
      try {
        const shouldTrigger = await config.condition();
        const lastTriggered = this.lastTriggered.get(name) || 0;
        const cooldownMs = config.cooldown * 60 * 1000;
        
        if (shouldTrigger && Date.now() - lastTriggered > cooldownMs) {
          await this.triggerAlert(name, config);
          this.lastTriggered.set(name, Date.now());
        }
      } catch (error) {
        console.error(`Error checking alert ${name}:`, error);
      }
    }
  }

  private async triggerAlert(name: string, config: AlertConfig) {
    const message = {
      title: `🚨 Alert: ${name}`,
      description: `Severity: ${config.severity}\nTime: ${new Date().toISOString()}`,
      color: this.getSeverityColor(config.severity),
    };

    for (const channel of config.channels) {
      try {
        switch (channel) {
          case 'discord':
            await this.webhookClient.send({
              embeds: [message],
            });
            break;
          case 'email':
            await this.emailTransport.sendMail({
              from: process.env.ALERT_EMAIL_FROM,
              to: process.env.ALERT_EMAIL_TO,
              subject: `Alert: ${name}`,
              html: `<h1>${message.title}</h1><p>${message.description}</p>`,
            });
            break;
        }
      } catch (error) {
        console.error(`Failed to send alert via ${channel}:`, error);
      }
    }
  }

  private getSeverityColor(severity: string): number {
    switch (severity) {
      case 'low': return 0x00ff00; // Green
      case 'medium': return 0xffff00; // Yellow
      case 'high': return 0xff8800; // Orange
      case 'critical': return 0xff0000; // Red
      default: return 0x808080; // Gray
    }
  }
}

export const alertManager = new AlertManager();

// Register alerts
alertManager.registerAlert({
  name: 'HighErrorRate',
  condition: async () => {
    // Check if error rate is above threshold
    return false; // Implement actual check
  },
  severity: 'critical',
  cooldown: 5,
  channels: ['discord', 'email'],
});

alertManager.registerAlert({
  name: 'DatabaseSlowQueries',
  condition: async () => {
    // Check for slow database queries
    return false; // Implement actual check
  },
  severity: 'high',
  cooldown: 10,
  channels: ['discord'],
});
```

## Performance Metrics and KPIs

### Core Web Vitals Monitoring

```typescript
// lib/monitoring/web-vitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export function initWebVitals() {
  if (typeof window === 'undefined') return;

  // Cumulative Layout Shift (CLS)
  getCLS((metric) => {
    console.log('CLS:', metric);
    // Send to analytics
    sendMetric('CLS', metric.value);
  });

  // First Input Delay (FID)
  getFID((metric) => {
    console.log('FID:', metric);
    sendMetric('FID', metric.value);
  });

  // First Contentful Paint (FCP)
  getFCP((metric) => {
    console.log('FCP:', metric);
    sendMetric('FCP', metric.value);
  });

  // Largest Contentful Paint (LCP)
  getLCP((metric) => {
    console.log('LCP:', metric);
    sendMetric('LCP', metric.value);
  });

  // Time to First Byte (TTFB)
  getTTFB((metric) => {
    console.log('TTFB:', metric);
    sendMetric('TTFB', metric.value);
  });
}

function sendMetric(name: string, value: number) {
  // Send to your analytics service
  fetch('/api/metrics', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      value,
      timestamp: Date.now(),
      url: window.location.href,
    }),
  }).catch(console.error);
}
```

### Business Metrics Tracking

```typescript
// lib/analytics/business-metrics.ts
import { userRegistrations, contentCreations, apiCalls } from '@/lib/monitoring/metrics';

export class BusinessMetrics {
  static trackUserRegistration(source: string, plan: string) {
    userRegistrations.labels(source, plan).inc();
  }

  static trackContentCreation(type: string, platform: string) {
    contentCreations.labels(type, platform).inc();
  }

  static trackApiCall(service: string, endpoint: string, status: string) {
    apiCalls.labels(service, endpoint, status).inc();
  }

  static trackUserEngagement(userId: string, action: string, metadata?: any) {
    // Track user engagement metrics
    fetch('/api/analytics/engagement', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        action,
        metadata,
        timestamp: Date.now(),
      }),
    }).catch(console.error);
  }

  static trackConversion(funnel: string, step: string, userId: string) {
    // Track conversion funnel metrics
    fetch('/api/analytics/conversion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        funnel,
        step,
        userId,
        timestamp: Date.now(),
      }),
    }).catch(console.error);
  }
}
```

## Database Performance Monitoring

### Query Performance Tracking

```typescript
// lib/monitoring/database.ts
import { prisma } from '@/lib/prisma';
import { databaseQueryDuration } from '@/lib/monitoring/metrics';

// Prisma middleware for query monitoring
prisma.$use(async (params, next) => {
  const start = Date.now();
  
  try {
    const result = await next(params);
    const duration = (Date.now() - start) / 1000;
    
    // Record successful query
    databaseQueryDuration
      .labels(params.action, params.model || 'unknown', 'success')
      .observe(duration);
    
    return result;
  } catch (error) {
    const duration = (Date.now() - start) / 1000;
    
    // Record failed query
    databaseQueryDuration
      .labels(params.action, params.model || 'unknown', 'error')
      .observe(duration);
    
    throw error;
  }
});

// Database health check
export async function checkDatabaseHealth() {
  try {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const duration = Date.now() - start;
    
    return {
      status: 'healthy',
      responseTime: duration,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };
  }
}

// Slow query detection
export async function detectSlowQueries() {
  // This would typically query your database's slow query log
  // For PostgreSQL, you might query pg_stat_statements
  const slowQueries = await prisma.$queryRaw`
    SELECT 
      query,
      calls,
      total_time,
      mean_time,
      rows
    FROM pg_stat_statements 
    WHERE mean_time > 1000 
    ORDER BY mean_time DESC 
    LIMIT 10
  `;
  
  return slowQueries;
}
```

### Connection Pool Monitoring

```typescript
// lib/monitoring/connection-pool.ts
import { databaseConnections } from '@/lib/monitoring/metrics';

export class ConnectionPoolMonitor {
  private static instance: ConnectionPoolMonitor;
  private intervalId: NodeJS.Timeout | null = null;

  static getInstance(): ConnectionPoolMonitor {
    if (!ConnectionPoolMonitor.instance) {
      ConnectionPoolMonitor.instance = new ConnectionPoolMonitor();
    }
    return ConnectionPoolMonitor.instance;
  }

  start() {
    this.intervalId = setInterval(async () => {
      try {
        const poolStats = await this.getPoolStats();
        databaseConnections.labels('main').set(poolStats.active);
      } catch (error) {
        console.error('Error monitoring connection pool:', error);
      }
    }, 10000); // Check every 10 seconds
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private async getPoolStats() {
    // This would depend on your database driver
    // For Prisma, you might need to access the underlying connection pool
    return {
      active: 0, // Implement actual pool stats retrieval
      idle: 0,
      total: 0,
    };
  }
}
```

## Frontend Performance Optimization

### Image Optimization

```typescript
// components/OptimizedImage.tsx
import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  quality = 75,
  placeholder = 'blur',
  blurDataURL,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  if (hasError) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-200"
        style={{ width, height }}
      >
        <span className="text-gray-500">Failed to load image</span>
      </div>
    );
  }

  return (
    <div className="relative" style={{ width, height }}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}
```

### Code Splitting and Lazy Loading

```typescript
// lib/performance/lazy-loading.ts
import { lazy, Suspense } from 'react';
import dynamic from 'next/dynamic';

// Lazy load heavy components
export const LazyAnalyticsDashboard = dynamic(
  () => import('@/components/AnalyticsDashboard'),
  {
    loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded" />,
    ssr: false,
  }
);

export const LazyChart = dynamic(
  () => import('@/components/Chart'),
  {
    loading: () => <div className="animate-pulse bg-gray-200 h-48 rounded" />,
  }
);

// Intersection Observer for lazy loading
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      options
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return isIntersecting;
}

// Lazy load component when it comes into view
export function LazyLoadOnView({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(ref, { threshold: 0.1 });

  return (
    <div ref={ref}>
      {isVisible ? children : <div className="h-64 bg-gray-200 animate-pulse" />}
    </div>
  );
}
```

### Bundle Analysis and Optimization

```typescript
// scripts/analyze-bundle.js
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  webpack: (config, { isServer }) => {
    if (process.env.ANALYZE) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          reportFilename: isServer
            ? '../analyze/server.html'
            : './analyze/client.html',
        })
      );
    }
    return config;
  },
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },
});
```

## Backend Performance Optimization

### Caching Strategy

```typescript
// lib/cache/redis-cache.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);

export class RedisCache {
  private static instance: RedisCache;
  private redis: Redis;

  private constructor() {
    this.redis = redis;
  }

  static getInstance(): RedisCache {
    if (!RedisCache.instance) {
      RedisCache.instance = new RedisCache();
    }
    return RedisCache.instance;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    try {
      await this.redis.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      console.error('Cache pattern invalidation error:', error);
    }
  }

  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = 3600
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await fetcher();
    await this.set(key, value, ttl);
    return value;
  }
}
```

### Database Query Optimization

```typescript
// lib/database/query-optimizer.ts
import { prisma } from '@/lib/prisma';

export class QueryOptimizer {
  // Optimized user query with selective fields
  static async getUserWithPosts(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        posts: {
          select: {
            id: true,
            title: true,
            status: true,
            publishedAt: true,
            _count: {
              select: {
                media: true,
                analytics: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
      },
    });
  }

  // Paginated query with cursor-based pagination
  static async getPostsPaginated(
    authorId: string,
    cursor?: string,
    limit: number = 20
  ) {
    return prisma.post.findMany({
      where: { authorId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      select: {
        id: true,
        title: true,
        status: true,
        publishedAt: true,
        author: {
          select: {
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            media: true,
            analytics: true,
          },
        },
      },
    });
  }

  // Batch operations for better performance
  static async batchUpdatePosts(
    postIds: string[],
    updates: Partial<Post>
  ) {
    return prisma.post.updateMany({
      where: {
        id: {
          in: postIds,
        },
      },
      data: updates,
    });
  }

  // Use raw SQL for complex queries
  static async getComplexAnalytics(
    userId: string,
    startDate: Date,
    endDate: Date
  ) {
    return prisma.$queryRaw`
      SELECT 
        DATE(ad.date) as date,
        COUNT(*) as total_posts,
        SUM((ad.metrics->>'views')::int) as total_views,
        AVG((ad.metrics->>'engagement_rate')::float) as avg_engagement
      FROM "AnalyticsData" ad
      WHERE ad."userId" = ${userId}
        AND ad.date >= ${startDate}
        AND ad.date <= ${endDate}
      GROUP BY DATE(ad.date)
      ORDER BY date DESC
    `;
  }
}
```

## Error Tracking and Debugging

### Error Boundary with Monitoring

```typescript
// components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { performanceMonitor } from '@/lib/monitoring/sentry';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to monitoring service
    performanceMonitor.captureException(error, {
      errorInfo,
      componentStack: errorInfo.componentStack,
    });

    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>We're sorry, but something unexpected happened.</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### API Error Handling

```typescript
// lib/errors/api-error.ts
export class ApiError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// lib/errors/error-handler.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { performanceMonitor } from '@/lib/monitoring/sentry';

export function errorHandler(
  error: Error,
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Log error
  console.error('API Error:', error);

  // Send to monitoring service
  performanceMonitor.captureException(error, {
    request: {
      method: req.method,
      url: req.url,
      headers: req.headers,
    },
  });

  // Determine status code
  const statusCode = error instanceof ApiError ? error.statusCode : 500;

  // Send error response
  res.status(statusCode).json({
    error: {
      message: error.message,
      statusCode,
      timestamp: new Date().toISOString(),
      requestId: req.headers['x-request-id'] || 'unknown',
    },
  });
}
```

## Performance Testing and Load Testing

### Load Testing with Artillery

```yaml
# artillery/load-test.yml
config:
  target: 'https://creatorflow.com'
  phases:
    - duration: 60
      arrivalRate: 10
    - duration: 120
      arrivalRate: 50
    - duration: 60
      arrivalRate: 100
  plugins:
    metrics-by-endpoint:
      useOnlyRequestNames: true

scenarios:
  - name: "User Journey"
    weight: 70
    flow:
      - get:
          url: "/"
          name: "Homepage"
      - get:
          url: "/auth/signin"
          name: "Sign In Page"
      - post:
          url: "/api/auth/signin"
          name: "Sign In"
          json:
            email: "test@example.com"
            password: "password123"
      - get:
          url: "/dashboard"
          name: "Dashboard"
      - get:
          url: "/api/posts"
          name: "Get Posts"

  - name: "API Load"
    weight: 30
    flow:
      - get:
          url: "/api/health"
          name: "Health Check"
      - get:
          url: "/api/analytics"
          name: "Analytics"
      - post:
          url: "/api/posts"
          name: "Create Post"
          json:
            title: "Test Post"
            content: "Test content"
```

### Performance Testing Script

```typescript
// scripts/performance-test.ts
import { chromium, Browser, Page } from 'playwright';

interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

async function runPerformanceTest(url: string): Promise<PerformanceMetrics> {
  const browser: Browser = await chromium.launch();
  const page: Page = await browser.newPage();

  try {
    // Navigate to the page
    await page.goto(url);

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Get performance metrics
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      return {
        loadTime: navigation.loadEventEnd - navigation.navigationStart,
        firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
        largestContentfulPaint: 0, // Would need to be measured with LCP API
        cumulativeLayoutShift: 0, // Would need to be measured with CLS API
        firstInputDelay: 0, // Would need to be measured with FID API
      };
    });

    return metrics;
  } finally {
    await browser.close();
  }
}

// Run performance tests
async function main() {
  const urls = [
    'https://creatorflow.com',
    'https://creatorflow.com/dashboard',
    'https://creatorflow.com/analytics',
  ];

  for (const url of urls) {
    console.log(`Testing ${url}...`);
    const metrics = await runPerformanceTest(url);
    console.log('Performance metrics:', metrics);
  }
}

main().catch(console.error);
```

## Best Practices and Tips

### 1. Monitoring
- Monitor all critical paths and user journeys
- Set up alerts for key performance indicators
- Use multiple monitoring tools for comprehensive coverage
- Regular review and optimization of monitoring setup

### 2. Performance
- Optimize images and assets
- Implement proper caching strategies
- Use code splitting and lazy loading
- Monitor Core Web Vitals

### 3. Error Handling
- Implement comprehensive error boundaries
- Log errors with sufficient context
- Set up error alerting
- Regular error analysis and prevention

### 4. Testing
- Implement performance testing in CI/CD
- Regular load testing
- Monitor performance regressions
- Test on real devices and networks

### 5. Optimization
- Regular performance audits
- Database query optimization
- Caching strategy optimization
- Continuous monitoring and improvement

## Conclusion

Effective monitoring and performance optimization are essential for maintaining a high-quality production application. By implementing comprehensive monitoring, performance optimization techniques, and continuous testing, you can ensure your Next.js application performs well and provides an excellent user experience.

The key to success is starting with basic monitoring and gradually implementing more advanced techniques as your application grows. Regular monitoring, analysis, and optimization will help you maintain peak performance and quickly identify and resolve issues.

---

**Ready to implement comprehensive monitoring and performance optimization in your Next.js application? Start with basic monitoring and gradually add more advanced techniques as your needs grow.**
