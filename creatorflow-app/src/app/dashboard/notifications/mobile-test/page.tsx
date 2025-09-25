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
  Grid,
  Paper,
  Fab,
  useMediaQuery,
  useTheme,
  Divider,
} from '@mui/material';
import {
  Bell,
  Wifi,
  WifiOff,
  Notifications,
  NotificationsOff,
  Send,
  CheckCircle,
  Error,
  Info,
  Smartphone,
  TouchApp,
  Speed,
} from '@mui/icons-material';
import { useMobileWebSocketNotifications } from '@/hooks/useMobileWebSocketNotifications';

export default function MobileNotificationTestPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const {
    socket,
    isConnected,
    notifications,
    unreadCount,
    sendNotification,
    markAsRead,
    markAllAsRead,
    lastNotification,
    connectionQuality,
    retryConnection,
  } = useMobileWebSocketNotifications();

  const [browserNotificationsEnabled, setBrowserNotificationsEnabled] = useState(false);
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
      title: 'Mobile Test Notification',
      message: 'This is a test notification optimized for mobile devices! 📱✨',
      category: 'system',
      priority: 'medium',
      actionUrl: '/dashboard',
      actionText: 'Go to Dashboard',
    });
    setSuccess('Mobile test notification sent!');
  };

  const testTouchNotification = () => {
    sendNotification({
      userId: 'test-user',
      type: 'test',
      title: 'Touch Interaction Test',
      message: 'Tap to interact with this notification! 👆',
      category: 'system',
      priority: 'high',
      actionUrl: '/dashboard/content',
      actionText: 'Create Content',
    });
    setSuccess('Touch test notification sent!');
  };

  const testPerformanceNotification = () => {
    sendNotification({
      userId: 'test-user',
      type: 'test',
      title: 'Performance Test',
      message: 'Testing mobile performance optimizations! ⚡',
      category: 'system',
      priority: 'low',
    });
    setSuccess('Performance test notification sent!');
  };

  const getConnectionQualityColor = () => {
    switch (connectionQuality) {
      case 'excellent': return 'success';
      case 'good': return 'info';
      case 'poor': return 'warning';
      case 'offline': return 'error';
      default: return 'default';
    }
  };

  const getConnectionQualityIcon = () => {
    switch (connectionQuality) {
      case 'excellent': return <Speed />;
      case 'good': return <Wifi />;
      case 'poor': return <WifiOff />;
      case 'offline': return <WifiOff />;
      default: return <WifiOff />;
    }
  };

  if (!isMobile) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Smartphone sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Mobile Notification Test
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            This page is optimized for mobile devices. Please view on a mobile device for the best experience.
          </Typography>
          <Alert severity="info" sx={{ maxWidth: 600, mx: 'auto' }}>
            <Typography variant="body2">
              <strong>Mobile Features:</strong><br />
              • Touch-friendly interactions<br />
              • Swipe gestures for notifications<br />
              • Optimized performance for mobile networks<br />
              • Native browser notifications<br />
              • Responsive design for all screen sizes
            </Typography>
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 2, px: 1 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mb: 3,
        px: 1
      }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Smartphone size={24} />
          Mobile Test
        </Typography>
        <Chip 
          label={isMobile ? 'Mobile' : 'Desktop'} 
          color={isMobile ? 'primary' : 'default'}
          size="small"
        />
      </Box>

      {/* Connection Status */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TouchApp />
            Connection Status
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            {getConnectionQualityIcon()}
            <Typography variant="body1">
              WebSocket: {isConnected ? 'Connected' : 'Disconnected'}
            </Typography>
            <Chip 
              label={connectionQuality} 
              color={getConnectionQualityColor() as any}
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
            Unread: {unreadCount} | Total: {notifications.length}
          </Typography>
        </CardContent>
      </Card>

      {/* Test Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Mobile Test Controls
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<Send />}
                onClick={testNotification}
                disabled={!isConnected}
                sx={{ mb: 1 }}
              >
                Test Mobile Notification
              </Button>
            </Grid>
            
            <Grid item xs={6}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<TouchApp />}
                onClick={testTouchNotification}
                disabled={!isConnected}
              >
                Touch Test
              </Button>
            </Grid>
            
            <Grid item xs={6}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Speed />}
                onClick={testPerformanceNotification}
                disabled={!isConnected}
              >
                Performance Test
              </Button>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              onClick={markAllAsRead}
              disabled={!isConnected || unreadCount === 0}
              startIcon={<CheckCircle />}
              size="small"
            >
              Mark All Read
            </Button>
            
            <Button
              variant="outlined"
              onClick={retryConnection}
              disabled={isConnected}
              startIcon={<Wifi />}
              size="small"
            >
              Retry Connection
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Mobile Features Info */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Mobile Optimizations
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircle color="success" size={16} />
              <Typography variant="body2">Touch-friendly interactions</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircle color="success" size={16} />
              <Typography variant="body2">Swipe gestures for notifications</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircle color="success" size={16} />
              <Typography variant="body2">Optimized for mobile networks</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircle color="success" size={16} />
              <Typography variant="body2">Native browser notifications</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircle color="success" size={16} />
              <Typography variant="body2">Responsive design</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Recent Notifications */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Notifications ({notifications.length})
          </Typography>
          
          {notifications.length === 0 ? (
            <Box sx={{ 
              textAlign: 'center', 
              py: 4,
              color: 'text.secondary'
            }}>
              <Bell size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
              <Typography variant="body2">
                No notifications yet. Send a test notification!
              </Typography>
            </Box>
          ) : (
            <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
              {notifications.slice(0, 5).map((notification, index) => (
                <Paper
                  key={notification.id}
                  sx={{
                    p: 2,
                    mb: 1,
                    border: notification.read ? 'none' : '1px solid',
                    borderColor: 'primary.main',
                    borderRadius: 2,
                    bgcolor: notification.read ? 'transparent' : 'action.hover',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: notification.read ? 'grey.300' : 'primary.main',
                        mt: 1,
                        flexShrink: 0,
                      }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontWeight: notification.read ? 400 : 600,
                          fontSize: '0.9rem',
                        }}
                      >
                        {notification.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontSize: '0.8rem', mt: 0.5 }}
                      >
                        {notification.message}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <Chip 
                          label={notification.priority} 
                          size="small" 
                          color={
                            notification.priority === 'urgent' ? 'error' :
                            notification.priority === 'high' ? 'warning' :
                            notification.priority === 'medium' ? 'info' : 'default'
                          }
                          sx={{ fontSize: '0.7rem', height: 18 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {new Date(notification.createdAt).toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                    {!notification.read && (
                      <Button
                        size="small"
                        onClick={() => markAsRead(notification.id)}
                        sx={{ minWidth: 'auto', px: 1, fontSize: '0.7rem' }}
                      >
                        Mark Read
                      </Button>
                    )}
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Floating Action Button */}
      {unreadCount > 0 && (
        <Fab
          color="primary"
          onClick={markAllAsRead}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000,
          }}
        >
          <CheckCircle />
        </Fab>
      )}

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
