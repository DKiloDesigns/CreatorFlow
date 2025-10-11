'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  IconButton, 
  Badge, 
  Tooltip, 
  Fade,
  Zoom,
  keyframes,
  useMediaQuery,
  useTheme,
  SwipeableDrawer,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Typography,
  Button,
  Chip,
  Avatar,
  Fab,
} from '@mui/material';
import { Notifications as NotificationsIcon, AutoAwesome as AutoAwesomeIcon, Bolt as BoltIcon, Close as CloseIcon, CheckCircle as CheckCircleIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';
import Link from 'next/link';
import { useMobileWebSocketNotifications } from '@/hooks/useMobileWebSocketNotifications';

// Keyframe animations optimized for mobile
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-1px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.9; }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 8px rgba(99, 102, 241, 0.4); }
  50% { box-shadow: 0 0 16px rgba(99, 102, 241, 0.6), 0 0 24px rgba(99, 102, 241, 0.4); }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-8px); }
  50% { transform: translateY(-4px); }
`;

interface MobileNotificationIconProps {
  unreadCount?: number;
  isActive?: boolean;
  href?: string;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
  variant?: 'fab' | 'bottom-nav' | 'floating';
}

export function MobileNotificationIcon({
  unreadCount = 0,
  isActive = false,
  href = '/dashboard/notifications/enhanced',
  onClick,
  size = 'medium',
  variant = 'fab'
}: MobileNotificationIconProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isHovered, setIsHovered] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Use Mobile WebSocket notifications hook
  const { 
    unreadCount: wsUnreadCount, 
    isConnected, 
    lastNotification, 
    notifications,
    markAsRead,
    markAllAsRead,
    isMobile: hookIsMobile,
    connectionQuality
  } = useMobileWebSocketNotifications();
  
  // Use WebSocket unread count if available, fallback to prop
  const actualUnreadCount = wsUnreadCount !== undefined ? wsUnreadCount : unreadCount;

  // Trigger sparkles when new notifications arrive
  useEffect(() => {
    if (lastNotification) {
      setShowSparkles(true);
      const timer = setTimeout(() => setShowSparkles(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [lastNotification]);

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { width: 40, height: 40, minWidth: 40, minHeight: 40 };
      case 'medium':
        return { width: 48, height: 48, minWidth: 48, minHeight: 48 };
      case 'large':
        return { width: 56, height: 56, minWidth: 56, minHeight: 56 };
      default:
        return { width: 48, height: 48, minWidth: 48, minHeight: 48 };
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small': return 'small';
      case 'medium': return 'medium';
      case 'large': return 'large';
      default: return 'medium';
    }
  };

  const getBadgeStyles = () => ({
    '& .MuiBadge-badge': {
      fontSize: '0.7rem',
      fontWeight: 'bold',
      minWidth: '18px',
      height: '18px',
      borderRadius: '9px',
      background: 'linear-gradient(45deg, #ff6b6b, #ff8e8e)',
      boxShadow: '0 2px 8px rgba(255, 107, 107, 0.4)',
      animation: actualUnreadCount > 0 ? `${pulse} 1s ease-in-out infinite` : 'none',
      right: -4,
      top: -4,
    },
  });

  const handleNotificationClick = () => {
    if (onClick) {
      onClick();
    } else if (isMobile) {
      setDrawerOpen(true);
    } else if (href) {
      window.location.href = href;
    }
  };

  const iconElement = (
    <NotificationsIcon
      sx={{
        fontSize: getIconSize(),
        transition: 'all 0.3s ease',
        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
      }}
    />
  );

  const buttonElement = (
    <IconButton
      onClick={handleNotificationClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        ...getSizeStyles(),
        position: 'relative',
        background: variant === 'fab' 
          ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))'
          : 'transparent',
        backdropFilter: variant === 'fab' ? 'blur(10px)' : 'none',
        border: variant === 'fab' 
          ? '1px solid rgba(255, 255, 255, 0.2)'
          : 'none',
        borderRadius: variant === 'fab' ? '50%' : '8px',
        color: 'text.primary',
        animation: isActive ? `${float} 2s ease-in-out infinite` : 'none',
        boxShadow: isActive ? '0 4px 20px rgba(99, 102, 241, 0.3)' : 'none',
        '&:hover': {
          backgroundColor: 'action.hover',
          color: 'primary.main',
          transform: 'scale(1.05)',
          boxShadow: '0 4px 16px rgba(99, 102, 241, 0.2)',
        },
        '&:active': {
          transform: 'scale(0.95)',
        },
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: 2,
        }
      }}
    >
      {iconElement}
      
      {/* Sparkles animation for new notifications */}
      {showSparkles && (
        <Box
          sx={{
            position: 'absolute',
            top: -8,
            right: -8,
            animation: `${bounce} 0.6s ease-in-out`,
          }}
        >
          <AutoAwesomeIcon sx={{ fontSize: 16, color: "#ffd700" }} />
        </Box>
      )}
    </IconButton>
  );

  // Mobile drawer for notifications
  const renderMobileDrawer = () => (
    <SwipeableDrawer
      anchor="bottom"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      onOpen={() => setDrawerOpen(true)}
      disableSwipeToOpen={false}
      sx={{
        '& .MuiDrawer-paper': {
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          maxHeight: '80vh',
          minHeight: '50vh',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 2,
          pb: 2,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Notifications ({actualUnreadCount})
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {actualUnreadCount > 0 && (
              <Button
                size="small"
                onClick={markAllAsRead}
                startIcon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
                sx={{ minWidth: 'auto', px: 1 }}
              >
                Mark All Read
              </Button>
            )}
            <IconButton
              size="small"
              onClick={() => setDrawerOpen(false)}
              sx={{ minWidth: 'auto' }}
            >
              <CloseIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        </Box>

        {/* Connection Status */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1, 
          mb: 2,
          p: 1,
          borderRadius: 1,
          bgcolor: isConnected ? 'success.light' : 'error.light',
          color: isConnected ? 'success.contrastText' : 'error.contrastText',
        }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: isConnected ? 'success.main' : 'error.main',
              animation: isConnected ? `${pulse} 2s ease-in-out infinite` : 'none',
            }}
          />
          <Typography variant="caption">
            {isConnected ? 'Live Updates' : 'Offline'}
          </Typography>
        </Box>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 4,
            color: 'text.secondary'
          }}>
            <NotificationsIcon sx={{ fontSize: 48, opacity: 0.3, marginBottom: 16 }} />
            <Typography variant="body2">
              No notifications yet
            </Typography>
          </Box>
        ) : (
          <List sx={{ px: 0 }}>
            {notifications.slice(0, 10).map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  sx={{
                    px: 0,
                    py: 1.5,
                    borderRadius: 1,
                    mb: 1,
                    bgcolor: notification.read ? 'transparent' : 'action.hover',
                    '&:active': {
                      bgcolor: 'action.selected',
                    },
                  }}
                  onClick={() => {
                    if (!notification.read) {
                      markAsRead(notification.id);
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: notification.read ? 'grey.300' : 'primary.main',
                        color: notification.read ? 'grey.600' : 'primary.contrastText',
                      }}
                    >
                      <NotificationsIcon sx={{ fontSize: 16 }} />
                    </Avatar>
                  </ListItemIcon>
                  
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontWeight: notification.read ? 400 : 600,
                            fontSize: '0.9rem'
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
                            }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ fontSize: '0.8rem', lineHeight: 1.4 }}
                        >
                          {notification.message}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
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
                    }
                  />
                </ListItem>
                
                {index < Math.min(notifications.length, 10) - 1 && (
                  <Divider sx={{ mx: 1 }} />
                )}
              </React.Fragment>
            ))}
          </List>
        )}

        {/* Footer */}
        {notifications.length > 10 && (
          <Box sx={{ 
            textAlign: 'center', 
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider'
          }}>
            <Button
              component={Link}
              href="/dashboard/notifications/enhanced"
              variant="outlined"
              size="small"
              onClick={() => setDrawerOpen(false)}
            >
              View All Notifications
            </Button>
          </Box>
        )}
      </Box>
    </SwipeableDrawer>
  );

  // Render based on variant
  if (variant === 'fab') {
    return (
      <>
        <Tooltip 
          title={actualUnreadCount > 0 ? `${actualUnreadCount} unread notifications` : 'No new notifications'}
          placement="top"
          arrow
        >
          <Fab
            color="primary"
            onClick={handleNotificationClick}
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              zIndex: 1000,
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
              animation: isActive ? `${float} 2s ease-in-out infinite` : 'none',
              '&:hover': {
                background: 'linear-gradient(135deg, #5b5cf0, #9c4ae6)',
                transform: 'scale(1.05)',
              },
              '&:active': {
                transform: 'scale(0.95)',
              },
            }}
          >
            <Badge 
              badgeContent={actualUnreadCount} 
              max={99}
              sx={getBadgeStyles()}
            >
              <NotificationsIcon sx={{ fontSize: 24 }} />
            </Badge>
          </Fab>
        </Tooltip>
        {renderMobileDrawer()}
      </>
    );
  }

  return (
    <>
      <Tooltip 
        title={actualUnreadCount > 0 ? `${actualUnreadCount} unread notifications` : 'No new notifications'}
        placement="bottom"
        arrow
      >
        <Box sx={{ position: 'relative' }}>
          {actualUnreadCount > 0 ? (
            <Badge 
              badgeContent={actualUnreadCount} 
              max={99}
              sx={getBadgeStyles()}
            >
              {buttonElement}
            </Badge>
          ) : (
            buttonElement
          )}
        </Box>
      </Tooltip>
      {isMobile && renderMobileDrawer()}
    </>
  );
}

export default MobileNotificationIcon;
