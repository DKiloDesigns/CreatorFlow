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
  Support,
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
  Code,
  CopyAll,
  PlayArrow,
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

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  category: string;
  assignee: string;
  createdAt: string;
  updatedAt: string;
  responseTime: number;
  resolutionTime: number;
  tags: string[];
}

interface SupportAgent {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  status: 'Online' | 'Away' | 'Offline';
  specialization: string[];
  rating: number;
  ticketsResolved: number;
  averageResponseTime: number;
}

interface KnowledgeBase {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  views: number;
  helpful: number;
  lastUpdated: string;
  author: string;
}

const supportTickets: SupportTicket[] = [
  {
    id: '1',
    title: 'API Integration Error',
    description: 'Getting 500 error when trying to integrate with Slack API',
    priority: 'High',
    status: 'In Progress',
    category: 'Technical',
    assignee: 'Sarah Johnson',
    createdAt: '2024-06-20T10:30:00Z',
    updatedAt: '2024-06-20T11:15:00Z',
    responseTime: 15,
    resolutionTime: 0,
    tags: ['API', 'Slack', 'Integration']
  },
  {
    id: '2',
    title: 'Billing Question',
    description: 'Need clarification on enterprise pricing and features',
    priority: 'Medium',
    status: 'Resolved',
    category: 'Billing',
    assignee: 'Mike Chen',
    createdAt: '2024-06-19T14:20:00Z',
    updatedAt: '2024-06-19T16:45:00Z',
    responseTime: 30,
    resolutionTime: 145,
    tags: ['Billing', 'Pricing', 'Enterprise']
  },
  {
    id: '3',
    title: 'Feature Request',
    description: 'Would like to add custom branding to white-label solution',
    priority: 'Low',
    status: 'Open',
    category: 'Feature Request',
    assignee: 'Emily Rodriguez',
    createdAt: '2024-06-18T09:15:00Z',
    updatedAt: '2024-06-18T09:15:00Z',
    responseTime: 0,
    resolutionTime: 0,
    tags: ['Feature', 'White-label', 'Branding']
  }
];

const supportAgents: SupportAgent[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@creatorflow.com',
    role: 'Senior Support Engineer',
    avatar: '/avatars/sarah.jpg',
    status: 'Online',
    specialization: ['API', 'Integrations', 'Technical'],
    rating: 4.9,
    ticketsResolved: 156,
    averageResponseTime: 12
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike@creatorflow.com',
    role: 'Support Specialist',
    avatar: '/avatars/mike.jpg',
    status: 'Away',
    specialization: ['Billing', 'Account Management', 'General'],
    rating: 4.7,
    ticketsResolved: 89,
    averageResponseTime: 18
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily@creatorflow.com',
    role: 'Product Specialist',
    avatar: '/avatars/emily.jpg',
    status: 'Online',
    specialization: ['Features', 'Product', 'Training'],
    rating: 4.8,
    ticketsResolved: 134,
    averageResponseTime: 15
  }
];

const knowledgeBase: KnowledgeBase[] = [
  {
    id: '1',
    title: 'Getting Started with CreatorFlow API',
    content: 'Learn how to integrate CreatorFlow with your applications using our REST API...',
    category: 'API',
    tags: ['API', 'Getting Started', 'Integration'],
    views: 1250,
    helpful: 89,
    lastUpdated: '2024-06-15',
    author: 'Sarah Johnson'
  },
  {
    id: '2',
    title: 'White-label Configuration Guide',
    content: 'Step-by-step guide to configure your white-label solution...',
    category: 'Configuration',
    tags: ['White-label', 'Configuration', 'Branding'],
    views: 890,
    helpful: 67,
    lastUpdated: '2024-06-10',
    author: 'Emily Rodriguez'
  },
  {
    id: '3',
    title: 'Troubleshooting Common Issues',
    content: 'Solutions to the most common issues users encounter...',
    category: 'Troubleshooting',
    tags: ['Troubleshooting', 'Issues', 'Solutions'],
    views: 2100,
    helpful: 156,
    lastUpdated: '2024-06-12',
    author: 'Mike Chen'
  }
];

export default function PrioritySupport() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showTicketDialog, setShowTicketDialog] = useState(false);
  const [showAgentDialog, setShowAgentDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleTicketClick = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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
      case 'In Progress': return 'warning';
      case 'Resolved': return 'success';
      case 'Closed': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Online': return <CheckCircle color="success" />;
      case 'Away': return <Warning color="warning" />;
      case 'Offline': return <Info color="disabled" />;
      default: return <Info color="disabled" />;
    }
  };

  const filteredTickets = supportTickets.filter(ticket =>
    ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
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
          Priority Support
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Dedicated support and account management for enterprise customers
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Get priority support with dedicated account managers and faster response times.
          </Typography>
        </Alert>
      </Box>

      {/* Main Content */}
      <Paper sx={{ p: 3 }}>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
          <Tab label="Support Tickets" />
          <Tab label="Live Chat" />
          <Tab label="Knowledge Base" />
          <Tab label="Support Team" />
          <Tab label="Settings" />
        </Tabs>

        {/* Support Tickets Tab */}
        {activeTab === 0 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Support Tickets ({filteredTickets.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowTicketDialog(true)}
              >
                New Ticket
              </Button>
            </Box>

            <TextField
              fullWidth
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ mb: 3 }}
            />

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Assignee</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Response Time</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2">{ticket.title}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {ticket.description}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={ticket.priority}
                          color={getPriorityColor(ticket.priority) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={ticket.status}
                          color={getStatusColor(ticket.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{ticket.assignee}</TableCell>
                      <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {ticket.responseTime > 0 ? `${ticket.responseTime} min` : 'Pending'}
                      </TableCell>
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

        {/* Live Chat Tab */}
        {activeTab === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Live Chat Support
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Paper sx={{ p: 3, height: 400, overflow: 'auto' }}>
                  <Typography variant="h6" gutterBottom>
                    Chat with Support
                  </Typography>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      Our support team is online and ready to help. Average response time: 2 minutes.
                    </Typography>
                  </Alert>
                  
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                      fullWidth
                      placeholder="Type your message..."
                      size="small"
                    />
                    <Button variant="contained" startIcon={<Send />}>
                      Send
                    </Button>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, height: 400 }}>
                  <Typography variant="h6" gutterBottom>
                    Available Agents
                  </Typography>
                  
                  <List>
                    {supportAgents.map((agent) => (
                      <ListItem key={agent.id}>
                        <ListItemIcon>
                          <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={getStatusIcon(agent.status)}
                          >
                            <Avatar src={agent.avatar} />
                          </Badge>
                        </ListItemIcon>
                        <ListItemText
                          primary={agent.name}
                          secondary={
                            <Box>
                              <Typography variant="caption" display="block">
                                {agent.role}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Rating: {agent.rating}/5
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Knowledge Base Tab */}
        {activeTab === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Knowledge Base
            </Typography>

            <TextField
              fullWidth
              placeholder="Search knowledge base..."
              sx={{ mb: 3 }}
            />

            <Grid container spacing={3}>
              {knowledgeBase.map((article) => (
                <Grid item xs={12} md={6} key={article.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {article.title}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {article.content}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                        {article.tags.map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        ))}
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          {article.views} views • {article.helpful} helpful
                        </Typography>
                        <Button variant="outlined" size="small">
                          Read More
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Support Team Tab */}
        {activeTab === 3 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Support Team
            </Typography>

            <Grid container spacing={3}>
              {supportAgents.map((agent) => (
                <Grid item xs={12} sm={6} md={4} key={agent.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Badge
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          badgeContent={getStatusIcon(agent.status)}
                        >
                          <Avatar src={agent.avatar} sx={{ width: 56, height: 56 }} />
                        </Badge>
                        <Box>
                          <Typography variant="h6">{agent.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {agent.role}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {agent.email}
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Specialization:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {agent.specialization.map((spec) => (
                            <Chip
                              key={spec}
                              label={spec}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          ))}
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          Rating: {agent.rating}/5
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {agent.ticketsResolved} tickets resolved
                        </Typography>
                      </Box>

                      <Typography variant="caption" color="text.secondary">
                        Avg. response time: {agent.averageResponseTime} minutes
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Settings Tab */}
        {activeTab === 4 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Support Settings
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Notification Settings
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Email Notifications"
                          secondary="Get notified of ticket updates via email"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="SMS Notifications"
                          secondary="Get notified of critical issues via SMS"
                        />
                        <Switch />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Push Notifications"
                          secondary="Get push notifications for new messages"
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
                      Priority Settings
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Auto-assign Tickets"
                          secondary="Automatically assign tickets to available agents"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Escalation Rules"
                          secondary="Automatically escalate unresolved tickets"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="SLA Monitoring"
                          secondary="Monitor and alert on SLA violations"
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

      {/* Ticket Dialog */}
      <Dialog open={showTicketDialog} onClose={() => setShowTicketDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Support Ticket</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            margin="normal"
            multiline
            rows={4}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Priority</InputLabel>
            <Select>
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Critical">Critical</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select>
              <MenuItem value="Technical">Technical</MenuItem>
              <MenuItem value="Billing">Billing</MenuItem>
              <MenuItem value="Feature Request">Feature Request</MenuItem>
              <MenuItem value="General">General</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTicketDialog(false)}>Cancel</Button>
          <Button variant="contained">Create Ticket</Button>
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
