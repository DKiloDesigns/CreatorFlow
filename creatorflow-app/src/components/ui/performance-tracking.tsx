"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  ListItemAvatar
} from '@mui/material';
import {
  AutoAwesome,
  Brain,
  TrendingUp,
  Analytics,
  BarChart,
  PieChart,
  ShowChart,
  Timeline,
  TrendingDown,
  TrendingFlat,
  Psychology,
  Rocket,
  Monitor,
  Language,
  TrackChanges,
  Insights,
  Target,
  Speed,
  Timer,
  FlashOn,
  Star,
  StarBorder,
  ExpandMore,
  ExpandLess,
  PlayArrow,
  Pause,
  Stop,
  Save,
  Send,
  Add,
  Edit,
  Delete,
  Visibility,
  ThumbUp,
  Share,
  Message,
  CheckCircle,
  Warning,
  Info,
  Lightbulb,
  Public,
  Lock,
  Group,
  Person,
  Event,
  Notifications,
  Settings,
  Refresh,
  FilterList,
  Search,
  MoreVert,
  CalendarToday,
  AccessTime,
  TrendingUp as TrendingUpIcon,
  ContentCopy,
  Schedule,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { designTokens } from '@/lib/design-system';

// Performance metric interface
interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'flat';
  target: number;
  status: 'excellent' | 'good' | 'average' | 'poor';
  aiInsight: string;
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
}

// Content performance interface
interface ContentPerformance {
  id: string;
  title: string;
  content: string;
  platform: string;
  publishedAt: Date;
  engagement: number;
  reach: number;
  shares: number;
  comments: number;
  likes: number;
  aiOptimized: boolean;
  performanceScore: number;
  audienceMatch: number;
  viralPotential: number;
  insights: string[];
  recommendations: string[];
}

// Trend analysis interface
interface TrendAnalysis {
  id: string;
  metric: string;
  period: string;
  currentValue: number;
  previousValue: number;
  change: number;
  trend: 'up' | 'down' | 'flat';
  confidence: number;
  aiPrediction: string;
  factors: string[];
  impact: 'high' | 'medium' | 'low';
}

// Audience insight interface
interface AudienceInsight {
  id: string;
  segment: string;
  size: number;
  engagement: number;
  growth: number;
  interests: string[];
  bestContentTypes: string[];
  optimalTimes: string[];
  aiRecommendations: string[];
}

interface PerformanceTrackingProps {
  onInsightAction?: (insight: any) => void;
  onContentOptimize?: (content: ContentPerformance) => void;
  loading?: boolean;
  error?: string | null;
  className?: string;
}

export default function PerformanceTracking({
  onInsightAction,
  onContentOptimize,
  loading = false,
  error = null,
  className
}: PerformanceTrackingProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [contentPerformance, setContentPerformance] = useState<ContentPerformance[]>([]);
  const [trendAnalysis, setTrendAnalysis] = useState<TrendAnalysis[]>([]);
  const [audienceInsights, setAudienceInsights] = useState<AudienceInsight[]>([]);

  // Mock data for performance metrics
  const mockPerformanceMetrics: PerformanceMetric[] = [
    {
      id: '1',
      name: 'Engagement Rate',
      value: 4.2,
      change: 0.8,
      trend: 'up',
      target: 5.0,
      status: 'good',
      aiInsight: 'Your engagement is 15% above average for your industry',
      recommendation: 'Continue posting during peak hours (2-4 PM)',
      priority: 'medium'
    },
    {
      id: '2',
      name: 'Reach',
      value: 89200,
      change: -2.1,
      trend: 'down',
      target: 100000,
      status: 'average',
      aiInsight: 'Reach decreased due to algorithm changes and increased competition',
      recommendation: 'Focus on trending hashtags and collaborate with other creators',
      priority: 'high'
    },
    {
      id: '3',
      name: 'Shares',
      value: 156,
      change: 12.5,
      trend: 'up',
      target: 200,
      status: 'good',
      aiInsight: 'Share rate increased significantly, indicating high content value',
      recommendation: 'Create more shareable content with actionable tips',
      priority: 'low'
    },
    {
      id: '4',
      name: 'Comments',
      value: 89,
      change: 5.2,
      trend: 'up',
      target: 100,
      status: 'good',
      aiInsight: 'Comment engagement is strong, showing audience connection',
      recommendation: 'Ask more questions in captions to encourage discussion',
      priority: 'low'
    },
    {
      id: '5',
      name: 'Follower Growth',
      value: 2.8,
      change: 0.3,
      trend: 'up',
      target: 3.5,
      status: 'average',
      aiInsight: 'Growth is steady but could be accelerated with viral content',
      recommendation: 'Create trending content and use popular hashtags',
      priority: 'medium'
    },
    {
      id: '6',
      name: 'Content Quality Score',
      value: 8.7,
      change: 0.5,
      trend: 'up',
      target: 9.0,
      status: 'excellent',
      aiInsight: 'Your content quality is consistently high',
      recommendation: 'Maintain current standards and experiment with new formats',
      priority: 'low'
    }
  ];

  // Mock data for content performance
  const mockContentPerformance: ContentPerformance[] = [
    {
      id: '1',
      title: 'Product Launch Announcement',
      content: 'Excited to announce our new AI-powered content optimization tool! 🚀',
      platform: 'Instagram',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      engagement: 8.5,
      reach: 15420,
      shares: 89,
      comments: 45,
      likes: 1234,
      aiOptimized: true,
      performanceScore: 8.7,
      audienceMatch: 9.2,
      viralPotential: 7.8,
      insights: [
        'High engagement during peak hours',
        'Strong audience match with product announcement',
        'Good use of emojis and call-to-action'
      ],
      recommendations: [
        'Post similar announcements during 2-4 PM',
        'Include more behind-the-scenes content',
        'Use product demos in future posts'
      ]
    },
    {
      id: '2',
      title: 'Weekly Tips Series',
      content: 'Tip #3: Use questions in your captions to increase engagement by 40%',
      platform: 'Instagram',
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      engagement: 7.8,
      reach: 12890,
      shares: 67,
      comments: 78,
      likes: 987,
      aiOptimized: true,
      performanceScore: 7.9,
      audienceMatch: 8.5,
      viralPotential: 6.2,
      insights: [
        'Educational content performs well',
        'Questions in captions drive engagement',
        'Consistent posting builds audience trust'
      ],
      recommendations: [
        'Continue weekly tips series',
        'Add more interactive elements',
        'Cross-post to other platforms'
      ]
    },
    {
      id: '3',
      title: 'Industry Insights',
      content: 'The future of content creation: AI vs. human creativity',
      platform: 'LinkedIn',
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      engagement: 6.2,
      reach: 8900,
      shares: 34,
      comments: 23,
      likes: 456,
      aiOptimized: false,
      performanceScore: 6.5,
      audienceMatch: 7.8,
      viralPotential: 5.4,
      insights: [
        'Professional content has lower engagement',
        'LinkedIn audience prefers business insights',
        'Content could benefit from AI optimization'
      ],
      recommendations: [
        'Enable AI optimization for better performance',
        'Add more visual elements',
        'Post during business hours (9 AM - 2 PM)'
      ]
    }
  ];

  // Mock data for trend analysis
  const mockTrendAnalysis: TrendAnalysis[] = [
    {
      id: '1',
      metric: 'Engagement Rate',
      period: 'Last 30 days',
      currentValue: 4.2,
      previousValue: 3.8,
      change: 10.5,
      trend: 'up',
      confidence: 89,
      aiPrediction: 'Engagement will continue to grow by 15-20% in the next month',
      factors: [
        'Improved posting times',
        'Better content quality',
        'Increased audience interaction',
        'Trending hashtag usage'
      ],
      impact: 'high'
    },
    {
      id: '2',
      metric: 'Reach',
      period: 'Last 30 days',
      currentValue: 89200,
      previousValue: 91000,
      change: -2.0,
      trend: 'down',
      confidence: 76,
      aiPrediction: 'Reach may stabilize or improve with algorithm adjustments',
      factors: [
        'Algorithm changes',
        'Increased competition',
        'Content frequency changes',
        'Platform policy updates'
      ],
      impact: 'medium'
    },
    {
      id: '3',
      metric: 'Follower Growth',
      period: 'Last 30 days',
      currentValue: 2.8,
      previousValue: 2.5,
      change: 12.0,
      trend: 'up',
      confidence: 82,
      aiPrediction: 'Growth rate will accelerate to 3.2% in the next month',
      factors: [
        'Viral content performance',
        'Improved hashtag strategy',
        'Cross-platform promotion',
        'Collaboration opportunities'
      ],
      impact: 'high'
    }
  ];

  // Mock data for audience insights
  const mockAudienceInsights: AudienceInsight[] = [
    {
      id: '1',
      segment: 'Core Audience (18-34)',
      size: 15420,
      engagement: 4.8,
      growth: 3.2,
      interests: ['Technology', 'Creativity', 'Business', 'Lifestyle'],
      bestContentTypes: ['Visual posts', 'Stories', 'Reels', 'Educational content'],
      optimalTimes: ['2:00 PM', '7:00 PM', '9:00 PM'],
      aiRecommendations: [
        'Focus on visual content during peak hours',
        'Create educational content for this demographic',
        'Use trending hashtags and challenges',
        'Engage with user-generated content'
      ]
    },
    {
      id: '2',
      segment: 'Professional Audience (25-49)',
      size: 8900,
      engagement: 3.9,
      growth: 2.8,
      interests: ['Business', 'Technology', 'Professional Development', 'Industry News'],
      bestContentTypes: ['Articles', 'Professional tips', 'Industry insights', 'Case studies'],
      optimalTimes: ['8:00 AM', '12:00 PM', '5:00 PM'],
      aiRecommendations: [
        'Post business content during work hours',
        'Share industry insights and trends',
        'Create professional development content',
        'Use LinkedIn for business-focused posts'
      ]
    },
    {
      id: '3',
      segment: 'Creative Professionals',
      size: 6700,
      engagement: 5.2,
      growth: 4.1,
      interests: ['Art', 'Design', 'Creativity', 'Innovation'],
      bestContentTypes: ['Behind-the-scenes', 'Creative process', 'Tutorials', 'Portfolio work'],
      optimalTimes: ['6:00 PM', '8:00 PM', '10:00 PM'],
      aiRecommendations: [
        'Share creative process and behind-the-scenes content',
        'Create tutorials and educational content',
        'Showcase portfolio work regularly',
        'Engage with creative community challenges'
      ]
    }
  ];

  useEffect(() => {
    setPerformanceMetrics(mockPerformanceMetrics);
    setContentPerformance(mockContentPerformance);
    setTrendAnalysis(mockTrendAnalysis);
    setAudienceInsights(mockAudienceInsights);
  }, []);

  // Simulate AI analysis
  const simulateAIAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Update metrics with new AI insights
    const updatedMetrics = mockPerformanceMetrics.map(metric => ({
      ...metric,
      value: metric.value + (Math.random() - 0.5) * 0.5,
      change: metric.change + (Math.random() - 0.5) * 0.3
    }));
    
    setPerformanceMetrics(updatedMetrics);
    setIsAnalyzing(false);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return designTokens.colors.success[500];
      case 'good':
        return designTokens.colors.primary[500];
      case 'average':
        return designTokens.colors.warning[500];
      case 'poor':
        return designTokens.colors.error[500];
      default:
        return designTokens.colors.neutral[500];
    }
  };

  // Get trend icon
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

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return designTokens.colors.error[500];
      case 'medium':
        return designTokens.colors.warning[500];
      case 'low':
        return designTokens.colors.success[500];
      default:
        return designTokens.colors.neutral[500];
    }
  };

  // Get impact color
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return designTokens.colors.error[500];
      case 'medium':
        return designTokens.colors.warning[500];
      case 'low':
        return designTokens.colors.success[500];
      default:
        return designTokens.colors.neutral[500];
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" width="60%" height={32} />
        <Skeleton variant="text" width="40%" height={24} />
        <Box sx={{ mt: 3 }}>
          <Skeleton variant="rectangular" height={200} />
        </Box>
        <Box sx={{ mt: 2 }}>
          <Skeleton variant="rectangular" height={100} />
        </Box>
      </Box>
    );
  }

  return (
    <Box className={className}>
      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}

      {/* Main Performance Tracking Interface */}
      <Paper 
        elevation={0}
        sx={{
          background: 'white',
          border: `1px solid ${designTokens.colors.neutral[200]}`,
          borderRadius: designTokens.borderRadius.xl,
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <Box sx={{ 
          p: 3,
          background: 'linear-gradient(90deg, rgba(37, 99, 235, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%)',
          borderBottom: `1px solid ${designTokens.colors.neutral[200]}`
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: `${designTokens.colors.success[500]}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: designTokens.colors.success[600]
                }}
              >
                <Analytics sx={{ fontSize: 24 }} />
              </Box>
              <Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: designTokens.typography.fontWeight.bold,
                    color: designTokens.colors.neutral[800]
                  }}
                >
                  Performance Tracking
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: designTokens.colors.neutral[600]
                  }}
                >
                  Real-time analytics with AI-powered insights and recommendations
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Period</InputLabel>
                <Select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  label="Period"
                >
                  <MenuItem value="7d">Last 7 days</MenuItem>
                  <MenuItem value="30d">Last 30 days</MenuItem>
                  <MenuItem value="90d">Last 90 days</MenuItem>
                  <MenuItem value="1y">Last year</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Platform</InputLabel>
                <Select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  label="Platform"
                >
                  <MenuItem value="all">All Platforms</MenuItem>
                  <MenuItem value="instagram">Instagram</MenuItem>
                  <MenuItem value="twitter">Twitter</MenuItem>
                  <MenuItem value="linkedin">LinkedIn</MenuItem>
                  <MenuItem value="tiktok">TikTok</MenuItem>
                </Select>
              </FormControl>
              
              <Button
                variant="outlined"
                onClick={simulateAIAnalysis}
                disabled={isAnalyzing}
                startIcon={isAnalyzing ? <CircularProgress size={16} /> : <Refresh />}
                sx={{
                  borderColor: designTokens.colors.ai[400],
                  color: designTokens.colors.ai[600],
                  '&:hover': {
                    borderColor: designTokens.colors.ai[500],
                    background: designTokens.colors.ai[50]
                  }
                }}
              >
                {isAnalyzing ? 'Analyzing...' : 'Refresh AI Analysis'}
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ p: 3 }}>
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
              <Tab label="Performance Metrics" />
              <Tab label="Content Performance" />
              <Tab label="Trend Analysis" />
              <Tab label="Audience Insights" />
            </Tabs>
          </Box>

          {/* Tab Content */}
          {activeTab === 0 && (
            <Fade in={true}>
              <Box>
                <Typography variant="h6" sx={{ mb: 3, color: designTokens.colors.neutral[800] }}>
                  Key Performance Metrics
                </Typography>
                
                <Grid container spacing={3}>
                  {performanceMetrics.map((metric, index) => (
                    <Grid item xs={12} md={6} lg={4} key={index} component="div">
                      <Fade in={true} timeout={300 + index * 100}>
                        <Card 
                          elevation={0}
                          sx={{
                            border: `1px solid ${designTokens.colors.neutral[200]}`,
                            borderRadius: designTokens.borderRadius.lg,
                            transition: designTokens.animation.micro.cardHover,
                            '&:hover': {
                              boxShadow: designTokens.shadows.md,
                              transform: 'translateY(-2px)'
                            }
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            {/* Header */}
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                              <Typography 
                                variant="h6" 
                                sx={{ 
                                  fontWeight: designTokens.typography.fontWeight.semibold,
                                  color: designTokens.colors.neutral[800]
                                }}
                              >
                                {metric.name}
                              </Typography>
                              
                              <Chip
                                label={metric.status}
                                size="small"
                                sx={{
                                  background: `${getStatusColor(metric.status)}15`,
                                  color: getStatusColor(metric.status),
                                  fontSize: '0.7rem',
                                  fontWeight: 'medium'
                                }}
                              />
                            </Box>

                            {/* Main Value */}
                            <Box sx={{ mb: 2 }}>
                              <Typography 
                                variant="h3" 
                                sx={{ 
                                  fontWeight: designTokens.typography.fontWeight.bold,
                                  color: designTokens.colors.neutral[900],
                                  mb: 1
                                }}
                              >
                                {metric.value.toLocaleString()}
                                {metric.name.includes('Rate') || metric.name.includes('Score') ? '%' : ''}
                              </Typography>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {getTrendIcon(metric.trend)}
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    color: metric.trend === 'up' ? designTokens.colors.success[600] : 
                                           metric.trend === 'down' ? designTokens.colors.error[600] :
                                           designTokens.colors.neutral[600],
                                    fontWeight: 'medium'
                                  }}
                                >
                                  {metric.change > 0 ? '+' : ''}{metric.change}%
                                </Typography>
                              </Box>
                            </Box>

                            {/* Progress Bar */}
                            <Box sx={{ mb: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="caption" sx={{ color: designTokens.colors.neutral[500] }}>
                                  Target: {metric.target}
                                </Typography>
                                <Typography variant="caption" sx={{ color: designTokens.colors.neutral[500] }}>
                                  {Math.round((metric.value / metric.target) * 100)}%
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={Math.min((metric.value / metric.target) * 100, 100)}
                                sx={{
                                  height: 8,
                                  borderRadius: 4,
                                  background: designTokens.colors.neutral[200],
                                  '& .MuiLinearProgress-bar': {
                                    background: getStatusColor(metric.status)
                                  }
                                }}
                              />
                            </Box>

                            {/* AI Insight */}
                            <Box sx={{ 
                              p: 2, 
                              background: designTokens.colors.ai[50], 
                              borderRadius: designTokens.borderRadius.md,
                              border: `1px solid ${designTokens.colors.ai[200]}`,
                              mb: 2
                            }}>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: designTokens.colors.ai[700],
                                  fontSize: '0.875rem',
                                  mb: 1
                                }}
                              >
                                {metric.aiInsight}
                              </Typography>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip
                                  label={metric.priority}
                                  size="small"
                                  sx={{
                                    background: `${getPriorityColor(metric.priority)}15`,
                                    color: getPriorityColor(metric.priority),
                                    fontSize: '0.6rem'
                                  }}
                                />
                                <Typography variant="caption" sx={{ color: designTokens.colors.ai[600] }}>
                                  Priority
                                </Typography>
                              </Box>
                            </Box>

                            {/* Recommendation */}
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: designTokens.colors.neutral[700],
                                fontSize: '0.875rem',
                                fontStyle: 'italic'
                              }}
                            >
                              💡 {metric.recommendation}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Fade>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Fade>
          )}

          {activeTab === 1 && (
            <Fade in={true}>
              <Box>
                <Typography variant="h6" sx={{ mb: 3, color: designTokens.colors.neutral[800] }}>
                  Content Performance Analysis
                </Typography>
                
                <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${designTokens.colors.neutral[200]}` }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Content</TableCell>
                        <TableCell>Platform</TableCell>
                        <TableCell>Published</TableCell>
                        <TableCell>Performance</TableCell>
                        <TableCell>AI Insights</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {contentPerformance.map((content) => (
                        <TableRow key={content.id}>
                          <TableCell>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>
                                {content.title}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                                {content.content.substring(0, 50)}...
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={content.platform}
                              size="small"
                              sx={{
                                background: designTokens.colors.primary[100],
                                color: designTokens.colors.primary[700],
                                fontSize: '0.7rem'
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {content.publishedAt.toLocaleDateString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2">
                                {content.performanceScore}/10
                              </Typography>
                              {content.aiOptimized && (
                                <AutoAwesome sx={{ fontSize: 16, color: designTokens.colors.ai[500] }} />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                              {content.insights.slice(0, 2).map((insight, index) => (
                                <Chip
                                  key={index}
                                  label={insight.substring(0, 20) + '...'}
                                  size="small"
                                  sx={{
                                    background: designTokens.colors.info[100],
                                    color: designTokens.colors.info[700],
                                    fontSize: '0.6rem'
                                  }}
                                />
                              ))}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <IconButton 
                                size="small"
                                onClick={() => onContentOptimize && onContentOptimize(content)}
                              >
                                <AutoAwesome />
                              </IconButton>
                              <IconButton size="small">
                                <Edit />
                              </IconButton>
                              <IconButton size="small">
                                <Analytics />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Fade>
          )}

          {activeTab === 2 && (
            <Fade in={true}>
              <Box>
                <Typography variant="h6" sx={{ mb: 3, color: designTokens.colors.neutral[800] }}>
                  AI-Powered Trend Analysis
                </Typography>
                
                <Grid container spacing={3}>
                  {trendAnalysis.map((trend, index) => (
                    <Grid item xs={12} md={6} lg={4} key={index} component="div">
                      <Fade in={true} timeout={300 + index * 100}>
                        <Card 
                          elevation={0}
                          sx={{
                            border: `1px solid ${designTokens.colors.neutral[200]}`,
                            borderRadius: designTokens.borderRadius.lg,
                            transition: designTokens.animation.micro.cardHover,
                            '&:hover': {
                              boxShadow: designTokens.shadows.md
                            }
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            {/* Header */}
                            <Box sx={{ mb: 2 }}>
                              <Typography 
                                variant="h6" 
                                sx={{ 
                                  fontWeight: designTokens.typography.fontWeight.semibold,
                                  color: designTokens.colors.neutral[800],
                                  mb: 1
                                }}
                              >
                                {trend.metric}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: designTokens.colors.neutral[600]
                                }}
                              >
                                {trend.period}
                              </Typography>
                            </Box>

                            {/* Current vs Previous */}
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                              <Grid item xs={6} component="div">
                                <Box sx={{ textAlign: 'center', p: 2, background: designTokens.colors.primary[50], borderRadius: designTokens.borderRadius.md }}>
                                  <Typography variant="h5" sx={{ color: designTokens.colors.primary[600], fontWeight: 'bold' }}>
                                    {trend.currentValue}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: designTokens.colors.primary[700] }}>
                                    Current
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={6} component="div">
                                <Box sx={{ textAlign: 'center', p: 2, background: designTokens.colors.neutral[50], borderRadius: designTokens.borderRadius.md }}>
                                  <Typography variant="h5" sx={{ color: designTokens.colors.neutral[600], fontWeight: 'bold' }}>
                                    {trend.previousValue}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: designTokens.colors.neutral[700] }}>
                                    Previous
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>

                            {/* Change and Trend */}
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {getTrendIcon(trend.trend)}
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    color: trend.trend === 'up' ? designTokens.colors.success[600] : 
                                           trend.trend === 'down' ? designTokens.colors.error[600] :
                                           designTokens.colors.neutral[600],
                                    fontWeight: 'medium'
                                  }}
                                >
                                  {trend.change > 0 ? '+' : ''}{trend.change}%
                                </Typography>
                              </Box>
                              
                              <Chip
                                label={`${trend.confidence}%`}
                                size="small"
                                sx={{
                                  background: designTokens.colors.ai[100],
                                  color: designTokens.colors.ai[700],
                                  fontSize: '0.7rem'
                                }}
                              />
                            </Box>

                            {/* AI Prediction */}
                            <Box sx={{ 
                              p: 2, 
                              background: designTokens.colors.ai[50], 
                              borderRadius: designTokens.borderRadius.md,
                              border: `1px solid ${designTokens.colors.ai[200]}`,
                              mb: 2
                            }}>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: designTokens.colors.ai[700],
                                  fontSize: '0.875rem',
                                  mb: 1
                                }}
                              >
                                {trend.aiPrediction}
                              </Typography>
                            </Box>

                            {/* Factors */}
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" sx={{ color: designTokens.colors.neutral[700], mb: 1 }}>
                                Key Factors:
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                {trend.factors.slice(0, 3).map((factor, index) => (
                                  <Chip
                                    key={index}
                                    label={factor}
                                    size="small"
                                    sx={{
                                      background: designTokens.colors.neutral[100],
                                      color: designTokens.colors.neutral[700],
                                      fontSize: '0.6rem'
                                    }}
                                  />
                                ))}
                              </Box>
                            </Box>

                            {/* Impact */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="caption" sx={{ color: designTokens.colors.neutral[500] }}>
                                Impact:
                              </Typography>
                              <Chip
                                label={trend.impact}
                                size="small"
                                sx={{
                                  background: `${getImpactColor(trend.impact)}15`,
                                  color: getImpactColor(trend.impact),
                                  fontSize: '0.6rem'
                                }}
                              />
                            </Box>
                          </CardContent>
                        </Card>
                      </Fade>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Fade>
          )}

          {activeTab === 3 && (
            <Fade in={true}>
              <Box>
                <Typography variant="h6" sx={{ mb: 3, color: designTokens.colors.neutral[800] }}>
                  Audience Insights & Segmentation
                </Typography>
                
                <Grid container spacing={3}>
                  {audienceInsights.map((insight, index) => (
                    <Grid item xs={12} md={6} lg={4} key={index} component="div">
                      <Fade in={true} timeout={300 + index * 100}>
                        <Card 
                          elevation={0}
                          sx={{
                            border: `1px solid ${designTokens.colors.neutral[200]}`,
                            borderRadius: designTokens.borderRadius.lg,
                            transition: designTokens.animation.micro.cardHover,
                            '&:hover': {
                              boxShadow: designTokens.shadows.md
                            }
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            {/* Header */}
                            <Box sx={{ mb: 2 }}>
                              <Typography 
                                variant="h6" 
                                sx={{ 
                                  fontWeight: designTokens.typography.fontWeight.semibold,
                                  color: designTokens.colors.neutral[800],
                                  mb: 1
                                }}
                              >
                                {insight.segment}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: designTokens.colors.neutral[600]
                                }}
                              >
                                {insight.size.toLocaleString()} followers
                              </Typography>
                            </Box>

                            {/* Metrics */}
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                              <Grid item xs={6} component="div">
                                <Box sx={{ textAlign: 'center', p: 2, background: designTokens.colors.success[50], borderRadius: designTokens.borderRadius.md }}>
                                  <Typography variant="h5" sx={{ color: designTokens.colors.success[600], fontWeight: 'bold' }}>
                                    {insight.engagement}%
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: designTokens.colors.success[700] }}>
                                    Engagement
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={6} component="div">
                                <Box sx={{ textAlign: 'center', p: 2, background: designTokens.colors.primary[50], borderRadius: designTokens.borderRadius.md }}>
                                  <Typography variant="h5" sx={{ color: designTokens.colors.primary[600], fontWeight: 'bold' }}>
                                    {insight.growth}%
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: designTokens.colors.primary[700] }}>
                                    Growth
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>

                            {/* Interests */}
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" sx={{ color: designTokens.colors.neutral[700], mb: 1 }}>
                                Top Interests:
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                {insight.interests.slice(0, 4).map((interest, index) => (
                                  <Chip
                                    key={index}
                                    label={interest}
                                    size="small"
                                    sx={{
                                      background: designTokens.colors.secondary[100],
                                      color: designTokens.colors.secondary[700],
                                      fontSize: '0.6rem'
                                    }}
                                  />
                                ))}
                              </Box>
                            </Box>

                            {/* Best Content Types */}
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" sx={{ color: designTokens.colors.neutral[700], mb: 1 }}>
                                Best Content:
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                {insight.bestContentTypes.slice(0, 3).map((type, index) => (
                                  <Chip
                                    key={index}
                                    label={type}
                                    size="small"
                                    sx={{
                                      background: designTokens.colors.ai[100],
                                      color: designTokens.colors.ai[700],
                                      fontSize: '0.6rem'
                                    }}
                                  />
                                ))}
                              </Box>
                            </Box>

                            {/* AI Recommendations */}
                            <Box sx={{ 
                              p: 2, 
                              background: designTokens.colors.ai[50], 
                              borderRadius: designTokens.borderRadius.md,
                              border: `1px solid ${designTokens.colors.ai[200]}`
                            }}>
                              <Typography variant="body2" sx={{ color: designTokens.colors.ai[700], mb: 1, fontWeight: 'medium' }}>
                                AI Recommendations:
                              </Typography>
                              <List dense sx={{ p: 0 }}>
                                {insight.aiRecommendations.slice(0, 2).map((rec, index) => (
                                  <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                                    <ListItemIcon sx={{ minWidth: 24 }}>
                                      <Lightbulb sx={{ fontSize: 14, color: designTokens.colors.ai[600] }} />
                                                                      </ListItemIcon>
                                  <ListItemText
                                    primary={rec}
                                    primaryTypographyProps={{
                                      variant: 'caption',
                                      color: 'text.secondary',
                                      fontSize: '0.7rem'
                                    }}
                                  />
                                </ListItem>
                                ))}
                              </List>
                            </Box>
                          </CardContent>
                        </Card>
                      </Fade>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Fade>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
