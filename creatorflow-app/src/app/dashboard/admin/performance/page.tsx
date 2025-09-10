'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Chip,
  LinearProgress,
  Button,
  Alert,
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
  DialogActions
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
  Settings,
  Timeline
} from '@mui/icons-material';

interface PerformanceMetrics {
  uptime: number;
  responseTime: number;
  memoryUsage: number;
  cpuUsage: number;
  storageUsage: number;
  activeConnections: number;
  errorRate: number;
  throughput: number;
}

interface Alert {
  id: string;
  message: string;
  severity: 'warning' | 'error' | 'info';
  timestamp: string;
  resolved: boolean;
}

export default function PerformanceMonitorPage() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    uptime: 99.9,
    responseTime: 120,
    memoryUsage: 65,
    cpuUsage: 45,
    storageUsage: 78,
    activeConnections: 42,
    errorRate: 0.1,
    throughput: 1250
  });

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      message: 'High memory usage detected',
      severity: 'warning',
      timestamp: '2 hours ago',
      resolved: false
    },
    {
      id: '2',
      message: 'API endpoint /api/posts/calendar returned 500 error',
      timestamp: '1 hour ago',
      resolved: true,
      severity: 'error'
    }
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Modal states
  const [overviewModal, setOverviewModal] = useState(false);
  const [alertsModal, setAlertsModal] = useState(false);
  const [systemDetailsModal, setSystemDetailsModal] = useState(false);
  const [performanceHistoryModal, setPerformanceHistoryModal] = useState(false);

  // Fetch real performance data
  const fetchPerformanceData = async () => {
    try {
      const response = await fetch('/api/admin/performance');
      if (response.ok) {
        const data = await response.json();
        setMetrics(data.metrics || metrics);
        setAlerts(data.alerts || alerts);
      }
    } catch (error) {
      console.error('Error fetching performance data:', error);
    }
  };

  useEffect(() => {
    fetchPerformanceData();
    const interval = setInterval(fetchPerformanceData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPerformanceData();
    setIsRefreshing(false);
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
      value: `${metrics.responseTime}ms`,
      icon: <Speed />,
      color: getStatusColor(metrics.responseTime, { warning: 500, critical: 1000 }),
      trend: '-12ms',
      description: 'Average'
    },
    {
      title: 'Memory Usage',
      value: `${metrics.memoryUsage}%`,
      icon: <Memory />,
      color: getStatusColor(metrics.memoryUsage, { warning: 80, critical: 90 }),
      trend: '+2.1%',
      description: 'Current'
    },
    {
      title: 'Storage Usage',
      value: `${metrics.storageUsage}%`,
      icon: <Storage />,
      color: getStatusColor(metrics.storageUsage, { warning: 80, critical: 90 }),
      trend: '+0.5%',
      description: 'Available'
    }
  ];

  return (
    <Box sx={{ 
      px: { xs: 1, sm: 0 },
      pb: { xs: 20, sm: 8 },
      maxWidth: '100%',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        mb: 4,
        gap: 2
      }}>
        <Box>
          <Typography variant="h4" sx={{ 
            fontWeight: 600, 
            mb: 1,
            fontSize: { xs: '1.75rem', sm: '2.125rem' },
            color: 'text.primary'
          }}>
            Performance Monitor
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}>
            Real-time system performance and health monitoring
          </Typography>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          gap: 1,
          flexWrap: 'wrap',
          width: { xs: '100%', sm: 'auto' }
        }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            disabled={isRefreshing}
            size="small"
            sx={{ flex: { xs: 1, sm: 'none' } }}
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={() => console.log('Export data')}
            size="small"
            sx={{ flex: { xs: 1, sm: 'none' } }}
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* Performance Metrics Overview */}
      <Grid container spacing={2} sx={{ mb: 4, mt: 1 }}>
        <Grid item xs={6} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText'
                }}>
                  <TrendingUp />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ color: 'text.primary' }}>
                    99.9%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    System Uptime
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Last 30 days
                </Typography>
                <Chip 
                  label="+0.1%" 
                  size="small" 
                  color="error" 
                  variant="filled"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText'
                }}>
                  <Speed />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ color: 'text.primary' }}>
                    120ms
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Response Time
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Average
                </Typography>
                <Chip 
                  label="-12ms" 
                  size="small" 
                  color="success" 
                  variant="filled"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText'
                }}>
                  <Memory />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ color: 'text.primary' }}>
                    65%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Memory Usage
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Current
                </Typography>
                <Chip 
                  label="+2.1%" 
                  size="small" 
                  color="error" 
                  variant="filled"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText'
                }}>
                  <Storage />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ color: 'text.primary' }}>
                    78%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Storage Usage
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Available
                </Typography>
                <Chip 
                  label="+0.5%" 
                  size="small" 
                  color="error" 
                  variant="filled"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Performance Analysis Buttons */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontSize: { xs: '1.1rem', sm: '1.25rem' }, color: 'text.primary' }}>
          Performance Analysis
        </Typography>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 2
        }}>
          <Button
            variant="outlined"
            startIcon={<TrendingUp />}
            onClick={() => setOverviewModal(true)}
            sx={{ 
              p: 2, 
              height: 'auto',
              flexDirection: 'column',
              gap: 1
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              System Overview
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Real-time metrics and health status
            </Typography>
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Warning />}
            onClick={() => setAlertsModal(true)}
            sx={{ 
              p: 2, 
              height: 'auto',
              flexDirection: 'column',
              gap: 1
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              System Alerts
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Active alerts and notifications
            </Typography>
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Settings />}
            onClick={() => setSystemDetailsModal(true)}
            sx={{ 
              p: 2, 
              height: 'auto',
              flexDirection: 'column',
              gap: 1
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              System Details
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Hardware and configuration info
            </Typography>
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Timeline />}
            onClick={() => setPerformanceHistoryModal(true)}
            sx={{ 
              p: 2, 
              height: 'auto',
              flexDirection: 'column',
              gap: 1
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Performance History
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Historical data and trends
            </Typography>
          </Button>
        </Box>
      </Paper>


      {/* Modals */}
      {/* Overview Modal */}
      <Dialog 
        open={overviewModal} 
        onClose={() => setOverviewModal(false)}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            m: { xs: 1, sm: 2 },
            maxHeight: { xs: '90vh', sm: '80vh' }
          }
        }}
      >
        <DialogTitle>System Overview</DialogTitle>
        <DialogContent>
          <Box sx={{ p: { xs: 2, sm: 3 }, pb: { xs: 6, sm: 3 } }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ 
                  mb: 2,
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  color: 'text.primary'
                }}>
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
                    color={getStatusColor(metrics.cpuUsage, { warning: 80, critical: 90 })}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ 
                  mb: 2,
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  color: 'text.primary'
                }}>
                  Network & Storage
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Response Time</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {metrics.responseTime}ms
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min(100, (metrics.responseTime / 1000) * 100)} 
                    color={getStatusColor(metrics.responseTime, { warning: 500, critical: 1000 })}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Storage Usage</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {metrics.storageUsage}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={metrics.storageUsage} 
                    color={getStatusColor(metrics.storageUsage, { warning: 80, critical: 90 })}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Active Connections</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {metrics.activeConnections}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOverviewModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Alerts Modal */}
      <Dialog 
        open={alertsModal} 
        onClose={() => setAlertsModal(false)}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            m: { xs: 1, sm: 2 },
            maxHeight: { xs: '90vh', sm: '80vh' }
          }
        }}
      >
        <DialogTitle>System Alerts</DialogTitle>
        <DialogContent>
          <Box sx={{ p: { xs: 2, sm: 3 }, pb: { xs: 6, sm: 3 } }}>
            {alerts.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {alerts.map((alert, index) => (
                  <Alert 
                    key={index}
                    severity={alert.resolved ? 'success' : 'warning'}
                    sx={{ 
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      '& .MuiAlert-message': {
                        width: '100%'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {alert.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {alert.timestamp}
                        </Typography>
                      </Box>
                      {alert.resolved && (
                        <Chip 
                          label="Resolved" 
                          size="small" 
                          color="success" 
                          sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                        />
                      )}
                    </Box>
                  </Alert>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No active alerts
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAlertsModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* System Details Modal */}
      <Dialog 
        open={systemDetailsModal} 
        onClose={() => setSystemDetailsModal(false)}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            m: { xs: 1, sm: 2 },
            maxHeight: { xs: '90vh', sm: '80vh' }
          }
        }}
      >
        <DialogTitle>System Details</DialogTitle>
        <DialogContent>
          <Box sx={{ p: { xs: 2, sm: 3 }, pb: { xs: 6, sm: 3 } }}>
            <TableContainer 
              sx={{ 
                overflowX: 'auto',
                '&::-webkit-scrollbar': {
                  height: 8,
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: 'grey.100',
                  borderRadius: 4,
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'grey.400',
                  borderRadius: 4,
                  '&:hover': {
                    backgroundColor: 'grey.600',
                  },
                },
              }}
            >
              <Table sx={{ minWidth: 300 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: '0.875rem', sm: '0.875rem' },
                      whiteSpace: 'nowrap'
                    }}>Property</TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: '0.875rem', sm: '0.875rem' },
                      whiteSpace: 'nowrap'
                    }}>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ 
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      whiteSpace: 'nowrap'
                    }}>Server Version</TableCell>
                    <TableCell sx={{ 
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      whiteSpace: 'nowrap'
                    }}>Node.js 18.17.0</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ 
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      whiteSpace: 'nowrap'
                    }}>Platform</TableCell>
                    <TableCell sx={{ 
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      whiteSpace: 'nowrap'
                    }}>Linux x64</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ 
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      whiteSpace: 'nowrap'
                    }}>Memory</TableCell>
                    <TableCell sx={{ 
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      whiteSpace: 'nowrap'
                    }}>8GB RAM</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ 
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      whiteSpace: 'nowrap'
                    }}>CPU Cores</TableCell>
                    <TableCell sx={{ 
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      whiteSpace: 'nowrap'
                    }}>4 Cores</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ 
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      whiteSpace: 'nowrap'
                    }}>Storage</TableCell>
                    <TableCell sx={{ 
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      whiteSpace: 'nowrap'
                    }}>500GB SSD</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ 
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      whiteSpace: 'nowrap'
                    }}>Last Restart</TableCell>
                    <TableCell sx={{ 
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      whiteSpace: 'nowrap'
                    }}>2 days ago</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSystemDetailsModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Performance History Modal */}
      <Dialog 
        open={performanceHistoryModal} 
        onClose={() => setPerformanceHistoryModal(false)}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            m: { xs: 1, sm: 2 },
            maxHeight: { xs: '90vh', sm: '80vh' }
          }
        }}
      >
        <DialogTitle>Performance History</DialogTitle>
        <DialogContent>
          <Box sx={{ p: { xs: 2, sm: 3 }, pb: { xs: 6, sm: 3 } }}>
            <Typography variant="body2" color="text.secondary">
              Historical performance data and trends will be displayed here.
              This feature will be implemented with charting libraries for detailed analytics.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPerformanceHistoryModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
