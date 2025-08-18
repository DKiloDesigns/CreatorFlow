# AI API Integration Guide

This document provides comprehensive information about integrating real AI APIs with CreatorFlow's AI features.

## Overview

CreatorFlow now includes a complete AI API service layer that integrates with external AI services for:
- Content optimization and performance prediction
- Audience analysis and behavior prediction
- AI workflow automation and optimization
- Real-time AI insights generation

## Setup

### 1. Environment Variables

Add the following environment variables to your `.env` file:

```bash
# AI API Configuration
NEXT_PUBLIC_AI_API_BASE_URL=https://api.creatorflow.ai
NEXT_PUBLIC_AI_API_KEY=your_ai_api_key_here

# Optional: Custom AI Service URLs
NEXT_PUBLIC_OPENAI_API_URL=https://api.openai.com/v1
NEXT_PUBLIC_ANTHROPIC_API_URL=https://api.anthropic.com
NEXT_PUBLIC_GOOGLE_AI_API_URL=https://generativelanguage.googleapis.com
```

### 2. API Service Configuration

The AI API service is configured in `src/lib/ai-api-service.ts`:

```typescript
export const aiAPIService = new AIAPIService({
  baseURL: process.env.NEXT_PUBLIC_AI_API_BASE_URL || 'https://api.creatorflow.ai',
  apiKey: process.env.NEXT_PUBLIC_AI_API_KEY || '',
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
});
```

## API Endpoints

### Content Optimization

**Endpoint:** `POST /ai/optimize-content`

**Request:**
```typescript
interface ContentOptimizationRequest {
  content: string;
  contentType: 'post' | 'story' | 'video' | 'article';
  platform: string;
  targetAudience: string;
  goals: string[];
  tone: string;
  language: string;
}
```

**Response:**
```typescript
interface ContentOptimizationResponse {
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
```

### Content Performance Prediction

**Endpoint:** `POST /ai/predict-performance`

**Request:**
```typescript
interface PredictionRequest {
  content: string;
  contentType: string;
  platform: string;
  audience: string;
  historicalData?: Record<string, any>;
}
```

**Response:**
```typescript
interface PredictionResponse {
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
```

### Audience Analysis

**Endpoint:** `POST /ai/audience-analysis`

**Request:**
```typescript
interface AudienceAnalysisRequest {
  platform: string;
  audienceSegment: string;
  timeRange: string;
  metrics: string[];
}
```

**Response:**
```typescript
interface AudienceAnalysisResponse {
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
```

### Workflow Execution

**Endpoint:** `POST /ai/workflow/execute`

**Request:**
```typescript
interface WorkflowExecutionRequest {
  workflowId: string;
  input: Record<string, any>;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timeout?: number;
}
```

**Response:**
```typescript
interface WorkflowExecutionResponse {
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
```

### Workflow Optimization

**Endpoint:** `POST /ai/workflow/optimize`

**Request:**
```typescript
interface WorkflowOptimizationRequest {
  workflowId: string;
  performanceData: Record<string, any>;
  optimizationGoals: string[];
}
```

**Response:**
```typescript
interface WorkflowOptimizationResponse {
  optimizedWorkflow: Record<string, any>;
  improvements: Array<{
    type: string;
    description: string;
    expectedImpact: number;
    implementation: string;
  }>;
  performanceMetrics: Record<string, number>;
}
```

## React Hooks

### useContentOptimization

```typescript
import { useContentOptimization } from '@/hooks/use-ai-api';

function MyComponent() {
  const { data, loading, error, success, execute, reset, retry } = useContentOptimization();

  const handleOptimize = async () => {
    await execute({
      content: "Your content here",
      contentType: "post",
      platform: "instagram",
      targetAudience: "tech professionals",
      goals: ["engagement", "reach"],
      tone: "professional",
      language: "en"
    });
  };

  return (
    <div>
      {loading && <div>Optimizing content...</div>}
      {error && <div>Error: {error}</div>}
      {success && data && (
        <div>
          <h3>Optimized Content:</h3>
          <p>{data.optimizedContent}</p>
        </div>
      )}
      <button onClick={handleOptimize}>Optimize Content</button>
    </div>
  );
}
```

### useContentPrediction

```typescript
import { useContentPrediction } from '@/hooks/use-ai-api';

function MyComponent() {
  const { data, loading, error, success, execute, reset, retry } = useContentPrediction();

  const handlePredict = async () => {
    await execute({
      content: "Your content here",
      contentType: "post",
      platform: "instagram",
      audience: "tech professionals"
    });
  };

  return (
    <div>
      {loading && <div>Generating prediction...</div>}
      {error && <div>Error: {error}</div>}
      {success && data && (
        <div>
          <h3>Predicted Performance:</h3>
          <p>Engagement: {(data.predictions.engagement * 100).toFixed(1)}%</p>
          <p>Reach: {data.predictions.reach.toLocaleString()}</p>
        </div>
      )}
      <button onClick={handlePredict}>Predict Performance</button>
    </div>
  );
}
```

### useWorkflowExecution

```typescript
import { useWorkflowExecution } from '@/hooks/use-ai-api';

function MyComponent() {
  const { data, loading, error, success, execute, reset, retry } = useWorkflowExecution();

  const handleExecute = async () => {
    await execute({
      workflowId: "workflow-123",
      input: { action: "publish", content: "Hello world" },
      priority: "high",
      timeout: 30000
    });
  };

  return (
    <div>
      {loading && <div>Executing workflow...</div>}
      {error && <div>Error: {error}</div>}
      {success && data && (
        <div>
          <h3>Workflow Status: {data.status}</h3>
          <p>Execution ID: {data.executionId}</p>
        </div>
      )}
      <button onClick={handleExecute}>Execute Workflow</button>
    </div>
  );
}
```

## Error Handling

The AI API service includes comprehensive error handling:

### Retry Logic

- Automatic retry for transient errors (429, 500, 502, 503)
- Exponential backoff strategy
- Configurable retry attempts (default: 3)

### Error Types

```typescript
interface AIResponse<T = any> {
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
```

### Common Error Scenarios

1. **API Key Invalid**
   - Check your `NEXT_PUBLIC_AI_API_KEY` environment variable
   - Verify the API key is active and has proper permissions

2. **Rate Limiting (429)**
   - The service will automatically retry with exponential backoff
   - Consider implementing request queuing for high-volume applications

3. **Service Unavailable (503)**
   - Check the AI service status
   - Implement fallback to mock data or cached responses

4. **Timeout Errors**
   - Increase the timeout value in the service configuration
   - Consider implementing async processing for long-running operations

## Performance Optimization

### Caching

Implement caching for frequently requested predictions:

```typescript
import { useMemo } from 'react';

function MyComponent() {
  const { data, execute } = useContentPrediction();
  
  const cachedPrediction = useMemo(() => {
    if (data && Date.now() - new Date(data.metadata.timestamp).getTime() < 300000) {
      return data; // Cache for 5 minutes
    }
    return null;
  }, [data]);

  // Use cachedPrediction when available
}
```

### Batch Processing

Use batch endpoints for multiple content pieces:

```typescript
import { useBatchContentAnalysis } from '@/hooks/use-ai-api';

function MyComponent() {
  const { execute } = useBatchContentAnalysis();

  const handleBatchAnalyze = async (contents: string[]) => {
    await execute(contents);
  };
}
```

### Real-time Updates

Implement WebSocket connections for real-time AI insights:

```typescript
import { useEffect } from 'react';
import { useAIStatus } from '@/hooks/use-ai-api';

function MyComponent() {
  const { execute } = useAIStatus();

  useEffect(() => {
    const interval = setInterval(() => {
      execute(); // Check AI status every 30 seconds
    }, 30000);

    return () => clearInterval(interval);
  }, [execute]);
}
```

## Testing

### Mock Data Fallback

When the AI API is unavailable, the system falls back to mock data:

```typescript
// In your component
const { data, loading, error } = useContentOptimization();

// Show mock data if API fails
const displayData = data || mockData;
```

### API Testing

Test your API integration:

```typescript
// Test API connectivity
const testAPI = async () => {
  try {
    const response = await aiAPIService.getAIStatus();
    console.log('API Status:', response);
  } catch (error) {
    console.error('API Test Failed:', error);
  }
};
```

## Monitoring and Analytics

### API Metrics

Track API performance:

```typescript
interface APIMetrics {
  totalRequests: number;
  successRate: number;
  averageLatency: number;
  errorCount: number;
  lastRequest: Date;
}
```

### Health Checks

Implement health checks for the AI service:

```typescript
const checkAIServiceHealth = async () => {
  const status = await aiAPIService.getAIStatus();
  const modelPerformance = await aiAPIService.getModelPerformance();
  
  return {
    serviceStatus: status.success ? 'healthy' : 'unhealthy',
    modelPerformance: modelPerformance.success ? 'optimal' : 'degraded'
  };
};
```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure your AI API service allows requests from your domain
   - Check browser console for CORS-related errors

2. **Authentication Failures**
   - Verify API key format and permissions
   - Check if the API key has expired

3. **Network Timeouts**
   - Increase timeout values for slow connections
   - Implement connection pooling for better performance

4. **Rate Limiting**
   - Implement request queuing
   - Use batch endpoints when possible

### Debug Mode

Enable debug mode for detailed logging:

```typescript
// In development
if (process.env.NODE_ENV === 'development') {
  console.log('AI API Request:', request);
  console.log('AI API Response:', response);
}
```

## Security Considerations

### API Key Management

- Never expose API keys in client-side code
- Use environment variables for sensitive configuration
- Implement API key rotation

### Request Validation

- Validate all input data before sending to AI services
- Implement rate limiting on your end
- Sanitize AI responses before displaying

### Data Privacy

- Ensure AI services comply with data privacy regulations
- Implement data retention policies
- Provide user consent for AI processing

## Support

For technical support with AI API integration:

1. Check the error logs in your browser console
2. Verify your environment variables are set correctly
3. Test API connectivity using the health check endpoints
4. Review the API documentation for your specific AI service

## Future Enhancements

Planned improvements for the AI API integration:

- **Streaming Responses**: Real-time AI insights and predictions
- **Advanced Caching**: Intelligent caching with TTL and invalidation
- **Load Balancing**: Multiple AI service endpoints for redundancy
- **A/B Testing**: Compare different AI models and configurations
- **Custom Models**: Train and deploy custom AI models for specific use cases
