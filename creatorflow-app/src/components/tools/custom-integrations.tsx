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
  Code,
  CopyAll,
  PlayArrow,
  Stop,
  Refresh
} from '@mui/material';
import {
  Extension,
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
  Upload,
  Integration,
  Webhook,
  Chat,
  Email,
  Science,
  Food,
  Travel,
  Animal,
  Planet,
  News,
  Financial,
  Times,
  Post,
  Tribune,
  USA,
  Today,
  Time,
  Newsweek,
} from '@mui/icons-material';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'Active' | 'Inactive' | 'Error' | 'Pending';
  icon: string;
  lastSync: string;
  syncFrequency: string;
  dataPoints: number;
  errors: number;
  configuration: {
    apiKey: string;
    webhookUrl: string;
    syncSettings: any;
  };
}

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: 'Active' | 'Inactive' | 'Error';
  lastTriggered: string;
  successRate: number;
  secret: string;
}

interface CustomWorkflow {
  id: string;
  name: string;
  description: string;
  triggers: string[];
  actions: string[];
  status: 'Active' | 'Inactive' | 'Draft';
  lastRun: string;
  runs: number;
  successRate: number;
}

const integrations: Integration[] = [
  {
    id: '1',
    name: 'Slack Integration',
    description: 'Sync content updates and analytics to Slack channels',
    category: 'Communication',
    status: 'Active',
    icon: 'Slack',
    lastSync: '2024-06-20T10:30:00Z',
    syncFrequency: 'Real-time',
    dataPoints: 15,
    errors: 0,
    configuration: {
      apiKey: 'slack_1234567890',
      webhookUrl: 'https://hooks.slack.com/services/...',
      syncSettings: {
        channels: ['#content-updates', '#analytics'],
        notifications: true
      }
    }
  },
  {
    id: '2',
    name: 'Zapier Workflow',
    description: 'Automate content publishing across multiple platforms',
    category: 'Automation',
    status: 'Active',
    icon: 'Zapier',
    lastSync: '2024-06-20T09:15:00Z',
    syncFrequency: 'Every 15 minutes',
    dataPoints: 8,
    errors: 2,
    configuration: {
      apiKey: 'zapier_abcdef123456',
      webhookUrl: 'https://hooks.zapier.com/hooks/...',
      syncSettings: {
        platforms: ['Instagram', 'Twitter', 'LinkedIn'],
        autoPublish: true
      }
    }
  },
  {
    id: '3',
    name: 'Google Analytics',
    description: 'Import analytics data from Google Analytics',
    category: 'Analytics',
    status: 'Error',
    icon: 'Google',
    lastSync: '2024-06-19T14:20:00Z',
    syncFrequency: 'Daily',
    dataPoints: 25,
    errors: 5,
    configuration: {
      apiKey: 'ga_9876543210',
      webhookUrl: '',
      syncSettings: {
        propertyId: 'UA-123456789-1',
        metrics: ['pageviews', 'sessions', 'bounceRate']
      }
    }
  },
  {
    id: '4',
    name: 'Mailchimp',
    description: 'Sync subscriber data and campaign performance',
    category: 'Email Marketing',
    status: 'Pending',
    icon: 'Mailchimp',
    lastSync: 'Never',
    syncFrequency: 'Weekly',
    dataPoints: 0,
    errors: 0,
    configuration: {
      apiKey: 'mailchimp_xyz789',
      webhookUrl: '',
      syncSettings: {
        listId: 'list_123456',
        syncFields: ['email', 'firstName', 'lastName']
      }
    }
  }
];

const webhooks: Webhook[] = [
  {
    id: '1',
    name: 'Content Published',
    url: 'https://api.company.com/webhooks/content-published',
    events: ['content.published', 'content.updated'],
    status: 'Active',
    lastTriggered: '2024-06-20T10:30:00Z',
    successRate: 98.5,
    secret: 'whsec_1234567890abcdef'
  },
  {
    id: '2',
    name: 'Analytics Update',
    url: 'https://api.company.com/webhooks/analytics-update',
    events: ['analytics.updated', 'metrics.calculated'],
    status: 'Active',
    lastTriggered: '2024-06-20T09:45:00Z',
    successRate: 99.2,
    secret: 'whsec_abcdef1234567890'
  },
  {
    id: '3',
    name: 'Team Activity',
    url: 'https://api.company.com/webhooks/team-activity',
    events: ['team.member.added', 'team.member.removed'],
    status: 'Inactive',
    lastTriggered: '2024-06-18T16:20:00Z',
    successRate: 95.8,
    secret: 'whsec_9876543210fedcba'
  }
];

const customWorkflows: CustomWorkflow[] = [
  {
    id: '1',
    name: 'Content Approval Workflow',
    description: 'Automatically route content for approval based on team hierarchy',
    triggers: ['content.created', 'content.updated'],
    actions: ['notify.manager', 'assign.reviewer', 'update.status'],
    status: 'Active',
    lastRun: '2024-06-20T10:30:00Z',
    runs: 45,
    successRate: 96.7
  },
  {
    id: '2',
    name: 'Analytics Report Generator',
    description: 'Generate and send weekly analytics reports to stakeholders',
    triggers: ['schedule.weekly', 'analytics.updated'],
    actions: ['generate.report', 'send.email', 'update.dashboard'],
    status: 'Active',
    lastRun: '2024-06-19T09:00:00Z',
    runs: 12,
    successRate: 100
  },
  {
    id: '3',
    name: 'Social Media Scheduler',
    description: 'Automatically schedule content across social platforms',
    triggers: ['content.approved', 'schedule.time'],
    actions: ['publish.instagram', 'publish.twitter', 'publish.linkedin'],
    status: 'Draft',
    lastRun: 'Never',
    runs: 0,
    successRate: 0
  }
];

export default function CustomIntegrations() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [showIntegrationDialog, setShowIntegrationDialog] = useState(false);
  const [showWebhookDialog, setShowWebhookDialog] = useState(false);
  const [showWorkflowDialog, setShowWorkflowDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [testIntegration, setTestIntegration] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<any>(null);

  const handleIntegrationClick = (integration: Integration) => {
    setSelectedIntegration(integration);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTestIntegration = async (integration: Integration) => {
    setTestIntegration(integration.id);
    setTestResult(null);
    
    // Simulate integration test
    setTimeout(() => {
      setTestResult({
        status: integration.status === 'Error' ? 'error' : 'success',
        message: integration.status === 'Error' ? 'Connection failed' : 'Connection successful',
        responseTime: Math.floor(Math.random() * 500) + 100
      });
      setTestIntegration(null);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Inactive': return 'warning';
      case 'Error': return 'error';
      case 'Pending': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <CheckCircle color="success" />;
      case 'Inactive': return <Warning color="warning" />;
      case 'Error': return <Warning color="error" />;
      case 'Pending': return <Info color="info" />;
      default: return <Info color="disabled" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Communication': return <Chat />;
      case 'Automation': return <Extension />;
      case 'Analytics': return <Analytics />;
      case 'Email Marketing': return <Email />;
      default: return <Extension />;
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
          Custom Integrations
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Connect CreatorFlow with your favorite tools and platforms
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Build powerful integrations with third-party services and automate your workflows.
          </Typography>
        </Alert>
      </Box>

      {/* Main Content */}
      <Paper sx={{ p: 3 }}>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
          <Tab label="Integrations" />
          <Tab label="Webhooks" />
          <Tab label="Custom Workflows" />
          <Tab label="Marketplace" />
          <Tab label="Settings" />
        </Tabs>

        {/* Integrations Tab */}
        {activeTab === 0 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Active Integrations ({integrations.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowIntegrationDialog(true)}
              >
                New Integration
              </Button>
            </Box>

            <Grid container spacing={3}>
              {integrations.map((integration) => (
                <Grid item xs={12} sm={6} md={4} key={integration.id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { boxShadow: 4 },
                      border: selectedIntegration?.id === integration.id ? 2 : 0,
                      borderColor: 'primary.main'
                    }}
                    onClick={() => handleIntegrationClick(integration)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {getCategoryIcon(integration.category)}
                          <Typography variant="h6">{integration.name}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Chip
                            label={integration.status}
                            color={getStatusColor(integration.status) as any}
                            size="small"
                          />
                          <IconButton onClick={handleMenuClick}>
                            <MoreVert />
                          </IconButton>
                        </Box>
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {integration.description}
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          Last sync: {new Date(integration.lastSync).toLocaleString()}
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          Data points: {integration.dataPoints} • Errors: {integration.errors}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<PlayArrow />}
                          onClick={() => handleTestIntegration(integration)}
                          disabled={testIntegration === integration.id}
                        >
                          {testIntegration === integration.id ? 'Testing...' : 'Test'}
                        </Button>
                        <Typography variant="caption" color="text.secondary">
                          {integration.syncFrequency}
                        </Typography>
                      </Box>

                      {testResult && testIntegration === integration.id && (
                        <Alert 
                          severity={testResult.status === 'error' ? 'error' : 'success'} 
                          sx={{ mt: 2 }}
                        >
                          <Typography variant="body2">
                            {testResult.message} ({testResult.responseTime}ms)
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

        {/* Webhooks Tab */}
        {activeTab === 1 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Webhooks ({webhooks.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowWebhookDialog(true)}
              >
                New Webhook
              </Button>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>URL</TableCell>
                    <TableCell>Events</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Success Rate</TableCell>
                    <TableCell>Last Triggered</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {webhooks.map((webhook) => (
                    <TableRow key={webhook.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Webhook />
                          <Typography variant="subtitle2">{webhook.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {webhook.url}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {webhook.events.map((event) => (
                            <Chip
                              key={event}
                              label={event}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getStatusIcon(webhook.status)}
                          <Typography variant="body2">{webhook.status}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{webhook.successRate}%</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(webhook.lastTriggered).toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton size="small">
                          <Edit />
                        </IconButton>
                        <IconButton size="small">
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Custom Workflows Tab */}
        {activeTab === 2 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Custom Workflows ({customWorkflows.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowWorkflowDialog(true)}
              >
                New Workflow
              </Button>
            </Box>

            <Grid container spacing={3}>
              {customWorkflows.map((workflow) => (
                <Grid item xs={12} md={6} key={workflow.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6">{workflow.name}</Typography>
                        <Chip
                          label={workflow.status}
                          color={getStatusColor(workflow.status) as any}
                          size="small"
                        />
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {workflow.description}
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Triggers:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {workflow.triggers.map((trigger) => (
                            <Chip
                              key={trigger}
                              label={trigger}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          ))}
                        </Box>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Actions:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {workflow.actions.map((action) => (
                            <Chip
                              key={action}
                              label={action}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          ))}
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          Runs: {workflow.runs} • Success: {workflow.successRate}%
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Last run: {workflow.lastRun === 'Never' ? 'Never' : new Date(workflow.lastRun).toLocaleString()}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button variant="outlined" size="small" startIcon={<PlayArrow />}>
                          Run
                        </Button>
                        <Button variant="outlined" size="small" startIcon={<Edit />}>
                          Edit
                        </Button>
                        <Button variant="outlined" size="small" startIcon={<Delete />}>
                          Delete
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Marketplace Tab */}
        {activeTab === 3 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Integration Marketplace
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Chat color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Slack</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Connect with your team and get real-time notifications
                    </Typography>
                    <Button variant="outlined" size="small">
                      Install
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Extension color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Zapier</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Automate workflows with 5000+ apps
                    </Typography>
                    <Button variant="outlined" size="small">
                      Install
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Google color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Google Analytics</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Import analytics data and insights
                    </Typography>
                    <Button variant="outlined" size="small">
                      Install
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Email color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Mailchimp</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Sync email marketing data and campaigns
                    </Typography>
                    <Button variant="outlined" size="small">
                      Install
                    </Button>
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
              Integration Settings
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
                          primary="API Key Encryption"
                          secondary="Encrypt stored API keys"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Webhook Validation"
                          secondary="Validate webhook signatures"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Rate Limiting"
                          secondary="Limit integration requests"
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
                          primary="Integration Errors"
                          secondary="Get notified of integration failures"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Sync Status"
                          secondary="Get notified of sync status changes"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Weekly Reports"
                          secondary="Receive weekly integration reports"
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

      {/* Integration Dialog */}
      <Dialog open={showIntegrationDialog} onClose={() => setShowIntegrationDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Integration</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Integration Type</InputLabel>
            <Select>
              <MenuItem value="slack">Slack</MenuItem>
              <MenuItem value="zapier">Zapier</MenuItem>
              <MenuItem value="google">Google Analytics</MenuItem>
              <MenuItem value="mailchimp">Mailchimp</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Integration Name"
            margin="normal"
          />
          <TextField
            fullWidth
            label="API Key"
            margin="normal"
            type="password"
          />
          <TextField
            fullWidth
            label="Webhook URL"
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowIntegrationDialog(false)}>Cancel</Button>
          <Button variant="contained">Add Integration</Button>
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
              <PlayArrow />
            </ListItemIcon>
            <ListItemText>Test</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <Refresh />
            </ListItemIcon>
            <ListItemText>Refresh</ListItemText>
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
