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
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { Settings as SettingsIcon, TrendingUp as TrendingUpIcon } from '@mui/icons-material';

interface UXConfig {
  animations: boolean;
  soundEffects: boolean;
  hapticFeedback: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
  theme: 'light' | 'dark' | 'auto';
}

interface UserPreference {
  category: string;
  key: string;
  value: any;
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState<UserPreference[]>([]);
  const [accessibility, setAccessibility] = useState<UXConfig>({
    animations: true,
    soundEffects: false,
    hapticFeedback: true,
    reducedMotion: false,
    highContrast: false,
    fontSize: 'medium',
    theme: 'auto',
  });

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ux/preferences');
      if (response.ok) {
        const data = await response.json();
        setPreferences(data.preferences);
        
        // Extract accessibility settings
        const accessibilityPrefs = data.preferences.filter((p: UserPreference) => p.category === 'accessibility');
        if (accessibilityPrefs.length > 0) {
          const settings = accessibilityPrefs[0].value;
          setAccessibility(settings);
        }
      }
    } catch (error) {
      console.error('Failed to fetch preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAccessibility = async (key: keyof UXConfig, value: any) => {
    const updated = { ...accessibility, [key]: value };
    setAccessibility(updated);
    
    try {
      await fetch('/api/ux/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'accessibility',
          key: 'settings',
          value: updated,
        }),
      });
    } catch (error) {
      console.error('Failed to update accessibility settings:', error);
    }
  };

  const saveAllPreferences = async () => {
    try {
      setSaving(true);
      await fetch('/api/ux/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferences: [
            {
              category: 'accessibility',
              key: 'settings',
              value: accessibility,
            },
          ],
        }),
      });
    } catch (error) {
      console.error('Failed to save preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  const exportData = async () => {
    try {
      const response = await fetch('/api/user/export');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'creatorflow-data.json';
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Failed to export data:', error);
    }
  };

  const deleteAccount = async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const response = await fetch('/api/user/delete', {
          method: 'DELETE',
        });
        if (response.ok) {
          // Redirect to logout
          window.location.href = '/api/auth/signout';
        }
      } catch (error) {
        console.error('Failed to delete account:', error);
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <TrendingUpIcon sx={{ fontSize: 24 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, '& > * + *': { mt: 4 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <SettingsIcon sx={{ fontSize: 32 }} />
            Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your preferences and account settings
          </Typography>
        </Box>
        <Button onClick={saveAllPreferences} disabled={saving} startIcon={saving ? <TrendingUpIcon sx={{ fontSize: 16 }} /> : <SettingsIcon sx={{ fontSize: 16 }} />}>
          Save Changes
        </Button>
      </Box>

      <Tabs defaultValue="accessibility" sx={{ '& > * + *': { mt: 3 } }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Accessibility" value="accessibility" />
          <Tab label="Notifications" value="notifications" />
          <Tab label="Privacy" value="privacy" />
          <Tab label="Data" value="data" />
        </Box>

        <TabPanel value="accessibility" sx={{ '& > * + *': { mt: 3 } }}>
          <Card>
            <CardHeader>
              <Typography variant="h5" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUpIcon sx={{ fontSize: 20 }} />
                Accessibility Settings
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Customize your experience for better accessibility
              </Typography>
            </CardHeader>
            <CardContent sx={{ '& > * + *': { mt: 3 } }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <InputLabel>Animations</InputLabel>
                      <Typography variant="body2" color="text.secondary">
                        Enable smooth animations and transitions
                      </Typography>
                    </Box>
                    <Switch
                      checked={accessibility.animations}
                      onChange={(event) => updateAccessibility('animations', event.target.checked)}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <InputLabel>Sound Effects</InputLabel>
                      <Typography variant="body2" color="text.secondary">
                        Play sound effects for interactions
                      </Typography>
                    </Box>
                    <Switch
                      checked={accessibility.soundEffects}
                      onChange={(event) => updateAccessibility('soundEffects', event.target.checked)}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <InputLabel>Haptic Feedback</InputLabel>
                      <Typography variant="body2" color="text.secondary">
                        Vibrate on mobile devices for feedback
                      </Typography>
                    </Box>
                    <Switch
                      checked={accessibility.hapticFeedback}
                      onChange={(event) => updateAccessibility('hapticFeedback', event.target.checked)}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <InputLabel>Reduced Motion</InputLabel>
                      <Typography variant="body2" color="text.secondary">
                        Minimize animations for motion sensitivity
                      </Typography>
                    </Box>
                    <Switch
                      checked={accessibility.reducedMotion}
                      onChange={(event) => updateAccessibility('reducedMotion', event.target.checked)}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <InputLabel>High Contrast</InputLabel>
                      <Typography variant="body2" color="text.secondary">
                        Increase contrast for better visibility
                      </Typography>
                    </Box>
                    <Switch
                      checked={accessibility.highContrast}
                      onChange={(event) => updateAccessibility('highContrast', event.target.checked)}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <InputLabel>Font Size</InputLabel>
                    <FormControl fullWidth>
                      <Select
                        value={accessibility.fontSize}
                        onChange={(event) => updateAccessibility('fontSize', event.target.value as 'small' | 'medium' | 'large')}
                      >
                        <MenuItem value="small">Small</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="large">Large</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
              </Grid>

              <Typography variant="h6" component="div" sx={{ mt: 2 }}>
                Theme
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={accessibility.theme}
                  onChange={(event) => updateAccessibility('theme', event.target.value as 'light' | 'dark' | 'auto')}
                >
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="dark">Dark</MenuItem>
                  <MenuItem value="auto">Auto (System)</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value="notifications" sx={{ '& > * + *': { mt: 3 } }}>
          <Card>
            <CardHeader>
              <Typography variant="h5" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUpIcon sx={{ fontSize: 20 }} />
                Notification Preferences
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Control how and when you receive notifications
              </Typography>
            </CardHeader>
            <CardContent sx={{ '& > * + *': { mt: 3 } }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6} component="div">
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <InputLabel>Email Notifications</InputLabel>
                      <Typography variant="body2" color="text.secondary">
                        Receive notifications via email
                      </Typography>
                    </Box>
                    <Switch defaultChecked />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <InputLabel>Push Notifications</InputLabel>
                      <Typography variant="body2" color="text.secondary">
                        Receive push notifications in browser
                      </Typography>
                    </Box>
                    <Switch defaultChecked />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <InputLabel>Post Reminders</InputLabel>
                      <Typography variant="body2" color="text.secondary">
                        Get reminded about scheduled posts
                      </Typography>
                    </Box>
                    <Switch defaultChecked />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <InputLabel>Analytics Updates</InputLabel>
                      <Typography variant="body2" color="text.secondary">
                        Weekly performance summaries
                      </Typography>
                    </Box>
                    <Switch />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value="privacy" sx={{ '& > * + *': { mt: 3 } }}>
          <Card>
            <CardHeader>
              <Typography variant="h5" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUpIcon sx={{ fontSize: 20 }} />
                Privacy & Security
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage your privacy and security settings
              </Typography>
            </CardHeader>
            <CardContent sx={{ '& > * + *': { mt: 3 } }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6} component="div">
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <InputLabel>Two-Factor Authentication</InputLabel>
                      <Typography variant="body2" color="text.secondary">
                        Add an extra layer of security
                      </Typography>
                    </Box>
                    <Button variant="outlined" size="small">
                      Enable
                    </Button>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <InputLabel>Data Collection</InputLabel>
                      <Typography variant="body2" color="text.secondary">
                        Allow analytics and usage data collection
                      </Typography>
                    </Box>
                    <Switch defaultChecked />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <InputLabel>Social Media Integration</InputLabel>
                      <Typography variant="body2" color="text.secondary">
                        Allow access to connected social accounts
                      </Typography>
                    </Box>
                    <Switch defaultChecked />
                  </Box>
                </Grid>
              </Grid>

              <Typography variant="h6" component="div" sx={{ mt: 2 }}>
                Account Actions
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={12} component="div">
                  <Button variant="outlined" fullWidth>
                    Change Password
                  </Button>
                </Grid>
                <Grid item xs={12} component="div">
                  <Button variant="outlined" fullWidth>
                    Update Email
                  </Button>
                </Grid>
                <Grid item xs={12} component="div">
                  <Button variant="outlined" fullWidth>
                    Manage Connected Accounts
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value="data" sx={{ '& > * + *': { mt: 3 } }}>
          <Card>
            <CardHeader>
              <Typography variant="h5" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUpIcon sx={{ fontSize: 20 }} />
                Data Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Export your data or manage your account
              </Typography>
            </CardHeader>
            <CardContent sx={{ '& > * + *': { mt: 3 } }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6} component="div">
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <InputLabel>Export Data</InputLabel>
                      <Typography variant="body2" color="text.secondary">
                        Download all your data and content
                      </Typography>
                    </Box>
                    <Button variant="outlined" onClick={exportData} startIcon={<TrendingUpIcon sx={{ fontSize: 16 }} />}>
                      Export
                    </Button>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <InputLabel>Delete Account</InputLabel>
                      <Typography variant="body2" color="text.secondary">
                        Permanently delete your account and all data
                      </Typography>
                    </Box>
                    <Button variant="outlined" color="error" onClick={deleteAccount} startIcon={<TrendingUpIcon sx={{ fontSize: 16 }} />}>
                      Delete
                    </Button>
                  </Box>
                </Grid>
              </Grid>

              <Typography variant="h6" component="div" sx={{ mt: 2 }}>
                Important Notice
              </Typography>
              <Box sx={{ bgcolor: 'warning.light', p: 2, borderRadius: 1 }}>
                <Typography variant="body2" color="warning.dark">
                  Deleting your account will permanently remove all your data, posts, and settings. 
                  This action cannot be undone. Please export your data before deletion if needed.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </TabPanel>
      </Tabs>

      {/* Bottom Spacer to Clear Bottom Navigation */}
      <Box sx={{
        height: { xs: '120px', sm: '40px' },
        width: '100%'
      }} />
    </Box>
  );
}

function TabPanel(props: { children?: React.ReactNode; value: string; className?: string }) {
  const { children, value, className, ...other } = props;

  return (
    <div
      role="tabpanel"
      id={`settings-tabpanel-${value}`}
      aria-labelledby={`settings-tab-${value}`}
      className={className}
      {...other}
    >
      {children}
    </div>
  );
} 