'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Button,
  Box,
  Typography,
  Grid,
  Tabs,
  Tab,
  Chip,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { Shield, Activity, RefreshCw, AlertTriangle, Lock, Eye, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select } from '@mui/material';
import { CardDescription } from '@/components/ui/mui-card';

interface SecurityEvent {
  id: string;
  userId?: string;
  eventType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  metadata: any;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

interface ThreatDetection {
  id: string;
  threatId: string;
  type: 'brute_force' | 'suspicious_activity' | 'data_breach' | 'malware' | 'phishing';
  confidence: number;
  indicators: string[];
  affectedUsers: string[];
  timestamp: Date;
  status: 'active' | 'investigating' | 'resolved' | 'false_positive';
}

interface SecurityStats {
  total: number;
  severityBreakdown: Record<string, number>;
  timeRange: {
    start: string;
    end: string;
  };
}

export default function SecurityPage() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [threats, setThreats] = useState<ThreatDetection[]>([]);
  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [severityFilter, setSeverityFilter] = useState('all');
  const [eventTypeFilter, setEventTypeFilter] = useState('all');
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchSecurityData();
  }, [severityFilter, eventTypeFilter]);

  const fetchSecurityData = async () => {
    try {
      setLoading(true);
      
      const [eventsRes, threatsRes] = await Promise.all([
        fetch(`/api/security/events?severity=${severityFilter}&eventType=${eventTypeFilter}`),
        fetch('/api/security/threats'),
      ]);

      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        setEvents(eventsData.events || []);
        setStats(eventsData.stats);
      }

      if (threatsRes.ok) {
        const threatsData = await threatsRes.json();
        setThreats(threatsData.threats || []);
      }
    } catch (error) {
      console.error('Failed to fetch security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchSecurityData();
    setRefreshing(false);
  };

  const handleThreatAction = async (threatId: string, action: string) => {
    try {
      const response = await fetch('/api/security/threats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threatId, action }),
      });

      if (response.ok) {
        await fetchSecurityData();
      }
    } catch (error) {
      console.error('Failed to handle threat action:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getThreatTypeColor = (type: string) => {
    switch (type) {
      case 'brute_force': return 'bg-red-100 text-red-800';
      case 'data_breach': return 'bg-purple-100 text-purple-800';
      case 'suspicious_activity': return 'bg-orange-100 text-orange-800';
      case 'malware': return 'bg-yellow-100 text-yellow-800';
      case 'phishing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800';
      case 'investigating': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'false_positive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportSecurityData = () => {
    const csvData = [
      ['Event Type', 'Severity', 'Description', 'Timestamp', 'IP Address'],
      ...events.map(event => [
        event.eventType,
        event.severity,
        event.description,
        new Date(event.timestamp).toISOString(),
        event.ipAddress || 'N/A',
      ]),
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-events-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) return <Box sx={{ p: 4 }}>Loading security data...</Box>;

  return (
    <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Security Center</Typography>
          <Typography variant="body1" color="text.secondary">Threat monitoring and security management</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <FormControl className="w-40">
            <InputLabel>Severity</InputLabel>
            <Select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)}>
              <MenuItem value="all">All Severities</MenuItem>
              <MenuItem value="critical">Critical</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </Select>
          </FormControl>
          <FormControl className="w-40">
            <InputLabel>Event Type</InputLabel>
            <Select value={eventTypeFilter} onChange={(e) => setEventTypeFilter(e.target.value)}>
              <MenuItem value="all">All Events</MenuItem>
              <MenuItem value="LOGIN">Login</MenuItem>
              <MenuItem value="ACCESS">Access</MenuItem>
              <MenuItem value="THREAT">Threat</MenuItem>
            </Select>
          </FormControl>
          <Button onClick={refreshData} disabled={refreshing} variant="outlined">
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={exportSecurityData} variant="outlined">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </Box>
      </Box>

      {/* Security Overview */}
      {stats && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardHeader sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
                <Typography variant="h6" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>Total Events</Typography>
                <Activity style={{ height: 16, width: 16, color: 'inherit' }} />
              </CardHeader>
              <CardContent>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{stats.total}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Last 24 hours
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardHeader sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
                <Typography variant="h6" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>Critical Events</Typography>
                <AlertTriangle style={{ height: 16, width: 16, color: 'inherit' }} />
              </CardHeader>
              <CardContent>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                  {stats.severityBreakdown.critical || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Requires immediate attention
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardHeader sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
                <Typography variant="h6" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>Active Threats</Typography>
                <Shield style={{ height: 16, width: 16, color: 'inherit' }} />
              </CardHeader>
              <CardContent>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                  {threats.filter(t => t.status === 'active').length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Currently being monitored
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardHeader sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
                <Typography variant="h6" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>Security Score</Typography>
                <Lock style={{ height: 16, width: 16, color: 'inherit' }} />
              </CardHeader>
              <CardContent>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>85%</Typography>
                <Typography variant="caption" color="text.secondary">
                  Overall security health
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} className="space-y-6">
        <Tab label="Security Events" />
        <Tab label="Threat Detection" />
        <Tab label="Security Analytics" />

        {activeTab === 0 && (
          <Box className="space-y-4">
          <Card>
            <CardHeader>
              <Typography variant="h6" className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Security Events
              </Typography>
              <CardDescription>
                Real-time security event monitoring and logging
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No security events found
                  </div>
                ) : (
                  events.map((event) => (
                    <div key={event.id} className={`p-4 border rounded-lg ${getSeverityColor(event.severity)}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{event.eventType}</h3>
                            <Badge className={getSeverityColor(event.severity)} label={event.severity.toUpperCase()} />
                          </div>
                          <p className="text-sm mb-2">{event.description}</p>
                          <div className="text-xs space-y-1">
                            <div>IP: {event.ipAddress || 'N/A'}</div>
                            <div>Time: {new Date(event.timestamp).toLocaleString()}</div>
                            {event.userId && <div>User: {event.userId}</div>}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="small" variant="outlined">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
          </Box>
        )}

        {activeTab === 1 && (
          <Box className="space-y-4">
          <Card>
            <CardHeader>
              <Typography variant="h6" className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Threat Detection
              </Typography>
              <CardDescription>
                AI-powered threat detection and response
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {threats.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No active threats detected
                  </div>
                ) : (
                  threats.map((threat) => (
                    <div key={threat.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{threat.type.replace('_', ' ').toUpperCase()}</h3>
                            <Badge className={getThreatTypeColor(threat.type)} label={threat.type.replace('_', ' ')} />
                            <Badge className={getStatusColor(threat.status)} label={threat.status} />
                            <Badge variant="outlined" label={`${Math.round(threat.confidence * 100)}% confidence`} />
                          </div>
                          <p className="text-sm mb-2">
                            Threat ID: {threat.threatId}
                          </p>
                          <div className="text-xs space-y-1 mb-3">
                            <div>Indicators: {threat.indicators.join(', ')}</div>
                            <div>Affected Users: {threat.affectedUsers.length}</div>
                            <div>Detected: {new Date(threat.timestamp).toLocaleString()}</div>
                          </div>
                          {threat.status === 'active' && (
                            <div className="flex gap-2">
                              <Button 
                                size="small" 
                                variant="outlined"
                                onClick={() => handleThreatAction(threat.threatId, 'investigate')}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Investigate
                              </Button>
                              <Button 
                                size="small" 
                                variant="outlined"
                                onClick={() => handleThreatAction(threat.threatId, 'resolve')}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Resolve
                              </Button>
                              <Button 
                                size="small" 
                                variant="outlined"
                                onClick={() => handleThreatAction(threat.threatId, 'false_positive')}
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                False Positive
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
          </Box>
        )}

        {activeTab === 2 && (
          <Box className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <Typography variant="h6" className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Event Trends
                </Typography>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Critical Events</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-red-600">
                        {stats?.severityBreakdown.critical || 0}
                      </span>
                      <TrendingUp className="h-4 w-4 text-red-600" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">High Severity</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-orange-600">
                        {stats?.severityBreakdown.high || 0}
                      </span>
                      <TrendingDown className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Medium Severity</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-yellow-600">
                        {stats?.severityBreakdown.medium || 0}
                      </span>
                      <TrendingUp className="h-4 w-4 text-yellow-600" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Typography variant="h6" className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Security Metrics
                </Typography>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Response Time</span>
                    <span className="text-lg font-bold">2.3s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Detection Rate</span>
                    <span className="text-lg font-bold">98.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">False Positives</span>
                    <span className="text-lg font-bold">1.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Threats Blocked</span>
                    <span className="text-lg font-bold">156</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          </Box>
        )}
      </Tabs>

      {/* Bottom Spacer to Clear Bottom Navigation */}
      <Box sx={{
        height: { xs: '120px', sm: '40px' },
        width: '100%'
      }} />
    </Box>
  );
} 