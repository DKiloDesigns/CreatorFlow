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
  MenuList
} from '@mui/material';
import {
  Group,
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
  Unblock
} from '@mui/icons-material';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  status: 'Online' | 'Away' | 'Offline';
  lastActive: string;
  permissions: string[];
  joinDate: string;
  performance: number;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'Planning' | 'Active' | 'Review' | 'Completed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assignees: string[];
  dueDate: string;
  progress: number;
  createdAt: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  status: 'Todo' | 'In Progress' | 'Review' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
  createdAt: string;
  comments: number;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'image' | 'system';
  read: boolean;
}

const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    role: 'Content Manager',
    avatar: '/avatars/sarah.jpg',
    status: 'Online',
    lastActive: '2 minutes ago',
    permissions: ['Create', 'Edit', 'Publish', 'Analytics'],
    joinDate: '2024-01-15',
    performance: 95
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike@company.com',
    role: 'Social Media Specialist',
    avatar: '/avatars/mike.jpg',
    status: 'Away',
    lastActive: '15 minutes ago',
    permissions: ['Create', 'Edit', 'Analytics'],
    joinDate: '2024-02-01',
    performance: 88
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily@company.com',
    role: 'Creative Director',
    avatar: '/avatars/emily.jpg',
    status: 'Online',
    lastActive: '1 minute ago',
    permissions: ['Create', 'Edit', 'Publish', 'Analytics', 'Admin'],
    joinDate: '2023-11-20',
    performance: 92
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david@company.com',
    role: 'Analytics Specialist',
    avatar: '/avatars/david.jpg',
    status: 'Offline',
    lastActive: '2 hours ago',
    permissions: ['Analytics', 'Reports'],
    joinDate: '2024-03-10',
    performance: 90
  }
];

const projects: Project[] = [
  {
    id: '1',
    name: 'Q3 Content Strategy',
    description: 'Develop comprehensive content strategy for Q3 2024',
    status: 'Active',
    priority: 'High',
    assignees: ['Sarah Johnson', 'Emily Rodriguez'],
    dueDate: '2024-09-30',
    progress: 75,
    createdAt: '2024-06-01'
  },
  {
    id: '2',
    name: 'Brand Refresh Campaign',
    description: 'Launch new brand identity across all platforms',
    status: 'Review',
    priority: 'Critical',
    assignees: ['Emily Rodriguez', 'Mike Chen'],
    dueDate: '2024-08-15',
    progress: 90,
    createdAt: '2024-05-15'
  },
  {
    id: '3',
    name: 'Social Media Audit',
    description: 'Comprehensive audit of all social media channels',
    status: 'Planning',
    priority: 'Medium',
    assignees: ['David Kim', 'Mike Chen'],
    dueDate: '2024-07-31',
    progress: 25,
    createdAt: '2024-06-15'
  }
];

const tasks: Task[] = [
  {
    id: '1',
    title: 'Create Instagram content calendar',
    description: 'Plan and schedule Instagram posts for July',
    assignee: 'Sarah Johnson',
    status: 'In Progress',
    priority: 'High',
    dueDate: '2024-06-25',
    createdAt: '2024-06-20',
    comments: 3
  },
  {
    id: '2',
    title: 'Review brand guidelines',
    description: 'Update brand guidelines document',
    assignee: 'Emily Rodriguez',
    status: 'Review',
    priority: 'Medium',
    dueDate: '2024-06-30',
    createdAt: '2024-06-18',
    comments: 1
  },
  {
    id: '3',
    title: 'Analyze Q2 performance',
    description: 'Generate Q2 performance report',
    assignee: 'David Kim',
    status: 'Done',
    priority: 'Low',
    dueDate: '2024-06-15',
    createdAt: '2024-06-10',
    comments: 0
  }
];

const messages: Message[] = [
  {
    id: '1',
    sender: 'Sarah Johnson',
    content: 'Hey team! I just finished the Instagram content calendar. Can someone review it?',
    timestamp: '2 minutes ago',
    type: 'text',
    read: false
  },
  {
    id: '2',
    sender: 'Emily Rodriguez',
    content: 'Great work Sarah! I\'ll take a look and provide feedback.',
    timestamp: '1 minute ago',
    type: 'text',
    read: true
  },
  {
    id: '3',
    sender: 'Mike Chen',
    content: 'Uploaded the new brand assets to the shared drive',
    timestamp: '5 minutes ago',
    type: 'file',
    read: true
  }
];

export default function TeamCollaboration() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMemberClick = (member: TeamMember) => {
    setSelectedMember(member);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Online': return 'success';
      case 'Away': return 'warning';
      case 'Offline': return 'default';
      default: return 'default';
    }
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Online': return <CheckCircle color="success" />;
      case 'Away': return <Warning color="warning" />;
      case 'Offline': return <Info color="disabled" />;
      default: return <Info color="disabled" />;
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
          Team Collaboration
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Advanced team management and collaboration tools for enterprise
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Manage your team, projects, and communication all in one place.
          </Typography>
        </Alert>
      </Box>

      {/* Main Content */}
      <Paper sx={{ p: 3 }}>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
          <Tab label="Team Members" />
          <Tab label="Projects" />
          <Tab label="Tasks" />
          <Tab label="Messages" />
          <Tab label="Settings" />
        </Tabs>

        {/* Team Members Tab */}
        {activeTab === 0 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Team Members ({teamMembers.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<PersonAdd />}
                onClick={() => setShowAddMemberDialog(true)}
              >
                Add Member
              </Button>
            </Box>

            <Grid container spacing={3}>
              {teamMembers.map((member) => (
                <Grid item xs={12} sm={6} md={4} key={member.id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { boxShadow: 4 },
                      border: selectedMember?.id === member.id ? 2 : 0,
                      borderColor: 'primary.main'
                    }}
                    onClick={() => handleMemberClick(member)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={getStatusIcon(member.status)}
                          >
                            <Avatar src={member.avatar} sx={{ width: 56, height: 56 }} />
                          </Badge>
                          <Box>
                            <Typography variant="h6">{member.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {member.role}
                            </Typography>
                          </Box>
                        </Box>
                        <IconButton onClick={handleMenuClick}>
                          <MoreVert />
                        </IconButton>
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {member.email}
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          Performance: {member.performance}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={member.performance}
                          sx={{ mt: 0.5, height: 6, borderRadius: 3 }}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {member.permissions.slice(0, 3).map((permission) => (
                          <Chip
                            key={permission}
                            label={permission}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        ))}
                        {member.permissions.length > 3 && (
                          <Chip
                            label={`+${member.permissions.length - 3}`}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        )}
                      </Box>

                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        Last active: {member.lastActive}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Projects Tab */}
        {activeTab === 1 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Active Projects ({projects.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowProjectDialog(true)}
              >
                New Project
              </Button>
            </Box>

            <Grid container spacing={3}>
              {projects.map((project) => (
                <Grid item xs={12} md={6} key={project.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6">{project.name}</Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Chip
                            label={project.status}
                            color={project.status === 'Active' ? 'success' : 'default'}
                            size="small"
                          />
                          <Chip
                            label={project.priority}
                            color={getPriorityColor(project.priority) as any}
                            size="small"
                          />
                        </Box>
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {project.description}
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          Progress: {project.progress}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={project.progress}
                          sx={{ mt: 0.5, height: 6, borderRadius: 3 }}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          Due: {new Date(project.dueDate).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {project.assignees.length} assignees
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {project.assignees.map((assignee) => (
                          <Chip
                            key={assignee}
                            label={assignee}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Tasks Tab */}
        {activeTab === 2 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Tasks ({tasks.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowTaskDialog(true)}
              >
                New Task
              </Button>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Task</TableCell>
                    <TableCell>Assignee</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Comments</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2">{task.title}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {task.description}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{task.assignee}</TableCell>
                      <TableCell>
                        <Chip
                          label={task.status}
                          color={task.status === 'Done' ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={task.priority}
                          color={getPriorityColor(task.priority) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Comment color="action" />
                          <Typography variant="body2">{task.comments}</Typography>
                        </Box>
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

        {/* Messages Tab */}
        {activeTab === 3 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Team Messages
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Paper sx={{ p: 3, height: 400, overflow: 'auto' }}>
                  {messages.map((message) => (
                    <Box key={message.id} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {message.sender.charAt(0)}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="subtitle2">{message.sender}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {message.timestamp}
                            </Typography>
                            {!message.read && (
                              <Chip label="New" size="small" color="primary" />
                            )}
                          </Box>
                          <Typography variant="body2">{message.content}</Typography>
                        </Box>
                      </Box>
                      <Divider sx={{ mt: 1 }} />
                    </Box>
                  ))}
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, height: 400 }}>
                  <Typography variant="h6" gutterBottom>
                    Quick Actions
                  </Typography>
                  
                  <List>
                    <ListItem button>
                      <ListItemIcon>
                        <VideoCall />
                      </ListItemIcon>
                      <ListItemText primary="Start Video Call" />
                    </ListItem>
                    <ListItem button>
                      <ListItemIcon>
                        <Chat />
                      </ListItemIcon>
                      <ListItemText primary="Send Message" />
                    </ListItem>
                    <ListItem button>
                      <ListItemIcon>
                        <Share />
                      </ListItemIcon>
                      <ListItemText primary="Share File" />
                    </ListItem>
                    <ListItem button>
                      <ListItemIcon>
                        <Schedule />
                      </ListItemIcon>
                      <ListItemText primary="Schedule Meeting" />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Settings Tab */}
        {activeTab === 4 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Team Settings
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Permissions
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Content Creation"
                          secondary="Who can create and edit content"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Publishing"
                          secondary="Who can publish content"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Analytics Access"
                          secondary="Who can view analytics"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Admin Functions"
                          secondary="Who can manage team settings"
                        />
                        <Switch />
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
                          primary="Email Notifications"
                          secondary="Receive updates via email"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Push Notifications"
                          secondary="Receive push notifications"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Task Reminders"
                          secondary="Get reminded about due tasks"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Project Updates"
                          secondary="Get notified about project changes"
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

      {/* Add Member Dialog */}
      <Dialog open={showAddMemberDialog} onClose={() => setShowAddMemberDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Team Member</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="creator">Content Creator</MenuItem>
              <MenuItem value="analyst">Analyst</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddMemberDialog(false)}>Cancel</Button>
          <Button variant="contained">Add Member</Button>
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
              <Settings />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <Block />
            </ListItemIcon>
            <ListItemText>Block</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <Delete />
            </ListItemIcon>
            <ListItemText>Remove</ListItemText>
          </MenuItem>
        </MenuList>
      </Menu>
    </Container>
  );
}
