import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { apiKey } = await request.json();
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Encrypt the API key before storing
    // 2. Store it in a secure database associated with the user
    // 3. Never log or expose the key
    
    // For now, we'll store it in the user's session or a secure cookie
    // This is a simplified implementation - in production, use proper encryption
    
    // Test the key first
    const testResponse = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!testResponse.ok) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 400 }
      );
    }

    // Store the key securely (this is a simplified example)
    // In production, you should:
    // - Encrypt the key with a strong encryption algorithm
    // - Store it in a secure database
    // - Associate it with the user's account
    // - Implement proper key rotation and revocation
    
    const response = NextResponse.json({
      success: true,
      message: 'API key saved successfully'
    });

    // Set a secure, httpOnly cookie with the encrypted key
    // This is just an example - implement proper encryption in production
    response.cookies.set('openai_api_key', apiKey, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error saving API key:', error);
    return NextResponse.json(
      { error: 'Failed to save API key' },
      { status: 500 }
    );
  }
} 