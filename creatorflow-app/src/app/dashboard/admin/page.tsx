'use client';

import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader,
  Chip,
  LinearProgress,
  Alert,
  Button,
  Stack
} from '@mui/material';
import { 
  TrendingUp, 
  Speed, 
  Security, 
  People,
  CheckCircle,
  Warning,
  Error,
  Refresh,
  Settings,
  PersonAdd,
  Download
} from '@mui/icons-material';

export default function AdminOverview() {
  // Mock data - in real implementation, this would come from APIs
  const systemStats = {
    uptime: 99.9,
    responseTime: 245,
    activeUsers: 23,
    totalUsers: 156,
    errors: 0,
    warnings: 2
  };

  const quickStats = [
    {
      title: 'System Uptime',
      value: `${systemStats.uptime}%`,
      icon: <TrendingUp />,
      color: 'success',
      trend: '+0.1%'
    },
    {
      title: 'Response Time',
      value: `${systemStats.responseTime}ms`,
      icon: <Speed />,
      color: 'info',
      trend: '-12ms'
    },
    {
      title: 'Active Users',
      value: systemStats.activeUsers,
      icon: <People />,
      color: 'primary',
      trend: '+3'
    },
    {
      title: 'System Health',
      value: 'Healthy',
      icon: <CheckCircle />,
      color: 'success',
      trend: 'All systems operational'
    }
  ];

  const recentAlerts = [
    {
      id: 1,
      type: 'warning',
      message: 'High memory usage detected on server-01',
      time: '2 minutes ago',
      icon: <Warning />
    },
    {
      id: 2,
      type: 'info',
      message: 'Database backup completed successfully',
      time: '15 minutes ago',
      icon: <CheckCircle />
    }
  ];

  return (
    <Box sx={{ 
      px: { xs: 1, sm: 0 }, // Add horizontal padding on mobile
      pb: { xs: 20, sm: 8 }, // 80px on mobile, 32px on desktop for consistent bottom spacing
      maxWidth: '100%',
      overflow: 'hidden' // Prevent horizontal overflow
    }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
          Admin Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor and manage your CreatorFlow application
        </Typography>
      </Box>

      {/* Quick Stats - Compact Horizontal Layout */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {quickStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ 
              height: 'auto',
              minHeight: 60,
              '&:hover': {
                boxShadow: 2,
                transform: 'translateY(-1px)',
                transition: 'all 0.2s ease-in-out'
              }
            }}>
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
                    {stat.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ color: 'text.primary' }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Last updated
                  </Typography>
                  <Chip 
                    label={stat.trend}
                    size="small" 
                    color={stat.trend.startsWith('+') ? 'error' : 'success'}
                    variant="filled"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* System Status */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader title="System Status" />
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Overall Health</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {systemStats.uptime}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={systemStats.uptime} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <CheckCircle color="success" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6" color="success.main">
                      {systemStats.errors}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Errors
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Warning color="warning" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6" color="warning.main">
                      {systemStats.warnings}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Warnings
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Alerts */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Recent Alerts" />
            <CardContent>
              {recentAlerts.length > 0 ? (
                <Box>
                  {recentAlerts.map((alert) => (
                    <Alert 
                      key={alert.id}
                      severity={alert.type as any}
                      icon={alert.icon}
                      sx={{ mb: 2 }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {alert.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {alert.time}
                      </Typography>
                    </Alert>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No recent alerts
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Card sx={{ mt: 3, mb: { xs: 8, sm: 0 } }}>
        <CardHeader title="Quick Actions" />
        <CardContent sx={{ pb: { xs: 6, sm: 3 } }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={() => window.location.reload()}
              sx={{ flex: 1 }}
            >
              Refresh Data
            </Button>
            <Button
              variant="outlined"
              startIcon={<PersonAdd />}
              href="/dashboard/admin/users"
              sx={{ flex: 1 }}
            >
              Manage Users
            </Button>
            <Button
              variant="outlined"
              startIcon={<Speed />}
              href="/dashboard/admin/performance"
              sx={{ flex: 1 }}
            >
              Performance Monitor
            </Button>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={() => alert('Export functionality coming soon!')}
              sx={{ flex: 1 }}
            >
              Export Data
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
