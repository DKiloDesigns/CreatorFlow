'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  Paper,
  LinearProgress
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  BarChart,
  PieChart,
  Person,
  AttachMoney,
  Speed,
  Security,
  Language,
  Business,
  Rocket,
  EmojiEvents,
  Download,
  Share,
  Refresh,
  Settings,
  Analytics,
  Campaign
} from '@/lib/mui-optimized-imports';

export default function EnterpriseAnalyticsPage() {
  const [activeTab, setActiveTab] = useState(0);

  // Simulate analytics data
  const metrics = {
    totalRevenue: 1250000,
    monthlyGrowth: 23.5,
    activeClients: 47,
    teamMembers: 12,
    campaignSuccess: 94.2,
    averageEngagement: 87.6,
    clientSatisfaction: 96.8,
    platformUptime: 99.97,
    errorRate: 0.03
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1600, mx: 'auto', pb: { xs: 12, sm: 8 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Analytics color="primary" />
          Advanced Analytics Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Comprehensive enterprise analytics, performance metrics, and business intelligence
        </Typography>
      </Box>

      {/* Key Metrics Overview */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3, mb: 6 }}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" color="primary" gutterBottom>
                  {formatCurrency(metrics.totalRevenue)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Revenue
                </Typography>
              </Box>
              <Box sx={{ color: 'success.main' }}>
                <AttachMoney />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <TrendingUp color="success" fontSize="small" />
              <Typography variant="body2" color="success.main" sx={{ ml: 1 }}>
                +{metrics.monthlyGrowth}% this month
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" color="primary" gutterBottom>
                  {metrics.activeClients}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Clients
                </Typography>
              </Box>
              <Box sx={{ color: 'info.main' }}>
                <Person />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Security color="success" fontSize="small" />
              <Typography variant="body2" color="success.main" sx={{ ml: 1 }}>
                Enterprise-grade reliability
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" color="primary" gutterBottom>
                  {metrics.campaignSuccess}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Campaign Success Rate
                </Typography>
              </Box>
              <Box sx={{ color: 'warning.main' }}>
                <Campaign />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Rocket color="success" fontSize="small" />
              <Typography variant="body2" color="success.main" sx={{ ml: 1 }}>
                High-performance campaigns
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" color="primary" gutterBottom>
                  {metrics.platformUptime}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Platform Uptime
                </Typography>
              </Box>
              <Box sx={{ color: 'success.main' }}>
                <Speed />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <EmojiEvents color="success" fontSize="small" />
              <Typography variant="body2" color="success.main" sx={{ ml: 1 }}>
                Award-winning reliability
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Performance Metrics" icon={<Speed />} />
          <Tab label="Revenue Analytics" icon={<TrendingUp />} />
          <Tab label="Client Insights" icon={<Person />} />
          <Tab label="Technical Performance" icon={<Speed />} />
          <Tab label="White-Label Solutions" icon={<Language />} />
          <Tab label="Reporting" icon={<BarChart />} />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Box>
          <Typography variant="h5" gutterBottom>Performance Metrics</Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Key Performance Indicators</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Campaign Success Rate</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="h6" color="success.main">
                        {metrics.campaignSuccess}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={metrics.campaignSuccess} 
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary">Average Engagement</Typography>
                    <Typography variant="h6" color="primary.main">
                      {metrics.averageEngagement}%
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={metrics.averageEngagement} 
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary">Error Rate</Typography>
                    <Typography variant="h6" color="error.main">
                      {metrics.errorRate}%
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={metrics.errorRate * 100} 
                      color="error"
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Quick Actions</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<Download />}
                    fullWidth
                  >
                    Export Analytics
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Share />}
                    fullWidth
                  >
                    Share Report
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    fullWidth
                  >
                    Refresh Data
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          <Typography variant="h5" gutterBottom>Revenue Analytics</Typography>
          <Typography variant="body1">
            Comprehensive revenue analysis and forecasting will be displayed here.
          </Typography>
        </Box>
      )}

      {activeTab === 2 && (
        <Box>
          <Typography variant="h5" gutterBottom>Client Insights</Typography>
          <Typography variant="body1">
            Deep client behavior analysis and insights will be displayed here.
          </Typography>
        </Box>
      )}

      {activeTab === 3 && (
        <Box>
          <Typography variant="h5" gutterBottom>Technical Performance</Typography>
          <Typography variant="body1">
            System performance metrics and technical analytics will be displayed here.
          </Typography>
        </Box>
      )}

      {activeTab === 4 && (
        <Box>
          <Typography variant="h5" gutterBottom>White-Label Solutions</Typography>
          <Typography variant="body1">
            White-label configuration and customization options will be displayed here.
          </Typography>
        </Box>
      )}

      {activeTab === 5 && (
        <Box>
          <Typography variant="h5" gutterBottom>Reporting</Typography>
          <Typography variant="body1">
            Advanced reporting tools and automated report generation will be displayed here.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
{/* Bottom Spacer to Clear Bottom Navigation */}
      <Box sx={{
        height: { xs: '120px', sm: '40px' },
        width: '100%'
      }} />
