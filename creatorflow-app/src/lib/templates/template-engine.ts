/**
 * Content Template Engine
 * Handles industry-specific templates and custom template creation
 */

export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  industry: string;
  platform: string;
  type: 'text' | 'image' | 'video' | 'carousel' | 'story';
  content: {
    text?: string;
    hashtags?: string[];
    mentions?: string[];
    callToAction?: string;
    imagePrompt?: string;
    videoPrompt?: string;
  };
  variables: TemplateVariable[];
  tags: string[];
  isPublic: boolean;
  isPremium: boolean;
  author: string;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  rating: number;
  downloads: number;
  metadata: {
    estimatedTime: number; // in minutes
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    bestFor: string[];
    requirements: string[];
  };
}

export interface TemplateVariable {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect';
  label: string;
  placeholder?: string;
  required: boolean;
  defaultValue?: any;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  industry: string;
  templateCount: number;
}

export interface TemplateSearchFilters {
  category?: string;
  industry?: string;
  platform?: string;
  type?: ContentTemplate['type'];
  isPublic?: boolean;
  isPremium?: boolean;
  difficulty?: string;
  tags?: string[];
  author?: string;
  rating?: number;
  minDownloads?: number;
  dateRange?: {
    start: string;
    end: string;
  };
}

export class TemplateEngine {
  private templates: Map<string, ContentTemplate> = new Map();
  private categories: Map<string, TemplateCategory> = new Map();
  private industries: string[] = [];

  constructor() {
    this.initializeDefaultTemplates();
    this.initializeCategories();
  }

  private initializeDefaultTemplates() {
    const defaultTemplates: ContentTemplate[] = [
      // Restaurant Templates
      {
        id: 'restaurant_daily_special',
        name: 'Daily Special Announcement',
        description: 'Announce your daily special with mouth-watering descriptions',
        category: 'promotion',
        industry: 'restaurant',
        platform: 'instagram',
        type: 'image',
        content: {
          text: '🍽️ TODAY\'S SPECIAL: {{specialName}}\n\n{{specialDescription}}\n\n📍 {{location}}\n⏰ {{hours}}\n📞 {{phone}}\n\n#{{restaurantName}} #DailySpecial #{{city}} #Foodie #LocalEats',
          hashtags: ['#DailySpecial', '#Foodie', '#LocalEats'],
          callToAction: 'Order now!'
        },
        variables: [
          { id: 'specialName', name: 'specialName', type: 'text', label: 'Special Name', required: true, placeholder: 'e.g., Grilled Salmon' },
          { id: 'specialDescription', name: 'specialDescription', type: 'text', label: 'Special Description', required: true, placeholder: 'e.g., Fresh Atlantic salmon with lemon herb butter' },
          { id: 'location', name: 'location', type: 'text', label: 'Location', required: true, placeholder: 'e.g., 123 Main St' },
          { id: 'hours', name: 'hours', type: 'text', label: 'Hours', required: true, placeholder: 'e.g., 11am-9pm' },
          { id: 'phone', name: 'phone', type: 'text', label: 'Phone', required: true, placeholder: 'e.g., (555) 123-4567' },
          { id: 'restaurantName', name: 'restaurantName', type: 'text', label: 'Restaurant Name', required: true, placeholder: 'e.g., Bella Vista' },
          { id: 'city', name: 'city', type: 'text', label: 'City', required: true, placeholder: 'e.g., San Francisco' }
        ],
        tags: ['restaurant', 'food', 'daily-special', 'promotion'],
        isPublic: true,
        isPremium: false,
        author: 'CreatorFlow',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 0,
        rating: 4.8,
        downloads: 1250,
        metadata: {
          estimatedTime: 5,
          difficulty: 'beginner',
          bestFor: ['restaurants', 'cafes', 'food trucks'],
          requirements: ['high-quality food photo', 'restaurant branding']
        }
      },
      {
        id: 'restaurant_weekend_brunch',
        name: 'Weekend Brunch Promotion',
        description: 'Promote your weekend brunch specials',
        category: 'promotion',
        industry: 'restaurant',
        platform: 'facebook',
        type: 'image',
        content: {
          text: '🌅 WEEKEND BRUNCH IS HERE!\n\n{{brunchDescription}}\n\n🍳 {{brunchItems}}\n☕ {{beverageSpecial}}\n\n📅 {{brunchDays}}\n⏰ {{brunchHours}}\n\n#{{restaurantName}} #WeekendBrunch #{{city}} #BrunchTime #WeekendVibes',
          hashtags: ['#WeekendBrunch', '#BrunchTime', '#WeekendVibes'],
          callToAction: 'Reserve your table!'
        },
        variables: [
          { id: 'brunchDescription', name: 'brunchDescription', type: 'text', label: 'Brunch Description', required: true, placeholder: 'e.g., Indulge in our signature brunch menu' },
          { id: 'brunchItems', name: 'brunchItems', type: 'text', label: 'Brunch Items', required: true, placeholder: 'e.g., Pancakes, Eggs Benedict, Avocado Toast' },
          { id: 'beverageSpecial', name: 'beverageSpecial', type: 'text', label: 'Beverage Special', required: true, placeholder: 'e.g., Bottomless Mimosas' },
          { id: 'brunchDays', name: 'brunchDays', type: 'text', label: 'Brunch Days', required: true, placeholder: 'e.g., Saturday & Sunday' },
          { id: 'brunchHours', name: 'brunchHours', type: 'text', label: 'Brunch Hours', required: true, placeholder: 'e.g., 9am-2pm' },
          { id: 'restaurantName', name: 'restaurantName', type: 'text', label: 'Restaurant Name', required: true },
          { id: 'city', name: 'city', type: 'text', label: 'City', required: true }
        ],
        tags: ['restaurant', 'brunch', 'weekend', 'promotion'],
        isPublic: true,
        isPremium: false,
        author: 'CreatorFlow',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 0,
        rating: 4.7,
        downloads: 980,
        metadata: {
          estimatedTime: 7,
          difficulty: 'beginner',
          bestFor: ['restaurants', 'cafes', 'hotels'],
          requirements: ['brunch food photos', 'restaurant branding']
        }
      },
      // E-commerce Templates
      {
        id: 'ecommerce_product_launch',
        name: 'Product Launch Announcement',
        description: 'Launch a new product with excitement and urgency',
        category: 'product',
        industry: 'ecommerce',
        platform: 'instagram',
        type: 'carousel',
        content: {
          text: '🚀 NEW PRODUCT ALERT! 🚀\n\n{{productName}} is finally here!\n\n✨ {{productFeatures}}\n💰 {{pricing}}\n🎁 {{launchOffer}}\n\n⏰ {{launchDate}}\n🔗 {{productLink}}\n\n#{{brandName}} #NewProduct #{{productCategory}} #Launch #ShopNow',
          hashtags: ['#NewProduct', '#Launch', '#ShopNow'],
          callToAction: 'Shop now!'
        },
        variables: [
          { id: 'productName', name: 'productName', type: 'text', label: 'Product Name', required: true, placeholder: 'e.g., Wireless Headphones Pro' },
          { id: 'productFeatures', name: 'productFeatures', type: 'text', label: 'Product Features', required: true, placeholder: 'e.g., 30-hour battery, noise-canceling, wireless charging' },
          { id: 'pricing', name: 'pricing', type: 'text', label: 'Pricing', required: true, placeholder: 'e.g., $199 (was $249)' },
          { id: 'launchOffer', name: 'launchOffer', type: 'text', label: 'Launch Offer', required: true, placeholder: 'e.g., 20% off for first 100 customers' },
          { id: 'launchDate', name: 'launchDate', type: 'date', label: 'Launch Date', required: true },
          { id: 'productLink', name: 'productLink', type: 'text', label: 'Product Link', required: true, placeholder: 'e.g., https://shop.example.com/product' },
          { id: 'brandName', name: 'brandName', type: 'text', label: 'Brand Name', required: true },
          { id: 'productCategory', name: 'productCategory', type: 'text', label: 'Product Category', required: true, placeholder: 'e.g., Electronics' }
        ],
        tags: ['ecommerce', 'product', 'launch', 'promotion'],
        isPublic: true,
        isPremium: false,
        author: 'CreatorFlow',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 0,
        rating: 4.9,
        downloads: 2100,
        metadata: {
          estimatedTime: 10,
          difficulty: 'intermediate',
          bestFor: ['e-commerce', 'retail', 'tech companies'],
          requirements: ['product photos', 'brand assets', 'pricing information']
        }
      },
      // Fitness Templates
      {
        id: 'fitness_workout_motivation',
        name: 'Workout Motivation Post',
        description: 'Motivate your audience with fitness inspiration',
        category: 'motivation',
        industry: 'fitness',
        platform: 'instagram',
        type: 'image',
        content: {
          text: '💪 {{motivationalQuote}}\n\n{{workoutDescription}}\n\n🔥 {{workoutBenefits}}\n\n{{personalMessage}}\n\n#{{fitnessBrand}} #FitnessMotivation #{{workoutType}} #HealthyLifestyle #{{hashtag1}} #{{hashtag2}}',
          hashtags: ['#FitnessMotivation', '#HealthyLifestyle'],
          callToAction: 'Start your fitness journey!'
        },
        variables: [
          { id: 'motivationalQuote', name: 'motivationalQuote', type: 'text', label: 'Motivational Quote', required: true, placeholder: 'e.g., "The only bad workout is the one that didn\'t happen"' },
          { id: 'workoutDescription', name: 'workoutDescription', type: 'text', label: 'Workout Description', required: true, placeholder: 'e.g., Today\'s 30-minute HIIT session' },
          { id: 'workoutBenefits', name: 'workoutBenefits', type: 'text', label: 'Workout Benefits', required: true, placeholder: 'e.g., Burns 400+ calories, builds strength, boosts energy' },
          { id: 'personalMessage', name: 'personalMessage', type: 'text', label: 'Personal Message', required: true, placeholder: 'e.g., Remember, every rep counts!' },
          { id: 'fitnessBrand', name: 'fitnessBrand', type: 'text', label: 'Fitness Brand', required: true, placeholder: 'e.g., FitLife' },
          { id: 'workoutType', name: 'workoutType', type: 'select', label: 'Workout Type', required: true, options: ['HIIT', 'Yoga', 'Strength Training', 'Cardio', 'Pilates', 'CrossFit'] },
          { id: 'hashtag1', name: 'hashtag1', type: 'text', label: 'Custom Hashtag 1', required: false, placeholder: 'e.g., #MondayMotivation' },
          { id: 'hashtag2', name: 'hashtag2', type: 'text', label: 'Custom Hashtag 2', required: false, placeholder: 'e.g., #NoExcuses' }
        ],
        tags: ['fitness', 'motivation', 'workout', 'health'],
        isPublic: true,
        isPremium: false,
        author: 'CreatorFlow',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 0,
        rating: 4.6,
        downloads: 1800,
        metadata: {
          estimatedTime: 8,
          difficulty: 'beginner',
          bestFor: ['fitness trainers', 'gyms', 'health coaches'],
          requirements: ['workout photos', 'fitness branding']
        }
      },
      // Tech Templates
      {
        id: 'tech_announcement',
        name: 'Tech Product Announcement',
        description: 'Announce new tech products or features',
        category: 'announcement',
        industry: 'technology',
        platform: 'twitter',
        type: 'text',
        content: {
          text: '🚀 {{announcementTitle}}\n\n{{announcementDescription}}\n\n{{keyFeatures}}\n\n{{launchInfo}}\n\n#{{techBrand}} #{{productCategory}} #TechNews #Innovation #{{hashtag1}} #{{hashtag2}}',
          hashtags: ['#TechNews', '#Innovation'],
          callToAction: 'Learn more!'
        },
        variables: [
          { id: 'announcementTitle', name: 'announcementTitle', type: 'text', label: 'Announcement Title', required: true, placeholder: 'e.g., Introducing the Next-Gen AI Assistant' },
          { id: 'announcementDescription', name: 'announcementDescription', type: 'text', label: 'Announcement Description', required: true, placeholder: 'e.g., Revolutionizing how you work with AI' },
          { id: 'keyFeatures', name: 'keyFeatures', type: 'text', label: 'Key Features', required: true, placeholder: 'e.g., 10x faster processing, natural language understanding, real-time collaboration' },
          { id: 'launchInfo', name: 'launchInfo', type: 'text', label: 'Launch Information', required: true, placeholder: 'e.g., Available Q2 2024, Early access for beta users' },
          { id: 'techBrand', name: 'techBrand', type: 'text', label: 'Tech Brand', required: true, placeholder: 'e.g., TechCorp' },
          { id: 'productCategory', name: 'productCategory', type: 'select', label: 'Product Category', required: true, options: ['AI', 'Software', 'Hardware', 'Mobile App', 'Web App', 'API'] },
          { id: 'hashtag1', name: 'hashtag1', type: 'text', label: 'Custom Hashtag 1', required: false },
          { id: 'hashtag2', name: 'hashtag2', type: 'text', label: 'Custom Hashtag 2', required: false }
        ],
        tags: ['technology', 'announcement', 'product', 'innovation'],
        isPublic: true,
        isPremium: false,
        author: 'CreatorFlow',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 0,
        rating: 4.8,
        downloads: 1650,
        metadata: {
          estimatedTime: 12,
          difficulty: 'intermediate',
          bestFor: ['tech companies', 'startups', 'SaaS'],
          requirements: ['product screenshots', 'brand assets', 'technical specifications']
        }
      }
    ];

    defaultTemplates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  private initializeCategories() {
    const categories: TemplateCategory[] = [
      {
        id: 'promotion',
        name: 'Promotion',
        description: 'Promotional content and offers',
        icon: '🎯',
        color: '#FF6B6B',
        industry: 'all',
        templateCount: 0
      },
      {
        id: 'product',
        name: 'Product',
        description: 'Product launches and features',
        icon: '📦',
        color: '#4ECDC4',
        industry: 'all',
        templateCount: 0
      },
      {
        id: 'motivation',
        name: 'Motivation',
        description: 'Inspirational and motivational content',
        icon: '💪',
        color: '#45B7D1',
        industry: 'all',
        templateCount: 0
      },
      {
        id: 'announcement',
        name: 'Announcement',
        description: 'Company and product announcements',
        icon: '📢',
        color: '#96CEB4',
        industry: 'all',
        templateCount: 0
      },
      {
        id: 'educational',
        name: 'Educational',
        description: 'Educational and how-to content',
        icon: '📚',
        color: '#FFEAA7',
        industry: 'all',
        templateCount: 0
      },
      {
        id: 'behind_scenes',
        name: 'Behind the Scenes',
        description: 'Behind the scenes content',
        icon: '🎬',
        color: '#DDA0DD',
        industry: 'all',
        templateCount: 0
      }
    ];

    categories.forEach(category => {
      this.categories.set(category.id, category);
    });

    // Update template counts
    this.updateCategoryCounts();
  }

  private updateCategoryCounts() {
    this.categories.forEach(category => {
      const count = Array.from(this.templates.values())
        .filter(template => template.category === category.id).length;
      category.templateCount = count;
    });
  }

  // Get all templates
  getTemplates(filters?: TemplateSearchFilters): ContentTemplate[] {
    let templates = Array.from(this.templates.values());

    if (filters) {
      if (filters.category) {
        templates = templates.filter(t => t.category === filters.category);
      }
      if (filters.industry) {
        templates = templates.filter(t => t.industry === filters.industry);
      }
      if (filters.platform) {
        templates = templates.filter(t => t.platform === filters.platform);
      }
      if (filters.type) {
        templates = templates.filter(t => t.type === filters.type);
      }
      if (filters.isPublic !== undefined) {
        templates = templates.filter(t => t.isPublic === filters.isPublic);
      }
      if (filters.isPremium !== undefined) {
        templates = templates.filter(t => t.isPremium === filters.isPremium);
      }
      if (filters.difficulty) {
        templates = templates.filter(t => t.metadata.difficulty === filters.difficulty);
      }
      if (filters.tags && filters.tags.length > 0) {
        templates = templates.filter(t => 
          filters.tags!.some(tag => t.tags.includes(tag))
        );
      }
      if (filters.author) {
        templates = templates.filter(t => t.author.includes(filters.author!));
      }
      if (filters.rating) {
        templates = templates.filter(t => t.rating >= filters.rating!);
      }
      if (filters.minDownloads) {
        templates = templates.filter(t => t.downloads >= filters.minDownloads!);
      }
      if (filters.dateRange) {
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        templates = templates.filter(t => {
          const templateDate = new Date(t.createdAt);
          return templateDate >= startDate && templateDate <= endDate;
        });
      }
    }

    return templates;
  }

  // Get template by ID
  getTemplate(id: string): ContentTemplate | undefined {
    return this.templates.get(id);
  }

  // Get all categories
  getCategories(): TemplateCategory[] {
    return Array.from(this.categories.values());
  }

  // Get industries
  getIndustries(): string[] {
    const industries = new Set(Array.from(this.templates.values()).map(t => t.industry));
    return Array.from(industries).sort();
  }

  // Create custom template
  createTemplate(template: Omit<ContentTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount' | 'rating' | 'downloads'>): ContentTemplate {
    const newTemplate: ContentTemplate = {
      ...template,
      id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0,
      rating: 0,
      downloads: 0
    };

    this.templates.set(newTemplate.id, newTemplate);
    this.updateCategoryCounts();

    return newTemplate;
  }

  // Update template
  updateTemplate(id: string, updates: Partial<ContentTemplate>): ContentTemplate | null {
    const template = this.templates.get(id);
    if (!template) return null;

    const updatedTemplate = {
      ...template,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.templates.set(id, updatedTemplate);
    return updatedTemplate;
  }

  // Delete template
  deleteTemplate(id: string): boolean {
    return this.templates.delete(id);
  }

  // Process template with variables
  processTemplate(templateId: string, variables: Record<string, any>): string {
    const template = this.templates.get(templateId);
    if (!template) throw new Error('Template not found');

    let content = template.content.text || '';

    // Replace variables
    template.variables.forEach(variable => {
      const value = variables[variable.id] || variable.defaultValue || '';
      const placeholder = `{{${variable.id}}}`;
      content = content.replace(new RegExp(placeholder, 'g'), String(value));
    });

    return content;
  }

  // Validate template variables
  validateTemplateVariables(templateId: string, variables: Record<string, any>): { valid: boolean; errors: string[] } {
    const template = this.templates.get(templateId);
    if (!template) return { valid: false, errors: ['Template not found'] };

    const errors: string[] = [];

    template.variables.forEach(variable => {
      const value = variables[variable.id];

      if (variable.required && (!value || value.toString().trim() === '')) {
        errors.push(`${variable.label} is required`);
        return;
      }

      if (value && variable.validation) {
        const validation = variable.validation;

        if (validation.min !== undefined && Number(value) < validation.min) {
          errors.push(`${variable.label} must be at least ${validation.min}`);
        }

        if (validation.max !== undefined && Number(value) > validation.max) {
          errors.push(`${variable.label} must be at most ${validation.max}`);
        }

        if (validation.pattern && !new RegExp(validation.pattern).test(value.toString())) {
          errors.push(validation.message || `${variable.label} format is invalid`);
        }
      }
    });

    return { valid: errors.length === 0, errors };
  }

  // Get template statistics
  getTemplateStats(): {
    totalTemplates: number;
    publicTemplates: number;
    premiumTemplates: number;
    categories: number;
    industries: number;
    averageRating: number;
    totalDownloads: number;
  } {
    const templates = Array.from(this.templates.values());
    
    return {
      totalTemplates: templates.length,
      publicTemplates: templates.filter(t => t.isPublic).length,
      premiumTemplates: templates.filter(t => t.isPremium).length,
      categories: this.categories.size,
      industries: this.getIndustries().length,
      averageRating: templates.reduce((sum, t) => sum + t.rating, 0) / templates.length || 0,
      totalDownloads: templates.reduce((sum, t) => sum + t.downloads, 0)
    };
  }
}
