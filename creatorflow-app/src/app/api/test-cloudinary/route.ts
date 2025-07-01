import { NextRequest, NextResponse } from 'next/server';
import { cloudinaryService } from '@/lib/cloudinary';

export async function GET(request: NextRequest) {
  try {
    // Test Cloudinary configuration
    const testResult = {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY ? '***configured***' : 'missing',
      apiSecret: process.env.CLOUDINARY_API_SECRET ? '***configured***' : 'missing',
      status: 'ready'
    };

    return NextResponse.json({
      success: true,
      message: 'Cloudinary configuration test',
      config: testResult
    });

  } catch (error) {
    console.error('Cloudinary test error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Cloudinary configuration error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 