import { PrismaClient } from '@prisma/client';
import { monitoring } from '@/lib/monitoring';

const prisma = new PrismaClient();

export interface Insight {
  id: string;
  type: 'performance' | 'timing' | 'content' | 'engagement' | 'growth';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number; // 0-100
  data: Record<string, any>;
  recommendations: string[];
  createdAt: Date;
}

export interface UserInsights {
  userId: string;
  insights: Insight[];
  lastGenerated: Date;
  nextUpdate: Date;
}

class InsightsGenerator {
  private static instance: InsightsGenerator;

  static getInstance(): InsightsGenerator {
    if (!InsightsGenerator.instance) {
      InsightsGenerator.instance = new InsightsGenerator();
    }
    return InsightsGenerator.instance;
  }

  async generateInsights(userId: string): Promise<UserInsights> {
    try {
      monitoring.info('Generating insights for user', { userId });

      const insights: Insight[] = [];
      
      // Get user's posts and analytics data
      const posts = await prisma.post.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 100,
      });

      const templates = await prisma.captionTemplate.findMany({
        where: { userId },
      });

      // Generate performance insights
      const performanceInsights = await this.analyzePerformance(posts);
      insights.push(...performanceInsights);

      // Generate timing insights
      const timingInsights = await this.analyzeTiming(posts);
      insights.push(...timingInsights);

      // Generate content insights
      const contentInsights = await this.analyzeContent(posts, templates);
      insights.push(...contentInsights);

      // Generate engagement insights
      const engagementInsights = await this.analyzeEngagement(posts);
      insights.push(...engagementInsights);

      // Generate growth insights
      const growthInsights = await this.analyzeGrowth(posts);
      insights.push(...growthInsights);

      const userInsights: UserInsights = {
        userId,
        insights,
        lastGenerated: new Date(),
        nextUpdate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      };

      // Store insights in database
      await this.storeInsights(userId, insights);

      monitoring.info('Insights generated successfully', { 
        userId, 
        count: insights.length 
      });

      return userInsights;
    } catch (error) {
      monitoring.error('Failed to generate insights', { userId, error: error instanceof Error ? error.message : String(error) });
      throw error;
    }
  }

  private async analyzePerformance(posts: any[]): Promise<Insight[]> {
    const insights: Insight[] = [];

    if (posts.length === 0) return insights;

    // Calculate average engagement rates
    const avgEngagement = posts.reduce((sum, post) => {
      const engagement = post.engagement || {};
      const total = (engagement.likes || 0) + (engagement.comments || 0) + (engagement.shares || 0);
      return sum + total;
    }, 0) / posts.length;

    // Find top performing posts
    const topPosts = posts
      .map(post => ({
        ...post,
        totalEngagement: (post.engagement?.likes || 0) + (post.engagement?.comments || 0) + (post.engagement?.shares || 0),
      }))
      .sort((a, b) => b.totalEngagement - a.totalEngagement)
      .slice(0, 3);

    // Performance insight
    if (avgEngagement > 50) {
      insights.push({
        id: `perf-${Date.now()}`,
        type: 'performance',
        title: 'Strong Engagement Performance',
        description: `Your posts are averaging ${Math.round(avgEngagement)} engagements per post, which is above average for your niche.`,
        impact: 'high',
        confidence: 85,
        data: { avgEngagement, topPosts: topPosts.map(p => ({ id: p.id, engagement: p.totalEngagement })) },
        recommendations: [
          'Continue posting similar content to maintain high engagement',
          'Analyze your top posts to identify common themes',
          'Consider increasing posting frequency to capitalize on momentum',
        ],
        createdAt: new Date(),
      });
    }

    return insights;
  }

  private async analyzeTiming(posts: any[]): Promise<Insight[]> {
    const insights: Insight[] = [];

    if (posts.length < 5) return insights;

    // Analyze posting times and engagement
    const timeAnalysis = posts.map(post => ({
      hour: new Date(post.publishedAt || post.createdAt).getHours(),
      engagement: (post.engagement?.likes || 0) + (post.engagement?.comments || 0) + (post.engagement?.shares || 0),
    }));

    // Find best posting hours
    const hourlyEngagement = new Array(24).fill(0).map((_, hour) => ({
      hour,
      totalEngagement: timeAnalysis
        .filter(p => p.hour === hour)
        .reduce((sum, p) => sum + p.engagement, 0),
      postCount: timeAnalysis.filter(p => p.hour === hour).length,
    }));

    const bestHours = hourlyEngagement
      .filter(h => h.postCount > 0)
      .sort((a, b) => (b.totalEngagement / b.postCount) - (a.totalEngagement / a.postCount))
      .slice(0, 3);

    if (bestHours.length > 0) {
      insights.push({
        id: `timing-${Date.now()}`,
        type: 'timing',
        title: 'Optimal Posting Times Identified',
        description: `Your posts perform best at ${bestHours.map(h => `${h.hour}:00`).join(', ')}.`,
        impact: 'medium',
        confidence: 75,
        data: { bestHours },
        recommendations: [
          'Schedule more posts during your peak hours',
          'Use the AI posting time predictor to optimize timing',
          'Test posting 30 minutes before peak hours for better visibility',
        ],
        createdAt: new Date(),
      });
    }

    return insights;
  }

  private async analyzeContent(posts: any[], templates: any[]): Promise<Insight[]> {
    const insights: Insight[] = [];

    // Analyze hashtag performance
    const hashtagUsage = new Map<string, number>();
    posts.forEach(post => {
      const hashtags = post.hashtags || [];
      hashtags.forEach((tag: string) => {
        hashtagUsage.set(tag, (hashtagUsage.get(tag) || 0) + 1);
      });
    });

    const topHashtags = Array.from(hashtagUsage.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    if (topHashtags.length > 0) {
      insights.push({
        id: `content-${Date.now()}`,
        type: 'content',
        title: 'Top Performing Hashtags',
        description: `Your most used hashtags are: ${topHashtags.map(([tag, count]) => `${tag} (${count} times)`).join(', ')}.`,
        impact: 'medium',
        confidence: 80,
        data: { topHashtags },
        recommendations: [
          'Continue using your top hashtags consistently',
          'Research trending hashtags in your niche',
          'Create hashtag groups for different content types',
        ],
        createdAt: new Date(),
      });
    }

    // Template usage analysis
    if (templates.length > 0) {
      const templateUsage = templates
        .map(t => ({
          id: t.id,
          name: t.name,
          usageCount: t.templateUsage?.length || 0,
        }))
        .sort((a, b) => b.usageCount - a.usageCount);

      const mostUsedTemplate = templateUsage[0];
      if (mostUsedTemplate && mostUsedTemplate.usageCount > 3) {
        insights.push({
          id: `template-${Date.now()}`,
          type: 'content',
          title: 'Most Effective Template',
          description: `Your template "${mostUsedTemplate.name}" has been used ${mostUsedTemplate.usageCount} times.`,
          impact: 'medium',
          confidence: 70,
          data: { templateUsage },
          recommendations: [
            'Create variations of your most successful template',
            'Analyze what makes this template effective',
            'Use it as a base for new content ideas',
          ],
          createdAt: new Date(),
        });
      }
    }

    return insights;
  }

  private async analyzeEngagement(posts: any[]): Promise<Insight[]> {
    const insights: Insight[] = [];

    if (posts.length === 0) return insights;

    // Analyze engagement patterns
    const engagementTypes = posts.reduce((acc, post) => {
      const engagement = post.engagement || {};
      acc.likes += engagement.likes || 0;
      acc.comments += engagement.comments || 0;
      acc.shares += engagement.shares || 0;
      return acc;
    }, { likes: 0, comments: 0, shares: 0 });

    const totalEngagement = engagementTypes.likes + engagementTypes.comments + engagementTypes.shares;
    const commentRate = totalEngagement > 0 ? (engagementTypes.comments / totalEngagement) * 100 : 0;
    const shareRate = totalEngagement > 0 ? (engagementTypes.shares / totalEngagement) * 100 : 0;

    if (commentRate > 15) {
      insights.push({
        id: `engagement-${Date.now()}`,
        type: 'engagement',
        title: 'High Comment Rate',
        description: `Your posts have a ${Math.round(commentRate)}% comment rate, indicating strong audience interaction.`,
        impact: 'high',
        confidence: 85,
        data: { commentRate, engagementTypes },
        recommendations: [
          'Respond to comments promptly to maintain engagement',
          'Ask questions in your captions to encourage comments',
          'Create content that sparks conversations',
        ],
        createdAt: new Date(),
      });
    }

    if (shareRate > 10) {
      insights.push({
        id: `shares-${Date.now()}`,
        type: 'engagement',
        title: 'Strong Share Performance',
        description: `Your posts have a ${Math.round(shareRate)}% share rate, showing high viral potential.`,
        impact: 'high',
        confidence: 80,
        data: { shareRate, engagementTypes },
        recommendations: [
          'Create more shareable content',
          'Include call-to-actions for sharing',
          'Leverage trending topics for shareable content',
        ],
        createdAt: new Date(),
      });
    }

    return insights;
  }

  private async analyzeGrowth(posts: any[]): Promise<Insight[]> {
    const insights: Insight[] = [];

    if (posts.length < 10) return insights;

    // Analyze growth trends
    const monthlyPosts = posts.reduce((acc, post) => {
      const month = new Date(post.createdAt).toISOString().slice(0, 7); // YYYY-MM
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const months = Object.keys(monthlyPosts).sort();
    if (months.length >= 2) {
      const recentGrowth = months.slice(-2);
      const growthRate = ((monthlyPosts[recentGrowth[1]] - monthlyPosts[recentGrowth[0]]) / monthlyPosts[recentGrowth[0]]) * 100;

      if (growthRate > 20) {
        insights.push({
          id: `growth-${Date.now()}`,
          type: 'growth',
          title: 'Strong Content Growth',
          description: `Your posting frequency increased by ${Math.round(growthRate)}% in the last month.`,
          impact: 'high',
          confidence: 90,
          data: { growthRate, monthlyPosts },
          recommendations: [
            'Maintain this posting momentum',
            'Consider diversifying content types',
            'Monitor engagement rates with increased frequency',
          ],
          createdAt: new Date(),
        });
      }
    }

    return insights;
  }

  private async storeInsights(userId: string, insights: Insight[]): Promise<void> {
    // Store insights in database for persistence
    // This would typically go to a dedicated insights table
    // For now, we'll just log them
    monitoring.info('Storing insights', { userId, count: insights.length });
  }

  async getInsights(userId: string): Promise<UserInsights | null> {
    try {
      // Check if we have recent insights
      const lastInsights = await this.getLastInsights(userId);
      
      if (lastInsights && new Date() < lastInsights.nextUpdate) {
        return lastInsights;
      }

      // Generate new insights
      return await this.generateInsights(userId);
    } catch (error) {
      monitoring.error('Failed to get insights', { userId, error: error instanceof Error ? error.message : String(error) });
      return null;
    }
  }

  private async getLastInsights(userId: string): Promise<UserInsights | null> {
    // This would typically query a database
    // For now, return null to always generate fresh insights
    return null;
  }
}

export const insightsGenerator = InsightsGenerator.getInstance(); 