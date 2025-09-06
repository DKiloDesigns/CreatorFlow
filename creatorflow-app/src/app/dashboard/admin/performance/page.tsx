'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader,
  Chip,
  LinearProgress,
  Button,
  Tabs,
  Tab,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { 
  TrendingUp, 
  Speed, 
  Memory, 
  Storage,
  CheckCircle,
  Warning,
  Error,
  Refresh,
  Download,
  Settings
} from '@mui/icons-material';

interface PerformanceMetrics {
  uptime: number;
  responseTime: number;
  memoryUsage: number;
  cpuUsage: number;
  activeConnections: number;
  errorRate: number;
  throughput: number;
}

interface AlertItem {
  id: number;
  type: 'error' | 'warning' | 'info';
  message: string;
  timestamp: string;
  resolved: boolean;
}

export default function PerformanceMonitor() {
  const [tabValue, setTabValue] = useState(0);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    uptime: 99.9,
    responseTime: 245,
    memoryUsage: 68,
    cpuUsage: 45,
    activeConnections: 23,
    errorRate: 0.1,
    throughput: 1250
  });

  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: 1,
      type: 'warning',
      message: 'High memory usage detected (68%)',
      timestamp: '2 minutes ago',
      resolved: false
    },
    {
      id: 2,
      type: 'info',
      message: 'Database connection pool optimized',
      timestamp: '15 minutes ago',
      resolved: true
    },
    {
      id: 3,
      type: 'error',
      message: 'API endpoint /api/posts/calendar returned 500 error',
      timestamp: '1 hour ago',
      resolved: true
    }
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch real performance data
  const fetchPerformanceData = async () => {
    try {
      const response = await fetch('/api/admin/performance');
      if (response.ok) {
        const data = await response.json();
        setMetrics({
          uptime: data.system.uptime,
          responseTime: data.system.responseTime,
          memoryUsage: data.system.memoryUsage,
          cpuUsage: data.system.cpuUsage,
          activeConnections: data.system.activeConnections,
          errorRate: data.system.errorRate,
          throughput: data.system.throughput
        });
        setAlerts(data.alerts || []);
      }
    } catch (error) {
      console.error('Failed to fetch performance data:', error);
    }
  };

  // Initial data fetch and periodic updates
  useEffect(() => {
    fetchPerformanceData();
    const interval = setInterval(fetchPerformanceData, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPerformanceData();
    setIsRefreshing(false);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getStatusColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return 'error';
    if (value >= thresholds.warning) return 'warning';
    return 'success';
  };

  const performanceCards = [
    {
      title: 'System Uptime',
      value: `${metrics.uptime}%`,
      icon: <TrendingUp />,
      color: getStatusColor(100 - metrics.uptime, { warning: 5, critical: 10 }),
      trend: '+0.1%',
      description: 'Last 30 days'
    },
    {
      title: 'Response Time',
      value: `${Math.round(metrics.responseTime)}ms`,
      icon: <Speed />,
      color: getStatusColor(metrics.responseTime, { warning: 500, critical: 1000 }),
      trend: '-12ms',
      description: 'Average API response'
    },
    {
      title: 'Memory Usage',
      value: `${metrics.memoryUsage}%`,
      icon: <Memory />,
      color: getStatusColor(metrics.memoryUsage, { warning: 80, critical: 90 }),
      trend: '+2%',
      description: 'Server memory'
    },
    {
      title: 'Active Connections',
      value: metrics.activeConnections,
      icon: <Storage />,
      color: 'info',
      trend: '+3',
      description: 'Current users'
    }
  ];

  const TabPanel = ({ children, value, index, ...other }: any) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`performance-tabpanel-${index}`}
      aria-labelledby={`performance-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box sx={{ 
      pb: { xs: 20, sm: 8 } // 80px on mobile, 32px on desktop for consistent bottom spacing
    }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            Performance Monitor
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Real-time system performance and health monitoring
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button
            variant="contained"
            startIcon={<Download />}
          >
            Export Report
          </Button>
        </Box>
      </Box>

      {/* Performance Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {performanceCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box 
                    sx={{ 
                      p: 1.5, 
                      borderRadius: 2, 
                      backgroundColor: `${card.color}.light`,
                      color: `${card.color}.main`,
                      mr: 2
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {card.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.title}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    {card.description}
                  </Typography>
                  <Chip 
                    label={card.trend} 
                    size="small" 
                    color={card.trend.startsWith('+') ? 'error' : 'success'}
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Overview" />
            <Tab label="Alerts" />
            <Tab label="System Details" />
            <Tab label="Performance History" />
          </Tabs>
        </Box>

        {/* Overview Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                System Health
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Overall Health</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {metrics.uptime}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={metrics.uptime} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Memory Usage</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {metrics.memoryUsage}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={metrics.memoryUsage} 
                  color={getStatusColor(metrics.memoryUsage, { warning: 80, critical: 90 })}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">CPU Usage</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {metrics.cpuUsage}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={metrics.cpuUsage} 
                  color={getStatusColor(metrics.cpuUsage, { warning: 70, critical: 85 })}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Performance Metrics
              </Typography>
              <Box sx={{ display: 'grid', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
                  <Typography variant="body2">Error Rate</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {metrics.errorRate}%
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
                  <Typography variant="body2">Throughput</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {metrics.throughput} req/min
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
                  <Typography variant="body2">Active Connections</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {metrics.activeConnections}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Alerts Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            System Alerts
          </Typography>
          {alerts.length > 0 ? (
            <Box>
              {alerts.map((alert) => (
                <Alert 
                  key={alert.id}
                  severity={alert.type}
                  sx={{ mb: 2 }}
                  action={
                    alert.resolved ? (
                      <Chip label="Resolved" color="success" size="small" />
                    ) : (
                      <Button size="small" color="inherit">
                        Resolve
                      </Button>
                    )
                  }
                >
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {alert.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {alert.timestamp}
                  </Typography>
                </Alert>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No active alerts
            </Typography>
          )}
        </TabPanel>

        {/* System Details Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            System Information
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Metric</TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Server Uptime</TableCell>
                  <TableCell>15 days, 3 hours</TableCell>
                  <TableCell>
                    <Chip label="Healthy" color="success" size="small" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Database Status</TableCell>
                  <TableCell>Connected</TableCell>
                  <TableCell>
                    <Chip label="Healthy" color="success" size="small" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>API Status</TableCell>
                  <TableCell>Operational</TableCell>
                  <TableCell>
                    <Chip label="Healthy" color="success" size="small" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Last Backup</TableCell>
                  <TableCell>2 hours ago</TableCell>
                  <TableCell>
                    <Chip label="Recent" color="info" size="small" />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Performance History Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Performance History
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Historical performance data and trends will be displayed here.
            This feature will be implemented with charting libraries for detailed analytics.
          </Typography>
        </TabPanel>
      </Card>
    </Box>
  );
}
