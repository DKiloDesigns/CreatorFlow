import { NextRequest, NextResponse } from 'next/server';
import { prisma } from './prisma';

export async function requireApiKey(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key');
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 401 });
  }
  const keyRecord = await prisma.apiKey.findUnique({ where: { key: apiKey }, include: { user: true } });
  if (!keyRecord) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }
  if (keyRecord.revokedAt) {
    return NextResponse.json({ error: 'API key revoked' }, { status: 403 });
  }
  // Attach user to request (for downstream handlers)
  return { user: keyRecord.user, apiKey: keyRecord };
} 