/**
 * Notification Preferences Component
 * Advanced notification settings and preferences
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  FormGroup,
  Divider,
  Button,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
} from '@mui/material';
import { 
  Notifications as NotificationsIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Web as WebIcon,
  Schedule as ScheduleIcon,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
  PostAdd as PostAddIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

interface NotificationPreference {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  channels: {
    email: boolean;
    push: boolean;
    sms: boolean;
    inApp: boolean;
  };
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
    timezone: string;
  };
  conditions: {
    minSeverity: 'low' | 'medium' | 'high' | 'critical';
    platforms?: string[];
    contentTypes?: string[];
  };
}

interface NotificationChannel {
  id: string;
  name: string;
  type: 'email' | 'push' | 'sms' | 'inApp';
  enabled: boolean;
  verified: boolean;
  settings: Record<string, any>;
}

export function NotificationPreferences() {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [channels, setChannels] = useState<NotificationChannel[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Initialize preferences
  useEffect(() => {
    const defaultPreferences: NotificationPreference[] = [
      {
        id: 'post_success',
        name: 'Post Success',
        description: 'Notifications when posts are successfully published',
        enabled: true,
        channels: { email: true, push: true, sms: false, inApp: true },
        frequency: 'immediate',
        quietHours: { enabled: false, start: '22:00', end: '08:00', timezone: 'UTC' },
        conditions: { minSeverity: 'low' }
      },
      {
        id: 'post_failure',
        name: 'Post Failure',
        description: 'Notifications when posts fail to publish',
        enabled: true,
        channels: { email: true, push: true, sms: true, inApp: true },
        frequency: 'immediate',
        quietHours: { enabled: false, start: '22:00', end: '08:00', timezone: 'UTC' },
        conditions: { minSeverity: 'high' }
      },
      {
        id: 'scheduled_reminder',
        name: 'Scheduled Post Reminder',
        description: 'Reminders before scheduled posts go live',
        enabled: true,
        channels: { email: true, push: true, sms: false, inApp: true },
        frequency: 'immediate',
        quietHours: { enabled: true, start: '22:00', end: '08:00', timezone: 'UTC' },
        conditions: { minSeverity: 'medium' }
      },
      {
        id: 'oauth_alert',
        name: 'OAuth Connection Alert',
        description: 'Alerts when OAuth connections expire or fail',
        enabled: true,
        channels: { email: true, push: true, sms: false, inApp: true },
        frequency: 'immediate',
        quietHours: { enabled: false, start: '22:00', end: '08:00', timezone: 'UTC' },
        conditions: { minSeverity: 'high' }
      },
      {
        id: 'analytics_report',
        name: 'Analytics Report',
        description: 'Weekly analytics and performance reports',
        enabled: true,
        channels: { email: true, push: false, sms: false, inApp: true },
        frequency: 'weekly',
        quietHours: { enabled: false, start: '22:00', end: '08:00', timezone: 'UTC' },
        conditions: { minSeverity: 'low' }
      },
      {
        id: 'system_status',
        name: 'System Status',
        description: 'System maintenance and status updates',
        enabled: true,
        channels: { email: true, push: true, sms: false, inApp: true },
        frequency: 'immediate',
        quietHours: { enabled: false, start: '22:00', end: '08:00', timezone: 'UTC' },
        conditions: { minSeverity: 'medium' }
      }
    ];

    const defaultChannels: NotificationChannel[] = [
      {
        id: 'email',
        name: 'Email',
        type: 'email',
        enabled: true,
        verified: true,
        settings: { address: 'user@example.com' }
      },
      {
        id: 'push',
        name: 'Push Notifications',
        type: 'push',
        enabled: true,
        verified: true,
        settings: {}
      },
      {
        id: 'sms',
        name: 'SMS',
        type: 'sms',
        enabled: false,
        verified: false,
        settings: { phone: '+1234567890' }
      },
      {
        id: 'inApp',
        name: 'In-App Notifications',
        type: 'inApp',
        enabled: true,
        verified: true,
        settings: {}
      }
    ];

    setPreferences(defaultPreferences);
    setChannels(defaultChannels);
  }, []);

  // Update preference
  const updatePreference = (id: string, updates: Partial<NotificationPreference>) => {
    setPreferences(prev => prev.map(pref => 
      pref.id === id ? { ...pref, ...updates } : pref
    ));
  };

  // Update channel
  const updateChannel = (id: string, updates: Partial<NotificationChannel>) => {
    setChannels(prev => prev.map(channel => 
      channel.id === id ? { ...channel, ...updates } : channel
    ));
  };

  // Save preferences
  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  // Get channel icon
  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'email': return <EmailIcon />;
      case 'push': return <WebIcon />;
      case 'sms': return <PhoneIcon />;
      case 'inApp': return <NotificationsIcon />;
      default: return <NotificationsIcon />;
    }
  };

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h4" gutterBottom>
        Notification Preferences
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Customize how and when you receive notifications from CreatorFlow.
      </Typography>

      {/* Save Status */}
      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Preferences saved successfully!
        </Alert>
      )}

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Notification Types" icon={<NotificationsIcon />} />
          <Tab label="Channels" icon={<EmailIcon />} />
          <Tab label="Quiet Hours" icon={<ScheduleIcon />} />
          <Tab label="Advanced" icon={<SecurityIcon />} />
        </Tabs>
      </Box>

      {/* Notification Types Tab */}
      {activeTab === 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Notification Types
              </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Choose which types of notifications you want to receive and how.
              </Typography>

          {preferences.map((preference) => (
            <Accordion key={preference.id} defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={preference.enabled}
                        onChange={(e) => updatePreference(preference.id, { enabled: e.target.checked })}
                        onClick={(e) => e.stopPropagation()}
                      />
                    }
                    label=""
                    sx={{ mr: 2 }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{preference.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {preference.description}
                    </Typography>
                  </Box>
                  <Chip
                    label={preference.frequency}
                    size="small"
                    color={preference.enabled ? 'primary' : 'default'}
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Delivery Channels
                    </Typography>
                    <FormGroup>
                      {Object.entries(preference.channels).map(([channel, enabled]) => (
                        <FormControlLabel
                          key={channel}
                          control={
                            <Switch
                              checked={enabled}
                              onChange={(e) => updatePreference(preference.id, {
                                channels: { ...preference.channels, [channel]: e.target.checked }
                              })}
                            />
                          }
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {getChannelIcon(channel)}
                              <Typography sx={{ ml: 1, textTransform: 'capitalize' }}>
                                {channel}
                              </Typography>
                            </Box>
                          }
                        />
                      ))}
                    </FormGroup>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Frequency</InputLabel>
                      <Select
                        value={preference.frequency}
                        onChange={(e) => updatePreference(preference.id, { frequency: e.target.value as any })}
                        label="Frequency"
                      >
                        <MenuItem value="immediate">Immediate</MenuItem>
                        <MenuItem value="hourly">Hourly</MenuItem>
                        <MenuItem value="daily">Daily</MenuItem>
                        <MenuItem value="weekly">Weekly</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl fullWidth>
                      <InputLabel>Minimum Severity</InputLabel>
                      <Select
                        value={preference.conditions.minSeverity}
                        onChange={(e) => updatePreference(preference.id, {
                          conditions: { ...preference.conditions, minSeverity: e.target.value as any }
                        })}
                        label="Minimum Severity"
                      >
                        <MenuItem value="low">Low</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="high">High</MenuItem>
                        <MenuItem value="critical">Critical</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}

      {/* Channels Tab */}
      {activeTab === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Notification Channels
              </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Manage your notification delivery channels and settings.
              </Typography>

          <Grid container spacing={3}>
            {channels.map((channel) => (
              <Grid item xs={12} md={6} key={channel.id}>
                <Card>
            <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {getChannelIcon(channel.type)}
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        {channel.name}
                      </Typography>
                      <Box sx={{ flexGrow: 1 }} />
                      <Chip
                        label={channel.verified ? 'Verified' : 'Not Verified'}
                        color={channel.verified ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>

                    <FormControlLabel
                      control={
                        <Switch
                          checked={channel.enabled}
                          onChange={(e) => updateChannel(channel.id, { enabled: e.target.checked })}
                        />
                      }
                      label="Enable this channel"
                    />

                    {channel.type === 'email' && (
                      <TextField
                        fullWidth
                        label="Email Address"
                        value={channel.settings.address}
                        onChange={(e) => updateChannel(channel.id, {
                          settings: { ...channel.settings, address: e.target.value }
                        })}
                        sx={{ mt: 2 }}
                      />
                    )}

                    {channel.type === 'sms' && (
                      <TextField
                        fullWidth
                        label="Phone Number"
                        value={channel.settings.phone}
                        onChange={(e) => updateChannel(channel.id, {
                          settings: { ...channel.settings, phone: e.target.value }
                        })}
                        sx={{ mt: 2 }}
                      />
                    )}

                    {!channel.verified && (
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ mt: 2 }}
                        onClick={() => {
                          // Simulate verification
                          updateChannel(channel.id, { verified: true });
                        }}
                      >
                        Verify Channel
                      </Button>
                    )}
            </CardContent>
          </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Quiet Hours Tab */}
      {activeTab === 2 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Quiet Hours
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Set times when you don't want to receive notifications.
          </Typography>

          <Card>
            <CardContent>
              <FormControlLabel
                control={
                        <Switch
                    checked={preferences[0]?.quietHours.enabled || false}
                    onChange={(e) => {
                      preferences.forEach(pref => {
                        updatePreference(pref.id, {
                          quietHours: { ...pref.quietHours, enabled: e.target.checked }
                        });
                      });
                    }}
                  />
                }
                label="Enable Quiet Hours"
              />

              {preferences[0]?.quietHours.enabled && (
                <Grid container spacing={3} sx={{ mt: 2 }}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Start Time"
                      type="time"
                      value={preferences[0]?.quietHours.start || '22:00'}
                      onChange={(e) => {
                        preferences.forEach(pref => {
                          updatePreference(pref.id, {
                            quietHours: { ...pref.quietHours, start: e.target.value }
                          });
                        });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="End Time"
                      type="time"
                      value={preferences[0]?.quietHours.end || '08:00'}
                      onChange={(e) => {
                        preferences.forEach(pref => {
                          updatePreference(pref.id, {
                            quietHours: { ...pref.quietHours, end: e.target.value }
                          });
                        });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Timezone</InputLabel>
                      <Select
                        value={preferences[0]?.quietHours.timezone || 'UTC'}
                        onChange={(e) => {
                          preferences.forEach(pref => {
                            updatePreference(pref.id, {
                              quietHours: { ...pref.quietHours, timezone: e.target.value }
                            });
                          });
                        }}
                        label="Timezone"
                      >
                        <MenuItem value="UTC">UTC</MenuItem>
                        <MenuItem value="America/New_York">Eastern Time</MenuItem>
                        <MenuItem value="America/Chicago">Central Time</MenuItem>
                        <MenuItem value="America/Denver">Mountain Time</MenuItem>
                        <MenuItem value="America/Los_Angeles">Pacific Time</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Advanced Tab */}
      {activeTab === 3 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Advanced Settings
              </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Fine-tune your notification experience with advanced options.
              </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
            <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Notification Limits
                  </Typography>
                  <TextField
                    fullWidth
                    label="Max Notifications Per Hour"
                    type="number"
                    defaultValue={10}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Max Notifications Per Day"
                    type="number"
                    defaultValue={50}
                  />
            </CardContent>
          </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Content Filtering
                  </Typography>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Filter duplicate notifications"
                  />
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Group similar notifications"
                  />
                  <FormControlLabel
                    control={<Switch />}
                    label="Include detailed error messages"
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Save Button */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={saving}
          size="large"
        >
          {saving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </Box>
    </Box>
  );
}

export default NotificationPreferences; 