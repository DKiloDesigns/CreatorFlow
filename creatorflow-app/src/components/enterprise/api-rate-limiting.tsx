/**
 * API Rate Limiting Component
 * Advanced API management and rate limiting
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
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
  Switch,
  FormControlLabel,
  Divider,
  Tooltip,
  alpha,
  useTheme,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Speed as SpeedIcon,
  Settings as SettingsIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Timeline as TimelineIcon,
  Security as SecurityIcon,
  Cloud as CloudIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface RateLimit {
  id: string;
  name: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  limit: number;
  window: number; // in seconds
  burst: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface APIUsage {
  endpoint: string;
  method: string;
  requests: number;
  limit: number;
  remaining: number;
  resetTime: Date;
  status: 'normal' | 'warning' | 'critical';
}

interface APIRateLimitingProps {
  onRateLimitCreate?: (rateLimit: RateLimit) => void;
  onRateLimitUpdate?: (rateLimit: RateLimit) => void;
  onRateLimitDelete?: (rateLimitId: string) => void;
  className?: string;
}

export function APIRateLimiting({
  onRateLimitCreate,
  onRateLimitUpdate,
  onRateLimitDelete,
  className,
}: APIRateLimitingProps) {
  const [rateLimits, setRateLimits] = useState<RateLimit[]>([]);
  const [apiUsage, setApiUsage] = useState<APIUsage[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRateLimit, setEditingRateLimit] = useState<RateLimit | null>(null);
  const [newRateLimit, setNewRateLimit] = useState<Partial<RateLimit>>({
    name: '',
    endpoint: '',
    method: 'GET',
    limit: 100,
    window: 3600,
    burst: 10,
    isActive: true,
  });
  const theme = useTheme();

  // Mock data for demonstration
  const mockRateLimits: RateLimit[] = [
    {
      id: '1',
      name: 'General API',
      endpoint: '/api/*',
      method: 'GET',
      limit: 1000,
      window: 3600,
      burst: 50,
      isActive: true,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: '2',
      name: 'Content Creation',
      endpoint: '/api/content',
      method: 'POST',
      limit: 100,
      window: 3600,
      burst: 5,
      isActive: true,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: '3',
      name: 'Analytics API',
      endpoint: '/api/analytics',
      method: 'GET',
      limit: 500,
      window: 3600,
      burst: 25,
      isActive: false,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  ];

  const mockApiUsage: APIUsage[] = [
    {
      endpoint: '/api/content',
      method: 'POST',
      requests: 85,
      limit: 100,
      remaining: 15,
      resetTime: new Date(Date.now() + 30 * 60 * 1000),
      status: 'warning',
    },
    {
      endpoint: '/api/analytics',
      method: 'GET',
      requests: 450,
      limit: 500,
      remaining: 50,
      resetTime: new Date(Date.now() + 45 * 60 * 1000),
      status: 'normal',
    },
    {
      endpoint: '/api/users',
      method: 'GET',
      requests: 95,
      limit: 100,
      remaining: 5,
      resetTime: new Date(Date.now() + 15 * 60 * 1000),
      status: 'critical',
    },
  ];

  useEffect(() => {
    setRateLimits(mockRateLimits);
    setApiUsage(mockApiUsage);
  }, []);

  const handleCreateRateLimit = useCallback(() => {
    if (!newRateLimit.name?.trim() || !newRateLimit.endpoint?.trim()) return;

    const rateLimit: RateLimit = {
      id: `rate_limit_${Date.now()}`,
      name: newRateLimit.name!,
      endpoint: newRateLimit.endpoint!,
      method: newRateLimit.method || 'GET',
      limit: newRateLimit.limit || 100,
      window: newRateLimit.window || 3600,
      burst: newRateLimit.burst || 10,
      isActive: newRateLimit.isActive || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setRateLimits(prev => [...prev, rateLimit]);
    onRateLimitCreate?.(rateLimit);
    setIsCreateDialogOpen(false);
    setNewRateLimit({
      name: '',
      endpoint: '',
      method: 'GET',
      limit: 100,
      window: 3600,
      burst: 10,
      isActive: true,
    });
  }, [newRateLimit, onRateLimitCreate]);

  const handleUpdateRateLimit = useCallback((rateLimit: RateLimit) => {
    setRateLimits(prev => prev.map(r => r.id === rateLimit.id ? rateLimit : r));
    onRateLimitUpdate?.(rateLimit);
    setIsEditDialogOpen(false);
    setEditingRateLimit(null);
  }, [onRateLimitUpdate]);

  const handleDeleteRateLimit = useCallback((rateLimitId: string) => {
    setRateLimits(prev => prev.filter(r => r.id !== rateLimitId));
    onRateLimitDelete?.(rateLimitId);
  }, [onRateLimitDelete]);

  const handleToggleRateLimit = useCallback((rateLimitId: string) => {
    setRateLimits(prev => prev.map(r => 
      r.id === rateLimitId ? { ...r, isActive: !r.isActive } : r
    ));
  }, []);

  const getStatusIcon = (status: APIUsage['status']) => {
    switch (status) {
      case 'normal': return <CheckCircleIcon color="success" />;
      case 'warning': return <WarningIcon color="warning" />;
      case 'critical': return <ErrorIcon color="error" />;
      default: return <InfoIcon />;
    }
  };

  const getStatusColor = (status: APIUsage['status']) => {
    switch (status) {
      case 'normal': return 'success';
      case 'warning': return 'warning';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  const getUsagePercentage = (requests: number, limit: number) => {
    return Math.min((requests / limit) * 100, 100);
  };

  const RateLimitCard = ({ rateLimit }: { rateLimit: RateLimit }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography variant="h6">
                {rateLimit.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {rateLimit.method} {rateLimit.endpoint}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={rateLimit.isActive ? 'Active' : 'Inactive'}
                color={rateLimit.isActive ? 'success' : 'default'}
                size="small"
              />
              <Switch
                checked={rateLimit.isActive}
                onChange={() => handleToggleRateLimit(rateLimit.id)}
              />
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="subtitle2">Limit:</Typography>
                <Typography variant="body2">{rateLimit.limit} requests</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="subtitle2">Window:</Typography>
                <Typography variant="body2">{rateLimit.window}s</Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="subtitle2">Burst:</Typography>
                <Typography variant="body2">{rateLimit.burst} requests</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="subtitle2">Rate:</Typography>
                <Typography variant="body2">
                  {Math.round(rateLimit.limit / (rateLimit.window / 60))} req/min
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <IconButton
                  size="small"
                  onClick={() => {
                    setEditingRateLimit(rateLimit);
                    setIsEditDialogOpen(true);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteRateLimit(rateLimit.id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <Box className={className}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            API Rate Limiting
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage API rate limits and monitor usage
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsCreateDialogOpen(true)}
        >
          Add Rate Limit
        </Button>
      </Box>

      {/* Current Usage */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Current API Usage
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Endpoint</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell>Usage</TableCell>
                  <TableCell>Remaining</TableCell>
                  <TableCell>Reset Time</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {apiUsage.map((usage, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace">
                        {usage.endpoint}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={usage.method}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">
                          {usage.requests}/{usage.limit}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={getUsagePercentage(usage.requests, usage.limit)}
                          sx={{ width: 100, height: 8 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {usage.remaining}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {usage.resetTime.toLocaleTimeString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getStatusIcon(usage.status)}
                        <Typography variant="body2">
                          {usage.status}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Rate Limits */}
      <Box>
        {rateLimits.map((rateLimit) => (
          <RateLimitCard key={rateLimit.id} rateLimit={rateLimit} />
        ))}
      </Box>

      {/* Create Dialog */}
      <Dialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Rate Limit</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={newRateLimit.name || ''}
            onChange={(e) => setNewRateLimit(prev => ({ ...prev, name: e.target.value }))}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Endpoint"
            value={newRateLimit.endpoint || ''}
            onChange={(e) => setNewRateLimit(prev => ({ ...prev, endpoint: e.target.value }))}
            margin="normal"
            placeholder="/api/*"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Method</InputLabel>
            <Select
              value={newRateLimit.method || 'GET'}
              onChange={(e) => setNewRateLimit(prev => ({ ...prev, method: e.target.value as any }))}
            >
              <MenuItem value="GET">GET</MenuItem>
              <MenuItem value="POST">POST</MenuItem>
              <MenuItem value="PUT">PUT</MenuItem>
              <MenuItem value="DELETE">DELETE</MenuItem>
              <MenuItem value="PATCH">PATCH</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Limit"
            type="number"
            value={newRateLimit.limit || 100}
            onChange={(e) => setNewRateLimit(prev => ({ ...prev, limit: parseInt(e.target.value) }))}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Window (seconds)"
            type="number"
            value={newRateLimit.window || 3600}
            onChange={(e) => setNewRateLimit(prev => ({ ...prev, window: parseInt(e.target.value) }))}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Burst"
            type="number"
            value={newRateLimit.burst || 10}
            onChange={(e) => setNewRateLimit(prev => ({ ...prev, burst: parseInt(e.target.value) }))}
            margin="normal"
          />
          <FormControlLabel
            control={
              <Switch
                checked={newRateLimit.isActive || false}
                onChange={(e) => setNewRateLimit(prev => ({ ...prev, isActive: e.target.checked }))}
              />
            }
            label="Active"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCreateDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateRateLimit}
            variant="contained"
            disabled={!newRateLimit.name?.trim() || !newRateLimit.endpoint?.trim()}
          >
            Add Rate Limit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Rate Limit</DialogTitle>
        <DialogContent>
          {editingRateLimit && (
            <Box>
              <TextField
                fullWidth
                label="Name"
                value={editingRateLimit.name}
                onChange={(e) => setEditingRateLimit(prev => prev ? { ...prev, name: e.target.value } : null)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Endpoint"
                value={editingRateLimit.endpoint}
                onChange={(e) => setEditingRateLimit(prev => prev ? { ...prev, endpoint: e.target.value } : null)}
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Method</InputLabel>
                <Select
                  value={editingRateLimit.method}
                  onChange={(e) => setEditingRateLimit(prev => prev ? { ...prev, method: e.target.value as any } : null)}
                >
                  <MenuItem value="GET">GET</MenuItem>
                  <MenuItem value="POST">POST</MenuItem>
                  <MenuItem value="PUT">PUT</MenuItem>
                  <MenuItem value="DELETE">DELETE</MenuItem>
                  <MenuItem value="PATCH">PATCH</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Limit"
                type="number"
                value={editingRateLimit.limit}
                onChange={(e) => setEditingRateLimit(prev => prev ? { ...prev, limit: parseInt(e.target.value) } : null)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Window (seconds)"
                type="number"
                value={editingRateLimit.window}
                onChange={(e) => setEditingRateLimit(prev => prev ? { ...prev, window: parseInt(e.target.value) } : null)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Burst"
                type="number"
                value={editingRateLimit.burst}
                onChange={(e) => setEditingRateLimit(prev => prev ? { ...prev, burst: parseInt(e.target.value) } : null)}
                margin="normal"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={editingRateLimit.isActive}
                    onChange={(e) => setEditingRateLimit(prev => prev ? { ...prev, isActive: e.target.checked } : null)}
                  />
                }
                label="Active"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => editingRateLimit && handleUpdateRateLimit(editingRateLimit)}
            variant="contained"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default APIRateLimiting;
