'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Paper,
  Button,
  Fade,
  Zoom,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Badge,
  Tooltip
} from '@mui/material';
import { 
  Group,
  Add,
  Edit,
  Delete,
  MoreVert,
  CheckCircle,
  ArrowForward,
  PersonAdd,
  AdminPanelSettings,
  Security,
  Notifications,
  Schedule,
  Analytics,
  Settings,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';

const TEAM_MEMBERS = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    role: 'Admin',
    avatar: 'SJ',
    status: 'active',
    lastActive: '2 minutes ago',
    permissions: ['Full Access', 'User Management', 'Billing'],
    color: 'primary'
  },
  {
    id: 2,
    name: 'Mike Chen',
    email: 'mike@company.com',
    role: 'Manager',
    avatar: 'MC',
    status: 'active',
    lastActive: '1 hour ago',
    permissions: ['Content Management', 'Analytics', 'Scheduling'],
    color: 'success'
  },
  {
    id: 3,
    name: 'Emily Davis',
    email: 'emily@company.com',
    role: 'Creator',
    avatar: 'ED',
    status: 'away',
    lastActive: '3 hours ago',
    permissions: ['Content Creation', 'Scheduling'],
    color: 'warning'
  },
  {
    id: 4,
    name: 'Alex Rodriguez',
    email: 'alex@company.com',
    role: 'Viewer',
    avatar: 'AR',
    status: 'offline',
    lastActive: '1 day ago',
    permissions: ['View Only'],
    color: 'default'
  }
];

const COLLABORATION_FEATURES = [
  {
    icon: <Group />,
    title: 'Team Workspaces',
    description: 'Organize your team into focused workspaces for different clients or projects',
    features: [
      'Client-specific workspaces',
      'Project-based organization',
      'Custom workspace settings',
      'Cross-workspace collaboration'
    ]
  },
  {
    icon: <Security />,
    title: 'Role-Based Access',
    description: 'Granular permissions and role management for secure collaboration',
    features: [
      'Custom role creation',
      'Permission inheritance',
      'Approval workflows',
      'Audit trail logging'
    ]
  },
  {
    icon: <Notifications />,
    title: 'Real-Time Notifications',
    description: 'Stay updated with instant notifications and team communication',
    features: [
      'In-app notifications',
      'Email alerts',
      'Slack integration',
      'Custom notification rules'
    ]
  },
  {
    icon: <Analytics />,
    title: 'Team Analytics',
    description: 'Track team performance and collaboration metrics',
    features: [
      'Individual performance metrics',
      'Team productivity insights',
      'Collaboration analytics',
      'Custom reporting'
    ]
  }
];

const WORKFLOW_EXAMPLES = [
  {
    title: 'Content Approval Workflow',
    steps: [
      'Creator drafts content',
      'Manager reviews and suggests changes',
      'Admin approves for publishing',
      'Content goes live automatically'
    ],
    participants: ['Creator', 'Manager', 'Admin']
  },
  {
    title: 'Client Onboarding',
    steps: [
      'Sales team adds new client',
      'Account manager sets up workspace',
      'Content team creates initial strategy',
      'Client gets access to dashboard'
    ],
    participants: ['Sales', 'Account Manager', 'Content Team']
  },
  {
    title: 'Crisis Management',
    steps: [
      'Issue detected by monitoring',
      'Team notified immediately',
      'Response team coordinates action',
      'Post-crisis analysis and reporting'
    ],
    participants: ['Monitoring', 'Response Team', 'Management']
  }
];

export function TeamManagementPreview() {
  const [selectedMember, setSelectedMember] = useState<number | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'away': return 'warning';
      case 'offline': return 'default';
      default: return 'default';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'error';
      case 'Manager': return 'primary';
      case 'Creator': return 'success';
      case 'Viewer': return 'default';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ 
      py: 8, 
      bgcolor: 'background.paper'
    }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ 
            fontWeight: 'bold', 
            mb: 2,
            color: 'text.primary'
          }}>
            Team Collaboration & Management
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Powerful tools for managing teams and collaborating on content
          </Typography>
        </Box>

        {/* Team Members Preview */}
        <Paper sx={{ p: 4, mb: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Team Members
            </Typography>
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              sx={{
                background: 'linear-gradient(45deg, #3B82F6 30%, #8B5CF6 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #2563EB 30%, #7C3AED 90%)'
                }
              }}
            >
              Add Member
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <List>
                {TEAM_MEMBERS.map((member, index) => (
                  <Fade in={true} timeout={500 + index * 100} key={member.id}>
                    <Paper sx={{ 
                      mb: 2, 
                      border: selectedMember === member.id ? 2 : 1,
                      borderColor: selectedMember === member.id ? 'primary.main' : 'divider',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        boxShadow: 2
                      }
                    }}
                    onClick={() => setSelectedMember(selectedMember === member.id ? null : member.id)}
                    >
                      <ListItem sx={{ py: 2 }}>
                        <ListItemAvatar>
                          <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                              <Box
                                sx={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: '50%',
                                  bgcolor: getStatusColor(member.status) + '.main',
                                  border: '2px solid white'
                                }}
                              />
                            }
                          >
                            <Avatar sx={{ 
                              bgcolor: member.color + '.main',
                              width: 48,
                              height: 48
                            }}>
                              {member.avatar}
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>
                        <ListItemText
                          component="div"
                          primary={
                            <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold' }} component="span">
                                {member.name}
                              </Typography>
                              <Chip
                                label={member.role}
                                color={getRoleColor(member.role) as any}
                                size="small"
                              />
                            </Box>
                          }
                          secondary={
                            <Box component="span">
                              <Typography variant="body2" color="text.secondary" component="span">
                                {member.email}
                              </Typography>
                              <br />
                              <Typography variant="caption" color="text.secondary" component="span">
                                Last active: {member.lastActive}
                              </Typography>
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton edge="end">
                            <MoreVert />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      
                      {selectedMember === member.id && (
                        <Box sx={{ px: 3, pb: 2 }}>
                          <Divider sx={{ mb: 2 }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                            Permissions:
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {member.permissions.map((permission, permIndex) => (
                              <Chip
                                key={permIndex}
                                label={permission}
                                size="small"
                                variant="outlined"
                                color="primary"
                              />
                            ))}
                          </Box>
                        </Box>
                      )}
                    </Paper>
                  </Fade>
                ))}
              </List>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, bgcolor: 'primary.50', height: 'fit-content' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Team Statistics
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Total Members:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>4</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Active Now:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.main' }}>2</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Admins:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>1</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Creators:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>2</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Paper>

        {/* Collaboration Features */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
            Collaboration Features
          </Typography>
          <Grid container spacing={3}>
            {COLLABORATION_FEATURES.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Fade in={true} timeout={500 + index * 100}>
                  <Card sx={{ 
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}>
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                      <Box sx={{ 
                        color: 'primary.main',
                        mb: 2,
                        '& .MuiSvgIcon-root': {
                          fontSize: '2.5rem'
                        }
                      }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {feature.description}
                      </Typography>
                      <List dense>
                        {feature.features.map((item, itemIndex) => (
                          <ListItem key={itemIndex} sx={{ py: 0.5, px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 24 }}>
                              <CheckCircle sx={{ color: 'success.main', fontSize: '1rem' }} />
                            </ListItemIcon>
                            <ListItemText 
                              primary={item}
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Workflow Examples */}
        <Paper sx={{ p: 4, mb: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
            Common Workflows
          </Typography>
          <Grid container spacing={3}>
            {WORKFLOW_EXAMPLES.map((workflow, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Fade in={true} timeout={500 + index * 100}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                        {workflow.title}
                      </Typography>
                      <List dense>
                        {workflow.steps.map((step, stepIndex) => (
                          <ListItem key={stepIndex} sx={{ py: 0.5, px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <Typography variant="body2" sx={{ 
                                fontWeight: 'bold',
                                color: 'primary.main',
                                minWidth: 20
                              }}>
                                {stepIndex + 1}.
                              </Typography>
                            </ListItemIcon>
                            <ListItemText 
                              primary={step}
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Participants:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {workflow.participants.map((participant, partIndex) => (
                          <Chip
                            key={partIndex}
                            label={participant}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Call to Action */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
            Ready to Scale Your Team?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Start collaborating with your team on CreatorFlow today
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              py: 2,
              px: 6,
              fontSize: '1.2rem',
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #3B82F6 30%, #8B5CF6 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #2563EB 30%, #7C3AED 90%)',
                transform: 'translateY(-2px)',
                boxShadow: 4
              }
            }}
          >
            Start Team Collaboration
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
