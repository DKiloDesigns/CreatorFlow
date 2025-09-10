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
import { Bell, Activity, Settings, Search, RefreshCw } from 'lucide-react';
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
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.unread} unread
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Typography variant="subtitle2" className="text-sm font-medium">Critical Alerts</Typography>
            <Badge variant="destructive" className="text-xs" label={stats.bySeverity.critical.toString()} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.bySeverity.critical}</div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Typography variant="subtitle2" className="text-sm font-medium">Security Alerts</Typography>
            <Badge variant="secondary" className="text-xs" label={stats.byCategory.security.toString()} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.byCategory.security}</div>
            <p className="text-xs text-muted-foreground">
              Security-related notifications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Typography variant="subtitle2" className="text-sm font-medium">Content Updates</Typography>
            <Badge variant="secondary" className="text-xs" label={stats.byCategory.content.toString()} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.byCategory.content}</div>
            <p className="text-xs text-muted-foreground">
              Content and publishing updates
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 2 }}>
        <Tab 
          value="notifications" 
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Bell size={16} />
              Notifications
            </Box>
          } 
        />
        <Tab 
          value="preferences" 
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Settings size={16} />
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
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search notifications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                  <Button
                    variant="outlined"
                    onClick={() => window.location.reload()}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  {unreadCount > 0 && (
                    <Button onClick={markAllAsRead} variant="outlined">
                      Mark all read
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {searchTerm ? 'No notifications found' : 'No notifications'}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {searchTerm 
                        ? 'Try adjusting your search terms'
                        : 'You\'re all caught up! New notifications will appear here.'
                      }
                    </p>
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
                              <h4 className="font-medium">{notification.title}</h4>
                              <Badge variant="secondary" className="text-xs" label={notification.severity.toString()} />
                              <Badge variant="outline" className="text-xs" label={notification.category.toString()} />
                              {!notification.read && (
                                <Badge variant="default" className="text-xs" label="New" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>{notification.type}</span>
                              <span>
                                {new Date(notification.createdAt).toLocaleDateString()} at{' '}
                                {new Date(notification.createdAt).toLocaleTimeString()}
                              </span>
                            </div>
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