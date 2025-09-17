/**
 * Enterprise Dashboard
 * Team management, white-label customization, and enterprise analytics
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Alert,
  Tabs,
  Tab,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Avatar,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Business as BusinessIcon,
  People as PeopleIcon,
  Palette as PaletteIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonAdd as InviteIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Email as EmailIcon,
  Security as SecurityIcon,
  Domain as DomainIcon,
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`enterprise-tabpanel-${index}`}
      aria-labelledby={`enterprise-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function EnterpriseDashboard() {
  const [tabValue, setTabValue] = useState(0);
  const [teams, setTeams] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [enterpriseMetrics, setEnterpriseMetrics] = useState<any>(null);
  const [whiteLabelConfig, setWhiteLabelConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [showInviteMember, setShowInviteMember] = useState(false);
  const [showWhiteLabel, setShowWhiteLabel] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load teams
      const teamsResponse = await fetch('/api/enterprise/teams');
      const teamsData = await teamsResponse.json();
      
      if (teamsData.success) {
        setTeams(teamsData.teams);
        if (teamsData.teams.length > 0) {
          setSelectedTeam(teamsData.teams[0]);
        }
      }

      // Load team members if team is selected
      if (selectedTeam) {
        await loadTeamMembers(selectedTeam.id);
        await loadEnterpriseMetrics(selectedTeam.id);
        await loadWhiteLabelConfig(selectedTeam.id);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTeamMembers = async (teamId: string) => {
    try {
      const response = await fetch(`/api/enterprise/teams/${teamId}/members`);
      const data = await response.json();
      
      if (data.success) {
        setTeamMembers(data.members);
      }
    } catch (error) {
      console.error('Failed to load team members:', error);
    }
  };

  const loadEnterpriseMetrics = async (teamId: string) => {
    try {
      const response = await fetch(`/api/enterprise/analytics?team_id=${teamId}`);
      const data = await response.json();
      
      if (data.success) {
        setEnterpriseMetrics(data.metrics);
      }
    } catch (error) {
      console.error('Failed to load enterprise metrics:', error);
    }
  };

  const loadWhiteLabelConfig = async (teamId: string) => {
    try {
      const response = await fetch(`/api/enterprise/white-label?team_id=${teamId}`);
      const data = await response.json();
      
      if (data.success) {
        setWhiteLabelConfig(data.config);
      }
    } catch (error) {
      console.error('Failed to load white-label config:', error);
    }
  };

  const handleCreateTeam = async (teamData: any) => {
    try {
      const response = await fetch('/api/enterprise/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamData),
      });

      const data = await response.json();
      
      if (data.success) {
        setTeams(prev => [...prev, data.team]);
        setShowCreateTeam(false);
        loadData();
      }
    } catch (error) {
      console.error('Failed to create team:', error);
    }
  };

  const handleInviteMember = async (invitationData: any) => {
    try {
      const response = await fetch(`/api/enterprise/teams/${selectedTeam.id}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invitationData),
      });

      const data = await response.json();
      
      if (data.success) {
        setShowInviteMember(false);
        loadTeamMembers(selectedTeam.id);
      }
    } catch (error) {
      console.error('Failed to invite member:', error);
    }
  };

  const handleUpdateWhiteLabel = async (config: any) => {
    try {
      const response = await fetch('/api/enterprise/white-label', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: selectedTeam.id,
          updates: config,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setWhiteLabelConfig(data.config);
        setShowWhiteLabel(false);
      }
    } catch (error) {
      console.error('Failed to update white-label config:', error);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
          Loading enterprise dashboard...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'text.primary', fontWeight: 'bold' }}>
          Enterprise Dashboard
        </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage teams, customize branding, and access enterprise analytics for your organization.
        </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Teams" icon={<BusinessIcon />} />
          <Tab label="Analytics" icon={<AnalyticsIcon />} />
          <Tab label="White-Label" icon={<PaletteIcon />} />
          <Tab label="Settings" icon={<SettingsIcon />} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            Teams & Members
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowCreateTeam(true)}
          >
            Create Team
          </Button>
        </Box>

        {teams.length === 0 ? (
          <Alert severity="info">
            No teams created yet. Create your first team to get started.
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {teams.map((team) => (
              <Grid item xs={12} md={6} key={team.id}>
        <Card>
          <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">
                        {team.name}
                      </Typography>
                      <Chip
                        label={team.isActive ? 'Active' : 'Inactive'}
                        color={team.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {team.description || 'No description'}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip
                        label={`${teamMembers.length} members`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <Chip
                        label={team.settings?.subscription?.plan || 'Free'}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setSelectedTeam(team)}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<InviteIcon />}
                        onClick={() => setShowInviteMember(true)}
                      >
                        Invite
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {selectedTeam && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', fontWeight: 'bold' }}>
              Team Members - {selectedTeam.name}
            </Typography>
            
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Member</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Last Active</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 2 }}>
                            {member.userName?.charAt(0) || 'U'}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2">
                              {member.userName || 'Unknown User'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {member.userId}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={member.role}
                          size="small"
                          color={member.role === 'admin' ? 'primary' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={member.status}
                          size="small"
                          color={member.status === 'active' ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        {member.lastActiveAt ? new Date(member.lastActiveAt).toLocaleDateString() : 'Never'}
                      </TableCell>
                      <TableCell>
                        <IconButton size="small">
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', fontWeight: 'bold' }}>
          Enterprise Analytics
        </Typography>
        
        {enterpriseMetrics ? (
          <Grid container spacing={3}>
            {/* Key Metrics */}
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h4" color="primary">
                    {enterpriseMetrics.totalUsers}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                    Total Users
            </Typography>
          </CardContent>
        </Card>
            </Grid>

            <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
                  <Typography variant="h4" color="success.main">
                    {enterpriseMetrics.activeUsers}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                    Active Users
            </Typography>
          </CardContent>
        </Card>
            </Grid>

            <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
                  <Typography variant="h4" color="info.main">
                    {enterpriseMetrics.totalPosts}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                    Total Posts
            </Typography>
          </CardContent>
        </Card>
            </Grid>

            <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
                  <Typography variant="h4" color="warning.main">
                    {enterpriseMetrics.performanceScore}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                    Performance Score
            </Typography>
          </CardContent>
        </Card>
            </Grid>

            {/* User Activity */}
            <Grid item xs={12}>
              <Card>
        <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                    User Activity
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>User</TableCell>
                          <TableCell>Role</TableCell>
                          <TableCell>Posts Created</TableCell>
                          <TableCell>Engagement Generated</TableCell>
                          <TableCell>Performance Score</TableCell>
                          <TableCell>Activity Trend</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {enterpriseMetrics.userActivity?.map((user: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ mr: 2 }}>
                                  {user.userName?.charAt(0) || 'U'}
                                </Avatar>
                                <Typography variant="subtitle2">
                                  {user.userName}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={user.role}
                                size="small"
                                color={user.role === 'admin' ? 'primary' : 'default'}
                              />
                            </TableCell>
                            <TableCell>{user.postsCreated}</TableCell>
                            <TableCell>{user.engagementGenerated.toLocaleString()}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body2" sx={{ mr: 1 }}>
                                  {user.performanceScore}
                                </Typography>
                                {user.performanceScore > 80 ? (
                                  <TrendingUpIcon color="success" />
                                ) : user.performanceScore > 60 ? (
                                  <TrendingUpIcon color="warning" />
                                ) : (
                                  <TrendingDownIcon color="error" />
                                )}
          </Box>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={user.activityTrend}
                                size="small"
                                color={
                                  user.activityTrend === 'increasing' ? 'success' :
                                  user.activityTrend === 'stable' ? 'info' : 'error'
                                }
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
        </CardContent>
      </Card>
            </Grid>

            {/* Recommendations */}
            <Grid item xs={12}>
        <Card>
          <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                    AI Recommendations
                  </Typography>
                  <List>
                    {enterpriseMetrics.recommendations?.map((rec: any, index: number) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          {rec.priority === 'high' ? (
                            <ErrorIcon color="error" />
                          ) : rec.priority === 'medium' ? (
                            <WarningIcon color="warning" />
                          ) : (
                            <CheckCircleIcon color="info" />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={rec.title}
                          secondary={rec.description}
                        />
                        <Chip
                          label={rec.priority}
                          size="small"
                          color={
                            rec.priority === 'high' ? 'error' :
                            rec.priority === 'medium' ? 'warning' : 'info'
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Alert severity="info">
            No enterprise analytics available yet. Select a team to view analytics.
          </Alert>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            White-Label Customization
            </Typography>
            <Button
              variant="contained"
            startIcon={<PaletteIcon />}
            onClick={() => setShowWhiteLabel(true)}
            >
            Customize Branding
            </Button>
        </Box>

        {whiteLabelConfig ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                    Branding Configuration
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2">Company Name:</Typography>
                    <Typography variant="body2">{whiteLabelConfig.branding?.companyName}</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2">Primary Color:</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          backgroundColor: whiteLabelConfig.branding?.primaryColor,
                          borderRadius: 1,
                          mr: 1,
                        }}
                      />
                      <Typography variant="body2">{whiteLabelConfig.branding?.primaryColor}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2">Secondary Color:</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          backgroundColor: whiteLabelConfig.branding?.secondaryColor,
                          borderRadius: 1,
                          mr: 1,
                        }}
                      />
                      <Typography variant="body2">{whiteLabelConfig.branding?.secondaryColor}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                    Feature Configuration
                  </Typography>
                  <List>
                    {Object.entries(whiteLabelConfig.features?.enabled || {}).map(([feature, enabled]) => (
                      <ListItem key={feature}>
                        <ListItemIcon>
                          {enabled ? <CheckCircleIcon color="success" /> : <ErrorIcon color="error" />}
                        </ListItemIcon>
                        <ListItemText
                          primary={feature.charAt(0).toUpperCase() + feature.slice(1)}
                          secondary={enabled ? 'Enabled' : 'Disabled'}
                        />
                      </ListItem>
                    ))}
                  </List>
          </CardContent>
        </Card>
            </Grid>
          </Grid>
        ) : (
          <Alert severity="info">
            No white-label configuration found. Create a team and customize your branding.
          </Alert>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Typography variant="h6" gutterBottom>
          Enterprise Settings
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
                    <ListItemIcon>
                      <SecurityIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Two-Factor Authentication"
                      secondary="Require 2FA for all team members"
                    />
                    <Switch defaultChecked />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <DomainIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Custom Domain"
                      secondary="Use your own domain for the platform"
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
                  Team Settings
            </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Allow Invites"
                      secondary="Let team members invite others"
                    />
                    <Switch defaultChecked />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email Notifications"
                      secondary="Send email notifications for team activity"
                    />
                    <Switch defaultChecked />
                  </ListItem>
                </List>
          </CardContent>
        </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Create Team Dialog */}
      <Dialog
        open={showCreateTeam}
        onClose={() => setShowCreateTeam(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Team</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Team Name"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateTeam(false)}>
            Cancel
          </Button>
          <Button variant="contained">
            Create Team
          </Button>
        </DialogActions>
      </Dialog>

      {/* Invite Member Dialog */}
      <Dialog
        open={showInviteMember}
        onClose={() => setShowInviteMember(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Invite Team Member</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select defaultValue="member">
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="member">Member</MenuItem>
                  <MenuItem value="viewer">Viewer</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowInviteMember(false)}>
            Cancel
          </Button>
          <Button variant="contained">
            Send Invitation
          </Button>
        </DialogActions>
      </Dialog>

      {/* White-Label Dialog */}
      <Dialog
        open={showWhiteLabel}
        onClose={() => setShowWhiteLabel(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Customize Branding</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Company Name"
                defaultValue={whiteLabelConfig?.branding?.companyName || ''}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tagline"
                defaultValue={whiteLabelConfig?.branding?.tagline || ''}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Primary Color"
                type="color"
                defaultValue={whiteLabelConfig?.branding?.primaryColor || '#1976d2'}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Secondary Color"
                type="color"
                defaultValue={whiteLabelConfig?.branding?.secondaryColor || '#dc004e'}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Accent Color"
                type="color"
                defaultValue={whiteLabelConfig?.branding?.accentColor || '#9c27b0'}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Custom CSS"
                multiline
                rows={4}
                placeholder="/* Add your custom CSS here */"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowWhiteLabel(false)}>
            Cancel
          </Button>
          <Button variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}