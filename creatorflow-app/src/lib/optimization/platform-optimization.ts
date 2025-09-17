/**
 * Platform Optimization Engine
 * Auto-optimize content for each platform
 */

export interface PlatformOptimization {
  platform: string;
  contentId: string;
  originalContent: string;
  optimizedContent: string;
  optimizations: OptimizationRule[];
  metrics: {
    characterCount: number;
    hashtagCount: number;
    emojiCount: number;
    linkCount: number;
    imageCount: number;
    videoCount: number;
  };
  compliance: {
    isCompliant: boolean;
    violations: string[];
    warnings: string[];
    suggestions: string[];
  };
  performance: {
    predictedEngagement: number;
    predictedReach: number;
    confidence: number;
    factors: string[];
  };
  createdAt: string;
}

export interface OptimizationRule {
  id: string;
  name: string;
  description: string;
  platform: string;
  type: 'character_limit' | 'hashtag_limit' | 'image_ratio' | 'video_duration' | 'link_placement' | 'emoji_usage' | 'text_formatting';
  priority: 'high' | 'medium' | 'low';
  enabled: boolean;
  conditions: OptimizationCondition[];
  actions: OptimizationAction[];
  impact: 'positive' | 'negative' | 'neutral';
  confidence: number;
}

export interface OptimizationCondition {
  field: 'content' | 'hashtags' | 'images' | 'videos' | 'links' | 'length' | 'format';
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'between' | 'regex';
  value: any;
  description: string;
}

export interface OptimizationAction {
  type: 'truncate' | 'expand' | 'add_hashtags' | 'remove_hashtags' | 'resize_image' | 'crop_image' | 'add_emoji' | 'format_text' | 'add_link' | 'remove_link';
  parameters: Record<string, any>;
  description: string;
}

export interface PlatformSpecs {
  platform: string;
  limits: {
    maxCharacters: number;
    maxHashtags: number;
    maxImages: number;
    maxVideos: number;
    maxLinks: number;
  };
  dimensions: {
    image: {
      width: number;
      height: number;
      aspectRatio: string;
    };
    video: {
      maxDuration: number; // seconds
      minDuration: number; // seconds
      aspectRatio: string;
    };
  };
  features: {
    supportsHashtags: boolean;
    supportsMentions: boolean;
    supportsLinks: boolean;
    supportsEmojis: boolean;
    supportsImages: boolean;
    supportsVideos: boolean;
    supportsCarousel: boolean;
    supportsStories: boolean;
  };
  bestPractices: {
    optimalLength: number;
    optimalHashtags: number;
    optimalPostingTimes: string[];
    recommendedFormats: string[];
    engagementTips: string[];
  };
}

export interface OptimizationResult {
  platform: string;
  originalContent: string;
  optimizedContent: string;
  changes: Array<{
    type: string;
    description: string;
    before: string;
    after: string;
    impact: 'positive' | 'negative' | 'neutral';
  }>;
  metrics: {
    characterReduction: number;
    hashtagOptimization: number;
    engagementImprovement: number;
    complianceScore: number;
  };
  recommendations: string[];
  warnings: string[];
  errors: string[];
}

export class PlatformOptimizer {
  private platformSpecs: Map<string, PlatformSpecs> = new Map();
  private optimizationRules: Map<string, OptimizationRule[]> = new Map();

  constructor() {
    this.initializePlatformSpecs();
    this.initializeOptimizationRules();
  }

  // Optimize content for platform
  async optimizeContent(
    content: string,
    platform: string,
    options?: {
      preserveOriginal?: boolean;
      applyAllRules?: boolean;
      customRules?: OptimizationRule[];
    }
  ): Promise<OptimizationResult> {
    const specs = this.platformSpecs.get(platform);
    if (!specs) {
      throw new Error(`Platform ${platform} not supported`);
    }

    const rules = this.optimizationRules.get(platform) || [];
    const customRules = options?.customRules || [];
    const allRules = [...rules, ...customRules].filter(rule => rule.enabled);

    let optimizedContent = content;
    const changes: OptimizationResult['changes'] = [];
    const recommendations: string[] = [];
    const warnings: string[] = [];
    const errors: string[] = [];

    // Apply optimization rules
    for (const rule of allRules) {
      if (this.evaluateConditions(optimizedContent, rule.conditions)) {
        const result = await this.applyRule(optimizedContent, rule, specs);
        if (result.success) {
          optimizedContent = result.content;
          changes.push(...result.changes);
        } else {
          errors.push(result.error || 'Unknown error');
        }
      }
    }

    // Calculate metrics
    const metrics = this.calculateMetrics(content, optimizedContent, specs);
    
    // Generate recommendations
    recommendations.push(...this.generateRecommendations(optimizedContent, specs));
    
    // Check compliance
    const compliance = this.checkCompliance(optimizedContent, specs);
    if (!compliance.isCompliant) {
      warnings.push(...compliance.violations);
    }

    return {
      platform,
      originalContent: content,
      optimizedContent,
      changes,
      metrics,
      recommendations,
      warnings,
      errors
    };
  }

  // Get platform specifications
  getPlatformSpecs(platform: string): PlatformSpecs | null {
    return this.platformSpecs.get(platform) || null;
  }

  // Get all platform specifications
  getAllPlatformSpecs(): PlatformSpecs[] {
    return Array.from(this.platformSpecs.values());
  }

  // Add custom optimization rule
  addOptimizationRule(rule: OptimizationRule): void {
    const platformRules = this.optimizationRules.get(rule.platform) || [];
    platformRules.push(rule);
    this.optimizationRules.set(rule.platform, platformRules);
  }

  // Update optimization rule
  updateOptimizationRule(ruleId: string, updates: Partial<OptimizationRule>): boolean {
    for (const [platform, rules] of this.optimizationRules) {
      const ruleIndex = rules.findIndex(r => r.id === ruleId);
      if (ruleIndex !== -1) {
        rules[ruleIndex] = { ...rules[ruleIndex], ...updates };
        this.optimizationRules.set(platform, rules);
        return true;
      }
    }
    return false;
  }

  // Remove optimization rule
  removeOptimizationRule(ruleId: string): boolean {
    for (const [platform, rules] of this.optimizationRules) {
      const ruleIndex = rules.findIndex(r => r.id === ruleId);
      if (ruleIndex !== -1) {
        rules.splice(ruleIndex, 1);
        this.optimizationRules.set(platform, rules);
        return true;
      }
    }
    return false;
  }

  // Get optimization rules for platform
  getOptimizationRules(platform: string): OptimizationRule[] {
    return this.optimizationRules.get(platform) || [];
  }

  // Batch optimize content for multiple platforms
  async batchOptimize(
    content: string,
    platforms: string[],
    options?: {
      preserveOriginal?: boolean;
      applyAllRules?: boolean;
    }
  ): Promise<Map<string, OptimizationResult>> {
    const results = new Map<string, OptimizationResult>();

    for (const platform of platforms) {
      try {
        const result = await this.optimizeContent(content, platform, options);
        results.set(platform, result);
      } catch (error) {
        console.error(`Failed to optimize for ${platform}:`, error);
      }
    }

    return results;
  }

  // Private helper methods
  private initializePlatformSpecs(): void {
    const specs: PlatformSpecs[] = [
      {
        platform: 'instagram',
        limits: {
          maxCharacters: 2200,
          maxHashtags: 30,
          maxImages: 10,
          maxVideos: 1,
          maxLinks: 0
        },
        dimensions: {
          image: { width: 1080, height: 1080, aspectRatio: '1:1' },
          video: { maxDuration: 60, minDuration: 3, aspectRatio: '9:16' }
        },
        features: {
          supportsHashtags: true,
          supportsMentions: true,
          supportsLinks: false,
          supportsEmojis: true,
          supportsImages: true,
          supportsVideos: true,
          supportsCarousel: true,
          supportsStories: true
        },
        bestPractices: {
          optimalLength: 150,
          optimalHashtags: 5,
          optimalPostingTimes: ['11:00 AM', '2:00 PM', '5:00 PM'],
          recommendedFormats: ['Square', 'Portrait', 'Landscape'],
          engagementTips: ['Use relevant hashtags', 'Post at peak times', 'Engage with comments']
        }
      },
      {
        platform: 'twitter',
        limits: {
          maxCharacters: 280,
          maxHashtags: 10,
          maxImages: 4,
          maxVideos: 1,
          maxLinks: 1
        },
        dimensions: {
          image: { width: 1200, height: 675, aspectRatio: '16:9' },
          video: { maxDuration: 140, minDuration: 2, aspectRatio: '16:9' }
        },
        features: {
          supportsHashtags: true,
          supportsMentions: true,
          supportsLinks: true,
          supportsEmojis: true,
          supportsImages: true,
          supportsVideos: true,
          supportsCarousel: false,
          supportsStories: false
        },
        bestPractices: {
          optimalLength: 200,
          optimalHashtags: 2,
          optimalPostingTimes: ['9:00 AM', '12:00 PM', '3:00 PM'],
          recommendedFormats: ['Text', 'Image', 'Video'],
          engagementTips: ['Keep it concise', 'Use trending hashtags', 'Engage with replies']
        }
      },
      {
        platform: 'facebook',
        limits: {
          maxCharacters: 63206,
          maxHashtags: 30,
          maxImages: 10,
          maxVideos: 1,
          maxLinks: 1
        },
        dimensions: {
          image: { width: 1200, height: 630, aspectRatio: '1.91:1' },
          video: { maxDuration: 240, minDuration: 1, aspectRatio: '16:9' }
        },
        features: {
          supportsHashtags: true,
          supportsMentions: true,
          supportsLinks: true,
          supportsEmojis: true,
          supportsImages: true,
          supportsVideos: true,
          supportsCarousel: true,
          supportsStories: true
        },
        bestPractices: {
          optimalLength: 40,
          optimalHashtags: 3,
          optimalPostingTimes: ['9:00 AM', '1:00 PM', '3:00 PM'],
          recommendedFormats: ['Text', 'Image', 'Video', 'Link'],
          engagementTips: ['Ask questions', 'Use engaging visuals', 'Post consistently']
        }
      },
      {
        platform: 'linkedin',
        limits: {
          maxCharacters: 3000,
          maxHashtags: 5,
          maxImages: 9,
          maxVideos: 1,
          maxLinks: 1
        },
        dimensions: {
          image: { width: 1200, height: 627, aspectRatio: '1.91:1' },
          video: { maxDuration: 600, minDuration: 3, aspectRatio: '16:9' }
        },
        features: {
          supportsHashtags: true,
          supportsMentions: true,
          supportsLinks: true,
          supportsEmojis: true,
          supportsImages: true,
          supportsVideos: true,
          supportsCarousel: false,
          supportsStories: false
        },
        bestPractices: {
          optimalLength: 150,
          optimalHashtags: 3,
          optimalPostingTimes: ['8:00 AM', '12:00 PM', '5:00 PM'],
          recommendedFormats: ['Text', 'Image', 'Video', 'Article'],
          engagementTips: ['Share professional insights', 'Use industry hashtags', 'Engage with comments']
        }
      },
      {
        platform: 'tiktok',
        limits: {
          maxCharacters: 300,
          maxHashtags: 5,
          maxImages: 0,
          maxVideos: 1,
          maxLinks: 0
        },
        dimensions: {
          image: { width: 0, height: 0, aspectRatio: '0:0' },
          video: { maxDuration: 180, minDuration: 15, aspectRatio: '9:16' }
        },
        features: {
          supportsHashtags: true,
          supportsMentions: true,
          supportsLinks: false,
          supportsEmojis: true,
          supportsImages: false,
          supportsVideos: true,
          supportsCarousel: false,
          supportsStories: false
        },
        bestPractices: {
          optimalLength: 100,
          optimalHashtags: 3,
          optimalPostingTimes: ['6:00 AM', '10:00 AM', '7:00 PM'],
          recommendedFormats: ['Vertical Video'],
          engagementTips: ['Use trending sounds', 'Post frequently', 'Engage with comments quickly']
        }
      }
    ];

    specs.forEach(spec => {
      this.platformSpecs.set(spec.platform, spec);
    });
  }

  private initializeOptimizationRules(): void {
    const rules: OptimizationRule[] = [
      // Instagram rules
      {
        id: 'ig_char_limit',
        name: 'Instagram Character Limit',
        description: 'Ensure content fits within Instagram character limit',
        platform: 'instagram',
        type: 'character_limit',
        priority: 'high',
        enabled: true,
        conditions: [
          {
            field: 'length',
            operator: 'greater_than',
            value: 2200,
            description: 'Content exceeds Instagram character limit'
          }
        ],
        actions: [
          {
            type: 'truncate',
            parameters: { maxLength: 2200, addEllipsis: true },
            description: 'Truncate content to fit character limit'
          }
        ],
        impact: 'positive',
        confidence: 0.9
      },
      {
        id: 'ig_hashtag_optimization',
        name: 'Instagram Hashtag Optimization',
        description: 'Optimize hashtag count for Instagram',
        platform: 'instagram',
        type: 'hashtag_limit',
        priority: 'medium',
        enabled: true,
        conditions: [
          {
            field: 'hashtags',
            operator: 'greater_than',
            value: 5,
            description: 'Too many hashtags for optimal engagement'
          }
        ],
        actions: [
          {
            type: 'remove_hashtags',
            parameters: { maxHashtags: 5, keepMostRelevant: true },
            description: 'Reduce hashtags to optimal count'
          }
        ],
        impact: 'positive',
        confidence: 0.7
      },
      // Twitter rules
      {
        id: 'tw_char_limit',
        name: 'Twitter Character Limit',
        description: 'Ensure content fits within Twitter character limit',
        platform: 'twitter',
        type: 'character_limit',
        priority: 'high',
        enabled: true,
        conditions: [
          {
            field: 'length',
            operator: 'greater_than',
            value: 280,
            description: 'Content exceeds Twitter character limit'
          }
        ],
        actions: [
          {
            type: 'truncate',
            parameters: { maxLength: 280, addEllipsis: true },
            description: 'Truncate content to fit character limit'
          }
        ],
        impact: 'positive',
        confidence: 0.95
      },
      {
        id: 'tw_hashtag_optimization',
        name: 'Twitter Hashtag Optimization',
        description: 'Optimize hashtag count for Twitter',
        platform: 'twitter',
        type: 'hashtag_limit',
        priority: 'medium',
        enabled: true,
        conditions: [
          {
            field: 'hashtags',
            operator: 'greater_than',
            value: 2,
            description: 'Too many hashtags for optimal engagement'
          }
        ],
        actions: [
          {
            type: 'remove_hashtags',
            parameters: { maxHashtags: 2, keepMostRelevant: true },
            description: 'Reduce hashtags to optimal count'
          }
        ],
        impact: 'positive',
        confidence: 0.8
      }
    ];

    rules.forEach(rule => {
      const platformRules = this.optimizationRules.get(rule.platform) || [];
      platformRules.push(rule);
      this.optimizationRules.set(rule.platform, platformRules);
    });
  }

  private evaluateConditions(content: string, conditions: OptimizationCondition[]): boolean {
    return conditions.every(condition => {
      switch (condition.field) {
        case 'content':
          return this.evaluateContentCondition(content, condition);
        case 'hashtags':
          return this.evaluateHashtagCondition(content, condition);
        case 'length':
          return this.evaluateLengthCondition(content, condition);
        default:
          return false;
      }
    });
  }

  private evaluateContentCondition(content: string, condition: OptimizationCondition): boolean {
    switch (condition.operator) {
      case 'contains':
        return content.includes(condition.value);
      case 'not_contains':
        return !content.includes(condition.value);
      case 'regex':
        return new RegExp(condition.value).test(content);
      default:
        return false;
    }
  }

  private evaluateHashtagCondition(content: string, condition: OptimizationCondition): boolean {
    const hashtags = content.match(/#\w+/g) || [];
    const hashtagCount = hashtags.length;

    switch (condition.operator) {
      case 'greater_than':
        return hashtagCount > condition.value;
      case 'less_than':
        return hashtagCount < condition.value;
      case 'equals':
        return hashtagCount === condition.value;
      default:
        return false;
    }
  }

  private evaluateLengthCondition(content: string, condition: OptimizationCondition): boolean {
    const length = content.length;

    switch (condition.operator) {
      case 'greater_than':
        return length > condition.value;
      case 'less_than':
        return length < condition.value;
      case 'equals':
        return length === condition.value;
      case 'between':
        return length >= condition.value[0] && length <= condition.value[1];
      default:
        return false;
    }
  }

  private async applyRule(
    content: string,
    rule: OptimizationRule,
    specs: PlatformSpecs
  ): Promise<{ success: boolean; content: string; changes: OptimizationResult['changes']; error?: string }> {
    const changes: OptimizationResult['changes'] = [];
    let optimizedContent = content;

    try {
      for (const action of rule.actions) {
        const result = await this.applyAction(optimizedContent, action, specs);
        optimizedContent = result.content;
        changes.push(...result.changes);
      }

      return {
        success: true,
        content: optimizedContent,
        changes
      };
    } catch (error) {
      return {
        success: false,
        content,
        changes,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async applyAction(
    content: string,
    action: OptimizationAction,
    specs: PlatformSpecs
  ): Promise<{ content: string; changes: OptimizationResult['changes'] }> {
    const changes: OptimizationResult['changes'] = [];
    let optimizedContent = content;

    switch (action.type) {
      case 'truncate':
        const maxLength = action.parameters.maxLength;
        if (content.length > maxLength) {
          const truncated = content.substring(0, maxLength - 3) + '...';
          changes.push({
            type: 'truncate',
            description: `Truncated content from ${content.length} to ${maxLength} characters`,
            before: content,
            after: truncated,
            impact: 'positive'
          });
          optimizedContent = truncated;
        }
        break;

      case 'remove_hashtags':
        const maxHashtags = action.parameters.maxHashtags;
        const hashtags = content.match(/#\w+/g) || [];
        if (hashtags.length > maxHashtags) {
          const hashtagsToKeep = hashtags.slice(0, maxHashtags);
          const hashtagsToRemove = hashtags.slice(maxHashtags);
          const newContent = content.replace(/#\w+/g, (match) => {
            return hashtagsToKeep.includes(match) ? match : '';
          }).replace(/\s+/g, ' ').trim();
          
          changes.push({
            type: 'remove_hashtags',
            description: `Removed ${hashtagsToRemove.length} hashtags, keeping ${maxHashtags}`,
            before: content,
            after: newContent,
            impact: 'positive'
          });
          optimizedContent = newContent;
        }
        break;

      case 'add_emoji':
        const emoji = action.parameters.emoji;
        if (!content.includes(emoji)) {
          optimizedContent = content + ' ' + emoji;
          changes.push({
            type: 'add_emoji',
            description: `Added emoji: ${emoji}`,
            before: content,
            after: optimizedContent,
            impact: 'positive'
          });
        }
        break;

      default:
        // Handle other action types
        break;
    }

    return {
      content: optimizedContent,
      changes
    };
  }

  private calculateMetrics(
    originalContent: string,
    optimizedContent: string,
    specs: PlatformSpecs
  ): OptimizationResult['metrics'] {
    const characterReduction = originalContent.length - optimizedContent.length;
    const originalHashtags = (originalContent.match(/#\w+/g) || []).length;
    const optimizedHashtags = (optimizedContent.match(/#\w+/g) || []).length;
    const hashtagOptimization = originalHashtags - optimizedHashtags;
    
    // Mock engagement improvement calculation
    const engagementImprovement = Math.min(characterReduction * 0.1, 50);
    const complianceScore = this.calculateComplianceScore(optimizedContent, specs);

    return {
      characterReduction,
      hashtagOptimization,
      engagementImprovement: Math.round(engagementImprovement * 100) / 100,
      complianceScore
    };
  }

  private calculateComplianceScore(content: string, specs: PlatformSpecs): number {
    let score = 100;

    // Check character limit
    if (content.length > specs.limits.maxCharacters) {
      score -= 20;
    }

    // Check hashtag limit
    const hashtagCount = (content.match(/#\w+/g) || []).length;
    if (hashtagCount > specs.limits.maxHashtags) {
      score -= 10;
    }

    // Check optimal length
    const optimalLength = specs.bestPractices.optimalLength;
    const lengthDiff = Math.abs(content.length - optimalLength);
    if (lengthDiff > optimalLength * 0.5) {
      score -= 15;
    }

    return Math.max(0, score);
  }

  private checkCompliance(content: string, specs: PlatformSpecs): {
    isCompliant: boolean;
    violations: string[];
    warnings: string[];
    suggestions: string[];
  } {
    const violations: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Check character limit
    if (content.length > specs.limits.maxCharacters) {
      violations.push(`Content exceeds character limit (${content.length}/${specs.limits.maxCharacters})`);
    }

    // Check hashtag limit
    const hashtagCount = (content.match(/#\w+/g) || []).length;
    if (hashtagCount > specs.limits.maxHashtags) {
      violations.push(`Too many hashtags (${hashtagCount}/${specs.limits.maxHashtags})`);
    }

    // Check optimal length
    const optimalLength = specs.bestPractices.optimalLength;
    if (content.length < optimalLength * 0.5) {
      warnings.push(`Content is very short (${content.length} characters). Consider adding more detail.`);
    }

    // Generate suggestions
    if (hashtagCount < specs.bestPractices.optimalHashtags) {
      suggestions.push(`Consider adding more hashtags (current: ${hashtagCount}, optimal: ${specs.bestPractices.optimalHashtags})`);
    }

    if (content.length < optimalLength) {
      suggestions.push(`Consider expanding content to optimal length (current: ${content.length}, optimal: ${optimalLength})`);
    }

    return {
      isCompliant: violations.length === 0,
      violations,
      warnings,
      suggestions
    };
  }

  private generateRecommendations(content: string, specs: PlatformSpecs): string[] {
    const recommendations: string[] = [];

    // Length recommendations
    const optimalLength = specs.bestPractices.optimalLength;
    if (content.length < optimalLength * 0.8) {
      recommendations.push(`Consider expanding content to ${optimalLength} characters for better engagement`);
    }

    // Hashtag recommendations
    const hashtagCount = (content.match(/#\w+/g) || []).length;
    if (hashtagCount < specs.bestPractices.optimalHashtags) {
      recommendations.push(`Add ${specs.bestPractices.optimalHashtags - hashtagCount} more relevant hashtags`);
    }

    // Posting time recommendations
    if (specs.bestPractices.optimalPostingTimes.length > 0) {
      recommendations.push(`Best posting times: ${specs.bestPractices.optimalPostingTimes.join(', ')}`);
    }

    // Engagement tips
    recommendations.push(...specs.bestPractices.engagementTips);

    return recommendations;
  }
}
