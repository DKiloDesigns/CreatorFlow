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
  ListItemAvatar,
  Tabs,
  Tab
} from '@mui/material';
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
  Workflow,
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
  Firewall,
  Antivirus,
  Encryption,
  TwoFactorAuth,
  Password,
  UserCheck,
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
  List as ListIcon,
  CalendarToday,
  AccessTime,
  Event,
  Schedule as ScheduleIcon,
  Notifications,
  NotificationsActive,
  NotificationsOff,
  TrendingUp as TrendingUpIcon2,
  TrendingDown as TrendingDownIcon2,
  TrendingFlat as TrendingFlatIcon2,
  ShowChart as ShowChartIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
  DataUsage,
  Storage as StorageIcon,
  Cloud as CloudIcon,
  Security,
  Shield,
  Lock,
  Unlock,
  VpnKey,
  Fingerprint,
  VerifiedUser,
  AdminPanelSettings,
  SecurityUpdate,
  Update,
  Download,
  Upload,
  Sync,
  Autorenew,
  Cached,
  Loop,
  RotateRight,
  RotateLeft,
  Rotate90DegreesCcw,
  Rotate90DegreesCw,
  Flip,
  FlipToBack,
  FlipToFront,
  Transform,
  Crop,
  CropFree,
  CropSquare,
  Crop169,
  Crop32,
  Crop54,
  Crop75,
  CropDin,
  CropPortrait,
  CropLandscape,
  CropRotate,
  CropSquare as CropSquareIcon,
  Crop169 as Crop169Icon,
  Crop32 as Crop32Icon,
  Crop54 as Crop54Icon,
  Crop75 as Crop75Icon,
  CropDin as CropDinIcon,
  CropPortrait as CropPortraitIcon,
  CropLandscape as CropLandscapeIcon,
  CropRotate as CropRotateIcon
} from '@mui/icons-material';
import { designTokens } from '@/lib/design-system';

interface PredictionModel {
  id: string;
  name: string;
  category: 'revenue' | 'audience' | 'content' | 'marketing' | 'trending';
  status: 'active' | 'training' | 'testing' | 'archived';
  accuracy: number;
  lastUpdated: string;
  nextUpdate: string;
  confidence: number;
  dataPoints: number;
  features: string[];
  performance: {
    mse: number;
    mae: number;
    r2: number;
    precision: number;
    recall: number;
  };
  predictions: Prediction[];
}

interface Prediction {
  id: string;
  modelId: string;
  target: string;
  predictedValue: number;
  actualValue?: number;
  confidence: number;
  timestamp: string;
  horizon: '1d' | '7d' | '30d' | '90d' | '1y';
  factors: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  trend: 'up' | 'down' | 'stable' | 'volatile';
}

interface TrendForecast {
  id: string;
  metric: string;
  currentValue: number;
  forecastedValues: {
    '1d': number;
    '7d': number;
    '30d': number;
    '90d': number;
    '1y': number;
  };
  confidence: number;
  seasonality: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  trend: 'linear' | 'exponential' | 'logarithmic' | 'polynomial';
  anomalies: string[];
  recommendations: string[];
}

interface BusinessIntelligence {
  id: string;
  category: 'revenue' | 'growth' | 'efficiency' | 'risk' | 'opportunity';
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  confidence: number;
  timeframe: string;
  metrics: {
    current: number;
    predicted: number;
    change: number;
    changePercent: number;
  };
  actions: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export default function PredictiveAnalyticsEngine() {
  const [activeTab, setActiveTab] = useState(0);
  const [predictionModels, setPredictionModels] = useState<PredictionModel[]>([]);
  const [trendForecasts, setTrendForecasts] = useState<TrendForecast[]>([]);
  const [businessIntelligence, setBusinessIntelligence] = useState<BusinessIntelligence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState<PredictionModel | null>(null);
  const [showCreateModelDialog, setShowCreateModelDialog] = useState(false);
  const [showForecastDialog, setShowForecastDialog] = useState(false);
  const [timeRange, setTimeRange] = useState('30d');
  const [showAIInsights, setShowAIInsights] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('all');
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
      setPredictionModels([
        {
          id: 'model-001',
          name: 'Revenue Forecasting Model',
          category: 'revenue',
          status: 'active',
          accuracy: 94.2,
          lastUpdated: '2024-01-15T10:00:00Z',
          nextUpdate: '2024-01-16T10:00:00Z',
          confidence: 91.5,
          dataPoints: 15420,
          features: ['Historical Revenue', 'Seasonality', 'Marketing Spend', 'Audience Growth', 'Content Performance'],
          performance: {
            mse: 0.023,
            mae: 0.156,
            r2: 0.942,
            precision: 0.938,
            recall: 0.945
          },
          predictions: [
            {
              id: 'pred-001',
              modelId: 'model-001',
              target: 'Daily Revenue',
              predictedValue: 15420,
              actualValue: 15890,
              confidence: 91.5,
              timestamp: '2024-01-15T00:00:00Z',
              horizon: '1d',
              factors: ['Strong weekend performance', 'New product launch', 'Increased marketing spend'],
              riskLevel: 'low',
              trend: 'up'
            }
          ]
        },
        {
          id: 'model-002',
          name: 'Audience Growth Predictor',
          category: 'audience',
          status: 'active',
          accuracy: 89.7,
          lastUpdated: '2024-01-15T12:00:00Z',
          nextUpdate: '2024-01-16T12:00:00Z',
          confidence: 87.3,
          dataPoints: 8900,
          features: ['Content Engagement', 'Platform Growth', 'Viral Content', 'Seasonal Trends', 'Competitor Analysis'],
          performance: {
            mse: 0.045,
            mae: 0.234,
            r2: 0.897,
            precision: 0.891,
            recall: 0.903
          },
          predictions: [
            {
              id: 'pred-002',
              modelId: 'model-002',
              target: 'Weekly Followers',
              predictedValue: 8900,
              confidence: 87.3,
              timestamp: '2024-01-15T00:00:00Z',
              horizon: '7d',
              factors: ['High engagement content', 'Viral post potential', 'Platform algorithm favor'],
              riskLevel: 'medium',
              trend: 'up'
            }
          ]
        },
        {
          id: 'model-003',
          name: 'Content Performance Predictor',
          category: 'content',
          status: 'training',
          accuracy: 82.1,
          lastUpdated: '2024-01-14T15:00:00Z',
          nextUpdate: '2024-01-16T15:00:00Z',
          confidence: 78.9,
          dataPoints: 5600,
          features: ['Content Type', 'Topic', 'Timing', 'Audience Demographics', 'Historical Performance'],
          performance: {
            mse: 0.067,
            mae: 0.345,
            r2: 0.821,
            precision: 0.815,
            recall: 0.828
          },
          predictions: []
        }
      ]);

      setTrendForecasts([
        {
          id: 'forecast-001',
          metric: 'Daily Active Users',
          currentValue: 15420,
          forecastedValues: {
            '1d': 15890,
            '7d': 16200,
            '30d': 17500,
            '90d': 18900,
            '1y': 22500
          },
          confidence: 91.5,
          seasonality: 'weekly',
          trend: 'exponential',
          anomalies: ['Holiday spike expected', 'Seasonal dip in Q2'],
          recommendations: [
            'Increase content frequency during peak days',
            'Prepare for holiday season surge',
            'Optimize for weekend engagement'
          ]
        },
        {
          id: 'forecast-002',
          metric: 'Content Engagement Rate',
          currentValue: 8.7,
          forecastedValues: {
            '1d': 8.9,
            '7d': 9.2,
            '30d': 9.8,
            '90d': 10.5,
            '1y': 12.1
          },
          confidence: 87.3,
          seasonality: 'monthly',
          trend: 'linear',
          anomalies: ['Summer engagement dip', 'Year-end surge'],
          recommendations: [
            'Focus on high-engagement content types',
            'Optimize posting times for target audience',
            'A/B test content formats'
          ]
        }
      ]);

      setBusinessIntelligence([
        {
          id: 'bi-001',
          category: 'revenue',
          title: 'Revenue Growth Acceleration',
          description: 'Revenue growth is accelerating faster than predicted, driven by increased content engagement and new product launches.',
          impact: 'positive',
          confidence: 94.2,
          timeframe: 'Next 30 days',
          metrics: {
            current: 15420,
            predicted: 17500,
            change: 2080,
            changePercent: 13.5
          },
          actions: [
            'Increase marketing spend on high-performing channels',
            'Accelerate new product development',
            'Scale successful content strategies'
          ],
          priority: 'high'
        },
        {
          id: 'bi-002',
          category: 'opportunity',
          title: 'Untapped Audience Segments',
          description: 'AI analysis reveals 3 new high-value audience segments with minimal competition and high conversion potential.',
          impact: 'positive',
          confidence: 87.3,
          timeframe: 'Next 90 days',
          metrics: {
            current: 8900,
            predicted: 12500,
            change: 3600,
            changePercent: 40.4
          },
          actions: [
            'Develop targeted content for new segments',
            'Create segment-specific marketing campaigns',
            'Optimize platform presence for new audiences'
          ],
          priority: 'medium'
        },
        {
          id: 'bi-003',
          category: 'risk',
          title: 'Seasonal Performance Dip',
          description: 'Historical data suggests a 15-20% performance dip in Q2. Early preparation can minimize impact.',
          impact: 'negative',
          confidence: 82.1,
          timeframe: 'Q2 2024',
          metrics: {
            current: 15420,
            predicted: 12336,
            change: -3084,
            changePercent: -20.0
          },
          actions: [
            'Develop seasonal content strategy',
            'Increase marketing spend during dip period',
            'Focus on evergreen content creation'
          ],
          priority: 'high'
        }
      ]);
    }
  }, [isLoading]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'training': return 'warning';
      case 'testing': return 'info';
      case 'archived': return 'default';
      default: return 'default';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'revenue': return 'success';
      case 'audience': return 'info';
      case 'content': return 'warning';
      case 'marketing': return 'primary';
      case 'trending': return 'secondary';
      default: return 'default';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'success';
      case 'negative': return 'error';
      case 'neutral': return 'default';
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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp sx={{ color: designTokens.colors.success[600] }} />;
      case 'down': return <TrendingDown sx={{ color: designTokens.colors.error[600] }} />;
      case 'stable': return <TrendingFlat sx={{ color: designTokens.colors.info[600] }} />;
      case 'volatile': return <ShowChart sx={{ color: designTokens.colors.warning[600] }} />;
      default: return <TrendingFlat />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3, color: designTokens.colors.text.primary }}>
          Predictive Analytics Engine
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
        <Typography variant="h4" sx={{ color: designTokens.colors.text.primary }}>
          Predictive Analytics Engine
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setShowCreateModelDialog(true)}
          sx={{
            backgroundColor: designTokens.colors.ai[600],
            '&:hover': { backgroundColor: designTokens.colors.ai[700] }
          }}
        >
          Create Model
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
          <AlertTitle>AI Predictive Intelligence Active</AlertTitle>
          Your predictive models are continuously learning and improving. Overall accuracy: <strong>88.7%</strong>
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="Prediction Models" />
          <Tab label="Trend Forecasts" />
          <Tab label="Business Intelligence" />
          <Tab label="Model Performance" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <>
          <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={filterCategory}
                label="Category"
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="revenue">Revenue</MenuItem>
                <MenuItem value="audience">Audience</MenuItem>
                <MenuItem value="content">Content</MenuItem>
                <MenuItem value="marketing">Marketing</MenuItem>
                <MenuItem value="trending">Trending</MenuItem>
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
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="training">Training</MenuItem>
                <MenuItem value="testing">Testing</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Grid container spacing={3}>
            {predictionModels.map((model) => (
              <Grid key={model.id} xs={12} md={6} lg={4}>
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
                      border: `1px solid ${designTokens.colors.border}`
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" sx={{ color: designTokens.colors.text.primary, mb: 1 }}>
                            {model.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: designTokens.colors.text.secondary, mb: 2 }}>
                            {model.category.charAt(0).toUpperCase() + model.category.slice(1)} • {model.dataPoints.toLocaleString()} data points
                          </Typography>
                        </Box>
                        <IconButton size="small">
                          <MoreVert />
                        </IconButton>
                      </Box>

                      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        <Chip 
                          label={model.status} 
                          color={getStatusColor(model.status) as any}
                          size="small"
                        />
                        <Chip 
                          label={model.category} 
                          color={getCategoryColor(model.category) as any}
                          size="small"
                          variant="outlined"
                        />
                        <Chip 
                          label={`${model.accuracy}%`}
                          color="primary"
                          size="small"
                          icon={<Psychology />}
                        />
                      </Stack>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ color: designTokens.colors.text.secondary, mb: 1 }}>
                          Model Performance
                        </Typography>
                        <Grid container spacing={1}>
                          <Grid xs={6}>
                            <Typography variant="caption" sx={{ color: designTokens.colors.text.secondary }}>
                              R² Score
                            </Typography>
                            <Typography variant="body2" sx={{ color: designTokens.colors.success[600] }}>
                              {model.performance.r2}
                            </Typography>
                          </Grid>
                          <Grid xs={6}>
                            <Typography variant="caption" sx={{ color: designTokens.colors.text.secondary }}>
                              Confidence
                            </Typography>
                            <Typography variant="body2" sx={{ color: designTokens.colors.info[600] }}>
                              {model.confidence}%
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ color: designTokens.colors.text.secondary, mb: 1 }}>
                          Features
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {model.features.slice(0, 3).map((feature, index) => (
                            <Chip 
                              key={index} 
                              label={feature} 
                              size="small" 
                              variant="outlined"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          ))}
                          {model.features.length > 3 && (
                            <Chip 
                              label={`+${model.features.length - 3} more`} 
                              size="small" 
                              variant="outlined"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" sx={{ color: designTokens.colors.text.secondary }}>
                          Updated: {formatDate(model.lastUpdated)}
                        </Typography>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => setSelectedModel(model)}
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
          {trendForecasts.map((forecast) => (
            <Grid key={forecast.id} xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ color: designTokens.colors.text.primary, mb: 1 }}>
                        {forecast.metric}
                      </Typography>
                      <Typography variant="body2" sx={{ color: designTokens.colors.text.secondary, mb: 2 }}>
                        Current: {formatNumber(forecast.current)} • Confidence: {forecast.confidence}%
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getTrendIcon(forecast.trend)}
                      <Chip 
                        label={forecast.trend} 
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: designTokens.colors.text.primary, mb: 1, fontWeight: 'medium' }}>
                      Forecasted Values
                    </Typography>
                    <Grid container spacing={2}>
                      {Object.entries(forecast.forecastedValues).map(([horizon, value]) => (
                        <Grid key={horizon} xs={4}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" sx={{ color: designTokens.colors.text.secondary }}>
                              {horizon}
                            </Typography>
                            <Typography variant="h6" sx={{ color: designTokens.colors.info[600] }}>
                              {formatNumber(value)}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: designTokens.colors.text.primary, mb: 1, fontWeight: 'medium' }}>
                      Recommendations
                    </Typography>
                    <List dense>
                      {forecast.recommendations.slice(0, 2).map((recommendation, index) => (
                        <ListItem key={index} sx={{ py: 0 }}>
                          <ListItemIcon sx={{ minWidth: 24 }}>
                            <Lightbulb sx={{ fontSize: 16, color: designTokens.colors.ai[600] }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={recommendation} 
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>

                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<ShowChart />}
                    fullWidth
                    sx={{ backgroundColor: designTokens.colors.ai[600] }}
                  >
                    View Full Forecast
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3}>
          {businessIntelligence.map((insight) => (
            <Grid key={insight.id} xs={12} md={6} lg={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ color: designTokens.colors.text.primary, mb: 1 }}>
                        {insight.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: designTokens.colors.text.secondary, mb: 2 }}>
                        {insight.description}
                      </Typography>
                    </Box>
                    <Chip 
                      label={insight.priority} 
                      color={getPriorityColor(insight.priority) as any}
                      size="small"
                    />
                  </Box>

                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip 
                      label={insight.impact} 
                      color={getImpactColor(insight.impact) as any}
                      size="small"
                      variant="outlined"
                    />
                    <Chip 
                      label={`${insight.confidence}%`}
                      color="primary"
                      size="small"
                      icon={<Psychology />}
                    />
                  </Stack>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: designTokens.colors.text.primary, mb: 1, fontWeight: 'medium' }}>
                      Predicted Change
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ color: designTokens.colors.text.primary }}>
                          {formatNumber(insight.metrics.current)}
                        </Typography>
                        <Typography variant="caption" sx={{ color: designTokens.colors.text.secondary }}>
                          Current
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ color: designTokens.colors.info[600] }}>
                          {formatNumber(insight.metrics.predicted)}
                        </Typography>
                        <Typography variant="caption" sx={{ color: designTokens.colors.text.secondary }}>
                          Predicted
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ 
                          color: insight.metrics.changePercent >= 0 ? 
                            designTokens.colors.success[600] : 
                            designTokens.colors.error[600] 
                        }}>
                          {insight.metrics.changePercent >= 0 ? '+' : ''}{insight.metrics.changePercent}%
                        </Typography>
                        <Typography variant="caption" sx={{ color: designTokens.colors.text.secondary }}>
                          Change
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: designTokens.colors.text.primary, mb: 1, fontWeight: 'medium' }}>
                      Action Items:
                    </Typography>
                    <List dense>
                      {insight.actions.slice(0, 2).map((action, index) => (
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

                  <Typography variant="caption" sx={{ color: designTokens.colors.text.secondary }}>
                    Timeframe: {insight.timeframe}
                  </Typography>
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
                <TableCell>Model</TableCell>
                <TableCell>Accuracy</TableCell>
                <TableCell>R² Score</TableCell>
                <TableCell>Precision</TableCell>
                <TableCell>Recall</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {predictionModels.map((model) => (
                <TableRow key={model.id}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {model.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">
                        {model.accuracy}%
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={model.accuracy} 
                        sx={{ width: 60, height: 6 }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ 
                      color: model.performance.r2 >= 0.9 ? 'success.main' : 
                             model.performance.r2 >= 0.8 ? 'warning.main' : 'error.main'
                    }}>
                      {model.performance.r2}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {model.performance.precision}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {model.performance.recall}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={model.status} 
                      color={getStatusColor(model.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <Visibility />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create Model Dialog */}
      <Dialog open={showCreateModelDialog} onClose={() => setShowCreateModelDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Prediction Model</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid xs={12}>
              <TextField
                fullWidth
                label="Model Name"
                placeholder="Enter model name"
              />
            </Grid>
            <Grid xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                placeholder="Describe your prediction model"
              />
            </Grid>
            <Grid xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select label="Category">
                  <MenuItem value="revenue">Revenue</MenuItem>
                  <MenuItem value="audience">Audience</MenuItem>
                  <MenuItem value="content">Content</MenuItem>
                  <MenuItem value="marketing">Marketing</MenuItem>
                  <MenuItem value="trending">Trending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Initial Status</InputLabel>
                <Select label="Initial Status">
                  <MenuItem value="training">Training</MenuItem>
                  <MenuItem value="testing">Testing</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Enable continuous learning and optimization"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateModelDialog(false)}>Cancel</Button>
          <Button 
            variant="contained"
            onClick={() => setShowCreateModelDialog(false)}
            sx={{ backgroundColor: designTokens.colors.ai[600] }}
          >
            Create Model
          </Button>
        </DialogActions>
      </Dialog>

      {/* Model Details Dialog */}
      {selectedModel && (
        <Dialog open={!!selectedModel} onClose={() => setSelectedModel(null)} maxWidth="md" fullWidth>
          <DialogTitle>{selectedModel.name}</DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {selectedModel.category.charAt(0).toUpperCase() + selectedModel.category.slice(1)} • {selectedModel.dataPoints.toLocaleString()} data points
            </Typography>
            
            <Grid container spacing={2}>
              <Grid xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 1 }}>Performance Metrics</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <TrendingUp sx={{ fontSize: 16, color: designTokens.colors.success[600] }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={`R² Score: ${selectedModel.performance.r2}`}
                      secondary="Coefficient of determination"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Speed sx={{ fontSize: 16, color: designTokens.colors.info[600] }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={`Precision: ${selectedModel.performance.precision}`}
                      secondary="Model precision"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                                              <MyLocation sx={{ fontSize: 16, color: designTokens.colors.warning[600] }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={`Recall: ${selectedModel.performance.recall}`}
                      secondary="Model recall"
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 1 }}>Features</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedModel.features.map((feature, index) => (
                    <Chip key={index} label={feature} size="small" variant="outlined" />
                  ))}
                </Box>
              </Grid>
            </Grid>

            {selectedModel.predictions.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>Recent Predictions</Typography>
                <List dense>
                  {selectedModel.predictions.map((prediction, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <Psychology sx={{ fontSize: 16, color: designTokens.colors.ai[600] }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={`${prediction.target}: ${formatNumber(prediction.predictedValue)}`}
                        secondary={`Confidence: ${prediction.confidence}% • ${prediction.horizon}`}
                      />
                      <Chip 
                        label={prediction.trend} 
                        color={getStatusColor(prediction.trend) as any}
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedModel(null)}>Close</Button>
            <Button 
              variant="contained"
              onClick={() => setShowForecastDialog(true)}
              sx={{ backgroundColor: designTokens.colors.ai[600] }}
            >
              Generate Forecast
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Generate Forecast Dialog */}
      <Dialog open={showForecastDialog} onClose={() => setShowForecastDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Generate AI Forecast</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Our AI will analyze your data and generate predictions for:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <ShowChart sx={{ color: designTokens.colors.ai[600] }} />
              </ListItemIcon>
              <ListItemText primary="Trend analysis and forecasting" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Psychology sx={{ color: designTokens.colors.ai[600] }} />
              </ListItemIcon>
              <ListItemText primary="Pattern recognition and insights" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <TrendingUp sx={{ color: designTokens.colors.ai[600] }} />
              </ListItemIcon>
              <ListItemText primary="Performance predictions" />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowForecastDialog(false)}>Cancel</Button>
          <Button 
            variant="contained"
            onClick={() => setShowForecastDialog(false)}
            sx={{ backgroundColor: designTokens.colors.ai[600] }}
          >
            Generate Forecast
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
