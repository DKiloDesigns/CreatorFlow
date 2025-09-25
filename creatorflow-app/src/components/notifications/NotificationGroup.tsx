'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Collapse,
  Chip,
  Divider,
  alpha,
  keyframes
} from '@mui/material';
import {
  ChevronDown,
  ChevronUp,
  Settings,
  Users,
  Megaphone,
  Clock,
  Trophy,
  Handshake,
  BarChart3,
  Wrench
} from 'lucide-react';
import { NotificationGroup as NotificationGroupType, getNotificationTypeConfig } from './NotificationTypes';
import RichNotificationCard from './RichNotificationCard';

// Animations
const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

interface NotificationGroupProps {
  group: NotificationGroupType;
  onAction?: (actionId: string, notificationId: string) => void;
  onMarkAsRead?: (notificationId: string) => void;
  onDismiss?: (notificationId: string) => void;
  onToggleGroup?: (groupId: string) => void;
  variant?: 'default' | 'compact';
  showGroupActions?: boolean;
}

export function NotificationGroup({
  group,
  onAction,
  onMarkAsRead,
  onDismiss,
  onToggleGroup,
  variant = 'default',
  showGroupActions = true
}: NotificationGroupProps) {
  const [isExpanded, setIsExpanded] = useState(!group.isCollapsed);
  const typeConfig = getNotificationTypeConfig(group.type);
  const hasUnreadNotifications = group.notifications.some(n => n.status === 'unread');

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    if (onToggleGroup) {
      onToggleGroup(group.id);
    }
  };

  const getTypeIcon = () => {
    switch (group.type) {
      case 'system': return <Settings size={20} />;
      case 'social': return <Users size={20} />;
      case 'marketing': return <Megaphone size={20} />;
      case 'reminder': return <Clock size={20} />;
      case 'achievement': return <Trophy size={20} />;
      case 'collaboration': return <Handshake size={20} />;
      case 'analytics': return <BarChart3 size={20} />;
      case 'tool_update': return <Wrench size={20} />;
      default: return null;
    }
  };

  const handleGroupAction = (action: 'mark_all_read' | 'dismiss_all') => {
    group.notifications.forEach(notification => {
      if (action === 'mark_all_read' && onMarkAsRead) {
        onMarkAsRead(notification.id);
      } else if (action === 'dismiss_all' && onDismiss) {
        onDismiss(notification.id);
      }
    });
  };

  return (
    <Card
      sx={{
        mb: 2,
        border: `1px solid ${typeConfig.borderColor}`,
        backgroundColor: hasUnreadNotifications ? typeConfig.bgColor : 'background.paper',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: `0 4px 20px ${alpha(typeConfig.color, 0.1)}`,
        }
      }}
    >
      {/* Group Header */}
      <CardContent
        sx={{
          py: 2,
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: alpha(typeConfig.color, 0.05)
          }
        }}
        onClick={handleToggle}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Type Icon */}
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                backgroundColor: typeConfig.bgColor,
                border: `2px solid ${typeConfig.borderColor}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: typeConfig.color,
                animation: hasUnreadNotifications ? `${pulse} 2s ease-in-out infinite` : 'none'
              }}
            >
              {getTypeIcon()}
            </Box>

            {/* Group Info */}
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: hasUnreadNotifications ? 600 : 500,
                  color: 'text.primary',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                {group.title}
                <Chip
                  label={group.count}
                  size="small"
                  sx={{
                    backgroundColor: typeConfig.color,
                    color: 'white',
                    fontWeight: 600,
                    minWidth: 24,
                    height: 20
                  }}
                />
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                {hasUnreadNotifications 
                  ? `${group.notifications.filter(n => n.status === 'unread').length} unread notifications`
                  : 'All notifications read'
                }
              </Typography>
            </Box>
          </Box>

          {/* Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {showGroupActions && (
              <>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGroupAction('mark_all_read');
                  }}
                  sx={{ color: 'text.secondary' }}
                  title="Mark all as read"
                >
                  <Settings size={16} />
                </IconButton>
                
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGroupAction('dismiss_all');
                  }}
                  sx={{ color: 'text.secondary' }}
                  title="Dismiss all"
                >
                  <ChevronUp size={16} />
                </IconButton>
              </>
            )}

            {/* Expand/Collapse */}
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleToggle();
              }}
              sx={{ color: 'text.secondary' }}
            >
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </IconButton>
          </Box>
        </Box>
      </CardContent>

      {/* Notifications */}
      <Collapse in={isExpanded} timeout="auto">
        <Box sx={{ px: 2, pb: 2 }}>
          <Divider sx={{ mb: 2, borderColor: typeConfig.borderColor }} />
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {group.notifications.map((notification, index) => (
              <Box
                key={notification.id}
                sx={{
                  animation: `${slideDown} 0.3s ease-out ${index * 0.1}s both`
                }}
              >
                <RichNotificationCard
                  notification={notification}
                  onAction={onAction}
                  onMarkAsRead={onMarkAsRead}
                  onDismiss={onDismiss}
                  variant={variant}
                  showActions={true}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Collapse>
    </Card>
  );
}

export default NotificationGroup;
