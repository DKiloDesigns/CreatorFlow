/**
 * Brand Kit Manager
 * Centralized brand assets and style guides
 */

export interface BrandKit {
  id: string;
  name: string;
  description: string;
  colors: BrandColor[];
  fonts: BrandFont[];
  logos: BrandLogo[];
  patterns: BrandPattern[];
  icons: BrandIcon[];
  guidelines: BrandGuidelines;
  isActive: boolean;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BrandColor {
  id: string;
  name: string;
  hex: string;
  rgb: string;
  hsl: string;
  usage: 'primary' | 'secondary' | 'accent' | 'neutral' | 'success' | 'warning' | 'error' | 'info';
  category: 'brand' | 'semantic' | 'neutral' | 'gradient';
  description?: string;
  isCustom: boolean;
  createdAt: string;
}

export interface BrandFont {
  id: string;
  name: string;
  family: string;
  weights: FontWeight[];
  styles: FontStyle[];
  usage: 'heading' | 'body' | 'accent' | 'display' | 'monospace';
  category: 'serif' | 'sans-serif' | 'display' | 'handwriting' | 'monospace';
  description?: string;
  isCustom: boolean;
  webFont?: {
    provider: 'google' | 'adobe' | 'custom';
    url: string;
  };
  createdAt: string;
}

export interface FontWeight {
  value: number;
  name: string;
  available: boolean;
}

export interface FontStyle {
  value: 'normal' | 'italic' | 'oblique';
  name: string;
  available: boolean;
}

export interface BrandLogo {
  id: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  format: 'png' | 'svg' | 'jpg' | 'eps' | 'ai';
  usage: 'primary' | 'secondary' | 'icon' | 'wordmark' | 'symbol';
  variants: LogoVariant[];
  size: {
    width: number;
    height: number;
  };
  fileSize: number;
  description?: string;
  isCustom: boolean;
  createdAt: string;
}

export interface LogoVariant {
  id: string;
  name: string;
  url: string;
  description: string;
  usage: string;
}

export interface BrandPattern {
  id: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  type: 'background' | 'texture' | 'border' | 'overlay' | 'decoration';
  category: 'geometric' | 'organic' | 'abstract' | 'textured' | 'gradient';
  size: {
    width: number;
    height: number;
  };
  repeatable: boolean;
  opacity: number;
  description?: string;
  isCustom: boolean;
  createdAt: string;
}

export interface BrandIcon {
  id: string;
  name: string;
  url: string;
  format: 'svg' | 'png' | 'ico';
  category: 'social' | 'navigation' | 'action' | 'status' | 'content' | 'business';
  size: {
    width: number;
    height: number;
  };
  style: 'outline' | 'filled' | 'duotone' | 'hand-drawn';
  description?: string;
  isCustom: boolean;
  createdAt: string;
}

export interface BrandGuidelines {
  logo: {
    minSize: number;
    clearSpace: number;
    do: string[];
    dont: string[];
  };
  colors: {
    primaryUsage: string[];
    secondaryUsage: string[];
    accentUsage: string[];
    do: string[];
    dont: string[];
  };
  typography: {
    headingHierarchy: string[];
    bodyText: string[];
    spacing: string;
    do: string[];
    dont: string[];
  };
  spacing: {
    grid: number;
    margins: string;
    padding: string;
    gutters: string;
  };
  imagery: {
    style: string;
    filters: string[];
    composition: string[];
    do: string[];
    dont: string[];
  };
  voice: {
    tone: string;
    personality: string[];
    examples: string[];
  };
}

export interface BrandKitUsage {
  templateId: string;
  templateName: string;
  platform: string;
  usageCount: number;
  lastUsed: string;
}

export interface BrandKitAnalytics {
  totalUsage: number;
  mostUsedColors: Array<{
    color: BrandColor;
    usage: number;
  }>;
  mostUsedFonts: Array<{
    font: BrandFont;
    usage: number;
  }>;
  mostUsedLogos: Array<{
    logo: BrandLogo;
    usage: number;
  }>;
  platformBreakdown: Array<{
    platform: string;
    usage: number;
  }>;
  recentUsage: BrandKitUsage[];
}

export class BrandKitManager {
  private brandKits: Map<string, BrandKit> = new Map();
  private usage: Map<string, BrandKitUsage[]> = new Map();

  // Create new brand kit
  async createBrandKit(brandKit: Omit<BrandKit, 'id' | 'createdAt' | 'updatedAt'>): Promise<BrandKit> {
    const id = `brand_${Date.now()}`;
    const newBrandKit: BrandKit = {
      ...brandKit,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.brandKits.set(id, newBrandKit);
    return newBrandKit;
  }

  // Get brand kit by ID
  async getBrandKit(id: string): Promise<BrandKit | null> {
    return this.brandKits.get(id) || null;
  }

  // Get all brand kits
  async getAllBrandKits(): Promise<BrandKit[]> {
    return Array.from(this.brandKits.values())
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  // Get active brand kit
  async getActiveBrandKit(): Promise<BrandKit | null> {
    const brandKits = Array.from(this.brandKits.values());
    return brandKits.find(kit => kit.isActive) || null;
  }

  // Update brand kit
  async updateBrandKit(id: string, updates: Partial<BrandKit>): Promise<BrandKit> {
    const brandKit = this.brandKits.get(id);
    if (!brandKit) {
      throw new Error('Brand kit not found');
    }

    const updatedBrandKit = {
      ...brandKit,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.brandKits.set(id, updatedBrandKit);
    return updatedBrandKit;
  }

  // Set active brand kit
  async setActiveBrandKit(id: string): Promise<BrandKit> {
    // Deactivate all other brand kits
    for (const [kitId, kit] of this.brandKits) {
      if (kitId !== id) {
        kit.isActive = false;
        this.brandKits.set(kitId, kit);
      }
    }

    // Activate the selected brand kit
    const brandKit = this.brandKits.get(id);
    if (!brandKit) {
      throw new Error('Brand kit not found');
    }

    brandKit.isActive = true;
    this.brandKits.set(id, brandKit);
    
    return brandKit;
  }

  // Add color to brand kit
  async addColor(brandKitId: string, color: Omit<BrandColor, 'id' | 'createdAt'>): Promise<BrandColor> {
    const brandKit = this.brandKits.get(brandKitId);
    if (!brandKit) {
      throw new Error('Brand kit not found');
    }

    const newColor: BrandColor = {
      ...color,
      id: `color_${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    brandKit.colors.push(newColor);
    this.brandKits.set(brandKitId, brandKit);
    
    return newColor;
  }

  // Add font to brand kit
  async addFont(brandKitId: string, font: Omit<BrandFont, 'id' | 'createdAt'>): Promise<BrandFont> {
    const brandKit = this.brandKits.get(brandKitId);
    if (!brandKit) {
      throw new Error('Brand kit not found');
    }

    const newFont: BrandFont = {
      ...font,
      id: `font_${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    brandKit.fonts.push(newFont);
    this.brandKits.set(brandKitId, brandKit);
    
    return newFont;
  }

  // Add logo to brand kit
  async addLogo(brandKitId: string, logo: Omit<BrandLogo, 'id' | 'createdAt'>): Promise<BrandLogo> {
    const brandKit = this.brandKits.get(brandKitId);
    if (!brandKit) {
      throw new Error('Brand kit not found');
    }

    const newLogo: BrandLogo = {
      ...logo,
      id: `logo_${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    brandKit.logos.push(newLogo);
    this.brandKits.set(brandKitId, brandKit);
    
    return newLogo;
  }

  // Add pattern to brand kit
  async addPattern(brandKitId: string, pattern: Omit<BrandPattern, 'id' | 'createdAt'>): Promise<BrandPattern> {
    const brandKit = this.brandKits.get(brandKitId);
    if (!brandKit) {
      throw new Error('Brand kit not found');
    }

    const newPattern: BrandPattern = {
      ...pattern,
      id: `pattern_${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    brandKit.patterns.push(newPattern);
    this.brandKits.set(brandKitId, brandKit);
    
    return newPattern;
  }

  // Add icon to brand kit
  async addIcon(brandKitId: string, icon: Omit<BrandIcon, 'id' | 'createdAt'>): Promise<BrandIcon> {
    const brandKit = this.brandKits.get(brandKitId);
    if (!brandKit) {
      throw new Error('Brand kit not found');
    }

    const newIcon: BrandIcon = {
      ...icon,
      id: `icon_${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    brandKit.icons.push(newIcon);
    this.brandKits.set(brandKitId, brandKit);
    
    return newIcon;
  }

  // Remove asset from brand kit
  async removeAsset(brandKitId: string, assetType: 'color' | 'font' | 'logo' | 'pattern' | 'icon', assetId: string): Promise<boolean> {
    const brandKit = this.brandKits.get(brandKitId);
    if (!brandKit) {
      return false;
    }

    let removed = false;
    switch (assetType) {
      case 'color':
        const colorIndex = brandKit.colors.findIndex(c => c.id === assetId);
        if (colorIndex !== -1) {
          brandKit.colors.splice(colorIndex, 1);
          removed = true;
        }
        break;
      case 'font':
        const fontIndex = brandKit.fonts.findIndex(f => f.id === assetId);
        if (fontIndex !== -1) {
          brandKit.fonts.splice(fontIndex, 1);
          removed = true;
        }
        break;
      case 'logo':
        const logoIndex = brandKit.logos.findIndex(l => l.id === assetId);
        if (logoIndex !== -1) {
          brandKit.logos.splice(logoIndex, 1);
          removed = true;
        }
        break;
      case 'pattern':
        const patternIndex = brandKit.patterns.findIndex(p => p.id === assetId);
        if (patternIndex !== -1) {
          brandKit.patterns.splice(patternIndex, 1);
          removed = true;
        }
        break;
      case 'icon':
        const iconIndex = brandKit.icons.findIndex(i => i.id === assetId);
        if (iconIndex !== -1) {
          brandKit.icons.splice(iconIndex, 1);
          removed = true;
        }
        break;
    }

    if (removed) {
      this.brandKits.set(brandKitId, brandKit);
    }

    return removed;
  }

  // Get brand kit analytics
  async getBrandKitAnalytics(brandKitId: string): Promise<BrandKitAnalytics> {
    const brandKit = this.brandKits.get(brandKitId);
    if (!brandKit) {
      throw new Error('Brand kit not found');
    }

    const usage = this.usage.get(brandKitId) || [];
    const totalUsage = usage.reduce((sum, u) => sum + u.usageCount, 0);

    // Calculate most used colors
    const colorUsage = new Map<string, number>();
    usage.forEach(u => {
      // Mock color usage calculation
      brandKit.colors.forEach(color => {
        const currentUsage = colorUsage.get(color.id) || 0;
        colorUsage.set(color.id, currentUsage + Math.floor(Math.random() * 10));
      });
    });

    const mostUsedColors = Array.from(colorUsage.entries())
      .map(([colorId, usage]) => ({
        color: brandKit.colors.find(c => c.id === colorId)!,
        usage
      }))
      .sort((a, b) => b.usage - a.usage)
      .slice(0, 5);

    // Calculate most used fonts
    const fontUsage = new Map<string, number>();
    usage.forEach(u => {
      brandKit.fonts.forEach(font => {
        const currentUsage = fontUsage.get(font.id) || 0;
        fontUsage.set(font.id, currentUsage + Math.floor(Math.random() * 5));
      });
    });

    const mostUsedFonts = Array.from(fontUsage.entries())
      .map(([fontId, usage]) => ({
        font: brandKit.fonts.find(f => f.id === fontId)!,
        usage
      }))
      .sort((a, b) => b.usage - a.usage)
      .slice(0, 3);

    // Calculate most used logos
    const logoUsage = new Map<string, number>();
    usage.forEach(u => {
      brandKit.logos.forEach(logo => {
        const currentUsage = logoUsage.get(logo.id) || 0;
        logoUsage.set(logo.id, currentUsage + Math.floor(Math.random() * 3));
      });
    });

    const mostUsedLogos = Array.from(logoUsage.entries())
      .map(([logoId, usage]) => ({
        logo: brandKit.logos.find(l => l.id === logoId)!,
        usage
      }))
      .sort((a, b) => b.usage - a.usage)
      .slice(0, 3);

    // Calculate platform breakdown
    const platformUsage = new Map<string, number>();
    usage.forEach(u => {
      const currentUsage = platformUsage.get(u.platform) || 0;
      platformUsage.set(u.platform, currentUsage + u.usageCount);
    });

    const platformBreakdown = Array.from(platformUsage.entries())
      .map(([platform, usage]) => ({ platform, usage }))
      .sort((a, b) => b.usage - a.usage);

    return {
      totalUsage,
      mostUsedColors,
      mostUsedFonts,
      mostUsedLogos,
      platformBreakdown,
      recentUsage: usage.slice(-10)
    };
  }

  // Track brand kit usage
  async trackUsage(brandKitId: string, templateId: string, templateName: string, platform: string): Promise<void> {
    const usage = this.usage.get(brandKitId) || [];
    
    // Check if usage already exists for this template
    const existingUsage = usage.find(u => u.templateId === templateId);
    if (existingUsage) {
      existingUsage.usageCount++;
      existingUsage.lastUsed = new Date().toISOString();
    } else {
      usage.push({
        templateId,
        templateName,
        platform,
        usageCount: 1,
        lastUsed: new Date().toISOString()
      });
    }

    this.usage.set(brandKitId, usage);
  }

  // Export brand kit
  async exportBrandKit(brandKitId: string, format: 'json' | 'pdf' | 'zip'): Promise<string> {
    const brandKit = this.brandKits.get(brandKitId);
    if (!brandKit) {
      throw new Error('Brand kit not found');
    }

    // Mock export - in production, this would generate actual files
    const exportId = `export_${Date.now()}`;
    return `/exports/${exportId}.${format}`;
  }

  // Import brand kit
  async importBrandKit(file: File): Promise<BrandKit> {
    // Mock import - in production, this would parse the uploaded file
    const brandKit: BrandKit = {
      id: `brand_${Date.now()}`,
      name: 'Imported Brand Kit',
      description: 'Imported from file',
      colors: [],
      fonts: [],
      logos: [],
      patterns: [],
      icons: [],
      guidelines: {
        logo: { minSize: 24, clearSpace: 8, do: [], dont: [] },
        colors: { primaryUsage: [], secondaryUsage: [], accentUsage: [], do: [], dont: [] },
        typography: { headingHierarchy: [], bodyText: [], spacing: '', do: [], dont: [] },
        spacing: { grid: 8, margins: '', padding: '', gutters: '' },
        imagery: { style: '', filters: [], composition: [], do: [], dont: [] },
        voice: { tone: '', personality: [], examples: [] }
      },
      isActive: false,
      isPublic: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.brandKits.set(brandKit.id, brandKit);
    return brandKit;
  }

  // Delete brand kit
  async deleteBrandKit(id: string): Promise<boolean> {
    const brandKit = this.brandKits.get(id);
    if (!brandKit) {
      return false;
    }

    this.brandKits.delete(id);
    this.usage.delete(id);
    
    return true;
  }
}
