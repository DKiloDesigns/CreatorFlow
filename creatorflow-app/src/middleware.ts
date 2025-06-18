// creatorflow-app/src/middleware.ts
// Keep Node.js runtime explicit for now
export const runtime = 'nodejs'; 

// Directly export auth from the *middleware-specific* config
export { auth as middleware } from "@/auth.middleware";

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/auth';
import { RateLimiter } from '@/lib/analytics/rateLimit';
import { AnalyticsCache } from '@/lib/analytics/cache';

const rateLimiter = RateLimiter.getInstance();
const analyticsCache = AnalyticsCache.getInstance();

export async function middleware(request: NextRequest) {
  // Only apply to analytics endpoints
  if (!request.nextUrl.pathname.startsWith('/api/analytics')) {
    return NextResponse.next();
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
    const response = await NextResponse.next();

    // Cache successful GET responses
    if (request.method === 'GET' && response.ok) {
      const params = Object.fromEntries(request.nextUrl.searchParams);
      const data = await response.json();
      await analyticsCache.set(userId, endpoint, params, data);
    }

    return response;
  } catch (error) {
    console.error('Analytics middleware error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const config = {
  matcher: '/api/analytics/:path*',
};
