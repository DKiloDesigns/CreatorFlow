import { NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function DELETE(
  request: Request,
  { params }: { params: { accountId: string } }
) {
  const session = await getSession();
  const accountId = params.accountId;

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!accountId) {
    return NextResponse.json({ error: 'Account ID is required' }, { status: 400 });
  }

  try {
    // Verify the account belongs to the logged-in user before deleting
    const account = await prisma.socialAccount.findUnique({
      where: { id: accountId },
      select: { userId: true },
    });

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    if (account.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete the account
    await prisma.socialAccount.delete({
      where: { id: accountId },
    });

    return NextResponse.json({ message: 'Account disconnected successfully' });
  } catch (error) {
    console.error('Error disconnecting social account:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 