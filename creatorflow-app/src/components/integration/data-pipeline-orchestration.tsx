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
  Tabs,
  Tab,
  Avatar,
  ListItemAvatar
} from '@mui/material';
import {
  AccountTree,
  Schema,
  DataObject,
  Code,
  IntegrationInstructions,
  Article,
  Create,
  Palette,
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
  Zap,
  Storage,
  DataUsage,
  Insights,
  Report,
  Schedule,
  Notifications,
  Public,
  ContentCopy,
  QrCode,
  History,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  Bolt,
  Memory,
  CheckCircle,
  Warning,
  Error,
  Info,
  ExpandMore,
  ExpandLess,
  PlayArrow,
  Pause,
  Stop,
  Save,
  Send,
  Download,
  Upload,
  TrendingUp,
  TrendingDown,
  Speed,
  Timer,
  NetworkCheck,
  Router,
  Firewall,
  Shield,
  Lock,
  Key,
  Cloud,
  Webhook,
  Security,
  Settings,
  Refresh,
  Add,
  Edit,
  Delete,
  Visibility,
  MoreVert,
  BugReport,
  Science,
  PlayCircle,
  StopCircle,
  RecordVoiceOver,
  Mic,
  MicOff,
  VolumeUp,
  VolumeOff,
  Headphones,
  Speaker,
  Radio,
  Tv,
  Videocam,
  VideocamOff,
  Camera,
  CameraAlt,
  PhotoCamera,
  PhotoLibrary,
  Image,
  VideoLibrary,
  Movie,
  MusicNote,
  MusicOff,
  QueueMusic,
  Shuffle,
  Repeat,
  SkipNext,
  SkipPrevious,
  FastForward,
  FastRewind,
  PlaylistPlay,
  PlaylistAdd,
  Favorite,
  FavoriteBorder,
  ThumbUp,
  ThumbDown,
  Star,
  StarBorder,
  StarHalf,
  Bookmark,
  BookmarkBorder,
  Comment,
  Reply,
  Share,
  Send as SendIcon,
  Sort,
  ViewList,
  ViewModule,
  GridView,
  List as ListIcon,
  Event,
  Notifications as NotificationsIcon,
  NotificationsActive,
  NotificationsOff,
  Workflow,
  Hub,
  Http,
  Https,
  Code as CodeIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Save as SaveIcon,
  Send as SendIcon2,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Sync as SyncIcon,
  Autorenew as AutorenewIcon,
  Cached as CachedIcon,
  Loop as LoopIcon,
  RotateRight as RotateRightIcon,
  RotateLeft as RotateLeftIcon,
  Rotate90DegreesCcw as Rotate90DegreesCcwIcon,
  Rotate90DegreesCw as Rotate90DegreesCwIcon,
  Flip as FlipIcon,
  FlipToBack as FlipToBackIcon,
  FlipToFront as FlipToFrontIcon,
  Transform as TransformIcon,
  Crop as CropIcon,
  CropFree as CropFreeIcon,
  CropSquare as CropSquareIcon,
  Crop169 as Crop169Icon,
  Crop32 as Crop32Icon,
  Crop54 as Crop54Icon,
  Crop75 as Crop75Icon,
  CropDin as CropDinIcon,
  CropPortrait as CropPortraitIcon,
  CropLandscape as CropLandscapeIcon,
  CropRotate as CropRotateIcon,
  Zap as ZapIcon
} from '@mui/icons-material';
import { designTokens } from '@/lib/design-system';

interface DataPipeline {
  id: string;
  name: string;
  type: 'etl' | 'elt' | 'streaming' | 'batch' | 'real-time';
  status: 'running' | 'stopped' | 'error' | 'scheduled' | 'completed';
  source: string;
  destination: string;
  schedule: string;
  lastRun: string;
  nextRun: string;
  recordsProcessed: number;
  processingTime: number;
  successRate: number;
  description: string;
  steps: PipelineStep[];
  dependencies: string[];
  errorCount: number;
  retryCount: number;
}

interface PipelineStep {
  id: string;
  name: string;
  type: 'extract' | 'transform' | 'load' | 'validate' | 'clean';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  order: number;
  estimatedTime: number;
  actualTime?: number;
  recordsProcessed: number;
  errorMessage?: string;
  config: any;
}

interface PipelineMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  status: 'healthy' | 'warning' | 'critical';
}

interface PipelineRun {
  id: string;
  pipelineId: string;
  pipelineName: string;
  startTime: string;
  endTime?: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  recordsProcessed: number;
  processingTime: number;
  errorCount: number;
  warnings: string[];
}

interface DataTransformation {
  id: string;
  name: string;
  type: 'mapping' | 'filtering' | 'aggregation' | 'validation' | 'enrichment';
  description: string;
  inputSchema: any;
  outputSchema: any;
  rules: string[];
  status: 'active' | 'inactive' | 'testing';
  lastModified: string;
}

export default function DataPipelineOrchestration() {
  const [activeTab, setActiveTab] = useState(0);
  const [pipelines, setPipelines] = useState<DataPipeline[]>([]);
  const [metrics, setMetrics] = useState<PipelineMetric[]>([]);
  const [pipelineRuns, setPipelineRuns] = useState<PipelineRun[]>([]);
  const [transformations, setTransformations] = useState<DataTransformation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPipeline, setSelectedPipeline] = useState<DataPipeline | null>(null);
  const [showPipelineDialog, setShowPipelineDialog] = useState(false);
  const [showTransformationDialog, setShowTransformationDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Mock data pipelines
      setPipelines([
        {
          id: 'pipeline-1',
          name: 'User Analytics ETL',
          type: 'etl',
          status: 'running',
          source: 'PostgreSQL Database',
          destination: 'Data Warehouse',
          schedule: 'Every 6 hours',
          lastRun: '2024-01-15T10:30:00Z',
          nextRun: '2024-01-15T16:30:00Z',
          recordsProcessed: 154200,
          processingTime: 1800,
          successRate: 99.8,
          description: 'Extract user behavior data, transform for analytics, load to warehouse',
          steps: [
            {
              id: 'step-1',
              name: 'Extract User Data',
              type: 'extract',
              status: 'completed',
              order: 1,
              estimatedTime: 300,
              actualTime: 285,
              recordsProcessed: 154200,
              config: { query: 'SELECT * FROM users WHERE updated_at > $1' }
            },
            {
              id: 'step-2',
              name: 'Transform User Metrics',
              type: 'transform',
              status: 'running',
              order: 2,
              estimatedTime: 600,
              actualTime: 450,
              recordsProcessed: 125000,
              config: { aggregations: ['daily_active_users', 'session_duration'] }
            },
            {
              id: 'step-3',
              name: 'Load to Warehouse',
              type: 'load',
              status: 'pending',
              order: 3,
              estimatedTime: 900,
              recordsProcessed: 0,
              config: { target_table: 'user_analytics_facts' }
            }
          ],
          dependencies: ['user-database-connection', 'warehouse-connection'],
          errorCount: 0,
          retryCount: 0
        },
        {
          id: 'pipeline-2',
          name: 'Content Performance Streaming',
          type: 'streaming',
          status: 'running',
          source: 'Kafka Streams',
          destination: 'Real-time Analytics',
          schedule: 'Continuous',
          lastRun: '2024-01-15T10:00:00Z',
          nextRun: 'Continuous',
          recordsProcessed: 892340,
          processingTime: 0,
          successRate: 98.5,
          description: 'Real-time streaming pipeline for content engagement metrics',
          steps: [
            {
              id: 'step-1',
              name: 'Stream Ingestion',
              type: 'extract',
              status: 'running',
              order: 1,
              estimatedTime: 0,
              actualTime: 0,
              recordsProcessed: 892340,
              config: { topic: 'content-events', consumer_group: 'analytics' }
            },
            {
              id: 'step-2',
              name: 'Real-time Processing',
              type: 'transform',
              status: 'running',
              order: 2,
              estimatedTime: 0,
              actualTime: 0,
              recordsProcessed: 892340,
              config: { window_size: '5 minutes', aggregations: ['engagement_rate', 'reach'] }
            }
          ],
          dependencies: ['kafka-cluster', 'streaming-engine'],
          errorCount: 12,
          retryCount: 3
        },
        {
          id: 'pipeline-3',
          name: 'Marketing Data Sync',
          type: 'batch',
          status: 'scheduled',
          source: 'CRM System',
          destination: 'Marketing Platform',
          schedule: 'Daily at 2 AM',
          lastRun: '2024-01-15T02:00:00Z',
          nextRun: '2024-01-16T02:00:00Z',
          recordsProcessed: 23410,
          processingTime: 1200,
          successRate: 100.0,
          description: 'Daily synchronization of customer data for marketing campaigns',
          steps: [
            {
              id: 'step-1',
              name: 'Extract CRM Data',
              type: 'extract',
              status: 'completed',
              order: 1,
              estimatedTime: 300,
              actualTime: 280,
              recordsProcessed: 23410,
              config: { api_endpoint: '/api/customers', filters: ['active', 'opted_in'] }
            },
            {
              id: 'step-2',
              name: 'Data Validation',
              type: 'validate',
              status: 'completed',
              order: 2,
              estimatedTime: 150,
              actualTime: 145,
              recordsProcessed: 23410,
              config: { rules: ['email_format', 'phone_format', 'required_fields'] }
            },
            {
              id: 'step-3',
              name: 'Load to Marketing Platform',
              type: 'load',
              status: 'completed',
              order: 3,
              estimatedTime: 750,
              actualTime: 775,
              recordsProcessed: 23410,
              config: { target_api: '/api/contacts/batch', batch_size: 1000 }
            }
          ],
          dependencies: ['crm-api', 'marketing-api'],
          errorCount: 0,
          retryCount: 0
        }
      ]);

      // Mock metrics
      setMetrics([
        {
          id: 'metric-1',
          name: 'Active Pipelines',
          value: 8,
          unit: 'pipelines',
          trend: 'up',
          change: 14.3,
          status: 'healthy'
        },
        {
          id: 'metric-2',
          name: 'Success Rate',
          value: 99.2,
          unit: '%',
          trend: 'stable',
          change: 0.1,
          status: 'healthy'
        },
        {
          id: 'metric-3',
          name: 'Total Records Processed',
          value: 1250000,
          unit: 'records',
          trend: 'up',
          change: 23.5,
          status: 'healthy'
        },
        {
          id: 'metric-4',
          name: 'Average Processing Time',
          value: 45,
          unit: 'minutes',
          trend: 'down',
          change: -12.8,
          status: 'warning'
        }
      ]);

      // Mock pipeline runs
      setPipelineRuns([
        {
          id: 'run-1',
          pipelineId: 'pipeline-1',
          pipelineName: 'User Analytics ETL',
          startTime: '2024-01-15T10:30:00Z',
          status: 'running',
          recordsProcessed: 154200,
          processingTime: 1800,
          errorCount: 0,
          warnings: []
        },
        {
          id: 'run-2',
          pipelineId: 'pipeline-2',
          pipelineName: 'Content Performance Streaming',
          startTime: '2024-01-15T10:00:00Z',
          status: 'running',
          recordsProcessed: 892340,
          processingTime: 0,
          errorCount: 12,
          warnings: ['High memory usage detected']
        },
        {
          id: 'run-3',
          pipelineId: 'pipeline-3',
          pipelineName: 'Marketing Data Sync',
          startTime: '2024-01-15T02:00:00Z',
          endTime: '2024-01-15T02:20:00Z',
          status: 'completed',
          recordsProcessed: 23410,
          processingTime: 1200,
          errorCount: 0,
          warnings: []
        }
      ]);

      // Mock transformations
      setTransformations([
        {
          id: 'trans-1',
          name: 'User Data Enrichment',
          type: 'enrichment',
          description: 'Enhance user profiles with demographic and behavioral data',
          inputSchema: { userId: 'string', email: 'string', lastLogin: 'datetime' },
          outputSchema: { userId: 'string', email: 'string', lastLogin: 'datetime', ageGroup: 'string', interests: 'array', engagementScore: 'number' },
          rules: ['Add age group based on birth date', 'Calculate engagement score', 'Extract interests from behavior'],
          status: 'active',
          lastModified: '2024-01-15T09:00:00Z'
        },
        {
          id: 'trans-2',
          name: 'Content Performance Aggregation',
          type: 'aggregation',
          description: 'Aggregate content performance metrics by time periods',
          inputSchema: { contentId: 'string', views: 'number', likes: 'number', shares: 'number', timestamp: 'datetime' },
          outputSchema: { contentId: 'string', period: 'string', totalViews: 'number', totalLikes: 'number', totalShares: 'number', engagementRate: 'number' },
          rules: ['Group by hour/day/week', 'Calculate engagement rate', 'Filter out bot traffic'],
          status: 'active',
          lastModified: '2024-01-15T08:30:00Z'
        }
      ]);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getPipelineTypeColor = (type: string) => {
    switch (type) {
      case 'etl': return 'primary';
      case 'elt': return 'secondary';
      case 'streaming': return 'success';
      case 'batch': return 'warning';
      case 'real-time': return 'info';
      default: return 'default';
    }
  };

  const getPipelineStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'primary';
      case 'stopped': return 'default';
      case 'error': return 'error';
      case 'scheduled': return 'warning';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  const getStepTypeColor = (type: string) => {
    switch (type) {
      case 'extract': return 'info';
      case 'transform': return 'warning';
      case 'load': return 'success';
      case 'validate': return 'secondary';
      case 'clean': return 'primary';
      default: return 'default';
    }
  };

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'default';
      case 'running': return 'primary';
      case 'completed': return 'success';
      case 'failed': return 'error';
      case 'skipped': return 'warning';
      default: return 'default';
    }
  };

  const getRunStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'primary';
      case 'completed': return 'success';
      case 'failed': return 'error';
      case 'cancelled': return 'default';
      default: return 'default';
    }
  };

  const getTransformationTypeColor = (type: string) => {
    switch (type) {
      case 'mapping': return 'primary';
      case 'filtering': return 'warning';
      case 'aggregation': return 'success';
      case 'validation': return 'info';
      case 'enrichment': return 'secondary';
      default: return 'default';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUpIcon sx={{ color: designTokens.colors.success[600] }} />;
      case 'down': return <TrendingDownIcon sx={{ color: designTokens.colors.error[600] }} />;
      case 'stable': return <TrendingFlatIcon sx={{ color: designTokens.colors.info[600] }} />;
      default: return <TrendingFlatIcon />;
    }
  };

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'success';
      case 'warning': return 'warning';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return 'Continuous';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" width="60%" height={32} />
        <Skeleton variant="text" width="40%" height={24} />
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={3}>
                                {[1, 2, 3, 4].map((item) => (
                      <Grid key={item} xs={12} md={6} lg={3}>
                        <Skeleton variant="rectangular" height={120} />
                      </Grid>
                    ))}
          </Grid>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 1, color: designTokens.colors.neutral[900] }}>
          Data Pipeline Orchestration
        </Typography>
        <Typography variant="body1" sx={{ color: designTokens.colors.neutral[600] }}>
          Manage ETL processes, data transformations, and workflow automation
        </Typography>
      </Box>

      {/* Metrics Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
                        {metrics.map((metric) => (
                  <Grid key={metric.id} xs={12} md={6} lg={3}>
            <Fade in timeout={500}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ color: designTokens.colors.neutral[800] }}>
                        {metric.name}
                      </Typography>
                      <Typography variant="h4" sx={{ color: designTokens.colors.primary[600], fontWeight: 'bold' }}>
                        {metric.value.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getTrendIcon(metric.trend)}
                      <Chip 
                        label={metric.status} 
                        color={getMetricStatusColor(metric.status) as any}
                        size="small"
                      />
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                      {metric.unit}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: metric.trend === 'up' ? designTokens.colors.success[600] : 
                               metric.trend === 'down' ? designTokens.colors.error[600] : 
                               designTokens.colors.info[600]
                      }}
                    >
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>

      {/* Main Content */}
      <Paper sx={{ p: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
          <Tab label="Data Pipelines" />
          <Tab label="Pipeline Runs" />
          <Tab label="Data Transformations" />
          <Tab label="Monitoring" />
        </Tabs>

        {activeTab === 0 && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Data Pipelines</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowPipelineDialog(true)}
                sx={{ backgroundColor: designTokens.colors.primary[600] }}
              >
                Create Pipeline
              </Button>
            </Box>

            <Grid container spacing={3}>
                                    {pipelines.map((pipeline) => (
                        <Grid key={pipeline.id} xs={12} md={6} lg={4}>
                  <Fade in timeout={500}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: designTokens.colors.primary[100], color: designTokens.colors.primary[600] }}>
                              <AccountTree />
                            </Avatar>
                            <Box>
                              <Typography variant="h6" sx={{ color: designTokens.colors.neutral[800] }}>
                                {pipeline.name}
                              </Typography>
                              <Typography variant="caption" sx={{ color: designTokens.colors.neutral[600] }}>
                                {pipeline.source} → {pipeline.destination}
                              </Typography>
                            </Box>
                          </Box>
                          <Chip 
                            label={pipeline.status} 
                            color={getPipelineStatusColor(pipeline.status) as any}
                            size="small"
                          />
                        </Box>
                        
                        <Typography variant="body2" sx={{ mb: 2, color: designTokens.colors.neutral[600] }}>
                          {pipeline.description}
                        </Typography>

                        <Box sx={{ mb: 2 }}>
                          <Chip 
                            label={pipeline.type.toUpperCase()} 
                            color={getPipelineTypeColor(pipeline.type) as any}
                            size="small"
                            sx={{ mb: 1, mr: 1 }}
                          />
                          <Chip 
                            label={pipeline.schedule} 
                            variant="outlined"
                            size="small"
                            sx={{ mb: 1, mr: 1 }}
                          />
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 1 }}>
                            Records: {pipeline.recordsProcessed.toLocaleString()}
                          </Typography>
                          <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 1 }}>
                            Success Rate: {pipeline.successRate}%
                          </Typography>
                          <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                            Processing Time: {formatDuration(pipeline.processingTime)}
                          </Typography>
                        </Box>

                        {pipeline.errorCount > 0 && (
                          <Alert severity="warning" sx={{ mb: 2 }}>
                            {pipeline.errorCount} errors in last run
                          </Alert>
                        )}

                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button 
                            size="small" 
                            startIcon={<Visibility />}
                            onClick={() => setSelectedPipeline(pipeline)}
                          >
                            View Details
                          </Button>
                          {pipeline.status === 'running' && (
                            <Button size="small" startIcon={<Pause />} color="warning">
                              Pause
                            </Button>
                          )}
                          {pipeline.status === 'stopped' && (
                            <Button size="small" startIcon={<PlayArrow />} color="success">
                              Start
                            </Button>
                          )}
                          <Button size="small" startIcon={<Settings />}>
                            Configure
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
          <>
            <Typography variant="h6" sx={{ mb: 3 }}>Pipeline Execution History</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Pipeline</TableCell>
                    <TableCell>Start Time</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Records Processed</TableCell>
                    <TableCell>Errors</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pipelineRuns.map((run) => (
                    <TableRow key={run.id}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {run.pipelineName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(run.startTime).toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {run.endTime ? 
                            formatDuration(Math.round((new Date(run.endTime).getTime() - new Date(run.startTime).getTime()) / 1000)) :
                            'Running...'
                          }
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={run.status} 
                          color={getRunStatusColor(run.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {run.recordsProcessed.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: run.errorCount > 0 ? 'error.main' : 'inherit' }}>
                          {run.errorCount}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {run.status === 'running' && (
                            <IconButton size="small" color="warning">
                              <Pause />
                            </IconButton>
                          )}
                          <IconButton size="small">
                            <Visibility />
                          </IconButton>
                          <IconButton size="small">
                            <History />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {activeTab === 2 && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Data Transformations</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowTransformationDialog(true)}
                sx={{ backgroundColor: designTokens.colors.primary[600] }}
              >
                Create Transformation
              </Button>
            </Box>

            <Grid container spacing={3}>
                                    {transformations.map((transformation) => (
                        <Grid key={transformation.id} xs={12} md={6} lg={4}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: designTokens.colors.primary[100], color: designTokens.colors.primary[600] }}>
                            <Transform />
                          </Avatar>
                          <Box>
                            <Typography variant="h6" sx={{ color: designTokens.colors.neutral[800] }}>
                              {transformation.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: designTokens.colors.neutral[600] }}>
                              {transformation.type}
                            </Typography>
                          </Box>
                        </Box>
                        <Chip 
                          label={transformation.status} 
                          color={transformation.status === 'active' ? 'success' : 'default'}
                          size="small"
                        />
                      </Box>
                      
                      <Typography variant="body2" sx={{ mb: 2, color: designTokens.colors.neutral[600] }}>
                        {transformation.description}
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 1 }}>
                          Input Schema: {Object.keys(transformation.inputSchema).length} fields
                        </Typography>
                        <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 1 }}>
                          Output Schema: {Object.keys(transformation.outputSchema).length} fields
                        </Typography>
                        <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                          Rules: {transformation.rules.length} transformation rules
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button size="small" startIcon={<Visibility />}>
                          View Schema
                        </Button>
                        <Button size="small" startIcon={<Edit />}>
                          Edit
                        </Button>
                        <Button size="small" startIcon={<TestTube />}>
                          Test
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {activeTab === 3 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 3 }}>Pipeline Monitoring & Alerts</Typography>
            <Grid container spacing={3}>
              <Grid xs={12} md={8}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>Real-time Pipeline Status</Typography>
                    <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                        Real-time monitoring dashboard would be displayed here
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>Alerts & Notifications</Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircle sx={{ color: designTokens.colors.success[600] }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="User Analytics ETL Completed"
                          secondary="Successfully processed 154,200 records"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <Warning sx={{ color: designTokens.colors.warning[600] }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Content Streaming Pipeline Warning"
                          secondary="High memory usage detected"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <Info sx={{ color: designTokens.colors.info[600] }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Marketing Data Sync Scheduled"
                          secondary="Next run at 2:00 AM"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Pipeline Details Dialog */}
      <Dialog open={!!selectedPipeline} onClose={() => setSelectedPipeline(null)} maxWidth="lg" fullWidth>
        <DialogTitle>Pipeline Details</DialogTitle>
        <DialogContent>
          {selectedPipeline && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ bgcolor: designTokens.colors.primary[100], color: designTokens.colors.primary[600] }}>
                  <AccountTree />
                </Avatar>
                <Box>
                  <Typography variant="h6">{selectedPipeline.name}</Typography>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                    {selectedPipeline.source} → {selectedPipeline.destination}
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="body2" sx={{ mb: 3, color: designTokens.colors.neutral[600] }}>
                {selectedPipeline.description}
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid xs={6}>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>Status</Typography>
                  <Chip label={selectedPipeline.status} color={getPipelineStatusColor(selectedPipeline.status) as any} />
                </Grid>
                <Grid xs={6}>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>Type</Typography>
                  <Chip label={selectedPipeline.type.toUpperCase()} color={getPipelineTypeColor(selectedPipeline.type) as any} />
                </Grid>
                <Grid xs={6}>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>Schedule</Typography>
                  <Typography variant="body1">{selectedPipeline.schedule}</Typography>
                </Grid>
                <Grid xs={6}>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>Success Rate</Typography>
                  <Typography variant="body1">{selectedPipeline.successRate}%</Typography>
                </Grid>
                <Grid xs={6}>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>Records Processed</Typography>
                  <Typography variant="body1">{selectedPipeline.recordsProcessed.toLocaleString()}</Typography>
                </Grid>
                <Grid xs={6}>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>Processing Time</Typography>
                  <Typography variant="body1">{formatDuration(selectedPipeline.processingTime)}</Typography>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Pipeline Steps</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {selectedPipeline.steps.map((step) => (
                    <Card key={step.id} variant="outlined">
                      <CardContent sx={{ py: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Chip 
                              label={step.type} 
                              color={getStepTypeColor(step.type) as any}
                              size="small"
                            />
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {step.name}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Chip 
                              label={step.status} 
                              color={getStepStatusColor(step.status) as any}
                              size="small"
                            />
                            <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                              {step.recordsProcessed.toLocaleString()} records
                            </Typography>
                          </Box>
                        </Box>
                        {step.status === 'running' && (
                          <LinearProgress sx={{ mt: 2 }} />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedPipeline(null)}>Close</Button>
          <Button variant="contained">Edit Pipeline</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
