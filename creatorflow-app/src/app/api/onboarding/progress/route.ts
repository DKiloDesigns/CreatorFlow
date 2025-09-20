import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { OnboardingProgressTracker, createOnboardingTracker } from '@/lib/onboarding-progress';

// In-memory storage for demo purposes
// In production, this would be stored in a database
const progressStorage = new Map<string, OnboardingProgressTracker>();

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    
    // Get or create progress tracker
    let tracker = progressStorage.get(userId);
    if (!tracker) {
      tracker = createOnboardingTracker(userId);
      progressStorage.set(userId, tracker);
    }

    const progress = tracker.getProgress();
    const currentStep = tracker.getCurrentStep();
    const nextSteps = tracker.getNextSteps();
    const completionStats = tracker.getCompletionStats();
    const recommendedHelp = tracker.getRecommendedHelpResources();

    return NextResponse.json({
      success: true,
      progress,
      currentStep,
      nextSteps,
      completionStats,
      recommendedHelp,
      isComplete: tracker.isOnboardingComplete()
    });

  } catch (error) {
    console.error('Onboarding progress API error:', error);
    return NextResponse.json({ error: 'Failed to fetch onboarding progress' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const { action, stepId, metadata } = body;

    // Get or create progress tracker
    let tracker = progressStorage.get(userId);
    if (!tracker) {
      tracker = createOnboardingTracker(userId);
      progressStorage.set(userId, tracker);
    }

    switch (action) {
      case 'start_step':
        if (!stepId) {
          return NextResponse.json({ error: 'Step ID required' }, { status: 400 });
        }
        tracker.startStep(stepId);
        break;

      case 'complete_step':
        if (!stepId) {
          return NextResponse.json({ error: 'Step ID required' }, { status: 400 });
        }
        tracker.completeStep(stepId, metadata);
        break;

      case 'skip_step':
        if (!stepId) {
          return NextResponse.json({ error: 'Step ID required' }, { status: 400 });
        }
        tracker.skipStep(stepId, metadata?.reason);
        break;

      case 'record_feature_usage':
        const { featureId, featureName } = metadata || {};
        if (!featureId || !featureName) {
          return NextResponse.json({ error: 'Feature ID and name required' }, { status: 400 });
        }
        tracker.recordFeatureUsage(featureId, featureName);
        break;

      case 'complete_feature':
        const { featureId: completeFeatureId } = metadata || {};
        if (!completeFeatureId) {
          return NextResponse.json({ error: 'Feature ID required' }, { status: 400 });
        }
        tracker.completeFeature(completeFeatureId);
        break;

      case 'record_help_interaction':
        const helpInteraction = metadata;
        if (!helpInteraction) {
          return NextResponse.json({ error: 'Help interaction data required' }, { status: 400 });
        }
        tracker.recordHelpInteraction(helpInteraction);
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Update storage
    progressStorage.set(userId, tracker);

    const progress = tracker.getProgress();
    const currentStep = tracker.getCurrentStep();
    const nextSteps = tracker.getNextSteps();
    const completionStats = tracker.getCompletionStats();
    const recommendedHelp = tracker.getRecommendedHelpResources();

    return NextResponse.json({
      success: true,
      progress,
      currentStep,
      nextSteps,
      completionStats,
      recommendedHelp,
      isComplete: tracker.isOnboardingComplete()
    });

  } catch (error) {
    console.error('Onboarding progress API error:', error);
    return NextResponse.json({ error: 'Failed to update onboarding progress' }, { status: 500 });
  }
}
