'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  AlertTitle,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@/lib/mui-optimized-imports';
import {
  Shield,
  Lock,
  Warning,
  CheckCircle,
  Error,
  Refresh,
  Settings,
  Security,
  Key,
  Visibility,
  VisibilityOff,
} from '@/lib/mui-optimized-imports';
import { useRouter, usePathname } from 'next/navigation';

interface SecurityStats {
  totalThreats: number;
  blockedIPs: number;
  failedLogins: number;
  activeSessions: number;
  securityScore: number;
}

interface SecurityEvent {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}

interface SecurityRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  action: string;
  completed: boolean;
}

export function SecurityTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const value = pathname.includes('/api') ? 1 : 0;

  return (
    <Box sx={{ mb: 2, mt: 1 }}>
      <Tabs
        value={value}
        onChange={(_, newValue) => {
          router.push(newValue === 0 ? '/dashboard/security/account' : '/dashboard/security/api');
        }}
        variant="fullWidth"
        aria-label="Security section tabs"
      >
        <Tab label="Account Security" />
        <Tab label="API Security" />
      </Tabs>
    </Box>
  );
}

export default function SecurityDashboard() {
  const [stats, setStats] = useState<SecurityStats>({
    totalThreats: 0,
    blockedIPs: 0,
    failedLogins: 0,
    activeSessions: 0,
    securityScore: 0,
  });
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [recommendations, setRecommendations] = useState<SecurityRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const fetchSecurityData = async () => {
    try {
      setLoading(true);
      
      // Fetch security stats
      const statsResponse = await fetch('/api/security/stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Fetch security events
      const eventsResponse = await fetch('/api/security/events?limit=20');
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        setEvents(eventsData.events || []);
      }

      // Fetch security recommendations
      const recommendationsResponse = await fetch('/api/security/recommendations');
      if (recommendationsResponse.ok) {
        const recommendationsData = await recommendationsResponse.json();
        setRecommendations(recommendationsData.recommendations || []);
      }
    } catch (error) {
      console.error('Error fetching security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <Error sx={{ fontSize: 20 }} />;
      case 'high': return <Warning sx={{ fontSize: 20 }} />;
      case 'medium': return <Warning sx={{ fontSize: 20 }} />;
      case 'low': return <CheckCircle sx={{ fontSize: 20 }} />;
      default: return <Security sx={{ fontSize: 20 }} />;
    }
  };

  const getSecurityScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getSecurityScoreText = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading security dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Security Dashboard
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh sx={{ fontSize: 20 }} />}
          onClick={fetchSecurityData}
        >
          Refresh
        </Button>
      </Box>

      {/* Security Score */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Shield sx={{ fontSize: 24, marginRight: 1 }} />
            <Typography variant="h6">Security Score</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flexGrow: 1 }}>
              <LinearProgress
                variant="determinate"
                value={stats.securityScore}
                sx={{ height: 8, borderRadius: 4 }}
                color={getSecurityScoreColor(stats.securityScore) as any}
              />
            </Box>
            <Typography variant="h4" color={`${getSecurityScoreColor(stats.securityScore)}.main`}>
              {stats.securityScore}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {getSecurityScoreText(stats.securityScore)}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Security Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Warning color="error" sx={{ fontSize: 24, marginRight: 1 }} />
                <Box>
                  <Typography variant="h6">{stats.totalThreats}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Threats
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Lock color="warning" sx={{ fontSize: 24, marginRight: 1 }} />
                <Box>
                  <Typography variant="h6">{stats.blockedIPs}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Blocked IPs
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Warning color="info" sx={{ fontSize: 24, marginRight: 1 }} />
                <Box>
                  <Typography variant="h6">{stats.failedLogins}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Failed Logins
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Key color="success" sx={{ fontSize: 24, marginRight: 1 }} />
                <Box>
                  <Typography variant="h6">{stats.activeSessions}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Sessions
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="Security Events" />
          <Tab label="Recommendations" />
          <Tab label="Settings" />
        </Tabs>
      </Paper>

      {/* Security Events Tab */}
      {activeTab === 0 && (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Severity</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>IP Address</TableCell>
                  <TableCell>Timestamp</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <Chip
                        label={event.type}
                        size="small"
                        color={getSeverityColor(event.severity) as any}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getSeverityIcon(event.severity)}
                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                          {event.severity}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{event.description}</TableCell>
                    <TableCell>{event.ipAddress}</TableCell>
                    <TableCell>
                      {new Date(event.timestamp).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Recommendations Tab */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          {recommendations.map((rec) => (
            <Grid item xs={12} md={6} key={rec.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6">{rec.title}</Typography>
                    <Chip
                      label={rec.priority}
                      size="small"
                      color={getSeverityColor(rec.priority) as any}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {rec.description}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    disabled={rec.completed}
                    startIcon={rec.completed ? <CheckCircle sx={{ fontSize: 16 }} /> : <Settings sx={{ fontSize: 16 }} />}
                  >
                    {rec.completed ? 'Completed' : rec.action}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Settings Tab */}
      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Security Settings
                </Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                  <AlertTitle>Security Recommendations</AlertTitle>
                  Enable all security features for maximum protection.
                </Alert>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button variant="outlined" startIcon={<Shield sx={{ fontSize: 20 }} />}>
                    Enable 2FA
                  </Button>
                  <Button variant="outlined" startIcon={<Lock sx={{ fontSize: 20 }} />}>
                    Change Password
                  </Button>
                  <Button variant="outlined" startIcon={<Key sx={{ fontSize: 20 }} />}>
                    Manage API Keys
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Activity
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Monitor your account activity and security events.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
