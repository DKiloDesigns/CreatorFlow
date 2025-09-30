'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardHeader,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Speed,
  Memory,
  Storage,
  NetworkCheck,
  Refresh,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Error,
  Warning,
} from '@mui/icons-material';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'error';
  trend: 'up' | 'down' | 'stable';
  description: string;
}

interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  totalRequests: number;
}

interface ApiPerformance {
  endpoint: string;
  avgResponseTime: number;
  requestsPerMinute: number;
  errorRate: number;
  lastUpdated: string;
}

export default function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [cacheStats, setCacheStats] = useState<CacheStats | null>(null);
  const [apiPerformance, setApiPerformance] = useState<ApiPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      
      // Simulate API calls to get performance data
      const [metricsRes, cacheRes, apiRes] = await Promise.allSettled([
        fetch('/api/performance/metrics'),
        fetch('/api/performance/cache-stats'),
        fetch('/api/performance/api-stats'),
      ]);

      // Mock data for demonstration
      setMetrics([
        {
          name: 'Page Load Time',
          value: 1.2,
          unit: 's',
          status: 'good',
          trend: 'down',
          description: 'Average time to load pages',
        },
        {
          name: 'API Response Time',
          value: 150,
          unit: 'ms',
          status: 'good',
          trend: 'down',
          description: 'Average API response time',
        },
        {
          name: 'Memory Usage',
          value: 75,
          unit: '%',
          status: 'warning',
          trend: 'up',
          description: 'Current memory utilization',
        },
        {
          name: 'Cache Hit Rate',
          value: 85,
          unit: '%',
          status: 'good',
          trend: 'up',
          description: 'Percentage of cache hits',
        },
        {
          name: 'Error Rate',
          value: 0.5,
          unit: '%',
          status: 'good',
          trend: 'down',
          description: 'Percentage of failed requests',
        },
        {
          name: 'Active Users',
          value: 1247,
          unit: '',
          status: 'good',
          trend: 'up',
          description: 'Currently active users',
        },
      ]);

      setCacheStats({
        hits: 15420,
        misses: 2580,
        hitRate: 85.6,
        totalRequests: 18000,
      });

      setApiPerformance([
        {
          endpoint: '/api/user',
          avgResponseTime: 120,
          requestsPerMinute: 45,
          errorRate: 0.2,
          lastUpdated: '2 minutes ago',
        },
        {
          endpoint: '/api/analytics/overview',
          avgResponseTime: 180,
          requestsPerMinute: 23,
          errorRate: 0.1,
          lastUpdated: '1 minute ago',
        },
        {
          endpoint: '/api/notifications',
          avgResponseTime: 95,
          requestsPerMinute: 67,
          errorRate: 0.3,
          lastUpdated: '30 seconds ago',
        },
        {
          endpoint: '/api/posts/calendar',
          avgResponseTime: 250,
          requestsPerMinute: 12,
          errorRate: 1.2,
          lastUpdated: '3 minutes ago',
        },
      ]);

      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error fetching performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformanceData();
    const interval = setInterval(fetchPerformanceData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp color="success" />;
      case 'down': return <TrendingDown color="error" />;
      default: return <CheckCircle color="info" />;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Performance Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Real-time system performance monitoring
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </Typography>
          <IconButton onClick={fetchPerformanceData} disabled={loading}>
            <Refresh />
          </IconButton>
        </Box>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {metric.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getTrendIcon(metric.trend)}
                    <Chip
                      label={metric.status}
                      color={getStatusColor(metric.status) as any}
                      size="small"
                    />
                  </Box>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {metric.value}{metric.unit}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {metric.description}
                </Typography>
                {metric.name === 'Memory Usage' && (
                  <LinearProgress
                    variant="determinate"
                    value={metric.value}
                    sx={{ mt: 2, height: 8, borderRadius: 4 }}
                    color={metric.status === 'warning' ? 'warning' : 'primary'}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Cache Statistics */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Cache Performance"
              avatar={<Memory />}
              action={
                <Chip
                  label={`${cacheStats?.hitRate.toFixed(1)}% Hit Rate`}
                  color="success"
                  variant="outlined"
                />
              }
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="h4" color="success.main">
                    {cacheStats?.hits.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cache Hits
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h4" color="error.main">
                    {cacheStats?.misses.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cache Misses
                  </Typography>
                </Grid>
              </Grid>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Total Requests: {cacheStats?.totalRequests.toLocaleString()}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={cacheStats?.hitRate || 0}
                  sx={{ height: 8, borderRadius: 4 }}
                  color="success"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* System Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="System Status"
              avatar={<NetworkCheck />}
            />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CheckCircle color="success" />
                  <Typography variant="body1">Database Connection</Typography>
                  <Chip label="Healthy" color="success" size="small" />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CheckCircle color="success" />
                  <Typography variant="body1">Redis Cache</Typography>
                  <Chip label="Connected" color="success" size="small" />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Warning color="warning" />
                  <Typography variant="body1">Memory Usage</Typography>
                  <Chip label="High" color="warning" size="small" />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CheckCircle color="success" />
                  <Typography variant="body1">API Endpoints</Typography>
                  <Chip label="Operational" color="success" size="small" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* API Performance Table */}
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="API Performance"
              avatar={<Speed />}
            />
            <CardContent>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Endpoint</TableCell>
                      <TableCell align="right">Avg Response Time</TableCell>
                      <TableCell align="right">Requests/min</TableCell>
                      <TableCell align="right">Error Rate</TableCell>
                      <TableCell align="right">Last Updated</TableCell>
                      <TableCell align="center">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {apiPerformance.map((api, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {api.endpoint}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            {api.avgResponseTime}ms
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            {api.requestsPerMinute}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography 
                            variant="body2" 
                            color={api.errorRate > 1 ? 'error.main' : 'success.main'}
                          >
                            {api.errorRate}%
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" color="text.secondary">
                            {api.lastUpdated}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          {api.errorRate > 1 ? (
                            <Error color="error" />
                          ) : (
                            <CheckCircle color="success" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
