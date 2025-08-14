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
} from '@mui/icons-material';
import { designTokens } from '@/lib/design-system';
import { useContentPrediction, useAudienceAnalysis, useAIInsights } from '@/hooks/use-ai-api';

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

interface TrendAnalysis {
  period: string;
  data: Array<{
    date: string;
    value: number;
    predicted?: number;
    confidence?: number;
  }>;
  trend: 'increasing' | 'decreasing' | 'stable' | 'volatile';
  seasonality: 'none' | 'weekly' | 'monthly' | 'quarterly';
  forecast: {
    nextPeriod: number;
    confidence: number;
    factors: string[];
  };
}

interface AIInsight {
  id: string;
  type: 'performance' | 'trend' | 'opportunity' | 'risk' | 'optimization';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  actionable: boolean;
  action?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  tags: string[];
}

export default function AdvancedPerformanceMetrics() {
  const [activeTab, setActiveTab] = useState(0);
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [trendAnalysis, setTrendAnalysis] = useState<TrendAnalysis[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<PerformanceMetric | null>(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [showPredictions, setShowPredictions] = useState(true);

  // AI API hooks
  const contentPrediction = useContentPrediction();
  const audienceAnalysis = useAudienceAnalysis();
  const aiInsightsHook = useAIInsights();

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
          aiInsight: 'Response time improved due to automated engagement tools and team efficiency',
          recommendation: 'Maintain current response protocols and consider 24/7 monitoring',
          priority: 'medium'
        },
        {
          id: 'content-quality',
          name: 'Content Quality Score',
          currentValue: 87.5,
          previousValue: 82.1,
          targetValue: 90.0,
          unit: '/100',
          trend: 'up',
          changePercent: 6.6,
          status: 'good',
          aiInsight: 'Content quality improved through AI optimization and better creative direction',
          recommendation: 'Continue using AI tools for content enhancement and A/B testing',
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
          aiInsight: 'Audience growth steady but could accelerate with viral content and influencer partnerships',
          recommendation: 'Focus on creating shareable content and explore collaboration opportunities',
          priority: 'medium'
        }
      ]);

      // Mock trend analysis
      setTrendAnalysis([
        {
          period: 'Engagement Rate',
          data: [
            { date: '2024-01-01', value: 6.8 },
            { date: '2024-01-08', value: 7.2 },
            { date: '2024-01-15', value: 7.8 },
            { date: '2024-01-22', value: 8.1 },
            { date: '2024-01-29', value: 8.7, predicted: 8.9, confidence: 0.89 }
          ],
          trend: 'increasing',
          seasonality: 'weekly',
          forecast: {
            nextPeriod: 9.2,
            confidence: 0.87,
            factors: ['Content quality improvement', 'Timing optimization', 'Hashtag strategy']
          }
        },
        {
          period: 'Reach Growth',
          data: [
            { date: '2024-01-01', value: 10.2 },
            { date: '2024-01-08', value: 11.1 },
            { date: '2024-01-15', value: 12.3 },
            { date: '2024-01-22', value: 13.8 },
            { date: '2024-01-29', value: 15.6, predicted: 16.1, confidence: 0.92 }
          ],
          trend: 'increasing',
          seasonality: 'weekly',
          forecast: {
            nextPeriod: 17.2,
            confidence: 0.89,
            factors: ['Viral content performance', 'Audience expansion', 'Platform algorithm changes']
          }
        }
      ]);

      // Mock AI insights
      setAiInsights([
        {
          id: 'insight-1',
          type: 'performance',
          title: 'Engagement Rate Acceleration',
          description: 'Your engagement rate is growing 20.8% faster than the previous period, driven by improved content quality and timing optimization.',
          impact: 'high',
          confidence: 0.89,
          actionable: true,
          action: 'Continue current content strategy and expand peak-hour posting',
          priority: 'high',
          category: 'Content Performance',
          tags: ['engagement', 'content quality', 'timing']
        },
        {
          id: 'insight-2',
          type: 'opportunity',
          title: 'Viral Content Potential',
          description: 'Analysis shows 34% of your content has viral potential. Focus on visual storytelling and trending topics to maximize reach.',
          impact: 'high',
          confidence: 0.78,
          actionable: true,
          action: 'Increase visual content production and monitor trending topics',
          priority: 'high',
          category: 'Content Strategy',
          tags: ['viral', 'visual content', 'trending topics']
        },
        {
          id: 'insight-3',
          type: 'optimization',
          title: 'Conversion Rate Improvement',
          description: 'Your conversion rate is improving but could accelerate with better content-to-offer alignment and clearer CTAs.',
          impact: 'medium',
          confidence: 0.82,
          actionable: true,
          action: 'Review content strategy and add specific conversion goals',
          priority: 'medium',
          category: 'Conversion Optimization',
          tags: ['conversion', 'CTAs', 'content strategy']
        },
        {
          id: 'insight-4',
          type: 'trend',
          title: 'Weekly Seasonality Pattern',
          description: 'Strong weekly engagement patterns detected. Tuesday and Thursday posts perform 23% better than other days.',
          impact: 'medium',
          confidence: 0.91,
          actionable: true,
          action: 'Schedule high-priority content on Tuesday and Thursday',
          priority: 'medium',
          category: 'Timing Optimization',
          tags: ['timing', 'seasonality', 'scheduling']
        }
      ]);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return designTokens.colors.success[500];
      case 'good':
        return designTokens.colors.success[400];
      case 'average':
        return designTokens.colors.warning[500];
      case 'poor':
        return designTokens.colors.error[400];
      case 'critical':
        return designTokens.colors.error[600];
      default:
        return designTokens.colors.neutral[500];
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return designTokens.colors.error[600];
      case 'high':
        return designTokens.colors.warning[500];
      case 'medium':
        return designTokens.colors.primary[500];
      case 'low':
        return designTokens.colors.neutral[500];
      default:
        return designTokens.colors.neutral[500];
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp sx={{ color: designTokens.colors.success[500] }} />;
      case 'down':
        return <TrendingDown sx={{ color: designTokens.colors.error[500] }} />;
      case 'flat':
        return <TrendingFlat sx={{ color: designTokens.colors.neutral[500] }} />;
      default:
        return <TrendingFlat sx={{ color: designTokens.colors.neutral[500] }} />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return designTokens.colors.success[500];
      case 'down':
        return designTokens.colors.error[500];
      case 'flat':
        return designTokens.colors.neutral[500];
      default:
        return designTokens.colors.neutral[500];
    }
  };

  const renderMetricsTab = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, color: designTokens.colors.neutral[800] }}>
        Performance Metrics Overview
      </Typography>
      
      <Grid container spacing={3}>
        {metrics.map((metric) => (
          <Grid item xs={12} md={6} lg={4} key={metric.id}>
            <Card 
              elevation={0} 
              sx={{ 
                border: `1px solid ${designTokens.colors.neutral[200]}`,
                borderRadius: designTokens.borderRadius.lg,
                cursor: 'pointer',
                transition: designTokens.animation.micro.cardHover,
                '&:hover': {
                  boxShadow: designTokens.shadows.lg,
                  borderColor: designTokens.colors.primary[300]
                }
              }}
              onClick={() => setSelectedMetric(metric)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" sx={{ color: designTokens.colors.neutral[800] }}>
                    {metric.name}
                  </Typography>
                  <Chip
                    label={metric.status}
                    size="small"
                    sx={{
                      background: `${getStatusColor(metric.status)}15`,
                      color: getStatusColor(metric.status),
                      fontWeight: 'medium',
                      textTransform: 'capitalize'
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: designTokens.colors.neutral[900] }}>
                    {metric.currentValue}
                  </Typography>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                    {metric.unit}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  {getTrendIcon(metric.trend)}
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: getTrendColor(metric.trend),
                      fontWeight: 'medium'
                    }}
                  >
                    {metric.changePercent > 0 ? '+' : ''}{metric.changePercent.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[500] }}>
                    vs previous period
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                      Progress to Target
                    </Typography>
                    <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                      {Math.round((metric.currentValue / metric.targetValue) * 100)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min((metric.currentValue / metric.targetValue) * 100, 100)}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: designTokens.colors.neutral[200],
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getStatusColor(metric.status),
                        borderRadius: 4
                      }
                    }}
                  />
                </Box>

                {metric.aiInsight && (
                  <Box sx={{ 
                    p: 2, 
                    background: designTokens.colors.ai[50], 
                    borderRadius: designTokens.borderRadius.md,
                    border: `1px solid ${designTokens.colors.ai[200]}`
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                              <Psychology sx={{ fontSize: 16, color: designTokens.colors.ai[600] }} />
                      <Typography variant="body2" sx={{ color: designTokens.colors.ai[700], fontWeight: 'medium' }}>
                        AI Insight
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: designTokens.colors.ai[700], fontSize: '0.875rem' }}>
                      {metric.aiInsight}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderTrendAnalysisTab = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, color: designTokens.colors.neutral[800] }}>
        Trend Analysis & Forecasting
      </Typography>
      
      <Grid container spacing={3}>
        {trendAnalysis.map((trend, index) => (
          <Grid item xs={12} lg={6} key={index}>
            <Card elevation={0} sx={{ border: `1px solid ${designTokens.colors.neutral[200]}` }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ color: designTokens.colors.neutral[800] }}>
                    {trend.period}
                  </Typography>
                  <Chip
                    label={trend.trend}
                    size="small"
                    sx={{
                      background: `${getTrendColor(trend.trend === 'increasing' ? 'up' : 'down')}15`,
                      color: getTrendColor(trend.trend === 'increasing' ? 'up' : 'down'),
                      fontWeight: 'medium',
                      textTransform: 'capitalize'
                    }}
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 2 }}>
                    Historical Data & Predictions
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    {trend.data.map((point, pointIndex) => (
                      <Box key={pointIndex} sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], fontSize: '0.75rem' }}>
                          {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </Typography>
                        <Typography variant="h6" sx={{ color: designTokens.colors.neutral[800], fontWeight: 'bold' }}>
                          {point.value}
                        </Typography>
                        {point.predicted && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AutoAwesome sx={{ fontSize: 12, color: designTokens.colors.ai[500] }} />
                            <Typography variant="caption" sx={{ color: designTokens.colors.ai[600] }}>
                              {point.predicted}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box>
                  <Typography variant="subtitle2" sx={{ color: designTokens.colors.neutral[700], mb: 2 }}>
                    AI Forecast
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                          Next Period
                        </Typography>
                        <Typography variant="h5" sx={{ color: designTokens.colors.primary[600], fontWeight: 'bold' }}>
                          {trend.forecast.nextPeriod}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                          Confidence
                        </Typography>
                        <Typography variant="h5" sx={{ color: designTokens.colors.ai[600], fontWeight: 'bold' }}>
                          {(trend.forecast.confidence * 100).toFixed(0)}%
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 1 }}>
                      Key Factors:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {trend.forecast.factors.map((factor, factorIndex) => (
                        <Chip
                          key={factorIndex}
                          label={factor}
                          size="small"
                          sx={{
                            background: designTokens.colors.primary[100],
                            color: designTokens.colors.primary[700],
                            fontSize: '0.7rem'
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderAIInsightsTab = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, color: designTokens.colors.neutral[800] }}>
        AI-Powered Insights & Recommendations
      </Typography>
      
      <Grid container spacing={3}>
        {aiInsights.map((insight) => (
          <Grid item xs={12} md={6} key={insight.id}>
            <Card elevation={0} sx={{ border: `1px solid ${designTokens.colors.neutral[200]}` }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: `${getPriorityColor(insight.priority)}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: getPriorityColor(insight.priority)
                      }}
                    >
                      {insight.type === 'performance' && <Analytics sx={{ fontSize: 16 }} />}
                      {insight.type === 'opportunity' && <Rocket sx={{ fontSize: 16 }} />}
                      {insight.type === 'risk' && <Warning sx={{ fontSize: 16 }} />}
                      {insight.type === 'optimization' && <Settings sx={{ fontSize: 16 }} />}
                      {insight.type === 'trend' && <TrendingUp sx={{ fontSize: 16 }} />}
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ color: designTokens.colors.neutral[800] }}>
                        {insight.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: designTokens.colors.neutral[500] }}>
                        {insight.category}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={insight.priority}
                    size="small"
                    sx={{
                      background: `${getPriorityColor(insight.priority)}15`,
                      color: getPriorityColor(insight.priority),
                      fontWeight: 'medium',
                      textTransform: 'capitalize'
                    }}
                  />
                </Box>

                <Typography variant="body2" sx={{ color: designTokens.colors.neutral[700], mb: 2 }}>
                  {insight.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Chip
                    label={`${(insight.confidence * 100).toFixed(0)}% Confidence`}
                    size="small"
                    sx={{
                      background: designTokens.colors.ai[100],
                      color: designTokens.colors.ai[700],
                      fontSize: '0.7rem'
                    }}
                  />
                  <Chip
                    label={insight.impact}
                    size="small"
                    sx={{
                      background: `${getPriorityColor(insight.impact)}15`,
                      color: getPriorityColor(insight.impact),
                      fontSize: '0.7rem',
                      textTransform: 'capitalize'
                    }}
                  />
                </Box>

                {insight.actionable && insight.action && (
                  <Box sx={{ 
                    p: 2, 
                    background: designTokens.colors.success[50], 
                    borderRadius: designTokens.borderRadius.md,
                    border: `1px solid ${designTokens.colors.success[200]}`
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Lightbulb sx={{ fontSize: 16, color: designTokens.colors.success[600] }} />
                      <Typography variant="body2" sx={{ color: designTokens.colors.success[700], fontWeight: 'medium' }}>
                        Recommended Action
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: designTokens.colors.success[700], fontSize: '0.875rem' }}>
                      {insight.action}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 1 }}>
                    Tags:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {insight.tags.map((tag, tagIndex) => (
                      <Chip
                        key={tagIndex}
                        label={tag}
                        size="small"
                        sx={{
                          background: designTokens.colors.neutral[100],
                          color: designTokens.colors.neutral[600],
                          fontSize: '0.6rem'
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" width="60%" height={48} />
        <Skeleton variant="text" width="40%" height={24} />
        <Box sx={{ mt: 4 }}>
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Grid item xs={12} md={6} lg={4} key={item}>
                <Skeleton variant="rectangular" height={300} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: designTokens.colors.primary[600]
            }}
          >
            <Analytics sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: designTokens.typography.fontWeight.bold,
                color: designTokens.colors.neutral[900],
                mb: 1
              }}
            >
              Advanced Performance Metrics
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: designTokens.colors.neutral[600],
                fontWeight: designTokens.typography.fontWeight.normal
              }}
            >
              AI-powered analytics with predictive insights and trend analysis
            </Typography>
          </Box>
        </Box>

        {/* Controls */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 3 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="7d">Last 7 Days</MenuItem>
              <MenuItem value="30d">Last 30 Days</MenuItem>
              <MenuItem value="90d">Last 90 Days</MenuItem>
              <MenuItem value="1y">Last Year</MenuItem>
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
      </Box>

      {/* AI Status Alert */}
      <Alert 
        severity="info" 
        sx={{ 
          mb: 4,
          background: 'linear-gradient(90deg, rgba(37, 99, 235, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
          border: `1px solid ${designTokens.colors.primary[200]}`,
          borderRadius: designTokens.borderRadius.lg
        }}
      >
        <AlertTitle sx={{ color: designTokens.colors.primary[700] }}>
          🤖 AI Analytics Active
        </AlertTitle>
        <Typography variant="body2" sx={{ color: designTokens.colors.primary[700] }}>
          Your AI system has analyzed {metrics.length} performance metrics and generated {aiInsights.length} actionable insights. 
          Current prediction accuracy: 89.2%. AI insights are continuously learning and improving based on real performance data.
        </Typography>
      </Alert>

      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant={activeTab === 0 ? 'contained' : 'outlined'}
            onClick={() => setActiveTab(0)}
            startIcon={<Analytics />}
          >
            Performance Metrics
          </Button>
          <Button
            variant={activeTab === 1 ? 'contained' : 'outlined'}
            onClick={() => setActiveTab(1)}
            startIcon={<TrendingUp />}
          >
            Trend Analysis
          </Button>
          <Button
            variant={activeTab === 2 ? 'contained' : 'outlined'}
            onClick={() => setActiveTab(2)}
                              startIcon={<Psychology />}
          >
            AI Insights
          </Button>
        </Box>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && renderMetricsTab()}
      {activeTab === 1 && renderTrendAnalysisTab()}
      {activeTab === 2 && renderAIInsightsTab()}

      {/* API Error Alerts */}
      {contentPrediction.error && (
        <Alert 
          severity="error" 
          sx={{ mt: 2 }}
          action={
            <Button color="inherit" size="small" onClick={contentPrediction.retry}>
              Retry
            </Button>
          }
        >
          <AlertTitle>Content Prediction Error</AlertTitle>
          {contentPrediction.error}
        </Alert>
      )}

      {audienceAnalysis.error && (
        <Alert 
          severity="error" 
          sx={{ mt: 2 }}
          action={
            <Button color="inherit" size="small" onClick={audienceAnalysis.retry}>
              Retry
            </Button>
          }
        >
          <AlertTitle>Audience Analysis Error</AlertTitle>
          {audienceAnalysis.error}
        </Alert>
      )}
    </Box>
  );
}
