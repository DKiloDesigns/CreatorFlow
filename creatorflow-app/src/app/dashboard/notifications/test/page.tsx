'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Alert,
  Chip,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import {
  Bell,
  PostAdd,
  Schedule,
  Publish,
  ThumbUp,
  Build,
  Storage,
  Announcement,
  PlayArrow,
  CheckCircle,
} from '@mui/icons-material';

const testTriggers = [
  {
    id: 'post_created',
    title: 'Post Created',
    description: 'Test notification when a post is created',
    icon: <PostAdd />,
    color: 'primary',
  },
  {
    id: 'post_scheduled',
    title: 'Post Scheduled',
    description: 'Test notification when a post is scheduled',
    icon: <Schedule />,
    color: 'info',
  },
  {
    id: 'post_published',
    title: 'Post Published',
    description: 'Test notification when a post is published',
    icon: <Publish />,
    color: 'success',
  },
  {
    id: 'post_engagement',
    title: 'Post Engagement',
    description: 'Test notification for post engagement',
    icon: <ThumbUp />,
    color: 'warning',
  },
  {
    id: 'tool_used',
    title: 'Tool Used',
    description: 'Test notification when a tool is used',
    icon: <Build />,
    color: 'secondary',
  },
  {
    id: 'bulk_operation',
    title: 'Bulk Operation',
    description: 'Test notification for bulk operations',
    icon: <Storage />,
    color: 'error',
  },
  {
    id: 'system_event',
    title: 'System Event',
    description: 'Test notification for system events',
    icon: <Announcement />,
    color: 'default',
  },
  {
    id: 'all',
    title: 'All Notifications',
    description: 'Create all test notifications at once',
    icon: <PlayArrow />,
    color: 'primary',
  },
];

export default function NotificationTestPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const triggerNotification = async (triggerType: string) => {
    setLoading(triggerType);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/notifications/test-triggers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ triggerType }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
      } else {
        setError(data.message || 'Failed to create notification');
      }
    } catch (err) {
      setError('Network error: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(null);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <Bell sx={{ fontSize: 40 }} />
          Notification Test Center
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Test different notification triggers to see how they work
        </Typography>
        <Alert severity="info" sx={{ maxWidth: 600, mx: 'auto' }}>
          Click any button below to create a test notification. Check the notification bell in the top bar to see the results!
        </Alert>
      </Box>

      <Grid container spacing={3}>
        {testTriggers.map((trigger) => (
          <Grid item xs={12} sm={6} md={4} key={trigger.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ 
                    p: 1, 
                    borderRadius: 1, 
                    bgcolor: `${trigger.color}.light`, 
                    color: `${trigger.color}.contrastText`,
                    mr: 2 
                  }}>
                    {trigger.icon}
                  </Box>
                  <Typography variant="h6" component="h3">
                    {trigger.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {trigger.description}
                </Typography>
              </CardContent>
              
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  variant="contained"
                  color={trigger.color as any}
                  fullWidth
                  onClick={() => triggerNotification(trigger.id)}
                  disabled={loading === trigger.id}
                  startIcon={loading === trigger.id ? <CircularProgress size={20} /> : <PlayArrow />}
                >
                  {loading === trigger.id ? 'Creating...' : 'Test Notification'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          💡 Tip: After creating notifications, click the notification bell in the top navigation to see them!
        </Typography>
      </Box>

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
        >
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}