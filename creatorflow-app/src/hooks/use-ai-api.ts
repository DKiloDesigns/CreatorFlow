// AI API Hooks for CreatorFlow
// Provides easy access to AI API services with proper state management

import { useState, useCallback, useRef } from 'react';
import { 
  aiAPIService, 
  AIResponse, 
  ContentOptimizationRequest, 
  ContentOptimizationResponse,
  PredictionRequest,
  PredictionResponse,
  AudienceAnalysisRequest,
  AudienceAnalysisResponse,
  WorkflowExecutionRequest,
  WorkflowExecutionResponse,
  WorkflowOptimizationRequest,
  WorkflowOptimizationResponse
} from '@/lib/ai-api-service';

// Base hook state interface
interface UseAIAPIState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

// Base hook return interface
interface UseAIAPIResult<T> extends UseAIAPIState<T> {
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
  retry: () => Promise<void>;
}

// Content Optimization Hook
export function useContentOptimization() {
  const [state, setState] = useState<UseAIAPIState<ContentOptimizationResponse>>({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  const lastRequest = useRef<ContentOptimizationRequest | null>(null);

  const execute = useCallback(async (request: ContentOptimizationRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null, success: false }));
    lastRequest.current = request;

    try {
      const response = await aiAPIService.optimizeContent(request);
      
      if (response.success && response.data) {
        setState({
          data: response.data,
          loading: false,
          error: null,
          success: true,
        });
      } else {
        setState({
          data: null,
          loading: false,
          error: response.error || 'Content optimization failed',
          success: false,
        });
      }
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        success: false,
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      success: false,
    });
  }, []);

  const retry = useCallback(async () => {
    if (lastRequest.current) {
      await execute(lastRequest.current);
    }
  }, [execute]);

  return {
    ...state,
    execute,
    reset,
    retry,
  };
}

// Content Performance Prediction Hook
export function useContentPrediction() {
  const [state, setState] = useState<UseAIAPIState<PredictionResponse>>({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  const lastRequest = useRef<PredictionRequest | null>(null);

  const execute = useCallback(async (request: PredictionRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null, success: false }));
    lastRequest.current = request;

    try {
      const response = await aiAPIService.predictContentPerformance(request);
      
      if (response.success && response.data) {
        setState({
          data: response.data,
          loading: false,
          error: null,
          success: true,
        });
      } else {
        setState({
          data: null,
          loading: false,
          error: response.error || 'Performance prediction failed',
          success: false,
        });
      }
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        success: false,
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      success: false,
    });
  }, []);

  const retry = useCallback(async () => {
    if (lastRequest.current) {
      await execute(lastRequest.current);
    }
  }, [execute]);

  return {
    ...state,
    execute,
    reset,
    retry,
  };
}

// Audience Analysis Hook
export function useAudienceAnalysis() {
  const [state, setState] = useState<UseAIAPIState<AudienceAnalysisResponse>>({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  const lastRequest = useRef<AudienceAnalysisRequest | null>(null);

  const execute = useCallback(async (request: AudienceAnalysisRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null, success: false }));
    lastRequest.current = request;

    try {
      const response = await aiAPIService.analyzeAudience(request);
      
      if (response.success && response.data) {
        setState({
          data: response.data,
          loading: false,
          error: null,
          success: true,
        });
      } else {
        setState({
          data: null,
          loading: false,
          error: response.error || 'Audience analysis failed',
          success: false,
        });
      }
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        success: false,
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      success: false,
    });
  }, []);

  const retry = useCallback(async () => {
    if (lastRequest.current) {
      await execute(lastRequest.current);
    }
  }, [execute]);

  return {
    ...state,
    execute,
    reset,
    retry,
  };
}

// Workflow Execution Hook
export function useWorkflowExecution() {
  const [state, setState] = useState<UseAIAPIState<WorkflowExecutionResponse>>({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  const lastRequest = useRef<WorkflowExecutionRequest | null>(null);

  const execute = useCallback(async (request: WorkflowExecutionRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null, success: false }));
    lastRequest.current = request;

    try {
      const response = await aiAPIService.executeWorkflow(request);
      
      if (response.success && response.data) {
        setState({
          data: response.data,
          loading: false,
          error: null,
          success: true,
        });
      } else {
        setState({
          data: null,
          loading: false,
          error: response.error || 'Workflow execution failed',
          success: false,
        });
      }
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        success: false,
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      success: false,
    });
  }, []);

  const retry = useCallback(async () => {
    if (lastRequest.current) {
      await execute(lastRequest.current);
    }
  }, [execute]);

  return {
    ...state,
    execute,
    reset,
    retry,
  };
}

// Workflow Optimization Hook
export function useWorkflowOptimization() {
  const [state, setState] = useState<UseAIAPIState<WorkflowOptimizationResponse>>({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  const lastRequest = useRef<WorkflowOptimizationRequest | null>(null);

  const execute = useCallback(async (request: WorkflowOptimizationRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null, success: false }));
    lastRequest.current = request;

    try {
      const response = await aiAPIService.optimizeWorkflow(request);
      
      if (response.success && response.data) {
        setState({
          data: response.data,
          loading: false,
          error: null,
          success: true,
        });
      } else {
        setState({
          data: null,
          loading: false,
          error: response.error || 'Workflow optimization failed',
          success: false,
        });
      }
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        success: false,
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      success: false,
    });
  }, []);

  const retry = useCallback(async () => {
    if (lastRequest.current) {
      await execute(lastRequest.current);
    }
  }, [execute]);

  return {
    ...state,
    execute,
    reset,
    retry,
  };
}

// Batch Content Analysis Hook
export function useBatchContentAnalysis() {
  const [state, setState] = useState<UseAIAPIState<any[]>>({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  const execute = useCallback(async (contents: string[]) => {
    setState(prev => ({ ...prev, loading: true, error: null, success: false }));

    try {
      const response = await aiAPIService.analyzeBatchContent(contents);
      
      if (response.success && response.data) {
        setState({
          data: response.data,
          loading: false,
          error: null,
          success: true,
        });
      } else {
        setState({
          data: null,
          loading: false,
          error: response.error || 'Batch analysis failed',
          success: false,
        });
      }
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        success: false,
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      success: false,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// AI Insights Generation Hook
export function useAIInsights() {
  const [state, setState] = useState<UseAIAPIState<any>>({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  const execute = useCallback(async (context: Record<string, any>) => {
    setState(prev => ({ ...prev, loading: true, error: null, success: false }));

    try {
      const response = await aiAPIService.generateInsights(context);
      
      if (response.success && response.data) {
        setState({
          data: response.data,
          loading: false,
          error: null,
          success: true,
        });
      } else {
        setState({
          data: null,
          loading: false,
          error: response.error || 'Insights generation failed',
          success: false,
        });
      }
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        success: false,
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      success: false,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// AI Status Monitoring Hook
export function useAIStatus() {
  const [state, setState] = useState<UseAIAPIState<any>>({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null, success: false }));

    try {
      const response = await aiAPIService.getAIStatus();
      
      if (response.success && response.data) {
        setState({
          data: response.data,
          loading: false,
          error: null,
          success: true,
        });
      } else {
        setState({
          data: null,
          loading: false,
          error: response.error || 'AI status check failed',
          success: false,
        });
      }
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        success: false,
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      success: false,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}
