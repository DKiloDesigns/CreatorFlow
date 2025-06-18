import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/auth';
import { requireApiKey } from '@/lib/apiKeyAuth';
import { handleRestoreFolder } from '../route-logic';

// POST: Restore a soft-deleted folder
export async function POST(req: NextRequest) {
  const apiKeyHeader = req.headers.get('x-api-key');
  if (apiKeyHeader) {
    const auth = await requireApiKey(req);
    if ('user' in auth) {
      return handleRestoreFolder({ req, getSession: () => Promise.resolve(auth), prisma });
    }
    return auth;
  }
  return handleRestoreFolder({ req, getSession, prisma });
} 