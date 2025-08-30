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
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  InputAdornment,
  Slider,
  AlertTitle
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
  Code,
  Api,
  Webhook,
  Key,
  Security,
  Speed,
  Storage,
  Refresh,
  FilterList,
  Search,
  MoreVert,
  Download,
  Share,
  Settings,
  Dashboard,
  Assessment,
  Business,
  School,
  Work,
  CheckCircle,
  Warning,
  Error,
  Info,
  ExpandMore,
  Palette,
  Cloud,
  Timeline,
  Compare,
  AutoAwesome,
  DataUsage,
  Insights,
  Report,
  Schedule,
  Notifications,
  Lock,
  Public,
  ContentCopy,
  QrCode,
  History,
  TrendingUp,
  TrendingDown,
  Bolt,
  Timer,
  Memory,
  NetworkCheck,
  Router,
  Storage as StorageIcon,
  DeveloperMode,
  BugReport,
  Build,
  IntegrationInstructions
} from '@mui/icons-material';

interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  rateLimit: number;
  usage: {
    current: number;
    limit: number;
    resetDate: string;
  };
  status: 'active' | 'inactive' | 'expired';
  createdAt: string;
  lastUsed: string;
  createdBy: string;
  isPublic: boolean;
  description?: string;
}

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive' | 'failed';
  secret?: string;
  retryCount: number;
  lastTriggered: string;
  successRate: number;
  createdAt: string;
  createdBy: string;
  headers?: Record<string, string>;
  timeout: number;
}

interface APIMetric {
  id: string;
  endpoint: string;
  method: string;
  calls: number;
  avgResponseTime: number;
  errorRate: number;
  lastCalled: string;
  status: 'healthy' | 'warning' | 'error';
}

interface RateLimit {
  id: string;
  name: string;
  requests: number;
  window: string;
  burst: number;
  isActive: boolean;
  appliedTo: string[];
  createdAt: string;
}

interface Integration {
  id: string;
  name: string;
  type: 'webhook' | 'api' | 'sdk' | 'plugin';
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  syncFrequency: string;
  dataTransferred: number;
  errorCount: number;
  createdAt: string;
}

export default function APIManagement() {
  const [activeTab, setActiveTab] = useState(0);
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [metrics, setMetrics] = useState<APIMetric[]>([]);
  const [rateLimits, setRateLimits] = useState<RateLimit[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Dialog states
  const [showAPIKeyDialog, setShowAPIKeyDialog] = useState(false);
  const [showWebhookDialog, setShowWebhookDialog] = useState(false);
  const [showRateLimitDialog, setShowRateLimitDialog] = useState(false);
  const [showIntegrationDialog, setShowIntegrationDialog] = useState(false);
  
  // Form states
  const [apiKeyForm, setApiKeyForm] = useState({
    name: '',
    permissions: [] as string[],
    rateLimit: 1000,
    description: ''
  });

  const [webhookForm, setWebhookForm] = useState({
    name: '',
    url: '',
    events: [] as string[],
    timeout: 30,
    headers: {} as Record<string, string>
  });

  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockAPIKeys: APIKey[] = [
        {
          id: '1',
          name: 'Production API Key',
          key: 'cf_live_1234567890abcdef',
          permissions: ['read', 'write', 'analytics'],
          rateLimit: 10000,
          usage: {
            current: 7500,
            limit: 10000,
            resetDate: new Date(Date.now() + 86400000).toISOString()
          },
          status: 'active',
          createdAt: '2024-01-15T00:00:00Z',
          lastUsed: new Date().toISOString(),
          createdBy: 'Darrell Mayberry',
          isPublic: false,
          description: 'Primary API key for production applications'
        },
        {
          id: '2',
          name: 'Development API Key',
          key: 'cf_dev_0987654321fedcba',
          permissions: ['read', 'write'],
          rateLimit: 1000,
          usage: {
            current: 250,
            limit: 1000,
            resetDate: new Date(Date.now() + 86400000).toISOString()
          },
          status: 'active',
          createdAt: '2024-03-20T00:00:00Z',
          lastUsed: new Date(Date.now() - 3600000).toISOString(),
          createdBy: 'Sarah Chen',
          isPublic: false,
          description: 'API key for development and testing'
        },
        {
          id: '3',
          name: 'Public Read-Only Key',
          key: 'cf_public_readonly_abcdef123456',
          permissions: ['read'],
          rateLimit: 100,
          usage: {
            current: 45,
            limit: 100,
            resetDate: new Date(Date.now() + 86400000).toISOString()
          },
          status: 'active',
          createdAt: '2024-05-10T00:00:00Z',
          lastUsed: new Date(Date.now() - 7200000).toISOString(),
          createdBy: 'Mike Rodriguez',
          isPublic: true,
          description: 'Public API key for read-only access'
        }
      ];

      const mockWebhooks: Webhook[] = [
        {
          id: '1',
          name: 'Content Published Webhook',
          url: 'https://api.example.com/webhooks/content-published',
          events: ['content.published', 'content.updated'],
          status: 'active',
          secret: 'whsec_1234567890abcdef',
          retryCount: 3,
          lastTriggered: new Date().toISOString(),
          successRate: 98.5,
          createdAt: '2024-01-15T00:00:00Z',
          createdBy: 'Darrell Mayberry',
          headers: { 'Authorization': 'Bearer token123' },
          timeout: 30
        },
        {
          id: '2',
          name: 'Analytics Update Webhook',
          url: 'https://analytics.example.com/webhooks/update',
          events: ['analytics.updated', 'metrics.computed'],
          status: 'active',
          secret: 'whsec_0987654321fedcba',
          retryCount: 5,
          lastTriggered: new Date(Date.now() - 3600000).toISOString(),
          successRate: 99.2,
          createdAt: '2024-03-20T00:00:00Z',
          createdBy: 'Sarah Chen',
          headers: {},
          timeout: 60
        },
        {
          id: '3',
          name: 'Error Notification Webhook',
          url: 'https://alerts.example.com/webhooks/errors',
          events: ['error.occurred', 'system.alert'],
          status: 'failed',
          secret: 'whsec_abcdef1234567890',
          retryCount: 0,
          lastTriggered: new Date(Date.now() - 86400000).toISOString(),
          successRate: 0,
          createdAt: '2024-05-10T00:00:00Z',
          createdBy: 'Mike Rodriguez',
          headers: {},
          timeout: 15
        }
      ];

      const mockMetrics: APIMetric[] = [
        {
          id: '1',
          endpoint: '/api/content',
          method: 'GET',
          calls: 15420,
          avgResponseTime: 125,
          errorRate: 0.2,
          lastCalled: new Date().toISOString(),
          status: 'healthy'
        },
        {
          id: '2',
          endpoint: '/api/analytics',
          method: 'POST',
          calls: 8920,
          avgResponseTime: 89,
          errorRate: 0.1,
          lastCalled: new Date(Date.now() - 1800000).toISOString(),
          status: 'healthy'
        },
        {
          id: '3',
          endpoint: '/api/publish',
          method: 'POST',
          calls: 2340,
          avgResponseTime: 456,
          errorRate: 2.1,
          lastCalled: new Date(Date.now() - 3600000).toISOString(),
          status: 'warning'
        }
      ];

      const mockRateLimits: RateLimit[] = [
        {
          id: '1',
          name: 'Standard Rate Limit',
          requests: 1000,
          window: '1 hour',
          burst: 100,
          isActive: true,
          appliedTo: ['all'],
          createdAt: '2024-01-15T00:00:00Z'
        },
        {
          id: '2',
          name: 'Premium Rate Limit',
          requests: 10000,
          window: '1 hour',
          burst: 1000,
          isActive: true,
          appliedTo: ['premium_users'],
          createdAt: '2024-03-20T00:00:00Z'
        },
        {
          id: '3',
          name: 'Strict Rate Limit',
          requests: 100,
          window: '1 hour',
          burst: 10,
          isActive: false,
          appliedTo: ['public_api'],
          createdAt: '2024-05-10T00:00:00Z'
        }
      ];

      const mockIntegrations: Integration[] = [
        {
          id: '1',
          name: 'Slack Notifications',
          type: 'webhook',
          status: 'connected',
          lastSync: new Date().toISOString(),
          syncFrequency: 'real-time',
          dataTransferred: 156,
          errorCount: 0,
          createdAt: '2024-01-15T00:00:00Z'
        },
        {
          id: '2',
          name: 'Zapier Integration',
          type: 'api',
          status: 'connected',
          lastSync: new Date(Date.now() - 1800000).toISOString(),
          syncFrequency: '5 minutes',
          dataTransferred: 2340,
          errorCount: 2,
          createdAt: '2024-03-20T00:00:00Z'
        },
        {
          id: '3',
          name: 'WordPress Plugin',
          type: 'plugin',
          status: 'error',
          lastSync: new Date(Date.now() - 86400000).toISOString(),
          syncFrequency: '1 hour',
          dataTransferred: 0,
          errorCount: 15,
          createdAt: '2024-05-10T00:00:00Z'
        }
      ];

      setApiKeys(mockAPIKeys);
      setWebhooks(mockWebhooks);
      setMetrics(mockMetrics);
      setRateLimits(mockRateLimits);
      setIntegrations(mockIntegrations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load API management data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'connected':
      case 'healthy': return 'success';
      case 'warning': return 'warning';
      case 'error':
      case 'failed':
      case 'disconnected': return 'error';
      case 'inactive': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'connected':
      case 'healthy': return <CheckCircle />;
      case 'warning': return <Warning />;
      case 'error':
      case 'failed':
      case 'disconnected': return <Error />;
      case 'inactive': return <Info />;
      default: return <Info />;
    }
  };

  const getIntegrationIcon = (type: string) => {
    switch (type) {
      case 'webhook': return <Webhook />;
      case 'api': return <Api />;
      case 'sdk': return <Code />;
      case 'plugin': return <Extension />;
      default: return <IntegrationInstructions />;
    }
  };

  const handleCreateAPIKey = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newAPIKey: APIKey = {
        id: `key_${Date.now()}`,
        name: apiKeyForm.name,
        key: `cf_${Math.random().toString(36).substr(2, 9)}_${Date.now().toString(36)}`,
        permissions: apiKeyForm.permissions,
        rateLimit: apiKeyForm.rateLimit,
        usage: {
          current: 0,
          limit: apiKeyForm.rateLimit,
          resetDate: new Date(Date.now() + 86400000).toISOString()
        },
        status: 'active',
        createdAt: new Date().toISOString(),
        lastUsed: new Date().toISOString(),
        createdBy: 'Darrell Mayberry',
        isPublic: false,
        description: apiKeyForm.description
      };
      
      setApiKeys(prev => [newAPIKey, ...prev]);
      setShowAPIKeyDialog(false);
      setApiKeyForm({ name: '', permissions: [], rateLimit: 1000, description: '' });
    } catch (error) {
      console.error('Failed to create API key:', error);
    }
  };

  const handleCreateWebhook = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newWebhook: Webhook = {
        id: `webhook_${Date.now()}`,
        name: webhookForm.name,
        url: webhookForm.url,
        events: webhookForm.events,
        status: 'active',
        secret: `whsec_${Math.random().toString(36).substr(2, 16)}`,
        retryCount: 3,
        lastTriggered: new Date().toISOString(),
        successRate: 100,
        createdAt: new Date().toISOString(),
        createdBy: 'Darrell Mayberry',
        headers: webhookForm.headers,
        timeout: webhookForm.timeout
      };
      
      setWebhooks(prev => [newWebhook, ...prev]);
      setShowWebhookDialog(false);
      setWebhookForm({ name: '', url: '', events: [], timeout: 30, headers: {} });
    } catch (error) {
      console.error('Failed to create webhook:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5">API Keys</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowAPIKeyDialog(true)}
              >
                Create API Key
              </Button>
            </Box>
            
            <Grid container spacing={3}>
              {apiKeys.map((apiKey) => (
                <Grid item xs={12} md={6} lg={4} key={apiKey.id}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            {apiKey.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {apiKey.description || 'No description provided'}
                          </Typography>
                        </Box>
                        <IconButton size="small">
                          <MoreVert />
                        </IconButton>
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          API Key:
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TextField
                            value={apiKey.key}
                            size="small"
                            fullWidth
                            InputProps={{
                              readOnly: true,
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    size="small"
                                    onClick={() => copyToClipboard(apiKey.key)}
                                  >
                                    <ContentCopy />
                                  </IconButton>
                                </InputAdornment>
                              )
                            }}
                          />
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Chip
                          label={apiKey.status}
                          size="small"
                          color={getStatusColor(apiKey.status) as any}
                          icon={getStatusIcon(apiKey.status)}
                        />
                        {apiKey.isPublic && (
                          <Chip label="Public" size="small" color="info" variant="outlined" />
                        )}
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Usage: {apiKey.usage.current.toLocaleString()} / {apiKey.usage.limit.toLocaleString()}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={(apiKey.usage.current / apiKey.usage.limit) * 100}
                          color={apiKey.usage.current / apiKey.usage.limit > 0.8 ? 'warning' : 'primary'}
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button variant="outlined" size="small" startIcon={<Edit />}>
                          Edit
                        </Button>
                        <Button variant="outlined" size="small" startIcon={<History />}>
                          Usage
                        </Button>
                        <Button variant="outlined" size="small" startIcon={<Delete />}>
                          Revoke
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      
      case 1:
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5">Webhooks</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowWebhookDialog(true)}
              >
                Create Webhook
              </Button>
            </Box>
            
            <Grid container spacing={3}>
              {webhooks.map((webhook) => (
                <Grid item xs={12} md={6} key={webhook.id} component="div">
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            {webhook.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {webhook.url}
                          </Typography>
                        </Box>
                        <IconButton size="small">
                          <MoreVert />
                        </IconButton>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Chip
                          label={webhook.status}
                          size="small"
                          color={getStatusColor(webhook.status) as any}
                          icon={getStatusIcon(webhook.status)}
                        />
                        <Chip
                          label={`${webhook.successRate}% Success`}
                          size="small"
                          color={webhook.successRate > 95 ? 'success' : 'warning'}
                          variant="outlined"
                        />
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Events: {webhook.events.join(', ')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Last triggered: {new Date(webhook.lastTriggered).toLocaleString()}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button variant="outlined" size="small" startIcon={<Edit />}>
                          Edit
                        </Button>
                        <Button variant="outlined" size="small" startIcon={<History />}>
                          Logs
                        </Button>
                        <Button variant="outlined" size="small" startIcon={<Refresh />}>
                          Test
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      
      case 2:
        return (
          <Box>
            <Typography variant="h5" sx={{ mb: 3 }}>API Performance Metrics</Typography>
            
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Endpoint</TableCell>
                    <TableCell>Method</TableCell>
                    <TableCell>Calls</TableCell>
                    <TableCell>Avg Response Time</TableCell>
                    <TableCell>Error Rate</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Last Called</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {metrics.map((metric) => (
                    <TableRow key={metric.id}>
                      <TableCell>
                        <Typography variant="subtitle2">{metric.endpoint}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={metric.method}
                          size="small"
                          color={metric.method === 'GET' ? 'success' : 'primary'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {metric.calls.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {metric.avgResponseTime}ms
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color={metric.errorRate > 1 ? 'error.main' : 'inherit'}>
                          {metric.errorRate}%
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={metric.status}
                          size="small"
                          color={getStatusColor(metric.status) as any}
                          icon={getStatusIcon(metric.status)}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(metric.lastCalled).toLocaleString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );
      
      case 3:
        return (
          <Box>
            <Typography variant="h5" sx={{ mb: 3 }}>Rate Limits</Typography>
            
            <Grid container spacing={3}>
              {rateLimits.map((limit) => (
                <Grid item xs={12} md={6} lg={4} key={limit.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" gutterBottom>
                          {limit.name}
                        </Typography>
                        <Switch
                          checked={limit.isActive}
                          color="primary"
                        />
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          {limit.requests} requests per {limit.window}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Burst: {limit.burst} requests
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Applied to: {limit.appliedTo.join(', ')}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button variant="outlined" size="small" startIcon={<Edit />}>
                          Edit
                        </Button>
                        <Button variant="outlined" size="small" startIcon={<Settings />}>
                          Configure
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      
      case 4:
        return (
          <Box>
            <Typography variant="h5" sx={{ mb: 3 }}>Integrations</Typography>
            
            <Grid container spacing={3}>
              {integrations.map((integration) => (
                <Grid item xs={12} md={6} lg={4} key={integration.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getIntegrationIcon(integration.type)}
                          <Typography variant="h6" gutterBottom>
                            {integration.name}
                          </Typography>
                        </Box>
                        <IconButton size="small">
                          <MoreVert />
                        </IconButton>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Chip
                          label={integration.status}
                          size="small"
                          color={getStatusColor(integration.status) as any}
                          icon={getStatusIcon(integration.status)}
                        />
                        <Chip
                          label={integration.type}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Last sync: {new Date(integration.lastSync).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Frequency: {integration.syncFrequency}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Data transferred: {integration.dataTransferred.toLocaleString()} KB
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button variant="outlined" size="small" startIcon={<Edit />}>
                          Configure
                        </Button>
                        <Button variant="outlined" size="small" startIcon={<History />}>
                          Logs
                        </Button>
                        <Button variant="outlined" size="small" startIcon={<Refresh />}>
                          Sync Now
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
          Loading API management...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
        <IconButton size="small" onClick={loadMockData} sx={{ ml: 1 }}>
          <Refresh />
        </IconButton>
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 2, pb: { xs: 12, sm: 8 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            API & Webhook Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage API keys, webhooks, rate limits, and integrations
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<Settings />}>
            API Settings
          </Button>
          <Button variant="contained" startIcon={<Download />}>
            Export API Docs
          </Button>
        </Box>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Active API Keys
                  </Typography>
                  <Typography variant="h4">
                    {apiKeys.filter(k => k.status === 'active').length}
                  </Typography>
                </Box>
                <Key color="primary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Active Webhooks
                  </Typography>
                  <Typography variant="h4">
                    {webhooks.filter(w => w.status === 'active').length}
                  </Typography>
                </Box>
                <Webhook color="success" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total API Calls
                  </Typography>
                  <Typography variant="h4">
                    {metrics.reduce((sum, m) => sum + m.calls, 0).toLocaleString()}
                  </Typography>
                </Box>
                <Api color="warning" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Connected Integrations
                  </Typography>
                  <Typography variant="h4">
                    {integrations.filter(i => i.status === 'connected').length}
                  </Typography>
                </Box>
                <IntegrationInstructions color="info" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="API Keys" />
          <Tab label="Webhooks" />
          <Tab label="Performance" />
          <Tab label="Rate Limits" />
          <Tab label="Integrations" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Create API Key Dialog */}
      <Dialog open={showAPIKeyDialog} onClose={() => setShowAPIKeyDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create API Key</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Key Name"
              value={apiKeyForm.name}
              onChange={(e) => setApiKeyForm({ ...apiKeyForm, name: e.target.value })}
              required
            />
            
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={apiKeyForm.description}
              onChange={(e) => setApiKeyForm({ ...apiKeyForm, description: e.target.value })}
            />
            
            <FormControl fullWidth>
              <InputLabel>Rate Limit</InputLabel>
              <Select
                value={apiKeyForm.rateLimit}
                label="Rate Limit"
                onChange={(e) => setApiKeyForm({ ...apiKeyForm, rateLimit: e.target.value as number })}
              >
                <MenuItem value={100}>100 requests/hour</MenuItem>
                <MenuItem value={1000}>1,000 requests/hour</MenuItem>
                <MenuItem value={10000}>10,000 requests/hour</MenuItem>
                <MenuItem value={100000}>100,000 requests/hour</MenuItem>
              </Select>
            </FormControl>
            
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Permissions
              </Typography>
              <Grid container spacing={2}>
                {['read', 'write', 'analytics', 'admin'].map((permission) => (
                  <Grid item xs={6} key={permission}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={apiKeyForm.permissions.includes(permission)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setApiKeyForm({
                                ...apiKeyForm,
                                permissions: [...apiKeyForm.permissions, permission]
                              });
                            } else {
                              setApiKeyForm({
                                ...apiKeyForm,
                                permissions: apiKeyForm.permissions.filter(p => p !== permission)
                              });
                            }
                          }}
                        />
                      }
                      label={permission.charAt(0).toUpperCase() + permission.slice(1)}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAPIKeyDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateAPIKey} variant="contained">
            Create API Key
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Webhook Dialog */}
      <Dialog open={showWebhookDialog} onClose={() => setShowWebhookDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Webhook</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Webhook Name"
              value={webhookForm.name}
              onChange={(e) => setWebhookForm({ ...webhookForm, name: e.target.value })}
              required
            />
            
            <TextField
              fullWidth
              label="Webhook URL"
              value={webhookForm.url}
              onChange={(e) => setWebhookForm({ ...webhookForm, url: e.target.value })}
              required
              placeholder="https://your-domain.com/webhook-endpoint"
            />
            
            <FormControl fullWidth>
              <InputLabel>Events</InputLabel>
              <Select
                multiple
                value={webhookForm.events}
                label="Events"
                onChange={(e) => setWebhookForm({ ...webhookForm, events: e.target.value as string[] })}
              >
                <MenuItem value="content.published">Content Published</MenuItem>
                <MenuItem value="content.updated">Content Updated</MenuItem>
                <MenuItem value="content.deleted">Content Deleted</MenuItem>
                <MenuItem value="analytics.updated">Analytics Updated</MenuItem>
                <MenuItem value="user.registered">User Registered</MenuItem>
                <MenuItem value="error.occurred">Error Occurred</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Timeout (seconds)"
              type="number"
              value={webhookForm.timeout}
              onChange={(e) => setWebhookForm({ ...webhookForm, timeout: parseInt(e.target.value) })}
              inputProps={{ min: 5, max: 300 }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowWebhookDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateWebhook} variant="contained">
            Create Webhook
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
