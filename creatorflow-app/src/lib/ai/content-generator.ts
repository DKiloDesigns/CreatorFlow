import { monitoring } from '@/lib/monitoring';

export interface ContentGenerationRequest {
  type: 'post' | 'caption' | 'hashtag' | 'bio' | 'story' | 'thread';
  platform: 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'youtube';
  topic: string;
  tone: 'professional' | 'casual' | 'friendly' | 'authoritative' | 'humorous';
  length: 'short' | 'medium' | 'long';
  includeHashtags: boolean;
  includeCallToAction: boolean;
  targetAudience?: string;
  keywords?: string[];
  style?: string;
}

export interface GeneratedContent {
  id: string;
  type: ContentGenerationRequest['type'];
  platform: ContentGenerationRequest['platform'];
  content: string;
  hashtags: string[];
  callToAction?: string;
  estimatedEngagement: number;
  confidence: number;
  alternatives: string[];
  metadata: {
    wordCount: number;
    characterCount: number;
    readingTime: number;
    sentiment: 'positive' | 'neutral' | 'negative';
    keywords: string[];
  };
  createdAt: Date;
}

export interface ContentTemplate {
  id: string;
  name: string;
  type: ContentGenerationRequest['type'];
  platform: ContentGenerationRequest['platform'];
  template: string;
  variables: string[];
  examples: string[];
  tags: string[];
}

class ContentGenerator {
  private static instance: ContentGenerator;
  private templates: Map<string, ContentTemplate> = new Map();
  private generationHistory: GeneratedContent[] = [];

  static getInstance(): ContentGenerator {
    if (!ContentGenerator.instance) {
      ContentGenerator.instance = new ContentGenerator();
    }
    return ContentGenerator.instance;
  }

  // Initialize with default templates
  initializeTemplates(): void {
    const defaultTemplates: ContentTemplate[] = [
      {
        id: 'instagram-post',
        name: 'Instagram Post',
        type: 'post',
        platform: 'instagram',
        template: '🎯 {topic}\n\n{content}\n\n{hashtags}\n\n{callToAction}',
        variables: ['topic', 'content', 'hashtags', 'callToAction'],
        examples: [
          '🎯 Social Media Tips\n\nWant to grow your Instagram? Here are 3 proven strategies that actually work!\n\n#socialmedia #instagram #growth\n\nWhich tip resonated most with you? 👇',
        ],
        tags: ['social media', 'tips', 'growth'],
      },
      {
        id: 'twitter-thread',
        name: 'Twitter Thread',
        type: 'thread',
        platform: 'twitter',
        template: '🧵 {topic}\n\n{content}\n\n{hashtags}',
        variables: ['topic', 'content', 'hashtags'],
        examples: [
          '🧵 5 Content Creation Mistakes You\'re Probably Making\n\n1. Not knowing your audience\n2. Inconsistent posting\n3. Ignoring analytics\n4. Copying others too much\n5. Not having a strategy\n\n#contentcreation #socialmedia',
        ],
        tags: ['content', 'mistakes', 'tips'],
      },
      {
        id: 'linkedin-professional',
        name: 'LinkedIn Professional Post',
        type: 'post',
        platform: 'linkedin',
        template: '{topic}\n\n{content}\n\nWhat are your thoughts on this? I\'d love to hear from the community.\n\n{hashtags}',
        variables: ['topic', 'content', 'hashtags'],
        examples: [
          'The Future of Remote Work\n\nRemote work isn\'t just a trend—it\'s the future. Companies that adapt will thrive.\n\nWhat are your thoughts on this? I\'d love to hear from the community.\n\n#remotework #futureofwork #leadership',
        ],
        tags: ['professional', 'business', 'leadership'],
      },
    ];

    defaultTemplates.forEach(template => {
      this.templates.set(template.id, template);
    });

    monitoring.info('Content generator templates initialized', {
      templateCount: defaultTemplates.length,
    });
  }

  // Generate content based on request
  async generateContent(request: ContentGenerationRequest): Promise<GeneratedContent> {
    try {
      monitoring.info('Starting content generation', {
        type: request.type,
        platform: request.platform,
        topic: request.topic,
      });

      const template = this.findBestTemplate(request);
      const content = await this.generateFromTemplate(template, request);
      const hashtags = request.includeHashtags ? await this.generateHashtags(request) : [];
      const callToAction = request.includeCallToAction ? await this.generateCallToAction(request) : undefined;

      const generatedContent: GeneratedContent = {
        id: `content-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: request.type,
        platform: request.platform,
        content,
        hashtags,
        callToAction,
        estimatedEngagement: this.estimateEngagement(request, content, hashtags),
        confidence: this.calculateConfidence(request, content),
        alternatives: await this.generateAlternatives(request, 3),
        metadata: this.analyzeContent(content),
        createdAt: new Date(),
      };

      this.generationHistory.push(generatedContent);

      monitoring.info('Content generation completed', {
        contentId: generatedContent.id,
        estimatedEngagement: generatedContent.estimatedEngagement,
        confidence: generatedContent.confidence,
      });

      return generatedContent;
    } catch (error) {
      monitoring.error('Content generation failed', {
        request,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  // Generate hashtags for a topic
  async generateHashtags(request: ContentGenerationRequest): Promise<string[]> {
    const baseHashtags = this.getBaseHashtags(request.platform, request.topic);
    const trendingHashtags = await this.getTrendingHashtags(request.platform);
    const nicheHashtags = this.getNicheHashtags(request.topic);

    const allHashtags = [...baseHashtags, ...trendingHashtags, ...nicheHashtags];
    const uniqueHashtags = [...new Set(allHashtags)];

    // Return appropriate number based on platform
    const maxHashtags = this.getMaxHashtags(request.platform);
    return uniqueHashtags.slice(0, maxHashtags);
  }

  // Generate call-to-action
  async generateCallToAction(request: ContentGenerationRequest): Promise<string> {
    const ctas = this.getCallToActions(request.platform, request.tone);
    return ctas[Math.floor(Math.random() * ctas.length)];
  }

  // Get content generation history
  getHistory(limit: number = 50): GeneratedContent[] {
    return this.generationHistory
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  // Get content templates
  getTemplates(filters?: {
    type?: ContentGenerationRequest['type'];
    platform?: ContentGenerationRequest['platform'];
    tags?: string[];
  }): ContentTemplate[] {
    let templates = Array.from(this.templates.values());

    if (filters?.type) {
      templates = templates.filter(t => t.type === filters.type);
    }

    if (filters?.platform) {
      templates = templates.filter(t => t.platform === filters.platform);
    }

    if (filters?.tags) {
      templates = templates.filter(t => 
        filters.tags!.some(tag => t.tags.includes(tag))
      );
    }

    return templates;
  }

  // Add custom template
  addTemplate(template: ContentTemplate): void {
    this.templates.set(template.id, template);
    monitoring.info('Custom template added', {
      templateId: template.id,
      templateName: template.name,
    });
  }

  // Get content performance analytics
  getPerformanceAnalytics(): {
    totalGenerated: number;
    avgEngagement: number;
    topPerformingTypes: Array<{ type: string; avgEngagement: number }>;
    platformBreakdown: Record<string, number>;
  } {
    const totalGenerated = this.generationHistory.length;
    const avgEngagement = this.generationHistory.reduce((sum, content) => 
      sum + content.estimatedEngagement, 0) / totalGenerated || 0;

    const typePerformance = this.generationHistory.reduce((acc, content) => {
      if (!acc[content.type]) {
        acc[content.type] = { count: 0, totalEngagement: 0 };
      }
      acc[content.type].count++;
      acc[content.type].totalEngagement += content.estimatedEngagement;
      return acc;
    }, {} as Record<string, { count: number; totalEngagement: number }>);

    const topPerformingTypes = Object.entries(typePerformance)
      .map(([type, data]) => ({
        type,
        avgEngagement: data.totalEngagement / data.count,
      }))
      .sort((a, b) => b.avgEngagement - a.avgEngagement)
      .slice(0, 5);

    const platformBreakdown = this.generationHistory.reduce((acc, content) => {
      acc[content.platform] = (acc[content.platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalGenerated,
      avgEngagement,
      topPerformingTypes,
      platformBreakdown,
    };
  }

  private findBestTemplate(request: ContentGenerationRequest): ContentTemplate {
    const templates = this.getTemplates({
      type: request.type,
      platform: request.platform,
    });

    if (templates.length === 0) {
      // Return a generic template if no specific one found
      return {
        id: 'generic',
        name: 'Generic Template',
        type: request.type,
        platform: request.platform,
        template: '{content}\n\n{hashtags}',
        variables: ['content', 'hashtags'],
        examples: [],
        tags: [],
      };
    }

    // For now, return the first matching template
    // In a real implementation, you'd use AI to select the best template
    return templates[0];
  }

  private async generateFromTemplate(template: ContentTemplate, request: ContentGenerationRequest): Promise<string> {
    // This would integrate with an AI service like OpenAI
    // For now, we'll use a simple template-based approach
    
    const content = this.generateSimpleContent(request);
    const hashtags = request.includeHashtags ? (await this.generateHashtags(request)).join(' ') : '';
    const callToAction = request.includeCallToAction ? (await this.generateCallToAction(request)) : '';

    return template.template
      .replace('{topic}', request.topic)
      .replace('{content}', content)
      .replace('{hashtags}', hashtags)
      .replace('{callToAction}', callToAction);
  }

  private generateSimpleContent(request: ContentGenerationRequest): string {
      const contentTemplates: Record<string, string[]> = {
    'post': [
      `Want to know the secret to ${request.topic}? Here's what I've learned...`,
      `${request.topic} is something I'm passionate about. Here's why it matters...`,
      `Ever wondered about ${request.topic}? Let me share my insights...`,
    ],
    'caption': [
      `📸 ${request.topic}\n\nSometimes the best moments are the simple ones.`,
      `✨ ${request.topic}\n\nGrateful for this journey and all the lessons learned.`,
      `🎯 ${request.topic}\n\nFocus on progress, not perfection.`,
    ],
    'thread': [
      `🧵 ${request.topic}\n\nA thread on what I've learned...`,
      `📝 ${request.topic}\n\nLet me break this down for you...`,
      `💡 ${request.topic}\n\nHere's what you need to know...`,
    ],
    'hashtag': [
      `#${request.topic.replace(/\s+/g, '')} #content #socialmedia`,
      `#${request.topic.replace(/\s+/g, '')} #engagement #growth`,
      `#${request.topic.replace(/\s+/g, '')} #digitalmarketing #success`,
    ],
    'bio': [
      `Passionate about ${request.topic} | Helping others grow | Building meaningful connections`,
      `${request.topic} enthusiast | Sharing insights & experiences | Always learning`,
      `Dedicated to ${request.topic} | Creating value | Inspiring others`,
    ],
    'story': [
      `Today's story: ${request.topic} - the journey continues...`,
      `Behind the scenes: ${request.topic} - what really happens...`,
      `Real talk about ${request.topic} - no filters, just truth...`,
    ],
  };

    const templates = contentTemplates[request.type] || contentTemplates['post'];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  private async generateAlternatives(request: ContentGenerationRequest, count: number): Promise<string[]> {
    const alternatives: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const alternativeRequest = { ...request };
      alternativeRequest.tone = this.getRandomTone(request.tone);
      
      const template = this.findBestTemplate(alternativeRequest);
      const content = await this.generateFromTemplate(template, alternativeRequest);
      alternatives.push(content);
    }

    return alternatives;
  }

  private getRandomTone(currentTone: string): ContentGenerationRequest['tone'] {
    const tones: ContentGenerationRequest['tone'][] = ['professional', 'casual', 'friendly', 'authoritative', 'humorous'];
    const otherTones = tones.filter(t => t !== currentTone);
    return otherTones[Math.floor(Math.random() * otherTones.length)];
  }

  private estimateEngagement(request: ContentGenerationRequest, content: string, hashtags: string[]): number {
    let score = 50; // Base score

    // Platform bonus
    const platformBonus = {
      instagram: 10,
      twitter: 8,
      linkedin: 12,
      tiktok: 15,
      youtube: 5,
    };
    score += platformBonus[request.platform] || 0;

    // Content length bonus
    if (content.length > 100) score += 5;
    if (content.length > 200) score += 5;

    // Hashtag bonus
    score += Math.min(hashtags.length * 2, 20);

    // Tone bonus
    const toneBonus = {
      professional: 8,
      casual: 5,
      friendly: 10,
      authoritative: 12,
      humorous: 15,
    };
    score += toneBonus[request.tone] || 0;

    return Math.min(score, 100);
  }

  private calculateConfidence(request: ContentGenerationRequest, content: string): number {
    let confidence = 70; // Base confidence

    // Topic specificity
    if (request.topic.length > 10) confidence += 10;
    if (request.keywords && request.keywords.length > 0) confidence += 5;

    // Content quality
    if (content.length > 50) confidence += 5;
    if (content.includes('?')) confidence += 5; // Questions increase engagement

    return Math.min(confidence, 95);
  }

  private analyzeContent(content: string): GeneratedContent['metadata'] {
    const words = content.split(' ').length;
    const characters = content.length;
    const readingTime = Math.ceil(words / 200); // Average reading speed

    // Simple sentiment analysis
    const positiveWords = ['great', 'amazing', 'awesome', 'love', 'excellent', 'perfect'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'disappointing'];
    
    const positiveCount = positiveWords.filter(word => content.toLowerCase().includes(word)).length;
    const negativeCount = negativeWords.filter(word => content.toLowerCase().includes(word)).length;
    
    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
    if (positiveCount > negativeCount) sentiment = 'positive';
    else if (negativeCount > positiveCount) sentiment = 'negative';

    // Extract keywords (simple approach)
    const keywords = content
      .toLowerCase()
      .split(' ')
      .filter(word => word.length > 3)
      .slice(0, 5);

    return {
      wordCount: words,
      characterCount: characters,
      readingTime,
      sentiment,
      keywords,
    };
  }

  private getBaseHashtags(platform: string, topic: string): string[] {
    const baseHashtags: Record<string, string[]> = {
      instagram: ['#instagram', '#socialmedia', '#content'],
      twitter: ['#twitter', '#socialmedia', '#content'],
      linkedin: ['#linkedin', '#professional', '#business'],
      tiktok: ['#tiktok', '#viral', '#trending'],
      youtube: ['#youtube', '#video', '#content'],
    };

    return baseHashtags[platform] || [];
  }

  private async getTrendingHashtags(platform: string): Promise<string[]> {
    // This would integrate with platform APIs
    // For now, return mock trending hashtags
    const trendingHashtags: Record<string, string[]> = {
      instagram: ['#reels', '#viral', '#trending'],
      twitter: ['#twitter', '#viral', '#trending'],
      linkedin: ['#networking', '#career', '#professional'],
      tiktok: ['#fyp', '#viral', '#trending'],
      youtube: ['#shorts', '#viral', '#trending'],
    };

    return trendingHashtags[platform] || [];
  }

  private getNicheHashtags(topic: string): string[] {
    // Simple keyword-based hashtag generation
    const words = topic.toLowerCase().split(' ');
    return words
      .filter(word => word.length > 3)
      .map(word => `#${word}`)
      .slice(0, 5);
  }

  private getMaxHashtags(platform: string): number {
    const maxHashtags: Record<string, number> = {
      instagram: 30,
      twitter: 2,
      linkedin: 5,
      tiktok: 20,
      youtube: 10,
    };

    return maxHashtags[platform] || 10;
  }

  private getCallToActions(platform: string, tone: string): string[] {
    const ctas: Record<string, string[]> = {
      instagram: [
        'What do you think? 👇',
        'Drop a comment below! 💬',
        'Double tap if you agree! ❤️',
        'Share with someone who needs this! 🔄',
      ],
      twitter: [
        'What are your thoughts?',
        'Agree or disagree?',
        'Retweet if you found this helpful!',
        'Follow for more insights!',
      ],
      linkedin: [
        'What are your thoughts on this?',
        'I\'d love to hear from the community.',
        'Share your experience in the comments.',
        'Connect if this resonates with you.',
      ],
    };

    return ctas[platform] || ctas['instagram'];
  }
}

export const contentGenerator = ContentGenerator.getInstance(); 