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
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  InputAdornment,
  Slider,
  AlertTitle,
  Badge
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
  Shield,
  Lock,
  Key,
  Speed,
  Storage,
  Refresh,
  FilterList,
  Search,
  MoreVert,
  Download,
  Share,
  Settings,
  Dashboard,
  Assessment,
  Business,
  School,
  Work,
  CheckCircle,
  Warning,
  Error,
  Info,
  ExpandMore,
  Palette,
  Cloud,
  Timeline,
  Compare,
  AutoAwesome,
  DataUsage,
  Insights,
  Report,
  Schedule,
  Notifications,
  Public,
  ContentCopy,
  QrCode,
  History,
  TrendingUp,
  TrendingDown,
  Bolt,
  Timer,
  Memory,
  NetworkCheck,
  Router,
  Storage as StorageIcon,
  DeveloperMode,
  BugReport,
  Build,
  IntegrationInstructions,
  VpnKey,
  Fingerprint,
  VerifiedUser,
  AdminPanelSettings,
  SecurityUpdate,
  PrivacyTip,
  GppGood,
  Security,
  Audit,
  Monitor,
  Warning as WarningIcon,
  Block,
  CheckBox,
  Cancel,
  PlayArrow,
  Pause,
  Stop
} from '@/lib/mui-optimized-imports';

interface SecurityEvent {
  id: string;
  type: 'login' | 'logout' | 'permission_change' | 'data_access' | 'admin_action' | 'security_alert';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  user: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  location: string;
  status: 'investigating' | 'resolved' | 'false_positive';
  riskScore: number;
}

interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  category: 'authentication' | 'authorization' | 'data_protection' | 'network' | 'compliance';
  isActive: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  lastUpdated: string;
  createdBy: string;
  rules: string[];
  compliance: string[];
}

interface ComplianceReport {
  id: string;
  name: string;
  standard: 'GDPR' | 'CCPA' | 'SOC2' | 'ISO27001' | 'HIPAA' | 'PCI-DSS';
  status: 'compliant' | 'non_compliant' | 'in_progress' | 'audit_required';
  lastAudit: string;
  nextAudit: string;
  score: number;
  findings: Array<{
    id: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    status: 'open' | 'in_progress' | 'resolved';
    dueDate: string;
  }>;
}

interface SecurityThreat {
  id: string;
  name: string;
  type: 'malware' | 'phishing' | 'brute_force' | 'data_breach' | 'insider_threat' | 'ddos';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'detected' | 'investigating' | 'contained' | 'resolved';
  description: string;
  detectedAt: string;
  affectedUsers: number;
  riskScore: number;
  mitigation: string[];
  ioc: string[]; // Indicators of Compromise
}

interface SecurityMetrics {
  totalEvents: number;
  criticalEvents: number;
  complianceScore: number;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  lastIncident: string;
  avgResponseTime: number;
  securityScore: number;
}

export default function AdvancedSecurity() {
  const [activeTab, setActiveTab] = useState(0);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [securityPolicies, setSecurityPolicies] = useState<SecurityPolicy[]>([]);
  const [complianceReports, setComplianceReports] = useState<ComplianceReport[]>([]);
  const [securityThreats, setSecurityThreats] = useState<SecurityThreat[]>([]);
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Dialog states
  const [showPolicyDialog, setShowPolicyDialog] = useState(false);
  const [showThreatDialog, setShowThreatDialog] = useState(false);
  const [showComplianceDialog, setShowComplianceDialog] = useState(false);
  
  // Form states
  const [policyForm, setPolicyForm] = useState({
    name: '',
    description: '',
    category: 'authentication',
    priority: 'medium',
    rules: [] as string[]
  });

  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockSecurityEvents: SecurityEvent[] = [
        {
          id: '1',
          type: 'login',
          severity: 'low',
          description: 'Successful login from new device',
          user: 'sarah@creatorflow.com',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          timestamp: new Date().toISOString(),
          location: 'San Francisco, CA',
          status: 'resolved',
          riskScore: 15
        },
        {
          id: '2',
          type: 'permission_change',
          severity: 'medium',
          description: 'Admin role assigned to user',
          user: 'mike@creatorflow.com',
          ipAddress: '192.168.1.50',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          location: 'New York, NY',
          status: 'investigating',
          riskScore: 45
        },
        {
          id: '3',
          type: 'security_alert',
          severity: 'high',
          description: 'Multiple failed login attempts detected',
          user: 'unknown@creatorflow.com',
          ipAddress: '203.0.113.1',
          userAgent: 'Mozilla/5.0 (compatible; Bot)',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          location: 'Unknown',
          status: 'investigating',
          riskScore: 85
        },
        {
          id: '4',
          type: 'data_access',
          severity: 'medium',
          description: 'Bulk data export initiated',
          user: 'darrell@creatorflow.com',
          ipAddress: '192.168.1.10',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          location: 'San Francisco, CA',
          status: 'resolved',
          riskScore: 35
        }
      ];

      const mockSecurityPolicies: SecurityPolicy[] = [
        {
          id: '1',
          name: 'Multi-Factor Authentication',
          description: 'Require MFA for all user accounts',
          category: 'authentication',
          isActive: true,
          priority: 'critical',
          lastUpdated: '2024-01-15T00:00:00Z',
          createdBy: 'Darrell Mayberry',
          rules: ['All users must enable MFA', 'MFA required for admin access', 'Backup codes must be generated'],
          compliance: ['SOC2', 'ISO27001', 'GDPR']
        },
        {
          id: '2',
          name: 'Data Encryption at Rest',
          description: 'Encrypt all sensitive data stored in databases',
          category: 'data_protection',
          isActive: true,
          priority: 'high',
          lastUpdated: '2024-03-20T00:00:00Z',
          createdBy: 'Sarah Chen',
          rules: ['AES-256 encryption for databases', 'Encryption keys stored in KMS', 'Regular key rotation'],
          compliance: ['SOC2', 'ISO27001', 'PCI-DSS']
        },
        {
          id: '3',
          name: 'Network Access Control',
          description: 'Restrict network access based on user roles',
          category: 'network',
          isActive: true,
          priority: 'high',
          lastUpdated: '2024-05-10T00:00:00Z',
          createdBy: 'Mike Rodriguez',
          rules: ['VPN required for remote access', 'IP whitelisting for admin access', 'Network segmentation'],
          compliance: ['SOC2', 'ISO27001']
        }
      ];

      const mockComplianceReports: ComplianceReport[] = [
        {
          id: '1',
          name: 'GDPR Compliance Report',
          standard: 'GDPR',
          status: 'compliant',
          lastAudit: '2024-06-15T00:00:00Z',
          nextAudit: '2024-12-15T00:00:00Z',
          score: 95,
          findings: [
            {
              id: '1',
              description: 'Data retention policies need review',
              severity: 'medium',
              status: 'in_progress',
              dueDate: '2024-09-15T00:00:00Z'
            }
          ]
        },
        {
          id: '2',
          name: 'SOC2 Type II Report',
          standard: 'SOC2',
          status: 'in_progress',
          lastAudit: '2024-03-20T00:00:00Z',
          nextAudit: '2024-09-20T00:00:00Z',
          score: 87,
          findings: [
            {
              id: '2',
              description: 'Access control matrix needs updating',
              severity: 'high',
              status: 'open',
              dueDate: '2024-08-20T00:00:00Z'
            },
            {
              id: '3',
              description: 'Incident response procedures need testing',
              severity: 'medium',
              status: 'in_progress',
              dueDate: '2024-08-30T00:00:00Z'
            }
          ]
        },
        {
          id: '3',
          name: 'ISO27001 Certification',
          standard: 'ISO27001',
          status: 'audit_required',
          lastAudit: '2024-01-10T00:00:00Z',
          nextAudit: '2024-10-10T00:00:00Z',
          score: 92,
          findings: []
        }
      ];

      const mockSecurityThreats: SecurityThreat[] = [
        {
          id: '1',
          name: 'Suspicious Login Attempts',
          type: 'brute_force',
          severity: 'medium',
          status: 'contained',
          description: 'Multiple failed login attempts from suspicious IP addresses',
          detectedAt: new Date(Date.now() - 3600000).toISOString(),
          affectedUsers: 0,
          riskScore: 65,
          mitigation: ['IP blocking implemented', 'Rate limiting increased', 'User notifications sent'],
          ioc: ['203.0.113.1', '203.0.113.2', '203.0.113.3']
        },
        {
          id: '2',
          name: 'Data Export Anomaly',
          type: 'insider_threat',
          severity: 'low',
          status: 'investigating',
          description: 'Unusual data export pattern detected',
          detectedAt: new Date(Date.now() - 86400000).toISOString(),
          affectedUsers: 1,
          riskScore: 25,
          mitigation: ['User activity monitored', 'Data access logs reviewed'],
          ioc: ['Bulk export pattern', 'After-hours access']
        }
      ];

      const mockSecurityMetrics: SecurityMetrics = {
        totalEvents: 15420,
        criticalEvents: 3,
        complianceScore: 91,
        threatLevel: 'low',
        lastIncident: '2 hours ago',
        avgResponseTime: 15,
        securityScore: 87
      };

      setSecurityEvents(mockSecurityEvents);
      setSecurityPolicies(mockSecurityPolicies);
      setComplianceReports(mockComplianceReports);
      setSecurityThreats(mockSecurityThreats);
      setSecurityMetrics(mockSecurityMetrics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load security data');
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'success';
      case 'investigating': return 'warning';
      case 'open': return 'error';
      case 'in_progress': return 'info';
      case 'contained': return 'warning';
      case 'detected': return 'error';
      default: return 'default';
    }
    };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle />;
      case 'investigating': return <Info />;
      case 'open': return <Warning />;
      case 'in_progress': return <PlayArrow />;
      case 'contained': return <Pause />;
      case 'detected': return <WarningIcon />;
      default: return <Info />;
    }
  };

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getComplianceStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'success';
      case 'in_progress': return 'warning';
      case 'non_compliant': return 'error';
      case 'audit_required': return 'info';
      default: return 'default';
    }
  };

  const handleCreatePolicy = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPolicy: SecurityPolicy = {
        id: `policy_${Date.now()}`,
        name: policyForm.name,
        description: policyForm.description,
        category: policyForm.category as any,
        isActive: true,
        priority: policyForm.priority as any,
        lastUpdated: new Date().toISOString(),
        createdBy: 'Darrell Mayberry',
        rules: policyForm.rules,
        compliance: []
      };
      
      setSecurityPolicies(prev => [newPolicy, ...prev]);
      setShowPolicyDialog(false);
      setPolicyForm({ name: '', description: '', category: 'authentication', priority: 'medium', rules: [] });
    } catch (error) {
      console.error('Failed to create security policy:', error);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <Box>
            <Typography variant="h5" sx={{ mb: 3 }}>Security Events & Alerts</Typography>
            
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Event</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>IP Address</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Severity</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Risk Score</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {securityEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2">{event.description}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(event.timestamp).toLocaleString()}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{event.user}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{event.ipAddress}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{event.location}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={event.severity}
                          size="small"
                          color={getSeverityColor(event.severity) as any}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={event.status}
                          size="small"
                          color={getStatusColor(event.status) as any}
                          icon={getStatusIcon(event.status)}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2">{event.riskScore}</Typography>
                          <LinearProgress
                            variant="determinate"
                            value={event.riskScore}
                            color={event.riskScore > 70 ? 'error' : event.riskScore > 40 ? 'warning' : 'success'}
                            sx={{ width: 60, height: 6 }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton size="small">
                            <Visibility />
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
              <Typography variant="h5">Security Policies</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowPolicyDialog(true)}
              >
                Create Policy
              </Button>
            </Box>
            
            <Grid container spacing={3}>
              {securityPolicies.map((policy) => (
                <Grid item xs={12} md={6} lg={4} key={policy.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            {policy.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {policy.description}
                          </Typography>
                        </Box>
                        <Switch
                          checked={policy.isActive}
                          color="primary"
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Chip
                          label={policy.category}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        <Chip
                          label={policy.priority}
                          size="small"
                          color={getSeverityColor(policy.priority) as any}
                        />
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Rules:
                        </Typography>
                        {policy.rules.map((rule, index) => (
                          <Typography key={index} variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            • {rule}
                          </Typography>
                        ))}
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Compliance:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {policy.compliance.map((comp) => (
                            <Chip
                              key={comp}
                              label={comp}
                              size="small"
                              color="success"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button variant="outlined" size="small" startIcon={<Edit />}>
                          Edit
                        </Button>
                        <Button variant="outlined" size="small" startIcon={<Settings />}>
                          Configure
                        </Button>
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
            <Typography variant="h5" sx={{ mb: 3 }}>Compliance & Auditing</Typography>
            
            <Grid container spacing={3}>
              {complianceReports.map((report) => (
                <Grid item xs={12} md={6} lg={4} key={report.id} component="div">
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" gutterBottom>
                          {report.name}
                        </Typography>
                        <Chip
                          label={report.status}
                          size="small"
                          color={getComplianceStatusColor(report.status) as any}
                        />
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Standard: {report.standard}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Last Audit: {new Date(report.lastAudit).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Next Audit: {new Date(report.nextAudit).toLocaleDateString()}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="h4" color="primary" gutterBottom>
                          {report.score}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={report.score}
                          color={report.score > 90 ? 'success' : report.score > 70 ? 'warning' : 'error'}
                          sx={{ height: 8 }}
                        />
                      </Box>
                      
                      {report.findings.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Open Findings: {report.findings.filter(f => f.status !== 'resolved').length}
                          </Typography>
                          {report.findings.slice(0, 2).map((finding) => (
                            <Chip
                              key={finding.id}
                              label={`${finding.severity}: ${finding.description.substring(0, 30)}...`}
                              size="small"
                              color={getSeverityColor(finding.severity) as any}
                              variant="outlined"
                              sx={{ mr: 0.5, mb: 0.5 }}
                            />
                          ))}
                        </Box>
                      )}
                      
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button variant="outlined" size="small" startIcon={<Assessment />}>
                          View Report
                        </Button>
                        <Button variant="outlined" size="small" startIcon={<Schedule />}>
                          Schedule Audit
                        </Button>
                      </Box>
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
            <Typography variant="h5" sx={{ mb: 3 }}>Threat Intelligence</Typography>
            
            <Grid container spacing={3}>
              {securityThreats.map((threat) => (
                <Grid item xs={12} md={6} key={threat.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            {threat.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {threat.description}
                          </Typography>
                        </Box>
                        <Chip
                          label={threat.status}
                          size="small"
                          color={getStatusColor(threat.status) as any}
                          icon={getStatusIcon(threat.status)}
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Chip
                          label={threat.type}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        <Chip
                          label={threat.severity}
                          size="small"
                          color={getSeverityColor(threat.severity) as any}
                        />
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Detected: {new Date(threat.detectedAt).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Risk Score: {threat.riskScore}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Affected Users: {threat.affectedUsers}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Mitigation Actions:
                        </Typography>
                        {threat.mitigation.map((action, index) => (
                          <Typography key={index} variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            ✓ {action}
                          </Typography>
                        ))}
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button variant="outlined" size="small" startIcon={<Visibility />}>
                          View Details
                        </Button>
                        <Button variant="outlined" size="small" startIcon={<Edit />}>
                          Update Status
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
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
          Loading security dashboard...
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
            Advanced Security
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enterprise-grade security, compliance, and threat intelligence
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<Settings />}>
            Security Settings
          </Button>
          <Button variant="contained" startIcon={<Download />}>
            Export Security Report
          </Button>
        </Box>
      </Box>

      {/* Security Overview */}
      {securityMetrics && (
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Security Score
                    </Typography>
                    <Typography variant="h4">
                      {securityMetrics.securityScore}/100
                    </Typography>
                  </Box>
                  <Shield color="primary" />
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={securityMetrics.securityScore}
                  color={securityMetrics.securityScore > 80 ? 'success' : securityMetrics.securityScore > 60 ? 'warning' : 'error'}
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Threat Level
                    </Typography>
                    <Typography variant="h4">
                      {securityMetrics.threatLevel.charAt(0).toUpperCase() + securityMetrics.threatLevel.slice(1)}
                    </Typography>
                  </Box>
                  <Security color={getThreatLevelColor(securityMetrics.threatLevel) as any} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Compliance Score
                    </Typography>
                    <Typography variant="h4">
                      {securityMetrics.complianceScore}%
                    </Typography>
                  </Box>
                                      <Security color="success" />
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={securityMetrics.complianceScore}
                  color={securityMetrics.complianceScore > 90 ? 'success' : securityMetrics.complianceScore > 70 ? 'warning' : 'error'}
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Critical Events
                    </Typography>
                    <Typography variant="h4">
                      {securityMetrics.criticalEvents}
                    </Typography>
                  </Box>
                  <Warning color="warning" />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Last incident: {securityMetrics.lastIncident}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="Security Events" />
          <Tab label="Security Policies" />
          <Tab label="Compliance" />
          <Tab label="Threat Intelligence" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Create Security Policy Dialog */}
      <Dialog open={showPolicyDialog} onClose={() => setShowPolicyDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Security Policy</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Policy Name"
              value={policyForm.name}
              onChange={(e) => setPolicyForm({ ...policyForm, name: e.target.value })}
              required
            />
            
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={policyForm.description}
              onChange={(e) => setPolicyForm({ ...policyForm, description: e.target.value })}
              required
            />
            
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={policyForm.category}
                label="Category"
                onChange={(e) => setPolicyForm({ ...policyForm, category: e.target.value })}
              >
                <MenuItem value="authentication">Authentication</MenuItem>
                <MenuItem value="authorization">Authorization</MenuItem>
                <MenuItem value="data_protection">Data Protection</MenuItem>
                <MenuItem value="network">Network</MenuItem>
                <MenuItem value="compliance">Compliance</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={policyForm.priority}
                label="Priority"
                onChange={(e) => setPolicyForm({ ...policyForm, priority: e.target.value })}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Rules (one per line)"
              multiline
              rows={4}
              value={policyForm.rules.join('\n')}
              onChange={(e) => setPolicyForm({ ...policyForm, rules: e.target.value.split('\n').filter(r => r.trim()) })}
              placeholder="Enter policy rules, one per line..."
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPolicyDialog(false)}>Cancel</Button>
          <Button onClick={handleCreatePolicy} variant="contained">
            Create Policy
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
