/**
 * Notification Center Component
 * Real-time notification display and management
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Badge,
  Typography,
  Button,
  Chip,
  Divider,
  Tooltip,
  Menu,
  MenuItem,
  Switch,
  FormControlLabel,
  FormGroup,
  Paper,
  Fade,
  Slide,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon,
  MarkEmailRead as MarkEmailReadIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
// import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  category: 'post' | 'oauth' | 'system' | 'scheduled' | 'general';
  actionUrl?: string;
  actionText?: string;
  metadata?: Record<string, any>;
}

interface NotificationCenterProps {
  userId?: string;
  onNotificationClick?: (notification: Notification) => void;
}

export function NotificationCenter({ userId = 'default', onNotificationClick }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | Notification['category']>('all');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch notifications
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        userId,
        unreadOnly: filter === 'unread' ? 'true' : 'false',
        ...(filter !== 'all' && filter !== 'unread' && { category: filter })
      });

      const response = await fetch(`/api/notifications?${params}`);
      const data = await response.json();

      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'markAsRead',
          notificationId
        })
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId ? { ...notif, read: true } : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'markAllAsRead',
          userId
        })
      });

      if (response.ok) {
        setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications?notificationId=${notificationId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Get notification icon
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon color="success" />;
      case 'error':
        return <ErrorIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'info':
        return <InfoIcon color="info" />;
      default:
        return <InfoIcon />;
    }
  };

  // Get notification color
  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'success.main';
      case 'error':
        return 'error.main';
      case 'warning':
        return 'warning.main';
      case 'info':
        return 'info.main';
      default:
        return 'text.primary';
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
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

  // Load notifications on mount and when filter changes
  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [filter]);

  return (
    <>
      {/* Notification Bell */}
      <IconButton
        onClick={() => setDrawerOpen(true)}
        sx={{ position: 'relative' }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      {/* Notification Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ '& .MuiDrawer-paper': { width: 400, maxWidth: '90vw' } }}
      >
        <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Notifications</Typography>
            <Box>
              <IconButton onClick={() => setSettingsOpen(true)} size="small">
                <SettingsIcon />
              </IconButton>
              <IconButton onClick={() => setDrawerOpen(false)} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<MarkEmailReadIcon />}
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark All Read
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={fetchNotifications}
              disabled={loading}
            >
              Refresh
            </Button>
          </Box>

          {/* Filter Chips */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2, overflowX: 'auto' }}>
            {['all', 'unread', 'post', 'oauth', 'system', 'scheduled'].map((filterOption) => (
              <Chip
                key={filterOption}
                label={filterOption}
                size="small"
                color={filter === filterOption ? 'primary' : 'default'}
                onClick={() => setFilter(filterOption as any)}
                variant={filter === filterOption ? 'filled' : 'outlined'}
              />
            ))}
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Notifications List */}
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            {loading ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">Loading notifications...</Typography>
              </Box>
            ) : notifications.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <NotificationsIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography color="text.secondary">No notifications</Typography>
              </Box>
            ) : (
              <List>
                {notifications.map((notification) => (
                  <ListItem
                    key={notification.id}
                    component="div"
                    onClick={() => handleNotificationClick(notification)}
                    sx={{
                      backgroundColor: notification.read ? 'transparent' : 'action.hover',
                      borderLeft: `4px solid ${getNotificationColor(notification.type)}`,
                      mb: 1,
                      borderRadius: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'action.selected'
                      }
                    }}
                  >
                        <ListItemIcon>
                          {getNotificationIcon(notification.type)}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="subtitle2" noWrap>
                                {notification.title}
                              </Typography>
                              {!notification.read && (
                                <Box
                                  sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    backgroundColor: 'primary.main'
                                  }}
                                />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary" noWrap>
                                {notification.message}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {formatTimestamp(notification.timestamp)}
                              </Typography>
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            size="small"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Box>
      </Drawer>

      {/* Settings Menu */}
      <Menu
        anchorEl={settingsOpen ? document.body : null}
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem>
          <FormGroup>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Email Notifications"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Push Notifications"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="In-App Notifications"
            />
          </FormGroup>
        </MenuItem>
      </Menu>
    </>
  );
}

export default NotificationCenter;