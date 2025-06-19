import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { hasKey: false },
        { status: 401 }
      );
    }

    // Check if the user has an API key stored
    // In a real application, you would check the database
    // For now, we'll check if the environment variable is set
    const hasKey = !!process.env.NEXT_PUBLIC_OPENAI_API_KEY;

    return NextResponse.json({
      hasKey,
      message: hasKey ? 'API key is configured' : 'No API key found'
    });
  } catch (error) {
    console.error('Error checking API key:', error);
    return NextResponse.json(
      { hasKey: false },
      { status: 500 }
    );
  }
} 