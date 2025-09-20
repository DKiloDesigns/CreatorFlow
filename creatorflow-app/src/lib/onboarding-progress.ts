/**
 * Onboarding Progress Management
 * Connects onboarding system to real user data and progress
 */

export interface OnboardingProgress {
  userId: string;
  currentStep: string;
  completedSteps: string[];
  skippedSteps: string[];
  startedAt: string;
  lastUpdated: string;
  completedAt?: string;
  totalSteps: number;
  progressPercentage: number;
  userActions: UserAction[];
  featureUsage: FeatureUsage[];
  helpInteractions: HelpInteraction[];
}

export interface UserAction {
  id: string;
  stepId: string;
  action: 'completed' | 'skipped' | 'started' | 'abandoned';
  timestamp: string;
  duration?: number; // in seconds
  metadata?: Record<string, any>;
}

export interface FeatureUsage {
  featureId: string;
  featureName: string;
  firstUsed: string;
  lastUsed: string;
  usageCount: number;
  isCompleted: boolean;
  completionTimestamp?: string;
}

export interface HelpInteraction {
  id: string;
  type: 'article_viewed' | 'tutorial_started' | 'video_watched' | 'tip_dismissed' | 'search_performed';
  resourceId: string;
  resourceName: string;
  timestamp: string;
  duration?: number;
  helpful?: boolean;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  type: 'tutorial' | 'action' | 'information' | 'verification';
  required: boolean;
  prerequisites: string[];
  estimatedTime: number; // in minutes
  features: string[]; // features this step introduces
  successCriteria: {
    type: 'action_completed' | 'feature_used' | 'data_entered' | 'time_elapsed';
    value: any;
  };
  nextSteps: string[];
  helpResources: {
    articles: string[];
    tutorials: string[];
    videos: string[];
  };
}

// Enhanced onboarding steps with real progress tracking
export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to CreatorFlow',
    description: 'Get started with your CreatorFlow journey',
    type: 'information',
    required: true,
    prerequisites: [],
    estimatedTime: 1,
    features: ['dashboard'],
    successCriteria: {
      type: 'time_elapsed',
      value: 30 // 30 seconds
    },
    nextSteps: ['connect-accounts'],
    helpResources: {
      articles: ['getting-started-1'],
      tutorials: ['creating-your-first-post'],
      videos: ['getting-started-overview']
    }
  },
  {
    id: 'connect-accounts',
    title: 'Connect Your Social Media Accounts',
    description: 'Link your social media accounts to start managing content',
    type: 'action',
    required: true,
    prerequisites: ['welcome'],
    estimatedTime: 5,
    features: ['account-connection', 'social-platforms'],
    successCriteria: {
      type: 'feature_used',
      value: 'account_connected'
    },
    nextSteps: ['create-first-post'],
    helpResources: {
      articles: ['getting-started-2'],
      tutorials: ['creating-your-first-post'],
      videos: ['getting-started-overview']
    }
  },
  {
    id: 'create-first-post',
    title: 'Create Your First Post',
    description: 'Learn how to create and publish your first social media post',
    type: 'tutorial',
    required: true,
    prerequisites: ['connect-accounts'],
    estimatedTime: 10,
    features: ['content-creation', 'posting', 'media-upload'],
    successCriteria: {
      type: 'action_completed',
      value: 'post_created'
    },
    nextSteps: ['schedule-content'],
    helpResources: {
      articles: ['content-creation-1'],
      tutorials: ['creating-your-first-post'],
      videos: ['getting-started-overview']
    }
  },
  {
    id: 'schedule-content',
    title: 'Schedule Your Content',
    description: 'Learn how to schedule posts for optimal engagement',
    type: 'tutorial',
    required: true,
    prerequisites: ['create-first-post'],
    estimatedTime: 8,
    features: ['scheduling', 'content-calendar', 'optimal-timing'],
    successCriteria: {
      type: 'action_completed',
      value: 'post_scheduled'
    },
    nextSteps: ['explore-analytics'],
    helpResources: {
      articles: ['content-creation-1'],
      tutorials: ['setting-up-content-calendar'],
      videos: ['content-calendar-setup']
    }
  },
  {
    id: 'explore-analytics',
    title: 'Explore Your Analytics',
    description: 'Understand your content performance and audience insights',
    type: 'tutorial',
    required: false,
    prerequisites: ['create-first-post'],
    estimatedTime: 6,
    features: ['analytics', 'performance-tracking', 'audience-insights'],
    successCriteria: {
      type: 'feature_used',
      value: 'analytics_viewed'
    },
    nextSteps: ['set-up-team'],
    helpResources: {
      articles: ['analytics-1'],
      tutorials: ['analyzing-performance-metrics'],
      videos: ['analytics-deep-dive']
    }
  },
  {
    id: 'set-up-team',
    title: 'Set Up Your Team (Optional)',
    description: 'Invite team members and set up collaboration workflows',
    type: 'action',
    required: false,
    prerequisites: ['create-first-post'],
    estimatedTime: 5,
    features: ['team-management', 'collaboration', 'user-roles'],
    successCriteria: {
      type: 'feature_used',
      value: 'team_member_invited'
    },
    nextSteps: ['explore-ai-tools'],
    helpResources: {
      articles: ['account-billing-1'],
      tutorials: [],
      videos: ['team-collaboration']
    }
  },
  {
    id: 'explore-ai-tools',
    title: 'Explore AI Content Tools',
    description: 'Discover how AI can help you create better content faster',
    type: 'tutorial',
    required: false,
    prerequisites: ['create-first-post'],
    estimatedTime: 12,
    features: ['ai-content-generation', 'hashtag-research', 'content-optimization'],
    successCriteria: {
      type: 'feature_used',
      value: 'ai_tool_used'
    },
    nextSteps: ['customize-settings'],
    helpResources: {
      articles: ['content-creation-2'],
      tutorials: ['using-ai-content-generator'],
      videos: ['ai-content-generation']
    }
  },
  {
    id: 'customize-settings',
    title: 'Customize Your Settings',
    description: 'Personalize your CreatorFlow experience',
    type: 'action',
    required: false,
    prerequisites: ['welcome'],
    estimatedTime: 3,
    features: ['settings', 'preferences', 'notifications'],
    successCriteria: {
      type: 'feature_used',
      value: 'settings_updated'
    },
    nextSteps: ['onboarding-complete'],
    helpResources: {
      articles: ['account-billing-1'],
      tutorials: [],
      videos: []
    }
  },
  {
    id: 'onboarding-complete',
    title: 'Onboarding Complete!',
    description: 'You\'re all set up and ready to create amazing content',
    type: 'information',
    required: true,
    prerequisites: ['create-first-post'],
    estimatedTime: 1,
    features: ['dashboard'],
    successCriteria: {
      type: 'time_elapsed',
      value: 30
    },
    nextSteps: [],
    helpResources: {
      articles: ['getting-started-3'],
      tutorials: [],
      videos: []
    }
  }
];

// Progress tracking functions
export class OnboardingProgressTracker {
  private progress: OnboardingProgress;

  constructor(userId: string) {
    this.progress = {
      userId,
      currentStep: 'welcome',
      completedSteps: [],
      skippedSteps: [],
      startedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      totalSteps: ONBOARDING_STEPS.length,
      progressPercentage: 0,
      userActions: [],
      featureUsage: [],
      helpInteractions: []
    };
  }

  // Step management
  startStep(stepId: string): void {
    const step = ONBOARDING_STEPS.find(s => s.id === stepId);
    if (!step) return;

    this.progress.currentStep = stepId;
    this.progress.lastUpdated = new Date().toISOString();

    this.addUserAction({
      id: `action_${Date.now()}`,
      stepId,
      action: 'started',
      timestamp: new Date().toISOString()
    });

    this.updateProgress();
  }

  completeStep(stepId: string, metadata?: Record<string, any>): void {
    if (!this.progress.completedSteps.includes(stepId)) {
      this.progress.completedSteps.push(stepId);
    }

    this.progress.lastUpdated = new Date().toISOString();

    this.addUserAction({
      id: `action_${Date.now()}`,
      stepId,
      action: 'completed',
      timestamp: new Date().toISOString(),
      metadata
    });

    // Mark features as used
    const step = ONBOARDING_STEPS.find(s => s.id === stepId);
    if (step) {
      step.features.forEach(featureId => {
        this.recordFeatureUsage(featureId, step.title);
      });
    }

    // Move to next step
    this.moveToNextStep(stepId);
    this.updateProgress();
  }

  skipStep(stepId: string, reason?: string): void {
    if (!this.progress.skippedSteps.includes(stepId)) {
      this.progress.skippedSteps.push(stepId);
    }

    this.progress.lastUpdated = new Date().toISOString();

    this.addUserAction({
      id: `action_${Date.now()}`,
      stepId,
      action: 'skipped',
      timestamp: new Date().toISOString(),
      metadata: { reason }
    });

    this.moveToNextStep(stepId);
    this.updateProgress();
  }

  // Feature usage tracking
  recordFeatureUsage(featureId: string, featureName: string): void {
    const existing = this.progress.featureUsage.find(f => f.featureId === featureId);
    
    if (existing) {
      existing.lastUsed = new Date().toISOString();
      existing.usageCount++;
    } else {
      this.progress.featureUsage.push({
        featureId,
        featureName,
        firstUsed: new Date().toISOString(),
        lastUsed: new Date().toISOString(),
        usageCount: 1,
        isCompleted: false
      });
    }
  }

  completeFeature(featureId: string): void {
    const feature = this.progress.featureUsage.find(f => f.featureId === featureId);
    if (feature) {
      feature.isCompleted = true;
      feature.completionTimestamp = new Date().toISOString();
    }
  }

  // Help interaction tracking
  recordHelpInteraction(interaction: Omit<HelpInteraction, 'id' | 'timestamp'>): void {
    this.progress.helpInteractions.push({
      id: `help_${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...interaction
    });
  }

  // Progress calculation
  private updateProgress(): void {
    const completedCount = this.progress.completedSteps.length;
    this.progress.progressPercentage = Math.round((completedCount / this.progress.totalSteps) * 100);

    // Check if onboarding is complete
    const requiredSteps = ONBOARDING_STEPS.filter(s => s.required);
    const completedRequiredSteps = requiredSteps.filter(s => 
      this.progress.completedSteps.includes(s.id)
    );

    if (completedRequiredSteps.length === requiredSteps.length) {
      this.progress.completedAt = new Date().toISOString();
    }
  }

  // Navigation
  private moveToNextStep(currentStepId: string): void {
    const currentStep = ONBOARDING_STEPS.find(s => s.id === currentStepId);
    if (!currentStep || currentStep.nextSteps.length === 0) return;

    // Find the next available step
    const nextStepId = currentStep.nextSteps.find(stepId => {
      const step = ONBOARDING_STEPS.find(s => s.id === stepId);
      if (!step) return false;

      // Check if prerequisites are met
      return step.prerequisites.every(prereq => 
        this.progress.completedSteps.includes(prereq)
      );
    });

    if (nextStepId) {
      this.progress.currentStep = nextStepId;
    }
  }

  // Utility methods
  private addUserAction(action: Omit<UserAction, 'id' | 'timestamp'>): void {
    this.progress.userActions.push({
      id: `action_${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...action
    });
  }

  // Getters
  getProgress(): OnboardingProgress {
    return { ...this.progress };
  }

  getCurrentStep(): OnboardingStep | undefined {
    return ONBOARDING_STEPS.find(s => s.id === this.progress.currentStep);
  }

  getNextSteps(): OnboardingStep[] {
    const currentStep = this.getCurrentStep();
    if (!currentStep) return [];

    return currentStep.nextSteps
      .map(stepId => ONBOARDING_STEPS.find(s => s.id === stepId))
      .filter((step): step is OnboardingStep => step !== undefined);
  }

  getRecommendedHelpResources(): { articles: string[]; tutorials: string[]; videos: string[] } {
    const currentStep = this.getCurrentStep();
    if (!currentStep) return { articles: [], tutorials: [], videos: [] };

    return currentStep.helpResources;
  }

  isOnboardingComplete(): boolean {
    return !!this.progress.completedAt;
  }

  getCompletionStats(): {
    totalSteps: number;
    completedSteps: number;
    skippedSteps: number;
    progressPercentage: number;
    estimatedTimeRemaining: number;
  } {
    const completedCount = this.progress.completedSteps.length;
    const skippedCount = this.progress.skippedSteps.length;
    const remainingSteps = ONBOARDING_STEPS.filter(s => 
      !this.progress.completedSteps.includes(s.id) && 
      !this.progress.skippedSteps.includes(s.id)
    );

    const estimatedTimeRemaining = remainingSteps.reduce((total, step) => 
      total + step.estimatedTime, 0
    );

    return {
      totalSteps: this.progress.totalSteps,
      completedSteps: completedCount,
      skippedSteps: skippedCount,
      progressPercentage: this.progress.progressPercentage,
      estimatedTimeRemaining
    };
  }
}

// Helper functions
export function createOnboardingTracker(userId: string): OnboardingProgressTracker {
  return new OnboardingProgressTracker(userId);
}

export function getOnboardingStep(stepId: string): OnboardingStep | undefined {
  return ONBOARDING_STEPS.find(s => s.id === stepId);
}

export function getAllOnboardingSteps(): OnboardingStep[] {
  return [...ONBOARDING_STEPS];
}

export function getRequiredOnboardingSteps(): OnboardingStep[] {
  return ONBOARDING_STEPS.filter(s => s.required);
}

export function getOptionalOnboardingSteps(): OnboardingStep[] {
  return ONBOARDING_STEPS.filter(s => !s.required);
}
