'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  const [activeTab, setActiveTab] = useState('overview');

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
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-8">
        <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data</h3>
        <p className="text-gray-500">Start creating content to see your analytics here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1 break-words">
            Last updated: {new Date(analyticsData.lastUpdated).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-col gap-2 w-full sm:w-auto sm:flex-row sm:items-center sm:justify-end sm:space-x-3">
          <Button
            variant="outline"
            onClick={loadAnalyticsData}
            disabled={refreshing}
            className="w-full sm:w-auto min-w-[44px] min-h-[44px]"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={refreshInsights}
            disabled={refreshing}
            className="w-full sm:w-auto min-w-[44px] min-h-[44px]"
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            Generate Insights
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium break-words">Total Posts</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.totalPosts}</div>
            <p className="text-xs text-muted-foreground break-words">
              +{analyticsData.overview.growthRate}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium break-words">Total Engagement</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.totalEngagement.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground break-words">
              {analyticsData.overview.avgEngagementRate}% avg engagement rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium break-words">Followers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.followers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground break-words">
              +{analyticsData.overview.growthRate}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium break-words">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{analyticsData.overview.growthRate}%</div>
            <p className="text-xs text-muted-foreground break-words">
              Monthly follower growth
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="performance" className="text-xs sm:text-sm">Performance</TabsTrigger>
          <TabsTrigger value="insights" className="text-xs sm:text-sm">AI Insights</TabsTrigger>
          <TabsTrigger value="trends" className="text-xs sm:text-sm">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="break-words">Engagement Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <EngagementChart data={analyticsData.trends.engagementTrend} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="break-words">Platform Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <PlatformBreakdown data={analyticsData.performance.platformBreakdown} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="break-words">Top Performing Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <TopPostsList posts={analyticsData.performance.topPosts} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="break-words">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <AnalyticsOverview data={analyticsData} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <InsightsPanel insights={insights} onRefresh={refreshInsights} />
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="break-words">Weekly Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <EngagementChart data={analyticsData.trends.weeklyGrowth} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="break-words">Engagement Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <EngagementChart data={analyticsData.trends.engagementTrend} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 