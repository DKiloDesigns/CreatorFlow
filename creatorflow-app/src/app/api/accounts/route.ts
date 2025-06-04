import { NextResponse, NextRequest } from 'next/server';
import { getSession } from '@/auth'; // Assuming auth is correctly configured in src/auth.ts
import { PrismaClient } from '@prisma/client';
import { handleGetAccounts, handlePostAccounts } from './route-logic';
import { requireApiKey } from '@/lib/apiKeyAuth';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  // Check for API key first
  const apiKeyHeader = request.headers.get('x-api-key');
  if (apiKeyHeader) {
    const auth = await requireApiKey(request);
    if ('user' in auth) {
      // Agent: fetch social accounts for the user
      const socialAccounts = await prisma.socialAccount.findMany({
        where: { userId: auth.user.id },
        select: {
          id: true,
          platform: true,
          username: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'asc' },
      });
      return NextResponse.json(socialAccounts);
    } else {
      return NextResponse.json(auth.body, { status: auth.status });
    }
  }
  // Fallback to session auth
  const { status, body } = await handleGetAccounts({ req: request, getSession, prisma });
  return NextResponse.json(body, { status });
}

export async function POST(request: NextRequest) {
  // Check for API key first
  const apiKeyHeader = request.headers.get('x-api-key');
  if (apiKeyHeader) {
    const auth = await requireApiKey(request);
    if ('user' in auth) {
      // Agent: fetch OAuth accounts for the user
      const accounts = await prisma.account.findMany({
        where: { userId: auth.user.id },
        select: {
          id: true,
          provider: true,
          providerAccountId: true,
        },
        orderBy: { provider: 'asc' },
      });
      return NextResponse.json(accounts);
    } else {
      return NextResponse.json(auth.body, { status: auth.status });
    }
  }
  // Fallback to session auth
  const { status, body } = await handlePostAccounts({ req: request, getSession, prisma });
  return NextResponse.json(body, { status });
} 