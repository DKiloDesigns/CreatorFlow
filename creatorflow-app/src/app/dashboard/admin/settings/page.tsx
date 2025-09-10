'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader,
  Button,
  Tabs,
  Tab,
  Alert,
  TextField,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { AccessibleModal } from '@/components/accessibility';
import { 
  Settings, 
  Save,
  Refresh,
  RestoreFromTrash,
  CloudUpload,
  CloudDownload,
  Notifications,
  Security,
  Storage,
  Speed,
  Palette,
  Language,
  Schedule,
  Backup,
  Restore
} from '@mui/icons-material';

interface SystemSettings {
  general: {
    siteName: string;
    siteDescription: string;
    timezone: string;
    language: string;
    maintenanceMode: boolean;
    debugMode: boolean;
  };
  performance: {
    cacheEnabled: boolean;
    compressionEnabled: boolean;
    cdnEnabled: boolean;
    imageOptimization: boolean;
    lazyLoading: boolean;
    maxFileSize: number;
    sessionTimeout: number;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
    adminAlerts: boolean;
    userAlerts: boolean;
    systemAlerts: boolean;
  };
  storage: {
    maxStoragePerUser: number;
    allowedFileTypes: string[];
    autoBackup: boolean;
    backupFrequency: string;
    retentionPeriod: number;
  };
  security: {
    twoFactorRequired: boolean;
    passwordMinLength: number;
    sessionTimeout: number;
    ipWhitelist: string[];
    rateLimiting: boolean;
    auditLogging: boolean;
  };
  appearance: {
    theme: string;
    primaryColor: string;
    secondaryColor: string;
    logoUrl: string;
    faviconUrl: string;
  };
}

export default function SystemSettings() {
  const [generalModalOpen, setGeneralModalOpen] = useState(false);
  const [performanceModalOpen, setPerformanceModalOpen] = useState(false);
  const [notificationsModalOpen, setNotificationsModalOpen] = useState(false);
  const [storageModalOpen, setStorageModalOpen] = useState(false);
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
  const [appearanceModalOpen, setAppearanceModalOpen] = useState(false);
  const [backupModalOpen, setBackupModalOpen] = useState(false);
  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      siteName: 'CreatorFlow',
      siteDescription: 'The ultimate platform for content creators',
      timezone: 'UTC',
      language: 'en',
      maintenanceMode: false,
      debugMode: false
    },
    performance: {
      cacheEnabled: true,
      compressionEnabled: true,
      cdnEnabled: false,
      imageOptimization: true,
      lazyLoading: true,
      maxFileSize: 10,
      sessionTimeout: 30
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      adminAlerts: true,
      userAlerts: true,
      systemAlerts: true
    },
    storage: {
      maxStoragePerUser: 1000,
      allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'pdf', 'doc', 'docx'],
      autoBackup: true,
      backupFrequency: 'daily',
      retentionPeriod: 30
    },
    security: {
      twoFactorRequired: false,
      passwordMinLength: 8,
      sessionTimeout: 30,
      ipWhitelist: [],
      rateLimiting: true,
      auditLogging: true
    },
    appearance: {
      theme: 'light',
      primaryColor: '#6366f1',
      secondaryColor: '#ec4899',
      logoUrl: '/logo.png',
      faviconUrl: '/favicon.ico'
    }
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [backupDialogOpen, setBackupDialogOpen] = useState(false);

  // Fetch real settings data
  const fetchSettings = async () => {
    try {
      // In a real implementation, this would fetch from your settings API
      // const response = await fetch('/api/admin/settings');
      // const data = await response.json();
      // setSettings(data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleCloseModal = (modalType: string) => {
    switch (modalType) {
      case 'general':
        setGeneralModalOpen(false);
        break;
      case 'performance':
        setPerformanceModalOpen(false);
        break;
      case 'notifications':
        setNotificationsModalOpen(false);
        break;
      case 'storage':
        setStorageModalOpen(false);
        break;
      case 'security':
        setSecurityModalOpen(false);
        break;
      case 'appearance':
        setAppearanceModalOpen(false);
        break;
      case 'backup':
        setBackupModalOpen(false);
        break;
    }
  };

  const handleSettingChange = (category: keyof SystemSettings, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // In a real implementation, this would save to your settings API
      // await fetch('/api/admin/settings', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings)
      // });
      setHasChanges(false);
      // Show success message
    } catch (error) {
      console.error('Failed to save settings:', error);
      // Show error message
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    fetchSettings();
    setHasChanges(false);
  };


  return (
    <Box sx={{ 
      px: { xs: 1, sm: 0 }, // Add horizontal padding on mobile
      maxWidth: '100%',
      overflow: 'hidden' // Prevent horizontal overflow
    }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        mb: 4,
        gap: 2
      }}>
        <Box>
          <Typography variant="h4" sx={{ 
            fontWeight: 600, 
            mb: 1,
            fontSize: { xs: '1.75rem', sm: '2.125rem' }
          }}>
            System Settings
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}>
            Configure and manage your CreatorFlow platform settings
          </Typography>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          gap: 1,
          flexWrap: 'wrap',
          width: { xs: '100%', sm: 'auto' }
        }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleReset}
            disabled={!hasChanges}
            size="small"
            sx={{ flex: { xs: 1, sm: 'none' } }}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            size="small"
            sx={{ flex: { xs: 1, sm: 'none' } }}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Box>

      {hasChanges && (
        <Alert severity="info" sx={{ mb: 3 }}>
          You have unsaved changes. Don't forget to save your settings.
        </Alert>
      )}

      {/* Settings Tools */}
      <Card sx={{ mb: { xs: 8, sm: 0 } }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 }, pb: { xs: 6, sm: 3 } }}>
          <Typography variant="h6" sx={{ 
            mb: 3,
            fontSize: { xs: '1.1rem', sm: '1.25rem' }
          }}>
            System Settings
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Settings />}
                onClick={() => setGeneralModalOpen(true)}
                sx={{ 
                  p: 2, 
                  height: 'auto',
                  flexDirection: 'column',
                  gap: 1
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  General Settings
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Site information and basic configuration
                </Typography>
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Speed />}
                onClick={() => setPerformanceModalOpen(true)}
                sx={{ 
                  p: 2, 
                  height: 'auto',
                  flexDirection: 'column',
                  gap: 1
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Performance
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Performance optimization settings
                </Typography>
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Notifications />}
                onClick={() => setNotificationsModalOpen(true)}
                sx={{ 
                  p: 2, 
                  height: 'auto',
                  flexDirection: 'column',
                  gap: 1
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Notifications
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Notification preferences and settings
                </Typography>
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Storage />}
                onClick={() => setStorageModalOpen(true)}
                sx={{ 
                  p: 2, 
                  height: 'auto',
                  flexDirection: 'column',
                  gap: 1
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Storage
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Storage management and quotas
                </Typography>
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Security />}
                onClick={() => setSecurityModalOpen(true)}
                sx={{ 
                  p: 2, 
                  height: 'auto',
                  flexDirection: 'column',
                  gap: 1
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Security
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Security policies and access control
                </Typography>
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Palette />}
                onClick={() => setAppearanceModalOpen(true)}
                sx={{ 
                  p: 2, 
                  height: 'auto',
                  flexDirection: 'column',
                  gap: 1
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Appearance
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Theme and visual customization
                </Typography>
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Backup />}
                onClick={() => setBackupModalOpen(true)}
                sx={{ 
                  p: 2, 
                  height: 'auto',
                  flexDirection: 'column',
                  gap: 1
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Backup & Restore
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Data backup and restoration tools
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* General Settings Modal */}
      <Dialog 
        open={generalModalOpen} 
        onClose={() => handleCloseModal('general')}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>General Settings</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Site Information" />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      label="Site Name"
                      value={settings.general.siteName}
                      onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
                      fullWidth
                    />
                    <TextField
                      label="Site Description"
                      value={settings.general.siteDescription}
                      onChange={(e) => handleSettingChange('general', 'siteDescription', e.target.value)}
                      fullWidth
                      multiline
                      rows={3}
                    />
                    <FormControl fullWidth>
                      <InputLabel>Timezone</InputLabel>
                      <Select
                        value={settings.general.timezone}
                        onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                        label="Timezone"
                      >
                        <MenuItem value="UTC">UTC</MenuItem>
                        <MenuItem value="America/New_York">Eastern Time</MenuItem>
                        <MenuItem value="America/Chicago">Central Time</MenuItem>
                        <MenuItem value="America/Denver">Mountain Time</MenuItem>
                        <MenuItem value="America/Los_Angeles">Pacific Time</MenuItem>
                        <MenuItem value="Europe/London">London</MenuItem>
                        <MenuItem value="Europe/Paris">Paris</MenuItem>
                        <MenuItem value="Asia/Tokyo">Tokyo</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth>
                      <InputLabel>Language</InputLabel>
                      <Select
                        value={settings.general.language}
                        onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
                        label="Language"
                      >
                        <MenuItem value="en">English</MenuItem>
                        <MenuItem value="es">Spanish</MenuItem>
                        <MenuItem value="fr">French</MenuItem>
                        <MenuItem value="de">German</MenuItem>
                        <MenuItem value="it">Italian</MenuItem>
                        <MenuItem value="pt">Portuguese</MenuItem>
                        <MenuItem value="ja">Japanese</MenuItem>
                        <MenuItem value="ko">Korean</MenuItem>
                        <MenuItem value="zh">Chinese</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="System Status" />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.general.maintenanceMode}
                          onChange={(e) => handleSettingChange('general', 'maintenanceMode', e.target.checked)}
                        />
                      }
                      label="Maintenance Mode"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.general.debugMode}
                          onChange={(e) => handleSettingChange('general', 'debugMode', e.target.checked)}
                        />
                      }
                      label="Debug Mode"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseModal('general')}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Performance Settings Modal */}
      <Dialog 
        open={performanceModalOpen} 
        onClose={() => handleCloseModal('performance')}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Performance Settings</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Caching & Compression" />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.performance.cacheEnabled}
                          onChange={(e) => handleSettingChange('performance', 'cacheEnabled', e.target.checked)}
                        />
                      }
                      label="Enable Caching"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.performance.compressionEnabled}
                          onChange={(e) => handleSettingChange('performance', 'compressionEnabled', e.target.checked)}
                        />
                      }
                      label="Enable Compression"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.performance.cdnEnabled}
                          onChange={(e) => handleSettingChange('performance', 'cdnEnabled', e.target.checked)}
                        />
                      }
                      label="Enable CDN"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.performance.imageOptimization}
                          onChange={(e) => handleSettingChange('performance', 'imageOptimization', e.target.checked)}
                        />
                      }
                      label="Image Optimization"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.performance.lazyLoading}
                          onChange={(e) => handleSettingChange('performance', 'lazyLoading', e.target.checked)}
                        />
                      }
                      label="Lazy Loading"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="File & Session Settings" />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Max File Size: {settings.performance.maxFileSize} MB
                      </Typography>
                      <Slider
                        value={settings.performance.maxFileSize}
                        onChange={(e, value) => handleSettingChange('performance', 'maxFileSize', value)}
                        min={1}
                        max={100}
                        step={1}
                        marks={[
                          { value: 1, label: '1MB' },
                          { value: 10, label: '10MB' },
                          { value: 50, label: '50MB' },
                          { value: 100, label: '100MB' }
                        ]}
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Session Timeout: {settings.performance.sessionTimeout} minutes
                      </Typography>
                      <Slider
                        value={settings.performance.sessionTimeout}
                        onChange={(e, value) => handleSettingChange('performance', 'sessionTimeout', value)}
                        min={5}
                        max={120}
                        step={5}
                        marks={[
                          { value: 5, label: '5m' },
                          { value: 30, label: '30m' },
                          { value: 60, label: '1h' },
                          { value: 120, label: '2h' }
                        ]}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseModal('performance')}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Notifications Settings Modal */}
      <Dialog 
        open={notificationsModalOpen} 
        onClose={() => handleCloseModal('notifications')}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Notification Settings</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Notification Channels" />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.notifications.emailNotifications}
                          onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                        />
                      }
                      label="Email Notifications"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.notifications.pushNotifications}
                          onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                        />
                      }
                      label="Push Notifications"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.notifications.smsNotifications}
                          onChange={(e) => handleSettingChange('notifications', 'smsNotifications', e.target.checked)}
                        />
                      }
                      label="SMS Notifications"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Alert Types" />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.notifications.adminAlerts}
                          onChange={(e) => handleSettingChange('notifications', 'adminAlerts', e.target.checked)}
                        />
                      }
                      label="Admin Alerts"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.notifications.userAlerts}
                          onChange={(e) => handleSettingChange('notifications', 'userAlerts', e.target.checked)}
                        />
                      }
                      label="User Alerts"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.notifications.systemAlerts}
                          onChange={(e) => handleSettingChange('notifications', 'systemAlerts', e.target.checked)}
                        />
                      }
                      label="System Alerts"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseModal('notifications')}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Storage Settings Modal */}
      <Dialog 
        open={storageModalOpen} 
        onClose={() => handleCloseModal('storage')}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Storage Settings</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Storage Limits" />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Max Storage per User: {settings.storage.maxStoragePerUser} MB
                      </Typography>
                      <Slider
                        value={settings.storage.maxStoragePerUser}
                        onChange={(e, value) => handleSettingChange('storage', 'maxStoragePerUser', value)}
                        min={100}
                        max={10000}
                        step={100}
                        marks={[
                          { value: 100, label: '100MB' },
                          { value: 1000, label: '1GB' },
                          { value: 5000, label: '5GB' },
                          { value: 10000, label: '10GB' }
                        ]}
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Retention Period: {settings.storage.retentionPeriod} days
                      </Typography>
                      <Slider
                        value={settings.storage.retentionPeriod}
                        onChange={(e, value) => handleSettingChange('storage', 'retentionPeriod', value)}
                        min={7}
                        max={365}
                        step={7}
                        marks={[
                          { value: 7, label: '7d' },
                          { value: 30, label: '30d' },
                          { value: 90, label: '90d' },
                          { value: 365, label: '1y' }
                        ]}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Backup Settings" />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.storage.autoBackup}
                          onChange={(e) => handleSettingChange('storage', 'autoBackup', e.target.checked)}
                        />
                      }
                      label="Automatic Backup"
                    />
                    <FormControl fullWidth>
                      <InputLabel>Backup Frequency</InputLabel>
                      <Select
                        value={settings.storage.backupFrequency}
                        onChange={(e) => handleSettingChange('storage', 'backupFrequency', e.target.value)}
                        label="Backup Frequency"
                      >
                        <MenuItem value="hourly">Hourly</MenuItem>
                        <MenuItem value="daily">Daily</MenuItem>
                        <MenuItem value="weekly">Weekly</MenuItem>
                        <MenuItem value="monthly">Monthly</MenuItem>
                      </Select>
                    </FormControl>
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <Button
                        variant="outlined"
                        startIcon={<CloudUpload />}
                        onClick={() => setBackupDialogOpen(true)}
                        fullWidth
                      >
                        Create Backup
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<CloudDownload />}
                        fullWidth
                      >
                        Restore
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseModal('storage')}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Security Settings Modal */}
      <Dialog 
        open={securityModalOpen} 
        onClose={() => handleCloseModal('security')}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Security Settings</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Authentication" />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.security.twoFactorRequired}
                          onChange={(e) => handleSettingChange('security', 'twoFactorRequired', e.target.checked)}
                        />
                      }
                      label="Require Two-Factor Authentication"
                    />
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Password Min Length: {settings.security.passwordMinLength} characters
                      </Typography>
                      <Slider
                        value={settings.security.passwordMinLength}
                        onChange={(e, value) => handleSettingChange('security', 'passwordMinLength', value)}
                        min={6}
                        max={20}
                        step={1}
                        marks={[
                          { value: 6, label: '6' },
                          { value: 8, label: '8' },
                          { value: 12, label: '12' },
                          { value: 20, label: '20' }
                        ]}
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Session Timeout: {settings.security.sessionTimeout} minutes
                      </Typography>
                      <Slider
                        value={settings.security.sessionTimeout}
                        onChange={(e, value) => handleSettingChange('security', 'sessionTimeout', value)}
                        min={5}
                        max={120}
                        step={5}
                        marks={[
                          { value: 5, label: '5m' },
                          { value: 30, label: '30m' },
                          { value: 60, label: '1h' },
                          { value: 120, label: '2h' }
                        ]}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Access Control" />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.security.rateLimiting}
                          onChange={(e) => handleSettingChange('security', 'rateLimiting', e.target.checked)}
                        />
                      }
                      label="Rate Limiting"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.security.auditLogging}
                          onChange={(e) => handleSettingChange('security', 'auditLogging', e.target.checked)}
                        />
                      }
                      label="Audit Logging"
                    />
                    <TextField
                      label="IP Whitelist"
                      value={settings.security.ipWhitelist.join(', ')}
                      onChange={(e) => handleSettingChange('security', 'ipWhitelist', e.target.value.split(',').map(ip => ip.trim()).filter(ip => ip))}
                      fullWidth
                      multiline
                      rows={3}
                      placeholder="192.168.1.1, 10.0.0.1, 203.0.113.0/24"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseModal('security')}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Appearance Settings Modal */}
      <Dialog 
        open={appearanceModalOpen} 
        onClose={() => handleCloseModal('appearance')}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Appearance Settings</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Theme Settings" />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControl fullWidth>
                      <InputLabel>Theme</InputLabel>
                      <Select
                        value={settings.appearance.theme}
                        onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
                        label="Theme"
                      >
                        <MenuItem value="light">Light</MenuItem>
                        <MenuItem value="dark">Dark</MenuItem>
                        <MenuItem value="auto">Auto</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      label="Primary Color"
                      value={settings.appearance.primaryColor}
                      onChange={(e) => handleSettingChange('appearance', 'primaryColor', e.target.value)}
                      fullWidth
                      type="color"
                    />
                    <TextField
                      label="Secondary Color"
                      value={settings.appearance.secondaryColor}
                      onChange={(e) => handleSettingChange('appearance', 'secondaryColor', e.target.value)}
                      fullWidth
                      type="color"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Branding" />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      label="Logo URL"
                      value={settings.appearance.logoUrl}
                      onChange={(e) => handleSettingChange('appearance', 'logoUrl', e.target.value)}
                      fullWidth
                    />
                    <TextField
                      label="Favicon URL"
                      value={settings.appearance.faviconUrl}
                      onChange={(e) => handleSettingChange('appearance', 'faviconUrl', e.target.value)}
                      fullWidth
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseModal('appearance')}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Backup Dialog */}
      <AccessibleModal
        open={backupDialogOpen}
        onClose={() => setBackupDialogOpen(false)}
        title="Create System Backup"
        ariaDescribedBy="backup-description"
        actions={
          <>
            <Button onClick={() => setBackupDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={() => setBackupDialogOpen(false)}>
              Create Backup
            </Button>
          </>
        }
      >
        <Typography id="backup-description">
          This will create a complete backup of your system settings, user data, and content.
          The backup process may take several minutes depending on the amount of data.
        </Typography>
      </AccessibleModal>
    </Box>
  );
}
