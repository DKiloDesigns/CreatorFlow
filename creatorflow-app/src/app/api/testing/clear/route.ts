/**
 * Testing API - Clear Results Endpoint
 * Clears all test results and resets platform statuses
 */

import { NextRequest, NextResponse } from 'next/server';
import { getTestingEngine } from '@/lib/testing/testing-engine';

export async function POST(request: NextRequest) {
  try {
    const testingEngine = getTestingEngine();
    testingEngine.clearResults();

    return NextResponse.json({
      success: true,
      message: 'Test results cleared successfully'
    });

  } catch (error) {
    console.error('Clear testing API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to clear test results',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
