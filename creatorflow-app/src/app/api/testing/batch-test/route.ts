/**
 * Testing API - Batch Test Endpoint
 * Handles running multiple tests simultaneously
 */

import { NextRequest, NextResponse } from 'next/server';
import { getTestingEngine } from '@/lib/testing/testing-engine';

export async function POST(request: NextRequest) {
  try {
    const { 
      platforms, 
      testTypes, 
      environment = 'localhost',
      parallel = true 
    } = await request.json();

    if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
      return NextResponse.json(
        { error: 'Platforms array is required' },
        { status: 400 }
      );
    }

    if (!testTypes || !Array.isArray(testTypes) || testTypes.length === 0) {
      return NextResponse.json(
        { error: 'TestTypes array is required' },
        { status: 400 }
      );
    }

    const testingEngine = getTestingEngine();
    testingEngine.updateConfiguration({ environment });

    const results = [];

    if (parallel) {
      // Run all tests in parallel
      const promises = [];
      for (const platform of platforms) {
        for (const testType of testTypes) {
          promises.push(testingEngine.runTest(platform, testType));
        }
      }
      const parallelResults = await Promise.all(promises);
      results.push(...parallelResults);
    } else {
      // Run tests sequentially
      for (const platform of platforms) {
        for (const testType of testTypes) {
          const result = await testingEngine.runTest(platform, testType);
          results.push(result);
        }
      }
    }

    return NextResponse.json({
      success: true,
      results,
      summary: testingEngine.getTestSummary()
    });

  } catch (error) {
    console.error('Batch testing API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to run batch tests',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
