'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  IconButton,
  Collapse,
  Button
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  TrendingUp,
  TrendingDown,
  People,
  FileText,
  CheckCircle,
  Warning
} from '@mui/icons-material';

interface QuickInsightsProps {
  user: {
    plan: string | null;
    _count: {
      posts: number;
      socialAccounts: number;
    };
  };
  analyticsData?: {
    totalEngagement: number;
    engagementRate: number;
    growthRate: number;
  };
}

export default function QuickInsights({ user, analyticsData }: QuickInsightsProps) {
  const [expanded, setExpanded] = useState(true);

  // Calculate usage percentages
  const postLimit = user?.plan === 'Free' ? 5 : user?.plan === 'Basic' ? 10 : Infinity;
  const accountLimit = user?.plan === 'Free' ? 2 : user?.plan === 'Basic' ? 5 : Infinity;
  const postUsage = Math.min((user?._count.posts || 0) / postLimit * 100, 100);
  const accountUsage = Math.min((user?._count.socialAccounts || 0) / accountLimit * 100, 100);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">
              Quick Insights
            </Typography>
            <IconButton onClick={handleToggle} size="small">
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        }
        action={
          <Button
            variant="outlined"
            size="small"
            onClick={handleToggle}
          >
            {expanded ? 'Collapse' : 'Expand'}
          </Button>
        }
      />
      <Collapse in={expanded}>
        <CardContent>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 3
          }}>
            {/* Usage Statistics */}
            <Box>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                Usage & Limits
              </Typography>
              <Box sx={{ space: 2 }}>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Posts ({user?._count.posts || 0}/{postLimit === Infinity ? '∞' : postLimit})
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {Math.round(postUsage)}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={postUsage} 
                    color={postUsage > 80 ? 'warning' : 'primary'}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {user?.plan === 'Free' ? 'Limited to 5 posts' : 'Unlimited posts'}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Connected Accounts ({user?._count.socialAccounts || 0}/{accountLimit === Infinity ? '∞' : accountLimit})
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {Math.round(accountUsage)}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={accountUsage} 
                    color={accountUsage > 80 ? 'warning' : 'primary'}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {user?.plan === 'Free' ? 'Limited to 2 accounts' : 'Unlimited accounts'}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Key Performance Indicators */}
            <Box>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                Key Performance
              </Typography>
              <Box sx={{ space: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ mr: 2 }}>
                    {analyticsData?.growthRate && analyticsData.growthRate > 0 ? (
                      <TrendingUp color="success" />
                    ) : (
                      <TrendingDown color="error" />
                    )}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Growth Rate
                    </Typography>
                    <Typography variant="h6">
                      {analyticsData?.growthRate ? `${analyticsData.growthRate > 0 ? '+' : ''}${analyticsData.growthRate}%` : 'N/A'}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ mr: 2 }}>
                    <People color="primary" />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Engagement
                    </Typography>
                    <Typography variant="h6">
                      {analyticsData?.totalEngagement ? analyticsData.totalEngagement.toLocaleString() : 'N/A'}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ mr: 2 }}>
                    <CheckCircle color="success" />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Engagement Rate
                    </Typography>
                    <Typography variant="h6">
                      {analyticsData?.engagementRate ? `${analyticsData.engagementRate}%` : 'N/A'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Collapse>
    </Card>
  );
}
