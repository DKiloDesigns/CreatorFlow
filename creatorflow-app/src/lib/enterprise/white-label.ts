/**
 * White-Label Solution Engine
 * Custom branding and domain management for enterprise clients
 */

export interface WhiteLabelConfig {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  domain: WhiteLabelDomain;
  branding: WhiteLabelBranding;
  features: WhiteLabelFeatures;
  settings: WhiteLabelSettings;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface WhiteLabelDomain {
  customDomain: string;
  subdomain: string;
  sslEnabled: boolean;
  dnsConfigured: boolean;
  certificateExpiry?: string;
  redirects: Array<{
    from: string;
    to: string;
    type: 'permanent' | 'temporary';
  }>;
}

export interface WhiteLabelBranding {
  logo: {
    primary: '/logo-light.png';
    secondary?: '/logo-dark.png';
    favicon: '/favicon.png';
    sizes: Array<{
      width: number;
      height: number;
      url: string;
    }>;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    link: string;
    success: string;
    warning: string;
    error: string;
  };
  typography: {
    primaryFont: string;
    secondaryFont: string;
    headingFont: string;
    bodyFont: string;
    fontSizes: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
    };
  };
  styling: {
    borderRadius: string;
    shadows: string;
    spacing: string;
    animations: boolean;
    darkMode: boolean;
  };
  assets: {
    heroImage?: string;
    backgroundImage?: string;
    patterns: string[];
    icons: string[];
  };
}

export interface WhiteLabelFeatures {
  core: {
    contentManagement: boolean;
    scheduling: boolean;
    analytics: boolean;
    teamManagement: boolean;
    reporting: boolean;
  };
  advanced: {
    aiContentGeneration: boolean;
    videoEditing: boolean;
    templateDesigner: boolean;
    brandKitManager: boolean;
    crossPlatformOptimization: boolean;
    abTesting: boolean;
  };
  enterprise: {
    customIntegrations: boolean;
    apiAccess: boolean;
    sso: boolean;
    auditLogs: boolean;
    customReports: boolean;
    whiteLabelMobile: boolean;
  };
  custom: Array<{
    name: string;
    description: string;
    enabled: boolean;
    configuration: Record<string, any>;
  }>;
}

export interface WhiteLabelSettings {
  general: {
    appName: string;
    tagline: string;
    description: string;
    supportEmail: string;
    supportPhone?: string;
    timezone: string;
    language: string;
    currency: string;
  };
  navigation: {
    showBranding: boolean;
    customMenuItems: Array<{
      label: string;
      url: string;
      icon?: string;
      external: boolean;
    }>;
    footerLinks: Array<{
      label: string;
      url: string;
      external: boolean;
    }>;
  };
  content: {
    defaultTemplates: string[];
    customTemplates: string[];
    contentApproval: boolean;
    brandGuidelines: string;
    watermarking: boolean;
  };
  security: {
    ssoProvider?: string;
    ssoConfig?: Record<string, any>;
    ipWhitelist: string[];
    sessionTimeout: number;
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSymbols: boolean;
    };
  };
  notifications: {
    email: {
      enabled: boolean;
      templates: Record<string, string>;
      senderName: string;
      senderEmail: string;
    };
    inApp: {
      enabled: boolean;
      channels: string[];
    };
    sms: {
      enabled: boolean;
      provider?: string;
      templates: Record<string, string>;
    };
  };
}

export interface WhiteLabelTheme {
  id: string;
  name: string;
  description: string;
  organizationId: string;
  branding: WhiteLabelBranding;
  css: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WhiteLabelTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  organizationId: string;
  content: string;
  metadata: {
    platforms: string[];
    contentType: string;
    dimensions: {
      width: number;
      height: number;
    };
    tags: string[];
  };
  isPublic: boolean;
  usage: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface WhiteLabelIntegration {
  id: string;
  name: string;
  description: string;
  organizationId: string;
  type: 'api' | 'webhook' | 'sso' | 'payment' | 'analytics' | 'custom';
  configuration: Record<string, any>;
  credentials: {
    encrypted: boolean;
    fields: Array<{
      name: string;
      type: 'text' | 'password' | 'url' | 'email';
      required: boolean;
      value?: string;
    }>;
  };
  status: 'active' | 'inactive' | 'error' | 'pending';
  lastSync?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WhiteLabelAnalytics {
  organizationId: string;
  period: {
    start: string;
    end: string;
  };
  metrics: {
    users: {
      total: number;
      active: number;
      new: number;
      growth: number;
    };
    content: {
      total: number;
      published: number;
      scheduled: number;
      drafts: number;
    };
    engagement: {
      total: number;
      rate: number;
      growth: number;
    };
    platforms: Array<{
      platform: string;
      posts: number;
      engagement: number;
      reach: number;
    }>;
  };
  insights: string[];
  recommendations: string[];
}

export class WhiteLabelEngine {
  private configs: Map<string, WhiteLabelConfig> = new Map();
  private themes: Map<string, WhiteLabelTheme> = new Map();
  private templates: Map<string, WhiteLabelTemplate> = new Map();
  private integrations: Map<string, WhiteLabelIntegration> = new Map();

  constructor() {
    this.initializeDefaultThemes();
  }

  // White-Label Configuration Management
  async createWhiteLabelConfig(
    organizationId: string,
    name: string,
    description: string,
    domain: string,
    createdBy: string
  ): Promise<WhiteLabelConfig> {
    const configId = `wl_${Date.now()}`;
    
    const config: WhiteLabelConfig = {
      id: configId,
      organizationId,
      name,
      description,
      domain: {
        customDomain: domain,
        subdomain: this.generateSubdomain(domain),
        sslEnabled: false,
        dnsConfigured: false,
        redirects: []
      },
      branding: this.getDefaultBranding(),
      features: this.getDefaultFeatures(),
      settings: this.getDefaultSettings(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy
    };

    this.configs.set(configId, config);
    return config;
  }

  async getWhiteLabelConfig(configId: string): Promise<WhiteLabelConfig | null> {
    return this.configs.get(configId) || null;
  }

  async updateWhiteLabelConfig(
    configId: string,
    updates: Partial<WhiteLabelConfig>,
    userId: string
  ): Promise<WhiteLabelConfig> {
    const config = this.configs.get(configId);
    if (!config) {
      throw new Error('White-label configuration not found');
    }

    const updatedConfig = {
      ...config,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.configs.set(configId, updatedConfig);
    return updatedConfig;
  }

  async deleteWhiteLabelConfig(configId: string): Promise<boolean> {
    return this.configs.delete(configId);
  }

  // Domain Management
  async configureDomain(
    configId: string,
    domainConfig: Partial<WhiteLabelDomain>
  ): Promise<WhiteLabelDomain> {
    const config = this.configs.get(configId);
    if (!config) {
      throw new Error('White-label configuration not found');
    }

    const updatedDomain = {
      ...config.domain,
      ...domainConfig
    };

    config.domain = updatedDomain;
    config.updatedAt = new Date().toISOString();
    
    this.configs.set(configId, config);
    return updatedDomain;
  }

  async validateDomain(domain: string): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Basic domain validation
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain)) {
      errors.push('Invalid domain format');
    }

    // Check if domain is already in use
    const existingConfigs = Array.from(this.configs.values());
    if (existingConfigs.some(c => c.domain.customDomain === domain)) {
      errors.push('Domain is already in use');
    }

    // Check domain availability (mock)
    if (domain.includes('test') || domain.includes('example')) {
      warnings.push('Domain may not be available for registration');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // Branding Management
  async updateBranding(
    configId: string,
    branding: Partial<WhiteLabelBranding>
  ): Promise<WhiteLabelBranding> {
    const config = this.configs.get(configId);
    if (!config) {
      throw new Error('White-label configuration not found');
    }

    const updatedBranding = {
      ...config.branding,
      ...branding
    };

    config.branding = updatedBranding;
    config.updatedAt = new Date().toISOString();
    
    this.configs.set(configId, config);
    return updatedBranding;
  }

  async generateTheme(configId: string): Promise<WhiteLabelTheme> {
    const config = this.configs.get(configId);
    if (!config) {
      throw new Error('White-label configuration not found');
    }

    const themeId = `theme_${Date.now()}`;
    const css = this.generateCSS(config.branding);
    
    const theme: WhiteLabelTheme = {
      id: themeId,
      name: `${config.name} Theme`,
      description: `Custom theme for ${config.name}`,
      organizationId: config.organizationId,
      branding: config.branding,
      css,
      isDefault: true,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.themes.set(themeId, theme);
    return theme;
  }

  // Feature Management
  async updateFeatures(
    configId: string,
    features: Partial<WhiteLabelFeatures>
  ): Promise<WhiteLabelFeatures> {
    const config = this.configs.get(configId);
    if (!config) {
      throw new Error('White-label configuration not found');
    }

    const updatedFeatures = {
      ...config.features,
      ...features
    };

    config.features = updatedFeatures;
    config.updatedAt = new Date().toISOString();
    
    this.configs.set(configId, config);
    return updatedFeatures;
  }

  // Template Management
  async createTemplate(
    organizationId: string,
    name: string,
    description: string,
    category: string,
    content: string,
    metadata: WhiteLabelTemplate['metadata']
  ): Promise<WhiteLabelTemplate> {
    const templateId = `template_${Date.now()}`;
    
    const template: WhiteLabelTemplate = {
      id: templateId,
      name,
      description,
      category,
      organizationId,
      content,
      metadata,
      isPublic: false,
      usage: 0,
      rating: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.templates.set(templateId, template);
    return template;
  }

  async getTemplates(
    organizationId: string,
    filters?: {
      category?: string;
      isPublic?: boolean;
      search?: string;
    }
  ): Promise<WhiteLabelTemplate[]> {
    let templates = Array.from(this.templates.values())
      .filter(t => t.organizationId === organizationId);

    if (filters) {
      if (filters.category) {
        templates = templates.filter(t => t.category === filters.category);
      }
      if (filters.isPublic !== undefined) {
        templates = templates.filter(t => t.isPublic === filters.isPublic);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        templates = templates.filter(t => 
          t.name.toLowerCase().includes(searchLower) ||
          t.description.toLowerCase().includes(searchLower)
        );
      }
    }

    return templates.sort((a, b) => b.usage - a.usage);
  }

  // Integration Management
  async createIntegration(
    organizationId: string,
    name: string,
    description: string,
    type: WhiteLabelIntegration['type'],
    configuration: Record<string, any>
  ): Promise<WhiteLabelIntegration> {
    const integrationId = `integration_${Date.now()}`;
    
    const integration: WhiteLabelIntegration = {
      id: integrationId,
      name,
      description,
      organizationId,
      type,
      configuration,
      credentials: {
        encrypted: true,
        fields: []
      },
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.integrations.set(integrationId, integration);
    return integration;
  }

  async getIntegrations(organizationId: string): Promise<WhiteLabelIntegration[]> {
    return Array.from(this.integrations.values())
      .filter(i => i.organizationId === organizationId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Analytics
  async getWhiteLabelAnalytics(
    organizationId: string,
    period: { start: string; end: string }
  ): Promise<WhiteLabelAnalytics> {
    // Mock analytics data
    return {
      organizationId,
      period,
      metrics: {
        users: {
          total: 150,
          active: 120,
          new: 25,
          growth: 20.5
        },
        content: {
          total: 2500,
          published: 2000,
          scheduled: 300,
          drafts: 200
        },
        engagement: {
          total: 45000,
          rate: 3.6,
          growth: 15.2
        },
        platforms: [
          { platform: 'Instagram', posts: 800, engagement: 15000, reach: 45000 },
          { platform: 'Facebook', posts: 600, engagement: 12000, reach: 35000 },
          { platform: 'Twitter', posts: 500, engagement: 8000, reach: 25000 },
          { platform: 'LinkedIn', posts: 400, engagement: 10000, reach: 20000 }
        ]
      },
      insights: [
        'Instagram shows the highest engagement rates',
        'Video content performs 3x better than images',
        'Posting during business hours increases engagement by 25%'
      ],
      recommendations: [
        'Increase video content production',
        'Optimize posting schedule for business hours',
        'Focus on Instagram and LinkedIn for B2B content'
      ]
    };
  }

  // Private helper methods
  private generateSubdomain(domain: string): string {
    const cleanDomain = domain.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    return `${cleanDomain}.floai.studio`;
  }

  private getDefaultBranding(): WhiteLabelBranding {
    return {
      logo: {
        primary: '/logo-light.png',
        favicon: '/favicon.png',
        sizes: [
          { width: 32, height: 32, url: '/logo-32.png' },
          { width: 64, height: 64, url: '/logo-64.png' },
          { width: 128, height: 128, url: '/logo-128.png' }
        ]
      },
      colors: {
        primary: '#1976d2',
        secondary: '#424242',
        accent: '#ff4081',
        background: '#ffffff',
        text: '#212121',
        link: '#1976d2',
        success: '#4caf50',
        warning: '#ff9800',
        error: '#f44336'
      },
      typography: {
        primaryFont: 'Inter',
        secondaryFont: 'Roboto',
        headingFont: 'Inter',
        bodyFont: 'Inter',
        fontSizes: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem'
        }
      },
      styling: {
        borderRadius: '0.375rem',
        shadows: '0 1px 3px rgba(0, 0, 0, 0.1)',
        spacing: '1rem',
        animations: true,
        darkMode: false
      },
      assets: {
        patterns: [],
        icons: []
      }
    };
  }

  private getDefaultFeatures(): WhiteLabelFeatures {
    return {
      core: {
        contentManagement: true,
        scheduling: true,
        analytics: true,
        teamManagement: true,
        reporting: true
      },
      advanced: {
        aiContentGeneration: false,
        videoEditing: false,
        templateDesigner: false,
        brandKitManager: false,
        crossPlatformOptimization: false,
        abTesting: false
      },
      enterprise: {
        customIntegrations: false,
        apiAccess: false,
        sso: false,
        auditLogs: false,
        customReports: false,
        whiteLabelMobile: false
      },
      custom: []
    };
  }

  private getDefaultSettings(): WhiteLabelSettings {
    return {
      general: {
        appName: 'floai.studio',
        tagline: 'floai.studio - Social Media Management Made Simple',
        description: 'Manage all your social media accounts in one place with floai.studio',
        supportEmail: 'support@floai.studio',
        timezone: 'UTC',
        language: 'en',
        currency: 'USD'
      },
      navigation: {
        showBranding: true,
        customMenuItems: [],
        footerLinks: []
      },
      content: {
        defaultTemplates: [],
        customTemplates: [],
        contentApproval: false,
        brandGuidelines: '',
        watermarking: false
      },
      security: {
        ipWhitelist: [],
        sessionTimeout: 3600,
        passwordPolicy: {
          minLength: 8,
          requireUppercase: true,
          requireLowercase: true,
          requireNumbers: true,
          requireSymbols: false
        }
      },
      notifications: {
        email: {
          enabled: true,
          templates: {},
          senderName: 'floai.studio',
          senderEmail: 'noreply@floai.studio'
        },
        inApp: {
          enabled: true,
          channels: ['general', 'content', 'analytics']
        },
        sms: {
          enabled: false,
          templates: {}
        }
      }
    };
  }

  private generateCSS(branding: WhiteLabelBranding): string {
    return `
      :root {
        --primary-color: ${branding.colors.primary};
        --secondary-color: ${branding.colors.secondary};
        --accent-color: ${branding.colors.accent};
        --background-color: ${branding.colors.background};
        --text-color: ${branding.colors.text};
        --link-color: ${branding.colors.link};
        --success-color: ${branding.colors.success};
        --warning-color: ${branding.colors.warning};
        --error-color: ${branding.colors.error};
        
        --primary-font: '${branding.typography.primaryFont}', sans-serif;
        --secondary-font: '${branding.typography.secondaryFont}', sans-serif;
        --heading-font: '${branding.typography.headingFont}', sans-serif;
        --body-font: '${branding.typography.bodyFont}', sans-serif;
        
        --border-radius: ${branding.styling.borderRadius};
        --box-shadow: ${branding.styling.shadows};
        --spacing: ${branding.styling.spacing};
      }
      
      body {
        font-family: var(--body-font);
        color: var(--text-color);
        background-color: var(--background-color);
      }
      
      .btn-primary {
        background-color: var(--primary-color);
        border-color: var(--primary-color);
        color: white;
        border-radius: var(--border-radius);
      }
      
      .btn-primary:hover {
        background-color: var(--secondary-color);
        border-color: var(--secondary-color);
      }
      
      .text-primary {
        color: var(--primary-color) !important;
      }
      
      .bg-primary {
        background-color: var(--primary-color) !important;
      }
      
      .card {
        border-radius: var(--border-radius);
        box-shadow: var(--box-shadow);
      }
      
      .navbar-brand img {
        max-height: 40px;
      }
      
      h1, h2, h3, h4, h5, h6 {
        font-family: var(--heading-font);
      }
    `;
  }

  private initializeDefaultThemes(): void {
    const defaultTheme: WhiteLabelTheme = {
      id: 'default_theme',
      name: 'Default Theme',
      description: 'Default floai.studio theme',
      organizationId: 'system',
      branding: this.getDefaultBranding(),
      css: this.generateCSS(this.getDefaultBranding()),
      isDefault: true,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.themes.set('default_theme', defaultTheme);
  }
}
