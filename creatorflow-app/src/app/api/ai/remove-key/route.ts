import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // In a real application, you would:
    // 1. Remove the encrypted key from the database
    // 2. Clear any cached sessions
    // 3. Log the removal for security purposes
    
    const response = NextResponse.json({
      success: true,
      message: 'API key removed successfully'
    });

    // Clear the cookie
    response.cookies.set('openai_api_key', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Expire immediately
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error removing API key:', error);
    return NextResponse.json(
      { error: 'Failed to remove API key' },
      { status: 500 }
    );
  }
} 