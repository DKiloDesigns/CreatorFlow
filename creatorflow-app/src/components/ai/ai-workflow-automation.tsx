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
  Fade,
  Zoom,
  Skeleton,
  Divider,
  Stack,
  Alert,
  AlertTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Badge,
  LinearProgress,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  AutoAwesome,
  Brain,
  TrendingUp,
  SmartToy,
  Psychology,
  Analytics,
  CheckCircle,
  Warning,
  Error,
  Info,
  Lightbulb,
  Target,
  Speed,
  Timer,
  FlashOn,
  Star,
  StarBorder,
  ExpandMore,
  ExpandLess,
  PlayArrow,
  Pause,
  Stop,
  Save,
  Add,
  Edit,
  Delete,
  Visibility,
  Refresh,
  Settings,
  Schedule,
  ContentCopy,
  TrendingDown,
  TrendingFlat,
  Rocket,
  Hub,
  Code,
  DataUsage,
  Sync,
  AutoFixHigh,
  PsychologyAlt,
  Timeline,
  ShowChart,
  BarChart,
  PieChart
} from '@mui/icons-material';
import { designTokens } from '@/lib/design-system';
import { 
  useWorkflowExecution, 
  useWorkflowOptimization, 
  useAIStatus,
  useAIInsights 
} from '@/hooks/use-ai-api';

// Interfaces
interface WorkflowRule {
  id: string;
  name: string;
  description: string;
  type: 'content' | 'scheduling' | 'optimization' | 'publishing';
  status: 'active' | 'paused' | 'draft';
  priority: 'low' | 'medium' | 'high' | 'critical';
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  performance: {
    successRate: number;
    totalExecutions: number;
    lastExecuted: Date;
    avgExecutionTime: number;
  };
  aiOptimization: {
    enabled: boolean;
    learningRate: number;
    adaptationThreshold: number;
    lastOptimized: Date;
  };
}

interface WorkflowCondition {
  id: string;
  type: 'performance' | 'audience' | 'content' | 'time' | 'engagement';
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'between';
  value: any;
  metric?: string;
  threshold?: number;
}

interface WorkflowAction {
  id: string;
  type: 'publish' | 'schedule' | 'optimize' | 'notify' | 'analyze';
  parameters: Record<string, any>;
  delay?: number;
  retryCount?: number;
}

interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed' | 'paused';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  result?: any;
  error?: string;
  performance: {
    executionTime: number;
    success: boolean;
    metrics: Record<string, number>;
  };
}

export default function AIWorkflowAutomation() {
  const [activeTab, setActiveTab] = useState(0);
  const [workflows, setWorkflows] = useState<WorkflowRule[]>([]);
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowRule | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [executionDialogOpen, setExecutionDialogOpen] = useState(false);

  // AI API hooks
  const workflowExecution = useWorkflowExecution();
  const workflowOptimization = useWorkflowOptimization();
  const aiStatus = useAIStatus();
  const aiInsights = useAIInsights();

  // Mock data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Mock workflows
      setWorkflows([
        {
          id: 'wf-001',
          name: 'High-Performance Content Auto-Optimization',
          description: 'Automatically optimizes content based on real-time performance metrics',
          type: 'optimization',
          status: 'active',
          priority: 'high',
          conditions: [
            {
              id: 'c-001',
              type: 'performance',
              operator: 'less_than',
              value: 0.7,
              metric: 'engagement_rate',
              threshold: 0.7
            }
          ],
          actions: [
            {
              id: 'a-001',
              type: 'optimize',
              parameters: { optimizationType: 'content', platforms: ['instagram', 'twitter'] }
            }
          ],
          performance: {
            successRate: 87.5,
            totalExecutions: 24,
            lastExecuted: new Date(Date.now() - 2 * 60 * 60 * 1000),
            avgExecutionTime: 2.3
          },
          aiOptimization: {
            enabled: true,
            learningRate: 0.15,
            adaptationThreshold: 0.8,
            lastOptimized: new Date(Date.now() - 6 * 60 * 60 * 1000)
          }
        },
        {
          id: 'wf-002',
          name: 'Smart Cross-Platform Publishing',
          description: 'Intelligently publishes content across platforms with optimal timing',
          type: 'publishing',
          status: 'active',
          priority: 'medium',
          conditions: [
            {
              id: 'c-002',
              type: 'time',
              operator: 'between',
              value: { start: '09:00', end: '17:00' }
            }
          ],
          actions: [
            {
              id: 'a-002',
              type: 'publish',
              parameters: { platforms: ['instagram', 'twitter', 'linkedin'], delay: 300 }
            }
          ],
          performance: {
            successRate: 94.2,
            totalExecutions: 156,
            lastExecuted: new Date(Date.now() - 30 * 60 * 1000),
            avgExecutionTime: 1.8
          },
          aiOptimization: {
            enabled: true,
            learningRate: 0.12,
            adaptationThreshold: 0.85,
            lastOptimized: new Date(Date.now() - 12 * 60 * 60 * 1000)
          }
        },
        {
          id: 'wf-003',
          name: 'Audience Engagement Response',
          description: 'Automatically responds to high-engagement content with follow-up actions',
          type: 'content',
          status: 'paused',
          priority: 'medium',
          conditions: [
            {
              id: 'c-003',
              type: 'engagement',
              operator: 'greater_than',
              value: 0.8,
              metric: 'engagement_rate',
              threshold: 0.8
            }
          ],
          actions: [
            {
              id: 'a-003',
              type: 'notify',
              parameters: { notificationType: 'high_engagement', channels: ['email', 'slack'] }
            }
          ],
          performance: {
            successRate: 91.8,
            totalExecutions: 89,
            lastExecuted: new Date(Date.now() - 4 * 60 * 60 * 1000),
            avgExecutionTime: 0.9
          },
          aiOptimization: {
            enabled: false,
            learningRate: 0.1,
            adaptationThreshold: 0.75,
            lastOptimized: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        }
      ]);

      // Mock executions
      setExecutions([
        {
          id: 'ex-001',
          workflowId: 'wf-001',
          status: 'completed',
          startTime: new Date(Date.now() - 30 * 60 * 1000),
          endTime: new Date(Date.now() - 29 * 60 * 1000),
          duration: 60,
          result: { optimized: true, performanceImprovement: 0.23 },
          performance: {
            executionTime: 60,
            success: true,
            metrics: { engagement_rate: 0.85, reach: 1250, clicks: 89 }
          }
        },
        {
          id: 'ex-002',
          workflowId: 'wf-002',
          status: 'running',
          startTime: new Date(Date.now() - 5 * 60 * 1000),
          performance: {
            executionTime: 300,
            success: false,
            metrics: { published: 2, failed: 0, pending: 1 }
          }
        }
      ]);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleCreateWorkflow = () => {
    setCreateDialogOpen(true);
  };

  const handleEditWorkflow = (workflow: WorkflowRule) => {
    setSelectedWorkflow(workflow);
    setEditDialogOpen(true);
  };

  const handleToggleWorkflow = async (workflowId: string) => {
    const workflow = workflows.find(wf => wf.id === workflowId);
    if (!workflow) return;

    if (workflow.status === 'active') {
      // Pause workflow
      setWorkflows(prev => prev.map(wf => 
        wf.id === workflowId ? { ...wf, status: 'paused' } : wf
      ));
    } else {
      // Activate workflow - execute with real API
      try {
        await workflowExecution.execute({
          workflowId,
          input: { action: 'activate', workflow: workflow },
          priority: workflow.priority,
          timeout: 30000
        });

        if (workflowExecution.success) {
          setWorkflows(prev => prev.map(wf => 
            wf.id === workflowId ? { ...wf, status: 'active' } : wf
          ));
        }
      } catch (error) {
        console.error('Failed to activate workflow:', error);
      }
    }
  };

  const handleDeleteWorkflow = (workflowId: string) => {
    setWorkflows(prev => prev.filter(wf => wf.id !== workflowId));
  };

  const handleOptimizeWorkflow = async (workflowId: string) => {
    const workflow = workflows.find(wf => wf.id === workflowId);
    if (!workflow) return;

    try {
      await workflowOptimization.execute({
        workflowId,
        performanceData: workflow.performance,
        optimizationGoals: ['efficiency', 'success_rate', 'execution_time']
      });

      if (workflowOptimization.success && workflowOptimization.data) {
        // Update workflow with optimized version
        setWorkflows(prev => prev.map(wf => 
          wf.id === workflowId 
            ? { ...wf, ...workflowOptimization.data?.optimizedWorkflow }
            : wf
        ));
      }
    } catch (error) {
      console.error('Failed to optimize workflow:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return designTokens.colors.success[500];
      case 'paused':
        return designTokens.colors.warning[500];
      case 'draft':
        return designTokens.colors.neutral[500];
      default:
        return designTokens.colors.neutral[500];
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return designTokens.colors.error[500];
      case 'high':
        return designTokens.colors.warning[500];
      case 'medium':
        return designTokens.colors.primary[500];
      case 'low':
        return designTokens.colors.success[500];
      default:
        return designTokens.colors.neutral[500];
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'content':
        return <ContentCopy />;
      case 'scheduling':
        return <Schedule />;
      case 'optimization':
        return <AutoFixHigh />;
      case 'publishing':
        return <Rocket />;
      default:
        return <Code />;
    }
  };

  const renderWorkflowsTab = () => (
    <Box>
      {/* Header Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ color: designTokens.colors.neutral[900] }}>
          AI Workflows
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateWorkflow}
          sx={{
            background: 'linear-gradient(90deg, #06B6D4, #8B5CF6)',
            '&:hover': {
              background: 'linear-gradient(90deg, #0891B2, #7C3AED)'
            }
          }}
        >
          Create Workflow
        </Button>
      </Box>

      {/* Workflows Grid */}
      <Grid container spacing={3}>
        {workflows.map((workflow) => (
          <Grid item xs={12} md={6} lg={4} key={workflow.id} component="div">
            <Card
              elevation={0}
              sx={{
                border: `1px solid ${designTokens.colors.neutral[200]}`,
                borderRadius: designTokens.borderRadius.lg,
                transition: designTokens.animation.micro.cardHover,
                '&:hover': {
                  boxShadow: designTokens.shadows.md,
                  borderColor: designTokens.colors.ai[300]
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: designTokens.colors.ai[600],
                      flexShrink: 0
                    }}
                  >
                    {getTypeIcon(workflow.type)}
                  </Box>
                  
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography variant="h6" sx={{ mb: 1, color: designTokens.colors.neutral[900] }}>
                      {workflow.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 2 }}>
                      {workflow.description}
                    </Typography>
                  </Box>
                </Box>

                {/* Status & Priority */}
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip
                    label={workflow.status}
                    size="small"
                    sx={{
                      background: `${getStatusColor(workflow.status)}15`,
                      color: getStatusColor(workflow.status),
                      fontWeight: 'medium'
                    }}
                  />
                  <Chip
                    label={workflow.priority}
                    size="small"
                    sx={{
                      background: `${getPriorityColor(workflow.priority)}15`,
                      color: getPriorityColor(workflow.priority),
                      fontWeight: 'medium'
                    }}
                  />
                  <Chip
                    label={workflow.type}
                    size="small"
                    sx={{
                      background: designTokens.colors.neutral[100],
                      color: designTokens.colors.neutral[700],
                      textTransform: 'capitalize'
                    }}
                  />
                </Box>

                {/* Performance Metrics */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[700], mb: 1 }}>
                    Success Rate: {workflow.performance.successRate}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={workflow.performance.successRate}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      background: designTokens.colors.neutral[200],
                      '& .MuiLinearProgress-bar': {
                        background: designTokens.colors.success[500]
                      }
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="caption" sx={{ color: designTokens.colors.neutral[600] }}>
                      Executions: {workflow.performance.totalExecutions}
                    </Typography>
                    <Typography variant="caption" sx={{ color: designTokens.colors.neutral[600] }}>
                      Avg Time: {workflow.performance.avgExecutionTime}s
                    </Typography>
                  </Box>
                </Box>

                {/* AI Optimization Status */}
                {workflow.aiOptimization.enabled && (
                  <Box sx={{ mb: 3, p: 2, background: designTokens.colors.ai[50], borderRadius: designTokens.borderRadius.md }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Brain sx={{ fontSize: 16, color: designTokens.colors.ai[600] }} />
                      <Typography variant="body2" sx={{ color: designTokens.colors.ai[700], fontWeight: 'medium' }}>
                        AI Optimization Active
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: designTokens.colors.ai[600] }}>
                      Learning Rate: {workflow.aiOptimization.learningRate} | 
                      Threshold: {workflow.aiOptimization.adaptationThreshold}
                    </Typography>
                  </Box>
                )}

                {/* Actions */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    variant={workflow.status === 'active' ? 'outlined' : 'contained'}
                    startIcon={workflow.status === 'active' ? <Pause /> : <PlayArrow />}
                    onClick={() => handleToggleWorkflow(workflow.id)}
                    sx={{ flex: 1 }}
                    disabled={workflowExecution.loading}
                  >
                    {workflowExecution.loading ? 'Processing...' : (workflow.status === 'active' ? 'Pause' : 'Activate')}
                  </Button>
                  <IconButton
                    size="small"
                    onClick={() => handleOptimizeWorkflow(workflow.id)}
                    sx={{ color: designTokens.colors.ai[600] }}
                    disabled={workflowOptimization.loading}
                  >
                    <Tooltip title="AI Optimize">
                      <AutoFixHigh />
                    </Tooltip>
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleEditWorkflow(workflow)}
                    sx={{ color: designTokens.colors.primary[600] }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteWorkflow(workflow.id)}
                    sx={{ color: designTokens.colors.error[600] }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderExecutionsTab = () => (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, color: designTokens.colors.neutral[900] }}>
        Workflow Executions
      </Typography>

      <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${designTokens.colors.neutral[200]}` }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: designTokens.colors.neutral[50] }}>
              <TableCell>Workflow</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Performance</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {executions.map((execution) => (
              <TableRow key={execution.id}>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {workflows.find(w => w.id === execution.workflowId)?.name || 'Unknown'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={execution.status}
                    size="small"
                    sx={{
                      background: execution.status === 'completed' ? designTokens.colors.success[100] :
                                execution.status === 'running' ? designTokens.colors.primary[100] :
                                execution.status === 'failed' ? designTokens.colors.error[100] :
                                designTokens.colors.warning[100],
                      color: execution.status === 'completed' ? designTokens.colors.success[700] :
                             execution.status === 'running' ? designTokens.colors.primary[700] :
                             execution.status === 'failed' ? designTokens.colors.error[700] :
                             designTokens.colors.warning[700]
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {execution.startTime.toLocaleTimeString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {execution.duration ? `${execution.duration}s` : 'Running...'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {execution.status === 'running' ? (
                      <CircularProgress size={16} />
                    ) : (
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          background: execution.performance.success ? designTokens.colors.success[500] : designTokens.colors.error[500]
                        }}
                      />
                    )}
                    <Typography variant="body2">
                      {execution.performance.success ? 'Success' : 'Failed'}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => setExecutionDialogOpen(true)}
                    sx={{ color: designTokens.colors.primary[600] }}
                  >
                    <Visibility />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderAnalyticsTab = () => (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, color: designTokens.colors.neutral[900] }}>
        AI Workflow Analytics
      </Typography>

      <Grid container spacing={3}>
        {/* Overall Performance */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ border: `1px solid ${designTokens.colors.neutral[200]}` }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: designTokens.colors.neutral[900] }}>
                Overall Performance
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: designTokens.colors.ai[600]
                  }}
                >
                  <TrendingUp sx={{ fontSize: 32 }} />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ color: designTokens.colors.neutral[900] }}>
                    91.2%
                  </Typography>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                    Average Success Rate
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                AI workflows are performing above the 85% threshold, with continuous optimization improving results.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* AI Learning Progress */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ border: `1px solid ${designTokens.colors.neutral[200]}` }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: designTokens.colors.neutral[900] }}>
                AI Learning Progress
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[700] }}>
                    Adaptation Rate
                  </Typography>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[700] }}>
                    78%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={78}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    background: designTokens.colors.neutral[200],
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #06B6D4, #8B5CF6)'
                    }
                  }}
                />
              </Box>
              <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                AI systems are learning and adapting to new patterns, improving workflow efficiency over time.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Workflow Type Distribution */}
        <Grid item xs={12}>
          <Card elevation={0} sx={{ border: `1px solid ${designTokens.colors.neutral[200]}` }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: designTokens.colors.neutral[900] }}>
                Workflow Type Distribution
              </Typography>
              <Grid container spacing={2}>
                {['content', 'scheduling', 'optimization', 'publishing'].map((type) => {
                  const count = workflows.filter(w => w.type === type).length;
                  const percentage = (count / workflows.length) * 100;
                  return (
                    <Grid item xs={6} md={3} key={type}>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 8px',
                            color: designTokens.colors.ai[600]
                          }}
                        >
                          {getTypeIcon(type)}
                        </Box>
                        <Typography variant="h6" sx={{ color: designTokens.colors.neutral[900] }}>
                          {count}
                        </Typography>
                        <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], textTransform: 'capitalize' }}>
                          {type}
                        </Typography>
                        <Typography variant="caption" sx={{ color: designTokens.colors.neutral[500] }}>
                          {percentage.toFixed(1)}%
                        </Typography>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" width="60%" height={48} />
        <Skeleton variant="text" width="40%" height={24} />
        <Box sx={{ mt: 4 }}>
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Grid item xs={12} md={6} lg={4} key={item}>
                <Skeleton variant="rectangular" height={300} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    );
  }

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
            <SmartToy sx={{ fontSize: 28 }} />
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
              AI Workflow Automation
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: designTokens.colors.neutral[600],
                fontWeight: designTokens.typography.fontWeight.normal
              }}
            >
              Create intelligent, self-optimizing content workflows that adapt to performance data
            </Typography>
          </Box>
        </Box>

        {/* AI Status Alert */}
        <Alert 
          severity="info" 
          sx={{ 
            mt: 3,
            background: 'linear-gradient(90deg, rgba(6, 182, 212, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
            border: `1px solid ${designTokens.colors.ai[200]}`,
            borderRadius: designTokens.borderRadius.lg
          }}
        >
          <AlertTitle sx={{ color: designTokens.colors.ai[700] }}>
            🤖 AI Learning Active
          </AlertTitle>
          <Typography variant="body2" sx={{ color: designTokens.colors.ai[700] }}>
            Your AI workflows are continuously learning and adapting. The system has executed {executions.length} workflows 
            with an average success rate of 91.2%. AI optimization is improving performance by 15-23% across all workflows.
          </Typography>
        </Alert>

        {/* API Error Alerts */}
        {workflowExecution.error && (
          <Alert 
            severity="error" 
            sx={{ mt: 2 }}
            action={
              <Button color="inherit" size="small" onClick={workflowExecution.retry}>
                Retry
              </Button>
            }
          >
            <AlertTitle>Workflow Execution Error</AlertTitle>
            {workflowExecution.error}
          </Alert>
        )}

        {workflowOptimization.error && (
          <Alert 
            severity="error" 
            sx={{ mt: 2 }}
            action={
              <Button color="inherit" size="small" onClick={workflowOptimization.retry}>
                Retry
              </Button>
            }
          >
            <AlertTitle>Workflow Optimization Error</AlertTitle>
            {workflowOptimization.error}
          </Alert>
        )}
      </Box>

      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="Workflows" />
          <Tab label="Executions" />
          <Tab label="Analytics" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && renderWorkflowsTab()}
      {activeTab === 1 && renderExecutionsTab()}
      {activeTab === 2 && renderAnalyticsTab()}

      {/* Dialogs would go here for create/edit/execution details */}
    </Box>
  );
}
