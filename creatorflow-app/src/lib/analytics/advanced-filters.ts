/**
 * Advanced Analytics Filters
 * Comprehensive filtering system for analytics data
 */

export interface FilterOption {
  id: string;
  label: string;
  value: any;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'range' | 'boolean';
  options?: { label: string; value: any }[];
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  description?: string;
}

export interface FilterGroup {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  filters: FilterOption[];
  collapsed?: boolean;
}

export interface FilterPreset {
  id: string;
  name: string;
  description: string;
  filters: Record<string, any>;
  isDefault?: boolean;
  category: string;
  createdBy: string;
  createdAt: string;
  usageCount: number;
}

export interface DateRangePreset {
  id: string;
  name: string;
  label: string;
  startDate: string;
  endDate: string;
  description: string;
}

export class AdvancedFilters {
  private filterGroups: Map<string, FilterGroup> = new Map();
  private presets: Map<string, FilterPreset> = new Map();
  private datePresets: DateRangePreset[] = [];

  constructor() {
    this.initializeFilterGroups();
    this.initializePresets();
    this.initializeDatePresets();
  }

  private initializeFilterGroups() {
    const groups: FilterGroup[] = [
      {
        id: 'date_time',
        name: 'Date & Time',
        description: 'Filter by date ranges and time periods',
        icon: '📅',
        color: '#4ECDC4',
        filters: [
          {
            id: 'dateRange',
            label: 'Date Range',
            value: null,
            type: 'date',
            placeholder: 'Select date range'
          },
          {
            id: 'timeOfDay',
            label: 'Time of Day',
            value: null,
            type: 'select',
            options: [
              { label: 'All Day', value: 'all' },
              { label: 'Morning (6am-12pm)', value: 'morning' },
              { label: 'Afternoon (12pm-6pm)', value: 'afternoon' },
              { label: 'Evening (6pm-12am)', value: 'evening' },
              { label: 'Night (12am-6am)', value: 'night' }
            ]
          },
          {
            id: 'dayOfWeek',
            label: 'Day of Week',
            value: null,
            type: 'multiselect',
            options: [
              { label: 'Monday', value: 'monday' },
              { label: 'Tuesday', value: 'tuesday' },
              { label: 'Wednesday', value: 'wednesday' },
              { label: 'Thursday', value: 'thursday' },
              { label: 'Friday', value: 'friday' },
              { label: 'Saturday', value: 'saturday' },
              { label: 'Sunday', value: 'sunday' }
            ]
          },
          {
            id: 'timezone',
            label: 'Timezone',
            value: null,
            type: 'select',
            options: [
              { label: 'UTC', value: 'UTC' },
              { label: 'EST (Eastern)', value: 'America/New_York' },
              { label: 'PST (Pacific)', value: 'America/Los_Angeles' },
              { label: 'GMT (London)', value: 'Europe/London' },
              { label: 'CET (Central Europe)', value: 'Europe/Paris' },
              { label: 'JST (Tokyo)', value: 'Asia/Tokyo' }
            ]
          }
        ]
      },
      {
        id: 'platform',
        name: 'Platform',
        description: 'Filter by social media platforms',
        icon: '📱',
        color: '#FF6B6B',
        filters: [
          {
            id: 'platforms',
            label: 'Platforms',
            value: null,
            type: 'multiselect',
            options: [
              { label: 'Instagram', value: 'instagram' },
              { label: 'Facebook', value: 'facebook' },
              { label: 'YouTube', value: 'youtube' },
              { label: 'TikTok', value: 'tiktok' },
              { label: 'Twitter', value: 'twitter' },
              { label: 'LinkedIn', value: 'linkedin' },
              { label: 'Pinterest', value: 'pinterest' },
              { label: 'Snapchat', value: 'snapchat' },
              { label: 'Reddit', value: 'reddit' },
              { label: 'Discord', value: 'discord' },
              { label: 'Twitch', value: 'twitch' },
              { label: 'Vimeo', value: 'vimeo' },
              { label: 'Dribbble', value: 'dribbble' },
              { label: 'Slack', value: 'slack' },
              { label: 'WhatsApp', value: 'whatsapp' },
              { label: 'Mastodon', value: 'mastodon' }
            ]
          },
          {
            id: 'platformType',
            label: 'Platform Type',
            value: null,
            type: 'select',
            options: [
              { label: 'All Types', value: 'all' },
              { label: 'Visual (Instagram, Pinterest)', value: 'visual' },
              { label: 'Video (YouTube, TikTok)', value: 'video' },
              { label: 'Professional (LinkedIn)', value: 'professional' },
              { label: 'Social (Facebook, Twitter)', value: 'social' },
              { label: 'Messaging (WhatsApp, Discord)', value: 'messaging' }
            ]
          }
        ]
      },
      {
        id: 'content',
        name: 'Content',
        description: 'Filter by content type and characteristics',
        icon: '📝',
        color: '#45B7D1',
        filters: [
          {
            id: 'contentType',
            label: 'Content Type',
            value: null,
            type: 'multiselect',
            options: [
              { label: 'Text Posts', value: 'text' },
              { label: 'Images', value: 'image' },
              { label: 'Videos', value: 'video' },
              { label: 'Carousels', value: 'carousel' },
              { label: 'Stories', value: 'story' },
              { label: 'Reels', value: 'reel' },
              { label: 'Live Streams', value: 'live' }
            ]
          },
          {
            id: 'hashtags',
            label: 'Hashtags',
            value: null,
            type: 'text',
            placeholder: 'Enter hashtags (comma separated)'
          },
          {
            id: 'mentions',
            label: 'Mentions',
            value: null,
            type: 'text',
            placeholder: 'Enter mentions (comma separated)'
          },
          {
            id: 'contentLength',
            label: 'Content Length',
            value: null,
            type: 'range',
            min: 0,
            max: 2000,
            step: 50,
            description: 'Character count range'
          },
          {
            id: 'hasImage',
            label: 'Has Image',
            value: null,
            type: 'boolean'
          },
          {
            id: 'hasVideo',
            label: 'Has Video',
            value: null,
            type: 'boolean'
          }
        ]
      },
      {
        id: 'performance',
        name: 'Performance',
        description: 'Filter by performance metrics',
        icon: '📊',
        color: '#96CEB4',
        filters: [
          {
            id: 'engagementRate',
            label: 'Engagement Rate',
            value: null,
            type: 'range',
            min: 0,
            max: 100,
            step: 0.1,
            description: 'Engagement rate percentage'
          },
          {
            id: 'reach',
            label: 'Reach',
            value: null,
            type: 'range',
            min: 0,
            max: 1000000,
            step: 1000,
            description: 'Number of people reached'
          },
          {
            id: 'impressions',
            label: 'Impressions',
            value: null,
            type: 'range',
            min: 0,
            max: 1000000,
            step: 1000,
            description: 'Number of times content was seen'
          },
          {
            id: 'likes',
            label: 'Likes',
            value: null,
            type: 'range',
            min: 0,
            max: 100000,
            step: 100,
            description: 'Number of likes'
          },
          {
            id: 'comments',
            label: 'Comments',
            value: null,
            type: 'range',
            min: 0,
            max: 10000,
            step: 10,
            description: 'Number of comments'
          },
          {
            id: 'shares',
            label: 'Shares',
            value: null,
            type: 'range',
            min: 0,
            max: 10000,
            step: 10,
            description: 'Number of shares'
          },
          {
            id: 'clicks',
            label: 'Clicks',
            value: null,
            type: 'range',
            min: 0,
            max: 10000,
            step: 10,
            description: 'Number of clicks'
          }
        ]
      },
      {
        id: 'audience',
        name: 'Audience',
        description: 'Filter by audience demographics',
        icon: '👥',
        color: '#FFEAA7',
        filters: [
          {
            id: 'ageRange',
            label: 'Age Range',
            value: null,
            type: 'select',
            options: [
              { label: 'All Ages', value: 'all' },
              { label: '13-17', value: '13-17' },
              { label: '18-24', value: '18-24' },
              { label: '25-34', value: '25-34' },
              { label: '35-44', value: '35-44' },
              { label: '45-54', value: '45-54' },
              { label: '55-64', value: '55-64' },
              { label: '65+', value: '65+' }
            ]
          },
          {
            id: 'gender',
            label: 'Gender',
            value: null,
            type: 'multiselect',
            options: [
              { label: 'Male', value: 'male' },
              { label: 'Female', value: 'female' },
              { label: 'Other', value: 'other' },
              { label: 'Unknown', value: 'unknown' }
            ]
          },
          {
            id: 'location',
            label: 'Location',
            value: null,
            type: 'text',
            placeholder: 'Enter country, state, or city'
          },
          {
            id: 'interests',
            label: 'Interests',
            value: null,
            type: 'multiselect',
            options: [
              { label: 'Technology', value: 'technology' },
              { label: 'Fashion', value: 'fashion' },
              { label: 'Food', value: 'food' },
              { label: 'Travel', value: 'travel' },
              { label: 'Fitness', value: 'fitness' },
              { label: 'Music', value: 'music' },
              { label: 'Art', value: 'art' },
              { label: 'Sports', value: 'sports' },
              { label: 'Gaming', value: 'gaming' },
              { label: 'Business', value: 'business' }
            ]
          }
        ]
      },
      {
        id: 'campaign',
        name: 'Campaign',
        description: 'Filter by campaign and scheduling',
        icon: '🎯',
        color: '#DDA0DD',
        filters: [
          {
            id: 'campaignId',
            label: 'Campaign',
            value: null,
            type: 'select',
            options: [
              { label: 'All Campaigns', value: 'all' },
              { label: 'No Campaign', value: 'none' }
            ]
          },
          {
            id: 'scheduled',
            label: 'Scheduled',
            value: null,
            type: 'boolean'
          },
          {
            id: 'published',
            label: 'Published',
            value: null,
            type: 'boolean'
          },
          {
            id: 'draft',
            label: 'Draft',
            value: null,
            type: 'boolean'
          },
          {
            id: 'status',
            label: 'Status',
            value: null,
            type: 'multiselect',
            options: [
              { label: 'Published', value: 'published' },
              { label: 'Scheduled', value: 'scheduled' },
              { label: 'Draft', value: 'draft' },
              { label: 'Failed', value: 'failed' },
              { label: 'Processing', value: 'processing' }
            ]
          }
        ]
      }
    ];

    groups.forEach(group => {
      this.filterGroups.set(group.id, group);
    });
  }

  private initializePresets() {
    const presets: FilterPreset[] = [
      {
        id: 'top_performing',
        name: 'Top Performing Posts',
        description: 'Posts with highest engagement rates',
        filters: {
          engagementRate: { min: 5 },
          reach: { min: 1000 }
        },
        isDefault: true,
        category: 'performance',
        createdBy: 'CreatorFlow',
        createdAt: new Date().toISOString(),
        usageCount: 0
      },
      {
        id: 'recent_posts',
        name: 'Recent Posts',
        description: 'Posts from the last 30 days',
        filters: {
          dateRange: {
            start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            end: new Date().toISOString()
          }
        },
        isDefault: true,
        category: 'date',
        createdBy: 'CreatorFlow',
        createdAt: new Date().toISOString(),
        usageCount: 0
      },
      {
        id: 'visual_content',
        name: 'Visual Content',
        description: 'Posts with images or videos',
        filters: {
          contentType: ['image', 'video', 'carousel', 'story', 'reel'],
          hasImage: true
        },
        isDefault: true,
        category: 'content',
        createdBy: 'CreatorFlow',
        createdAt: new Date().toISOString(),
        usageCount: 0
      },
      {
        id: 'instagram_only',
        name: 'Instagram Only',
        description: 'Posts published to Instagram',
        filters: {
          platforms: ['instagram']
        },
        isDefault: true,
        category: 'platform',
        createdBy: 'CreatorFlow',
        createdAt: new Date().toISOString(),
        usageCount: 0
      },
      {
        id: 'high_engagement',
        name: 'High Engagement',
        description: 'Posts with 100+ likes and 10+ comments',
        filters: {
          likes: { min: 100 },
          comments: { min: 10 }
        },
        isDefault: true,
        category: 'performance',
        createdBy: 'CreatorFlow',
        createdAt: new Date().toISOString(),
        usageCount: 0
      }
    ];

    presets.forEach(preset => {
      this.presets.set(preset.id, preset);
    });
  }

  private initializeDatePresets() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    this.datePresets = [
      {
        id: 'today',
        name: 'today',
        label: 'Today',
        startDate: today.toISOString(),
        endDate: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1).toISOString(),
        description: 'Posts from today'
      },
      {
        id: 'yesterday',
        name: 'yesterday',
        label: 'Yesterday',
        startDate: new Date(today.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(today.getTime() - 1).toISOString(),
        description: 'Posts from yesterday'
      },
      {
        id: 'last_7_days',
        name: 'last_7_days',
        label: 'Last 7 Days',
        startDate: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(today.getTime() - 1).toISOString(),
        description: 'Posts from the last 7 days'
      },
      {
        id: 'last_30_days',
        name: 'last_30_days',
        label: 'Last 30 Days',
        startDate: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(today.getTime() - 1).toISOString(),
        description: 'Posts from the last 30 days'
      },
      {
        id: 'last_90_days',
        name: 'last_90_days',
        label: 'Last 90 Days',
        startDate: new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(today.getTime() - 1).toISOString(),
        description: 'Posts from the last 90 days'
      },
      {
        id: 'this_month',
        name: 'this_month',
        label: 'This Month',
        startDate: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
        endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString(),
        description: 'Posts from this month'
      },
      {
        id: 'last_month',
        name: 'last_month',
        label: 'Last Month',
        startDate: new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString(),
        endDate: new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString(),
        description: 'Posts from last month'
      },
      {
        id: 'this_year',
        name: 'this_year',
        label: 'This Year',
        startDate: new Date(now.getFullYear(), 0, 1).toISOString(),
        endDate: new Date(now.getFullYear(), 11, 31, 23, 59, 59).toISOString(),
        description: 'Posts from this year'
      }
    ];
  }

  // Get all filter groups
  getFilterGroups(): FilterGroup[] {
    return Array.from(this.filterGroups.values());
  }

  // Get filter group by ID
  getFilterGroup(id: string): FilterGroup | undefined {
    return this.filterGroups.get(id);
  }

  // Get all presets
  getPresets(): FilterPreset[] {
    return Array.from(this.presets.values());
  }

  // Get preset by ID
  getPreset(id: string): FilterPreset | undefined {
    return this.presets.get(id);
  }

  // Create custom preset
  createPreset(preset: Omit<FilterPreset, 'id' | 'createdAt' | 'usageCount'>): FilterPreset {
    const newPreset: FilterPreset = {
      ...preset,
      id: `preset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      usageCount: 0
    };

    this.presets.set(newPreset.id, newPreset);
    return newPreset;
  }

  // Update preset
  updatePreset(id: string, updates: Partial<FilterPreset>): FilterPreset | null {
    const preset = this.presets.get(id);
    if (!preset) return null;

    const updatedPreset = { ...preset, ...updates };
    this.presets.set(id, updatedPreset);
    return updatedPreset;
  }

  // Delete preset
  deletePreset(id: string): boolean {
    return this.presets.delete(id);
  }

  // Get date presets
  getDatePresets(): DateRangePreset[] {
    return this.datePresets;
  }

  // Get date preset by ID
  getDatePreset(id: string): DateRangePreset | undefined {
    return this.datePresets.find(preset => preset.id === id);
  }

  // Apply filters to data
  applyFilters(data: any[], filters: Record<string, any>): any[] {
    return data.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value || value === null || value === undefined) return true;

        const itemValue = this.getNestedValue(item, key);

        if (Array.isArray(value)) {
          return value.includes(itemValue);
        }

        if (typeof value === 'object' && value.min !== undefined) {
          return itemValue >= value.min;
        }

        if (typeof value === 'object' && value.max !== undefined) {
          return itemValue <= value.max;
        }

        if (typeof value === 'object' && value.start && value.end) {
          const itemDate = new Date(itemValue);
          const startDate = new Date(value.start);
          const endDate = new Date(value.end);
          return itemDate >= startDate && itemDate <= endDate;
        }

        return itemValue === value;
      });
    });
  }

  // Get nested value from object
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  }

  // Validate filters
  validateFilters(filters: Record<string, any>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Add validation logic here based on your requirements
    // For example, check if date ranges are valid, if numeric ranges make sense, etc.

    return { valid: errors.length === 0, errors };
  }

  // Get filter statistics
  getFilterStats(): {
    totalGroups: number;
    totalFilters: number;
    totalPresets: number;
    totalDatePresets: number;
  } {
    const totalFilters = Array.from(this.filterGroups.values())
      .reduce((sum, group) => sum + group.filters.length, 0);

    return {
      totalGroups: this.filterGroups.size,
      totalFilters,
      totalPresets: this.presets.size,
      totalDatePresets: this.datePresets.length
    };
  }
}
