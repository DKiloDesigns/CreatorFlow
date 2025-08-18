"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  Stack,
  Alert,
  AlertTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  PlayArrow,
  Stop,
  Refresh,
  CheckCircle,
  Error,
  Warning,
  Info,
  AutoAwesome,
  Brain,
  Psychology,
  SmartToy,
  Analytics,
  ContentCopy,
  Schedule,
  TrendingUp,
  Rocket,
  TestTube,
  Code,
  DataUsage,
  Sync
} from '@mui/icons-material';
import { designTokens } from '@/lib/design-system';
import {
  useContentOptimization,
  useContentPrediction,
  useAudienceAnalysis,
  useWorkflowExecution,
  useWorkflowOptimization,
  useBatchContentAnalysis,
  useAIInsights,
  useAIStatus
} from '@/hooks/use-ai-api';

interface TestResult {
  id: string;
  testName: string;
  status: 'pending' | 'running' | 'success' | 'error';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  request: any;
  response?: any;
  error?: string;
}

export default function AIAPITest() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTest, setSelectedTest] = useState<string | null>(null);

  // AI API hooks
  const contentOptimization = useContentOptimization();
  const contentPrediction = useContentPrediction();
  const audienceAnalysis = useAudienceAnalysis();
  const workflowExecution = useWorkflowExecution();
  const workflowOptimization = useWorkflowOptimization();
  const batchAnalysis = useBatchContentAnalysis();
  const aiInsights = useAIInsights();
  const aiStatus = useAIStatus();

  // Sample test data
  const sampleContent = "🚀 Just launched our new AI-powered content creation tool! It's revolutionizing how creators work. Check it out and let me know what you think! #AI #ContentCreation #Innovation";
  const sampleWorkflow = {
    id: "test-workflow-001",
    name: "Test Content Publishing Workflow",
    type: "publishing",
    priority: "high" as const
  };

  // Test functions
  const runContentOptimizationTest = async () => {
    const testId = `test-${Date.now()}-1`;
    const testResult: TestResult = {
      id: testId,
      testName: "Content Optimization",
      status: 'running',
      startTime: new Date(),
      request: {
        content: sampleContent,
        contentType: "post",
        platform: "instagram",
        targetAudience: "tech professionals",
        goals: ["engagement", "reach"],
        tone: "professional",
        language: "en"
      }
    };

    setTestResults(prev => [...prev, testResult]);

    try {
      await contentOptimization.execute(testResult.request);
      
      if (contentOptimization.success && contentOptimization.data) {
        updateTestResult(testId, 'success', contentOptimization.data);
      } else {
        updateTestResult(testId, 'error', undefined, contentOptimization.error);
      }
    } catch (error) {
      updateTestResult(testId, 'error', undefined, error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const runContentPredictionTest = async () => {
    const testId = `test-${Date.now()}-2`;
    const testResult: TestResult = {
      id: testId,
      testName: "Content Performance Prediction",
      status: 'running',
      startTime: new Date(),
      request: {
        content: sampleContent,
        contentType: "post",
        platform: "instagram",
        audience: "tech professionals"
      }
    };

    setTestResults(prev => [...prev, testResult]);

    try {
      await contentPrediction.execute(testResult.request);
      
      if (contentPrediction.success && contentPrediction.data) {
        updateTestResult(testId, 'success', contentPrediction.data);
      } else {
        updateTestResult(testId, 'error', undefined, contentPrediction.error);
      }
    } catch (error) {
      updateTestResult(testId, 'error', undefined, error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const runAudienceAnalysisTest = async () => {
    const testId = `test-${Date.now()}-3`;
    const testResult: TestResult = {
      id: testId,
      testName: "Audience Analysis",
      status: 'running',
      startTime: new Date(),
      request: {
        platform: "instagram",
        audienceSegment: "tech professionals",
        timeRange: "last_30_days",
        metrics: ["engagement", "response_time", "sharing"]
      }
    };

    setTestResults(prev => [...prev, testResult]);

    try {
      await audienceAnalysis.execute(testResult.request);
      
      if (audienceAnalysis.success && audienceAnalysis.data) {
        updateTestResult(testId, 'success', audienceAnalysis.data);
      } else {
        updateTestResult(testId, 'error', undefined, audienceAnalysis.error);
      }
    } catch (error) {
      updateTestResult(testId, 'error', undefined, error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const runWorkflowExecutionTest = async () => {
    const testId = `test-${Date.now()}-4`;
    const testResult: TestResult = {
      id: testId,
      testName: "Workflow Execution",
      status: 'running',
      startTime: new Date(),
      request: {
        workflowId: sampleWorkflow.id,
        input: { action: "test", content: "Test workflow execution" },
        priority: "high",
        timeout: 30000
      }
    };

    setTestResults(prev => [...prev, testResult]);

    try {
      await workflowExecution.execute(testResult.request);
      
      if (workflowExecution.success && workflowExecution.data) {
        updateTestResult(testId, 'success', workflowExecution.data);
      } else {
        updateTestResult(testId, 'error', undefined, workflowExecution.error);
      }
    } catch (error) {
      updateTestResult(testId, 'error', undefined, error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const runWorkflowOptimizationTest = async () => {
    const testId = `test-${Date.now()}-5`;
    const testResult: TestResult = {
      id: testId,
      testName: "Workflow Optimization",
      status: 'running',
      startTime: new Date(),
      request: {
        workflowId: sampleWorkflow.id,
        performanceData: {
          successRate: 0.85,
          avgExecutionTime: 2.3,
          totalExecutions: 156
        },
        optimizationGoals: ["efficiency", "success_rate", "execution_time"]
      }
    };

    setTestResults(prev => [...prev, testResult]);

    try {
      await workflowOptimization.execute(testResult.request);
      
      if (workflowOptimization.success && workflowOptimization.data) {
        updateTestResult(testId, 'success', workflowOptimization.data);
      } else {
        updateTestResult(testId, 'error', undefined, workflowOptimization.error);
      }
    } catch (error) {
      updateTestResult(testId, 'error', undefined, error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const runBatchAnalysisTest = async () => {
    const testId = `test-${Date.now()}-6`;
    const testResult: TestResult = {
      id: testId,
      testName: "Batch Content Analysis",
      status: 'running',
      startTime: new Date(),
      request: {
        contents: [
          "First content piece for analysis",
          "Second content piece for analysis",
          "Third content piece for analysis"
        ]
      }
    };

    setTestResults(prev => [...prev, testResult]);

    try {
      await batchAnalysis.execute(testResult.request.contents);
      
      if (batchAnalysis.success && batchAnalysis.data) {
        updateTestResult(testId, 'success', batchAnalysis.data);
      } else {
        updateTestResult(testId, 'error', undefined, batchAnalysis.error);
      }
    } catch (error) {
      updateTestResult(testId, 'error', undefined, error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const runAIInsightsTest = async () => {
    const testId = `test-${Date.now()}-7`;
    const testResult: TestResult = {
      id: testId,
      testName: "AI Insights Generation",
      status: 'running',
      startTime: new Date(),
      request: {
        context: {
          platform: "instagram",
          audience: "tech professionals",
          contentType: "post",
          goals: ["engagement", "brand_awareness"]
        }
      }
    };

    setTestResults(prev => [...prev, testResult]);

    try {
      await aiInsights.execute(testResult.request.context);
      
      if (aiInsights.success && aiInsights.data) {
        updateTestResult(testId, 'success', aiInsights.data);
      } else {
        updateTestResult(testId, 'error', undefined, aiInsights.error);
      }
    } catch (error) {
      updateTestResult(testId, 'error', undefined, error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const runAIStatusTest = async () => {
    const testId = `test-${Date.now()}-8`;
    const testResult: TestResult = {
      id: testId,
      testName: "AI Service Status",
      status: 'running',
      startTime: new Date(),
      request: {}
    };

    setTestResults(prev => [...prev, testResult]);

    try {
      await aiStatus.execute();
      
      if (aiStatus.success && aiStatus.data) {
        updateTestResult(testId, 'success', aiStatus.data);
      } else {
        updateTestResult(testId, 'error', undefined, aiStatus.error);
      }
    } catch (error) {
      updateTestResult(testId, 'error', undefined, error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const updateTestResult = (testId: string, status: 'success' | 'error', response?: any, error?: string) => {
    setTestResults(prev => prev.map(result => {
      if (result.id === testId) {
        const endTime = new Date();
        const duration = endTime.getTime() - result.startTime.getTime();
        return {
          ...result,
          status,
          endTime,
          duration,
          response,
          error
        };
      }
      return result;
    }));
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    // Run tests sequentially
    await runContentOptimizationTest();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await runContentPredictionTest();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await runAudienceAnalysisTest();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await runWorkflowExecutionTest();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await runWorkflowOptimizationTest();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await runBatchAnalysisTest();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await runAIInsightsTest();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await runAIStatusTest();
    
    setIsRunning(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Info sx={{ color: designTokens.colors.info[500] }} />;
      case 'running':
        return <CircularProgress size={16} />;
      case 'success':
        return <CheckCircle sx={{ color: designTokens.colors.success[500] }} />;
      case 'error':
        return <Error sx={{ color: designTokens.colors.error[500] }} />;
      default:
        return <Info sx={{ color: designTokens.colors.info[500] }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return designTokens.colors.info[500];
      case 'running':
        return designTokens.colors.primary[500];
      case 'success':
        return designTokens.colors.success[500];
      case 'error':
        return designTokens.colors.error[500];
      default:
        return designTokens.colors.neutral[500];
    }
  };

  const successCount = testResults.filter(r => r.status === 'success').length;
  const errorCount = testResults.filter(r => r.status === 'error').length;
  const totalTests = testResults.length;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: designTokens.colors.ai[600]
            }}
          >
            <TestTube sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: designTokens.typography.fontWeight.bold,
                color: designTokens.colors.neutral[900],
                mb: 1
              }}
            >
              AI API Integration Test Suite
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: designTokens.colors.neutral[600],
                fontWeight: designTokens.typography.fontWeight.normal
              }}
            >
              Test all AI API integrations with sample data and real-time monitoring
            </Typography>
          </Box>
        </Box>

        {/* Test Summary */}
        {totalTests > 0 && (
          <Box sx={{ mt: 3, p: 3, background: designTokens.colors.neutral[50], borderRadius: designTokens.borderRadius.lg }}>
            <Typography variant="h6" sx={{ mb: 2, color: designTokens.colors.neutral[800] }}>
              Test Results Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: designTokens.colors.neutral[900] }}>
                    {totalTests}
                  </Typography>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                    Total Tests
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: designTokens.colors.success[600] }}>
                    {successCount}
                  </Typography>
                  <Typography variant="body2" sx={{ color: designTokens.colors.success[600] }}>
                    Successful
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: designTokens.colors.error[600] }}>
                    {errorCount}
                  </Typography>
                  <Typography variant="body2" sx={{ color: designTokens.colors.error[600] }}>
                    Failed
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: designTokens.colors.primary[600] }}>
                    {totalTests > 0 ? Math.round((successCount / totalTests) * 100) : 0}%
                  </Typography>
                  <Typography variant="body2" sx={{ color: designTokens.colors.primary[600] }}>
                    Success Rate
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>

      {/* Test Controls */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, color: designTokens.colors.neutral[900] }}>
          Test Controls
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<PlayArrow />}
            onClick={runAllTests}
            disabled={isRunning}
            sx={{
              background: 'linear-gradient(90deg, #06B6D4, #8B5CF6)',
              '&:hover': {
                background: 'linear-gradient(90deg, #0891B2, #7C3AED)'
              }
            }}
          >
            {isRunning ? 'Running Tests...' : 'Run All Tests'}
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={clearResults}
            disabled={isRunning}
          >
            Clear Results
          </Button>

          <Button
            variant="outlined"
            startIcon={<Code />}
            onClick={() => setSelectedTest(selectedTest ? null : 'sample')}
          >
            {selectedTest ? 'Hide Sample Data' : 'Show Sample Data'}
          </Button>
        </Box>
      </Box>

      {/* Sample Data Display */}
      {selectedTest && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 2, color: designTokens.colors.neutral[900] }}>
            Sample Test Data
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card elevation={0} sx={{ border: `1px solid ${designTokens.colors.neutral[200]}` }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, color: designTokens.colors.neutral[800] }}>
                    Sample Content
                  </Typography>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], fontStyle: 'italic' }}>
                    {sampleContent}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card elevation={0} sx={{ border: `1px solid ${designTokens.colors.neutral[200]}` }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, color: designTokens.colors.neutral[800] }}>
                    Sample Workflow
                  </Typography>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                    ID: {sampleWorkflow.id}
                  </Typography>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                    Name: {sampleWorkflow.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                    Type: {sampleWorkflow.type}
                  </Typography>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                    Priority: {sampleWorkflow.priority}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Test Results */}
      <Box>
        <Typography variant="h5" sx={{ mb: 2, color: designTokens.colors.neutral[900] }}>
          Test Results
        </Typography>
        
        {testResults.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <TestTube sx={{ fontSize: 64, color: designTokens.colors.neutral[300], mb: 2 }} />
            <Typography variant="h6" sx={{ color: designTokens.colors.neutral[500] }}>
              No tests run yet
            </Typography>
            <Typography variant="body2" sx={{ color: designTokens.colors.neutral[400] }}>
              Click "Run All Tests" to start testing the AI API integrations
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {testResults.map((result) => (
              <Accordion key={result.id} elevation={0} sx={{ border: `1px solid ${designTokens.colors.neutral[200]}` }}>
                <AccordionSummary>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    {getStatusIcon(result.status)}
                    <Typography variant="h6" sx={{ flexGrow: 1, color: designTokens.colors.neutral[900] }}>
                      {result.testName}
                    </Typography>
                    <Chip
                      label={result.status}
                      size="small"
                      sx={{
                        background: `${getStatusColor(result.status)}15`,
                        color: getStatusColor(result.status),
                        fontWeight: 'medium'
                      }}
                    />
                    {result.duration && (
                      <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                        {result.duration}ms
                      </Typography>
                    )}
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" sx={{ mb: 2, color: designTokens.colors.neutral[800] }}>
                        Request
                      </Typography>
                      <Box sx={{ p: 2, background: designTokens.colors.neutral[50], borderRadius: designTokens.borderRadius.md }}>
                        <pre style={{ margin: 0, fontSize: '0.8rem', color: designTokens.colors.neutral[700] }}>
                          {JSON.stringify(result.request, null, 2)}
                        </pre>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      {result.status === 'success' && result.response ? (
                        <>
                          <Typography variant="subtitle2" sx={{ mb: 2, color: designTokens.colors.neutral[800] }}>
                            Response
                          </Typography>
                          <Box sx={{ p: 2, background: designTokens.colors.success[50], borderRadius: designTokens.borderRadius.md }}>
                            <pre style={{ margin: 0, fontSize: '0.8rem', color: designTokens.colors.success[700] }}>
                              {JSON.stringify(result.response, null, 2)}
                            </pre>
                          </Box>
                        </>
                      ) : result.status === 'error' && result.error ? (
                        <>
                          <Typography variant="subtitle2" sx={{ mb: 2, color: designTokens.colors.neutral[800] }}>
                            Error
                          </Typography>
                          <Box sx={{ p: 2, background: designTokens.colors.error[50], borderRadius: designTokens.borderRadius.md }}>
                            <Typography variant="body2" sx={{ color: designTokens.colors.error[700] }}>
                              {result.error}
                            </Typography>
                          </Box>
                        </>
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 100 }}>
                          <CircularProgress size={24} />
                        </Box>
                      )}
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        )}
      </Box>

      {/* API Status */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, color: designTokens.colors.neutral[900] }}>
          API Service Status
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ border: `1px solid ${designTokens.colors.neutral[200] }` }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: designTokens.colors.neutral[800] }}>
                  Environment Configuration
                </Typography>
                <Box sx={{ space: 1 }}>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                    API Base URL: {process.env.NEXT_PUBLIC_AI_API_BASE_URL || 'Not configured'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                    API Key: {process.env.NEXT_PUBLIC_AI_API_KEY ? 'Configured' : 'Not configured'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ border: `1px solid ${designTokens.colors.neutral[200] }` }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: designTokens.colors.neutral[800] }}>
                  Hook Status
                </Typography>
                <Box sx={{ space: 1 }}>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                    Content Optimization: {contentOptimization.loading ? 'Loading' : 'Ready'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                    Content Prediction: {contentPrediction.loading ? 'Loading' : 'Ready'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                    Workflow Execution: {workflowExecution.loading ? 'Loading' : 'Ready'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
