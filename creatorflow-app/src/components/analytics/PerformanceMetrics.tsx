"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Fade,
  Zoom,
  Skeleton,
  Divider,
  Stack,
  Alert,
  AlertTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Badge,
  LinearProgress,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  Analytics,
  BarChart,
  PieChart,
  ShowChart,
  Timeline,
  AutoAwesome,
  Psychology,
  Target,
  Speed,
  Timer,
  FlashOn,
  Star,
  StarBorder,
  ExpandMore,
  ExpandLess,
  Refresh,
  Settings,
  ContentCopy,
  Schedule,
  CheckCircle,
  Warning,
  Error,
  Info,
  Lightbulb,
  Rocket,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon
} from '@/lib/mui-optimized-imports';
import { designTokens } from '@/lib/design-system';

interface PerformanceMetric {
  id: string;
  name: string;
  currentValue: number;
  previousValue: number;
  targetValue: number;
  unit: string;
  trend: 'up' | 'down' | 'flat';
  changePercent: number;
  status: 'excellent' | 'good' | 'average' | 'poor' | 'critical';
  aiInsight?: string;
  recommendation?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export default function PerformanceMetrics() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<PerformanceMetric | null>(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [showPredictions, setShowPredictions] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Mock performance metrics
      setMetrics([
        {
          id: 'engagement-rate',
          name: 'Engagement Rate',
          currentValue: 8.7,
          previousValue: 7.2,
          targetValue: 10.0,
          unit: '%',
          trend: 'up',
          changePercent: 20.8,
          status: 'good',
          aiInsight: 'Engagement is trending upward due to improved content quality and timing optimization',
          recommendation: 'Continue posting during peak hours (6-8 PM) and focus on visual content',
          priority: 'high'
        },
        {
          id: 'reach-growth',
          name: 'Reach Growth',
          currentValue: 15.6,
          previousValue: 12.3,
          targetValue: 18.0,
          unit: '%',
          trend: 'up',
          changePercent: 26.8,
          status: 'excellent',
          aiInsight: 'Reach growth accelerated due to viral content and improved hashtag strategy',
          recommendation: 'Analyze viral content patterns and replicate successful strategies',
          priority: 'high'
        },
        {
          id: 'conversion-rate',
          name: 'Conversion Rate',
          currentValue: 2.3,
          previousValue: 2.1,
          targetValue: 3.0,
          unit: '%',
          trend: 'up',
          changePercent: 9.5,
          status: 'average',
          aiInsight: 'Conversion rate improving but below target due to content-to-offer mismatch',
          recommendation: 'Align content with specific conversion goals and add clear CTAs',
          priority: 'medium'
        },
        {
          id: 'response-time',
          name: 'Response Time',
          currentValue: 2.3,
          previousValue: 3.1,
          targetValue: 2.0,
          unit: 'hours',
          trend: 'down',
          changePercent: -25.8,
          status: 'good',
          aiInsight: 'Response time improved due to automated responses and better workflow',
          recommendation: 'Implement more automation to reach target response time',
          priority: 'medium'
        },
        {
          id: 'content-quality',
          name: 'Content Quality Score',
          currentValue: 7.8,
          previousValue: 7.2,
          targetValue: 8.5,
          unit: '/10',
          trend: 'up',
          changePercent: 8.3,
          status: 'good',
          aiInsight: 'Content quality improving due to better planning and AI-assisted optimization',
          recommendation: 'Focus on storytelling and emotional connection in content',
          priority: 'high'
        },
        {
          id: 'audience-growth',
          name: 'Audience Growth',
          currentValue: 12.4,
          previousValue: 10.8,
          targetValue: 15.0,
          unit: '%',
          trend: 'up',
          changePercent: 14.8,
          status: 'good',
          aiInsight: 'Audience growth steady due to consistent posting and engagement',
          recommendation: 'Increase cross-platform promotion and collaboration opportunities',
          priority: 'medium'
        }
      ]);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return designTokens.colors.success[500];
      case 'good': return designTokens.colors.primary[500];
      case 'average': return designTokens.colors.warning[500];
      case 'poor': return designTokens.colors.error[500];
      case 'critical': return designTokens.colors.error[700];
      default: return designTokens.colors.neutral[500];
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle />;
      case 'good': return <TrendingUp />;
      case 'average': return <Warning />;
      case 'poor': return <Error />;
      case 'critical': return <Error />;
      default: return <Info />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUpIcon style={{ color: designTokens.colors.success[500] }} />;
      case 'down': return <TrendingDownIcon style={{ color: designTokens.colors.error[500] }} />;
      case 'flat': return <TrendingFlatIcon style={{ color: designTokens.colors.neutral[500] }} />;
      default: return <TrendingFlatIcon />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return designTokens.colors.error[500];
      case 'high': return designTokens.colors.warning[500];
      case 'medium': return designTokens.colors.primary[500];
      case 'low': return designTokens.colors.neutral[500];
      default: return designTokens.colors.neutral[500];
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, color: 'text.primary' }}>
          Performance Metrics Overview
        </Typography>
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Skeleton variant="rectangular" height={200} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3, color: 'text.primary' }}>
        Performance Metrics Overview
      </Typography>
      
      {/* Controls */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        flexWrap: 'wrap',
        gap: 2
      }}>
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
        
        <FormControlLabel
          control={
            <Switch
              checked={showPredictions}
              onChange={(e) => setShowPredictions(e.target.checked)}
            />
          }
          label="Show AI Predictions"
        />
      </Box>

      {/* Metrics Grid */}
      <Grid container spacing={3}>
        {metrics.map((metric) => (
          <Grid item xs={12} sm={6} md={4} key={metric.id}>
            <Fade in={true} timeout={500}>
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
                onClick={() => setSelectedMetric(metric)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ color: 'text.primary' }}>
                      {metric.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getStatusIcon(metric.status)}
                      <Chip 
                        label={metric.status.toUpperCase()} 
                        size="small"
                        sx={{ 
                          backgroundColor: getStatusColor(metric.status),
                          color: 'primary.contrastText',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                      {metric.currentValue}
                    </Typography>
                    <Typography variant="h6" sx={{ ml: 1, color: 'text.secondary' }}>
                      {metric.unit}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    {getTrendIcon(metric.trend)}
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: metric.trend === 'up' ? designTokens.colors.success[600] : 
                              metric.trend === 'down' ? designTokens.colors.error[600] : 
                              'text.secondary'
                      }}
                    >
                      {metric.changePercent > 0 ? '+' : ''}{metric.changePercent.toFixed(1)}% vs previous
                    </Typography>
                  </Box>

                  <LinearProgress 
                    variant="determinate" 
                    value={(metric.currentValue / metric.targetValue) * 100}
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      backgroundColor: designTokens.colors.neutral[200],
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getStatusColor(metric.status)
                      }
                    }}
                  />
                  
                  <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                    Target: {metric.targetValue}{metric.unit}
                  </Typography>

                  {metric.aiInsight && showPredictions && (
                    <Box sx={{ mt: 2, p: 2, backgroundColor: designTokens.colors.ai[50], borderRadius: 2 }}>
                      <Typography variant="body2" sx={{ color: designTokens.colors.ai[800], fontStyle: 'italic' }}>
                        💡 {metric.aiInsight}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>

      {/* Selected Metric Details */}
      {selectedMetric && (
        <Zoom in={true}>
          <Card sx={{ mt: 3, backgroundColor: designTokens.colors.primary[50] }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: 'primary.main' }}>
                  {selectedMetric.name} - Detailed Analysis
                </Typography>
                <IconButton onClick={() => setSelectedMetric(null)}>
                  <ExpandLess />
                </IconButton>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: designTokens.colors.neutral[700] }}>
                    Current Performance
                  </Typography>
                  <Typography variant="h4" sx={{ color: 'primary.main' }}>
                    {selectedMetric.currentValue}{selectedMetric.unit}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Target: {selectedMetric.targetValue}{selectedMetric.unit}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: designTokens.colors.neutral[700] }}>
                    Trend Analysis
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getTrendIcon(selectedMetric.trend)}
                    <Typography variant="h6" sx={{ color: 'primary.main' }}>
                      {selectedMetric.changePercent > 0 ? '+' : ''}{selectedMetric.changePercent.toFixed(1)}%
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    vs previous period
                  </Typography>
                </Grid>
              </Grid>

              {selectedMetric.recommendation && (
                <Box sx={{ mt: 3, p: 2, backgroundColor: designTokens.colors.ai[100], borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: designTokens.colors.ai[800] }}>
                    🎯 AI Recommendation
                  </Typography>
                  <Typography variant="body2" sx={{ color: designTokens.colors.ai[700] }}>
                    {selectedMetric.recommendation}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Zoom>
      )}
    </Box>
  );
}
