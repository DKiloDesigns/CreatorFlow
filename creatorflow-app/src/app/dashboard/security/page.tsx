'use client';

import React, { useState } from 'react';
import { useUserSecurity } from '@/hooks/useUserSecurity';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  TextField,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Container,
  Divider,
  Alert,
  AlertTitle,
  Chip,
  CircularProgress
} from '@mui/material';
import { 
  Shield, 
  Lock, 
  Smartphone, 
  Monitor, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Session {
  id: string;
  device: string;
  current: boolean;
}

const defaultSessions: Session[] = [
  { id: '1', device: 'MacBook Pro (This device)', current: true },
  { id: '2', device: 'iPhone 15', current: false },
];

export default function SecurityPage() {
  const { loading, error, success, changePassword, toggle2FA, deleteAccount, setSuccess, setError } = useUserSecurity();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [twoFA, setTwoFA] = useState(false);
  const [sessions, setSessions] = useState<Session[]>(defaultSessions);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    await changePassword(password);
    setPassword('');
    setConfirm('');
  };

  const handle2FA = async () => {
    await toggle2FA(!twoFA);
    setTwoFA((prev) => !prev);
  };

  const handleDelete = async () => {
    await deleteAccount();
  };

  // Session revoke is still simulated
  const handleRevoke = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Header */}
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
            Security
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Manage your account security and privacy settings
          </Typography>
        </Box>

        {/* Password Change */}
        <Card>
          <CardHeader
            title="Change Password"
            titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
            avatar={<Lock style={{ width: 24, height: 24, color: '#3b82f6' }} />}
          />
          <CardContent>
            <Box component="form" onSubmit={handlePasswordChange} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="New Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                placeholder="Enter new password"
              />
              <TextField
                label="Confirm Password"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                fullWidth
                required
                placeholder="Confirm new password"
              />
              
              {error && (
                <Alert severity="error">
                  <AlertTitle>Error</AlertTitle>
                  {error}
                </Alert>
              )}
              
              {success && (
                <Alert severity="success">
                  <AlertTitle>Success</AlertTitle>
                  {success}
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                disabled={!password || !confirm}
                sx={{ alignSelf: 'flex-start' }}
              >
                Update Password
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Two-Factor Authentication */}
        <Card>
          <CardHeader
            title="Two-Factor Authentication"
            titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
            avatar={<Smartphone style={{ width: 24, height: 24, color: '#10b981' }} />}
          />
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                  {twoFA ? '2FA Enabled' : 'Enable 2FA'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {twoFA 
                    ? 'Your account is protected with two-factor authentication'
                    : 'Add an extra layer of security to your account'
                  }
                </Typography>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={twoFA}
                    onChange={handle2FA}
                    color="primary"
                  />
                }
                label=""
              />
            </Box>
          </CardContent>
        </Card>

        {/* Active Sessions */}
        <Card>
          <CardHeader
            title="Active Sessions"
            titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
            avatar={<Monitor style={{ width: 24, height: 24, color: '#8b5cf6' }} />}
          />
          <CardContent>
            <List>
              {sessions.map((session) => (
                <ListItem key={session.id} divider>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1">
                          {session.device}
                        </Typography>
                        {session.current && (
                          <Chip 
                            label="Current" 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Last active: {session.current ? 'Now' : '2 hours ago'}
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    {!session.current && (
                      <IconButton
                        edge="end"
                        color="error"
                        onClick={() => handleRevoke(session.id)}
                        size="small"
                      >
                        <XCircle style={{ width: 16, height: 16 }} />
                      </IconButton>
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

        {/* Security Activity */}
        <Card>
          <CardHeader
            title="Recent Security Activity"
            titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
            avatar={<Shield style={{ width: 24, height: 24, color: '#f59e0b' }} />}
          />
          <CardContent>
            <List>
              <ListItem>
                <ListItemText
                  primary="Login from new device"
                  secondary="2 hours ago"
                />
                <CheckCircle style={{ width: 16, height: 16, color: '#10b981' }} />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Password changed"
                  secondary="3 days ago"
                />
                <CheckCircle style={{ width: 16, height: 16, color: '#10b981' }} />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="2FA enabled"
                  secondary="1 week ago"
                />
                <CheckCircle style={{ width: 16, height: 16, color: '#10b981' }} />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* Delete Account */}
        <Card>
          <CardHeader
            title="Danger Zone"
            titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
            avatar={<AlertTriangle style={{ width: 24, height: 24, color: '#ef4444' }} />}
          />
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                  Delete Account
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Permanently delete your account and all associated data
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="error"
                startIcon={<Trash2 style={{ width: 16, height: 16 }} />}
                onClick={handleDelete}
              >
                Delete Account
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
} 