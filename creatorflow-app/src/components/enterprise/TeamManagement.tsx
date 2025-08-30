"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Alert,
  IconButton,
  Tooltip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  FormControlLabel,
  Divider,
  Badge,
  Tabs,
  Tab
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
  Security,
  Group,
  PersonAdd,
  Settings,
  Shield,
  AdminPanelSettings,
  SupervisorAccount,
  Person,
  CheckCircle,
  Warning,
  Error,
  Info,
  Refresh,
  FilterList,
  Search,
  MoreVert,
  Email,
  Phone,
  CalendarToday,
  AccessTime,
  TrendingUp,
  TrendingDown,
  Lock,
  Public,
  Business,
  School,
  Work
} from '@mui/icons-material';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'manager' | 'editor' | 'viewer';
  status: 'active' | 'inactive' | 'pending';
  permissions: {
    content: boolean;
    analytics: boolean;
    billing: boolean;
    team: boolean;
    integrations: boolean;
    settings: boolean;
  };
  joinedAt: string;
  lastActive: string;
  department?: string;
  location?: string;
  phone?: string;
  twoFactorEnabled: boolean;
  sessions: number;
}

interface TeamRole {
  id: string;
  name: string;
  description: string;
  permissions: {
    content: boolean;
    analytics: boolean;
    billing: boolean;
    team: boolean;
    integrations: boolean;
    settings: boolean;
  };
  memberCount: number;
  isCustom: boolean;
  createdAt: string;
}

interface TeamDepartment {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  managerId: string;
  budget?: number;
  createdAt: string;
}

interface TeamInvitation {
  id: string;
  email: string;
  role: string;
  department?: string;
  invitedBy: string;
  invitedAt: string;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
}

export default function TeamManagement() {
  const [activeTab, setActiveTab] = useState(0);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [roles, setRoles] = useState<TeamRole[]>([]);
  const [departments, setDepartments] = useState<TeamDepartment[]>([]);
  const [invitations, setInvitations] = useState<TeamInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Dialog states
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showDepartmentDialog, setShowDepartmentDialog] = useState(false);
  const [showMemberDialog, setShowMemberDialog] = useState(false);
  
  // Form states
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: '',
    department: '',
    message: ''
  });
  const [roleForm, setRoleForm] = useState({
    name: '',
    description: '',
    permissions: {
      content: false,
      analytics: false,
      billing: false,
      team: false,
      integrations: false,
      settings: false
    }
  });

  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockMembers: TeamMember[] = [
        {
          id: '1',
          name: 'Darrell Mayberry',
          email: 'darrell@creatorflow.com',
          avatar: '/api/avatar/darrell',
          role: 'owner',
          status: 'active',
          permissions: {
            content: true,
            analytics: true,
            billing: true,
            team: true,
            integrations: true,
            settings: true
          },
          joinedAt: '2024-01-15T00:00:00Z',
          lastActive: new Date().toISOString(),
          department: 'Executive',
          location: 'San Francisco, CA',
          phone: '+1 (555) 123-4567',
          twoFactorEnabled: true,
          sessions: 3
        },
        {
          id: '2',
          name: 'Sarah Chen',
          email: 'sarah@creatorflow.com',
          avatar: '/api/avatar/sarah',
          role: 'admin',
          status: 'active',
          permissions: {
            content: true,
            analytics: true,
            billing: false,
            team: true,
            integrations: true,
            settings: false
          },
          joinedAt: '2024-03-20T00:00:00Z',
          lastActive: new Date(Date.now() - 3600000).toISOString(),
          department: 'Marketing',
          location: 'New York, NY',
          phone: '+1 (555) 234-5678',
          twoFactorEnabled: true,
          sessions: 1
        },
        {
          id: '3',
          name: 'Mike Rodriguez',
          email: 'mike@creatorflow.com',
          avatar: '/api/avatar/mike',
          role: 'manager',
          status: 'active',
          permissions: {
            content: true,
            analytics: true,
            billing: false,
            team: false,
            integrations: false,
            settings: false
          },
          joinedAt: '2024-05-10T00:00:00Z',
          lastActive: new Date(Date.now() - 7200000).toISOString(),
          department: 'Content',
          location: 'Los Angeles, CA',
          phone: '+1 (555) 345-6789',
          twoFactorEnabled: false,
          sessions: 2
        },
        {
          id: '4',
          name: 'Emily Watson',
          email: 'emily@creatorflow.com',
          avatar: '/api/avatar/emily',
          role: 'editor',
          status: 'active',
          permissions: {
            content: true,
            analytics: false,
            billing: false,
            team: false,
            integrations: false,
            settings: false
          },
          joinedAt: '2024-06-15T00:00:00Z',
          lastActive: new Date(Date.now() - 86400000).toISOString(),
          department: 'Content',
          location: 'Chicago, IL',
          phone: '+1 (555) 456-7890',
          twoFactorEnabled: false,
          sessions: 0
        }
      ];

      const mockRoles: TeamRole[] = [
        {
          id: '1',
          name: 'Owner',
          description: 'Full access to all features and settings',
          permissions: {
            content: true,
            analytics: true,
            billing: true,
            team: true,
            integrations: true,
            settings: true
          },
          memberCount: 1,
          isCustom: false,
          createdAt: '2024-01-15T00:00:00Z'
        },
        {
          id: '2',
          name: 'Admin',
          description: 'Manage team, content, and integrations',
          permissions: {
            content: true,
            analytics: true,
            billing: false,
            team: true,
            integrations: true,
            settings: false
          },
          memberCount: 1,
          isCustom: false,
          createdAt: '2024-01-15T00:00:00Z'
        },
        {
          id: '3',
          name: 'Manager',
          description: 'Manage content and view analytics',
          permissions: {
            content: true,
            analytics: true,
            billing: false,
            team: false,
            integrations: false,
            settings: false
          },
          memberCount: 1,
          isCustom: false,
          createdAt: '2024-01-15T00:00:00Z'
        },
        {
          id: '4',
          name: 'Content Creator',
          description: 'Create and edit content',
          permissions: {
            content: true,
            analytics: false,
            billing: false,
            team: false,
            integrations: false,
            settings: false
          },
          memberCount: 1,
          isCustom: false,
          createdAt: '2024-01-15T00:00:00Z'
        }
      ];

      const mockDepartments: TeamDepartment[] = [
        {
          id: '1',
          name: 'Executive',
          description: 'Executive leadership and strategic planning',
          memberCount: 1,
          managerId: '1',
          budget: 100000,
          createdAt: '2024-01-15T00:00:00Z'
        },
        {
          id: '2',
          name: 'Marketing',
          description: 'Marketing strategy and brand management',
          memberCount: 1,
          managerId: '2',
          budget: 50000,
          createdAt: '2024-03-20T00:00:00Z'
        },
        {
          id: '3',
          name: 'Content',
          description: 'Content creation and management',
          memberCount: 2,
          managerId: '3',
          budget: 30000,
          createdAt: '2024-05-10T00:00:00Z'
        }
      ];

      const mockInvitations: TeamInvitation[] = [
        {
          id: '1',
          email: 'alex@creatorflow.com',
          role: 'Content Creator',
          department: 'Content',
          invitedBy: 'Sarah Chen',
          invitedAt: new Date(Date.now() - 86400000).toISOString(),
          expiresAt: new Date(Date.now() + 604800000).toISOString(),
          status: 'pending'
        }
      ];

      setMembers(mockMembers);
      setRoles(mockRoles);
      setDepartments(mockDepartments);
      setInvitations(mockInvitations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load team data');
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'error';
      case 'admin': return 'warning';
      case 'manager': return 'info';
      case 'editor': return 'success';
      case 'viewer': return 'default';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <AdminPanelSettings />;
      case 'admin': return <Security />;
      case 'manager': return <SupervisorAccount />;
      case 'editor': return <Edit />;
      case 'viewer': return <Visibility />;
      default: return <Person />;
    }
  };

  const handleInviteMember = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newInvitation: TeamInvitation = {
        id: `invite_${Date.now()}`,
        email: inviteForm.email,
        role: inviteForm.role,
        department: inviteForm.department,
        invitedBy: 'Darrell Mayberry',
        invitedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 604800000).toISOString(),
        status: 'pending'
      };
      
      setInvitations(prev => [newInvitation, ...prev]);
      setShowInviteDialog(false);
      setInviteForm({ email: '', role: '', department: '', message: '' });
    } catch (error) {
      console.error('Failed to send invitation:', error);
    }
  };

  const handleCreateRole = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newRole: TeamRole = {
        id: `role_${Date.now()}`,
        name: roleForm.name,
        description: roleForm.description,
        permissions: roleForm.permissions,
        memberCount: 0,
        isCustom: true,
        createdAt: new Date().toISOString()
      };
      
      setRoles(prev => [newRole, ...prev]);
      setShowRoleDialog(false);
      setRoleForm({
        name: '',
        description: '',
        permissions: {
          content: false,
          analytics: false,
          billing: false,
          team: false,
          integrations: false,
          settings: false
        }
      });
    } catch (error) {
      console.error('Failed to create role:', error);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5">Team Members</Typography>
              <Button
                variant="contained"
                startIcon={<PersonAdd />}
                onClick={() => setShowInviteDialog(true)}
              >
                Invite Member
              </Button>
            </Box>
            
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Member</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Last Active</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar src={member.avatar} alt={member.name}>
                            {member.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2">{member.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {member.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getRoleIcon(member.role)}
                          label={member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                          color={getRoleColor(member.role) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{member.department || 'N/A'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                          color={getStatusColor(member.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(member.lastActive).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton size="small">
                            <Edit />
                          </IconButton>
                          <IconButton size="small">
                            <MoreVert />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );
      
      case 1:
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5">Roles & Permissions</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowRoleDialog(true)}
              >
                Create Role
              </Button>
            </Box>
            
            <Grid container spacing={3}>
              {roles.map((role) => (
                <Grid item xs={12} md={6} key={role.id} component="div">
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            {role.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {role.description}
                          </Typography>
                        </Box>
                        <Chip
                          label={`${role.memberCount} member${role.memberCount !== 1 ? 's' : ''}`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                      
                      <Typography variant="subtitle2" gutterBottom>
                        Permissions:
                      </Typography>
                      <Grid container spacing={1}>
                        {Object.entries(role.permissions).map(([key, value]) => (
                          <Grid item xs={6} key={key} component="div">
                            <Chip
                              icon={value ? <CheckCircle /> : <VisibilityOff />}
                              label={key.charAt(0).toUpperCase() + key.slice(1)}
                              size="small"
                              color={value ? 'success' : 'default'}
                              variant="outlined"
                            />
                          </Grid>
                        ))}
                      </Grid>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          {role.isCustom ? 'Custom role' : 'System role'}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton size="small">
                            <Edit />
                          </IconButton>
                          {role.isCustom && (
                            <IconButton size="small" color="error">
                              <Delete />
                            </IconButton>
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      
      case 2:
        return (
          <Box>
            <Typography variant="h5" sx={{ mb: 3 }}>Departments</Typography>
            
            <Grid container spacing={3}>
              {departments.map((dept) => (
                <Grid item xs={12} md={4} key={dept.id} component="div">
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {dept.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {dept.description}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body2">
                          {dept.memberCount} member{dept.memberCount !== 1 ? 's' : ''}
                        </Typography>
                        {dept.budget && (
                          <Typography variant="body2" color="primary">
                            ${dept.budget.toLocaleString()}
                          </Typography>
                        )}
                      </Box>
                      
                      <Button variant="outlined" size="small" fullWidth>
                        Manage Department
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      
      case 3:
        return (
          <Box>
            <Typography variant="h5" sx={{ mb: 3 }}>Pending Invitations</Typography>
            
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Invited By</TableCell>
                    <TableCell>Expires</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invitations.map((invitation) => (
                    <TableRow key={invitation.id}>
                      <TableCell>
                        <Typography variant="subtitle2">{invitation.email}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={invitation.role} size="small" color="primary" />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{invitation.department || 'N/A'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{invitation.invitedBy}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(invitation.expiresAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button size="small" variant="outlined">
                            Resend
                          </Button>
                          <Button size="small" color="error" variant="outlined">
                            Cancel
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
          Loading team management...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
        <IconButton size="small" onClick={loadMockData} sx={{ ml: 1 }}>
          <Refresh />
        </IconButton>
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 2, pb: { xs: 12, sm: 8 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Team Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage team members, roles, permissions, and departments
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<Settings />}>
            Team Settings
          </Button>
          <Button variant="contained" startIcon={<Group />}>
            Export Team Data
          </Button>
        </Box>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} md={3} component="div">
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Members
                  </Typography>
                  <Typography variant="h4">
                    {members.length}
                  </Typography>
                </Box>
                <Group color="primary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3} component="div">
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Active Members
                  </Typography>
                  <Typography variant="h4">
                    {members.filter(m => m.status === 'active').length}
                  </Typography>
                </Box>
                <CheckCircle color="success" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3} component="div">
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Departments
                  </Typography>
                  <Typography variant="h4">
                    {departments.length}
                  </Typography>
                </Box>
                <Business color="primary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3} component="div">
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Pending Invites
                  </Typography>
                  <Typography variant="h4">
                    {invitations.filter(i => i.status === 'pending').length}
                  </Typography>
                </Box>
                <PersonAdd color="warning" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="Team Members" />
          <Tab label="Roles & Permissions" />
          <Tab label="Departments" />
          <Tab label="Invitations" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Invite Member Dialog */}
      <Dialog open={showInviteDialog} onClose={() => setShowInviteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Invite Team Member</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={inviteForm.email}
              onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
              required
            />
            
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={inviteForm.role}
                label="Role"
                onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.name}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                value={inviteForm.department}
                label="Department"
                onChange={(e) => setInviteForm({ ...inviteForm, department: e.target.value })}
              >
                <MenuItem value="">No Department</MenuItem>
                {departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.name}>
                    {dept.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Personal Message (Optional)"
              multiline
              rows={3}
              value={inviteForm.message}
              onChange={(e) => setInviteForm({ ...inviteForm, message: e.target.value })}
              placeholder="Add a personal message to your invitation..."
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowInviteDialog(false)}>Cancel</Button>
          <Button onClick={handleInviteMember} variant="contained">
            Send Invitation
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Role Dialog */}
      <Dialog open={showRoleDialog} onClose={() => setShowRoleDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Custom Role</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Role Name"
              value={roleForm.name}
              onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
              required
            />
            
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={2}
              value={roleForm.description}
              onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
              required
            />
            
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Permissions
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(roleForm.permissions).map(([key, value]) => (
                  <Grid item xs={6} key={key} component="div">
                    <FormControlLabel
                      control={
                        <Switch
                          checked={value}
                          onChange={(e) => setRoleForm({
                            ...roleForm,
                            permissions: {
                              ...roleForm.permissions,
                              [key]: e.target.checked
                            }
                          })}
                        />
                      }
                      label={key.charAt(0).toUpperCase() + key.slice(1)}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRoleDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateRole} variant="contained">
            Create Role
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
