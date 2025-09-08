'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  CircularProgress,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Avatar,
  Divider,
  Grid
} from '@mui/material';
import {
  PersonAdd,
  PersonRemove,
  Refresh,
  Search,
  FilterList,
  AdminPanelSettings,
  Person,
  CalendarToday,
  Login
} from '@mui/icons-material';

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  lastLogin?: string;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [action, setAction] = useState<'promote' | 'demote' | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'USER' | 'ADMIN'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'role' | 'createdAt'>('name');
  const [userDetailModal, setUserDetailModal] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserAction = async (user: User, action: 'promote' | 'demote') => {
    setSelectedUser(user);
    setAction(action);
    setConfirmDialog(true);
  };

  const confirmAction = async () => {
    if (!selectedUser || !action) return;

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          userId: selectedUser.id
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === selectedUser.id 
              ? { ...user, role: data.newRole }
              : user
          )
        );
        setSnackbar({
          open: true,
          message: `User ${action === 'promote' ? 'promoted to admin' : 'demoted to user'} successfully`,
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to update user role',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setSnackbar({
        open: true,
        message: 'Error updating user role',
        severity: 'error'
      });
    } finally {
      setConfirmDialog(false);
      setSelectedUser(null);
      setAction(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter and sort users
  const filteredAndSortedUsers = users
    .filter(user => {
      const matchesSearch = searchTerm === '' || 
        (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
         user.email?.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'email':
          return (a.email || '').localeCompare(b.email || '');
        case 'role':
          return a.role.localeCompare(b.role);
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

  const handleUserCardClick = (user: User) => {
    setSelectedUser(user);
    setUserDetailModal(true);
  };

  const handleCloseUserDetail = () => {
    setUserDetailModal(false);
    setSelectedUser(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      px: { xs: 1, sm: 0 }, // Add horizontal padding on mobile
      pb: { xs: 20, sm: 8 }, // 80px on mobile, 32px on desktop for consistent bottom spacing
      maxWidth: '100%',
      overflow: 'hidden' // Prevent horizontal overflow
    }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, color: 'text.primary' }}>
          User Management
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchUsers}
          size="small"
        >
          Refresh
        </Button>
      </Box>

      {/* Search and Filter Section */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack spacing={2}>
          {/* Search Bar */}
          <TextField
            fullWidth
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            size="small"
          />
          
          {/* Filters and Sort */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Role Filter Chips */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={`All (${users.length})`}
                onClick={() => setRoleFilter('all')}
                color={roleFilter === 'all' ? 'primary' : 'default'}
                size="small"
              />
              <Chip
                label={`Admins (${users.filter(u => u.role === 'ADMIN').length})`}
                onClick={() => setRoleFilter('ADMIN')}
                color={roleFilter === 'ADMIN' ? 'primary' : 'default'}
                size="small"
              />
              <Chip
                label={`Users (${users.filter(u => u.role === 'USER').length})`}
                onClick={() => setRoleFilter('USER')}
                color={roleFilter === 'USER' ? 'primary' : 'default'}
                size="small"
              />
            </Box>
            
            {/* Sort Dropdown */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortBy}
                label="Sort by"
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="role">Role</MenuItem>
                <MenuItem value="createdAt">Created Date</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Stack>
      </Paper>

      {/* User Cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: { xs: 8, sm: 0 } }}>
        {filteredAndSortedUsers.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              {searchTerm || roleFilter !== 'all' ? 'No users found matching your criteria' : 'No users found'}
            </Typography>
          </Paper>
        ) : (
          filteredAndSortedUsers.map((user) => (
            <Card 
              key={user.id} 
              sx={{ 
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3,
                }
              }}
              onClick={() => handleUserCardClick(user)}
            >
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {/* User Info */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0 }}>
                    <Avatar sx={{ bgcolor: user.role === 'ADMIN' ? 'primary.main' : 'grey.500' }}>
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 600, 
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                        mb: 0.5,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: 'text.primary'
                      }}>
                        {user.name || 'Unnamed User'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {user.email || 'No email'}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {/* Role and Actions */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={user.role}
                      color={user.role === 'ADMIN' ? 'primary' : 'default'}
                      size="small"
                      icon={user.role === 'ADMIN' ? <AdminPanelSettings /> : <Person />}
                    />
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUserAction(user, user.role === 'ADMIN' ? 'demote' : 'promote');
                      }}
                      color={user.role === 'ADMIN' ? 'warning' : 'primary'}
                    >
                      {user.role === 'ADMIN' ? <PersonRemove /> : <PersonAdd />}
                    </IconButton>
                  </Box>
                </Box>
                
                {/* Additional Info */}
                <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CalendarToday sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      Created: {formatDate(user.createdAt)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Login sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      Last login: {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Box>

      {/* User Detail Modal */}
      <Dialog 
        open={userDetailModal} 
        onClose={handleCloseUserDetail}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            m: { xs: 1, sm: 2 },
            maxHeight: { xs: '90vh', sm: '80vh' }
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: selectedUser?.role === 'ADMIN' ? 'primary.main' : 'grey.500' }}>
              {selectedUser?.name ? selectedUser.name.charAt(0).toUpperCase() : 'U'}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ color: 'text.primary' }}>
                {selectedUser?.name || 'Unnamed User'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedUser?.email || 'No email'}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3}>
            {/* User Details */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Role
                </Typography>
                <Chip
                  label={selectedUser?.role}
                  color={selectedUser?.role === 'ADMIN' ? 'primary' : 'default'}
                  icon={selectedUser?.role === 'ADMIN' ? <AdminPanelSettings /> : <Person />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  User ID
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                  {selectedUser?.id}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Created
                </Typography>
                <Typography variant="body2">
                  {selectedUser ? formatDate(selectedUser.createdAt) : ''}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Last Login
                </Typography>
                <Typography variant="body2">
                  {selectedUser?.lastLogin ? formatDate(selectedUser.lastLogin) : 'Never'}
                </Typography>
              </Grid>
            </Grid>

            <Divider />

            {/* Actions */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Actions
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  startIcon={selectedUser?.role === 'ADMIN' ? <PersonRemove /> : <PersonAdd />}
                  onClick={() => {
                    if (selectedUser) {
                      handleUserAction(selectedUser, selectedUser.role === 'ADMIN' ? 'demote' : 'promote');
                      handleCloseUserDetail();
                    }
                  }}
                  color={selectedUser?.role === 'ADMIN' ? 'warning' : 'primary'}
                  size="small"
                >
                  {selectedUser?.role === 'ADMIN' ? 'Demote to User' : 'Promote to Admin'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={() => {
                    fetchUsers();
                    handleCloseUserDetail();
                  }}
                  size="small"
                >
                  Refresh Data
                </Button>
              </Box>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUserDetail}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>
          {action === 'promote' ? 'Promote to Admin' : 'Demote to User'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {action === 'promote' ? 'promote' : 'demote'} {selectedUser?.name || selectedUser?.email} to {action === 'promote' ? 'admin' : 'user'}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>Cancel</Button>
          <Button onClick={confirmAction} color="primary" variant="contained">
            Confirm
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
}