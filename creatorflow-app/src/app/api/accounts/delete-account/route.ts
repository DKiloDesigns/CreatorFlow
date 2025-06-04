import { NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Using a completely different approach with a different route
export async function POST(
  req: Request,
) {
  try {
    // Get the account ID from the request body
    const { accountId } = await req.json();
    
    if (!accountId) {
      return NextResponse.json({ error: 'Account ID is required' }, { status: 400 });
    }
    
    // Get the user session
    const session = await getSession();
    
    // Check if the user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Delete the account
    await prisma.socialAccount.delete({
      where: {
        id: accountId,
        userId: session.user.id
      }
    });
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
  }
}