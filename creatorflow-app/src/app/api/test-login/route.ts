console.log("TEST-LOGIN ROUTE LOADED - MODIFIED VERSION", __filename);
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { encode } from 'next-auth/jwt';

// WARNING: DO NOT DEPLOY THIS ENDPOINT TO PRODUCTION!
// MODIFIED FOR DEBUGGING - LLOYD

export async function POST(request: NextRequest) {
  // Hardcoded test user session payload (adjust as needed)
  const session = {
    user: {
      name: 'Test User',
      email: 'testuser@example.com',
      id: 'test-user-id',
    },
    expires: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
  };

  // Sign the session as a JWT (NextAuth default)
  const secret = process.env.AUTH_SECRET!;
  const token = await encode({ token: session, secret });

  // Set the session cookie (NextAuth v4+ default cookie name)
  const cookieStore = await cookies();
  cookieStore.set('next-auth.session-token', token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  });

  return NextResponse.json({ success: true });
} 