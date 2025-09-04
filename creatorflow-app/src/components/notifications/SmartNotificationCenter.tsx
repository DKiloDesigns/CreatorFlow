'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Badge,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Chip,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Slider,
  Divider,
  LinearProgress,
  Tooltip,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Bell,
  X,
  Settings,
  Brain,
  TrendingUp,
  Users,
  MessageCircle,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  MoreVertical,
  Zap,
  Target,
  BarChart3,
} from 'lucide-react';
import { useSmartNotifications } from '@/contexts/SmartNotificationContext';
import { useMinimalTheme } from '@/contexts/MinimalThemeContext';

const NOTIFICATION_ICONS = {
  content: MessageCircle,
  engagement: TrendingUp,
  system: Settings,
  collaboration: Users,
  ai_insight: Brain,
};

const PRIORITY_COLORS = {
  low: 'default',
  medium: 'primary',
  high: 'warning',
  urgent: 'error',
} as const;

export function SmartNotificationCenter() {
  const { isDark } = useMinimalTheme();
  const {
    notifications,
    preferences,
    behavior,
    isLearning,
    markAsRead,
    dismissNotification,
    updatePreferences,
    getSmartNotifications,
    getNotificationInsights,
  } = useSmartNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'ai_insight' | 'collaboration'>('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const smartNotifications = getSmartNotifications();
  const insights = getNotificationInsights();
  const unreadCount = notifications.filter(n => !n.read && !n.dismissed).length;

  const filteredNotifications = smartNotifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    if (filter === 'ai_insight') return notification.type === 'ai_insight';
    if (filter === 'collaboration') return notification.type === 'collaboration';
    return true;
  });

  const getNotificationIcon = (type: string) => {
    const Icon = NOTIFICATION_ICONS[type as keyof typeof NOTIFICATION_ICONS] || Bell;
    return <Icon size={20} />;
  };

  const getPriorityColor = (priority: string) => {
    return PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS] || 'default';
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleNotificationAction = (notificationId: string, action: string) => {
    // Handle notification actions (like, comment, share, etc.)
    console.log(`Action ${action} for notification ${notificationId}`);
    markAsRead(notificationId);
  };

  return (
    <>
      {/* Notification Bell */}
      <Tooltip title="Smart Notifications">
        <IconButton
          onClick={() => setIsOpen(!isOpen)}
          sx={{
            position: 'relative',
            bgcolor: isOpen ? 'primary.main' : 'background.paper',
            color: isOpen ? 'primary.contrastText' : 'text.primary',
            '&:hover': {
              bgcolor: isOpen ? 'primary.dark' : 'action.hover',
            },
          }}
        >
          <Badge
            badgeContent={unreadCount}
            color="error"
            invisible={unreadCount === 0}
            max={99}
          >
            <Bell size={20} />
          </Badge>
        </IconButton>
      </Tooltip>

      {/* Notification Panel */}
      {isOpen && (
        <Paper
          sx={{
            position: 'absolute',
            top: '100%',
            right: 0,
            mt: 1,
            width: 400,
            maxHeight: 600,
            overflow: 'hidden',
            zIndex: 1000,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }}
        >
          {/* Header */}
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Brain size={20} />
                Smart Notifications
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton size="small" onClick={() => setShowSettings(true)}>
                  <Settings size={16} />
                </IconButton>
                <IconButton size="small" onClick={() => setIsOpen(false)}>
                  <X size={16} />
                </IconButton>
              </Box>
            </Box>

            {/* AI Learning Progress */}
            {isLearning && (
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    AI Learning Progress
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {insights.learningProgress.toFixed(0)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={insights.learningProgress}
                  sx={{ height: 4, borderRadius: 2 }}
                />
              </Box>
            )}

            {/* Filter Tabs */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[
                { key: 'all', label: 'All', count: smartNotifications.length },
                { key: 'unread', label: 'Unread', count: unreadCount },
                { key: 'ai_insight', label: 'AI', count: smartNotifications.filter(n => n.type === 'ai_insight').length },
                { key: 'collaboration', label: 'Team', count: smartNotifications.filter(n => n.type === 'collaboration').length },
              ].map((tab) => (
                <Chip
                  key={tab.key}
                  label={`${tab.label} ${tab.count > 0 ? `(${tab.count})` : ''}`}
                  size="small"
                  variant={filter === tab.key ? 'filled' : 'outlined'}
                  onClick={() => setFilter(tab.key as any)}
                  sx={{ fontSize: '0.75rem' }}
                />
              ))}
            </Box>
          </Box>

          {/* Notifications List */}
          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            {filteredNotifications.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Bell size={48} color={isDark ? '#666' : '#999'} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  No notifications to show
                </Typography>
              </Box>
            ) : (
              <List dense>
                {filteredNotifications.map((notification) => (
                  <ListItem
                    key={notification.id}
                    sx={{
                      bgcolor: notification.read ? 'transparent' : 'action.hover',
                      borderLeft: notification.read ? 'none' : '3px solid',
                      borderLeftColor: 'primary.main',
                      '&:hover': {
                        bgcolor: 'action.selected',
                      },
                    }}
                  >
                    <ListItemIcon>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: notification.type === 'ai_insight' ? 'primary.main' : 'background.paper',
                          color: notification.type === 'ai_insight' ? 'primary.contrastText' : 'text.primary',
                        }}
                      >
                        {getNotificationIcon(notification.type)}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: notification.read ? 400 : 600 }}>
                            {notification.title}
                          </Typography>
                          <Chip
                            label={notification.priority}
                            size="small"
                            color={getPriorityColor(notification.priority)}
                            sx={{ fontSize: '0.65rem', height: 16 }}
                          />
                          {notification.type === 'ai_insight' && (
                            <Chip
                              icon={<Zap size={12} />}
                              label={`${(notification.aiScore * 100).toFixed(0)}%`}
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{ fontSize: '0.65rem', height: 16 }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {notification.message}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              {formatTimestamp(notification.timestamp)}
                            </Typography>
                            {notification.actionRequired && (
                              <Chip
                                label="Action Required"
                                size="small"
                                color="warning"
                                sx={{ fontSize: '0.65rem', height: 16 }}
                              />
                            )}
                          </Box>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => markAsRead(notification.id)}
                          disabled={notification.read}
                        >
                          <CheckCircle size={14} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => dismissNotification(notification.id)}
                        >
                          <X size={14} />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>

          {/* Footer */}
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                {insights.totalNotifications} total • {insights.readRate.toFixed(0)}% read rate
              </Typography>
              <Button size="small" onClick={() => setShowSettings(true)}>
                Manage Preferences
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Settings Dialog */}
      <Dialog open={showSettings} onClose={() => setShowSettings(false)} maxWidth="md" fullWidth>
        <DialogTitle>Smart Notification Preferences</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {/* AI Learning Status */}
            <Paper sx={{ p: 2, mb: 3, bgcolor: 'primary.50' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Brain size={20} color="#1976d2" />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  AI Learning Status
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Our AI is learning your notification preferences to provide more relevant alerts.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="caption">Learning Progress</Typography>
                <Typography variant="caption">{insights.learningProgress.toFixed(0)}%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={insights.learningProgress} />
            </Paper>

            {/* Notification Preferences */}
            <Typography variant="h6" sx={{ mb: 2 }}>
              Notification Types
            </Typography>
            {preferences.map((pref) => (
              <Paper key={pref.type} sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getNotificationIcon(pref.type)}
                    <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                      {pref.type.replace('_', ' ')}
                    </Typography>
                  </Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={pref.enabled}
                        onChange={(e) => updatePreferences(pref.type, { enabled: e.target.checked })}
                      />
                    }
                    label=""
                  />
                </Box>
                
                {pref.enabled && (
                  <Box sx={{ ml: 4 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Priority Level
                      </Typography>
                      <Slider
                        value={pref.priority === 'low' ? 1 : pref.priority === 'medium' ? 2 : pref.priority === 'high' ? 3 : 4}
                        min={1}
                        max={4}
                        step={1}
                        marks={[
                          { value: 1, label: 'Low' },
                          { value: 2, label: 'Medium' },
                          { value: 3, label: 'High' },
                          { value: 4, label: 'Urgent' },
                        ]}
                        onChange={(_, value) => {
                          const priorityMap = { 1: 'low', 2: 'medium', 3: 'high', 4: 'urgent' };
                          updatePreferences(pref.type, { priority: priorityMap[value as number] as any });
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Delivery Channels
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {['in-app', 'email', 'push'].map((channel) => (
                          <FormControlLabel
                            key={channel}
                            control={
                              <Switch
                                size="small"
                                checked={pref.channels.includes(channel as any)}
                                onChange={(e) => {
                                  const newChannels = e.target.checked
                                    ? [...pref.channels, channel as any]
                                    : pref.channels.filter(c => c !== channel);
                                  updatePreferences(pref.type, { channels: newChannels });
                                }}
                              />
                            }
                            label={channel}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Box>
                )}
              </Paper>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettings(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
