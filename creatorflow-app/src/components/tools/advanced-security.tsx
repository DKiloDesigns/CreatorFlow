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
  Security,
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
  Code,
  CopyAll,
  Stop,
  Refresh,
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
  Zapier,
  Slack,
  Discord,
  GitHub,
  Google,
  Microsoft,
  Salesforce,
  HubSpot,
  Mailchimp,
  WordPress,
  Shopify,
  Stripe,
  PayPal,
  Zoom,
  Teams,
  Notion,
  Airtable,
  Trello,
  Asana,
  Jira,
  Confluence,
  Figma,
  Canva,
  Adobe,
  YouTube,
  TikTok,
  Instagram,
  Twitter,
  Facebook,
  LinkedIn,
  Pinterest,
  Snapchat,
  Twitch,
  Spotify,
  Apple,
  Amazon,
  Netflix,
  Disney,
  Hulu,
  Prime,
  HBO,
  Showtime,
  Paramount,
  Peacock,
  Discovery,
  National,
  Geographic,
  History,
  Science,
  Discovery,
  ID,
  TLC,
  HGTV,
  Food,
  Network,
  Travel,
  Channel,
  Animal,
  Planet,
  BBC,
  CNN,
  Fox,
  News,
  MSNBC,
  CNBC,
  Bloomberg,
  Reuters,
  Associated,
  Press,
  AP,
  Reuters,
  Bloomberg,
  MarketWatch,
  Wall,
  Street,
  Journal,
  Financial,
  Times,
  New,
  York,
  Times,
  Washington,
  Post,
  Los,
  Angeles,
  Times,
  Chicago,
  Tribune,
  USA,
  Today,
  Time,
  Newsweek,
} from '@mui/icons-material';

interface SecurityEvent {
  id: string;
  type: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  timestamp: string;
  source: string;
  status: 'Open' | 'Investigating' | 'Resolved' | 'False Positive';
  assignee: string;
  tags: string[];
}

interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'Active' | 'Inactive' | 'Draft';
  lastModified: string;
  rules: {
    name: string;
    condition: string;
    action: string;
  }[];
}

interface SecurityAudit {
  id: string;
  name: string;
  description: string;
  status: 'Passed' | 'Failed' | 'Warning' | 'Pending';
  score: number;
  lastRun: string;
  nextRun: string;
  findings: {
    id: string;
    title: string;
    severity: string;
    description: string;
    recommendation: string;
  }[];
}

const securityEvents: SecurityEvent[] = [
  {
    id: '1',
    type: 'Failed Login Attempt',
    severity: 'Medium',
    description: 'Multiple failed login attempts from IP 192.168.1.100',
    timestamp: '2024-06-20T10:30:00Z',
    source: 'Authentication System',
    status: 'Open',
    assignee: 'Security Team',
    tags: ['Authentication', 'Brute Force', 'IP Block']
  },
  {
    id: '2',
    type: 'Suspicious API Usage',
    severity: 'High',
    description: 'Unusual API usage pattern detected from API key cf_live_1234567890abcdef',
    timestamp: '2024-06-20T09:15:00Z',
    source: 'API Gateway',
    status: 'Investigating',
    assignee: 'Security Team',
    tags: ['API', 'Anomaly', 'Rate Limit']
  },
  {
    id: '3',
    type: 'Data Export Alert',
    severity: 'Critical',
    description: 'Large data export detected from user account sarah@company.com',
    timestamp: '2024-06-19T16:45:00Z',
    source: 'Data Access Monitor',
    status: 'Resolved',
    assignee: 'Security Team',
    tags: ['Data Export', 'User Activity', 'Compliance']
  }
];

const securityPolicies: SecurityPolicy[] = [
  {
    id: '1',
    name: 'Password Policy',
    description: 'Enforce strong password requirements and regular password changes',
    category: 'Authentication',
    status: 'Active',
    lastModified: '2024-06-15',
    rules: [
      {
        name: 'Minimum Length',
        condition: 'Password length >= 12 characters',
        action: 'Reject weak passwords'
      },
      {
        name: 'Complexity',
        condition: 'Must contain uppercase, lowercase, numbers, and symbols',
        action: 'Reject simple passwords'
      },
      {
        name: 'Expiration',
        condition: 'Password age > 90 days',
        action: 'Force password change'
      }
    ]
  },
  {
    id: '2',
    name: 'API Access Control',
    description: 'Control and monitor API access based on user roles and permissions',
    category: 'API Security',
    status: 'Active',
    lastModified: '2024-06-10',
    rules: [
      {
        name: 'Rate Limiting',
        condition: 'API requests > 1000 per hour',
        action: 'Block requests temporarily'
      },
      {
        name: 'IP Whitelist',
        condition: 'API access from non-whitelisted IP',
        action: 'Block access'
      },
      {
        name: 'Authentication',
        condition: 'Missing or invalid API key',
        action: 'Reject request'
      }
    ]
  },
  {
    id: '3',
    name: 'Data Protection',
    description: 'Protect sensitive data and ensure compliance with privacy regulations',
    category: 'Data Security',
    status: 'Active',
    lastModified: '2024-06-05',
    rules: [
      {
        name: 'Data Encryption',
        condition: 'Sensitive data at rest',
        action: 'Encrypt with AES-256'
      },
      {
        name: 'Data Access',
        condition: 'Access to sensitive data',
        action: 'Log and audit access'
      },
      {
        name: 'Data Export',
        condition: 'Large data export request',
        action: 'Require approval and log'
      }
    ]
  }
];

const securityAudits: SecurityAudit[] = [
  {
    id: '1',
    name: 'Authentication Security Audit',
    description: 'Comprehensive audit of authentication systems and user access controls',
    status: 'Passed',
    score: 95,
    lastRun: '2024-06-15',
    nextRun: '2024-07-15',
    findings: [
      {
        id: '1',
        title: 'Strong Password Policy',
        severity: 'Info',
        description: 'Password policy is properly configured and enforced',
        recommendation: 'Continue monitoring password strength'
      },
      {
        id: '2',
        title: 'Multi-Factor Authentication',
        severity: 'Info',
        description: 'MFA is enabled for all admin accounts',
        recommendation: 'Consider enabling MFA for all users'
      }
    ]
  },
  {
    id: '2',
    name: 'API Security Audit',
    description: 'Audit of API endpoints, authentication, and data access controls',
    status: 'Warning',
    score: 78,
    lastRun: '2024-06-10',
    nextRun: '2024-07-10',
    findings: [
      {
        id: '1',
        title: 'Rate Limiting',
        severity: 'Warning',
        description: 'Some endpoints lack proper rate limiting',
        recommendation: 'Implement rate limiting for all public endpoints'
      },
      {
        id: '2',
        title: 'Input Validation',
        severity: 'Medium',
        description: 'Insufficient input validation on some endpoints',
        recommendation: 'Add comprehensive input validation'
      }
    ]
  },
  {
    id: '3',
    name: 'Data Protection Audit',
    description: 'Audit of data encryption, access controls, and compliance measures',
    status: 'Failed',
    score: 65,
    lastRun: '2024-06-05',
    nextRun: '2024-07-05',
    findings: [
      {
        id: '1',
        title: 'Data Encryption',
        severity: 'Critical',
        description: 'Some sensitive data is not properly encrypted',
        recommendation: 'Encrypt all sensitive data at rest and in transit'
      },
      {
        id: '2',
        title: 'Access Logging',
        severity: 'High',
        description: 'Insufficient logging of data access events',
        recommendation: 'Implement comprehensive access logging'
      }
    ]
  }
];

export default function AdvancedSecurity() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(null);
  const [showPolicyDialog, setShowPolicyDialog] = useState(false);
  const [showAuditDialog, setShowAuditDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleEventClick = (event: SecurityEvent) => {
    setSelectedEvent(event);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'error';
      case 'High': return 'warning';
      case 'Medium': return 'info';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'error';
      case 'Investigating': return 'warning';
      case 'Resolved': return 'success';
      case 'False Positive': return 'default';
      default: return 'default';
    }
  };

  const getAuditStatusColor = (status: string) => {
    switch (status) {
      case 'Passed': return 'success';
      case 'Failed': return 'error';
      case 'Warning': return 'warning';
      case 'Pending': return 'info';
      default: return 'default';
    }
  };

  const filteredEvents = securityEvents.filter(event =>
    event.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
          Advanced Security
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Enterprise-grade security and compliance management
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Monitor, manage, and maintain the highest security standards for your organization.
          </Typography>
        </Alert>
      </Box>

      {/* Main Content */}
      <Paper sx={{ p: 3 }}>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
          <Tab label="Security Events" />
          <Tab label="Security Policies" />
          <Tab label="Security Audits" />
          <Tab label="Compliance" />
          <Tab label="Settings" />
        </Tabs>

        {/* Security Events Tab */}
        {activeTab === 0 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Security Events ({filteredEvents.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowPolicyDialog(true)}
              >
                New Policy
              </Button>
            </Box>

            <TextField
              fullWidth
              placeholder="Search security events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ mb: 3 }}
            />

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Severity</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Assignee</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Security />
                          <Typography variant="subtitle2">{event.type}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={event.severity}
                          color={getSeverityColor(event.severity) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{event.description}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={event.status}
                          color={getStatusColor(event.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(event.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>{event.assignee}</TableCell>
                      <TableCell>
                        <IconButton size="small">
                          <Edit />
                        </IconButton>
                        <IconButton size="small">
                          <Comment />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Security Policies Tab */}
        {activeTab === 1 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Security Policies ({securityPolicies.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowPolicyDialog(true)}
              >
                New Policy
              </Button>
            </Box>

            <Grid container spacing={3}>
              {securityPolicies.map((policy) => (
                <Grid item xs={12} md={6} key={policy.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6">{policy.name}</Typography>
                        <Chip
                          label={policy.status}
                          color={policy.status === 'Active' ? 'success' : 'default'}
                          size="small"
                        />
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {policy.description}
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Category: {policy.category}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Last modified: {new Date(policy.lastModified).toLocaleDateString()}
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Rules ({policy.rules.length}):
                        </Typography>
                        <List dense>
                          {policy.rules.map((rule, index) => (
                            <ListItem key={index}>
                              <ListItemText
                                primary={rule.name}
                                secondary={`${rule.condition} → ${rule.action}`}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button variant="outlined" size="small" startIcon={<Edit />}>
                          Edit
                        </Button>
                        <Button variant="outlined" size="small" startIcon={<Settings />}>
                          Configure
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Security Audits Tab */}
        {activeTab === 2 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Security Audits ({securityAudits.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowAuditDialog(true)}
              >
                New Audit
              </Button>
            </Box>

            <Grid container spacing={3}>
              {securityAudits.map((audit) => (
                <Grid item xs={12} md={6} key={audit.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6">{audit.name}</Typography>
                        <Chip
                          label={audit.status}
                          color={getAuditStatusColor(audit.status) as any}
                          size="small"
                        />
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {audit.description}
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Security Score: {audit.score}/100
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={audit.score}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          Last run: {new Date(audit.lastRun).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Next run: {new Date(audit.nextRun).toLocaleDateString()}
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Findings ({audit.findings.length}):
                        </Typography>
                        <List dense>
                          {audit.findings.slice(0, 2).map((finding) => (
                            <ListItem key={finding.id}>
                              <ListItemText
                                primary={finding.title}
                                secondary={finding.description}
                              />
                            </ListItem>
                          ))}
                          {audit.findings.length > 2 && (
                            <ListItem>
                              <ListItemText
                                primary={`+${audit.findings.length - 2} more findings`}
                                sx={{ fontStyle: 'italic' }}
                              />
                            </ListItem>
                          )}
                        </List>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button variant="outlined" size="small" startIcon={<PlayArrow />}>
                          Run Now
                        </Button>
                        <Button variant="outlined" size="small" startIcon={<Edit />}>
                          Edit
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Compliance Tab */}
        {activeTab === 3 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Compliance Management
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Shield color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">GDPR Compliance</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      General Data Protection Regulation compliance status
                    </Typography>
                    <Chip label="Compliant" color="success" size="small" />
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                      Last audit: 2024-06-01
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Security color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">SOC 2 Type II</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Service Organization Control 2 Type II certification
                    </Typography>
                    <Chip label="Certified" color="success" size="small" />
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                      Valid until: 2025-03-15
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Lock color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">ISO 27001</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Information Security Management System certification
                    </Typography>
                    <Chip label="In Progress" color="warning" size="small" />
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                      Expected: 2024-09-30
                    </Typography>
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
              Security Settings
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Authentication Settings
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Multi-Factor Authentication"
                          secondary="Require MFA for all user accounts"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Password Policy"
                          secondary="Enforce strong password requirements"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Session Timeout"
                          secondary="Automatically log out inactive users"
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
                      Monitoring Settings
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Real-time Monitoring"
                          secondary="Monitor security events in real-time"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Alert Notifications"
                          secondary="Get notified of security incidents"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Audit Logging"
                          secondary="Log all security-related activities"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Policy Dialog */}
      <Dialog open={showPolicyDialog} onClose={() => setShowPolicyDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Security Policy</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Policy Name"
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            margin="normal"
            multiline
            rows={3}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select>
              <MenuItem value="Authentication">Authentication</MenuItem>
              <MenuItem value="API Security">API Security</MenuItem>
              <MenuItem value="Data Security">Data Security</MenuItem>
              <MenuItem value="Network Security">Network Security</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPolicyDialog(false)}>Cancel</Button>
          <Button variant="contained">Create Policy</Button>
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
              <Comment />
            </ListItemIcon>
            <ListItemText>Add Comment</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <Archive />
            </ListItemIcon>
            <ListItemText>Archive</ListItemText>
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
