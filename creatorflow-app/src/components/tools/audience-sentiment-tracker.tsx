"use client";

import React, { useState, useEffect } from 'react';
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
  Psychology,
  TrendingUp,
  TrendingDown,
  BarChart,
  PieChart,
  ShowChart,
  Timeline,
  Assessment,
  Insights,
  Speed,
  GpsFixed as Target,
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
  TrendingUp as TrendingUpIcon,
  AutoAwesome,
  Palette,
  Tune,
  Compare,
  Speed as SpeedIcon,
  EmojiEmotions,
  RecordVoiceOver,
  TextFields,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatQuote,
  FormatListBulleted,
  FormatListNumbered,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
  Transform,
  AutoFixHigh,
  ContentCut,
  ContentPaste,
  ContentPasteGo,
  ContentPasteOff,
  ContentPasteSearch,
  ContentPasteOutlined,
  ContentCopy as ContentCopyIcon,
  Download,
  Upload,
  CloudUpload,
  CloudDownload,
  CloudSync,
  CloudDone,
  CloudOff,
  CloudQueue,
  CloudCircle,
  Cloud,
  CloudDoneOutlined,
  CloudOffOutlined,
  CloudQueueOutlined,
  CloudCircleOutlined,
  CloudOutlined,
  FilterList,
  Sort,
  Refresh,
  GetApp,
  FileDownload,
  PictureAsPdf,
  TableChart,
  DonutLarge,
  TrendingFlat as TrendingFlatIcon,
  DateRange,
  Today,
  Tomorrow,
  NextWeek,
  NextMonth,
  Schedule as ScheduleIcon,
  Notifications,
  NotificationsActive,
  NotificationsOff,
  NotificationsNone,
  NotificationsPaused,
  NotificationsImportant,
  NotificationsImportantOutlined,
  NotificationsImportantRounded,
  NotificationsImportantTwoTone,
  NotificationsOutlined,
  NotificationsRounded,
  NotificationsTwoTone,
  NotificationsNoneOutlined,
  NotificationsNoneRounded,
  NotificationsNoneTwoTone,
  NotificationsOffOutlined,
  NotificationsOffRounded,
  NotificationsOffTwoTone,
  NotificationsPausedOutlined,
  NotificationsPausedRounded,
  NotificationsPausedTwoTone,
  NotificationsActiveOutlined,
  NotificationsActiveRounded,
  NotificationsActiveTwoTone,
  Dashboard,
  DashboardCustomize,
  DashboardOutlined,
  DashboardRounded,
  DashboardTwoTone,
  ViewInAr,
  ViewInArOutlined,
  ViewInArRounded,
  ViewInArTwoTone,
  ViewModule,
  ViewModuleOutlined,
  ViewModuleRounded,
  ViewModuleTwoTone,
  ViewQuilt,
  ViewQuiltOutlined,
  ViewQuiltRounded,
  ViewQuiltTwoTone,
  ViewSidebar,
  ViewSidebarOutlined,
  ViewSidebarRounded,
  ViewSidebarTwoTone,
  ViewStream,
  ViewStreamOutlined,
  ViewStreamRounded,
  ViewStreamTwoTone,
  ViewWeek,
  ViewWeekOutlined,
  ViewWeekRounded,
  ViewWeekTwoTone,
  Visibility,
  VisibilityOff,
  VisibilityOutlined,
  VisibilityRounded,
  VisibilityTwoTone,
  VisibilityOffOutlined,
  VisibilityOffRounded,
  VisibilityOffTwoTone,
  VpnKey,
  VpnKeyOutlined,
  VpnKeyRounded,
  VpnKeyTwoTone,
  VpnLock,
  VpnLockOutlined,
  VpnLockRounded,
  VpnLockTwoTone,
  Warning,
  WarningAmber,
  WarningAmberOutlined,
  WarningAmberRounded,
  WarningAmberTwoTone,
  WarningOutlined,
  WarningRounded,
  WarningTwoTone,
  Watch,
  WatchLater,
  WatchLaterOutlined,
  WatchLaterRounded,
  WatchLaterTwoTone,
  WatchOutlined,
  WatchRounded,
  WatchTwoTone,
  Water,
  WaterDrop,
  WaterDropOutlined,
  WaterDropRounded,
  WaterDropTwoTone,
  WaterOutlined,
  WaterRounded,
  WaterTwoTone,
  WbSunny,
  WbSunnyOutlined,
  WbSunnyRounded,
  WbSunnyTwoTone,
  Wc,
  WcOutlined,
  WcRounded,
  WcTwoTone,
  Web,
  WebAsset,
  WebAssetOutlined,
  WebAssetRounded,
  WebAssetTwoTone,
  WebOutlined,
  WebRounded,
  WebTwoTone,
  Weekend,
  WeekendOutlined,
  WeekendRounded,
  WeekendTwoTone,
  West,
  WestOutlined,
  WestRounded,
  WestTwoTone,
  Whatshot,
  WhatshotOutlined,
  WhatshotRounded,
  WhatshotTwoTone,
  WheelchairPickup,
  WheelchairPickupOutlined,
  WheelchairPickupRounded,
  WheelchairPickupTwoTone,
  WhereToVote,
  WhereToVoteOutlined,
  WhereToVoteRounded,
  WhereToVoteTwoTone,
  Widgets,
  WidgetsOutlined,
  WidgetsRounded,
  WidgetsTwoTone,
  Wifi,
  WifiOff,
  WifiOffOutlined,
  WifiOffRounded,
  WifiOffTwoTone,
  WifiOutlined,
  WifiRounded,
  WifiTwoTone,
  Window,
  WindowOutlined,
  WindowRounded,
  WindowTwoTone,
  WineBar,
  WineBarOutlined,
  WineBarRounded,
  WineBarTwoTone,
  Woman,
  WomanOutlined,
  WomanRounded,
  WomanTwoTone,
  Work,
  WorkOff,
  WorkOffOutlined,
  WorkOffRounded,
  WorkOffTwoTone,
  WorkOutline,
  WorkOutlineOutlined,
  WorkOutlineRounded,
  WorkOutlineTwoTone,
  WorkOutlined,
  WorkRounded,
  WorkTwoTone,
  WorkspacePremium,
  WorkspacePremiumOutlined,
  WorkspacePremiumRounded,
  WorkspacePremiumTwoTone,
  Wysiwyg,
  WysiwygOutlined,
  WysiwygRounded,
  WysiwygTwoTone,
  Yard,
  YardOutlined,
  YardRounded,
  YardTwoTone,
  YoutubeSearchedFor,
  YoutubeSearchedForOutlined,
  YoutubeSearchedForRounded,
  YoutubeSearchedForTwoTone,
  ZoomIn,
  ZoomInMap,
  ZoomInMapOutlined,
  ZoomInMapRounded,
  ZoomInMapTwoTone,
  ZoomInOutlined,
  ZoomInRounded,
  ZoomInTwoTone,
  ZoomOut,
  ZoomOutMap,
  ZoomOutMapOutlined,
  ZoomOutMapRounded,
  ZoomOutMapTwoTone,
  ZoomOutOutlined,
  ZoomOutRounded,
  ZoomOutTwoTone,
  Search
} from '@/lib/mui-optimized-imports';
import { designTokens } from '@/lib/design-system';

// Sentiment analysis interfaces
interface SentimentData {
  id: string;
  platform: string;
  content: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  emotions: string[];
  keywords: string[];
  author: string;
  timestamp: string;
  engagement: number;
  reach: number;
  impact: 'high' | 'medium' | 'low';
}

interface SentimentTrend {
  id: string;
  period: string;
  positive: number;
  negative: number;
  neutral: number;
  total: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

interface BrandMention {
  id: string;
  content: string;
  platform: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  author: string;
  timestamp: string;
  reach: number;
  engagement: number;
  keywords: string[];
  context: string;
}

interface CrisisAlert {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  platform: string;
  mentions: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  timestamp: string;
  status: 'active' | 'resolved' | 'monitoring';
  actionRequired: boolean;
}

interface AudienceSentimentTrackerProps {
  onSave?: (data: any) => void;
  onExport?: (data: any) => void;
  loading?: boolean;
  error?: string | null;
  className?: string;
}

export default function AudienceSentimentTracker({
  onSave,
  onExport,
  loading = false,
  error = null,
  className
}: AudienceSentimentTrackerProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
  const [sentimentTrends, setSentimentTrends] = useState<SentimentTrend[]>([]);
  const [brandMentions, setBrandMentions] = useState<BrandMention[]>([]);
  const [crisisAlerts, setCrisisAlerts] = useState<CrisisAlert[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock data for platforms
  const platforms = [
    { id: 'all', name: 'All Platforms', icon: '🌐' },
    { id: 'instagram', name: 'Instagram', icon: '📷' },
    { id: 'twitter', name: 'Twitter/X', icon: '🐦' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵' },
    { id: 'youtube', name: 'YouTube', icon: '📺' },
    { id: 'facebook', name: 'Facebook', icon: '📘' }
  ];

  // Mock data for timeframes
  const timeframes = [
    { id: '24h', name: 'Last 24 hours' },
    { id: '7d', name: 'Last 7 days' },
    { id: '30d', name: 'Last 30 days' },
    { id: '90d', name: 'Last 90 days' }
  ];

  // Mock data
  useEffect(() => {
    const mockSentimentData: SentimentData[] = [
      {
        id: '1',
        platform: 'instagram',
        content: 'Love this new product! The quality is amazing and the design is perfect. Highly recommend!',
        sentiment: 'positive',
        confidence: 92,
        emotions: ['joy', 'satisfaction', 'excitement'],
        keywords: ['love', 'amazing', 'perfect', 'recommend'],
        author: '@sarah_creator',
        timestamp: '2025-01-20T10:30:00Z',
        engagement: 45,
        reach: 1200,
        impact: 'high'
      },
      {
        id: '2',
        platform: 'twitter',
        content: 'Not impressed with the recent changes. The app is getting worse with each update.',
        sentiment: 'negative',
        confidence: 78,
        emotions: ['disappointment', 'frustration'],
        keywords: ['not impressed', 'worse', 'update'],
        author: '@tech_reviewer',
        timestamp: '2025-01-20T09:15:00Z',
        engagement: 23,
        reach: 800,
        impact: 'medium'
      },
      {
        id: '3',
        platform: 'youtube',
        content: 'The tutorial was helpful but could use more examples. Overall decent content.',
        sentiment: 'neutral',
        confidence: 65,
        emotions: ['neutral', 'slight satisfaction'],
        keywords: ['helpful', 'examples', 'decent'],
        author: 'LearningChannel',
        timestamp: '2025-01-20T08:45:00Z',
        engagement: 12,
        reach: 500,
        impact: 'low'
      }
    ];

    const mockSentimentTrends: SentimentTrend[] = [
      {
        id: '1',
        period: '2025-01-20',
        positive: 65,
        negative: 20,
        neutral: 15,
        total: 100,
        change: 5,
        trend: 'up'
      },
      {
        id: '2',
        period: '2025-01-19',
        positive: 60,
        negative: 25,
        neutral: 15,
        total: 100,
        change: -2,
        trend: 'down'
      },
      {
        id: '3',
        period: '2025-01-18',
        positive: 62,
        negative: 23,
        neutral: 15,
        total: 100,
        change: 3,
        trend: 'up'
      }
    ];

    const mockBrandMentions: BrandMention[] = [
      {
        id: '1',
        content: 'Just tried @floai.studio and it\'s a game changer for content creators!',
        platform: 'twitter',
        sentiment: 'positive',
        author: '@content_creator',
        timestamp: '2025-01-20T11:00:00Z',
        reach: 2500,
        engagement: 89,
        keywords: ['floai.studio', 'game changer', 'content creators'],
        context: 'Product recommendation'
      },
      {
        id: '2',
        content: 'The new features in floai.studio are confusing and hard to use.',
        platform: 'instagram',
        sentiment: 'negative',
        author: '@user_feedback',
        timestamp: '2025-01-20T10:30:00Z',
        reach: 1200,
        engagement: 34,
        keywords: ['floai.studio', 'confusing', 'hard to use'],
        context: 'Feature feedback'
      }
    ];

    const mockCrisisAlerts: CrisisAlert[] = [
      {
        id: '1',
        title: 'Negative Sentiment Spike',
        description: 'Negative mentions increased by 40% in the last 2 hours',
        severity: 'high',
        platform: 'twitter',
        mentions: 25,
        sentiment: 'negative',
        timestamp: '2025-01-20T12:00:00Z',
        status: 'active',
        actionRequired: true
      },
      {
        id: '2',
        title: 'Brand Mention Surge',
        description: 'Unusual spike in brand mentions detected',
        severity: 'medium',
        platform: 'instagram',
        mentions: 15,
        sentiment: 'positive',
        timestamp: '2025-01-20T11:30:00Z',
        status: 'monitoring',
        actionRequired: false
      }
    ];

    setSentimentData(mockSentimentData);
    setSentimentTrends(mockSentimentTrends);
    setBrandMentions(mockBrandMentions);
    setCrisisAlerts(mockCrisisAlerts);
  }, []);

  const handleAnalyze = async () => {
    if (!searchQuery.trim()) return;

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock analysis result
    const newSentiment: SentimentData = {
      id: Date.now().toString(),
      platform: selectedPlatform,
      content: searchQuery,
      sentiment: Math.random() > 0.5 ? 'positive' : 'negative',
      confidence: Math.floor(Math.random() * 30) + 70,
      emotions: ['joy', 'satisfaction'],
      keywords: [searchQuery, 'analysis'],
      author: '@analyzed_content',
      timestamp: new Date().toISOString(),
      engagement: Math.floor(Math.random() * 100),
      reach: Math.floor(Math.random() * 1000) + 500,
      impact: 'medium'
    };

    setSentimentData([newSentiment, ...sentimentData]);
    setIsAnalyzing(false);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'success';
      case 'negative':
        return 'error';
      case 'neutral':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return '😊';
      case 'negative':
        return '😞';
      case 'neutral':
        return '😐';
      default:
        return '😐';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'error';
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const filteredSentimentData = sentimentData.filter(data => {
    const matchesPlatform = selectedPlatform === 'all' || data.platform === selectedPlatform;
    return matchesPlatform;
  });

  return (
    <Box className={className} sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
        😊 Audience Sentiment Tracker
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
        Monitor audience emotions and brand sentiment across all platforms. 
        Get real-time insights, crisis alerts, and emotional analysis of your content.
      </Typography>

      <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
        <Tab label="Sentiment Analysis" icon={<Psychology />} />
        <Tab label="Brand Monitoring" icon={<Visibility />} />
        <Tab label="Crisis Alerts" icon={<Warning />} />
        <Tab label="Trends" icon={<TrendingUp />} />
      </Tabs>

      {activeTab === 0 && (
        <Box>
          {/* Search and Filters */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Analyze content or keywords"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Platform</InputLabel>
                    <Select
                      value={selectedPlatform}
                      onChange={(e) => setSelectedPlatform(e.target.value)}
                    >
                      {platforms.map((platform) => (
                        <MenuItem key={platform.id} value={platform.id}>
                          {platform.icon} {platform.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Timeframe</InputLabel>
                    <Select
                      value={selectedTimeframe}
                      onChange={(e) => setSelectedTimeframe(e.target.value)}
                    >
                      {timeframes.map((timeframe) => (
                        <MenuItem key={timeframe.id} value={timeframe.id}>
                          {timeframe.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <Button
                    variant="contained"
                    onClick={handleAnalyze}
                    disabled={!searchQuery.trim() || isAnalyzing}
                    startIcon={isAnalyzing ? <CircularProgress size={20} /> : <AutoAwesome />}
                    fullWidth
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Sentiment Data */}
          <Grid container spacing={3}>
            {filteredSentimentData.map((data) => (
              <Grid item xs={12} md={6} key={data.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="h4">
                          {getSentimentIcon(data.sentiment)}
                        </Typography>
                        <Box>
                          <Typography variant="h6">{data.author}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {platforms.find(p => p.id === data.platform)?.icon} {data.platform}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip 
                          label={data.sentiment} 
                          color={getSentimentColor(data.sentiment) as any} 
                          size="small"
                        />
                        <Chip 
                          label={data.impact} 
                          color={getImpactColor(data.impact) as any} 
                          size="small"
                        />
                      </Box>
                    </Box>

                    <Typography variant="body2" sx={{ mb: 2 }}>
                      "{data.content}"
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Confidence
                        </Typography>
                        <Typography variant="h6">
                          {data.confidence}%
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Engagement
                        </Typography>
                        <Typography variant="h6">
                          {data.engagement}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      {data.emotions.map((emotion, index) => (
                        <Chip key={index} label={emotion} size="small" />
                      ))}
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Keywords:</strong> {data.keywords.join(', ')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Reach:</strong> {data.reach.toLocaleString()} • <strong>Time:</strong> {new Date(data.timestamp).toLocaleString()}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <Button size="small" startIcon={<Reply />}>Respond</Button>
                      <Button size="small" startIcon={<Save />}>Save</Button>
                      <Button size="small" startIcon={<Share />}>Share</Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Brand Mentions & Monitoring
          </Typography>
          
          <Grid container spacing={3}>
            {brandMentions.map((mention) => (
              <Grid item xs={12} md={6} key={mention.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6">{mention.author}</Typography>
                      <Chip 
                        label={mention.sentiment} 
                        color={getSentimentColor(mention.sentiment) as any} 
                        size="small"
                      />
                    </Box>

                    <Typography variant="body2" sx={{ mb: 2 }}>
                      "{mention.content}"
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Reach
                        </Typography>
                        <Typography variant="h6">
                          {mention.reach.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Engagement
                        </Typography>
                        <Typography variant="h6">
                          {mention.engagement}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Context:</strong> {mention.context}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Keywords:</strong> {mention.keywords.join(', ')}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <Button size="small" startIcon={<Reply />}>Respond</Button>
                      <Button size="small" startIcon={<Save />}>Save</Button>
                      <Button size="small" startIcon={<Share />}>Share</Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {activeTab === 2 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Crisis Alerts & Monitoring
          </Typography>
          
          <Grid container spacing={3}>
            {crisisAlerts.map((alert) => (
              <Grid item xs={12} md={6} key={alert.id}>
                <Card sx={{ border: '2px solid', borderColor: getSeverityColor(alert.severity) === 'error' ? 'error.main' : 'warning.main' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6">{alert.title}</Typography>
                      <Chip 
                        label={alert.severity} 
                        color={getSeverityColor(alert.severity) as any} 
                        size="small"
                      />
                    </Box>

                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {alert.description}
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Mentions
                        </Typography>
                        <Typography variant="h6">
                          {alert.mentions}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Platform
                        </Typography>
                        <Typography variant="h6">
                          {alert.platform}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      <strong>Status:</strong> {alert.status} • <strong>Action Required:</strong> {alert.actionRequired ? 'Yes' : 'No'}
                    </Typography>

                    <Alert severity={alert.severity === 'critical' || alert.severity === 'high' ? 'error' : 'warning'} sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        <strong>Alert:</strong> {alert.actionRequired ? 'Immediate action required' : 'Monitor closely'}
                      </Typography>
                    </Alert>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button variant="contained" size="small" startIcon={<Reply />}>
                        Take Action
                      </Button>
                      <Button size="small" startIcon={<Save />}>Save</Button>
                      <Button size="small" startIcon={<Share />}>Share</Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {activeTab === 3 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Sentiment Trends & Analysis
          </Typography>
          
          <Grid container spacing={3}>
            {sentimentTrends.map((trend) => (
              <Grid item xs={12} md={4} key={trend.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      {new Date(trend.period).toLocaleDateString()}
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="success.main">
                          Positive
                        </Typography>
                        <Typography variant="h6">
                          {trend.positive}%
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="error.main">
                          Negative
                        </Typography>
                        <Typography variant="h6">
                          {trend.negative}%
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="warning.main">
                          Neutral
                        </Typography>
                        <Typography variant="h6">
                          {trend.neutral}%
                        </Typography>
                      </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Change: {trend.change > 0 ? '+' : ''}{trend.change}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total: {trend.total}
                      </Typography>
                    </Box>

                    <LinearProgress
                      variant="determinate"
                      value={trend.positive}
                      color="success"
                      sx={{ mb: 1 }}
                    />
                    <LinearProgress
                      variant="determinate"
                      value={trend.negative}
                      color="error"
                      sx={{ mb: 1 }}
                    />
                    <LinearProgress
                      variant="determinate"
                      value={trend.neutral}
                      color="warning"
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
}
