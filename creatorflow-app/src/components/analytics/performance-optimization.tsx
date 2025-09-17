/**
 * Performance Optimization Dashboard
 * AI-powered optimization recommendations and testing
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Tabs,
  Tab,
  Chip,
  LinearProgress,
  Alert,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  FormControlLabel,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Speed as SpeedIcon,
  Lightbulb as LightbulbIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Science as ScienceIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Refresh as RefreshIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  Compare as CompareIcon,
  AutoFixHigh as AutoFixHighIcon,
  Insights as InsightsIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';

interface OptimizationRecommendation {
  id: string;
  type: 'content' | 'timing' | 'hashtags' | 'platform' | 'audience' | 'format';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: {
    expected: number;
    confidence: number;
  };
  action: string;
  data: any;
  createdAt: string;
  expiresAt?: string;
}

interface PerformanceAlert {
  id: string;
  type: 'decline' | 'spike' | 'anomaly' | 'threshold' | 'opportunity';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  metric: string;
  currentValue: number;
  threshold?: number;
  trend: 'up' | 'down' | 'stable';
  actionable: boolean;
  action?: string;
  createdAt: string;
  acknowledged: boolean;
}

interface AITest {
  id: string;
  name: string;
  description: string;
  type: 'a_b' | 'multivariate' | 'sequential';
  status: 'draft' | 'running' | 'completed' | 'paused';
  variants: TestVariant[];
  metrics: string[];
  startDate: string;
  endDate?: string;
  results?: TestResults;
}

interface TestVariant {
  id: string;
  name: string;
  description: string;
  changes: {
    field: string;
    value: any;
    description: string;
  }[];
  trafficAllocation: number;
}

interface TestResults {
  winner?: string;
  confidence: number;
  metrics: Record<string, {
    variant: string;
    value: number;
    improvement: number;
    significance: number;
  }>;
  recommendations: string[];
}

export default function PerformanceOptimization() {
  const [activeTab, setActiveTab] = useState(0);
  const [recommendations, setRecommendations] = useState<OptimizationRecommendation[]>([]);
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [tests, setTests] = useState<AITest[]>([]);
  const [loading, setLoading] = useState(false);
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [newTest, setNewTest] = useState<Partial<AITest>>({
    name: '',
    description: '',
    type: 'a_b',
    variants: [],
    metrics: ['engagement', 'reach', 'clicks']
  });

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      setRecommendations([
        {
          id: '1',
          type: 'timing',
          priority: 'high',
          title: 'Optimize Posting Times',
          description: 'Posting at 2:00 PM could improve engagement by 25%',
          impact: { expected: 25, confidence: 85 },
          action: 'Schedule more content during optimal hours',
          data: {},
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          type: 'hashtags',
          priority: 'medium',
          title: 'Optimize Hashtag Strategy',
          description: 'Using trending hashtags could increase reach by 15%',
          impact: { expected: 15, confidence: 75 },
          action: 'Update hashtag strategy with recommended tags',
          data: {},
          createdAt: new Date().toISOString()
        }
      ]);

      setAlerts([
        {
          id: '1',
          type: 'decline',
          severity: 'high',
          title: 'Performance Decline Detected',
          description: 'Engagement has declined by 30% over the past week',
          metric: 'engagement',
          currentValue: 2.1,
          threshold: 3.0,
          trend: 'down',
          actionable: true,
          action: 'Review recent content strategy',
          createdAt: new Date().toISOString(),
          acknowledged: false
        }
      ]);

      setTests([
        {
          id: '1',
          name: 'Headline A/B Test',
          description: 'Testing different headline styles for better engagement',
          type: 'a_b',
          status: 'running',
          variants: [
            {
              id: 'v1',
              name: 'Control',
              description: 'Original headline style',
              changes: [],
              trafficAllocation: 50
            },
            {
              id: 'v2',
              name: 'Variant A',
              description: 'Question-based headlines',
              changes: [
                {
                  field: 'headline',
                  value: 'question',
                  description: 'Use question format'
                }
              ],
              trafficAllocation: 50
            }
          ],
          metrics: ['engagement', 'clicks'],
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'error';
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'content': return <EditIcon />;
      case 'timing': return <TimelineIcon />;
      case 'hashtags': return <AutoFixHighIcon />;
      case 'platform': return <CompareIcon />;
      case 'audience': return <VisibilityIcon />;
      case 'format': return <AssessmentIcon />;
      default: return <LightbulbIcon />;
    }
  };

  // Get alert icon
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'decline': return <TrendingDownIcon color="error" />;
      case 'spike': return <TrendingUpIcon color="success" />;
      case 'anomaly': return <WarningIcon color="warning" />;
      case 'threshold': return <CheckCircleIcon color="info" />;
      case 'opportunity': return <LightbulbIcon color="success" />;
      default: return <WarningIcon />;
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'success';
      case 'completed': return 'info';
      case 'paused': return 'warning';
      case 'draft': return 'default';
      default: return 'default';
    }
  };

  // Create new test
  const handleCreateTest = () => {
    if (newTest.name && newTest.description) {
      const test: AITest = {
        id: `test_${Date.now()}`,
        name: newTest.name,
        description: newTest.description,
        type: newTest.type as any,
        status: 'draft',
        variants: newTest.variants || [],
        metrics: newTest.metrics || [],
        startDate: new Date().toISOString()
      };

      setTests(prev => [test, ...prev]);
      setTestDialogOpen(false);
      setNewTest({
        name: '',
        description: '',
        type: 'a_b',
        variants: [],
        metrics: ['engagement', 'reach', 'clicks']
      });
    }
  };

  // Run test
  const handleRunTest = (testId: string) => {
    setTests(prev => prev.map(test => 
      test.id === testId ? { ...test, status: 'running' } : test
    ));
  };

  // Pause test
  const handlePauseTest = (testId: string) => {
    setTests(prev => prev.map(test => 
      test.id === testId ? { ...test, status: 'paused' } : test
    ));
  };

  // Stop test
  const handleStopTest = (testId: string) => {
    setTests(prev => prev.map(test => 
      test.id === testId ? { ...test, status: 'completed' } : test
    ));
  };

  // Acknowledge alert
  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Performance Optimization
          </Typography>
          <Typography variant="body1" color="text.secondary">
            AI-powered optimization recommendations and testing
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadData}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setTestDialogOpen(true)}
          >
            New Test
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Recommendations" icon={<LightbulbIcon />} />
          <Tab label="Alerts" icon={<WarningIcon />} />
          <Tab label="AI Tests" icon={<ScienceIcon />} />
        </Tabs>
      </Box>

      {/* Recommendations Tab */}
      {activeTab === 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Optimization Recommendations
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            AI-powered recommendations to improve your content performance.
          </Typography>

          {recommendations.map((rec) => (
            <Card key={rec.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Box sx={{ mr: 2 }}>
                    {getTypeIcon(rec.type)}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {rec.title}
                      </Typography>
                      <Chip
                        label={rec.priority}
                        color={getPriorityColor(rec.priority)}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Chip
                        label={`${rec.impact.expected}% improvement`}
                        color="success"
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {rec.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {/* Handle action */}}
                      >
                        {rec.action}
                      </Button>
                      <Typography variant="caption" color="text.secondary">
                        {rec.impact.confidence}% confidence
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Alerts Tab */}
      {activeTab === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Performance Alerts
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Real-time alerts about your content performance.
          </Typography>

          {alerts.map((alert) => (
            <Card key={alert.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Box sx={{ mr: 2 }}>
                    {getAlertIcon(alert.type)}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {alert.title}
                      </Typography>
                      <Chip
                        label={alert.severity}
                        color={getSeverityColor(alert.severity)}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      {!alert.acknowledged && (
                        <Button
                          size="small"
                          onClick={() => handleAcknowledgeAlert(alert.id)}
                        >
                          Acknowledge
                        </Button>
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {alert.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        {alert.metric}: {alert.currentValue}
                      </Typography>
                      {alert.threshold && (
                        <Typography variant="caption" color="text.secondary">
                          Threshold: {alert.threshold}
                        </Typography>
                      )}
                      {alert.actionable && alert.action && (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {/* Handle action */}}
                        >
                          {alert.action}
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* AI Tests Tab */}
      {activeTab === 2 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            AI-Powered Tests
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Run A/B tests and experiments to optimize your content.
          </Typography>

          {tests.map((test) => (
            <Card key={test.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    {test.name}
                  </Typography>
                  <Chip
                    label={test.status}
                    color={getStatusColor(test.status)}
                    size="small"
                    sx={{ mr: 2 }}
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {test.status === 'draft' && (
                      <IconButton
                        size="small"
                        onClick={() => handleRunTest(test.id)}
                      >
                        <PlayArrowIcon />
                      </IconButton>
                    )}
                    {test.status === 'running' && (
                      <>
                        <IconButton
                          size="small"
                          onClick={() => handlePauseTest(test.id)}
                        >
                          <PauseIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleStopTest(test.id)}
                        >
                          <StopIcon />
                        </IconButton>
                      </>
                    )}
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {test.description}
                </Typography>
                
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle2">Test Details</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" gutterBottom>
                          Variants
                        </Typography>
                        {test.variants.map((variant) => (
                          <Box key={variant.id} sx={{ mb: 1 }}>
                            <Typography variant="body2">
                              {variant.name} ({variant.trafficAllocation}%)
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {variant.description}
                            </Typography>
                          </Box>
                        ))}
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" gutterBottom>
                          Metrics
                        </Typography>
                        {test.metrics.map((metric) => (
                          <Chip
                            key={metric}
                            label={metric}
                            size="small"
                            sx={{ mr: 1, mb: 1 }}
                          />
                        ))}
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* New Test Dialog */}
      <Dialog
        open={testDialogOpen}
        onClose={() => setTestDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New AI Test</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Test Name"
            value={newTest.name}
            onChange={(e) => setNewTest(prev => ({ ...prev, name: e.target.value }))}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={newTest.description}
            onChange={(e) => setNewTest(prev => ({ ...prev, description: e.target.value }))}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Test Type</InputLabel>
            <Select
              value={newTest.type}
              onChange={(e) => setNewTest(prev => ({ ...prev, type: e.target.value as any }))}
              label="Test Type"
            >
              <MenuItem value="a_b">A/B Test</MenuItem>
              <MenuItem value="multivariate">Multivariate Test</MenuItem>
              <MenuItem value="sequential">Sequential Test</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTestDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateTest}>
            Create Test
          </Button>
        </DialogActions>
      </Dialog>

      {/* Loading */}
      {loading && <LinearProgress sx={{ position: 'fixed', top: 0, left: 0, right: 0 }} />}
    </Box>
  );
}
