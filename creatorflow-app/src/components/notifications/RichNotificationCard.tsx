'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Button,
  IconButton,
  Collapse,
  Fade,
  keyframes,
  useTheme,
  alpha
} from '@mui/material';
import {
  Eye,
  EyeOff,
  MoreVertical,
  Check,
  X,
  Heart,
  Share,
  Reply,
  Calendar,
  BarChart3,
  Trophy,
  Users,
  Clock,
  Wrench,
  Settings,
  Megaphone,
  Handshake,
  ChevronDown,
  ChevronUp,
  Minus,
  AlertTriangle,
  UserPlus,
  User,
  Download,
  Play,
  Info,
  Edit
} from 'lucide-react';
import { NotificationData, getNotificationTypeConfig, getNotificationPriorityConfig, formatNotificationTime } from './NotificationTypes';

// Animations
const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.3); }
  50% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.6); }
`;

interface RichNotificationCardProps {
  notification: NotificationData;
  onAction?: (actionId: string, notificationId: string) => void;
  onMarkAsRead?: (notificationId: string) => void;
  onDismiss?: (notificationId: string) => void;
  showActions?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  variant?: 'default' | 'compact' | 'detailed';
}

export function RichNotificationCard({
  notification,
  onAction,
  onMarkAsRead,
  onDismiss,
  showActions = true,
  isExpanded = false,
  onToggleExpand,
  variant = 'default'
}: RichNotificationCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
  const theme = useTheme();
  
  const typeConfig = getNotificationTypeConfig(notification.type);
  const priorityConfig = getNotificationPriorityConfig(notification.priority);
  const isUnread = notification.status === 'unread';
  
  const handleAction = async (actionId: string) => {
    setIsActionLoading(actionId);
    try {
      if (onAction) {
        await onAction(actionId, notification.id);
      }
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleMarkAsRead = () => {
    if (onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
  };

  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss(notification.id);
    }
  };

  const getPriorityIcon = () => {
    switch (notification.priority) {
      case 'urgent': return <AlertTriangle size={12} />;
      case 'high': return <ChevronUp size={12} />;
      case 'medium': return <Minus size={12} />;
      case 'low': return <ChevronDown size={12} />;
      default: return null;
    }
  };

  const getTypeIcon = () => {
    switch (notification.type) {
      case 'system': return <Settings size={16} />;
      case 'social': return <Users size={16} />;
      case 'marketing': return <Megaphone size={16} />;
      case 'reminder': return <Clock size={16} />;
      case 'achievement': return <Trophy size={16} />;
      case 'collaboration': return <Handshake size={16} />;
      case 'analytics': return <BarChart3 size={16} />;
      case 'tool_update': return <Wrench size={16} />;
      default: return null;
    }
  };

  const getActionIcon = (actionId: string) => {
    switch (actionId) {
      case 'view': return <Eye size={14} />;
      case 'share': return <Share size={14} />;
      case 'follow_back': return <UserPlus size={14} />;
      case 'view_profile': return <User size={14} />;
      case 'view_report': return <BarChart3 size={14} />;
      case 'export': return <Download size={14} />;
      case 'try_tool': return <Play size={14} />;
      case 'learn_more': return <Info size={14} />;
      case 'review': return <Edit size={14} />;
      case 'reschedule': return <Calendar size={14} />;
      case 'accept': return <Check size={14} />;
      case 'decline': return <X size={14} />;
      case 'view_details': return <Info size={14} />;
      default: return null;
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'compact':
        return {
          minHeight: 60,
          '& .MuiCardContent-root': {
            padding: '8px 16px',
            '&:last-child': { paddingBottom: '8px' }
          }
        };
      case 'detailed':
        return {
          minHeight: 120,
          '& .MuiCardContent-root': {
            padding: '20px',
            '&:last-child': { paddingBottom: '20px' }
          }
        };
      default:
        return {
          minHeight: 80,
          '& .MuiCardContent-root': {
            padding: '16px',
            '&:last-child': { paddingBottom: '16px' }
          }
        };
    }
  };

  return (
    <Fade in timeout={300}>
      <Card
        sx={{
          position: 'relative',
          mb: 1,
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          animation: isUnread ? `${slideIn} 0.3s ease-out` : 'none',
          border: `1px solid ${isUnread ? typeConfig.borderColor : 'transparent'}`,
          backgroundColor: isUnread ? typeConfig.bgColor : 'background.paper',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 8px 25px ${alpha(typeConfig.color, 0.15)}`,
            borderColor: typeConfig.borderColor,
          },
          ...getVariantStyles()
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleMarkAsRead}
      >
        {/* Priority indicator */}
        {notification.priority === 'urgent' && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: `linear-gradient(90deg, ${priorityConfig.color} 0%, ${alpha(priorityConfig.color, 0.3)} 100%)`,
              animation: `${pulse} 2s ease-in-out infinite`
            }}
          />
        )}

        {/* Unread indicator */}
        {isUnread && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: typeConfig.color,
              animation: `${glow} 2s ease-in-out infinite`
            }}
          />
        )}

        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            {/* Avatar/Image */}
            <Box sx={{ position: 'relative' }}>
              {notification.image ? (
                <Box
                  component="img"
                  src={notification.image}
                  alt={notification.title}
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    objectFit: 'cover',
                    border: `2px solid ${typeConfig.borderColor}`
                  }}
                />
              ) : notification.avatar ? (
                <Avatar
                  src={notification.avatar}
                  alt={notification.title}
                  sx={{
                    width: 48,
                    height: 48,
                    border: `2px solid ${typeConfig.borderColor}`
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    backgroundColor: typeConfig.bgColor,
                    border: `2px solid ${typeConfig.borderColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: typeConfig.color
                  }}
                >
                  {getTypeIcon()}
                </Box>
              )}
              
              {/* Type badge */}
              <Chip
                label={typeConfig.label}
                size="small"
                sx={{
                  position: 'absolute',
                  bottom: -8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: typeConfig.color,
                  color: 'white',
                  fontSize: '0.65rem',
                  height: 16,
                  '& .MuiChip-label': { px: 1 }
                }}
              />
            </Box>

            {/* Content */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {/* Header */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: isUnread ? 600 : 500,
                    color: 'text.primary',
                    lineHeight: 1.2
                  }}
                >
                  {notification.title}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {/* Priority indicator */}
                  {notification.priority !== 'medium' && (
                    <Chip
                      icon={getPriorityIcon()}
                      label={priorityConfig.label}
                      size="small"
                      sx={{
                        backgroundColor: alpha(priorityConfig.color, 0.1),
                        color: priorityConfig.color,
                        border: `1px solid ${alpha(priorityConfig.color, 0.3)}`,
                        fontSize: '0.65rem',
                        height: 20
                      }}
                    />
                  )}
                  
                  {/* Time */}
                  <Typography variant="caption" color="text.secondary">
                    {formatNotificationTime(notification.timestamp)}
                  </Typography>
                </Box>
              </Box>

              {/* Message */}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 1,
                  lineHeight: 1.4,
                  display: '-webkit-box',
                  WebkitLineClamp: variant === 'compact' ? 1 : 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {notification.message}
              </Typography>

              {/* Description (if expanded or detailed) */}
              {notification.description && (isExpanded || variant === 'detailed') && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    lineHeight: 1.4,
                    fontStyle: 'italic'
                  }}
                >
                  {notification.description}
                </Typography>
              )}

              {/* Actions */}
              {showActions && notification.actions && notification.actions.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {notification.actions.slice(0, variant === 'compact' ? 2 : 3).map((action) => (
                    <Button
                      key={action.id}
                      size="small"
                      variant={action.type === 'primary' ? 'contained' : 'outlined'}
                      color={action.type === 'danger' ? 'error' : 'primary'}
                      startIcon={getActionIcon(action.id)}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction(action.id);
                      }}
                      disabled={isActionLoading === action.id}
                      sx={{
                        minWidth: 'auto',
                        px: 2,
                        py: 0.5,
                        fontSize: '0.75rem',
                        borderRadius: '16px',
                        textTransform: 'none',
                        ...(action.type === 'primary' && {
                          background: `linear-gradient(135deg, ${typeConfig.color} 0%, ${alpha(typeConfig.color, 0.8)} 100%)`,
                          '&:hover': {
                            background: `linear-gradient(135deg, ${alpha(typeConfig.color, 0.9)} 0%, ${alpha(typeConfig.color, 0.7)} 100%)`,
                          }
                        })
                      }}
                    >
                      {action.label}
                    </Button>
                  ))}
                  
                  {/* Show more actions if there are more than 3 */}
                  {notification.actions.length > 3 && variant !== 'compact' && (
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onToggleExpand) onToggleExpand();
                      }}
                    >
                      <MoreVertical size={16} />
                    </IconButton>
                  )}
                </Box>
              )}

              {/* Expanded actions */}
              {isExpanded && notification.actions && notification.actions.length > 3 && (
                <Collapse in={isExpanded} timeout="auto">
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                    {notification.actions.slice(3).map((action) => (
                      <Button
                        key={action.id}
                        size="small"
                        variant="outlined"
                        color="primary"
                        startIcon={getActionIcon(action.id)}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAction(action.id);
                        }}
                        disabled={isActionLoading === action.id}
                        sx={{
                          minWidth: 'auto',
                          px: 2,
                          py: 0.5,
                          fontSize: '0.75rem',
                          borderRadius: '16px',
                          textTransform: 'none'
                        }}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </Box>
                </Collapse>
              )}
            </Box>

            {/* Quick actions */}
            {isHovered && (
              <Fade in timeout={200}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsRead();
                    }}
                    sx={{ color: 'text.secondary' }}
                  >
                    <Eye size={16} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDismiss();
                    }}
                    sx={{ color: 'text.secondary' }}
                  >
                    <X size={16} />
                  </IconButton>
                </Box>
              </Fade>
            )}
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
}

export default RichNotificationCard;
