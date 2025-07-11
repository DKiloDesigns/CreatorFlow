'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2,
  Calendar,
  Clock,
  Target,
  Zap,
  Activity
} from 'lucide-react';

interface AnalyticsData {
  totalPosts: number;
  totalEngagement: number;
  avgEngagementRate: number;
  totalReach: number;
  totalImpressions: number;
  platformBreakdown: {
    platform: string;
    posts: number;
    engagement: number;
    reach: number;
  }[];
  recentPerformance: {
    date: string;
    posts: number;
    engagement: number;
    reach: number;
  }[];
  topPerformingPosts: {
    id: string;
    content: string;
    platform: string;
    engagement: number;
    reach: number;
    publishedAt: string;
  }[];
  audienceGrowth: {
    date: string;
    followers: number;
    growth: number;
  }[];
}

interface AdvancedAnalyticsDashboardProps {
  userId: string;
  timeRange?: '7d' | '30d' | '90d' | '1y';
}

export function AdvancedAnalyticsDashboard({ 
  userId, 
  timeRange = '30d' 
}: AdvancedAnalyticsDashboardProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  useEffect(() => {
    fetchAnalyticsData();
  }, [userId, selectedTimeRange, selectedPlatform]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/analytics/advanced?userId=${userId}&timeRange=${selectedTimeRange}&platform=${selectedPlatform}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      } else {
        console.error('Failed to fetch analytics data');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeRangeChange = (value: string) => {
    setSelectedTimeRange(value as '7d' | '30d' | '90d' | '1y');
  };
  const handlePlatformChange = (value: string) => {
    setSelectedPlatform(value);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Advanced Analytics</h2>
          <div className="flex gap-2">
            <Select value={selectedTimeRange} onValueChange={handleTimeRangeChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedPlatform} onValueChange={handlePlatformChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-12">
        <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data</h3>
        <p className="text-gray-500">Start posting content to see your analytics here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Advanced Analytics</h2>
          <p className="text-gray-600">Comprehensive insights into your content performance</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedTimeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedPlatform} onValueChange={handlePlatformChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchAnalyticsData} variant="outline" size="sm">
            <Zap className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalPosts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Engagement</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalEngagement.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +8% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Engagement Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.avgEngagementRate.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalReach.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +15% from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="platforms">Platform Breakdown</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="top-posts">Top Posts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Trends</CardTitle>
                <CardDescription>Your engagement over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  Chart Component - Engagement Trends
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Audience Growth</CardTitle>
                <CardDescription>Follower growth and engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  Chart Component - Audience Growth
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Performance</CardTitle>
              <CardDescription>How your content performs across different platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.platformBreakdown.map((platform) => (
                  <div key={platform.platform} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline">{platform.platform}</Badge>
                      <span className="text-sm text-gray-600">{platform.posts} posts</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">{platform.engagement.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">engagement</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{platform.reach.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">reach</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Performance</CardTitle>
              <CardDescription>Daily performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.recentPerformance.slice(0, 7).map((day) => (
                  <div key={day.date} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium">{day.date}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">{day.posts}</div>
                        <div className="text-xs text-gray-500">posts</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{day.engagement.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">engagement</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{day.reach.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">reach</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="top-posts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Posts</CardTitle>
              <CardDescription>Your best performing content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topPerformingPosts.map((post) => (
                  <div key={post.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{post.platform}</Badge>
                        <span className="text-xs text-gray-500">{post.publishedAt}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <div className="text-sm font-medium">{post.engagement.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">engagement</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{post.reach.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">reach</div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">{post.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 