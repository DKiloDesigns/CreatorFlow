'use client'; // FullCalendar requires this

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'; // For month/week/day views
import interactionPlugin from '@fullcalendar/interaction'; // For clicking events
import timeGridPlugin from '@fullcalendar/timegrid'; // Import timeGrid plugin
import { EventInput } from '@fullcalendar/core'; // Import EventInput type
import { FaInstagram, FaTiktok, FaYoutube, FaXTwitter } from "react-icons/fa6"; // Import specific icons
import { toast } from "sonner"; // For error reporting
import { Loader2, AlertCircle } from 'lucide-react'; // For loading/error states

import { PostStatus } from '@prisma/client';
import { 
  Button,
  Tooltip,
  Box,
  Typography,
  IconButton,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import { 
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Today as TodayIcon,
  ViewModule as MonthIcon,
  ViewWeek as WeekIcon,
  ViewDay as DayIcon
} from '@mui/icons-material';

// Type for the data fetched from API
interface FetchedPost {
  id: string;
  contentText: string | null;
  mediaUrls: string[];
  platforms: string[];
  status: PostStatus;
  scheduledAt: string | null; // Comes as ISO string from JSON
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
    // Add other fetched props if needed for eventClick
    errorMessage: string | null;
  };
}

// Helper function for Step 2
function renderEventContent(eventInfo: any) {
  const { status, platforms, contentText } = eventInfo.event.extendedProps as CalendarEvent['extendedProps'];
  const title = eventInfo.event.title;

  // Use react-icons
  const platformIcons = platforms.map((p: string) => {
    switch (p) {
      case 'instagram': return <FaInstagram key={p} className="inline h-3 w-3 mr-1" />;
      case 'tiktok': return <FaTiktok key={p} className="inline h-3 w-3 mr-1" />;
      case 'twitter': return <FaXTwitter key={p} className="inline h-3 w-3 mr-1" />;
      case 'youtube': return <FaYoutube key={p} className="inline h-3 w-3 mr-1" />;
      default: return <span key={p} className="text-xs mr-1">{`[${p.substring(0,2).toUpperCase()}]`}</span>; // Fallback
    }
  });

  let statusIndicator = '';
  switch (status) {
      case PostStatus.SCHEDULED: statusIndicator = '🗓️'; break;
      case PostStatus.PUBLISHED: statusIndicator = '✅'; break;
      case PostStatus.FAILED: statusIndicator = '❌'; break;
      case PostStatus.PUBLISHING: statusIndicator = '⏳'; break;
  }

  return (
    <div className="overflow-hidden whitespace-nowrap text-ellipsis">
        <span className="font-medium">{statusIndicator} {title}</span>
        <div className="text-xs text-muted-foreground mt-0.5">
            {platformIcons}
        </div>
    </div>
  );
}

export default function ContentCalendar() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [ariaMessage, setAriaMessage] = useState('');
  const [currentView, setCurrentView] = useState('dayGridMonth');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarRef, setCalendarRef] = useState<any>(null);

  // Move fetchPosts to component scope
  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Use the calendar API endpoint with date range
      const startDate = '2024-01-01';
      const endDate = '2024-12-31';
      const response = await fetch(`/api/posts/calendar?startDate=${startDate}&endDate=${endDate}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          console.warn('User not authenticated, skipping calendar data fetch');
          setError('Please log in to view your content calendar');
          setCalendarEvents([]);
          return;
        }
        
        // Try to parse error response, but handle cases where it's not valid JSON
        let errorMessage = `Failed to fetch posts (HTTP ${response.status})`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If JSON parsing fails, use the response text or status
          const responseText = await response.text().catch(() => '');
          errorMessage = responseText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      
      // Parse the response JSON
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('JSON parsing error:', jsonError);
        throw new Error('Invalid response format from server');
      }
      
      // The calendar API returns posts grouped by date
      const postsByDate = data.posts || {};
      
      // Convert grouped posts to flat array of calendar events
      const events: CalendarEvent[] = [];
      Object.entries(postsByDate).forEach(([dateKey, posts]: [string, any]) => {
        if (Array.isArray(posts)) {
          posts.forEach((post: FetchedPost) => {
            if (post && post.scheduledAt) {
              events.push({
                id: post.id,
                title: (post.contentText || '').substring(0, 30) + ((post.contentText || '').length > 30 ? '...' : ''),
                start: new Date(post.scheduledAt),
                allDay: true,
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
        }
      });
      
      setCalendarEvents(events);
    } catch (err) {
      console.error("Error fetching posts for calendar:", err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      
      // Handle authentication errors gracefully
      if (errorMessage.includes('Unauthorized') || errorMessage.includes('not logged in')) {
        setError('Please log in to view your content calendar');
        setCalendarEvents([]); // Clear events
      } else {
        setError(errorMessage);
        toast.error(`Failed to load calendar data: ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Retry handler
  const handleRetry = () => {
    setError(null);
    setAriaMessage('Retrying calendar load...');
    setTimeout(() => setAriaMessage(''), 2000);
    fetchPosts();
  };

  // Navigation functions
  const handlePrev = () => {
    if (calendarRef) {
      calendarRef.getApi().prev();
      setCurrentDate(calendarRef.getApi().getDate());
    }
  };

  const handleNext = () => {
    if (calendarRef) {
      calendarRef.getApi().next();
      setCurrentDate(calendarRef.getApi().getDate());
    }
  };

  const handleToday = () => {
    if (calendarRef) {
      calendarRef.getApi().today();
      setCurrentDate(new Date());
    }
  };

  const handleViewChange = (event: React.MouseEvent<HTMLElement>, newView: string | null) => {
    if (newView && calendarRef) {
      calendarRef.getApi().changeView(newView);
      setCurrentView(newView);
    }
  };

  // Get formatted date string for header
  const getFormattedDate = () => {
    if (!calendarRef) return '';
    const date = calendarRef.getApi().getDate();
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  // Custom event render with tooltip
  function eventRenderWithTooltip(eventInfo: any) {
    const { status, platforms, contentText } = eventInfo.event.extendedProps as CalendarEvent['extendedProps'];
    const title = eventInfo.event.title;
    const platformIcons = platforms.map((p: string) => {
      switch (p) {
        case 'instagram': return <FaInstagram key={p} className="inline h-3 w-3 mr-1" />;
        case 'tiktok': return <FaTiktok key={p} className="inline h-3 w-3 mr-1" />;
        case 'twitter': return <FaXTwitter key={p} className="inline h-3 w-3 mr-1" />;
        case 'youtube': return <FaYoutube key={p} className="inline h-3 w-3 mr-1" />;
        default: return <span key={p} className="text-xs mr-1">[{p.substring(0,2).toUpperCase()}]</span>;
      }
    });
    let statusIndicator = '';
    switch (status) {
      case PostStatus.SCHEDULED: statusIndicator = '🗓️'; break;
      case PostStatus.PUBLISHED: statusIndicator = '✅'; break;
      case PostStatus.FAILED: statusIndicator = '❌'; break;
      case PostStatus.PUBLISHING: statusIndicator = '⏳'; break;
    }
    return (
      <Tooltip title={
        <div className="max-w-xs">
          <div className="font-semibold mb-1">{title}</div>
          <div className="mb-1">{contentText}</div>
          <div className="flex gap-1 mb-1">{platformIcons}</div>
          <div className="text-xs text-muted-foreground">Status: {status}</div>
        </div>
      }>
        <div tabIndex={0} className="overflow-hidden whitespace-nowrap text-ellipsis outline-none focus-visible:ring-2 focus-visible:ring-primary transition-shadow cursor-pointer">
          <span className="font-medium">{statusIndicator} {title}</span>
          <div className="text-xs text-muted-foreground mt-0.5">{platformIcons}</div>
        </div>
      </Tooltip>
    );
  }

  return (
    <>
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading Calendar...</span>
        </div>
      )}
      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center h-64 text-destructive">
          <AlertCircle className="h-8 w-8 mb-2" />
          <span>Error loading calendar:</span>
          <span className="text-sm mb-2">{error}</span>
          <Button onClick={handleRetry} className="mt-2 focus-visible:ring-2 focus-visible:ring-primary transition-shadow" aria-label="Retry loading calendar">Retry</Button>
          <div aria-live="polite" className="sr-only">{ariaMessage}</div>
        </div>
      )}
      {!isLoading && !error && (
        <Box sx={{ minHeight: 400 }}>
          {/* Custom Header */}
          <Box sx={{ 
            mb: 3,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            overflow: 'hidden'
          }}>
            {/* Top Row - Month/Year Header */}
            <Box sx={{ 
              p: 2,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              textAlign: 'center'
            }}>
              <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                {getFormattedDate()}
              </Typography>
            </Box>
            
            {/* Bottom Row - Navigation and View Controls */}
            <Box sx={{ 
              p: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
              bgcolor: 'background.paper'
            }}>
              {/* Left Side - Navigation */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                flexWrap: 'wrap'
              }}>
                <IconButton 
                  onClick={handlePrev}
                  size="small"
                  sx={{ 
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <ChevronLeftIcon />
                </IconButton>
                <IconButton 
                  onClick={handleNext}
                  size="small"
                  sx={{ 
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <ChevronRightIcon />
                </IconButton>
                <Button
                  variant="outlined"
                  startIcon={<TodayIcon />}
                  onClick={handleToday}
                  size="small"
                  sx={{ 
                    ml: 1,
                    textTransform: 'none',
                    fontWeight: 500
                  }}
                >
                  Today
                </Button>
              </Box>

              {/* Right Side - View Switcher */}
              <ToggleButtonGroup
                value={currentView}
                exclusive
                onChange={handleViewChange}
                size="small"
                sx={{
                  '& .MuiToggleButton-root': {
                    textTransform: 'none',
                    fontWeight: 500,
                    px: 2,
                    py: 0.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      }
                    }
                  }
                }}
              >
                <ToggleButton value="dayGridMonth" aria-label="Month view">
                  <MonthIcon sx={{ mr: 1, fontSize: 18 }} />
                  Month
                </ToggleButton>
                <ToggleButton value="timeGridWeek" aria-label="Week view">
                  <WeekIcon sx={{ mr: 1, fontSize: 18 }} />
                  Week
                </ToggleButton>
                <ToggleButton value="timeGridDay" aria-label="Day view">
                  <DayIcon sx={{ mr: 1, fontSize: 18 }} />
                  Day
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>

          {/* Calendar */}
          <Box sx={{ 
            '& .fc': {
              color: 'text.primary',
              '& .fc-daygrid-day-number': {
                color: 'text.primary !important',
                fontWeight: 500
              },
              '& .fc-daygrid-day': {
                color: 'text.primary'
              },
              '& .fc-col-header-cell': {
                color: 'text.primary !important',
                fontWeight: 600
              },
              '& .fc-daygrid-day-top': {
                color: 'text.primary'
              },
              '& .fc-day-today': {
                backgroundColor: 'action.hover !important',
                '& .fc-daygrid-day-number': {
                  color: 'primary.main !important',
                  fontWeight: 'bold'
                }
              }
            }
          }}>
            <FullCalendar
              ref={setCalendarRef}
              key={calendarEvents.length}
              plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
              initialView="dayGridMonth"
              weekends={true}
              events={calendarEvents}
              headerToolbar={false} // Hide default header
              height="auto"
              aspectRatio={1.35}
              dayMaxEvents={3}
              eventContent={eventRenderWithTooltip}
            eventClick={(info) => {
              const { contentText, status, platforms } = info.event.extendedProps as CalendarEvent['extendedProps'];
              toast.info(`${contentText.substring(0, 100)}...`, {
                description: `Status: ${status} | Platforms: ${platforms.join(', ')}`
              });
            }}
            views={{
              dayGridMonth: {
                titleFormat: { year: 'numeric', month: 'long' },
                dayHeaderFormat: { weekday: 'short' }
              },
              timeGridWeek: {
                titleFormat: { year: 'numeric', month: 'short', day: 'numeric' }
              },
              timeGridDay: {
                titleFormat: { year: 'numeric', month: 'long', day: 'numeric' }
              }
            }}
            windowResizeDelay={100}
            eventResizableFromStart={false}
            selectable={true}
            selectMirror={false}
            dateClick={(info) => {
              // Handle day click - you can add functionality here
              console.log('Day clicked:', info.dateStr);
              toast.info(`Selected date: ${info.dateStr}`);
            }}
            loading={(isLoading) => {
              if (isLoading) {
                setAriaMessage('Loading calendar events...');
              } else {
                setAriaMessage('');
              }
            }}
            viewDidMount={(view) => {
              if (view && view.view && view.calendar) {
                setCurrentView(view.view.type);
                setCurrentDate(view.calendar.getDate());
              }
            }}
            />
          </Box>
        </Box>
      )}

      {/* Bottom Spacer to Clear Bottom Navigation */}
      <div className="h-32 sm:h-10 w-full"></div>
    </>
  );
} 