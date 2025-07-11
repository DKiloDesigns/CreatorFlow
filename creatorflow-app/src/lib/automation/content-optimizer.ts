import { PrismaClient } from '@prisma/client';
import { monitoring } from '@/lib/monitoring';

const prisma = new PrismaClient();

export interface ContentOptimization {
  id: string;
  postId: string;
  originalContent: string;
  optimizedContent: string;
  changes: string[];
  expectedImprovement: number; // percentage
  confidence: number;
  createdAt: Date;
}

export interface OptimizationSuggestion {
  type: 'hashtag' | 'timing' | 'content' | 'platform' | 'engagement';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  implementation: string;
  expectedResult: string;
}

class ContentOptimizer {
  private static instance: ContentOptimizer;

  static getInstance(): ContentOptimizer {
    if (!ContentOptimizer.instance) {
      ContentOptimizer.instance = new ContentOptimizer();
    }
    return ContentOptimizer.instance;
  }

  async optimizePost(postId: string): Promise<ContentOptimization | null> {
    try {
      monitoring.info('Starting post optimization', { postId });

      const post = await prisma.post.findUnique({
        where: { id: postId },
      });

      if (!post) {
        monitoring.warn('Post not found for optimization', { postId });
        return null;
      }

      const optimizations = await this.analyzeContent(post);
      const optimizedContent = await this.applyOptimizations(post.contentText || '', optimizations);

      const optimization: ContentOptimization = {
        id: `opt-${Date.now()}`,
        postId,
        originalContent: post.contentText || '',
        optimizedContent,
        changes: optimizations.map(opt => opt.description),
        expectedImprovement: this.calculateExpectedImprovement(optimizations),
        confidence: this.calculateConfidence(optimizations),
        createdAt: new Date(),
      };

      // Store optimization
      await this.storeOptimization(optimization);

      monitoring.info('Post optimization completed', { 
        postId, 
        changes: optimization.changes.length,
        expectedImprovement: optimization.expectedImprovement 
      });

      return optimization;
    } catch (error) {
      monitoring.error('Failed to optimize post', { postId, error: error instanceof Error ? error.message : String(error) });
      return null;
    }
  }

  async generateSuggestions(userId: string): Promise<OptimizationSuggestion[]> {
    try {
      monitoring.info('Generating optimization suggestions', { userId });

      const posts = await prisma.post.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });

      const suggestions: OptimizationSuggestion[] = [];

      // Analyze hashtag usage
      const hashtagSuggestions = await this.analyzeHashtagUsage(posts);
      suggestions.push(...hashtagSuggestions);

      // Analyze posting timing
      const timingSuggestions = await this.analyzePostingTiming(posts);
      suggestions.push(...timingSuggestions);

      // Analyze content patterns
      const contentSuggestions = await this.analyzeContentPatterns(posts);
      suggestions.push(...contentSuggestions);

      // Analyze platform performance
      const platformSuggestions = await this.analyzePlatformPerformance(posts);
      suggestions.push(...platformSuggestions);

      // Analyze engagement patterns
      const engagementSuggestions = await this.analyzeEngagementPatterns(posts);
      suggestions.push(...engagementSuggestions);

      monitoring.info('Optimization suggestions generated', { 
        userId, 
        count: suggestions.length 
      });

      return suggestions;
    } catch (error) {
      monitoring.error('Failed to generate suggestions', { userId, error: error instanceof Error ? error.message : String(error) });
      return [];
    }
  }

  private async analyzeContent(post: any): Promise<any[]> {
    const optimizations = [];

    // Check content length
    if (post.contentText.length < 100) {
      optimizations.push({
        type: 'content',
        description: 'Content is too short. Consider adding more details or context.',
        impact: 'medium',
        implementation: 'Add relevant details, questions, or call-to-actions.',
      });
    }

    // Check for hashtags
    const hashtagCount = (post.hashtags || []).length;
    if (hashtagCount < 3) {
      optimizations.push({
        type: 'hashtag',
        description: 'Add more relevant hashtags to increase discoverability.',
        impact: 'high',
        implementation: 'Research trending hashtags in your niche and add 3-5 relevant ones.',
      });
    }

    // Check for call-to-action
    const hasCTA = /(follow|like|comment|share|click|visit|check|learn)/i.test(post.contentText);
    if (!hasCTA) {
      optimizations.push({
        type: 'engagement',
        description: 'Add a call-to-action to encourage engagement.',
        impact: 'medium',
        implementation: 'End your post with a question or clear action you want followers to take.',
      });
    }

    // Check for questions
    const hasQuestion = /\?/.test(post.contentText);
    if (!hasQuestion) {
      optimizations.push({
        type: 'engagement',
        description: 'Include questions to encourage comments and discussion.',
        impact: 'medium',
        implementation: 'Add a relevant question to spark conversation.',
      });
    }

    return optimizations;
  }

  private async applyOptimizations(content: string, optimizations: any[]): Promise<string> {
    let optimizedContent = content;

    for (const optimization of optimizations) {
      switch (optimization.type) {
        case 'content':
          if (content.length < 100) {
            optimizedContent += '\n\n💡 Pro tip: Add more context to increase engagement!';
          }
          break;
        case 'hashtag':
          if (!content.includes('#')) {
            optimizedContent += '\n\n#socialmedia #content #engagement';
          }
          break;
        case 'engagement':
          if (!/(follow|like|comment|share|click|visit|check|learn)/i.test(content)) {
            optimizedContent += '\n\nWhat do you think? Drop a comment below! 👇';
          }
          break;
      }
    }

    return optimizedContent;
  }

  private calculateExpectedImprovement(optimizations: any[]): number {
    const impactScores = { high: 25, medium: 15, low: 5 };
    const totalImprovement = optimizations.reduce((sum, opt) => {
      return sum + (impactScores[opt.impact as keyof typeof impactScores] || 0);
    }, 0);
    
    return Math.min(totalImprovement, 50); // Cap at 50%
  }

  private calculateConfidence(optimizations: any[]): number {
    const baseConfidence = 70;
    const confidencePerOptimization = 5;
    return Math.min(baseConfidence + (optimizations.length * confidencePerOptimization), 95);
  }

  private async analyzeHashtagUsage(posts: any[]): Promise<OptimizationSuggestion[]> {
    const suggestions: OptimizationSuggestion[] = [];

    const hashtagUsage = new Map<string, number>();
    posts.forEach(post => {
      const hashtags = post.hashtags || [];
      hashtags.forEach((tag: string) => {
        hashtagUsage.set(tag, (hashtagUsage.get(tag) || 0) + 1);
      });
    });

    const avgHashtags = posts.reduce((sum, post) => sum + (post.hashtags?.length || 0), 0) / posts.length;

    if (avgHashtags < 5) {
      suggestions.push({
        type: 'hashtag',
        title: 'Increase Hashtag Usage',
        description: 'Your posts average only 3 hashtags. More hashtags can increase discoverability.',
        impact: 'high',
        implementation: 'Add 5-10 relevant hashtags to each post using the hashtag recommender.',
        expectedResult: '20-30% increase in reach and discoverability',
      });
    }

    return suggestions;
  }

  private async analyzePostingTiming(posts: any[]): Promise<OptimizationSuggestion[]> {
    const suggestions: OptimizationSuggestion[] = [];

    if (posts.length < 10) return suggestions;

    // Analyze posting frequency
    const recentPosts = posts.slice(0, 10);
    const avgDaysBetweenPosts = this.calculateAverageDaysBetweenPosts(recentPosts);

    if (avgDaysBetweenPosts > 3) {
      suggestions.push({
        type: 'timing',
        title: 'Increase Posting Frequency',
        description: `You're posting every ${Math.round(avgDaysBetweenPosts)} days. More frequent posting can increase engagement.`,
        impact: 'medium',
        implementation: 'Schedule posts 2-3 times per week using the content calendar.',
        expectedResult: '15-25% increase in follower engagement',
      });
    }

    return suggestions;
  }

  private async analyzeContentPatterns(posts: any[]): Promise<OptimizationSuggestion[]> {
    const suggestions: OptimizationSuggestion[] = [];

    // Analyze content types
    const contentTypes = posts.map(post => {
      const content = post.contentText.toLowerCase();
      if (content.includes('sale') || content.includes('buy') || content.includes('offer')) return 'promotional';
      if (content.includes('tip') || content.includes('how') || content.includes('guide')) return 'educational';
      if (content.includes('behind') || content.includes('day') || content.includes('life')) return 'personal';
      return 'general';
    });

    const typeCounts = contentTypes.reduce((acc, type) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dominantType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0];
    
    if (dominantType && dominantType[1] > posts.length * 0.6) {
      suggestions.push({
        type: 'content',
        title: 'Diversify Content Types',
        description: `Your content is ${Math.round((dominantType[1] / posts.length) * 100)}% ${dominantType[0]}. Mix it up for better engagement.`,
        impact: 'medium',
        implementation: 'Use the content ideas generator to create diverse content types.',
        expectedResult: '10-20% increase in audience retention',
      });
    }

    return suggestions;
  }

  private async analyzePlatformPerformance(posts: any[]): Promise<OptimizationSuggestion[]> {
    const suggestions: OptimizationSuggestion[] = [];

    const platformPerformance = posts.reduce((acc, post) => {
      const platforms = post.platforms || [];
      const engagement = (post.likes || 0) + (post.comments || 0) + (post.shares || 0);
      
      platforms.forEach((platform: string) => {
        if (!acc[platform]) acc[platform] = { posts: 0, totalEngagement: 0 };
        acc[platform].posts += 1;
        acc[platform].totalEngagement += engagement;
      });
      
      return acc;
    }, {} as Record<string, { posts: number; totalEngagement: number }>);

    const avgEngagementByPlatform = Object.entries(platformPerformance).map(([platform, data]) => ({
      platform,
      avgEngagement: (data as { totalEngagement: number; posts: number }).totalEngagement / (data as { totalEngagement: number; posts: number }).posts,
    }));

    const bestPlatform = avgEngagementByPlatform.sort((a, b) => b.avgEngagement - a.avgEngagement)[0];
    const worstPlatform = avgEngagementByPlatform.sort((a, b) => a.avgEngagement - b.avgEngagement)[0];

    if (bestPlatform && worstPlatform && bestPlatform.avgEngagement > worstPlatform.avgEngagement * 2) {
      suggestions.push({
        type: 'platform',
        title: 'Focus on High-Performing Platform',
        description: `${bestPlatform.platform} performs ${Math.round(bestPlatform.avgEngagement / worstPlatform.avgEngagement)}x better than ${worstPlatform.platform}.`,
        impact: 'high',
        implementation: 'Allocate more resources to your best-performing platform.',
        expectedResult: '30-50% increase in overall engagement',
      });
    }

    return suggestions;
  }

  private async analyzeEngagementPatterns(posts: any[]): Promise<OptimizationSuggestion[]> {
    const suggestions: OptimizationSuggestion[] = [];

    const engagementRates = posts.map(post => {
      const engagement = (post.likes || 0) + (post.comments || 0) + (post.shares || 0);
      return { post, engagement };
    });

    const highEngagementPosts = engagementRates
      .sort((a, b) => b.engagement - a.engagement)
      .slice(0, 3);

    const lowEngagementPosts = engagementRates
      .sort((a, b) => a.engagement - b.engagement)
      .slice(0, 3);

    if (highEngagementPosts.length > 0 && lowEngagementPosts.length > 0) {
      const avgHighEngagement = highEngagementPosts.reduce((sum, p) => sum + p.engagement, 0) / highEngagementPosts.length;
      const avgLowEngagement = lowEngagementPosts.reduce((sum, p) => sum + p.engagement, 0) / lowEngagementPosts.length;

      if (avgHighEngagement > avgLowEngagement * 3) {
        suggestions.push({
          type: 'engagement',
          title: 'Study High-Performing Content',
          description: 'Your best posts get 3x more engagement than your lowest performers.',
          impact: 'high',
          implementation: 'Analyze your top posts and replicate their successful elements.',
          expectedResult: '25-40% improvement in average engagement',
        });
      }
    }

    return suggestions;
  }

  private calculateAverageDaysBetweenPosts(posts: any[]): number {
    if (posts.length < 2) return 0;

    const sortedPosts = posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const totalDays = posts.reduce((sum, post, index) => {
      if (index === 0) return sum;
      const daysDiff = (new Date(sortedPosts[index - 1].createdAt).getTime() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      return sum + daysDiff;
    }, 0);

    return totalDays / (posts.length - 1);
  }

  private async storeOptimization(optimization: ContentOptimization): Promise<void> {
    // Store optimization in database
    // This would typically go to a dedicated optimizations table
    monitoring.info('Storing optimization', { 
      postId: optimization.postId, 
      changes: optimization.changes.length 
    });
  }
}

export const contentOptimizer = ContentOptimizer.getInstance(); 