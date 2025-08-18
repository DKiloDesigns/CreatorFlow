"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Alert,
  IconButton,
  Tooltip,
  Stack,
  Switch,
  FormControlLabel,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider
} from '@mui/material';
import {
  Hub,
  Link,
  Settings,
  Refresh,
  Add,
  Delete,
  Edit,
  Visibility,
  TrendingUp,
  AutoAwesome,
  SmartToy,
  Psychology,
  Analytics,
  CheckCircle,
  Warning,
  Error,
  Info,
  CalendarToday,
  AccessTime,
  Language,
  Public,
  Lock,
  Security,
  Speed,
  Cloud,
  Api,
  Webhook,
  Code,
  DataUsage,
  Sync,
  PlayArrow,
  Pause,
  Stop
} from '@mui/icons-material';

interface Integration {
  id: string;
  name: string;
  platform: string;
  type: 'social' | 'analytics' | 'automation' | 'crm' | 'marketing' | 'custom';
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  apiKey: string;
  lastSync: string;
  nextSync: string;
  syncFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
  permissions: string[];
  dataUsage: {
    requests: number;
    limit: number;
    resetDate: string;
  };
  health: {
    status: 'healthy' | 'warning' | 'error';
    responseTime: number;
    errorRate: number;
    lastError?: string;
  };
  automation: {
    enabled: boolean;
    rules: Array<{
      id: string;
      name: string;
      active: boolean;
      description: string;
    }>;
  };
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'error' | 'draft';
  triggers: Array<{
    platform: string;
    event: string;
    conditions: string[];
  }>;
  actions: Array<{
    platform: string;
    action: string;
    parameters: Record<string, any>;
  }>;
  schedule: {
    frequency: 'on-demand' | 'scheduled' | 'event-driven';
    cronExpression?: string;
    timezone: string;
  };
  statistics: {
    executions: number;
    successRate: number;
    lastExecuted: string;
    averageDuration: number;
  };
}

interface ApiEndpoint {
  id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  status: 'active' | 'inactive' | 'deprecated';
  rateLimit: {
    requests: number;
    window: string;
  };
  authentication: 'api-key' | 'oauth2' | 'bearer' | 'none';
  documentation: string;
  lastUsed: string;
  usage: {
    total: number;
    successful: number;
    failed: number;
  };
}

export default function IntegrationHub() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [apiEndpoints, setApiEndpoints] = useState<ApiEndpoint[]>([]);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [showWorkflowDialog, setShowWorkflowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadIntegrationData();
  }, []);

  const loadIntegrationData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockIntegrations: Integration[] = [
        {
          id: '1',
          name: 'LinkedIn Business',
          platform: 'LinkedIn',
          type: 'social',
          status: 'connected',
          apiKey: 'li_****_****_****',
          lastSync: '2 minutes ago',
          nextSync: 'in 58 minutes',
          syncFrequency: 'hourly',
          permissions: ['read_posts', 'write_posts', 'read_analytics'],
          dataUsage: {
            requests: 1250,
            limit: 5000,
            resetDate: '2025-09-01'
          },
          health: {
            status: 'healthy',
            responseTime: 245,
            errorRate: 0.2
          },
          automation: {
            enabled: true,
            rules: [
              { id: '1', name: 'Auto-post scheduling', active: true, description: 'Automatically schedule posts at optimal times' },
              { id: '2', name: 'Engagement monitoring', active: true, description: 'Monitor and respond to high-engagement posts' }
            ]
          }
        },
        {
          id: '2',
          name: 'Google Analytics 4',
          platform: 'Google',
          type: 'analytics',
          status: 'connected',
          apiKey: 'ga_****_****_****',
          lastSync: '5 minutes ago',
          nextSync: 'in 55 minutes',
          syncFrequency: 'hourly',
          permissions: ['read_analytics', 'read_reports'],
          dataUsage: {
            requests: 890,
            limit: 10000,
            resetDate: '2025-09-01'
          },
          health: {
            status: 'healthy',
            responseTime: 189,
            errorRate: 0.1
          },
          automation: {
            enabled: true,
            rules: [
              { id: '3', name: 'Performance alerts', active: true, description: 'Send alerts for significant performance changes' }
            ]
          }
        },
        {
          id: '3',
          name: 'Zapier Automation',
          platform: 'Zapier',
          type: 'automation',
          status: 'connected',
          apiKey: 'zap_****_****_****',
          lastSync: '1 minute ago',
          nextSync: 'in 59 minutes',
          syncFrequency: 'realtime',
          permissions: ['create_zaps', 'read_zaps', 'execute_zaps'],
          dataUsage: {
            requests: 2100,
            limit: 3000,
            resetDate: '2025-09-01'
          },
          health: {
            status: 'warning',
            responseTime: 892,
            errorRate: 2.1
          },
          automation: {
            enabled: true,
            rules: [
              { id: '4', name: 'Cross-platform sync', active: true, description: 'Sync content across multiple platforms' }
            ]
          }
        },
        {
          id: '4',
          name: 'HubSpot CRM',
          platform: 'HubSpot',
          type: 'crm',
          status: 'error',
          apiKey: 'hub_****_****_****',
          lastSync: '2 hours ago',
          nextSync: 'retry in 30 minutes',
          syncFrequency: 'daily',
          permissions: ['read_contacts', 'read_companies', 'read_deals'],
          dataUsage: {
            requests: 450,
            limit: 2000,
            resetDate: '2025-09-01'
          },
          health: {
            status: 'error',
            responseTime: 0,
            errorRate: 15.2,
            lastError: 'API rate limit exceeded'
          },
          automation: {
            enabled: false,
            rules: []
          }
        }
      ];

      const mockWorkflows: Workflow[] = [
        {
          id: '1',
          name: 'Content Cross-Posting',
          description: 'Automatically post content to multiple platforms with platform-specific optimization',
          status: 'active',
          triggers: [
            {
              platform: 'CreatorFlow',
              event: 'content_published',
              conditions: ['content_type = post', 'quality_score > 80']
            }
          ],
          actions: [
            {
              platform: 'LinkedIn',
              action: 'create_post',
              parameters: { format: 'professional', hashtags: 'auto' }
            },
            {
              platform: 'Twitter',
              action: 'create_tweet',
              parameters: { format: 'concise', hashtags: 'trending' }
            }
          ],
          schedule: {
            frequency: 'event-driven',
            timezone: 'UTC'
          },
          statistics: {
            executions: 156,
            successRate: 94.2,
            lastExecuted: '5 minutes ago',
            averageDuration: 2.3
          }
        },
        {
          id: '2',
          name: 'Performance Monitoring',
          description: 'Monitor content performance and trigger optimization actions',
          status: 'active',
          triggers: [
            {
              platform: 'Analytics',
              event: 'performance_threshold',
              conditions: ['engagement < 70%', 'reach < 1000']
            }
          ],
          actions: [
            {
              platform: 'AI Optimizer',
              action: 'optimize_content',
              parameters: { strategy: 'performance_boost' }
            },
            {
              platform: 'Notifications',
              action: 'send_alert',
              parameters: { type: 'performance_warning' }
            }
          ],
          schedule: {
            frequency: 'event-driven',
            timezone: 'UTC'
          },
          statistics: {
            executions: 89,
            successRate: 97.8,
            lastExecuted: '15 minutes ago',
            averageDuration: 1.8
          }
        },
        {
          id: '3',
          name: 'Trend Integration',
          description: 'Automatically incorporate trending topics into content strategy',
          status: 'paused',
          triggers: [
            {
              platform: 'Trend Analysis',
              event: 'trending_topic',
              conditions: ['relevance > 80%', 'growth_rate > 20%']
            }
          ],
          actions: [
            {
              platform: 'Content Generator',
              action: 'create_trending_content',
              parameters: { topic: 'auto', format: 'multiple' }
            }
          ],
          schedule: {
            frequency: 'scheduled',
            cronExpression: '0 */6 * * *',
            timezone: 'UTC'
          },
          statistics: {
            executions: 23,
            successRate: 87.0,
            lastExecuted: '2 hours ago',
            averageDuration: 4.2
          }
        }
      ];

      const mockApiEndpoints: ApiEndpoint[] = [
        {
          id: '1',
          name: 'Content Analytics',
          url: '/api/analytics/content',
          method: 'GET',
          status: 'active',
          rateLimit: {
            requests: 1000,
            window: '1 hour'
          },
          authentication: 'api-key',
          documentation: '/docs/api/analytics',
          lastUsed: '2 minutes ago',
          usage: {
            total: 15420,
            successful: 15380,
            failed: 40
          }
        },
        {
          id: '2',
          name: 'AI Content Generation',
          url: '/api/ai/generate',
          method: 'POST',
          status: 'active',
          rateLimit: {
            requests: 100,
            window: '1 hour'
          },
          authentication: 'oauth2',
          documentation: '/docs/api/ai',
          lastUsed: '5 minutes ago',
          usage: {
            total: 8920,
            successful: 8840,
            failed: 80
          }
        },
        {
          id: '3',
          name: 'Platform Integration',
          url: '/api/integrations/platforms',
          method: 'GET',
          status: 'active',
          rateLimit: {
            requests: 500,
            window: '1 hour'
          },
          authentication: 'api-key',
          documentation: '/docs/api/integrations',
          lastUsed: '1 minute ago',
          usage: {
            total: 2340,
            successful: 2320,
            failed: 20
          }
        }
      ];

      setIntegrations(mockIntegrations);
      setWorkflows(mockWorkflows);
      setApiEndpoints(mockApiEndpoints);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load integration data');
    } finally {
      setLoading(false);
    }
  };

  const toggleIntegrationStatus = (integrationId: string, action: 'connect' | 'disconnect' | 'sync') => {
    setIntegrations(prev => prev.map(integration => {
      if (integration.id === integrationId) {
        let newStatus: Integration['status'] = integration.status;
        switch (action) {
          case 'connect':
            newStatus = 'connected';
            break;
          case 'disconnect':
            newStatus = 'disconnected';
            break;
          case 'sync':
            newStatus = 'syncing';
            break;
        }
        return { ...integration, status: newStatus };
      }
      return integration;
    }));
  };

  const toggleWorkflowStatus = (workflowId: string) => {
    setWorkflows(prev => prev.map(workflow => {
      if (workflow.id === workflowId) {
        const newStatus = workflow.status === 'active' ? 'paused' : 'active';
        return { ...workflow, status: newStatus };
      }
      return workflow;
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active':
        return 'success';
      case 'disconnected':
      case 'paused':
        return 'default';
      case 'syncing':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
          Loading integration hub...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, pb: { xs: 12, sm: 8 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Integration Hub
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Advanced third-party platform integrations and workflow automation
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => setShowWorkflowDialog(true)}
          >
            Create Workflow
          </Button>
          <Button
            variant="contained"
            startIcon={<Link />}
            onClick={() => setShowConnectDialog(true)}
          >
            Connect Platform
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
          <IconButton size="small" onClick={loadIntegrationData} sx={{ ml: 1 }}>
            <Refresh />
          </IconButton>
        </Alert>
      )}

      {/* Integration Overview */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Connected Platforms
              </Typography>
              <Typography variant="h4">
                {integrations.filter(i => i.status === 'connected').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Active Workflows
              </Typography>
              <Typography variant="h4">
                {workflows.filter(w => w.status === 'active').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                API Endpoints
              </Typography>
              <Typography variant="h4">
                {apiEndpoints.filter(e => e.status === 'active').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Success Rate
              </Typography>
              <Typography variant="h4">
                {Math.round(workflows.reduce((acc, w) => acc + w.statistics.successRate, 0) / workflows.length)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Platform Integrations */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Platform Integrations
          </Typography>
          
          <Grid container spacing={2}>
            {integrations.map((integration) => (
              <Grid item xs={12} md={6} key={integration.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {integration.name}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                          <Chip 
                            label={integration.platform} 
                            size="small" 
                            color="primary"
                            variant="outlined"
                          />
                          <Chip 
                            label={integration.type} 
                            size="small" 
                            color="secondary"
                            variant="outlined"
                          />
                          <Chip 
                            label={integration.status} 
                            color={getStatusColor(integration.status) as any}
                            size="small"
                          />
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {integration.status === 'disconnected' && (
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => toggleIntegrationStatus(integration.id, 'connect')}
                          >
                            Connect
                          </Button>
                        )}
                        {integration.status === 'connected' && (
                          <>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => toggleIntegrationStatus(integration.id, 'sync')}
                            >
                              Sync
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => toggleIntegrationStatus(integration.id, 'disconnect')}
                            >
                              Disconnect
                            </Button>
                          </>
                        )}
                      </Box>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        API Key: {integration.apiKey} | Last sync: {integration.lastSync}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Next sync: {integration.nextSync} | Frequency: {integration.syncFrequency}
                      </Typography>
                    </Box>
                    
                    {/* Health Status */}
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle2">Health Status</Typography>
                        <Chip 
                          label={integration.health.status} 
                          color={getHealthColor(integration.health.status) as any}
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Response time: {integration.health.responseTime}ms | Error rate: {integration.health.errorRate}%
                      </Typography>
                      {integration.health.lastError && (
                        <Typography variant="body2" color="error.main">
                          Last error: {integration.health.lastError}
                        </Typography>
                      )}
                    </Box>
                    
                    {/* Data Usage */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        API Usage
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2">
                          {integration.dataUsage.requests.toLocaleString()} / {integration.dataUsage.limit.toLocaleString()}
                        </Typography>
                        <Typography variant="body2">
                          {Math.round((integration.dataUsage.requests / integration.dataUsage.limit) * 100)}%
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={(integration.dataUsage.requests / integration.dataUsage.limit) * 100}
                        color={integration.dataUsage.requests > integration.dataUsage.limit * 0.8 ? 'warning' : 'primary'}
                      />
                    </Box>
                    
                    {/* Permissions */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Permissions
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {integration.permissions.map((permission, index) => (
                          <Chip
                            key={index}
                            label={permission}
                            size="small"
                            color="info"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Automation Workflows */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Automation Workflows
          </Typography>
          
          <Stack spacing={2}>
            {workflows.map((workflow) => (
              <Card key={workflow.id} variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {workflow.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {workflow.description}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Chip 
                          label={workflow.status} 
                          color={getStatusColor(workflow.status) as any}
                          size="small"
                        />
                        <Chip 
                          label={workflow.schedule.frequency} 
                          size="small" 
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {workflow.status === 'paused' && (
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<PlayArrow />}
                          onClick={() => toggleWorkflowStatus(workflow.id)}
                        >
                          Activate
                        </Button>
                      )}
                      {workflow.status === 'active' && (
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Pause />}
                          onClick={() => toggleWorkflowStatus(workflow.id)}
                        >
                          Pause
                        </Button>
                      )}
                    </Box>
                  </Box>
                  
                  {/* Triggers and Actions */}
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Triggers
                      </Typography>
                      {workflow.triggers.map((trigger, index) => (
                        <Box key={index} sx={{ mb: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                          <Typography variant="body2">
                            <strong>{trigger.platform}</strong>: {trigger.event}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {trigger.conditions.join(', ')}
                          </Typography>
                        </Box>
                      ))}
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Actions
                      </Typography>
                      {workflow.actions.map((action, index) => (
                        <Box key={index} sx={{ mb: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                          <Typography variant="body2">
                            <strong>{action.platform}</strong>: {action.action}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {Object.entries(action.parameters).map(([key, value]) => `${key}: ${value}`).join(', ')}
                          </Typography>
                        </Box>
                      ))}
                    </Grid>
                  </Grid>
                  
                  {/* Statistics */}
                  <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Performance Statistics
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={3}>
                        <Typography variant="body2" color="text.secondary">
                          Executions
                        </Typography>
                        <Typography variant="h6">
                          {workflow.statistics.executions.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="body2" color="text.secondary">
                          Success Rate
                        </Typography>
                        <Typography variant="h6" color="success.main">
                          {workflow.statistics.successRate}%
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="body2" color="text.secondary">
                          Last Executed
                        </Typography>
                        <Typography variant="body2">
                          {workflow.statistics.lastExecuted}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="body2" color="text.secondary">
                          Avg Duration
                        </Typography>
                        <Typography variant="body2">
                          {workflow.statistics.averageDuration}s
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* API Endpoints */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            API Endpoints
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Endpoint</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Rate Limit</TableCell>
                  <TableCell>Authentication</TableCell>
                  <TableCell>Usage</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {apiEndpoints.map((endpoint) => (
                  <TableRow key={endpoint.id}>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2">{endpoint.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {endpoint.url}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={endpoint.method} 
                        size="small" 
                        color={endpoint.method === 'GET' ? 'success' : 'primary'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={endpoint.status} 
                        color={getStatusColor(endpoint.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {endpoint.rateLimit.requests}/{endpoint.rateLimit.window}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={endpoint.authentication} 
                        size="small" 
                        color="info"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          Success: {endpoint.usage.successful.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Failed: {endpoint.usage.failed.toLocaleString()}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small">
                          <Visibility />
                        </IconButton>
                        <IconButton size="small">
                          <Edit />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Connect Platform Dialog */}
      <Dialog open={showConnectDialog} onClose={() => setShowConnectDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Connect New Platform</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Connect a new third-party platform to automate workflows and sync data
          </Typography>
          {/* Platform connection form would go here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConnectDialog(false)}>Cancel</Button>
          <Button variant="contained">Connect Platform</Button>
        </DialogActions>
      </Dialog>

      {/* Create Workflow Dialog */}
      <Dialog open={showWorkflowDialog} onClose={() => setShowWorkflowDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Workflow</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Create an automated workflow to streamline your content creation and publishing process
          </Typography>
          {/* Workflow creation form would go here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowWorkflowDialog(false)}>Cancel</Button>
          <Button variant="contained">Create Workflow</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
