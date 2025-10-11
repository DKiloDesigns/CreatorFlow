'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Button,
  Chip,
  Typography,
  Tabs,
  Tab,
  Grid,
  Box,

} from '@mui/material';
import {
  Timeline as ActivityIcon,
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

interface SystemHealth {
  cpu: number;
  memory: number;
  database: number;
  cache: number;
  api: number;
  overall: number;
}

interface PerformanceAlert {
  id: string;
  type: 'warning' | 'error' | 'critical';
  message: string;
  metric: string;
  value: number;
  threshold: number;
  timestamp: Date;
  resolved?: boolean;
}

export default function PerformancePage() {
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [performanceStats, setPerformanceStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('alerts');

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      
      const [healthRes, alertsRes, recommendationsRes, statsRes] = await Promise.all([
        fetch('/api/admin/performance/health'),
        fetch('/api/admin/performance/alerts'),
        fetch('/api/admin/performance/recommendations'),
        fetch('/api/admin/performance/stats'),
      ]);

      if (healthRes.ok) {
        const health = await healthRes.json();
        setSystemHealth(health);
      }

      if (alertsRes.ok) {
        const alertsData = await alertsRes.json();
        setAlerts(alertsData.alerts || []);
      }

      if (recommendationsRes.ok) {
        const recs = await recommendationsRes.json();
        setRecommendations(recs.recommendations || []);
      }

      if (statsRes.ok) {
        const stats = await statsRes.json();
        setPerformanceStats(stats);
      }
    } catch (error) {
      console.error('Failed to fetch performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchPerformanceData();
    setRefreshing(false);
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthBadge = (score: number) => {
    if (score >= 80) return <Chip label="Healthy" variant="outlined" />;
    if (score >= 60) return <Chip label="Warning" variant="outlined" />;
    return <Chip label="Critical" variant="outlined" />;
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'error': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) return <div className="p-8">Loading performance data...</div>;

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Performance Monitoring</h1>
          <p className="text-muted-foreground">System health and optimization insights</p>
        </div>
        <Button onClick={refreshData} disabled={refreshing} variant="outlined">
          <RefreshIcon sx={{ height: 16, width: 16, mr: 2 }} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </Button>
      </div>

      {/* System Health Overview */}
      {systemHealth && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={2} component="div">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Typography variant="subtitle2" component="div">Overall Health</Typography>
                <ActivityIcon sx={{ height: 16, width: 16, color: 'text.secondary' }} />
              </CardHeader>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                  <Typography variant="h4" component="div" className={`font-bold ${getHealthColor(systemHealth.overall)}`}>
                    {systemHealth.overall}%
                  </Typography>
                  {getHealthBadge(systemHealth.overall)}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={2} component="div">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Typography variant="subtitle2" component="div">CPU Usage</Typography>
                <ActivityIcon sx={{ height: 16, width: 16, color: 'text.secondary' }} />
              </CardHeader>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                  <Typography variant="h4" component="div" className={`font-bold ${getHealthColor(systemHealth.cpu)}`}>
                    {systemHealth.cpu}%
                  </Typography>
                  {getHealthBadge(systemHealth.cpu)}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={2} component="div">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Typography variant="subtitle2" component="div">Memory Usage</Typography>
                <ActivityIcon sx={{ height: 16, width: 16, color: 'text.secondary' }} />
              </CardHeader>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                  <Typography variant="h4" component="div" className={`font-bold ${getHealthColor(systemHealth.memory)}`}>
                    {systemHealth.memory}%
                  </Typography>
                  {getHealthBadge(systemHealth.memory)}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={2} component="div">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Typography variant="subtitle2" component="div">Database</Typography>
                <ActivityIcon sx={{ height: 16, width: 16, color: 'text.secondary' }} />
              </CardHeader>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                  <Typography variant="h4" component="div" className={`font-bold ${getHealthColor(systemHealth.database)}`}>
                    {systemHealth.database}%
                  </Typography>
                  {getHealthBadge(systemHealth.database)}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={2} component="div">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Typography variant="subtitle2" component="div">Cache</Typography>
                <ActivityIcon sx={{ height: 16, width: 16, color: 'text.secondary' }} />
              </CardHeader>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                  <Typography variant="h4" component="div" className={`font-bold ${getHealthColor(systemHealth.cache)}`}>
                    {systemHealth.cache}%
                  </Typography>
                  {getHealthBadge(systemHealth.cache)}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={2}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Typography variant="subtitle2" component="div">API</Typography>
                <ActivityIcon sx={{ height: 16, width: 16, color: 'text.secondary' }} />
              </CardHeader>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                  <Typography variant="h4" component="div" className={`font-bold ${getHealthColor(systemHealth.api)}`}>
                    {systemHealth.api}%
                  </Typography>
                  {getHealthBadge(systemHealth.api)}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Tabs value={activeTab} onChange={(e, value) => setActiveTab(value)} sx={{ mb: 3 }}>
        <Tab label="Alerts" value="alerts" />
        <Tab label="Metrics" value="metrics" />
        <Tab label="Optimizations" value="recommendations" />
      </Tabs>

        {activeTab === 'alerts' && (
          <Box sx={{ mt: 3 }}>
          <Card>
            <CardHeader>
              <Typography variant="h6" component="div" className="flex items-center gap-2">
                <ActivityIcon sx={{ height: 20, width: 20 }} />
                Performance Alerts
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Recent performance issues and warnings
              </Typography>
            </CardHeader>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {alerts.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" align="center" py={8}>
                    No performance alerts
                  </Typography>
                ) : (
                  alerts.map((alert) => (
                    <Box key={alert.id} sx={{ p: 2, borderRadius: 1, border: 1, borderColor: getAlertColor(alert.type) }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">{alert.message}</Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {alert.metric}: {alert.value} (threshold: {alert.threshold})
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {new Date(alert.timestamp).toLocaleString()}
                          </Typography>
                        </Box>
                        <Chip label={alert.type.toUpperCase()} variant={alert.type === 'critical' ? 'filled' : alert.type === 'error' ? 'outlined' : 'outlined'} />
                      </Box>
                    </Box>
                  ))
                )}
              </Box>
            </CardContent>
          </Card>
          </Box>
        )}

        {activeTab === 'metrics' && (
          <Box sx={{ mt: 3 }}>
          {performanceStats && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardHeader>
                    <Typography variant="h6" component="div" className="flex items-center gap-2">
                      <ActivityIcon sx={{ height: 20, width: 20 }} />
                      API Performance
                    </Typography>
                  </CardHeader>
                  <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Total Requests:</Typography>
                        <Typography variant="body2" fontWeight="medium">{performanceStats.api?.count || 0}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Avg Response Time:</Typography>
                        <Typography variant="body2" fontWeight="medium">{performanceStats.api?.avgResponseTime?.toFixed(2) || 0}ms</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Max Response Time:</Typography>
                        <Typography variant="body2" fontWeight="medium">{performanceStats.api?.maxResponseTime?.toFixed(2) || 0}ms</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card>
                  <CardHeader>
                    <Typography variant="h6" component="div" className="flex items-center gap-2">
                      <ActivityIcon sx={{ height: 20, width: 20 }} />
                      Database Performance
                    </Typography>
                  </CardHeader>
                  <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Total Queries:</Typography>
                        <Typography variant="body2" fontWeight="medium">{performanceStats.database?.count || 0}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Avg Query Time:</Typography>
                        <Typography variant="body2" fontWeight="medium">{performanceStats.database?.avgQueryTime?.toFixed(2) || 0}ms</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Max Query Time:</Typography>
                        <Typography variant="body2" fontWeight="medium">{performanceStats.database?.maxQueryTime?.toFixed(2) || 0}ms</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card>
                  <CardHeader>
                    <Typography variant="h6" component="div" className="flex items-center gap-2">
                      <ActivityIcon sx={{ height: 20, width: 20 }} />
                      Cache Performance
                    </Typography>
                  </CardHeader>
                  <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Total Operations:</Typography>
                        <Typography variant="body2" fontWeight="medium">{performanceStats.cache?.total || 0}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Cache Hits:</Typography>
                        <Typography variant="body2" fontWeight="medium">{performanceStats.cache?.hits || 0}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Hit Rate:</Typography>
                        <Typography variant="body2" fontWeight="medium">{performanceStats.cache?.hitRate?.toFixed(1) || 0}%</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
          </Box>
        )}

        {activeTab === 'recommendations' && (
          <Box sx={{ mt: 3 }}>
          <Card>
            <CardHeader>
              <Typography variant="h6" component="div" className="flex items-center gap-2">
                <ActivityIcon sx={{ height: 20, width: 20 }} />
                Optimization Recommendations
              </Typography>
              <Typography variant="body2" color="text.secondary">
                AI-powered suggestions to improve system performance
              </Typography>
            </CardHeader>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {recommendations.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" align="center" py={8}>
                    No optimization recommendations at this time
                  </Typography>
                ) : (
                  recommendations.map((recommendation, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 1 }}>
                      <ActivityIcon sx={{ height: 20, width: 20, color: 'blue.600' }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2">{recommendation}</Typography>
                      </Box>
                      <Button variant="outlined" size="small">
                        <SettingsIcon sx={{ height: 16, width: 16 }} />
                      </Button>
                    </Box>
                  ))
                )}
              </Box>
            </CardContent>
          </Card>
          </Box>
        )}
    </div>
  );
}

function TabPanel(props: { children?: React.ReactNode; index: number; value: number }) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
{/* Bottom Spacer to Clear Bottom Navigation */}
      <Box sx={{
        height: { xs: '120px', sm: '40px' },
        width: '100%'
      }} />
} 