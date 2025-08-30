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
  TableRow
} from '@mui/material';
import {
  AutoAwesome,
  TrendingUp,
  Psychology,
  Analytics,
  CheckCircle,
  Warning,
  Error,
  Info,
  Lightbulb,
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
  Add,
  Edit,
  Delete,
  Visibility,
  Refresh,
  Settings,
  Schedule,
  ContentCopy,
  TrendingDown,
  TrendingFlat,
  Rocket,
  Hub,
  Code,
  DataUsage,
  Sync,
  AutoFixHigh,
  PsychologyAlt,
  Timeline,
  ShowChart,
  BarChart,
  PieChart,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { designTokens } from '@/lib/design-system';
import { 
  useContentPrediction, 
  useAudienceAnalysis,
  useAIInsights 
} from '@/hooks/use-ai-api';

// Interfaces
interface ContentPrediction {
  id: string;
  contentId: string;
  contentType: 'post' | 'story' | 'video' | 'article';
  platform: string;
  predictedMetrics: {
    engagement: number;
    reach: number;
    clicks: number;
    shares: number;
    comments: number;
    conversion: number;
  };
  confidence: number;
  factors: PredictionFactor[];
  recommendations: string[];
  predictedPerformance: 'low' | 'medium' | 'high' | 'viral';
  aiInsights: AIInsight[];
  createdAt: Date;
  expiresAt: Date;
}

interface PredictionFactor {
  id: string;
  name: string;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number;
  description: string;
  trend: 'increasing' | 'decreasing' | 'stable';
}

interface AIInsight {
  id: string;
  type: 'opportunity' | 'risk' | 'trend' | 'optimization';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface AudiencePrediction {
  id: string;
  audienceSegment: string;
  predictedBehavior: {
    engagement: number;
    responseTime: number;
    sharing: number;
    conversion: number;
  };
  trends: {
    growth: number;
    activity: number;
    interests: string[];
  };
  recommendations: string[];
}

interface PublishingStrategy {
  id: string;
  name: string;
  description: string;
  predictedSuccess: number;
  timing: {
    optimalDays: string[];
    optimalHours: string[];
    frequency: number;
  };
  contentMix: {
    types: string[];
    themes: string[];
    formats: string[];
  };
  platforms: string[];
  aiOptimized: boolean;
}

export default function PredictiveContentIntelligence() {
  const [activeTab, setActiveTab] = useState(0);
  const [contentPredictions, setContentPredictions] = useState<ContentPrediction[]>([]);
  const [audiencePredictions, setAudiencePredictions] = useState<AudiencePrediction[]>([]);
  const [publishingStrategies, setPublishingStrategies] = useState<PublishingStrategy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPrediction, setSelectedPrediction] = useState<ContentPrediction | null>(null);
  const [predictionDialogOpen, setPredictionDialogOpen] = useState(false);

  // AI API hooks
  const contentPrediction = useContentPrediction();
  const audienceAnalysis = useAudienceAnalysis();
  const aiInsights = useAIInsights();

  // Mock data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Mock content predictions
      setContentPredictions([
        {
          id: 'pred-001',
          contentId: 'content-001',
          contentType: 'post',
          platform: 'instagram',
          predictedMetrics: {
            engagement: 0.087,
            reach: 12500,
            clicks: 156,
            shares: 89,
            comments: 234,
            conversion: 0.023
          },
          confidence: 0.89,
          factors: [
            {
              id: 'f-001',
              name: 'Hashtag Optimization',
              impact: 'positive',
              weight: 0.25,
              description: 'Trending hashtags increase discoverability by 25%',
              trend: 'increasing'
            },
            {
              id: 'f-002',
              name: 'Posting Time',
              impact: 'positive',
              weight: 0.18,
              description: 'Optimal posting time during peak audience activity',
              trend: 'stable'
            }
          ],
          recommendations: [
            'Use trending hashtags #CreatorFlow #AIContent',
            'Post during 2-4 PM peak hours',
            'Include call-to-action for better engagement'
          ],
          predictedPerformance: 'high',
          aiInsights: [
            {
              id: 'insight-001',
              type: 'opportunity',
              title: 'Viral Potential Detected',
              description: 'Content shows 23% higher viral coefficient than average',
              confidence: 0.87,
              actionable: true,
              priority: 'high'
            }
          ],
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        },
        {
          id: 'pred-002',
          contentId: 'content-002',
          contentType: 'video',
          platform: 'tiktok',
          predictedMetrics: {
            engagement: 0.156,
            reach: 8900,
            clicks: 234,
            shares: 156,
            comments: 445,
            conversion: 0.045
          },
          confidence: 0.92,
          factors: [
            {
              id: 'f-003',
              name: 'Video Length',
              impact: 'positive',
              weight: 0.32,
              description: '15-30 second videos perform 32% better on TikTok',
              trend: 'increasing'
            }
          ],
          recommendations: [
            'Keep video under 30 seconds',
            'Use trending audio/sounds',
            'Start with hook in first 3 seconds'
          ],
          predictedPerformance: 'viral',
          aiInsights: [
            {
              id: 'insight-002',
              type: 'trend',
              title: 'Trending Content Pattern',
              description: 'Matches current viral content patterns with 92% accuracy',
              confidence: 0.92,
              actionable: true,
              priority: 'high'
            }
          ],
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        }
      ]);

      // Mock audience predictions
      setAudiencePredictions([
        {
          id: 'aud-001',
          audienceSegment: 'Tech Creators (25-34)',
          predictedBehavior: {
            engagement: 0.094,
            responseTime: 2.3,
            sharing: 0.067,
            conversion: 0.034
          },
          trends: {
            growth: 0.23,
            activity: 0.78,
            interests: ['AI Tools', 'Content Creation', 'Productivity']
          },
          recommendations: [
            'Focus on AI-powered content creation tools',
            'Share productivity tips and workflows',
            'Use technical but accessible language'
          ]
        }
      ]);

      // Mock publishing strategies
      setPublishingStrategies([
        {
          id: 'strat-001',
          name: 'High-Engagement Content Strategy',
          description: 'Optimized for maximum engagement and viral potential',
          predictedSuccess: 0.87,
          timing: {
            optimalDays: ['Tuesday', 'Thursday', 'Friday'],
            optimalHours: ['14:00', '16:00', '19:00'],
            frequency: 3
          },
          contentMix: {
            types: ['Educational', 'Behind-the-scenes', 'User-generated'],
            themes: ['AI Innovation', 'Creator Success', 'Tech Trends'],
            formats: ['Video', 'Carousel', 'Story']
          },
          platforms: ['Instagram', 'LinkedIn', 'Twitter'],
          aiOptimized: true
        }
      ]);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'viral':
        return designTokens.colors.ai[500];
      case 'high':
        return designTokens.colors.success[500];
      case 'medium':
        return designTokens.colors.warning[500];
      case 'low':
        return designTokens.colors.error[500];
      default:
        return designTokens.colors.neutral[500];
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive':
        return designTokens.colors.success[500];
      case 'negative':
        return designTokens.colors.error[500];
      case 'neutral':
        return designTokens.colors.neutral[500];
      default:
        return designTokens.colors.neutral[500];
    }
  };

  const getInsightTypeColor = (type: string) => {
    switch (type) {
      case 'opportunity':
        return designTokens.colors.success[500];
      case 'risk':
        return designTokens.colors.error[500];
      case 'trend':
        return designTokens.colors.ai[500];
      case 'optimization':
        return designTokens.colors.primary[500];
      default:
        return designTokens.colors.neutral[500];
    }
  };

  const handleGeneratePrediction = async (content: string, contentType: string, platform: string) => {
    try {
      await contentPrediction.execute({
        content,
        contentType,
        platform,
        audience: 'general',
        historicalData: {}
      });

      if (contentPrediction.success && contentPrediction.data) {
        // Convert API response to our internal format
        const newPrediction: ContentPrediction = {
          id: `pred-${Date.now()}`,
          contentId: `content-${Date.now()}`,
          contentType: contentType as any,
          platform,
          predictedMetrics: contentPrediction.data.predictions,
          confidence: contentPrediction.data.confidence,
          factors: contentPrediction.data.factors,
          recommendations: contentPrediction.data.recommendations,
          predictedPerformance: contentPrediction.data.predictions.engagement > 0.1 ? 'high' : 'medium',
          aiInsights: [],
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        };

        setContentPredictions(prev => [newPrediction, ...prev]);
      }
    } catch (error) {
      console.error('Failed to generate prediction:', error);
    }
  };

  const renderContentPredictionsTab = () => (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, color: designTokens.colors.neutral[900] }}>
        Content Performance Predictions
      </Typography>

      <Grid container spacing={3}>
        {contentPredictions.map((prediction) => (
          <Grid item xs={12} md={6} key={prediction.id}>
            <Card
              elevation={0}
              sx={{
                border: `1px solid ${designTokens.colors.neutral[200]}`,
                borderRadius: designTokens.borderRadius.lg,
                transition: designTokens.animation.micro.cardHover,
                '&:hover': {
                  boxShadow: designTokens.shadows.md,
                  borderColor: designTokens.colors.ai[300]
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: designTokens.colors.ai[600]
                      }}
                    >
                      {prediction.contentType === 'video' ? <ContentCopy /> : <ContentCopy />}
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ color: designTokens.colors.neutral[900] }}>
                        {prediction.contentType.charAt(0).toUpperCase() + prediction.contentType.slice(1)}
                      </Typography>
                      <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                        {prediction.platform}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={prediction.predictedPerformance}
                    size="small"
                    sx={{
                      background: `${getPerformanceColor(prediction.predictedPerformance)}15`,
                      color: getPerformanceColor(prediction.predictedPerformance),
                      fontWeight: 'bold',
                      textTransform: 'capitalize'
                    }}
                  />
                </Box>

                {/* Confidence Score */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: designTokens.colors.neutral[700] }}>
                      AI Confidence
                    </Typography>
                    <Typography variant="body2" sx={{ color: designTokens.colors.neutral[700] }}>
                      {(prediction.confidence * 100).toFixed(0)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={prediction.confidence * 100}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      background: designTokens.colors.neutral[200],
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(90deg, #06B6D4, #8B5CF6)'
                      }
                    }}
                  />
                </Box>

                {/* Predicted Metrics */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, color: designTokens.colors.neutral[800] }}>
                    Predicted Metrics
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} component="div">
                      <Box sx={{ textAlign: 'center', p: 1 }}>
                        <Typography variant="h6" sx={{ color: designTokens.colors.neutral[900] }}>
                          {(prediction.predictedMetrics.engagement * 100).toFixed(1)}%
                        </Typography>
                        <Typography variant="caption" sx={{ color: designTokens.colors.neutral[600] }}>
                          Engagement
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 1 }}>
                        <Typography variant="h6" sx={{ color: designTokens.colors.neutral[900] }}>
                          {prediction.predictedMetrics.reach.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" sx={{ color: designTokens.colors.neutral[600] }}>
                          Reach
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                {/* Key Factors */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, color: designTokens.colors.neutral[800] }}>
                    Key Factors
                  </Typography>
                  <Stack spacing={1}>
                    {prediction.factors.slice(0, 2).map((factor) => (
                      <Box key={factor.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: getImpactColor(factor.impact)
                          }}
                        />
                        <Typography variant="body2" sx={{ color: designTokens.colors.neutral[700] }}>
                          {factor.name}
                        </Typography>
                        <Chip
                          label={`${(factor.weight * 100).toFixed(0)}%`}
                          size="small"
                          sx={{
                            background: designTokens.colors.neutral[100],
                            fontSize: '0.6rem',
                            height: 20
                          }}
                        />
                      </Box>
                    ))}
                  </Stack>
                </Box>

                {/* Actions */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Visibility />}
                    onClick={() => {
                      setSelectedPrediction(prediction);
                      setPredictionDialogOpen(true);
                    }}
                    sx={{ flex: 1 }}
                  >
                    View Details
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<AutoFixHigh />}
                    sx={{
                      background: 'linear-gradient(90deg, #06B6D4, #8B5CF6)',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #0891B2, #7C3AED)'
                      }
                    }}
                  >
                    Optimize
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderAudiencePredictionsTab = () => (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, color: designTokens.colors.neutral[900] }}>
        Audience Behavior Predictions
      </Typography>

      <Grid container spacing={3}>
        {audiencePredictions.map((audience) => (
          <Grid item xs={12} md={6} key={audience.id}>
            <Card
              elevation={0}
              sx={{
                border: `1px solid ${designTokens.colors.neutral[200]}`,
                borderRadius: designTokens.borderRadius.lg
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, color: designTokens.colors.neutral[900] }}>
                  {audience.audienceSegment}
                </Typography>

                {/* Predicted Behavior */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, color: designTokens.colors.neutral[800] }}>
                    Predicted Behavior
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 1 }}>
                        <Typography variant="h6" sx={{ color: designTokens.colors.neutral[900] }}>
                          {(audience.predictedBehavior.engagement * 100).toFixed(1)}%
                        </Typography>
                        <Typography variant="caption" sx={{ color: designTokens.colors.neutral[600] }}>
                          Engagement
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 1 }}>
                        <Typography variant="h6" sx={{ color: designTokens.colors.neutral[900] }}>
                          {audience.predictedBehavior.responseTime.toFixed(1)}h
                        </Typography>
                        <Typography variant="caption" sx={{ color: designTokens.colors.neutral[600] }}>
                          Response Time
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                {/* Trends */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, color: designTokens.colors.neutral[800] }}>
                    Trends
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ color: designTokens.colors.success[600] }}>
                        +{(audience.trends.growth * 100).toFixed(0)}%
                      </Typography>
                      <Typography variant="caption" sx={{ color: designTokens.colors.neutral[600] }}>
                        Growth
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ color: designTokens.colors.primary[600] }}>
                        {(audience.trends.activity * 100).toFixed(0)}%
                      </Typography>
                      <Typography variant="caption" sx={{ color: designTokens.colors.neutral[600] }}>
                        Activity
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Recommendations */}
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 2, color: designTokens.colors.neutral[800] }}>
                    AI Recommendations
                  </Typography>
                  <List dense>
                    {audience.recommendations.map((rec, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Lightbulb sx={{ fontSize: 16, color: designTokens.colors.ai[600] }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={rec}
                          primaryTypographyProps={{
                            variant: 'body2',
                            color: 'text.secondary'
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderPublishingStrategiesTab = () => (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, color: designTokens.colors.neutral[900] }}>
        AI-Optimized Publishing Strategies
      </Typography>

      <Grid container spacing={3}>
        {publishingStrategies.map((strategy) => (
          <Grid item xs={12} key={strategy.id}>
            <Card
              elevation={0}
              sx={{
                border: `1px solid ${designTokens.colors.neutral[200]}`,
                borderRadius: designTokens.borderRadius.lg
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: designTokens.colors.ai[600],
                      flexShrink: 0
                    }}
                  >
                    <Psychology sx={{ fontSize: 32 }} />
                  </Box>
                  
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Typography variant="h5" sx={{ color: designTokens.colors.neutral[900] }}>
                        {strategy.name}
                      </Typography>
                      <Chip
                        label={`${(strategy.predictedSuccess * 100).toFixed(0)}% Success`}
                        size="small"
                        sx={{
                          background: designTokens.colors.success[100],
                          color: designTokens.colors.success[700],
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                    
                    <Typography variant="body1" sx={{ color: designTokens.colors.neutral[600], mb: 3 }}>
                      {strategy.description}
                    </Typography>

                    <Grid container spacing={3}>
                      {/* Timing */}
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" sx={{ mb: 2, color: designTokens.colors.neutral[800] }}>
                          Optimal Timing
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" sx={{ color: designTokens.colors.neutral[700], mb: 1 }}>
                            Days: {strategy.timing.optimalDays.join(', ')}
                          </Typography>
                          <Typography variant="body2" sx={{ color: designTokens.colors.neutral[700], mb: 1 }}>
                            Hours: {strategy.timing.optimalHours.join(', ')}
                          </Typography>
                          <Typography variant="body2" sx={{ color: designTokens.colors.neutral[700] }}>
                            Frequency: {strategy.timing.frequency}x per week
                          </Typography>
                        </Box>
                      </Grid>

                      {/* Content Mix */}
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" sx={{ mb: 2, color: designTokens.colors.neutral[800] }}>
                          Content Mix
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" sx={{ color: designTokens.colors.neutral[700], mb: 1 }}>
                            Types: {strategy.contentMix.types.join(', ')}
                          </Typography>
                          <Typography variant="body2" sx={{ color: designTokens.colors.neutral[700], mb: 1 }}>
                            Themes: {strategy.contentMix.themes.join(', ')}
                          </Typography>
                          <Typography variant="body2" sx={{ color: designTokens.colors.neutral[700] }}>
                            Formats: {strategy.contentMix.formats.join(', ')}
                          </Typography>
                        </Box>
                      </Grid>

                      {/* Platforms */}
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" sx={{ mb: 2, color: designTokens.colors.neutral[800] }}>
                          Target Platforms
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {strategy.platforms.map((platform) => (
                            <Chip
                              key={platform}
                              label={platform}
                              size="small"
                              sx={{
                                background: designTokens.colors.primary[100],
                                color: designTokens.colors.primary[700]
                              }}
                            />
                          ))}
                        </Box>
                      </Grid>
                    </Grid>

                    {/* AI Optimization Status */}
                    {strategy.aiOptimized && (
                      <Box sx={{ mt: 3, p: 2, background: designTokens.colors.ai[50], borderRadius: designTokens.borderRadius.md }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Brain sx={{ fontSize: 16, color: designTokens.colors.ai[600] }} />
                          <Typography variant="body2" sx={{ color: designTokens.colors.ai[700], fontWeight: 'medium' }}>
                            AI-Optimized Strategy
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: designTokens.colors.ai[600] }}>
                          This strategy has been continuously optimized by AI based on performance data and audience behavior patterns.
                        </Typography>
                      </Box>
                    )}
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
            {[1, 2, 3, 4].map((item) => (
              <Grid item xs={12} md={6} key={item}>
                <Skeleton variant="rectangular" height={400} />
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
            <Psychology sx={{ fontSize: 28 }} />
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
              Predictive Content Intelligence
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: designTokens.colors.neutral[600],
                fontWeight: designTokens.typography.fontWeight.normal
              }}
            >
              Advanced AI that predicts content performance, audience behavior, and optimal publishing strategies
            </Typography>
          </Box>
        </Box>

        {/* AI Prediction Status */}
        <Alert 
          severity="info" 
          sx={{ 
            mt: 3,
            background: 'linear-gradient(90deg, rgba(37, 99, 235, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
            border: `1px solid ${designTokens.colors.primary[200]}`,
            borderRadius: designTokens.borderRadius.lg
          }}
        >
          <AlertTitle sx={{ color: designTokens.colors.primary[700] }}>
            🔮 AI Predictions Active
          </AlertTitle>
          <Typography variant="body2" sx={{ color: designTokens.colors.primary[700] }}>
            Your AI system has analyzed {contentPredictions.length} content pieces and {audiencePredictions.length} audience segments. 
            Current prediction accuracy: 89.2%. AI insights are continuously learning and improving based on real performance data.
          </Typography>
        </Alert>

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

      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="Content Predictions" />
          <Tab label="Audience Predictions" />
          <Tab label="Publishing Strategies" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && renderContentPredictionsTab()}
      {activeTab === 1 && renderAudiencePredictionsTab()}
      {activeTab === 2 && renderPublishingStrategiesTab()}

      {/* Prediction Detail Dialog */}
      <Dialog
        open={predictionDialogOpen}
        onClose={() => setPredictionDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Content Prediction Details
        </DialogTitle>
        <DialogContent>
          {selectedPrediction && (
            <Box>
              {/* Detailed prediction information would go here */}
              <Typography variant="body1">
                Detailed analysis for {selectedPrediction.contentType} on {selectedPrediction.platform}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPredictionDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
