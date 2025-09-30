import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export interface ValidationRule {
  body?: z.ZodSchema;
  query?: z.ZodSchema;
  params?: z.ZodSchema;
  headers?: z.ZodSchema;
}

export interface ValidationConfig {
  rules: ValidationRule;
  onError?: (error: z.ZodError) => NextResponse;
  sanitize?: boolean;
  maxBodySize?: number;
  allowedMethods?: string[];
}

export class RequestValidator {
  private config: ValidationConfig;

  constructor(config: ValidationConfig) {
    this.config = {
      sanitize: true,
      maxBodySize: 1024 * 1024, // 1MB default
      allowedMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      ...config,
    };
  }

  async validate(req: NextRequest): Promise<{ valid: boolean; data?: any; error?: NextResponse }> {
    try {
      // Check allowed methods
      if (!this.config.allowedMethods?.includes(req.method)) {
        return {
          valid: false,
          error: new NextResponse(
            JSON.stringify({
              error: 'Method not allowed',
              message: `Method ${req.method} is not allowed`,
              allowedMethods: this.config.allowedMethods,
            }),
            {
              status: 405,
              headers: { 'Content-Type': 'application/json' },
            }
          ),
        };
      }

      // Check body size
      if (this.config.maxBodySize) {
        const contentLength = req.headers.get('content-length');
        if (contentLength && parseInt(contentLength) > this.config.maxBodySize) {
          return {
            valid: false,
            error: new NextResponse(
              JSON.stringify({
                error: 'Request too large',
                message: `Request body exceeds maximum size of ${this.config.maxBodySize} bytes`,
              }),
              {
                status: 413,
                headers: { 'Content-Type': 'application/json' },
              }
            ),
          };
        }
      }

      const validationData: any = {};

      // Validate headers
      if (this.config.rules.headers) {
        const headers: Record<string, string> = {};
        req.headers.forEach((value, key) => {
          headers[key.toLowerCase()] = value;
        });
        
        try {
          validationData.headers = this.config.rules.headers.parse(headers);
        } catch (error) {
          if (error instanceof z.ZodError) {
            return {
              valid: false,
              error: this.config.onError?.(error) || this.createValidationErrorResponse(error, 'headers'),
            };
          }
          throw error;
        }
      }

      // Validate query parameters
      if (this.config.rules.query) {
        const url = new URL(req.url);
        const query: Record<string, string | string[]> = {};
        url.searchParams.forEach((value, key) => {
          if (query[key]) {
            if (Array.isArray(query[key])) {
              (query[key] as string[]).push(value);
            } else {
              query[key] = [query[key] as string, value];
            }
          } else {
            query[key] = value;
          }
        });

        try {
          validationData.query = this.config.rules.query.parse(query);
        } catch (error) {
          if (error instanceof z.ZodError) {
            return {
              valid: false,
              error: this.config.onError?.(error) || this.createValidationErrorResponse(error, 'query'),
            };
          }
          throw error;
        }
      }

      // Validate URL parameters (for dynamic routes)
      if (this.config.rules.params) {
        // This would need to be passed from the route handler
        // For now, we'll skip this validation
        validationData.params = {};
      }

      // Validate request body
      if (this.config.rules.body && req.method !== 'GET') {
        let body: any;
        
        try {
          const contentType = req.headers.get('content-type') || '';
          
          if (contentType.includes('application/json')) {
            body = await req.json();
          } else if (contentType.includes('application/x-www-form-urlencoded')) {
            const formData = await req.formData();
            body = Object.fromEntries(formData.entries());
          } else if (contentType.includes('multipart/form-data')) {
            const formData = await req.formData();
            body = Object.fromEntries(formData.entries());
          } else {
            body = await req.text();
          }

          // Sanitize if enabled
          if (this.config.sanitize) {
            body = this.sanitizeData(body);
          }

          validationData.body = this.config.rules.body.parse(body);
        } catch (error) {
          if (error instanceof z.ZodError) {
            return {
              valid: false,
              error: this.config.onError?.(error) || this.createValidationErrorResponse(error, 'body'),
            };
          }
          throw error;
        }
      }

      return { valid: true, data: validationData };
    } catch (error) {
      console.error('Request validation error:', error);
      return {
        valid: false,
        error: new NextResponse(
          JSON.stringify({
            error: 'Validation failed',
            message: 'An error occurred during request validation',
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        ),
      };
    }
  }

  private sanitizeData(data: any): any {
    if (typeof data === 'string') {
      // Basic XSS prevention
      return data
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
    }

    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeData(item));
    }

    if (data && typeof data === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        // Sanitize key names
        const sanitizedKey = key.replace(/[^a-zA-Z0-9_-]/g, '');
        sanitized[sanitizedKey] = this.sanitizeData(value);
      }
      return sanitized;
    }

    return data;
  }

  private createValidationErrorResponse(error: z.ZodError, field: string): NextResponse {
    const issues = error.issues.map(issue => ({
      field: issue.path.join('.'),
      message: issue.message,
      code: issue.code,
    }));

    return new NextResponse(
      JSON.stringify({
        error: 'Validation failed',
        message: `Invalid ${field} data`,
        issues,
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  middleware() {
    return async (req: NextRequest) => {
      const validation = await this.validate(req);
      
      if (!validation.valid) {
        return validation.error!;
      }

      // Add validated data to request headers for use in route handlers
      const response = NextResponse.next();
      if (validation.data) {
        response.headers.set('X-Validated-Data', JSON.stringify(validation.data));
      }

      return response;
    };
  }
}

// Common validation schemas
export const commonSchemas = {
  pagination: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    sort: z.string().optional(),
    order: z.enum(['asc', 'desc']).default('desc'),
  }),

  id: z.object({
    id: z.string().uuid(),
  }),

  search: z.object({
    q: z.string().min(1).max(100),
    filters: z.record(z.string()).optional(),
  }),

  dateRange: z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }),

  userAgent: z.object({
    'user-agent': z.string().min(1).max(500),
  }),

  contentType: z.object({
    'content-type': z.string().regex(/^(application\/json|application\/x-www-form-urlencoded|multipart\/form-data)/),
  }),
};

// Pre-configured validators
export const apiValidator = new RequestValidator({
  rules: {
    headers: commonSchemas.userAgent,
  },
  maxBodySize: 10 * 1024 * 1024, // 10MB
});

export const authValidator = new RequestValidator({
  rules: {
    headers: z.object({
      'content-type': z.string().includes('application/json'),
      'user-agent': z.string().min(1),
    }),
    body: z.object({
      email: z.string().email(),
      password: z.string().min(8).max(128),
    }),
  },
  maxBodySize: 1024, // 1KB
});

export const uploadValidator = new RequestValidator({
  rules: {
    headers: z.object({
      'content-type': z.string().includes('multipart/form-data'),
    }),
  },
  maxBodySize: 50 * 1024 * 1024, // 50MB
  allowedMethods: ['POST'],
});
