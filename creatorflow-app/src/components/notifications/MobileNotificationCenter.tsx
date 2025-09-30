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
  Fab,
  SwipeableDrawer,
  Drawer,
  IconButton,
  Avatar,
  Badge,
  useMediaQuery,
  useTheme,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
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
  Search,
  FilterList,
  MoreVert,
  Refresh,
  Settings,
  Close as X,
  ExpandMore as ChevronDown,
  ExpandLess as ChevronUp,
} from '@mui/icons-material';
import { useMobileWebSocketNotifications } from '@/hooks/useMobileWebSocketNotifications';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`notification-tabpanel-${index}`}
      aria-labelledby={`notification-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

export default function MobileNotificationCenter() {
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
    isMobile: hookIsMobile,
    connectionQuality,
    retryConnection,
  } = useMobileWebSocketNotifications();

  const [browserNotificationsEnabled, setBrowserNotificationsEnabled] = useState(false);
  const [autoMarkRead, setAutoMarkRead] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [expandedNotifications, setExpandedNotifications] = useState<Set<string>>(new Set());

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
      title: 'Test Mobile Notification',
      message: 'This is a test notification optimized for mobile! 📱',
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
      title: 'Mobile Update',
      message: 'CreatorFlow mobile experience has been enhanced!',
      category: 'system',
      priority: 'high',
    });
    setSuccess('System notification sent!');
  };

  const testEngagementNotification = () => {
    sendNotification({
      userId: 'test-user',
      type: 'post_engagement',
      title: 'Mobile Engagement',
      message: 'Your mobile post got 42 likes! 🔥',
      category: 'engagement',
      priority: 'medium',
      actionUrl: '/dashboard/content',
      actionText: 'View Post',
    });
    setSuccess('Engagement notification sent!');
  };

  // Filter notifications based on search and priority
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'all' || notification.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const unreadNotifications = filteredNotifications.filter(n => !n.read);
  const readNotifications = filteredNotifications.filter(n => n.read);

  const toggleExpanded = (notificationId: string) => {
    const newExpanded = new Set(expandedNotifications);
    if (newExpanded.has(notificationId)) {
      newExpanded.delete(notificationId);
    } else {
      newExpanded.add(notificationId);
    }
    setExpandedNotifications(newExpanded);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const renderNotificationItem = (notification: any, index: number) => {
    const isExpanded = expandedNotifications.has(notification.id);
    
    return (
      <Card
        key={notification.id}
        sx={{
          mb: 2,
          border: notification.read ? 'none' : '1px solid',
          borderColor: 'primary.main',
          borderRadius: 2,
          boxShadow: notification.read ? 1 : 3,
          transition: 'all 0.2s ease',
          '&:active': {
            transform: 'scale(0.98)',
          },
        }}
      >
        <CardContent sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: notification.read ? 'grey.300' : 'primary.main',
                color: notification.read ? 'grey.600' : 'primary.contrastText',
                mt: 0.5,
              }}
            >
              <Bell size={20} />
            </Avatar>
            
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: notification.read ? 400 : 600,
                    fontSize: '1rem',
                    lineHeight: 1.3,
                  }}
                >
                  {notification.title}
                </Typography>
                
                {!notification.read && (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      flexShrink: 0,
                    }}
                  />
                )}
              </Box>
              
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  fontSize: '0.9rem',
                  lineHeight: 1.4,
                  mb: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: isExpanded ? 'none' : 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {notification.message}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  label={notification.priority} 
                  size="small" 
                  color={
                    notification.priority === 'urgent' ? 'error' :
                    notification.priority === 'high' ? 'warning' :
                    notification.priority === 'medium' ? 'info' : 'default'
                  }
                  sx={{ fontSize: '0.7rem', height: 20 }}
                />
                <Typography variant="caption" color="text.secondary">
                  {new Date(notification.createdAt).toLocaleString()}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <IconButton
                size="small"
                onClick={() => toggleExpanded(notification.id)}
                sx={{ minWidth: 'auto', p: 0.5 }}
              >
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </IconButton>
              
              {!notification.read && (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => markAsRead(notification.id)}
                  sx={{ minWidth: 'auto', px: 1, fontSize: '0.7rem' }}
                >
                  Mark Read
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  if (isMobile) {
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
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Notifications
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              onClick={handleMenuClick}
              size="small"
            >
              <MoreVert />
            </IconButton>
          </Box>
        </Box>

        {/* Connection Status */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1, 
          mb: 2,
          p: 1.5,
          borderRadius: 2,
          bgcolor: isConnected ? 'success.light' : 'error.light',
          color: isConnected ? 'success.contrastText' : 'error.contrastText',
        }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: isConnected ? 'success.main' : 'error.main',
              animation: isConnected ? 'pulse 2s ease-in-out infinite' : 'none',
            }}
          />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {isConnected ? 'Live Updates' : 'Offline'}
          </Typography>
          <Typography variant="caption" sx={{ ml: 'auto' }}>
            {unreadCount} unread
          </Typography>
        </Box>

        {/* Search and Filter */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          
          <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1 }}>
            {['all', 'urgent', 'high', 'medium', 'low'].map((priority) => (
              <Chip
                key={priority}
                label={priority}
                size="small"
                variant={filterPriority === priority ? 'filled' : 'outlined'}
                onClick={() => setFilterPriority(priority)}
                sx={{ flexShrink: 0 }}
              />
            ))}
          </Box>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            variant="fullWidth"
          >
            <Tab label={`All (${filteredNotifications.length})`} />
            <Tab label={`Unread (${unreadNotifications.length})`} />
          </Tabs>
        </Box>

        {/* Notifications List */}
        <TabPanel value={tabValue} index={0}>
          {filteredNotifications.length === 0 ? (
            <Box sx={{ 
              textAlign: 'center', 
              py: 4,
              color: 'text.secondary'
            }}>
              <Bell size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
              <Typography variant="body2">
                No notifications found
              </Typography>
            </Box>
          ) : (
            <Box>
              {filteredNotifications.map((notification, index) => 
                renderNotificationItem(notification, index)
              )}
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {unreadNotifications.length === 0 ? (
            <Box sx={{ 
              textAlign: 'center', 
              py: 4,
              color: 'text.secondary'
            }}>
              <CheckCircle size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
              <Typography variant="body2">
                No unread notifications
              </Typography>
            </Box>
          ) : (
            <Box>
              {unreadNotifications.map((notification, index) => 
                renderNotificationItem(notification, index)
              )}
            </Box>
          )}
        </TabPanel>

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

        {/* Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => { testNotification(); handleMenuClose(); }}>
            <Send sx={{ mr: 1 }} />
            Test Notification
          </MenuItem>
          <MenuItem onClick={() => { markAllAsRead(); handleMenuClose(); }}>
            <CheckCircle sx={{ mr: 1 }} />
            Mark All Read
          </MenuItem>
          <MenuItem onClick={() => { requestNotificationPermission(); handleMenuClose(); }}>
            <Notifications sx={{ mr: 1 }} />
            Enable Browser Notifications
          </MenuItem>
        </Menu>

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

  // Desktop version (fallback)
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Mobile Notification Center
      </Typography>
      <Typography variant="body1" color="text.secondary">
        This component is optimized for mobile devices. Please view on a mobile device for the best experience.
      </Typography>
    </Container>
  );
}
