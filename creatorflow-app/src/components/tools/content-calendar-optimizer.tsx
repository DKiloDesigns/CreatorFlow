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
  Schedule,
  TrendingUp,
  ContentCopy,
  Analytics,
  Settings,
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
  TrendingUp as TrendingUpIcon,
  AutoAwesome,
  Palette,
  Tune,
  Compare,
  Assessment,
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
  ShowChart,
  PieChart,
  DonutLarge,
  Timeline,
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
  NotificationsActiveTwoTone
} from '@/lib/mui-optimized-imports';
import { designTokens } from '@/lib/design-system';

// Calendar optimization interfaces
interface OptimizedPost {
  id: string;
  title: string;
  content: string;
  platform: string;
  scheduledTime: string;
  optimalTime: string;
  engagementScore: number;
  audienceSize: number;
  hashtags: string[];
  mediaType: 'text' | 'image' | 'video' | 'carousel';
  status: 'scheduled' | 'published' | 'draft';
  createdAt: string;
}

interface CalendarOptimization {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  totalPosts: number;
  avgEngagementScore: number;
  optimalTimes: OptimalTime[];
  contentMix: ContentMix[];
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
}

interface OptimalTime {
  platform: string;
  dayOfWeek: string;
  time: string;
  engagementScore: number;
  audienceSize: number;
}

interface ContentMix {
  type: string;
  percentage: number;
  color: string;
}

interface CalendarOptimizerProps {
  onSave?: (optimization: CalendarOptimization) => void;
  onExport?: (data: any) => void;
  loading?: boolean;
  error?: string | null;
  className?: string;
}

export default function ContentCalendarOptimizer({
  onSave,
  onExport,
  loading = false,
  error = null,
  className
}: CalendarOptimizerProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [optimizedPosts, setOptimizedPosts] = useState<OptimizedPost[]>([]);
  const [optimizations, setOptimizations] = useState<CalendarOptimization[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('week');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showCreateOptimization, setShowCreateOptimization] = useState(false);
  const [newOptimization, setNewOptimization] = useState<Partial<CalendarOptimization>>({
    name: '',
    startDate: '',
    endDate: '',
    totalPosts: 0,
    avgEngagementScore: 0,
    optimalTimes: [],
    contentMix: [],
    status: 'active'
  });

  // Mock data for platforms
  const platforms = [
    { id: 'all', name: 'All Platforms', icon: '🌐' },
    { id: 'instagram', name: 'Instagram', icon: '📷' },
    { id: 'twitter', name: 'Twitter/X', icon: '🐦' },
    { id: 'facebook', name: 'Facebook', icon: '📘' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵' }
  ];

  // Mock data for timeframes
  const timeframes = [
    { id: 'day', name: 'Today' },
    { id: 'week', name: 'This Week' },
    { id: 'month', name: 'This Month' },
    { id: 'quarter', name: 'This Quarter' }
  ];

  // Mock data
  useEffect(() => {
    const mockPosts: OptimizedPost[] = [
      {
        id: '1',
        title: 'Social Media Trends 2025',
        content: 'Discover the latest social media trends that will shape 2025. From AI-powered content to authentic storytelling, here\'s what you need to know...',
        platform: 'instagram',
        scheduledTime: '2025-01-21T09:00:00Z',
        optimalTime: '2025-01-21T09:00:00Z',
        engagementScore: 85,
        audienceSize: 125000,
        hashtags: ['#SocialMediaTrends', '#2025', '#Marketing'],
        mediaType: 'image',
        status: 'scheduled',
        createdAt: '2025-01-20T10:00:00Z'
      },
      {
        id: '2',
        title: 'Content Creation Tips',
        content: '5 essential tips for creating engaging content that converts. Thread 🧵',
        platform: 'twitter',
        scheduledTime: '2025-01-21T14:30:00Z',
        optimalTime: '2025-01-21T14:30:00Z',
        engagementScore: 78,
        audienceSize: 89000,
        hashtags: ['#ContentCreation', '#Tips'],
        mediaType: 'text',
        status: 'scheduled',
        createdAt: '2025-01-20T10:00:00Z'
      },
      {
        id: '3',
        title: 'LinkedIn Marketing Strategy',
        content: 'How to build a successful LinkedIn marketing strategy that drives results. Key insights from industry experts...',
        platform: 'linkedin',
        scheduledTime: '2025-01-22T08:00:00Z',
        optimalTime: '2025-01-22T08:00:00Z',
        engagementScore: 92,
        audienceSize: 156000,
        hashtags: ['#LinkedInMarketing', '#Strategy', '#B2B'],
        mediaType: 'text',
        status: 'scheduled',
        createdAt: '2025-01-20T10:00:00Z'
      }
    ];

    const mockOptimizations: CalendarOptimization[] = [
      {
        id: '1',
        name: 'Q1 Content Strategy',
        startDate: '2025-01-01T00:00:00Z',
        endDate: '2025-03-31T23:59:59Z',
        totalPosts: 45,
        avgEngagementScore: 82,
        optimalTimes: [
          { platform: 'instagram', dayOfWeek: 'Monday', time: '09:00', engagementScore: 85, audienceSize: 125000 },
          { platform: 'twitter', dayOfWeek: 'Tuesday', time: '14:30', engagementScore: 78, audienceSize: 89000 },
          { platform: 'linkedin', dayOfWeek: 'Wednesday', time: '08:00', engagementScore: 92, audienceSize: 156000 }
        ],
        contentMix: [
          { type: 'Educational', percentage: 40, color: '#1976d2' },
          { type: 'Entertainment', percentage: 30, color: '#dc004e' },
          { type: 'Promotional', percentage: 20, color: '#2e7d32' },
          { type: 'Behind the Scenes', percentage: 10, color: '#ed6c02' }
        ],
        status: 'active',
        createdAt: '2025-01-01T00:00:00Z'
      }
    ];

    setOptimizedPosts(mockPosts);
    setOptimizations(mockOptimizations);
  }, []);

  const filteredPosts = optimizedPosts.filter(post => {
    const matchesPlatform = selectedPlatform === 'all' || post.platform === selectedPlatform;
    return matchesPlatform;
  });

  const handleOptimize = async () => {
    setIsOptimizing(true);
    
    // Simulate AI optimization
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock optimization results
    const optimized = optimizedPosts.map(post => ({
      ...post,
      engagementScore: Math.floor(Math.random() * 30) + 70,
      optimalTime: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    }));

    setOptimizedPosts(optimized);
    setIsOptimizing(false);
  };

  const handleCreateOptimization = () => {
    if (!newOptimization.name || !newOptimization.startDate || !newOptimization.endDate) return;

    const optimization: CalendarOptimization = {
      id: Date.now().toString(),
      name: newOptimization.name,
      startDate: newOptimization.startDate,
      endDate: newOptimization.endDate,
      totalPosts: newOptimization.totalPosts || 0,
      avgEngagementScore: newOptimization.avgEngagementScore || 0,
      optimalTimes: newOptimization.optimalTimes || [],
      contentMix: newOptimization.contentMix || [],
      status: newOptimization.status || 'active',
      createdAt: new Date().toISOString()
    };

    setOptimizations([...optimizations, optimization]);
    setShowCreateOptimization(false);
    setNewOptimization({
      name: '',
      startDate: '',
      endDate: '',
      totalPosts: 0,
      avgEngagementScore: 0,
      optimalTimes: [],
      contentMix: [],
      status: 'active'
    });
  };

  const getPlatformIcon = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    return platform?.icon || '📱';
  };

  const getPlatformName = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    return platform?.name || platformId;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'info';
      case 'published':
        return 'success';
      case 'draft':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getMediaTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image />;
      case 'video':
        return <VideoFile />;
      case 'carousel':
        return <Image />;
      default:
        return <Description />;
    }
  };

  return (
    <Box className={className} sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
        📅 Content Calendar Optimizer
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
        AI-powered scheduling for maximum engagement. Optimize your content calendar 
        with intelligent timing, audience analysis, and performance predictions.
      </Typography>

      <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
        <Tab label="Optimized Posts" icon={<Schedule />} />
        <Tab label="Calendar View" icon={<CalendarToday />} />
        <Tab label="Optimizations" icon={<AutoFixHigh />} />
      </Tabs>

      {activeTab === 0 && (
        <Box>
          {/* Filters and Actions */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
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
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="contained"
                    onClick={handleOptimize}
                    disabled={isOptimizing}
                    startIcon={isOptimizing ? <CircularProgress size={20} /> : <AutoAwesome />}
                    fullWidth
                  >
                    {isOptimizing ? 'Optimizing...' : 'Optimize Calendar'}
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    fullWidth
                  >
                    Add Post
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Optimized Posts */}
          <Grid container spacing={3}>
            {filteredPosts.map((post) => (
              <Grid item xs={12} md={6} key={post.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">
                          {getPlatformIcon(post.platform)}
                        </Typography>
                        <Typography variant="body2">
                          {getPlatformName(post.platform)}
                        </Typography>
                        <Chip 
                          label={post.mediaType} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      </Box>
                      <Chip 
                        label={post.status} 
                        color={getStatusColor(post.status) as any} 
                        size="small"
                      />
                    </Box>

                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {post.content}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      {post.hashtags.map((hashtag, index) => (
                        <Chip key={index} label={hashtag} size="small" />
                      ))}
                    </Box>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Engagement Score
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="h6">
                            {post.engagementScore}%
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={post.engagementScore}
                            sx={{ width: 50, height: 4 }}
                            color={post.engagementScore >= 80 ? 'success' : 'warning'}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Audience Size
                        </Typography>
                        <Typography variant="h6">
                          {post.audienceSize.toLocaleString()}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      <strong>Scheduled:</strong> {new Date(post.scheduledTime).toLocaleString()}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" startIcon={<Edit />}>Edit</Button>
                      <Button size="small" startIcon={<Schedule />}>Reschedule</Button>
                      <Button size="small" startIcon={<Analytics />}>Analytics</Button>
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
            Calendar View
          </Typography>
          <Card>
            <CardContent>
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                Calendar view coming soon. This will show your optimized posts in a calendar format.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Optimization Strategies</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowCreateOptimization(true)}
              >
                Create Optimization
              </Button>
            </Box>
          </Grid>

          {optimizations.map((optimization) => (
            <Grid item xs={12} md={6} key={optimization.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6">{optimization.name}</Typography>
                    <Chip 
                      label={optimization.status} 
                      color={optimization.status === 'active' ? 'success' : 'default'} 
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {optimization.startDate} - {optimization.endDate}
                  </Typography>

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Total Posts
                      </Typography>
                      <Typography variant="h6">
                        {optimization.totalPosts}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Avg Engagement
                      </Typography>
                      <Typography variant="h6">
                        {optimization.avgEngagementScore}%
                      </Typography>
                    </Grid>
                  </Grid>

                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Optimal Times:</strong>
                  </Typography>
                  <List dense>
                    {optimization.optimalTimes.map((time, index) => (
                      <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <AccessTime sx={{ fontSize: 16, color: 'primary.main' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={`${time.platform}: ${time.dayOfWeek} at ${time.time}`} 
                          secondary={`${time.engagementScore}% engagement`}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button size="small" startIcon={<Edit />}>Edit</Button>
                    <Button size="small" startIcon={<Analytics />}>Analytics</Button>
                    <Button size="small" startIcon={<Delete />} color="error">Delete</Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Optimization Dialog */}
      <Dialog open={showCreateOptimization} onClose={() => setShowCreateOptimization(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Calendar Optimization</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Optimization Name"
                value={newOptimization.name}
                onChange={(e) => setNewOptimization({...newOptimization, name: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total Posts"
                type="number"
                value={newOptimization.totalPosts}
                onChange={(e) => setNewOptimization({...newOptimization, totalPosts: parseInt(e.target.value) || 0})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={newOptimization.startDate}
                onChange={(e) => setNewOptimization({...newOptimization, startDate: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={newOptimization.endDate}
                onChange={(e) => setNewOptimization({...newOptimization, endDate: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateOptimization(false)}>Cancel</Button>
          <Button onClick={handleCreateOptimization} variant="contained">Create Optimization</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
