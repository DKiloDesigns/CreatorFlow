'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Pagination,
  Tooltip,
} from '@mui/material';
import {
  Search,
  Filter,
  RefreshCw,
  Eye,
  Calendar,
  User,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
} from 'lucide-react';

interface AuditEvent {
  id: string;
  timestamp: string;
  userId?: string;
  sessionId?: string;
  ip: string;
  userAgent: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
  outcome: 'success' | 'failure' | 'error';
  tags: string[];
}

interface AuditStats {
  total: number;
  bySeverity: Record<string, number>;
  byOutcome: Record<string, number>;
  byAction: Record<string, number>;
}

export const AuditLogViewer: React.FC = () => {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [stats, setStats] = useState<AuditStats>({
    total: 0,
    bySeverity: {},
    byOutcome: {},
    byAction: {},
  });
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);
  const [filters, setFilters] = useState({
    action: '',
    severity: '',
    outcome: '',
    userId: '',
    startDate: '',
    endDate: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
  });

  useEffect(() => {
    loadEvents();
    loadStats();
  }, [filters, pagination.page]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v)),
      });

      const response = await fetch(`/api/security/audit-logs?${queryParams}`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events);
        setPagination(prev => ({ ...prev, total: data.total }));
      } else {
        throw new Error('Failed to load audit events');
      }
    } catch (error) {
      console.error('Error loading audit events:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('/api/security/audit-logs/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading audit stats:', error);
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setPagination(prev => ({ ...prev, page }));
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

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'success': return <CheckCircle size={16} color="#4caf50" />;
      case 'failure': return <XCircle size={16} color="#f44336" />;
      case 'error': return <AlertTriangle size={16} color="#ff9800" />;
      default: return <Clock size={16} color="#9e9e9e" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  if (loading && events.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading audit logs...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Audit Logs
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshCw />}
          onClick={loadEvents}
        >
          Refresh
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Shield size={24} color="#1976d2" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Total Events
                </Typography>
              </Box>
              <Typography variant="h4">{stats.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AlertTriangle size={24} color="#f44336" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Critical Events
                </Typography>
              </Box>
              <Typography variant="h4">{stats.bySeverity.critical || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <XCircle size={24} color="#f44336" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Failures
                </Typography>
              </Box>
              <Typography variant="h4">{stats.byOutcome.failure || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckCircle size={24} color="#4caf50" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Successes
                </Typography>
              </Box>
              <Typography variant="h4">{stats.byOutcome.success || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Filters
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label="Action"
                value={filters.action}
                onChange={(e) => handleFilterChange('action', e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Severity</InputLabel>
                <Select
                  value={filters.severity}
                  onChange={(e) => handleFilterChange('severity', e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Outcome</InputLabel>
                <Select
                  value={filters.outcome}
                  onChange={(e) => handleFilterChange('outcome', e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="success">Success</MenuItem>
                  <MenuItem value="failure">Failure</MenuItem>
                  <MenuItem value="error">Error</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label="User ID"
                value={filters.userId}
                onChange={(e) => handleFilterChange('userId', e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label="Start Date"
                type="datetime-local"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                size="small"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label="End Date"
                type="datetime-local"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                size="small"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card>
        <CardContent>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Severity</TableCell>
                  <TableCell>Outcome</TableCell>
                  <TableCell>IP</TableCell>
                  <TableCell>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id} hover>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(event.timestamp)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {event.action}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {event.resource}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {event.userId ? truncateText(event.userId, 20) : 'System'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={event.severity}
                        color={getSeverityColor(event.severity) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getOutcomeIcon(event.outcome)}
                        <Typography variant="body2">
                          {event.outcome}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace">
                        {event.ip}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => setSelectedEvent(event)}
                        >
                          <Eye size={16} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Pagination
              count={Math.ceil(pagination.total / pagination.limit)}
              page={pagination.page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Event Details Dialog */}
      <Dialog
        open={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedEvent && (
          <>
            <DialogTitle>
              Event Details
              <Typography variant="subtitle2" color="text.secondary">
                {selectedEvent.action} - {formatDate(selectedEvent.timestamp)}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Basic Information
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body2">
                      <strong>ID:</strong> {selectedEvent.id}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Action:</strong> {selectedEvent.action}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Resource:</strong> {selectedEvent.resource}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Resource ID:</strong> {selectedEvent.resourceId || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Severity:</strong> {selectedEvent.severity}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Outcome:</strong> {selectedEvent.outcome}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Context
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body2">
                      <strong>User ID:</strong> {selectedEvent.userId || 'System'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Session ID:</strong> {selectedEvent.sessionId || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>IP Address:</strong> {selectedEvent.ip}
                    </Typography>
                    <Typography variant="body2">
                      <strong>User Agent:</strong> {truncateText(selectedEvent.userAgent, 100)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Tags
                  </Typography>
                  <Box sx={{ pl: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selectedEvent.tags.map((tag) => (
                      <Chip key={tag} label={tag} size="small" />
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Accordion>
                    <AccordionSummary expandIcon={<ChevronDown />}>
                      <Typography variant="subtitle2">Details</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <pre style={{ 
                        backgroundColor: '#f5f5f5', 
                        padding: '16px', 
                        borderRadius: '4px',
                        overflow: 'auto',
                        fontSize: '12px',
                        fontFamily: 'monospace'
                      }}>
                        {JSON.stringify(selectedEvent.details, null, 2)}
                      </pre>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedEvent(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};
