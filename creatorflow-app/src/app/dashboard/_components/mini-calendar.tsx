'use client';

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput } from '@fullcalendar/core';
import { FaInstagram, FaTiktok, FaYoutube, FaXTwitter } from "react-icons/fa6";
import { toast } from "sonner";
import { Loader2, AlertCircle } from 'lucide-react';
import { PostStatus } from '@prisma/client';
import { 
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert
} from '@mui/material';
import { Plus, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

// Type for the data fetched from API
interface FetchedPost {
  id: string;
  contentText: string | null;
  mediaUrls: string[];
  platforms: string[];
  status: PostStatus;
  scheduledAt: string | null;
  publishedAt: string | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CalendarEvent extends EventInput {
  extendedProps: {
    postId: string;
    status: PostStatus;
    platforms: string[];
    contentText: string;
    errorMessage: string | null;
  };
}

// Platform icon mapping
const platformIcons: Record<string, any> = {
  'instagram': FaInstagram,
  'tiktok': FaTiktok,
  'youtube': FaYoutube,
  'twitter': FaXTwitter,
  'x': FaXTwitter,
};

// Status color mapping
const statusColors: Record<PostStatus, string> = {
  'draft': '#9e9e9e',
  'scheduled': '#2196f3',
  'published': '#4caf50',
  'failed': '#f44336',
};

// Custom event render for mini calendar
function renderEventContent(eventInfo: any) {
  const { status, platforms, contentText } = eventInfo.event.extendedProps;
  
  return (
    <div className="flex items-center gap-1 text-xs">
      {platforms.slice(0, 2).map((platform: string) => {
        const IconComponent = platformIcons[platform.toLowerCase()];
        return IconComponent ? (
          <IconComponent key={platform} size={10} />
        ) : null;
      })}
      {platforms.length > 2 && <span className="text-xs">+{platforms.length - 2}</span>}
    </div>
  );
}

interface MiniCalendarProps {
  onCreatePost: () => void;
  onBulkSchedule: () => void;
  onViewFullCalendar: () => void;
}

export default function MiniCalendar({ 
  onCreatePost, 
  onBulkSchedule, 
  onViewFullCalendar 
}: MiniCalendarProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/posts/calendar?startDate=2024-01-01&endDate=2024-12-31', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch calendar data (HTTP ${response.status})`);
      }
      
      const data = await response.json();
      const postsByDate = data.posts || {};
      
      // Convert posts to calendar events
      const events: CalendarEvent[] = [];
      Object.entries(postsByDate).forEach(([dateKey, posts]: [string, any]) => {
        posts.forEach((post: FetchedPost) => {
          if (post.scheduledAt) {
            events.push({
              id: post.id,
              title: (post.contentText || '').substring(0, 20) + ((post.contentText || '').length > 20 ? '...' : ''),
              start: new Date(post.scheduledAt),
              allDay: true,
              backgroundColor: statusColors[post.status] || '#2196f3',
              borderColor: statusColors[post.status] || '#2196f3',
              extendedProps: {
                postId: post.id,
                status: post.status,
                platforms: post.platforms,
                contentText: post.contentText || '',
                errorMessage: post.errorMessage,
              },
            });
          }
        });
      });
      
      setCalendarEvents(events);
    } catch (err) {
      console.error("Error fetching calendar posts:", err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleEventClick = (info: any) => {
    const { contentText, status, platforms } = info.event.extendedProps;
    toast.info(`${contentText.substring(0, 100)}...`, {
      description: `Status: ${status} | Platforms: ${platforms.join(', ')}`
    });
  };

  return (
    <Box sx={{ 
      backgroundColor: 'background.paper',
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'divider',
      overflow: 'hidden'
    }}>
      {/* Calendar Header */}
      <Box sx={{ 
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.default'
      }}>
                <Box sx={{
          display: 'flex',
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 2,
          gap: 0.5
        }}>
          {/* View Full Calendar Button */}
          <Button
            variant="outlined"
            size="small"
            onClick={onViewFullCalendar}
            startIcon={<Calendar size={12} />}
            sx={{ 
              fontSize: '0.7rem',
              minWidth: 'auto',
              px: 1,
              py: 0.5,
              whiteSpace: 'nowrap',
              flex: '0 0 auto'
            }}
          >
            View Full
          </Button>

          <Typography variant="h6" sx={{ fontWeight: 600, flex: 1, textAlign: 'center', mx: 1 }}>
            Content Calendar
          </Typography>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flex: '0 0 auto' }}>
            {/* Bulk Schedule Button */}
            <Button
              variant="outlined"
              size="small"
              onClick={onBulkSchedule}
              startIcon={<Calendar size={12} />}
              sx={{ 
                fontSize: '0.7rem',
                minWidth: 'auto',
                px: 1,
                py: 0.5
              }}
            >
              Bulk
            </Button>

            {/* Create Content Button */}
            <Button
              variant="contained"
              startIcon={<Plus size={12} />}
              onClick={onCreatePost}
              size="small"
              sx={{ 
                fontSize: '0.7rem',
                minWidth: 'auto',
                px: 1,
                py: 0.5
              }}
            >
              Create
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Calendar Content */}
      <Box sx={{ p: 2 }}>
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to load calendar data
          </Alert>
        )}

        {!isLoading && !error && (
          <Box sx={{ height: '300px' }}>
            <style jsx global>{`
              .mini-calendar-event {
                font-size: 10px !important;
                padding: 1px 2px !important;
                margin: 1px !important;
                border-radius: 2px !important;
              }
              .mini-calendar-day {
                font-size: 12px !important;
              }
              .fc-daygrid-day-number {
                font-size: 12px !important;
                padding: 2px !important;
              }
              .fc-col-header-cell {
                font-size: 11px !important;
                padding: 4px 2px !important;
              }
              .fc-toolbar-title {
                font-size: 14px !important;
                font-weight: 600 !important;
              }
              .fc-button {
                font-size: 12px !important;
                padding: 4px 6px !important;
              }
            `}</style>
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              weekends={true}
              events={calendarEvents}
              headerToolbar={{
                left: 'prev',
                center: 'title',
                right: 'next'
              }}
              height="auto"
              aspectRatio={1.2}
              dayMaxEvents={2}
              eventContent={renderEventContent}
              eventClick={handleEventClick}
              buttonText={{
                prev: '',
                next: ''
              }}
              dayHeaderFormat={{ weekday: 'short' }}
              titleFormat={{ year: 'numeric', month: 'short' }}
              eventDisplay="block"
              dayMaxEventRows={2}
              moreLinkClick="popover"
              eventClassNames="mini-calendar-event"
              dayCellClassNames="mini-calendar-day"
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
