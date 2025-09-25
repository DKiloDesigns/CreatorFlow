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
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination
} from '@mui/material';
import {
  Analytics,
  TrendingUp,
  TrendingDown,
  BarChart,
  PieChart,
  ShowChart,
  Timeline,
  Assessment,
  Insights,
  Speed,
  Target,
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
  Search,
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
  ZoomOutTwoTone
} from '@/lib/mui-optimized-imports';
import { designTokens } from '@/lib/design-system';

// Advanced analytics interfaces
interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'stable';
  trend: 'up' | 'down' | 'flat';
  platform: string;
  period: string;
  target?: number;
  unit: string;
}

interface PlatformPerformance {
  platform: string;
  icon: string;
  followers: number;
  engagement: number;
  reach: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  growth: number;
  topContent: string;
  bestTime: string;
  audience: {
    age: { [key: string]: number };
    gender: { [key: string]: number };
    location: { [key: string]: number };
    interests: { [key: string]: number };
  };
}

interface ContentPerformance {
  id: string;
  title: string;
  platform: string;
  type: string;
  publishedAt: string;
  reach: number;
  impressions: number;
  engagement: number;
  clicks: number;
  shares: number;
  comments: number;
  likes: number;
  saves: number;
  conversionRate: number;
  revenue: number;
  score: number;
  hashtags: string[];
  mediaType: string;
}

interface AudienceInsight {
  id: string;
  type: 'demographic' | 'behavioral' | 'psychographic' | 'geographic';
  title: string;
  description: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
}

interface AdvancedAnalyticsDashboardProps {
  onSave?: (data: any) => void;
  onExport?: (data: any) => void;
  loading?: boolean;
  error?: string | null;
  className?: string;
}

export default function AdvancedAnalyticsDashboard({
  onSave,
  onExport,
  loading = false,
  error = null,
  className
}: AdvancedAnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [metrics, setMetrics] = useState<AnalyticsMetric[]>([]);
  const [platformPerformance, setPlatformPerformance] = useState<PlatformPerformance[]>([]);
  const [contentPerformance, setContentPerformance] = useState<ContentPerformance[]>([]);
  const [audienceInsights, setAudienceInsights] = useState<AudienceInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for timeframes
  const timeframes = [
    { id: '7d', name: 'Last 7 days' },
    { id: '30d', name: 'Last 30 days' },
    { id: '90d', name: 'Last 90 days' },
    { id: '1y', name: 'Last year' }
  ];

  // Mock data for platforms
  const platforms = [
    { id: 'all', name: 'All Platforms', icon: '🌐' },
    { id: 'instagram', name: 'Instagram', icon: '📷' },
    { id: 'twitter', name: 'Twitter/X', icon: '🐦' },
    { id: 'facebook', name: 'Facebook', icon: '📘' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵' }
  ];

  // Mock data
  useEffect(() => {
    const mockMetrics: AnalyticsMetric[] = [
      {
        id: '1',
        name: 'Total Reach',
        value: 1250000,
        change: 12.5,
        changeType: 'increase',
        trend: 'up',
        platform: 'all',
        period: '30d',
        target: 1500000,
        unit: 'people'
      },
      {
        id: '2',
        name: 'Engagement Rate',
        value: 6.8,
        change: 2.3,
        changeType: 'increase',
        trend: 'up',
        platform: 'all',
        period: '30d',
        target: 8.0,
        unit: '%'
      },
      {
        id: '3',
        name: 'Total Revenue',
        value: 15420,
        change: 18.7,
        changeType: 'increase',
        trend: 'up',
        platform: 'all',
        period: '30d',
        target: 20000,
        unit: '$'
      },
      {
        id: '4',
        name: 'Content Score',
        value: 87,
        change: 5.2,
        changeType: 'increase',
        trend: 'up',
        platform: 'all',
        period: '30d',
        target: 90,
        unit: '/100'
      }
    ];

    const mockPlatformPerformance: PlatformPerformance[] = [
      {
        platform: 'instagram',
        icon: '📷',
        followers: 125000,
        engagement: 7.2,
        reach: 450000,
        impressions: 680000,
        clicks: 12500,
        conversions: 450,
        revenue: 8500,
        growth: 15.2,
        topContent: 'Behind the scenes video',
        bestTime: 'Tuesday 2-4 PM',
        audience: {
          age: { '18-24': 35, '25-34': 40, '35-44': 20, '45+': 5 },
          gender: { 'Female': 65, 'Male': 35 },
          location: { 'US': 45, 'UK': 20, 'Canada': 15, 'Other': 20 },
          interests: { 'Fashion': 30, 'Tech': 25, 'Travel': 20, 'Food': 15, 'Other': 10 }
        }
      },
      {
        platform: 'twitter',
        icon: '🐦',
        followers: 89000,
        engagement: 4.8,
        reach: 320000,
        impressions: 450000,
        clicks: 8900,
        conversions: 280,
        revenue: 4200,
        growth: 8.7,
        topContent: 'Industry insights thread',
        bestTime: 'Wednesday 10-12 AM',
        audience: {
          age: { '18-24': 25, '25-34': 45, '35-44': 25, '45+': 5 },
          gender: { 'Female': 55, 'Male': 45 },
          location: { 'US': 50, 'UK': 15, 'Canada': 10, 'Other': 25 },
          interests: { 'Tech': 40, 'Business': 30, 'News': 20, 'Other': 10 }
        }
      },
      {
        platform: 'linkedin',
        icon: '💼',
        followers: 156000,
        engagement: 5.9,
        reach: 380000,
        impressions: 520000,
        clicks: 15200,
        conversions: 680,
        revenue: 2720,
        growth: 22.1,
        topContent: 'Professional article',
        bestTime: 'Thursday 8-10 AM',
        audience: {
          age: { '18-24': 10, '25-34': 35, '35-44': 40, '45+': 15 },
          gender: { 'Female': 45, 'Male': 55 },
          location: { 'US': 40, 'UK': 25, 'Canada': 20, 'Other': 15 },
          interests: { 'Business': 50, 'Tech': 30, 'Marketing': 15, 'Other': 5 }
        }
      }
    ];

    const mockContentPerformance: ContentPerformance[] = [
      {
        id: '1',
        title: 'Social Media Trends 2025',
        platform: 'instagram',
        type: 'post',
        publishedAt: '2025-01-20T09:00:00Z',
        reach: 125000,
        impressions: 180000,
        engagement: 8500,
        clicks: 1200,
        shares: 450,
        comments: 230,
        likes: 7800,
        saves: 890,
        conversionRate: 3.2,
        revenue: 450,
        score: 92,
        hashtags: ['#SocialMediaTrends', '#2025', '#Marketing'],
        mediaType: 'image'
      },
      {
        id: '2',
        title: 'Content Creation Tips Thread',
        platform: 'twitter',
        type: 'thread',
        publishedAt: '2025-01-19T14:30:00Z',
        reach: 89000,
        impressions: 120000,
        engagement: 4200,
        clicks: 890,
        shares: 320,
        comments: 180,
        likes: 3700,
        saves: 0,
        conversionRate: 2.8,
        revenue: 280,
        score: 87,
        hashtags: ['#ContentCreation', '#Tips'],
        mediaType: 'text'
      },
      {
        id: '3',
        title: 'LinkedIn Marketing Strategy',
        platform: 'linkedin',
        type: 'article',
        publishedAt: '2025-01-18T08:00:00Z',
        reach: 156000,
        impressions: 220000,
        engagement: 9200,
        clicks: 1800,
        shares: 680,
        comments: 450,
        likes: 8100,
        saves: 1200,
        conversionRate: 4.1,
        revenue: 680,
        score: 95,
        hashtags: ['#LinkedInMarketing', '#Strategy', '#B2B'],
        mediaType: 'text'
      }
    ];

    const mockAudienceInsights: AudienceInsight[] = [
      {
        id: '1',
        type: 'demographic',
        title: 'Age Distribution Shift',
        description: 'Your audience is getting younger with 18-24 age group growing 25%',
        value: 25,
        change: 25,
        trend: 'up',
        recommendation: 'Create more Gen Z focused content and use trending formats',
        priority: 'high'
      },
      {
        id: '2',
        type: 'behavioral',
        title: 'Video Content Preference',
        description: 'Video content receives 3x more engagement than static posts',
        value: 300,
        change: 150,
        trend: 'up',
        recommendation: 'Increase video content to 60% of your posts',
        priority: 'high'
      },
      {
        id: '3',
        type: 'psychographic',
        title: 'Sustainability Interest',
        description: 'Audience shows strong interest in sustainable and eco-friendly content',
        value: 78,
        change: 15,
        trend: 'up',
        recommendation: 'Incorporate sustainability themes into your content strategy',
        priority: 'medium'
      }
    ];

    setMetrics(mockMetrics);
    setPlatformPerformance(mockPlatformPerformance);
    setContentPerformance(mockContentPerformance);
    setAudienceInsights(mockAudienceInsights);
  }, []);

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return 'success';
      case 'decrease':
        return 'error';
      default:
        return 'default';
    }
  };

  const getChangeIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUpIcon sx={{ color: 'success.main' }} />;
      case 'down':
        return <TrendingDown sx={{ color: 'error.main' }} />;
      default:
        return <TrendingFlatIcon sx={{ color: 'text.secondary' }} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  return (
    <Box className={className} sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
        📊 Advanced Analytics Dashboard
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
        Comprehensive cross-platform analytics with AI-powered insights. 
        Track performance, understand your audience, and optimize your content strategy.
      </Typography>

      <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
        <Tab label="Overview" icon={<Dashboard />} />
        <Tab label="Platform Performance" icon={<BarChart />} />
        <Tab label="Content Analysis" icon={<Assessment />} />
        <Tab label="Audience Insights" icon={<Group />} />
      </Tabs>

      {activeTab === 0 && (
        <Box>
          {/* Filters */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
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
                  <Button
                    variant="contained"
                    startIcon={<Refresh />}
                    fullWidth
                  >
                    Refresh Data
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                    fullWidth
                  >
                    Export Report
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {metrics.map((metric) => (
              <Grid item xs={12} sm={6} md={3} key={metric.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" color="text.secondary">
                        {metric.name}
                      </Typography>
                      {getChangeIcon(metric.trend)}
                    </Box>
                    
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {metric.value.toLocaleString()}{metric.unit}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Chip 
                        label={`${metric.change > 0 ? '+' : ''}${metric.change}%`}
                        color={getChangeColor(metric.changeType) as any}
                        size="small"
                      />
                      <Typography variant="body2" color="text.secondary">
                        vs last period
                      </Typography>
                    </Box>

                    {metric.target && (
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Target: {metric.target.toLocaleString()}{metric.unit}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {Math.round((metric.value / metric.target) * 100)}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={(metric.value / metric.target) * 100}
                          color={metric.value >= metric.target ? 'success' : 'primary'}
                        />
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Quick Insights */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                🎯 AI-Powered Insights
              </Typography>
              <Grid container spacing={2}>
                {audienceInsights.slice(0, 3).map((insight) => (
                  <Grid item xs={12} md={4} key={insight.id}>
                    <Alert 
                      severity={insight.priority === 'high' ? 'error' : insight.priority === 'medium' ? 'warning' : 'info'}
                      sx={{ height: '100%' }}
                    >
                      <AlertTitle>{insight.title}</AlertTitle>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {insight.description}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        💡 {insight.recommendation}
                      </Typography>
                    </Alert>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Platform Performance Comparison
          </Typography>
          
          <Grid container spacing={3}>
            {platformPerformance.map((platform) => (
              <Grid item xs={12} md={4} key={platform.platform}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Typography variant="h4">{platform.icon}</Typography>
                      <Box>
                        <Typography variant="h6">{platform.platform.charAt(0).toUpperCase() + platform.platform.slice(1)}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {platform.followers.toLocaleString()} followers
                        </Typography>
                      </Box>
                    </Box>

                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Engagement
                        </Typography>
                        <Typography variant="h6">
                          {platform.engagement}%
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Reach
                        </Typography>
                        <Typography variant="h6">
                          {platform.reach.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Revenue
                        </Typography>
                        <Typography variant="h6">
                          ${platform.revenue.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Growth
                        </Typography>
                        <Typography variant="h6" color="success.main">
                          +{platform.growth}%
                        </Typography>
                      </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Top Content:</strong> {platform.topContent}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Best Time:</strong> {platform.bestTime}
                    </Typography>
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
            Content Performance Analysis
          </Typography>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Content</TableCell>
                  <TableCell>Platform</TableCell>
                  <TableCell align="right">Reach</TableCell>
                  <TableCell align="right">Engagement</TableCell>
                  <TableCell align="right">Score</TableCell>
                  <TableCell align="right">Revenue</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contentPerformance.map((content) => (
                  <TableRow key={content.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {content.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(content.publishedAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">
                          {platforms.find(p => p.id === content.platform)?.icon}
                        </Typography>
                        <Typography variant="body2">
                          {content.type}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        {content.reach.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        {content.engagement.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">
                          {content.score}/100
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={content.score}
                          sx={{ width: 50, height: 4 }}
                          color={content.score >= 90 ? 'success' : content.score >= 70 ? 'warning' : 'error'}
                        />
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        ${content.revenue.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton size="small">
                        <Analytics />
                      </IconButton>
                      <IconButton size="small">
                        <Edit />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {activeTab === 3 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Audience Insights & Demographics
          </Typography>
          
          <Grid container spacing={3}>
            {audienceInsights.map((insight) => (
              <Grid item xs={12} md={6} key={insight.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6">{insight.title}</Typography>
                      <Chip 
                        label={insight.priority} 
                        color={getPriorityColor(insight.priority) as any} 
                        size="small"
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {insight.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Typography variant="h6">
                        {insight.value}{insight.type === 'demographic' ? '%' : 'x'}
                      </Typography>
                      <Chip 
                        label={`${insight.change > 0 ? '+' : ''}${insight.change}%`}
                        color={insight.trend === 'up' ? 'success' : 'error'}
                        size="small"
                      />
                    </Box>
                    
                    <Alert severity="info">
                      <Typography variant="body2">
                        <strong>Recommendation:</strong> {insight.recommendation}
                      </Typography>
                    </Alert>
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
