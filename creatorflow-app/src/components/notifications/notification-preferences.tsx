'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/mui-card';
import { Typography, Button, Box } from '@mui/material';
import { 
  Bell, 
  Activity
} from 'lucide-react';
import { Tabs, Tab, TabPanel } from '@mui/material';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

import type { NotificationPreferences, NotificationType, NotificationCategory, NotificationChannel } from '@/lib/notifications/types';
import { NotificationToast } from '@/components/ui/notification-badge';

interface NotificationPreferencesProps {
  className?: string;
}

const NOTIFICATION_TYPES: { key: NotificationType; label: string; description: string; icon: string }[] = [
  { key: 'system_alert', label: 'System Alerts', description: 'System maintenance and updates', icon: '🔧' },
  { key: 'security_alert', label: 'Security Alerts', description: 'Login attempts and security events', icon: '🔒' },
  { key: 'performance_alert', label: 'Performance Alerts', description: 'System performance issues', icon: '⚡' },
  { key: 'content_alert', label: 'Content Alerts', description: 'Content scheduling and publishing', icon: '📝' },
  { key: 'billing_alert', label: 'Billing Alerts', description: 'Payment and subscription updates', icon: '💳' },
  { key: 'team_invitation', label: 'Team Invitations', description: 'Team collaboration requests', icon: '👥' },
  { key: 'content_approval', label: 'Content Approval', description: 'Content review requests', icon: '✅' },
  { key: 'analytics_insight', label: 'Analytics Insights', description: 'Performance insights and milestones', icon: '📊' },
  { key: 'scheduled_post', label: 'Scheduled Posts', description: 'Post scheduling confirmations', icon: '📅' },
  { key: 'engagement_milestone', label: 'Engagement Milestones', description: 'Achievement notifications', icon: '🏆' },
  { key: 'platform_update', label: 'Platform Updates', description: 'Feature updates and announcements', icon: '🌐' },
  { key: 'maintenance_notice', label: 'Maintenance Notices', description: 'Scheduled maintenance alerts', icon: '🛠️' },
  { key: 'feature_announcement', label: 'Feature Announcements', description: 'New feature releases', icon: '✨' },
  { key: 'feedback_response', label: 'Feedback Responses', description: 'Responses to your feedback', icon: '💬' },
  { key: 'collaboration_request', label: 'Collaboration Requests', description: 'Team collaboration updates', icon: '🤝' },
  { key: 'data_export_ready', label: 'Data Export Ready', description: 'Data export completion', icon: '📊' },
  { key: 'api_rate_limit', label: 'API Rate Limits', description: 'API usage warnings', icon: '🔌' },
  { key: 'storage_warning', label: 'Storage Warnings', description: 'Storage space alerts', icon: '💾' },
  { key: 'subscription_expiry', label: 'Subscription Expiry', description: 'Subscription renewal reminders', icon: '📦' },
  { key: 'trial_ending', label: 'Trial Ending', description: 'Trial period expiration', icon: '⏰' },
];

const NOTIFICATION_CATEGORIES: { key: NotificationCategory; label: string; description: string; icon: string }[] = [
  { key: 'system', label: 'System', description: 'System-related notifications', icon: '🔧' },
  { key: 'security', label: 'Security', description: 'Security and authentication alerts', icon: '🔒' },
  { key: 'performance', label: 'Performance', description: 'Performance and optimization alerts', icon: '⚡' },
  { key: 'content', label: 'Content', description: 'Content management notifications', icon: '📝' },
  { key: 'billing', label: 'Billing', description: 'Payment and subscription notifications', icon: '💳' },
  { key: 'team', label: 'Team', description: 'Team collaboration notifications', icon: '👥' },
  { key: 'analytics', label: 'Analytics', description: 'Analytics and insights notifications', icon: '📊' },
  { key: 'platform', label: 'Platform', description: 'Platform updates and announcements', icon: '🌐' },
  { key: 'maintenance', label: 'Maintenance', description: 'Maintenance and downtime alerts', icon: '🛠️' },
  { key: 'feature', label: 'Feature', description: 'New feature announcements', icon: '✨' },
  { key: 'feedback', label: 'Feedback', description: 'Feedback and support notifications', icon: '💬' },
  { key: 'collaboration', label: 'Collaboration', description: 'Collaboration and sharing notifications', icon: '🤝' },
  { key: 'data', label: 'Data', description: 'Data export and import notifications', icon: '📊' },
  { key: 'api', label: 'API', description: 'API usage and rate limit notifications', icon: '🔌' },
  { key: 'storage', label: 'Storage', description: 'Storage and quota notifications', icon: '💾' },
  { key: 'subscription', label: 'Subscription', description: 'Subscription and billing notifications', icon: '📦' },
];

const NOTIFICATION_CHANNELS: { key: NotificationChannel; label: string; description: string; icon: React.ReactNode }[] = [
  { key: 'in_app', label: 'In-App', description: 'Notifications within the application', icon: <Bell className="h-4 w-4" /> },
  { key: 'email', label: 'Email', description: 'Email notifications', icon: <Activity className="h-4 w-4" /> },
  { key: 'push', label: 'Push', description: 'Browser push notifications', icon: <Activity className="h-4 w-4" /> },
  { key: 'sms', label: 'SMS', description: 'Text message notifications', icon: <Activity className="h-4 w-4" /> },
  { key: 'webhook', label: 'Webhook', description: 'Webhook notifications', icon: <Activity className="h-4 w-4" /> },
];

export function NotificationPreferences({ className }: NotificationPreferencesProps) {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ title: string; message?: string; variant: 'success' | 'error' | 'info' } | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  // Load preferences
  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const response = await fetch('/api/notifications/enhanced');
      if (!response.ok) throw new Error('Failed to load preferences');
      
      const data = await response.json();
      setPreferences(data.preferences || null);
    } catch (error) {
      console.error('Failed to load notification preferences:', error);
      setToast({ title: 'Error', message: 'Failed to load notification preferences', variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Save preferences
  const savePreferences = async () => {
    if (!preferences) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/notifications/enhanced', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences }),
      });

      if (!response.ok) throw new Error('Failed to save preferences');

      setToast({ title: 'Success', message: 'Notification preferences saved', variant: 'success' });
    } catch (error) {
      console.error('Failed to save notification preferences:', error);
      setToast({ title: 'Error', message: 'Failed to save notification preferences', variant: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  // Update global settings
  const updateGlobalSettings = (field: keyof NotificationPreferences['global'], value: any) => {
    if (!preferences) return;
    
    setPreferences(prev => prev ? {
      ...prev,
      global: {
        ...prev.global,
        [field]: value,
      },
    } : null);
  };

  // Update type preferences
  const updateTypePreferences = (type: NotificationType, field: 'enabled' | 'channels' | 'priority', value: any) => {
    if (!preferences) return;
    
    setPreferences(prev => prev ? {
      ...prev,
      types: {
        ...prev.types,
        [type]: {
          ...prev.types[type],
          [field]: value,
        },
      },
    } : null);
  };

  // Update category preferences
  const updateCategoryPreferences = (category: NotificationCategory, field: 'enabled' | 'channels' | 'priority', value: any) => {
    if (!preferences) return;
    
    setPreferences(prev => prev ? {
      ...prev,
      categories: {
        ...prev.categories,
        [category]: {
          ...prev.categories[category],
          [field]: value,
        },
      },
    } : null);
  };

  // Toggle channel for type
  const toggleChannelForType = (type: NotificationType, channel: NotificationChannel) => {
    if (!preferences) return;
    
    const currentChannels = preferences.types[type]?.channels || [];
    const newChannels = currentChannels.includes(channel)
      ? currentChannels.filter(c => c !== channel)
      : [...currentChannels, channel];
    
    updateTypePreferences(type, 'channels', newChannels);
  };

  // Toggle channel for category
  const toggleChannelForCategory = (category: NotificationCategory, channel: NotificationChannel) => {
    if (!preferences) return;
    
    const currentChannels = preferences.categories[category]?.channels || [];
    const newChannels = currentChannels.includes(channel)
      ? currentChannels.filter(c => c !== channel)
      : [...currentChannels, channel];
    
    updateCategoryPreferences(category, 'channels', newChannels);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">Failed to load notification preferences</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Notification Preferences</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Configure how and when you receive notifications
          </p>
        </div>
        <Button onClick={savePreferences} disabled={isSaving}>
          <Activity className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>

      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} className="space-y-6">
        <Tab label="Global Settings" />
        <Tab label="Notification Types" />
        <Tab label="Categories" />
        <Tab label="Channels" />

        <TabPanel value={activeTab} index={0} className="space-y-6">
          <Card>
            <CardHeader>
              <Typography variant="h5" component="div" className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Global Settings
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Configure general notification settings
              </Typography>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Global Enable/Disable */}
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="global-enabled">Enable Notifications</Label>
                  <p className="text-sm text-gray-500">Turn all notifications on or off</p>
                </div>
                <Switch
                  id="global-enabled"
                  checked={preferences.global.enabled}
                  onChange={(e) => updateGlobalSettings('enabled', e.target.checked)}
                />
              </div>

              <Separator />

              {/* Global Channels */}
              <div>
                <Label className="text-base font-medium">Default Channels</Label>
                <p className="text-sm text-gray-500 mb-3">Choose which channels to use by default</p>
                <div className="grid grid-cols-2 gap-4">
                  {NOTIFICATION_CHANNELS.map((channel) => (
                    <div key={channel.key} className="flex items-center space-x-2">
                      <Switch
                        checked={preferences.global.channels.includes(channel.key)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          const currentChannels = preferences.global.channels;
                          const newChannels = checked
                            ? [...currentChannels, channel.key]
                            : currentChannels.filter(c => c !== channel.key);
                          updateGlobalSettings('channels', newChannels);
                        }}
                      />
                      <div className="flex items-center">
                        {channel.icon}
                        <span className="ml-1">{channel.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Quiet Hours */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <Label className="text-base font-medium">Quiet Hours</Label>
                    <p className="text-sm text-gray-500">Set times when notifications are silenced</p>
                  </div>
                  <Switch
                    checked={preferences.global.quietHours.enabled}
                    onChange={(e) => 
                      updateGlobalSettings('quietHours', { ...preferences.global.quietHours, enabled: e.target.checked })
                    }
                  />
                </div>
                
                {preferences.global.quietHours.enabled && (
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="quiet-start">Start Time</Label>
                      <input
                        id="quiet-start"
                        type="time"
                        value={preferences.global.quietHours.start}
                        onChange={(e) => 
                          updateGlobalSettings('quietHours', { ...preferences.global.quietHours, start: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="quiet-end">End Time</Label>
                      <input
                        id="quiet-end"
                        type="time"
                        value={preferences.global.quietHours.end}
                        onChange={(e) => 
                          updateGlobalSettings('quietHours', { ...preferences.global.quietHours, end: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="quiet-timezone">Timezone</Label>
                      <select
                        id="quiet-timezone"
                        value={preferences.global.quietHours.timezone}
                        onChange={(e) => 
                          updateGlobalSettings('quietHours', { ...preferences.global.quietHours, timezone: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value={activeTab} index={1} className="space-y-6">
          <Card>
            <CardHeader>
              <Typography variant="h5" component="div">
                Notification Types
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Configure preferences for specific notification types
              </Typography>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {NOTIFICATION_TYPES.map((type) => {
                  const typePrefs = preferences.types[type.key];
                  return (
                    <div key={type.key} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{type.icon}</span>
                          <div>
                            <Typography variant="subtitle1">{type.label}</Typography>
                            <Typography variant="body2" color="text.secondary">{type.description}</Typography>
                          </div>
                        </div>
                        <Switch
                          checked={typePrefs?.enabled || false}
                          onChange={(e) => updateTypePreferences(type.key, 'enabled', e.target.checked)}
                        />
                      </div>
                      
                      {typePrefs?.enabled && (
                        <div className="space-y-3">
                          <div>
                            <Label className="text-sm font-medium">Channels</Label>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {NOTIFICATION_CHANNELS.map((channel) => (
                                <Badge
                                  key={channel.key}
                                  variant={typePrefs.channels.includes(channel.key) ? "default" : "secondary"}
                                  className="cursor-pointer"
                                  onClick={() => toggleChannelForType(type.key, channel.key)}
                                >
                                  {channel.icon}
                                  <span className="ml-1">{channel.label}</span>
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium">Priority</Label>
                            <select
                              value={typePrefs.priority}
                              onChange={(e) => updateTypePreferences(type.key, 'priority', e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            >
                              <option value="urgent">Urgent</option>
                              <option value="high">High</option>
                              <option value="normal">Normal</option>
                              <option value="low">Low</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value={activeTab} index={2} className="space-y-6">
          <Card>
            <CardHeader>
              <Typography variant="h5" component="div">
                Notification Categories
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Configure preferences for notification categories
              </Typography>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {NOTIFICATION_CATEGORIES.map((category) => {
                  const categoryPrefs = preferences.categories[category.key];
                  return (
                    <div key={category.key} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{category.icon}</span>
                          <div>
                            <Typography variant="subtitle1">{category.label}</Typography>
                            <Typography variant="body2" color="text.secondary">{category.description}</Typography>
                          </div>
                        </div>
                        <Switch
                          checked={categoryPrefs?.enabled || false}
                          onChange={(e) => updateCategoryPreferences(category.key, 'enabled', e.target.checked)}
                        />
                      </div>
                      
                      {categoryPrefs?.enabled && (
                        <div className="space-y-3">
                          <div>
                            <Label className="text-sm font-medium">Channels</Label>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {NOTIFICATION_CHANNELS.map((channel) => (
                                <Badge
                                  key={channel.key}
                                  variant={categoryPrefs.channels.includes(channel.key) ? "default" : "secondary"}
                                  className="cursor-pointer"
                                  onClick={() => toggleChannelForCategory(category.key, channel.key)}
                                >
                                  {channel.icon}
                                  <span className="ml-1">{channel.label}</span>
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium">Priority</Label>
                            <select
                              value={categoryPrefs.priority}
                              onChange={(e) => updateCategoryPreferences(category.key, 'priority', e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            >
                              <option value="urgent">Urgent</option>
                              <option value="high">High</option>
                              <option value="normal">Normal</option>
                              <option value="low">Low</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value={activeTab} index={3} className="space-y-6">
          <Card>
            <CardHeader>
              <Typography variant="h5" component="div">
                Notification Channels
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Configure how notifications are delivered
              </Typography>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {NOTIFICATION_CHANNELS.map((channel) => (
                  <div key={channel.key} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {channel.icon}
                      </div>
                      <div className="flex-1">
                        <Typography variant="subtitle1">{channel.label}</Typography>
                        <Typography variant="body2" color="text.secondary">{channel.description}</Typography>
                      </div>
                        <Badge variant="secondary" label={preferences.global.channels.includes(channel.key) ? 'Enabled' : 'Disabled'} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabPanel>
      </Tabs>

      {toast && (
        <NotificationToast
          title={toast.title}
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
} 