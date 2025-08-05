'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardHeader, 
  CardContent, 
  Chip,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  Heart, 
  MessageSquare, 
  Users, 
  Lightbulb,
  RefreshCw,
  BarChart3,
  Target,
  Zap
} from 'lucide-react';
import { InsightsPanel } from './InsightsPanel';

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
          <Button
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
          </Button>
          <Button
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
          </Button>
        </Box>
      </Box>

      {/* Overview Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: { xs: 2, sm: 3 } }}>
        <Box>
          <Card>
            <CardHeader
              sx={{ 
                display: 'flex', 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                pb: 1
              }}
            >
              <Typography variant="h6" component="h3" sx={{ fontSize: '0.875rem', fontWeight: 500, wordBreak: 'break-word' }}>
                Total Posts
              </Typography>
              <MessageSquare style={{ width: 16, height: 16, color: 'var(--mui-palette-text-secondary)', flexShrink: 0 }} />
            </CardHeader>
            <CardContent>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {analyticsData.overview.totalPosts}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', wordBreak: 'break-word' }}>
                +{analyticsData.overview.growthRate}% from last month
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box>
          <Card>
            <CardHeader
              sx={{ 
                display: 'flex', 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                pb: 1
              }}
            >
              <Typography variant="h6" component="h3" sx={{ fontSize: '0.875rem', fontWeight: 500, wordBreak: 'break-word' }}>
                Total Engagement
              </Typography>
              <Heart style={{ width: 16, height: 16, color: 'var(--mui-palette-text-secondary)', flexShrink: 0 }} />
            </CardHeader>
            <CardContent>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {analyticsData.overview.totalEngagement.toLocaleString()}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', wordBreak: 'break-word' }}>
                Likes, comments, shares
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box>
          <Card>
            <CardHeader
              sx={{ 
                display: 'flex', 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                pb: 1
              }}
            >
              <Typography variant="h6" component="h3" sx={{ fontSize: '0.875rem', fontWeight: 500, wordBreak: 'break-word' }}>
                Avg Engagement Rate
              </Typography>
              <TrendingUp style={{ width: 16, height: 16, color: 'var(--mui-palette-text-secondary)', flexShrink: 0 }} />
            </CardHeader>
            <CardContent>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {analyticsData.overview.avgEngagementRate.toFixed(1)}%
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', wordBreak: 'break-word' }}>
                Per post average
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box>
          <Card>
            <CardHeader
              sx={{ 
                display: 'flex', 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                pb: 1
              }}
            >
              <Typography variant="h6" component="h3" sx={{ fontSize: '0.875rem', fontWeight: 500, wordBreak: 'break-word' }}>
                Followers
              </Typography>
              <Users style={{ width: 16, height: 16, color: 'var(--mui-palette-text-secondary)', flexShrink: 0 }} />
            </CardHeader>
            <CardContent>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {analyticsData.overview.followers.toLocaleString()}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', wordBreak: 'break-word' }}>
                Across all platforms
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Charts Section */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3, mt: 3 }}>
        <Box>
          <Card>
            <CardHeader>
              <Typography variant="h6" component="h3" sx={{ fontSize: '0.875rem', fontWeight: 500, wordBreak: 'break-word' }}>
                Engagement Trends
              </Typography>
            </CardHeader>
            <CardContent>
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Chart placeholder - Engagement trends over time
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box>
          <Card>
            <CardHeader>
              <Typography variant="h6" component="h3" sx={{ fontSize: '0.875rem', fontWeight: 500, wordBreak: 'break-word' }}>
                Platform Breakdown
              </Typography>
            </CardHeader>
            <CardContent>
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Chart placeholder - Platform performance
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Insights Section */}
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardHeader>
            <Typography variant="h6" component="h3" sx={{ fontSize: '0.875rem', fontWeight: 500, wordBreak: 'break-word' }}>
              AI-Generated Insights
            </Typography>
          </CardHeader>
          <CardContent>
            <InsightsPanel 
              insights={insights?.insights || []} 
              onRefresh={refreshInsights}
              refreshing={refreshing}
            />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
} 