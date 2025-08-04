// File temporarily disabled for troubleshooting. See middleware.ts.bak

// creatorflow-app/src/middleware.ts
// Keep Node.js runtime explicit for now
export const runtime = 'nodejs'; 

import { NextRequest, NextResponse } from 'next/server';
import { securityManager } from '@/lib/security-manager';

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Skip security checks for static files and API health checks
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/favicon') ||
      pathname.startsWith('/api/health') ||
      pathname.includes('.')
    ) {
      return NextResponse.next();
    }

    // Security checks for API routes
    if (pathname.startsWith('/api/')) {
      const securityCheck = await performAPISecurityCheck(request, ipAddress, userAgent);
      if (!securityCheck.allowed) {
        return NextResponse.json(
          { error: 'Security check failed', reason: securityCheck.reason },
          { status: 403 }
        );
      }
    }

    // Security checks for admin routes
    if (pathname.startsWith('/admin/') || pathname.startsWith('/security')) {
      const adminCheck = await performAdminSecurityCheck(request, ipAddress, userAgent);
      if (!adminCheck.allowed) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    // Rate limiting for sensitive operations
    if (pathname.startsWith('/api/auth/') || pathname.includes('login')) {
      const rateLimitCheck = await performRateLimitCheck(request, ipAddress);
      if (!rateLimitCheck.allowed) {
        return NextResponse.json(
          { error: 'Rate limit exceeded', retryAfter: rateLimitCheck.retryAfter },
          { status: 429 }
        );
      }
    }

    // Threat detection for all requests
    const threatCheck = await performThreatDetection(request, ipAddress, userAgent);
    if (threatCheck.threats.length > 0) {
      // Log threats but don't block unless critical
      const criticalThreats = threatCheck.threats.filter(t => t.confidence > 0.8);
      if (criticalThreats.length > 0) {
        return NextResponse.json(
          { error: 'Security threat detected', threats: criticalThreats },
          { status: 403 }
        );
      }
    }

    // Add security headers
    const response = NextResponse.next();
    addSecurityHeaders(response);

    return response;

  } catch (error) {
    console.error('Security middleware error:', error);
    return NextResponse.next();
  }
}

async function performAPISecurityCheck(
  request: NextRequest,
  ipAddress: string,
  userAgent: string
): Promise<{ allowed: boolean; reason?: string }> {
  try {
    // Check for suspicious patterns in request
    const suspiciousPatterns = detectSuspiciousPatterns(request);
    if (suspiciousPatterns.length > 0) {
      await securityManager.logSecurityEvent('SUSPICIOUS_API_REQUEST', 'medium', {
        pathname: request.nextUrl.pathname,
        ipAddress,
        userAgent,
        patterns: suspiciousPatterns,
      });
    }

    // Check for SQL injection attempts
    const url = request.nextUrl.toString();
    const sqlInjectionPatterns = [
      /(\b(union|select|insert|update|delete|drop|create|alter)\b)/i,
      /(\b(exec|execute|script|javascript)\b)/i,
    ];

    for (const pattern of sqlInjectionPatterns) {
      if (pattern.test(url)) {
        await securityManager.logSecurityEvent('SQL_INJECTION_ATTEMPT', 'high', {
          pathname: request.nextUrl.pathname,
          ipAddress,
          userAgent,
          pattern: pattern.source,
        });
        return { allowed: false, reason: 'Suspicious request pattern detected' };
      }
    }

    return { allowed: true };
  } catch (error) {
    console.error('API security check error:', error);
    return { allowed: true }; // Allow on error
  }
}

async function performAdminSecurityCheck(
  request: NextRequest,
  ipAddress: string,
  userAgent: string
): Promise<{ allowed: boolean; reason?: string }> {
  try {
    // Check if user is authenticated
    const session = await getSession(request);
    if (!session?.user?.id) {
      return { allowed: false, reason: 'Authentication required' };
    }

    // Check if user has admin permissions
    if (session.user.email !== 'renee@creatorflow.com') {
      await securityManager.logSecurityEvent('UNAUTHORIZED_ADMIN_ACCESS', 'high', {
        userId: session.user.id,
        email: session.user.email,
        pathname: request.nextUrl.pathname,
        ipAddress,
        userAgent,
      });
      return { allowed: false, reason: 'Insufficient permissions' };
    }

    return { allowed: true };
  } catch (error) {
    console.error('Admin security check error:', error);
    return { allowed: false, reason: 'Security check failed' };
  }
}

async function performRateLimitCheck(
  request: NextRequest,
  ipAddress: string
): Promise<{ allowed: boolean; retryAfter?: number }> {
  try {
    const cacheKey = `rate_limit:${ipAddress}`;
    const attempts = await getRateLimitAttempts(cacheKey);
    
    if (attempts > 10) { // Max 10 attempts per 15 minutes
      return { 
        allowed: false, 
        retryAfter: 900 // 15 minutes
      };
    }

    // Increment attempt count
    await incrementRateLimitAttempts(cacheKey);
    
    return { allowed: true };
  } catch (error) {
    console.error('Rate limit check error:', error);
    return { allowed: true }; // Allow on error
  }
}

async function performThreatDetection(
  request: NextRequest,
  ipAddress: string,
  userAgent: string
): Promise<{ threats: any[] }> {
  try {
    const session = await getSession(request);
    const userId = session?.user?.id;

    if (userId) {
      const threats = await securityManager.detectThreats(
        userId,
        'HTTP_REQUEST',
        {
          pathname: request.nextUrl.pathname,
          method: request.method,
          ipAddress,
          userAgent,
        }
      );

      return { threats };
    }

    return { threats: [] };
  } catch (error) {
    console.error('Threat detection error:', error);
    return { threats: [] };
  }
}

function detectSuspiciousPatterns(request: NextRequest): string[] {
  const patterns: string[] = [];
  const url = request.nextUrl.toString();
  const userAgent = request.headers.get('user-agent') || '';

  // Check for common attack patterns
  const attackPatterns = [
    { pattern: /\.\.\//, name: 'Path traversal' },
    { pattern: /<script/i, name: 'XSS attempt' },
    { pattern: /javascript:/i, name: 'JavaScript injection' },
    { pattern: /union\s+select/i, name: 'SQL injection' },
    { pattern: /eval\s*\(/i, name: 'Code injection' },
  ];

  for (const { pattern, name } of attackPatterns) {
    if (pattern.test(url) || pattern.test(userAgent)) {
      patterns.push(name);
    }
  }

  return patterns;
}

function addSecurityHeaders(response: NextResponse): void {
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'none'",
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', csp);
}

async function getSession(request: NextRequest): Promise<any> {
  try {
    // This is a simplified session check
    // In a real implementation, you'd use your auth library
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      // Validate JWT token here
      return { user: { id: 'user-id', email: 'user@example.com' } };
    }
    return null;
  } catch (error) {
    return null;
  }
}

async function getRateLimitAttempts(key: string): Promise<number> {
  // This would use your cache implementation
  return 0; // Simplified for demo
}

async function incrementRateLimitAttempts(key: string): Promise<void> {
  // This would increment the attempt count in cache
  // Simplified for demo
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
