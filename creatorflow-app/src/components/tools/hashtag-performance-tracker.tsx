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
  TrackChanges,
  TrendingUp,
  ContentCopy,
  Schedule,
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
  TrendingFlat as TrendingFlatIcon
} from '@/lib/mui-optimized-imports';
import { designTokens } from '@/lib/design-system';

// Hashtag tracking interfaces
interface HashtagPerformance {
  id: string;
  hashtag: string;
  platform: string;
  totalUses: number;
  totalReach: number;
  totalEngagement: number;
  avgEngagementRate: number;
  bestPerformingPost: string;
  lastUsed: string;
  trend: 'up' | 'down' | 'stable';
  category: string;
  difficulty: number;
  popularity: number;
  createdAt: string;
  updatedAt: string;
}

interface HashtagCampaign {
  id: string;
  name: string;
  hashtags: string[];
  startDate: string;
  endDate: string;
  totalPosts: number;
  totalReach: number;
  totalEngagement: number;
  avgEngagementRate: number;
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
}

interface HashtagInsight {
  id: string;
  type: 'trending' | 'declining' | 'emerging' | 'seasonal';
  hashtag: string;
  description: string;
  recommendation: string;
  confidence: number;
  createdAt: string;
}

interface HashtagPerformanceTrackerProps {
  onSave?: (performance: HashtagPerformance[]) => void;
  onExport?: (data: any) => void;
  loading?: boolean;
  error?: string | null;
  className?: string;
}

export default function HashtagPerformanceTracker({
  onSave,
  onExport,
  loading = false,
  error = null,
  className
}: HashtagPerformanceTrackerProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [hashtagPerformance, setHashtagPerformance] = useState<HashtagPerformance[]>([]);
  const [campaigns, setCampaigns] = useState<HashtagCampaign[]>([]);
  const [insights, setInsights] = useState<HashtagInsight[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('30d');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('engagement');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

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
    { id: '7d', name: 'Last 7 days' },
    { id: '30d', name: 'Last 30 days' },
    { id: '90d', name: 'Last 90 days' },
    { id: '1y', name: 'Last year' }
  ];

  // Mock data
  useEffect(() => {
    const mockPerformance: HashtagPerformance[] = [
      {
        id: '1',
        hashtag: '#SocialMediaMarketing',
        platform: 'instagram',
        totalUses: 45,
        totalReach: 125000,
        totalEngagement: 8500,
        avgEngagementRate: 6.8,
        bestPerformingPost: 'Instagram post about social media trends',
        lastUsed: '2025-01-20T10:30:00Z',
        trend: 'up',
        category: 'Marketing',
        difficulty: 7,
        popularity: 8,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-20T10:30:00Z'
      },
      {
        id: '2',
        hashtag: '#ContentCreation',
        platform: 'twitter',
        totalUses: 32,
        totalReach: 89000,
        totalEngagement: 4200,
        avgEngagementRate: 4.7,
        bestPerformingPost: 'Twitter thread about content strategy',
        lastUsed: '2025-01-19T15:45:00Z',
        trend: 'stable',
        category: 'Content',
        difficulty: 5,
        popularity: 6,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-19T15:45:00Z'
      },
      {
        id: '3',
        hashtag: '#DigitalMarketing',
        platform: 'linkedin',
        totalUses: 28,
        totalReach: 156000,
        totalEngagement: 9200,
        avgEngagementRate: 5.9,
        bestPerformingPost: 'LinkedIn article about digital trends',
        lastUsed: '2025-01-18T09:15:00Z',
        trend: 'up',
        category: 'Marketing',
        difficulty: 8,
        popularity: 9,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-18T09:15:00Z'
      },
      {
        id: '4',
        hashtag: '#CreatorEconomy',
        platform: 'tiktok',
        totalUses: 15,
        totalReach: 67000,
        totalEngagement: 3800,
        avgEngagementRate: 5.7,
        bestPerformingPost: 'TikTok video about creator tips',
        lastUsed: '2025-01-17T14:20:00Z',
        trend: 'down',
        category: 'Business',
        difficulty: 6,
        popularity: 7,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-17T14:20:00Z'
      }
    ];

    const mockCampaigns: HashtagCampaign[] = [
      {
        id: '1',
        name: 'Q1 Marketing Campaign',
        hashtags: ['#SocialMediaMarketing', '#DigitalMarketing', '#ContentStrategy'],
        startDate: '2025-01-01T00:00:00Z',
        endDate: '2025-03-31T23:59:59Z',
        totalPosts: 45,
        totalReach: 370000,
        totalEngagement: 21900,
        avgEngagementRate: 5.9,
        status: 'active',
        createdAt: '2025-01-01T00:00:00Z'
      },
      {
        id: '2',
        name: 'Content Creator Series',
        hashtags: ['#ContentCreation', '#CreatorEconomy', '#ContentTips'],
        startDate: '2025-01-15T00:00:00Z',
        endDate: '2025-02-15T23:59:59Z',
        totalPosts: 28,
        totalReach: 156000,
        totalEngagement: 8900,
        avgEngagementRate: 5.7,
        status: 'active',
        createdAt: '2025-01-15T00:00:00Z'
      }
    ];

    const mockInsights: HashtagInsight[] = [
      {
        id: '1',
        type: 'trending',
        hashtag: '#AITools',
        description: 'AI tools hashtag is trending with 150% increase in usage',
        recommendation: 'Consider incorporating AI-related content to capitalize on this trend',
        confidence: 85,
        createdAt: '2025-01-20T00:00:00Z'
      },
      {
        id: '2',
        type: 'declining',
        hashtag: '#OldSchoolMarketing',
        description: 'This hashtag has seen a 30% decrease in engagement over the past month',
        recommendation: 'Consider replacing with more current marketing hashtags',
        confidence: 72,
        createdAt: '2025-01-19T00:00:00Z'
      },
      {
        id: '3',
        type: 'emerging',
        hashtag: '#SustainableMarketing',
        description: 'New hashtag showing early signs of growth in eco-conscious marketing',
        recommendation: 'Test this hashtag in your next sustainability-focused post',
        confidence: 68,
        createdAt: '2025-01-18T00:00:00Z'
      }
    ];

    setHashtagPerformance(mockPerformance);
    setCampaigns(mockCampaigns);
    setInsights(mockInsights);
  }, []);

  const filteredPerformance = hashtagPerformance.filter(item => {
    const matchesPlatform = selectedPlatform === 'all' || item.platform === selectedPlatform;
    const matchesSearch = searchQuery === '' || 
      item.hashtag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlatform && matchesSearch;
  });

  const sortedPerformance = [...filteredPerformance].sort((a, b) => {
    switch (sortBy) {
      case 'engagement':
        return b.avgEngagementRate - a.avgEngagementRate;
      case 'reach':
        return b.totalReach - a.totalReach;
      case 'uses':
        return b.totalUses - a.totalUses;
      case 'trend':
        return a.trend === 'up' ? -1 : b.trend === 'up' ? 1 : 0;
      default:
        return 0;
    }
  });

  const paginatedPerformance = sortedPerformance.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUpIcon sx={{ color: 'success.main' }} />;
      case 'down':
        return <TrendingDown sx={{ color: 'error.main' }} />;
      default:
        return <TrendingFlatIcon sx={{ color: 'text.secondary' }} />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'success';
      case 'down':
        return 'error';
      default:
        return 'default';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trending':
        return <TrendingUpIcon sx={{ color: 'success.main' }} />;
      case 'declining':
        return <TrendingDown sx={{ color: 'error.main' }} />;
      case 'emerging':
        return <FlashOn sx={{ color: 'warning.main' }} />;
      case 'seasonal':
        return <CalendarToday sx={{ color: 'info.main' }} />;
      default:
        return <Info sx={{ color: 'text.secondary' }} />;
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box className={className} sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
        📊 Hashtag Performance Tracker
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
        Track which hashtags work best for your content. Analyze performance, 
        discover trends, and optimize your hashtag strategy for maximum engagement.
      </Typography>

      <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
        <Tab label="Performance Analytics" icon={<BarChart />} />
        <Tab label="Campaigns" icon={<Event />} />
        <Tab label="Insights" icon={<Lightbulb />} />
      </Tabs>

      {activeTab === 0 && (
        <Box>
          {/* Filters */}
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
                  <TextField
                    fullWidth
                    label="Search hashtags"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Sort by</InputLabel>
                    <Select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <MenuItem value="engagement">Engagement Rate</MenuItem>
                      <MenuItem value="reach">Total Reach</MenuItem>
                      <MenuItem value="uses">Total Uses</MenuItem>
                      <MenuItem value="trend">Trend</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Performance Table */}
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Hashtag</TableCell>
                    <TableCell>Platform</TableCell>
                    <TableCell align="right">Uses</TableCell>
                    <TableCell align="right">Reach</TableCell>
                    <TableCell align="right">Engagement</TableCell>
                    <TableCell align="right">Rate</TableCell>
                    <TableCell align="center">Trend</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedPerformance.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {item.hashtag}
                          </Typography>
                          <Chip 
                            label={item.category} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2">
                            {platforms.find(p => p.id === item.platform)?.icon}
                          </Typography>
                          <Typography variant="body2">
                            {platforms.find(p => p.id === item.platform)?.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          {item.totalUses.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          {item.totalReach.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          {item.totalEngagement.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2">
                            {item.avgEngagementRate}%
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={item.avgEngagementRate}
                            sx={{ width: 50, height: 4 }}
                            color={item.avgEngagementRate >= 5 ? 'success' : 'warning'}
                          />
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title={`Trend: ${item.trend}`}>
                          {getTrendIcon(item.trend)}
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small">
                          <Edit />
                        </IconButton>
                        <IconButton size="small">
                          <Analytics />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredPerformance.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Box>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Hashtag Campaigns</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
              >
                Create Campaign
              </Button>
            </Box>
          </Grid>

          {campaigns.map((campaign) => (
            <Grid item xs={12} md={6} key={campaign.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6">{campaign.name}</Typography>
                    <Chip 
                      label={campaign.status} 
                      color={campaign.status === 'active' ? 'success' : 'default'} 
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {campaign.startDate} - {campaign.endDate}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    {campaign.hashtags.map((hashtag, index) => (
                      <Chip key={index} label={hashtag} size="small" />
                    ))}
                  </Box>

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Total Posts
                      </Typography>
                      <Typography variant="h6">
                        {campaign.totalPosts}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Avg Engagement
                      </Typography>
                      <Typography variant="h6">
                        {campaign.avgEngagementRate}%
                      </Typography>
                    </Grid>
                  </Grid>

                  <Box sx={{ display: 'flex', gap: 1 }}>
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

      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              AI-Powered Insights
            </Typography>
          </Grid>

          {insights.map((insight) => (
            <Grid item xs={12} md={6} key={insight.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                    {getInsightIcon(insight.type)}
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {insight.hashtag}
                        <Chip 
                          label={insight.type} 
                          size="small" 
                          color={insight.type === 'trending' ? 'success' : insight.type === 'declining' ? 'error' : 'warning'}
                        />
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {insight.description}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {insight.confidence}% confidence
                    </Typography>
                  </Box>

                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      <strong>Recommendation:</strong> {insight.recommendation}
                    </Typography>
                  </Alert>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
