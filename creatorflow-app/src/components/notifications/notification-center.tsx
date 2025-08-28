'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Button,
  Box,
  Typography,
  Paper,
  Chip
} from '@mui/material';
import { Bell, Check, Trash2, RefreshCw } from 'lucide-react';
import { Notification, NotificationType, NotificationSeverity, NotificationCategory } from '@/lib/notifications/types';
import { NotificationToast } from '@/components/ui/notification-badge';
import { cn } from '@/lib/utils';

import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

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

export function NotificationCenter({ className: _className, onNotificationClick }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, _setFilters] = useState<NotificationFilters>({
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

      if (response.ok) {
        setNotifications(prev => prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
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

      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications/enhanced', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId }),
      });

      if (response.ok) {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        const deletedNotification = notifications.find(n => n.id === notificationId);
        if (deletedNotification && !deletedNotification.read) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
  };

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter(notification => {
    switch (activeTab) {
      case 'unread':
        return !notification.read;
      case 'system':
        return notification.category === 'system';
      case 'security':
        return notification.category === 'security';
      case 'content':
        return notification.category === 'content';
      default:
        return true;
    }
  });

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

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
            variant="text"
            size="small"
            sx={{ position: 'relative' }}
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-black" />
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Notifications</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                variant="text"
                size="small"
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
                  sx={{ fontSize: '0.75rem' }}
                >
                  Mark all read
                </Button>
              )}
            </Box>
          </Box>

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
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
                    <RefreshCw className="h-6 w-6 animate-spin" aria-label="Loading notifications" />
                  </Box>
                ) : filteredNotifications.length === 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4, textAlign: 'center' }}>
                    <Bell className="h-8 w-8 text-gray-400 mb-2" aria-label="No notifications" />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>No notifications</Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, p: 1 }}>
                    {filteredNotifications.map((notification) => (
                      <Paper
                        key={notification.id}
                        sx={{
                          position: 'relative',
                          p: 1.5,
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          '&:hover': { 
                            bgcolor: 'action.hover',
                            '& .dark &': { bgcolor: 'grey.800' }
                          },
                          ...(!notification.read && {
                            bgcolor: 'primary.50',
                            borderColor: 'primary.200',
                            '& .dark &': { 
                              bgcolor: 'primary.950',
                              borderColor: 'primary.800'
                            }
                          }),
                          ...(notification.read && {
                            opacity: 0.75
                          })
                        }}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                          <Box sx={{ flexShrink: 0 }}>
                            <Typography variant="h6">{CATEGORY_ICONS[notification.category]}</Typography>
                          </Box>
                          
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 500, fontSize: '0.875rem', lineHeight: 'tight' }}>
                                {notification.title}
                              </Typography>
                              <Badge
                                variant="secondary"
                                className={cn("text-xs", SEVERITY_COLORS[notification.severity])}
                              >
                                {notification.severity}
                              </Badge>
                            </Box>
                            
                            <Typography variant="body2" sx={{ 
                              color: 'text.secondary', 
                              mb: 1,
                              '& .dark &': { color: 'grey.300' }
                            }}>
                              {notification.message}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                                {formatTimestamp(notification.createdAt)}
                              </Typography>
                              
                              {notification.actionUrl && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  sx={{ fontSize: '0.75rem' }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(notification.actionUrl, '_blank');
                                  }}
                                >
                                  {notification.actionText || 'View'}
                                </Button>
                              )}
                            </Box>
                          </Box>
                          
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 0.5, 
                            opacity: 0, 
                            '&:hover': { opacity: 1 }, 
                            transition: 'opacity 0.2s' 
                          }}>
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="icon"
                                sx={{ height: 24, width: 24 }}
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
                              sx={{ 
                                height: 24, 
                                width: 24, 
                                color: 'error.main',
                                '&:hover': { color: 'error.dark' }
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </Box>
                        </Box>
                      </Paper>
                    ))}
                  </Box>
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