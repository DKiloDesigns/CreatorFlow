'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  Typography,
  IconButton,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Badge,
  Fade,
  Slide,
  keyframes,
  alpha
} from '@mui/material';
import {
  X,
  Search,
  Filter,
  MoreVertical,
  Settings,
  Bell,
  Check,
  Archive,
  Trash2,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { NotificationData, NotificationGroup as NotificationGroupType, groupNotifications } from './NotificationTypes';
import RichNotificationCard from './RichNotificationCard';
import NotificationGroup from './NotificationGroup';

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

interface EnhancedNotificationCenterProps {
  open: boolean;
  onClose: () => void;
  notifications?: NotificationData[];
  onNotificationAction?: (actionId: string, notificationId: string) => void;
  onMarkAsRead?: (notificationId: string) => void;
  onDismiss?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
  onDismissAll?: () => void;
  variant?: 'drawer' | 'dropdown' | 'modal';
  width?: number;
}

export function EnhancedNotificationCenter({
  open,
  onClose,
  notifications = [],
  onNotificationAction,
  onMarkAsRead,
  onDismiss,
  onMarkAllAsRead,
  onDismissAll,
  variant = 'drawer',
  width = 400
}: EnhancedNotificationCenterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [filterType, setFilterType] = useState<string>('all');
  const [groupedNotifications, setGroupedNotifications] = useState<NotificationGroupType[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<NotificationData[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter and group notifications
  useEffect(() => {
    let filtered = notifications;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(notification =>
        notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(notification => notification.type === filterType);
    }

    // Filter by tab (unread/read/all)
    switch (activeTab) {
      case 0: // Unread
        filtered = filtered.filter(notification => notification.status === 'unread');
        break;
      case 1: // Read
        filtered = filtered.filter(notification => notification.status === 'read');
        break;
      case 2: // All
        // No additional filtering
        break;
    }

    setFilteredNotifications(filtered);
    setGroupedNotifications(groupNotifications(filtered));
  }, [notifications, searchQuery, filterType, activeTab]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleMarkAllAsRead = () => {
    if (onMarkAllAsRead) {
      onMarkAllAsRead();
    } else {
      // Default behavior
      console.log('Mark all as read');
    }
  };

  const handleDismissAll = () => {
    if (onDismissAll) {
      onDismissAll();
    } else {
      // Default behavior
      console.log('Dismiss all');
    }
  };

  const handleNotificationAction = (actionId: string, notificationId: string) => {
    if (onNotificationAction) {
      onNotificationAction(actionId, notificationId);
    } else {
      console.log(`Action ${actionId} for notification ${notificationId}`);
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    if (onMarkAsRead) {
      onMarkAsRead(notificationId);
    } else {
      console.log(`Mark notification ${notificationId} as read`);
    }
  };

  const handleDismiss = (notificationId: string) => {
    if (onDismiss) {
      onDismiss(notificationId);
    } else {
      console.log(`Dismiss notification ${notificationId}`);
    }
  };

  const unreadCount = notifications.filter(n => n.status === 'unread').length;
  const totalCount = notifications.length;

  const getTabLabel = (index: number) => {
    switch (index) {
      case 0: return `Unread (${notifications.filter(n => n.status === 'unread').length})`;
      case 1: return `Read (${notifications.filter(n => n.status === 'read').length})`;
      case 2: return `All (${totalCount})`;
      default: return '';
    }
  };

  const content = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          p: 3,
          borderBottom: '1px solid',
          borderColor: 'divider',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                animation: unreadCount > 0 ? `${pulse} 2s ease-in-out infinite` : 'none'
              }}
            >
              <Bell size={20} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Notifications
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              size="small"
              onClick={handleRefresh}
              disabled={isRefreshing}
              sx={{ color: 'text.secondary' }}
            >
              <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            </IconButton>
            
            <IconButton
              size="small"
              onClick={onClose}
              sx={{ color: 'text.secondary' }}
            >
              <X size={20} />
            </IconButton>
          </Box>
        </Box>

        {/* Search */}
        <TextField
          fullWidth
          size="small"
          placeholder="Search notifications..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={16} />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={16} />
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              backgroundColor: 'background.paper'
            }
          }}
        />
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              minHeight: 48
            }
          }}
        >
          <Tab label={getTabLabel(0)} />
          <Tab label={getTabLabel(1)} />
          <Tab label={getTabLabel(2)} />
        </Tabs>
      </Box>

      {/* Actions */}
      <Box sx={{ p: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button
          size="small"
          startIcon={<Check size={14} />}
          onClick={handleMarkAllAsRead}
          disabled={unreadCount === 0}
          sx={{ borderRadius: '8px' }}
        >
          Mark All Read
        </Button>
        
        <Button
          size="small"
          startIcon={<Archive size={14} />}
          onClick={handleDismissAll}
          disabled={totalCount === 0}
          sx={{ borderRadius: '8px' }}
        >
          Dismiss All
        </Button>

        <Chip
          label={`${filteredNotifications.length} notifications`}
          size="small"
          sx={{ ml: 'auto' }}
        />
      </Box>

      {/* Notifications */}
      <Box sx={{ flex: 1, overflow: 'auto', px: 2, pb: 2 }}>
        {filteredNotifications.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
              py: 4
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2
              }}
            >
              <Bell size={32} color="#6366f1" />
            </Box>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No notifications
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchQuery ? 'No notifications match your search.' : 'You\'re all caught up!'}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {groupedNotifications.map((group) => (
              <NotificationGroup
                key={group.id}
                group={group}
                onAction={handleNotificationAction}
                onMarkAsRead={handleMarkAsRead}
                onDismiss={handleDismiss}
                variant="default"
                showGroupActions={true}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );

  if (variant === 'drawer') {
    return (
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: width,
            maxWidth: '90vw',
            animation: open ? `${slideIn} 0.3s ease-out` : 'none'
          }
        }}
      >
        {content}
      </Drawer>
    );
  }

  // For dropdown or modal variants, you would implement them here
  return null;
}

export default EnhancedNotificationCenter;
