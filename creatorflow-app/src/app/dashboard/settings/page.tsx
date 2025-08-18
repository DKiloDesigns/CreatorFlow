'use client';

import React, { useEffect, useState } from 'react';
import { useUserSettings } from '@/hooks/useUserSettings';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  CardHeader,
  Switch,
  FormControlLabel,
  FormControl,
  FormLabel,
  FormGroup,
  Select,
  MenuItem,
  Alert,
  AlertTitle,
  Chip,
  CircularProgress,
  Container
} from '@mui/material';
import { 
  Settings, 
  Bell, 
  Shield, 
  CheckCircle,
  XCircle
} from 'lucide-react';

// Add type for settings
interface Settings {
  theme: string;
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  dashboard: string;
  connected: {
    google: boolean;
    twitter: boolean;
  };
}

const defaultSettings: Settings = {
  theme: 'System',
  language: 'English',
  notifications: {
    email: true,
    push: false,
    sms: false,
  },
  dashboard: 'Main',
  connected: {
    google: false,
    twitter: false,
  },
};

const NOTIF_TYPES = [
  { key: 'announcement', label: 'Announcements' },
  { key: 'feedback', label: 'Feedback' },
  { key: 'security', label: 'Security Alerts' },
];
const NOTIF_CHANNELS = [
  { key: 'inApp', label: 'In-App' },
  { key: 'email', label: 'Email' },
];

export default function SettingsPage() {
  const { settings, isLoading, error, updating, updateError, updateSettings } = useUserSettings();
  const [form, setForm] = useState<Settings>(defaultSettings);
  const [success, setSuccess] = useState(false);
  const [_notifPrefs, setNotifPrefs] = useState<any>({});
  const [notifLoading, setNotifLoading] = useState(true);
  const [notifError, setNotifError] = useState<string | null>(null);
  const [notifSuccess, setNotifSuccess] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm({ ...defaultSettings, ...settings });
    }
  }, [settings]);

  useEffect(() => {
    async function fetchNotifPrefs() {
      setNotifLoading(true);
      setNotifError(null);
      try {
        const res = await fetch('/api/user');
        if (!res.ok) throw new Error('Failed to fetch notification preferences');
        const user = await res.json();
        setNotifPrefs(user.notificationPreferences || {});
      } catch (e: any) {
        setNotifError(e.message || 'Failed to load notification preferences');
      } finally {
        setNotifLoading(false);
      }
    }
    fetchNotifPrefs();
  }, []);

  const handleChange = (field: keyof Settings, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNotifChange = (type: keyof Settings['notifications'], value: boolean) => {
    setForm((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [type]: value },
    }));
  };

  const handleConnect = (provider: keyof Settings['connected']) => {
    setForm((prev) => ({
      ...prev,
      connected: { ...prev.connected, [provider]: !prev.connected[provider] },
    }));
  };

  const handleNotifPrefChange = (type: string, channel: string, value: boolean) => {
    setNotifPrefs((prev: any) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [channel]: value,
      },
    }));
  };

  const handleNotifPrefSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotifLoading(true);
    setNotifError(null);
    setNotifSuccess(false);

    try {
      const res = await fetch('/api/user/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationPreferences: _notifPrefs }),
      });

      if (!res.ok) throw new Error('Failed to update notification preferences');
      setNotifSuccess(true);
    } catch (e: any) {
      setNotifError(e.message || 'Failed to update notification preferences');
    } finally {
      setNotifLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    await updateSettings(form);
    setSuccess(true);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        <AlertTitle>Error</AlertTitle>
        {error}
      </Alert>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Header */}
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
            Settings
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Manage your account preferences and notifications
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
          {/* General Settings */}
          <Box>
            <Card>
              <CardHeader
                title="General Settings"
                titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                avatar={<Settings style={{ width: 20, height: 20 }} />}
              />
              <CardContent>
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {/* Theme Setting */}
                  <FormControl fullWidth>
                    <FormLabel>Theme</FormLabel>
                    <Select
                      value={form.theme}
                      onChange={(e) => handleChange('theme', e.target.value)}
                      size="small"
                    >
                      <MenuItem value="System">System</MenuItem>
                      <MenuItem value="Light">Light</MenuItem>
                      <MenuItem value="Dark">Dark</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Language Setting */}
                  <FormControl fullWidth>
                    <FormLabel>Language</FormLabel>
                    <Select
                      value={form.language}
                      onChange={(e) => handleChange('language', e.target.value)}
                      size="small"
                    >
                      <MenuItem value="English">English</MenuItem>
                      <MenuItem value="Spanish">Spanish</MenuItem>
                      <MenuItem value="French">French</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Dashboard Setting */}
                  <FormControl fullWidth>
                    <FormLabel>Default Dashboard</FormLabel>
                    <Select
                      value={form.dashboard}
                      onChange={(e) => handleChange('dashboard', e.target.value)}
                      size="small"
                    >
                      <MenuItem value="Main">Main Dashboard</MenuItem>
                      <MenuItem value="Analytics">Analytics</MenuItem>
                      <MenuItem value="Content">Content</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Success/Error Messages */}
                  {success && (
                    <Alert severity="success">
                      <AlertTitle>Success</AlertTitle>
                      Settings updated successfully!
                    </Alert>
                  )}

                  {updateError && (
                    <Alert severity="error">
                      <AlertTitle>Error</AlertTitle>
                      {updateError}
                    </Alert>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={updating}
                    sx={{ mt: 2 }}
                  >
                    {updating ? 'Saving...' : 'Save Settings'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Notification Settings */}
          <Box>
            <Card>
              <CardHeader
                title="Notification Settings"
                titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                avatar={<Bell style={{ width: 20, height: 20 }} />}
              />
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Notification Types</FormLabel>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={form.notifications.email}
                            onChange={(e) => handleNotifChange('email', e.target.checked)}
                          />
                        }
                        label="Email Notifications"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={form.notifications.push}
                            onChange={(e) => handleNotifChange('push', e.target.checked)}
                          />
                        }
                        label="Push Notifications"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={form.notifications.sms}
                            onChange={(e) => handleNotifChange('sms', e.target.checked)}
                          />
                        }
                        label="SMS Notifications"
                      />
                    </FormGroup>
                  </FormControl>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Connected Accounts */}
          <Box sx={{ gridColumn: '1 / -1' }}>
            <Card>
              <CardHeader
                title="Connected Accounts"
                titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                avatar={<Shield style={{ width: 20, height: 20 }} />}
              />
              <CardContent>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          Google
                        </Typography>
                        {form.connected.google && (
                          <Chip label="Connected" color="success" size="small" />
                        )}
                      </Box>
                      <Button
                        variant={form.connected.google ? "outlined" : "contained"}
                        onClick={() => handleConnect('google')}
                        size="small"
                      >
                        {form.connected.google ? 'Disconnect' : 'Connect'}
                      </Button>
                    </Box>
                  </Box>
                  
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          Twitter
                        </Typography>
                        {form.connected.twitter && (
                          <Chip label="Connected" color="success" size="small" />
                        )}
                      </Box>
                      <Button
                        variant={form.connected.twitter ? "outlined" : "contained"}
                        onClick={() => handleConnect('twitter')}
                        size="small"
                      >
                        {form.connected.twitter ? 'Disconnect' : 'Connect'}
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Bottom Spacer to Clear Bottom Navigation */}
        <Box sx={{
          height: { xs: '120px', sm: '40px' },
          width: '100%'
        }} />
      </Box>
    </Container>
  );
} 