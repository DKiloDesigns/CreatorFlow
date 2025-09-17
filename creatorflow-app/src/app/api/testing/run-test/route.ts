/**
 * Testing API - Run Test Endpoint
 * Handles test execution for platform validation
 */

import { NextRequest, NextResponse } from 'next/server';
import { getTestingEngine } from '@/lib/testing/testing-engine';

export async function POST(request: NextRequest) {
  try {
    const { platform, testType, environment = 'localhost' } = await request.json();

    if (!platform || !testType) {
      return NextResponse.json(
        { error: 'Platform and testType are required' },
        { status: 400 }
      );
    }

    const testingEngine = getTestingEngine();
    
    // Update configuration if environment changed
    testingEngine.updateConfiguration({ environment });

    // Run the test
    const result = await testingEngine.runTest(platform, testType);

    return NextResponse.json({
      success: true,
      result
    });

  } catch (error) {
    console.error('Testing API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to run test',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const testingEngine = getTestingEngine();
    
    return NextResponse.json({
      success: true,
      results: testingEngine.getResults(),
      platformStatuses: testingEngine.getPlatformStatuses(),
      summary: testingEngine.getTestSummary()
    });

  } catch (error) {
    console.error('Testing API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get test results',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
