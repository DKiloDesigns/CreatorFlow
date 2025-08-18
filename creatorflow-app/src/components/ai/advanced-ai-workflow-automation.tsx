"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
  Tabs,
  Tab
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  Analytics,
  BarChart,
  PieChart,
  ShowChart,
  Timeline,
  AutoAwesome,
  Psychology,
  Target,
  Speed,
  Timer,
  FlashOn,
  Star,
  StarBorder,
  ExpandMore,
  ExpandLess,
  Refresh,
  Settings,
  ContentCopy,
  Schedule,
  CheckCircle,
  Warning,
  Error,
  Info,
  Lightbulb,
  Rocket,
  PlayArrow,
  Pause,
  Stop,
  Add,
  Edit,
  Delete,
  Visibility,
  MoreVert,
  Workflow,
  Hub,
  AccountTree,
  Schema,
  DataObject,
  Code,
  IntegrationInstructions,
  Api,
  Webhook,
  Cloud,
  Storage,
  NetworkCheck,
  Router,
  Firewall,
  Antivirus,
  Encryption,
  TwoFactorAuth,
  Password,
  UserCheck,
  DeviceHub,
  Compare,
  Assessment,
  Insights,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon
} from '@mui/icons-material';
import { designTokens } from '@/lib/design-system';

interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  category: 'content' | 'marketing' | 'analytics' | 'automation' | 'integration';
  status: 'active' | 'paused' | 'draft' | 'archived';
  complexity: 'simple' | 'moderate' | 'complex' | 'enterprise';
  aiPowered: boolean;
  executionTime: number;
  successRate: number;
  lastExecuted: string;
  nextExecution: string;
  triggers: string[];
  actions: string[];
  conditions: string[];
  aiOptimizations: string[];
  performance: {
    avgExecutionTime: number;
    successRate: number;
    errorRate: number;
    optimizationScore: number;
  };
}

interface AIOptimization {
  id: string;
  type: 'performance' | 'efficiency' | 'intelligence' | 'automation';
  description: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'applied' | 'testing' | 'failed';
  appliedAt: string;
  metrics: {
    before: number;
    after: number;
    improvement: number;
  };
}

interface WorkflowExecution {
  id: string;
  workflowId: string;
  workflowName: string;
  status: 'running' | 'completed' | 'failed' | 'paused';
  startTime: string;
  endTime?: string;
  duration: number;
  aiOptimizations: string[];
  performance: {
    executionTime: number;
    memoryUsage: number;
    cpuUsage: number;
    aiEfficiency: number;
  };
}

export default function AdvancedAIWorkflowAutomation() {
  const [activeTab, setActiveTab] = useState(0);
  const [workflows, setWorkflows] = useState<WorkflowDefinition[]>([]);
  const [aiOptimizations, setAiOptimizations] = useState<AIOptimization[]>([]);
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowDefinition | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showOptimizeDialog, setShowOptimizeDialog] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');
  const [showAIInsights, setShowAIInsights] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Mock data
  useEffect(() => {
    if (!isLoading) {
      setWorkflows([
        {
          id: 'wf-001',
          name: 'Content Creation Pipeline',
          description: 'AI-powered content generation and optimization workflow',
          category: 'content',
          status: 'active',
          complexity: 'complex',
          aiPowered: true,
          executionTime: 45,
          successRate: 94.2,
          lastExecuted: '2024-01-15T10:30:00Z',
          nextExecution: '2024-01-16T10:30:00Z',
          triggers: ['Schedule', 'Content Request', 'Performance Alert'],
          actions: ['AI Content Generation', 'SEO Optimization', 'Multi-platform Publishing'],
          conditions: ['Quality Score > 80', 'Engagement Rate > 5%'],
          aiOptimizations: ['Dynamic Content Length', 'Optimal Posting Time', 'Audience Targeting'],
          performance: {
            avgExecutionTime: 42,
            successRate: 94.2,
            errorRate: 2.1,
            optimizationScore: 87.5
          }
        },
        {
          id: 'wf-002',
          name: 'Marketing Campaign Automation',
          description: 'Intelligent campaign management and optimization',
          category: 'marketing',
          status: 'active',
          complexity: 'enterprise',
          aiPowered: true,
          executionTime: 120,
          successRate: 89.7,
          lastExecuted: '2024-01-15T08:00:00Z',
          nextExecution: '2024-01-16T08:00:00Z',
          triggers: ['Campaign Launch', 'Performance Threshold', 'Audience Change'],
          actions: ['Audience Segmentation', 'Budget Optimization', 'Creative Testing'],
          conditions: ['ROAS > 2.0', 'CTR > 1.5%', 'Conversion Rate > 2%'],
          aiOptimizations: ['Real-time Bid Adjustment', 'Creative Performance Prediction', 'Audience Expansion'],
          performance: {
            avgExecutionTime: 118,
            successRate: 89.7,
            errorRate: 3.2,
            optimizationScore: 91.3
          }
        },
        {
          id: 'wf-003',
          name: 'Analytics Intelligence',
          description: 'Automated data analysis and insight generation',
          category: 'analytics',
          status: 'active',
          complexity: 'moderate',
          aiPowered: true,
          executionTime: 30,
          successRate: 96.8,
          lastExecuted: '2024-01-15T12:00:00Z',
          nextExecution: '2024-01-16T12:00:00Z',
          triggers: ['Data Update', 'Performance Alert', 'Schedule'],
          actions: ['Data Processing', 'Pattern Recognition', 'Insight Generation'],
          conditions: ['Data Quality > 95%', 'Sample Size > 1000'],
          aiOptimizations: ['Anomaly Detection', 'Trend Prediction', 'Correlation Analysis'],
          performance: {
            avgExecutionTime: 28,
            successRate: 96.8,
            errorRate: 1.5,
            optimizationScore: 94.2
          }
        }
      ]);

      setAiOptimizations([
        {
          id: 'opt-001',
          type: 'performance',
          description: 'Dynamic resource allocation based on workflow complexity',
          impact: 'high',
          status: 'applied',
          appliedAt: '2024-01-14T15:30:00Z',
          metrics: {
            before: 45,
            after: 32,
            improvement: 28.9
          }
        },
        {
          id: 'opt-002',
          type: 'efficiency',
          description: 'AI-powered error prediction and prevention',
          impact: 'medium',
          status: 'applied',
          appliedAt: '2024-01-13T10:15:00Z',
          metrics: {
            before: 5.2,
            after: 2.1,
            improvement: 59.6
          }
        },
        {
          id: 'opt-003',
          type: 'intelligence',
          description: 'Smart workflow routing based on historical performance',
          impact: 'high',
          status: 'testing',
          appliedAt: '2024-01-12T14:20:00Z',
          metrics: {
            before: 89.7,
            after: 94.2,
            improvement: 5.0
          }
        }
      ]);

      setExecutions([
        {
          id: 'exec-001',
          workflowId: 'wf-001',
          workflowName: 'Content Creation Pipeline',
          status: 'completed',
          startTime: '2024-01-15T10:30:00Z',
          endTime: '2024-01-15T10:30:45Z',
          duration: 45,
          aiOptimizations: ['Dynamic Content Length', 'Optimal Posting Time'],
          performance: {
            executionTime: 45,
            memoryUsage: 78.5,
            cpuUsage: 65.2,
            aiEfficiency: 87.3
          }
        },
        {
          id: 'exec-002',
          workflowId: 'wf-002',
          workflowName: 'Marketing Campaign Automation',
          status: 'running',
          startTime: '2024-01-15T08:00:00Z',
          duration: 120,
          aiOptimizations: ['Real-time Bid Adjustment', 'Creative Performance Prediction'],
          performance: {
            executionTime: 120,
            memoryUsage: 92.1,
            cpuUsage: 88.7,
            aiEfficiency: 91.5
          }
        }
      ]);
    }
  }, [isLoading]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'paused': return 'warning';
      case 'draft': return 'info';
      case 'archived': return 'default';
      case 'running': return 'primary';
      case 'completed': return 'success';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'success';
      case 'moderate': return 'info';
      case 'complex': return 'warning';
      case 'enterprise': return 'error';
      default: return 'default';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'low': return 'success';
      case 'medium': return 'info';
      case 'high': return 'warning';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3, color: designTokens.colors.text.primary }}>
          Advanced AI Workflow Automation
        </Typography>
        <Grid container spacing={3}>
          {[1, 2, 3].map((item) => (
            <Grid key={item} xs={12} md={6} lg={4}>
              <Skeleton variant="rectangular" height={200} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: designTokens.colors.text.primary }}>
          Advanced AI Workflow Automation
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setShowCreateDialog(true)}
          sx={{
            backgroundColor: designTokens.colors.ai[600],
            '&:hover': { backgroundColor: designTokens.colors.ai[700] }
          }}
        >
          Create Workflow
        </Button>
      </Box>

      {showAIInsights && (
        <Alert 
          severity="info" 
          sx={{ mb: 3, backgroundColor: designTokens.colors.ai[50], borderColor: designTokens.colors.ai[200] }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={() => setShowAIInsights(false)}
            >
              Dismiss
            </Button>
          }
        >
          <AlertTitle>AI Intelligence Active</AlertTitle>
          Your workflows are being continuously optimized by AI. Current optimization score: <strong>91.2%</strong>
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="Workflows" />
          <Tab label="AI Optimizations" />
          <Tab label="Execution History" />
          <Tab label="Performance Analytics" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <Grid container spacing={3}>
                      {workflows.map((workflow) => (
              <Grid key={workflow.id} xs={12} md={6} lg={4}>
              <Fade in timeout={500}>
                <Card 
                  sx={{ 
                    height: '100%',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 8,
                      borderColor: designTokens.colors.ai[300]
                    },
                    border: `1px solid ${designTokens.colors.border}`
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" sx={{ color: designTokens.colors.text.primary, mb: 1 }}>
                          {workflow.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: designTokens.colors.text.secondary, mb: 2 }}>
                          {workflow.description}
                        </Typography>
                      </Box>
                      <IconButton size="small">
                        <MoreVert />
                      </IconButton>
                    </Box>

                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                      <Chip 
                        label={workflow.status} 
                        color={getStatusColor(workflow.status) as any}
                        size="small"
                      />
                      <Chip 
                        label={workflow.complexity} 
                        color={getComplexityColor(workflow.complexity) as any}
                        size="small"
                        variant="outlined"
                      />
                      {workflow.aiPowered && (
                        <Chip 
                          label="AI Powered" 
                          color="primary"
                          size="small"
                          icon={<Psychology />}
                        />
                      )}
                    </Stack>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: designTokens.colors.text.secondary, mb: 1 }}>
                        Performance
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ color: designTokens.colors.success[600] }}>
                            {workflow.performance.successRate}%
                          </Typography>
                          <Typography variant="caption" sx={{ color: designTokens.colors.text.secondary }}>
                            Success Rate
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ color: designTokens.colors.info[600] }}>
                            {workflow.performance.optimizationScore}%
                          </Typography>
                          <Typography variant="caption" sx={{ color: designTokens.colors.text.secondary }}>
                            AI Score
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" sx={{ color: designTokens.colors.text.secondary }}>
                        Last: {formatDate(workflow.lastExecuted)}
                      </Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setSelectedWorkflow(workflow)}
                      >
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
                                {aiOptimizations.map((optimization) => (
                        <Grid key={optimization.id} xs={12} md={6} lg={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ color: designTokens.colors.text.primary, mb: 1 }}>
                        {optimization.type.charAt(0).toUpperCase() + optimization.type.slice(1)} Optimization
                      </Typography>
                      <Typography variant="body2" sx={{ color: designTokens.colors.text.secondary, mb: 2 }}>
                        {optimization.description}
                      </Typography>
                    </Box>
                    <Chip 
                      label={optimization.status} 
                      color={getStatusColor(optimization.status) as any}
                      size="small"
                    />
                  </Box>

                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip 
                      label={optimization.impact} 
                      color={getImpactColor(optimization.impact) as any}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: designTokens.colors.text.secondary, mb: 1 }}>
                      Improvement
                    </Typography>
                    <Typography variant="h6" sx={{ color: designTokens.colors.success[600] }}>
                      +{optimization.metrics.improvement}%
                    </Typography>
                  </Box>

                  <Typography variant="caption" sx={{ color: designTokens.colors.text.secondary }}>
                    Applied: {formatDate(optimization.appliedAt)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 2 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Workflow</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>AI Efficiency</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {executions.map((execution) => (
                <TableRow key={execution.id}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {execution.workflowName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={execution.status} 
                      color={getStatusColor(execution.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {execution.status === 'running' ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={16} />
                        {formatDuration(execution.duration)}
                      </Box>
                    ) : (
                      formatDuration(execution.duration)
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">
                        {execution.performance.aiEfficiency}%
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={execution.performance.aiEfficiency} 
                        sx={{ width: 60, height: 6 }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <Visibility />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: designTokens.colors.text.primary }}>
                  Overall Performance
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                  <Box>
                    <Typography variant="h4" sx={{ color: designTokens.colors.success[600] }}>
                      91.2%
                    </Typography>
                    <Typography variant="body2" sx={{ color: designTokens.colors.text.secondary }}>
                      Success Rate
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ color: designTokens.colors.info[600] }}>
                      87.5%
                    </Typography>
                    <Typography variant="body2" sx={{ color: designTokens.colors.text.secondary }}>
                      AI Efficiency
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: designTokens.colors.text.primary }}>
                  Optimization Impact
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                  <Box>
                    <Typography variant="h4" sx={{ color: designTokens.colors.warning[600] }}>
                      -28.9%
                    </Typography>
                    <Typography variant="body2" sx={{ color: designTokens.colors.text.secondary }}>
                      Execution Time
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ color: designTokens.colors.success[600] }}>
                      +59.6%
                    </Typography>
                    <Typography variant="body2" sx={{ color: designTokens.colors.text.secondary }}>
                      Error Reduction
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Create Workflow Dialog */}
      <Dialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New AI Workflow</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid xs={12}>
              <TextField
                fullWidth
                label="Workflow Name"
                placeholder="Enter workflow name"
              />
            </Grid>
            <Grid xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                placeholder="Describe your workflow"
              />
            </Grid>
            <Grid xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select label="Category">
                  <MenuItem value="content">Content</MenuItem>
                  <MenuItem value="marketing">Marketing</MenuItem>
                  <MenuItem value="analytics">Analytics</MenuItem>
                  <MenuItem value="automation">Automation</MenuItem>
                  <MenuItem value="integration">Integration</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Complexity</InputLabel>
                <Select label="Complexity">
                  <MenuItem value="simple">Simple</MenuItem>
                  <MenuItem value="moderate">Moderate</MenuItem>
                  <MenuItem value="complex">Complex</MenuItem>
                  <MenuItem value="enterprise">Enterprise</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Enable AI-powered optimizations"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateDialog(false)}>Cancel</Button>
          <Button 
            variant="contained"
            onClick={() => setShowCreateDialog(false)}
            sx={{ backgroundColor: designTokens.colors.ai[600] }}
          >
            Create Workflow
          </Button>
        </DialogActions>
      </Dialog>

      {/* Workflow Details Dialog */}
      {selectedWorkflow && (
        <Dialog open={!!selectedWorkflow} onClose={() => setSelectedWorkflow(null)} maxWidth="md" fullWidth>
          <DialogTitle>{selectedWorkflow.name}</DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {selectedWorkflow.description}
            </Typography>
            
            <Grid container spacing={2}>
              <Grid xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 1 }}>Triggers</Typography>
                <List dense>
                  {selectedWorkflow.triggers.map((trigger, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <FlashOn sx={{ fontSize: 16 }} />
                      </ListItemIcon>
                      <ListItemText primary={trigger} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
              <Grid xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 1 }}>Actions</Typography>
                <List dense>
                  {selectedWorkflow.actions.map((action, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <PlayArrow sx={{ fontSize: 16 }} />
                      </ListItemIcon>
                      <ListItemText primary={action} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>

            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>AI Optimizations</Typography>
              <List dense>
                {selectedWorkflow.aiOptimizations.map((optimization, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Psychology sx={{ fontSize: 16, color: designTokens.colors.ai[600] }} />
                    </ListItemIcon>
                    <ListItemText primary={optimization} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedWorkflow(null)}>Close</Button>
            <Button 
              variant="contained"
              onClick={() => setShowOptimizeDialog(true)}
              sx={{ backgroundColor: designTokens.colors.ai[600] }}
            >
              Optimize with AI
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* AI Optimization Dialog */}
      <Dialog open={showOptimizeDialog} onClose={() => setShowOptimizeDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>AI Workflow Optimization</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Our AI will analyze your workflow and suggest optimizations for:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Speed sx={{ color: designTokens.colors.ai[600] }} />
              </ListItemIcon>
              <ListItemText primary="Performance improvements" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Psychology sx={{ color: designTokens.colors.ai[600] }} />
              </ListItemIcon>
              <ListItemText primary="Intelligent automation" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <TrendingUp sx={{ color: designTokens.colors.ai[600] }} />
              </ListItemIcon>
              <ListItemText primary="Efficiency gains" />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowOptimizeDialog(false)}>Cancel</Button>
          <Button 
            variant="contained"
            onClick={() => setShowOptimizeDialog(false)}
            sx={{ backgroundColor: designTokens.colors.ai[600] }}
          >
            Start Optimization
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
