/**
 * OAuth Testing API Endpoint
 * Test OAuth flows for all 16 social media platforms
 */

import { NextRequest, NextResponse } from 'next/server';
import { OAuthTestingEngine } from '@/lib/testing/oauth-testing-engine';

export async function GET(request: NextRequest) {
  try {
    const testingEngine = new OAuthTestingEngine();
    
    // Test all platforms
    const results = await testingEngine.testAllPlatforms();
    const summary = testingEngine.getSummary();
    
    return NextResponse.json({
      success: true,
      message: 'OAuth testing completed',
      summary,
      results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('OAuth testing error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'OAuth testing failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { platform, accessToken } = await request.json();
    
    if (!platform || !accessToken) {
      return NextResponse.json({
        success: false,
        message: 'Platform and access token are required'
      }, { status: 400 });
    }

    const testingEngine = new OAuthTestingEngine();
    const result = await testingEngine.testActualPosting(platform, accessToken);
    
    return NextResponse.json({
      success: true,
      message: 'OAuth posting test completed',
      result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('OAuth posting test error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'OAuth posting test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
