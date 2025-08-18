'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Button,
  Box,
  Typography,
  Tabs,
  Tab,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Stack,
  Container
} from '@mui/material';
import { 
  Plug, 
  Activity, 
  Settings, 
  RefreshCw, 
  Plus, 
  CheckCircle, 
  Webhook, 
  TrendingUp, 
  Eye, 
  Database 
} from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState(0);

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
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'stripe': return <Plug style={{ width: 20, height: 20 }} />;
      case 'slack': return <Plug style={{ width: 20, height: 20 }} />;
      case 'google': return <Plug style={{ width: 20, height: 20 }} />;
      default: return <Settings style={{ width: 20, height: 20 }} />;
    }
  };

  const getHealthIcon = (healthy: boolean) => {
    return healthy ? (
      <Activity style={{ width: 20, height: 20, color: 'var(--mui-palette-success-main)' }} />
    ) : (
      <Plug style={{ width: 20, height: 20, color: 'var(--mui-palette-error-main)' }} />
    );
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (loading) return (
    <Box sx={{ p: 8, textAlign: 'center' }}>
      <Typography variant="h6">Loading integrations data...</Typography>
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={4}>
        {/* Header Section */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 2
        }}>
          <Box>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Integrations
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage third-party services and webhooks
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            gap: 2,
            width: { xs: '100%', md: 'auto' }
          }}>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Status Filter</InputLabel>
              <Select
                value={statusFilter}
                label="Status Filter"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="error">Error</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Provider Filter</InputLabel>
              <Select
                value={providerFilter}
                label="Provider Filter"
                onChange={(e) => setProviderFilter(e.target.value)}
              >
                <MenuItem value="all">All Providers</MenuItem>
                <MenuItem value="stripe">Stripe</MenuItem>
                <MenuItem value="slack">Slack</MenuItem>
                <MenuItem value="google">Google</MenuItem>
              </Select>
            </FormControl>
            
            <Button 
              onClick={refreshData} 
              disabled={refreshing} 
              variant="outlined"
              startIcon={<RefreshCw style={{ 
                width: 16, 
                height: 16,
                animation: refreshing ? 'spin 1s linear infinite' : 'none'
              }} />}
            >
              Refresh
            </Button>
            
            <Button
              variant="contained"
              startIcon={<Plus style={{ width: 16, height: 16 }} />}
            >
              Add Integration
            </Button>
          </Box>
        </Box>

        {/* Integration Overview Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
          <Card>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                    Total Integrations
                  </Typography>
                  <Settings style={{ width: 16, height: 16, color: 'var(--mui-palette-text-secondary)' }} />
                </Box>
              }
              sx={{ pb: 1 }}
            />
            <CardContent>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                {integrations.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Connected services
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                    Active Integrations
                  </Typography>
                  <CheckCircle style={{ width: 16, height: 16, color: 'var(--mui-palette-success-main)' }} />
                </Box>
              }
              sx={{ pb: 1 }}
            />
            <CardContent>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'success.main', mb: 0.5 }}>
                {integrations.filter(i => i.status === 'active').length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Working properly
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                    Webhook Events
                  </Typography>
                  <Webhook style={{ width: 16, height: 16, color: 'var(--mui-palette-primary-main)' }} />
                </Box>
              }
              sx={{ pb: 1 }}
            />
            <CardContent>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 0.5 }}>
                {webhookEvents.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Last 24 hours
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                    Sync Success Rate
                  </Typography>
                  <TrendingUp style={{ width: 16, height: 16, color: 'var(--mui-palette-success-main)' }} />
                </Box>
              }
              sx={{ pb: 1 }}
            />
            <CardContent>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'success.main', mb: 0.5 }}>
                {syncs.length > 0 
                  ? Math.round((syncs.filter(s => s.status === 'completed').length / syncs.length) * 100)
                  : 0}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Successful syncs
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Tabs Section */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="Integration tabs">
            <Tab label="Integrations" />
            <Tab label="Webhooks" />
            <Tab label="Syncs" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box role="tabpanel" hidden={activeTab !== 0}>
          {activeTab === 0 && (
            <Card>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Settings style={{ width: 20, height: 20 }} />
                    <Typography variant="h6">Connected Services</Typography>
                  </Box>
                }
                subheader="Manage your third-party integrations and their status"
              />
              <CardContent>
                <Stack spacing={2}>
                  {integrations.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography color="text.secondary">No integrations found</Typography>
                    </Box>
                  ) : (
                    integrations.map((integration) => (
                      <Paper key={integration.id} variant="outlined" sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flex: 1 }}>
                            {getProviderIcon(integration.provider)}
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                  {integration.name}
                                </Typography>
                                <Chip 
                                  label={integration.status} 
                                  color={getStatusColor(integration.status)}
                                  size="small"
                                />
                                {getHealthIcon(integration.health.healthy)}
                              </Box>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {integration.provider} • {integration.type}
                              </Typography>
                              <Stack spacing={0.5}>
                                <Typography variant="caption" color="text.secondary">
                                  Error Count: {integration.errorCount}
                                </Typography>
                                {integration.lastSync && (
                                  <Typography variant="caption" color="text.secondary">
                                    Last Sync: {new Date(integration.lastSync).toLocaleString()}
                                  </Typography>
                                )}
                                {integration.health.issues.length > 0 && (
                                  <Typography variant="caption" color="error.main">
                                    Issues: {integration.health.issues.join(', ')}
                                  </Typography>
                                )}
                              </Stack>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button 
                              size="small" 
                              variant="outlined"
                              onClick={() => startSync(integration.id)}
                              startIcon={<RefreshCw style={{ width: 14, height: 14 }} />}
                            >
                              Sync
                            </Button>
                            <Button size="small" variant="outlined">
                              <Settings style={{ width: 14, height: 14 }} />
                            </Button>
                          </Box>
                        </Box>
                      </Paper>
                    ))
                  )}
                </Stack>
              </CardContent>
            </Card>
          )}
        </Box>

        <Box role="tabpanel" hidden={activeTab !== 1}>
          {activeTab === 1 && (
            <Card>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Webhook style={{ width: 20, height: 20 }} />
                    <Typography variant="h6">Webhook Events</Typography>
                  </Box>
                }
                subheader="Monitor webhook events and their processing status"
              />
              <CardContent>
                <Stack spacing={2}>
                  {webhookEvents.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography color="text.secondary">No webhook events found</Typography>
                    </Box>
                  ) : (
                    webhookEvents.map((event) => (
                      <Paper key={event.id} variant="outlined" sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {event.eventType}
                              </Typography>
                              <Chip 
                                label={event.status} 
                                color={
                                  event.status === 'completed' ? 'success' : 
                                  event.status === 'failed' ? 'error' : 'default'
                                }
                                size="small"
                              />
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              Integration: {event.integrationId} • 
                              Time: {new Date(event.timestamp).toLocaleString()} • 
                              Retries: {event.retryCount}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button size="small" variant="outlined">
                              <Eye style={{ width: 14, height: 14 }} />
                            </Button>
                            {event.status === 'failed' && (
                              <Button size="small" variant="outlined">
                                <RefreshCw style={{ width: 14, height: 14 }} />
                              </Button>
                            )}
                          </Box>
                        </Box>
                      </Paper>
                    ))
                  )}
                </Stack>
              </CardContent>
            </Card>
          )}
        </Box>

        <Box role="tabpanel" hidden={activeTab !== 2}>
          {activeTab === 2 && (
            <Card>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Database style={{ width: 20, height: 20 }} />
                    <Typography variant="h6">Sync History</Typography>
                  </Box>
                }
                subheader="Track data synchronization between services"
              />
              <CardContent>
                <Stack spacing={2}>
                  {syncs.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography color="text.secondary">No sync history found</Typography>
                    </Box>
                  ) : (
                    syncs.map((sync) => (
                      <Paper key={sync.id} variant="outlined" sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {sync.syncType} Sync
                              </Typography>
                              <Chip 
                                label={sync.status} 
                                color={
                                  sync.status === 'completed' ? 'success' : 
                                  sync.status === 'failed' ? 'error' : 'default'
                                }
                                size="small"
                              />
                            </Box>
                            <Stack spacing={0.5}>
                              <Typography variant="caption" color="text.secondary">
                                Integration: {sync.integrationId}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Records: {sync.recordsProcessed}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Started: {new Date(sync.startTime).toLocaleString()}
                              </Typography>
                              {sync.endTime && (
                                <Typography variant="caption" color="text.secondary">
                                  Ended: {new Date(sync.endTime).toLocaleString()}
                                </Typography>
                              )}
                              {sync.error && (
                                <Typography variant="caption" color="error.main">
                                  Error: {sync.error}
                                </Typography>
                              )}
                            </Stack>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button size="small" variant="outlined">
                              <Eye style={{ width: 14, height: 14 }} />
                            </Button>
                          </Box>
                        </Box>
                      </Paper>
                    ))
                  )}
                </Stack>
              </CardContent>
            </Card>
          )}
        </Box>
      </Stack>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Container>
  );
{/* Bottom Spacer to Clear Bottom Navigation */}
      <Box sx={{
        height: { xs: '120px', sm: '40px' },
        width: '100%'
      }} />
} 