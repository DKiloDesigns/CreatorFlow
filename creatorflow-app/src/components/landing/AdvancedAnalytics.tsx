'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Paper,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Fade,
  Zoom
} from '@mui/material';
import { 
  Analytics, 
  TrendingUp, 
  TrendingDown, 
  Insights, 
  BarChart, 
  PieChart, 
  ShowChart, 
  Assessment,
  Speed,
  Visibility,
  Group,
  Schedule,
  CheckCircle,
  Warning,
  Error
} from '@mui/icons-material';

const ANALYTICS_FEATURES = [
  {
    icon: <BarChart />,
    title: 'Real-Time Analytics',
    description: 'Monitor performance across all platforms in real-time',
    color: '#10B981'
  },
  {
    icon: <Insights />,
    title: 'AI Insights',
    description: 'Get intelligent recommendations and predictions',
    color: '#3B82F6'
  },
  {
    icon: <Assessment />,
    title: 'Custom Reports',
    description: 'Create detailed reports tailored to your needs',
    color: '#8B5CF6'
  },
  {
    icon: <ShowChart />,
    title: 'Trend Analysis',
    description: 'Identify patterns and optimize your strategy',
    color: '#F59E0B'
  }
];

const SAMPLE_METRICS = [
  { label: 'Total Reach', value: '2.4M', change: '+12.5%', trend: 'up', color: '#10B981' },
  { label: 'Engagement Rate', value: '8.7%', change: '+3.2%', trend: 'up', color: '#3B82F6' },
  { label: 'Click-Through Rate', value: '4.2%', change: '-0.8%', trend: 'down', color: '#EF4444' },
  { label: 'Conversion Rate', value: '2.1%', change: '+15.3%', trend: 'up', color: '#8B5CF6' }
];

const AI_INSIGHTS = [
  {
    type: 'success',
    icon: <CheckCircle />,
    title: 'Optimal Posting Time',
    description: 'Your audience is most active at 2:00 PM EST. Consider scheduling more posts during this time.',
    impact: 'High'
  },
  {
    type: 'warning',
    icon: <Warning />,
    title: 'Engagement Drop',
    description: 'Instagram engagement decreased by 15% this week. Try using more visual content.',
    impact: 'Medium'
  },
  {
    type: 'info',
    icon: <Insights />,
    title: 'Trending Hashtag',
    description: '#DigitalMarketing is trending in your industry. Consider incorporating it into your posts.',
    impact: 'High'
  }
];

export function AdvancedAnalytics() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');

  return (
    <Box sx={{ 
      py: 8, 
      bgcolor: 'background.paper',
      position: 'relative'
    }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ 
            fontWeight: 'bold', 
            mb: 2,
            color: 'text.primary'
          }}>
            Advanced Analytics & Insights
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
            Make data-driven decisions with comprehensive analytics and AI-powered insights
          </Typography>
        </Box>

        {/* Timeframe Selector */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Paper sx={{ p: 1, display: 'flex', gap: 1 }}>
            {['24h', '7d', '30d', '90d'].map((timeframe) => (
              <Button
                key={timeframe}
                variant={selectedTimeframe === timeframe ? 'contained' : 'text'}
                onClick={() => setSelectedTimeframe(timeframe)}
                size="small"
              >
                {timeframe}
              </Button>
            ))}
          </Paper>
        </Box>

        {/* Key Metrics */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {SAMPLE_METRICS.map((metric, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Zoom in={true} style={{ transitionDelay: `${index * 0.1}s` }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ 
                        color: metric.color,
                        mr: 1,
                        '& .MuiSvgIcon-root': {
                          fontSize: '1.5rem'
                        }
                      }}>
                        {metric.trend === 'up' ? <TrendingUp /> : <TrendingDown />}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {metric.label}
                      </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ 
                      fontWeight: 'bold', 
                      mb: 1,
                      color: metric.color
                    }}>
                      {metric.value}
                    </Typography>
                    <Chip
                      label={metric.change}
                      size="small"
                      color={metric.trend === 'up' ? 'success' : 'error'}
                      sx={{ fontWeight: 'bold' }}
                    />
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>

        {/* Analytics Features */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {ANALYTICS_FEATURES.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box sx={{ 
                    color: feature.color,
                    mb: 2,
                    '& .MuiSvgIcon-root': {
                      fontSize: '3rem'
                    }
                  }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* AI Insights */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, height: '100%' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                AI-Powered Insights
              </Typography>
              <List>
                {AI_INSIGHTS.map((insight, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Box sx={{ 
                          color: insight.type === 'success' ? 'success.main' : 
                                 insight.type === 'warning' ? 'warning.main' : 'info.main'
                        }}>
                          {insight.icon}
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                              {insight.title}
                            </Typography>
                            <Chip 
                              label={insight.impact} 
                              size="small" 
                              color={insight.impact === 'High' ? 'error' : 'default'}
                            />
                          </Box>
                        }
                        secondary={insight.description}
                      />
                    </ListItem>
                    {index < AI_INSIGHTS.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, height: '100%' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                Performance Overview
              </Typography>
              
              {/* Sample Chart Placeholder */}
              <Box sx={{ 
                height: 200, 
                bgcolor: 'grey.50', 
                borderRadius: 1, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mb: 3,
                border: 1,
                borderColor: 'divider'
              }}>
                <Box sx={{ textAlign: 'center' }}>
                  <ShowChart sx={{ fontSize: '3rem', color: 'grey.400', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Interactive Analytics Chart
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip 
                  icon={<Visibility />} 
                  label="2.4M Views" 
                  color="primary" 
                  variant="outlined"
                />
                <Chip 
                  icon={<Group />} 
                  label="45K Followers" 
                  color="secondary" 
                  variant="outlined"
                />
                <Chip 
                  icon={<Schedule />} 
                  label="Best: 2PM EST" 
                  color="success" 
                  variant="outlined"
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* CTA */}
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<Analytics />}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)'
              }
            }}
          >
            View Full Analytics Dashboard
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
