'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Button, 
  Chip, 
  CircularProgress,
  Paper,
  Container
} from '@mui/material';
import { 
  MuiCard,
  MuiCardHeader,
  MuiCardContent,
  MuiCardTitle,
  MuiButton,
  MuiTabs,
  MuiTab,
  MuiTabPanel
} from '@/components/ui/mui-components';
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Heart, 
  Share2, 
  BarChart3,
  Lightbulb,
  RefreshCw,
  Calendar,
  Target
} from 'lucide-react';
import { AnalyticsOverview } from './AnalyticsOverview';
import { EngagementChart } from './EngagementChart';
import { PlatformBreakdown } from './PlatformBreakdown';
import { InsightsPanel } from './InsightsPanel';
import { TopPostsList } from './TopPostsList';

interface AnalyticsData {
  userId: string;
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
    platformBreakdown: Record<string, {
      posts: number;
      engagement: number;
    }>;
  };
  trends: {
    weeklyGrowth: number[];
    engagementTrend: number[];
  };
  lastUpdated: string;
}

interface Insight {
  id: string;
  type: 'performance' | 'timing' | 'content' | 'engagement' | 'growth';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  data: Record<string, any>;
  recommendations: string[];
  createdAt: Date;
}

interface UserInsights {
  userId: string;
  insights: Insight[];
  lastGenerated: Date;
  nextUpdate: Date;
}

export function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [insights, setInsights] = useState<UserInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Load analytics data
      const analyticsResponse = await fetch('/api/analytics');
      if (analyticsResponse.ok) {
        const analyticsResult = await analyticsResponse.json();
        setAnalyticsData(analyticsResult.data);
      }

      // Load insights
      const insightsResponse = await fetch('/api/analytics/insights');
      if (insightsResponse.ok) {
        const insightsResult = await insightsResponse.json();
        setInsights(insightsResult.data);
      }
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshInsights = async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/analytics/insights', {
        method: 'POST',
      });
      
      if (response.ok) {
        const result = await response.json();
        setInsights(result.data);
      }
    } catch (error) {
      console.error('Failed to refresh insights:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: 400 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!analyticsData) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <BarChart3 sx={{ mx: 'auto', width: 48, height: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" component="h3" sx={{ mb: 1, color: 'text.primary' }}>
          No Analytics Data
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Start creating content to see your analytics here.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' }, 
        alignItems: { sm: 'center' }, 
        justifyContent: 'space-between', 
        gap: 2 
      }}>
        <Box>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 'bold', 
              color: 'text.primary',
              wordBreak: 'break-word',
              fontSize: { xs: '1.5rem', sm: '1.875rem' }
            }}
          >
            Analytics Dashboard
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary', 
              mt: 0.5,
              wordBreak: 'break-word'
            }}
          >
            Last updated: {new Date(analyticsData.lastUpdated).toLocaleString()}
          </Typography>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          gap: 1,
          width: { xs: '100%', sm: 'auto' },
          alignItems: { sm: 'center' }
        }}>
          <MuiButton
            variant="outlined"
            onClick={loadAnalyticsData}
            disabled={refreshing}
            sx={{ 
              width: { xs: '100%', sm: 'auto' },
              minWidth: 44,
              minHeight: 44,
              bgcolor: 'background.paper'
            }}
          >
            <RefreshCw sx={{ 
              width: 16, 
              height: 16, 
              mr: 1,
              animation: refreshing ? 'spin 1s linear infinite' : 'none'
            }} />
            Refresh
          </MuiButton>
          <MuiButton
            onClick={refreshInsights}
            disabled={refreshing}
            sx={{ 
              width: { xs: '100%', sm: 'auto' },
              minWidth: 44,
              minHeight: 44
            }}
          >
            <Lightbulb sx={{ width: 16, height: 16, mr: 1 }} />
            Generate Insights
          </MuiButton>
        </Box>
      </Box>

      {/* Overview Cards */}
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <MuiCard>
            <MuiCardHeader
              sx={{ 
                display: 'flex', 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                pb: 1
              }}
            >
              <MuiCardTitle sx={{ fontSize: '0.875rem', fontWeight: 500, wordBreak: 'break-word' }}>
                Total Posts
              </MuiCardTitle>
              <MessageSquare sx={{ width: 16, height: 16, color: 'text.secondary', flexShrink: 0 }} />
            </MuiCardHeader>
            <MuiCardContent>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {analyticsData.overview.totalPosts}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', wordBreak: 'break-word' }}>
                +{analyticsData.overview.growthRate}% from last month
              </Typography>
            </MuiCardContent>
          </MuiCard>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <MuiCard>
            <MuiCardHeader
              sx={{ 
                display: 'flex', 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                pb: 1
              }}
            >
              <MuiCardTitle sx={{ fontSize: '0.875rem', fontWeight: 500, wordBreak: 'break-word' }}>
                Total Engagement
              </MuiCardTitle>
              <Heart sx={{ width: 16, height: 16, color: 'text.secondary', flexShrink: 0 }} />
            </MuiCardHeader>
            <MuiCardContent>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {analyticsData.overview.totalEngagement.toLocaleString()}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', wordBreak: 'break-word' }}>
                Likes, comments, shares
              </Typography>
            </MuiCardContent>
          </MuiCard>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <MuiCard>
            <MuiCardHeader
              sx={{ 
                display: 'flex', 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                pb: 1
              }}
            >
              <MuiCardTitle sx={{ fontSize: '0.875rem', fontWeight: 500, wordBreak: 'break-word' }}>
                Avg Engagement Rate
              </MuiCardTitle>
              <TrendingUp sx={{ width: 16, height: 16, color: 'text.secondary', flexShrink: 0 }} />
            </MuiCardHeader>
            <MuiCardContent>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {analyticsData.overview.avgEngagementRate.toFixed(1)}%
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', wordBreak: 'break-word' }}>
                Per post average
              </Typography>
            </MuiCardContent>
          </MuiCard>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <MuiCard>
            <MuiCardHeader
              sx={{ 
                display: 'flex', 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                pb: 1
              }}
            >
              <MuiCardTitle sx={{ fontSize: '0.875rem', fontWeight: 500, wordBreak: 'break-word' }}>
                Followers
              </MuiCardTitle>
              <Users sx={{ width: 16, height: 16, color: 'text.secondary', flexShrink: 0 }} />
            </MuiCardHeader>
            <MuiCardContent>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {analyticsData.overview.followers.toLocaleString()}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', wordBreak: 'break-word' }}>
                Across all platforms
              </Typography>
            </MuiCardContent>
          </MuiCard>
        </Grid>
      </Grid>

      {/* Tabs */}
      <MuiTabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
        <MuiTab label="Overview" />
        <MuiTab label="Performance" />
        <MuiTab label="Insights" />
      </MuiTabs>

      {/* Tab Panels */}
      <MuiTabPanel value={activeTab} index={0}>
        <AnalyticsOverview data={analyticsData} />
      </MuiTabPanel>

      <MuiTabPanel value={activeTab} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <EngagementChart data={analyticsData.trends} />
          </Grid>
          <Grid item xs={12} lg={4}>
            <PlatformBreakdown data={analyticsData.performance.platformBreakdown} />
          </Grid>
          <Grid item xs={12}>
            <TopPostsList posts={analyticsData.performance.topPosts} />
          </Grid>
        </Grid>
      </MuiTabPanel>

      <MuiTabPanel value={activeTab} index={2}>
        <InsightsPanel 
          insights={insights?.insights || []} 
          onRefresh={refreshInsights}
          refreshing={refreshing}
        />
      </MuiTabPanel>
    </Box>
  );
} 