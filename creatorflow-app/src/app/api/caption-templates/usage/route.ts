import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/auth';
import { requireApiKey } from '@/lib/apiKeyAuth';
import { handleRecordCaptionTemplateUsage, handleGetCaptionTemplateUsage } from './route-logic';

// POST: Record a usage event
export async function POST(req: NextRequest) {
  const apiKeyHeader = req.headers.get('x-api-key');
  let userId;
  let getSessionWithUser;
  if (apiKeyHeader) {
    const auth = await requireApiKey(req);
    if ('user' in auth) userId = auth.user.id;
    else return auth;
    // Wrap getSession to return userId from API key
    getSessionWithUser = async () => ({ user: { id: userId } });
  } else {
    getSessionWithUser = getSession;
  }
  const result = await handleRecordCaptionTemplateUsage({ req, getSession: getSessionWithUser, prisma });
  return NextResponse.json(result.body, { status: result.status });
}

// GET: Usage stats/history for a template
export async function GET(req: NextRequest) {
  const apiKeyHeader = req.headers.get('x-api-key');
  let userId;
  let getSessionWithUser;
  if (apiKeyHeader) {
    const auth = await requireApiKey(req);
    if ('user' in auth) userId = auth.user.id;
    else return auth;
    getSessionWithUser = async () => ({ user: { id: userId } });
  } else {
    getSessionWithUser = getSession;
  }
  const result = await handleGetCaptionTemplateUsage({ req, getSession: getSessionWithUser, prisma });
  return NextResponse.json(result.body, { status: result.status });
} 