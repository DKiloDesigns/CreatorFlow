import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/auth';

export async function GET(req: NextRequest) {
  try {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Debug endpoint disabled in production.' }, { status: 403 });
    }
    
    // Return auth configuration (without secrets)
    const safeAuthConfig = {
      providers: authOptions.providers.map(provider => ({
        id: provider.id,
        name: provider.name,
        type: provider.type,
      })),
      session: authOptions.session,
      pages: authOptions.pages,
      debug: authOptions.debug,
      adapter: authOptions.adapter ? 'PrismaAdapter' : 'None',
      callbacks: Object.keys(authOptions.callbacks || {}),
      envVars: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        AUTH_SECRET: process.env.AUTH_SECRET ? 'Set' : 'Not set',
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set',
        GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID ? 'Set' : 'Not set',
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not set',
        DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set',
      },
    };
    
    return NextResponse.json({ 
      authConfig: safeAuthConfig,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Debug auth error:', error);
    return NextResponse.json({ 
      error: 'Error fetching auth config', 
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}