/**
 * CreatorFlow Template Marketplace
 * Handle template creation, sharing, and revenue distribution
 */

export interface Template {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  category: 'social_media' | 'email' | 'presentation' | 'document' | 'design' | 'content';
  subcategory: string;
  platform: string[];
  contentType: 'text' | 'image' | 'video' | 'carousel' | 'story' | 'mixed';
  tags: string[];
  price: number;
  isFree: boolean;
  isPremium: boolean;
  thumbnail: string;
  previewImages: string[];
  fileUrl: string;
  fileSize: number;
  fileType: 'json' | 'csv' | 'pdf' | 'docx' | 'pptx' | 'psd' | 'ai' | 'sketch';
  downloads: number;
  rating: number;
  reviewCount: number;
  sales: number;
  revenue: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'archived';
  createdAt: string;
  updatedAt: string;
  featured: boolean;
  trending: boolean;
}

export interface TemplateReview {
  id: string;
  templateId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number; // 1-5
  comment: string;
  helpful: number;
  createdAt: string;
}

export interface TemplateSale {
  id: string;
  templateId: string;
  buyerId: string;
  sellerId: string;
  price: number;
  platformFee: number; // 30% of price
  sellerEarnings: number; // 70% of price
  purchasedAt: string;
  downloadUrl: string;
  status: 'completed' | 'refunded';
}

export interface TemplateAnalytics {
  templateId: string;
  totalSales: number;
  totalRevenue: number;
  sellerEarnings: number;
  platformEarnings: number;
  averageRating: number;
  downloadCount: number;
  conversionRate: number;
  topCountries: Array<{
    country: string;
    sales: number;
  }>;
  topPlatforms: Array<{
    platform: string;
    sales: number;
  }>;
}

export interface CreatorProfile {
  id: string;
  userId: string;
  displayName: string;
  bio: string;
  avatar: string;
  coverImage: string;
  location: string;
  website: string;
  socialLinks: Record<string, string>;
  totalTemplates: number;
  totalSales: number;
  totalEarnings: number;
  averageRating: number;
  followerCount: number;
  followingCount: number;
  joinedAt: string;
  verified: boolean;
  featured: boolean;
}

export class TemplateMarketplace {
  private templates: Map<string, Template> = new Map();
  private reviews: Map<string, TemplateReview> = new Map();
  private sales: Map<string, TemplateSale> = new Map();
  private creators: Map<string, CreatorProfile> = new Map();

  // Create a new template
  createTemplate(templateData: Omit<Template, 'id' | 'createdAt' | 'updatedAt' | 'downloads' | 'rating' | 'reviewCount' | 'sales' | 'revenue' | 'featured' | 'trending'>): Template {
    const template: Template = {
      ...templateData,
      id: `template_${Date.now()}`,
      downloads: 0,
      rating: 0,
      reviewCount: 0,
      sales: 0,
      revenue: 0,
      featured: false,
      trending: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'pending'
    };

    this.templates.set(template.id, template);
    return template;
  }

  // Update template
  updateTemplate(templateId: string, updates: Partial<Template>): Template | null {
    const template = this.templates.get(templateId);
    if (!template) return null;

    const updatedTemplate = {
      ...template,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.templates.set(templateId, updatedTemplate);
    return updatedTemplate;
  }

  // Approve template
  approveTemplate(templateId: string): boolean {
    const template = this.templates.get(templateId);
    if (!template) return false;

    template.status = 'approved';
    template.updatedAt = new Date().toISOString();
    this.templates.set(templateId, template);
    return true;
  }

  // Reject template
  rejectTemplate(templateId: string, reason: string): boolean {
    const template = this.templates.get(templateId);
    if (!template) return false;

    template.status = 'rejected';
    template.updatedAt = new Date().toISOString();
    this.templates.set(templateId, template);
    return true;
  }

  // Get template by ID
  getTemplate(templateId: string): Template | null {
    return this.templates.get(templateId) || null;
  }

  // Get templates with filters
  getTemplates(filters?: {
    category?: string;
    subcategory?: string;
    platform?: string;
    contentType?: string;
    priceRange?: { min: number; max: number };
    isFree?: boolean;
    isPremium?: boolean;
    search?: string;
    sortBy?: 'price' | 'rating' | 'downloads' | 'sales' | 'createdAt' | 'trending';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
    featured?: boolean;
    trending?: boolean;
  }): { templates: Template[]; total: number } {
    let templates = Array.from(this.templates.values())
      .filter(t => t.status === 'approved');

    // Apply filters
    if (filters) {
      if (filters.category) {
        templates = templates.filter(t => t.category === filters.category);
      }
      if (filters.subcategory) {
        templates = templates.filter(t => t.subcategory === filters.subcategory);
      }
      if (filters.platform) {
        templates = templates.filter(t => t.platform.includes(filters.platform!));
      }
      if (filters.contentType) {
        templates = templates.filter(t => t.contentType === filters.contentType);
      }
      if (filters.priceRange) {
        templates = templates.filter(t => 
          t.price >= filters.priceRange!.min && t.price <= filters.priceRange!.max
        );
      }
      if (filters.isFree !== undefined) {
        templates = templates.filter(t => t.isFree === filters.isFree);
      }
      if (filters.isPremium !== undefined) {
        templates = templates.filter(t => t.isPremium === filters.isPremium);
      }
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        templates = templates.filter(t => 
          t.title.toLowerCase().includes(searchTerm) ||
          t.description.toLowerCase().includes(searchTerm) ||
          t.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
          t.creatorName.toLowerCase().includes(searchTerm)
        );
      }
      if (filters.featured) {
        templates = templates.filter(t => t.featured);
      }
      if (filters.trending) {
        templates = templates.filter(t => t.trending);
      }

      // Apply sorting
      if (filters.sortBy) {
        templates.sort((a, b) => {
          let aValue: any, bValue: any;
          
          switch (filters.sortBy) {
            case 'price':
              aValue = a.price;
              bValue = b.price;
              break;
            case 'rating':
              aValue = a.rating;
              bValue = b.rating;
              break;
            case 'downloads':
              aValue = a.downloads;
              bValue = b.downloads;
              break;
            case 'sales':
              aValue = a.sales;
              bValue = b.sales;
              break;
            case 'createdAt':
              aValue = new Date(a.createdAt).getTime();
              bValue = new Date(b.createdAt).getTime();
              break;
            case 'trending':
              aValue = a.trending ? 1 : 0;
              bValue = b.trending ? 1 : 0;
              break;
            default:
              return 0;
          }

          if (filters.sortOrder === 'desc') {
            return bValue - aValue;
          } else {
            return aValue - bValue;
          }
        });
      }

      // Apply pagination
      const total = templates.length;
      if (filters.offset) {
        templates = templates.slice(filters.offset);
      }
      if (filters.limit) {
        templates = templates.slice(0, filters.limit);
      }

      return { templates, total };
    }

    return { templates, total: templates.length };
  }

  // Purchase template
  purchaseTemplate(templateId: string, buyerId: string): TemplateSale | null {
    const template = this.templates.get(templateId);
    if (!template) return null;

    // Check if template is available for purchase
    if (template.status !== 'approved') return null;

    const platformFee = Math.round(template.price * 0.30 * 100) / 100; // 30% platform fee
    const sellerEarnings = Math.round(template.price * 0.70 * 100) / 100; // 70% to seller

    const sale: TemplateSale = {
      id: `sale_${Date.now()}`,
      templateId,
      buyerId,
      sellerId: template.creatorId,
      price: template.price,
      platformFee,
      sellerEarnings,
      purchasedAt: new Date().toISOString(),
      downloadUrl: template.fileUrl,
      status: 'completed'
    };

    this.sales.set(sale.id, sale);

    // Update template stats
    template.sales++;
    template.downloads++;
    template.revenue += template.price;
    template.updatedAt = new Date().toISOString();
    this.templates.set(templateId, template);

    // Update creator earnings
    this.updateCreatorEarnings(template.creatorId, sellerEarnings);

    return sale;
  }

  // Add template review
  addReview(reviewData: Omit<TemplateReview, 'id' | 'createdAt' | 'helpful'>): TemplateReview {
    const review: TemplateReview = {
      ...reviewData,
      id: `review_${Date.now()}`,
      createdAt: new Date().toISOString(),
      helpful: 0
    };

    this.reviews.set(review.id, review);

    // Update template rating
    this.updateTemplateRating(review.templateId);

    return review;
  }

  // Get template reviews
  getTemplateReviews(templateId: string, limit: number = 10, offset: number = 0): TemplateReview[] {
    return Array.from(this.reviews.values())
      .filter(r => r.templateId === templateId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(offset, offset + limit);
  }

  // Get creator profile
  getCreatorProfile(creatorId: string): CreatorProfile | null {
    return this.creators.get(creatorId) || null;
  }

  // Update creator profile
  updateCreatorProfile(creatorId: string, updates: Partial<CreatorProfile>): CreatorProfile | null {
    const profile = this.creators.get(creatorId);
    if (!profile) return null;

    const updatedProfile = { ...profile, ...updates };
    this.creators.set(creatorId, updatedProfile);
    return updatedProfile;
  }

  // Get creator's templates
  getCreatorTemplates(creatorId: string, limit: number = 20, offset: number = 0): Template[] {
    return Array.from(this.templates.values())
      .filter(t => t.creatorId === creatorId && t.status === 'approved')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(offset, offset + limit);
  }

  // Get template analytics
  getTemplateAnalytics(templateId: string): TemplateAnalytics | null {
    const template = this.templates.get(templateId);
    if (!template) return null;

    const templateSales = Array.from(this.sales.values())
      .filter(s => s.templateId === templateId);

    const templateReviews = Array.from(this.reviews.values())
      .filter(r => r.templateId === templateId);

    const totalRevenue = templateSales.reduce((sum, s) => sum + s.price, 0);
    const sellerEarnings = templateSales.reduce((sum, s) => sum + s.sellerEarnings, 0);
    const platformEarnings = templateSales.reduce((sum, s) => sum + s.platformFee, 0);

    const averageRating = templateReviews.length > 0
      ? templateReviews.reduce((sum, r) => sum + r.rating, 0) / templateReviews.length
      : 0;

    return {
      templateId,
      totalSales: templateSales.length,
      totalRevenue,
      sellerEarnings,
      platformEarnings,
      averageRating,
      downloadCount: template.downloads,
      conversionRate: 0, // Would need to calculate from views vs purchases
      topCountries: [],
      topPlatforms: []
    };
  }

  // Get marketplace analytics
  getMarketplaceAnalytics(): {
    totalTemplates: number;
    totalSales: number;
    totalRevenue: number;
    platformEarnings: number;
    topCategories: Array<{ category: string; count: number; revenue: number }>;
    topCreators: Array<{ creatorId: string; name: string; earnings: number }>;
    trendingTemplates: Template[];
  } {
    const allTemplates = Array.from(this.templates.values());
    const allSales = Array.from(this.sales.values());

    const totalRevenue = allSales.reduce((sum, s) => sum + s.price, 0);
    const platformEarnings = allSales.reduce((sum, s) => sum + s.platformFee, 0);

    // Top categories
    const categoryStats = new Map<string, { count: number; revenue: number }>();
    allTemplates.forEach(template => {
      const existing = categoryStats.get(template.category) || { count: 0, revenue: 0 };
      existing.count++;
      existing.revenue += template.revenue;
      categoryStats.set(template.category, existing);
    });

    const topCategories = Array.from(categoryStats.entries())
      .map(([category, stats]) => ({ category, ...stats }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Top creators
    const creatorStats = new Map<string, { name: string; earnings: number }>();
    allSales.forEach(sale => {
      const existing = creatorStats.get(sale.sellerId) || { name: '', earnings: 0 };
      existing.earnings += sale.sellerEarnings;
      creatorStats.set(sale.sellerId, existing);
    });

    const topCreators = Array.from(creatorStats.entries())
      .map(([creatorId, stats]) => ({ creatorId, ...stats }))
      .sort((a, b) => b.earnings - a.earnings)
      .slice(0, 10);

    // Trending templates (based on recent sales)
    const trendingTemplates = allTemplates
      .filter(t => t.trending)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 10);

    return {
      totalTemplates: allTemplates.length,
      totalSales: allSales.length,
      totalRevenue,
      platformEarnings,
      topCategories,
      topCreators,
      trendingTemplates
    };
  }

  // Private helper methods
  private updateTemplateRating(templateId: string): void {
    const template = this.templates.get(templateId);
    if (!template) return;

    const reviews = Array.from(this.reviews.values())
      .filter(r => r.templateId === templateId);

    if (reviews.length > 0) {
      template.rating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      template.reviewCount = reviews.length;
      template.updatedAt = new Date().toISOString();
      this.templates.set(templateId, template);
    }
  }

  private updateCreatorEarnings(creatorId: string, earnings: number): void {
    const profile = this.creators.get(creatorId);
    if (profile) {
      profile.totalEarnings += earnings;
      this.creators.set(creatorId, profile);
    }
  }
}
