import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { testingFramework } from '@/lib/testing-framework';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const suiteId = searchParams.get('suiteId');
    const testId = searchParams.get('testId');
    const type = searchParams.get('type');

    if (suiteId) {
      // Get specific test suite
      const suite = await prisma.testSuite.findUnique({
        where: { id: suiteId },
        include: {
          tests: {
            include: {
              results: {
                orderBy: { timestamp: 'desc' },
                take: 5,
              },
            },
          },
        },
      });

      if (!suite) {
        return NextResponse.json({ error: 'Test suite not found' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        suite: {
          ...suite,
          tests: suite.tests.map(test => ({
            ...test,
            metadata: JSON.parse(test.metadata),
            results: test.results.map(result => ({
              ...result,
              metadata: JSON.parse(result.metadata),
            })),
          })),
        },
      });
    }

    if (testId) {
      // Get specific test
      const test = await prisma.test.findUnique({
        where: { id: testId },
        include: {
          suite: true,
          results: {
            orderBy: { timestamp: 'desc' },
            take: 10,
          },
        },
      });

      if (!test) {
        return NextResponse.json({ error: 'Test not found' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        test: {
          ...test,
          metadata: JSON.parse(test.metadata),
          results: test.results.map(result => ({
            ...result,
            metadata: JSON.parse(result.metadata),
          })),
        },
      });
    }

    if (type === 'metrics') {
      // Get test metrics
      const metrics = await testingFramework.getTestMetrics();
      return NextResponse.json({
        success: true,
        metrics,
      });
    }

    // Get all test suites
    const suites = await prisma.testSuite.findMany({
      include: {
        tests: {
          include: {
            results: {
              orderBy: { timestamp: 'desc' },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedSuites = suites.map(suite => ({
      ...suite,
      tests: suite.tests.map(test => ({
        ...test,
        metadata: JSON.parse(test.metadata),
        results: test.results.map(result => ({
          ...result,
          metadata: JSON.parse(result.metadata),
        })),
      })),
    }));

    return NextResponse.json({
      success: true,
      suites: formattedSuites,
      count: formattedSuites.length,
    });

  } catch (error) {
    console.error('Get testing error:', error);
    return NextResponse.json({ error: 'Failed to get testing data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, data } = await req.json();

    switch (action) {
      case 'create_suite':
        const suite = await testingFramework.createTestSuite(data);
        return NextResponse.json({
          success: true,
          suite,
          message: 'Test suite created successfully',
        });

      case 'add_test':
        const test = await testingFramework.addTest(data.suiteId, data.test);
        return NextResponse.json({
          success: true,
          test,
          message: 'Test added successfully',
        });

      case 'run_test':
        const testResult = await testingFramework.runTest(data.testId);
        return NextResponse.json({
          success: true,
          result: testResult,
          message: 'Test executed successfully',
        });

      case 'run_suite':
        const suiteResult = await testingFramework.runTestSuite(data.suiteId);
        return NextResponse.json({
          success: true,
          result: suiteResult,
          message: 'Test suite executed successfully',
        });

      case 'run_continuous':
        const continuousResult = await testingFramework.runContinuousTests();
        return NextResponse.json({
          success: true,
          result: continuousResult,
          message: 'Continuous tests executed successfully',
        });

      case 'generate_report':
        const report = await testingFramework.generateTestReport(data.suiteId);
        return NextResponse.json({
          success: true,
          report,
          message: 'Test report generated successfully',
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Testing POST error:', error);
    return NextResponse.json({ error: 'Failed to process testing action' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { testId, updates } = await req.json();

    if (!testId) {
      return NextResponse.json({ error: 'Test ID required' }, { status: 400 });
    }

    // Update test
    const updatedTest = await prisma.test.update({
      where: { id: testId },
      data: {
        name: updates.name,
        description: updates.description,
        metadata: updates.metadata ? JSON.stringify(updates.metadata) : undefined,
      },
      include: {
        suite: true,
        results: {
          orderBy: { timestamp: 'desc' },
          take: 5,
        },
      },
    });

    return NextResponse.json({
      success: true,
      test: {
        ...updatedTest,
        metadata: JSON.parse(updatedTest.metadata),
        results: updatedTest.results.map(result => ({
          ...result,
          metadata: JSON.parse(result.metadata),
        })),
      },
      message: 'Test updated successfully',
    });

  } catch (error) {
    console.error('Update test error:', error);
    return NextResponse.json({ error: 'Failed to update test' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const testId = searchParams.get('testId');
    const suiteId = searchParams.get('suiteId');

    if (testId) {
      // Delete specific test
      await prisma.test.delete({
        where: { id: testId },
      });

      return NextResponse.json({
        success: true,
        message: 'Test deleted successfully',
      });
    }

    if (suiteId) {
      // Delete test suite and all its tests
      await prisma.testSuite.delete({
        where: { id: suiteId },
      });

      return NextResponse.json({
        success: true,
        message: 'Test suite deleted successfully',
      });
    }

    return NextResponse.json({ error: 'Test ID or Suite ID required' }, { status: 400 });

  } catch (error) {
    console.error('Delete test error:', error);
    return NextResponse.json({ error: 'Failed to delete test' }, { status: 500 });
  }
} 