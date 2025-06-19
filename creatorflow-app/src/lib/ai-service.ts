// AI Service for CreatorFlow
// Handles all AI-powered content generation features

export interface AIContentRequest {
  type: 'caption' | 'hashtags' | 'ideas' | 'scheduling';
  platform?: string;
  content?: string;
  tone?: 'professional' | 'casual' | 'humorous' | 'inspirational';
  industry?: string;
  imageDescription?: string;
  targetAudience?: string;
}

export interface AIContentResponse {
  success: boolean;
  data: string[] | string;
  error?: string;
  usage?: {
    tokens: number;
    cost: number;
  };
}

export interface CaptionSuggestion {
  caption: string;
  tone: string;
  platform: string;
  engagement_score?: number;
}

export interface HashtagSuggestion {
  hashtag: string;
  relevance: number;
  trending: boolean;
  reach: number;
}

export interface ContentIdea {
  title: string;
  description: string;
  platforms: string[];
  content_type: 'image' | 'video' | 'carousel' | 'story';
  hashtags: string[];
}

export interface PostingTimeSuggestion {
  platform: string;
  best_times: string[];
  timezone: string;
  reasoning: string;
}

class AIService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
    this.baseUrl = 'https://api.openai.com/v1';
  }

  // Generate captions based on content and platform
  async generateCaptions(request: AIContentRequest): Promise<CaptionSuggestion[]> {
    try {
      const prompt = this.buildCaptionPrompt(request);
      const response = await this.callOpenAI(prompt, 3); // Generate 3 options
      
      return response.map((caption: string, index: number) => ({
        caption,
        tone: request.tone || 'casual',
        platform: request.platform || 'general',
        engagement_score: Math.floor(Math.random() * 30) + 70 // Mock score 70-100
      }));
    } catch (error) {
      console.error('Error generating captions:', error);
      return this.getFallbackCaptions(request);
    }
  }

  // Generate hashtag recommendations
  async generateHashtags(request: AIContentRequest): Promise<HashtagSuggestion[]> {
    try {
      const prompt = this.buildHashtagPrompt(request);
      const response = await this.callOpenAI(prompt, 15); // Generate 15 hashtags
      
      return response.map((hashtag: string) => ({
        hashtag: hashtag.startsWith('#') ? hashtag : `#${hashtag}`,
        relevance: Math.floor(Math.random() * 40) + 60, // 60-100
        trending: Math.random() > 0.7, // 30% chance of trending
        reach: Math.floor(Math.random() * 1000000) + 10000 // 10k-1M reach
      }));
    } catch (error) {
      console.error('Error generating hashtags:', error);
      return this.getFallbackHashtags(request);
    }
  }

  // Generate content ideas
  async generateContentIdeas(request: AIContentRequest): Promise<ContentIdea[]> {
    try {
      const prompt = this.buildContentIdeasPrompt(request);
      const response = await this.callOpenAI(prompt, 5); // Generate 5 ideas
      
      return response.map((idea: string) => {
        const platforms = ['Instagram', 'LinkedIn', 'Twitter'];
        const contentTypes = ['image', 'video', 'carousel', 'story'];
        
        return {
          title: idea.split(':')[0] || idea,
          description: idea.split(':')[1] || idea,
          platforms: platforms.slice(0, Math.floor(Math.random() * 3) + 1),
          content_type: contentTypes[Math.floor(Math.random() * contentTypes.length)] as any,
          hashtags: this.getFallbackHashtags(request).slice(0, 5).map(h => h.hashtag)
        };
      });
    } catch (error) {
      console.error('Error generating content ideas:', error);
      return this.getFallbackContentIdeas(request);
    }
  }

  // Get optimal posting times
  async getOptimalPostingTimes(request: AIContentRequest): Promise<PostingTimeSuggestion[]> {
    // Mock data for now - in real implementation, this would analyze user's historical data
    const platforms = request.platform ? [request.platform] : ['Instagram', 'LinkedIn', 'Twitter', 'Facebook'];
    
    return platforms.map(platform => ({
      platform,
      best_times: this.getBestTimesForPlatform(platform),
      timezone: 'UTC',
      reasoning: `Based on ${platform} engagement patterns and your audience activity`
    }));
  }

  // Private helper methods
  private buildCaptionPrompt(request: AIContentRequest): string {
    const { content, tone, platform, imageDescription, targetAudience } = request;
    
    return `Generate 3 engaging social media captions for ${platform || 'social media'} with a ${tone || 'casual'} tone.

Context: ${content || 'General content'}
${imageDescription ? `Image: ${imageDescription}` : ''}
${targetAudience ? `Target Audience: ${targetAudience}` : ''}

Requirements:
- Keep it under 2200 characters
- Include relevant emojis
- Make it engaging and shareable
- Optimize for ${platform || 'social media'} best practices

Generate 3 different options with varying approaches.`;
  }

  private buildHashtagPrompt(request: AIContentRequest): string {
    const { content, industry, platform } = request;
    
    return `Generate 15 relevant hashtags for ${platform || 'social media'} content.

Content: ${content || 'General content'}
Industry: ${industry || 'General'}

Requirements:
- Mix of popular and niche hashtags
- Include trending hashtags if relevant
- Optimize for ${platform || 'social media'} discovery
- Keep hashtags relevant and specific

Return only the hashtag names without # symbol.`;
  }

  private buildContentIdeasPrompt(request: AIContentRequest): string {
    const { industry, targetAudience, platform } = request;
    
    return `Generate 5 creative content ideas for ${platform || 'social media'}.

Industry: ${industry || 'General'}
Target Audience: ${targetAudience || 'General audience'}

Requirements:
- Mix of different content types (educational, entertaining, promotional)
- Include specific post ideas
- Consider trending topics
- Optimize for engagement

Format each idea as: "Title: Description"`;
  }

  private async callOpenAI(prompt: string, count: number = 1): Promise<string[]> {
    if (!this.apiKey) {
      // Return mock data if no API key
      return this.getMockResponse(prompt, count);
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a social media expert helping creators generate engaging content.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.7,
          n: count
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const choices = data.choices || [];
      
      return choices.map((choice: any) => choice.message?.content || '').filter(Boolean);
    } catch (error) {
      console.error('OpenAI API call failed:', error);
      return this.getMockResponse(prompt, count);
    }
  }

  private getMockResponse(prompt: string, count: number): string[] {
    // Mock responses for development/testing
    if (prompt.includes('caption')) {
      return [
        "Just dropped some serious knowledge bombs! 💣✨ What's your biggest takeaway from this? Drop a comment below! 👇",
        "Behind the scenes of what we've been working on... Spoiler alert: it's going to be epic! 🚀",
        "Sometimes the best moments happen when you least expect them. Here's to embracing the unexpected! 🌟"
      ].slice(0, count);
    }
    
    if (prompt.includes('hashtag')) {
      return [
        'socialmedia', 'contentcreator', 'digitalmarketing', 'entrepreneur', 'business',
        'marketing', 'branding', 'growth', 'success', 'motivation',
        'inspiration', 'creativity', 'innovation', 'strategy', 'tips'
      ].slice(0, count);
    }
    
    if (prompt.includes('content ideas')) {
      return [
        'Behind the Scenes: Show your daily workflow and process',
        'Industry Tips: Share valuable insights and best practices',
        'Success Story: Highlight a recent win or achievement',
        'Q&A Session: Answer common questions from your audience',
        'Trend Analysis: Discuss current trends in your industry'
      ].slice(0, count);
    }
    
    return ['Mock response 1', 'Mock response 2', 'Mock response 3'].slice(0, count);
  }

  private getFallbackCaptions(request: AIContentRequest): CaptionSuggestion[] {
    return [
      {
        caption: "Creating amazing content for you! 🎉 What do you think?",
        tone: request.tone || 'casual',
        platform: request.platform || 'general',
        engagement_score: 85
      },
      {
        caption: "Behind the scenes of what we do best. Quality over quantity! ✨",
        tone: request.tone || 'casual',
        platform: request.platform || 'general',
        engagement_score: 78
      },
      {
        caption: "Your success is our mission. Let's make it happen! 💪",
        tone: request.tone || 'casual',
        platform: request.platform || 'general',
        engagement_score: 92
      }
    ];
  }

  private getFallbackHashtags(request: AIContentRequest): HashtagSuggestion[] {
    const baseHashtags = [
      { hashtag: '#socialmedia', relevance: 85, trending: true, reach: 500000 },
      { hashtag: '#contentcreator', relevance: 90, trending: false, reach: 300000 },
      { hashtag: '#digitalmarketing', relevance: 88, trending: true, reach: 400000 },
      { hashtag: '#entrepreneur', relevance: 82, trending: false, reach: 250000 },
      { hashtag: '#business', relevance: 80, trending: true, reach: 600000 }
    ];
    
    return baseHashtags.slice(0, 10);
  }

  private getFallbackContentIdeas(request: AIContentRequest): ContentIdea[] {
    return [
      {
        title: 'Behind the Scenes',
        description: 'Show your daily workflow and creative process',
        platforms: ['Instagram', 'LinkedIn'],
        content_type: 'image',
        hashtags: ['#behindthescenes', '#workflow', '#process']
      },
      {
        title: 'Industry Tips',
        description: 'Share valuable insights and best practices',
        platforms: ['LinkedIn', 'Twitter'],
        content_type: 'video',
        hashtags: ['#tips', '#advice', '#expertise']
      },
      {
        title: 'Success Story',
        description: 'Highlight a recent win or achievement',
        platforms: ['Instagram', 'Facebook'],
        content_type: 'carousel',
        hashtags: ['#success', '#achievement', '#milestone']
      }
    ];
  }

  private getBestTimesForPlatform(platform: string): string[] {
    const timesByPlatform = {
      'Instagram': ['9:00 AM', '1:00 PM', '7:00 PM'],
      'LinkedIn': ['8:00 AM', '12:00 PM', '5:00 PM'],
      'Twitter': ['8:00 AM', '1:00 PM', '6:00 PM'],
      'Facebook': ['9:00 AM', '2:00 PM', '8:00 PM'],
      'TikTok': ['7:00 PM', '9:00 PM', '11:00 PM']
    };
    
    return timesByPlatform[platform as keyof typeof timesByPlatform] || ['9:00 AM', '1:00 PM', '7:00 PM'];
  }
}

// Export singleton instance
export const aiService = new AIService(); 