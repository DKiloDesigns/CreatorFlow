import { prisma } from '@/lib/prisma';
import { defaultCache as cache } from './cache';
import { performanceMonitor } from './performance-monitor';

interface UXConfig {
  animations: boolean;
  soundEffects: boolean;
  hapticFeedback: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
  theme: 'light' | 'dark' | 'auto';
}

interface UserPreference {
  userId: string;
  category: string;
  key: string;
  value: any;
  updatedAt: Date;
}

interface InteractionEvent {
  userId: string;
  eventType: string;
  element: string;
  action: string;
  timestamp: Date;
  metadata: any;
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
  order: number;
}

interface FeatureTour {
  id: string;
  title: string;
  steps: Array<{
    id: string;
    title: string;
    description: string;
    target: string;
    position: 'top' | 'bottom' | 'left' | 'right';
  }>;
  completed: boolean;
}

class UXManager {
  private config: UXConfig;
  private cache: any;
  private performanceMonitor: any;

  constructor() {
    this.config = {
      animations: true,
      soundEffects: false,
      hapticFeedback: true,
      reducedMotion: false,
      highContrast: false,
      fontSize: 'medium',
      theme: 'auto',
    };
    this.cache = cache;
    this.performanceMonitor = performanceMonitor;
  }

  // User preferences management
  async getUserPreferences(userId: string): Promise<UserPreference[]> {
    try {
      const preferences = await prisma.userPreference.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
      });

      return preferences;
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return [];
    }
  }

  async setUserPreference(userId: string, category: string, key: string, value: any): Promise<void> {
    try {
      await prisma.userPreference.upsert({
        where: {
          userId_category_key: {
            userId,
            category,
            key,
          },
        },
        update: {
          value: JSON.stringify(value),
          updatedAt: new Date(),
        },
        create: {
          userId,
          category,
          key,
          value: JSON.stringify(value),
          updatedAt: new Date(),
        },
      });

      // Cache the preference
      const cacheKey = `user_pref_${userId}_${category}_${key}`;
      await this.cache.set(cacheKey, value, 3600);
    } catch (error) {
      console.error('Error setting user preference:', error);
    }
  }

  async getUserPreference(userId: string, category: string, key: string): Promise<any> {
    try {
      const cacheKey = `user_pref_${userId}_${category}_${key}`;
      const cached = await this.cache.get(cacheKey);
      if (cached) return cached;

      const preference = await prisma.userPreference.findUnique({
        where: {
          userId_category_key: {
            userId,
            category,
            key,
          },
        },
      });

      if (preference) {
        const value = JSON.parse(preference.value);
        await this.cache.set(cacheKey, value, 3600);
        return value;
      }

      return null;
    } catch (error) {
      console.error('Error getting user preference:', error);
      return null;
    }
  }

  // Interaction tracking
  async trackInteraction(userId: string, eventType: string, element: string, action: string, metadata?: any): Promise<void> {
    try {
      await prisma.interactionEvent.create({
        data: {
          userId,
          eventType,
          element,
          action,
          metadata: JSON.stringify(metadata || {}),
          timestamp: new Date(),
        },
      });

      // Track performance metric
      await this.performanceMonitor.recordMetric('user_interaction', Date.now());
    } catch (error) {
      console.error('Error tracking interaction:', error);
    }
  }

  async getUserInteractions(userId: string, limit: number = 50): Promise<InteractionEvent[]> {
    try {
      const interactions = await prisma.interactionEvent.findMany({
        where: { userId },
        orderBy: { timestamp: 'desc' },
        take: limit,
      });

      return interactions.map(interaction => ({
        ...interaction,
        metadata: JSON.parse(interaction.metadata),
      }));
    } catch (error) {
      console.error('Error getting user interactions:', error);
      return [];
    }
  }

  // Onboarding management
  async getOnboardingSteps(userId: string): Promise<OnboardingStep[]> {
    try {
      const userOnboarding = await prisma.userOnboarding.findMany({
        where: { userId },
        orderBy: { order: 'asc' },
      });

      if (userOnboarding.length === 0) {
        // Create default onboarding steps
        const defaultSteps = this.getDefaultOnboardingSteps();
        await this.createOnboardingSteps(userId, defaultSteps);
        return defaultSteps;
      }

      return userOnboarding.map(step => ({
        id: step.id,
        title: step.title,
        description: step.description,
        completed: step.completed,
        required: step.required,
        order: step.order,
      }));
    } catch (error) {
      console.error('Error getting onboarding steps:', error);
      return [];
    }
  }

  async completeOnboardingStep(userId: string, stepId: string): Promise<void> {
    try {
      await prisma.userOnboarding.update({
        where: { id: stepId },
        data: { completed: true },
      });

      // Track completion
      await this.trackInteraction(userId, 'onboarding', 'step', 'completed', { stepId });
    } catch (error) {
      console.error('Error completing onboarding step:', error);
    }
  }

  async getOnboardingProgress(userId: string): Promise<{ completed: number; total: number; percentage: number }> {
    try {
      const steps = await this.getOnboardingSteps(userId);
      const completed = steps.filter(step => step.completed).length;
      const total = steps.length;

      return {
        completed,
        total,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    } catch (error) {
      console.error('Error getting onboarding progress:', error);
      return { completed: 0, total: 0, percentage: 0 };
    }
  }

  // Feature tours
  async getFeatureTours(userId: string): Promise<FeatureTour[]> {
    try {
      const userTours = await prisma.userFeatureTour.findMany({
        where: { userId },
        include: { steps: true },
      });

      return userTours.map(tour => ({
        id: tour.id,
        title: tour.title,
        steps: tour.steps.map(step => ({
          id: step.id,
          title: step.title,
          description: step.description,
          target: step.target,
          position: step.position as 'top' | 'bottom' | 'left' | 'right',
        })),
        completed: tour.completed,
      }));
    } catch (error) {
      console.error('Error getting feature tours:', error);
      return [];
    }
  }

  async completeFeatureTour(userId: string, tourId: string): Promise<void> {
    try {
      await prisma.userFeatureTour.update({
        where: { id: tourId },
        data: { completed: true },
      });

      // Track completion
      await this.trackInteraction(userId, 'feature_tour', 'tour', 'completed', { tourId });
    } catch (error) {
      console.error('Error completing feature tour:', error);
    }
  }

  // Accessibility features
  async getAccessibilitySettings(userId: string): Promise<UXConfig> {
    try {
      const settings = await this.getUserPreference(userId, 'accessibility', 'settings');
      return settings || this.config;
    } catch (error) {
      console.error('Error getting accessibility settings:', error);
      return this.config;
    }
  }

  async updateAccessibilitySettings(userId: string, settings: Partial<UXConfig>): Promise<void> {
    try {
      const currentSettings = await this.getAccessibilitySettings(userId);
      const updatedSettings = { ...currentSettings, ...settings };
      
      await this.setUserPreference(userId, 'accessibility', 'settings', updatedSettings);
      
      // Track accessibility change
      await this.trackInteraction(userId, 'accessibility', 'settings', 'updated', updatedSettings);
    } catch (error) {
      console.error('Error updating accessibility settings:', error);
    }
  }

  // Performance optimization
  async getUXPerformanceMetrics(userId: string): Promise<{
    pageLoadTime: number;
    interactionResponseTime: number;
    errorRate: number;
    satisfactionScore: number;
  }> {
    try {
      const interactions = await this.getUserInteractions(userId, 100);
      const recentInteractions = interactions.filter(i => 
        i.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
      );

      const pageLoadTime = recentInteractions
        .filter(i => i.eventType === 'page_load')
        .reduce((sum, i) => sum + (i.metadata.loadTime || 0), 0) / 
        Math.max(recentInteractions.filter(i => i.eventType === 'page_load').length, 1);

      const interactionResponseTime = recentInteractions
        .filter(i => i.eventType === 'interaction')
        .reduce((sum, i) => sum + (i.metadata.responseTime || 0), 0) / 
        Math.max(recentInteractions.filter(i => i.eventType === 'interaction').length, 1);

      const errorRate = recentInteractions
        .filter(i => i.eventType === 'error').length / 
        Math.max(recentInteractions.length, 1) * 100;

      const satisfactionScore = await this.calculateSatisfactionScore(userId);

      return {
        pageLoadTime,
        interactionResponseTime,
        errorRate,
        satisfactionScore,
      };
    } catch (error) {
      console.error('Error getting UX performance metrics:', error);
      return {
        pageLoadTime: 0,
        interactionResponseTime: 0,
        errorRate: 0,
        satisfactionScore: 0,
      };
    }
  }

  // Helper methods
  private getDefaultOnboardingSteps(): OnboardingStep[] {
    return [
      {
        id: 'welcome',
        title: 'Welcome to CreatorFlow',
        description: 'Let\'s get you started with your first post',
        completed: false,
        required: true,
        order: 1,
      },
      {
        id: 'connect_accounts',
        title: 'Connect Your Social Accounts',
        description: 'Link your social media accounts to start publishing',
        completed: false,
        required: true,
        order: 2,
      },
      {
        id: 'create_post',
        title: 'Create Your First Post',
        description: 'Learn how to create and schedule your first post',
        completed: false,
        required: true,
        order: 3,
      },
      {
        id: 'schedule_content',
        title: 'Schedule Your Content',
        description: 'Set up your content calendar and scheduling',
        completed: false,
        required: false,
        order: 4,
      },
      {
        id: 'analytics',
        title: 'View Your Analytics',
        description: 'Track your performance and audience insights',
        completed: false,
        required: false,
        order: 5,
      },
    ];
  }

  private async createOnboardingSteps(userId: string, steps: OnboardingStep[]): Promise<void> {
    try {
      for (const step of steps) {
        await prisma.userOnboarding.create({
          data: {
            userId,
            title: step.title,
            description: step.description,
            completed: step.completed,
            required: step.required,
            order: step.order,
          },
        });
      }
    } catch (error) {
      console.error('Error creating onboarding steps:', error);
    }
  }

  private async calculateSatisfactionScore(userId: string): Promise<number> {
    try {
      // Calculate satisfaction based on user interactions, completion rates, and feedback
      const interactions = await this.getUserInteractions(userId, 100);
      const onboardingProgress = await this.getOnboardingProgress(userId);
      
      // Simple scoring algorithm
      let score = 50; // Base score
      
      // Add points for active usage
      if (interactions.length > 10) score += 20;
      if (interactions.length > 50) score += 10;
      
      // Add points for onboarding completion
      score += onboardingProgress.percentage * 0.2;
      
      // Subtract points for errors
      const errorCount = interactions.filter(i => i.eventType === 'error').length;
      score -= errorCount * 5;
      
      return Math.max(0, Math.min(100, score));
    } catch (error) {
      console.error('Error calculating satisfaction score:', error);
      return 50;
    }
  }
}

// Export UX manager instance
export const uxManager = new UXManager(); 