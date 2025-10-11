'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Security as ShieldIcon,
  Key as KeyIcon,
  Visibility as EyeIcon,
  VisibilityOff as EyeOffIcon,
  Add as PlusIcon,
  Delete as Trash2Icon,
  Refresh as RefreshCwIcon,
  Warning as AlertTriangleIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as ClockIcon,
  TrendingUp as ActivityIcon,
} from '@mui/icons-material';

interface APIKey {
  id: string;
  name: string;
  permissions: string[];
  rateLimit: {
    requests: number;
    windowMs: number;
  };
  expiresAt?: string;
  lastUsedAt?: string;
  createdAt: string;
  isActive: boolean;
}

interface SecurityStats {
  totalKeys: number;
  activeKeys: number;
  expiredKeys: number;
  recentActivity: number;
}

export const SecurityDashboard: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [stats, setStats] = useState<SecurityStats>({
    totalKeys: 0,
    activeKeys: 0,
    expiredKeys: 0,
    recentActivity: 0,
  });
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newKey, setNewKey] = useState({
    name: '',
    permissions: [] as string[],
    rateLimit: { requests: 1000, windowMs: 3600000 },
    expiresAt: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const availablePermissions = [
    'read',
    'write',
    'admin',
    'upload',
    'download',
    'delete',
    'user_management',
    'system_settings',
  ];

  useEffect(() => {
    loadAPIKeys();
  }, []);

  const loadAPIKeys = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/security/api-keys');
      if (response.ok) {
        const data = await response.json();
        setApiKeys(data.keys);
        calculateStats(data.keys);
      } else {
        throw new Error('Failed to load API keys');
      }
    } catch (error) {
      console.error('Error loading API keys:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load API keys',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (keys: APIKey[]) => {
    const now = new Date();
    const activeKeys = keys.filter(key => key.isActive);
    const expiredKeys = keys.filter(key => key.expiresAt && new Date(key.expiresAt) < now);
    
    setStats({
      totalKeys: keys.length,
      activeKeys: activeKeys.length,
      expiredKeys: expiredKeys.length,
      recentActivity: keys.filter(key => {
        if (!key.lastUsedAt) return false;
        const lastUsed = new Date(key.lastUsedAt);
        const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        return lastUsed > dayAgo;
      }).length,
    });
  };

  const handleCreateKey = async () => {
    try {
      const response = await fetch('/api/security/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newKey,
          expiresAt: newKey.expiresAt ? new Date(newKey.expiresAt).toISOString() : undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSnackbar({
          open: true,
          message: `API key created: ${data.key}`,
          severity: 'success',
        });
        setCreateDialogOpen(false);
        setNewKey({
          name: '',
          permissions: [],
          rateLimit: { requests: 1000, windowMs: 3600000 },
          expiresAt: '',
        });
        loadAPIKeys();
      } else {
        throw new Error('Failed to create API key');
      }
    } catch (error) {
      console.error('Error creating API key:', error);
      setSnackbar({
        open: true,
        message: 'Failed to create API key',
        severity: 'error',
      });
    }
  };

  const handleRevokeKey = async (keyId: string) => {
    try {
      const response = await fetch(`/api/security/api-keys/${keyId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'API key revoked successfully',
          severity: 'success',
        });
        loadAPIKeys();
      } else {
        throw new Error('Failed to revoke API key');
      }
    } catch (error) {
      console.error('Error revoking API key:', error);
      setSnackbar({
        open: true,
        message: 'Failed to revoke API key',
        severity: 'error',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatRateLimit = (rateLimit: { requests: number; windowMs: number }) => {
    const hours = rateLimit.windowMs / (1000 * 60 * 60);
    return `${rateLimit.requests} requests per ${hours} hour${hours !== 1 ? 's' : ''}`;
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading security dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Security Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<PlusIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Create API Key
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <KeyIcon sx={{ fontSize: 24, color: "#1976d2" }} />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Total Keys
                </Typography>
              </Box>
              <Typography variant="h4">{stats.totalKeys}</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckCircleIcon sx={{ fontSize: 24, color: "#4caf50" }} />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Active Keys
                </Typography>
              </Box>
              <Typography variant="h4">{stats.activeKeys}</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AlertTriangleIcon sx={{ fontSize: 24, color: "#f44336" }} />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Expired Keys
                </Typography>
              </Box>
              <Typography variant="h4">{stats.expiredKeys}</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ActivityIcon sx={{ fontSize: 24, color: "#ff9800" }} />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Recent Activity
                </Typography>
              </Box>
              <Typography variant="h4">{stats.recentActivity}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* API Keys Table */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">API Keys</Typography>
            <IconButton onClick={loadAPIKeys}>
              <RefreshCwIcon />
            </IconButton>
          </Box>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Permissions</TableCell>
                  <TableCell>Rate Limit</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Last Used</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {apiKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {key.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {key.permissions.map((permission) => (
                          <Chip
                            key={permission}
                            label={permission}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatRateLimit(key.rateLimit)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={key.isActive ? 'Active' : 'Inactive'}
                        color={key.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(key.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {key.lastUsedAt ? formatDate(key.lastUsedAt) : 'Never'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Revoke Key">
                        <IconButton
                          size="small"
                          onClick={() => handleRevokeKey(key.id)}
                          color="error"
                        >
                          <Trash2Icon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Create API Key Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New API Key</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Key Name"
              value={newKey.name}
              onChange={(e) => setNewKey({ ...newKey, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Permissions</InputLabel>
              <Select
                multiple
                value={newKey.permissions}
                onChange={(e) => setNewKey({ ...newKey, permissions: e.target.value as string[] })}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as string[]).map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {availablePermissions.map((permission) => (
                  <MenuItem key={permission} value={permission}>
                    {permission}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Rate Limit (requests)"
                  type="number"
                  value={newKey.rateLimit.requests}
                  onChange={(e) => setNewKey({
                    ...newKey,
                    rateLimit: { ...newKey.rateLimit, requests: parseInt(e.target.value) || 1000 }
                  })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Window (hours)"
                  type="number"
                  value={newKey.rateLimit.windowMs / (1000 * 60 * 60)}
                  onChange={(e) => setNewKey({
                    ...newKey,
                    rateLimit: { 
                      ...newKey.rateLimit, 
                      windowMs: (parseInt(e.target.value) || 1) * 1000 * 60 * 60 
                    }
                  })}
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Expires At (optional)"
              type="datetime-local"
              value={newKey.expiresAt}
              onChange={(e) => setNewKey({ ...newKey, expiresAt: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateKey} variant="contained">
            Create Key
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
