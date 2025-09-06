'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Divider,
  Alert,
  Badge,
  Tooltip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Snackbar
} from '@mui/material';
import {
  Extension,
  IntegrationInstructions,
  Webhook,
  Api,
  Security,
  Speed,
  CheckCircle,
  Warning,
  Error,
  Download,
  Share,
  Refresh,
  Settings,
  Visibility,
  VisibilityOff,
  FilterList,
  Star,
  TrendingUp,
  TrendingDown,
  ExpandMore,
  ContentCopy,
  PlayArrow,
  Stop,
  Pause,
  Add,
  Remove,
  Update,
  Build,
  Code,
  Cloud,
  Storage,
  Analytics,
  Campaign,
  Business,
  ShoppingCart,
  Payment,
  Email,
  Chat,
  VideoCall,
  CalendarToday,
  LocationOn,
  Phone,
  Fax
} from '@/lib/mui-optimized-imports';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  provider: string;
  status: 'active' | 'inactive' | 'beta' | 'deprecated';
  version: string;
  lastUpdated: string;
  rating: number;
  installs: number;
  price: 'free' | 'premium' | 'enterprise';
  features: string[];
  apiEndpoints: number;
  webhooks: number;
  documentation: string;
  support: string;
}

interface IntegrationCategory {
  name: string;
  icon: React.ReactNode;
  description: string;
  integrations: number;
  popular: boolean;
}

interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  triggers: string[];
  actions: string[];
  status: 'active' | 'inactive' | 'draft';
  lastRun: string;
  nextRun: string;
  successRate: number;
  executions: number;
}

export default function EnterpriseIntegrationsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [categories, setCategories] = useState<IntegrationCategory[]>([]);
  const [automationWorkflows, setAutomationWorkflows] = useState<AutomationWorkflow[]>([]);
  const [showIntegrationDialog, setShowIntegrationDialog] = useState(false);
  const [showWorkflowDialog, setShowWorkflowDialog] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<AutomationWorkflow | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as any });

  useEffect(() => {
    loadIntegrationsData();
  }, []);

  const loadIntegrationsData = async () => {
    // Simulate loading integrations data
    setIntegrations([
      {
        id: '1',
        name: 'Salesforce CRM',
        description: 'Enterprise CRM integration for lead management and sales tracking',
        category: 'CRM',
        provider: 'Salesforce',
        status: 'active',
        version: '2.1.0',
        lastUpdated: '2025-01-15T00:00:00Z',
        rating: 4.8,
        installs: 1250,
        price: 'enterprise',
        features: ['Lead Management', 'Sales Tracking', 'Contact Sync', 'Pipeline Analytics'],
        apiEndpoints: 45,
        webhooks: 12,
        documentation: 'https://docs.creatorflow.com/integrations/salesforce',
        support: '24/7 Enterprise Support'
      },
      {
        id: '2',
        name: 'HubSpot Marketing',
        description: 'Marketing automation and lead nurturing integration',
        category: 'Marketing',
        provider: 'HubSpot',
        status: 'active',
        version: '1.9.5',
        lastUpdated: '2025-01-10T00:00:00Z',
        rating: 4.6,
        installs: 890,
        price: 'premium',
        features: ['Email Marketing', 'Lead Nurturing', 'Campaign Analytics', 'Contact Management'],
        apiEndpoints: 32,
        webhooks: 8,
        documentation: 'https://docs.creatorflow.com/integrations/hubspot',
        support: 'Business Hours Support'
      },
      {
        id: '3',
        name: 'Stripe Payments',
        description: 'Payment processing and subscription management',
        category: 'Payments',
        provider: 'Stripe',
        status: 'active',
        version: '3.2.1',
        lastUpdated: '2025-01-12T00:00:00Z',
        rating: 4.9,
        installs: 2100,
        price: 'premium',
        features: ['Payment Processing', 'Subscription Management', 'Invoice Generation', 'Revenue Analytics'],
        apiEndpoints: 28,
        webhooks: 15,
        documentation: 'https://docs.creatorflow.com/integrations/stripe',
        support: '24/7 Support'
      },
      {
        id: '4',
        name: 'Slack Communication',
        description: 'Team communication and notification integration',
        category: 'Communication',
        provider: 'Slack',
        status: 'active',
        version: '2.0.3',
        lastUpdated: '2025-01-08T00:00:00Z',
        rating: 4.7,
        installs: 1560,
        price: 'free',
        features: ['Team Notifications', 'Channel Integration', 'Bot Commands', 'File Sharing'],
        apiEndpoints: 18,
        webhooks: 6,
        documentation: 'https://docs.creatorflow.com/integrations/slack',
        support: 'Community Support'
      }
    ]);

    setCategories([
      {
        name: 'CRM & Sales',
        icon: <Business />,
        description: 'Customer relationship management and sales automation',
        integrations: 12,
        popular: true
      },
      {
        name: 'Marketing & Analytics',
        icon: <Analytics />,
        description: 'Marketing automation and analytics tools',
        integrations: 18,
        popular: true
      },
      {
        name: 'Payments & Billing',
        icon: <Payment />,
        description: 'Payment processing and financial management',
        integrations: 8,
        popular: false
      },
      {
        name: 'Communication',
        icon: <Chat />,
        description: 'Team communication and collaboration tools',
        integrations: 15,
        popular: false
      },
      {
        name: 'Project Management',
        icon: <Build />,
        description: 'Project tracking and team collaboration',
        integrations: 10,
        popular: false
      },
      {
        name: 'E-commerce',
        icon: <ShoppingCart />,
        description: 'Online store and inventory management',
        integrations: 14,
        popular: true
      }
    ]);

    setAutomationWorkflows([
      {
        id: '1',
        name: 'Lead Nurturing Workflow',
        description: 'Automated lead nurturing based on engagement behavior',
        triggers: ['New Lead Created', 'Lead Engagement Score > 50', 'Email Opened'],
        actions: ['Send Welcome Email', 'Add to Nurture Sequence', 'Update Lead Score'],
        status: 'active',
        lastRun: '2025-01-15T10:30:00Z',
        nextRun: '2025-01-15T14:00:00Z',
        successRate: 94.2,
        executions: 1250
      },
      {
        id: '2',
        name: 'Social Media Automation',
        description: 'Automated social media posting and engagement',
        triggers: ['Content Published', 'Scheduled Time Reached', 'Engagement Threshold Met'],
        actions: ['Post to Social Media', 'Send Engagement Notifications', 'Update Analytics'],
        status: 'active',
        lastRun: '2025-01-15T09:15:00Z',
        nextRun: '2025-01-15T12:00:00Z',
        successRate: 98.7,
        executions: 890
      },
      {
        id: '3',
        name: 'Customer Onboarding',
        description: 'Automated customer onboarding sequence',
        triggers: ['New Customer Signup', 'Payment Confirmed', 'First Login'],
        actions: ['Send Welcome Email', 'Create Onboarding Tasks', 'Schedule Follow-up'],
        status: 'active',
        lastRun: '2025-01-15T08:45:00Z',
        nextRun: '2025-01-15T11:00:00Z',
        successRate: 96.8,
        executions: 450
      }
    ]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'beta':
        return 'warning';
      case 'deprecated':
        return 'error';
      case 'inactive':
        return 'default';
      default:
        return 'default';
    }
  };

  const getPriceColor = (price: string) => {
    switch (price) {
      case 'enterprise':
        return 'error';
      case 'premium':
        return 'warning';
      case 'free':
        return 'success';
      default:
        return 'default';
    }
  };

  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName) {
      case 'CRM & Sales':
        return <Business />;
      case 'Marketing & Analytics':
        return <Analytics />;
      case 'Payments & Billing':
        return <Payment />;
      case 'Communication':
        return <Chat />;
      case 'Project Management':
        return <Build />;
      case 'E-commerce':
        return <ShoppingCart />;
      default:
        return <Extension />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          color={i <= rating ? 'warning' : 'disabled'}
          fontSize="small"
        />
      );
    }
    return stars;
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1600, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Extension color="primary" />
          Enterprise Integrations
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Third-party integrations, automation workflows, and advanced enterprise capabilities
        </Typography>
      </Box>

      {/* Integration Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" color="primary" gutterBottom>
                    {integrations.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Available Integrations
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <Extension />
                </Avatar>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <CheckCircle color="success" fontSize="small" />
                <Typography variant="body2" color="success.main" sx={{ ml: 1 }}>
                  All integrations active
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" color="primary" gutterBottom>
                    {categories.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Integration Categories
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <IntegrationInstructions />
                </Avatar>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <TrendingUp color="success" fontSize="small" />
                <Typography variant="body2" color="success.main" sx={{ ml: 1 }}>
                  Growing ecosystem
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" color="primary" gutterBottom>
                    {automationWorkflows.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Automation Workflows
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <Webhook />
                </Avatar>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Speed color="info" fontSize="small" />
                <Typography variant="body2" color="info.main" sx={{ ml: 1 }}>
                  High performance
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" color="primary" gutterBottom>
                    99.9%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Integration Uptime
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <Security />
                </Avatar>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <CheckCircle color="success" fontSize="small" />
                <Typography variant="body2" color="success.main" sx={{ ml: 1 }}>
                  Enterprise reliability
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Integration Marketplace" icon={<Extension />} />
          <Tab label="Categories" icon={<IntegrationInstructions />} />
          <Tab label="Automation Workflows" icon={<Webhook />} />
          <Tab label="API & Webhooks" icon={<Api />} />
          <Tab label="Settings" icon={<Settings />} />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">Integration Marketplace</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowIntegrationDialog(true)}
            >
              Request Integration
            </Button>
          </Box>

          <Grid container spacing={3}>
            {integrations.map((integration) => (
              <Grid item xs={12} md={6} key={integration.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {integration.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {integration.description}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip 
                          label={integration.status} 
                          color={getStatusColor(integration.status) as any}
                          size="small"
                        />
                        <Chip 
                          label={integration.price} 
                          color={getPriceColor(integration.price) as any}
                          size="small"
                        />
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Provider: {integration.provider}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Version: {integration.version}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      {renderStars(integration.rating)}
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({integration.rating}) • {integration.installs.toLocaleString()} installs
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Features:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {integration.features.map((feature) => (
                          <Chip 
                            key={feature} 
                            label={feature} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip 
                          label={`${integration.apiEndpoints} APIs`} 
                          size="small" 
                          color="info"
                        />
                        <Chip 
                          label={`${integration.webhooks} Webhooks`} 
                          size="small" 
                          color="warning"
                        />
                      </Box>
                      <Button variant="outlined" size="small">
                        Install
                      </Button>
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
          <Typography variant="h5" gutterBottom>Integration Categories</Typography>
          
          <Grid container spacing={3}>
            {categories.map((category) => (
              <Grid item xs={12} md={6} key={category.name}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {category.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="h6">
                          {category.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {category.description}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        {category.integrations} integrations available
                      </Typography>
                      {category.popular && (
                        <Chip 
                          label="Popular" 
                          color="success" 
                          size="small"
                          icon={<TrendingUp />}
                        />
                      )}
                    </Box>

                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{ mt: 2 }}
                    >
                      Browse Category
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {activeTab === 2 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">Automation Workflows</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowWorkflowDialog(true)}
            >
              Create Workflow
            </Button>
          </Box>

          <Card>
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Workflow</TableCell>
                      <TableCell>Triggers</TableCell>
                      <TableCell>Actions</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Success Rate</TableCell>
                      <TableCell>Last Run</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {automationWorkflows.map((workflow) => (
                      <TableRow key={workflow.id}>
                        <TableCell>
                          <Box>
                            <Typography variant="body1" fontWeight="bold">
                              {workflow.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {workflow.description}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            {workflow.triggers.map((trigger, index) => (
                              <Chip 
                                key={index} 
                                label={trigger} 
                                size="small" 
                                color="primary" 
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            {workflow.actions.map((action, index) => (
                              <Chip 
                                key={index} 
                                label={action} 
                                size="small" 
                                color="success" 
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={workflow.status} 
                            color={getStatusColor(workflow.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2">{workflow.successRate}%</Typography>
                            <LinearProgress 
                              variant="determinate" 
                              value={workflow.successRate} 
                              sx={{ width: 60, height: 6, borderRadius: 3 }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDateTime(workflow.lastRun)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <IconButton>
                            {/* <MoreVert /> */}
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>
      )}

      {activeTab === 3 && (
        <Box>
          <Typography variant="h5" gutterBottom>API & Webhooks</Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>API Endpoints</Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Total API Endpoints" 
                        secondary="Available for integration"
                      />
                      <Chip 
                        label="156" 
                        color="primary" 
                        size="small"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Rate Limiting" 
                        secondary="Per integration basis"
                      />
                      <Chip 
                        label="Configurable" 
                        color="info" 
                        size="small"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Authentication" 
                        secondary="API key management"
                      />
                      <Chip 
                        label="OAuth 2.0" 
                        color="success" 
                        size="small"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Webhook Management</Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Active Webhooks" 
                        secondary="Real-time notifications"
                      />
                      <Chip 
                        label="24" 
                        color="success" 
                        size="small"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Delivery Success" 
                        secondary="Webhook reliability"
                      />
                      <Chip 
                        label="99.8%" 
                        color="success" 
                        size="small"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Retry Logic" 
                        secondary="Failed delivery handling"
                      />
                      <Chip 
                        label="Enabled" 
                        color="warning" 
                        size="small"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {activeTab === 4 && (
        <Box>
          <Typography variant="h5" gutterBottom>Integration Settings</Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Security Settings</Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="API Key Rotation" 
                        secondary="Automatic key rotation for security"
                      />
                      <Switch checked={true} />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="IP Whitelisting" 
                        secondary="Restrict integration access"
                      />
                      <Switch checked={true} />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Audit Logging" 
                        secondary="Track all integration activity"
                      />
                      <Switch checked={true} />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Performance Settings</Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Rate Limiting" 
                        secondary="Prevent API abuse"
                      />
                      <Switch checked={true} />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Caching" 
                        secondary="Improve response times"
                      />
                      <Switch checked={true} />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Load Balancing" 
                        secondary="Distribute API requests"
                      />
                      <Switch checked={true} />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Integration Request Dialog */}
      <Dialog open={showIntegrationDialog} onClose={() => setShowIntegrationDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Request New Integration</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Integration Name"
              margin="normal"
              required
              placeholder="e.g., Microsoft Dynamics 365"
            />
            <TextField
              fullWidth
              label="Provider/Company"
              margin="normal"
              required
              placeholder="e.g., Microsoft"
            />
            <TextField
              fullWidth
              label="Description"
              margin="normal"
              multiline
              rows={3}
              placeholder="Describe what this integration should do"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select label="Category">
                <MenuItem value="crm">CRM & Sales</MenuItem>
                <MenuItem value="marketing">Marketing & Analytics</MenuItem>
                <MenuItem value="payments">Payments & Billing</MenuItem>
                <MenuItem value="communication">Communication</MenuItem>
                <MenuItem value="project">Project Management</MenuItem>
                <MenuItem value="ecommerce">E-commerce</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowIntegrationDialog(false)}>Cancel</Button>
          <Button variant="contained">Submit Request</Button>
        </DialogActions>
      </Dialog>

      {/* Workflow Creation Dialog */}
      <Dialog open={showWorkflowDialog} onClose={() => setShowWorkflowDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Automation Workflow</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Workflow Name"
              margin="normal"
              required
              placeholder="e.g., Customer Onboarding Sequence"
            />
            <TextField
              fullWidth
              label="Description"
              margin="normal"
              multiline
              rows={3}
              placeholder="Describe what this workflow accomplishes"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Triggers</InputLabel>
              <Select multiple label="Triggers">
                <MenuItem value="new_lead">New Lead Created</MenuItem>
                <MenuItem value="email_opened">Email Opened</MenuItem>
                <MenuItem value="form_submitted">Form Submitted</MenuItem>
                <MenuItem value="payment_received">Payment Received</MenuItem>
                <MenuItem value="user_login">User Login</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Actions</InputLabel>
              <Select multiple label="Actions">
                <MenuItem value="send_email">Send Email</MenuItem>
                <MenuItem value="update_crm">Update CRM</MenuItem>
                <MenuItem value="create_task">Create Task</MenuItem>
                <MenuItem value="send_notification">Send Notification</MenuItem>
                <MenuItem value="update_analytics">Update Analytics</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowWorkflowDialog(false)}>Cancel</Button>
          <Button variant="contained">Create Workflow</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
{/* Bottom Spacer to Clear Bottom Navigation */}
      <Box sx={{
        height: { xs: '120px', sm: '40px' },
        width: '100%'
      }} />
