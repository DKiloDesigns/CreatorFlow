/**
 * Advanced Content Library
 * Organize and search content assets with advanced filtering
 */

export interface ContentAsset {
  id: string;
  type: 'image' | 'video' | 'text' | 'template' | 'audio' | 'document';
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  platform: string;
  category: string;
  tags: string[];
  metadata: {
    fileSize: number;
    dimensions?: {
      width: number;
      height: number;
    };
    duration?: number; // for video/audio
    format: string;
    createdAt: string;
    updatedAt: string;
    author: string;
  };
  performance: {
    views: number;
    likes: number;
    shares: number;
    comments: number;
    engagement: number;
    lastUsed: string;
  };
  status: 'draft' | 'published' | 'archived' | 'scheduled';
  isPublic: boolean;
  isPremium: boolean;
  version: number;
  parentId?: string; // for variations
  variations: string[]; // child asset IDs
}

export interface ContentCollection {
  id: string;
  name: string;
  description: string;
  type: 'campaign' | 'theme' | 'project' | 'seasonal' | 'custom';
  assets: string[]; // asset IDs
  coverImage?: string;
  color: string;
  isPublic: boolean;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
  author: string;
  tags: string[];
}

export interface SearchFilters {
  type?: string[];
  platform?: string[];
  category?: string[];
  tags?: string[];
  status?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  performance?: {
    minEngagement: number;
    minViews: number;
  };
  fileSize?: {
    min: number;
    max: number;
  };
  dimensions?: {
    minWidth: number;
    minHeight: number;
  };
  author?: string;
  isPublic?: boolean;
  isPremium?: boolean;
}

export interface SearchResult {
  assets: ContentAsset[];
  collections: ContentCollection[];
  total: number;
  facets: {
    types: Array<{ value: string; count: number }>;
    platforms: Array<{ value: string; count: number }>;
    categories: Array<{ value: string; count: number }>;
    tags: Array<{ value: string; count: number }>;
  };
  suggestions: string[];
}

export interface ContentAnalytics {
  totalAssets: number;
  totalCollections: number;
  storageUsed: number; // bytes
  mostUsedAssets: ContentAsset[];
  topPerformingAssets: ContentAsset[];
  platformBreakdown: Array<{
    platform: string;
    count: number;
    engagement: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    count: number;
    performance: number;
  }>;
  recentActivity: Array<{
    action: string;
    asset: ContentAsset;
    timestamp: string;
  }>;
}

export interface ContentRecommendation {
  asset: ContentAsset;
  reason: string;
  confidence: number;
  basedOn: 'similar_content' | 'trending' | 'performance' | 'user_behavior';
}

export class ContentLibrary {
  private assets: Map<string, ContentAsset> = new Map();
  private collections: Map<string, ContentCollection> = new Map();
  private searchIndex: Map<string, Set<string>> = new Map();

  // Add content asset
  async addAsset(asset: Omit<ContentAsset, 'id' | 'metadata' | 'performance' | 'version' | 'variations'>): Promise<ContentAsset> {
    const newAsset: ContentAsset = {
      ...asset,
      id: `asset_${Date.now()}`,
      metadata: {
        fileSize: 0,
        format: 'unknown',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: 'current_user'
      },
      performance: {
        views: 0,
        likes: 0,
        shares: 0,
        comments: 0,
        engagement: 0,
        lastUsed: new Date().toISOString()
      },
      version: 1,
      variations: []
    };

    this.assets.set(newAsset.id, newAsset);
    this.updateSearchIndex(newAsset);
    
    return newAsset;
  }

  // Get asset by ID
  async getAsset(assetId: string): Promise<ContentAsset | null> {
    return this.assets.get(assetId) || null;
  }

  // Update asset
  async updateAsset(assetId: string, updates: Partial<ContentAsset>): Promise<ContentAsset> {
    const asset = this.assets.get(assetId);
    if (!asset) {
      throw new Error('Asset not found');
    }

    const updatedAsset = {
      ...asset,
      ...updates,
      metadata: {
        ...asset.metadata,
        updatedAt: new Date().toISOString()
      },
      version: asset.version + 1
    };

    this.assets.set(assetId, updatedAsset);
    this.updateSearchIndex(updatedAsset);
    
    return updatedAsset;
  }

  // Delete asset
  async deleteAsset(assetId: string): Promise<boolean> {
    const asset = this.assets.get(assetId);
    if (!asset) {
      return false;
    }

    // Remove from collections
    for (const collection of this.collections.values()) {
      const index = collection.assets.indexOf(assetId);
      if (index !== -1) {
        collection.assets.splice(index, 1);
      }
    }

    this.assets.delete(assetId);
    this.removeFromSearchIndex(assetId);
    
    return true;
  }

  // Search assets
  async searchAssets(query: string, filters?: SearchFilters): Promise<SearchResult> {
    let results = Array.from(this.assets.values());

    // Apply text search
    if (query) {
      const searchTerms = query.toLowerCase().split(/\s+/);
      results = results.filter(asset => {
        const searchText = `${asset.title} ${asset.description} ${asset.tags.join(' ')}`.toLowerCase();
        return searchTerms.every(term => searchText.includes(term));
      });
    }

    // Apply filters
    if (filters) {
      if (filters.type && filters.type.length > 0) {
        results = results.filter(asset => filters.type!.includes(asset.type));
      }
      if (filters.platform && filters.platform.length > 0) {
        results = results.filter(asset => filters.platform!.includes(asset.platform));
      }
      if (filters.category && filters.category.length > 0) {
        results = results.filter(asset => filters.category!.includes(asset.category));
      }
      if (filters.tags && filters.tags.length > 0) {
        results = results.filter(asset => 
          filters.tags!.some(tag => asset.tags.includes(tag))
        );
      }
      if (filters.status && filters.status.length > 0) {
        results = results.filter(asset => filters.status!.includes(asset.status));
      }
      if (filters.dateRange) {
        results = results.filter(asset => {
          const assetDate = new Date(asset.metadata.createdAt);
          const startDate = new Date(filters.dateRange!.start);
          const endDate = new Date(filters.dateRange!.end);
          return assetDate >= startDate && assetDate <= endDate;
        });
      }
      if (filters.performance) {
        results = results.filter(asset => 
          asset.performance.engagement >= filters.performance!.minEngagement &&
          asset.performance.views >= filters.performance!.minViews
        );
      }
      if (filters.fileSize) {
        results = results.filter(asset => 
          asset.metadata.fileSize >= filters.fileSize!.min &&
          asset.metadata.fileSize <= filters.fileSize!.max
        );
      }
      if (filters.dimensions) {
        results = results.filter(asset => 
          asset.metadata.dimensions &&
          asset.metadata.dimensions.width >= filters.dimensions!.minWidth &&
          asset.metadata.dimensions.height >= filters.dimensions!.minHeight
        );
      }
      if (filters.author) {
        results = results.filter(asset => asset.metadata.author === filters.author);
      }
      if (filters.isPublic !== undefined) {
        results = results.filter(asset => asset.isPublic === filters.isPublic);
      }
      if (filters.isPremium !== undefined) {
        results = results.filter(asset => asset.isPremium === filters.isPremium);
      }
    }

    // Calculate facets
    const facets = this.calculateFacets(results);

    // Generate suggestions
    const suggestions = this.generateSuggestions(query, results);

    return {
      assets: results,
      collections: [], // TODO: Implement collection search
      total: results.length,
      facets,
      suggestions
    };
  }

  // Create collection
  async createCollection(collection: Omit<ContentCollection, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContentCollection> {
    const newCollection: ContentCollection = {
      ...collection,
      id: `collection_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.collections.set(newCollection.id, newCollection);
    
    return newCollection;
  }

  // Add asset to collection
  async addAssetToCollection(collectionId: string, assetId: string): Promise<boolean> {
    const collection = this.collections.get(collectionId);
    const asset = this.assets.get(assetId);
    
    if (!collection || !asset) {
      return false;
    }

    if (!collection.assets.includes(assetId)) {
      collection.assets.push(assetId);
      collection.updatedAt = new Date().toISOString();
      this.collections.set(collectionId, collection);
    }

    return true;
  }

  // Remove asset from collection
  async removeAssetFromCollection(collectionId: string, assetId: string): Promise<boolean> {
    const collection = this.collections.get(collectionId);
    
    if (!collection) {
      return false;
    }

    const index = collection.assets.indexOf(assetId);
    if (index !== -1) {
      collection.assets.splice(index, 1);
      collection.updatedAt = new Date().toISOString();
      this.collections.set(collectionId, collection);
    }

    return true;
  }

  // Get collection
  async getCollection(collectionId: string): Promise<ContentCollection | null> {
    return this.collections.get(collectionId) || null;
  }

  // Get collections
  async getCollections(): Promise<ContentCollection[]> {
    return Array.from(this.collections.values())
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  // Get analytics
  async getAnalytics(): Promise<ContentAnalytics> {
    const assets = Array.from(this.assets.values());
    const collections = Array.from(this.collections.values());

    const totalAssets = assets.length;
    const totalCollections = collections.length;
    const storageUsed = assets.reduce((sum, asset) => sum + asset.metadata.fileSize, 0);

    const mostUsedAssets = assets
      .sort((a, b) => b.performance.views - a.performance.views)
      .slice(0, 10);

    const topPerformingAssets = assets
      .sort((a, b) => b.performance.engagement - a.performance.engagement)
      .slice(0, 10);

    const platformBreakdown = this.calculatePlatformBreakdown(assets);
    const categoryBreakdown = this.calculateCategoryBreakdown(assets);

    const recentActivity = assets
      .map(asset => ({
        action: 'created',
        asset,
        timestamp: asset.metadata.createdAt
      }))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20);

    return {
      totalAssets,
      totalCollections,
      storageUsed,
      mostUsedAssets,
      topPerformingAssets,
      platformBreakdown,
      categoryBreakdown,
      recentActivity
    };
  }

  // Get recommendations
  async getRecommendations(assetId: string, limit: number = 5): Promise<ContentRecommendation[]> {
    const asset = this.assets.get(assetId);
    if (!asset) {
      return [];
    }

    const recommendations: ContentRecommendation[] = [];
    
    // Find similar content based on tags and category
    const similarAssets = Array.from(this.assets.values())
      .filter(a => a.id !== assetId)
      .filter(a => a.category === asset.category || 
        a.tags.some(tag => asset.tags.includes(tag)))
      .sort((a, b) => {
        const aSimilarity = this.calculateSimilarity(asset, a);
        const bSimilarity = this.calculateSimilarity(asset, b);
        return bSimilarity - aSimilarity;
      })
      .slice(0, limit);

    similarAssets.forEach(similarAsset => {
      recommendations.push({
        asset: similarAsset,
        reason: `Similar to ${asset.title}`,
        confidence: this.calculateSimilarity(asset, similarAsset),
        basedOn: 'similar_content'
      });
    });

    return recommendations;
  }

  // Track asset usage
  async trackUsage(assetId: string, action: 'view' | 'like' | 'share' | 'comment'): Promise<void> {
    const asset = this.assets.get(assetId);
    if (!asset) {
      return;
    }

    switch (action) {
      case 'view':
        asset.performance.views++;
        break;
      case 'like':
        asset.performance.likes++;
        break;
      case 'share':
        asset.performance.shares++;
        break;
      case 'comment':
        asset.performance.comments++;
        break;
    }

    // Recalculate engagement
    asset.performance.engagement = this.calculateEngagement(asset.performance);
    asset.performance.lastUsed = new Date().toISOString();

    this.assets.set(assetId, asset);
  }

  // Private helper methods
  private updateSearchIndex(asset: ContentAsset): void {
    const terms = [
      asset.title,
      asset.description,
      ...asset.tags,
      asset.type,
      asset.platform,
      asset.category
    ].join(' ').toLowerCase().split(/\s+/);

    terms.forEach(term => {
      if (!this.searchIndex.has(term)) {
        this.searchIndex.set(term, new Set());
      }
      this.searchIndex.get(term)!.add(asset.id);
    });
  }

  private removeFromSearchIndex(assetId: string): void {
    for (const [term, assetIds] of this.searchIndex) {
      assetIds.delete(assetId);
      if (assetIds.size === 0) {
        this.searchIndex.delete(term);
      }
    }
  }

  private calculateFacets(assets: ContentAsset[]): SearchResult['facets'] {
    const types = new Map<string, number>();
    const platforms = new Map<string, number>();
    const categories = new Map<string, number>();
    const tags = new Map<string, number>();

    assets.forEach(asset => {
      types.set(asset.type, (types.get(asset.type) || 0) + 1);
      platforms.set(asset.platform, (platforms.get(asset.platform) || 0) + 1);
      categories.set(asset.category, (categories.get(asset.category) || 0) + 1);
      asset.tags.forEach(tag => {
        tags.set(tag, (tags.get(tag) || 0) + 1);
      });
    });

    return {
      types: Array.from(types.entries()).map(([value, count]) => ({ value, count })),
      platforms: Array.from(platforms.entries()).map(([value, count]) => ({ value, count })),
      categories: Array.from(categories.entries()).map(([value, count]) => ({ value, count })),
      tags: Array.from(tags.entries()).map(([value, count]) => ({ value, count }))
    };
  }

  private generateSuggestions(query: string, results: ContentAsset[]): string[] {
    const suggestions: string[] = [];
    
    if (query.length < 3) {
      return suggestions;
    }

    // Generate suggestions based on common tags and categories
    const allTags = new Set<string>();
    const allCategories = new Set<string>();
    
    results.forEach(asset => {
      asset.tags.forEach(tag => allTags.add(tag));
      allCategories.add(asset.category);
    });

    // Add tag suggestions
    Array.from(allTags).slice(0, 5).forEach(tag => {
      if (tag.toLowerCase().includes(query.toLowerCase())) {
        suggestions.push(tag);
      }
    });

    // Add category suggestions
    Array.from(allCategories).slice(0, 3).forEach(category => {
      if (category.toLowerCase().includes(query.toLowerCase())) {
        suggestions.push(category);
      }
    });

    return suggestions.slice(0, 8);
  }

  private calculatePlatformBreakdown(assets: ContentAsset[]): Array<{ platform: string; count: number; engagement: number }> {
    const breakdown = new Map<string, { count: number; totalEngagement: number }>();

    assets.forEach(asset => {
      const current = breakdown.get(asset.platform) || { count: 0, totalEngagement: 0 };
      breakdown.set(asset.platform, {
        count: current.count + 1,
        totalEngagement: current.totalEngagement + asset.performance.engagement
      });
    });

    return Array.from(breakdown.entries()).map(([platform, data]) => ({
      platform,
      count: data.count,
      engagement: data.totalEngagement / data.count
    }));
  }

  private calculateCategoryBreakdown(assets: ContentAsset[]): Array<{ category: string; count: number; performance: number }> {
    const breakdown = new Map<string, { count: number; totalPerformance: number }>();

    assets.forEach(asset => {
      const current = breakdown.get(asset.category) || { count: 0, totalPerformance: 0 };
      breakdown.set(asset.category, {
        count: current.count + 1,
        totalPerformance: current.totalPerformance + asset.performance.engagement
      });
    });

    return Array.from(breakdown.entries()).map(([category, data]) => ({
      category,
      count: data.count,
      performance: data.totalPerformance / data.count
    }));
  }

  private calculateSimilarity(asset1: ContentAsset, asset2: ContentAsset): number {
    let similarity = 0;

    // Category similarity
    if (asset1.category === asset2.category) {
      similarity += 0.3;
    }

    // Tag similarity
    const commonTags = asset1.tags.filter(tag => asset2.tags.includes(tag));
    const tagSimilarity = commonTags.length / Math.max(asset1.tags.length, asset2.tags.length);
    similarity += tagSimilarity * 0.4;

    // Type similarity
    if (asset1.type === asset2.type) {
      similarity += 0.2;
    }

    // Platform similarity
    if (asset1.platform === asset2.platform) {
      similarity += 0.1;
    }

    return Math.min(similarity, 1);
  }

  private calculateEngagement(performance: ContentAsset['performance']): number {
    const { views, likes, shares, comments } = performance;
    
    if (views === 0) return 0;
    
    const engagement = (likes + shares * 2 + comments * 3) / views;
    return Math.round(engagement * 100) / 100;
  }
}
