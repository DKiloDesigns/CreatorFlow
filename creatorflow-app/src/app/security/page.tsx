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
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { Shield, Activity } from 'lucide-react';

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

  if (loading) return <div className="p-8">Loading security data...</div>;

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Security Center</h1>
          <p className="text-muted-foreground">Threat monitoring and security management</p>
        </div>
        <div className="flex gap-2">
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="LOGIN">Login</SelectItem>
              <SelectItem value="ACCESS">Access</SelectItem>
              <SelectItem value="THREAT">Threat</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={refreshData} disabled={refreshing} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={exportSecurityData} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Security Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                Last 24 hours
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Events</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.severityBreakdown.critical || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Requires immediate attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Threats</CardTitle>
              <Shield className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {threats.filter(t => t.status === 'active').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently being monitored
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security Score</CardTitle>
              <Lock className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">85%</div>
              <p className="text-xs text-muted-foreground">
                Overall security health
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="events" className="space-y-6">
        <TabsList>
          <TabsTrigger value="events">Security Events</TabsTrigger>
          <TabsTrigger value="threats">Threat Detection</TabsTrigger>
          <TabsTrigger value="analytics">Security Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Security Events
              </CardTitle>
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
                            <Badge className={getSeverityColor(event.severity)}>
                              {event.severity.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm mb-2">{event.description}</p>
                          <div className="text-xs space-y-1">
                            <div>IP: {event.ipAddress || 'N/A'}</div>
                            <div>Time: {new Date(event.timestamp).toLocaleString()}</div>
                            {event.userId && <div>User: {event.userId}</div>}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
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
        </TabsContent>

        <TabsContent value="threats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Threat Detection
              </CardTitle>
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
                            <Badge className={getThreatTypeColor(threat.type)}>
                              {threat.type.replace('_', ' ')}
                            </Badge>
                            <Badge className={getStatusColor(threat.status)}>
                              {threat.status}
                            </Badge>
                            <Badge variant="outline">
                              {Math.round(threat.confidence * 100)}% confidence
                            </Badge>
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
                                size="sm" 
                                variant="outline"
                                onClick={() => handleThreatAction(threat.threatId, 'investigate')}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Investigate
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleThreatAction(threat.threatId, 'resolve')}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Resolve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
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
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Event Trends
                </CardTitle>
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
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Security Metrics
                </CardTitle>
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
        </TabsContent>
      </Tabs>
    </div>
  );
} 