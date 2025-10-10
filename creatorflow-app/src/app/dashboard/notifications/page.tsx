'use client';

import React, { useEffect, useState } from 'react';
import { useUserNotifications } from '@/hooks/useUserNotifications';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardHeader,
  Switch,
  FormControlLabel,
  FormGroup,
  Container,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
  Alert,
  AlertTitle,
  Divider
} from '@mui/material';
import { 
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Chat as ChatIcon,
  AlternateEmail as AlternateEmailIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

interface NotifPrefs {
  mentions: boolean;
  comments: boolean;
  system: boolean;
}

interface Announcement {
  id: string;
  title: string;
  body: string;
  publishedAt: string | null;
  readBy: { id: string }[];
}

const defaultPrefs: NotifPrefs = {
  mentions: true,
  comments: true,
  system: true,
};

export default function NotificationsPage() {
  const { notifications, isLoading, error, updating, updateError, updatePrefs, markAllRead } = useUserNotifications();
  const [prefs, setPrefs] = useState<NotifPrefs>(defaultPrefs);
  const [success, setSuccess] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [annLoading, setAnnLoading] = useState(true);
  const [annError, setAnnError] = useState<string | null>(null);
  const [marking, setMarking] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (notifications?.prefs) {
      setPrefs({ ...defaultPrefs, ...notifications.prefs });
    }
  }, [notifications]);

  useEffect(() => {
    // Fetch announcements and user id
    async function fetchAnnouncements() {
      setAnnLoading(true);
      try {
        const res = await fetch('/api/announcements');
        if (!res.ok) throw new Error('Failed to fetch announcements');
        const data = await res.json();
        setAnnouncements(data);
        // Try to get user id from first readBy or from session
        if (data.length > 0 && data[0].readBy) {
          // Assume current user is not in readBy if unread
          const allIds = data.flatMap((a: Announcement) => a.readBy.map(u => u.id));
          if (allIds.length > 0) setUserId(allIds[0]);
        }
      } catch (e: any) {
        setAnnError(e.message || 'Failed to load announcements');
      } finally {
        setAnnLoading(false);
      }
    }
    fetchAnnouncements();
  }, []);

  const handlePrefChange = (type: keyof NotifPrefs, value: boolean) => {
    setPrefs((prev) => ({ ...prev, [type]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    await updatePrefs(prefs);
    setSuccess(true);
  };

  const handleMarkAllRead = async () => {
    await markAllRead();
  };

  async function markAnnouncementRead(id: string) {
    setMarking(id);
    await fetch('/api/announcements', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setAnnouncements(a => a.map(an => an.id === id ? { ...an, readBy: [...an.readBy, { id: userId || 'me' }] } : an));
    setMarking(null);
  }

  const unreadAnnouncements = announcements.filter(a => !a.readBy.some(u => u.id === userId));

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {error.message || 'Error loading notifications.'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Header */}
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
            Notifications
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Manage your notification preferences and view announcements
          </Typography>
        </Box>

        {/* Announcements */}
        <Card>
          <CardHeader
            title={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Admin Announcements
                </Typography>
                {unreadAnnouncements.length > 0 && (
                  <Chip 
                    label={`${unreadAnnouncements.length} unread`} 
                    color="warning" 
                    size="small"
                  />
                )}
              </Box>
            }
            titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
            avatar={<NotificationsIcon style={{ width: 24, height: 24, color: '#f59e0b' }} />}
          />
          <CardContent>
            {annLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : annError ? (
              <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                {annError}
              </Alert>
            ) : announcements.length === 0 ? (
              <Typography sx={{ color: 'text.secondary', textAlign: 'center', py: 2 }}>
                No announcements
              </Typography>
            ) : (
              <List>
                {announcements.map((announcement) => {
                  const isRead = announcement.readBy.some(u => u.id === userId);
                  return (
                    <ListItem 
                      key={announcement.id} 
                      divider
                      sx={{ 
                        bgcolor: isRead ? 'grey.50' : 'warning.50',
                        borderRadius: 1,
                        mb: 1
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                            {announcement.title}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" sx={{ mb: 1, whiteSpace: 'pre-line' }}>
                              {announcement.body}
                            </Typography>
                            {announcement.publishedAt && (
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {new Date(announcement.publishedAt).toLocaleString()}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                      {!isRead && (
                        <Button
                          variant="contained"
                          size="small"
                          disabled={marking === announcement.id}
                          onClick={() => markAnnouncementRead(announcement.id)}
                          sx={{ ml: 2 }}
                        >
                          {marking === announcement.id ? 'Marking...' : 'Mark as read'}
                        </Button>
                      )}
                    </ListItem>
                  );
                })}
              </List>
            )}
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader
            title="Notification Preferences"
            titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
            avatar={<SettingsIcon style={{ width: 24, height: 24, color: '#3b82f6' }} />}
          />
          <CardContent>
            <Box component="form" onSubmit={handleSave} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={prefs.mentions}
                      onChange={(e) => handlePrefChange('mentions', e.target.checked)}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AlternateEmailIcon style={{ width: 16, height: 16 }} />
                      Mentions
                    </Box>
                  }
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={prefs.comments}
                      onChange={(e) => handlePrefChange('comments', e.target.checked)}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ChatIcon style={{ width: 16, height: 16 }} />
                      Comments
                    </Box>
                  }
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={prefs.system}
                      onChange={(e) => handlePrefChange('system', e.target.checked)}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ErrorIcon style={{ width: 16, height: 16 }} />
                      System Alerts
                    </Box>
                  }
                />
              </FormGroup>

              {updateError && (
                <Alert severity="error">
                  <AlertTitle>Error</AlertTitle>
                  {updateError}
                </Alert>
              )}

              {success && !updateError && (
                <Alert severity="success">
                  <AlertTitle>Success</AlertTitle>
                  Preferences saved!
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                disabled={updating}
                sx={{ alignSelf: 'flex-start' }}
              >
                {updating ? 'Saving...' : 'Save Preferences'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card>
          <CardHeader
            title="Recent Notifications"
            titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
            avatar={<NotificationsIcon style={{ width: 24, height: 24, color: '#8b5cf6' }} />}
          />
          <CardContent>
            <List>
              {notifications?.list && notifications.list.length > 0 ? (
                notifications.list.map((n: any) => (
                  <ListItem key={n.id} divider>
                    <ListItemText
                      primary={n.text}
                      sx={{ 
                        color: n.read ? 'text.secondary' : 'text.primary',
                        textDecoration: n.read ? 'line-through' : 'none'
                      }}
                    />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText
                    primary="No notifications"
                    sx={{ color: 'text.secondary', fontStyle: 'italic' }}
                  />
                </ListItem>
              )}
            </List>
            
            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                onClick={handleMarkAllRead}
                disabled={updating}
                startIcon={<CheckCircleIcon style={{ width: 16, height: 16 }} />}
              >
                Mark All as Read
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
} 