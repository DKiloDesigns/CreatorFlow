// Mock AI API Responses for Testing
// These responses simulate real AI API behavior when services are unavailable

import {
  ContentOptimizationResponse,
  PredictionResponse,
  AudienceAnalysisResponse,
  WorkflowExecutionResponse,
  WorkflowOptimizationResponse
} from './ai-api-service';

export const mockContentOptimizationResponse: ContentOptimizationResponse = {
  optimizedContent: "🚀 Just launched our new AI-powered content creation tool! It's revolutionizing how creators work with intelligent automation and predictive insights. Check it out and let me know what you think! #AI #ContentCreation #Innovation #CreatorFlow #FutureOfWork",
  suggestions: [
    "Add more specific benefits of the tool",
    "Include a call-to-action for engagement",
    "Use trending hashtags for better discoverability",
    "Consider adding user testimonials or social proof"
  ],
  performancePrediction: {
    engagement: 0.087,
    reach: 15420,
    viralPotential: 0.23,
    confidence: 0.89
  },
  hashtags: [
    "#AI", "#ContentCreation", "#Innovation", "#CreatorFlow", 
    "#FutureOfWork", "#Tech", "#Productivity", "#DigitalTransformation"
  ],
  captions: [
    "🚀 Game-changing AI tool for creators!",
    "The future of content creation is here",
    "Transform your workflow with AI intelligence"
  ],
  optimalPostingTime: "2024-01-15T18:30:00Z",
  platformSpecificTips: {
    instagram: [
      "Use carousel posts to showcase multiple features",
      "Add location tags for better local discovery",
      "Include relevant story highlights"
    ],
    twitter: [
      "Thread the benefits for better engagement",
      "Tag relevant influencers and thought leaders",
      "Use trending topics in your industry"
    ],
    linkedin: [
      "Focus on professional benefits and ROI",
      "Include industry-specific use cases",
      "Engage with relevant professional groups"
    ]
  }
};

export const mockPredictionResponse: PredictionResponse = {
  predictions: {
    engagement: 0.087,
    reach: 15420,
    clicks: 1234,
    shares: 567,
    comments: 234,
    conversion: 0.023
  },
  confidence: 0.89,
  factors: [
    {
      name: "Content Relevance",
      impact: "positive",
      weight: 0.85,
      description: "Content highly relevant to target audience"
    },
    {
      name: "Timing",
      impact: "positive",
      weight: 0.72,
      description: "Posted during peak engagement hours"
    },
    {
      name: "Hashtag Strategy",
      impact: "positive",
      weight: 0.68,
      description: "Well-researched and trending hashtags"
    },
    {
      name: "Content Length",
      impact: "neutral",
      weight: 0.45,
      description: "Optimal length for platform"
    },
    {
      name: "Visual Appeal",
      impact: "positive",
      weight: 0.78,
      description: "Engaging visual elements and formatting"
    }
  ],
  recommendations: [
    "Post during 6-8 PM local time for maximum engagement",
    "Include 2-3 trending hashtags in your industry",
    "Add a compelling call-to-action to increase clicks",
    "Consider creating a carousel post to showcase features",
    "Engage with comments within the first hour of posting"
  ],
  riskFactors: [
    "Content may be too technical for general audience",
    "Competition from similar announcements this week",
    "Potential algorithm changes affecting reach"
  ],
  opportunities: [
    "High engagement potential during current trending period",
    "Opportunity to establish thought leadership",
    "Potential for viral sharing in tech communities"
  ]
};

export const mockAudienceAnalysisResponse: AudienceAnalysisResponse = {
  behavior: {
    engagement: 0.087,
    responseTime: 2.3,
    sharing: 0.034,
    conversion: 0.023
  },
  trends: {
    growth: 0.156,
    activity: 0.234,
    interests: [
      "Artificial Intelligence",
      "Content Creation",
      "Productivity Tools",
      "Digital Marketing",
      "Technology Innovation",
      "Workflow Automation",
      "Social Media Strategy",
      "Business Growth"
    ],
    demographics: {
      ageGroups: {
        "18-24": 0.12,
        "25-34": 0.34,
        "35-44": 0.28,
        "45-54": 0.18,
        "55+": 0.08
      },
      locations: {
        "United States": 0.45,
        "United Kingdom": 0.18,
        "Canada": 0.12,
        "Australia": 0.08,
        "Other": 0.17
      },
      professions: {
        "Marketing": 0.32,
        "Technology": 0.28,
        "Creative": 0.18,
        "Business": 0.15,
        "Other": 0.07
      }
    }
  },
  recommendations: [
    "Focus on AI and automation content during weekdays",
    "Share productivity tips and case studies",
    "Create content around trending tech topics",
    "Engage with marketing and tech communities",
    "Post during 6-8 PM EST for maximum reach"
  ],
  contentSuggestions: [
    "AI workflow automation tutorials",
    "Productivity tool comparisons",
    "Industry trend analysis",
    "Success story case studies",
    "How-to guides for creators"
  ]
};

export const mockWorkflowExecutionResponse: WorkflowExecutionResponse = {
  executionId: "exec-2024-001-001",
  status: "completed",
  result: {
    workflowId: "test-workflow-001",
    executionSteps: [
      {
        step: "content_analysis",
        status: "completed",
        duration: 1200,
        result: "Content optimized for Instagram"
      },
      {
        step: "hashtag_generation",
        status: "completed",
        duration: 800,
        result: "Generated 8 relevant hashtags"
      },
      {
        step: "timing_optimization",
        status: "completed",
        duration: 600,
        result: "Optimal posting time: 6:30 PM EST"
      },
      {
        step: "platform_adaptation",
        status: "completed",
        duration: 1500,
        result: "Content adapted for multiple platforms"
      }
    ],
    totalContent: 1,
    platforms: ["instagram", "twitter", "linkedin"],
    estimatedReach: 15420
  },
  error: undefined,
  metrics: {
    executionTime: 4100,
    success: true,
    performance: {
      contentProcessing: 0.95,
      optimizationQuality: 0.89,
      platformAdaptation: 0.92,
      overallEfficiency: 0.91
    }
  }
};

export const mockWorkflowOptimizationResponse: WorkflowOptimizationResponse = {
  optimizedWorkflow: {
    id: "test-workflow-001",
    name: "Optimized Content Publishing Workflow",
    type: "publishing",
    priority: "high",
    steps: [
      {
        id: "step-1",
        name: "Content Analysis & Optimization",
        type: "ai_analysis",
        duration: 1200,
        dependencies: [],
        optimization: {
          enabled: true,
          targetMetrics: ["engagement", "reach"],
          aiModel: "gpt-4",
          confidence: 0.89
        }
      },
      {
        id: "step-2",
        name: "Multi-Platform Adaptation",
        type: "content_adaptation",
        duration: 1500,
        dependencies: ["step-1"],
        optimization: {
          enabled: true,
          platforms: ["instagram", "twitter", "linkedin"],
          adaptationRules: {
            instagram: "Visual-first, story highlights",
            twitter: "Thread format, trending topics",
            linkedin: "Professional tone, business value"
          }
        }
      },
      {
        id: "step-3",
        name: "Timing Optimization",
        type: "scheduling",
        duration: 600,
        dependencies: ["step-1"],
        optimization: {
          enabled: true,
          algorithm: "audience_behavior_ai",
          timezone: "auto_detect",
          bufferTime: 300
        }
      }
    ],
    performance: {
      successRate: 0.94,
      avgExecutionTime: 1.8,
      optimizationScore: 0.91,
      costEfficiency: 0.87
    }
  },
  improvements: [
    {
      type: "AI Model Upgrade",
      description: "Upgraded from GPT-3.5 to GPT-4 for better content optimization",
      expectedImpact: 0.15,
      implementation: "Update AI model configuration in workflow settings"
    },
    {
      type: "Parallel Processing",
      description: "Enable parallel execution of independent workflow steps",
      expectedImpact: 0.25,
      implementation: "Modify workflow engine to support parallel step execution"
    },
    {
      type: "Caching Strategy",
      description: "Implement intelligent caching for repeated content analysis",
      expectedImpact: 0.12,
      implementation: "Add Redis cache layer with TTL for analysis results"
    },
    {
      type: "Error Recovery",
      description: "Enhanced error handling and automatic retry mechanisms",
      expectedImpact: 0.08,
      implementation: "Add retry logic with exponential backoff for failed steps"
    }
  ],
  performanceMetrics: {
    currentEfficiency: 0.85,
    projectedEfficiency: 0.91,
    costReduction: 0.18,
    timeSavings: 0.25,
    qualityImprovement: 0.15
  }
};

export const mockBatchAnalysisResponse = [
  {
    content: "First content piece for analysis",
    analysis: {
      sentiment: "positive",
      topics: ["technology", "innovation", "productivity"],
      keywords: ["AI", "automation", "efficiency"],
      engagement: 0.076,
      reach: 8900
    }
  },
  {
    content: "Second content piece for analysis",
    analysis: {
      sentiment: "neutral",
      topics: ["business", "strategy", "growth"],
      keywords: ["business", "strategy", "growth"],
      engagement: 0.054,
      reach: 6700
    }
  },
  {
    content: "Third content piece for analysis",
    analysis: {
      sentiment: "positive",
      topics: ["marketing", "social media", "engagement"],
      keywords: ["marketing", "social", "engagement"],
      engagement: 0.092,
      reach: 12300
    }
  }
];

export const mockAIInsightsResponse = {
  insights: [
    {
      type: "audience_behavior",
      title: "Peak Engagement Times",
      description: "Your audience is most active between 6-8 PM EST on weekdays",
      confidence: 0.89,
      actionable: true,
      action: "Schedule posts during peak hours for maximum engagement"
    },
    {
      type: "content_performance",
      title: "Visual Content Outperforms",
      description: "Posts with images or videos receive 34% higher engagement",
      confidence: 0.92,
      actionable: true,
      action: "Increase visual content to 70% of your posts"
    },
    {
      type: "trend_opportunity",
      title: "AI Content Creation Trending",
      description: "AI-related content is trending with 156% increase in engagement",
      confidence: 0.78,
      actionable: true,
      action: "Create more AI-focused content while trend is hot"
    }
  ],
  recommendations: [
    "Focus on visual storytelling for better engagement",
    "Leverage trending AI topics for content creation",
    "Optimize posting schedule for peak audience activity",
    "Experiment with different content formats"
  ],
  trends: {
    industry: "Technology and AI",
    audience: "Growing interest in automation tools",
    content: "Visual and interactive content performing best"
  }
};

export const mockAIStatusResponse = {
  service: "healthy",
  models: {
    "gpt-4": "operational",
    "gpt-3.5-turbo": "operational",
    "claude-3": "operational",
    "gemini-pro": "operational"
  },
  performance: {
    responseTime: 1200,
    successRate: 0.98,
    uptime: 0.9995,
    lastMaintenance: "2024-01-10T00:00:00Z"
  },
  usage: {
    requestsToday: 15420,
    tokensUsed: 2345678,
    costToday: 45.67,
    rateLimit: "normal"
  },
  alerts: []
};

// Helper function to get mock response with delay simulation
export const getMockResponse = async <T>(
  response: T,
  delay: number = 1000
): Promise<T> => {
  await new Promise(resolve => setTimeout(resolve, delay));
  return response;
};

// Helper function to simulate API errors
export const simulateAPIError = async (
  errorMessage: string = "Mock API error for testing",
  delay: number = 500
): Promise<never> => {
  await new Promise(resolve => setTimeout(resolve, delay));
  throw new Error(errorMessage);
};
