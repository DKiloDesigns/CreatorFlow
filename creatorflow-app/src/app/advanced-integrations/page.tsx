'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Button,
  Chip,
  Box,
  Typography,
  Grid,
  Tab,
  TextField,
  Tabs,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Settings, Zap, Code, Database, Cloud, Shield, Activity, RefreshCw, Plus, Plug, CheckCircle, TrendingUp, Eye, BarChart3, Webhook, Edit } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  type: 'api' | 'webhook' | 'oauth' | 'sdk';
  provider: string;
  status: 'active' | 'inactive' | 'error' | 'pending';
  config: any;
  credentials: any;
  webhooks: WebhookConfig[];
  syncSettings: SyncSettings;
  health: HealthStatus;
  createdAt: Date;
  updatedAt: Date;
  events: IntegrationEvent[];
}

interface WebhookConfig {
  id: string;
  url: string;
  events: string[];
  secret: string;
  status: 'active' | 'inactive' | 'error';
  lastTriggered?: Date;
  retryCount: number;
}

interface SyncSettings {
  mode: 'full' | 'incremental' | 'webhook';
  frequency: number;
  lastSync?: Date;
  nextSync?: Date;
  dataTypes: string[];
  filters: any;
}

interface HealthStatus {
  status: 'healthy' | 'warning' | 'error';
  lastCheck: Date;
  responseTime: number;
  errorRate: number;
  uptime: number;
  issues: HealthIssue[];
}

interface HealthIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  resolved: boolean;
}

interface IntegrationEvent {
  id: string;
  type: 'webhook' | 'sync' | 'auth' | 'error';
  data: any;
  status: 'success' | 'error' | 'pending';
  timestamp: Date;
  retryCount: number;
  errorMessage?: string;
}

interface IntegrationMetrics {
  totalIntegrations: number;
  activeIntegrations: number;
  errorIntegrations: number;
  totalEvents: number;
  successRate: number;
  averageResponseTime: number;
  lastSyncTime?: Date;
}

export default function AdvancedIntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [metrics, setMetrics] = useState<IntegrationMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateIntegration, setShowCreateIntegration] = useState(false);
  const [newIntegration, setNewIntegration] = useState({
    name: '',
    type: 'api' as const,
    provider: '',
    config: {},
  });

  useEffect(() => {
    fetchIntegrationsData();
  }, []);

  const fetchIntegrationsData = async () => {
    try {
      setLoading(true);
      
      const [integrationsRes, metricsRes] = await Promise.all([
        fetch('/api/integrations/advanced'),
        fetch('/api/integrations/advanced?type=metrics'),
      ]);

      if (integrationsRes.ok) {
        const integrationsData = await integrationsRes.json();
        setIntegrations(integrationsData.integrations || []);
      }

      if (metricsRes.ok) {
        const metricsData = await metricsRes.json();
        setMetrics(metricsData.metrics);
      }
    } catch (error) {
      console.error('Failed to fetch integrations data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createIntegration = async () => {
    try {
      const response = await fetch('/api/integrations/advanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_integration',
          data: newIntegration,
        }),
      });

      if (response.ok) {
        await fetchIntegrationsData();
        setShowCreateIntegration(false);
        setNewIntegration({ name: '', type: 'api', provider: '', config: {} });
      }
    } catch (error) {
      console.error('Failed to create integration:', error);
    }
  };

  const startSync = async (integrationId: string, mode: 'full' | 'incremental' | 'webhook' = 'incremental') => {
    try {
      const response = await fetch('/api/integrations/advanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start_sync',
          data: { integrationId, mode },
        }),
      });

      if (response.ok) {
        await fetchIntegrationsData();
      }
    } catch (error) {
      console.error('Failed to start sync:', error);
    }
  };

  const checkHealth = async (integrationId: string) => {
    try {
      const response = await fetch('/api/integrations/advanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'check_health',
          data: { integrationId },
        }),
      });

      if (response.ok) {
        await fetchIntegrationsData();
      }
    } catch (error) {
      console.error('Failed to check health:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'api': return <Cloud className="h-4 w-4" />;
      case 'webhook': return <Code className="h-4 w-4" />;
      case 'oauth': return <Shield className="h-4 w-4" />;
      case 'sdk': return <Zap className="h-4 w-4" />;
      default: return <Cloud className="h-4 w-4" />;
    }
  };

  if (loading) return <Box sx={{ p: 4 }}>Loading advanced integrations data...</Box>;

  return (
    <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Cloud className="h-8 w-8" />
            Advanced Integrations
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Comprehensive third-party service integration management
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={() => setShowCreateIntegration(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Integration
          </Button>
        </Box>
      </Box>

      {/* Integration Overview */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={3} component="div">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Typography variant="h6" className="text-sm font-medium">Total Integrations</Typography>
              <Plug className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.totalIntegrations || 0}</div>
              <p className="text-xs text-muted-foreground">
                All integrations
              </p>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Typography variant="h6" className="text-sm font-medium">Active Integrations</Typography>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {metrics?.activeIntegrations || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Healthy integrations
              </p>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Typography variant="h6" className="text-sm font-medium">Success Rate</Typography>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {metrics?.successRate || 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Event success rate
              </p>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Typography variant="h6" className="text-sm font-medium">Avg Response</Typography>
              <Activity className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {metrics?.averageResponseTime || 0}ms
              </div>
              <p className="text-xs text-muted-foreground">
                Response time
              </p>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Tabs value={activeTab} onChange={(e, value) => setActiveTab(value)} sx={{ mb: 3 }}>
        <Tab label="Overview" value="overview" />
        <Tab label="Integrations" value="integrations" />
        <Tab label="Webhooks" value="webhooks" />
        <Tab label="Sync" value="sync" />
        <Tab label="Health" value="health" />
      </Tabs>

        {activeTab === 'overview' && (
          <Box sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader>
                  <Typography variant="h6" className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Events
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Latest integration events and activities
                  </Typography>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {integrations.slice(0, 3).flatMap(integration => 
                      integration.events.slice(0, 2).map(event => (
                        <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h3 className="font-semibold">{integration.name}</h3>
                            <p className="text-sm text-muted-foreground">{event.type}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Chip 
                                label={event.status}
                                color={event.status === 'success' ? 'success' : 'error'}
                                size="small"
                              />
                              <span className="text-xs text-muted-foreground">
                                {new Date(event.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <Button size="small" variant="outlined">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader>
                  <Typography variant="h6" className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Integration Types
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Distribution of integration types
                  </Typography>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['api', 'webhook', 'oauth', 'sdk'].map(type => {
                      const count = integrations.filter(i => i.type === type).length;
                      const percentage = integrations.length > 0 ? (count / integrations.length) * 100 : 0;
                      
                      return (
                        <div key={type} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(type)}
                            <span className="text-sm font-medium capitalize">{type}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">{count}</span>
                            <span className="text-xs text-muted-foreground">({percentage.toFixed(1)}%)</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          </Box>
        )}

        {activeTab === 'integrations' && (
          <Box sx={{ mt: 3 }}>
          <Card>
            <CardHeader>
              <Typography variant="h6" className="flex items-center gap-2">
                <Plug className="h-5 w-5" />
                Integrations
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage your third-party service integrations
              </Typography>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Plug className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p>No integrations found. Create your first integration to get started.</p>
                  </div>
                ) : (
                  integrations.map((integration) => (
                    <div key={integration.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getTypeIcon(integration.type)}
                            <h3 className="font-semibold">{integration.name}</h3>
                            <Chip 
                              label={integration.status}
                              color={integration.status === 'active' ? 'success' : integration.status === 'inactive' ? 'default' : 'error'}
                              size="small"
                            />
                            <Chip 
                              label={integration.health.status}
                              color={integration.health.status === 'healthy' ? 'success' : integration.health.status === 'warning' ? 'warning' : 'error'}
                              size="small"
                            />
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{integration.provider}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span>{integration.webhooks.length} webhooks</span>
                            <span>{integration.events.length} events</span>
                            <span>Created {new Date(integration.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="small" variant="outlined" onClick={() => checkHealth(integration.id)}>
                            <Activity className="h-3 w-3" />
                          </Button>
                          <Button size="small" variant="outlined" onClick={() => startSync(integration.id)}>
                            <RefreshCw className="h-3 w-3" />
                          </Button>
                          <Button size="small" variant="outlined">
                            <Settings className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
          </Box>
        )}

        {activeTab === 'webhooks' && (
          <Box sx={{ mt: 3 }}>
          <Card>
            <CardHeader>
              <Typography variant="h6" className="flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                Webhook Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Monitor and manage webhook configurations
              </Typography>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrations.flatMap(integration => 
                  integration.webhooks.map(webhook => (
                    <div key={webhook.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{integration.name}</h3>
                            <Chip 
                              label={webhook.status}
                              color={webhook.status === 'active' ? 'success' : 'default'}
                              size="small"
                            />
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{webhook.url}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span>{webhook.events.length} events</span>
                            <span>{webhook.retryCount} retries</span>
                            {webhook.lastTriggered && (
                              <span>Last: {new Date(webhook.lastTriggered).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="small" variant="outlined">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="small" variant="outlined">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
          </Box>
        )}

        {activeTab === 'sync' && (
          <Box sx={{ mt: 3 }}>
          <Card>
            <CardHeader>
              <Typography variant="h6" className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Sync Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Monitor data synchronization status and schedules
              </Typography>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrations.map((integration) => (
                  <div key={integration.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{integration.name}</h3>
                          <Chip label={integration.syncSettings.mode} variant="outlined" size="small" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Frequency:</span>
                            <span>{integration.syncSettings.frequency} minutes</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Last Sync:</span>
                            <span>
                              {integration.syncSettings.lastSync 
                                ? new Date(integration.syncSettings.lastSync).toLocaleDateString()
                                : 'Never'
                              }
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Next Sync:</span>
                            <span>
                              {integration.syncSettings.nextSync 
                                ? new Date(integration.syncSettings.nextSync).toLocaleDateString()
                                : 'Not scheduled'
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="small" variant="outlined" onClick={() => startSync(integration.id, 'incremental')}>
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                        <Button size="small" variant="outlined" onClick={() => startSync(integration.id, 'full')}>
                          <Database className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          </Box>
        )}

        {activeTab === 'health' && (
          <Box sx={{ mt: 3 }}>
          <Card>
            <CardHeader>
              <Typography variant="h6" className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Health Monitoring
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Integration health status and performance metrics
              </Typography>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrations.map((integration) => (
                  <div key={integration.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{integration.name}</h3>
                          <Chip 
                            label={integration.health.status}
                            color={integration.health.status === 'healthy' ? 'success' : integration.health.status === 'warning' ? 'warning' : 'error'}
                            size="small"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Response Time:</span>
                            <span>{integration.health.responseTime}ms</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Error Rate:</span>
                            <span>{integration.health.errorRate}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Uptime:</span>
                            <span>{integration.health.uptime}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Last Check:</span>
                            <span>{new Date(integration.health.lastCheck).toLocaleDateString()}</span>
                          </div>
                        </div>
                        {integration.health.issues.length > 0 && (
                          <div className="mt-3">
                            <span className="text-sm font-medium">Issues:</span>
                            <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                              {integration.health.issues.slice(0, 2).map(issue => (
                                <li key={issue.id}>• {issue.message}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button size="small" variant="outlined" onClick={() => checkHealth(integration.id)}>
                          <Activity className="h-3 w-3" />
                        </Button>
                        <Button size="small" variant="outlined">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          </Box>
        )}

      {/* Create Integration Modal */}
      {showCreateIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Integration</h2>
            <div className="space-y-4">
              <div>
                <Typography variant="body2" component="label" sx={{ mb: 1, display: 'block' }}>
                  Integration Name
                </Typography>
                <TextField
                  value={newIntegration.name}
                  onChange={(e) => setNewIntegration({ ...newIntegration, name: e.target.value })}
                  placeholder="Enter integration name"
                  fullWidth
                  size="small"
                />
              </div>
              <div>
                <Typography variant="body2" component="label" sx={{ mb: 1, display: 'block' }}>
                  Provider
                </Typography>
                <TextField
                  value={newIntegration.provider}
                  onChange={(e) => setNewIntegration({ ...newIntegration, provider: e.target.value })}
                  placeholder="Enter provider name"
                  fullWidth
                  size="small"
                />
              </div>
              <div>
                <FormControl fullWidth>
                  <InputLabel>Integration Type</InputLabel>
                  <Select
                    value={newIntegration.type}
                    onChange={(e) => setNewIntegration({ ...newIntegration, type: e.target.value as any })}
                    label="Integration Type"
                  >
                    <MenuItem value="api">API</MenuItem>
                    <MenuItem value="webhook">Webhook</MenuItem>
                    <MenuItem value="oauth">OAuth</MenuItem>
                    <MenuItem value="sdk">SDK</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="flex gap-2">
                <Button onClick={createIntegration} disabled={!newIntegration.name || !newIntegration.provider}>
                  Create Integration
                </Button>
                <Button variant="outlined" onClick={() => setShowCreateIntegration(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Box>
  );
} 