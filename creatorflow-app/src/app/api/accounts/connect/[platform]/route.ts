import { NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { handleConnectAccount } from '../../route-logic';

// NOTE: We will need to add actual OAuth logic here using a library like 'openid-client' 
// or specific SDKs, and configure client IDs/secrets/scopes for each platform.

// Modified to use the correct Next.js App Router API route handler format
export async function POST(request: Request) {
  // Extract platform from URL
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const platform = pathParts[pathParts.length - 2]; // Get the platform from the URL path
  
  const params = { platform };
  const { status, body } = await handleConnectAccount({ req: request, params, getSession });
  return NextResponse.json(body, { status });
}