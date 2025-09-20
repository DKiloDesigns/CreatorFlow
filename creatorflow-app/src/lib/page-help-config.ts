/**
 * Page Help Configuration
 * Defines what tutorials, videos, and tips are available for each page
 */

export interface PageHelpConfig {
  pageId: string;
  pageName: string;
  tutorials: string[];
  videos: string[];
  tips: string[];
  quickActions: {
    title: string;
    description: string;
    action: string;
    icon: string;
  }[];
}

export const PAGE_HELP_CONFIG: Record<string, PageHelpConfig> = {
      'dashboard': {
        pageId: 'dashboard',
        pageName: 'Dashboard',
        tutorials: ['creating-your-first-post', 'using-ai-content-generator'],
        videos: [],
        tips: ['dashboard-welcome', 'mobile-app-tip'],
    quickActions: [
      {
        title: 'Quick Start Guide',
        description: 'Get up and running in 5 minutes',
        action: 'tutorial',
        icon: 'play'
      },
      {
        title: 'Connect Accounts',
        description: 'Link your social media accounts',
        action: 'navigate',
        icon: 'users'
      }
    ]
  },
  'content': {
    pageId: 'content',
    pageName: 'Content Creation',
    tutorials: ['creating-your-first-post', 'using-ai-content-generator', 'setting-up-content-calendar'],
    videos: [],
    tips: ['content-creation-tip', 'hashtag-research', 'content-calendar-tip'],
    quickActions: [
      {
        title: 'Create First Post',
        description: 'Step-by-step post creation',
        action: 'tutorial',
        icon: 'play'
      },
      {
        title: 'AI Content Generator',
        description: 'Use AI to create content',
        action: 'navigate',
        icon: 'brain'
      }
    ]
  },
  'analytics': {
    pageId: 'analytics',
    pageName: 'Analytics',
    tutorials: ['analyzing-performance-metrics'],
    videos: [],
    tips: ['analytics-insight'],
    quickActions: [
      {
        title: 'Analytics Overview',
        description: 'Understand your metrics',
        action: 'tutorial',
        icon: 'play'
      },
      {
        title: 'Export Data',
        description: 'Download your analytics',
        action: 'navigate',
        icon: 'download'
      }
    ]
  },
  'scheduling': {
    pageId: 'scheduling',
    pageName: 'Scheduling',
    tutorials: ['setting-up-content-calendar'],
    videos: [],
    tips: ['scheduling-optimization'],
    quickActions: [
      {
        title: 'Calendar Setup',
        description: 'Configure your content calendar',
        action: 'tutorial',
        icon: 'play'
      },
      {
        title: 'Bulk Schedule',
        description: 'Schedule multiple posts',
        action: 'navigate',
        icon: 'calendar'
      }
    ]
  },
  'media': {
    pageId: 'media',
    pageName: 'Media Library',
    tutorials: [],
    videos: [],
    tips: [],
    quickActions: [
      {
        title: 'Upload Media',
        description: 'Add images and videos',
        action: 'navigate',
        icon: 'upload'
      },
      {
        title: 'Organize Library',
        description: 'Manage your media files',
        action: 'navigate',
        icon: 'folder'
      }
    ]
  },
  'teams': {
    pageId: 'teams',
    pageName: 'Team Management',
    tutorials: [],
    videos: [],
    tips: ['team-collaboration'],
    quickActions: [
      {
        title: 'Invite Team Members',
        description: 'Add collaborators to your workspace',
        action: 'navigate',
        icon: 'users'
      },
      {
        title: 'Set Permissions',
        description: 'Configure team access levels',
        action: 'navigate',
        icon: 'settings'
      }
    ]
  },
  'settings': {
    pageId: 'settings',
    pageName: 'Settings',
    tutorials: [],
    videos: [],
    tips: ['customize-settings'],
    quickActions: [
      {
        title: 'Account Settings',
        description: 'Update your profile',
        action: 'navigate',
        icon: 'user'
      },
      {
        title: 'Billing & Plans',
        description: 'Manage subscription',
        action: 'navigate',
        icon: 'credit-card'
      }
    ]
  }
};

export function getPageHelpConfig(pageId: string): PageHelpConfig | null {
  return PAGE_HELP_CONFIG[pageId] || null;
}

export function getAllPageHelpConfigs(): PageHelpConfig[] {
  return Object.values(PAGE_HELP_CONFIG);
}
