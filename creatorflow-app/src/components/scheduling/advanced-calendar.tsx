/**
 * Advanced Calendar Component
 * Drag & drop scheduling with recurring posts and optimal timing
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Grid,
  Tooltip,
  Alert,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  Repeat as RepeatIcon,
  AutoAwesome as AutoAwesomeIcon,
  DragIndicator as DragIcon,
  Today as TodayIcon,
  ViewWeek as ViewWeekIcon,
  CalendarMonth as ViewMonthIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface CalendarEvent {
  id: string;
  title: string;
  content: string;
  platforms: string[];
  scheduledTime: Date;
  status: 'pending' | 'published' | 'failed';
  isRecurring: boolean;
  recurringPattern?: {
    type: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate?: Date;
  };
  mediaUrls?: string[];
  hashtags?: string[];
  location?: string;
  optimalTiming?: {
    platform: string;
    bestTimes: Date[];
    confidence: number;
  }[];
}

interface AdvancedCalendarProps {
  onEventClick?: (event: CalendarEvent) => void;
  onEventCreate?: (event: Omit<CalendarEvent, 'id'>) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  onEventDelete?: (eventId: string) => void;
  onBulkSchedule?: (events: Omit<CalendarEvent, 'id'>[]) => void;
}

export default function AdvancedCalendar({
  onEventClick,
  onEventCreate,
  onEventUpdate,
  onEventDelete,
  onBulkSchedule,
}: AdvancedCalendarProps) {
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  const [loading, setLoading] = useState(false);

  // Load events on component mount
  useEffect(() => {
    loadEvents();
  }, [currentDate]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/scheduling/events');
      const data = await response.json();
      
      if (data.success) {
        setEvents(data.events.map((event: any) => ({
          ...event,
          scheduledTime: new Date(event.scheduledTime),
        })));
      }
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  const handleViewChange = (newView: 'month' | 'week' | 'day') => {
    setView(newView);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    onEventClick?.(event);
  };

  const handleEventCreate = () => {
    setSelectedEvent(null);
    setShowEventDialog(true);
  };

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    setEvents(prev => prev.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
    onEventUpdate?.(updatedEvent);
  };

  const handleEventDelete = async (eventId: string) => {
    try {
      const response = await fetch(`/api/scheduling/events/${eventId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setEvents(prev => prev.filter(event => event.id !== eventId));
        onEventDelete?.(eventId);
      }
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  const handleDragStart = (event: React.DragEvent, calendarEvent: CalendarEvent) => {
    setDraggedEvent(calendarEvent);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (event: React.DragEvent, targetDate: Date) => {
    event.preventDefault();
    
    if (!draggedEvent) return;

    const updatedEvent = {
      ...draggedEvent,
      scheduledTime: targetDate,
    };

    try {
      const response = await fetch(`/api/scheduling/events/${draggedEvent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEvent),
      });

      if (response.ok) {
        handleEventUpdate(updatedEvent);
      }
    } catch (error) {
      console.error('Failed to update event:', error);
    }

    setDraggedEvent(null);
  };

  const handleBulkSchedule = () => {
    setShowBulkDialog(true);
  };

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    return events.filter(event => {
      const eventDate = new Date(event.scheduledTime);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getEventsForWeek = (startDate: Date): CalendarEvent[] => {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    
    return events.filter(event => {
      const eventDate = new Date(event.scheduledTime);
      return eventDate >= startDate && eventDate <= endDate;
    });
  };

  const renderMonthView = () => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(startOfMonth);
    startDate.setDate(startDate.getDate() - startOfMonth.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return (
      <Grid container spacing={1}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <Grid item xs={12/7} key={day}>
            <Typography variant="subtitle2" align="center" sx={{ p: 1, fontWeight: 'bold' }}>
              {day}
            </Typography>
          </Grid>
        ))}
        
        {days.map((date, index) => {
          const dayEvents = getEventsForDate(date);
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          const isToday = date.toDateString() === new Date().toDateString();
          
          return (
            <Grid item xs={12/7} key={index}>
              <Paper
                sx={{
                  minHeight: 120,
                  p: 1,
                  border: isToday ? '2px solid #1976d2' : '1px solid #e0e0e0',
                  backgroundColor: isCurrentMonth ? 'background.paper' : 'grey.100',
                  position: 'relative',
                }}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, date)}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: isToday ? 'bold' : 'normal',
                    color: isCurrentMonth ? 'text.primary' : 'text.secondary',
                  }}
                >
                  {date.getDate()}
                </Typography>
                
                {dayEvents.map(event => (
                  <Chip
                    key={event.id}
                    label={event.title}
                    size="small"
                    sx={{
                      fontSize: '0.7rem',
                      height: 20,
                      mb: 0.5,
                      cursor: 'pointer',
                      backgroundColor: getEventColor(event.status),
                      color: 'white',
                    }}
                    onClick={() => handleEventClick(event)}
                    draggable
                    onDragStart={(e) => handleDragStart(e, event)}
                  />
                ))}
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }

    return (
      <Grid container spacing={1}>
        {days.map((date, index) => {
          const dayEvents = getEventsForDate(date);
          const isToday = date.toDateString() === new Date().toDateString();
          
          return (
            <Grid item xs={12/7} key={index}>
              <Paper
                sx={{
                  minHeight: 200,
                  p: 1,
                  border: isToday ? '2px solid #1976d2' : '1px solid #e0e0e0',
                }}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, date)}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: isToday ? 'bold' : 'normal' }}
                >
                  {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </Typography>
                
                {dayEvents.map(event => (
                  <Card
                    key={event.id}
                    sx={{
                      mb: 1,
                      cursor: 'pointer',
                      backgroundColor: getEventColor(event.status),
                      color: 'white',
                    }}
                    onClick={() => handleEventClick(event)}
                    draggable
                    onDragStart={(e) => handleDragStart(e, event)}
                  >
                    <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                        {event.title}
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                        {event.scheduledTime.toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit' 
                        })}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  const getEventColor = (status: string): string => {
    switch (status) {
      case 'published':
        return '#4caf50';
      case 'pending':
        return '#ff9800';
      case 'failed':
        return '#f44336';
      default:
        return '#2196f3';
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Card>
        <CardContent>
          {/* Calendar Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">
              {currentDate.toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant={view === 'month' ? 'contained' : 'outlined'}
                startIcon={<ViewMonthIcon />}
                onClick={() => handleViewChange('month')}
                size="small"
              >
                Month
              </Button>
              <Button
                variant={view === 'week' ? 'contained' : 'outlined'}
                startIcon={<ViewWeekIcon />}
                onClick={() => handleViewChange('week')}
                size="small"
              >
                Week
              </Button>
              <Button
                variant={view === 'day' ? 'contained' : 'outlined'}
                startIcon={<TodayIcon />}
                onClick={() => handleViewChange('day')}
                size="small"
              >
                Day
              </Button>
            </Box>
          </Box>

          {/* Navigation */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton onClick={() => setCurrentDate(new Date(currentDate.getTime() - (view === 'month' ? 30 : 7) * 24 * 60 * 60 * 1000))}>
                <ChevronLeftIcon />
              </IconButton>
              <IconButton onClick={() => setCurrentDate(new Date())}>
                <TodayIcon />
              </IconButton>
              <IconButton onClick={() => setCurrentDate(new Date(currentDate.getTime() + (view === 'month' ? 30 : 7) * 24 * 60 * 60 * 1000))}>
                <ChevronRightIcon />
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleEventCreate}
                size="small"
              >
                Schedule Post
              </Button>
              <Button
                variant="outlined"
                startIcon={<RepeatIcon />}
                onClick={handleBulkSchedule}
                size="small"
              >
                Bulk Schedule
              </Button>
            </Box>
          </Box>

          {/* Calendar Content */}
          {loading ? (
            <LinearProgress />
          ) : (
            <Box>
              {view === 'month' && renderMonthView()}
              {view === 'week' && renderWeekView()}
              {view === 'day' && (
                <Alert severity="info">
                  Day view coming soon! Use week view for detailed daily planning.
                </Alert>
              )}
            </Box>
          )}

          {/* Event Dialog */}
          <EventDialog
            open={showEventDialog}
            onClose={() => setShowEventDialog(false)}
            event={selectedEvent}
            onSave={(event) => {
              if (selectedEvent) {
                handleEventUpdate(event);
              } else {
                onEventCreate?.(event);
              }
              setShowEventDialog(false);
            }}
          />

          {/* Bulk Schedule Dialog */}
          <BulkScheduleDialog
            open={showBulkDialog}
            onClose={() => setShowBulkDialog(false)}
            onSave={(events) => {
              onBulkSchedule?.(events);
              setShowBulkDialog(false);
            }}
          />
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}

// Event Dialog Component
interface EventDialogProps {
  open: boolean;
  onClose: () => void;
  event: CalendarEvent | null;
  onSave: (event: Omit<CalendarEvent, 'id'>) => void;
}

function EventDialog({ open, onClose, event, onSave }: EventDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    platforms: [] as string[],
    scheduledTime: new Date(),
    isRecurring: false,
    recurringPattern: {
      type: 'daily' as 'daily' | 'weekly' | 'monthly',
      interval: 1,
      endDate: undefined as Date | undefined,
    },
    mediaUrls: [] as string[],
    hashtags: [] as string[],
    location: '',
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        content: event.content,
        platforms: event.platforms,
        scheduledTime: event.scheduledTime,
        isRecurring: event.isRecurring,
        recurringPattern: event.recurringPattern || {
          type: 'daily',
          interval: 1,
          endDate: undefined,
        },
        mediaUrls: event.mediaUrls || [],
        hashtags: event.hashtags || [],
        location: event.location || '',
      });
    } else {
      setFormData({
        title: '',
        content: '',
        platforms: [],
        scheduledTime: new Date(),
        isRecurring: false,
        recurringPattern: {
          type: 'daily',
          interval: 1,
          endDate: undefined,
        },
        mediaUrls: [],
        hashtags: [],
        location: '',
      });
    }
  }, [event]);

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {event ? 'Edit Scheduled Post' : 'Schedule New Post'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Date"
              value={formData.scheduledTime}
              onChange={(newValue) => newValue && setFormData(prev => ({ ...prev, scheduledTime: newValue }))}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TimePicker
              label="Time"
              value={formData.scheduledTime}
              onChange={(newValue) => newValue && setFormData(prev => ({ ...prev, scheduledTime: newValue }))}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Platforms</InputLabel>
              <Select
                multiple
                value={formData.platforms}
                onChange={(e) => setFormData(prev => ({ ...prev, platforms: e.target.value as string[] }))}
              >
                <MenuItem value="instagram">Instagram</MenuItem>
                <MenuItem value="youtube">YouTube</MenuItem>
                <MenuItem value="twitter">Twitter</MenuItem>
                <MenuItem value="linkedin">LinkedIn</MenuItem>
                <MenuItem value="tiktok">TikTok</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isRecurring}
                  onChange={(e) => setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))}
                />
              }
              label="Recurring Post"
            />
          </Grid>
          
          {formData.isRecurring && (
            <>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Recurrence Type</InputLabel>
                  <Select
                    value={formData.recurringPattern.type}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      recurringPattern: { ...prev.recurringPattern, type: e.target.value as any }
                    }))}
                  >
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Interval"
                  type="number"
                  value={formData.recurringPattern.interval}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    recurringPattern: { ...prev.recurringPattern, interval: parseInt(e.target.value) }
                  }))}
                />
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          {event ? 'Update' : 'Schedule'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Bulk Schedule Dialog Component
interface BulkScheduleDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (events: Omit<CalendarEvent, 'id'>[]) => void;
}

function BulkScheduleDialog({ open, onClose, onSave }: BulkScheduleDialogProps) {
  const [formData, setFormData] = useState({
    content: '',
    platforms: [] as string[],
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    pattern: {
      type: 'daily' as 'daily' | 'weekly' | 'monthly',
      interval: 1,
    },
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  const handleSave = () => {
    // Generate events based on pattern
    const events: Omit<CalendarEvent, 'id'>[] = [];
    const current = new Date(formData.startDate);
    
    while (current <= formData.endDate) {
      events.push({
        title: formData.content.substring(0, 50),
        content: formData.content,
        platforms: formData.platforms,
        scheduledTime: new Date(current),
        status: 'pending',
        isRecurring: true,
        recurringPattern: formData.pattern,
      });
      
      // Calculate next occurrence
      switch (formData.pattern.type) {
        case 'daily':
          current.setDate(current.getDate() + formData.pattern.interval);
          break;
        case 'weekly':
          current.setDate(current.getDate() + (formData.pattern.interval * 7));
          break;
        case 'monthly':
          current.setMonth(current.getMonth() + formData.pattern.interval);
          break;
      }
    }
    
    onSave(events);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Bulk Schedule Posts</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Platforms</InputLabel>
              <Select
                multiple
                value={formData.platforms}
                onChange={(e) => setFormData(prev => ({ ...prev, platforms: e.target.value as string[] }))}
              >
                <MenuItem value="instagram">Instagram</MenuItem>
                <MenuItem value="youtube">YouTube</MenuItem>
                <MenuItem value="twitter">Twitter</MenuItem>
                <MenuItem value="linkedin">LinkedIn</MenuItem>
                <MenuItem value="tiktok">TikTok</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Start Date"
              value={formData.startDate}
              onChange={(newValue) => newValue && setFormData(prev => ({ ...prev, startDate: newValue }))}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="End Date"
              value={formData.endDate}
              onChange={(newValue) => newValue && setFormData(prev => ({ ...prev, endDate: newValue }))}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Pattern</InputLabel>
              <Select
                value={formData.pattern.type}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  pattern: { ...prev.pattern, type: e.target.value as any }
                }))}
              >
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Interval"
              type="number"
              value={formData.pattern.interval}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                pattern: { ...prev.pattern, interval: parseInt(e.target.value) }
              }))}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Schedule All
        </Button>
      </DialogActions>
    </Dialog>
  );
}
