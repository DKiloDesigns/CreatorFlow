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
  Webhook,
  Security,
  Settings,
  Refresh,
  Add,
  Edit,
  Delete,
  Visibility,
  MoreVert,
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
  Http,
  Https,
  Code,
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
  AccountTree,
  Schema,
  DataObject,
  IntegrationInstructions,
  Article,
  Create,
  Palette,
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
} from '@/lib/mui-optimized-imports';
import { designTokens } from '@/lib/design-system';

interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  method: 'POST' | 'PUT' | 'PATCH';
  status: 'active' | 'inactive' | 'error' | 'testing';
  events: string[];
  secret: string;
  retryCount: number;
  timeout: number;
  lastDelivery: string;
  successRate: number;
  averageResponseTime: number;
  description: string;
  headers: { [key: string]: string };
  filters: string[];
  transformations: string[];
}

interface WebhookEvent {
  id: string;
  type: string;
  source: string;
  timestamp: string;
  payload: any;
  status: 'pending' | 'delivered' | 'failed' | 'retrying';
  attempts: number;
  responseCode?: number;
  responseBody?: string;
  deliveryTime?: number;
  errorMessage?: string;
}

interface WebhookMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  status: 'healthy' | 'warning' | 'critical';
}

interface DeliveryLog {
  id: string;
  endpoint: string;
  event: string;
  timestamp: string;
  status: 'success' | 'failed' | 'timeout';
  responseCode: number;
  responseTime: number;
  payloadSize: number;
  retryCount: number;
}

export default function WebhookManagement() {
  const [activeTab, setActiveTab] = useState(0);
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([]);
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [metrics, setMetrics] = useState<WebhookMetric[]>([]);
  const [deliveryLogs, setDeliveryLogs] = useState<DeliveryLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookEndpoint | null>(null);
  const [showWebhookDialog, setShowWebhookDialog] = useState(false);
  const [showTestDialog, setShowTestDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Mock webhook endpoints
      setWebhooks([
        {
          id: 'webhook-1',
          name: 'User Registration Webhook',
          url: 'https://api.example.com/webhooks/user-registration',
          method: 'POST',
          status: 'active',
          events: ['user.created', 'user.updated', 'user.deleted'],
          secret: 'whsec_abc123...',
          retryCount: 3,
          timeout: 30,
          lastDelivery: '2024-01-15T10:30:00Z',
          successRate: 99.8,
          averageResponseTime: 245,
          description: 'Webhook for user lifecycle events',
          headers: { 'Authorization': 'Bearer token123', 'Content-Type': 'application/json' },
          filters: ['user.role != admin', 'user.status == active'],
          transformations: ['remove_sensitive_fields', 'add_timestamp']
        },
        {
          id: 'webhook-2',
          name: 'Payment Processing Webhook',
          url: 'https://payments.example.com/webhooks/stripe',
          method: 'POST',
          status: 'active',
          events: ['payment.succeeded', 'payment.failed', 'subscription.updated'],
          secret: 'whsec_def456...',
          retryCount: 5,
          timeout: 60,
          lastDelivery: '2024-01-15T09:15:00Z',
          successRate: 98.5,
          averageResponseTime: 890,
          description: 'Stripe payment webhook integration',
          headers: { 'Stripe-Signature': 't=1234567890,v1=abc123...', 'Content-Type': 'application/json' },
          filters: ['payment.amount > 0', 'payment.currency == USD'],
          transformations: ['format_currency', 'add_metadata']
        },
        {
          id: 'webhook-3',
          name: 'Content Analytics Webhook',
          url: 'https://analytics.example.com/webhooks/content',
          method: 'POST',
          status: 'testing',
          events: ['content.published', 'content.viewed', 'content.shared'],
          secret: 'whsec_ghi789...',
          retryCount: 2,
          timeout: 15,
          lastDelivery: '2024-01-15T08:45:00Z',
          successRate: 95.2,
          averageResponseTime: 120,
          description: 'Content engagement analytics webhook',
          headers: { 'X-API-Key': 'key123', 'Content-Type': 'application/json' },
          filters: ['content.type in [post, video, article]'],
          transformations: ['aggregate_metrics', 'add_user_context']
        }
      ]);

      // Mock webhook events
      setEvents([
        {
          id: 'event-1',
          type: 'user.created',
          source: 'auth-service',
          timestamp: '2024-01-15T10:30:00Z',
          payload: { userId: '123', email: 'user@example.com', role: 'user' },
          status: 'delivered',
          attempts: 1,
          responseCode: 200,
          responseBody: '{"status": "success"}',
          deliveryTime: 245
        },
        {
          id: 'event-2',
          type: 'payment.succeeded',
          source: 'stripe',
          timestamp: '2024-01-15T09:15:00Z',
          payload: { paymentId: 'pi_123', amount: 2999, currency: 'usd' },
          status: 'delivered',
          attempts: 1,
          responseCode: 200,
          responseBody: '{"status": "processed"}',
          deliveryTime: 890
        },
        {
          id: 'event-3',
          type: 'content.published',
          source: 'cms-service',
          timestamp: '2024-01-15T08:45:00Z',
          payload: { contentId: '456', title: 'New Blog Post', author: 'John Doe' },
          status: 'failed',
          attempts: 3,
          responseCode: 500,
          responseBody: '{"error": "Internal server error"}',
          errorMessage: 'Connection timeout'
        }
      ]);

      // Mock metrics
      setMetrics([
        {
          id: 'metric-1',
          name: 'Total Webhooks',
          value: 12,
          unit: 'endpoints',
          trend: 'up',
          change: 20.0,
          status: 'healthy'
        },
        {
          id: 'metric-2',
          name: 'Delivery Success Rate',
          value: 98.7,
          unit: '%',
          trend: 'stable',
          change: 0.3,
          status: 'healthy'
        },
        {
          id: 'metric-3',
          name: 'Average Response Time',
          value: 456,
          unit: 'ms',
          trend: 'down',
          change: -12.5,
          status: 'healthy'
        },
        {
          id: 'metric-4',
          name: 'Failed Deliveries',
          value: 23,
          unit: 'deliveries',
          trend: 'down',
          change: -8.2,
          status: 'warning'
        }
      ]);

      // Mock delivery logs
      setDeliveryLogs([
        {
          id: 'log-1',
          endpoint: 'User Registration Webhook',
          event: 'user.created',
          timestamp: '2024-01-15T10:30:00Z',
          status: 'success',
          responseCode: 200,
          responseTime: 245,
          payloadSize: 1024,
          retryCount: 0
        },
        {
          id: 'log-2',
          endpoint: 'Payment Processing Webhook',
          event: 'payment.succeeded',
          timestamp: '2024-01-15T09:15:00Z',
          status: 'success',
          responseCode: 200,
          responseTime: 890,
          payloadSize: 2048,
          retryCount: 0
        },
        {
          id: 'log-3',
          endpoint: 'Content Analytics Webhook',
          event: 'content.published',
          timestamp: '2024-01-15T08:45:00Z',
          status: 'failed',
          responseCode: 500,
          responseTime: 15000,
          payloadSize: 512,
          retryCount: 3
        }
      ]);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'error': return 'error';
      case 'testing': return 'warning';
      default: return 'default';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'POST': return 'primary';
      case 'PUT': return 'warning';
      case 'PATCH': return 'info';
      default: return 'default';
    }
  };

  const getEventStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      case 'retrying': return 'info';
      default: return 'default';
    }
  };

  const getDeliveryStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'success';
      case 'failed': return 'error';
      case 'timeout': return 'warning';
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

  const getProtocolIcon = (url: string) => {
    return url.startsWith('https://') ? <Https /> : <Http />;
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
          Webhook Management System
        </Typography>
        <Typography variant="body1" sx={{ color: designTokens.colors.neutral[600] }}>
          Manage webhook endpoints, event routing, and delivery monitoring
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
          <Tab label="Webhook Endpoints" />
          <Tab label="Event History" />
          <Tab label="Delivery Logs" />
          <Tab label="Testing & Debug" />
        </Tabs>

        {activeTab === 0 && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Webhook Endpoints</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowWebhookDialog(true)}
                sx={{ backgroundColor: designTokens.colors.primary[600] }}
              >
                Add Webhook
              </Button>
            </Box>

                                <Grid container spacing={3}>
                      {webhooks.map((webhook) => (
                        <Grid key={webhook.id} xs={12} md={6} lg={4}>
                  <Fade in timeout={500}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: designTokens.colors.primary[100], color: designTokens.colors.primary[600] }}>
                              <Webhook />
                            </Avatar>
                            <Box>
                              <Typography variant="h6" sx={{ color: designTokens.colors.neutral[800] }}>
                                {webhook.name}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {getProtocolIcon(webhook.url)}
                                <Typography variant="caption" sx={{ color: designTokens.colors.neutral[600] }}>
                                  {webhook.url.split('/')[2]}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                          <Chip 
                            label={webhook.status} 
                            color={getStatusColor(webhook.status) as any}
                            size="small"
                          />
                        </Box>
                        
                        <Typography variant="body2" sx={{ mb: 2, color: designTokens.colors.neutral[600] }}>
                          {webhook.description}
                        </Typography>

                        <Box sx={{ mb: 2 }}>
                          <Chip 
                            label={webhook.method} 
                            color={getMethodColor(webhook.method) as any}
                            size="small"
                            sx={{ mb: 1, mr: 1 }}
                          />
                          <Chip 
                            label={`${webhook.events.length} events`} 
                            variant="outlined"
                            size="small"
                            sx={{ mb: 1, mr: 1 }}
                          />
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 1 }}>
                            Success Rate: {webhook.successRate}%
                          </Typography>
                          <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 1 }}>
                            Avg Response: {webhook.averageResponseTime}ms
                          </Typography>
                          <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                            Last Delivery: {new Date(webhook.lastDelivery).toLocaleString()}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button 
                            size="small" 
                            startIcon={<Visibility />}
                            onClick={() => setSelectedWebhook(webhook)}
                          >
                            View Details
                          </Button>
                                                            <Button size="small" startIcon={<Science />}>
                                    Test
                                  </Button>
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
            <Typography variant="h6" sx={{ mb: 3 }}>Webhook Event History</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Event Type</TableCell>
                    <TableCell>Source</TableCell>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Attempts</TableCell>
                    <TableCell>Response Code</TableCell>
                    <TableCell>Delivery Time</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {event.type}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {event.source}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(event.timestamp).toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={event.status} 
                          color={getEventStatusColor(event.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {event.attempts}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: event.responseCode === 200 ? 'success.main' : 'error.main' }}>
                          {event.responseCode || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {event.deliveryTime ? `${event.deliveryTime}ms` : 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton size="small">
                            <Visibility />
                          </IconButton>
                          {event.status === 'failed' && (
                            <IconButton size="small" color="primary">
                              <Refresh />
                            </IconButton>
                          )}
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
            <Typography variant="h6" sx={{ mb: 3 }}>Delivery Logs</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Endpoint</TableCell>
                    <TableCell>Event</TableCell>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Response Code</TableCell>
                    <TableCell>Response Time</TableCell>
                    <TableCell>Payload Size</TableCell>
                    <TableCell>Retry Count</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {deliveryLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {log.endpoint}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {log.event}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(log.timestamp).toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={log.status} 
                          color={getDeliveryStatusColor(log.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: log.responseCode === 200 ? 'success.main' : 'error.main' }}>
                          {log.responseCode}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {log.responseTime}ms
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {log.payloadSize} bytes
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {log.retryCount}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {activeTab === 3 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 3 }}>Webhook Testing & Debugging</Typography>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>Test Webhook Delivery</Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: designTokens.colors.neutral[600] }}>
                      Send test payloads to verify webhook endpoints
                    </Typography>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Select Webhook</InputLabel>
                      <Select defaultValue="" label="Select Webhook">
                        {webhooks.map((webhook) => (
                          <MenuItem key={webhook.id} value={webhook.id}>
                            {webhook.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Event Type</InputLabel>
                      <Select defaultValue="" label="Event Type">
                        <MenuItem value="test">Test Event</MenuItem>
                        <MenuItem value="user.created">User Created</MenuItem>
                        <MenuItem value="payment.succeeded">Payment Succeeded</MenuItem>
                      </Select>
                    </FormControl>
                    <Button 
                      variant="contained" 
                      startIcon={<TestTube />}
                      fullWidth
                      onClick={() => setShowTestDialog(true)}
                    >
                      Send Test Webhook
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>Debug Tools</Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: designTokens.colors.neutral[600] }}>
                      Tools for troubleshooting webhook issues
                    </Typography>
                    <Button 
                      variant="outlined" 
                      startIcon={<BugReport />}
                      fullWidth
                      sx={{ mb: 2 }}
                    >
                      View Error Logs
                    </Button>
                    <Button 
                      variant="outlined" 
                      startIcon={<History />}
                      fullWidth
                      sx={{ mb: 2 }}
                    >
                      Request History
                    </Button>
                    <Button 
                      variant="outlined" 
                      startIcon={<NetworkCheck />}
                      fullWidth
                    >
                      Connection Test
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Webhook Details Dialog */}
      <Dialog open={!!selectedWebhook} onClose={() => setSelectedWebhook(null)} maxWidth="md" fullWidth>
        <DialogTitle>Webhook Details</DialogTitle>
        <DialogContent>
          {selectedWebhook && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ bgcolor: designTokens.colors.primary[100], color: designTokens.colors.primary[600] }}>
                  <Webhook />
                </Avatar>
                <Box>
                  <Typography variant="h6">{selectedWebhook.name}</Typography>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                    {selectedWebhook.url}
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="body2" sx={{ mb: 3, color: designTokens.colors.neutral[600] }}>
                {selectedWebhook.description}
              </Typography>
              
              <Grid container spacing={2}>
                                        <Grid xs={6}>
                          <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>Status</Typography>
                          <Chip label={selectedWebhook.status} color={getStatusColor(selectedWebhook.status) as any} />
                        </Grid>
                        <Grid xs={6}>
                          <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>Method</Typography>
                          <Chip label={selectedWebhook.method} color={getMethodColor(selectedWebhook.method) as any} />
                        </Grid>
                        <Grid xs={6}>
                          <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>Retry Count</Typography>
                          <Typography variant="body1">{selectedWebhook.retryCount}</Typography>
                        </Grid>
                        <Grid xs={6}>
                          <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>Timeout</Typography>
                          <Typography variant="body1">{selectedWebhook.timeout}s</Typography>
                        </Grid>
                        <Grid xs={6}>
                          <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>Success Rate</Typography>
                          <Typography variant="body1">{selectedWebhook.successRate}%</Typography>
                        </Grid>
                        <Grid xs={6}>
                          <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>Avg Response Time</Typography>
                          <Typography variant="body1">{selectedWebhook.averageResponseTime}ms</Typography>
                        </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Events</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedWebhook.events.map((event, index) => (
                    <Chip key={index} label={event} size="small" variant="outlined" />
                  ))}
                </Box>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Headers</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {Object.entries(selectedWebhook.headers).map(([key, value]) => (
                    <Chip key={key} label={`${key}: ${value}`} size="small" variant="outlined" />
                  ))}
                </Box>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Filters</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedWebhook.filters.map((filter, index) => (
                    <Chip key={index} label={filter} size="small" variant="outlined" />
                  ))}
                </Box>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Transformations</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedWebhook.transformations.map((transformation, index) => (
                    <Chip key={index} label={transformation} size="small" variant="outlined" />
                  ))}
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedWebhook(null)}>Close</Button>
          <Button variant="contained">Edit Webhook</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
