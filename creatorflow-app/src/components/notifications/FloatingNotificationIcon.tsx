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
  Drawer,
  Typography,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar
} from '@mui/material';
import { Notifications as NotificationsIcon, AutoAwesome as AutoAwesomeIcon, Bolt as BoltIcon, Settings as SettingsIcon, Close as CloseIcon, MarkEmailRead as MarkEmailReadIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import Link from 'next/link';
import { useWebSocketNotifications } from '@/hooks/useWebSocketNotifications';

// Keyframe animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-2px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.3); }
  50% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.6), 0 0 30px rgba(99, 102, 241, 0.4); }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
  50% { opacity: 1; transform: scale(1) rotate(180deg); }
`;

interface FloatingNotificationIconProps {
  unreadCount?: number;
  isActive?: boolean;
  href?: string;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'creative' | 'minimal';
}

export function FloatingNotificationIcon({
  unreadCount = 0,
  isActive = false,
  href = '/dashboard/notifications/enhanced',
  onClick,
  size = 'medium',
  variant = 'creative'
}: FloatingNotificationIconProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filterType, setFilterType] = useState('all');

  // Use WebSocket notifications hook
  const {
    unreadCount: wsUnreadCount,
    isConnected,
    lastNotification,
    notifications,
    markAsRead,
    markAllAsRead
  } = useWebSocketNotifications();
  
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
        return { width: 36, height: 36, minWidth: 36, minHeight: 36 };
      case 'large':
        return { width: 52, height: 52, minWidth: 52, minHeight: 52 };
      default:
        return { width: 44, height: 44, minWidth: 44, minHeight: 44 };
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small': return 'small';
      case 'large': return 'medium'; // Using 'medium' as large might be too big, adjust as needed
      default: return 'small';
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'minimal':
        return {
          bgcolor: 'background.paper',
          color: 'text.primary',
          border: '1px solid',
          borderColor: 'divider',
          '&:hover': {
            bgcolor: 'action.hover',
            transform: 'scale(1.05)',
          }
        };
      case 'creative':
        return {
          background: isActive
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: isActive ? 'white' : 'primary.main',
          animation: isActive ? `${glow} 2s ease-in-out infinite` : `${float} 3s ease-in-out infinite`,
          '&:hover': {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            transform: 'scale(1.1) translateY(-2px)',
            boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
          }
        };
      default:
        return {
          bgcolor: isActive ? 'primary.main' : 'background.paper',
          color: isActive ? 'primary.contrastText' : 'text.primary',
          '&:hover': {
            bgcolor: isActive ? 'primary.dark' : 'action.hover',
            transform: 'scale(1.05)',
          }
        };
    }
  };

  const getBadgeStyles = () => {
    if (unreadCount === 0) return {};
    
    return {
      '& .MuiBadge-badge': {
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
        color: 'white',
        fontWeight: 600,
        fontSize: '0.75rem',
        minWidth: 20,
        height: 20,
        borderRadius: '10px',
        border: '2px solid white',
        boxShadow: '0 2px 8px rgba(255, 107, 107, 0.4)',
        animation: unreadCount > 0 ? `${pulse} 1.5s ease-in-out infinite` : 'none',
      }
    };
  };

  const iconElement = (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...getSizeStyles()
      }}
    >
      {/* Sparkle effects for creative variant */}
      {variant === 'creative' && showSparkles && (
        <>
          <Fade in={showSparkles} timeout={500}>
            <Box
              sx={{
                position: 'absolute',
                top: -8,
                right: -8,
                animation: `${sparkle} 0.6s ease-in-out`,
                zIndex: 1
              }}
            >
              <AutoAwesomeIcon sx={{ fontSize: 12, color: "#ffd700" }} />
            </Box>
          </Fade>
          <Fade in={showSparkles} timeout={800}>
            <Box
              sx={{
                position: 'absolute',
                bottom: -6,
                left: -6,
                animation: `${sparkle} 0.8s ease-in-out`,
                zIndex: 1
              }}
            >
              <BoltIcon sx={{ fontSize: 10, color: "#ff6b6b" }} />
            </Box>
          </Fade>
        </>
      )}

      {/* Main icon */}
      <NotificationsIcon sx={{ fontSize: getIconSize() }} />
    </Box>
  );

  const handleNotificationClick = () => {
    if (onClick) {
      onClick();
    } else {
      setDrawerOpen(true);
    }
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
  };

  const handleRefresh = () => {
    // Refresh notifications - this will be handled by the WebSocket hook
    window.location.reload();
  };

  // Filter notifications based on selected filter
  const filteredNotifications = notifications.filter(notification => {
    if (filterType === 'all') return true;
    if (filterType === 'unread') return !notification.read;
    return notification.category === filterType;
  });

  const buttonElement = (
    <IconButton
      component="button"
      onClick={handleNotificationClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        position: 'relative',
        borderRadius: '50%',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        ...getSizeStyles(),
        background: 'transparent',
        color: isActive ? 'primary.main' : 'text.primary',
        '&:hover': {
          background: 'transparent',
          color: 'primary.main',
          transform: 'scale(1.1)',
        },
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: 2,
        }
      }}
      aria-label={unreadCount > 0 ? `${unreadCount} notifications` : 'Notifications'}
    >
      {iconElement}
    </IconButton>
  );

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
            sx={{
              '& .MuiBadge-badge': {
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.75rem',
                minWidth: 20,
                height: 20,
                borderRadius: '10px',
                border: '2px solid white',
                boxShadow: '0 2px 8px rgba(255, 107, 107, 0.4)',
                animation: `${pulse} 1.5s ease-in-out infinite`,
                top: 8,
                right: 8,
              }
            } as any}
          >
            {buttonElement}
          </Badge>
        ) : (
          buttonElement
        )}
        </Box>
      </Tooltip>

      {/* Notification Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{
          sx: {
            width: 420,
            maxWidth: '90vw',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            borderLeft: '1px solid rgba(148, 163, 184, 0.2)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(16px)',
            '& .MuiDrawer-paper': {
              background: 'transparent',
            }
          }
        }}
      >
        <Box sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        }}>
          {/* Header */}
          <Box sx={{
            p: 3,
            pb: 2,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.025em'
                }}
              >
                Notifications
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <IconButton
                  size="small"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'primary.main',
                      bgcolor: 'primary.50'
                    }
                  }}
                >
                  <SettingsIcon sx={{ fontSize: 20 }} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={handleDrawerClose}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'error.main',
                      bgcolor: 'error.50'
                    }
                  }}
                >
                  <CloseIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Box>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{
            p: 3,
            pt: 2,
            pb: 2,
            background: 'rgba(255, 255, 255, 0.5)',
            borderBottom: '1px solid rgba(148, 163, 184, 0.1)'
          }}>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<MarkEmailReadIcon sx={{ fontSize: 16 }} />}
                onClick={handleMarkAllRead}
                disabled={actualUnreadCount === 0}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 2,
                  py: 0.5,
                  borderColor: 'rgba(148, 163, 184, 0.3)',
                  color: 'text.secondary',
                  '&:hover': {
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    bgcolor: 'primary.50'
                  },
                  '&:disabled': {
                    opacity: 0.5
                  }
                }}
              >
                Mark All Read
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<RefreshIcon sx={{ fontSize: 16 }} />}
                onClick={handleRefresh}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 2,
                  py: 0.5,
                  borderColor: 'rgba(148, 163, 184, 0.3)',
                  color: 'text.secondary',
                  '&:hover': {
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    bgcolor: 'primary.50'
                  }
                }}
              >
                Refresh
              </Button>
            </Box>
          </Box>

          {/* Filter Chips */}
          <Box sx={{
            p: 3,
            pt: 2,
            pb: 2,
            background: 'rgba(255, 255, 255, 0.3)',
            borderBottom: '1px solid rgba(148, 163, 184, 0.1)'
          }}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {['all', 'unread', 'post', 'oauth', 'system', 'scheduled'].map((filter) => (
                <Chip
                  key={filter}
                  label={filter}
                  size="small"
                  variant={filterType === filter ? 'filled' : 'outlined'}
                  color={filterType === filter ? 'primary' : 'default'}
                  onClick={() => setFilterType(filter)}
                  clickable
                  sx={{
                    borderRadius: 2,
                    textTransform: 'capitalize',
                    fontWeight: filterType === filter ? 600 : 500,
                    fontSize: '0.75rem',
                    height: 28,
                    '&.MuiChip-filled': {
                      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                      color: 'white',
                      boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)'
                    },
                    '&.MuiChip-outlined': {
                      borderColor: 'rgba(148, 163, 184, 0.4)',
                      color: 'text.secondary',
                      '&:hover': {
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        bgcolor: 'primary.50'
                      }
                    }
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Notifications List */}
          <Box sx={{
            flexGrow: 1,
            overflow: 'auto',
            background: 'rgba(255, 255, 255, 0.2)',
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(148, 163, 184, 0.1)',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(148, 163, 184, 0.3)',
              borderRadius: '3px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: 'rgba(148, 163, 184, 0.5)',
            }
          }}>
            {filteredNotifications.length === 0 ? (
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
                p: 4
              }}>
                <Box sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}>
                  <NotificationsIcon sx={{ fontSize: 32, color: "#94a3b8" }} />
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 600,
                    mb: 0.5
                  }}
                >
                  No notifications
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.disabled',
                    maxWidth: 200
                  }}
                >
                  You're all caught up! New notifications will appear here.
                </Typography>
              </Box>
            ) : (
              <List sx={{ p: 2 }}>
                {filteredNotifications.map((notification, index) => (
                  <ListItem
                    key={notification.id}
                    sx={{
                      bgcolor: notification.read ? 'transparent' : 'rgba(59, 130, 246, 0.05)',
                      borderRadius: 2,
                      mb: 1.5,
                      p: 2,
                      border: notification.read ? '1px solid rgba(148, 163, 184, 0.1)' : '1px solid rgba(59, 130, 246, 0.2)',
                      boxShadow: notification.read ? '0 1px 3px rgba(0, 0, 0, 0.05)' : '0 2px 8px rgba(59, 130, 246, 0.15)',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: notification.read ? '0 4px 12px rgba(0, 0, 0, 0.1)' : '0 4px 16px rgba(59, 130, 246, 0.2)',
                      }
                    }}
                    secondaryAction={
                      !notification.read && (
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={() => markAsRead(notification.id)}
                          sx={{
                            color: 'primary.main',
                            '&:hover': {
                              bgcolor: 'primary.50'
                            }
                          }}
                        >
                          <MarkEmailReadIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      )
                    }
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Avatar sx={{
                        width: 36,
                        height: 36,
                        background: notification.read
                          ? 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)'
                          : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                        boxShadow: notification.read
                          ? '0 2px 4px rgba(0, 0, 0, 0.1)'
                          : '0 2px 8px rgba(59, 130, 246, 0.3)'
                      }}>
                        <NotificationsIcon sx={{ fontSize: 18, color: notification.read ? '#94a3b8' : 'white' }} />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: notification.read ? 500 : 700,
                            color: notification.read ? 'text.primary' : 'primary.main',
                            mb: 0.5
                          }}
                        >
                          {notification.title}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.secondary',
                            lineHeight: 1.4
                          }}
                        >
                          {notification.message}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
}

export default FloatingNotificationIcon;
