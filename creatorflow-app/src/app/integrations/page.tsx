'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Button,
  Box,
  Typography,
  Grid,
  Tabs,
  Tab,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { Plug, Activity, Settings } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  type: 'api' | 'webhook' | 'oauth' | 'webhook';
  provider: string;
  config: any;
  status: 'active' | 'inactive' | 'error';
  lastSync?: Date;
  errorCount: number;
  metadata: any;
  health: {
    healthy: boolean;
    issues: string[];
  };
}

interface WebhookEvent {
  id: string;
  integrationId: string;
  eventType: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  timestamp: Date;
  retryCount: number;
}

interface IntegrationSync {
  id: string;
  integrationId: string;
  syncType: 'full' | 'incremental' | 'webhook';
  status: 'running' | 'completed' | 'failed';
  recordsProcessed: number;
  startTime: Date;
  endTime?: Date;
  error?: string;
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [webhookEvents, setWebhookEvents] = useState<WebhookEvent[]>([]);
  const [syncs, setSyncs] = useState<IntegrationSync[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [providerFilter, setProviderFilter] = useState('all');

  useEffect(() => {
    fetchIntegrationsData();
  }, [statusFilter, providerFilter]);

  const fetchIntegrationsData = async () => {
    try {
      setLoading(true);
      
      const [integrationsRes, webhooksRes, syncsRes] = await Promise.all([
        fetch(`/api/integrations?status=${statusFilter}&provider=${providerFilter}`),
        fetch('/api/integrations/webhooks'),
        fetch('/api/integrations/syncs'),
      ]);

      if (integrationsRes.ok) {
        const integrationsData = await integrationsRes.json();
        setIntegrations(integrationsData.integrations || []);
      }

      if (webhooksRes.ok) {
        const webhooksData = await webhooksRes.json();
        setWebhookEvents(webhooksData.events || []);
      }

      if (syncsRes.ok) {
        const syncsData = await syncsRes.json();
        setSyncs(syncsData.syncs || []);
      }
    } catch (error) {
      console.error('Failed to fetch integrations data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchIntegrationsData();
    setRefreshing(false);
  };

  const startSync = async (integrationId: string) => {
    try {
      const response = await fetch('/api/integrations/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ integrationId, syncType: 'full' }),
      });

      if (response.ok) {
        await fetchIntegrationsData();
      }
    } catch (error) {
      console.error('Failed to start sync:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'stripe': return <Plug className="h-5 w-5" />;
      case 'slack': return <Plug className="h-5 w-5" />;
      case 'google': return <Plug className="h-5 w-5" />;
      default: return <Settings className="h-5 w-5" />;
    }
  };

  const getHealthIcon = (healthy: boolean) => {
    return healthy ? (
      <Activity className="h-5 w-5 text-green-600" />
    ) : (
      <Plug className="h-5 w-5 text-red-600" />
    );
  };

  if (loading) return <div className="p-8">Loading integrations data...</div>;

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Integrations</h1>
          <p className="text-muted-foreground">Manage third-party services and webhooks</p>
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
          <Select value={providerFilter} onValueChange={setProviderFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Providers</SelectItem>
              <SelectItem value="stripe">Stripe</SelectItem>
              <SelectItem value="slack">Slack</SelectItem>
              <SelectItem value="google">Google</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={refreshData} disabled={refreshing} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Integration
          </Button>
        </div>
      </div>

      {/* Integration Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Typography variant="subtitle2" className="text-sm font-medium">Total Integrations</Typography>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{integrations.length}</div>
            <p className="text-xs text-muted-foreground">
              Connected services
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
              {integrations.filter(i => i.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Working properly
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Webhook Events</CardTitle>
            <Webhook className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {webhookEvents.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Last 24 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sync Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {syncs.length > 0 
                ? Math.round((syncs.filter(s => s.status === 'completed').length / syncs.length) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Successful syncs
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="integrations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="syncs">Syncs</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Connected Services
              </CardTitle>
              <CardDescription>
                Manage your third-party integrations and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No integrations found
                  </div>
                ) : (
                  integrations.map((integration) => (
                    <div key={integration.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getProviderIcon(integration.provider)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{integration.name}</h3>
                              <Badge className={getStatusColor(integration.status)}>
                                {integration.status}
                              </Badge>
                              {getHealthIcon(integration.health.healthy)}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {integration.provider} • {integration.type}
                            </p>
                            <div className="text-xs space-y-1">
                              <div>Error Count: {integration.errorCount}</div>
                              {integration.lastSync && (
                                <div>Last Sync: {new Date(integration.lastSync).toLocaleString()}</div>
                              )}
                              {integration.health.issues.length > 0 && (
                                <div className="text-red-600">
                                  Issues: {integration.health.issues.join(', ')}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => startSync(integration.id)}
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Sync
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

        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                Webhook Events
              </CardTitle>
              <CardDescription>
                Monitor webhook events and their processing status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {webhookEvents.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No webhook events found
                  </div>
                ) : (
                  webhookEvents.map((event) => (
                    <div key={event.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{event.eventType}</h3>
                            <Badge variant={event.status === 'completed' ? 'default' : event.status === 'failed' ? 'destructive' : 'secondary'}>
                              {event.status}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Integration: {event.integrationId} • 
                            Time: {new Date(event.timestamp).toLocaleString()} • 
                            Retries: {event.retryCount}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                          {event.status === 'failed' && (
                            <Button size="sm" variant="outline">
                              <RefreshCw className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="syncs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Sync History
              </CardTitle>
              <CardDescription>
                Track data synchronization between services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {syncs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No sync history found
                  </div>
                ) : (
                  syncs.map((sync) => (
                    <div key={sync.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{sync.syncType} Sync</h3>
                            <Badge variant={sync.status === 'completed' ? 'default' : sync.status === 'failed' ? 'destructive' : 'secondary'}>
                              {sync.status}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <div>Integration: {sync.integrationId}</div>
                            <div>Records: {sync.recordsProcessed}</div>
                            <div>Started: {new Date(sync.startTime).toLocaleString()}</div>
                            {sync.endTime && (
                              <div>Ended: {new Date(sync.endTime).toLocaleString()}</div>
                            )}
                            {sync.error && (
                              <div className="text-red-600">Error: {sync.error}</div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
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
      </Tabs>
    </div>
  );
} 