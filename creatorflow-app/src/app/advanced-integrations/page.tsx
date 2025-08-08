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
  Tabs,
  Tab,
  TextField
} from '@mui/material';
import { Settings, Zap, Code, Database, Cloud, Shield, Activity } from 'lucide-react';

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

  if (loading) return <div className="p-8">Loading advanced integrations data...</div>;

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Cloud className="h-8 w-8" />
            Advanced Integrations
          </h1>
          <p className="text-muted-foreground">Comprehensive third-party service integration management</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowCreateIntegration(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Integration
          </Button>
        </div>
      </div>

      {/* Integration Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Integrations</CardTitle>
            <Plug className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalIntegrations || 0}</div>
            <p className="text-xs text-muted-foreground">
              All integrations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Integrations</CardTitle>
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
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
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="sync">Sync</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Events
                </CardTitle>
                <CardDescription>
                  Latest integration events and activities
                </CardDescription>
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
                            <Badge className={event.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                              {event.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(event.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Integration Types
                </CardTitle>
                <CardDescription>
                  Distribution of integration types
                </CardDescription>
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
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plug className="h-5 w-5" />
                Integrations
              </CardTitle>
              <CardDescription>
                Manage your third-party service integrations
              </CardDescription>
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
                            <Badge className={getStatusColor(integration.status)}>
                              {integration.status}
                            </Badge>
                            <Badge className={getHealthColor(integration.health.status)}>
                              {integration.health.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{integration.provider}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span>{integration.webhooks.length} webhooks</span>
                            <span>{integration.events.length} events</span>
                            <span>Created {new Date(integration.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => checkHealth(integration.id)}>
                            <Activity className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => startSync(integration.id)}>
                            <RefreshCw className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
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
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                Webhook Management
              </CardTitle>
              <CardDescription>
                Monitor and manage webhook configurations
              </CardDescription>
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
                            <Badge className={getStatusColor(webhook.status)}>
                              {webhook.status}
                            </Badge>
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
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
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
        </TabsContent>

        <TabsContent value="sync" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Sync Management
              </CardTitle>
              <CardDescription>
                Monitor data synchronization status and schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrations.map((integration) => (
                  <div key={integration.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{integration.name}</h3>
                          <Badge variant="outline">
                            {integration.syncSettings.mode}
                          </Badge>
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
                        <Button size="sm" variant="outline" onClick={() => startSync(integration.id, 'incremental')}>
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => startSync(integration.id, 'full')}>
                          <Database className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Health Monitoring
              </CardTitle>
              <CardDescription>
                Integration health status and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrations.map((integration) => (
                  <div key={integration.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{integration.name}</h3>
                          <Badge className={getHealthColor(integration.health.status)}>
                            {integration.health.status}
                          </Badge>
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
                        <Button size="sm" variant="outline" onClick={() => checkHealth(integration.id)}>
                          <Activity className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Integration Modal */}
      {showCreateIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Integration</h2>
            <div className="space-y-4">
              <div>
                <Label>Integration Name</Label>
                <Input
                  value={newIntegration.name}
                  onChange={(e) => setNewIntegration({ ...newIntegration, name: e.target.value })}
                  placeholder="Enter integration name"
                />
              </div>
              <div>
                <Label>Provider</Label>
                <Input
                  value={newIntegration.provider}
                  onChange={(e) => setNewIntegration({ ...newIntegration, provider: e.target.value })}
                  placeholder="Enter provider name"
                />
              </div>
              <div>
                <Label>Integration Type</Label>
                <Select
                  value={newIntegration.type}
                  onValueChange={(value: 'api' | 'webhook' | 'oauth' | 'sdk') => 
                    setNewIntegration({ ...newIntegration, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="api">API</SelectItem>
                    <SelectItem value="webhook">Webhook</SelectItem>
                    <SelectItem value="oauth">OAuth</SelectItem>
                    <SelectItem value="sdk">SDK</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={createIntegration} disabled={!newIntegration.name || !newIntegration.provider}>
                  Create Integration
                </Button>
                <Button variant="outline" onClick={() => setShowCreateIntegration(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 