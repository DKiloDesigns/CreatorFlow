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
  Group,
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

// Creator network interfaces
interface Creator {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  niche: string;
  platforms: string[];
  followers: number;
  engagement: number;
  location: string;
  languages: string[];
  collaborationTypes: string[];
  availability: 'available' | 'busy' | 'unavailable';
  rating: number;
  verified: boolean;
  mutualConnections: number;
  lastActive: string;
  tags: string[];
  portfolio: string[];
  pricing: {
    min: number;
    max: number;
    currency: string;
  };
  responseTime: string;
  successRate: number;
}

interface CollaborationOpportunity {
  id: string;
  title: string;
  description: string;
  type: 'collaboration' | 'partnership' | 'mentorship' | 'event' | 'project';
  creator: Creator;
  requirements: string[];
  timeline: string;
  budget: number;
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
  deadline: string;
  skills: string[];
  platforms: string[];
}

interface NetworkInsight {
  id: string;
  title: string;
  description: string;
  type: 'connection' | 'opportunity' | 'trend' | 'recommendation';
  priority: 'high' | 'medium' | 'low';
  action: string;
  value: number;
  createdAt: string;
}

interface CreatorNetworkBuilderProps {
  onSave?: (data: any) => void;
  onExport?: (data: any) => void;
  loading?: boolean;
  error?: string | null;
  className?: string;
}

export default function CreatorNetworkBuilder({
  onSave,
  onExport,
  loading = false,
  error = null,
  className
}: CreatorNetworkBuilderProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNiche, setSelectedNiche] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedCollaborationType, setSelectedCollaborationType] = useState('all');
  const [creators, setCreators] = useState<Creator[]>([]);
  const [collaborationOpportunities, setCollaborationOpportunities] = useState<CollaborationOpportunity[]>([]);
  const [networkInsights, setNetworkInsights] = useState<NetworkInsight[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock data for niches
  const niches = [
    { id: 'all', name: 'All Niches' },
    { id: 'technology', name: 'Technology' },
    { id: 'fashion', name: 'Fashion' },
    { id: 'food', name: 'Food' },
    { id: 'travel', name: 'Travel' },
    { id: 'fitness', name: 'Fitness' },
    { id: 'beauty', name: 'Beauty' },
    { id: 'business', name: 'Business' },
    { id: 'education', name: 'Education' },
    { id: 'gaming', name: 'Gaming' }
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

  // Mock data for collaboration types
  const collaborationTypes = [
    { id: 'all', name: 'All Types' },
    { id: 'collaboration', name: 'Content Collaboration' },
    { id: 'partnership', name: 'Brand Partnership' },
    { id: 'mentorship', name: 'Mentorship' },
    { id: 'event', name: 'Event Collaboration' },
    { id: 'project', name: 'Project Collaboration' }
  ];

  // Mock data
  useEffect(() => {
    const mockCreators: Creator[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        username: '@sarah_creator',
        avatar: 'https://via.placeholder.com/150',
        bio: 'Tech content creator passionate about AI and automation. Helping creators grow their businesses.',
        niche: 'technology',
        platforms: ['youtube', 'instagram', 'twitter'],
        followers: 125000,
        engagement: 8.5,
        location: 'San Francisco, CA',
        languages: ['English', 'Spanish'],
        collaborationTypes: ['collaboration', 'mentorship'],
        availability: 'available',
        rating: 4.8,
        verified: true,
        mutualConnections: 12,
        lastActive: '2025-01-20T10:30:00Z',
        tags: ['AI', 'automation', 'tech', 'business'],
        portfolio: ['https://example.com/portfolio1', 'https://example.com/portfolio2'],
        pricing: { min: 500, max: 2000, currency: 'USD' },
        responseTime: '2 hours',
        successRate: 95
      },
      {
        id: '2',
        name: 'Mike Chen',
        username: '@mike_fitness',
        avatar: 'https://via.placeholder.com/150',
        bio: 'Fitness coach and content creator. Specializing in home workouts and nutrition.',
        niche: 'fitness',
        platforms: ['instagram', 'tiktok', 'youtube'],
        followers: 89000,
        engagement: 12.3,
        location: 'Los Angeles, CA',
        languages: ['English', 'Mandarin'],
        collaborationTypes: ['collaboration', 'partnership'],
        availability: 'available',
        rating: 4.9,
        verified: true,
        mutualConnections: 8,
        lastActive: '2025-01-20T09:15:00Z',
        tags: ['fitness', 'nutrition', 'workout', 'health'],
        portfolio: ['https://example.com/portfolio3', 'https://example.com/portfolio4'],
        pricing: { min: 300, max: 1500, currency: 'USD' },
        responseTime: '1 hour',
        successRate: 92
      },
      {
        id: '3',
        name: 'Emma Rodriguez',
        username: '@emma_fashion',
        avatar: 'https://via.placeholder.com/150',
        bio: 'Fashion influencer and stylist. Sustainable fashion advocate.',
        niche: 'fashion',
        platforms: ['instagram', 'tiktok'],
        followers: 156000,
        engagement: 6.8,
        location: 'New York, NY',
        languages: ['English', 'Spanish'],
        collaborationTypes: ['collaboration', 'partnership', 'event'],
        availability: 'busy',
        rating: 4.7,
        verified: true,
        mutualConnections: 15,
        lastActive: '2025-01-19T16:45:00Z',
        tags: ['fashion', 'sustainable', 'styling', 'lifestyle'],
        portfolio: ['https://example.com/portfolio5', 'https://example.com/portfolio6'],
        pricing: { min: 800, max: 3000, currency: 'USD' },
        responseTime: '4 hours',
        successRate: 88
      }
    ];

    const mockCollaborationOpportunities: CollaborationOpportunity[] = [
      {
        id: '1',
        title: 'AI Tools Tutorial Series',
        description: 'Collaborate on a series of tutorials about AI tools for content creators',
        type: 'collaboration',
        creator: mockCreators[0],
        requirements: ['Tech expertise', 'Video editing skills', 'AI knowledge'],
        timeline: '2 months',
        budget: 5000,
        status: 'open',
        createdAt: '2025-01-20T08:00:00Z',
        deadline: '2025-03-20T23:59:59Z',
        skills: ['AI', 'tutorial', 'video editing'],
        platforms: ['youtube', 'instagram']
      },
      {
        id: '2',
        title: 'Fitness Challenge Partnership',
        description: 'Partner on a 30-day fitness challenge with branded content',
        type: 'partnership',
        creator: mockCreators[1],
        requirements: ['Fitness content', 'Brand alignment', 'Engagement'],
        timeline: '1 month',
        budget: 3000,
        status: 'open',
        createdAt: '2025-01-19T14:30:00Z',
        deadline: '2025-02-19T23:59:59Z',
        skills: ['fitness', 'challenge', 'branding'],
        platforms: ['instagram', 'tiktok']
      }
    ];

    const mockNetworkInsights: NetworkInsight[] = [
      {
        id: '1',
        title: 'High-Engagement Creator Available',
        description: 'Sarah Johnson has high engagement rates and is available for collaboration',
        type: 'opportunity',
        priority: 'high',
        action: 'Send collaboration request',
        value: 95,
        createdAt: '2025-01-20T10:00:00Z'
      },
      {
        id: '2',
        title: 'New Collaboration Trend',
        description: 'AI content collaborations are trending in your network',
        type: 'trend',
        priority: 'medium',
        action: 'Explore AI collaboration opportunities',
        value: 78,
        createdAt: '2025-01-20T09:30:00Z'
      },
      {
        id: '3',
        title: 'Mutual Connection Opportunity',
        description: 'You have 12 mutual connections with Sarah Johnson',
        type: 'connection',
        priority: 'high',
        action: 'Leverage mutual connections for introduction',
        value: 85,
        createdAt: '2025-01-20T09:00:00Z'
      }
    ];

    setCreators(mockCreators);
    setCollaborationOpportunities(mockCollaborationOpportunities);
    setNetworkInsights(mockNetworkInsights);
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    
    // Simulate AI search
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock search result
    const newCreator: Creator = {
      id: Date.now().toString(),
      name: 'Search Result',
      username: '@search_result',
      avatar: 'https://via.placeholder.com/150',
      bio: `Creator matching "${searchQuery}"`,
      niche: selectedNiche,
      platforms: [selectedPlatform],
      followers: Math.floor(Math.random() * 100000) + 10000,
      engagement: Math.random() * 10 + 5,
      location: 'Location',
      languages: ['English'],
      collaborationTypes: [selectedCollaborationType],
      availability: 'available',
      rating: Math.random() * 2 + 3,
      verified: Math.random() > 0.5,
      mutualConnections: Math.floor(Math.random() * 20),
      lastActive: new Date().toISOString(),
      tags: [searchQuery],
      portfolio: [],
      pricing: { min: 100, max: 1000, currency: 'USD' },
      responseTime: '2 hours',
      successRate: Math.floor(Math.random() * 30) + 70
    };

    setCreators([newCreator, ...creators]);
    setIsSearching(false);
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'success';
      case 'busy':
        return 'warning';
      case 'unavailable':
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'success';
      case 'in-progress':
        return 'warning';
      case 'completed':
        return 'info';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredCreators = creators.filter(creator => {
    const matchesNiche = selectedNiche === 'all' || creator.niche === selectedNiche;
    const matchesPlatform = selectedPlatform === 'all' || creator.platforms.includes(selectedPlatform);
    const matchesCollaborationType = selectedCollaborationType === 'all' || creator.collaborationTypes.includes(selectedCollaborationType);
    return matchesNiche && matchesPlatform && matchesCollaborationType;
  });

  return (
    <Box className={className} sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
        👥 Creator Network Builder
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
        Build your creator network and find collaboration partners. Discover opportunities, 
        connect with like-minded creators, and grow your community.
      </Typography>

      <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
        <Tab label="Discover Creators" icon={<Search />} />
        <Tab label="Collaboration Opportunities" icon={<Group />} />
        <Tab label="Network Insights" icon={<Insights />} />
        <Tab label="My Network" icon={<Person />} />
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
                    label="Search creators or keywords"
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
                  <FormControl fullWidth>
                    <InputLabel>Collaboration</InputLabel>
                    <Select
                      value={selectedCollaborationType}
                      onChange={(e) => setSelectedCollaborationType(e.target.value)}
                    >
                      {collaborationTypes.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                          {type.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="contained"
                    onClick={handleSearch}
                    disabled={!searchQuery.trim() || isSearching}
                    startIcon={isSearching ? <CircularProgress size={20} /> : <Search />}
                    fullWidth
                  >
                    {isSearching ? 'Searching...' : 'Search'}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Creators List */}
          <Grid container spacing={3}>
            {filteredCreators.map((creator) => (
              <Grid item xs={12} md={6} key={creator.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar src={creator.avatar} sx={{ width: 60, height: 60 }} />
                        <Box>
                          <Typography variant="h6">
                            {creator.name}
                            {creator.verified && <Star sx={{ ml: 1, color: 'primary.main', fontSize: 20 }} />}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {creator.username}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip 
                          label={creator.availability} 
                          color={getAvailabilityColor(creator.availability) as any} 
                          size="small"
                        />
                        <Chip 
                          label={creator.niche} 
                          color="primary" 
                          size="small"
                        />
                      </Box>
                    </Box>

                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {creator.bio}
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Followers
                        </Typography>
                        <Typography variant="h6">
                          {creator.followers.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Engagement
                        </Typography>
                        <Typography variant="h6">
                          {creator.engagement}%
                        </Typography>
                      </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      {creator.tags.map((tag, index) => (
                        <Chip key={index} label={tag} size="small" />
                      ))}
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      <strong>Platforms:</strong> {creator.platforms.join(', ')} • <strong>Location:</strong> {creator.location}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Rating: {creator.rating}/5
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Mutual: {creator.mutualConnections}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" startIcon={<PersonAdd />}>Connect</Button>
                      <Button size="small" startIcon={<Message />}>Message</Button>
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
            Collaboration Opportunities
          </Typography>
          
          <Grid container spacing={3}>
            {collaborationOpportunities.map((opportunity) => (
              <Grid item xs={12} md={6} key={opportunity.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6">{opportunity.title}</Typography>
                      <Chip 
                        label={opportunity.status} 
                        color={getStatusColor(opportunity.status) as any} 
                        size="small"
                      />
                    </Box>

                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {opportunity.description}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar src={opportunity.creator.avatar} sx={{ width: 40, height: 40 }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {opportunity.creator.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {opportunity.creator.followers.toLocaleString()} followers
                        </Typography>
                      </Box>
                    </Box>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Budget
                        </Typography>
                        <Typography variant="h6">
                          ${opportunity.budget.toLocaleString()}
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

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Requirements:</strong> {opportunity.requirements.join(', ')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      <strong>Skills:</strong> {opportunity.skills.join(', ')}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" startIcon={<Send />}>Apply</Button>
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
            Network Insights & Recommendations
          </Typography>
          
          <Grid container spacing={3}>
            {networkInsights.map((insight) => (
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

                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {insight.description}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Value Score: {insight.value}/100
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(insight.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>

                    <Alert severity={insight.priority === 'high' ? 'error' : insight.priority === 'medium' ? 'warning' : 'info'} sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        <strong>Action:</strong> {insight.action}
                      </Typography>
                    </Alert>

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
            My Network
          </Typography>
          
          <Grid container spacing={3}>
            {filteredCreators.slice(0, 6).map((creator) => (
              <Grid item xs={12} md={4} key={creator.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar src={creator.avatar} sx={{ width: 50, height: 50 }} />
                      <Box>
                        <Typography variant="h6">
                          {creator.name}
                          {creator.verified && <Star sx={{ ml: 1, color: 'primary.main', fontSize: 16 }} />}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {creator.username}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {creator.bio}
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Followers
                        </Typography>
                        <Typography variant="h6">
                          {creator.followers.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Rating
                        </Typography>
                        <Rating value={creator.rating} readOnly size="small" />
                      </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" startIcon={<Message />}>Message</Button>
                      <Button size="small" startIcon={<Person />}>Profile</Button>
                    </Box>
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
