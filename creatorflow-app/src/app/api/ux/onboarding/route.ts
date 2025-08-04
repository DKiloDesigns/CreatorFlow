import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { uxManager } from '@/lib/ux-manager';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const steps = await uxManager.getOnboardingSteps(session.user.id);
    const progress = await uxManager.getOnboardingProgress(session.user.id);

    return NextResponse.json({
      success: true,
      steps,
      progress,
    });

  } catch (error) {
    console.error('Get onboarding error:', error);
    return NextResponse.json({ error: 'Failed to get onboarding data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { stepId } = await req.json();

    if (!stepId) {
      return NextResponse.json({ error: 'Step ID required' }, { status: 400 });
    }

    await uxManager.completeOnboardingStep(session.user.id, stepId);

    // Get updated progress
    const progress = await uxManager.getOnboardingProgress(session.user.id);

    return NextResponse.json({
      success: true,
      message: 'Onboarding step completed',
      progress,
    });

  } catch (error) {
    console.error('Complete onboarding step error:', error);
    return NextResponse.json({ error: 'Failed to complete onboarding step' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { steps } = await req.json();

    if (!Array.isArray(steps)) {
      return NextResponse.json({ error: 'Invalid steps format' }, { status: 400 });
    }

    // Update multiple onboarding steps
    for (const step of steps) {
      const { id, completed } = step;
      if (id && completed) {
        await uxManager.completeOnboardingStep(session.user.id, id);
      }
    }

    // Get updated progress
    const progress = await uxManager.getOnboardingProgress(session.user.id);

    return NextResponse.json({
      success: true,
      message: 'Onboarding steps updated',
      progress,
    });

  } catch (error) {
    console.error('Update onboarding steps error:', error);
    return NextResponse.json({ error: 'Failed to update onboarding steps' }, { status: 500 });
  }
} 