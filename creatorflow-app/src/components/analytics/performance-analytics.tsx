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
  Avatar
} from '@mui/material';
import {
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
  Crop54 as Crop32Icon,
  Crop75 as Crop32Icon,
  CropDin as Crop32Icon,
  CropPortrait as Crop32Icon,
  CropLandscape as Crop32Icon,
  CropRotate as Crop32Icon,
  Zap as ZapIcon
} from '@mui/icons-material';
import { designTokens } from '@/lib/design-system';

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  status: 'healthy' | 'warning' | 'critical';
  category: 'speed' | 'reliability' | 'efficiency' | 'quality';
}

interface PerformanceChart {
  id: string;
  name: string;
  data: Array<{
    timestamp: string;
    value: number;
    label: string;
  }>;
  type: 'line' | 'bar' | 'area';
  color: string;
}

interface PerformanceAlert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  resolved: boolean;
}

export default function PerformanceAnalytics() {
  const [activeTab, setActiveTab] = useState(0);
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [charts, setCharts] = useState<PerformanceChart[]>([]);
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<PerformanceMetric | null>(null);
  const [showMetricDialog, setShowMetricDialog] = useState(false);
  const [timeRange, setTimeRange] = useState('24h');
  const [refreshInterval, setRefreshInterval] = useState(30);

  // Mock data for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Mock performance metrics
      setMetrics([
        {
          id: 'metric-1',
          name: 'Average Response Time',
          value: 245,
          unit: 'ms',
          trend: 'down',
          change: -12.5,
          status: 'healthy',
          category: 'speed'
        },
        {
          id: 'metric-2',
          name: 'Uptime Percentage',
          value: 99.97,
          unit: '%',
          trend: 'stable',
          change: 0.02,
          status: 'healthy',
          category: 'reliability'
        },
        {
          id: 'metric-3',
          name: 'Error Rate',
          value: 0.23,
          unit: '%',
          trend: 'down',
          change: -8.7,
          status: 'healthy',
          category: 'quality'
        },
        {
          id: 'metric-4',
          name: 'CPU Usage',
          value: 67.8,
          unit: '%',
          trend: 'up',
          change: 5.2,
          status: 'warning',
          category: 'efficiency'
        },
        {
          id: 'metric-5',
          name: 'Memory Usage',
          value: 82.1,
          unit: '%',
          trend: 'up',
          change: 3.8,
          status: 'warning',
          category: 'efficiency'
        },
        {
          id: 'metric-6',
          name: 'Database Query Time',
          value: 89,
          unit: 'ms',
          trend: 'down',
          change: -15.3,
          status: 'healthy',
          category: 'speed'
        },
        {
          id: 'metric-7',
          name: 'Cache Hit Rate',
          value: 94.2,
          unit: '%',
          trend: 'up',
          change: 2.1,
          status: 'healthy',
          category: 'efficiency'
        },
        {
          id: 'metric-8',
          name: 'Network Latency',
          value: 156,
          unit: 'ms',
          trend: 'stable',
          change: 0.5,
          status: 'healthy',
          category: 'speed'
        }
      ]);

      // Mock performance charts
      setCharts([
        {
          id: 'chart-1',
          name: 'Response Time Over Time',
          data: [
            { timestamp: '00:00', value: 245, label: 'Midnight' },
            { timestamp: '04:00', value: 238, label: '4 AM' },
            { timestamp: '08:00', value: 267, label: '8 AM' },
            { timestamp: '12:00', value: 289, label: 'Noon' },
            { timestamp: '16:00', value: 276, label: '4 PM' },
            { timestamp: '20:00', value: 251, label: '8 PM' },
            { timestamp: '23:59', value: 245, label: 'End of Day' }
          ],
          type: 'line',
          color: designTokens.colors.primary[600]
        },
        {
          id: 'chart-2',
          name: 'Error Rate Trends',
          data: [
            { timestamp: '00:00', value: 0.23, label: 'Midnight' },
            { timestamp: '04:00', value: 0.18, label: '4 AM' },
            { timestamp: '08:00', value: 0.31, label: '8 AM' },
            { timestamp: '12:00', value: 0.28, label: 'Noon' },
            { timestamp: '16:00', value: 0.25, label: '4 PM' },
            { timestamp: '20:00', value: 0.22, label: '8 PM' },
            { timestamp: '23:59', value: 0.23, label: 'End of Day' }
          ],
          type: 'line',
          color: designTokens.colors.error[600]
        }
      ]);

      // Mock performance alerts
      setAlerts([
        {
          id: 'alert-1',
          type: 'warning',
          title: 'High CPU Usage Detected',
          message: 'CPU usage has increased to 67.8% which is above the normal threshold.',
          timestamp: '2024-01-15T10:30:00Z',
          severity: 'medium',
          resolved: false
        },
        {
          id: 'alert-2',
          type: 'info',
          title: 'Performance Optimization Completed',
          message: 'Database query optimization has improved response times by 15.3%.',
          timestamp: '2024-01-15T09:15:00Z',
          severity: 'low',
          resolved: true
        },
        {
          id: 'alert-3',
          type: 'success',
          title: 'System Health Check Passed',
          message: 'All critical performance metrics are within normal ranges.',
          timestamp: '2024-01-15T08:45:00Z',
          severity: 'low',
          resolved: true
        }
      ]);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'speed': return <Speed />;
      case 'reliability': return <Shield />;
      case 'efficiency': return <Bolt />;
      case 'quality': return <CheckCircle />;
      default: return <Insights />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'speed': return designTokens.colors.primary[600];
      case 'reliability': return designTokens.colors.success[600];
      case 'efficiency': return designTokens.colors.warning[600];
      case 'quality': return designTokens.colors.info[600];
      default: return designTokens.colors.neutral[600];
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info />;
      case 'warning': return <Warning />;
      case 'error': return <Error />;
      case 'success': return <CheckCircle />;
      default: return <Info />;
    }
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
          Performance Analytics
        </Typography>
        <Typography variant="body1" sx={{ color: designTokens.colors.neutral[600] }}>
          Monitor system performance, identify bottlenecks, and optimize for better user experience
        </Typography>
      </Box>

      {/* Controls */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Time Range</InputLabel>
              <Select
                value={timeRange}
                label="Time Range"
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <MenuItem value="1h">Last Hour</MenuItem>
                <MenuItem value="24h">Last 24 Hours</MenuItem>
                <MenuItem value="7d">Last 7 Days</MenuItem>
                <MenuItem value="30d">Last 30 Days</MenuItem>
                <MenuItem value="90d">Last 90 Days</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Refresh Interval</InputLabel>
              <Select
                value={refreshInterval}
                label="Refresh Interval"
                onChange={(e) => setRefreshInterval(e.target.value)}
              >
                <MenuItem value={15}>15 seconds</MenuItem>
                <MenuItem value={30}>30 seconds</MenuItem>
                <MenuItem value={60}>1 minute</MenuItem>
                <MenuItem value={300}>5 minutes</MenuItem>
                <MenuItem value={0}>Manual</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={() => window.location.reload()}
              >
                Refresh Now
              </Button>
              <Button
                variant="contained"
                startIcon={<Download />}
                sx={{ backgroundColor: designTokens.colors.primary[600] }}
              >
                Export Data
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Main Content */}
      <Paper sx={{ p: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
          <Tab label="Performance Metrics" />
          <Tab label="Performance Charts" />
          <Tab label="Alerts & Monitoring" />
          <Tab label="Performance Insights" />
        </Tabs>

        {activeTab === 0 && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Real-time Performance Metrics</Typography>
              <Chip 
                label={`Auto-refresh: ${refreshInterval}s`} 
                color="primary" 
                variant="outlined"
              />
            </Box>

            <Grid container spacing={3}>
              {metrics.map((metric) => (
                <Grid key={metric.id} xs={12} md={6} lg={3}>
                  <Fade in timeout={500}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        cursor: 'pointer',
                        '&:hover': { boxShadow: 4 }
                      }}
                      onClick={() => {
                        setSelectedMetric(metric);
                        setShowMetricDialog(true);
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: `${getCategoryColor(metric.category)}20`, color: getCategoryColor(metric.category) }}>
                              {getCategoryIcon(metric.category)}
                            </Avatar>
                            <Box>
                              <Typography variant="h6" sx={{ color: designTokens.colors.neutral[800] }}>
                                {metric.name}
                              </Typography>
                              <Typography variant="caption" sx={{ color: designTokens.colors.neutral[600] }}>
                                {metric.category}
                              </Typography>
                            </Box>
                          </Box>
                          <Chip 
                            label={metric.status} 
                            color={getMetricStatusColor(metric.status) as any}
                            size="small"
                          />
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <Typography variant="h4" sx={{ color: designTokens.colors.primary[600], fontWeight: 'bold' }}>
                            {metric.value.toLocaleString()}
                          </Typography>
                          <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                            {metric.unit}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getTrendIcon(metric.trend)}
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
          </>
        )}

        {activeTab === 1 && (
          <>
            <Typography variant="h6" sx={{ mb: 3 }}>Performance Trends & Charts</Typography>
            <Grid container spacing={3}>
              {charts.map((chart) => (
                <Grid key={chart.id} xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2, color: designTokens.colors.neutral[800] }}>
                        {chart.name}
                      </Typography>
                      <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                          Chart visualization would be displayed here using a charting library like Recharts or Chart.js
                        </Typography>
                      </Box>
                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                          Data points: {chart.data.length}
                        </Typography>
                        <Button size="small" variant="outlined">
                          View Details
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {activeTab === 2 && (
          <>
            <Typography variant="h6" sx={{ mb: 3 }}>Performance Alerts & Monitoring</Typography>
            <Grid container spacing={3}>
              <Grid xs={12} md={8}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>Active Alerts</Typography>
                    <List>
                      {alerts.filter(alert => !alert.resolved).map((alert) => (
                        <ListItem key={alert.id}>
                          <ListItemIcon>
                            {getAlertIcon(alert.type)}
                          </ListItemIcon>
                          <ListItemText 
                            primary={alert.title}
                            secondary={
                              <Box>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                  {alert.message}
                                </Typography>
                                <Typography variant="caption" sx={{ color: designTokens.colors.neutral[600] }}>
                                  {new Date(alert.timestamp).toLocaleString()}
                                </Typography>
                              </Box>
                            }
                          />
                          <ListItemSecondaryAction>
                            <Chip 
                              label={alert.severity} 
                              color={alert.severity === 'high' ? 'error' : alert.severity === 'medium' ? 'warning' : 'default'}
                              size="small"
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>Monitoring Status</Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 1 }}>
                        System Health
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={85} 
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        85% Healthy
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 1 }}>
                        Performance Score
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={92} 
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        92/100
                      </Typography>
                    </Box>

                    <Button 
                      variant="contained" 
                      fullWidth 
                      startIcon={<Settings />}
                      sx={{ mt: 2, backgroundColor: designTokens.colors.primary[600] }}
                    >
                      Configure Alerts
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        )}

        {activeTab === 3 && (
          <>
            <Typography variant="h6" sx={{ mb: 3 }}>Performance Insights & Recommendations</Typography>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, color: designTokens.colors.success[600] }}>
                      🚀 Performance Improvements
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircle sx={{ color: designTokens.colors.success[600] }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Database optimization completed"
                          secondary="Query response times improved by 15.3%"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircle sx={{ color: designTokens.colors.success[600] }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Cache hit rate increased"
                          secondary="Memory efficiency improved by 2.1%"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, color: designTokens.colors.warning[600] }}>
                      ⚠️ Areas for Attention
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <Warning sx={{ color: designTokens.colors.warning[600] }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="CPU usage trending upward"
                          secondary="Consider scaling or optimization"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <Info sx={{ color: designTokens.colors.info[600] }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Memory usage monitoring"
                          secondary="Currently at 82.1% - watch for trends"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        )}
      </Paper>

      {/* Metric Details Dialog */}
      <Dialog open={showMetricDialog} onClose={() => setShowMetricDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Performance Metric Details</DialogTitle>
        <DialogContent>
          {selectedMetric && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ bgcolor: `${getCategoryColor(selectedMetric.category)}20`, color: getCategoryColor(selectedMetric.category) }}>
                  {getCategoryIcon(selectedMetric.category)}
                </Avatar>
                <Box>
                  <Typography variant="h6">{selectedMetric.name}</Typography>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                    {selectedMetric.category}
                  </Typography>
                </Box>
              </Box>
              
              <Grid container spacing={2}>
                <Grid xs={6}>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>Current Value</Typography>
                  <Typography variant="h5">
                    {selectedMetric.value.toLocaleString()} {selectedMetric.unit}
                  </Typography>
                </Grid>
                <Grid xs={6}>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>Status</Typography>
                  <Chip label={selectedMetric.status} color={getMetricStatusColor(selectedMetric.status) as any} />
                </Grid>
                <Grid xs={6}>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>Trend</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getTrendIcon(selectedMetric.trend)}
                    <Typography variant="body1">
                      {selectedMetric.change > 0 ? '+' : ''}{selectedMetric.change}%
                    </Typography>
                  </Box>
                </Grid>
                <Grid xs={6}>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>Category</Typography>
                  <Chip 
                    label={selectedMetric.category} 
                    sx={{ bgcolor: `${getCategoryColor(selectedMetric.category)}20`, color: getCategoryColor(selectedMetric.category) }}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Historical Data</Typography>
                <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                    Historical chart would be displayed here
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowMetricDialog(false)}>Close</Button>
          <Button variant="contained">View Full History</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
