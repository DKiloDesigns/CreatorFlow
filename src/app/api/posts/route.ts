import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Post } from '@prisma/client';

// ... existing code ...

type PostWithDetails = Post & {
  user: {
    socialAccounts: Array<{
      provider: string;
      providerAccountId: string;
    }>;
  };
};

type PostResponse = {
  success: boolean;
  message?: string;
  data?: PostWithDetails;
};

export async function DELETE(_req: Request) {
  try {
    // ... existing code ...
    return NextResponse.json<PostResponse>({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    return NextResponse.json<PostResponse>({
      success: false,
      message: 'Failed to delete post'
    }, { status: 500 });
  }
} 