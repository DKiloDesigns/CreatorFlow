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
  Search,
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

// Content gap analysis interfaces
interface ContentGap {
  id: string;
  title: string;
  description: string;
  category: string;
  platform: string;
  opportunityScore: number;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedReach: number;
  competitors: string[];
  keywords: string[];
  contentType: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
}

interface CompetitorAnalysis {
  id: string;
  name: string;
  platform: string;
  followers: number;
  engagement: number;
  contentFrequency: number;
  topContent: string[];
  hashtags: string[];
  postingTimes: string[];
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
}

interface ContentGapAnalyzerProps {
  onSave?: (gap: ContentGap) => void;
  onExport?: (data: any) => void;
  loading?: boolean;
  error?: string | null;
  className?: string;
}

export default function ContentGapAnalyzer({
  onSave,
  onExport,
  loading = false,
  error = null,
  className
}: ContentGapAnalyzerProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [contentGaps, setContentGaps] = useState<ContentGap[]>([]);
  const [competitors, setCompetitors] = useState<CompetitorAnalysis[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock data for categories
  const categories = [
    { id: 'all', name: 'All Categories' },
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
    { id: 'twitter', name: 'Twitter/X', icon: '🐦' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵' },
    { id: 'youtube', name: 'YouTube', icon: '📺' }
  ];

  // Mock data
  useEffect(() => {
    const mockGaps: ContentGap[] = [
      {
        id: '1',
        title: 'AI Tools Tutorial Series',
        description: 'Educational content about AI tools for creators',
        category: 'technology',
        platform: 'youtube',
        opportunityScore: 92,
        difficulty: 'medium',
        estimatedReach: 150000,
        competitors: ['TechCreator', 'AITutorials'],
        keywords: ['AI tools', 'tutorial', 'automation'],
        contentType: 'video',
        priority: 'high',
        createdAt: '2025-01-20T10:00:00Z'
      },
      {
        id: '2',
        title: 'Sustainable Fashion Tips',
        description: 'Eco-friendly fashion advice and styling tips',
        category: 'fashion',
        platform: 'instagram',
        opportunityScore: 78,
        difficulty: 'easy',
        estimatedReach: 85000,
        competitors: ['EcoFashion', 'SustainableStyle'],
        keywords: ['sustainable fashion', 'eco-friendly', 'styling'],
        contentType: 'carousel',
        priority: 'medium',
        createdAt: '2025-01-20T10:00:00Z'
      },
      {
        id: '3',
        title: 'Quick Workout Routines',
        description: '5-minute workout routines for busy professionals',
        category: 'fitness',
        platform: 'tiktok',
        opportunityScore: 85,
        difficulty: 'easy',
        estimatedReach: 200000,
        competitors: ['QuickFitness', 'BusyWorkouts'],
        keywords: ['quick workout', '5 minutes', 'fitness'],
        contentType: 'video',
        priority: 'high',
        createdAt: '2025-01-20T10:00:00Z'
      }
    ];

    const mockCompetitors: CompetitorAnalysis[] = [
      {
        id: '1',
        name: 'TechCreator',
        platform: 'youtube',
        followers: 250000,
        engagement: 6.8,
        contentFrequency: 3,
        topContent: ['AI Tools Review', 'Tech Tutorials', 'Gadget Unboxing'],
        hashtags: ['#TechReview', '#AITools', '#Tutorial'],
        postingTimes: ['Tuesday 2PM', 'Thursday 6PM', 'Saturday 10AM'],
        strengths: ['High production quality', 'Consistent posting', 'Engaging thumbnails'],
        weaknesses: ['Limited AI content', 'No live streaming', 'Weak community engagement'],
        opportunities: ['AI tutorial series', 'Live coding sessions', 'Community challenges']
      },
      {
        id: '2',
        name: 'EcoFashion',
        platform: 'instagram',
        followers: 180000,
        engagement: 8.2,
        contentFrequency: 5,
        topContent: ['Outfit of the Day', 'Sustainable Brands', 'Thrift Hauls'],
        hashtags: ['#SustainableFashion', '#OOTD', '#EcoFriendly'],
        postingTimes: ['Monday 9AM', 'Wednesday 2PM', 'Friday 6PM'],
        strengths: ['Strong visual content', 'High engagement', 'Active community'],
        weaknesses: ['Limited video content', 'No educational posts', 'Weak storytelling'],
        opportunities: ['Educational content', 'Video tutorials', 'Behind-the-scenes']
      }
    ];

    setContentGaps(mockGaps);
    setCompetitors(mockCompetitors);
  }, []);

  const handleAnalyze = async () => {
    if (!searchQuery.trim()) return;

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock analysis result
    const newGap: ContentGap = {
      id: Date.now().toString(),
      title: `Content Opportunity: ${searchQuery}`,
      description: `AI-identified content gap in ${searchQuery} category`,
      category: selectedCategory,
      platform: selectedPlatform,
      opportunityScore: Math.floor(Math.random() * 30) + 70,
      difficulty: Math.random() > 0.5 ? 'medium' : 'easy',
      estimatedReach: Math.floor(Math.random() * 100000) + 50000,
      competitors: ['Competitor1', 'Competitor2'],
      keywords: [searchQuery, 'tutorial', 'guide'],
      contentType: 'video',
      priority: 'medium',
      createdAt: new Date().toISOString()
    };

    setContentGaps([newGap, ...contentGaps]);
    setIsAnalyzing(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'warning';
      case 'hard':
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

  const filteredGaps = contentGaps.filter(gap => {
    const matchesCategory = selectedCategory === 'all' || gap.category === selectedCategory;
    const matchesPlatform = selectedPlatform === 'all' || gap.platform === selectedPlatform;
    return matchesCategory && matchesPlatform;
  });

  return (
    <Box className={className} sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
        🔍 Content Gap Analyzer
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
        Identify content opportunities and analyze competitors. Discover gaps in your 
        content strategy and find new ways to engage your audience.
      </Typography>

      <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
        <Tab label="Gap Analysis" icon={<Search />} />
        <Tab label="Competitors" icon={<Group />} />
        <Tab label="Opportunities" icon={<Flag />} />
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
                    label="Search content gaps or keywords"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
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

          {/* Content Gaps */}
          <Grid container spacing={3}>
            {filteredGaps.map((gap) => (
              <Grid item xs={12} md={6} key={gap.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6">{gap.title}</Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip 
                          label={gap.difficulty} 
                          color={getDifficultyColor(gap.difficulty) as any} 
                          size="small"
                        />
                        <Chip 
                          label={gap.priority} 
                          color={getPriorityColor(gap.priority) as any} 
                          size="small"
                        />
                      </Box>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {gap.description}
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Opportunity Score
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="h6">
                            {gap.opportunityScore}/100
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={gap.opportunityScore}
                            sx={{ width: 50, height: 4 }}
                            color={gap.opportunityScore >= 80 ? 'success' : 'warning'}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Estimated Reach
                        </Typography>
                        <Typography variant="h6">
                          {gap.estimatedReach.toLocaleString()}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      {gap.keywords.map((keyword, index) => (
                        <Chip key={index} label={keyword} size="small" />
                      ))}
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      <strong>Competitors:</strong> {gap.competitors.join(', ')}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" startIcon={<Add />}>Create Content</Button>
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
            Competitor Analysis
          </Typography>
          
          <Grid container spacing={3}>
            {competitors.map((competitor) => (
              <Grid item xs={12} md={6} key={competitor.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      {competitor.name}
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
                    </Grid>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Top Content:</strong>
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      {competitor.topContent.map((content, index) => (
                        <Chip key={index} label={content} size="small" />
                      ))}
                    </Box>

                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="body2">Strengths & Weaknesses</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Strengths:</strong> {competitor.strengths.join(', ')}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Weaknesses:</strong> {competitor.weaknesses.join(', ')}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Opportunities:</strong> {competitor.opportunities.join(', ')}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
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
            High-Priority Opportunities
          </Typography>
          
          <Grid container spacing={3}>
            {filteredGaps
              .filter(gap => gap.priority === 'high')
              .map((gap) => (
              <Grid item xs={12} md={6} key={gap.id}>
                <Card sx={{ border: '2px solid', borderColor: 'error.main' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <FlashOn sx={{ color: 'error.main', fontSize: 32 }} />
                      <Box>
                        <Typography variant="h6">{gap.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {gap.category} • {gap.platform}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {gap.description}
                    </Typography>

                    <Alert severity="error" sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        <strong>High Priority:</strong> This content gap has a {gap.opportunityScore}% opportunity score and could reach {gap.estimatedReach.toLocaleString()} people.
                      </Typography>
                    </Alert>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button variant="contained" size="small" startIcon={<Add />}>
                        Create Content
                      </Button>
                      <Button size="small" startIcon={<Schedule />}>
                        Schedule
                      </Button>
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
