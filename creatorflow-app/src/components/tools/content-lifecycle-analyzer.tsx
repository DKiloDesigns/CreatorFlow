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
  Avatar,
  Rating
} from '@mui/material';
import {
  Timeline,
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  BarChart,
  PieChart,
  ShowChart,
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
  FilterList,
  Sort,
  Refresh,
  GetApp,
  FileDownload,
  PictureAsPdf,
  TableChart,
  DonutLarge,
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
  Search,
  FilterList,
  Sort,
  Refresh,
  GetApp,
  FileDownload,
  PictureAsPdf,
  TableChart,
  DonutLarge,
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

// Content lifecycle interfaces
interface ContentLifecycle {
  id: string;
  title: string;
  type: string;
  platform: string;
  publishedAt: string;
  currentStage: 'launch' | 'growth' | 'maturity' | 'decline' | 'evergreen';
  performance: {
    reach: number;
    engagement: number;
    clicks: number;
    shares: number;
    comments: number;
    likes: number;
    saves: number;
    revenue: number;
  };
  lifecycle: {
    launch: { date: string; performance: number };
    growth: { date: string; performance: number };
    maturity: { date: string; performance: number };
    decline: { date: string; performance: number };
  };
  age: number;
  peakPerformance: number;
  currentPerformance: number;
  declineRate: number;
  evergreenScore: number;
  repurposeOpportunities: string[];
  optimizationSuggestions: string[];
  tags: string[];
  category: string;
  creator: string;
  status: 'active' | 'archived' | 'repurposed';
}

interface ContentPerformance {
  id: string;
  contentId: string;
  date: string;
  reach: number;
  engagement: number;
  clicks: number;
  shares: number;
  comments: number;
  likes: number;
  saves: number;
  revenue: number;
  score: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

interface RepurposeOpportunity {
  id: string;
  contentId: string;
  title: string;
  type: 'video' | 'blog' | 'social' | 'podcast' | 'course';
  platform: string;
  description: string;
  effort: 'low' | 'medium' | 'high';
  potential: 'low' | 'medium' | 'high';
  timeline: string;
  cost: number;
  expectedReturn: number;
  roi: number;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
}

interface ContentLifecycleAnalyzerProps {
  onSave?: (data: any) => void;
  onExport?: (data: any) => void;
  loading?: boolean;
  error?: string | null;
  className?: string;
}

export default function ContentLifecycleAnalyzer({
  onSave,
  onExport,
  loading = false,
  error = null,
  className
}: ContentLifecycleAnalyzerProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedStage, setSelectedStage] = useState('all');
  const [contentLifecycles, setContentLifecycles] = useState<ContentLifecycle[]>([]);
  const [performanceData, setPerformanceData] = useState<ContentPerformance[]>([]);
  const [repurposeOpportunities, setRepurposeOpportunities] = useState<RepurposeOpportunity[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock data for platforms
  const platforms = [
    { id: 'all', name: 'All Platforms', icon: '🌐' },
    { id: 'instagram', name: 'Instagram', icon: '📷' },
    { id: 'youtube', name: 'YouTube', icon: '📺' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵' },
    { id: 'twitter', name: 'Twitter/X', icon: '🐦' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼' }
  ];

  // Mock data for stages
  const stages = [
    { id: 'all', name: 'All Stages' },
    { id: 'launch', name: 'Launch' },
    { id: 'growth', name: 'Growth' },
    { id: 'maturity', name: 'Maturity' },
    { id: 'decline', name: 'Decline' },
    { id: 'evergreen', name: 'Evergreen' }
  ];

  // Mock data
  useEffect(() => {
    const mockContentLifecycles: ContentLifecycle[] = [
      {
        id: '1',
        title: 'AI Tools Tutorial Series',
        type: 'video',
        platform: 'youtube',
        publishedAt: '2025-01-15T10:00:00Z',
        currentStage: 'growth',
        performance: {
          reach: 125000,
          engagement: 8500,
          clicks: 1200,
          shares: 450,
          comments: 230,
          likes: 7800,
          saves: 890,
          revenue: 450
        },
        lifecycle: {
          launch: { date: '2025-01-15', performance: 1000 },
          growth: { date: '2025-01-20', performance: 8500 },
          maturity: { date: '2025-01-25', performance: 12000 },
          decline: { date: '2025-02-01', performance: 8000 }
        },
        age: 5,
        peakPerformance: 12000,
        currentPerformance: 8500,
        declineRate: 15,
        evergreenScore: 85,
        repurposeOpportunities: ['Instagram Reels', 'TikTok Shorts', 'Blog Post', 'Podcast Episode'],
        optimizationSuggestions: ['Update thumbnails', 'Add timestamps', 'Create follow-up content'],
        tags: ['AI', 'tutorial', 'tech', 'automation'],
        category: 'education',
        creator: 'TechCreator',
        status: 'active'
      },
      {
        id: '2',
        title: 'Sustainable Fashion Tips',
        type: 'carousel',
        platform: 'instagram',
        publishedAt: '2025-01-10T14:30:00Z',
        currentStage: 'maturity',
        performance: {
          reach: 85000,
          engagement: 4200,
          clicks: 890,
          shares: 320,
          comments: 180,
          likes: 3700,
          saves: 0,
          revenue: 280
        },
        lifecycle: {
          launch: { date: '2025-01-10', performance: 500 },
          growth: { date: '2025-01-12', performance: 2500 },
          maturity: { date: '2025-01-15', performance: 4200 },
          decline: { date: '2025-01-20', performance: 3500 }
        },
        age: 10,
        peakPerformance: 4200,
        currentPerformance: 3500,
        declineRate: 8,
        evergreenScore: 72,
        repurposeOpportunities: ['YouTube Shorts', 'Pinterest Pins', 'Blog Post', 'Email Newsletter'],
        optimizationSuggestions: ['Repost with new hashtags', 'Create video version', 'Add call-to-action'],
        tags: ['fashion', 'sustainable', 'tips', 'lifestyle'],
        category: 'lifestyle',
        creator: 'FashionCreator',
        status: 'active'
      }
    ];

    const mockPerformanceData: ContentPerformance[] = [
      {
        id: '1',
        contentId: '1',
        date: '2025-01-20',
        reach: 125000,
        engagement: 8500,
        clicks: 1200,
        shares: 450,
        comments: 230,
        likes: 7800,
        saves: 890,
        revenue: 450,
        score: 87,
        trend: 'up',
        change: 12
      },
      {
        id: '2',
        contentId: '2',
        date: '2025-01-20',
        reach: 85000,
        engagement: 4200,
        clicks: 890,
        shares: 320,
        comments: 180,
        likes: 3700,
        saves: 0,
        revenue: 280,
        score: 78,
        trend: 'down',
        change: -5
      }
    ];

    const mockRepurposeOpportunities: RepurposeOpportunity[] = [
      {
        id: '1',
        contentId: '1',
        title: 'AI Tools Tutorial - Instagram Reels',
        type: 'video',
        platform: 'instagram',
        description: 'Convert the YouTube tutorial into short-form Instagram Reels',
        effort: 'medium',
        potential: 'high',
        timeline: '1 week',
        cost: 500,
        expectedReturn: 2000,
        roi: 300,
        priority: 'high',
        status: 'pending',
        createdAt: '2025-01-20T10:00:00Z'
      },
      {
        id: '2',
        contentId: '2',
        title: 'Sustainable Fashion - Blog Post',
        type: 'blog',
        platform: 'website',
        description: 'Expand the Instagram carousel into a comprehensive blog post',
        effort: 'high',
        potential: 'medium',
        timeline: '2 weeks',
        cost: 800,
        expectedReturn: 1500,
        roi: 88,
        priority: 'medium',
        status: 'pending',
        createdAt: '2025-01-19T14:30:00Z'
      }
    ];

    setContentLifecycles(mockContentLifecycles);
    setPerformanceData(mockPerformanceData);
    setRepurposeOpportunities(mockRepurposeOpportunities);
  }, []);

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'launch':
        return 'info';
      case 'growth':
        return 'success';
      case 'maturity':
        return 'warning';
      case 'decline':
        return 'error';
      case 'evergreen':
        return 'primary';
      default:
        return 'default';
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

  const getPotentialColor = (potential: string) => {
    switch (potential) {
      case 'high':
        return 'success';
      case 'medium':
        return 'warning';
      case 'low':
        return 'error';
      default:
        return 'default';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'low':
        return 'success';
      case 'medium':
        return 'warning';
      case 'high':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUpIcon sx={{ color: 'success.main' }} />;
      case 'down':
        return <TrendingDown sx={{ color: 'error.main' }} />;
      default:
        return <TrendingFlat sx={{ color: 'text.secondary' }} />;
    }
  };

  const filteredContentLifecycles = contentLifecycles.filter(content => {
    const matchesPlatform = selectedPlatform === 'all' || content.platform === selectedPlatform;
    const matchesStage = selectedStage === 'all' || content.currentStage === selectedStage;
    return matchesPlatform && matchesStage;
  });

  return (
    <Box className={className} sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
        📈 Content Lifecycle Analyzer
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
        Long-term content performance tracking and optimization. Analyze content 
        lifecycles, identify evergreen opportunities, and maximize content value over time.
      </Typography>

      <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
        <Tab label="Content Lifecycles" icon={<Timeline />} />
        <Tab label="Performance Tracking" icon={<Assessment />} />
        <Tab label="Repurpose Opportunities" icon={<Transform />} />
        <Tab label="Evergreen Analysis" icon={<Star />} />
      </Tabs>

      {activeTab === 0 && (
        <Box>
          {/* Search and Filters */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Search content"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
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
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Stage</InputLabel>
                    <Select
                      value={selectedStage}
                      onChange={(e) => setSelectedStage(e.target.value)}
                    >
                      {stages.map((stage) => (
                        <MenuItem key={stage.id} value={stage.id}>
                          {stage.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <Button
                    variant="contained"
                    onClick={() => setIsAnalyzing(true)}
                    startIcon={isAnalyzing ? <CircularProgress size={20} /> : <Search />}
                    fullWidth
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Content Lifecycles List */}
          <Grid container spacing={3}>
            {filteredContentLifecycles.map((content) => (
              <Grid item xs={12} md={6} key={content.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6">{content.title}</Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip 
                          label={content.currentStage} 
                          color={getStageColor(content.currentStage) as any} 
                          size="small"
                        />
                        <Chip 
                          label={content.platform} 
                          color="primary" 
                          size="small"
                        />
                      </Box>
                    </Box>

                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {content.type} • {content.category} • {content.age} days old
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Current Performance
                        </Typography>
                        <Typography variant="h6">
                          {content.currentPerformance.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Peak Performance
                        </Typography>
                        <Typography variant="h6">
                          {content.peakPerformance.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Decline Rate
                        </Typography>
                        <Typography variant="h6">
                          {content.declineRate}%
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Evergreen Score
                        </Typography>
                        <Typography variant="h6">
                          {content.evergreenScore}/100
                        </Typography>
                      </Grid>
                    </Grid>

                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="body2">Lifecycle Timeline</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="info.main">
                              Launch: {content.lifecycle.launch.performance}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="success.main">
                              Growth: {content.lifecycle.growth.performance}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="warning.main">
                              Maturity: {content.lifecycle.maturity.performance}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="error.main">
                              Decline: {content.lifecycle.decline.performance}
                            </Typography>
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Repurpose Opportunities:</strong> {content.repurposeOpportunities.join(', ')}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <Button size="small" startIcon={<Transform />}>Repurpose</Button>
                      <Button size="small" startIcon={<Edit />}>Optimize</Button>
                      <Button size="small" startIcon={<Save />}>Save</Button>
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
            Performance Tracking & Trends
          </Typography>
          
          <Grid container spacing={3}>
            {performanceData.map((performance) => (
              <Grid item xs={12} md={6} key={performance.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">
                        Content Performance
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getTrendIcon(performance.trend)}
                        <Typography variant="body2" color={performance.trend === 'up' ? 'success.main' : 'error.main'}>
                          {performance.change > 0 ? '+' : ''}{performance.change}%
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {new Date(performance.date).toLocaleDateString()}
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Reach
                        </Typography>
                        <Typography variant="h6">
                          {performance.reach.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Engagement
                        </Typography>
                        <Typography variant="h6">
                          {performance.engagement.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Clicks
                        </Typography>
                        <Typography variant="h6">
                          {performance.clicks.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Revenue
                        </Typography>
                        <Typography variant="h6">
                          ${performance.revenue.toLocaleString()}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Performance Score
                      </Typography>
                      <Typography variant="h6">
                        {performance.score}/100
                      </Typography>
                    </Box>

                    <LinearProgress
                      variant="determinate"
                      value={performance.score}
                      color={performance.score >= 80 ? 'success' : performance.score >= 60 ? 'warning' : 'error'}
                      sx={{ mb: 2 }}
                    />

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" startIcon={<Edit />}>Optimize</Button>
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
            Repurpose Opportunities
          </Typography>
          
          <Grid container spacing={3}>
            {repurposeOpportunities.map((opportunity) => (
              <Grid item xs={12} md={6} key={opportunity.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6">{opportunity.title}</Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip 
                          label={opportunity.priority} 
                          color={getPriorityColor(opportunity.priority) as any} 
                          size="small"
                        />
                        <Chip 
                          label={opportunity.status} 
                          color="primary" 
                          size="small"
                        />
                      </Box>
                    </Box>

                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {opportunity.description}
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Potential
                        </Typography>
                        <Typography variant="h6">
                          {opportunity.potential}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Effort
                        </Typography>
                        <Typography variant="h6">
                          {opportunity.effort}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          ROI
                        </Typography>
                        <Typography variant="h6">
                          {opportunity.roi}%
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Timeline
                        </Typography>
                        <Typography variant="h6">
                          {opportunity.timeline}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      <strong>Platform:</strong> {opportunity.platform} • <strong>Type:</strong> {opportunity.type}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      <Chip label={`Cost: $${opportunity.cost}`} size="small" />
                      <Chip label={`Return: $${opportunity.expectedReturn}`} size="small" />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" startIcon={<PlayArrow />}>Start</Button>
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
            Evergreen Content Analysis
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Evergreen Content Score
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Content that maintains value over time
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        High Evergreen
                      </Typography>
                      <Typography variant="h6" color="success.main">
                        3 content
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Medium Evergreen
                      </Typography>
                      <Typography variant="h6" color="warning.main">
                        5 content
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Low Evergreen
                      </Typography>
                      <Typography variant="h6" color="error.main">
                        2 content
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Total Content
                      </Typography>
                      <Typography variant="h6">
                        10 content
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Content Longevity Insights
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    AI-powered insights on content performance over time
                  </Typography>
                  
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Star sx={{ color: 'success.main' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Tutorial content performs best long-term"
                        secondary="85% evergreen score"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <TrendingUp sx={{ color: 'info.main' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Educational content has highest ROI"
                        secondary="300% average ROI"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Transform sx={{ color: 'warning.main' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Repurpose opportunities identified"
                        secondary="12 high-potential opportunities"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
}
