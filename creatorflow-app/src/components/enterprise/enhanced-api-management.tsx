"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  AlertTitle,
  Skeleton,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  LinearProgress,
  Tooltip
} from '@mui/material';
import {
  Api,
  Key,
  Webhook,
  Settings,
  Add,
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
  ContentCopy,
  Refresh,
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle,
  Error,
  Info,
  Security,
  Speed,
  Timer,
  DataUsage,
  Analytics,
  Code,
  BugReport,
  Monitor,
  Notifications,
  Schedule,
  History
} from '@mui/icons-material';
import { designTokens } from '@/lib/design-system';

interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  rateLimit: number;
  usage: number;
  status: 'active' | 'suspended' | 'expired';
  createdAt: string;
  lastUsed: string;
  expiresAt: string;
}

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive' | 'error';
  lastTriggered: string;
  successRate: number;
  retryCount: number;
}

interface APIMetric {
  id: string;
  endpoint: string;
  requests: number;
  responseTime: number;
  errorRate: number;
  status: 'healthy' | 'warning' | 'critical';
}

export default function EnhancedAPIManagement() {
  const [activeTab, setActiveTab] = useState(0);
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [apiMetrics, setApiMetrics] = useState<APIMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showKeyDialog, setShowKeyDialog] = useState(false);
  const [showWebhookDialog, setShowWebhookDialog] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      setApiKeys([
        {
          id: 'key-1',
          name: 'Production API Key',
          key: 'sk_prod_1234567890abcdef',
          permissions: ['read', 'write', 'admin'],
          rateLimit: 1000,
          usage: 750,
          status: 'active',
          createdAt: '2024-01-01T00:00:00Z',
          lastUsed: '2024-01-15T10:30:00Z',
          expiresAt: '2025-01-01T00:00:00Z'
        },
        {
          id: 'key-2',
          name: 'Development API Key',
          key: 'sk_dev_abcdef1234567890',
          permissions: ['read', 'write'],
          rateLimit: 100,
          usage: 45,
          status: 'active',
          createdAt: '2024-01-10T00:00:00Z',
          lastUsed: '2024-01-15T09:15:00Z',
          expiresAt: '2024-12-31T00:00:00Z'
        }
      ]);

      setWebhooks([
        {
          id: 'webhook-1',
          name: 'Content Updates',
          url: 'https://api.company.com/webhooks/content',
          events: ['content.created', 'content.updated'],
          status: 'active',
          lastTriggered: '2024-01-15T10:30:00Z',
          successRate: 98.5,
          retryCount: 2
        },
        {
          id: 'webhook-2',
          name: 'User Activity',
          url: 'https://api.company.com/webhooks/users',
          events: ['user.login', 'user.logout'],
          status: 'active',
          lastTriggered: '2024-01-15T11:45:00Z',
          successRate: 99.2,
          retryCount: 1
        }
      ]);

      setApiMetrics([
        {
          id: 'metric-1',
          endpoint: '/api/content',
          requests: 15420,
          responseTime: 125,
          errorRate: 0.5,
          status: 'healthy'
        },
        {
          id: 'metric-2',
          endpoint: '/api/users',
          requests: 8920,
          responseTime: 89,
          errorRate: 0.2,
          status: 'healthy'
        },
        {
          id: 'metric-3',
          endpoint: '/api/analytics',
          requests: 5670,
          responseTime: 234,
          errorRate: 1.2,
          status: 'warning'
        }
      ]);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'healthy':
        return designTokens.colors.success[500];
      case 'warning':
        return designTokens.colors.warning[500];
      case 'critical':
      case 'error':
      case 'suspended':
        return designTokens.colors.error[500];
      default:
        return designTokens.colors.neutral[500];
    }
  };

  const renderAPIKeysTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ color: designTokens.colors.neutral[800] }}>
          API Keys & Permissions
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setShowKeyDialog(true)}
        >
          Generate API Key
        </Button>
      </Box>

      <Grid container spacing={3}>
        {apiKeys.map((key) => (
          <Grid item xs={12} md={6} key={key.id}>
            <Card elevation={0} sx={{ border: `1px solid ${designTokens.colors.neutral[200]}` }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ color: designTokens.colors.neutral[800] }}>
                      {key.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                      {key.key.substring(0, 8)}...{key.key.substring(key.key.length - 4)}
                    </Typography>
                  </Box>
                  <Chip
                    label={key.status}
                    size="small"
                    sx={{
                      background: `${getStatusColor(key.status)}15`,
                      color: getStatusColor(key.status),
                      fontWeight: 'medium',
                      textTransform: 'capitalize'
                    }}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: designTokens.colors.neutral[700], mb: 1 }}>
                    Permissions
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {key.permissions.map((permission, index) => (
                      <Chip
                        key={index}
                        label={permission}
                        size="small"
                        sx={{
                          background: designTokens.colors.primary[100],
                          color: designTokens.colors.primary[700],
                          fontSize: '0.7rem'
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                      Usage: {key.usage}/{key.rateLimit}
                    </Typography>
                    <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                      {((key.usage / key.rateLimit) * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(key.usage / key.rateLimit) * 100}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: designTokens.colors.neutral[200],
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: designTokens.colors.primary[500],
                        borderRadius: 4
                      }
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton size="small" sx={{ color: designTokens.colors.primary[600] }}>
                    <Edit />
                  </IconButton>
                  <IconButton size="small" sx={{ color: designTokens.colors.neutral[600] }}>
                    <ContentCopy />
                  </IconButton>
                  <IconButton size="small" sx={{ color: designTokens.colors.error[600] }}>
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

  const renderWebhooksTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ color: designTokens.colors.neutral[800] }}>
          Webhook Configuration
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setShowWebhookDialog(true)}
        >
          Add Webhook
        </Button>
      </Box>

      <Grid container spacing={3}>
        {webhooks.map((webhook) => (
          <Grid item xs={12} md={6} key={webhook.id}>
            <Card elevation={0} sx={{ border: `1px solid ${designTokens.colors.neutral[200]}` }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ color: designTokens.colors.neutral[800] }}>
                      {webhook.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                      {webhook.url}
                    </Typography>
                  </Box>
                  <Chip
                    label={webhook.status}
                    size="small"
                    sx={{
                      background: `${getStatusColor(webhook.status)}15`,
                      color: getStatusColor(webhook.status),
                      fontWeight: 'medium',
                      textTransform: 'capitalize'
                    }}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: designTokens.colors.neutral[700], mb: 1 }}>
                    Events
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {webhook.events.map((event, index) => (
                      <Chip
                        key={index}
                        label={event}
                        size="small"
                        sx={{
                          background: designTokens.colors.warning[100],
                          color: designTokens.colors.warning[700],
                          fontSize: '0.7rem'
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                      Success Rate: {webhook.successRate}%
                    </Typography>
                    <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                      Retries: {webhook.retryCount}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={webhook.successRate}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: designTokens.colors.neutral[200],
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: designTokens.colors.success[500],
                        borderRadius: 4
                      }
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton size="small" sx={{ color: designTokens.colors.primary[600] }}>
                    <Edit />
                  </IconButton>
                  <IconButton size="small" sx={{ color: designTokens.colors.neutral[600] }}>
                    <Test />
                  </IconButton>
                  <IconButton size="small" sx={{ color: designTokens.colors.error[600] }}>
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

  const renderMetricsTab = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, color: designTokens.colors.neutral[800] }}>
        API Performance Metrics
      </Typography>

      <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${designTokens.colors.neutral[200]}` }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Endpoint</TableCell>
              <TableCell align="right">Requests</TableCell>
              <TableCell align="right">Response Time (ms)</TableCell>
              <TableCell align="right">Error Rate (%)</TableCell>
              <TableCell align="center">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {apiMetrics.map((metric) => (
              <TableRow key={metric.id}>
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {metric.endpoint}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2">
                    {metric.requests.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2">
                    {metric.responseTime}ms
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2">
                    {metric.errorRate}%
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={metric.status}
                    size="small"
                    sx={{
                      background: `${getStatusColor(metric.status)}15`,
                      color: getStatusColor(metric.status),
                      fontWeight: 'medium',
                      textTransform: 'capitalize'
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" width="60%" height={48} />
        <Skeleton variant="text" width="40%" height={24} />
        <Box sx={{ mt: 4 }}>
          <Grid container spacing={3}>
            {[1, 2].map((item) => (
              <Grid item xs={12} md={6} key={item}>
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
              background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: designTokens.colors.warning[600]
            }}
          >
            <Api sx={{ fontSize: 28 }} />
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
              Enhanced API Management
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: designTokens.colors.neutral[600],
                fontWeight: designTokens.typography.fontWeight.normal
              }}
            >
              Enterprise-grade API key management, webhook configuration, and performance monitoring
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Security Alert */}
      <Alert 
        severity="warning" 
        sx={{ 
          mb: 4,
          background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)',
          border: `1px solid ${designTokens.colors.warning[200]}`,
          borderRadius: designTokens.borderRadius.lg
        }}
      >
        <AlertTitle sx={{ color: designTokens.colors.warning[700] }}>
          🔐 API Security Monitoring Active
        </AlertTitle>
        <Typography variant="body2" sx={{ color: designTokens.colors.warning[700] }}>
          Your API security system is monitoring {apiKeys.length} active API keys and {webhooks.length} webhook endpoints. 
          Last security scan: 2 minutes ago. All endpoints are currently secure.
        </Typography>
      </Alert>

      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="API Keys" />
          <Tab label="Webhooks" />
          <Tab label="Performance" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && renderAPIKeysTab()}
      {activeTab === 1 && renderWebhooksTab()}
      {activeTab === 2 && renderMetricsTab()}

      {/* Generate API Key Dialog */}
      <Dialog open={showKeyDialog} onClose={() => setShowKeyDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Generate New API Key</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Key Name"
            placeholder="Enter API key name"
            sx={{ mb: 2, mt: 1 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Permissions</InputLabel>
            <Select label="Permissions" multiple>
              <MenuItem value="read">Read</MenuItem>
              <MenuItem value="write">Write</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Rate Limit (requests/hour)"
            type="number"
            defaultValue={1000}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowKeyDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setShowKeyDialog(false)}>
            Generate Key
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Webhook Dialog */}
      <Dialog open={showWebhookDialog} onClose={() => setShowWebhookDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Webhook</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Webhook Name"
            placeholder="Enter webhook name"
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="Webhook URL"
            placeholder="https://your-domain.com/webhook"
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Events</InputLabel>
            <Select label="Events" multiple>
              <MenuItem value="content.created">Content Created</MenuItem>
              <MenuItem value="content.updated">Content Updated</MenuItem>
              <MenuItem value="user.login">User Login</MenuItem>
              <MenuItem value="user.logout">User Logout</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowWebhookDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setShowWebhookDialog(false)}>
            Add Webhook
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
