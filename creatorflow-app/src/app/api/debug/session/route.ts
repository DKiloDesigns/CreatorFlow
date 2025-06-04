import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    const cookies = req.cookies.getAll();
    
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Debug endpoint disabled in production.' }, { status: 403 });
    }
    
    // Add more debug info
    return NextResponse.json({ 
      session, 
      cookies,
      authStatus: session ? 'Authenticated' : 'Not authenticated',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Debug session error:', error);
    return NextResponse.json({ 
      error: 'Error fetching session', 
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}