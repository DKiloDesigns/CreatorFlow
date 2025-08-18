import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  AlertProps,
  IconButton,
  Box,
  Typography,
  Paper,
  Chip,
  Badge,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Close,
  CheckCircle,
  Error,
  Warning,
  Info,
  NotificationsNone,
} from '@mui/icons-material';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  timestamp: Date;
  read?: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

interface NotificationProviderProps {
  children: React.ReactNode;
  maxNotifications?: number;
}

export function NotificationProvider({ children, maxNotifications = 10 }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date() as Date,
      read: false,
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      if (updated.length > maxNotifications) {
        return updated.slice(0, maxNotifications);
      }
      return updated;
    });
  }, [maxNotifications]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        markAsRead,
        clearAll,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

interface ToastNotificationProps {
  notification: Notification;
  onClose: (id: string) => void;
}

export function ToastNotification({ notification, onClose }: ToastNotificationProps) {
  const getSeverity = (type: Notification['type']): AlertProps['severity'] => {
    switch (type) {
      case 'success': return 'success';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'info';
    }
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle />;
      case 'error': return <Error />;
      case 'warning': return <Warning />;
      case 'info': return <Info />;
      default: return <Info />;
    }
  };

  return (
    <Snackbar
      open={true}
      autoHideDuration={notification.duration || 6000}
      onClose={() => onClose(notification.id)}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        severity={getSeverity(notification.type)}
        icon={getIcon(notification.type)}
        onClose={() => onClose(notification.id)}
        action={
          notification.action && (
            <IconButton
              color="inherit"
              size="small"
              onClick={notification.action.onClick}
            >
              {notification.action.label}
            </IconButton>
          )
        }
        sx={{ minWidth: 300 }}
      >
        <AlertTitle>{notification.title}</AlertTitle>
        {notification.message}
      </Alert>
    </Snackbar>
  );
}

interface NotificationCenterProps {
  open: boolean;
  _anchorEl?: HTMLElement | null;
}

export function NotificationCenter({ open, _anchorEl }: NotificationCenterProps) {
  const { notifications, removeNotification, markAsRead, clearAll, unreadCount } = useNotifications();

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'success': return 'success.main';
      case 'error': return 'error.main';
      case 'warning': return 'warning.main';
      case 'info': return 'info.main';
      default: return 'info.main';
    }
  };

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle fontSize="small" />;
      case 'error': return <Error fontSize="small" />;
      case 'warning': return <Warning fontSize="small" />;
      case 'info': return <Info fontSize="small" />;
      default: return <Info fontSize="small" />;
    }
  };

  return (
    <Paper
      sx={{
        position: 'absolute',
        top: _anchorEl ? _anchorEl.offsetTop + _anchorEl.offsetHeight + 8 : 0,
        right: _anchorEl ? 0 : 'auto',
        width: 400,
        maxHeight: 500,
        overflow: 'hidden',
        zIndex: 1300,
        display: open ? 'block' : 'none',
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="div">
            Notifications
            {unreadCount > 0 && (
              <Chip
                label={unreadCount}
                size="small"
                color="primary"
                sx={{ ml: 1 }}
              />
            )}
          </Typography>
          <IconButton size="small" onClick={clearAll}>
            <Close />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
        {notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <NotificationsNone sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography color="text.secondary">
              No notifications
            </Typography>
          </Box>
        ) : (
          <List>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  component="div"
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    backgroundColor: notification.read ? 'transparent' : 'action.hover',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'action.selected',
                    },
                  }}
                >
                  <ListItemIcon>
                    <Box
                      sx={{
                        color: getTypeColor(notification.type),
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {getTypeIcon(notification.type)}
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={notification.title}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {notification.timestamp.toLocaleTimeString()}
                        </Typography>
                      </Box>
                    }
                  />
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notification.id);
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </Paper>
  );
}

interface NotificationBadgeProps {
  count?: number;
  children: React.ReactNode;
  onClick?: () => void;
}

export function NotificationBadge({ count = 0, children, onClick }: NotificationBadgeProps) {
  return (
    <Badge badgeContent={count} color="error" onClick={onClick} sx={{ cursor: onClick ? 'pointer' : 'default' }}>
      {children}
    </Badge>
  );
}

// Quick notification functions
export function showSuccess(title: string, message: string, _duration = 6000) {
  // This would be called from the notification context
  console.log('Success:', title, message);
}

export function showError(title: string, message: string, _duration = 6000) {
  console.log('Error:', title, message);
}

export function showWarning(title: string, message: string, _duration = 6000) {
  console.log('Warning:', title, message);
}

export function showInfo(title: string, message: string, _duration = 6000) {
  console.log('Info:', title, message);
} 