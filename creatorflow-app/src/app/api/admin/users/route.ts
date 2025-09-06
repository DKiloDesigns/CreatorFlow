import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { AdminUtils } from '@/lib/admin-utils';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const isAdmin = await AdminUtils.isAdmin(session.user.id);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const users = await AdminUtils.getAllUsers();
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const isAdmin = await AdminUtils.isAdmin(session.user.id);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const { action, userId } = await req.json();

    if (!action || !userId) {
      return NextResponse.json(
        { error: 'Missing action or userId' },
        { status: 400 }
      );
    }

    let result;
    switch (action) {
      case 'promote':
        result = await AdminUtils.promoteToAdmin(userId, session.user.id);
        break;
      case 'demote':
        result = await AdminUtils.demoteFromAdmin(userId, session.user.id);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing user action:', error);
    return NextResponse.json(
      { error: 'Failed to process user action' },
      { status: 500 }
    );
  }
}