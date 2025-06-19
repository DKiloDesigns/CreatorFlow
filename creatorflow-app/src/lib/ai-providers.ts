// AI Provider System for CreatorFlow
// Supports multiple AI services with different pricing models

export interface AIProvider {
  id: string;
  name: string;
  description: string;
  pricing: {
    model: 'free' | 'pay_per_use' | 'subscription' | 'credits';
    details: string;
    costPerRequest?: number;
    monthlyLimit?: number;
  };
  features: string[];
  setupRequired: boolean;
  apiKeyRequired: boolean;
  status: 'available' | 'beta' | 'coming_soon';
  icon: string;
  color: string;
}

export interface AIProviderConfig {
  provider: AIProvider;
  apiKey?: string;
  isActive: boolean;
  usageCount: number;
  monthlyUsage: number;
}

export const AI_PROVIDERS: AIProvider[] = [
  // FREE OPTIONS (No cost to users)
  {
    id: 'creatorflow_ai',
    name: 'CreatorFlow AI',
    description: 'Our own AI service with generous free tier',
    pricing: {
      model: 'credits',
      details: 'Free tier: 50 requests/month, then $0.01 per request',
      costPerRequest: 0.01,
      monthlyLimit: 50
    },
    features: [
      'Caption Generation',
      'Hashtag Suggestions', 
      'Content Ideas',
      'Posting Time Optimization'
    ],
    setupRequired: false,
    apiKeyRequired: false,
    status: 'available',
    icon: '🚀',
    color: 'bg-gradient-to-r from-purple-500 to-blue-500'
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    description: 'Free AI model with excellent performance',
    pricing: {
      model: 'free',
      details: 'Completely free with generous limits',
      costPerRequest: 0,
      monthlyLimit: 1000
    },
    features: [
      'High Quality Generation',
      'Fast Response Times',
      'Multilingual Support',
      'No API Key Required'
    ],
    setupRequired: false,
    apiKeyRequired: false,
    status: 'available',
    icon: '🔍',
    color: 'bg-gradient-to-r from-blue-600 to-indigo-600'
  },
  {
    id: 'local_ai',
    name: 'Local AI (Ollama)',
    description: 'Run AI locally on your device',
    pricing: {
      model: 'free',
      details: 'Completely free, runs on your computer',
      costPerRequest: 0
    },
    features: [
      '100% Private',
      'No Internet Required',
      'Unlimited Usage',
      'Customizable Models'
    ],
    setupRequired: true,
    apiKeyRequired: false,
    status: 'beta',
    icon: '🏠',
    color: 'bg-gradient-to-r from-gray-500 to-purple-500'
  },
  {
    id: 'huggingface_free',
    name: 'Hugging Face (Free)',
    description: 'Free open source AI models',
    pricing: {
      model: 'free',
      details: 'Free tier with community models',
      costPerRequest: 0,
      monthlyLimit: 500
    },
    features: [
      'Open Source Models',
      'Community Driven',
      'No Setup Required',
      'Cost Effective'
    ],
    setupRequired: false,
    apiKeyRequired: false,
    status: 'available',
    icon: '🤗',
    color: 'bg-gradient-to-r from-yellow-500 to-orange-500'
  },
  {
    id: 'perplexity',
    name: 'Perplexity AI',
    description: 'Free AI with web search capabilities',
    pricing: {
      model: 'free',
      details: 'Free tier available with daily limits',
      costPerRequest: 0,
      monthlyLimit: 100
    },
    features: [
      'Web Search Integration',
      'Real-time Information',
      'Fact-checking',
      'Trending Topics'
    ],
    setupRequired: false,
    apiKeyRequired: false,
    status: 'available',
    icon: '🔎',
    color: 'bg-gradient-to-r from-green-500 to-teal-500'
  },
  {
    id: 'cohere_free',
    name: 'Cohere (Free)',
    description: 'Free tier with good performance',
    pricing: {
      model: 'free',
      details: 'Free tier with monthly limits',
      costPerRequest: 0,
      monthlyLimit: 100
    },
    features: [
      'Good Quality Generation',
      'Easy Integration',
      'Developer Friendly',
      'Reliable Service'
    ],
    setupRequired: true,
    apiKeyRequired: true,
    status: 'available',
    icon: '⚡',
    color: 'bg-gradient-to-r from-purple-600 to-pink-600'
  },

  // LOW-COST OPTIONS (Under $0.01 per request)
  {
    id: 'google_ai',
    name: 'Google AI (Gemini)',
    description: 'Google\'s latest AI model',
    pricing: {
      model: 'pay_per_use',
      details: 'Very affordable: ~$0.001-0.01 per generation',
      costPerRequest: 0.002
    },
    features: [
      'Fast Generation',
      'Google Integration',
      'Multimodal Support',
      'Cost Effective'
    ],
    setupRequired: true,
    apiKeyRequired: true,
    status: 'available',
    icon: '🔍',
    color: 'bg-gradient-to-r from-blue-500 to-green-500'
  },
  {
    id: 'huggingface_pro',
    name: 'Hugging Face Pro',
    description: 'Premium open source models',
    pricing: {
      model: 'pay_per_use',
      details: 'Pay per request: ~$0.001-0.005 per generation',
      costPerRequest: 0.001
    },
    features: [
      'Premium Models',
      'Custom Fine-tuning',
      'Community Models',
      'Cost Effective'
    ],
    setupRequired: true,
    apiKeyRequired: true,
    status: 'available',
    icon: '🤗',
    color: 'bg-gradient-to-r from-yellow-500 to-orange-500'
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    description: 'Safe and helpful AI assistant',
    pricing: {
      model: 'pay_per_use',
      details: 'Pay per request: ~$0.003-0.015 per generation',
      costPerRequest: 0.004
    },
    features: [
      'Safe Content Generation',
      'Brand Voice Consistency',
      'Ethical AI Guidelines',
      'Long-form Content'
    ],
    setupRequired: true,
    apiKeyRequired: true,
    status: 'available',
    icon: '🧠',
    color: 'bg-gradient-to-r from-orange-500 to-red-500'
  },

  // PREMIUM OPTIONS (Higher cost, better quality)
  {
    id: 'openai',
    name: 'OpenAI GPT-4',
    description: 'Most advanced AI model',
    pricing: {
      model: 'pay_per_use',
      details: 'Premium quality: ~$0.002-0.02 per generation',
      costPerRequest: 0.005
    },
    features: [
      'Advanced Caption Generation',
      'Creative Content Ideas',
      'Multi-language Support',
      'Context-Aware Responses'
    ],
    setupRequired: true,
    apiKeyRequired: true,
    status: 'available',
    icon: '🤖',
    color: 'bg-gradient-to-r from-green-500 to-blue-500'
  },
  {
    id: 'openai_gpt35',
    name: 'OpenAI GPT-3.5',
    description: 'Fast and cost-effective GPT model',
    pricing: {
      model: 'pay_per_use',
      details: 'Fast and affordable: ~$0.001-0.005 per generation',
      costPerRequest: 0.002
    },
    features: [
      'Fast Generation',
      'Cost Effective',
      'Good Quality',
      'Wide Compatibility'
    ],
    setupRequired: true,
    apiKeyRequired: true,
    status: 'available',
    icon: '⚡',
    color: 'bg-gradient-to-r from-green-400 to-blue-400'
  },

  // COMING SOON
  {
    id: 'mistral',
    name: 'Mistral AI',
    description: 'European AI model with free tier',
    pricing: {
      model: 'free',
      details: 'Free tier available, paid for advanced features',
      costPerRequest: 0.001
    },
    features: [
      'European Privacy',
      'Free Tier Available',
      'Good Performance',
      'Multilingual'
    ],
    setupRequired: true,
    apiKeyRequired: true,
    status: 'coming_soon',
    icon: '🇪🇺',
    color: 'bg-gradient-to-r from-blue-600 to-yellow-500'
  },
  {
    id: 'claude_haiku',
    name: 'Claude Haiku',
    description: 'Fast and affordable Claude model',
    pricing: {
      model: 'pay_per_use',
      details: 'Fast and cheap: ~$0.001-0.003 per generation',
      costPerRequest: 0.001
    },
    features: [
      'Very Fast',
      'Very Cheap',
      'Good Quality',
      'Safe Content'
    ],
    setupRequired: true,
    apiKeyRequired: true,
    status: 'coming_soon',
    icon: '🌸',
    color: 'bg-gradient-to-r from-pink-400 to-purple-400'
  }
];

export interface AIRequest {
  provider: string;
  type: 'caption' | 'hashtags' | 'ideas' | 'scheduling';
  content?: string;
  platform?: string;
  tone?: string;
  industry?: string;
  targetAudience?: string;
}

export interface AIResponse {
  success: boolean;
  data: any;
  provider: string;
  cost?: number;
  creditsUsed?: number;
  error?: string;
}

class AIProviderManager {
  private providers: Map<string, AIProviderConfig> = new Map();
  private defaultProvider: string = 'creatorflow_ai';

  constructor() {
    // Initialize with CreatorFlow AI as default
    this.setProvider('creatorflow_ai', {
      provider: AI_PROVIDERS.find(p => p.id === 'creatorflow_ai')!,
      isActive: true,
      usageCount: 0,
      monthlyUsage: 0
    });
  }

  // Get all available providers
  getProviders(): AIProvider[] {
    return AI_PROVIDERS;
  }

  // Get active provider configuration
  getActiveProvider(): AIProviderConfig | null {
    for (const [id, config] of this.providers) {
      if (config.isActive) {
        return config;
      }
    }
    return null;
  }

  // Set provider configuration
  setProvider(providerId: string, config: Partial<AIProviderConfig>): void {
    const provider = AI_PROVIDERS.find(p => p.id === providerId);
    if (!provider) {
      throw new Error(`Provider ${providerId} not found`);
    }

    this.providers.set(providerId, {
      provider,
      isActive: false,
      usageCount: 0,
      monthlyUsage: 0,
      ...config
    });
  }

  // Activate a provider
  activateProvider(providerId: string): void {
    // Deactivate all other providers
    for (const [id, config] of this.providers) {
      config.isActive = false;
    }

    // Activate the selected provider
    const config = this.providers.get(providerId);
    if (config) {
      config.isActive = true;
    }
  }

  // Make AI request
  async makeRequest(request: AIRequest): Promise<AIResponse> {
    const activeProvider = this.getActiveProvider();
    if (!activeProvider) {
      throw new Error('No active AI provider');
    }

    const { provider } = activeProvider;

    try {
      let response: AIResponse;

      switch (provider.id) {
        case 'creatorflow_ai':
          response = await this.callCreatorFlowAI(request);
          break;
        case 'openai':
          response = await this.callOpenAI(request);
          break;
        case 'anthropic':
          response = await this.callAnthropic(request);
          break;
        case 'google_ai':
          response = await this.callGoogleAI(request);
          break;
        case 'local_ai':
          response = await this.callLocalAI(request);
          break;
        case 'huggingface':
          response = await this.callHuggingFace(request);
          break;
        default:
          throw new Error(`Unsupported provider: ${provider.id}`);
      }

      // Update usage statistics
      activeProvider.usageCount++;
      activeProvider.monthlyUsage++;

      return response;
    } catch (error) {
      console.error(`AI request failed for provider ${provider.id}:`, error);
      return {
        success: false,
        provider: provider.id,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // CreatorFlow AI implementation
  private async callCreatorFlowAI(request: AIRequest): Promise<AIResponse> {
    // This would call our own AI service
    // For now, return mock data
    const mockData = this.getMockResponse(request);
    
    return {
      success: true,
      provider: 'creatorflow_ai',
      data: mockData,
      cost: 0.01,
      creditsUsed: 1
    };
  }

  // OpenAI implementation
  private async callOpenAI(request: AIRequest): Promise<AIResponse> {
    const config = this.providers.get('openai');
    if (!config?.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Implementation would call OpenAI API
    const mockData = this.getMockResponse(request);
    
    return {
      success: true,
      provider: 'openai',
      data: mockData,
      cost: 0.005
    };
  }

  // Anthropic implementation
  private async callAnthropic(request: AIRequest): Promise<AIResponse> {
    const config = this.providers.get('anthropic');
    if (!config?.apiKey) {
      throw new Error('Anthropic API key not configured');
    }

    const mockData = this.getMockResponse(request);
    
    return {
      success: true,
      provider: 'anthropic',
      data: mockData,
      cost: 0.004
    };
  }

  // Google AI implementation
  private async callGoogleAI(request: AIRequest): Promise<AIResponse> {
    const config = this.providers.get('google_ai');
    if (!config?.apiKey) {
      throw new Error('Google AI API key not configured');
    }

    const mockData = this.getMockResponse(request);
    
    return {
      success: true,
      provider: 'google_ai',
      data: mockData,
      cost: 0.002
    };
  }

  // Local AI implementation
  private async callLocalAI(request: AIRequest): Promise<AIResponse> {
    // This would call a local Ollama instance
    const mockData = this.getMockResponse(request);
    
    return {
      success: true,
      provider: 'local_ai',
      data: mockData,
      cost: 0
    };
  }

  // Hugging Face implementation
  private async callHuggingFace(request: AIRequest): Promise<AIResponse> {
    const config = this.providers.get('huggingface');
    if (!config?.apiKey) {
      throw new Error('Hugging Face API key not configured');
    }

    const mockData = this.getMockResponse(request);
    
    return {
      success: true,
      provider: 'huggingface',
      data: mockData,
      cost: 0.001
    };
  }

  // Get mock response for development
  private getMockResponse(request: AIRequest): any {
    switch (request.type) {
      case 'caption':
        return [
          "Just dropped some serious knowledge bombs! 💣✨ What's your biggest takeaway?",
          "Behind the scenes of what we've been working on... Spoiler alert: it's going to be epic! 🚀",
          "Sometimes the best moments happen when you least expect them. Here's to embracing the unexpected! 🌟"
        ];
      case 'hashtags':
        return [
          { hashtag: '#socialmedia', relevance: 85, trending: true, reach: 500000 },
          { hashtag: '#contentcreator', relevance: 90, trending: false, reach: 300000 },
          { hashtag: '#digitalmarketing', relevance: 88, trending: true, reach: 400000 }
        ];
      case 'ideas':
        return [
          {
            title: 'Behind the Scenes',
            description: 'Show your daily workflow and creative process',
            platforms: ['Instagram', 'LinkedIn'],
            content_type: 'image',
            hashtags: ['#behindthescenes', '#workflow', '#process']
          }
        ];
      case 'scheduling':
        return [
          {
            platform: 'Instagram',
            best_times: ['9:00 AM', '1:00 PM', '7:00 PM'],
            timezone: 'UTC',
            reasoning: 'Based on Instagram engagement patterns'
          }
        ];
      default:
        return [];
    }
  }

  // Get usage statistics
  getUsageStats(): { totalRequests: number; monthlyRequests: number; estimatedCost: number } {
    let totalRequests = 0;
    let monthlyRequests = 0;
    let estimatedCost = 0;

    for (const [id, config] of this.providers) {
      totalRequests += config.usageCount;
      monthlyRequests += config.monthlyUsage;
      
      if (config.provider.pricing.costPerRequest) {
        estimatedCost += config.monthlyUsage * config.provider.pricing.costPerRequest;
      }
    }

    return { totalRequests, monthlyRequests, estimatedCost };
  }
}

// Export singleton instance
export const aiProviderManager = new AIProviderManager(); 