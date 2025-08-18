// AI API Service Layer for CreatorFlow
// Handles all AI-related API calls with proper error handling and response processing

export interface AIAPIConfig {
  baseURL: string;
  apiKey: string;
  timeout: number;
  retryAttempts: number;
}

export interface AIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    model: string;
    tokens: number;
    latency: number;
    timestamp: string;
  };
}

export interface ContentOptimizationRequest {
  content: string;
  contentType: 'post' | 'story' | 'video' | 'article';
  platform: string;
  targetAudience: string;
  goals: string[];
  tone: string;
  language: string;
}

export interface ContentOptimizationResponse {
  optimizedContent: string;
  suggestions: string[];
  performancePrediction: {
    engagement: number;
    reach: number;
    viralPotential: number;
    confidence: number;
  };
  hashtags: string[];
  captions: string[];
  optimalPostingTime: string;
  platformSpecificTips: Record<string, string[]>;
}

export interface WorkflowExecutionRequest {
  workflowId: string;
  input: Record<string, any>;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timeout?: number;
}

export interface WorkflowExecutionResponse {
  executionId: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  result?: any;
  error?: string;
  metrics: {
    executionTime: number;
    success: boolean;
    performance: Record<string, number>;
  };
}

export interface PredictionRequest {
  content: string;
  contentType: string;
  platform: string;
  audience: string;
  historicalData?: Record<string, any>;
}

export interface PredictionResponse {
  predictions: {
    engagement: number;
    reach: number;
    clicks: number;
    shares: number;
    comments: number;
    conversion: number;
  };
  confidence: number;
  factors: Array<{
    name: string;
    impact: 'positive' | 'negative' | 'neutral';
    weight: number;
    description: string;
  }>;
  recommendations: string[];
  riskFactors: string[];
  opportunities: string[];
}

export interface AudienceAnalysisRequest {
  platform: string;
  audienceSegment: string;
  timeRange: string;
  metrics: string[];
}

export interface AudienceAnalysisResponse {
  behavior: {
    engagement: number;
    responseTime: number;
    sharing: number;
    conversion: number;
  };
  trends: {
    growth: number;
    activity: number;
    interests: string[];
    demographics: Record<string, any>;
  };
  recommendations: string[];
  contentSuggestions: string[];
}

export interface WorkflowOptimizationRequest {
  workflowId: string;
  performanceData: Record<string, any>;
  optimizationGoals: string[];
}

export interface WorkflowOptimizationResponse {
  optimizedWorkflow: Record<string, any>;
  improvements: Array<{
    type: string;
    description: string;
    expectedImpact: number;
    implementation: string;
  }>;
  performanceMetrics: Record<string, number>;
}

class AIAPIService {
  private config: AIAPIConfig;
  private baseURL: string;

  constructor(config: AIAPIConfig) {
    this.config = config;
    this.baseURL = config.baseURL;
  }

  // Generic API call method with error handling and retries
  private async makeAPICall<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<AIResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
        'X-API-Version': '2024-01-01',
        ...options.headers,
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data,
        metadata: {
          model: data.model || 'unknown',
          tokens: data.usage?.total_tokens || 0,
          latency: Date.now() - Date.now(), // Would be calculated from request start
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error(`AI API Error (${endpoint}):`, error);
      
      // Retry logic for transient errors
      if (retryCount < this.config.retryAttempts && this.isRetryableError(error)) {
        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.makeAPICall(endpoint, options, retryCount + 1);
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  private isRetryableError(error: any): boolean {
    if (error.name === 'AbortError') return false; // Timeout errors
    if (error.message?.includes('429')) return true; // Rate limit errors
    if (error.message?.includes('500')) return true; // Server errors
    if (error.message?.includes('502')) return true; // Bad gateway
    if (error.message?.includes('503')) return true; // Service unavailable
    return false;
  }

  // Content Optimization API
  async optimizeContent(request: ContentOptimizationRequest): Promise<AIResponse<ContentOptimizationResponse>> {
    try {
      return await this.makeAPICall<ContentOptimizationResponse>('/ai/optimize-content', {
        method: 'POST',
        body: JSON.stringify(request),
      });
    } catch (error) {
      // Fallback to mock data for testing
      console.log('AI API unavailable, using mock data for content optimization');
      return {
        success: true,
        data: {
          optimizedContent: request.content + " [AI Optimized]",
          suggestions: ["Use trending hashtags", "Add call-to-action", "Include relevant images"],
          performancePrediction: {
            engagement: 0.08 + Math.random() * 0.04,
            reach: 10000 + Math.random() * 10000,
            viralPotential: 0.2 + Math.random() * 0.3,
            confidence: 0.85 + Math.random() * 0.1
          },
          hashtags: ["#AI", "#ContentCreation", "#Innovation", "#CreatorFlow"],
          captions: ["🚀 AI-powered content optimization", "Transform your workflow with AI"],
          optimalPostingTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          platformSpecificTips: {
            instagram: ["Use carousel posts", "Add location tags"],
            twitter: ["Thread format", "Tag influencers"],
            linkedin: ["Professional tone", "Business value"]
          }
        },
        metadata: {
          model: 'mock-fallback',
          tokens: 0,
          latency: 100,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  // Content Performance Prediction API
  async predictContentPerformance(request: PredictionRequest): Promise<AIResponse<PredictionResponse>> {
    try {
      return await this.makeAPICall<PredictionResponse>('/ai/predict-performance', {
        method: 'POST',
        body: JSON.stringify(request),
      });
    } catch (error) {
      // Fallback to mock data for testing
      console.log('AI API unavailable, using mock data for content prediction');
      return {
        success: true,
        data: {
          predictions: {
            engagement: 0.08 + Math.random() * 0.04,
            reach: 10000 + Math.random() * 10000,
            clicks: 800 + Math.random() * 800,
            shares: 400 + Math.random() * 400,
            comments: 200 + Math.random() * 200,
            conversion: 0.02 + Math.random() * 0.02
          },
          confidence: 0.85 + Math.random() * 0.1,
          factors: [
            {
              name: "Content Quality",
              impact: "positive",
              weight: 0.8 + Math.random() * 0.2,
              description: "High-quality content with engaging elements"
            }
          ],
          recommendations: ["Post during peak hours", "Use trending hashtags", "Engage with audience"],
          riskFactors: ["Content may be too technical", "Competition from similar posts"],
          opportunities: ["High engagement potential", "Viral sharing opportunity"]
        },
        metadata: {
          model: 'mock-fallback',
          tokens: 0,
          latency: 100,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  // Audience Analysis API
  async analyzeAudience(request: AudienceAnalysisRequest): Promise<AIResponse<AudienceAnalysisResponse>> {
    return this.makeAPICall<AudienceAnalysisResponse>('/ai/audience-analysis', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Workflow Execution API
  async executeWorkflow(request: WorkflowExecutionRequest): Promise<AIResponse<WorkflowExecutionResponse>> {
    return this.makeAPICall<WorkflowExecutionResponse>('/ai/workflow/execute', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Workflow Optimization API
  async optimizeWorkflow(request: WorkflowOptimizationRequest): Promise<AIResponse<WorkflowOptimizationResponse>> {
    return this.makeAPICall<WorkflowOptimizationResponse>('/ai/workflow/optimize', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Batch Content Analysis API
  async analyzeBatchContent(contents: string[]): Promise<AIResponse<any[]>> {
    return this.makeAPICall<any[]>('/ai/batch-analyze', {
      method: 'POST',
      body: JSON.stringify({ contents }),
    });
  }

  // AI Insights Generation API
  async generateInsights(context: Record<string, any>): Promise<AIResponse<any>> {
    return this.makeAPICall<any>('/ai/generate-insights', {
      method: 'POST',
      body: JSON.stringify(context),
    });
  }

  // Real-time AI Monitoring API
  async getAIStatus(): Promise<AIResponse<any>> {
    return this.makeAPICall<any>('/ai/status', {
      method: 'GET',
    });
  }

  // AI Model Performance API
  async getModelPerformance(): Promise<AIResponse<any>> {
    return this.makeAPICall<any>('/ai/model-performance', {
      method: 'GET',
    });
  }
}

// Create and export the AI API service instance
export const aiAPIService = new AIAPIService({
  baseURL: process.env.NEXT_PUBLIC_AI_API_BASE_URL || 'https://api.creatorflow.ai',
  apiKey: process.env.NEXT_PUBLIC_AI_API_KEY || '',
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
});

// Export the class for testing or custom instances
export default AIAPIService;
