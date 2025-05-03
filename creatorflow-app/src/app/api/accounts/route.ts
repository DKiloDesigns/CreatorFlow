import { NextResponse } from 'next/server';
import { auth } from '@/auth'; // Assuming auth is correctly configured in src/auth.ts
import { PrismaClient } from '@/generated/prisma'; // Updated import path based on generate output

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const socialAccounts = await prisma.socialAccount.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        platform: true,
        username: true,
        status: true,
        createdAt: true,
        // Do NOT return tokens here
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json(socialAccounts);
  } catch (error) {
    console.error('Error fetching social accounts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client
  }
} 