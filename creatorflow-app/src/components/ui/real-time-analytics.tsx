'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardHeader,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  LinearProgress,
  Paper,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  IconButton
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  Visibility,
  Favorite,
  Share,
  Chat,
  AttachMoney,
  TrackChanges,
  FlashOn,
  BarChart,
  AccessTime,
  Warning,
  CheckCircle,
  Refresh,
  Settings,
  Monitor,
  PieChart,
  ShowChart,
  Add as AddIcon
} from '@mui/icons-material';
import { toast } from 'sonner';

interface PerformanceMetrics {
  impressions: number;
  reach: number;
  engagement: number;
  clicks: number;
  conversions: number;
  revenue: number;
  ctr: number;
  cpc: number;
  roas: number;
}

interface PlatformPerformance {
  [platform: string]: {
    metrics: PerformanceMetrics;
    trend: 'up' | 'down' | 'stable';
    changePercent: number;
    bestPerformingContent: string;
    optimalPostingTime: string;
  };
}

interface ABTestResult {
  id: string;
  name: string;
  variantA: {
    content: string;
    metrics: PerformanceMetrics;
    winner: boolean;
  };
  variantB: {
    content: string;
    metrics: PerformanceMetrics;
    winner: boolean;
  };
  confidence: number;
  status: 'running' | 'completed' | 'paused';
  startDate: string;
  endDate?: string;
}

interface ROIData {
  totalSpent: number;
  totalRevenue: number;
  roas: number;
  cpa: number;
  ltv: number;
  campaignBreakdown: Array<{
    name: string;
    spend: number;
    revenue: number;
    roas: number;
    status: 'active' | 'paused' | 'completed';
  }>;
}

interface AnalyticsData {
  overview: {
    totalPosts: number;
    totalEngagement: number;
    avgEngagementRate: number;
    followers: number;
    growthRate: number;
  };
  performance: {
    topPosts: Array<{
      id: string;
      engagement: number;
      platform: string;
    }>;
    platformBreakdown: {
      [platform: string]: {
        posts: number;
        engagement: number;
      };
    };
  };
  trends: {
    weeklyGrowth: number[];
    engagementTrend: number[];
  };
}

export default function RealTimeAnalytics() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [platformPerformance, setPlatformPerformance] = useState<PlatformPerformance>({});
  const [abTests, setAbTests] = useState<ABTestResult[]>([]);
  const [roiData, setRoiData] = useState<ROIData | null>(null);
  const [liveMetrics, setLiveMetrics] = useState<PerformanceMetrics>({
    impressions: 0,
    reach: 0,
    engagement: 0,
    clicks: 0,
    conversions: 0,
    revenue: 0,
    ctr: 0,
    cpc: 0,
    roas: 0
  });
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Fetch real analytics data
  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch('/api/analytics');
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data.data);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  // Fetch platform breakdown
  const fetchPlatformBreakdown = async () => {
    try {
      const response = await fetch('/api/analytics/platform-breakdown');
      if (response.ok) {
        const data = await response.json();
        // Transform platform data into our format
        const transformedData: PlatformPerformance = {};
        
        Object.entries(data.data || {}).forEach(([platform, platformData]: [string, any]) => {
          transformedData[platform] = {
            metrics: {
              impressions: platformData.impressions || 0,
              reach: platformData.reach || 0,
              engagement: platformData.engagement || 0,
              clicks: platformData.clicks || 0,
              conversions: platformData.conversions || 0,
              revenue: platformData.revenue || 0,
              ctr: platformData.ctr || 0,
              cpc: platformData.cpc || 0,
              roas: platformData.roas || 0
            },
            trend: 'up', // This would come from trend analysis
            changePercent: 0, // This would come from trend analysis
            bestPerformingContent: 'Content analysis in progress...',
            optimalPostingTime: '9:00 AM' // This would come from AI analysis
          };
        });
        
        setPlatformPerformance(transformedData);
      }
    } catch (error) {
      console.error('Error fetching platform breakdown:', error);
    }
  };

  // Fetch real-time metrics
  const fetchRealTimeMetrics = async () => {
    try {
      const response = await fetch('/api/analytics/realtime');
      if (response.ok) {
        const data = await response.json();
        setLiveMetrics(data.data || liveMetrics);
      }
    } catch (error) {
      console.error('Error fetching real-time metrics:', error);
    }
  };

  // Initialize data
  useEffect(() => {
    fetchAnalyticsData();
    fetchPlatformBreakdown();
    fetchRealTimeMetrics();
  }, []);

  // Real-time updates
  useEffect(() => {
    if (!realTimeUpdates) return;

    const interval = setInterval(() => {
      fetchRealTimeMetrics();
      fetchAnalyticsData();
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [realTimeUpdates]);

  // Mock A/B tests (this would come from a real A/B testing service)
  useEffect(() => {
    const mockABTests: ABTestResult[] = [
      {
        id: '1',
        name: 'Caption Style Test',
        variantA: {
          content: 'Professional, data-driven approach',
          metrics: {
            impressions: 8900,
            reach: 5600,
            engagement: 1200,
            clicks: 450,
            conversions: 25,
            revenue: 1500,
            ctr: 5.06,
            cpc: 3.33,
            roas: 2.5
          },
          winner: false
        },
        variantB: {
          content: 'Storytelling with personal touch',
          metrics: {
            impressions: 9200,
            reach: 6100,
            engagement: 1580,
            clicks: 520,
            conversions: 32,
            revenue: 2100,
            ctr: 5.65,
            cpc: 4.04,
            roas: 3.2
          },
          winner: true
        },
        confidence: 95.2,
        status: 'completed',
        startDate: '2025-08-10',
        endDate: '2025-08-12'
      }
    ];

    setAbTests(mockABTests);
  }, []);

  // Mock ROI data (this would come from real financial tracking)
  useEffect(() => {
    const mockROIData: ROIData = {
      totalSpent: 12500,
      totalRevenue: 34500,
      roas: 2.76,
      cpa: 45.83,
      ltv: 156.82,
      campaignBreakdown: [
        {
          name: 'Q2 Brand Awareness',
          spend: 4500,
          revenue: 8900,
          roas: 1.98,
          status: 'completed'
        },
        {
          name: 'Summer Product Launch',
          spend: 6000,
          revenue: 18900,
          roas: 3.15,
          status: 'active'
        }
      ]
    };

    setRoiData(mockROIData);
  }, []);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp color="success" />;
      case 'down':
        return <TrendingDown color="error" />;
      default:
        return <TrendingUp color="info" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'success';
      case 'down':
        return 'error';
      default:
        return 'info';
    }
  };

  const renderOverview = () => (
    <Grid container spacing={3}>
      {/* Live Metrics */}
      <Grid item xs={12}>
        <Card>
          <CardHeader 
            title="Live Performance Metrics" 
            avatar={<Monitor color="primary" />}
            action={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip 
                  icon={<Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />}
                  label="LIVE" 
                  color="success" 
                  size="small"
                />
                <IconButton onClick={() => setRealTimeUpdates(!realTimeUpdates)}>
                  <Refresh sx={{ animation: realTimeUpdates ? 'spin 2s linear infinite' : 'none' }} />
                </IconButton>
                <Typography variant="caption" color="text.secondary">
                  Last update: {lastUpdate.toLocaleTimeString()}
                </Typography>
              </Box>
            }
          />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3} component="div">
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary" gutterBottom>
                    {liveMetrics.impressions.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Impressions
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(liveMetrics.impressions / 20000) * 100} 
                    sx={{ mt: 1, height: 4 }}
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success" gutterBottom>
                    {liveMetrics.engagement.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Engagement
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(liveMetrics.engagement / 3000) * 100} 
                    sx={{ mt: 1, height: 4 }}
                    color="success"
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="warning" gutterBottom>
                    {liveMetrics.clicks.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Clicks
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(liveMetrics.clicks / 1000) * 100} 
                    sx={{ mt: 1, height: 4 }}
                    color="warning"
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="info" gutterBottom>
                    ${liveMetrics.revenue.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Revenue
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(liveMetrics.revenue / 5000) * 100} 
                    sx={{ mt: 1, height: 4 }}
                    color="info"
                  />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Analytics Overview */}
      {analyticsData && (
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Analytics Overview" />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary" gutterBottom>
                      {analyticsData.overview.totalPosts}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Posts
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success" gutterBottom>
                      {analyticsData.overview.totalEngagement.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Engagement
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="warning" gutterBottom>
                      {analyticsData.overview.avgEngagementRate}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Avg Engagement Rate
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="info" gutterBottom>
                      {analyticsData.overview.followers.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Followers
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      )}

      {/* Platform Performance */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Platform Performance Overview" />
          <CardContent>
            <Grid container spacing={3}>
              {Object.entries(platformPerformance).map(([platform, data]) => (
                <Grid item xs={12} md={4} key={platform}>
                  <Paper sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" component="h3">
                        {platform}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getTrendIcon(data.trend)}
                        <Chip 
                          label={`${data.changePercent > 0 ? '+' : ''}${data.changePercent}%`}
                          color={getTrendColor(data.trend)}
                          size="small"
                        />
                      </Box>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h4" color="primary" gutterBottom>
                        ${data.metrics.revenue.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Revenue (24h)
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">CTR</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {data.metrics.ctr}%
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">ROAS</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {data.metrics.roas}x
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2">Engagement</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {data.metrics.engagement.toLocaleString()}
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Best Performing Content:
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {data.bestPerformingContent}
                    </Typography>
                    
                    <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                      Optimal Posting Time:
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {data.optimalPostingTime}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderABTesting = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardHeader 
            title="A/B Testing Results" 
            avatar={<TrackChanges color="primary" />}
            action={
              <Button variant="contained" startIcon={<AddIcon />}>
                New Test
              </Button>
            }
          />
          <CardContent>
            {abTests.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <TrackChanges sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  No A/B Tests Running
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Create your first A/B test to optimize content performance
                </Typography>
              </Box>
            ) : (
              abTests.map((test) => (
                <Paper key={test.id} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {test.name}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip 
                          label={test.status} 
                          color={test.status === 'completed' ? 'success' : test.status === 'running' ? 'warning' : 'default'}
                          size="small"
                        />
                        {test.status === 'completed' && (
                          <Chip 
                            label={`${test.confidence}% confidence`} 
                            color="info"
                            size="small"
                          />
                        )}
                      </Box>
                    </Box>
                    
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" color="text.secondary">
                        Started: {test.startDate}
                      </Typography>
                      {test.endDate && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          Ended: {test.endDate}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  
                  <Grid container spacing={3}>
                    {/* Variant A */}
                    <Grid item xs={12} md={6}>
                      <Paper 
                        sx={{ 
                          p: 2, 
                          border: '2px solid', 
                          borderColor: test.variantA.winner ? 'success.main' : 'divider',
                          bgcolor: test.variantA.winner ? 'success.50' : 'background.paper'
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Variant A
                          </Typography>
                          {test.variantA.winner && (
                            <Chip icon={<CheckCircle />} label="Winner" color="success" size="small" />
                          )}
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {test.variantA.content}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="caption">Revenue</Typography>
                          <Typography variant="caption" fontWeight="bold">
                            ${test.variantA.metrics.revenue.toLocaleString()}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="caption">CTR</Typography>
                          <Typography variant="caption" fontWeight="bold">
                            {test.variantA.metrics.ctr}%
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="caption">ROAS</Typography>
                          <Typography variant="caption" fontWeight="bold">
                            {test.variantA.metrics.roas}x
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                    
                    {/* Variant B */}
                    <Grid item xs={12} md={6}>
                      <Paper 
                        sx={{ 
                          p: 2, 
                          border: '2px solid', 
                          borderColor: test.variantB.winner ? 'success.main' : 'divider',
                          bgcolor: test.variantB.winner ? 'success.50' : 'background.paper'
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Variant B
                          </Typography>
                          {test.variantB.winner && (
                            <Chip icon={<CheckCircle />} label="Winner" color="success" size="small" />
                          )}
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {test.variantB.content}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="caption">Revenue</Typography>
                          <Typography variant="caption" fontWeight="bold">
                            ${test.variantB.metrics.revenue.toLocaleString()}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="caption">CTR</Typography>
                          <Typography variant="caption" fontWeight="bold">
                            {test.variantB.metrics.ctr}%
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="caption">ROAS</Typography>
                          <Typography variant="caption" fontWeight="bold">
                            {test.variantB.metrics.roas}x
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                </Paper>
              ))
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderROITracking = () => (
    <Grid container spacing={3}>
      {/* ROI Summary */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardHeader title="ROI Overview" />
          <CardContent>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h3" color="success" gutterBottom>
                {roiData?.roas.toFixed(2)}x
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Return on Ad Spend
              </Typography>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Total Spent: ${roiData?.totalSpent.toLocaleString()}
              </Typography>
              <Typography variant="h6" gutterBottom>
                Total Revenue: ${roiData?.totalRevenue.toLocaleString()}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" gutterBottom>
                Cost per Acquisition: ${roiData?.cpa}
              </Typography>
              <Typography variant="body2">
                Lifetime Value: ${roiData?.ltv}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Campaign Breakdown */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardHeader title="Campaign Performance" />
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Campaign</TableCell>
                    <TableCell align="right">Spend</TableCell>
                    <TableCell align="right">Revenue</TableCell>
                    <TableCell align="right">ROAS</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {roiData?.campaignBreakdown.map((campaign, index) => (
                    <TableRow key={index}>
                      <TableCell>{campaign.name}</TableCell>
                      <TableCell align="right">${campaign.spend.toLocaleString()}</TableCell>
                      <TableCell align="right">${campaign.revenue.toLocaleString()}</TableCell>
                      <TableCell align="right">
                        <Chip 
                          label={`${campaign.roas.toFixed(2)}x`}
                          color={campaign.roas >= 3 ? 'success' : campaign.roas >= 2 ? 'warning' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={campaign.status}
                          color={campaign.status === 'active' ? 'success' : campaign.status === 'paused' ? 'warning' : 'default'}
                          size="small"
                        />
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
  );

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          📊 Real-Time Analytics
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Live performance tracking, A/B testing, and ROI optimization
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
          <Chip icon={<Monitor />} label="Live Data" color="success" />
          <Chip icon={<TrackChanges />} label="A/B Testing" color="primary" />
          <Chip icon={<AttachMoney />} label="ROI Tracking" color="warning" />
        </Box>
      </Box>

      {/* Timeframe Selector */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Timeframe</InputLabel>
          <Select
            value={selectedTimeframe}
            label="Timeframe"
            onChange={(e) => setSelectedTimeframe(e.target.value)}
          >
            <MenuItem value="1h">Last Hour</MenuItem>
            <MenuItem value="24h">Last 24 Hours</MenuItem>
            <MenuItem value="7d">Last 7 Days</MenuItem>
            <MenuItem value="30d">Last 30 Days</MenuItem>
            <MenuItem value="90d">Last 90 Days</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Navigation Tabs */}
      <Box sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="Overview" value="overview" />
          <Tab label="A/B Testing" value="abtesting" />
          <Tab label="ROI Tracking" value="roi" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'abtesting' && renderABTesting()}
      {activeTab === 'roi' && renderROITracking()}

      {/* Settings */}
      <Card sx={{ mt: 4 }}>
        <CardHeader title="Analytics Settings" />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={realTimeUpdates}
                    onChange={(e) => setRealTimeUpdates(e.target.checked)}
                  />
                }
                label="Real-time Updates"
              />
              <Typography variant="caption" color="text.secondary" display="block">
                Continuously update metrics and performance data every 5 seconds
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Data Refresh Rate</InputLabel>
                <Select
                  value="5s"
                  label="Data Refresh Rate"
                  disabled
                >
                  <MenuItem value="5s">Every 5 seconds (Recommended)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
