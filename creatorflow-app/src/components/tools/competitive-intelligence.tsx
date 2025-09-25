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
  TrackChanges,
  TrendingUp,
  TrendingDown,
  BarChart,
  PieChart,
  ShowChart,
  Timeline,
  Assessment,
  Insights,
  Speed,
  Flag,
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

// Competitive intelligence interfaces
interface Competitor {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  niche: string;
  platforms: string[];
  followers: number;
  engagement: number;
  contentFrequency: number;
  topContent: string[];
  hashtags: string[];
  postingTimes: string[];
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  growthRate: number;
  revenue: number;
  partnerships: string[];
  contentTypes: string[];
  audience: {
    age: { [key: string]: number };
    gender: { [key: string]: number };
    location: { [key: string]: number };
    interests: { [key: string]: number };
  };
  lastActive: string;
  verified: boolean;
  rating: number;
  threatLevel: 'low' | 'medium' | 'high';
  marketShare: number;
  brandValue: number;
  contentQuality: number;
  innovation: number;
  community: number;
}

interface MarketAnalysis {
  id: string;
  title: string;
  description: string;
  marketSize: number;
  growthRate: number;
  trends: string[];
  opportunities: string[];
  threats: string[];
  keyPlayers: string[];
  barriers: string[];
  regulations: string[];
  technology: string[];
  consumerBehavior: string[];
  seasonality: string[];
  competition: string[];
  pricing: string[];
  distribution: string[];
  marketing: string[];
  innovation: string[];
  future: string[];
  createdAt: string;
}

interface CompetitiveInsight {
  id: string;
  title: string;
  description: string;
  type: 'opportunity' | 'threat' | 'trend' | 'strategy';
  priority: 'high' | 'medium' | 'low';
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  source: string;
  competitor: string;
  recommendation: string;
  action: string;
  timeline: string;
  cost: number;
  effort: 'low' | 'medium' | 'high';
  risk: 'low' | 'medium' | 'high';
  reward: 'low' | 'medium' | 'high';
  createdAt: string;
}

interface CompetitiveIntelligenceProps {
  onSave?: (data: any) => void;
  onExport?: (data: any) => void;
  loading?: boolean;
  error?: string | null;
  className?: string;
}

export default function CompetitiveIntelligence({
  onSave,
  onExport,
  loading = false,
  error = null,
  className
}: CompetitiveIntelligenceProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNiche, setSelectedNiche] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [marketAnalysis, setMarketAnalysis] = useState<MarketAnalysis[]>([]);
  const [insights, setInsights] = useState<CompetitiveInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock data for niches
  const niches = [
    { id: 'all', name: 'All Niches' },
    { id: 'technology', name: 'Technology' },
    { id: 'fashion', name: 'Fashion' },
    { id: 'food', name: 'Food' },
    { id: 'travel', name: 'Travel' },
    { id: 'fitness', name: 'Fitness' },
    { id: 'beauty', name: 'Beauty' },
    { id: 'business', name: 'Business' }
  ];

  // Mock data for platforms
  const platforms = [
    { id: 'all', name: 'All Platforms', icon: '🌐' },
    { id: 'instagram', name: 'Instagram', icon: '📷' },
    { id: 'youtube', name: 'YouTube', icon: '📺' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵' },
    { id: 'twitter', name: 'Twitter/X', icon: '🐦' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼' }
  ];

  // Mock data
  useEffect(() => {
    const mockCompetitors: Competitor[] = [
      {
        id: '1',
        name: 'TechCreator Pro',
        username: '@techcreatorpro',
        avatar: 'https://via.placeholder.com/150',
        bio: 'Tech content creator specializing in AI and automation tools for creators.',
        niche: 'technology',
        platforms: ['youtube', 'instagram', 'twitter'],
        followers: 250000,
        engagement: 8.5,
        contentFrequency: 5,
        topContent: ['AI Tools Review', 'Tech Tutorials', 'Gadget Unboxing'],
        hashtags: ['#TechReview', '#AITools', '#Tutorial'],
        postingTimes: ['Tuesday 2PM', 'Thursday 6PM', 'Saturday 10AM'],
        strengths: ['High production quality', 'Consistent posting', 'Engaging thumbnails'],
        weaknesses: ['Limited AI content', 'No live streaming', 'Weak community engagement'],
        opportunities: ['AI tutorial series', 'Live coding sessions', 'Community challenges'],
        threats: ['New competitors', 'Algorithm changes', 'Market saturation'],
        growthRate: 15.2,
        revenue: 45000,
        partnerships: ['TechFlow', 'AI Solutions', 'Creator Tools'],
        contentTypes: ['tutorials', 'reviews', 'unboxing'],
        audience: {
          age: { '18-24': 25, '25-34': 45, '35-44': 25, '45+': 5 },
          gender: { 'Male': 70, 'Female': 30 },
          location: { 'US': 50, 'UK': 20, 'Canada': 15, 'Other': 15 },
          interests: { 'Tech': 60, 'AI': 30, 'Gaming': 10 }
        },
        lastActive: '2025-01-20T10:30:00Z',
        verified: true,
        rating: 4.8,
        threatLevel: 'high',
        marketShare: 12.5,
        brandValue: 85000,
        contentQuality: 9.2,
        innovation: 8.8,
        community: 7.5
      },
      {
        id: '2',
        name: 'Fashion Forward',
        username: '@fashionforward',
        avatar: 'https://via.placeholder.com/150',
        bio: 'Sustainable fashion influencer and stylist. Eco-friendly fashion advocate.',
        niche: 'fashion',
        platforms: ['instagram', 'tiktok'],
        followers: 180000,
        engagement: 12.3,
        contentFrequency: 7,
        topContent: ['Outfit of the Day', 'Sustainable Brands', 'Thrift Hauls'],
        hashtags: ['#SustainableFashion', '#OOTD', '#EcoFriendly'],
        postingTimes: ['Monday 9AM', 'Wednesday 2PM', 'Friday 6PM'],
        strengths: ['Strong visual content', 'High engagement', 'Active community'],
        weaknesses: ['Limited video content', 'No educational posts', 'Weak storytelling'],
        opportunities: ['Educational content', 'Video tutorials', 'Behind-the-scenes'],
        threats: ['Fast fashion competition', 'Sustainability fatigue', 'Algorithm changes'],
        growthRate: 8.7,
        revenue: 32000,
        partnerships: ['EcoStyle', 'Sustainable Brands', 'Fashion Week'],
        contentTypes: ['outfit posts', 'styling', 'lifestyle'],
        audience: {
          age: { '18-24': 40, '25-34': 35, '35-44': 20, '45+': 5 },
          gender: { 'Female': 85, 'Male': 15 },
          location: { 'US': 40, 'UK': 25, 'Canada': 20, 'Other': 15 },
          interests: { 'Fashion': 70, 'Sustainability': 20, 'Lifestyle': 10 }
        },
        lastActive: '2025-01-19T16:45:00Z',
        verified: true,
        rating: 4.6,
        threatLevel: 'medium',
        marketShare: 8.2,
        brandValue: 65000,
        contentQuality: 8.8,
        innovation: 7.2,
        community: 9.1
      }
    ];

    const mockMarketAnalysis: MarketAnalysis[] = [
      {
        id: '1',
        title: 'Tech Content Creator Market',
        description: 'Analysis of the technology content creation market and trends',
        marketSize: 2500000000,
        growthRate: 18.5,
        trends: ['AI integration', 'Short-form content', 'Live streaming'],
        opportunities: ['AI tools education', 'Automation tutorials', 'Tech reviews'],
        threats: ['Market saturation', 'Algorithm changes', 'Competition'],
        keyPlayers: ['TechCreator Pro', 'AI Tutorials', 'Tech Reviews'],
        barriers: ['High production costs', 'Technical expertise', 'Equipment needs'],
        regulations: ['Content guidelines', 'Copyright laws', 'Platform policies'],
        technology: ['AI tools', 'Video editing', 'Streaming equipment'],
        consumerBehavior: ['Mobile-first', 'Short attention spans', 'Visual content'],
        seasonality: ['Q4 peak', 'Summer dip', 'Back-to-school boost'],
        competition: ['High', 'Growing', 'Innovation-driven'],
        pricing: ['$500-5000', 'Sponsorship-based', 'Subscription models'],
        distribution: ['Multi-platform', 'Cross-promotion', 'Community building'],
        marketing: ['Social media', 'Influencer partnerships', 'Content marketing'],
        innovation: ['AI integration', 'Interactive content', 'Personalization'],
        future: ['VR content', 'AI avatars', 'Metaverse integration'],
        createdAt: '2025-01-20T08:00:00Z'
      }
    ];

    const mockInsights: CompetitiveInsight[] = [
      {
        id: '1',
        title: 'AI Content Gap Opportunity',
        description: 'TechCreator Pro has limited AI content despite high demand',
        type: 'opportunity',
        priority: 'high',
        impact: 'high',
        confidence: 85,
        source: 'Content analysis',
        competitor: 'TechCreator Pro',
        recommendation: 'Create AI-focused content series',
        action: 'Develop AI tutorial series',
        timeline: '2 months',
        cost: 5000,
        effort: 'medium',
        risk: 'low',
        reward: 'high',
        createdAt: '2025-01-20T10:00:00Z'
      },
      {
        id: '2',
        title: 'Fashion Sustainability Trend',
        description: 'Growing demand for sustainable fashion content',
        type: 'trend',
        priority: 'medium',
        impact: 'medium',
        confidence: 78,
        source: 'Market research',
        competitor: 'Fashion Forward',
        recommendation: 'Incorporate sustainability themes',
        action: 'Add eco-friendly content',
        timeline: '1 month',
        cost: 2000,
        effort: 'low',
        risk: 'low',
        reward: 'medium',
        createdAt: '2025-01-19T14:30:00Z'
      }
    ];

    setCompetitors(mockCompetitors);
    setMarketAnalysis(mockMarketAnalysis);
    setInsights(mockInsights);
  }, []);

  const getThreatLevelColor = (level: string) => {
    switch (level) {
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'opportunity':
        return 'success';
      case 'threat':
        return 'error';
      case 'trend':
        return 'info';
      case 'strategy':
        return 'primary';
      default:
        return 'default';
    }
  };

  const filteredCompetitors = competitors.filter(competitor => {
    const matchesNiche = selectedNiche === 'all' || competitor.niche === selectedNiche;
    const matchesPlatform = selectedPlatform === 'all' || competitor.platforms.includes(selectedPlatform);
    return matchesNiche && matchesPlatform;
  });

  return (
    <Box className={className} sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
        🔍 Competitive Intelligence
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
        Track competitors and analyze market positioning. Get insights on competitor 
        strategies, market trends, and opportunities to stay ahead of the competition.
      </Typography>

      <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
        <Tab label="Competitor Analysis" icon={<TrackChanges />} />
        <Tab label="Market Analysis" icon={<Assessment />} />
        <Tab label="Insights & Opportunities" icon={<Insights />} />
        <Tab label="SWOT Analysis" icon={<Compare />} />
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
                    label="Search competitors"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Niche</InputLabel>
                    <Select
                      value={selectedNiche}
                      onChange={(e) => setSelectedNiche(e.target.value)}
                    >
                      {niches.map((niche) => (
                        <MenuItem key={niche.id} value={niche.id}>
                          {niche.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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

          {/* Competitors List */}
          <Grid container spacing={3}>
            {filteredCompetitors.map((competitor) => (
              <Grid item xs={12} md={6} key={competitor.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar src={competitor.avatar} sx={{ width: 60, height: 60 }} />
                        <Box>
                          <Typography variant="h6">
                            {competitor.name}
                            {competitor.verified && <Star sx={{ ml: 1, color: 'primary.main', fontSize: 20 }} />}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {competitor.username}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip 
                          label={competitor.threatLevel} 
                          color={getThreatLevelColor(competitor.threatLevel) as any} 
                          size="small"
                        />
                        <Chip 
                          label={competitor.niche} 
                          color="primary" 
                          size="small"
                        />
                      </Box>
                    </Box>

                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {competitor.bio}
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Followers
                        </Typography>
                        <Typography variant="h6">
                          {competitor.followers.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Engagement
                        </Typography>
                        <Typography variant="h6">
                          {competitor.engagement}%
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Growth Rate
                        </Typography>
                        <Typography variant="h6">
                          +{competitor.growthRate}%
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Market Share
                        </Typography>
                        <Typography variant="h6">
                          {competitor.marketShare}%
                        </Typography>
                      </Grid>
                    </Grid>

                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="body2">SWOT Analysis</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="success.main" sx={{ fontWeight: 'bold' }}>
                              Strengths
                            </Typography>
                            <Typography variant="body2">
                              {competitor.strengths.join(', ')}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="error.main" sx={{ fontWeight: 'bold' }}>
                              Weaknesses
                            </Typography>
                            <Typography variant="body2">
                              {competitor.weaknesses.join(', ')}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="info.main" sx={{ fontWeight: 'bold' }}>
                              Opportunities
                            </Typography>
                            <Typography variant="body2">
                              {competitor.opportunities.join(', ')}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="warning.main" sx={{ fontWeight: 'bold' }}>
                              Threats
                            </Typography>
                            <Typography variant="body2">
                              {competitor.threats.join(', ')}
                            </Typography>
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>

                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <Button size="small" startIcon={<Visibility />}>View Details</Button>
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
            Market Analysis & Trends
          </Typography>
          
          <Grid container spacing={3}>
            {marketAnalysis.map((analysis) => (
              <Grid item xs={12} md={6} key={analysis.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      {analysis.title}
                    </Typography>

                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {analysis.description}
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Market Size
                        </Typography>
                        <Typography variant="h6">
                          ${(analysis.marketSize / 1000000000).toFixed(1)}B
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Growth Rate
                        </Typography>
                        <Typography variant="h6">
                          +{analysis.growthRate}%
                        </Typography>
                      </Grid>
                    </Grid>

                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="body2">Key Trends</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {analysis.trends.map((trend, index) => (
                            <Chip key={index} label={trend} size="small" />
                          ))}
                        </Box>
                      </AccordionDetails>
                    </Accordion>

                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="body2">Opportunities</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {analysis.opportunities.map((opportunity, index) => (
                            <Chip key={index} label={opportunity} size="small" color="success" />
                          ))}
                        </Box>
                      </AccordionDetails>
                    </Accordion>

                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <Button size="small" startIcon={<Edit />}>Edit</Button>
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
            Competitive Insights & Opportunities
          </Typography>
          
          <Grid container spacing={3}>
            {insights.map((insight) => (
              <Grid item xs={12} md={6} key={insight.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6">{insight.title}</Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip 
                          label={insight.type} 
                          color={getTypeColor(insight.type) as any} 
                          size="small"
                        />
                        <Chip 
                          label={insight.priority} 
                          color={getPriorityColor(insight.priority) as any} 
                          size="small"
                        />
                      </Box>
                    </Box>

                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {insight.description}
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Impact
                        </Typography>
                        <Typography variant="h6">
                          {insight.impact}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Confidence
                        </Typography>
                        <Typography variant="h6">
                          {insight.confidence}%
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Cost
                        </Typography>
                        <Typography variant="h6">
                          ${insight.cost.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Timeline
                        </Typography>
                        <Typography variant="h6">
                          {insight.timeline}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Recommendation:</strong> {insight.recommendation}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      <strong>Action:</strong> {insight.action}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      <Chip label={`Effort: ${insight.effort}`} size="small" />
                      <Chip label={`Risk: ${insight.risk}`} size="small" />
                      <Chip label={`Reward: ${insight.reward}`} size="small" />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" startIcon={<PlayArrow />}>Take Action</Button>
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
            SWOT Analysis & Strategic Planning
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Your Competitive Position
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Analysis of your position relative to competitors
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Market Position
                      </Typography>
                      <Typography variant="h6">
                        #3
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Competitive Score
                      </Typography>
                      <Typography variant="h6">
                        7.8/10
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Strengths
                      </Typography>
                      <Typography variant="h6">
                        8.5/10
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Opportunities
                      </Typography>
                      <Typography variant="h6">
                        9.2/10
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
                    Strategic Recommendations
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    AI-powered recommendations based on competitive analysis
                  </Typography>
                  
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Target sx={{ color: 'success.main' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Focus on AI content"
                        secondary="High opportunity, low competition"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <TrendingUp sx={{ color: 'info.main' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Expand to TikTok"
                        secondary="Growing platform with less competition"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Group sx={{ color: 'warning.main' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Build community"
                        secondary="Strengthen engagement and loyalty"
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
