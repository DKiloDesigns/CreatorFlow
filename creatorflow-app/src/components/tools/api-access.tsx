'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Switch,
  FormControlLabel,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Tooltip,
  Badge,
  Menu,
  MenuList,
  Stop
} from '@mui/material';
import {
  Code,
  CopyAll,
  PlayArrow,
  Refresh
} from '@mui/icons-material';
import {
  Api,
  Add,
  Edit,
  Delete,
  MoreVert,
  Visibility,
  VisibilityOff,
  CheckCircle,
  Warning,
  Info,
  ExpandMore,
  Business,
  Security,
  Timeline,
  MonetizationOn,
  Campaign,
  Insights,
  Notifications,
  Chat,
  VideoCall,
  Share,
  Lock,
  Public,
  PersonAdd,
  Settings,
  AdminPanelSettings,
  Assignment,
  Schedule,
  Comment,
  ThumbUp,
  Reply,
  Flag,
  Archive,
  Restore,
  Block,
  Unblock,
  Key,
  Shield,
  Speed,
  Analytics,
  BugReport,
  History,
  Download,
  Upload
} from '@mui/icons-material';

interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  status: 'Active' | 'Inactive' | 'Expired';
  createdAt: string;
  lastUsed: string;
  usage: {
    requests: number;
    limit: number;
    resetDate: string;
  };
}

interface APIEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  parameters: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
  response: {
    status: number;
    description: string;
    schema: any;
  };
  rateLimit: {
    requests: number;
    period: string;
  };
}

interface APIUsage {
  id: string;
  endpoint: string;
  method: string;
  status: number;
  timestamp: string;
  responseTime: number;
  userAgent: string;
  ip: string;
}

const apiKeys: APIKey[] = [
  {
    id: '1',
    name: 'Production API Key',
    key: 'cf_live_1234567890abcdef',
    permissions: ['read', 'write', 'analytics'],
    status: 'Active',
    createdAt: '2024-01-15',
    lastUsed: '2024-06-20T10:30:00Z',
    usage: {
      requests: 12500,
      limit: 50000,
      resetDate: '2024-07-01'
    }
  },
  {
    id: '2',
    name: 'Development API Key',
    key: 'cf_test_abcdef1234567890',
    permissions: ['read'],
    status: 'Active',
    createdAt: '2024-02-01',
    lastUsed: '2024-06-19T15:45:00Z',
    usage: {
      requests: 2500,
      limit: 10000,
      resetDate: '2024-07-01'
    }
  },
  {
    id: '3',
    name: 'Analytics Only Key',
    key: 'cf_analytics_9876543210fedcba',
    permissions: ['analytics'],
    status: 'Inactive',
    createdAt: '2024-03-10',
    lastUsed: '2024-06-15T09:20:00Z',
    usage: {
      requests: 500,
      limit: 5000,
      resetDate: '2024-07-01'
    }
  }
];

const apiEndpoints: APIEndpoint[] = [
  {
    id: '1',
    name: 'Get Content',
    method: 'GET',
    path: '/api/v1/content',
    description: 'Retrieve content items with optional filtering',
    parameters: [
      {
        name: 'limit',
        type: 'integer',
        required: false,
        description: 'Number of items to return (max 100)'
      },
      {
        name: 'offset',
        type: 'integer',
        required: false,
        description: 'Number of items to skip'
      },
      {
        name: 'status',
        type: 'string',
        required: false,
        description: 'Filter by content status'
      }
    ],
    response: {
      status: 200,
      description: 'Successfully retrieved content items',
      schema: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                title: { type: 'string' },
                status: { type: 'string' },
                createdAt: { type: 'string' }
              }
            }
          },
          pagination: {
            type: 'object',
            properties: {
              total: { type: 'integer' },
              limit: { type: 'integer' },
              offset: { type: 'integer' }
            }
          }
        }
      }
    },
    rateLimit: {
      requests: 1000,
      period: 'hour'
    }
  },
  {
    id: '2',
    name: 'Create Content',
    method: 'POST',
    path: '/api/v1/content',
    description: 'Create a new content item',
    parameters: [
      {
        name: 'title',
        type: 'string',
        required: true,
        description: 'Content title'
      },
      {
        name: 'body',
        type: 'string',
        required: true,
        description: 'Content body'
      },
      {
        name: 'status',
        type: 'string',
        required: false,
        description: 'Content status (draft, published)'
      }
    ],
    response: {
      status: 201,
      description: 'Content created successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          status: { type: 'string' },
          createdAt: { type: 'string' }
        }
      }
    },
    rateLimit: {
      requests: 100,
      period: 'hour'
    }
  },
  {
    id: '3',
    name: 'Get Analytics',
    method: 'GET',
    path: '/api/v1/analytics',
    description: 'Retrieve analytics data for content',
    parameters: [
      {
        name: 'contentId',
        type: 'string',
        required: true,
        description: 'Content ID to analyze'
      },
      {
        name: 'startDate',
        type: 'string',
        required: false,
        description: 'Start date for analytics (ISO 8601)'
      },
      {
        name: 'endDate',
        type: 'string',
        required: false,
        description: 'End date for analytics (ISO 8601)'
      }
    ],
    response: {
      status: 200,
      description: 'Analytics data retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          contentId: { type: 'string' },
          views: { type: 'integer' },
          engagement: { type: 'number' },
          shares: { type: 'integer' },
          comments: { type: 'integer' }
        }
      }
    },
    rateLimit: {
      requests: 500,
      period: 'hour'
    }
  }
];

const apiUsage: APIUsage[] = [
  {
    id: '1',
    endpoint: '/api/v1/content',
    method: 'GET',
    status: 200,
    timestamp: '2024-06-20T10:30:00Z',
    responseTime: 150,
    userAgent: 'CreatorFlow-API-Client/1.0',
    ip: '192.168.1.100'
  },
  {
    id: '2',
    endpoint: '/api/v1/analytics',
    method: 'GET',
    status: 200,
    timestamp: '2024-06-20T10:25:00Z',
    responseTime: 200,
    userAgent: 'CreatorFlow-API-Client/1.0',
    ip: '192.168.1.100'
  },
  {
    id: '3',
    endpoint: '/api/v1/content',
    method: 'POST',
    status: 201,
    timestamp: '2024-06-20T10:20:00Z',
    responseTime: 300,
    userAgent: 'CreatorFlow-API-Client/1.0',
    ip: '192.168.1.100'
  }
];

export default function APIAccess() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedKey, setSelectedKey] = useState<APIKey | null>(null);
  const [showKeyDialog, setShowKeyDialog] = useState(false);
  const [showEndpointDialog, setShowEndpointDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [testEndpoint, setTestEndpoint] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<any>(null);

  const handleKeyClick = (key: APIKey) => {
    setSelectedKey(key);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTestEndpoint = async (endpoint: APIEndpoint) => {
    setTestEndpoint(endpoint.id);
    setTestResult(null);
    
    // Simulate API test
    setTimeout(() => {
      setTestResult({
        status: 200,
        responseTime: Math.floor(Math.random() * 200) + 100,
        data: {
          message: 'Test successful',
          endpoint: endpoint.path,
          method: endpoint.method
        }
      });
      setTestEndpoint(null);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Inactive': return 'warning';
      case 'Expired': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <CheckCircle color="success" />;
      case 'Inactive': return <Warning color="warning" />;
      case 'Expired': return <Warning color="error" />;
      default: return <Info color="disabled" />;
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'success';
      case 'POST': return 'info';
      case 'PUT': return 'warning';
      case 'DELETE': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom sx={{
          background: 'linear-gradient(45deg, #0066CC, #00CC66)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>
          API Access
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Developer tools and API management for enterprise integration
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Access CreatorFlow's powerful API to build custom integrations and automate workflows.
          </Typography>
        </Alert>
      </Box>

      {/* Main Content */}
      <Paper sx={{ p: 3 }}>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
          <Tab label="API Keys" />
          <Tab label="Endpoints" />
          <Tab label="Usage Analytics" />
          <Tab label="Documentation" />
          <Tab label="Settings" />
        </Tabs>

        {/* API Keys Tab */}
        {activeTab === 0 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                API Keys ({apiKeys.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowKeyDialog(true)}
              >
                New API Key
              </Button>
            </Box>

            <Grid container spacing={3}>
              {apiKeys.map((key) => (
                <Grid item xs={12} md={6} key={key.id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { boxShadow: 4 },
                      border: selectedKey?.id === key.id ? 2 : 0,
                      borderColor: 'primary.main'
                    }}
                    onClick={() => handleKeyClick(key)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6">{key.name}</Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Chip
                            label={key.status}
                            color={getStatusColor(key.status) as any}
                            size="small"
                          />
                          <IconButton onClick={handleMenuClick}>
                            <MoreVert />
                          </IconButton>
                        </Box>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          API Key:
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: 'monospace',
                              backgroundColor: 'grey.100',
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              flex: 1
                            }}
                          >
                            {key.key}
                          </Typography>
                          <IconButton size="small">
                            <CopyAll />
                          </IconButton>
                        </Box>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Permissions:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {key.permissions.map((permission) => (
                            <Chip
                              key={permission}
                              label={permission}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          ))}
                        </Box>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Usage: {key.usage.requests.toLocaleString()} / {key.usage.limit.toLocaleString()}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={(key.usage.requests / key.usage.limit) * 100}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Box>

                      <Typography variant="caption" color="text.secondary">
                        Last used: {new Date(key.lastUsed).toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Endpoints Tab */}
        {activeTab === 1 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                API Endpoints ({apiEndpoints.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowEndpointDialog(true)}
              >
                New Endpoint
              </Button>
            </Box>

            <Grid container spacing={3}>
              {apiEndpoints.map((endpoint) => (
                <Grid item xs={12} key={endpoint.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Chip
                            label={endpoint.method}
                            color={getMethodColor(endpoint.method) as any}
                            size="small"
                          />
                          <Typography variant="h6">{endpoint.name}</Typography>
                        </Box>
                        <Button
                          variant="outlined"
                          startIcon={<PlayArrow />}
                          onClick={() => handleTestEndpoint(endpoint)}
                          disabled={testEndpoint === endpoint.id}
                        >
                          {testEndpoint === endpoint.id ? 'Testing...' : 'Test'}
                        </Button>
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {endpoint.description}
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Endpoint:
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: 'monospace',
                            backgroundColor: 'grey.100',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            display: 'inline-block'
                          }}
                        >
                          {endpoint.method} {endpoint.path}
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Parameters:
                        </Typography>
                        <List dense>
                          {endpoint.parameters.map((param, index) => (
                            <ListItem key={index}>
                              <ListItemText
                                primary={
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                      {param.name}
                                    </Typography>
                                    <Chip
                                      label={param.type}
                                      size="small"
                                      variant="outlined"
                                      sx={{ fontSize: '0.7rem' }}
                                    />
                                    {param.required && (
                                      <Chip
                                        label="Required"
                                        size="small"
                                        color="error"
                                        sx={{ fontSize: '0.7rem' }}
                                      />
                                    )}
                                  </Box>
                                }
                                secondary={param.description}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Rate Limit: {endpoint.rateLimit.requests} requests per {endpoint.rateLimit.period}
                        </Typography>
                      </Box>

                      {testResult && testEndpoint === endpoint.id && (
                        <Alert severity="success" sx={{ mt: 2 }}>
                          <Typography variant="body2">
                            Test successful! Response time: {testResult.responseTime}ms
                          </Typography>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Usage Analytics Tab */}
        {activeTab === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              API Usage Analytics
            </Typography>

            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Speed color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Total Requests</Typography>
                    </Box>
                    <Typography variant="h4" color="primary">
                      15,250
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      This month
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Analytics color="success" sx={{ mr: 1 }} />
                      <Typography variant="h6">Success Rate</Typography>
                    </Box>
                    <Typography variant="h4" color="success.main">
                      99.2%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Last 24 hours
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Timeline color="warning" sx={{ mr: 1 }} />
                      <Typography variant="h6">Avg Response Time</Typography>
                    </Box>
                    <Typography variant="h4" color="warning.main">
                      180ms
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Last 24 hours
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <BugReport color="error" sx={{ mr: 1 }} />
                      <Typography variant="h6">Error Rate</Typography>
                    </Box>
                    <Typography variant="h4" color="error.main">
                      0.8%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Last 24 hours
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Endpoint</TableCell>
                    <TableCell>Method</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Response Time</TableCell>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>IP Address</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {apiUsage.map((usage) => (
                    <TableRow key={usage.id}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {usage.endpoint}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={usage.method}
                          color={getMethodColor(usage.method) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={usage.status}
                          color={usage.status >= 200 && usage.status < 300 ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{usage.responseTime}ms</TableCell>
                      <TableCell>{new Date(usage.timestamp).toLocaleString()}</TableCell>
                      <TableCell>{usage.ip}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Documentation Tab */}
        {activeTab === 3 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              API Documentation
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Getting Started
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      The CreatorFlow API allows you to programmatically access and manage your content, analytics, and team data. 
                      All API requests must include your API key in the Authorization header.
                    </Typography>
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Authentication:
                    </Typography>
                    <Box sx={{ backgroundColor: 'grey.100', p: 2, borderRadius: 1, mb: 2 }}>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        Authorization: Bearer YOUR_API_KEY
                      </Typography>
                    </Box>

                    <Typography variant="subtitle2" gutterBottom>
                      Base URL:
                    </Typography>
                    <Box sx={{ backgroundColor: 'grey.100', p: 2, borderRadius: 1, mb: 2 }}>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        https://api.creatorflow.com/v1
                      </Typography>
                    </Box>

                    <Typography variant="subtitle2" gutterBottom>
                      Rate Limits:
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      API requests are rate limited based on your subscription plan. 
                      Standard rate limits are 1000 requests per hour for most endpoints.
                    </Typography>

                    <Button variant="contained" startIcon={<Download />}>
                      Download SDK
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Quick Links
                    </Typography>
                    <List>
                      <ListItem button>
                        <ListItemIcon>
                          <Code />
                        </ListItemIcon>
                        <ListItemText primary="SDK Documentation" />
                      </ListItem>
                      <ListItem button>
                        <ListItemIcon>
                          <BugReport />
                        </ListItemIcon>
                        <ListItemText primary="Report Issues" />
                      </ListItem>
                      <ListItem button>
                        <ListItemIcon>
                          <History />
                        </ListItemIcon>
                        <ListItemText primary="Changelog" />
                      </ListItem>
                      <ListItem button>
                        <ListItemIcon>
                          <Support />
                        </ListItemIcon>
                        <ListItemText primary="Support" />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Settings Tab */}
        {activeTab === 4 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              API Settings
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Security Settings
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="IP Whitelist"
                          secondary="Restrict API access to specific IP addresses"
                        />
                        <Switch />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Rate Limiting"
                          secondary="Enable rate limiting for API requests"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Request Logging"
                          secondary="Log all API requests for auditing"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Notifications
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Usage Alerts"
                          secondary="Get notified when approaching rate limits"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Error Notifications"
                          secondary="Get notified of API errors"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Weekly Reports"
                          secondary="Receive weekly API usage reports"
                        />
                        <Switch />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* API Key Dialog */}
      <Dialog open={showKeyDialog} onClose={() => setShowKeyDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New API Key</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Key Name"
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Permissions</InputLabel>
            <Select multiple>
              <MenuItem value="read">Read</MenuItem>
              <MenuItem value="write">Write</MenuItem>
              <MenuItem value="analytics">Analytics</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Expiration Date"
            type="date"
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowKeyDialog(false)}>Cancel</Button>
          <Button variant="contained">Create Key</Button>
        </DialogActions>
      </Dialog>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuList>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <Edit />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <CopyAll />
            </ListItemIcon>
            <ListItemText>Copy Key</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <Refresh />
            </ListItemIcon>
            <ListItemText>Regenerate</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <Delete />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </MenuList>
      </Menu>
    </Container>
  );
}
