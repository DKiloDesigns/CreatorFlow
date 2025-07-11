// File temporarily disabled for troubleshooting. See middleware.ts.bak

// creatorflow-app/src/middleware.ts
// Keep Node.js runtime explicit for now
export const runtime = 'nodejs'; 

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/auth';
import { RateLimiter } from '@/lib/analytics/rateLimit';
import { AnalyticsCache } from '@/lib/analytics/cache';

const rateLimiter = RateLimiter.getInstance();
const analyticsCache = AnalyticsCache.getInstance();

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // requests per window
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

export async function middleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  
  // Security headers for all requests
  const response = NextResponse.next();
  
  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  // Rate limiting
  if (!checkRateLimit(ip)) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }
  
  // Only apply analytics middleware to analytics endpoints
  if (!request.nextUrl.pathname.startsWith('/api/analytics')) {
    return response;
  }

  try {
    // Get user session
    const session = await getSession(request);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const endpoint = request.nextUrl.pathname.split('/').pop() || '';

    // Check rate limit
    const rateLimitResponse = await rateLimiter.handleRateLimit(userId, endpoint);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    // Check cache for GET requests
    if (request.method === 'GET') {
      const params = Object.fromEntries(request.nextUrl.searchParams);
      const cached = await analyticsCache.get(userId, endpoint, params);
      
      if (cached) {
        return NextResponse.json(cached);
      }
    }

    // Continue to the API route
    const apiResponse = await NextResponse.next();

    // Cache successful GET responses
    if (request.method === 'GET' && apiResponse.ok) {
      const params = Object.fromEntries(request.nextUrl.searchParams);
      const data = await apiResponse.json();
      await analyticsCache.set(userId, endpoint, params, data);
    }

    return apiResponse;
  } catch (error) {
    console.error('Analytics middleware error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
