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
import { Settings, Activity } from 'lucide-react';

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
      <div className="p-8 flex items-center justify-center">
        <Activity className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Settings
          </h1>
          <p className="text-muted-foreground">Manage your preferences and account settings</p>
        </div>
        <Button onClick={saveAllPreferences} disabled={saving}>
          {saving ? <Activity className="h-4 w-4 mr-2 animate-spin" /> : <Settings className="h-4 w-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="accessibility" className="space-y-6">
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Accessibility" value="accessibility" />
          <Tab label="Notifications" value="notifications" />
          <Tab label="Privacy" value="privacy" />
          <Tab label="Data" value="data" />
        </Box>

        <TabPanel value="accessibility" className="space-y-6">
          <Card>
            <CardHeader>
              <Typography variant="h5" component="div" className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Accessibility Settings
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Customize your experience for better accessibility
              </Typography>
            </CardHeader>
            <CardContent className="space-y-6">
              <Grid container spacing={2}>
                <Grid item xs={12} md={6} component="div">
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

                <Grid item xs={12} md={6} component="div">
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

        <TabPanel value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <Typography variant="h5" component="div" className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Notification Preferences
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Control how and when you receive notifications
              </Typography>
            </CardHeader>
            <CardContent className="space-y-6">
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

        <TabPanel value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <Typography variant="h5" component="div" className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Privacy & Security
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage your privacy and security settings
              </Typography>
            </CardHeader>
            <CardContent className="space-y-6">
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
                <Grid item xs={12}>
                  <Button variant="outlined" fullWidth>
                    Change Password
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button variant="outlined" fullWidth>
                    Update Email
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button variant="outlined" fullWidth>
                    Manage Connected Accounts
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <Typography variant="h5" component="div" className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Data Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Export your data or manage your account
              </Typography>
            </CardHeader>
            <CardContent className="space-y-6">
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <InputLabel>Export Data</InputLabel>
                      <Typography variant="body2" color="text.secondary">
                        Download all your data and content
                      </Typography>
                    </Box>
                    <Button variant="outlined" onClick={exportData}>
                      <Activity className="h-4 w-4 mr-2" />
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
                    <Button variant="outlined" color="error" onClick={deleteAccount}>
                      <Activity className="h-4 w-4 mr-2" />
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
    </div>
  );
} 