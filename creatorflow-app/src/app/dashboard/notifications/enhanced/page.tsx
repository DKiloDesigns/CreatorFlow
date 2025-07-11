'use client';

import React, { useState } from 'react';
import { Bell, Settings, Filter, Search, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { NotificationCenter } from '@/components/notifications/notification-center';
import { NotificationPreferences } from '@/components/notifications/notification-preferences';
import { useRealTimeNotifications } from '@/components/notifications/real-time-provider';

export default function EnhancedNotificationsPage() {
  const { notifications, unreadCount, isConnected, markAllAsRead } = useRealTimeNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('notifications');

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
          <Badge variant={isConnected ? "default" : "secondary"} className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
            {isConnected ? 'Connected' : 'Disconnected'}
          </Badge>
          <NotificationCenter />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
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
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <Badge variant="destructive" className="text-xs">
              {stats.bySeverity.critical}
            </Badge>
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
            <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
            <Badge variant="secondary" className="text-xs">
              {stats.byCategory.security}
            </Badge>
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
            <CardTitle className="text-sm font-medium">Content Updates</CardTitle>
            <Badge variant="secondary" className="text-xs">
              {stats.byCategory.content}
            </Badge>
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Notifications</CardTitle>
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
                    variant="outline"
                    size="icon"
                    onClick={() => window.location.reload()}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  {unreadCount > 0 && (
                    <Button onClick={markAllAsRead} variant="outline">
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
                              <Badge variant="secondary" className="text-xs">
                                {notification.severity}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {notification.category}
                              </Badge>
                              {!notification.read && (
                                <Badge variant="default" className="text-xs">
                                  New
                                </Badge>
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
        </TabsContent>

        <TabsContent value="preferences">
          <NotificationPreferences />
        </TabsContent>
      </Tabs>
    </div>
  );
} 