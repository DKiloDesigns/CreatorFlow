'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Typography,
  Box,
  Tabs,
  Tab
} from '@mui/material';
import {
  Notifications as BellIcon,
  TrendingUp as ActivityIcon,
  Settings as SettingsIcon,
  Search as SearchIcon,
  Refresh as RefreshCwIcon
} from '@mui/icons-material';
import { Badge } from '@/components/ui/badge';
import { CardDescription } from '@/components/ui/base/Card';
import { Input } from '@/components/ui/input';
import { NotificationCenter } from '@/components/notifications/notification-center';
import { NotificationPreferences } from '@/components/notifications/notification-preferences';
import { useRealTimeNotifications } from '@/components/notifications/real-time-provider';

export default function EnhancedNotificationsPage() {
  const { notifications, unreadCount, isConnected, markAllAsRead } = useRealTimeNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('notifications');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  const filteredNotifications = notifications.filter(notification =>
    notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: notifications.length,
    unread: unreadCount,
    bySeverity: {
      critical: notifications.filter(n => n.severity === 'critical').length,
      high: notifications.filter(n => n.severity === 'high').length,
      medium: notifications.filter(n => n.severity === 'medium').length,
      low: notifications.filter(n => n.severity === 'low').length,
      info: notifications.filter(n => n.severity === 'info').length,
    },
    byCategory: {
      system: notifications.filter(n => n.category === 'system').length,
      security: notifications.filter(n => n.category === 'security').length,
      content: notifications.filter(n => n.category === 'content').length,
      billing: notifications.filter(n => n.category === 'billing').length,
      analytics: notifications.filter(n => n.category === 'analytics').length,
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your notifications and preferences
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isConnected ? "default" : "secondary"} className="flex items-center gap-1" label={isConnected ? 'Connected' : 'Disconnected'} />
          <NotificationCenter />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Typography variant="subtitle2" className="text-sm font-medium">Total Notifications</Typography>
            <BellIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {stats.unread} unread
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Typography variant="subtitle2" className="text-sm font-medium">Critical Alerts</Typography>
            <Badge variant="destructive" className="text-xs" label={stats.bySeverity.critical.toString()} />
          </CardHeader>
          <CardContent>
            <Typography variant="h6" sx={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'error.main' }}>{stats.bySeverity.critical}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Require immediate attention
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Typography variant="subtitle2" className="text-sm font-medium">Security Alerts</Typography>
            <Badge variant="secondary" className="text-xs" label={stats.byCategory.security.toString()} />
          </CardHeader>
          <CardContent>
            <Typography variant="h6" sx={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'warning.main' }}>{stats.byCategory.security}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Security-related notifications
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Typography variant="subtitle2" className="text-sm font-medium">Content Updates</Typography>
            <Badge variant="secondary" className="text-xs" label={stats.byCategory.content.toString()} />
          </CardHeader>
          <CardContent>
            <Typography variant="h6" sx={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'info.main' }}>{stats.byCategory.content}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Content and publishing updates
            </Typography>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 2 }}>
        <Tab
          value="notifications"
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BellIcon sx={{ fontSize: 16 }} />
              Notifications
            </Box>
          }
        />
        <Tab
          value="preferences"
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SettingsIcon sx={{ fontSize: 16 }} />
              Preferences
            </Box>
          }
        />
      </Tabs>

      {activeTab === 'notifications' && (
        <Box sx={{ p: 0 }}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="h6">All Notifications</Typography>
                  <CardDescription>
                    View and manage your notifications
                  </CardDescription>
                </div>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ position: 'relative' }}>
                    <SearchIcon sx={{ position: 'absolute', left: 8, top: 8, fontSize: 16, color: 'text.secondary' }} />
                    <Input
                      placeholder="Search notifications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </Box>
                  <Button
                    variant="outlined"
                    onClick={() => window.location.reload()}
                  >
                    <RefreshCwIcon sx={{ fontSize: 16 }} />
                  </Button>
                  {unreadCount > 0 && (
                    <Button onClick={markAllAsRead} variant="outlined">
                      Mark all read
                    </Button>
                  )}
                </Box>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-8">
                    <BellIcon sx={{ fontSize: 48, color: 'text.disabled', mx: 'auto', mb: 4 }} />
                    <Typography variant="h6" sx={{ fontWeight: 500, color: 'text.primary', mb: 1 }}>
                      {searchTerm ? 'No notifications found' : 'No notifications'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {searchTerm
                        ? 'Try adjusting your search terms'
                        : 'You\'re all caught up! New notifications will appear here.'
                      }
                    </Typography>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-lg border transition-colors ${
                          notification.read
                            ? 'bg-gray-50 dark:bg-gray-800'
                            : 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>{notification.title}</Typography>
                              <Badge variant="secondary" className="text-xs" label={notification.severity.toString()} />
                              <Badge variant="outline" className="text-xs" label={notification.category.toString()} />
                              {!notification.read && (
                                <Badge variant="default" className="text-xs" label="New" />
                              )}
                            </div>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                              {notification.message}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'text.disabled' }}>
                              <span>{notification.type}</span>
                              <span>
                                {new Date(notification.createdAt).toLocaleDateString()} at{' '}
                                {new Date(notification.createdAt).toLocaleTimeString()}
                              </span>
                            </Box>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </Box>
      )}

      {activeTab === 'preferences' && (
        <Box sx={{ p: 0 }}>
          <NotificationPreferences />
        </Box>
      )}

      {/* Bottom Spacer to Clear Bottom Navigation */}
      <Box sx={{
        height: { xs: '120px', sm: '40px' },
        width: '100%'
      }} />
    </div>
  );
} 