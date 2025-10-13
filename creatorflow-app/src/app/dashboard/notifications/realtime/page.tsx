'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Alert,
  Chip,
  CircularProgress,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Switch,
  FormControlLabel,
  Paper,
} from '@mui/material';
import {
  Notifications as Bell,
  Wifi,
  WifiOff,
  Notifications,
  NotificationsOff,
  Send,
  CheckCircle,
  Error,
  Info,
} from '@mui/icons-material';
import { useWebSocketNotifications } from '@/hooks/useWebSocketNotifications';

export default function RealtimeNotificationPage() {
  const {
    socket,
    isConnected,
    notifications,
    unreadCount,
    sendNotification,
    markAsRead,
    markAllAsRead,
    lastNotification,
  } = useWebSocketNotifications();

  const [browserNotificationsEnabled, setBrowserNotificationsEnabled] = useState(false);
  const [autoMarkRead, setAutoMarkRead] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check browser notification permission
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBrowserNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      setBrowserNotificationsEnabled(permission === 'granted');
      if (permission === 'granted') {
        setSuccess('Browser notifications enabled!');
      } else {
        setError('Browser notifications denied');
      }
    }
  };

  const testNotification = () => {
    sendNotification({
      userId: 'test-user',
      type: 'test',
      title: 'Test Real-time Notification',
      message: 'This is a test notification sent via WebSocket! 🚀',
      category: 'system',
      priority: 'medium',
      actionUrl: '/dashboard',
      actionText: 'Go to Dashboard',
    });
    setSuccess('Test notification sent!');
  };

  const testSystemNotification = () => {
    sendNotification({
      userId: 'test-user',
      type: 'system_event',
      title: 'System Update',
      message: 'floai.studio has been updated with new features!',
      category: 'system',
      priority: 'high',
    });
    setSuccess('System notification sent!');
  };

  const testEngagementNotification = () => {
    sendNotification({
      userId: 'test-user',
      type: 'post_engagement',
      title: 'New Engagement',
      message: 'Your post got 42 likes on Twitter! 🔥',
      category: 'engagement',
      priority: 'medium',
      actionUrl: '/dashboard/content',
      actionText: 'View Post',
    });
    setSuccess('Engagement notification sent!');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <Bell sx={{ fontSize: 40 }} />
          Real-time Notifications
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Test WebSocket-powered real-time notification delivery
        </Typography>
      </Box>

      {/* Connection Status */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            {isConnected ? (
              <Wifi color="success" />
            ) : (
              <WifiOff color="error" />
            )}
            <Typography variant="h6">
              WebSocket Status: {isConnected ? 'Connected' : 'Disconnected'}
            </Typography>
            <Chip 
              label={isConnected ? 'Live' : 'Offline'} 
              color={isConnected ? 'success' : 'error'}
              size="small"
            />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            {browserNotificationsEnabled ? (
              <Notifications color="success" />
            ) : (
              <NotificationsOff color="disabled" />
            )}
            <Typography variant="body1">
              Browser Notifications: {browserNotificationsEnabled ? 'Enabled' : 'Disabled'}
            </Typography>
            {!browserNotificationsEnabled && (
              <Button 
                variant="outlined" 
                size="small" 
                onClick={requestNotificationPermission}
              >
                Enable
              </Button>
            )}
          </Box>

          <Typography variant="body2" color="text.secondary">
            Unread Notifications: {unreadCount} | Total: {notifications.length}
          </Typography>
        </CardContent>
      </Card>

      {/* Test Controls */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Test Controls
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<Send />}
              onClick={testNotification}
              disabled={!isConnected}
            >
              Send Test Notification
            </Button>
            
            <Button
              variant="contained"
              color="secondary"
              startIcon={<Info />}
              onClick={testSystemNotification}
              disabled={!isConnected}
            >
              Send System Notification
            </Button>
            
            <Button
              variant="contained"
              color="warning"
              startIcon={<Bell />}
              onClick={testEngagementNotification}
              disabled={!isConnected}
            >
              Send Engagement Notification
            </Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={autoMarkRead}
                  onChange={(e) => setAutoMarkRead(e.target.checked)}
                />
              }
              label="Auto-mark as read"
            />
            
            <Button
              variant="outlined"
              onClick={markAllAsRead}
              disabled={!isConnected || unreadCount === 0}
            >
              Mark All as Read
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Live Notifications ({notifications.length})
          </Typography>
          
          {notifications.length === 0 ? (
            <Alert severity="info">
              No notifications yet. Send a test notification to see it appear here in real-time!
            </Alert>
          ) : (
            <List>
              {notifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem
                    sx={{
                      bgcolor: notification.read ? 'transparent' : 'action.hover',
                      borderRadius: 1,
                      mb: 1,
                    }}
                  >
                    <ListItemIcon>
                      {notification.read ? (
                        <CheckCircle color="disabled" />
                      ) : (
                        <Bell color="primary" />
                      )}
                    </ListItemIcon>
                    
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1">
                            {notification.title}
                          </Typography>
                          <Chip 
                            label={notification.priority} 
                            size="small" 
                            color={
                              notification.priority === 'urgent' ? 'error' :
                              notification.priority === 'high' ? 'warning' :
                              notification.priority === 'medium' ? 'info' : 'default'
                            }
                          />
                          {!notification.read && (
                            <Chip label="Unread" size="small" color="primary" />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(notification.createdAt).toLocaleString()}
                          </Typography>
                        </Box>
                      }
                    />
                    
                    <CardActions>
                      {!notification.read && (
                        <Button
                          size="small"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Mark as Read
                        </Button>
                      )}
                    </CardActions>
                  </ListItem>
                  
                  {index < notifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Success Snackbar */}
      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSuccess(null)} 
          severity="success" 
          sx={{ width: '100%' }}
          icon={<CheckCircle />}
        >
          {success}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setError(null)} 
          severity="error" 
          sx={{ width: '100%' }}
          icon={<Error />}
        >
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}
