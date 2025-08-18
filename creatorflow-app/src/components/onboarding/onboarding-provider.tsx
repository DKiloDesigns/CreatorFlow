"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Onboarding step interface
interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
  order: number;
  feature: string;
  tips: string[];
  actions: {
    label: string;
    action: string;
    route?: string;
  }[];
}

// User progress interface
interface UserProgress {
  userId: string;
  phase: number;
  currentStep: string;
  completedSteps: string[];
  totalSteps: number;
  progress: number;
  lastActive: Date;
  preferences: {
    showTips: boolean;
    autoAdvance: boolean;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
  };
}

// Onboarding context interface
interface OnboardingContextType {
  userProgress: UserProgress | null;
  currentStep: OnboardingStep | null;
  nextStep: OnboardingStep | null;
  isLoading: boolean;
  error: string | null;
  completeStep: (stepId: string) => Promise<void>;
  skipStep: (stepId: string) => Promise<void>;
  resetProgress: () => Promise<void>;
  updatePreferences: (preferences: Partial<UserProgress['preferences']>) => Promise<void>;
  showTip: (tipId: string) => void;
  hideTip: (tipId: string) => void;
}

// Create context
const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

// Onboarding steps configuration
const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome-phase2',
    title: 'Welcome to Phase 2',
    description: 'Get started with AI-enhanced content creation',
    completed: false,
    required: true,
    order: 1,
    feature: 'phase2-overview',
    tips: [
      'Phase 2 introduces AI-powered tools for content creation',
      'Start with AI Content Creation to get familiar with the features',
      'Each tool is designed to work with your existing workflow'
    ],
    actions: [
      { label: 'Get Started', action: 'navigate', route: '/dashboard/phase2-hub' }
    ]
  },
  {
    id: 'ai-content-creation',
    title: 'AI Content Creation',
    description: 'Create your first AI-optimized piece of content',
    completed: false,
    required: true,
    order: 2,
    feature: 'ai-content-creation',
    tips: [
      'Select your content type (post, story, article, video)',
      'Enable AI optimization for performance predictions',
      'Use the insights to improve your content before publishing'
    ],
    actions: [
      { label: 'Create Content', action: 'navigate', route: '/dashboard/phase2-hub/ai-content-creation' },
      { label: 'Learn More', action: 'show-tutorial' }
    ]
  },
  {
    id: 'smart-scheduling',
    title: 'Smart Scheduling',
    description: 'Set up AI-powered optimal timing and scheduling rules',
    completed: false,
    required: true,
    order: 3,
    feature: 'smart-scheduling',
    tips: [
      'Review AI-optimized posting times for your platforms',
      'Create scheduling rules for consistent posting',
      'Monitor audience activity patterns for better timing'
    ],
    actions: [
      { label: 'Set Up Scheduling', action: 'navigate', route: '/dashboard/phase2-hub/smart-scheduling' },
      { label: 'View Tutorial', action: 'show-tutorial' }
    ]
  },
  {
    id: 'performance-tracking',
    title: 'Performance Tracking',
    description: 'Monitor your content performance with AI insights',
    completed: false,
    required: true,
    order: 4,
    feature: 'performance-tracking',
    tips: [
      'Review key performance metrics and AI insights',
      'Analyze content performance to identify top performers',
      'Use trend analysis to predict future performance'
    ],
    actions: [
      { label: 'View Analytics', action: 'navigate', route: '/dashboard/phase2-hub/performance-tracking' },
      { label: 'Export Report', action: 'export' }
    ]
  },
  {
    id: 'first-ai-optimization',
    title: 'First AI Optimization',
    description: 'Use AI to optimize an existing piece of content',
    completed: false,
    required: false,
    order: 5,
    feature: 'ai-optimization',
    tips: [
      'Select a piece of content you want to improve',
      'Let AI analyze and provide optimization suggestions',
      'Apply the recommendations and measure the improvement'
    ],
    actions: [
      { label: 'Optimize Content', action: 'navigate', route: '/dashboard/phase2-hub/ai-content-creation' },
      { label: 'Skip for Now', action: 'skip' }
    ]
  },
  {
    id: 'create-scheduling-rule',
    title: 'Create Scheduling Rule',
    description: 'Set up your first automated scheduling rule',
    completed: false,
    required: false,
    order: 6,
    feature: 'smart-scheduling',
    tips: [
      'Choose platforms and content types for your rule',
      'Set frequency and timing preferences',
      'Test the rule with a small batch of content first'
    ],
    actions: [
      { label: 'Create Rule', action: 'navigate', route: '/dashboard/phase2-hub/smart-scheduling' },
      { label: 'Skip for Now', action: 'skip' }
    ]
  },
  {
    id: 'phase2-completion',
    title: 'Phase 2 Complete!',
    description: 'Congratulations! You\'ve mastered AI-enhanced content creation',
    completed: false,
    required: true,
    order: 7,
    feature: 'phase2-overview',
    tips: [
      'You now have access to all Phase 2 features',
      'Continue using AI tools to improve your content performance',
      'Ready for Phase 3: Advanced AI & Automation'
    ],
    actions: [
      { label: 'Continue to Phase 3', action: 'navigate', route: '/dashboard' },
      { label: 'Review Progress', action: 'show-progress' }
    ]
  }
];

// Provider component
interface OnboardingProviderProps {
  children: ReactNode;
  userId?: string;
}

export function OnboardingProvider({ children, userId }: OnboardingProviderProps) {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleTips, setVisibleTips] = useState<Set<string>>(new Set());

  // Initialize user progress
  useEffect(() => {
    const initializeProgress = async () => {
      try {
        setIsLoading(true);
        
        if (userId) {
          // TODO: Fetch user progress from API
          // const response = await fetch(`/api/onboarding/progress/${userId}`);
          // const progress = await response.json();
          
          // Mock user progress for now
          const mockProgress: UserProgress = {
            userId,
            phase: 2,
            currentStep: 'welcome-phase2',
            completedSteps: [],
            totalSteps: ONBOARDING_STEPS.length,
            progress: 0,
            lastActive: new Date(),
            preferences: {
              showTips: true,
              autoAdvance: false,
              difficulty: 'beginner'
            }
          };
          
          setUserProgress(mockProgress);
        } else {
          // Guest user - create temporary progress
          const guestProgress: UserProgress = {
            userId: 'guest',
            phase: 2,
            currentStep: 'welcome-phase2',
            completedSteps: [],
            totalSteps: ONBOARDING_STEPS.length,
            progress: 0,
            lastActive: new Date(),
            preferences: {
              showTips: true,
              autoAdvance: false,
              difficulty: 'beginner'
            }
          };
          
          setUserProgress(guestProgress);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load onboarding progress');
      } finally {
        setIsLoading(false);
      }
    };

    initializeProgress();
  }, [userId]);

  // Get current step
  const currentStep = userProgress ? 
    ONBOARDING_STEPS.find(step => step.id === userProgress.currentStep) || null : null;

  // Get next step
  const nextStep = userProgress ? 
    ONBOARDING_STEPS.find(step => 
      step.order === (currentStep?.order || 0) + 1 && !step.completed
    ) || null : null;

  // Complete a step
  const completeStep = async (stepId: string) => {
    if (!userProgress) return;

    try {
      // TODO: Update progress via API
      // await fetch(`/api/onboarding/progress/${userId}`, {
      //   method: 'PUT',
      //   body: JSON.stringify({ completedSteps: [...userProgress.completedSteps, stepId] })
      // });

      const updatedProgress = {
        ...userProgress,
        completedSteps: [...userProgress.completedSteps, stepId],
        progress: Math.round(((userProgress.completedSteps.length + 1) / userProgress.totalSteps) * 100)
      };

      // Auto-advance to next step if enabled
      if (userProgress.preferences.autoAdvance && nextStep) {
        updatedProgress.currentStep = nextStep.id;
      }

      setUserProgress(updatedProgress);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete step');
    }
  };

  // Skip a step
  const skipStep = async (stepId: string) => {
    if (!userProgress) return;

    try {
      // TODO: Update progress via API
      const updatedProgress = {
        ...userProgress,
        completedSteps: [...userProgress.completedSteps, stepId],
        progress: Math.round(((userProgress.completedSteps.length + 1) / userProgress.totalSteps) * 100)
      };

      setUserProgress(updatedProgress);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to skip step');
    }
  };

  // Reset progress
  const resetProgress = async () => {
    try {
      // TODO: Reset progress via API
      // await fetch(`/api/onboarding/progress/${userId}/reset`, { method: 'POST' });

      if (userProgress) {
        const resetProgress = {
          ...userProgress,
          currentStep: 'welcome-phase2',
          completedSteps: [],
          progress: 0
        };
        setUserProgress(resetProgress);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset progress');
    }
  };

  // Update preferences
  const updatePreferences = async (preferences: Partial<UserProgress['preferences']>) => {
    if (!userProgress) return;

    try {
      // TODO: Update preferences via API
      // await fetch(`/api/onboarding/preferences/${userId}`, {
      //   method: 'PUT',
      //   body: JSON.stringify(preferences)
      // });

      const updatedProgress = {
        ...userProgress,
        preferences: { ...userProgress.preferences, ...preferences }
      };
      setUserProgress(updatedProgress);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update preferences');
    }
  };

  // Show tip
  const showTip = (tipId: string) => {
    setVisibleTips(prev => new Set(prev).add(tipId));
  };

  // Hide tip
  const hideTip = (tipId: string) => {
    setVisibleTips(prev => {
      const newSet = new Set(prev);
      newSet.delete(tipId);
      return newSet;
    });
  };

  const value: OnboardingContextType = {
    userProgress,
    currentStep,
    nextStep,
    isLoading,
    error,
    completeStep,
    skipStep,
    resetProgress,
    updatePreferences,
    showTip,
    hideTip
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

// Hook to use onboarding context
export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}

// Export types
export type { OnboardingStep, UserProgress, OnboardingContextType };
