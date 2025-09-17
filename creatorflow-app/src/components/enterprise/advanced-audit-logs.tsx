/**
 * Advanced Audit Logs Component
 * More detailed activity tracking and audit logging
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Tooltip,
  alpha,
  useTheme,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Filter as FilterIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Timeline as TimelineIcon,
  Lock as LockIcon,
  Key as KeyIcon,
  Cloud as CloudIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId: string;
  details: any;
  ipAddress: string;
  userAgent: string;
  sessionId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'authentication' | 'authorization' | 'data_access' | 'data_modification' | 'system' | 'security';
  outcome: 'success' | 'failure' | 'warning';
  riskScore: number;
  location?: {
    country: string;
    city: string;
    coordinates: { lat: number; lng: number };
  };
  device?: {
    type: string;
    os: string;
    browser: string;
  };
}

interface AdvancedAuditLogsProps {
  onLogExport?: (format: 'csv' | 'json' | 'pdf') => void;
  onLogFilter?: (filters: any) => void;
  className?: string;
}

export function AdvancedAuditLogs({
  onLogExport,
  onLogFilter,
  className,
}: AdvancedAuditLogsProps) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    severity: 'all',
    outcome: 'all',
    dateRange: '7d',
  });
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const theme = useTheme();

  // Mock data for demonstration
  const mockLogs: AuditLog[] = [
    {
      id: '1',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      userId: 'user1',
      userName: 'John Doe',
      userEmail: 'john@example.com',
      action: 'LOGIN',
      resource: 'Authentication',
      resourceId: 'auth',
      details: { method: 'SSO', provider: 'Azure AD' },
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      sessionId: 'sess_123456',
      severity: 'medium',
      category: 'authentication',
      outcome: 'success',
      riskScore: 25,
      location: {
        country: 'United States',
        city: 'San Francisco',
        coordinates: { lat: 37.7749, lng: -122.4194 },
      },
      device: {
        type: 'Desktop',
        os: 'Windows 10',
        browser: 'Chrome 91.0',
      },
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      userId: 'user2',
      userName: 'Jane Smith',
      userEmail: 'jane@example.com',
      action: 'CREATE_POST',
      resource: 'Content',
      resourceId: 'post_789',
      details: { platform: 'Instagram', type: 'image' },
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      sessionId: 'sess_123457',
      severity: 'low',
      category: 'data_modification',
      outcome: 'success',
      riskScore: 10,
      location: {
        country: 'United States',
        city: 'New York',
        coordinates: { lat: 40.7128, lng: -74.0060 },
      },
      device: {
        type: 'Desktop',
        os: 'macOS 11.0',
        browser: 'Safari 14.1',
      },
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      userId: 'user3',
      userName: 'Mike Johnson',
      userEmail: 'mike@example.com',
      action: 'FAILED_LOGIN',
      resource: 'Authentication',
      resourceId: 'auth',
      details: { method: 'password', attempts: 3 },
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15',
      sessionId: 'sess_123458',
      severity: 'high',
      category: 'authentication',
      outcome: 'failure',
      riskScore: 85,
      location: {
        country: 'United States',
        city: 'Los Angeles',
        coordinates: { lat: 34.0522, lng: -118.2437 },
      },
      device: {
        type: 'Mobile',
        os: 'iOS 14.6',
        browser: 'Safari Mobile',
      },
    },
  ];

  useEffect(() => {
    setLogs(mockLogs);
    setFilteredLogs(mockLogs);
  }, []);

  useEffect(() => {
    let filtered = logs;

    if (filters.search) {
      filtered = filtered.filter(log =>
        log.action.toLowerCase().includes(filters.search.toLowerCase()) ||
        log.userName.toLowerCase().includes(filters.search.toLowerCase()) ||
        log.resource.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(log => log.category === filters.category);
    }

    if (filters.severity !== 'all') {
      filtered = filtered.filter(log => log.severity === filters.severity);
    }

    if (filters.outcome !== 'all') {
      filtered = filtered.filter(log => log.outcome === filters.outcome);
    }

    setFilteredLogs(filtered);
  }, [logs, filters]);

  const handleLogClick = useCallback((log: AuditLog) => {
    setSelectedLog(log);
    setIsDetailDialogOpen(true);
  }, []);

  const handleExport = useCallback((format: 'csv' | 'json' | 'pdf') => {
    onLogExport?.(format);
  }, [onLogExport]);

  const getSeverityIcon = (severity: AuditLog['severity']) => {
    switch (severity) {
      case 'low': return <InfoIcon color="info" />;
      case 'medium': return <WarningIcon color="warning" />;
      case 'high': return <ErrorIcon color="error" />;
      case 'critical': return <ErrorIcon color="error" />;
      default: return <InfoIcon />;
    }
  };

  const getSeverityColor = (severity: AuditLog['severity']) => {
    switch (severity) {
      case 'low': return 'info';
      case 'medium': return 'warning';
      case 'high': return 'error';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  const getOutcomeIcon = (outcome: AuditLog['outcome']) => {
    switch (outcome) {
      case 'success': return <CheckCircleIcon color="success" />;
      case 'failure': return <ErrorIcon color="error" />;
      case 'warning': return <WarningIcon color="warning" />;
      default: return <InfoIcon />;
    }
  };

  const getCategoryIcon = (category: AuditLog['category']) => {
    switch (category) {
      case 'authentication': return <KeyIcon />;
      case 'authorization': return <LockIcon />;
      case 'data_access': return <VisibilityIcon />;
      case 'data_modification': return <EditIcon />;
      case 'system': return <CloudIcon />;
      case 'security': return <SecurityIcon />;
      default: return <InfoIcon />;
    }
  };

  return (
    <Box className={className}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Advanced Audit Logs
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive activity tracking and security monitoring
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            startIcon={<DownloadIcon />}
            onClick={() => handleExport('csv')}
            variant="outlined"
          >
            Export CSV
          </Button>
          <Button
            startIcon={<DownloadIcon />}
            onClick={() => handleExport('json')}
            variant="outlined"
          >
            Export JSON
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search logs..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  <MenuItem value="authentication">Authentication</MenuItem>
                  <MenuItem value="authorization">Authorization</MenuItem>
                  <MenuItem value="data_access">Data Access</MenuItem>
                  <MenuItem value="data_modification">Data Modification</MenuItem>
                  <MenuItem value="system">System</MenuItem>
                  <MenuItem value="security">Security</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Severity</InputLabel>
                <Select
                  value={filters.severity}
                  onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
                >
                  <MenuItem value="all">All Severities</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Outcome</InputLabel>
                <Select
                  value={filters.outcome}
                  onChange={(e) => setFilters(prev => ({ ...prev, outcome: e.target.value }))}
                >
                  <MenuItem value="all">All Outcomes</MenuItem>
                  <MenuItem value="success">Success</MenuItem>
                  <MenuItem value="failure">Failure</MenuItem>
                  <MenuItem value="warning">Warning</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Date Range</InputLabel>
                <Select
                  value={filters.dateRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                >
                  <MenuItem value="1d">Last 24 hours</MenuItem>
                  <MenuItem value="7d">Last 7 days</MenuItem>
                  <MenuItem value="30d">Last 30 days</MenuItem>
                  <MenuItem value="90d">Last 90 days</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Resource</TableCell>
                <TableCell>Severity</TableCell>
                <TableCell>Outcome</TableCell>
                <TableCell>Risk Score</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLogs.map((log) => (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => handleLogClick(log)}
                  style={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    <Typography variant="body2">
                      {log.timestamp.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {log.userName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {log.userEmail}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getCategoryIcon(log.category)}
                      <Typography variant="body2">
                        {log.action}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {log.resource}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={log.severity}
                      color={getSeverityColor(log.severity) as any}
                      size="small"
                      icon={getSeverityIcon(log.severity)}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getOutcomeIcon(log.outcome)}
                      <Typography variant="body2">
                        {log.outcome}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {log.riskScore}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Detail Dialog */}
      <Dialog
        open={isDetailDialogOpen}
        onClose={() => setIsDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Audit Log Details</DialogTitle>
        <DialogContent>
          {selectedLog && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Basic Information
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Action"
                        secondary={selectedLog.action}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="User"
                        secondary={`${selectedLog.userName} (${selectedLog.userEmail})`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Resource"
                        secondary={selectedLog.resource}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Timestamp"
                        secondary={selectedLog.timestamp.toLocaleString()}
                      />
                    </ListItem>
                  </List>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Security Information
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="IP Address"
                        secondary={selectedLog.ipAddress}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Session ID"
                        secondary={selectedLog.sessionId}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Risk Score"
                        secondary={selectedLog.riskScore}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Severity"
                        secondary={selectedLog.severity}
                      />
                    </ListItem>
                  </List>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Additional Details
                  </Typography>
                  <pre style={{ 
                    backgroundColor: theme.palette.grey[100], 
                    padding: theme.spacing(2), 
                    borderRadius: theme.shape.borderRadius,
                    overflow: 'auto',
                    fontSize: '0.875rem'
                  }}>
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDetailDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdvancedAuditLogs;
