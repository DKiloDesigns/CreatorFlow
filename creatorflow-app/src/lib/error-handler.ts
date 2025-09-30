// Global error handling utilities
export interface AppError {
  code: string;
  message: string;
  statusCode: number;
  details?: any;
  timestamp: string;
  stack?: string;
}

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: any;
  public readonly timestamp: string;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    details?: any
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date().toISOString();
    
    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

// Predefined error types
export const ErrorCodes = {
  // Authentication errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  
  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  
  // Resource errors
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  GONE: 'GONE',
  
  // Server errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  TIMEOUT: 'TIMEOUT',
  
  // Database errors
  DATABASE_ERROR: 'DATABASE_ERROR',
  CONNECTION_ERROR: 'CONNECTION_ERROR',
  
  // External service errors
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  API_RATE_LIMIT: 'API_RATE_LIMIT',
  
  // Build errors
  BUILD_ERROR: 'BUILD_ERROR',
  MODULE_NOT_FOUND: 'MODULE_NOT_FOUND',
  COMPILATION_ERROR: 'COMPILATION_ERROR',
} as const;

// Error factory functions
export const createError = {
  unauthorized: (message: string = 'Unauthorized access') => 
    new AppError(message, 401, ErrorCodes.UNAUTHORIZED),
    
  forbidden: (message: string = 'Access forbidden') => 
    new AppError(message, 403, ErrorCodes.FORBIDDEN),
    
  notFound: (message: string = 'Resource not found') => 
    new AppError(message, 404, ErrorCodes.NOT_FOUND),
    
  validation: (message: string = 'Validation failed', details?: any) => 
    new AppError(message, 400, ErrorCodes.VALIDATION_ERROR, details),
    
  conflict: (message: string = 'Resource conflict') => 
    new AppError(message, 409, ErrorCodes.CONFLICT),
    
  internal: (message: string = 'Internal server error', details?: any) => 
    new AppError(message, 500, ErrorCodes.INTERNAL_ERROR, details),
    
  serviceUnavailable: (message: string = 'Service temporarily unavailable') => 
    new AppError(message, 503, ErrorCodes.SERVICE_UNAVAILABLE),
    
  timeout: (message: string = 'Request timeout') => 
    new AppError(message, 408, ErrorCodes.TIMEOUT),
    
  database: (message: string = 'Database error', details?: any) => 
    new AppError(message, 500, ErrorCodes.DATABASE_ERROR, details),
    
  externalService: (message: string = 'External service error', details?: any) => 
    new AppError(message, 502, ErrorCodes.EXTERNAL_SERVICE_ERROR, details),
    
  build: (message: string = 'Build error', details?: any) => 
    new AppError(message, 500, ErrorCodes.BUILD_ERROR, details),
    
  moduleNotFound: (module: string) => 
    new AppError(`Module not found: ${module}`, 500, ErrorCodes.MODULE_NOT_FOUND, { module }),
    
  compilation: (message: string = 'Compilation error', details?: any) => 
    new AppError(message, 500, ErrorCodes.COMPILATION_ERROR, details),
};

// Error handler for API routes
export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error);
  
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
          timestamp: error.timestamp,
        },
      },
      { status: error.statusCode }
    );
  }
  
  if (error instanceof Error) {
    return NextResponse.json(
      {
        error: {
          code: ErrorCodes.INTERNAL_ERROR,
          message: 'An unexpected error occurred',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
  
  return NextResponse.json(
    {
      error: {
        code: ErrorCodes.INTERNAL_ERROR,
        message: 'An unknown error occurred',
        timestamp: new Date().toISOString(),
      },
    },
    { status: 500 }
  );
}

// Error handler for client-side errors
export function handleClientError(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
}

// Error logger
export function logError(error: unknown, context?: string): void {
  const timestamp = new Date().toISOString();
  const contextStr = context ? `[${context}]` : '';
  
  if (error instanceof AppError) {
    console.error(`${contextStr} ${timestamp} - ${error.code}: ${error.message}`, {
      statusCode: error.statusCode,
      details: error.details,
      stack: error.stack,
    });
  } else if (error instanceof Error) {
    console.error(`${contextStr} ${timestamp} - Error: ${error.message}`, {
      stack: error.stack,
    });
  } else {
    console.error(`${contextStr} ${timestamp} - Unknown error:`, error);
  }
}

// Error boundary helper
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

// Error recovery strategies
export const ErrorRecovery = {
  // Retry with exponential backoff
  retry: async <T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> => {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          throw lastError;
        }
        
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  },
  
  // Fallback value
  fallback: <T>(fn: () => T, fallbackValue: T): T => {
    try {
      return fn();
    } catch {
      return fallbackValue;
    }
  },
  
  // Graceful degradation
  graceful: async <T>(
    primary: () => Promise<T>,
    fallback: () => Promise<T>
  ): Promise<T> => {
    try {
      return await primary();
    } catch (error) {
      console.warn('Primary operation failed, using fallback:', error);
      return await fallback();
    }
  },
};

// Error monitoring (placeholder for real monitoring service)
export const ErrorMonitor = {
  capture: (error: AppError, context?: Record<string, any>) => {
    // In a real application, this would send to Sentry, LogRocket, etc.
    console.error('Error captured:', {
      error: {
        code: error.code,
        message: error.message,
        statusCode: error.statusCode,
        details: error.details,
        timestamp: error.timestamp,
        stack: error.stack,
      },
      context,
    });
  },
  
  captureException: (error: Error, context?: Record<string, any>) => {
    console.error('Exception captured:', {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      context,
    });
  },
};

// Build error specific handlers
export const BuildErrorHandler = {
  handleModuleNotFound: (module: string) => {
    logError(createError.moduleNotFound(module), 'Build');
    return createError.moduleNotFound(module);
  },
  
  handleCompilationError: (message: string, details?: any) => {
    logError(createError.compilation(message, details), 'Build');
    return createError.compilation(message, details);
  },
  
  handleImportError: (importPath: string, error: Error) => {
    const message = `Failed to import ${importPath}: ${error.message}`;
    logError(createError.build(message, { importPath, originalError: error.message }), 'Build');
    return createError.build(message, { importPath, originalError: error.message });
  },
};