import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/auth';
import { requireApiKey } from '@/lib/apiKeyAuth';
import {
  handleGetFolders,
  handleCreateFolder,
  handleUpdateFolder,
  handleDeleteFolder,
} from './route-logic';

// GET: List all folders for the user (flat)
export async function GET(req: NextRequest) {
  const apiKeyHeader = req.headers.get('x-api-key');
  if (apiKeyHeader) {
    const auth = await requireApiKey(req);
    if ('user' in auth) {
      return handleGetFolders({ req, getSession: () => Promise.resolve(auth), prisma });
    }
    return auth;
  }
  return handleGetFolders({ req, getSession, prisma });
}

// POST: Create a new folder
export async function POST(req: NextRequest) {
  const apiKeyHeader = req.headers.get('x-api-key');
  if (apiKeyHeader) {
    const auth = await requireApiKey(req);
    if ('user' in auth) {
      return handleCreateFolder({ req, getSession: () => Promise.resolve(auth), prisma });
    }
    return auth;
  }
  return handleCreateFolder({ req, getSession, prisma });
}

// PUT: Rename or move a folder
export async function PUT(req: NextRequest) {
  const apiKeyHeader = req.headers.get('x-api-key');
  if (apiKeyHeader) {
    const auth = await requireApiKey(req);
    if ('user' in auth) {
      return handleUpdateFolder({ req, getSession: () => Promise.resolve(auth), prisma });
    }
    return auth;
  }
  return handleUpdateFolder({ req, getSession, prisma });
}

// DELETE: Delete a folder
export async function DELETE(req: NextRequest) {
  const apiKeyHeader = req.headers.get('x-api-key');
  if (apiKeyHeader) {
    const auth = await requireApiKey(req);
    if ('user' in auth) {
      return handleDeleteFolder({ req, getSession: () => Promise.resolve(auth), prisma });
    }
    return auth;
  }
  return handleDeleteFolder({ req, getSession, prisma });
}