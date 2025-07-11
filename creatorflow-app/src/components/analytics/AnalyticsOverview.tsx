'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Target,
  BarChart3,
  Users,
  MessageSquare
} from 'lucide-react';

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

interface AnalyticsOverviewProps {
  data: AnalyticsData;
}

export function AnalyticsOverview({ data }: AnalyticsOverviewProps) {
  const calculateGrowthTrend = (trends: number[]) => {
    if (trends.length < 2) return 0;
    const recent = trends[trends.length - 1];
    const previous = trends[trends.length - 2];
    return ((recent - previous) / previous) * 100;
  };

  const engagementGrowth = calculateGrowthTrend(data.trends.engagementTrend);
  const totalPlatforms = Object.keys(data.performance.platformBreakdown).length;
  const avgPostsPerPlatform = data.overview.totalPosts / totalPlatforms;

  const metrics = [
    {
      label: 'Avg Engagement Rate',
      value: `${data.overview.avgEngagementRate}%`,
      trend: engagementGrowth,
      icon: <Target className="h-4 w-4" />,
      color: 'text-blue-600',
    },
    {
      label: 'Posts per Platform',
      value: avgPostsPerPlatform.toFixed(1),
      trend: data.overview.growthRate,
      icon: <MessageSquare className="h-4 w-4" />,
      color: 'text-green-600',
    },
    {
      label: 'Active Platforms',
      value: totalPlatforms.toString(),
      trend: 0,
      icon: <Users className="h-4 w-4" />,
      color: 'text-purple-600',
    },
    {
      label: 'Content Performance',
      value: `${Math.round((data.overview.totalEngagement / data.overview.totalPosts))}`,
      trend: engagementGrowth,
      icon: <BarChart3 className="h-4 w-4" />,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-lg bg-gray-100 ${metric.color}`}>
                  {metric.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                  <p className="text-lg font-bold text-gray-900">{metric.value}</p>
                </div>
              </div>
              <div className="text-right">
                {metric.trend > 0 ? (
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">+{metric.trend.toFixed(1)}%</span>
                  </div>
                ) : metric.trend < 0 ? (
                  <div className="flex items-center text-red-600">
                    <TrendingDown className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">{metric.trend.toFixed(1)}%</span>
                  </div>
                ) : (
                  <div className="text-gray-400">
                    <span className="text-sm">-</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Performance Indicators */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Performance Indicators</h3>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Engagement Rate</span>
              <span className="font-medium">{data.overview.avgEngagementRate}%</span>
            </div>
            <Progress 
              value={Math.min(data.overview.avgEngagementRate, 100)} 
              className="h-2"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Growth Rate</span>
              <span className="font-medium">+{data.overview.growthRate}%</span>
            </div>
            <Progress 
              value={Math.min(data.overview.growthRate, 100)} 
              className="h-2"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Content Consistency</span>
              <span className="font-medium">{data.overview.totalPosts} posts</span>
            </div>
            <Progress 
              value={Math.min((data.overview.totalPosts / 100) * 100, 100)} 
              className="h-2"
            />
          </div>
        </div>
      </div>

      {/* Platform Performance */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Platform Performance</h3>
        
        <div className="space-y-3">
          {Object.entries(data.performance.platformBreakdown).map(([platform, stats]) => (
            <div key={platform} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <div>
                  <p className="font-medium text-gray-900 capitalize">{platform}</p>
                  <p className="text-sm text-gray-500">{stats.posts} posts</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{stats.engagement.toLocaleString()}</p>
                <p className="text-sm text-gray-500">engagement</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Performance Summary</h4>
              <p className="text-sm text-blue-700">
                Your content is performing {data.overview.avgEngagementRate > 5 ? 'well' : 'below average'} 
                with an {data.overview.avgEngagementRate}% engagement rate. 
                {data.overview.growthRate > 10 ? ' Great growth momentum!' : ' Consider increasing your posting frequency.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 