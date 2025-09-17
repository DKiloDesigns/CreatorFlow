/**
 * Advanced Calendar Enhanced
 * Enhanced calendar with advanced features, animations, and polish
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Chip,
  Tooltip,
  Fade,
  Slide,
  Zoom,
  Paper,
  Divider,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
  LinearProgress,
  Alert,
  Snackbar,
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from '@mui/material';
import {
  Today as TodayIcon,
  ViewWeek as ViewWeekIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Schedule as ScheduleIcon,
  Event as EventIcon,
  Repeat as RepeatIcon,
  Notifications as NotificationsIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  DragIndicator as DragIcon,
  KeyboardArrowLeft as ArrowLeftIcon,
  KeyboardArrowRight as ArrowRightIcon,
  KeyboardArrowUp as ArrowUpIcon,
  KeyboardArrowDown as ArrowDownIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Flag as FlagIcon,
  FlagOutlined as FlagOutlinedIcon,
  Palette as PaletteIcon,
  Timeline as TimelineIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  TableChart as TableChartIcon,
  GridView as GridViewIcon,
  ViewAgenda as ViewAgendaIcon,
  ViewDay as ViewDayIcon,
  ViewWeek as ViewWeekIcon2,
  ViewMonth as ViewMonthIcon,
  ViewQuilt as ViewQuiltIcon,
  ViewStream as ViewStreamIcon,
  ViewSidebar as ViewSidebarIcon,
  ViewComfy as ViewComfyIcon,
  ViewCompact as ViewCompactIcon,
  ViewHeadline as ViewHeadlineIcon,
  ViewCarousel as ViewCarouselIcon,
  ViewColumn as ViewColumnIcon,
  ViewDashboard as ViewDashboardIcon,
  ViewKanban as ViewKanbanIcon,
  ViewTimeline as ViewTimelineIcon,
  ViewWeekend as ViewWeekendIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isSameMonth, isToday, addDays, subDays, startOfMonth, endOfMonth, addMonths, subMonths, parseISO, isValid } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay: boolean;
  color: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  platforms: string[];
  media?: string[];
  tags: string[];
  recurring?: {
    type: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: Date;
  };
  metadata?: any;
}

interface CalendarView {
  type: 'month' | 'week' | 'day' | 'agenda' | 'timeline' | 'kanban';
  name: string;
  icon: React.ReactNode;
  description: string;
}

interface CalendarFilter {
  id: string;
  name: string;
  type: 'status' | 'platform' | 'category' | 'priority' | 'date';
  value: any;
  active: boolean;
}

interface CalendarSettings {
  timezone: string;
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  showWeekends: boolean;
  showTime: boolean;
  showDuration: boolean;
  showPlatforms: boolean;
  showCategories: boolean;
  showPriorities: boolean;
  compactMode: boolean;
  animations: boolean;
  soundEffects: boolean;
  notifications: boolean;
  autoSave: boolean;
  theme: 'light' | 'dark' | 'auto';
}

interface AdvancedCalendarEnhancedProps {
  events: CalendarEvent[];
  onEventCreate?: (event: Omit<CalendarEvent, 'id'>) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  onEventDelete?: (eventId: string) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onDateSelect?: (date: Date) => void;
  onViewChange?: (view: CalendarView) => void;
  onFilterChange?: (filters: CalendarFilter[]) => void;
  onSettingsChange?: (settings: CalendarSettings) => void;
  loading?: boolean;
  error?: string;
  className?: string;
}

const CALENDAR_VIEWS: CalendarView[] = [
  {
    type: 'month',
    name: 'Month',
    icon: <ViewMonthIcon />,
    description: 'Monthly calendar view with all events',
  },
  {
    type: 'week',
    name: 'Week',
    icon: <ViewWeekIcon2 />,
    description: 'Weekly calendar view with detailed timeline',
  },
  {
    type: 'day',
    name: 'Day',
    icon: <ViewDayIcon />,
    description: 'Daily calendar view with hourly breakdown',
  },
  {
    type: 'agenda',
    name: 'Agenda',
    icon: <ViewAgendaIcon />,
    description: 'List view of all upcoming events',
  },
  {
    type: 'timeline',
    name: 'Timeline',
    icon: <TimelineIcon />,
    description: 'Timeline view with event dependencies',
  },
  {
    type: 'kanban',
    name: 'Kanban',
    icon: <ViewKanbanIcon />,
    description: 'Kanban board view by status',
  },
];

const PRIORITY_COLORS = {
  low: '#4caf50',
  medium: '#ff9800',
  high: '#f44336',
  urgent: '#9c27b0',
};

const STATUS_COLORS = {
  draft: '#9e9e9e',
  scheduled: '#2196f3',
  published: '#4caf50',
  failed: '#f44336',
};

const CATEGORY_COLORS = {
  content: '#2196f3',
  marketing: '#ff9800',
  social: '#e91e63',
  announcement: '#9c27b0',
  event: '#4caf50',
  other: '#607d8b',
};

export default function AdvancedCalendarEnhanced({
  events,
  onEventCreate,
  onEventUpdate,
  onEventDelete,
  onEventClick,
  onDateSelect,
  onViewChange,
  onFilterChange,
  onSettingsChange,
  loading = false,
  error,
  className,
}: AdvancedCalendarEnhancedProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [currentView, setCurrentView] = useState<CalendarView>(CALENDAR_VIEWS[0]);
  const [filters, setFilters] = useState<CalendarFilter[]>([]);
  const [settings, setSettings] = useState<CalendarSettings>({
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    weekStartsOn: 1,
    showWeekends: true,
    showTime: true,
    showDuration: true,
    showPlatforms: true,
    showCategories: true,
    showPriorities: true,
    compactMode: false,
    animations: true,
    soundEffects: false,
    notifications: true,
    autoSave: true,
    theme: 'auto',
  });
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showFiltersDialog, setShowFiltersDialog] = useState(false);
  const [showSpeedDial, setShowSpeedDial] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'warning' | 'info' });

  // Filtered events based on current filters and search
  const filteredEvents = useMemo(() => {
    let filtered = events;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply other filters
    filters.forEach(filter => {
      if (!filter.active) return;

      switch (filter.type) {
        case 'status':
          filtered = filtered.filter(event => event.status === filter.value);
          break;
        case 'platform':
          filtered = filtered.filter(event => event.platforms.includes(filter.value));
          break;
        case 'category':
          filtered = filtered.filter(event => event.category === filter.value);
          break;
        case 'priority':
          filtered = filtered.filter(event => event.priority === filter.value);
          break;
        case 'date':
          const filterDate = new Date(filter.value);
          filtered = filtered.filter(event => isSameDay(event.start, filterDate));
          break;
      }
    });

    return filtered;
  }, [events, filters, searchQuery]);

  // Get events for current view
  const viewEvents = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: settings.weekStartsOn });
    const end = endOfWeek(currentDate, { weekStartsOn: settings.weekStartsOn });

    return filteredEvents.filter(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);

      switch (currentView.type) {
        case 'month':
          return isSameMonth(eventStart, currentDate);
        case 'week':
          return eventStart <= end && eventEnd >= start;
        case 'day':
          return isSameDay(eventStart, currentDate);
        case 'agenda':
          return eventStart >= new Date();
        case 'timeline':
          return true;
        case 'kanban':
          return true;
        default:
          return true;
      }
    });
  }, [filteredEvents, currentDate, currentView.type, settings.weekStartsOn]);

  // Handle view change
  const handleViewChange = (view: CalendarView) => {
    setCurrentView(view);
    onViewChange?.(view);
  };

  // Handle date navigation
  const handleDateNavigate = (direction: 'prev' | 'next' | 'today') => {
    let newDate = currentDate;

    switch (direction) {
      case 'prev':
        if (currentView.type === 'month') {
          newDate = subMonths(currentDate, 1);
        } else if (currentView.type === 'week') {
          newDate = subDays(currentDate, 7);
        } else if (currentView.type === 'day') {
          newDate = subDays(currentDate, 1);
        }
        break;
      case 'next':
        if (currentView.type === 'month') {
          newDate = addMonths(currentDate, 1);
        } else if (currentView.type === 'week') {
          newDate = addDays(currentDate, 7);
        } else if (currentView.type === 'day') {
          newDate = addDays(currentDate, 1);
        }
        break;
      case 'today':
        newDate = new Date();
        break;
    }

    setCurrentDate(newDate);
  };

  // Handle event click
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    onEventClick?.(event);
  };

  // Handle date click
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onDateSelect?.(date);
  };

  // Handle event create
  const handleEventCreate = (eventData: Omit<CalendarEvent, 'id'>) => {
    onEventCreate?.(eventData);
    setShowEventDialog(false);
    setSnackbar({
      open: true,
      message: 'Event created successfully',
      severity: 'success',
    });
  };

  // Handle event update
  const handleEventUpdate = (eventData: CalendarEvent) => {
    onEventUpdate?.(eventData);
    setShowEventDialog(false);
    setSnackbar({
      open: true,
      message: 'Event updated successfully',
      severity: 'success',
    });
  };

  // Handle event delete
  const handleEventDelete = (eventId: string) => {
    onEventDelete?.(eventId);
    setSnackbar({
      open: true,
      message: 'Event deleted successfully',
      severity: 'success',
    });
  };

  // Handle filter change
  const handleFilterChange = (newFilters: CalendarFilter[]) => {
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  // Handle settings change
  const handleSettingsChange = (newSettings: CalendarSettings) => {
    setSettings(newSettings);
    onSettingsChange?.(newSettings);
  };

  // Render calendar view
  const renderCalendarView = () => {
    switch (currentView.type) {
      case 'month':
        return <MonthView events={viewEvents} currentDate={currentDate} onEventClick={handleEventClick} onDateClick={handleDateClick} settings={settings} />;
      case 'week':
        return <WeekView events={viewEvents} currentDate={currentDate} onEventClick={handleEventClick} onDateClick={handleDateClick} settings={settings} />;
      case 'day':
        return <DayView events={viewEvents} currentDate={currentDate} onEventClick={handleEventClick} onDateClick={handleDateClick} settings={settings} />;
      case 'agenda':
        return <AgendaView events={viewEvents} onEventClick={handleEventClick} settings={settings} />;
      case 'timeline':
        return <TimelineView events={viewEvents} onEventClick={handleEventClick} settings={settings} />;
      case 'kanban':
        return <KanbanView events={viewEvents} onEventClick={handleEventClick} onEventUpdate={handleEventUpdate} settings={settings} />;
      default:
        return <MonthView events={viewEvents} currentDate={currentDate} onEventClick={handleEventClick} onDateClick={handleDateClick} settings={settings} />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading calendar...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box className={className} sx={{ position: 'relative' }}>
      {/* Header */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">
              {format(currentDate, 'MMMM yyyy')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<ArrowLeftIcon />}
                onClick={() => handleDateNavigate('prev')}
              >
                Previous
              </Button>
              <Button
                variant="outlined"
                startIcon={<TodayIcon />}
                onClick={() => handleDateNavigate('today')}
              >
                Today
              </Button>
              <Button
                variant="outlined"
                endIcon={<ArrowRightIcon />}
                onClick={() => handleDateNavigate('next')}
              >
                Next
              </Button>
            </Box>
          </Box>

          {/* View Selector */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            {CALENDAR_VIEWS.map((view) => (
              <Button
                key={view.type}
                variant={currentView.type === view.type ? 'contained' : 'outlined'}
                startIcon={view.icon}
                onClick={() => handleViewChange(view)}
                size="small"
              >
                {view.name}
              </Button>
            ))}
          </Box>

          {/* Search and Filters */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{ flexGrow: 1 }}
            />
            <IconButton onClick={() => setShowFiltersDialog(true)}>
              <FilterIcon />
            </IconButton>
            <IconButton onClick={() => setShowSettingsDialog(true)}>
              <SettingsIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      {/* Calendar Content */}
      <motion.div
        key={currentView.type}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {renderCalendarView()}
      </motion.div>

      {/* Speed Dial */}
      <SpeedDial
        ariaLabel="Calendar actions"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        onClose={() => setShowSpeedDial(false)}
        onOpen={() => setShowSpeedDial(true)}
        open={showSpeedDial}
      >
        <SpeedDialAction
          icon={<AddIcon />}
          tooltipTitle="Create Event"
          onClick={() => setShowEventDialog(true)}
        />
        <SpeedDialAction
          icon={<ShareIcon />}
          tooltipTitle="Share Calendar"
          onClick={() => {/* Handle share */}}
        />
        <SpeedDialAction
          icon={<DownloadIcon />}
          tooltipTitle="Export Calendar"
          onClick={() => {/* Handle export */}}
        />
      </SpeedDial>

      {/* Event Dialog */}
      <EventDialog
        open={showEventDialog}
        onClose={() => setShowEventDialog(false)}
        event={selectedEvent}
        onSave={selectedEvent ? handleEventUpdate : handleEventCreate}
        onDelete={selectedEvent ? () => handleEventDelete(selectedEvent.id) : undefined}
      />

      {/* Settings Dialog */}
      <SettingsDialog
        open={showSettingsDialog}
        onClose={() => setShowSettingsDialog(false)}
        settings={settings}
        onSave={handleSettingsChange}
      />

      {/* Filters Dialog */}
      <FiltersDialog
        open={showFiltersDialog}
        onClose={() => setShowFiltersDialog(false)}
        filters={filters}
        onSave={handleFilterChange}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

// Month View Component
function MonthView({ events, currentDate, onEventClick, onDateClick, settings }: any) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: settings.weekStartsOn });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: settings.weekStartsOn });
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, mb: 2 }}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <Typography key={day} variant="subtitle2" align="center" sx={{ p: 1, fontWeight: 'bold' }}>
              {day}
            </Typography>
          ))}
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
          {days.map((day) => {
            const dayEvents = events.filter((event: any) => isSameDay(event.start, day));
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());

            return (
              <motion.div
                key={day.toISOString()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Paper
                  sx={{
                    p: 1,
                    minHeight: 100,
                    cursor: 'pointer',
                    backgroundColor: isToday ? 'primary.light' : 'transparent',
                    color: isCurrentMonth ? 'text.primary' : 'text.secondary',
                    border: isToday ? '2px solid' : '1px solid',
                    borderColor: isToday ? 'primary.main' : 'divider',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                  onClick={() => onDateClick(day)}
                >
                  <Typography variant="body2" sx={{ fontWeight: isToday ? 'bold' : 'normal' }}>
                    {format(day, 'd')}
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    {dayEvents.slice(0, 3).map((event: any) => (
                      <Chip
                        key={event.id}
                        label={event.title}
                        size="small"
                        sx={{
                          fontSize: '0.7rem',
                          height: 16,
                          backgroundColor: CATEGORY_COLORS[event.category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.other,
                          color: 'white',
                          mb: 0.5,
                          display: 'block',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }}
                      />
                    ))}
                    {dayEvents.length > 3 && (
                      <Typography variant="caption" color="text.secondary">
                        +{dayEvents.length - 3} more
                      </Typography>
                    )}
                  </Box>
                </Paper>
              </motion.div>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
}

// Week View Component
function WeekView({ events, currentDate, onEventClick, onDateClick, settings }: any) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: settings.weekStartsOn });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: settings.weekStartsOn });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
          {days.map((day) => {
            const dayEvents = events.filter((event: any) => isSameDay(event.start, day));
            const isToday = isSameDay(day, new Date());

            return (
              <Box key={day.toISOString()}>
                <Typography
                  variant="subtitle2"
                  align="center"
                  sx={{
                    p: 1,
                    fontWeight: 'bold',
                    backgroundColor: isToday ? 'primary.main' : 'transparent',
                    color: isToday ? 'primary.contrastText' : 'text.primary',
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  {format(day, 'EEE d')}
                </Typography>
                <Box sx={{ minHeight: 200 }}>
                  {dayEvents.map((event: any) => (
                    <motion.div
                      key={event.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Paper
                        sx={{
                          p: 1,
                          mb: 0.5,
                          cursor: 'pointer',
                          backgroundColor: CATEGORY_COLORS[event.category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.other,
                          color: 'white',
                          '&:hover': {
                            opacity: 0.8,
                          },
                        }}
                        onClick={() => onEventClick(event)}
                      >
                        <Typography variant="body2" noWrap>
                          {event.title}
                        </Typography>
                        {settings.showTime && (
                          <Typography variant="caption">
                            {format(event.start, 'HH:mm')}
                          </Typography>
                        )}
                      </Paper>
                    </motion.div>
                  ))}
                </Box>
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
}

// Day View Component
function DayView({ events, currentDate, onEventClick, onDateClick, settings }: any) {
  const dayEvents = events.filter((event: any) => isSameDay(event.start, currentDate));
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {format(currentDate, 'EEEE, MMMM d, yyyy')}
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: 1 }}>
          {hours.map((hour) => (
            <React.Fragment key={hour}>
              <Typography variant="caption" sx={{ p: 1, textAlign: 'right' }}>
                {format(new Date().setHours(hour, 0, 0, 0), 'HH:mm')}
              </Typography>
              <Box sx={{ minHeight: 60, borderBottom: '1px solid', borderColor: 'divider' }}>
                {dayEvents
                  .filter((event: any) => event.start.getHours() === hour)
                  .map((event: any) => (
                    <motion.div
                      key={event.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Paper
                        sx={{
                          p: 1,
                          mb: 0.5,
                          cursor: 'pointer',
                          backgroundColor: CATEGORY_COLORS[event.category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.other,
                          color: 'white',
                          '&:hover': {
                            opacity: 0.8,
                          },
                        }}
                        onClick={() => onEventClick(event)}
                      >
                        <Typography variant="body2">
                          {event.title}
                        </Typography>
                        <Typography variant="caption">
                          {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
                        </Typography>
                      </Paper>
                    </motion.div>
                  ))}
              </Box>
            </React.Fragment>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

// Agenda View Component
function AgendaView({ events, onEventClick, settings }: any) {
  const sortedEvents = events.sort((a: any, b: any) => a.start.getTime() - b.start.getTime());

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Upcoming Events
        </Typography>
        <List>
          {sortedEvents.map((event: any) => (
            <motion.div
              key={event.id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <ListItem
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
                onClick={() => onEventClick(event)}
              >
                <ListItemIcon>
                  <EventIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={event.title}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {format(event.start, 'MMM d, yyyy • HH:mm')}
                      </Typography>
                      {event.description && (
                        <Typography variant="body2" color="text.secondary">
                          {event.description}
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        {event.platforms.map((platform: string) => (
                          <Chip
                            key={platform}
                            label={platform}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  }
                />
                <Chip
                  label={event.status}
                  size="small"
                  color={event.status === 'published' ? 'success' : 'default'}
                />
              </ListItem>
            </motion.div>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

// Timeline View Component
function TimelineView({ events, onEventClick, settings }: any) {
  const sortedEvents = events.sort((a: any, b: any) => a.start.getTime() - b.start.getTime());

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Timeline View
        </Typography>
        <Box sx={{ position: 'relative' }}>
          {sortedEvents.map((event: any, index: number) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2,
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                  p: 1,
                  borderRadius: 1,
                }}
                onClick={() => onEventClick(event)}
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: CATEGORY_COLORS[event.category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.other,
                    mr: 2,
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1">
                    {event.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {format(event.start, 'MMM d, yyyy • HH:mm')}
                  </Typography>
                </Box>
                <Chip
                  label={event.status}
                  size="small"
                  color={event.status === 'published' ? 'success' : 'default'}
                />
              </Box>
            </motion.div>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

// Kanban View Component
function KanbanView({ events, onEventClick, onEventUpdate, settings }: any) {
  const statusColumns = [
    { status: 'draft', title: 'Draft', color: '#9e9e9e' },
    { status: 'scheduled', title: 'Scheduled', color: '#2196f3' },
    { status: 'published', title: 'Published', color: '#4caf50' },
    { status: 'failed', title: 'Failed', color: '#f44336' },
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Kanban Board
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto' }}>
          {statusColumns.map((column) => {
            const columnEvents = events.filter((event: any) => event.status === column.status);
            
            return (
              <Box key={column.status} sx={{ minWidth: 300, flex: 1 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ color: column.color }}>
                  {column.title} ({columnEvents.length})
                </Typography>
                <Box sx={{ minHeight: 400 }}>
                  {columnEvents.map((event: any) => (
                    <motion.div
                      key={event.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Paper
                        sx={{
                          p: 2,
                          mb: 1,
                          cursor: 'pointer',
                          '&:hover': {
                            boxShadow: 2,
                          },
                        }}
                        onClick={() => onEventClick(event)}
                      >
                        <Typography variant="subtitle2" gutterBottom>
                          {event.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {format(event.start, 'MMM d, HH:mm')}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {event.platforms.map((platform: string) => (
                            <Chip
                              key={platform}
                              label={platform}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Paper>
                    </motion.div>
                  ))}
                </Box>
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
}

// Event Dialog Component
function EventDialog({ open, onClose, event, onSave, onDelete }: any) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start: new Date(),
    end: new Date(),
    allDay: false,
    color: '#2196f3',
    category: 'content',
    priority: 'medium',
    status: 'draft',
    platforms: [],
    tags: [],
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        start: event.start || new Date(),
        end: event.end || new Date(),
        allDay: event.allDay || false,
        color: event.color || '#2196f3',
        category: event.category || 'content',
        priority: event.priority || 'medium',
        status: event.status || 'draft',
        platforms: event.platforms || [],
        tags: event.tags || [],
      });
    }
  }, [event]);

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {event ? 'Edit Event' : 'Create Event'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Event Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Start Date & Time"
              type="datetime-local"
              value={format(formData.start, "yyyy-MM-dd'T'HH:mm")}
              onChange={(e) => setFormData({ ...formData, start: new Date(e.target.value) })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="End Date & Time"
              type="datetime-local"
              value={format(formData.end, "yyyy-MM-dd'T'HH:mm")}
              onChange={(e) => setFormData({ ...formData, end: new Date(e.target.value) })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <MenuItem value="content">Content</MenuItem>
                <MenuItem value="marketing">Marketing</MenuItem>
                <MenuItem value="social">Social</MenuItem>
                <MenuItem value="announcement">Announcement</MenuItem>
                <MenuItem value="event">Event</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.allDay}
                  onChange={(e) => setFormData({ ...formData, allDay: e.target.checked })}
                />
              }
              label="All Day Event"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>
        {onDelete && (
          <Button onClick={onDelete} color="error">
            Delete
          </Button>
        )}
        <Button onClick={handleSave} variant="contained">
          {event ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Settings Dialog Component
function SettingsDialog({ open, onClose, settings, onSave }: any) {
  const [formData, setFormData] = useState(settings);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Calendar Settings</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Timezone</InputLabel>
              <Select
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
              >
                <MenuItem value="UTC">UTC</MenuItem>
                <MenuItem value="America/New_York">Eastern Time</MenuItem>
                <MenuItem value="America/Chicago">Central Time</MenuItem>
                <MenuItem value="America/Denver">Mountain Time</MenuItem>
                <MenuItem value="America/Los_Angeles">Pacific Time</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Week Starts On</InputLabel>
              <Select
                value={formData.weekStartsOn}
                onChange={(e) => setFormData({ ...formData, weekStartsOn: e.target.value })}
              >
                <MenuItem value={0}>Sunday</MenuItem>
                <MenuItem value={1}>Monday</MenuItem>
                <MenuItem value={2}>Tuesday</MenuItem>
                <MenuItem value={3}>Wednesday</MenuItem>
                <MenuItem value={4}>Thursday</MenuItem>
                <MenuItem value={5}>Friday</MenuItem>
                <MenuItem value={6}>Saturday</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.showWeekends}
                  onChange={(e) => setFormData({ ...formData, showWeekends: e.target.checked })}
                />
              }
              label="Show Weekends"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.showTime}
                  onChange={(e) => setFormData({ ...formData, showTime: e.target.checked })}
                />
              }
              label="Show Time"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.animations}
                  onChange={(e) => setFormData({ ...formData, animations: e.target.checked })}
                />
              }
              label="Enable Animations"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Filters Dialog Component
function FiltersDialog({ open, onClose, filters, onSave }: any) {
  const [formData, setFormData] = useState(filters);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Calendar Filters</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Filter events by status, platform, category, priority, or date.
        </Typography>
        {/* Filter implementation would go here */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained">
          Apply Filters
        </Button>
      </DialogActions>
    </Dialog>
  );
}
