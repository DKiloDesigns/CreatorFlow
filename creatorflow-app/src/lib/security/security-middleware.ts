import { NextRequest, NextResponse } from 'next/server';
import { apiRateLimiter, authRateLimiter } from './rate-limiter';
import { developmentSecurityHeaders } from './security-headers';
import { requireAPIKey } from './api-keys';
import { RequestValidator } from './request-validator';

export interface SecurityConfig {
  enableRateLimiting?: boolean;
  enableSecurityHeaders?: boolean;
  enableAPIKeyAuth?: boolean;
  enableRequestValidation?: boolean;
  rateLimitConfig?: {
    api?: boolean;
    auth?: boolean;
  };
  requiredPermissions?: string[];
  validationRules?: any;
}

export class SecurityMiddleware {
  private config: SecurityConfig;

  constructor(config: SecurityConfig = {}) {
    this.config = {
      enableRateLimiting: true,
      enableSecurityHeaders: true,
      enableAPIKeyAuth: false,
      enableRequestValidation: false,
      rateLimitConfig: {
        api: true,
        auth: false,
      },
      ...config,
    };
  }

  async process(req: NextRequest): Promise<NextResponse | null> {
    try {
      // 1. Security Headers
      if (this.config.enableSecurityHeaders) {
        const securityHeaders = developmentSecurityHeaders(req);
        if (securityHeaders) {
          return securityHeaders;
        }
      }

      // 2. Rate Limiting
      if (this.config.enableRateLimiting) {
        const rateLimitResult = await this.checkRateLimit(req);
        if (rateLimitResult) {
          return rateLimitResult;
        }
      }

      // 3. API Key Authentication
      if (this.config.enableAPIKeyAuth) {
        const authResult = await this.checkAPIKey(req);
        if (authResult) {
          return authResult;
        }
      }

      // 4. Request Validation
      if (this.config.enableRequestValidation && this.config.validationRules) {
        const validator = new RequestValidator(this.config.validationRules);
        const validation = await validator.validate(req);
        if (!validation.valid) {
          return validation.error!;
        }
      }

      return null; // Continue to next middleware
    } catch (error) {
      console.error('Security middleware error:', error);
      return new NextResponse(
        JSON.stringify({
          error: 'Security check failed',
          message: 'An error occurred during security validation',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  }

  private async checkRateLimit(req: NextRequest): Promise<NextResponse | null> {
    try {
      const pathname = req.nextUrl.pathname;
      
      // Check if this is an auth endpoint
      if (pathname.includes('/auth/') && this.config.rateLimitConfig?.auth) {
        const result = await authRateLimiter.checkLimit(req);
        if (!result.success) {
          return new NextResponse(
            JSON.stringify({
              error: 'Rate limit exceeded',
              message: 'Too many authentication attempts. Please try again later.',
              retryAfter: result.retryAfter,
            }),
            {
              status: 429,
              headers: {
                'Content-Type': 'application/json',
                'X-RateLimit-Limit': result.limit.toString(),
                'X-RateLimit-Remaining': result.remaining.toString(),
                'X-RateLimit-Reset': result.resetTime.toString(),
                'Retry-After': result.retryAfter?.toString() || '60',
              },
            }
          );
        }
      }
      
      // Check general API rate limit
      if (this.config.rateLimitConfig?.api) {
        const result = await apiRateLimiter.checkLimit(req);
        if (!result.success) {
          return new NextResponse(
            JSON.stringify({
              error: 'Rate limit exceeded',
              message: 'Too many requests. Please try again later.',
              retryAfter: result.retryAfter,
            }),
            {
              status: 429,
              headers: {
                'Content-Type': 'application/json',
                'X-RateLimit-Limit': result.limit.toString(),
                'X-RateLimit-Remaining': result.remaining.toString(),
                'X-RateLimit-Reset': result.resetTime.toString(),
                'Retry-After': result.retryAfter?.toString() || '60',
              },
            }
          );
        }
      }

      return null;
    } catch (error) {
      console.error('Rate limit check error:', error);
      return null; // Allow request on error
    }
  }

  private async checkAPIKey(req: NextRequest): Promise<NextResponse | null> {
    try {
      const authResult = await requireAPIKey(req, this.config.requiredPermissions || []);
      
      if (!authResult.valid) {
        return new NextResponse(
          JSON.stringify({
            error: 'Authentication failed',
            message: authResult.error || 'Invalid API key',
          }),
          {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      return null;
    } catch (error) {
      console.error('API key check error:', error);
      return null; // Allow request on error
    }
  }

  middleware() {
    return async (req: NextRequest) => {
      const result = await this.process(req);
      return result || NextResponse.next();
    };
  }
}

// Pre-configured security middleware instances
export const apiSecurity = new SecurityMiddleware({
  enableRateLimiting: true,
  enableSecurityHeaders: true,
  enableAPIKeyAuth: false,
  rateLimitConfig: {
    api: true,
    auth: false,
  },
});

export const authSecurity = new SecurityMiddleware({
  enableRateLimiting: true,
  enableSecurityHeaders: true,
  enableAPIKeyAuth: false,
  rateLimitConfig: {
    api: false,
    auth: true,
  },
});

export const protectedAPISecurity = new SecurityMiddleware({
  enableRateLimiting: true,
  enableSecurityHeaders: true,
  enableAPIKeyAuth: true,
  requiredPermissions: ['read'],
  rateLimitConfig: {
    api: true,
    auth: false,
  },
});

export const adminSecurity = new SecurityMiddleware({
  enableRateLimiting: true,
  enableSecurityHeaders: true,
  enableAPIKeyAuth: true,
  requiredPermissions: ['admin'],
  rateLimitConfig: {
    api: true,
    auth: false,
  },
});

// Utility function to create custom security middleware
export function createSecurityMiddleware(config: SecurityConfig) {
  return new SecurityMiddleware(config);
}

// Middleware for specific route patterns
export const routeSecurity = {
  '/api/auth/*': authSecurity,
  '/api/protected/*': protectedAPISecurity,
  '/api/admin/*': adminSecurity,
  '/api/*': apiSecurity,
};

export function getSecurityMiddlewareForRoute(pathname: string): SecurityMiddleware {
  for (const [pattern, middleware] of Object.entries(routeSecurity)) {
    if (pathname.match(pattern.replace('*', '.*'))) {
      return middleware;
    }
  }
  
  return apiSecurity; // Default security
}
