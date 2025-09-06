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
  Brain,
  TrendingUp,
  Schedule,
  CalendarToday,
  AccessTime,
  TrendingFlat,
  Psychology,
  Rocket,
  Monitor,
  BarChart,
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
  TrendingDown,
  TrendingUp as TrendingUpIcon,
  Public,
  Lock,
  Group,
  Person,
  Event,
  Notifications,
  Settings,
  Refresh
} from '@/lib/mui-optimized-imports';
import { designTokens } from '@/lib/design-system';

// Optimal time interface
interface OptimalTime {
  time: string;
  day: string;
  platform: string;
  engagementScore: number;
  reachScore: number;
  audienceActivity: number;
  competition: number;
  aiRecommendation: string;
  confidence: number;
}

// Scheduling rule interface
interface SchedulingRule {
  id: string;
  name: string;
  description: string;
  platforms: string[];
  contentTypes: string[];
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  times: string[];
  days: string[];
  enabled: boolean;
  aiOptimized: boolean;
  performance: number;
  lastUsed: Date;
  nextRun: Date;
}

// Scheduled content interface
interface ScheduledContent {
  id: string;
  title: string;
  content: string;
  platforms: string[];
  scheduledTime: Date;
  status: 'scheduled' | 'processing' | 'published' | 'failed';
  aiOptimized: boolean;
  performancePrediction: number;
  actualPerformance?: number;
  createdAt: Date;
}

// Audience activity interface
interface AudienceActivity {
  platform: string;
  day: string;
  time: string;
  activityLevel: number;
  engagementRate: number;
  bestContentTypes: string[];
  trendingTopics: string[];
}

interface SmartSchedulingProps {
  onSchedule?: (content: ScheduledContent) => void;
  onRuleCreate?: (rule: SchedulingRule) => void;
  onRuleUpdate?: (rule: SchedulingRule) => void;
  onRuleDelete?: (ruleId: string) => void;
  loading?: boolean;
  error?: string | null;
  className?: string;
}

export default function SmartScheduling({
  onSchedule,
  onRuleCreate,
  onRuleUpdate,
  onRuleDelete,
  loading = false,
  error = null,
  className
}: SmartSchedulingProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedContentType, setSelectedContentType] = useState<string>('');
  const [schedulingRules, setSchedulingRules] = useState<SchedulingRule[]>([]);
  const [scheduledContent, setScheduledContent] = useState<ScheduledContent[]>([]);
  const [optimalTimes, setOptimalTimes] = useState<OptimalTime[]>([]);
  const [audienceActivity, setAudienceActivity] = useState<AudienceActivity[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showCreateRule, setShowCreateRule] = useState(false);
  const [selectedRule, setSelectedRule] = useState<SchedulingRule | null>(null);

  // Mock data for optimal times
  const mockOptimalTimes: OptimalTime[] = [
    {
      time: '2:00 PM',
      day: 'Monday',
      platform: 'Instagram',
      engagementScore: 8.5,
      reachScore: 7.8,
      audienceActivity: 9.2,
      competition: 6.4,
      aiRecommendation: 'High engagement time with active audience',
      confidence: 89
    },
    {
      time: '7:00 PM',
      day: 'Wednesday',
      platform: 'Instagram',
      engagementScore: 8.9,
      reachScore: 8.2,
      audienceActivity: 8.8,
      competition: 7.1,
      aiRecommendation: 'Peak evening activity, great for visual content',
      confidence: 92
    },
    {
      time: '9:00 PM',
      day: 'Friday',
      platform: 'TikTok',
      engagementScore: 9.1,
      reachScore: 8.7,
      audienceActivity: 9.5,
      competition: 5.8,
      aiRecommendation: 'Prime time for Gen Z audience',
      confidence: 94
    },
    {
      time: '8:00 AM',
      day: 'Tuesday',
      platform: 'LinkedIn',
      engagementScore: 7.8,
      reachScore: 8.5,
      audienceActivity: 7.2,
      competition: 4.9,
      aiRecommendation: 'Professional audience active, low competition',
      confidence: 85
    },
    {
      time: '12:00 PM',
      day: 'Thursday',
      platform: 'Twitter',
      engagementScore: 8.2,
      reachScore: 7.9,
      audienceActivity: 8.1,
      competition: 7.8,
      aiRecommendation: 'Lunch break engagement, trending topics',
      confidence: 87
    }
  ];

  // Mock data for scheduling rules
  const mockSchedulingRules: SchedulingRule[] = [
    {
      id: '1',
      name: 'Instagram Daily Posts',
      description: 'Daily Instagram posts at optimal engagement times',
      platforms: ['instagram'],
      contentTypes: ['post', 'story'],
      frequency: 'daily',
      times: ['2:00 PM', '7:00 PM'],
      days: ['monday', 'wednesday', 'friday'],
      enabled: true,
      aiOptimized: true,
      performance: 8.7,
      lastUsed: new Date(),
      nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      name: 'LinkedIn Professional Content',
      description: 'Weekly professional content for business audience',
      platforms: ['linkedin'],
      contentTypes: ['post', 'article'],
      frequency: 'weekly',
      times: ['8:00 AM', '12:00 PM'],
      days: ['tuesday', 'thursday'],
      enabled: true,
      aiOptimized: true,
      performance: 7.9,
      lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      nextRun: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    },
    {
      id: '3',
      name: 'TikTok Viral Content',
      description: 'Evening content for maximum viral potential',
      platforms: ['tiktok'],
      contentTypes: ['video'],
      frequency: 'daily',
      times: ['9:00 PM'],
      days: ['friday', 'saturday'],
      enabled: false,
      aiOptimized: true,
      performance: 9.1,
      lastUsed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      nextRun: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    }
  ];

  // Mock data for scheduled content
  const mockScheduledContent: ScheduledContent[] = [
    {
      id: '1',
      title: 'Product Launch Announcement',
      content: 'Excited to announce our new AI-powered content optimization tool! 🚀',
      platforms: ['instagram', 'linkedin'],
      scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      status: 'scheduled',
      aiOptimized: true,
      performancePrediction: 8.5,
      createdAt: new Date()
    },
    {
      id: '2',
      title: 'Weekly Tips Series',
      content: 'Tip #3: Use questions in your captions to increase engagement by 40%',
      platforms: ['instagram'],
      scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: 'scheduled',
      aiOptimized: true,
      performancePrediction: 7.8,
      createdAt: new Date()
    },
    {
      id: '3',
      title: 'Industry Insights',
      content: 'The future of content creation: AI vs. human creativity',
      platforms: ['linkedin'],
      scheduledTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      status: 'scheduled',
      aiOptimized: true,
      performancePrediction: 8.2,
      createdAt: new Date()
    }
  ];

  // Mock data for audience activity
  const mockAudienceActivity: AudienceActivity[] = [
    {
      platform: 'Instagram',
      day: 'Monday',
      time: '2:00 PM',
      activityLevel: 9.2,
      engagementRate: 8.5,
      bestContentTypes: ['post', 'story', 'reel'],
      trendingTopics: ['#MondayMotivation', '#Workout', '#Food']
    },
    {
      platform: 'Instagram',
      day: 'Wednesday',
      time: '7:00 PM',
      activityLevel: 8.8,
      engagementRate: 8.9,
      bestContentTypes: ['story', 'reel'],
      trendingTopics: ['#HumpDay', '#Midweek', '#Relax']
    },
    {
      platform: 'TikTok',
      day: 'Friday',
      time: '9:00 PM',
      activityLevel: 9.5,
      engagementRate: 9.1,
      bestContentTypes: ['video'],
      trendingTopics: ['#FridayNight', '#Weekend', '#Party']
    }
  ];

  useEffect(() => {
    setOptimalTimes(mockOptimalTimes);
    setSchedulingRules(mockSchedulingRules);
    setScheduledContent(mockScheduledContent);
    setAudienceActivity(mockAudienceActivity);
  }, []);

  // Simulate AI analysis
  const simulateAIAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Update optimal times with new AI insights
    const updatedTimes = mockOptimalTimes.map(time => ({
      ...time,
      engagementScore: time.engagementScore + (Math.random() - 0.5) * 2,
      reachScore: time.reachScore + (Math.random() - 0.5) * 2,
      confidence: Math.min(100, Math.max(70, time.confidence + (Math.random() - 0.5) * 20))
    }));
    
    setOptimalTimes(updatedTimes);
    setIsAnalyzing(false);
  };

  // Toggle rule status
  const toggleRuleStatus = (ruleId: string) => {
    setSchedulingRules(prev => 
      prev.map(rule => 
        rule.id === ruleId 
          ? { ...rule, enabled: !rule.enabled }
          : rule
      )
    );
  };

  // Delete rule
  const handleDeleteRule = (ruleId: string) => {
    setSchedulingRules(prev => prev.filter(rule => rule.id !== ruleId));
    if (onRuleDelete) {
      onRuleDelete(ruleId);
    }
  };

  // Get performance color
  const getPerformanceColor = (score: number) => {
    if (score >= 8.5) return designTokens.colors.success[500];
    if (score >= 7.0) return designTokens.colors.warning[500];
    return designTokens.colors.error[500];
  };

  // Get performance label
  const getPerformanceLabel = (score: number) => {
    if (score >= 8.5) return 'Excellent';
    if (score >= 7.0) return 'Good';
    if (score >= 5.5) return 'Average';
    return 'Poor';
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return designTokens.colors.info[500];
      case 'processing':
        return designTokens.colors.warning[500];
      case 'published':
        return designTokens.colors.success[500];
      case 'failed':
        return designTokens.colors.error[500];
      default:
        return designTokens.colors.neutral[500];
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Schedule fontSize="small" />;
      case 'processing':
        return <CircularProgress size={16} />;
      case 'published':
        return <CheckCircle fontSize="small" />;
      case 'failed':
        return <Warning fontSize="small" />;
      default:
        return <Info fontSize="small" />;
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

      {/* Main Smart Scheduling Interface */}
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
                  background: `${designTokens.colors.secondary[500]}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: designTokens.colors.secondary[600]
                }}
              >
                <Schedule sx={{ fontSize: 24 }} />
              </Box>
              <Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: designTokens.typography.fontWeight.bold,
                    color: designTokens.colors.neutral[800]
                  }}
                >
                  Smart Scheduling
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: designTokens.colors.neutral[600]
                  }}
                >
                  AI-powered optimal timing and automated scheduling
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
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
              
              <Button
                variant="contained"
                onClick={() => setShowCreateRule(true)}
                startIcon={<Add />}
                sx={{
                  background: designTokens.colors.primary[500],
                  '&:hover': {
                    background: designTokens.colors.primary[600]
                  }
                }}
              >
                Create Rule
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ p: 3 }}>
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
              <Tab label="Optimal Times" />
              <Tab label="Scheduling Rules" />
              <Tab label="Scheduled Content" />
              <Tab label="Audience Activity" />
            </Tabs>
          </Box>

          {/* Tab Content */}
          {activeTab === 0 && (
            <Fade in={true}>
              <Box>
                <Typography variant="h6" sx={{ mb: 3, color: designTokens.colors.neutral[800] }}>
                  AI-Optimized Posting Times
                </Typography>
                
                <Grid container spacing={3}>
                  {optimalTimes.map((time, index) => (
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
                              <Box>
                                <Typography 
                                  variant="h4" 
                                  sx={{ 
                                    fontWeight: designTokens.typography.fontWeight.bold,
                                    color: designTokens.colors.primary[600]
                                  }}
                                >
                                  {time.time}
                                </Typography>
                                <Typography 
                                  variant="subtitle2" 
                                  sx={{ 
                                    color: designTokens.colors.neutral[600]
                                  }}
                                >
                                  {time.day} • {time.platform}
                                </Typography>
                              </Box>
                              
                              <Chip
                                label={`${time.confidence}%`}
                                size="small"
                                sx={{
                                  background: designTokens.colors.ai[100],
                                  color: designTokens.colors.ai[700],
                                  fontWeight: 'bold'
                                }}
                              />
                            </Box>

                            {/* Performance Scores */}
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                              <Grid item xs={6} component="div">
                                <Box sx={{ textAlign: 'center', p: 2, background: designTokens.colors.success[50], borderRadius: designTokens.borderRadius.md }}>
                                  <Typography variant="h6" sx={{ color: designTokens.colors.success[600], fontWeight: 'bold' }}>
                                    {time.engagementScore.toFixed(1)}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: designTokens.colors.success[700] }}>
                                    Engagement
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={6} component="div">
                                <Box sx={{ textAlign: 'center', p: 2, background: designTokens.colors.primary[50], borderRadius: designTokens.borderRadius.md }}>
                                  <Typography variant="h6" sx={{ color: designTokens.colors.primary[600], fontWeight: 'bold' }}>
                                    {time.reachScore.toFixed(1)}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: designTokens.colors.primary[700] }}>
                                    Reach
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>

                            {/* AI Recommendation */}
                            <Box sx={{ 
                              p: 2, 
                              background: designTokens.colors.ai[50], 
                              borderRadius: designTokens.borderRadius.md,
                              border: `1px solid ${designTokens.colors.ai[200]}`
                            }}>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: designTokens.colors.ai[700],
                                  fontSize: '0.875rem'
                                }}
                              >
                                {time.aiRecommendation}
                              </Typography>
                            </Box>

                            {/* Action Button */}
                            <Button
                              variant="outlined"
                              fullWidth
                              sx={{ mt: 2 }}
                              startIcon={<Schedule />}
                            >
                              Schedule for This Time
                            </Button>
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
                  Automated Scheduling Rules
                </Typography>
                
                <Grid container spacing={3}>
                  {schedulingRules.map((rule, index) => (
                    <Grid item xs={12} md={6} key={index} component="div">
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
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                              <Typography 
                                variant="h6" 
                                sx={{ 
                                  fontWeight: designTokens.typography.fontWeight.semibold,
                                  color: designTokens.colors.neutral[800]
                                }}
                              >
                                {rule.name}
                              </Typography>
                              
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Switch
                                  checked={rule.enabled}
                                  onChange={() => toggleRuleStatus(rule.id)}
                                  size="small"
                                />
                                <IconButton 
                                  size="small" 
                                  onClick={() => setSelectedRule(rule)}
                                >
                                  <Edit />
                                </IconButton>
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleDeleteRule(rule.id)}
                                  sx={{ color: designTokens.colors.error[500] }}
                                >
                                  <Delete />
                                </IconButton>
                              </Box>
                            </Box>

                            {/* Description */}
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: designTokens.colors.neutral[600],
                                mb: 2
                              }}
                            >
                              {rule.description}
                            </Typography>

                            {/* Details */}
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                              <Grid item xs={6} component="div">
                                <Typography variant="caption" sx={{ color: designTokens.colors.neutral[500] }}>
                                  Platforms
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                                  {rule.platforms.map((platform) => (
                                    <Chip
                                      key={platform}
                                      label={platform}
                                      size="small"
                                      sx={{
                                        background: designTokens.colors.primary[100],
                                        color: designTokens.colors.primary[700],
                                        fontSize: '0.6rem'
                                      }}
                                    />
                                  ))}
                                </Box>
                              </Grid>
                              
                              <Grid item xs={6} component="div">
                                <Typography variant="caption" sx={{ color: designTokens.colors.neutral[500] }}>
                                  Frequency
                                </Typography>
                                <Typography variant="body2" sx={{ color: designTokens.colors.neutral[700], mt: 0.5 }}>
                                  {rule.frequency}
                                </Typography>
                              </Grid>
                            </Grid>

                            {/* Performance & Status */}
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="caption" sx={{ color: designTokens.colors.neutral[500] }}>
                                  Performance:
                                </Typography>
                                <Chip
                                  label={getPerformanceLabel(rule.performance)}
                                  size="small"
                                  sx={{
                                    background: `${getPerformanceColor(rule.performance)}15`,
                                    color: getPerformanceColor(rule.performance),
                                    fontSize: '0.6rem'
                                  }}
                                />
                              </Box>
                              
                              <Typography variant="caption" sx={{ color: designTokens.colors.neutral[500] }}>
                                Next: {rule.nextRun.toLocaleDateString()}
                              </Typography>
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

          {activeTab === 2 && (
            <Fade in={true}>
              <Box>
                <Typography variant="h6" sx={{ mb: 3, color: designTokens.colors.neutral[800] }}>
                  Scheduled Content
                </Typography>
                
                <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${designTokens.colors.neutral[200]}` }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Content</TableCell>
                        <TableCell>Platforms</TableCell>
                        <TableCell>Scheduled Time</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Performance</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {scheduledContent.map((content) => (
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
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              {content.platforms.map((platform) => (
                                <Chip
                                  key={platform}
                                  label={platform}
                                  size="small"
                                  sx={{
                                    background: designTokens.colors.primary[100],
                                    color: designTokens.colors.primary[700],
                                    fontSize: '0.6rem'
                                  }}
                                />
                              ))}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {content.scheduledTime.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {getStatusIcon(content.status)}
                              <Chip
                                label={content.status}
                                size="small"
                                sx={{
                                  background: `${getStatusColor(content.status)}15`,
                                  color: getStatusColor(content.status),
                                  fontSize: '0.6rem'
                                }}
                              />
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2">
                                {content.performancePrediction}/10
                              </Typography>
                              {content.aiOptimized && (
                                <AutoAwesome sx={{ fontSize: 16, color: designTokens.colors.ai[500] }} />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <IconButton size="small">
                                <Edit />
                              </IconButton>
                              <IconButton size="small">
                                <Delete />
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

          {activeTab === 3 && (
            <Fade in={true}>
              <Box>
                <Typography variant="h6" sx={{ mb: 3, color: designTokens.colors.neutral[800] }}>
                  Audience Activity Analysis
                </Typography>
                
                <Grid container spacing={3}>
                  {audienceActivity.map((activity, index) => (
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
                                  color: designTokens.colors.neutral[800]
                                }}
                              >
                                {activity.platform}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: designTokens.colors.neutral[600]
                                }}
                              >
                                {activity.day} at {activity.time}
                              </Typography>
                            </Box>

                            {/* Activity Level */}
                            <Box sx={{ mb: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" sx={{ color: designTokens.colors.neutral[700] }}>
                                  Activity Level
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                  {activity.activityLevel}/10
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={activity.activityLevel * 10}
                                sx={{
                                  height: 8,
                                  borderRadius: 4,
                                  background: designTokens.colors.neutral[200],
                                  '& .MuiLinearProgress-bar': {
                                    background: designTokens.colors.success[500]
                                  }
                                }}
                              />
                            </Box>

                            {/* Engagement Rate */}
                            <Box sx={{ mb: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" sx={{ color: designTokens.colors.neutral[700] }}>
                                  Engagement Rate
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                  {activity.engagementRate}%
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={activity.engagementRate}
                                sx={{
                                  height: 8,
                                  borderRadius: 4,
                                  background: designTokens.colors.neutral[200],
                                  '& .MuiLinearProgress-bar': {
                                    background: designTokens.colors.primary[500]
                                  }
                                }}
                              />
                            </Box>

                            {/* Best Content Types */}
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" sx={{ color: designTokens.colors.neutral[700], mb: 1 }}>
                                Best Content Types
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                {activity.bestContentTypes.map((type) => (
                                  <Chip
                                    key={type}
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

                            {/* Trending Topics */}
                            <Box>
                              <Typography variant="body2" sx={{ color: designTokens.colors.neutral[700], mb: 1 }}>
                                Trending Topics
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                {activity.trendingTopics.map((topic) => (
                                  <Chip
                                    key={topic}
                                    label={topic}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                      borderColor: designTokens.colors.warning[300],
                                      color: designTokens.colors.warning[600],
                                      fontSize: '0.6rem'
                                    }}
                                  />
                                ))}
                              </Box>
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
