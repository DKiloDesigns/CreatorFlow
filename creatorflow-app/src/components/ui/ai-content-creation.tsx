"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
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
  Tabs,
  Tab
} from '@mui/material';
import {
  AutoAwesome,
  Psychology,
  TrendingUp,
  ContentCopy,
  Schedule,
  Analytics,
  Settings,
  Refresh,
  CheckCircle,
  Warning,
  Info,
  Lightbulb,
  Add,
  Edit,
  Delete,
  Visibility,
  ThumbUp,
  Share,
  Message,
  CalendarToday,
  AccessTime,
  TrendingFlat,
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
  Image,
  VideoFile,
  Description,
  Tag,
  Event,
  Public,
  Lock,
  Group,
  Person,
  TrendingDown,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { designTokens } from '@/lib/design-system';

// Content type interface
interface ContentType {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  aiOptimization: boolean;
  proFeature: boolean;
}

// Platform interface
interface Platform {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  audience: string;
  bestTimes: string[];
  contentType: string[];
  aiOptimization: boolean;
}

// AI insight interface
interface ContentInsight {
  type: 'success' | 'warning' | 'info' | 'tip';
  message: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  action?: string;
  category: 'timing' | 'content' | 'audience' | 'trending';
}

// Performance prediction interface
interface PerformancePrediction {
  engagement: number;
  reach: number;
  shares: number;
  comments: number;
  viralPotential: number;
  audienceMatch: number;
  contentQuality: number;
  trendingRelevance: number;
  recommendations: string[];
}

// Content draft interface
interface ContentDraft {
  id: string;
  text: string;
  media?: string[];
  platforms: string[];
  scheduledTime?: Date;
  aiOptimized: boolean;
  performancePrediction?: PerformancePrediction;
  insights: ContentInsight[];
  status: 'draft' | 'optimizing' | 'ready' | 'scheduled' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

interface AIContentCreationProps {
  onSave?: (draft: ContentDraft) => void;
  onSchedule?: (draft: ContentDraft) => void;
  onPublish?: (draft: ContentDraft) => void;
  loading?: boolean;
  error?: string | null;
  className?: string;
}

export default function AIContentCreation({
  onSave,
  onSchedule,
  onPublish,
  loading = false,
  error = null,
  className
}: AIContentCreationProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [contentText, setContentText] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedContentType, setSelectedContentType] = useState<string>('');
  const [targetAudience, setTargetAudience] = useState<string>('');
  const [scheduledTime, setScheduledTime] = useState<Date | null>(null);
  const [aiOptimization, setAiOptimization] = useState(true);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [performancePrediction, setPerformancePrediction] = useState<PerformancePrediction | null>(null);
  const [insights, setInsights] = useState<ContentInsight[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [drafts, setDrafts] = useState<ContentDraft[]>([]);
  const [selectedDraft, setSelectedDraft] = useState<ContentDraft | null>(null);

  // Mock data for content types
  const contentTypes: ContentType[] = [
    {
      id: 'post',
      name: 'Social Post',
      icon: ContentCopy,
      description: 'Standard social media post with text and media',
      aiOptimization: true,
      proFeature: false
    },
    {
      id: 'story',
      name: 'Story/Reel',
      icon: VideoFile,
      description: 'Ephemeral content for Instagram, Snapchat',
      aiOptimization: true,
      proFeature: false
    },
    {
      id: 'article',
      name: 'Article/Blog',
      icon: Description,
      description: 'Long-form content with detailed information',
      aiOptimization: true,
      proFeature: true
    },
    {
      id: 'video',
      name: 'Video Content',
      icon: VideoFile,
      description: 'Video posts for YouTube, TikTok, Instagram',
      aiOptimization: true,
      proFeature: true
    }
  ];

  // Mock data for platforms
  const platforms: Platform[] = [
    {
      id: 'instagram',
      name: 'Instagram',
      icon: ContentCopy,
      color: '#E4405F',
      audience: 'Visual content lovers, 18-34 age group',
      bestTimes: ['2:00 PM', '7:00 PM', '9:00 PM'],
      contentType: ['post', 'story', 'reel'],
      aiOptimization: true
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: ContentCopy,
      color: '#1DA1F2',
      audience: 'News followers, professionals, 25-49 age group',
      bestTimes: ['8:00 AM', '12:00 PM', '5:00 PM'],
      contentType: ['post', 'article'],
      aiOptimization: true
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: VideoFile,
      color: '#000000',
      audience: 'Gen Z, creative content consumers, 13-29 age group',
      bestTimes: ['6:00 PM', '8:00 PM', '10:00 PM'],
      contentType: ['video', 'story'],
      aiOptimization: true
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: ContentCopy,
      color: '#0A66C2',
      audience: 'Professionals, B2B, 25-54 age group',
      bestTimes: ['9:00 AM', '12:00 PM', '2:00 PM'],
      contentType: ['post', 'article'],
      aiOptimization: true
    }
  ];

  // Mock data for target audiences
  const targetAudiences = [
    'Gen Z (13-24)',
    'Millennials (25-40)',
    'Gen X (41-56)',
    'Boomers (57-75)',
    'Professionals',
    'Students',
    'Entrepreneurs',
    'Creators',
    'Business Owners',
    'General Audience'
  ];

  // AI optimization simulation
  const simulateAIOptimization = async () => {
    setIsOptimizing(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock performance prediction
    const prediction: PerformancePrediction = {
      engagement: Math.floor(Math.random() * 8) + 2, // 2-10%
      reach: Math.floor(Math.random() * 50000) + 10000, // 10K-60K
      shares: Math.floor(Math.random() * 200) + 50, // 50-250
      comments: Math.floor(Math.random() * 100) + 20, // 20-120
      viralPotential: Math.floor(Math.random() * 40) + 60, // 60-100%
      audienceMatch: Math.floor(Math.random() * 30) + 70, // 70-100%
      contentQuality: Math.floor(Math.random() * 25) + 75, // 75-100%
      trendingRelevance: Math.floor(Math.random() * 35) + 65, // 65-100%
      recommendations: [
        'Add trending hashtags to increase discoverability',
        'Post during peak hours (2-4 PM) for maximum engagement',
        'Include a question to encourage comments',
        'Use emojis to make content more engaging',
        'Consider adding video content for higher reach'
      ]
    };
    
    // Generate mock insights
    const mockInsights: ContentInsight[] = [
      {
        type: 'success',
        message: 'Your content matches trending topics perfectly',
        impact: 'high',
        confidence: 89,
        category: 'trending'
      },
      {
        type: 'tip',
        message: 'Posts with questions get 40% more engagement',
        impact: 'medium',
        confidence: 76,
        category: 'content'
      },
      {
        type: 'warning',
        message: 'Consider posting during peak hours for better reach',
        impact: 'medium',
        confidence: 68,
        category: 'timing'
      }
    ];
    
    setPerformancePrediction(prediction);
    setInsights(mockInsights);
    setIsOptimizing(false);
  };

  // Handle platform selection
  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  // Handle content type selection
  const handleContentTypeChange = (contentTypeId: string) => {
    setSelectedContentType(contentTypeId);
  };

  // Handle target audience selection
  const handleAudienceChange = (audience: string) => {
    setTargetAudience(audience);
  };

  // Save draft
  const handleSaveDraft = () => {
    if (!contentText.trim()) return;
    
    const draft: ContentDraft = {
      id: Date.now().toString(),
      text: contentText,
      platforms: selectedPlatforms,
      aiOptimized: aiOptimization && performancePrediction !== null,
      performancePrediction: performancePrediction || undefined,
      insights: insights,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setDrafts(prev => [draft, ...prev]);
    setContentText('');
    setSelectedPlatforms([]);
    setPerformancePrediction(null);
    setInsights([]);
    
    if (onSave) {
      onSave(draft);
    }
  };

  // Schedule content
  const handleSchedule = () => {
    if (!contentText.trim() || selectedPlatforms.length === 0) return;
    
    const draft: ContentDraft = {
      id: Date.now().toString(),
      text: contentText,
      platforms: selectedPlatforms,
      scheduledTime: scheduledTime || undefined,
      aiOptimized: aiOptimization && performancePrediction !== null,
      performancePrediction: performancePrediction || undefined,
      insights: insights,
      status: 'scheduled',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    if (onSchedule) {
      onSchedule(draft);
    }
  };

  // Publish immediately
  const handlePublish = () => {
    if (!contentText.trim() || selectedPlatforms.length === 0) return;
    
    const draft: ContentDraft = {
      id: Date.now().toString(),
      text: contentText,
      platforms: selectedPlatforms,
      aiOptimized: aiOptimization && performancePrediction !== null,
      performancePrediction: performancePrediction || undefined,
      insights: insights,
      status: 'published',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    if (onPublish) {
      onPublish(draft);
    }
  };

  // Get insight icon
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle fontSize="small" />;
      case 'warning':
        return <Warning fontSize="small" />;
      case 'info':
        return <Info fontSize="small" />;
      case 'tip':
        return <Lightbulb fontSize="small" />;
      default:
        return <Info fontSize="small" />;
    }
  };

  // Get insight color
  const getInsightColor = (type: string) => {
    switch (type) {
      case 'success':
        return designTokens.colors.success[500];
      case 'warning':
        return designTokens.colors.warning[500];
      case 'info':
        return designTokens.colors.info[500];
      case 'tip':
        return designTokens.colors.ai[500];
      default:
        return designTokens.colors.info[500];
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

      {/* Main Content Creation Interface */}
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: `${designTokens.colors.ai[500]}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: designTokens.colors.ai[600]
              }}
            >
              <Psychology sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: designTokens.typography.fontWeight.bold,
                  color: designTokens.colors.neutral[800]
                }}
              >
                AI-Enhanced Content Creation
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: designTokens.colors.neutral[600]
                }}
              >
                Create, optimize, and schedule content with AI assistance
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Content Creation Form */}
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Left Column - Content Input */}
            <Grid item xs={12} lg={8}>
              {/* Content Type Selection */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, color: designTokens.colors.neutral[800] }}>
                  Content Type
                </Typography>
                <Grid container spacing={2}>
                  {contentTypes.map((type) => (
                    <Grid item xs={12} sm={6} key={type.id} component="div">
                      <Card
                        elevation={0}
                        sx={{
                          border: `2px solid ${selectedContentType === type.id ? designTokens.colors.primary[500] : designTokens.colors.neutral[200]}`,
                          borderRadius: designTokens.borderRadius.lg,
                          cursor: 'pointer',
                          transition: designTokens.animation.micro.cardHover,
                          '&:hover': {
                            borderColor: designTokens.colors.primary[400],
                            boxShadow: designTokens.shadows.sm
                          }
                        }}
                        onClick={() => handleContentTypeChange(type.id)}
                      >
                        <CardContent sx={{ p: 2, textAlign: 'center' }}>
                          <Box sx={{ mb: 1 }}>
                            <type.icon sx={{ 
                              fontSize: 32, 
                              color: selectedContentType === type.id ? designTokens.colors.primary[500] : designTokens.colors.neutral[600]
                            }} />
                          </Box>
                          <Typography 
                            variant="subtitle2" 
                            sx={{ 
                              fontWeight: designTokens.typography.fontWeight.medium,
                              color: selectedContentType === type.id ? designTokens.colors.primary[600] : designTokens.colors.neutral[800]
                            }}
                          >
                            {type.name}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: designTokens.colors.neutral[600],
                              fontSize: '0.7rem'
                            }}
                          >
                            {type.description}
                          </Typography>
                          {type.aiOptimization && (
                            <Chip
                              label="AI Optimized"
                              size="small"
                              icon={<AutoAwesome />}
                              sx={{
                                mt: 1,
                                background: designTokens.colors.ai[100],
                                color: designTokens.colors.ai[700],
                                fontSize: '0.6rem'
                              }}
                            />
                          )}
                          {type.proFeature && (
                            <Chip
                              label="PRO"
                              size="small"
                              sx={{
                                mt: 1,
                                background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                                color: 'white',
                                fontSize: '0.6rem',
                                fontWeight: designTokens.typography.fontWeight.bold
                              }}
                            />
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Content Text Input */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, color: designTokens.colors.neutral[800] }}>
                  Content
                </Typography>
                <TextField
                  multiline
                  rows={6}
                  fullWidth
                  value={contentText}
                  onChange={(e) => setContentText(e.target.value)}
                  placeholder="Write your content here... AI will help optimize it for maximum engagement!"
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: designTokens.borderRadius.lg,
                      fontSize: '1rem',
                      lineHeight: 1.6
                    }
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                  <Typography variant="caption" sx={{ color: designTokens.colors.neutral[500] }}>
                    {contentText.length}/280 characters
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small">
                      <Image />
                    </IconButton>
                    <IconButton size="small">
                      <VideoFile />
                    </IconButton>
                    <IconButton size="small">
                      <Tag />
                    </IconButton>
                  </Box>
                </Box>
              </Box>

              {/* Platform Selection */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, color: designTokens.colors.neutral[800] }}>
                  Platforms
                </Typography>
                <Grid container spacing={2}>
                  {platforms.map((platform) => (
                    <Grid item xs={12} sm={6} key={platform.id}>
                      <Card
                        elevation={0}
                        sx={{
                          border: `2px solid ${selectedPlatforms.includes(platform.id) ? platform.color : designTokens.colors.neutral[200]}`,
                          borderRadius: designTokens.borderRadius.lg,
                          cursor: 'pointer',
                          transition: designTokens.animation.micro.cardHover,
                          '&:hover': {
                            borderColor: platform.color,
                            boxShadow: designTokens.shadows.sm
                          }
                        }}
                        onClick={() => handlePlatformToggle(platform.id)}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                background: `${platform.color}15`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: platform.color
                              }}
                            >
                              <platform.icon sx={{ fontSize: 20 }} />
                            </Box>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography 
                                variant="subtitle2" 
                                sx={{ 
                                  fontWeight: designTokens.typography.fontWeight.medium,
                                  color: selectedPlatforms.includes(platform.id) ? platform.color : designTokens.colors.neutral[800]
                                }}
                              >
                                {platform.name}
                              </Typography>
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  color: designTokens.colors.neutral[600],
                                  fontSize: '0.7rem'
                                }}
                              >
                                {platform.audience}
                              </Typography>
                            </Box>
                            {selectedPlatforms.includes(platform.id) && (
                              <CheckCircle sx={{ color: platform.color }} />
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Target Audience */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, color: designTokens.colors.neutral[800] }}>
                  Target Audience
                </Typography>
                <FormControl fullWidth>
                  <InputLabel>Select Target Audience</InputLabel>
                  <Select
                    value={targetAudience}
                    onChange={(e) => handleAudienceChange(e.target.value)}
                    label="Select Target Audience"
                  >
                    {targetAudiences.map((audience) => (
                      <MenuItem key={audience} value={audience}>
                        {audience}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* AI Optimization Toggle */}
              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={aiOptimization}
                      onChange={(e) => setAiOptimization(e.target.checked)}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AutoAwesome sx={{ color: designTokens.colors.ai[500] }} />
                      <Typography variant="subtitle2">
                        Enable AI Optimization
                      </Typography>
                    </Box>
                  }
                />
                <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], ml: 4 }}>
                  AI will analyze your content and provide optimization recommendations for better performance
                </Typography>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleSaveDraft}
                  startIcon={<Save />}
                  disabled={!contentText.trim()}
                >
                  Save Draft
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleSchedule}
                  startIcon={<Schedule />}
                  disabled={!contentText.trim() || selectedPlatforms.length === 0}
                >
                  Schedule
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handlePublish}
                  startIcon={<Send />}
                  disabled={!contentText.trim() || selectedPlatforms.length === 0}
                  sx={{
                    background: designTokens.colors.primary[500],
                    '&:hover': {
                      background: designTokens.colors.primary[600]
                    }
                  }}
                >
                  Publish Now
                </Button>
              </Box>
            </Grid>

            {/* Right Column - AI Insights & Optimization */}
            <Grid item xs={12} lg={4} component="div">
              {/* AI Optimization Panel */}
              {aiOptimization && (
                <Box sx={{ mb: 3 }}>
                  <Card
                    elevation={0}
                    sx={{
                      background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
                      border: `1px solid ${designTokens.colors.ai[200]}`,
                      borderRadius: designTokens.borderRadius.xl
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Psychology sx={{ color: designTokens.colors.ai[600] }} />
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: designTokens.typography.fontWeight.semibold,
                            color: designTokens.colors.neutral[800]
                          }}
                        >
                          AI Optimization
                        </Typography>
                      </Box>
                      
                      {!performancePrediction ? (
                        <Box sx={{ textAlign: 'center', py: 3 }}>
                          <Typography variant="body2" sx={{ mb: 2, color: designTokens.colors.neutral[600] }}>
                            Click optimize to get AI-powered insights and performance predictions
                          </Typography>
                          <Button
                            variant="contained"
                            onClick={simulateAIOptimization}
                            disabled={!contentText.trim() || isOptimizing}
                            startIcon={isOptimizing ? <CircularProgress size={16} /> : <AutoAwesome />}
                            sx={{
                              background: designTokens.colors.ai[500],
                              '&:hover': {
                                background: designTokens.colors.ai[600]
                              }
                            }}
                          >
                            {isOptimizing ? 'Optimizing...' : 'Optimize with AI'}
                          </Button>
                        </Box>
                      ) : (
                        <Box>
                          {/* Performance Prediction */}
                          <Typography variant="subtitle2" sx={{ mb: 2, color: designTokens.colors.neutral[800] }}>
                            Performance Prediction
                          </Typography>
                          
                          <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid item xs={6}>
                              <Box sx={{ textAlign: 'center', p: 2, background: 'white', borderRadius: designTokens.borderRadius.md }}>
                                <Typography variant="h4" sx={{ color: designTokens.colors.success[600], fontWeight: 'bold' }}>
                                  {performancePrediction.engagement}%
                                </Typography>
                                <Typography variant="caption" sx={{ color: designTokens.colors.neutral[600] }}>
                                  Engagement Rate
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6}>
                              <Box sx={{ textAlign: 'center', p: 2, background: 'white', borderRadius: designTokens.borderRadius.md }}>
                                <Typography variant="h4" sx={{ color: designTokens.colors.primary[600], fontWeight: 'bold' }}>
                                  {performancePrediction.reach.toLocaleString()}
                                </Typography>
                                <Typography variant="caption" sx={{ color: designTokens.colors.neutral[600] }}>
                                  Estimated Reach
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>

                          {/* AI Insights */}
                          <Typography variant="subtitle2" sx={{ mb: 2, color: designTokens.colors.neutral[800] }}>
                            AI Insights
                          </Typography>
                          
                          <Stack spacing={2}>
                            {insights.map((insight, index) => (
                              <Box
                                key={index}
                                sx={{
                                  p: 2,
                                  background: 'white',
                                  borderRadius: designTokens.borderRadius.md,
                                  border: `1px solid ${designTokens.colors.neutral[200]}`
                                }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                  <Box
                                    sx={{
                                      color: getInsightColor(insight.type),
                                      display: 'flex',
                                      alignItems: 'center',
                                      mt: 0.5
                                    }}
                                  >
                                    {getInsightIcon(insight.type)}
                                  </Box>
                                  
                                  <Box sx={{ flexGrow: 1 }}>
                                    <Typography 
                                      variant="body2" 
                                      sx={{ 
                                        color: designTokens.colors.neutral[800],
                                        mb: 1
                                      }}
                                    >
                                      {insight.message}
                                    </Typography>
                                    
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                      <Chip
                                        label={insight.impact}
                                        size="small"
                                        sx={{
                                          background: `${getImpactColor(insight.impact)}15`,
                                          color: getImpactColor(insight.impact),
                                          fontSize: '0.6rem'
                                        }}
                                      />
                                      <Typography 
                                        variant="caption" 
                                        sx={{ 
                                          color: designTokens.colors.neutral[500]
                                        }}
                                      >
                                        {insight.confidence}% confidence
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Box>
                              </Box>
                            ))}
                          </Stack>

                          {/* Recommendations */}
                          <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle2" sx={{ mb: 2, color: designTokens.colors.neutral[800] }}>
                              Recommendations
                            </Typography>
                            <List dense>
                              {performancePrediction.recommendations.map((rec, index) => (
                                <ListItem key={index} sx={{ px: 0 }}>
                                  <ListItemIcon sx={{ minWidth: 32 }}>
                                    <Lightbulb sx={{ fontSize: 16, color: designTokens.colors.ai[500] }} />
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
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Box>
              )}

              {/* Recent Drafts */}
              <Box>
                <Typography variant="h6" sx={{ mb: 2, color: designTokens.colors.neutral[800] }}>
                  Recent Drafts
                </Typography>
                
                {drafts.length === 0 ? (
                  <Card
                    elevation={0}
                    sx={{
                      background: designTokens.colors.neutral[50],
                      border: `1px solid ${designTokens.colors.neutral[200]}`,
                      borderRadius: designTokens.borderRadius.lg,
                      p: 3,
                      textAlign: 'center'
                    }}
                  >
                    <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                      No drafts yet. Create your first piece of content!
                    </Typography>
                  </Card>
                ) : (
                  <Stack spacing={2}>
                    {drafts.slice(0, 3).map((draft) => (
                      <Card
                        key={draft.id}
                        elevation={0}
                        sx={{
                          border: `1px solid ${designTokens.colors.neutral[200]}`,
                          borderRadius: designTokens.borderRadius.lg,
                          cursor: 'pointer',
                          transition: designTokens.animation.micro.cardHover,
                          '&:hover': {
                            boxShadow: designTokens.shadows.sm
                          }
                        }}
                        onClick={() => setSelectedDraft(draft)}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: designTokens.colors.neutral[800],
                              mb: 1,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical'
                            }}
                          >
                            {draft.text}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            {draft.platforms.map((platform) => (
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
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="caption" sx={{ color: designTokens.colors.neutral[500] }}>
                              {draft.createdAt.toLocaleDateString()}
                            </Typography>
                            <Chip
                              label={draft.status}
                              size="small"
                              sx={{
                                background: draft.status === 'published' ? designTokens.colors.success[100] : 
                                           draft.status === 'scheduled' ? designTokens.colors.warning[100] :
                                           designTokens.colors.neutral[100],
                                color: draft.status === 'published' ? designTokens.colors.success[700] : 
                                       draft.status === 'scheduled' ? designTokens.colors.warning[700] :
                                       designTokens.colors.neutral[700],
                                fontSize: '0.6rem'
                              }}
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}
