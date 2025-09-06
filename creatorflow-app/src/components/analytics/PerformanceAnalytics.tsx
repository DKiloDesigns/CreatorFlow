"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
  Alert,
  IconButton,
  Tooltip,
  Divider,
  Stack
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  BarChart,
  PieChart,
  ShowChart,
  Refresh,
  Info,
  Visibility,
  ThumbUp,
  Message,
  Share,
  CalendarToday
} from '@/lib/mui-optimized-imports';

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
      [key: string]: {
        posts: number;
        engagement: number;
      };
    };
  };
  trends: {
    weeklyGrowth: number[];
    engagementTrend: number[];
  };
  lastUpdated: string;
}

interface PlatformData {
  [key: string]: {
    impressions: number;
    reach: number;
    engagement: number;
    clicks: number;
    conversions: number;
    revenue: number;
    ctr: string;
    cpc: string;
    roas: string;
  };
}

export default function PerformanceAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [platformData, setPlatformData] = useState<PlatformData | null>(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [analyticsRes, platformRes] = await Promise.all([
        fetch('/api/analytics'),
        fetch('/api/analytics/platform-breakdown')
      ]);

      if (analyticsRes.ok && platformRes.ok) {
        const analytics = await analyticsRes.json();
        const platform = await platformRes.json();
        
        setAnalyticsData(analytics.data);
        setPlatformData(platform.data);
      } else {
        throw new Error('Failed to fetch analytics data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getGrowthColor = (value: number) => {
    return value >= 0 ? 'success' : 'error';
  };

  const getGrowthIcon = (value: number) => {
    return value >= 0 ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />;
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
          Loading performance analytics...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
        <IconButton size="small" onClick={fetchAnalyticsData} sx={{ ml: 1 }}>
          <Refresh />
        </IconButton>
      </Alert>
    );
  }

  if (!analyticsData || !platformData) {
    return (
      <Alert severity="warning">
        No analytics data available. Please check your content and try again.
      </Alert>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 2 }, pb: { xs: 8, sm: 4 } }}>
      {/* Header with Controls */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' }, 
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        gap: 2, 
        mb: 4 
      }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Performance Analytics
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Last updated: {new Date(analyticsData.lastUpdated).toLocaleString()}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="7d">Last 7 days</MenuItem>
              <MenuItem value="30d">Last 30 days</MenuItem>
              <MenuItem value="90d">Last 90 days</MenuItem>
              <MenuItem value="1y">Last year</MenuItem>
            </Select>
          </FormControl>
          
          <Tooltip title="Refresh data">
            <IconButton onClick={fetchAnalyticsData}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Key Metrics Overview */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: 3,
        mb: 6 
      }}>
        <Card>
          <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="text.secondary" gutterBottom variant="body2">
                  Total Posts
                </Typography>
                <Typography variant="h5" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                  {analyticsData.overview.totalPosts}
                </Typography>
              </Box>
              <CalendarToday color="primary" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }} />
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="text.secondary" gutterBottom variant="body2">
                  Total Engagement
                </Typography>
                <Typography variant="h5" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                  {formatNumber(analyticsData.overview.totalEngagement)}
                </Typography>
              </Box>
              <ThumbUp color="primary" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }} />
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="text.secondary" gutterBottom variant="body2">
                  Avg Engagement Rate
                </Typography>
                <Typography variant="h5" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                  {analyticsData.overview.avgEngagementRate}%
                </Typography>
              </Box>
              <BarChart color="primary" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }} />
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="text.secondary" gutterBottom variant="body2">
                  Growth Rate
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography variant="h5" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                    {analyticsData.overview.growthRate}%
                  </Typography>
                  <Chip
                    icon={getGrowthIcon(analyticsData.overview.growthRate)}
                    label={`${analyticsData.overview.growthRate > 0 ? '+' : ''}${analyticsData.overview.growthRate}%`}
                    color={getGrowthColor(analyticsData.overview.growthRate) as any}
                    size="small"
                  />
                </Box>
              </Box>
              <ShowChart color="primary" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }} />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Spacer between Key Metrics and Platform Performance */}
      <Box sx={{ height: 24 }} />

      {/* Platform Performance */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
        gap: 4,
        mb: 6 
      }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Platform Performance Overview
            </Typography>
            <Stack spacing={3}>
              {Object.entries(platformData).map(([platform, data]) => (
                <Box key={platform} sx={{ pb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2">{platform}</Typography>
                    <Chip 
                      label={`${data.ctr}% CTR`} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, mb: 1, flexWrap: 'wrap' }}>
                    <Typography variant="body2" color="text.secondary">
                      Impressions: {formatNumber(data.impressions)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Reach: {formatNumber(data.reach)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Typography variant="body2" color="text.secondary">
                      Engagement: {formatNumber(data.engagement)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Revenue: ${formatNumber(data.revenue)}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(data.engagement / Math.max(...Object.values(platformData).map(p => p.engagement))) * 100}
                    sx={{ mt: 1 }}
                  />
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>

        {/* Divider between Platform Performance cards */}
        <Box sx={{ 
          display: { xs: 'block', md: 'none' }, 
          height: 16, 
          width: '100%' 
        }} />

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Top Performing Content
            </Typography>
            <Stack spacing={3}>
              {analyticsData.performance.topPosts.map((post, index) => (
                <Box key={post.id} sx={{ pb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip 
                        label={`#${index + 1}`} 
                        size="small" 
                        color={index === 0 ? 'primary' : 'default'}
                      />
                      <Typography variant="subtitle2">
                        {post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ThumbUp fontSize="small" color="action" />
                      <Typography variant="body2">
                        {formatNumber(post.engagement)}
                      </Typography>
                    </Box>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(post.engagement / Math.max(...analyticsData.performance.topPosts.map(p => p.engagement))) * 100}
                    sx={{ mt: 1 }}
                  />
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* Spacer between Platform Performance and Trends */}
      <Box sx={{ height: 24 }} />

      {/* Trends and Growth - Two Column Layout */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
        gap: 4,
        mb: 6 
      }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Weekly Growth Trend
            </Typography>
            <Box sx={{ height: 200, display: 'flex', alignItems: 'end', gap: 1, p: 2 }}>
              {analyticsData.trends.weeklyGrowth.map((value, index) => (
                <Box
                  key={index}
                  sx={{
                    flex: 1,
                    height: `${(value / Math.max(...analyticsData.trends.weeklyGrowth)) * 100}%`,
                    backgroundColor: 'primary.main',
                    borderRadius: '4px 4px 0 0',
                    minHeight: '20px',
                    position: 'relative'
                  }}
                >
                  <Tooltip title={`Week ${index + 1}: ${value}%`}>
                    <Box sx={{ height: '100%', width: '100%' }} />
                  </Tooltip>
                </Box>
              ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Weekly growth percentage over time
              </Typography>
              <Typography variant="caption" color="primary.main" sx={{ fontWeight: 'bold' }}>
                Range: {Math.min(...analyticsData.trends.weeklyGrowth)}% - {Math.max(...analyticsData.trends.weeklyGrowth)}%
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Divider between Trends cards */}
        <Box sx={{ 
          display: { xs: 'block', md: 'none' }, 
          height: 16, 
          width: '100%' 
        }} />

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Engagement Rate Trend
            </Typography>
            <Box sx={{ height: 200, display: 'flex', alignItems: 'end', gap: 1, p: 2 }}>
              {analyticsData.trends.engagementTrend.map((value, index) => (
                <Box
                  key={index}
                  sx={{
                    flex: 1,
                    height: `${(value / Math.max(...analyticsData.trends.engagementTrend)) * 100}%`,
                    backgroundColor: 'secondary.main',
                    borderRadius: '4px 4px 0 0',
                    minHeight: '20px',
                    position: 'relative'
                  }}
                >
                  <Tooltip title={`Week ${index + 1}: ${value}%`}>
                    <Box sx={{ height: '100%', width: '100%' }} />
                  </Tooltip>
                </Box>
              ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Engagement rate percentage over time
              </Typography>
              <Typography variant="caption" color="secondary.main" sx={{ fontWeight: 'bold' }}>
                Range: {Math.min(...analyticsData.trends.engagementTrend)}% - {Math.max(...analyticsData.trends.engagementTrend)}%
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Spacer between Trends and AI-Powered Insights */}
      <Box sx={{ height: 24 }} />

      {/* Insights and Recommendations */}
      <Card sx={{ mt: 3, mb: 8 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            AI-Powered Insights
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 3
          }}>
            <Alert severity="info" icon={<Info />}>
              <Typography variant="body2">
                <strong>Best Performing Platform:</strong> Instagram shows the highest engagement rate at {Math.max(...Object.values(platformData).map(p => parseFloat(p.ctr))).toFixed(2)}% CTR
              </Typography>
            </Alert>
            <Alert severity="success" icon={<TrendingUp />}>
              <Typography variant="body2">
                <strong>Growth Opportunity:</strong> Your content is growing {analyticsData.overview.growthRate}% month-over-month. Consider increasing posting frequency
              </Typography>
            </Alert>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
