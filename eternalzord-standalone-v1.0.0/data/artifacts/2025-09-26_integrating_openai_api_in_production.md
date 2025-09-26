# Integrating OpenAI API in Production: Best Practices and Common Pitfalls

**A comprehensive guide to successfully integrating OpenAI API in production environments, featuring real-world implementation strategies from CreatorFlow's AI-powered features.**

*Published: September 26, 2025*
*Author: Darrell Mayberry*
*Tags: OpenAI API, AI Integration, Production, Error Handling, Rate Limiting, Cost Optimization*

## Introduction

Integrating OpenAI API in production requires careful consideration of rate limits, error handling, cost optimization, and user experience. In this comprehensive guide, we'll explore best practices for building robust, scalable AI-powered features using OpenAI API, drawing from our experience implementing CreatorFlow's content generation and optimization features.

## Table of Contents

1. [Understanding OpenAI API Fundamentals](#understanding-openai-api-fundamentals)
2. [Production-Ready API Integration](#production-ready-api-integration)
3. [Error Handling and Resilience](#error-handling-and-resilience)
4. [Rate Limiting and Throttling](#rate-limiting-and-throttling)
5. [Cost Optimization Strategies](#cost-optimization-strategies)
6. [Security and Privacy Considerations](#security-and-privacy-considerations)
7. [Performance Optimization](#performance-optimization)
8. [Monitoring and Analytics](#monitoring-and-analytics)
9. [Testing AI Features](#testing-ai-features)
10. [Deployment and Scaling](#deployment-and-scaling)

## Understanding OpenAI API Fundamentals

### API Structure and Endpoints

OpenAI provides several API endpoints for different use cases:

- **Chat Completions**: For conversational AI and text generation
- **Text Completions**: For simple text completion tasks
- **Embeddings**: For text similarity and search
- **Moderation**: For content filtering and safety
- **Fine-tuning**: For custom model training

### Key Concepts

```typescript
// Basic API structure
interface OpenAIConfig {
  apiKey: string;
  organization?: string;
  baseURL?: string;
  timeout?: number;
  maxRetries?: number;
}

interface ChatCompletionRequest {
  model: string;
  messages: Message[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string | string[];
  stream?: boolean;
}
```

## Production-Ready API Integration

### Robust API Client Implementation

```typescript
// lib/openai/client.ts
import OpenAI from 'openai';
import { z } from 'zod';

class OpenAIClient {
  private client: OpenAI;
  private rateLimiter: RateLimiter;
  private cache: Map<string, any>;

  constructor(config: OpenAIConfig) {
    this.client = new OpenAI({
      apiKey: config.apiKey,
      organization: config.organization,
      timeout: config.timeout || 30000,
    });
    
    this.rateLimiter = new RateLimiter({
      requestsPerMinute: 60,
      tokensPerMinute: 150000
    });
    
    this.cache = new Map();
  }

  async chatCompletion(
    request: ChatCompletionRequest,
    options?: {
      cache?: boolean;
      retries?: number;
      timeout?: number;
    }
  ): Promise<ChatCompletionResponse> {
    const cacheKey = this.generateCacheKey(request);
    
    // Check cache first
    if (options?.cache && this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Rate limiting
    await this.rateLimiter.waitForAvailability();

    try {
      const response = await this.client.chat.completions.create({
        ...request,
        stream: false
      });

      // Cache response if enabled
      if (options?.cache) {
        this.cache.set(cacheKey, response);
      }

      return response;
    } catch (error) {
      throw this.handleAPIError(error);
    }
  }

  private generateCacheKey(request: ChatCompletionRequest): string {
    return JSON.stringify({
      model: request.model,
      messages: request.messages,
      temperature: request.temperature,
      max_tokens: request.max_tokens
    });
  }

  private handleAPIError(error: any): Error {
    if (error.status === 429) {
      return new Error('Rate limit exceeded. Please try again later.');
    } else if (error.status === 401) {
      return new Error('Invalid API key. Please check your configuration.');
    } else if (error.status === 500) {
      return new Error('OpenAI service is temporarily unavailable.');
    } else {
      return new Error(`API error: ${error.message}`);
    }
  }
}
```

### Type-Safe API Wrapper

```typescript
// lib/openai/wrapper.ts
import { z } from 'zod';

// Input validation schemas
const MessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string().min(1).max(4000)
});

const ChatCompletionRequestSchema = z.object({
  model: z.string().default('gpt-3.5-turbo'),
  messages: z.array(MessageSchema).min(1).max(100),
  temperature: z.number().min(0).max(2).default(0.7),
  max_tokens: z.number().min(1).max(4000).default(1000),
  top_p: z.number().min(0).max(1).default(1),
  frequency_penalty: z.number().min(-2).max(2).default(0),
  presence_penalty: z.number().min(-2).max(2).default(0),
  stop: z.union([z.string(), z.array(z.string())]).optional(),
  stream: z.boolean().default(false)
});

export class TypeSafeOpenAI {
  private client: OpenAIClient;

  constructor(config: OpenAIConfig) {
    this.client = new OpenAIClient(config);
  }

  async generateContent(
    input: z.infer<typeof ChatCompletionRequestSchema>
  ): Promise<string> {
    // Validate input
    const validatedInput = ChatCompletionRequestSchema.parse(input);
    
    try {
      const response = await this.client.chatCompletion(validatedInput);
      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Content generation failed:', error);
      throw error;
    }
  }

  async generateWithSchema<T>(
    input: z.infer<typeof ChatCompletionRequestSchema>,
    outputSchema: z.ZodSchema<T>
  ): Promise<T> {
    const content = await this.generateContent(input);
    
    try {
      return outputSchema.parse(JSON.parse(content));
    } catch (error) {
      console.error('Schema validation failed:', error);
      throw new Error('Failed to parse AI response according to schema');
    }
  }
}
```

## Error Handling and Resilience

### Comprehensive Error Handling

```typescript
// lib/openai/error-handler.ts
export class OpenAIErrorHandler {
  private retryAttempts: number;
  private backoffMultiplier: number;
  private maxBackoffDelay: number;

  constructor(
    retryAttempts: number = 3,
    backoffMultiplier: number = 2,
    maxBackoffDelay: number = 30000
  ) {
    this.retryAttempts = retryAttempts;
    this.backoffMultiplier = backoffMultiplier;
    this.maxBackoffDelay = maxBackoffDelay;
  }

  async executeWithRetry<T>(
    operation: () => Promise<T>,
    context: string
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (!this.shouldRetry(error, attempt)) {
          throw this.transformError(error, context);
        }
        
        if (attempt < this.retryAttempts) {
          const delay = this.calculateBackoffDelay(attempt);
          console.warn(`${context} failed (attempt ${attempt}), retrying in ${delay}ms`);
          await this.sleep(delay);
        }
      }
    }
    
    throw this.transformError(lastError!, context);
  }

  private shouldRetry(error: any, attempt: number): boolean {
    if (attempt >= this.retryAttempts) return false;
    
    // Retry on rate limits and server errors
    if (error.status === 429 || error.status >= 500) return true;
    
    // Retry on network errors
    if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') return true;
    
    return false;
  }

  private calculateBackoffDelay(attempt: number): number {
    const delay = Math.min(
      1000 * Math.pow(this.backoffMultiplier, attempt - 1),
      this.maxBackoffDelay
    );
    
    // Add jitter to prevent thundering herd
    return delay + Math.random() * 1000;
  }

  private transformError(error: any, context: string): Error {
    const baseMessage = `${context} failed`;
    
    if (error.status === 429) {
      return new Error(`${baseMessage}: Rate limit exceeded`);
    } else if (error.status === 401) {
      return new Error(`${baseMessage}: Authentication failed`);
    } else if (error.status === 500) {
      return new Error(`${baseMessage}: OpenAI service unavailable`);
    } else if (error.code === 'ECONNRESET') {
      return new Error(`${baseMessage}: Network connection lost`);
    } else {
      return new Error(`${baseMessage}: ${error.message}`);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### Circuit Breaker Pattern

```typescript
// lib/openai/circuit-breaker.ts
export class CircuitBreaker {
  private failureCount: number = 0;
  private lastFailureTime: number = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  
  constructor(
    private failureThreshold: number = 5,
    private recoveryTimeout: number = 60000
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.recoveryTimeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }

  getState(): string {
    return this.state;
  }
}
```

## Rate Limiting and Throttling

### Advanced Rate Limiting

```typescript
// lib/openai/rate-limiter.ts
export class RateLimiter {
  private requestQueue: Array<() => Promise<void>> = [];
  private isProcessing: boolean = false;
  private requestCount: number = 0;
  private tokenCount: number = 0;
  private lastResetTime: number = Date.now();

  constructor(
    private requestsPerMinute: number = 60,
    private tokensPerMinute: number = 150000
  ) {}

  async waitForAvailability(): Promise<void> {
    return new Promise((resolve) => {
      this.requestQueue.push(resolve);
      this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.requestQueue.length > 0) {
      await this.waitForRateLimit();
      
      const nextRequest = this.requestQueue.shift();
      if (nextRequest) {
        nextRequest();
      }
    }

    this.isProcessing = false;
  }

  private async waitForRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceReset = now - this.lastResetTime;

    // Reset counters every minute
    if (timeSinceReset >= 60000) {
      this.requestCount = 0;
      this.tokenCount = 0;
      this.lastResetTime = now;
    }

    // Wait if we've hit rate limits
    if (this.requestCount >= this.requestsPerMinute) {
      const waitTime = 60000 - timeSinceReset;
      await this.sleep(waitTime);
      this.requestCount = 0;
      this.tokenCount = 0;
      this.lastResetTime = Date.now();
    }
  }

  recordRequest(tokens: number): void {
    this.requestCount++;
    this.tokenCount += tokens;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### Token-Based Rate Limiting

```typescript
// lib/openai/token-limiter.ts
export class TokenLimiter {
  private tokenUsage: Map<string, number> = new Map();
  private windowSize: number = 60000; // 1 minute

  constructor(private maxTokensPerMinute: number = 150000) {}

  async checkTokenLimit(userId: string, requestedTokens: number): Promise<boolean> {
    const now = Date.now();
    const windowStart = now - this.windowSize;
    
    // Clean up old entries
    for (const [key, timestamp] of this.tokenUsage.entries()) {
      if (timestamp < windowStart) {
        this.tokenUsage.delete(key);
      }
    }

    // Count current usage
    const currentUsage = Array.from(this.tokenUsage.values())
      .filter(timestamp => timestamp >= windowStart)
      .length;

    if (currentUsage + requestedTokens > this.maxTokensPerMinute) {
      return false;
    }

    // Record usage
    this.tokenUsage.set(`${userId}-${now}`, now);
    return true;
  }
}
```

## Cost Optimization Strategies

### Token Usage Optimization

```typescript
// lib/openai/optimizer.ts
export class TokenOptimizer {
  private static readonly MAX_TOKENS = 4000;
  private static readonly SAFETY_BUFFER = 100;

  static optimizePrompt(messages: Message[]): Message[] {
    const totalTokens = this.estimateTokens(messages);
    
    if (totalTokens <= this.MAX_TOKENS - this.SAFETY_BUFFER) {
      return messages;
    }

    return this.trimMessages(messages);
  }

  private static estimateTokens(messages: Message[]): number {
    return messages.reduce((total, message) => {
      return total + this.estimateMessageTokens(message);
    }, 0);
  }

  private static estimateMessageTokens(message: Message): number {
    // Rough estimation: 1 token ≈ 4 characters
    return Math.ceil(message.content.length / 4);
  }

  private static trimMessages(messages: Message[]): Message[] {
    const maxTokens = this.MAX_TOKENS - this.SAFETY_BUFFER;
    const optimized: Message[] = [];
    let currentTokens = 0;

    // Always keep system message
    if (messages[0]?.role === 'system') {
      optimized.push(messages[0]);
      currentTokens += this.estimateMessageTokens(messages[0]);
    }

    // Add messages from the end (most recent first)
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      const messageTokens = this.estimateMessageTokens(message);
      
      if (currentTokens + messageTokens <= maxTokens) {
        optimized.unshift(message);
        currentTokens += messageTokens;
      } else {
        break;
      }
    }

    return optimized;
  }
}
```

### Caching Strategy

```typescript
// lib/openai/cache.ts
export class OpenAICache {
  private cache: Map<string, CacheEntry> = new Map();
  private maxSize: number = 1000;
  private ttl: number = 3600000; // 1 hour

  constructor(maxSize: number = 1000, ttl: number = 3600000) {
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  get(key: string): string | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  set(key: string, value: string): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  private generateKey(request: ChatCompletionRequest): string {
    return JSON.stringify({
      model: request.model,
      messages: request.messages,
      temperature: request.temperature,
      max_tokens: request.max_tokens
    });
  }
}

interface CacheEntry {
  value: string;
  timestamp: number;
}
```

## Security and Privacy Considerations

### Input Sanitization

```typescript
// lib/openai/sanitizer.ts
export class InputSanitizer {
  static sanitizeInput(input: string): string {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }

  static validateInput(input: string): { valid: boolean; error?: string } {
    if (!input || input.trim().length === 0) {
      return { valid: false, error: 'Input cannot be empty' };
    }

    if (input.length > 10000) {
      return { valid: false, error: 'Input too long' };
    }

    if (this.containsMaliciousContent(input)) {
      return { valid: false, error: 'Input contains potentially harmful content' };
    }

    return { valid: true };
  }

  private static containsMaliciousContent(input: string): boolean {
    const maliciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /eval\s*\(/i,
      /document\./i,
      /window\./i
    ];

    return maliciousPatterns.some(pattern => pattern.test(input));
  }
}
```

### API Key Management

```typescript
// lib/openai/security.ts
export class APISecurity {
  static validateAPIKey(apiKey: string): boolean {
    if (!apiKey) return false;
    
    // OpenAI API keys start with 'sk-'
    if (!apiKey.startsWith('sk-')) return false;
    
    // Check length (OpenAI keys are typically 51 characters)
    if (apiKey.length !== 51) return false;
    
    return true;
  }

  static maskAPIKey(apiKey: string): string {
    if (!apiKey) return '';
    
    return apiKey.substring(0, 8) + '...' + apiKey.substring(apiKey.length - 4);
  }

  static rotateAPIKey(): string {
    // Implement API key rotation logic
    // This would typically involve:
    // 1. Generating a new key
    // 2. Updating the configuration
    // 3. Invalidating the old key
    throw new Error('API key rotation not implemented');
  }
}
```

## Performance Optimization

### Streaming Responses

```typescript
// lib/openai/streaming.ts
export class StreamingOpenAI {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async *streamChatCompletion(
    request: ChatCompletionRequest
  ): AsyncGenerator<string, void, unknown> {
    const stream = await this.client.chat.completions.create({
      ...request,
      stream: true
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield content;
      }
    }
  }
}

// Usage in API route
export async function POST(request: Request) {
  const { messages } = await request.json();
  
  const streaming = new StreamingOpenAI(process.env.OPENAI_API_KEY!);
  
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      
      try {
        for await (const chunk of streaming.streamChatCompletion({
          model: 'gpt-3.5-turbo',
          messages,
          stream: true
        })) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`));
        }
        
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  });
}
```

### Batch Processing

```typescript
// lib/openai/batch.ts
export class BatchProcessor {
  private batchSize: number;
  private batchTimeout: number;
  private batches: Map<string, BatchItem[]> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();

  constructor(batchSize: number = 10, batchTimeout: number = 1000) {
    this.batchSize = batchSize;
    this.batchTimeout = batchTimeout;
  }

  async process(item: BatchItem): Promise<string> {
    const batchKey = this.getBatchKey(item);
    
    if (!this.batches.has(batchKey)) {
      this.batches.set(batchKey, []);
    }

    const batch = this.batches.get(batchKey)!;
    batch.push(item);

    if (batch.length >= this.batchSize) {
      return this.processBatch(batchKey);
    } else {
      return this.scheduleBatch(batchKey);
    }
  }

  private async processBatch(batchKey: string): Promise<string> {
    const batch = this.batches.get(batchKey) || [];
    if (batch.length === 0) return '';

    // Clear timer
    const timer = this.timers.get(batchKey);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(batchKey);
    }

    // Process batch
    const results = await this.executeBatch(batch);
    
    // Resolve promises
    batch.forEach((item, index) => {
      item.resolve(results[index]);
    });

    // Clear batch
    this.batches.delete(batchKey);
    
    return results.join('\n');
  }

  private scheduleBatch(batchKey: string): Promise<string> {
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        this.processBatch(batchKey);
      }, this.batchTimeout);

      this.timers.set(batchKey, timer);
    });
  }
}

interface BatchItem {
  content: string;
  resolve: (value: string) => void;
}
```

## Monitoring and Analytics

### Usage Tracking

```typescript
// lib/openai/analytics.ts
export class OpenAIAnalytics {
  private metrics: Map<string, number> = new Map();
  private usage: Map<string, UsageData> = new Map();

  recordRequest(
    userId: string,
    model: string,
    tokens: number,
    cost: number
  ): void {
    const key = `${userId}-${model}`;
    
    if (!this.usage.has(key)) {
      this.usage.set(key, {
        requests: 0,
        tokens: 0,
        cost: 0
      });
    }

    const data = this.usage.get(key)!;
    data.requests++;
    data.tokens += tokens;
    data.cost += cost;

    this.usage.set(key, data);
  }

  getUsage(userId: string): UsageData | null {
    return this.usage.get(userId) || null;
  }

  getTotalUsage(): UsageData {
    const total: UsageData = {
      requests: 0,
      tokens: 0,
      cost: 0
    };

    for (const data of this.usage.values()) {
      total.requests += data.requests;
      total.tokens += data.tokens;
      total.cost += data.cost;
    }

    return total;
  }
}

interface UsageData {
  requests: number;
  tokens: number;
  cost: number;
}
```

### Error Monitoring

```typescript
// lib/openai/monitoring.ts
export class OpenAIMonitoring {
  private errorCounts: Map<string, number> = new Map();
  private responseTimes: number[] = [];

  recordError(error: Error, context: string): void {
    const key = `${error.name}-${context}`;
    const count = this.errorCounts.get(key) || 0;
    this.errorCounts.set(key, count + 1);

    // Send to monitoring service
    this.sendToMonitoringService({
      type: 'error',
      error: error.message,
      context,
      timestamp: new Date().toISOString()
    });
  }

  recordResponseTime(time: number): void {
    this.responseTimes.push(time);
    
    // Keep only last 100 response times
    if (this.responseTimes.length > 100) {
      this.responseTimes.shift();
    }
  }

  getAverageResponseTime(): number {
    if (this.responseTimes.length === 0) return 0;
    
    return this.responseTimes.reduce((sum, time) => sum + time, 0) / this.responseTimes.length;
  }

  getErrorRate(): number {
    const totalErrors = Array.from(this.errorCounts.values()).reduce((sum, count) => sum + count, 0);
    const totalRequests = this.responseTimes.length;
    
    return totalRequests > 0 ? totalErrors / totalRequests : 0;
  }

  private sendToMonitoringService(data: any): void {
    // Send to your monitoring service (e.g., Sentry, DataDog)
    console.log('Monitoring data:', data);
  }
}
```

## Testing AI Features

### Mock OpenAI API

```typescript
// __tests__/mocks/openai.ts
export class MockOpenAI {
  private responses: Map<string, string> = new Map();

  setResponse(prompt: string, response: string): void {
    this.responses.set(prompt, response);
  }

  async chatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    const prompt = request.messages.map(m => m.content).join('\n');
    const response = this.responses.get(prompt) || 'Mock response';
    
    return {
      choices: [{
        message: {
          role: 'assistant',
          content: response
        },
        finish_reason: 'stop'
      }],
      usage: {
        prompt_tokens: 10,
        completion_tokens: 20,
        total_tokens: 30
      }
    };
  }
}
```

### Integration Tests

```typescript
// __tests__/integration/openai.test.ts
import { OpenAIClient } from '@/lib/openai/client';

describe('OpenAI Integration', () => {
  let client: OpenAIClient;

  beforeEach(() => {
    client = new OpenAIClient({
      apiKey: process.env.OPENAI_API_KEY!
    });
  });

  test('should generate content successfully', async () => {
    const response = await client.chatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: 'Hello, world!' }
      ]
    });

    expect(response.choices[0].message.content).toBeDefined();
  });

  test('should handle rate limiting', async () => {
    // Mock rate limit error
    jest.spyOn(client, 'chatCompletion').mockRejectedValue({
      status: 429,
      message: 'Rate limit exceeded'
    });

    await expect(client.chatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Test' }]
    })).rejects.toThrow('Rate limit exceeded');
  });
});
```

## Deployment and Scaling

### Environment Configuration

```typescript
// lib/config/openai.ts
import { z } from 'zod';

const OpenAIConfigSchema = z.object({
  apiKey: z.string().min(1),
  organization: z.string().optional(),
  baseURL: z.string().url().optional(),
  timeout: z.number().min(1000).max(60000).default(30000),
  maxRetries: z.number().min(0).max(5).default(3),
  rateLimit: z.object({
    requestsPerMinute: z.number().min(1).default(60),
    tokensPerMinute: z.number().min(1).default(150000)
  })
});

export type OpenAIConfig = z.infer<typeof OpenAIConfigSchema>;

export function createOpenAIConfig(): OpenAIConfig {
  return OpenAIConfigSchema.parse({
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORGANIZATION,
    baseURL: process.env.OPENAI_BASE_URL,
    timeout: parseInt(process.env.OPENAI_TIMEOUT || '30000'),
    maxRetries: parseInt(process.env.OPENAI_MAX_RETRIES || '3'),
    rateLimit: {
      requestsPerMinute: parseInt(process.env.OPENAI_RPM || '60'),
      tokensPerMinute: parseInt(process.env.OPENAI_TPM || '150000')
    }
  });
}
```

### Production Deployment

```typescript
// app/api/ai/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { OpenAIClient } from '@/lib/openai/client';
import { createOpenAIConfig } from '@/lib/config/openai';
import { InputSanitizer } from '@/lib/openai/sanitizer';

const client = new OpenAIClient(createOpenAIConfig());

export async function POST(request: NextRequest) {
  try {
    const { prompt, model = 'gpt-3.5-turbo' } = await request.json();
    
    // Validate and sanitize input
    const validation = InputSanitizer.validateInput(prompt);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const sanitizedPrompt = InputSanitizer.sanitizeInput(prompt);
    
    // Generate content
    const response = await client.chatCompletion({
      model,
      messages: [
        { role: 'user', content: sanitizedPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    return NextResponse.json({
      content: response.choices[0].message.content
    });

  } catch (error) {
    console.error('AI generation failed:', error);
    
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
```

## Best Practices and Tips

### 1. Error Handling
- Implement comprehensive error handling with retries
- Use circuit breakers for resilience
- Log errors for debugging and monitoring

### 2. Rate Limiting
- Implement proper rate limiting
- Use token-based limiting for cost control
- Queue requests when limits are reached

### 3. Cost Optimization
- Cache responses when appropriate
- Optimize prompts to reduce token usage
- Monitor usage and costs regularly

### 4. Security
- Sanitize all inputs
- Validate API keys
- Implement proper access controls

### 5. Performance
- Use streaming for long responses
- Implement batch processing
- Monitor response times

## Conclusion

Integrating OpenAI API in production requires careful consideration of error handling, rate limiting, cost optimization, and security. By following the patterns and practices outlined in this guide, you can build robust, scalable AI-powered features that provide excellent user experiences while maintaining cost efficiency and security.

The key to success is implementing comprehensive error handling, proper rate limiting, and monitoring systems that allow you to scale your AI features effectively. With the right approach, OpenAI API can transform your application into a powerful AI-powered platform.

---

**Ready to integrate OpenAI API in your production application? Start with the basic patterns and gradually implement advanced features as your needs grow.**
