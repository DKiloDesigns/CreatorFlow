/**
 * Plan validation utilities for feature access control
 */

export type UserPlan = 'Free' | 'Creator' | 'Pro' | 'Enterprise';

export interface PlanFeature {
  id: string;
  name: string;
  description: string;
  requiredPlan: UserPlan;
  isProFeature: boolean;
}

export const PLAN_FEATURES: Record<string, PlanFeature> = {
  'smart-workflow': {
    id: 'smart-workflow',
    name: 'Smart Content Creation Workflow',
    description: 'AI-powered content creation with advanced optimization tools',
    requiredPlan: 'Pro',
    isProFeature: true
  },
  'ai-content-generation': {
    id: 'ai-content-generation',
    name: 'AI Content Generation',
    description: 'Generate captions, hashtags, and content ideas with AI',
    requiredPlan: 'Pro',
    isProFeature: true
  },
  'advanced-analytics': {
    id: 'advanced-analytics',
    name: 'Advanced Analytics',
    description: 'Detailed performance insights and predictions',
    requiredPlan: 'Creator',
    isProFeature: false
  },
  'unlimited-scheduling': {
    id: 'unlimited-scheduling',
    name: 'Unlimited Scheduling',
    description: 'Schedule unlimited posts across all platforms',
    requiredPlan: 'Creator',
    isProFeature: false
  },
  'team-collaboration': {
    id: 'team-collaboration',
    name: 'Team Collaboration',
    description: 'Work with team members and manage permissions',
    requiredPlan: 'Pro',
    isProFeature: true
  },
  'white-label': {
    id: 'white-label',
    name: 'White-Label Solutions',
    description: 'Customize branding and create white-label experiences',
    requiredPlan: 'Enterprise',
    isProFeature: true
  }
};

export const PLAN_HIERARCHY: Record<UserPlan, number> = {
  'Free': 0,
  'Creator': 1,
  'Pro': 2,
  'Enterprise': 3
};

/**
 * Check if a user's plan has access to a specific feature
 */
export function hasFeatureAccess(userPlan: UserPlan, featureId: string): boolean {
  const feature = PLAN_FEATURES[featureId];
  if (!feature) return false;
  
  return PLAN_HIERARCHY[userPlan] >= PLAN_HIERARCHY[feature.requiredPlan];
}

/**
 * Check if a user's plan is Pro or higher
 */
export function isProUser(userPlan: UserPlan): boolean {
  return PLAN_HIERARCHY[userPlan] >= PLAN_HIERARCHY['Pro'];
}

/**
 * Check if a user's plan is Creator or higher
 */
export function isCreatorUser(userPlan: UserPlan): boolean {
  return PLAN_HIERARCHY[userPlan] >= PLAN_HIERARCHY['Creator'];
}

/**
 * Get the minimum plan required for a feature
 */
export function getRequiredPlan(featureId: string): UserPlan | null {
  const feature = PLAN_FEATURES[featureId];
  return feature ? feature.requiredPlan : null;
}

/**
 * Get all features available to a user's plan
 */
export function getAvailableFeatures(userPlan: UserPlan): PlanFeature[] {
  return Object.values(PLAN_FEATURES).filter(feature => 
    PLAN_HIERARCHY[userPlan] >= PLAN_HIERARCHY[feature.requiredPlan]
  );
}

/**
 * Get all Pro features
 */
export function getProFeatures(): PlanFeature[] {
  return Object.values(PLAN_FEATURES).filter(feature => feature.isProFeature);
}

/**
 * Get plan upgrade suggestions for a feature
 */
export function getUpgradeSuggestion(featureId: string): {
  currentPlan: UserPlan;
  requiredPlan: UserPlan;
  upgradeMessage: string;
  ctaText: string;
} | null {
  const feature = PLAN_FEATURES[featureId];
  if (!feature) return null;

  return {
    currentPlan: 'Free', // This would be passed from the user context
    requiredPlan: feature.requiredPlan,
    upgradeMessage: `Upgrade to ${feature.requiredPlan} to access ${feature.name}`,
    ctaText: `Upgrade to ${feature.requiredPlan}`
  };
}
