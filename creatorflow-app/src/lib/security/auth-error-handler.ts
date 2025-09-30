import { NextRequest, NextResponse } from 'next/server';
import { getRedisClient } from '../redis';

export interface AuthErrorContext {
  ip: string;
  userAgent: string;
  timestamp: Date;
  endpoint: string;
  method: string;
  userId?: string;
  sessionId?: string;
}

export class AuthErrorHandler {
  private static readonly FAILED_ATTEMPTS_KEY = 'auth_failed_attempts:';
  private static readonly LOCKOUT_KEY = 'auth_lockout:';
  private static readonly MAX_ATTEMPTS = 5;
  private static readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

  static async handleAuthError(
    error: string,
    context: AuthErrorContext,
    req: NextRequest
  ): Promise<NextResponse> {
    try {
      // Log the failed attempt
      await this.logFailedAttempt(context);

      // Check if IP should be locked out
      const isLockedOut = await this.checkLockout(context.ip);
      if (isLockedOut) {
        return this.createLockoutResponse();
      }

      // Check if we should lock out this IP
      const shouldLockout = await this.shouldLockout(context.ip);
      if (shouldLockout) {
        await this.lockoutIP(context.ip);
        return this.createLockoutResponse();
      }

      // Return appropriate error response based on error type
      return this.createErrorResponse(error, context);
    } catch (error) {
      console.error('Auth error handler failed:', error);
      return this.createGenericErrorResponse();
    }
  }

  private static async logFailedAttempt(context: AuthErrorContext): Promise<void> {
    try {
      const client = await getRedisClient();
      if (!client) return;

      const key = `${this.FAILED_ATTEMPTS_KEY}${context.ip}`;
      const attemptData = {
        timestamp: context.timestamp.toISOString(),
        userAgent: context.userAgent,
        endpoint: context.endpoint,
        method: context.method,
        userId: context.userId || '',
        sessionId: context.sessionId || '',
      };

      // Add to failed attempts list
      await client.lpush(key, JSON.stringify(attemptData));
      
      // Keep only last 10 attempts
      await client.ltrim(key, 0, 9);
      
      // Set expiration
      await client.expire(key, 3600); // 1 hour
    } catch (error) {
      console.error('Failed to log auth attempt:', error);
    }
  }

  private static async checkLockout(ip: string): Promise<boolean> {
    try {
      const client = await getRedisClient();
      if (!client) return false;

      const lockoutKey = `${this.LOCKOUT_KEY}${ip}`;
      const exists = await client.exists(lockoutKey);
      return exists === 1;
    } catch (error) {
      console.error('Failed to check lockout:', error);
      return false;
    }
  }

  private static async shouldLockout(ip: string): Promise<boolean> {
    try {
      const client = await getRedisClient();
      if (!client) return false;

      const key = `${this.FAILED_ATTEMPTS_KEY}${ip}`;
      const attempts = await client.llen(key);
      return attempts >= this.MAX_ATTEMPTS;
    } catch (error) {
      console.error('Failed to check if should lockout:', error);
      return false;
    }
  }

  private static async lockoutIP(ip: string): Promise<void> {
    try {
      const client = await getRedisClient();
      if (!client) return;

      const lockoutKey = `${this.LOCKOUT_KEY}${ip}`;
      await client.setex(lockoutKey, Math.floor(this.LOCKOUT_DURATION / 1000), '1');
    } catch (error) {
      console.error('Failed to lockout IP:', error);
    }
  }

  private static createErrorResponse(error: string, context: AuthErrorContext): NextResponse {
    const errorMap: Record<string, { message: string; status: number; suggestions: string[] }> = {
      'invalid_credentials': {
        message: 'Invalid email or password',
        status: 401,
        suggestions: [
          'Check your email address for typos',
          'Make sure Caps Lock is off',
          'Try resetting your password',
        ],
      },
      'account_locked': {
        message: 'Account has been temporarily locked',
        status: 423,
        suggestions: [
          'Wait 15 minutes before trying again',
          'Contact support if this persists',
        ],
      },
      'email_not_verified': {
        message: 'Please verify your email address',
        status: 403,
        suggestions: [
          'Check your email for a verification link',
          'Resend verification email',
          'Check your spam folder',
        ],
      },
      'session_expired': {
        message: 'Your session has expired',
        status: 401,
        suggestions: [
          'Please log in again',
          'Your session may have timed out due to inactivity',
        ],
      },
      'invalid_token': {
        message: 'Invalid or expired token',
        status: 401,
        suggestions: [
          'Try logging in again',
          'Request a new password reset link',
        ],
      },
      'rate_limited': {
        message: 'Too many login attempts',
        status: 429,
        suggestions: [
          'Wait a few minutes before trying again',
          'Contact support if you need immediate access',
        ],
      },
    };

    const errorInfo = errorMap[error] || {
      message: 'Authentication failed',
      status: 401,
      suggestions: [
        'Please check your credentials',
        'Contact support if the problem persists',
      ],
    };

    return new NextResponse(
      JSON.stringify({
        error: 'Authentication Error',
        message: errorInfo.message,
        suggestions: errorInfo.suggestions,
        help: {
          loginUrl: '/auth/login',
          resetPasswordUrl: '/auth/reset-password',
          supportUrl: '/support',
        },
        timestamp: context.timestamp.toISOString(),
      }),
      {
        status: errorInfo.status,
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Error': error,
          'X-Retry-After': error === 'rate_limited' ? '300' : undefined,
        },
      }
    );
  }

  private static createLockoutResponse(): NextResponse {
    return new NextResponse(
      JSON.stringify({
        error: 'Account Temporarily Locked',
        message: 'Too many failed login attempts. Please try again in 15 minutes.',
        suggestions: [
          'Wait 15 minutes before trying again',
          'Contact support if you need immediate access',
          'Consider using password reset if you forgot your password',
        ],
        help: {
          supportUrl: '/support',
          resetPasswordUrl: '/auth/reset-password',
        },
        retryAfter: 900, // 15 minutes in seconds
      }),
      {
        status: 423,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '900',
          'X-Account-Locked': 'true',
        },
      }
    );
  }

  private static createGenericErrorResponse(): NextResponse {
    return new NextResponse(
      JSON.stringify({
        error: 'Authentication Error',
        message: 'An error occurred during authentication. Please try again.',
        suggestions: [
          'Check your internet connection',
          'Try refreshing the page',
          'Contact support if the problem persists',
        ],
        help: {
          loginUrl: '/auth/login',
          supportUrl: '/support',
        },
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  static async getFailedAttempts(ip: string): Promise<any[]> {
    try {
      const client = await getRedisClient();
      if (!client) return [];

      const key = `${this.FAILED_ATTEMPTS_KEY}${ip}`;
      const attempts = await client.lrange(key, 0, -1);
      return attempts.map(attempt => JSON.parse(attempt));
    } catch (error) {
      console.error('Failed to get failed attempts:', error);
      return [];
    }
  }

  static async clearFailedAttempts(ip: string): Promise<void> {
    try {
      const client = await getRedisClient();
      if (!client) return;

      const key = `${this.FAILED_ATTEMPTS_KEY}${ip}`;
      await client.del(key);
    } catch (error) {
      console.error('Failed to clear failed attempts:', error);
    }
  }

  static async unlockIP(ip: string): Promise<void> {
    try {
      const client = await getRedisClient();
      if (!client) return;

      const lockoutKey = `${this.LOCKOUT_KEY}${ip}`;
      await client.del(lockoutKey);
    } catch (error) {
      console.error('Failed to unlock IP:', error);
    }
  }
}
