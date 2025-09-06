// Comprehensive error handling utilities for production

export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  endpoint?: string;
  method?: string;
  userAgent?: string;
  timestamp?: string;
  [key: string]: any;
}

export interface ErrorReport {
  id: string;
  type: 'client' | 'server' | 'api' | 'database' | 'auth' | 'validation' | 'network' | 'timeout';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  stack?: string;
  context: ErrorContext;
  timestamp: string;
  resolved: boolean;
  retryable: boolean;
}

export class AppError extends Error {
  public readonly type: ErrorReport['type'];
  public readonly severity: ErrorReport['severity'];
  public readonly retryable: boolean;
  public readonly context: ErrorContext;
  public readonly timestamp: string;

  constructor(
    message: string,
    type: ErrorReport['type'] = 'client',
    severity: ErrorReport['severity'] = 'medium',
    retryable: boolean = false,
    context: ErrorContext = {}
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.severity = severity;
    this.retryable = retryable;
    this.context = context;
    this.timestamp = new Date().toISOString();
  }
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorQueue: ErrorReport[] = [];
  private maxQueueSize = 100;

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // Create standardized error reports
  createErrorReport(
    error: Error | AppError,
    context: ErrorContext = {}
  ): ErrorReport {
    const isAppError = error instanceof AppError;
    
    return {
      id: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: isAppError ? error.type : this.classifyError(error),
      severity: isAppError ? error.severity : this.determineSeverity(error),
      message: error.message,
      stack: error.stack,
      context: {
        ...context,
        timestamp: new Date().toISOString(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      },
      timestamp: new Date().toISOString(),
      resolved: false,
      retryable: isAppError ? error.retryable : this.isRetryableError(error),
    };
  }

  // Classify error types
  private classifyError(error: Error): ErrorReport['type'] {
    const message = error.message.toLowerCase();
    const name = error.name.toLowerCase();

    if (name.includes('network') || message.includes('fetch') || message.includes('network')) {
      return 'network';
    }
    if (name.includes('timeout') || message.includes('timeout')) {
      return 'timeout';
    }
    if (name.includes('auth') || message.includes('unauthorized') || message.includes('forbidden')) {
      return 'auth';
    }
    if (name.includes('validation') || message.includes('invalid') || message.includes('required')) {
      return 'validation';
    }
    if (name.includes('database') || message.includes('prisma') || message.includes('sql')) {
      return 'database';
    }
    if (message.includes('api') || message.includes('endpoint')) {
      return 'api';
    }
    return 'client';
  }

  // Determine error severity
  private determineSeverity(error: Error): ErrorReport['severity'] {
    const message = error.message.toLowerCase();
    const name = error.name.toLowerCase();

    if (name.includes('critical') || message.includes('fatal') || message.includes('crash')) {
      return 'critical';
    }
    if (name.includes('error') || message.includes('failed') || message.includes('exception')) {
      return 'high';
    }
    if (name.includes('warning') || message.includes('deprecated')) {
      return 'medium';
    }
    return 'low';
  }

  // Check if error is retryable
  private isRetryableError(error: Error): boolean {
    const message = error.message.toLowerCase();
    const name = error.name.toLowerCase();

    // Network errors are usually retryable
    if (name.includes('network') || message.includes('fetch') || message.includes('timeout')) {
      return true;
    }
    // Server errors (5xx) are usually retryable
    if (message.includes('500') || message.includes('502') || message.includes('503') || message.includes('504')) {
      return true;
    }
    // Rate limiting is retryable
    if (message.includes('rate limit') || message.includes('429')) {
      return true;
    }
    return false;
  }

  // Handle and report errors
  async handleError(
    error: Error | AppError,
    context: ErrorContext = {}
  ): Promise<ErrorReport> {
    const errorReport = this.createErrorReport(error, context);
    
    // Add to queue
    this.addToQueue(errorReport);
    
    // Send to monitoring service
    await this.reportError(errorReport);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error handled:', errorReport);
    }
    
    return errorReport;
  }

  // Add error to queue
  private addToQueue(errorReport: ErrorReport): void {
    this.errorQueue.push(errorReport);
    
    // Maintain queue size
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift();
    }
  }

  // Report error to monitoring service
  private async reportError(errorReport: ErrorReport): Promise<void> {
    try {
      await fetch('/api/monitoring/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorReport),
      });
    } catch (reportError) {
      console.error('Failed to report error:', reportError);
    }
  }

  // Get error statistics
  getErrorStats(): {
    total: number;
    byType: Record<string, number>;
    bySeverity: Record<string, number>;
    recent: ErrorReport[];
  } {
    const byType: Record<string, number> = {};
    const bySeverity: Record<string, number> = {};
    
    this.errorQueue.forEach(error => {
      byType[error.type] = (byType[error.type] || 0) + 1;
      bySeverity[error.severity] = (bySeverity[error.severity] || 0) + 1;
    });

    return {
      total: this.errorQueue.length,
      byType,
      bySeverity,
      recent: this.errorQueue.slice(-10), // Last 10 errors
    };
  }

  // Clear error queue
  clearQueue(): void {
    this.errorQueue = [];
  }
}

// Convenience functions
export const errorHandler = ErrorHandler.getInstance();

export const handleError = (error: Error | AppError, context?: ErrorContext) => 
  errorHandler.handleError(error, context);

export const createError = (
  message: string,
  type?: ErrorReport['type'],
  severity?: ErrorReport['severity'],
  retryable?: boolean,
  context?: ErrorContext
) => new AppError(message, type, severity, retryable, context);

// API error handling wrapper
export const withErrorHandling = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context?: ErrorContext
) => {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      await handleError(error as Error, context);
      throw error;
    }
  };
};

// React hook for error handling
export const useErrorHandler = () => {
  const handleError = React.useCallback(
    (error: Error | AppError, context?: ErrorContext) => 
      errorHandler.handleError(error, context),
    []
  );

  const createError = React.useCallback(
    (message: string, type?: ErrorReport['type'], severity?: ErrorReport['severity'], retryable?: boolean, context?: ErrorContext) =>
      new AppError(message, type, severity, retryable, context),
    []
  );

  return { handleError, createError };
};

// Import React for the hook
import React from 'react';
