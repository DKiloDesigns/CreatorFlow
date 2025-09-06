import { NextRequest, NextResponse } from 'next/server';
import { handleError, createError, AppError } from './error-handler';

export interface APIErrorResponse {
  error: string;
  code: string;
  details?: any;
  requestId?: string;
  timestamp: string;
}

export class APIError extends AppError {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    type: 'api' | 'validation' | 'auth' | 'database' | 'network' = 'api',
    retryable: boolean = false,
    context: any = {}
  ) {
    super(message, type, statusCode >= 500 ? 'high' : 'medium', retryable, context);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

// Standard API error responses
export const APIErrors = {
  // Authentication errors
  UNAUTHORIZED: (message = 'Authentication required') => 
    new APIError(message, 401, 'UNAUTHORIZED', 'auth'),
  
  FORBIDDEN: (message = 'Access denied') => 
    new APIError(message, 403, 'FORBIDDEN', 'auth'),
  
  // Validation errors
  VALIDATION_ERROR: (message = 'Invalid input data', details?: any) => 
    new APIError(message, 400, 'VALIDATION_ERROR', 'validation', false, { details }),
  
  MISSING_FIELD: (field: string) => 
    new APIError(`Missing required field: ${field}`, 400, 'MISSING_FIELD', 'validation'),
  
  INVALID_FORMAT: (field: string, expected: string) => 
    new APIError(`Invalid format for ${field}. Expected: ${expected}`, 400, 'INVALID_FORMAT', 'validation'),
  
  // Resource errors
  NOT_FOUND: (resource = 'Resource') => 
    new APIError(`${resource} not found`, 404, 'NOT_FOUND', 'api'),
  
  CONFLICT: (message = 'Resource conflict') => 
    new APIError(message, 409, 'CONFLICT', 'api'),
  
  // Rate limiting
  RATE_LIMITED: (message = 'Rate limit exceeded') => 
    new APIError(message, 429, 'RATE_LIMITED', 'api', true),
  
  // Server errors
  INTERNAL_ERROR: (message = 'Internal server error') => 
    new APIError(message, 500, 'INTERNAL_ERROR', 'api'),
  
  DATABASE_ERROR: (message = 'Database operation failed') => 
    new APIError(message, 500, 'DATABASE_ERROR', 'database'),
  
  EXTERNAL_API_ERROR: (message = 'External API error') => 
    new APIError(message, 502, 'EXTERNAL_API_ERROR', 'network', true),
  
  TIMEOUT: (message = 'Request timeout') => 
    new APIError(message, 504, 'TIMEOUT', 'network', true),
};

// Error handler wrapper for API routes
export function withAPIErrorHandling<T extends any[], R>(
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    try {
      return await handler(...args);
    } catch (error) {
      // Handle different error types
      if (error instanceof APIError) {
        throw error; // Re-throw API errors as-is
      }
      
      if (error instanceof AppError) {
        // Convert AppError to APIError
        const apiError = new APIError(
          error.message,
          error.severity === 'critical' ? 500 : 400,
          error.type.toUpperCase(),
          error.type as any,
          error.retryable,
          error.context
        );
        throw apiError;
      }
      
      // Handle unknown errors
      const apiError = new APIError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        500,
        'INTERNAL_ERROR',
        'api'
      );
      
      // Log the original error
      await handleError(error instanceof Error ? error : new Error(String(error)), {
        endpoint: 'api',
        timestamp: new Date().toISOString(),
      });
      
      throw apiError;
    }
  };
}

// Create standardized error response
export function createErrorResponse(
  error: APIError | Error,
  requestId?: string
): NextResponse<APIErrorResponse> {
  const statusCode = error instanceof APIError ? error.statusCode : 500;
  const code = error instanceof APIError ? error.code : 'INTERNAL_ERROR';
  const message = error.message || 'An error occurred';
  
  const response: APIErrorResponse = {
    error: message,
    code,
    requestId,
    timestamp: new Date().toISOString(),
  };
  
  // Add details for validation errors
  if (error instanceof APIError && error.context.details) {
    response.details = error.context.details;
  }
  
  return NextResponse.json(response, { status: statusCode });
}

// Validation helpers
export function validateRequired(data: any, fields: string[]): void {
  const missing = fields.filter(field => !data[field]);
  if (missing.length > 0) {
    throw APIErrors.MISSING_FIELD(missing.join(', '));
  }
}

export function validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw APIErrors.INVALID_FORMAT('email', 'valid email address');
  }
}

export function validateUUID(id: string): void {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    throw APIErrors.INVALID_FORMAT('id', 'valid UUID');
  }
}

// Request validation wrapper
export function validateRequest<T>(
  req: NextRequest,
  validator: (data: any) => T
): T {
  try {
    const data = req.json ? req.json() : {};
    return validator(data);
  } catch (error) {
    throw APIErrors.VALIDATION_ERROR('Invalid request data', error);
  }
}

// Async request validation
export async function validateRequestAsync<T>(
  req: NextRequest,
  validator: (data: any) => Promise<T>
): Promise<T> {
  try {
    const data = await req.json();
    return await validator(data);
  } catch (error) {
    throw APIErrors.VALIDATION_ERROR('Invalid request data', error);
  }
}

// Rate limiting helper
export function checkRateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): boolean {
  // This would integrate with your rate limiting service
  // For now, return true (no rate limiting)
  return true;
}

// Database error handler
export function handleDatabaseError(error: any): never {
  console.error('Database error:', error);
  
  if (error.code === 'P2002') {
    throw APIErrors.CONFLICT('Resource already exists');
  }
  
  if (error.code === 'P2025') {
    throw APIErrors.NOT_FOUND('Record not found');
  }
  
  throw APIErrors.DATABASE_ERROR('Database operation failed');
}

// External API error handler
export function handleExternalAPIError(error: any, service: string): never {
  console.error(`External API error (${service}):`, error);
  
  if (error.status === 429) {
    throw APIErrors.RATE_LIMITED(`Rate limited by ${service}`);
  }
  
  if (error.status >= 500) {
    throw APIErrors.EXTERNAL_API_ERROR(`${service} is temporarily unavailable`);
  }
  
  throw APIErrors.EXTERNAL_API_ERROR(`Error communicating with ${service}`);
}
