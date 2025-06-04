import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/auth';
import { requireApiKey } from '@/lib/apiKeyAuth';

// GET: List all audience metrics for the user
export async function GET(req: NextRequest) {
  const apiKeyHeader = req.headers.get('x-api-key');
  let userId;
  if (apiKeyHeader) {
    const auth = await requireApiKey(req);
    if ('user' in auth) userId = auth.user.id;
    else return auth;
  } else {
    const session = await getSession(req);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    userId = session.user.id;
  }
  const metrics = await prisma.audienceMetric.findMany({ where: { userId } });
  return NextResponse.json(metrics);
}

// POST: Create a new audience metric
export async function POST(req: NextRequest) {
  const apiKeyHeader = req.headers.get('x-api-key');
  let userId;
  if (apiKeyHeader) {
    const auth = await requireApiKey(req);
    if ('user' in auth) userId = auth.user.id;
    else return auth;
  } else {
    const session = await getSession(req);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    userId = session.user.id;
  }
  const { platform, date, followers } = await req.json();
  if (!platform || !date || typeof followers !== 'number') return NextResponse.json({ error: 'platform, date, and followers are required' }, { status: 400 });
  const metric = await prisma.audienceMetric.create({ data: { userId, platform, date: new Date(date), followers } });
  return NextResponse.json(metric, { status: 201 });
}

// PUT: Update an audience metric
export async function PUT(req: NextRequest) {
  const apiKeyHeader = req.headers.get('x-api-key');
  let userId;
  if (apiKeyHeader) {
    const auth = await requireApiKey(req);
    if ('user' in auth) userId = auth.user.id;
    else return auth;
  } else {
    const session = await getSession(req);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    userId = session.user.id;
  }
  const { id, platform, date, followers } = await req.json();
  if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  const metric = await prisma.audienceMetric.update({ where: { id, userId }, data: { platform, date: date ? new Date(date) : undefined, followers } });
  return NextResponse.json(metric);
}

// DELETE: Delete an audience metric
export async function DELETE(req: NextRequest) {
  const apiKeyHeader = req.headers.get('x-api-key');
  let userId;
  if (apiKeyHeader) {
    const auth = await requireApiKey(req);
    if ('user' in auth) userId = auth.user.id;
    else return auth;
  } else {
    const session = await getSession(req);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    userId = session.user.id;
  }
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  await prisma.audienceMetric.delete({ where: { id, userId } });
  return NextResponse.json({ success: true });
} 