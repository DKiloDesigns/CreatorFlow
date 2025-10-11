'use client';

import React from 'react';
import { 
  Card,
  CardContent,
  Box,
  Typography,
  LinearProgress
} from '@mui/material';
import {
  Timeline as ActivityIcon,
  TrendingUp as TrendingUpIcon,
  BarChart as BarChart3Icon
} from '@mui/icons-material';

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
      label: 'Total Posts',
      value: data.overview.totalPosts.toLocaleString(),
      trend: data.overview.growthRate,
      icon: <ActivityIcon sx={{ width: 16, height: 16 }} />,
      color: 'primary.main',
    },
    {
      label: 'Total Engagement',
      value: data.overview.totalEngagement.toLocaleString(),
      trend: data.overview.growthRate,
      icon: <ActivityIcon sx={{ width: 16, height: 16 }} />,
      color: 'success.main',
    },
    {
      label: 'Avg Engagement Rate',
      value: `${data.overview.avgEngagementRate}%`,
      trend: data.overview.growthRate,
      icon: <ActivityIcon sx={{ width: 16, height: 16 }} />,
      color: 'secondary.main',
    },
    {
      label: 'Followers',
      value: data.overview.followers.toLocaleString(),
      trend: data.overview.growthRate,
      icon: <ActivityIcon sx={{ width: 16, height: 16 }} />,
      color: 'warning.main',
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Key Metrics */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
        {metrics.map((metric, index) => (
          <Card key={index} sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ 
                  p: 1, 
                  borderRadius: 2, 
                  bgcolor: 'grey.100',
                  color: metric.color === 'text-orange-600' ? 'orange.600' : 
                         metric.color === 'text-blue-600' ? 'blue.600' : 
                         metric.color === 'text-green-600' ? 'green.600' : 'grey.600'
                }}>
                  {metric.icon}
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: 'grey.600' }}>
                    {metric.label}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'grey.900' }}>
                    {metric.value}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                {metric.trend > 0 ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                    <Box sx={{ mr: 0.5 }}>
                      <TrendingUpIcon sx={{ width: 16, height: 16 }} />
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      +{metric.trend.toFixed(1)}%
                    </Typography>
                  </Box>
                ) : metric.trend < 0 ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'error.main' }}>
                    <Box sx={{ mr: 0.5 }}>
                      <TrendingUpIcon sx={{ width: 16, height: 16 }} />
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {metric.trend.toFixed(1)}%
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ color: 'grey.400' }}>
                    <Typography variant="body2">-</Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Card>
        ))}
      </Box>

      {/* Performance Indicators */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'grey.900' }}>
          Performance Indicators
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" sx={{ color: 'grey.600' }}>
                Engagement Rate
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {data.overview.avgEngagementRate}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate"
              value={Math.min(data.overview.avgEngagementRate, 100)} 
              sx={{ height: 8, borderRadius: 1 }}
            />
          </Box>

          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" sx={{ color: 'grey.600' }}>
                Growth Rate
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                +{data.overview.growthRate}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate"
              value={Math.min(data.overview.growthRate, 100)} 
              sx={{ height: 8, borderRadius: 1 }}
            />
          </Box>

          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" sx={{ color: 'grey.600' }}>
                Content Consistency
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {data.overview.totalPosts} posts
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate"
              value={Math.min((data.overview.totalPosts / 100) * 100, 100)} 
              sx={{ height: 8, borderRadius: 1 }}
            />
          </Box>
        </Box>
      </Box>

      {/* Platform Performance */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'grey.900' }}>
          Platform Performance
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {Object.entries(data.performance.platformBreakdown).map(([platform, stats]) => (
            <Box key={platform} sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              p: 1.5, 
              bgcolor: 'grey.50', 
              borderRadius: 2 
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'blue.500' }}></Box>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: 'grey.900', textTransform: 'capitalize' }}>
                    {platform}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'grey.500' }}>
                    {stats.posts} posts
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: 'grey.900' }}>
                  {stats.engagement.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ color: 'grey.500' }}>
                  engagement
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Insights Summary */}
      <Card sx={{ bgcolor: 'blue.50', border: '1px solid', borderColor: 'blue.200' }}>
        <CardContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
            <Box sx={{ p: 1, bgcolor: 'blue.100', borderRadius: 2 }}>
              <Box sx={{ color: 'blue.600' }}>
                <BarChart3Icon sx={{ width: 20, height: 20 }} />
              </Box>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 500, color: 'blue.900', mb: 0.5 }}>
                Performance Summary
              </Typography>
              <Typography variant="body2" sx={{ color: 'blue.700' }}>
                Your content is performing {data.overview.avgEngagementRate > 5 ? 'well' : 'below average'} 
                with an {data.overview.avgEngagementRate}% engagement rate. 
                {data.overview.growthRate > 10 ? ' Great growth momentum!' : ' Consider increasing your posting frequency.'}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
} 