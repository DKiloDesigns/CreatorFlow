import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { prisma } from '@/lib/prisma';
import { requireApiKey } from '@/lib/apiKeyAuth';

// GET: List teams for the authenticated user (owner or member)
export async function GET(req: NextRequest) {
  // API key auth
  const apiKeyHeader = req.headers.get('x-api-key');
  if (apiKeyHeader) {
    const auth = await requireApiKey(req);
    if ('user' in auth) {
      const userId = auth.user.id;
      const teams = await prisma.team.findMany({
        where: {
          OR: [
            { ownerId: userId },
            { members: { some: { userId } } },
          ],
        },
        include: {
          members: true,
          invitations: true,
          workspaces: true,
        },
      });
      return NextResponse.json(teams);
    } else {
      return auth;
    }
  }
  // Session auth
  const session = await getSession(req);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;
  const teams = await prisma.team.findMany({
    where: {
      OR: [
        { ownerId: userId },
        { members: { some: { userId } } },
      ],
    },
    include: {
      members: true,
      invitations: true,
      workspaces: true,
    },
  });
  return NextResponse.json(teams);
}

// POST: Create a new team (owner = current user)
export async function POST(req: NextRequest) {
  // API key auth
  const apiKeyHeader = req.headers.get('x-api-key');
  if (apiKeyHeader) {
    const auth = await requireApiKey(req);
    if ('user' in auth) {
      const userId = auth.user.id;
      const data = await req.json();
      try {
        const team = await prisma.team.create({
          data: {
            ...data,
            ownerId: userId,
            members: {
              create: [{ userId, role: 'OWNER' }],
            },
          },
        });
        return NextResponse.json(team);
      } catch (error) {
        return NextResponse.json({ error: 'Failed to create team', details: error }, { status: 500 });
      }
    } else {
      return auth;
    }
  }
  // Session auth
  const session = await getSession(req);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;
  const data = await req.json();
  try {
    const team = await prisma.team.create({
      data: {
        ...data,
        ownerId: userId,
        members: {
          create: [{ userId, role: 'OWNER' }],
        },
      },
    });
    return NextResponse.json(team);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create team', details: error }, { status: 500 });
  }
} 