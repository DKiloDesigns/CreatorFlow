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
  IntegrationInstructions,
  Webhook,
  Security,
  Settings,
  Refresh,
  Add,
  Edit,
  Delete,
  Visibility,
  MoreVert,
  Speed,
  Timer,
  NetworkCheck,
  Router,
  Shield,
  Lock,
  Key,
  DataUsage,
  Insights,
  Report,
  Schedule,
  Notifications,
  ContentCopy,
  QrCode,
  History,
  TrendingFlat,
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
  Language,
  Share,
  Link,
  Web,
  Business,
  Store,
  ShoppingCart,
  Payment,
  CreditCard,
  AccountBalance,
  ShowChart,
  BarChart,
  PieChart,
  DonutLarge,
  DonutSmall,
  Timeline,
  Analytics,
  Assessment,
  Dashboard,
  ViewModule,
  ViewList,
  ViewComfy,
  GridView,
  ViewQuilt,
  ViewStream,
  ViewWeek,
  ViewDay,
  ViewAgenda,
  ViewCarousel,
  ViewColumn,
  ViewHeadline,
  ViewArray,
  ViewCompact,
  ViewCompactAlt,
  ViewInAr,
  ViewKanban,
  ViewTimeline,
  ViewCozy,
  ViewSidebar,
  ViewSidebarOutlined,
  ViewSidebarRounded,
  ViewSidebarSharp,
  ViewSidebarTwoTone
} from '@/lib/mui-optimized-imports';
import { designTokens } from '@/lib/design-system';

interface Integration {
  id: string;
  name: string;
  type: 'social_media' | 'analytics' | 'ecommerce' | 'marketing' | 'productivity' | 'payment' | 'crm' | 'other';
  platform: string;
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  lastSync: string;
  syncFrequency: string;
  dataPoints: number;
  apiCalls: number;
  errorRate: number;
  description: string;
  icon: string;
  features: string[];
  apiVersion: string;
  rateLimit: string;
}

interface IntegrationMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  status: 'healthy' | 'warning' | 'critical';
}

interface SyncJob {
  id: string;
  integration: string;
  type: 'full' | 'incremental' | 'realtime';
  status: 'running' | 'completed' | 'failed' | 'scheduled';
  progress: number;
  startTime: string;
  endTime?: string;
  recordsProcessed: number;
  errors: number;
}

export default function ThirdPartyIntegrations() {
  const [activeTab, setActiveTab] = useState(0);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [metrics, setMetrics] = useState<IntegrationMetric[]>([]);
  const [syncJobs, setSyncJobs] = useState<SyncJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [showIntegrationDialog, setShowIntegrationDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Mock integrations
      setIntegrations([
        {
          id: 'int-1',
          name: 'Instagram Business',
          type: 'social_media',
          platform: 'Instagram',
          status: 'connected',
          lastSync: '2024-01-15T10:30:00Z',
          syncFrequency: 'Every 15 minutes',
          dataPoints: 15420,
          apiCalls: 892,
          errorRate: 0.2,
          description: 'Instagram Business API integration for content publishing and analytics',
          icon: 'instagram',
          features: ['Content Publishing', 'Analytics', 'Engagement Metrics', 'Hashtag Insights'],
          apiVersion: 'v18.0',
          rateLimit: '200 calls/hour'
        },
        {
          id: 'int-2',
          name: 'Google Analytics 4',
          type: 'analytics',
          platform: 'Google',
          status: 'connected',
          lastSync: '2024-01-15T09:15:00Z',
          syncFrequency: 'Every hour',
          dataPoints: 89234,
          apiCalls: 156,
          errorRate: 0.1,
          description: 'Google Analytics 4 integration for website and app analytics',
          icon: 'google',
          features: ['Traffic Analysis', 'User Behavior', 'Conversion Tracking', 'Real-time Data'],
          apiVersion: 'v1',
          rateLimit: '1000 calls/day'
        },
        {
          id: 'int-3',
          name: 'Shopify Store',
          type: 'ecommerce',
          platform: 'Shopify',
          status: 'connected',
          lastSync: '2024-01-15T08:45:00Z',
          syncFrequency: 'Real-time',
          dataPoints: 2341,
          apiCalls: 234,
          errorRate: 0.5,
          description: 'Shopify integration for e-commerce data synchronization',
          icon: 'shopify',
          features: ['Product Sync', 'Order Management', 'Inventory Updates', 'Customer Data'],
          apiVersion: '2023-10',
          rateLimit: '2 calls/second'
        },
        {
          id: 'int-4',
          name: 'Mailchimp',
          type: 'marketing',
          platform: 'Mailchimp',
          status: 'error',
          lastSync: '2024-01-14T15:20:00Z',
          syncFrequency: 'Every 6 hours',
          dataPoints: 0,
          apiCalls: 0,
          errorRate: 100,
          description: 'Mailchimp integration for email marketing automation',
          icon: 'mailchimp',
          features: ['Email Campaigns', 'Audience Management', 'Automation', 'Analytics'],
          apiVersion: 'v3.0',
          rateLimit: '10 calls/second'
        }
      ]);

      // Mock metrics
      setMetrics([
        {
          id: 'metric-1',
          name: 'Total Integrations',
          value: 24,
          unit: 'integrations',
          trend: 'up',
          change: 8.3,
          status: 'healthy'
        },
        {
          id: 'metric-2',
          name: 'Active Connections',
          value: 21,
          unit: 'connections',
          trend: 'up',
          change: 5.0,
          status: 'healthy'
        },
        {
          id: 'metric-3',
          name: 'Data Sync Success',
          value: 98.7,
          unit: '%',
          trend: 'stable',
          change: 0.2,
          status: 'healthy'
        },
        {
          id: 'metric-4',
          name: 'API Error Rate',
          value: 1.3,
          unit: '%',
          trend: 'down',
          change: -0.8,
          status: 'warning'
        }
      ]);

      // Mock sync jobs
      setSyncJobs([
        {
          id: 'job-1',
          integration: 'Instagram Business',
          type: 'incremental',
          status: 'completed',
          progress: 100,
          startTime: '2024-01-15T10:15:00Z',
          endTime: '2024-01-15T10:18:00Z',
          recordsProcessed: 15420,
          errors: 0
        },
        {
          id: 'job-2',
          integration: 'Google Analytics 4',
          type: 'full',
          status: 'running',
          progress: 65,
          startTime: '2024-01-15T09:00:00Z',
          recordsProcessed: 58000,
          errors: 12
        },
        {
          id: 'job-3',
          integration: 'Shopify Store',
          type: 'realtime',
          status: 'scheduled',
          progress: 0,
          startTime: '2024-01-15T11:00:00Z',
          recordsProcessed: 0,
          errors: 0
        }
      ]);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getIntegrationIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactElement } = {
      instagram: <Instagram />,
      google: <Google />,
      shopify: <Shopify />,
      mailchimp: <Mailchimp />,
      facebook: <Facebook />,
      twitter: <Twitter />,
      linkedin: <LinkedIn />,
      youtube: <YouTube />,
      tiktok: <TikTok />,
      pinterest: <Pinterest />,
      snapchat: <Snapchat />,
      reddit: <Reddit />,
      discord: <Discord />,
      slack: <Slack />,
      microsoft: <Microsoft />,
      apple: <Apple />,
      amazon: <Amazon />,
      stripe: <Stripe />,
      paypal: <PayPal />,
      hubspot: <HubSpot />,
      zapier: <Zapier />,
      ifttt: <IFTTT />,
      airtable: <Airtable />,
      notion: <Notion />,
      figma: <Figma />,
      canva: <Canva />,
      adobe: <Adobe />,
      spotify: <Spotify />,
      twitch: <Twitch />,
      vimeo: <Vimeo />,
      medium: <Medium />,
      substack: <Substack />,
      patreon: <Patreon />,
      kofi: <KoFi />,
      buymeacoffee: <BuyMeACoffee />
    };
    return iconMap[iconName] || <IntegrationInstructions />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'success';
      case 'disconnected': return 'default';
      case 'error': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'social_media': return 'primary';
      case 'analytics': return 'info';
      case 'ecommerce': return 'success';
      case 'marketing': return 'warning';
      case 'productivity': return 'secondary';
      case 'payment': return 'error';
      case 'crm': return 'default';
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

  const getJobStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'primary';
      case 'completed': return 'success';
      case 'failed': return 'error';
      case 'scheduled': return 'warning';
      default: return 'default';
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
          Third-party Integrations
        </Typography>
        <Typography variant="body1" sx={{ color: designTokens.colors.neutral[600] }}>
          Manage integrations with social media platforms, analytics services, and external APIs
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
          <Tab label="Integrations" />
          <Tab label="Sync Jobs" />
          <Tab label="Available Services" />
          <Tab label="Configuration" />
        </Tabs>

        {activeTab === 0 && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Connected Integrations</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowIntegrationDialog(true)}
                sx={{ backgroundColor: designTokens.colors.primary[600] }}
              >
                Add Integration
              </Button>
            </Box>

            <Grid container spacing={3}>
                                    {integrations.map((integration) => (
                        <Grid key={integration.id} xs={12} md={6} lg={4}>
                  <Fade in timeout={500}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: designTokens.colors.primary[100], color: designTokens.colors.primary[600] }}>
                              {getIntegrationIcon(integration.icon)}
                            </Avatar>
                            <Box>
                              <Typography variant="h6" sx={{ color: designTokens.colors.neutral[800] }}>
                                {integration.name}
                              </Typography>
                              <Typography variant="caption" sx={{ color: designTokens.colors.neutral[600] }}>
                                {integration.platform}
                              </Typography>
                            </Box>
                          </Box>
                          <Chip 
                            label={integration.status} 
                            color={getStatusColor(integration.status) as any}
                            size="small"
                          />
                        </Box>
                        
                        <Typography variant="body2" sx={{ mb: 2, color: designTokens.colors.neutral[600] }}>
                          {integration.description}
                        </Typography>

                        <Box sx={{ mb: 2 }}>
                          <Chip 
                            label={integration.type.replace('_', ' ')} 
                            color={getTypeColor(integration.type) as any}
                            size="small"
                            sx={{ mb: 1, mr: 1 }}
                          />
                          <Chip 
                            label={`v${integration.apiVersion}`} 
                            variant="outlined"
                            size="small"
                            sx={{ mb: 1, mr: 1 }}
                          />
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 1 }}>
                            Last Sync: {new Date(integration.lastSync).toLocaleString()}
                          </Typography>
                          <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 1 }}>
                            Data Points: {integration.dataPoints.toLocaleString()}
                          </Typography>
                          <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                            API Calls: {integration.apiCalls.toLocaleString()}
                          </Typography>
                        </Box>

                        {integration.errorRate > 0 && (
                          <Alert severity="warning" sx={{ mb: 2 }}>
                            Error Rate: {integration.errorRate}%
                          </Alert>
                        )}

                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button 
                            size="small" 
                            startIcon={<Visibility />}
                            onClick={() => setSelectedIntegration(integration)}
                          >
                            View Details
                          </Button>
                          <Button size="small" startIcon={<Settings />}>
                            Configure
                          </Button>
                          <Button size="small" startIcon={<Refresh />}>
                            Sync Now
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
            <Typography variant="h6" sx={{ mb: 3 }}>Data Synchronization Jobs</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Integration</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Progress</TableCell>
                    <TableCell>Records</TableCell>
                    <TableCell>Errors</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {syncJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {job.integration}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={job.type} 
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={job.status} 
                          color={getJobStatusColor(job.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={job.progress} 
                            sx={{ width: 60 }}
                          />
                          <Typography variant="body2">
                            {job.progress}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {job.recordsProcessed.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: job.errors > 0 ? 'error.main' : 'inherit' }}>
                          {job.errors}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {job.endTime ? 
                            `${Math.round((new Date(job.endTime).getTime() - new Date(job.startTime).getTime()) / 1000 / 60)}m` :
                            'Running...'
                          }
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {job.status === 'running' && (
                            <IconButton size="small" color="warning">
                              <Pause />
                            </IconButton>
                          )}
                          {job.status === 'failed' && (
                            <IconButton size="small" color="primary">
                              <Refresh />
                            </IconButton>
                          )}
                          <IconButton size="small">
                            <Visibility />
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
          <Box>
            <Typography variant="h6" sx={{ mb: 3 }}>Available Integration Services</Typography>
            <Grid container spacing={3}>
              <Grid xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: designTokens.colors.primary[600] }}>
                  Social Media Platforms
                </Typography>
                <Grid container spacing={2}>
                                            {['Instagram', 'Facebook', 'Twitter', 'LinkedIn', 'YouTube', 'TikTok', 'Pinterest', 'Snapchat', 'Reddit'].map((platform) => (
                            <Grid key={platform} xs={6} md={4} lg={3}>
                      <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
                        <CardContent sx={{ textAlign: 'center', p: 2 }}>
                          <Avatar sx={{ mx: 'auto', mb: 1, bgcolor: designTokens.colors.primary[100], color: designTokens.colors.primary[600] }}>
                            {getIntegrationIcon(platform.toLowerCase())}
                          </Avatar>
                          <Typography variant="body2">{platform}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              <Grid xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: designTokens.colors.success[600] }}>
                  Analytics & Marketing
                </Typography>
                <Grid container spacing={2}>
                                            {['Google Analytics', 'Google Ads', 'Facebook Ads', 'Mailchimp', 'HubSpot', 'Zapier', 'IFTTT'].map((service) => (
                            <Grid key={service} xs={6} md={4} lg={3}>
                      <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
                        <CardContent sx={{ textAlign: 'center', p: 2 }}>
                          <Avatar sx={{ mx: 'auto', mb: 1, bgcolor: designTokens.colors.success[100], color: designTokens.colors.success[600] }}>
                            {getIntegrationIcon(service.toLowerCase().replace(' ', ''))}
                          </Avatar>
                          <Typography variant="body2">{service}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              <Grid xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: designTokens.colors.warning[600] }}>
                  E-commerce & Payments
                </Typography>
                <Grid container spacing={2}>
                                            {['Shopify', 'WooCommerce', 'Stripe', 'PayPal', 'Square', 'Amazon', 'Etsy'].map((service) => (
                            <Grid key={service} xs={6} md={4} lg={3}>
                      <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
                        <CardContent sx={{ textAlign: 'center', p: 2 }}>
                          <Avatar sx={{ mx: 'auto', mb: 1, bgcolor: designTokens.colors.warning[100], color: designTokens.colors.warning[600] }}>
                            {getIntegrationIcon(service.toLowerCase())}
                          </Avatar>
                          <Typography variant="body2">{service}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        )}

        {activeTab === 3 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 3 }}>Integration Configuration</Typography>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>Global Settings</Typography>
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Auto-sync enabled"
                      sx={{ mb: 2 }}
                    />
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Error notifications"
                      sx={{ mb: 2 }}
                    />
                    <FormControlLabel
                      control={<Switch />}
                      label="Debug logging"
                      sx={{ mb: 2 }}
                    />
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Default Sync Frequency</InputLabel>
                      <Select defaultValue="hourly" label="Default Sync Frequency">
                        <MenuItem value="realtime">Real-time</MenuItem>
                        <MenuItem value="15min">Every 15 minutes</MenuItem>
                        <MenuItem value="hourly">Every hour</MenuItem>
                        <MenuItem value="daily">Daily</MenuItem>
                      </Select>
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>API Rate Limits</Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: designTokens.colors.neutral[600] }}>
                      Configure global rate limiting for all integrations
                    </Typography>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Rate Limit Strategy</InputLabel>
                      <Select defaultValue="adaptive" label="Rate Limit Strategy">
                        <MenuItem value="strict">Strict</MenuItem>
                        <MenuItem value="adaptive">Adaptive</MenuItem>
                        <MenuItem value="burst">Burst</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Retry Policy</InputLabel>
                      <Select defaultValue="exponential" label="Retry Policy">
                        <MenuItem value="immediate">Immediate</MenuItem>
                        <MenuItem value="linear">Linear</MenuItem>
                        <MenuItem value="exponential">Exponential Backoff</MenuItem>
                      </Select>
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Integration Details Dialog */}
      <Dialog open={!!selectedIntegration} onClose={() => setSelectedIntegration(null)} maxWidth="md" fullWidth>
        <DialogTitle>Integration Details</DialogTitle>
        <DialogContent>
          {selectedIntegration && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ bgcolor: designTokens.colors.primary[100], color: designTokens.colors.primary[600] }}>
                  {getIntegrationIcon(selectedIntegration.icon)}
                </Avatar>
                <Box>
                  <Typography variant="h6">{selectedIntegration.name}</Typography>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                    {selectedIntegration.platform}
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="body2" sx={{ mb: 3, color: designTokens.colors.neutral[600] }}>
                {selectedIntegration.description}
              </Typography>
              
              <Grid container spacing={2}>
                <Grid xs={6}>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>Status</Typography>
                  <Chip label={selectedIntegration.status} color={getStatusColor(selectedIntegration.status) as any} />
                </Grid>
                <Grid xs={6}>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>Type</Typography>
                  <Chip label={selectedIntegration.type.replace('_', ' ')} color={getTypeColor(selectedIntegration.type) as any} />
                </Grid>
                <Grid xs={6}>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>API Version</Typography>
                  <Typography variant="body1">v{selectedIntegration.apiVersion}</Typography>
                </Grid>
                <Grid xs={6}>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>Rate Limit</Typography>
                  <Typography variant="body1">{selectedIntegration.rateLimit}</Typography>
                </Grid>
                <Grid xs={6}>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>Last Sync</Typography>
                  <Typography variant="body1">{new Date(selectedIntegration.lastSync).toLocaleString()}</Typography>
                </Grid>
                <Grid xs={6}>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>Sync Frequency</Typography>
                  <Typography variant="body1">{selectedIntegration.syncFrequency}</Typography>
                </Grid>
                <Grid xs={6}>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>Data Points</Typography>
                  <Typography variant="body1">{selectedIntegration.dataPoints.toLocaleString()}</Typography>
                </Grid>
                <Grid xs={6}>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>API Calls</Typography>
                  <Typography variant="body1">{selectedIntegration.apiCalls.toLocaleString()}</Typography>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Features</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedIntegration.features.map((feature, index) => (
                    <Chip key={index} label={feature} size="small" variant="outlined" />
                  ))}
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedIntegration(null)}>Close</Button>
          <Button variant="contained">Configure</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
