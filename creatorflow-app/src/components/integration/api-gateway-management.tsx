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
  Tab
} from '@mui/material';
import {
  Api,
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
  Zap
} from '@mui/icons-material';
import { designTokens } from '@/lib/design-system';

interface APIRoute {
  id: string;
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  status: 'active' | 'inactive' | 'maintenance';
  rateLimit: number;
  authentication: 'none' | 'api_key' | 'jwt' | 'oauth2';
  responseTime: number;
  successRate: number;
  lastAccessed: string;
  version: string;
  description: string;
}

interface APIMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  status: 'healthy' | 'warning' | 'critical';
}

interface RateLimitRule {
  id: string;
  name: string;
  type: 'ip' | 'user' | 'api_key';
  limit: number;
  window: string;
  action: 'block' | 'throttle' | 'log';
  status: 'active' | 'inactive';
}

export default function APIGatewayManagement() {
  const [activeTab, setActiveTab] = useState(0);
  const [apiRoutes, setApiRoutes] = useState<APIRoute[]>([]);
  const [metrics, setMetrics] = useState<APIMetric[]>([]);
  const [rateLimitRules, setRateLimitRules] = useState<RateLimitRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState<APIRoute | null>(null);
  const [showRouteDialog, setShowRouteDialog] = useState(false);
  const [showRateLimitDialog, setShowRateLimitDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Mock API routes
      setApiRoutes([
        {
          id: 'route-1',
          name: 'User Management API',
          path: '/api/v1/users',
          method: 'GET',
          status: 'active',
          rateLimit: 1000,
          authentication: 'jwt',
          responseTime: 45,
          successRate: 99.8,
          lastAccessed: '2024-01-15T10:30:00Z',
          version: 'v1.2.0',
          description: 'CRUD operations for user management'
        },
        {
          id: 'route-2',
          name: 'Content Analytics',
          path: '/api/v1/analytics/content',
          method: 'POST',
          status: 'active',
          rateLimit: 500,
          authentication: 'api_key',
          responseTime: 120,
          successRate: 98.5,
          lastAccessed: '2024-01-15T09:15:00Z',
          version: 'v1.1.0',
          description: 'Content performance analytics and insights'
        },
        {
          id: 'route-3',
          name: 'Social Media Integration',
          path: '/api/v1/social/publish',
          method: 'POST',
          status: 'maintenance',
          rateLimit: 200,
          authentication: 'oauth2',
          responseTime: 300,
          successRate: 95.2,
          lastAccessed: '2024-01-15T08:45:00Z',
          version: 'v1.0.0',
          description: 'Cross-platform social media publishing'
        }
      ]);

      // Mock metrics
      setMetrics([
        {
          id: 'metric-1',
          name: 'Total API Calls',
          value: 15420,
          unit: 'calls',
          trend: 'up',
          change: 12.5,
          status: 'healthy'
        },
        {
          id: 'metric-2',
          name: 'Average Response Time',
          value: 89,
          unit: 'ms',
          trend: 'down',
          change: -8.2,
          status: 'healthy'
        },
        {
          id: 'metric-3',
          name: 'Success Rate',
          value: 99.1,
          unit: '%',
          trend: 'stable',
          change: 0.3,
          status: 'healthy'
        },
        {
          id: 'metric-4',
          name: 'Active Connections',
          value: 234,
          unit: 'connections',
          trend: 'up',
          change: 15.8,
          status: 'warning'
        }
      ]);

      // Mock rate limit rules
      setRateLimitRules([
        {
          id: 'rule-1',
          name: 'Standard API Key Limit',
          type: 'api_key',
          limit: 1000,
          window: '1 hour',
          action: 'throttle',
          status: 'active'
        },
        {
          id: 'rule-2',
          name: 'IP-based Protection',
          type: 'ip',
          limit: 100,
          window: '1 minute',
          action: 'block',
          status: 'active'
        },
        {
          id: 'rule-3',
          name: 'Premium User Limit',
          type: 'user',
          limit: 5000,
          window: '1 hour',
          action: 'throttle',
          status: 'active'
        }
      ]);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'success';
      case 'POST': return 'primary';
      case 'PUT': return 'warning';
      case 'DELETE': return 'error';
      case 'PATCH': return 'info';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'maintenance': return 'warning';
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
          API Gateway Management
        </Typography>
        <Typography variant="body1" sx={{ color: designTokens.colors.neutral[600] }}>
          Manage API routes, rate limiting, authentication, and monitoring
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
          <Tab label="API Routes" />
          <Tab label="Rate Limiting" />
          <Tab label="Authentication" />
          <Tab label="Monitoring" />
        </Tabs>

        {activeTab === 0 && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">API Routes</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowRouteDialog(true)}
                sx={{ backgroundColor: designTokens.colors.primary[600] }}
              >
                Add Route
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Path</TableCell>
                    <TableCell>Method</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Rate Limit</TableCell>
                    <TableCell>Response Time</TableCell>
                    <TableCell>Success Rate</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {apiRoutes.map((route) => (
                    <TableRow key={route.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {route.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: designTokens.colors.neutral[600] }}>
                            v{route.version}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {route.path}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={route.method} 
                          color={getMethodColor(route.method) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={route.status} 
                          color={getStatusColor(route.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {route.rateLimit}/hour
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {route.responseTime}ms
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {route.successRate}%
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton size="small" onClick={() => setSelectedRoute(route)}>
                            <Visibility />
                          </IconButton>
                          <IconButton size="small">
                            <Edit />
                          </IconButton>
                          <IconButton size="small">
                            <Delete />
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

        {activeTab === 1 && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Rate Limiting Rules</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowRateLimitDialog(true)}
                sx={{ backgroundColor: designTokens.colors.primary[600] }}
              >
                Add Rule
              </Button>
            </Box>

            <Grid container spacing={3}>
                                    {rateLimitRules.map((rule) => (
                        <Grid key={rule.id} xs={12} md={6} lg={4}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" sx={{ color: designTokens.colors.neutral[800] }}>
                          {rule.name}
                        </Typography>
                        <Chip 
                          label={rule.status} 
                          color={rule.status === 'active' ? 'success' : 'default'}
                          size="small"
                        />
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 1 }}>
                          Type: {rule.type}
                        </Typography>
                        <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 1 }}>
                          Limit: {rule.limit} requests per {rule.window}
                        </Typography>
                        <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                          Action: {rule.action}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button size="small" startIcon={<Edit />}>
                          Edit
                        </Button>
                        <Button size="small" startIcon={<Delete />} color="error">
                          Delete
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
          <Box>
            <Typography variant="h6" sx={{ mb: 3 }}>Authentication Methods</Typography>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Security sx={{ color: designTokens.colors.primary[600] }} />
                      <Typography variant="h6">API Key Authentication</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Secure API access using unique API keys with customizable permissions and rate limits.
                    </Typography>
                    <Button variant="outlined" startIcon={<Key />}>
                      Manage Keys
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Lock sx={{ color: designTokens.colors.primary[600] }} />
                      <Typography variant="h6">JWT Authentication</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Token-based authentication with configurable expiration and refresh mechanisms.
                    </Typography>
                    <Button variant="outlined" startIcon={<Settings />}>
                      Configure
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Public sx={{ color: designTokens.colors.primary[600] }} />
                      <Typography variant="h6">OAuth 2.0</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Industry-standard OAuth 2.0 implementation for third-party integrations.
                    </Typography>
                    <Button variant="outlined" startIcon={<Cloud />}>
                      Setup OAuth
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Shield sx={{ color: designTokens.colors.primary[600] }} />
                      <Typography variant="h6">IP Whitelisting</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Restrict API access to specific IP addresses for enhanced security.
                    </Typography>
                    <Button variant="outlined" startIcon={<Firewall />}>
                      Manage IPs
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {activeTab === 3 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 3 }}>Real-time Monitoring</Typography>
            <Grid container spacing={3}>
              <Grid xs={12} md={8}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>API Performance Dashboard</Typography>
                    <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                        Real-time performance charts and metrics would be displayed here
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
                          primary="API Gateway Healthy"
                          secondary="All systems operational"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <Warning sx={{ color: designTokens.colors.warning[600] }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="High Response Time"
                          secondary="User API showing delays"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <Info sx={{ color: designTokens.colors.info[600] }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Rate Limit Warning"
                          secondary="Approaching limits for API key"
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

      {/* Route Details Dialog */}
      <Dialog open={!!selectedRoute} onClose={() => setSelectedRoute(null)} maxWidth="md" fullWidth>
        <DialogTitle>API Route Details</DialogTitle>
        <DialogContent>
          {selectedRoute && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>{selectedRoute.name}</Typography>
              <Typography variant="body2" sx={{ mb: 3, color: designTokens.colors.neutral[600] }}>
                {selectedRoute.description}
              </Typography>
              
              <Grid container spacing={2}>
                <Grid xs={6}>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>Path</Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>{selectedRoute.path}</Typography>
                </Grid>
                <Grid xs={6}>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>Method</Typography>
                  <Chip label={selectedRoute.method} color={getMethodColor(selectedRoute.method) as any} />
                </Grid>
                <Grid xs={6}>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>Status</Typography>
                  <Chip label={selectedRoute.status} color={getStatusColor(selectedRoute.status) as any} />
                </Grid>
                <Grid xs={6}>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>Version</Typography>
                  <Typography variant="body1">v{selectedRoute.version}</Typography>
                </Grid>
                <Grid xs={6}>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>Rate Limit</Typography>
                  <Typography variant="body1">{selectedRoute.rateLimit} requests/hour</Typography>
                </Grid>
                <Grid xs={6}>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>Authentication</Typography>
                  <Typography variant="body1">{selectedRoute.authentication}</Typography>
                </Grid>
                <Grid xs={6}>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>Response Time</Typography>
                  <Typography variant="body1">{selectedRoute.responseTime}ms</Typography>
                </Grid>
                <Grid xs={6}>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>Success Rate</Typography>
                  <Typography variant="body1">{selectedRoute.successRate}%</Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedRoute(null)}>Close</Button>
          <Button variant="contained">Edit Route</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
