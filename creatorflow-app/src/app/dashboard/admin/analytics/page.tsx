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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown,
  BarChart, 
  PieChart,
  Timeline,
  Refresh,
  Download,
  FilterList,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  userGrowth: number;
  totalPosts: number;
  engagementRate: number;
  avgSessionTime: number;
  bounceRate: number;
  topContent: Array<{
    id: string;
    title: string;
    views: number;
    engagement: number;
    type: string;
  }>;
  userActivity: Array<{
    date: string;
    users: number;
    sessions: number;
    pageViews: number;
  }>;
  deviceStats: Array<{
    device: string;
    percentage: number;
    users: number;
  }>;
  trafficSources: Array<{
    source: string;
    percentage: number;
    users: number;
  }>;
}

export default function SystemAnalytics() {
  const [overviewModalOpen, setOverviewModalOpen] = useState(false);
  const [contentPerformanceModalOpen, setContentPerformanceModalOpen] = useState(false);
  const [userActivityModalOpen, setUserActivityModalOpen] = useState(false);
  const [trafficSourcesModalOpen, setTrafficSourcesModalOpen] = useState(false);
  const [deviceAnalyticsModalOpen, setDeviceAnalyticsModalOpen] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalUsers: 1247,
    activeUsers: 89,
    newUsers: 23,
    userGrowth: 12.5,
    totalPosts: 3421,
    engagementRate: 68.4,
    avgSessionTime: 4.2,
    bounceRate: 23.1,
    topContent: [
      { id: '1', title: 'How to Create Engaging Content', views: 15420, engagement: 89.2, type: 'Article' },
      { id: '2', title: 'Social Media Best Practices', views: 12890, engagement: 76.8, type: 'Video' },
      { id: '3', title: 'Content Calendar Template', views: 9876, engagement: 82.1, type: 'Download' },
      { id: '4', title: 'Analytics Dashboard Guide', views: 7654, engagement: 71.3, type: 'Tutorial' },
      { id: '5', title: 'Brand Guidelines', views: 6543, engagement: 68.9, type: 'PDF' }
    ],
    userActivity: [
      { date: '2024-01-01', users: 120, sessions: 180, pageViews: 450 },
      { date: '2024-01-02', users: 135, sessions: 200, pageViews: 520 },
      { date: '2024-01-03', users: 142, sessions: 215, pageViews: 580 },
      { date: '2024-01-04', users: 128, sessions: 190, pageViews: 480 },
      { date: '2024-01-05', users: 156, sessions: 230, pageViews: 620 },
      { date: '2024-01-06', users: 148, sessions: 220, pageViews: 590 },
      { date: '2024-01-07', users: 162, sessions: 245, pageViews: 680 }
    ],
    deviceStats: [
      { device: 'Desktop', percentage: 45.2, users: 563 },
      { device: 'Mobile', percentage: 38.7, users: 482 },
      { device: 'Tablet', percentage: 16.1, users: 202 }
    ],
    trafficSources: [
      { source: 'Direct', percentage: 35.4, users: 441 },
      { source: 'Google', percentage: 28.9, users: 360 },
      { source: 'Social Media', percentage: 18.7, users: 233 },
      { source: 'Email', percentage: 12.1, users: 151 },
      { source: 'Referral', percentage: 4.9, users: 62 }
    ]
  });

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSensitiveData, setShowSensitiveData] = useState(false);

  // Fetch real analytics data
  const fetchAnalyticsData = async () => {
    try {
      // In a real implementation, this would fetch from your analytics API
      // const response = await fetch('/api/admin/analytics');
      // const data = await response.json();
      // setAnalyticsData(data);
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
    const interval = setInterval(fetchAnalyticsData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAnalyticsData();
    setIsRefreshing(false);
  };

  const handleExport = () => {
    // Create CSV data
    const csvData = [
      ['Metric', 'Value', 'Growth'],
      ['Total Users', analyticsData.totalUsers, analyticsData.userGrowth],
      ['Active Users', analyticsData.activeUsers, '8.2%'],
      ['Total Posts', analyticsData.totalPosts, '15.7%'],
      ['Engagement Rate', `${analyticsData.engagementRate}%`, '2.3%'],
      ['Average Session Time', `${analyticsData.avgSessionTime} minutes`, ''],
      ['Bounce Rate', `${analyticsData.bounceRate}%`, ''],
      ['New Users Today', analyticsData.newUsers, '']
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleCloseModal = (modalType: string) => {
    switch (modalType) {
      case 'overview':
        setOverviewModalOpen(false);
        break;
      case 'contentPerformance':
        setContentPerformanceModalOpen(false);
        break;
      case 'userActivity':
        setUserActivityModalOpen(false);
        break;
      case 'trafficSources':
        setTrafficSourcesModalOpen(false);
        break;
      case 'deviceAnalytics':
        setDeviceAnalyticsModalOpen(false);
        break;
    }
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'success' : 'error';
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? <TrendingUp /> : <TrendingDown />;
  };

  const analyticsCards = [
    {
      title: 'Total Users',
      value: analyticsData.totalUsers.toLocaleString(),
      icon: <BarChart />,
      color: 'primary',
      growth: analyticsData.userGrowth,
      description: 'Registered users'
    },
    {
      title: 'Active Users',
      value: analyticsData.activeUsers.toLocaleString(),
      icon: <Timeline />,
      color: 'success',
      growth: 8.2,
      description: 'Last 24 hours'
    },
    {
      title: 'Total Posts',
      value: analyticsData.totalPosts.toLocaleString(),
      icon: <PieChart />,
      color: 'info',
      growth: 15.7,
      description: 'Content created'
    },
    {
      title: 'Engagement Rate',
      value: `${analyticsData.engagementRate}%`,
      icon: <TrendingUp />,
      color: 'warning',
      growth: 2.3,
      description: 'Average engagement'
    }
  ];


  return (
    <Box sx={{ 
      px: { xs: 1, sm: 0 }, // Add horizontal padding on mobile
      pb: { xs: 20, sm: 8 }, // Add bottom padding to prevent content from being covered by bottom bar
      maxWidth: '100%',
      overflow: 'hidden' // Prevent horizontal overflow
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
            fontSize: { xs: '1.75rem', sm: '2.125rem' }
          }}>
            System Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}>
            Comprehensive analytics and insights for your CreatorFlow platform
          </Typography>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          gap: 1,
          flexWrap: 'wrap',
          width: { xs: '100%', sm: 'auto' }
        }}>
          <Tooltip title="Toggle sensitive data visibility">
            <IconButton
              onClick={() => setShowSensitiveData(!showSensitiveData)}
              color={showSensitiveData ? 'primary' : 'default'}
            >
              {showSensitiveData ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </Tooltip>
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
            onClick={handleExport}
            size="small"
            sx={{ flex: { xs: 1, sm: 'none' } }}
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* Analytics Cards */}
      <Grid container spacing={2} sx={{ mb: 4, mt: 1 }}>
        {analyticsCards.map((card, index) => (
          <Grid item xs={6} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
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
                    {card.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ color: 'text.primary' }}>
                      {showSensitiveData ? card.value : '***'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.title}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    {card.description}
                  </Typography>
                  <Chip 
                    icon={getGrowthIcon(card.growth)}
                    label={showSensitiveData ? `${card.growth > 0 ? '+' : ''}${card.growth}%` : '***'}
                    size="small" 
                    color={getGrowthColor(card.growth)}
                    variant="filled"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Analytics Buttons */}
      <Card sx={{ mb: { xs: 8, sm: 0 } }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 }, pb: { xs: 6, sm: 3 } }}>
          <Typography variant="h6" sx={{ 
            mb: 3,
            fontSize: { xs: '1.1rem', sm: '1.25rem' }
          }}>
            Analytics Tools
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<BarChart />}
                onClick={() => setOverviewModalOpen(true)}
                sx={{ 
                  p: 2, 
                  height: 'auto',
                  flexDirection: 'column',
                  gap: 1
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Overview
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Key metrics and recent activity
                </Typography>
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<PieChart />}
                onClick={() => setContentPerformanceModalOpen(true)}
                sx={{ 
                  p: 2, 
                  height: 'auto',
                  flexDirection: 'column',
                  gap: 1
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Content Performance
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Top performing content analysis
                </Typography>
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Timeline />}
                onClick={() => setUserActivityModalOpen(true)}
                sx={{ 
                  p: 2, 
                  height: 'auto',
                  flexDirection: 'column',
                  gap: 1
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  User Activity
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Activity trends and patterns
                </Typography>
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<TrendingUp />}
                onClick={() => setTrafficSourcesModalOpen(true)}
                sx={{ 
                  p: 2, 
                  height: 'auto',
                  flexDirection: 'column',
                  gap: 1
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Traffic Sources
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Source breakdown and analysis
                </Typography>
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<BarChart />}
                onClick={() => setDeviceAnalyticsModalOpen(true)}
                sx={{ 
                  p: 2, 
                  height: 'auto',
                  flexDirection: 'column',
                  gap: 1
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Device Analytics
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Device usage and statistics
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Overview Modal */}
      <Dialog 
        open={overviewModalOpen} 
        onClose={() => handleCloseModal('overview')}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Analytics Overview</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ 
                mb: 2,
                fontSize: { xs: '1.1rem', sm: '1.25rem' }
              }}>
                Key Metrics
              </Typography>
              <Box sx={{ display: 'grid', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
                  <Typography variant="body2">Average Session Time</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {showSensitiveData ? `${analyticsData.avgSessionTime} minutes` : '***'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
                  <Typography variant="body2">Bounce Rate</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {showSensitiveData ? `${analyticsData.bounceRate}%` : '***'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
                  <Typography variant="body2">New Users Today</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {showSensitiveData ? analyticsData.newUsers : '***'}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ 
                mb: 2,
                fontSize: { xs: '1.1rem', sm: '1.25rem' }
              }}>
                Recent Activity
              </Typography>
              <Box sx={{ display: 'grid', gap: 1 }}>
                {analyticsData.userActivity.slice(-5).map((activity, index) => (
                  <Box key={index} sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    p: 1.5, 
                    backgroundColor: 'grey.50', 
                    borderRadius: 1 
                  }}>
                    <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                      {new Date(activity.date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                      {activity.users} users, {activity.sessions} sessions
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseModal('overview')}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Content Performance Modal */}
      <Dialog 
        open={contentPerformanceModalOpen} 
        onClose={() => handleCloseModal('contentPerformance')}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Content Performance Analysis</DialogTitle>
        <DialogContent>
          <Typography variant="h6" sx={{ 
            mb: 3,
            fontSize: { xs: '1.1rem', sm: '1.25rem' }
          }}>
            Top Performing Content
          </Typography>
          <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 300 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Content</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Views</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Engagement</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {analyticsData.topContent.map((content) => (
                  <TableRow key={content.id}>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {content.title}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      <Chip 
                        label={content.type} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                        sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {showSensitiveData ? content.views.toLocaleString() : '***'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={content.engagement} 
                          sx={{ width: { xs: 40, sm: 60 }, height: 6, borderRadius: 3 }}
                        />
                        <Typography variant="body2" sx={{ minWidth: 35, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          {content.engagement}%
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseModal('contentPerformance')}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* User Activity Modal */}
      <Dialog 
        open={userActivityModalOpen} 
        onClose={() => handleCloseModal('userActivity')}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>User Activity Trends</DialogTitle>
        <DialogContent>
          <Typography variant="h6" sx={{ 
            mb: 3,
            fontSize: { xs: '1.1rem', sm: '1.25rem' }
          }}>
            User Activity Trends
          </Typography>
          <Alert severity="info" sx={{ mb: 3 }}>
            Chart visualization would be implemented here with a charting library like Chart.js or Recharts.
            Currently showing tabular data for the last 7 days.
          </Alert>
          <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 300 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Users</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Sessions</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Page Views</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {analyticsData.userActivity.map((activity, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      {new Date(activity.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{activity.users}</TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{activity.sessions}</TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{activity.pageViews}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseModal('userActivity')}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Traffic Sources Modal */}
      <Dialog 
        open={trafficSourcesModalOpen} 
        onClose={() => handleCloseModal('trafficSources')}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Traffic Sources Analysis</DialogTitle>
        <DialogContent>
          <Typography variant="h6" sx={{ 
            mb: 3,
            fontSize: { xs: '1.1rem', sm: '1.25rem' }
          }}>
            Traffic Sources
          </Typography>
          <Grid container spacing={2}>
            {analyticsData.trafficSources.map((source, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {source.source}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={source.percentage} 
                        sx={{ height: 8, borderRadius: 4, mb: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {source.percentage}% ({source.users} users)
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseModal('trafficSources')}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Device Analytics Modal */}
      <Dialog 
        open={deviceAnalyticsModalOpen} 
        onClose={() => handleCloseModal('deviceAnalytics')}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Device Analytics</DialogTitle>
        <DialogContent>
          <Typography variant="h6" sx={{ 
            mb: 3,
            fontSize: { xs: '1.1rem', sm: '1.25rem' }
          }}>
            Device Analytics
          </Typography>
          <Grid container spacing={2}>
            {analyticsData.deviceStats.map((device, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {device.device}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={device.percentage} 
                        sx={{ height: 8, borderRadius: 4, mb: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {device.percentage}% ({device.users} users)
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseModal('deviceAnalytics')}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
