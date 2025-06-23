/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, Legend as RechartsLegend, ResponsiveContainer, CartesianGrid, BarChart, Bar } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner, LoadingSkeleton } from '@/components/ui/loading-spinner';
import { EmptyState } from '@/components/ui/empty-state';
import { 
  BarChart2, 
  TrendingUp, 
  Users, 
  Heart, 
  Share2, 
  MessageSquare,
  Eye,
  Calendar,
  Download,
  Filter
} from 'lucide-react';
import dynamic from 'next/dynamic';
import useSWR from 'swr';

// If process.env.NEXT_PUBLIC_MOCK_ANALYTICS is set, use mock analytics data (append ?mock=1 to API requests)
const useMockAnalytics = process.env.NEXT_PUBLIC_MOCK_ANALYTICS === '1';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <div className="bg-white rounded shadow p-4 min-h-[100px]">{children}</div>
    </div>
  );
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

// Add safe number and string helpers
function safeNumber(val: any, digits: number = 0, fallback: string = '-') {
  if (typeof val === 'number' && !isNaN(val)) {
    return digits > 0 ? val.toFixed(digits) : val;
  }
  return fallback;
}
function safeString(val: any, fallback: string = '-') {
  return typeof val === 'string' && val.length > 0 ? val : fallback;
}

// Replace static imports with dynamic imports
const AnalyticsChart = dynamic(() => import('@/components/dashboard/analytics-chart').then(mod => mod.AnalyticsChart));
const MetricCard = dynamic(() => import('@/components/dashboard/analytics-chart').then(mod => mod.MetricCard));

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  // Mock data - in real app, this would come from API
  const [analyticsData, setAnalyticsData] = useState({
    engagement: [
      { label: 'Likes', value: 1247, color: '#3b82f6' },
      { label: 'Comments', value: 342, color: '#06b6d4' },
      { label: 'Shares', value: 189, color: '#8b5cf6' },
      { label: 'Saves', value: 89, color: '#f59e0b' }
    ],
    platformPerformance: [
      { label: 'Instagram', value: 45, color: '#e4405f' },
      { label: 'Twitter', value: 32, color: '#1da1f2' },
      { label: 'LinkedIn', value: 18, color: '#0077b5' },
      { label: 'Facebook', value: 5, color: '#1877f2' }
    ],
    weeklyTrend: [
      { label: 'Mon', value: 120 },
      { label: 'Tue', value: 145 },
      { label: 'Wed', value: 98 },
      { label: 'Thu', value: 167 },
      { label: 'Fri', value: 203 },
      { label: 'Sat', value: 178 },
      { label: 'Sun', value: 156 }
    ],
    contentTypes: [
      { label: 'Images', value: 65, color: '#10b981' },
      { label: 'Videos', value: 25, color: '#f97316' },
      { label: 'Text', value: 10, color: '#6366f1' }
    ]
  });

  // Replace useEffect and useState for API data with SWR hooks
  const { data: overviewData, error: overviewError } = useSWR(`/api/analytics/overview${useMockAnalytics ? '?mock=1' : ''}`, fetcher);
  const { data: platformData, error: platformError, isLoading: platformLoading } = useSWR(`/api/analytics/platform-breakdown${useMockAnalytics ? '?mock=1' : ''}`, fetcher);

  // Replace metrics array with useMemo
  const metrics = useMemo(() => [
    {
      title: 'Total Reach',
      value: '24.5K',
      change: { value: 12, isPositive: true },
      icon: Eye
    },
    {
      title: 'Total Engagement',
      value: '2,847',
      change: { value: 8, isPositive: true },
      icon: Heart
    },
    {
      title: 'New Followers',
      value: '+342',
      change: { value: 15, isPositive: true },
      icon: Users
    },
    {
      title: 'Posts Published',
      value: '12',
      change: { value: 3, isPositive: true },
      icon: Calendar
    }
  ], []);

  // Memoize top posts and platform performance lists
  const topPostsList = useMemo(() => ([
    { title: 'Behind the scenes look at our process', engagement: 847, platform: 'Instagram' },
    { title: 'New product announcement', engagement: 623, platform: 'LinkedIn' },
    { title: 'Industry insights and tips', engagement: 445, platform: 'Twitter' }
  ]), []);
  const platformPerformanceList = useMemo(() => analyticsData.platformPerformance, [analyticsData.platformPerformance]);

  if (overviewError || platformError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <LoadingSkeleton variant="text" className="h-8 w-48" />
          <LoadingSkeleton variant="button" className="h-10 w-32" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <LoadingSkeleton key={i} variant="card" />
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <LoadingSkeleton key={i} variant="card" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Track your social media performance and engagement metrics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
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
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            icon={metric.icon}
          />
        ))}
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnalyticsChart
              title="Weekly Engagement Trend"
              data={analyticsData.weeklyTrend}
              type="line"
            />
            <AnalyticsChart
              title="Engagement Breakdown"
              data={analyticsData.engagement}
              type="donut"
            />
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnalyticsChart
              title="Engagement by Type"
              data={analyticsData.engagement}
              type="bar"
            />
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPostsList.map((post, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{post.title}</p>
                        <p className="text-xs text-muted-foreground">{post.platform}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">{post.engagement}</p>
                        <p className="text-xs text-muted-foreground">engagements</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnalyticsChart
              title="Performance by Platform"
              data={platformPerformanceList}
              type="pie"
            />
            <Card>
              <CardHeader>
                <CardTitle>Platform Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {platformPerformanceList.map((platform, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: platform.color }}
                        />
                        <span className="font-medium">{platform.label}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{platform.value}%</p>
                        <p className="text-xs text-muted-foreground">of total engagement</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnalyticsChart
              title="Content Type Performance"
              data={analyticsData.contentTypes}
              type="bar"
            />
            <Card>
              <CardHeader>
                <CardTitle>Content Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                    <div>
                      <p className="font-medium">Best Time to Post</p>
                      <p className="text-sm text-muted-foreground">Based on engagement data</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">2-4 PM</p>
                      <p className="text-xs text-muted-foreground">Weekdays</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
                    <div>
                      <p className="font-medium">Optimal Post Length</p>
                      <p className="text-sm text-muted-foreground">For maximum engagement</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">150-200</p>
                      <p className="text-xs text-muted-foreground">characters</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                    <div>
                      <p className="font-medium">Hashtag Performance</p>
                      <p className="text-sm text-muted-foreground">Average engagement</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">+23%</p>
                      <p className="text-xs text-muted-foreground">with hashtags</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Empty State for no data */}
      {analyticsData.engagement.length === 0 && (
        <EmptyState
          title="No analytics data yet"
          description="Start posting content to see your performance metrics and insights."
          action={{
            label: "Create First Post",
            onClick: () => window.location.href = '/dashboard/content'
          }}
        />
      )}
    </div>
  );
} 