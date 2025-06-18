import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/auth';
import { requireApiKey } from '@/lib/apiKeyAuth';
import { handleUnshareFolder } from '../route-logic';

// POST: Unshare a folder with a user or email
export async function POST(req: NextRequest) {
  const apiKeyHeader = req.headers.get('x-api-key');
  if (apiKeyHeader) {
    const auth = await requireApiKey(req);
    if ('user' in auth) {
      return handleUnshareFolder({ req, getSession: () => Promise.resolve(auth), prisma });
    }
    return auth;
  }
  return handleUnshareFolder({ req, getSession, prisma });
} 