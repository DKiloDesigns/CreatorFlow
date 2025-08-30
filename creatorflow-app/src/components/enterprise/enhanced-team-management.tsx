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
  TextField,
  Button,
  Avatar,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  Analytics,
  BarChart,
  PieChart,
  ShowChart,
  Timeline,
  AutoAwesome,
  Psychology,
  Target,
  Speed,
  Timer,
  FlashOn,
  Star,
  StarBorder,
  ExpandMore,
  ExpandLess,
  Refresh,
  Settings,
  ContentCopy,
  Schedule,
  CheckCircle,
  Warning,
  Error,
  Info,
  Lightbulb,
  Rocket,
  People,
  Group,
  Person,
  LocationOn,
  Work,
  School,
  Favorite,
  ThumbUp,
  Share,
  Message,
  Add,
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
  Security,
  AdminPanelSettings,
  SupervisorAccount,
  PersonAdd,
  Business,
  Assessment,
  Insights,
  GroupAdd,
  ManageAccounts,
  VerifiedUser,
  Lock,
  Unlock,
  Search
} from '@mui/icons-material';
import { designTokens } from '@/lib/design-system';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'owner' | 'admin' | 'manager' | 'member' | 'viewer';
  department: string;
  status: 'active' | 'inactive' | 'pending';
  permissions: string[];
  lastActive: string;
  performance: {
    tasksCompleted: number;
    efficiency: number;
    collaboration: number;
    innovation: number;
  };
  aiScore: number;
  joinDate: string;
}

interface Department {
  id: string;
  name: string;
  description: string;
  manager: string;
  memberCount: number;
  budget: number;
  performance: {
    productivity: number;
    collaboration: number;
    innovation: number;
  };
  aiInsights: string[];
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  level: number;
  isCustom: boolean;
  memberCount: number;
}

interface TeamAnalytics {
  totalMembers: number;
  activeMembers: number;
  averagePerformance: number;
  topPerformers: string[];
  departmentEfficiency: Record<string, number>;
  collaborationScore: number;
  innovationIndex: number;
  aiRecommendations: string[];
}

export default function EnhancedTeamManagement() {
  const [activeTab, setActiveTab] = useState(0);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [teamAnalytics, setTeamAnalytics] = useState<TeamAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Mock team members
      setTeamMembers([
        {
          id: 'member-1',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@creatorflow.com',
          avatar: '/api/placeholder/40/40',
          role: 'admin',
          department: 'Content Strategy',
          status: 'active',
          permissions: ['content_edit', 'analytics_view', 'team_manage', 'settings_access'],
          lastActive: '2024-01-15T10:30:00Z',
          performance: {
            tasksCompleted: 45,
            efficiency: 92,
            collaboration: 88,
            innovation: 85
          },
          aiScore: 8.7,
          joinDate: '2023-03-15'
        },
        {
          id: 'member-2',
          name: 'Michael Chen',
          email: 'michael.chen@creatorflow.com',
          avatar: '/api/placeholder/40/40',
          role: 'manager',
          department: 'Creative Design',
          status: 'active',
          permissions: ['content_edit', 'analytics_view', 'team_manage'],
          lastActive: '2024-01-15T09:15:00Z',
          performance: {
            tasksCompleted: 38,
            efficiency: 89,
            collaboration: 92,
            innovation: 90
          },
          aiScore: 8.9,
          joinDate: '2023-06-20'
        },
        {
          id: 'member-3',
          name: 'Emily Rodriguez',
          email: 'emily.rodriguez@creatorflow.com',
          avatar: '/api/placeholder/40/40',
          role: 'member',
          department: 'Content Strategy',
          status: 'active',
          permissions: ['content_edit', 'analytics_view'],
          lastActive: '2024-01-15T11:45:00Z',
          performance: {
            tasksCompleted: 52,
            efficiency: 87,
            collaboration: 85,
            innovation: 78
          },
          aiScore: 8.2,
          joinDate: '2023-09-10'
        },
        {
          id: 'member-4',
          name: 'David Kim',
          email: 'david.kim@creatorflow.com',
          avatar: '/api/placeholder/40/40',
          role: 'member',
          department: 'Creative Design',
          status: 'active',
          permissions: ['content_edit', 'analytics_view'],
          lastActive: '2024-01-15T08:30:00Z',
          performance: {
            tasksCompleted: 41,
            efficiency: 90,
            collaboration: 87,
            innovation: 92
          },
          aiScore: 8.6,
          joinDate: '2023-11-05'
        },
        {
          id: 'member-5',
          name: 'Lisa Thompson',
          email: 'lisa.thompson@creatorflow.com',
          avatar: '/api/placeholder/40/40',
          role: 'viewer',
          department: 'Analytics',
          status: 'active',
          permissions: ['analytics_view'],
          lastActive: '2024-01-15T12:00:00Z',
          performance: {
            tasksCompleted: 28,
            efficiency: 85,
            collaboration: 80,
            innovation: 75
          },
          aiScore: 7.8,
          joinDate: '2024-01-02'
        }
      ]);

      // Mock departments
      setDepartments([
        {
          id: 'dept-1',
          name: 'Content Strategy',
          description: 'Content planning, creation, and optimization',
          manager: 'Sarah Johnson',
          memberCount: 3,
          budget: 50000,
          performance: {
            productivity: 88,
            collaboration: 85,
            innovation: 82
          },
          aiInsights: [
            'High collaboration scores indicate strong team dynamics',
            'Innovation metrics suggest room for creative experimentation',
            'Productivity trending upward with AI tool adoption'
          ]
        },
        {
          id: 'dept-2',
          name: 'Creative Design',
          description: 'Visual design and creative direction',
          manager: 'Michael Chen',
          memberCount: 2,
          budget: 35000,
          performance: {
            productivity: 92,
            collaboration: 89,
            innovation: 94
          },
          aiInsights: [
            'Exceptional innovation scores in creative projects',
            'Strong collaboration between design and strategy teams',
            'High productivity maintained through design system adoption'
          ]
        },
        {
          id: 'dept-3',
          name: 'Analytics',
          description: 'Data analysis and performance insights',
          manager: 'Lisa Thompson',
          memberCount: 1,
          budget: 25000,
          performance: {
            productivity: 85,
            collaboration: 78,
            innovation: 80
          },
          aiInsights: [
            'Analytics team could benefit from cross-department collaboration',
            'Innovation opportunities in data visualization and reporting',
            'Productivity improvements possible with AI-powered insights'
          ]
        }
      ]);

      // Mock roles
      setRoles([
        {
          id: 'role-1',
          name: 'Owner',
          description: 'Full system access and control',
          permissions: ['all'],
          level: 5,
          isCustom: false,
          memberCount: 1
        },
        {
          id: 'role-2',
          name: 'Admin',
          description: 'System administration and team management',
          permissions: ['content_edit', 'analytics_view', 'team_manage', 'settings_access', 'user_manage'],
          level: 4,
          isCustom: false,
          memberCount: 1
        },
        {
          id: 'role-3',
          name: 'Manager',
          description: 'Team leadership and content management',
          permissions: ['content_edit', 'analytics_view', 'team_manage'],
          level: 3,
          isCustom: false,
          memberCount: 2
        },
        {
          id: 'role-4',
          name: 'Member',
          description: 'Standard content creation and editing',
          permissions: ['content_edit', 'analytics_view'],
          level: 2,
          isCustom: false,
          memberCount: 2
        },
        {
          id: 'role-5',
          name: 'Viewer',
          description: 'Read-only access to analytics and content',
          permissions: ['analytics_view'],
          level: 1,
          isCustom: false,
          memberCount: 1
        }
      ]);

      // Mock team analytics
      setTeamAnalytics({
        totalMembers: 5,
        activeMembers: 5,
        averagePerformance: 87.2,
        topPerformers: ['Michael Chen', 'Sarah Johnson', 'David Kim'],
        departmentEfficiency: {
          'Content Strategy': 88,
          'Creative Design': 92,
          'Analytics': 85
        },
        collaborationScore: 86.4,
        innovationIndex: 84.2,
        aiRecommendations: [
          'Implement cross-department collaboration initiatives',
          'Focus on innovation training for Analytics team',
          'Consider role rotation to improve skill diversity',
          'Establish mentorship program for new team members'
        ]
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return designTokens.colors.error[600];
      case 'admin':
        return designTokens.colors.warning[600];
      case 'manager':
        return designTokens.colors.primary[600];
      case 'member':
        return designTokens.colors.success[600];
      case 'viewer':
        return designTokens.colors.neutral[600];
      default:
        return designTokens.colors.neutral[500];
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return designTokens.colors.success[500];
      case 'inactive':
        return designTokens.colors.error[500];
      case 'pending':
        return designTokens.colors.warning[500];
      default:
        return designTokens.colors.neutral[500];
    }
  };

  const getPermissionIcon = (permission: string) => {
    switch (permission) {
      case 'content_edit':
        return <Edit sx={{ fontSize: 16 }} />;
      case 'analytics_view':
        return <Analytics sx={{ fontSize: 16 }} />;
      case 'team_manage':
        return <Group sx={{ fontSize: 16 }} />;
      case 'settings_access':
        return <Settings sx={{ fontSize: 16 }} />;
      case 'user_manage':
        return <ManageAccounts sx={{ fontSize: 16 }} />;
      default:
        return <Visibility sx={{ fontSize: 16 }} />;
    }
  };

  const renderTeamMembersTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ color: designTokens.colors.neutral[800] }}>
          Team Members
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={() => setShowInviteDialog(true)}
        >
          Invite Member
        </Button>
      </Box>

      <TextField
        fullWidth
        placeholder="Search team members..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: <Search sx={{ mr: 1, color: designTokens.colors.neutral[500] }} />
        }}
      />

      <Grid container spacing={3}>
        {teamMembers
          .filter(member => 
            member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.department.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((member) => (
          <Grid item xs={12} md={6} lg={4} key={member.id} component="div">
            <Card 
              elevation={0} 
              sx={{ 
                border: `1px solid ${designTokens.colors.neutral[200]}`,
                borderRadius: designTokens.borderRadius.lg,
                cursor: 'pointer',
                transition: designTokens.animation.micro.cardHover,
                '&:hover': {
                  boxShadow: designTokens.shadows.lg,
                  borderColor: designTokens.colors.primary[300]
                }
              }}
              onClick={() => setSelectedMember(member)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar src={member.avatar} sx={{ width: 48, height: 48 }}>
                      {member.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ color: designTokens.colors.neutral[800] }}>
                        {member.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: designTokens.colors.neutral[500] }}>
                        {member.email}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Chip
                      label={member.role}
                      size="small"
                      sx={{
                        background: `${getRoleColor(member.role)}15`,
                        color: getRoleColor(member.role),
                        fontWeight: 'medium',
                        textTransform: 'capitalize',
                        mb: 1
                      }}
                    />
                    <Chip
                      label={member.status}
                      size="small"
                      sx={{
                        background: `${getStatusColor(member.status)}15`,
                        color: getStatusColor(member.status),
                        fontWeight: 'medium',
                        textTransform: 'capitalize'
                      }}
                    />
                  </Box>
                </Box>

                <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 2 }}>
                  {member.department}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                      AI Performance Score
                    </Typography>
                    <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                      {member.aiScore}/10
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={member.aiScore * 10}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: designTokens.colors.neutral[200],
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: designTokens.colors.ai[500],
                        borderRadius: 4
                      }
                    }}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: designTokens.colors.neutral[700], mb: 1 }}>
                    Key Permissions
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {member.permissions.slice(0, 3).map((permission, index) => (
                      <Chip
                        key={index}
                        icon={getPermissionIcon(permission)}
                        label={permission.replace('_', ' ')}
                        size="small"
                        sx={{
                          background: designTokens.colors.primary[100],
                          color: designTokens.colors.primary[700],
                          fontSize: '0.7rem'
                        }}
                      />
                    ))}
                    {member.permissions.length > 3 && (
                      <Chip
                        label={`+${member.permissions.length - 3} more`}
                        size="small"
                        sx={{
                          background: designTokens.colors.neutral[100],
                          color: designTokens.colors.neutral[600],
                          fontSize: '0.7rem'
                        }}
                      />
                    )}
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[500] }}>
                    Last active: {new Date(member.lastActive).toLocaleDateString()}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" sx={{ color: designTokens.colors.primary[600] }}>
                      <Edit />
                    </IconButton>
                    <IconButton size="small" sx={{ color: designTokens.colors.neutral[600] }}>
                      <Visibility />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderDepartmentsTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ color: designTokens.colors.neutral[800] }}>
          Departments
        </Typography>
        <Button
          variant="contained"
          startIcon={<Business />}
        >
          Add Department
        </Button>
      </Box>

      <Grid container spacing={3}>
        {departments.map((dept) => (
          <Grid item xs={12} md={6} key={dept.id} component="div">
            <Card elevation={0} sx={{ border: `1px solid ${designTokens.colors.neutral[200]}` }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ color: designTokens.colors.neutral[800] }}>
                      {dept.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                      {dept.description}
                    </Typography>
                  </Box>
                  <Chip
                    label={`$${dept.budget.toLocaleString()}`}
                    size="small"
                    sx={{
                      background: designTokens.colors.success[100],
                      color: designTokens.colors.success[700],
                      fontWeight: 'medium'
                    }}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                    Manager: {dept.manager}
                  </Typography>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                    Members: {dept.memberCount}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: designTokens.colors.neutral[700], mb: 1 }}>
                    Performance Metrics
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4} component="div">
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ color: designTokens.colors.success[600], fontWeight: 'bold' }}>
                          {dept.performance.productivity}%
                        </Typography>
                        <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                          Productivity
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4} component="div">
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ color: designTokens.colors.primary[600], fontWeight: 'bold' }}>
                          {dept.performance.collaboration}%
                        </Typography>
                        <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                          Collaboration
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4} component="div">
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ color: designTokens.colors.warning[600], fontWeight: 'bold' }}>
                          {dept.performance.innovation}%
                        </Typography>
                        <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                          Innovation
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ color: designTokens.colors.neutral[700], mb: 1 }}>
                    AI Insights
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    {dept.aiInsights.slice(0, 2).map((insight, index) => (
                      <Typography key={index} variant="body2" sx={{ color: designTokens.colors.neutral[600], fontSize: '0.875rem' }}>
                        • {insight}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderRolesTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ color: designTokens.colors.neutral[800] }}>
          Roles & Permissions
        </Typography>
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
          <Grid item xs={12} md={6} lg={4} key={role.id} component="div">
            <Card elevation={0} sx={{ border: `1px solid ${designTokens.colors.neutral[200]}` }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ color: designTokens.colors.neutral[800] }}>
                      {role.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                      {role.description}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Chip
                      label={`Level ${role.level}`}
                      size="small"
                      sx={{
                        background: designTokens.colors.primary[100],
                        color: designTokens.colors.primary[700],
                        fontWeight: 'medium',
                        mb: 1
                      }}
                    />
                    <Chip
                      label={role.isCustom ? 'Custom' : 'System'}
                      size="small"
                      sx={{
                        background: role.isCustom ? designTokens.colors.warning[100] : designTokens.colors.neutral[100],
                        color: role.isCustom ? designTokens.colors.warning[700] : designTokens.colors.neutral[700],
                        fontWeight: 'medium'
                      }}
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                    Members: {role.memberCount}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ color: designTokens.colors.neutral[700], mb: 1 }}>
                    Permissions
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {role.permissions.slice(0, 4).map((permission, index) => (
                      <Chip
                        key={index}
                        icon={getPermissionIcon(permission)}
                        label={permission.replace('_', ' ')}
                        size="small"
                        sx={{
                          background: designTokens.colors.primary[100],
                          color: designTokens.colors.primary[700],
                          fontSize: '0.7rem'
                        }}
                      />
                    ))}
                    {role.permissions.length > 4 && (
                      <Chip
                        label={`+${role.permissions.length - 4} more`}
                        size="small"
                        sx={{
                          background: designTokens.colors.neutral[100],
                          color: designTokens.colors.neutral[600],
                          fontSize: '0.7rem'
                        }}
                      />
                    )}
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <IconButton size="small" sx={{ color: designTokens.colors.neutral[600] }}>
                    <Edit />
                  </IconButton>
                  <IconButton size="small" sx={{ color: designTokens.colors.neutral[600] }}>
                    <Visibility />
                  </IconButton>
                  {role.isCustom && (
                    <IconButton size="small" sx={{ color: designTokens.colors.error[600] }}>
                      <Delete />
                    </IconButton>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderAnalyticsTab = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, color: designTokens.colors.neutral[800] }}>
        Team Analytics & Insights
      </Typography>

      {teamAnalytics && (
        <Grid container spacing={3}>
          {/* Overview Cards */}
          <Grid item xs={12} md={3} component="div">
            <Card elevation={0} sx={{ border: `1px solid ${designTokens.colors.neutral[200]}` }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: designTokens.colors.primary[600], fontWeight: 'bold' }}>
                  {teamAnalytics.totalMembers}
                </Typography>
                <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                  Total Members
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3} component="div">
            <Card elevation={0} sx={{ border: `1px solid ${designTokens.colors.neutral[200]}` }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: designTokens.colors.success[600], fontWeight: 'bold' }}>
                  {teamAnalytics.averagePerformance}%
                </Typography>
                <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                  Avg Performance
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card elevation={0} sx={{ border: `1px solid ${designTokens.colors.neutral[200]}` }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: designTokens.colors.primary[600], fontWeight: 'bold' }}>
                  {teamAnalytics.collaborationScore}%
                </Typography>
                <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                  Collaboration
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card elevation={0} sx={{ border: `1px solid ${designTokens.colors.neutral[200]}` }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: designTokens.colors.warning[600], fontWeight: 'bold' }}>
                  {teamAnalytics.innovationIndex}%
                </Typography>
                <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                  Innovation Index
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Department Performance */}
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ border: `1px solid ${designTokens.colors.neutral[200]}` }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: designTokens.colors.neutral[800], mb: 2 }}>
                  Department Efficiency
                </Typography>
                {Object.entries(teamAnalytics.departmentEfficiency).map(([dept, score]) => (
                  <Box key={dept} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: designTokens.colors.neutral[700] }}>
                        {dept}
                      </Typography>
                      <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                        {score}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={score}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: designTokens.colors.neutral[200],
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: designTokens.colors.primary[500],
                          borderRadius: 4
                        }
                      }}
                    />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Top Performers */}
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ border: `1px solid ${designTokens.colors.neutral[200]}` }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: designTokens.colors.neutral[800], mb: 2 }}>
                  Top Performers
                </Typography>
                {teamAnalytics.topPerformers.map((performer, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: designTokens.colors.primary[100] }}>
                      {performer.charAt(0)}
                    </Avatar>
                    <Typography variant="body2" sx={{ color: designTokens.colors.neutral[700] }}>
                      {performer}
                    </Typography>
                    <Box sx={{ ml: 'auto' }}>
                      <Chip
                        label={`#${index + 1}`}
                        size="small"
                        sx={{
                          background: index === 0 ? designTokens.colors.warning[100] : designTokens.colors.primary[100],
                          color: index === 0 ? designTokens.colors.warning[700] : designTokens.colors.primary[700],
                          fontWeight: 'medium'
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* AI Recommendations */}
          <Grid item xs={12}>
            <Card elevation={0} sx={{ border: `1px solid ${designTokens.colors.neutral[200]}` }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: designTokens.colors.neutral[800], mb: 2 }}>
                  AI-Powered Recommendations
                </Typography>
                <Grid container spacing={2}>
                  {teamAnalytics.aiRecommendations.map((recommendation, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Box sx={{ 
                        p: 2, 
                        background: designTokens.colors.ai[50], 
                        borderRadius: designTokens.borderRadius.md,
                        border: `1px solid ${designTokens.colors.ai[200]}`
                      }}>
                                                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                           <Psychology sx={{ fontSize: 16, color: designTokens.colors.ai[600] }} />
                           <Typography variant="body2" sx={{ color: designTokens.colors.ai[700], fontWeight: 'medium' }}>
                             Recommendation {index + 1}
                           </Typography>
                         </Box>
                        <Typography variant="body2" sx={{ color: designTokens.colors.ai[700], fontSize: '0.875rem' }}>
                          {recommendation}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" width="60%" height={48} />
        <Skeleton variant="text" width="40%" height={24} />
        <Box sx={{ mt: 4 }}>
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5].map((item) => (
              <Grid item xs={12} md={6} lg={4} key={item}>
                <Skeleton variant="rectangular" height={300} />
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: designTokens.colors.success[600]
            }}
          >
            <Group sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: designTokens.typography.fontWeight.bold,
                color: designTokens.colors.neutral[900],
                mb: 1
              }}
            >
              Enhanced Team Management
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: designTokens.colors.neutral[600],
                fontWeight: designTokens.typography.fontWeight.normal
              }}
            >
              Enterprise-grade team management with advanced permissions and AI-powered insights
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* AI Status Alert */}
      <Alert 
        severity="info" 
        sx={{ 
          mb: 4,
          background: 'linear-gradient(90deg, rgba(34, 197, 94, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
          border: `1px solid ${designTokens.colors.success[200]}`,
          borderRadius: designTokens.borderRadius.lg
        }}
      >
        <AlertTitle sx={{ color: designTokens.colors.success[700] }}>
          🧠 AI Team Intelligence Active
        </AlertTitle>
        <Typography variant="body2" sx={{ color: designTokens.colors.success[700] }}>
          Your AI system has analyzed {teamMembers.length} team members and {departments.length} departments. 
          Current team performance: {teamAnalytics?.averagePerformance}%. AI insights are continuously monitoring team dynamics and performance.
        </Typography>
      </Alert>

      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="Team Members" />
          <Tab label="Departments" />
          <Tab label="Roles & Permissions" />
          <Tab label="Analytics" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && renderTeamMembersTab()}
      {activeTab === 1 && renderDepartmentsTab()}
      {activeTab === 2 && renderRolesTab()}
      {activeTab === 3 && renderAnalyticsTab()}

      {/* Invite Member Dialog */}
      <Dialog open={showInviteDialog} onClose={() => setShowInviteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Invite Team Member</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Email Address"
            placeholder="Enter email address"
            sx={{ mb: 2, mt: 1 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select label="Role">
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Department</InputLabel>
            <Select label="Department">
              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>
                  {dept.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowInviteDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setShowInviteDialog(false)}>
            Send Invite
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Role Dialog */}
      <Dialog open={showRoleDialog} onClose={() => setShowRoleDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Custom Role</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Role Name"
            placeholder="Enter role name"
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="Description"
            placeholder="Enter role description"
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Permission Level</InputLabel>
            <Select label="Permission Level">
              <MenuItem value={1}>Level 1 - Viewer</MenuItem>
              <MenuItem value={2}>Level 2 - Member</MenuItem>
              <MenuItem value={3}>Level 3 - Manager</MenuItem>
              <MenuItem value={4}>Level 4 - Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRoleDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setShowRoleDialog(false)}>
            Create Role
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
