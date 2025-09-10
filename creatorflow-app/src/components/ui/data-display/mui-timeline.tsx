'use client';

import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Paper,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Timeline as MuiTimeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import { designTokens } from '@/lib/design-system';

export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  timestamp: Date;
  icon?: React.ReactNode;
  avatar?: string;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  variant?: 'filled' | 'outlined';
  status?: 'completed' | 'in-progress' | 'pending' | 'cancelled';
  metadata?: {
    user?: string;
    action?: string;
    category?: string;
    tags?: string[];
  };
  actions?: React.ReactNode;
  onClick?: () => void;
}

export interface TimelineProps {
  events: TimelineEvent[];
  orientation?: 'left' | 'right' | 'alternate';
  showOppositeContent?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  onEventClick?: (event: TimelineEvent) => void;
  onEventAction?: (event: TimelineEvent, action: string) => void;
  sx?: any;
}

export const Timeline: React.FC<TimelineProps> = ({
  events,
  orientation = 'right',
  showOppositeContent = false,
  loading = false,
  emptyMessage = 'No events to display',
  onEventClick,
  onEventAction,
  sx,
}) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'primary';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'primary';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'completed': return '✓';
      case 'in-progress': return '⏳';
      case 'pending': return '⏸️';
      case 'cancelled': return '✗';
      default: return '•';
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 2, ...sx }}>
        <Typography variant="h6" gutterBottom>Loading timeline...</Typography>
        {[1, 2, 3].map((i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ mr: 2, bgcolor: 'grey.300' }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1" sx={{ bgcolor: 'grey.300', height: 20, mb: 1, borderRadius: 1 }} />
              <Typography variant="body2" sx={{ bgcolor: 'grey.200', height: 16, width: '60%', borderRadius: 1 }} />
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  if (events.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center', ...sx }}>
        <Typography variant="body1" color="text.secondary">
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <MuiTimeline
      position={orientation}
      sx={{
        '& .MuiTimelineItem-root:before': {
          display: 'none',
        },
        ...sx,
      }}
    >
      {events.map((event, index) => (
        <TimelineItem key={event.id}>
          {showOppositeContent && (
            <TimelineOppositeContent
              sx={{
                flex: 0.3,
                textAlign: 'right',
                pr: 2,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {event.timestamp.toLocaleDateString()}
              </Typography>
              <Typography variant="caption" display="block" color="text.secondary">
                {event.timestamp.toLocaleTimeString()}
              </Typography>
            </TimelineOppositeContent>
          )}
          
          <TimelineSeparator>
            <TimelineDot
              color={getStatusColor(event.status)}
              variant={event.variant || 'filled'}
              sx={{
                bgcolor: event.color ? designTokens.colors[event.color][500] : undefined,
                color: 'white',
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
                fontWeight: 'bold',
              }}
            >
              {event.icon || getStatusIcon(event.status)}
            </TimelineDot>
            {index < events.length - 1 && (
              <TimelineConnector
                sx={{
                  bgcolor: designTokens.colors.neutral[200],
                  height: 20,
                }}
              />
            )}
          </TimelineSeparator>
          
          <TimelineContent>
            <Paper
              elevation={1}
              sx={{
                p: 2,
                cursor: event.onClick ? 'pointer' : 'default',
                '&:hover': event.onClick ? {
                  elevation: 3,
                  bgcolor: designTokens.colors.neutral[50],
                } : {},
                transition: 'all 0.2s ease-in-out',
              }}
              onClick={() => {
                onEventClick?.(event);
                event.onClick?.();
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {event.title}
                </Typography>
                {event.status && (
                  <Chip
                    label={event.status.replace('-', ' ')}
                    color={getStatusColor(event.status) as any}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
              
              {event.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {event.description}
                </Typography>
              )}
              
              {event.metadata && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                  {event.metadata.user && (
                    <Chip
                      label={`By ${event.metadata.user}`}
                      size="small"
                      variant="outlined"
                      color="info"
                    />
                  )}
                  {event.metadata.action && (
                    <Chip
                      label={event.metadata.action}
                      size="small"
                      variant="outlined"
                      color="secondary"
                    />
                  )}
                  {event.metadata.category && (
                    <Chip
                      label={event.metadata.category}
                      size="small"
                      variant="outlined"
                      color="default"
                    />
                  )}
                  {event.metadata.tags?.map((tag, tagIndex) => (
                    <Chip
                      key={tagIndex}
                      label={tag}
                      size="small"
                      variant="outlined"
                      color="default"
                    />
                  ))}
                </Box>
              )}
              
              {!showOppositeContent && (
                <Typography variant="caption" color="text.secondary">
                  {event.timestamp.toLocaleString()}
                </Typography>
              )}
              
              {event.actions && (
                <Box sx={{ mt: 1, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  {event.actions}
                </Box>
              )}
            </Paper>
          </TimelineContent>
        </TimelineItem>
      ))}
    </MuiTimeline>
  );
};

// Specialized Timeline Components
export const ActivityTimeline: React.FC<Omit<TimelineProps, 'orientation'>> = (props) => (
  <Timeline {...props} orientation="right" />
);

export const EventTimeline: React.FC<Omit<TimelineProps, 'orientation' | 'showOppositeContent'>> = (props) => (
  <Timeline {...props} orientation="alternate" showOppositeContent />
);

export const SimpleTimeline: React.FC<Omit<TimelineProps, 'orientation' | 'showOppositeContent'>> = (props) => (
  <Timeline {...props} orientation="left" />
);

// Export individual components
export { MuiTimeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent };
