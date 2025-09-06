"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
  Avatar,
  ListItemAvatar
} from '@/lib/mui-optimized-imports';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  Analytics,
  BarChart,
  PieChart,
  ShowChart,
  Timeline,
  AutoAwesome,
  Psychology,
  MyLocation,
  Speed,
  Timer,
  FlashOn,
  Star,
  StarBorder,
  ExpandMore,
  ExpandLess,
  Refresh,
  Settings,
  ContentCopy,
  Schedule,
  CheckCircle,
  Warning,
  Error,
  Info,
  Lightbulb,
  Rocket,
  PlayArrow,
  Pause,
  Stop,
  Add,
  Edit,
  Delete,
  Visibility,
  MoreVert,
  AccountTree,
  Hub,
  AccountTree,
  Schema,
  DataObject,
  Code,
  IntegrationInstructions,
  Api,
  Webhook,
  Cloud,
  Storage,
  NetworkCheck,
  Router,
  Security,
  Shield,
  Encryption,
  VerifiedUser,
  Password,
  PersonAdd,
  DeviceHub,
  Compare,
  Assessment,
  Insights,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  Article,
  Create,
  Palette,
  Language,
  EmojiEmotions,
  ThumbUp,
  ThumbDown,
  Share,
  Bookmark,
  BookmarkBorder,
  Comment,
  Reply,
  Send,
  Search,
  FilterList,
  Sort,
  ViewList,
  ViewModule,
  GridView,
  List as ListIcon
} from '@/lib/mui-optimized-imports';
import { designTokens } from '@/lib/design-system';

interface ContentPiece {
  id: string;
  title: string;
  type: 'post' | 'video' | 'story' | 'reel' | 'article';
  platform: 'instagram' | 'tiktok' | 'youtube' | 'linkedin' | 'twitter';
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  aiScore: number;
  predictedPerformance: {
    engagement: number;
    reach: number;
    clicks: number;
    conversions: number;
  };
  actualPerformance?: {
    engagement: number;
    reach: number;
    clicks: number;
    conversions: number;
  };
  aiRecommendations: string[];
  optimizationHistory: OptimizationRecord[];
  tags: string[];
  createdAt: string;
  scheduledFor?: string;
  publishedAt?: string;
}

interface OptimizationRecord {
  id: string;
  type: 'title' | 'content' | 'timing' | 'targeting' | 'format';
  description: string;
  before: string;
  after: string;
  impact: 'positive' | 'negative' | 'neutral';
  appliedAt: string;
  aiConfidence: number;
}

interface ContentInsight {
  id: string;
  category: 'performance' | 'audience' | 'trending' | 'optimization';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  actionable: boolean;
  actionItems: string[];
  relatedContent: string[];
}

interface PerformancePrediction {
  contentId: string;
  title: string;
  predictedMetrics: {
    engagement: number;
    reach: number;
    clicks: number;
    conversions: number;
    virality: number;
  };
  confidence: number;
  factors: string[];
  recommendations: string[];
  riskFactors: string[];
}

export default function IntelligentContentOptimization() {
  const [activeTab, setActiveTab] = useState(0);
  const [contentPieces, setContentPieces] = useState<ContentPiece[]>([]);
  const [insights, setInsights] = useState<ContentInsight[]>([]);
  const [predictions, setPredictions] = useState<PerformancePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<ContentPiece | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showOptimizeDialog, setShowOptimizeDialog] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');
  const [showAIInsights, setShowAIInsights] = useState(true);
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Mock data
  useEffect(() => {
    if (!isLoading) {
      setContentPieces([
        {
          id: 'content-001',
          title: '10 AI Tools That Will Transform Your Business in 2024',
          type: 'article',
          platform: 'linkedin',
          status: 'published',
          aiScore: 92.5,
          predictedPerformance: {
            engagement: 8.7,
            reach: 15420,
            clicks: 1234,
            conversions: 89
          },
          actualPerformance: {
            engagement: 9.2,
            reach: 16890,
            clicks: 1345,
            conversions: 102
          },
          aiRecommendations: [
            'Add more visual elements to increase engagement',
            'Include specific case studies for better credibility',
            'Optimize for mobile reading experience'
          ],
          optimizationHistory: [
            {
              id: 'opt-001',
              type: 'title',
              description: 'Enhanced title with power words',
              before: 'AI Tools for Business',
              after: '10 AI Tools That Will Transform Your Business in 2024',
              impact: 'positive',
              appliedAt: '2024-01-14T10:30:00Z',
              aiConfidence: 94.2
            }
          ],
          tags: ['AI', 'Business', 'Technology', 'Innovation'],
          createdAt: '2024-01-14T09:00:00Z',
          publishedAt: '2024-01-15T08:00:00Z'
        },
        {
          id: 'content-002',
          title: 'Behind the Scenes: How We Built Our AI-Powered Platform',
          type: 'video',
          platform: 'youtube',
          status: 'scheduled',
          aiScore: 88.3,
          predictedPerformance: {
            engagement: 7.8,
            reach: 8900,
            clicks: 567,
            conversions: 34
          },
          aiRecommendations: [
            'Add captions for better accessibility',
            'Include timestamps for key sections',
            'Create a compelling thumbnail with text overlay'
          ],
          optimizationHistory: [],
          tags: ['Behind the Scenes', 'AI Platform', 'Development', 'Startup'],
          createdAt: '2024-01-15T11:00:00Z',
          scheduledFor: '2024-01-16T18:00:00Z'
        },
        {
          id: 'content-003',
          title: 'Quick Tip: Use AI to Generate Engaging Social Media Captions',
          type: 'post',
          platform: 'instagram',
          status: 'draft',
          aiScore: 85.7,
          predictedPerformance: {
            engagement: 6.9,
            reach: 5600,
            clicks: 234,
            conversions: 12
          },
          aiRecommendations: [
            'Add relevant hashtags for better discoverability',
            'Include a call-to-action in the caption',
            'Use emojis strategically to increase engagement'
          ],
          optimizationHistory: [],
          tags: ['Quick Tip', 'AI', 'Social Media', 'Captions'],
          createdAt: '2024-01-15T14:30:00Z'
        }
      ]);

      setInsights([
        {
          id: 'insight-001',
          category: 'performance',
          title: 'LinkedIn Articles Outperform Other Content Types',
          description: 'Your LinkedIn articles show 23% higher engagement than other content formats. Consider increasing article frequency.',
          priority: 'high',
          confidence: 89.5,
          actionable: true,
          actionItems: [
            'Increase LinkedIn article frequency to 2-3 per week',
            'Repurpose successful articles for other platforms',
            'Focus on business and technology topics'
          ],
          relatedContent: ['content-001']
        },
        {
          id: 'insight-002',
          category: 'audience',
          title: 'AI and Technology Content Drives Highest Engagement',
          description: 'Content related to AI and technology generates 45% more engagement than other topics.',
          priority: 'medium',
          confidence: 76.8,
          actionable: true,
          actionItems: [
            'Increase AI/tech content to 60% of total',
            'Create more how-to and tutorial content',
            'Partner with AI experts for guest content'
          ],
          relatedContent: ['content-001', 'content-002']
        },
        {
          id: 'insight-003',
          category: 'trending',
          title: 'Video Content Engagement Rising',
          description: 'Video content engagement has increased by 18% in the last 30 days.',
          priority: 'medium',
          confidence: 82.3,
          actionable: true,
          actionItems: [
            'Increase video content production',
            'Focus on educational and behind-the-scenes content',
            'Optimize video thumbnails and descriptions'
          ],
          relatedContent: ['content-002']
        }
      ]);

      setPredictions([
        {
          contentId: 'content-002',
          title: 'Behind the Scenes: How We Built Our AI-Powered Platform',
          predictedMetrics: {
            engagement: 7.8,
            reach: 8900,
            clicks: 567,
            conversions: 34,
            virality: 3.2
          },
          confidence: 88.3,
          factors: [
            'High-quality production value',
            'Behind-the-scenes content performs well',
            'AI topic has high interest',
            'YouTube algorithm favors educational content'
          ],
          recommendations: [
            'Add timestamps for better user experience',
            'Include call-to-action in video description',
            'Create engaging thumbnail with text overlay',
            'Post during peak viewing hours (6-9 PM)'
          ],
          riskFactors: [
            'Video length might be too long for mobile viewers',
            'Competition from similar content is high',
            'Seasonal content might affect long-term performance'
          ]
        }
      ]);
    }
  }, [isLoading]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'success';
      case 'scheduled': return 'info';
      case 'draft': return 'warning';
      case 'archived': return 'default';
      default: return 'default';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'instagram': return 'pink';
      case 'tiktok': return 'black';
      case 'youtube': return 'error';
      case 'linkedin': return 'primary';
      case 'twitter': return 'info';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'success';
      case 'medium': return 'info';
      case 'high': return 'warning';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance': return <TrendingUp />;
              case 'audience': return <MyLocation />;
      case 'trending': return <TrendingUpIcon />;
      case 'optimization': return <Settings />;
      default: return <Info />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getPerformanceColor = (value: number, threshold: number) => {
    return value >= threshold ? 'success' : value >= threshold * 0.8 ? 'warning' : 'error';
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3, color: 'text.primary' }}>
          Intelligent Content Optimization
        </Typography>
        <Grid container spacing={3}>
          {[1, 2, 3].map((item) => (
            <Grid key={item} xs={12} md={6} lg={4}>
              <Skeleton variant="rectangular" height={200} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: 'text.primary' }}>
          Intelligent Content Optimization
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setShowCreateDialog(true)}
          sx={{
            backgroundColor: designTokens.colors.ai[600],
            '&:hover': { backgroundColor: designTokens.colors.ai[700] }
          }}
        >
          Create Content
        </Button>
      </Box>

      {showAIInsights && (
        <Alert 
          severity="info" 
          sx={{ mb: 3, backgroundColor: designTokens.colors.ai[50], borderColor: designTokens.colors.ai[200] }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={() => setShowAIInsights(false)}
            >
              Dismiss
            </Button>
          }
        >
          <AlertTitle>AI Content Intelligence Active</AlertTitle>
          Your content is being continuously analyzed and optimized. Current AI score: <strong>88.8%</strong>
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="Content Library" />
          <Tab label="AI Insights" />
          <Tab label="Performance Predictions" />
          <Tab label="Optimization History" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <>
          <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Platform</InputLabel>
              <Select
                value={filterPlatform}
                label="Platform"
                onChange={(e) => setFilterPlatform(e.target.value)}
              >
                <MenuItem value="all">All Platforms</MenuItem>
                <MenuItem value="instagram">Instagram</MenuItem>
                <MenuItem value="tiktok">TikTok</MenuItem>
                <MenuItem value="youtube">YouTube</MenuItem>
                <MenuItem value="linkedin">LinkedIn</MenuItem>
                <MenuItem value="twitter">Twitter</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                label="Status"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="scheduled">Scheduled</MenuItem>
                <MenuItem value="published">Published</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Grid container spacing={3}>
            {contentPieces.map((content) => (
              <Grid key={content.id} xs={12} md={6} lg={4}>
                <Fade in timeout={500}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 8,
                        borderColor: designTokens.colors.ai[300]
                      },
                      border: `1px solid ${theme.palette.divider}`
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ color: 'text.primary', mb: 1 }}>
                            {content.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                            {content.type.charAt(0).toUpperCase() + content.type.slice(1)} • {content.platform.charAt(0).toUpperCase() + content.platform.slice(1)}
                          </Typography>
                        </Box>
                        <IconButton size="small">
                          <MoreVert />
                        </IconButton>
                      </Box>

                      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        <Chip 
                          label={content.status} 
                          color={getStatusColor(content.status) as any}
                          size="small"
                        />
                        <Chip 
                          label={content.platform} 
                          color={getPlatformColor(content.platform) as any}
                          size="small"
                          variant="outlined"
                        />
                        <Chip 
                          label={`AI: ${content.aiScore}%`}
                          color="primary"
                          size="small"
                          icon={<Psychology />}
                        />
                      </Stack>

                      {content.actualPerformance && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                            Actual Performance
                          </Typography>
                          <Grid container spacing={1}>
                            <Grid xs={6}>
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                Engagement
                              </Typography>
                              <Typography variant="body2" sx={{ color: designTokens.colors.success[600] }}>
                                {content.actualPerformance.engagement}%
                              </Typography>
                            </Grid>
                            <Grid xs={6}>
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                Reach
                              </Typography>
                              <Typography variant="body2" sx={{ color: designTokens.colors.info[600] }}>
                                {content.actualPerformance.reach.toLocaleString()}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Box>
                      )}

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                          Predicted Performance
                        </Typography>
                        <Grid container spacing={1}>
                          <Grid xs={6}>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              Engagement
                            </Typography>
                            <Typography variant="body2" sx={{ color: designTokens.colors.success[600] }}>
                              {content.predictedPerformance.engagement}%
                            </Typography>
                          </Grid>
                          <Grid xs={6}>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              Reach
                            </Typography>
                            <Typography variant="body2" sx={{ color: designTokens.colors.info[600] }}>
                              {content.predictedPerformance.reach.toLocaleString()}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {content.status === 'published' ? `Published: ${formatDate(content.publishedAt!)}` : 
                           content.status === 'scheduled' ? `Scheduled: ${formatDate(content.scheduledFor!)}` : 
                           `Created: ${formatDate(content.createdAt)}`}
                        </Typography>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => setSelectedContent(content)}
                        >
                          View Details
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          {insights.map((insight) => (
            <Grid key={insight.id} xs={12} md={6} lg={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ color: designTokens.colors.ai[600] }}>
                        {getCategoryIcon(insight.category)}
                      </Box>
                      <Typography variant="h6" sx={{ color: 'text.primary' }}>
                        {insight.title}
                      </Typography>
                    </Box>
                    <Chip 
                      label={insight.priority} 
                      color={getPriorityColor(insight.priority) as any}
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                    {insight.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                      AI Confidence: {insight.confidence}%
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={insight.confidence} 
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>

                  {insight.actionable && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: 'text.primary', mb: 1, fontWeight: 'medium' }}>
                        Action Items:
                      </Typography>
                      <List dense>
                        {insight.actionItems.slice(0, 2).map((action, index) => (
                          <ListItem key={index} sx={{ py: 0 }}>
                            <ListItemIcon sx={{ minWidth: 24 }}>
                              <CheckCircle sx={{ fontSize: 16, color: designTokens.colors.success[600] }} />
                            </ListItemIcon>
                            <ListItemText 
                              primary={action} 
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}

                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Lightbulb />}
                    fullWidth
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3}>
          {predictions.map((prediction, index) => (
            <Grid key={index} xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                    {prediction.title}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                      AI Confidence: {prediction.confidence}%
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={prediction.confidence} 
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid xs={6}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Predicted Engagement
                      </Typography>
                      <Typography variant="h6" sx={{ color: designTokens.colors.success[600] }}>
                        {prediction.predictedMetrics.engagement}%
                      </Typography>
                    </Grid>
                    <Grid xs={6}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Predicted Reach
                      </Typography>
                      <Typography variant="h6" sx={{ color: designTokens.colors.info[600] }}>
                        {prediction.predictedMetrics.reach.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid xs={6}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Predicted Clicks
                      </Typography>
                      <Typography variant="h6" sx={{ color: designTokens.colors.warning[600] }}>
                        {prediction.predictedMetrics.clicks}
                      </Typography>
                    </Grid>
                    <Grid xs={6}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Virality Score
                      </Typography>
                      <Typography variant="h6" sx={{ color: designTokens.colors.error[600] }}>
                        {prediction.predictedMetrics.virality}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.primary', mb: 1, fontWeight: 'medium' }}>
                      Key Factors:
                    </Typography>
                    <List dense>
                      {prediction.factors.slice(0, 2).map((factor, index) => (
                        <ListItem key={index} sx={{ py: 0 }}>
                          <ListItemIcon sx={{ minWidth: 24 }}>
                            <TrendingUp sx={{ fontSize: 16, color: designTokens.colors.success[600] }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={factor} 
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>

                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<Psychology />}
                    fullWidth
                    sx={{ backgroundColor: designTokens.colors.ai[600] }}
                  >
                    View Full Analysis
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 3 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Content</TableCell>
                <TableCell>Optimization Type</TableCell>
                <TableCell>Impact</TableCell>
                <TableCell>AI Confidence</TableCell>
                <TableCell>Applied</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contentPieces.flatMap(content => 
                content.optimizationHistory.map(optimization => (
                  <TableRow key={optimization.id}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {content.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={optimization.type} 
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={optimization.impact} 
                        color={optimization.impact === 'positive' ? 'success' : 
                               optimization.impact === 'negative' ? 'error' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">
                          {optimization.aiConfidence}%
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={optimization.aiConfidence} 
                          sx={{ width: 60, height: 6 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      {formatDate(optimization.appliedAt)}
                    </TableCell>
                    <TableCell>
                      <IconButton size="small">
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create Content Dialog */}
      <Dialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Content</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid xs={12}>
              <TextField
                fullWidth
                label="Content Title"
                placeholder="Enter content title"
              />
            </Grid>
            <Grid xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Content Description"
                placeholder="Describe your content"
              />
            </Grid>
            <Grid xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Content Type</InputLabel>
                <Select label="Content Type">
                  <MenuItem value="post">Post</MenuItem>
                  <MenuItem value="video">Video</MenuItem>
                  <MenuItem value="story">Story</MenuItem>
                  <MenuItem value="reel">Reel</MenuItem>
                  <MenuItem value="article">Article</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Platform</InputLabel>
                <Select label="Platform">
                  <MenuItem value="instagram">Instagram</MenuItem>
                  <MenuItem value="tiktok">TikTok</MenuItem>
                  <MenuItem value="youtube">YouTube</MenuItem>
                  <MenuItem value="linkedin">LinkedIn</MenuItem>
                  <MenuItem value="twitter">Twitter</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Enable AI optimization and recommendations"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateDialog(false)}>Cancel</Button>
          <Button 
            variant="contained"
            onClick={() => setShowCreateDialog(false)}
            sx={{ backgroundColor: designTokens.colors.ai[600] }}
          >
            Create Content
          </Button>
        </DialogActions>
      </Dialog>

      {/* Content Details Dialog */}
      {selectedContent && (
        <Dialog open={!!selectedContent} onClose={() => setSelectedContent(null)} maxWidth="md" fullWidth>
          <DialogTitle>{selectedContent.title}</DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {selectedContent.type.charAt(0).toUpperCase() + selectedContent.type.slice(1)} • {selectedContent.platform.charAt(0).toUpperCase() + selectedContent.platform.slice(1)}
            </Typography>
            
            <Grid container spacing={2}>
              <Grid xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 1 }}>AI Recommendations</Typography>
                <List dense>
                  {selectedContent.aiRecommendations.map((recommendation, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <Lightbulb sx={{ fontSize: 16, color: designTokens.colors.ai[600] }} />
                      </ListItemIcon>
                      <ListItemText primary={recommendation} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
              <Grid xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 1 }}>Tags</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedContent.tags.map((tag, index) => (
                    <Chip key={index} label={tag} size="small" variant="outlined" />
                  ))}
                </Box>
              </Grid>
            </Grid>

            {selectedContent.optimizationHistory.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>Optimization History</Typography>
                <List dense>
                  {selectedContent.optimizationHistory.map((optimization, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <Settings sx={{ fontSize: 16, color: designTokens.colors.ai[600] }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={optimization.description}
                        secondary={`${optimization.before} → ${optimization.after}`}
                      />
                      <Chip 
                        label={optimization.impact} 
                        color={optimization.impact === 'positive' ? 'success' : 
                               optimization.impact === 'negative' ? 'error' : 'default'}
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedContent(null)}>Close</Button>
            <Button 
              variant="contained"
              onClick={() => setShowOptimizeDialog(true)}
              sx={{ backgroundColor: designTokens.colors.ai[600] }}
            >
              Optimize with AI
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* AI Optimization Dialog */}
      <Dialog open={showOptimizeDialog} onClose={() => setShowOptimizeDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>AI Content Optimization</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Our AI will analyze your content and suggest optimizations for:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Create sx={{ color: designTokens.colors.ai[600] }} />
              </ListItemIcon>
              <ListItemText primary="Content structure and flow" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Palette sx={{ color: designTokens.colors.ai[600] }} />
              </ListItemIcon>
              <ListItemText primary="Visual elements and formatting" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <MyLocation sx={{ color: designTokens.colors.ai[600] }} />
              </ListItemIcon>
              <ListItemText primary="Audience targeting and engagement" />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowOptimizeDialog(false)}>Cancel</Button>
          <Button 
            variant="contained"
            onClick={() => setShowOptimizeDialog(false)}
            sx={{ backgroundColor: designTokens.colors.ai[600] }}
          >
            Start Optimization
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
