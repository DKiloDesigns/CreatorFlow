import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json();
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    // Test the API key by making a simple request to OpenAI
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'API key is valid'
      });
    } else {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { 
          success: false,
          error: errorData.error?.message || 'Invalid API key'
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error testing API key:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to test API key. Please check your connection.'
      },
      { status: 500 }
    );
  }
} 