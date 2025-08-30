"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  AlertTitle,
  Skeleton,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  LinearProgress,
  Tooltip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Security,
  Shield,
  Lock,
  Visibility,
  VisibilityOff,
  Warning,
  CheckCircle,
  Error,
  Info,
  Settings,
  Add,
  Edit,
  Delete,
  Refresh,
  TrendingUp,
  TrendingDown,
  BugReport,
  Monitor,
  Notifications,
  Schedule,
  History,
  Key,
  Fingerprint,
  VpnKey,
  AdminPanelSettings,
  VerifiedUser,
  Block,
  Report,
  SecurityUpdate,
  Update,
  Download,
  Upload,
  Cloud,
  Storage,
  NetworkCheck,
  Router,
  Firewall,
  Antivirus,
  Encryption,
  TwoFactorAuth,
  Password,
  UserCheck,
  DeviceHub,
  LocationOn,
  AccessTime,
  Speed,
  DataUsage
} from '@mui/icons-material';
import { designTokens } from '@/lib/design-system';

interface SecurityThreat {
  id: string;
  type: 'malware' | 'phishing' | 'brute_force' | 'suspicious_activity' | 'data_breach';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  source: string;
  detectedAt: string;
  status: 'active' | 'investigating' | 'resolved' | 'false_positive';
  affectedUsers: number;
  riskScore: number;
}

interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  category: 'authentication' | 'data_protection' | 'network' | 'compliance';
  isActive: boolean;
  lastUpdated: string;
  compliance: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

interface ComplianceReport {
  id: string;
  standard: string;
  status: 'compliant' | 'non_compliant' | 'in_progress';
  lastAudit: string;
  nextAudit: string;
  score: number;
  findings: number;
  recommendations: string[];
}

export default function EnhancedAdvancedSecurity() {
  const [activeTab, setActiveTab] = useState(0);
  const [threats, setThreats] = useState<SecurityThreat[]>([]);
  const [policies, setSecurityPolicies] = useState<SecurityPolicy[]>([]);
  const [compliance, setCompliance] = useState<ComplianceReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPolicyDialog, setShowPolicyDialog] = useState(false);
  const [securityScore, setSecurityScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      setSecurityScore(87);
      
      setThreats([
        {
          id: 'threat-1',
          type: 'suspicious_activity',
          severity: 'medium',
          description: 'Unusual login pattern detected from new location',
          source: '192.168.1.100',
          detectedAt: '2024-01-15T10:30:00Z',
          status: 'investigating',
          affectedUsers: 1,
          riskScore: 65
        },
        {
          id: 'threat-2',
          type: 'brute_force',
          severity: 'high',
          description: 'Multiple failed login attempts detected',
          source: '203.45.67.89',
          detectedAt: '2024-01-15T09:15:00Z',
          status: 'resolved',
          affectedUsers: 0,
          riskScore: 78
        },
        {
          id: 'threat-3',
          type: 'phishing',
          severity: 'low',
          description: 'Suspicious email link reported by user',
          source: 'phishing@malicious.com',
          detectedAt: '2024-01-15T08:45:00Z',
          status: 'resolved',
          affectedUsers: 1,
          riskScore: 45
        }
      ]);

      setSecurityPolicies([
        {
          id: 'policy-1',
          name: 'Multi-Factor Authentication',
          description: 'Require 2FA for all user accounts',
          category: 'authentication',
          isActive: true,
          lastUpdated: '2024-01-01T00:00:00Z',
          compliance: ['GDPR', 'SOC2', 'ISO27001'],
          riskLevel: 'low'
        },
        {
          id: 'policy-2',
          name: 'Data Encryption at Rest',
          description: 'Encrypt all stored data with AES-256',
          category: 'data_protection',
          isActive: true,
          lastUpdated: '2024-01-01T00:00:00Z',
          compliance: ['GDPR', 'SOC2', 'ISO27001', 'HIPAA'],
          riskLevel: 'low'
        },
        {
          id: 'policy-3',
          name: 'Network Access Control',
          description: 'Restrict network access based on user role',
          category: 'network',
          isActive: true,
          lastUpdated: '2024-01-10T00:00:00Z',
          compliance: ['SOC2', 'ISO27001'],
          riskLevel: 'medium'
        }
      ]);

      setCompliance([
        {
          id: 'compliance-1',
          standard: 'GDPR',
          status: 'compliant',
          lastAudit: '2024-01-01T00:00:00Z',
          nextAudit: '2024-07-01T00:00:00Z',
          score: 94,
          findings: 2,
          recommendations: [
            'Update privacy policy to reflect new data processing activities',
            'Implement additional data retention controls'
          ]
        },
        {
          id: 'compliance-2',
          standard: 'SOC2 Type II',
          status: 'compliant',
          lastAudit: '2023-12-01T00:00:00Z',
          nextAudit: '2024-12-01T00:00:00Z',
          score: 91,
          findings: 3,
          recommendations: [
            'Enhance monitoring and logging capabilities',
            'Strengthen access control procedures'
          ]
        },
        {
          id: 'compliance-3',
          standard: 'ISO27001',
          status: 'in_progress',
          lastAudit: '2024-01-15T00:00:00Z',
          nextAudit: '2024-06-15T00:00:00Z',
          score: 78,
          findings: 8,
          recommendations: [
            'Complete risk assessment documentation',
            'Implement incident response procedures',
            'Establish security awareness training program'
          ]
        }
      ]);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return designTokens.colors.success[500];
      case 'medium':
        return designTokens.colors.warning[500];
      case 'high':
        return designTokens.colors.error[500];
      case 'critical':
        return designTokens.colors.error[700];
      default:
        return designTokens.colors.neutral[500];
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
      case 'resolved':
        return designTokens.colors.success[500];
      case 'in_progress':
      case 'investigating':
        return designTokens.colors.warning[500];
      case 'non_compliant':
      case 'active':
        return designTokens.colors.error[500];
      default:
        return designTokens.colors.neutral[500];
    }
  };

  const getThreatIcon = (type: string) => {
    switch (type) {
      case 'malware':
        return <BugReport />;
      case 'phishing':
        return <Warning />;
      case 'brute_force':
        return <Block />;
      case 'suspicious_activity':
        return <Monitor />;
      case 'data_breach':
        return <Error />;
      default:
        return <Security />;
    }
  };

  const renderThreatsTab = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, color: designTokens.colors.neutral[800] }}>
        Security Threats & Incidents
      </Typography>

      <Grid container spacing={3}>
        {threats.map((threat) => (
          <Grid item xs={12} md={6} lg={4} key={threat.id}>
            <Card elevation={0} sx={{ border: `1px solid ${designTokens.colors.neutral[200]}` }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getThreatIcon(threat.type)}
                    <Box>
                      <Typography variant="h6" sx={{ color: designTokens.colors.neutral[800] }}>
                        {threat.type.replace('_', ' ')}
                      </Typography>
                      <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                        {threat.source}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Chip
                      label={threat.severity}
                      size="small"
                      sx={{
                        background: `${getSeverityColor(threat.severity)}15`,
                        color: getSeverityColor(threat.severity),
                        fontWeight: 'medium',
                        textTransform: 'capitalize',
                        mb: 1
                      }}
                    />
                    <Chip
                      label={threat.status}
                      size="small"
                      sx={{
                        background: `${getStatusColor(threat.status)}15`,
                        color: getStatusColor(threat.status),
                        fontWeight: 'medium',
                        textTransform: 'capitalize'
                      }}
                    />
                  </Box>
                </Box>

                <Typography variant="body2" sx={{ color: designTokens.colors.neutral[700], mb: 2 }}>
                  {threat.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                      Risk Score: {threat.riskScore}/100
                    </Typography>
                    <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                      Affected: {threat.affectedUsers}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={threat.riskScore}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: designTokens.colors.neutral[200],
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getSeverityColor(threat.severity),
                        borderRadius: 4
                      }
                    }}
                  />
                </Box>

                <Typography variant="body2" sx={{ color: designTokens.colors.neutral[500], mb: 2 }}>
                  Detected: {new Date(threat.detectedAt).toLocaleDateString()}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Info />}
                  >
                    Investigate
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Block />}
                  >
                    Block Source
                  </Button>
                  {threat.status === 'active' && (
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<CheckCircle />}
                    >
                      Resolve
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderPoliciesTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ color: designTokens.colors.neutral[800] }}>
          Security Policies & Controls
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setShowPolicyDialog(true)}
        >
          Create Policy
        </Button>
      </Box>

      <Grid container spacing={3}>
        {policies.map((policy) => (
          <Grid item xs={12} md={6} lg={4} key={policy.id} component="div">
            <Card elevation={0} sx={{ border: `1px solid ${designTokens.colors.neutral[200]}` }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getPolicyIcon(policy.category)}
                    <Box>
                      <Typography variant="h6" sx={{ color: designTokens.colors.neutral[800] }}>
                        {policy.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                        {policy.category}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Chip
                      label={policy.riskLevel}
                      size="small"
                      sx={{
                        background: `${getSeverityColor(policy.riskLevel)}15`,
                        color: getSeverityColor(policy.riskLevel),
                        fontWeight: 'medium',
                        textTransform: 'capitalize'
                      }}
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: designTokens.colors.neutral[700], mb: 1 }}>
                    Compliance Standards
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {policy.compliance.map((standard, index) => (
                      <Chip
                        key={index}
                        label={standard}
                        size="small"
                        sx={{
                          background: designTokens.colors.success[100],
                          color: designTokens.colors.success[700],
                          fontSize: '0.7rem'
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                    Last updated: {new Date(policy.lastUpdated).toLocaleDateString()}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton size="small" sx={{ color: designTokens.colors.primary[600] }}>
                    <Edit />
                  </IconButton>
                  <IconButton size="small" sx={{ color: designTokens.colors.neutral[600] }}>
                    <Visibility />
                  </IconButton>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={policy.isActive}
                        sx={{ ml: 1 }}
                      />
                    }
                    label=""
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderComplianceTab = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, color: designTokens.colors.neutral[800] }}>
        Compliance & Audit Reports
      </Typography>

      <Grid container spacing={3}>
        {compliance.map((report) => (
          <Grid item xs={12} md={6} lg={4} key={report.id}>
            <Card elevation={0} sx={{ border: `1px solid ${designTokens.colors.neutral[200]}` }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ color: designTokens.colors.neutral[800] }}>
                      {report.standard}
                    </Typography>
                    <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                      Compliance Status
                    </Typography>
                  </Box>
                  <Chip
                    label={report.status.replace('_', ' ')}
                    size="small"
                    sx={{
                      background: `${getStatusColor(report.status)}15`,
                      color: getStatusColor(report.status),
                      fontWeight: 'medium',
                      textTransform: 'capitalize'
                    }}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="h4" sx={{ color: designTokens.colors.neutral[900], fontWeight: 'bold' }}>
                    {report.score}%
                  </Typography>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                    Compliance Score
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                    Findings: {report.findings}
                  </Typography>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                    Last Audit: {new Date(report.lastAudit).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                    Next Audit: {new Date(report.nextAudit).toLocaleDateString()}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ color: designTokens.colors.neutral[700], mb: 1 }}>
                    Key Recommendations
                  </Typography>
                  <List dense>
                    {report.recommendations.slice(0, 2).map((rec, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          <Info sx={{ fontSize: 16, color: designTokens.colors.warning[600] }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={rec}
                          primaryTypographyProps={{
                            variant: 'body2',
                            sx: { color: designTokens.colors.neutral[600], fontSize: '0.875rem' }
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Download />}
                  >
                    Download Report
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Edit />}
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" width="60%" height={48} />
        <Skeleton variant="text" width="40%" height={24} />
        <Box sx={{ mt: 4 }}>
          <Grid container spacing={3}>
            {[1, 2, 3].map((item) => (
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
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: designTokens.colors.error[600]
            }}
          >
            <Security sx={{ fontSize: 28 }} />
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
              Enhanced Advanced Security
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: designTokens.colors.neutral[600],
                fontWeight: designTokens.typography.fontWeight.normal
              }}
            >
              Enterprise-grade security monitoring, threat detection, and compliance management
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Security Score Alert */}
      <Alert 
        severity="success" 
        sx={{ 
          mb: 4,
          background: 'linear-gradient(90deg, rgba(34, 197, 94, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
          border: `1px solid ${designTokens.colors.success[200]}`,
          borderRadius: designTokens.borderRadius.lg
        }}
      >
        <AlertTitle sx={{ color: designTokens.colors.success[700] }}>
          🛡️ Security Status: EXCELLENT
        </AlertTitle>
        <Typography variant="body2" sx={{ color: designTokens.colors.success[700] }}>
          Your overall security score is {securityScore}/100. {threats.length} active threats detected, 
          {policies.length} security policies active, and {compliance.filter(c => c.status === 'compliant').length}/{compliance.length} compliance standards met.
        </Typography>
      </Alert>

      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="Threats & Incidents" />
          <Tab label="Security Policies" />
          <Tab label="Compliance" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && renderThreatsTab()}
      {activeTab === 1 && renderPoliciesTab()}
      {activeTab === 2 && renderComplianceTab()}

      {/* Create Policy Dialog */}
      <Dialog open={showPolicyDialog} onClose={() => setShowPolicyDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Security Policy</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Policy Name"
            placeholder="Enter policy name"
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="Description"
            placeholder="Enter policy description"
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select label="Category">
              <MenuItem value="authentication">Authentication</MenuItem>
              <MenuItem value="data_protection">Data Protection</MenuItem>
              <MenuItem value="network">Network</MenuItem>
              <MenuItem value="compliance">Compliance</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Risk Level</InputLabel>
            <Select label="Risk Level">
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPolicyDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setShowPolicyDialog(false)}>
            Create Policy
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
