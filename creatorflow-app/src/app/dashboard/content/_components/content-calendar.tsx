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
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { PostStatus } from '@prisma/client';

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

  // Move fetchPosts to component scope
  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/posts');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch posts (HTTP ${response.status})`);
      }
      const data = await response.json();
      const posts: FetchedPost[] = data.posts || data; // Handle both formats
      // Format fetched posts into calendar events
      const formattedEvents = posts
        .filter(post => post.scheduledAt)
        .map((post): CalendarEvent => ({
          id: post.id,
          title: (post.contentText || '').substring(0, 30) + ((post.contentText || '').length > 30 ? '...' : ''),
          start: new Date(post.scheduledAt!),
          allDay: true,
          extendedProps: {
            postId: post.id,
            status: post.status,
            platforms: post.platforms,
            contentText: post.contentText || '',
            errorMessage: post.errorMessage,
          },
        }));
      setCalendarEvents(formattedEvents);
    } catch (err) {
      console.error("Error fetching posts for calendar:", err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      toast.error(`Failed to load calendar data: ${errorMessage}`);
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
      <Tooltip>
        <TooltipTrigger asChild>
          <div tabIndex={0} className="overflow-hidden whitespace-nowrap text-ellipsis outline-none focus-visible:ring-2 focus-visible:ring-primary transition-shadow cursor-pointer">
            <span className="font-medium">{statusIndicator} {title}</span>
            <div className="text-xs text-muted-foreground mt-0.5">{platformIcons}</div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="max-w-xs">
            <div className="font-semibold mb-1">{title}</div>
            <div className="mb-1">{contentText}</div>
            <div className="flex gap-1 mb-1">{platformIcons}</div>
            <div className="text-xs text-muted-foreground">Status: {status}</div>
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <TooltipProvider>
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
  <div className="min-h-[400px]">
    <FullCalendar
      key={calendarEvents.length}
      plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
      initialView="dayGridMonth"
      weekends={true}
      events={calendarEvents}
      headerToolbar={{
        left: 'title',
        center: 'prev,next today',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      }}
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
      buttonText={{
        today: 'Today',
        month: 'Month',
        week: 'Week',
        day: 'Day'
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
      selectable={false}
      selectMirror={false}
      loading={(isLoading) => {
        if (isLoading) {
          setAriaMessage('Loading calendar events...');
        } else {
          setAriaMessage('');
        }
      }}
    />
  </div>
)}
    </TooltipProvider>
  );
} 