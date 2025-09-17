/**
 * Content Variations Generator
 * Generate multiple versions of the same content
 */

export interface ContentVariation {
  id: string;
  originalContentId: string;
  name: string;
  description: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'carousel' | 'story';
  platform: string;
  variations: {
    text?: TextVariation;
    image?: ImageVariation;
    video?: VideoVariation;
    hashtags?: HashtagVariation;
    postingTime?: PostingTimeVariation;
  };
  metadata: {
    author: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    isActive: boolean;
  };
  performance?: {
    views: number;
    engagement: number;
    clicks: number;
    conversions: number;
    lastUpdated: string;
  };
}

export interface TextVariation {
  tone: 'professional' | 'casual' | 'friendly' | 'authoritative' | 'playful' | 'inspirational';
  length: 'short' | 'medium' | 'long';
  style: 'formal' | 'informal' | 'conversational' | 'technical';
  language: string;
  keywords: string[];
  callToAction?: string;
  emojis: boolean;
  formatting: {
    bold: string[];
    italic: string[];
    underline: string[];
  };
}

export interface ImageVariation {
  style: 'realistic' | 'illustration' | 'minimalist' | 'vintage' | 'modern' | 'artistic';
  colors: string[];
  composition: 'centered' | 'rule_of_thirds' | 'diagonal' | 'symmetrical';
  filters: string[];
  textOverlay?: {
    text: string;
    position: 'top' | 'center' | 'bottom';
    font: string;
    color: string;
    size: number;
  };
  dimensions: {
    width: number;
    height: number;
    aspectRatio: string;
  };
}

export interface VideoVariation {
  duration: number; // seconds
  style: 'cinematic' | 'documentary' | 'tutorial' | 'promotional' | 'behind_scenes';
  pacing: 'slow' | 'medium' | 'fast';
  music: {
    genre: string;
    mood: string;
    volume: number;
  };
  transitions: string[];
  effects: string[];
  captions: boolean;
  thumbnail: {
    style: string;
    text: string;
    position: string;
  };
}

export interface HashtagVariation {
  strategy: 'trending' | 'niche' | 'branded' | 'mixed' | 'minimal';
  count: number;
  hashtags: string[];
  categories: string[];
  languages: string[];
  mix: {
    trending: number;
    niche: number;
    branded: number;
    local: number;
  };
}

export interface PostingTimeVariation {
  timezone: string;
  times: string[];
  days: string[];
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  optimal: {
    day: string;
    time: string;
    reason: string;
  };
}

export interface VariationTemplate {
  id: string;
  name: string;
  description: string;
  platform: string;
  category: string;
  variations: {
    text: Partial<TextVariation>;
    image: Partial<ImageVariation>;
    video: Partial<VideoVariation>;
    hashtags: Partial<HashtagVariation>;
    postingTime: Partial<PostingTimeVariation>;
  };
  isPublic: boolean;
  usage: number;
  rating: number;
  createdAt: string;
}

export interface VariationRequest {
  originalContent: string;
  platform: string;
  type: string;
  count: number;
  variations: {
    text?: Partial<TextVariation>;
    image?: Partial<ImageVariation>;
    video?: Partial<VideoVariation>;
    hashtags?: Partial<HashtagVariation>;
    postingTime?: Partial<PostingTimeVariation>;
  };
  preserveOriginal?: boolean;
  targetAudience?: string;
  brandVoice?: string;
}

export interface VariationAnalytics {
  totalVariations: number;
  activeVariations: number;
  topPerformingVariation: ContentVariation | null;
  averagePerformance: {
    views: number;
    engagement: number;
    clicks: number;
    conversions: number;
  };
  platformBreakdown: Array<{
    platform: string;
    count: number;
    averagePerformance: number;
  }>;
  typeBreakdown: Array<{
    type: string;
    count: number;
    averagePerformance: number;
  }>;
  insights: string[];
  recommendations: string[];
}

export class ContentVariationsGenerator {
  private variations: Map<string, ContentVariation> = new Map();
  private templates: Map<string, VariationTemplate> = new Map();
  private analytics: Map<string, VariationAnalytics> = new Map();

  constructor() {
    this.initializeTemplates();
  }

  // Generate content variations
  async generateVariations(request: VariationRequest): Promise<ContentVariation[]> {
    const variations: ContentVariation[] = [];
    const originalContentId = `content_${Date.now()}`;

    for (let i = 0; i < request.count; i++) {
      const variation = await this.createVariation(
        originalContentId,
        request,
        i + 1
      );
      variations.push(variation);
      this.variations.set(variation.id, variation);
    }

    return variations;
  }

  // Create single variation
  async createVariation(
    originalContentId: string,
    request: VariationRequest,
    index: number
  ): Promise<ContentVariation> {
    const variationId = `variation_${originalContentId}_${index}`;
    
    const variation: ContentVariation = {
      id: variationId,
      originalContentId,
      name: `Variation ${index}`,
      description: `Generated variation ${index} of ${request.originalContent}`,
      content: await this.generateVariedContent(request.originalContent, request, index),
      type: request.type as any,
      platform: request.platform,
      variations: {
        text: request.variations.text ? this.generateTextVariation(request.variations.text, index) : undefined,
        image: request.variations.image ? this.generateImageVariation(request.variations.image, index) : undefined,
        video: request.variations.video ? this.generateVideoVariation(request.variations.video, index) : undefined,
        hashtags: request.variations.hashtags ? this.generateHashtagVariation(request.variations.hashtags, index) : undefined,
        postingTime: request.variations.postingTime ? this.generatePostingTimeVariation(request.variations.postingTime, index) : undefined
      },
      metadata: {
        author: 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
        isActive: true
      }
    };

    return variation;
  }

  // Get variation
  async getVariation(variationId: string): Promise<ContentVariation | null> {
    return this.variations.get(variationId) || null;
  }

  // Get variations by original content
  async getVariationsByOriginal(originalContentId: string): Promise<ContentVariation[]> {
    return Array.from(this.variations.values())
      .filter(v => v.originalContentId === originalContentId)
      .sort((a, b) => new Date(a.metadata.createdAt).getTime() - new Date(b.metadata.createdAt).getTime());
  }

  // Update variation
  async updateVariation(
    variationId: string,
    updates: Partial<ContentVariation>
  ): Promise<ContentVariation> {
    const variation = this.variations.get(variationId);
    if (!variation) {
      throw new Error('Variation not found');
    }

    const updatedVariation = {
      ...variation,
      ...updates,
      metadata: {
        ...variation.metadata,
        updatedAt: new Date().toISOString(),
        version: variation.metadata.version + 1
      }
    };

    this.variations.set(variationId, updatedVariation);
    return updatedVariation;
  }

  // Delete variation
  async deleteVariation(variationId: string): Promise<boolean> {
    return this.variations.delete(variationId);
  }

  // Get variation templates
  async getTemplates(platform?: string, category?: string): Promise<VariationTemplate[]> {
    let templates = Array.from(this.templates.values());

    if (platform) {
      templates = templates.filter(t => t.platform === platform);
    }

    if (category) {
      templates = templates.filter(t => t.category === category);
    }

    return templates.sort((a, b) => b.usage - a.usage);
  }

  // Create variation from template
  async createFromTemplate(
    templateId: string,
    originalContent: string,
    platform: string
  ): Promise<ContentVariation[]> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    const request: VariationRequest = {
      originalContent,
      platform,
      type: 'text',
      count: 3,
      variations: template.variations,
      preserveOriginal: true
    };

    return this.generateVariations(request);
  }

  // Track variation performance
  async trackPerformance(
    variationId: string,
    metrics: {
      views?: number;
      engagement?: number;
      clicks?: number;
      conversions?: number;
    }
  ): Promise<void> {
    const variation = this.variations.get(variationId);
    if (!variation) {
      return;
    }

    const currentPerformance = variation.performance || {
      views: 0,
      engagement: 0,
      clicks: 0,
      conversions: 0,
      lastUpdated: new Date().toISOString()
    };

    const updatedPerformance = {
      ...currentPerformance,
      ...metrics,
      lastUpdated: new Date().toISOString()
    };

    variation.performance = updatedPerformance;
    this.variations.set(variationId, variation);
  }

  // Get variation analytics
  async getAnalytics(originalContentId?: string): Promise<VariationAnalytics> {
    let variations = Array.from(this.variations.values());

    if (originalContentId) {
      variations = variations.filter(v => v.originalContentId === originalContentId);
    }

    const totalVariations = variations.length;
    const activeVariations = variations.filter(v => v.metadata.isActive).length;

    const topPerformingVariation = variations
      .filter(v => v.performance)
      .sort((a, b) => (b.performance?.engagement || 0) - (a.performance?.engagement || 0))[0] || null;

    const averagePerformance = this.calculateAveragePerformance(variations);
    const platformBreakdown = this.calculatePlatformBreakdown(variations);
    const typeBreakdown = this.calculateTypeBreakdown(variations);
    const insights = this.generateInsights(variations);
    const recommendations = this.generateRecommendations(variations);

    return {
      totalVariations,
      activeVariations,
      topPerformingVariation,
      averagePerformance,
      platformBreakdown,
      typeBreakdown,
      insights,
      recommendations
    };
  }

  // Private helper methods
  private async generateVariedContent(
    originalContent: string,
    request: VariationRequest,
    index: number
  ): Promise<string> {
    let variedContent = originalContent;

    // Apply text variations
    if (request.variations.text) {
      variedContent = this.applyTextVariations(variedContent, request.variations.text, index);
    }

    // Apply hashtag variations
    if (request.variations.hashtags) {
      variedContent = this.applyHashtagVariations(variedContent, request.variations.hashtags, index);
    }

    return variedContent;
  }

  private applyTextVariations(
    content: string,
    textVariation: Partial<TextVariation>,
    index: number
  ): string {
    let variedContent = content;

    // Apply tone variations
    if (textVariation.tone) {
      variedContent = this.applyToneVariation(variedContent, textVariation.tone, index);
    }

    // Apply length variations
    if (textVariation.length) {
      variedContent = this.applyLengthVariation(variedContent, textVariation.length, index);
    }

    // Apply style variations
    if (textVariation.style) {
      variedContent = this.applyStyleVariation(variedContent, textVariation.style, index);
    }

    // Add emojis if enabled
    if (textVariation.emojis) {
      variedContent = this.addEmojis(variedContent, index);
    }

    // Add call to action
    if (textVariation.callToAction) {
      variedContent += `\n\n${textVariation.callToAction}`;
    }

    return variedContent;
  }

  private applyToneVariation(content: string, tone: string, index: number): string {
    const toneModifiers: Record<string, string[]> = {
      professional: ['Furthermore', 'Additionally', 'Moreover', 'Consequently'],
      casual: ['Hey', 'So', 'Anyway', 'Cool'],
      friendly: ['Hi there', 'Great', 'Awesome', 'Wonderful'],
      authoritative: ['Important', 'Critical', 'Essential', 'Vital'],
      playful: ['Fun', 'Exciting', 'Amazing', 'Fantastic'],
      inspirational: ['Believe', 'Achieve', 'Success', 'Dream']
    };

    const modifiers = toneModifiers[tone] || [];
    if (modifiers.length > 0) {
      const modifier = modifiers[index % modifiers.length];
      return `${modifier}! ${content}`;
    }

    return content;
  }

  private applyLengthVariation(content: string, length: string, index: number): string {
    const sentences = content.split('.');
    
    switch (length) {
      case 'short':
        return sentences.slice(0, 1).join('.') + '.';
      case 'medium':
        return sentences.slice(0, 2).join('.') + '.';
      case 'long':
        return content; // Keep original length
      default:
        return content;
    }
  }

  private applyStyleVariation(content: string, style: string, index: number): string {
    switch (style) {
      case 'formal':
        return content.replace(/don't/g, 'do not').replace(/can't/g, 'cannot');
      case 'informal':
        return content.replace(/do not/g, "don't").replace(/cannot/g, "can't");
      case 'conversational':
        return content.replace(/\./g, '...');
      case 'technical':
        return content.replace(/good/g, 'optimal').replace(/bad/g, 'suboptimal');
      default:
        return content;
    }
  }

  private addEmojis(content: string, index: number): string {
    const emojis = ['😊', '🚀', '💡', '⭐', '🎯', '🔥', '✨', '💪'];
    const emoji = emojis[index % emojis.length];
    return `${content} ${emoji}`;
  }

  private applyHashtagVariations(
    content: string,
    hashtagVariation: Partial<HashtagVariation>,
    index: number
  ): string {
    const hashtags = this.generateHashtags(hashtagVariation, index);
    return `${content}\n\n${hashtags.join(' ')}`;
  }

  private generateHashtags(hashtagVariation: Partial<HashtagVariation>, index: number): string[] {
    const baseHashtags = ['#content', '#social', '#marketing', '#digital', '#growth'];
    const trendingHashtags = ['#trending', '#viral', '#fyp', '#explore', '#discover'];
    const nicheHashtags = ['#niche', '#specialized', '#expert', '#professional', '#industry'];
    const brandedHashtags = ['#brand', '#company', '#product', '#service', '#business'];

    let hashtags: string[] = [];

    switch (hashtagVariation.strategy) {
      case 'trending':
        hashtags = trendingHashtags.slice(0, hashtagVariation.count || 3);
        break;
      case 'niche':
        hashtags = nicheHashtags.slice(0, hashtagVariation.count || 3);
        break;
      case 'branded':
        hashtags = brandedHashtags.slice(0, hashtagVariation.count || 3);
        break;
      case 'mixed':
        hashtags = [
          ...trendingHashtags.slice(0, 1),
          ...nicheHashtags.slice(0, 1),
          ...brandedHashtags.slice(0, 1)
        ];
        break;
      case 'minimal':
        hashtags = baseHashtags.slice(0, 1);
        break;
      default:
        hashtags = baseHashtags.slice(0, hashtagVariation.count || 3);
    }

    return hashtags;
  }

  private generateTextVariation(
    textVariation: Partial<TextVariation>,
    index: number
  ): TextVariation {
    const tones: TextVariation['tone'][] = ['professional', 'casual', 'friendly', 'authoritative', 'playful', 'inspirational'];
    const lengths: TextVariation['length'][] = ['short', 'medium', 'long'];
    const styles: TextVariation['style'][] = ['formal', 'informal', 'conversational', 'technical'];

    return {
      tone: textVariation.tone || tones[index % tones.length],
      length: textVariation.length || lengths[index % lengths.length],
      style: textVariation.style || styles[index % styles.length],
      language: textVariation.language || 'en',
      keywords: textVariation.keywords || [],
      callToAction: textVariation.callToAction,
      emojis: textVariation.emojis ?? true,
      formatting: {
        bold: [],
        italic: [],
        underline: []
      }
    };
  }

  private generateImageVariation(
    imageVariation: Partial<ImageVariation>,
    index: number
  ): ImageVariation {
    const styles: ImageVariation['style'][] = ['realistic', 'illustration', 'minimalist', 'vintage', 'modern', 'artistic'];
    const compositions: ImageVariation['composition'][] = ['centered', 'rule_of_thirds', 'diagonal', 'symmetrical'];

    return {
      style: imageVariation.style || styles[index % styles.length],
      colors: imageVariation.colors || ['#1976d2', '#4caf50', '#ff9800'],
      composition: imageVariation.composition || compositions[index % compositions.length],
      filters: imageVariation.filters || [],
      textOverlay: imageVariation.textOverlay,
      dimensions: imageVariation.dimensions || {
        width: 1080,
        height: 1080,
        aspectRatio: '1:1'
      }
    };
  }

  private generateVideoVariation(
    videoVariation: Partial<VideoVariation>,
    index: number
  ): VideoVariation {
    const styles: VideoVariation['style'][] = ['cinematic', 'documentary', 'tutorial', 'promotional', 'behind_scenes'];
    const pacings: VideoVariation['pacing'][] = ['slow', 'medium', 'fast'];

    return {
      duration: videoVariation.duration || 30,
      style: videoVariation.style || styles[index % styles.length],
      pacing: videoVariation.pacing || pacings[index % pacings.length],
      music: videoVariation.music || {
        genre: 'upbeat',
        mood: 'energetic',
        volume: 0.7
      },
      transitions: videoVariation.transitions || ['fade', 'cut'],
      effects: videoVariation.effects || [],
      captions: videoVariation.captions ?? true,
      thumbnail: videoVariation.thumbnail || {
        style: 'bold',
        text: 'Watch Now',
        position: 'center'
      }
    };
  }

  private generateHashtagVariation(
    hashtagVariation: Partial<HashtagVariation>,
    index: number
  ): HashtagVariation {
    const strategies: HashtagVariation['strategy'][] = ['trending', 'niche', 'branded', 'mixed', 'minimal'];

    return {
      strategy: hashtagVariation.strategy || strategies[index % strategies.length],
      count: hashtagVariation.count || 5,
      hashtags: hashtagVariation.hashtags || [],
      categories: hashtagVariation.categories || ['general'],
      languages: hashtagVariation.languages || ['en'],
      mix: hashtagVariation.mix || {
        trending: 40,
        niche: 30,
        branded: 20,
        local: 10
      }
    };
  }

  private generatePostingTimeVariation(
    postingTimeVariation: Partial<PostingTimeVariation>,
    index: number
  ): PostingTimeVariation {
    const times = ['9:00 AM', '12:00 PM', '3:00 PM', '6:00 PM'];
    const days = ['Monday', 'Wednesday', 'Friday'];

    return {
      timezone: postingTimeVariation.timezone || 'UTC',
      times: postingTimeVariation.times || times,
      days: postingTimeVariation.days || days,
      frequency: postingTimeVariation.frequency || 'once',
      optimal: postingTimeVariation.optimal || {
        day: days[index % days.length],
        time: times[index % times.length],
        reason: 'Peak engagement time'
      }
    };
  }

  private calculateAveragePerformance(variations: ContentVariation[]): {
    views: number;
    engagement: number;
    clicks: number;
    conversions: number;
  } {
    const variationsWithPerformance = variations.filter(v => v.performance);
    
    if (variationsWithPerformance.length === 0) {
      return { views: 0, engagement: 0, clicks: 0, conversions: 0 };
    }

    const totals = variationsWithPerformance.reduce(
      (sum, v) => ({
        views: sum.views + (v.performance?.views || 0),
        engagement: sum.engagement + (v.performance?.engagement || 0),
        clicks: sum.clicks + (v.performance?.clicks || 0),
        conversions: sum.conversions + (v.performance?.conversions || 0)
      }),
      { views: 0, engagement: 0, clicks: 0, conversions: 0 }
    );

    const count = variationsWithPerformance.length;
    return {
      views: Math.round(totals.views / count),
      engagement: Math.round(totals.engagement / count),
      clicks: Math.round(totals.clicks / count),
      conversions: Math.round(totals.conversions / count)
    };
  }

  private calculatePlatformBreakdown(variations: ContentVariation[]): Array<{
    platform: string;
    count: number;
    averagePerformance: number;
  }> {
    const platformData = new Map<string, { count: number; totalPerformance: number }>();

    variations.forEach(v => {
      const current = platformData.get(v.platform) || { count: 0, totalPerformance: 0 };
      platformData.set(v.platform, {
        count: current.count + 1,
        totalPerformance: current.totalPerformance + (v.performance?.engagement || 0)
      });
    });

    return Array.from(platformData.entries()).map(([platform, data]) => ({
      platform,
      count: data.count,
      averagePerformance: data.count > 0 ? data.totalPerformance / data.count : 0
    }));
  }

  private calculateTypeBreakdown(variations: ContentVariation[]): Array<{
    type: string;
    count: number;
    averagePerformance: number;
  }> {
    const typeData = new Map<string, { count: number; totalPerformance: number }>();

    variations.forEach(v => {
      const current = typeData.get(v.type) || { count: 0, totalPerformance: 0 };
      typeData.set(v.type, {
        count: current.count + 1,
        totalPerformance: current.totalPerformance + (v.performance?.engagement || 0)
      });
    });

    return Array.from(typeData.entries()).map(([type, data]) => ({
      type,
      count: data.count,
      averagePerformance: data.count > 0 ? data.totalPerformance / data.count : 0
    }));
  }

  private generateInsights(variations: ContentVariation[]): string[] {
    const insights: string[] = [];
    
    const variationsWithPerformance = variations.filter(v => v.performance);
    if (variationsWithPerformance.length > 0) {
      insights.push(`${variationsWithPerformance.length} variations have performance data`);
      
      const topPerformer = variationsWithPerformance
        .sort((a, b) => (b.performance?.engagement || 0) - (a.performance?.engagement || 0))[0];
      
      if (topPerformer) {
        insights.push(`Top performing variation: ${topPerformer.name} with ${topPerformer.performance?.engagement} engagement`);
      }
    }

    return insights;
  }

  private generateRecommendations(variations: ContentVariation[]): string[] {
    const recommendations: string[] = [];
    
    if (variations.length > 0) {
      recommendations.push('Test variations with different audiences to find the best fit');
      recommendations.push('Monitor performance over time to ensure consistency');
      recommendations.push('Use successful variations as templates for future content');
    }

    return recommendations;
  }

  private initializeTemplates(): void {
    const templates: VariationTemplate[] = [
      {
        id: 'template_1',
        name: 'Social Media Post Variations',
        description: 'Generate multiple variations of social media posts',
        platform: 'instagram',
        category: 'social',
        variations: {
          text: {
            tone: 'casual',
            length: 'medium',
            emojis: true
          },
          hashtags: {
            strategy: 'mixed',
            count: 5
          }
        },
        isPublic: true,
        usage: 100,
        rating: 4.5,
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'template_2',
        name: 'Professional Content Variations',
        description: 'Generate professional variations for business content',
        platform: 'linkedin',
        category: 'business',
        variations: {
          text: {
            tone: 'professional',
            length: 'long',
            emojis: false
          },
          hashtags: {
            strategy: 'niche',
            count: 3
          }
        },
        isPublic: true,
        usage: 75,
        rating: 4.3,
        createdAt: '2024-01-01T00:00:00Z'
      }
    ];

    templates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }
}
