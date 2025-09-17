/**
 * Template Designer Engine
 * Drag-and-drop template creation tool
 */

export interface TemplateDesignRequest {
  name: string;
  description: string;
  platform: string;
  category: string;
  dimensions: {
    width: number;
    height: number;
  };
  elements: TemplateElement[];
  styles: TemplateStyles;
  metadata: TemplateMetadata;
}

export interface TemplateElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'icon' | 'background' | 'overlay';
  position: {
    x: number;
    y: number;
    z: number;
  };
  size: {
    width: number;
    height: number;
  };
  properties: Record<string, any>;
  constraints: {
    resizable: boolean;
    movable: boolean;
    rotatable: boolean;
    deletable: boolean;
  };
  locked: boolean;
  visible: boolean;
}

export interface TemplateStyles {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: FontStyle;
    body: FontStyle;
    accent: FontStyle;
  };
  spacing: {
    margin: number;
    padding: number;
    gap: number;
  };
  effects: {
    shadows: boolean;
    borders: boolean;
    gradients: boolean;
    animations: boolean;
  };
}

export interface FontStyle {
  family: string;
  size: number;
  weight: 'normal' | 'bold' | 'lighter' | 'bolder' | number;
  style: 'normal' | 'italic' | 'oblique';
  color: string;
  lineHeight: number;
  letterSpacing: number;
}

export interface TemplateMetadata {
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // minutes
  requiredAssets: string[];
  customizable: {
    text: boolean;
    colors: boolean;
    images: boolean;
    layout: boolean;
  };
  version: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  platform: string;
  category: string;
  previewUrl: string;
  template: TemplateDesignRequest;
  usage: number;
  rating: number;
  downloads: number;
  isPublic: boolean;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  templates: number;
  platforms: string[];
}

export interface DesignAsset {
  id: string;
  name: string;
  type: 'image' | 'icon' | 'font' | 'color' | 'pattern' | 'texture';
  url: string;
  thumbnailUrl: string;
  category: string;
  tags: string[];
  size: {
    width: number;
    height: number;
  };
  fileSize: number;
  format: string;
  isPremium: boolean;
  createdAt: string;
}

export interface DesignHistory {
  id: string;
  templateId: string;
  action: 'create' | 'edit' | 'duplicate' | 'delete' | 'publish' | 'unpublish';
  changes: Record<string, any>;
  timestamp: string;
  userId: string;
}

export class TemplateDesigner {
  private templates: Map<string, Template> = new Map();
  private categories: TemplateCategory[] = [];
  private assets: DesignAsset[] = [];
  private history: DesignHistory[] = [];

  // Create new template
  async createTemplate(request: TemplateDesignRequest): Promise<Template> {
    const templateId = `template_${Date.now()}`;
    
    const template: Template = {
      id: templateId,
      name: request.name,
      description: request.description,
      platform: request.platform,
      category: request.category,
      previewUrl: await this.generatePreview(request),
      template: request,
      usage: 0,
      rating: 0,
      downloads: 0,
      isPublic: false,
      isPremium: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.templates.set(templateId, template);
    this.addToHistory(templateId, 'create', {});
    
    return template;
  }

  // Update existing template
  async updateTemplate(templateId: string, updates: Partial<TemplateDesignRequest>): Promise<Template> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    const updatedTemplate = {
      ...template,
      template: {
        ...template.template,
        ...updates
      },
      updatedAt: new Date().toISOString()
    };

    this.templates.set(templateId, updatedTemplate);
    this.addToHistory(templateId, 'edit', updates);
    
    return updatedTemplate;
  }

  // Duplicate template
  async duplicateTemplate(templateId: string, newName: string): Promise<Template> {
    const originalTemplate = this.templates.get(templateId);
    if (!originalTemplate) {
      throw new Error('Template not found');
    }

    const duplicatedTemplate: Template = {
      ...originalTemplate,
      id: `template_${Date.now()}`,
      name: newName,
      usage: 0,
      downloads: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.templates.set(duplicatedTemplate.id, duplicatedTemplate);
    this.addToHistory(duplicatedTemplate.id, 'duplicate', { originalId: templateId });
    
    return duplicatedTemplate;
  }

  // Get template by ID
  async getTemplate(templateId: string): Promise<Template | null> {
    return this.templates.get(templateId) || null;
  }

  // Get templates by category
  async getTemplatesByCategory(category: string, platform?: string): Promise<Template[]> {
    let templates = Array.from(this.templates.values())
      .filter(t => t.category === category);

    if (platform) {
      templates = templates.filter(t => t.platform === platform);
    }

    return templates.sort((a, b) => b.usage - a.usage);
  }

  // Get templates by platform
  async getTemplatesByPlatform(platform: string): Promise<Template[]> {
    return Array.from(this.templates.values())
      .filter(t => t.platform === platform)
      .sort((a, b) => b.usage - a.usage);
  }

  // Search templates
  async searchTemplates(query: string, filters?: {
    platform?: string;
    category?: string;
    difficulty?: string;
    isPremium?: boolean;
  }): Promise<Template[]> {
    let templates = Array.from(this.templates.values());

    // Text search
    if (query) {
      const searchTerms = query.toLowerCase().split(' ');
      templates = templates.filter(template => {
        const searchText = `${template.name} ${template.description} ${template.template.metadata.tags.join(' ')}`.toLowerCase();
        return searchTerms.every(term => searchText.includes(term));
      });
    }

    // Apply filters
    if (filters) {
      if (filters.platform) {
        templates = templates.filter(t => t.platform === filters.platform);
      }
      if (filters.category) {
        templates = templates.filter(t => t.category === filters.category);
      }
      if (filters.difficulty) {
        templates = templates.filter(t => t.template.metadata.difficulty === filters.difficulty);
      }
      if (filters.isPremium !== undefined) {
        templates = templates.filter(t => t.isPremium === filters.isPremium);
      }
    }

    return templates.sort((a, b) => b.rating - a.rating);
  }

  // Get template categories
  async getCategories(): Promise<TemplateCategory[]> {
    if (this.categories.length === 0) {
      this.categories = await this.initializeCategories();
    }
    return this.categories;
  }

  // Get design assets
  async getAssets(type?: string, category?: string): Promise<DesignAsset[]> {
    let assets = this.assets;

    if (type) {
      assets = assets.filter(a => a.type === type);
    }

    if (category) {
      assets = assets.filter(a => a.category === category);
    }

    return assets;
  }

  // Add design asset
  async addAsset(asset: Omit<DesignAsset, 'id' | 'createdAt'>): Promise<DesignAsset> {
    const newAsset: DesignAsset = {
      ...asset,
      id: `asset_${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    this.assets.push(newAsset);
    return newAsset;
  }

  // Get template history
  async getTemplateHistory(templateId: string): Promise<DesignHistory[]> {
    return this.history.filter(h => h.templateId === templateId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // Publish template
  async publishTemplate(templateId: string, isPublic: boolean = true): Promise<Template> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    const updatedTemplate = {
      ...template,
      isPublic,
      updatedAt: new Date().toISOString()
    };

    this.templates.set(templateId, updatedTemplate);
    this.addToHistory(templateId, isPublic ? 'publish' : 'unpublish', { isPublic });
    
    return updatedTemplate;
  }

  // Delete template
  async deleteTemplate(templateId: string): Promise<boolean> {
    const template = this.templates.get(templateId);
    if (!template) {
      return false;
    }

    this.templates.delete(templateId);
    this.addToHistory(templateId, 'delete', {});
    
    return true;
  }

  // Rate template
  async rateTemplate(templateId: string, rating: number): Promise<Template> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    const updatedTemplate = {
      ...template,
      rating: (template.rating + rating) / 2, // Simple average
      updatedAt: new Date().toISOString()
    };

    this.templates.set(templateId, updatedTemplate);
    
    return updatedTemplate;
  }

  // Increment usage
  async incrementUsage(templateId: string): Promise<void> {
    const template = this.templates.get(templateId);
    if (template) {
      template.usage++;
      template.downloads++;
      this.templates.set(templateId, template);
    }
  }

  // Private helper methods
  private async generatePreview(request: TemplateDesignRequest): Promise<string> {
    // Mock preview generation - in production, this would render the template
    return `/previews/template_${Date.now()}.jpg`;
  }

  private async initializeCategories(): Promise<TemplateCategory[]> {
    return [
      {
        id: 'social_media',
        name: 'Social Media',
        description: 'Templates for social media posts',
        icon: 'share',
        color: '#1976d2',
        templates: 0,
        platforms: ['instagram', 'facebook', 'twitter', 'linkedin']
      },
      {
        id: 'marketing',
        name: 'Marketing',
        description: 'Marketing and promotional templates',
        icon: 'campaign',
        color: '#4caf50',
        templates: 0,
        platforms: ['instagram', 'facebook', 'linkedin', 'youtube']
      },
      {
        id: 'business',
        name: 'Business',
        description: 'Professional business templates',
        icon: 'business',
        color: '#ff9800',
        templates: 0,
        platforms: ['linkedin', 'facebook', 'twitter']
      },
      {
        id: 'education',
        name: 'Education',
        description: 'Educational and informative templates',
        icon: 'school',
        color: '#9c27b0',
        templates: 0,
        platforms: ['instagram', 'facebook', 'youtube', 'tiktok']
      },
      {
        id: 'entertainment',
        name: 'Entertainment',
        description: 'Fun and entertaining templates',
        icon: 'entertainment',
        color: '#f44336',
        templates: 0,
        platforms: ['instagram', 'tiktok', 'youtube', 'twitter']
      }
    ];
  }

  private addToHistory(templateId: string, action: string, changes: Record<string, any>): void {
    const historyEntry: DesignHistory = {
      id: `history_${Date.now()}`,
      templateId,
      action: action as any,
      changes,
      timestamp: new Date().toISOString(),
      userId: 'current_user' // In production, get from auth context
    };

    this.history.push(historyEntry);
  }
}
