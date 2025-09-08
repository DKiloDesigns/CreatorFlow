'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader,
  Chip,
  LinearProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel
} from '@mui/material';
import { 
  Security, 
  Shield, 
  Warning,
  CheckCircle,
  Error,
  Info,
  Refresh,
  Download,
  Visibility,
  VisibilityOff,
  Lock,
  LockOpen,
  VpnKey,
  Person,
  Computer,
  Settings
} from '@mui/icons-material';

interface SecurityData {
  overallScore: number;
  activeThreats: number;
  blockedAttempts: number;
  securityEvents: number;
  lastScan: string;
  vulnerabilities: Array<{
    id: string;
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    status: 'open' | 'in_progress' | 'resolved';
    discovered: string;
  }>;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    severity: 'info' | 'warning' | 'error';
    user?: string;
    ip?: string;
  }>;
  securitySettings: {
    twoFactorEnabled: boolean;
    passwordPolicy: boolean;
    sessionTimeout: number;
    ipWhitelist: boolean;
    encryptionEnabled: boolean;
    auditLogging: boolean;
  };
  userSessions: Array<{
    id: string;
    user: string;
    device: string;
    location: string;
    lastActivity: string;
    status: 'active' | 'expired' | 'suspicious';
  }>;
}

export default function SecurityCenter() {
  const [overviewModalOpen, setOverviewModalOpen] = useState(false);
  const [vulnerabilitiesModalOpen, setVulnerabilitiesModalOpen] = useState(false);
  const [activityLogModalOpen, setActivityLogModalOpen] = useState(false);
  const [userSessionsModalOpen, setUserSessionsModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [securityData, setSecurityData] = useState<SecurityData>({
    overallScore: 85,
    activeThreats: 0,
    blockedAttempts: 23,
    securityEvents: 156,
    lastScan: '2024-01-07T10:30:00Z',
    vulnerabilities: [
      {
        id: '1',
        type: 'Dependency',
        severity: 'medium',
        description: 'Outdated package version in authentication module',
        status: 'open',
        discovered: '2024-01-05T14:20:00Z'
      },
      {
        id: '2',
        type: 'Configuration',
        severity: 'low',
        description: 'Weak password policy settings',
        status: 'in_progress',
        discovered: '2024-01-03T09:15:00Z'
      },
      {
        id: '3',
        type: 'Access Control',
        severity: 'high',
        description: 'Excessive permissions for admin role',
        status: 'open',
        discovered: '2024-01-01T16:45:00Z'
      }
    ],
    recentActivity: [
      {
        id: '1',
        type: 'Login',
        description: 'Successful login from new device',
        timestamp: '2024-01-07T10:25:00Z',
        severity: 'info',
        user: 'john.doe@example.com',
        ip: '192.168.1.100'
      },
      {
        id: '2',
        type: 'Failed Login',
        description: 'Multiple failed login attempts detected',
        timestamp: '2024-01-07T09:45:00Z',
        severity: 'warning',
        user: 'unknown',
        ip: '203.0.113.42'
      },
      {
        id: '3',
        type: 'Permission Change',
        description: 'User role updated',
        timestamp: '2024-01-07T08:30:00Z',
        severity: 'info',
        user: 'admin@creatorflow.com',
        ip: '192.168.1.50'
      },
      {
        id: '4',
        type: 'Security Scan',
        description: 'Automated security scan completed',
        timestamp: '2024-01-07T06:00:00Z',
        severity: 'info'
      },
      {
        id: '5',
        type: 'Suspicious Activity',
        description: 'Unusual API usage pattern detected',
        timestamp: '2024-01-06T22:15:00Z',
        severity: 'error',
        user: 'api-user@example.com',
        ip: '198.51.100.25'
      }
    ],
    securitySettings: {
      twoFactorEnabled: true,
      passwordPolicy: true,
      sessionTimeout: 30,
      ipWhitelist: false,
      encryptionEnabled: true,
      auditLogging: true
    },
    userSessions: [
      {
        id: '1',
        user: 'john.doe@example.com',
        device: 'Chrome on Windows',
        location: 'New York, US',
        lastActivity: '2024-01-07T10:25:00Z',
        status: 'active'
      },
      {
        id: '2',
        user: 'jane.smith@example.com',
        device: 'Safari on macOS',
        location: 'San Francisco, US',
        lastActivity: '2024-01-07T09:15:00Z',
        status: 'active'
      },
      {
        id: '3',
        user: 'admin@creatorflow.com',
        device: 'Firefox on Linux',
        location: 'London, UK',
        lastActivity: '2024-01-06T18:30:00Z',
        status: 'expired'
      },
      {
        id: '4',
        user: 'api-user@example.com',
        device: 'API Client',
        location: 'Unknown',
        lastActivity: '2024-01-06T22:15:00Z',
        status: 'suspicious'
      }
    ]
  });

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSensitiveData, setShowSensitiveData] = useState(false);

  // Fetch real security data
  const fetchSecurityData = async () => {
    try {
      // In a real implementation, this would fetch from your security API
      // const response = await fetch('/api/admin/security');
      // const data = await response.json();
      // setSecurityData(data);
    } catch (error) {
      console.error('Failed to fetch security data:', error);
    }
  };

  useEffect(() => {
    fetchSecurityData();
    const interval = setInterval(fetchSecurityData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchSecurityData();
    setIsRefreshing(false);
  };

  const handleCloseModal = (modalType: string) => {
    switch (modalType) {
      case 'overview':
        setOverviewModalOpen(false);
        break;
      case 'vulnerabilities':
        setVulnerabilitiesModalOpen(false);
        break;
      case 'activityLog':
        setActivityLogModalOpen(false);
        break;
      case 'userSessions':
        setUserSessionsModalOpen(false);
        break;
      case 'settings':
        setSettingsModalOpen(false);
        break;
    }
  };

  const handleSettingChange = (setting: keyof SecurityData['securitySettings']) => {
    setSecurityData(prev => ({
      ...prev,
      securitySettings: {
        ...prev.securitySettings,
        [setting]: !prev.securitySettings[setting]
      }
    }));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'error';
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <Error />;
      case 'high': return <Warning />;
      case 'medium': return <Info />;
      case 'low': return <CheckCircle />;
      default: return <Info />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'expired': return 'default';
      case 'suspicious': return 'error';
      default: return 'default';
    }
  };

  const securityCards = [
    {
      title: 'Security Score',
      value: `${securityData.overallScore}/100`,
      icon: <Shield />,
      color: securityData.overallScore >= 80 ? 'success' : securityData.overallScore >= 60 ? 'warning' : 'error',
      description: 'Overall security rating'
    },
    {
      title: 'Active Threats',
      value: securityData.activeThreats,
      icon: <Warning />,
      color: securityData.activeThreats === 0 ? 'success' : 'error',
      description: 'Current threats detected'
    },
    {
      title: 'Blocked Attempts',
      value: securityData.blockedAttempts,
      icon: <Security />,
      color: 'info',
      description: 'Last 24 hours'
    },
    {
      title: 'Security Events',
      value: securityData.securityEvents,
      icon: <Info />,
      color: 'primary',
      description: 'Total events logged'
    }
  ];


  return (
    <Box sx={{ 
      px: { xs: 1, sm: 0 }, // Add horizontal padding on mobile
      pb: { xs: 20, sm: 8 }, // Add bottom padding to prevent content from being covered by bottom bar
      maxWidth: '100%',
      overflow: 'hidden' // Prevent horizontal overflow
    }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        mb: 4,
        gap: 2
      }}>
        <Box>
          <Typography variant="h4" sx={{ 
            fontWeight: 600, 
            mb: 1,
            fontSize: { xs: '1.75rem', sm: '2.125rem' },
            color: 'text.primary'
          }}>
            Security Center
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}>
            Monitor and manage security threats, vulnerabilities, and access controls
          </Typography>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          gap: 1,
          flexWrap: 'wrap',
          width: { xs: '100%', sm: 'auto' }
        }}>
          <Tooltip title="Toggle sensitive data visibility">
            <IconButton
              onClick={() => setShowSensitiveData(!showSensitiveData)}
              color={showSensitiveData ? 'primary' : 'default'}
            >
              {showSensitiveData ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </Tooltip>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            disabled={isRefreshing}
            size="small"
            sx={{ flex: { xs: 1, sm: 'none' } }}
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button
            variant="contained"
            startIcon={<Download />}
            size="small"
            sx={{ flex: { xs: 1, sm: 'none' } }}
          >
            Export Report
          </Button>
        </Box>
      </Box>

      {/* Security Cards */}
      <Grid container spacing={2} sx={{ mb: 4, mt: 1 }}>
        {securityCards.map((card, index) => (
          <Grid item xs={6} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText'
                  }}>
                    {card.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ color: 'text.primary' }}>
                      {card.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.title}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    {card.description}
                  </Typography>
                  <Chip 
                    label={card.change}
                    size="small" 
                    color={card.changeColor}
                    variant="filled"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Security Tools */}
      <Card sx={{ mb: { xs: 8, sm: 0 } }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 }, pb: { xs: 6, sm: 3 } }}>
          <Typography variant="h6" sx={{ 
            mb: 3,
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            color: 'text.primary'
          }}>
            Security Tools
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Shield />}
                onClick={() => setOverviewModalOpen(true)}
                sx={{ 
                  p: 2, 
                  height: 'auto',
                  flexDirection: 'column',
                  gap: 1
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Security Overview
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Security status and recent events
                </Typography>
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Warning />}
                onClick={() => setVulnerabilitiesModalOpen(true)}
                sx={{ 
                  p: 2, 
                  height: 'auto',
                  flexDirection: 'column',
                  gap: 1
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Vulnerabilities
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Track and manage security issues
                </Typography>
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Security />}
                onClick={() => setActivityLogModalOpen(true)}
                sx={{ 
                  p: 2, 
                  height: 'auto',
                  flexDirection: 'column',
                  gap: 1
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Activity Log
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Security event monitoring
                </Typography>
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Person />}
                onClick={() => setUserSessionsModalOpen(true)}
                sx={{ 
                  p: 2, 
                  height: 'auto',
                  flexDirection: 'column',
                  gap: 1
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  User Sessions
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Monitor active user sessions
                </Typography>
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Settings />}
                onClick={() => setSettingsModalOpen(true)}
                sx={{ 
                  p: 2, 
                  height: 'auto',
                  flexDirection: 'column',
                  gap: 1
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Security Settings
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Configure security policies
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Security Overview Modal */}
      <Dialog 
        open={overviewModalOpen} 
        onClose={() => handleCloseModal('overview')}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Security Overview</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ 
                mb: 2,
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                color: 'text.primary'
              }}>
                Security Status
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Overall Security Score</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {securityData.overallScore}/100
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={securityData.overallScore} 
                  color={securityData.overallScore >= 80 ? 'success' : securityData.overallScore >= 60 ? 'warning' : 'error'}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Box sx={{ display: 'grid', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
                  <Typography variant="body2">Last Security Scan</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {new Date(securityData.lastScan).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
                  <Typography variant="body2">Open Vulnerabilities</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {securityData.vulnerabilities.filter(v => v.status === 'open').length}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ 
                mb: 2,
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                color: 'text.primary'
              }}>
                Recent Security Events
              </Typography>
              <Box sx={{ display: 'grid', gap: 1 }}>
                {securityData.recentActivity.slice(0, 5).map((event) => (
                  <Box key={event.id} sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    p: 1.5, 
                    backgroundColor: 'grey.50', 
                    borderRadius: 1 
                  }}>
                    <Box sx={{ mr: 2 }}>
                      {event.severity === 'error' && <Error color="error" />}
                      {event.severity === 'warning' && <Warning color="warning" />}
                      {event.severity === 'info' && <Info color="info" />}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {event.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(event.timestamp).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseModal('overview')}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Vulnerabilities Modal */}
      <Dialog 
        open={vulnerabilitiesModalOpen} 
        onClose={() => handleCloseModal('vulnerabilities')}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Security Vulnerabilities</DialogTitle>
        <DialogContent>
          <Typography variant="h6" sx={{ 
            mb: 3,
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            color: 'text.primary'
          }}>
            Security Vulnerabilities
          </Typography>
          <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 400 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Severity</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Discovered</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {securityData.vulnerabilities.map((vuln) => (
                  <TableRow key={vuln.id}>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {vuln.type}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      <Chip 
                        icon={getSeverityIcon(vuln.severity)}
                        label={vuln.severity.toUpperCase()} 
                        size="small" 
                        color={getSeverityColor(vuln.severity)}
                        variant="outlined"
                        sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {vuln.description}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      <Chip 
                        label={vuln.status.replace('_', ' ').toUpperCase()} 
                        size="small" 
                        color={vuln.status === 'resolved' ? 'success' : vuln.status === 'in_progress' ? 'warning' : 'default'}
                        variant="outlined"
                        sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {new Date(vuln.discovered).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseModal('vulnerabilities')}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Activity Log Modal */}
      <Dialog 
        open={activityLogModalOpen} 
        onClose={() => handleCloseModal('activityLog')}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Security Activity Log</DialogTitle>
        <DialogContent>
          <Typography variant="h6" sx={{ 
            mb: 3,
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            color: 'text.primary'
          }}>
            Security Activity Log
          </Typography>
          <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 400 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>IP Address</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Timestamp</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {securityData.recentActivity.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      <Chip 
                        label={event.type} 
                        size="small" 
                        color={event.severity === 'error' ? 'error' : event.severity === 'warning' ? 'warning' : 'info'}
                        variant="outlined"
                        sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {event.description}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {event.user || 'System'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {event.ip || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {new Date(event.timestamp).toLocaleString()}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseModal('activityLog')}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* User Sessions Modal */}
      <Dialog 
        open={userSessionsModalOpen} 
        onClose={() => handleCloseModal('userSessions')}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Active User Sessions</DialogTitle>
        <DialogContent>
          <Typography variant="h6" sx={{ 
            mb: 3,
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            color: 'text.primary'
          }}>
            Active User Sessions
          </Typography>
          <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 400 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Device</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Location</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Last Activity</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {securityData.userSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {session.user}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {session.device}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {session.location}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {new Date(session.lastActivity).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      <Chip 
                        label={session.status.toUpperCase()} 
                        size="small" 
                        color={getStatusColor(session.status)}
                        variant="outlined"
                        sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseModal('userSessions')}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Security Settings Modal */}
      <Dialog 
        open={settingsModalOpen} 
        onClose={() => handleCloseModal('settings')}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Security Settings</DialogTitle>
        <DialogContent>
          <Typography variant="h6" sx={{ 
            mb: 3,
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            color: 'text.primary'
          }}>
            Security Settings
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Authentication" />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={securityData.securitySettings.twoFactorEnabled}
                          onChange={() => handleSettingChange('twoFactorEnabled')}
                        />
                      }
                      label="Two-Factor Authentication"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={securityData.securitySettings.passwordPolicy}
                          onChange={() => handleSettingChange('passwordPolicy')}
                        />
                      }
                      label="Strong Password Policy"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={securityData.securitySettings.encryptionEnabled}
                          onChange={() => handleSettingChange('encryptionEnabled')}
                        />
                      }
                      label="Data Encryption"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Access Control" />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={securityData.securitySettings.ipWhitelist}
                          onChange={() => handleSettingChange('ipWhitelist')}
                        />
                      }
                      label="IP Whitelist"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={securityData.securitySettings.auditLogging}
                          onChange={() => handleSettingChange('auditLogging')}
                        />
                      }
                      label="Audit Logging"
                    />
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Session Timeout: {securityData.securitySettings.sessionTimeout} minutes
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={(securityData.securitySettings.sessionTimeout / 60) * 100} 
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseModal('settings')}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
