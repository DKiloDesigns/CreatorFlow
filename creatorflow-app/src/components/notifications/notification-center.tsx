'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Bell, X, Check, Trash2, Filter, Settings, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Notification, NotificationType, NotificationSeverity, NotificationCategory } from '@/lib/notifications/types';
import { NotificationToast } from '@/components/ui/notification-badge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface NotificationCenterProps {
  className?: string;
  onNotificationClick?: (notification: Notification) => void;
}

interface NotificationFilters {
  severity: NotificationSeverity[];
  category: NotificationCategory[];
  type: NotificationType[];
  unreadOnly: boolean;
}

const SEVERITY_COLORS = {
  critical: 'bg-red-500 text-white',
  high: 'bg-orange-500 text-white',
  medium: 'bg-yellow-500 text-white',
  low: 'bg-blue-500 text-white',
  info: 'bg-gray-500 text-white',
};

const CATEGORY_ICONS = {
  system: '🔧',
  security: '🔒',
  performance: '⚡',
  content: '📝',
  billing: '💳',
  team: '👥',
  analytics: '📊',
  platform: '🌐',
  maintenance: '🛠️',
  feature: '✨',
  feedback: '💬',
  collaboration: '🤝',
  data: '📊',
  api: '🔌',
  storage: '💾',
  subscription: '📦',
};

export function NotificationCenter({ className, onNotificationClick }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<NotificationFilters>({
    severity: [],
    category: [],
    type: [],
    unreadOnly: false,
  });
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'system' | 'security' | 'content'>('all');
  const [toast, setToast] = useState<{ title: string; message?: string; variant: 'success' | 'error' | 'info' } | null>(null);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.unreadOnly) params.append('unreadOnly', 'true');
      if (filters.type.length > 0) params.append('type', filters.type.join(','));
      if (filters.category.length > 0) params.append('category', filters.category.join(','));
      params.append('limit', '50');

      const response = await fetch(`/api/notifications/enhanced?${params}`);
      if (!response.ok) throw new Error('Failed to fetch notifications');
      
      const data = await response.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.notifications?.filter((n: Notification) => !n.read).length || 0);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setToast({ title: 'Error', message: 'Failed to load notifications', variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications/enhanced', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_read', notificationId }),
      });

      if (!response.ok) throw new Error('Failed to mark notification as read');

      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, read: true, readAt: new Date() } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/enhanced', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_all_read' }),
      });

      if (!response.ok) throw new Error('Failed to mark all notifications as read');

      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true, readAt: new Date() }))
      );
      setUnreadCount(0);
      setToast({ title: 'Success', message: 'All notifications marked as read', variant: 'success' });
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      setToast({ title: 'Error', message: 'Failed to mark all notifications as read', variant: 'error' });
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications/enhanced', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', notificationId }),
      });

      if (!response.ok) throw new Error('Failed to delete notification');

      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      setUnreadCount(prev => {
        const notification = notifications.find(n => n.id === notificationId);
        return notification && !notification.read ? Math.max(0, prev - 1) : prev;
      });
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  // Filter notifications based on active tab and filters
  const filteredNotifications = notifications.filter(notification => {
    // Tab filtering
    if (activeTab === 'unread' && notification.read) return false;
    if (activeTab === 'system' && notification.category !== 'system') return false;
    if (activeTab === 'security' && notification.category !== 'security') return false;
    if (activeTab === 'content' && !['content', 'analytics'].includes(notification.category)) return false;

    // Additional filters
    if (filters.severity.length > 0 && !filters.severity.includes(notification.severity)) return false;
    if (filters.category.length > 0 && !filters.category.includes(notification.category)) return false;
    if (filters.type.length > 0 && !filters.type.includes(notification.type)) return false;
    if (filters.unreadOnly && notification.read) return false;

    return true;
  });

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    onNotificationClick?.(notification);
  };

  // Format timestamp
  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  // Load notifications on mount and when filters change
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Set up real-time updates (WebSocket or polling)
  useEffect(() => {
    const interval = setInterval(() => {
      if (isOpen) {
        fetchNotifications();
      }
    }, 30000); // Poll every 30 seconds when open

    return () => clearInterval(interval);
  }, [isOpen, fetchNotifications]);

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0" align="end">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">Notifications</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={fetchNotifications}
                disabled={isLoading}
              >
                <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              </Button>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  Mark all read
                </Button>
              )}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
              <TabsTrigger value="unread" className="text-xs">
                Unread {unreadCount > 0 && `(${unreadCount})`}
              </TabsTrigger>
              <TabsTrigger value="system" className="text-xs">System</TabsTrigger>
              <TabsTrigger value="security" className="text-xs">Security</TabsTrigger>
              <TabsTrigger value="content" className="text-xs">Content</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              <ScrollArea className="h-80">
                {isLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <RefreshCw className="h-6 w-6 animate-spin" />
                  </div>
                ) : filteredNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <Bell className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">No notifications</p>
                  </div>
                ) : (
                  <div className="space-y-1 p-2">
                    {filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "group relative p-3 rounded-lg border cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800",
                          !notification.read && "bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800",
                          notification.read && "opacity-75"
                        )}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <span className="text-lg">{CATEGORY_ICONS[notification.category]}</span>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-sm leading-tight">
                                {notification.title}
                              </h4>
                              <Badge
                                variant="secondary"
                                className={cn("text-xs", SEVERITY_COLORS[notification.severity])}
                              >
                                {notification.severity}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                {formatTimestamp(notification.createdAt)}
                              </span>
                              
                              {notification.actionUrl && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(notification.actionUrl, '_blank');
                                  }}
                                >
                                  {notification.actionText || 'View'}
                                </Button>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-red-500 hover:text-red-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>

      {toast && (
        <NotificationToast
          title={toast.title}
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
} 