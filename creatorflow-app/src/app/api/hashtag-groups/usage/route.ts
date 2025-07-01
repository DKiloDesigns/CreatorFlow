import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/auth';
import { requireApiKey } from '@/lib/apiKeyAuth';
import { handleRecordHashtagGroupUsage, handleGetHashtagGroupUsage } from './route-logic';

// POST: Record a usage event
export async function POST(req: NextRequest) {
  const apiKeyHeader = req.headers.get('x-api-key');
  let userId: string | undefined;
  let getSessionWithUser;
  if (apiKeyHeader) {
    const auth = await requireApiKey(req);
    if ('user' in auth) userId = auth.user.id;
    else return auth;
    getSessionWithUser = async () => ({ user: { id: userId } });
  } else {
    getSessionWithUser = getSession;
  }
  const result = await handleRecordHashtagGroupUsage({ req, getSession: getSessionWithUser, prisma });
  return NextResponse.json(result.body, { status: result.status });
}

// GET: Usage stats/history for a group
export async function GET(req: NextRequest) {
  const apiKeyHeader = req.headers.get('x-api-key');
  let userId: string | undefined;
  let getSessionWithUser;
  if (apiKeyHeader) {
    const auth = await requireApiKey(req);
    if ('user' in auth) userId = auth.user.id;
    else return auth;
    getSessionWithUser = async () => ({ user: { id: userId } });
  } else {
    getSessionWithUser = getSession;
  }
  const result = await handleGetHashtagGroupUsage({ req, getSession: getSessionWithUser, prisma });
  return NextResponse.json(result.body, { status: result.status });
} 