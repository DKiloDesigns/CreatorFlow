'use client';
import { useEffect, useState } from 'react';
import Link from "next/link"
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  Divider,
  Paper,
  Card,
  CardHeader,
  CardContent,
  Tooltip,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  VisibilityOff as HideIcon,
  DragIndicator as DragIcon
} from '@mui/icons-material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MuiStatsCard } from '@/components/ui/mui-stats-card';
import { 
  FileText, 
  Users, 
  BarChart2, 
  TrendingUp, 
  TrendingDown,
  Plus,
  Calendar,
  MessageSquare,
  Heart,
  Share2,
  Brain,
  CreditCard
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { NotificationBadge } from '@/components/ui/notification-badge';

import { EmptyState } from '@/components/ui/empty-state';
import { EnhancedNavigation, UserMenu, Breadcrumbs } from '@/components/ui/enhanced-nav';
import { AISetupReminder } from '@/components/ui/ai-setup-reminder';
import { useAPIKey } from '@/hooks/use-api-key';
import { FeedbackWidget } from '@/components/FeedbackWidget';

// Sortable Collapsible Section Component
interface SortableCollapsibleSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  onHide?: (id: string) => void;
}

const SortableCollapsibleSection: React.FC<SortableCollapsibleSectionProps> = ({
  id,
  title,
  children,
  defaultExpanded = true,
  onHide
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const handleHide = () => {
    if (onHide) {
      onHide(id);
    }
  };

  return (
    <Box ref={setNodeRef} style={style} sx={{ mb: 2 }}>
      <Accordion 
        expanded={expanded} 
        onChange={handleToggle}
        sx={{ 
          '&:before': { display: 'none' },
          boxShadow: 'none',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          cursor: 'grab',
          '&:active': { cursor: 'grabbing' }
        }}
      >
        <AccordionSummary
          expandIcon={
            expanded ? (
              <ExpandLessIcon sx={{ color: 'primary.main' }} />
            ) : (
              <ExpandMoreIcon sx={{ color: 'text.secondary' }} />
            )
          }
          sx={{
            '& .MuiAccordionSummary-content': {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%'
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Drag to reorder">
              <IconButton
                size="small"
                {...attributes}
                {...listeners}
                sx={{
                  color: 'text.secondary',
                  cursor: 'grab',
                  '&:active': { cursor: 'grabbing' },
                  '&:hover': { color: 'primary.main' }
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <DragIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Typography
              variant="h6"
              component="h2"
              sx={{
                fontWeight: 600,
                color: 'text.primary'
              }}
            >
              {title}
            </Typography>
          </Box>
          {onHide && (
            <Tooltip title="Hide section">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleHide();
                }}
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'error.main' }
                }}
              >
                <HideIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0 }}>
          {children}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { hasAPIKey } = useAPIKey();
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showGettingStarted, setShowGettingStarted] = useState(false);
  const [showAIReminder, setShowAIReminder] = useState(true);
  const [feedback, setFeedback] = useState('');
  const [hiddenSections, setHiddenSections] = useState<string[]>([]);
  
  // Section ordering state
  const [sectionOrder, setSectionOrder] = useState<string[]>([
    'stats-grid',
    'quick-actions', 
    'content-performance'
  ]);
  
  const [stats, setStats] = useState({
    totalPosts: 0,
    connectedAccounts: 0,
    totalEngagement: 0,
    scheduledPosts: 0,
  });

  // Drag & Drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleHideSection = (sectionId: string) => {
    setHiddenSections(prev => [...prev, sectionId]);
  };

  const isSectionHidden = (sectionId: string) => {
    return hiddenSections.includes(sectionId);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSectionOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Get visible sections in current order
  const visibleSections = sectionOrder.filter(id => !isSectionHidden(id));

  useEffect(() => {
    // Add CSS to force white text in dark mode
    const style = document.createElement('style');
    style.textContent = `
      .dark h1, .dark p, .dark .text-gray-900 {
        color: white !important;
      }
      .dark .text-sm.font-medium {
        color: white !important;
      }
      .dark .text-base.font-semibold {
        color: white !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    // Simulate loading stats
    setTimeout(() => {
      setStats({
        totalPosts: 12,
        connectedAccounts: 3,
        totalEngagement: 15420,
        scheduledPosts: 5,
      });
      setIsLoading(false);
    }, 1000);

    // Show welcome modal for new users
    if (typeof window !== 'undefined') {
      const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
      if (!hasSeenWelcome) {
        setShowWelcome(true);
      }
    }
  }, []);

  const handleClose = () => {
    setShowWelcome(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasSeenWelcome', 'true');
    }
  };

  const handleFeedbackSubmit = () => {
    // Handle feedback submission
    console.log('Feedback submitted:', feedback);
    setFeedback('');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Enhanced Header */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          alignItems: { sm: 'center' }, 
          justifyContent: 'space-between', 
          gap: 2 
        }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 'bold', 
                color: 'text.primary',
                wordBreak: 'break-word',
                fontSize: { xs: '1.25rem', sm: '1.5rem' }
              }}
            >
              Welcome back{session?.user?.name ? `, ${session.user.name}` : ''}!
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.primary',
                wordBreak: 'break-word',
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              Here's what's happening with your content today.
            </Typography>
          </Box>
          
          {/* Dashboard Controls */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {hiddenSections.length > 0 && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => setHiddenSections([])}
                sx={{ 
                  fontSize: '0.75rem',
                  minWidth: 'auto',
                  px: 2
                }}
              >
                Restore Hidden ({hiddenSections.length})
              </Button>
            )}
          </Box>
        </Box>

        {/* AI Setup Reminder */}
        {!hasAPIKey && showAIReminder && (
          <AISetupReminder
            onSetup={() => router.push('/dashboard/ai-tools')}
            onDismiss={() => setShowAIReminder(false)}
          />
        )}

        {/* Drag & Drop Dashboard Sections */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={visibleSections}
            strategy={verticalListSortingStrategy}
          >
            {visibleSections.map((sectionId) => {
              switch (sectionId) {
                case 'stats-grid':
                  return (
                    <SortableCollapsibleSection
                      key={sectionId}
                      id={sectionId}
                      title="Quick Stats"
                      defaultExpanded={true}
                      onHide={handleHideSection}
                    >
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: { xs: 1.5, sm: 2 } }}>
                        <Box>
                          <MuiStatsCard
                            title="Total Posts"
                            value={stats.totalPosts}
                            description="Published this month"
                            icon={FileText}
                            trend={{ value: 12, isPositive: true, period: 'last month' }}
                            loading={isLoading}
                            onClick={() => router.push('/dashboard/content')}
                          />
                        </Box>
                        <Box>
                          <MuiStatsCard
                            title="Connected Accounts"
                            value={stats.connectedAccounts}
                            description="Social platforms"
                            icon={Users}
                            variant="success"
                            loading={isLoading}
                            onClick={() => router.push('/dashboard/accounts')}
                            sx={{ bgcolor: 'grey.100', borderColor: 'success.main' }}
                          />
                        </Box>
                        <Box>
                          <MuiStatsCard
                            title="Total Engagement"
                            value={stats.totalEngagement.toLocaleString()}
                            description="Likes, comments, shares"
                            icon={Heart}
                            trend={{ value: 8, isPositive: true, period: 'last week' }}
                            loading={isLoading}
                            onClick={() => router.push('/dashboard/analytics')}
                          />
                        </Box>
                        <Box>
                          <MuiStatsCard
                            title="Scheduled Posts"
                            value={stats.scheduledPosts}
                            description="Ready to publish"
                            icon={Calendar}
                            variant="warning"
                            loading={isLoading}
                            onClick={() => router.push('/dashboard/content')}
                            sx={{ bgcolor: 'grey.100', borderColor: 'warning.main' }}
                          />
                        </Box>
                      </Box>
                    </SortableCollapsibleSection>
                  );

                case 'quick-actions':
                  return (
                    <SortableCollapsibleSection
                      key={sectionId}
                      id={sectionId}
                      title="Quick Actions"
                      defaultExpanded={true}
                      onHide={handleHideSection}
                    >
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: { xs: 2, sm: 3 } }}>
              {/* Create Content */}
              <Box>
                <Card sx={{ border: 0 }}>
                  <CardHeader>
                    <Typography 
                      variant="h6" 
                      component="h2" 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        color: 'text.primary',
                        wordBreak: 'break-word'
                      }}
                    >
                      <Plus sx={{ width: 20, height: 20, flexShrink: 0 }} />
                      Quick Actions
                    </Typography>
                  </CardHeader>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 } }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: { xs: 1, sm: 1.5 } }}>
                      <Box>
                        <Button 
                          variant="outlined"
                          fullWidth
                          sx={{
                            height: 64,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1,
                            bgcolor: 'background.paper',
                            color: 'text.primary',
                            '&:hover': {
                              bgcolor: 'action.hover'
                            },
                            minWidth: 44,
                            minHeight: 44
                          }}
                          onClick={() => router.push('/dashboard/content')}
                        >
                          <FileText sx={{ width: 24, height: 24, flexShrink: 0 }} />
                          <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                            Create Post
                          </Typography>
                        </Button>
                      </Box>
                      <Box>
                        <Button 
                          variant="outlined"
                          fullWidth
                          sx={{
                            height: 64,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1,
                            bgcolor: 'background.paper',
                            color: 'text.primary',
                            '&:hover': {
                              bgcolor: 'action.hover'
                            },
                            minWidth: 44,
                            minHeight: 44
                          }}
                          onClick={() => router.push('/dashboard/ai-tools')}
                        >
                          <Brain sx={{ width: 24, height: 24, flexShrink: 0 }} />
                          <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                            AI Tools
                          </Typography>
                        </Button>
                      </Box>
                      <Box>
                        <Button 
                          variant="outlined"
                          fullWidth
                          sx={{
                            height: 64,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1,
                            bgcolor: 'background.paper',
                            color: 'text.primary',
                            '&:hover': {
                              bgcolor: 'action.hover'
                            },
                            minWidth: 44,
                            minHeight: 44
                          }}
                          onClick={() => router.push('/dashboard/analytics')}
                        >
                          <BarChart2 sx={{ width: 24, height: 24, flexShrink: 0 }} />
                          <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                            View Analytics
                          </Typography>
                        </Button>
                      </Box>
                      <Box>
                        <Button 
                          variant="outlined"
                          fullWidth
                          sx={{
                            height: 64,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1,
                            bgcolor: 'background.paper',
                            color: 'text.primary',
                            '&:hover': {
                              bgcolor: 'action.hover'
                            },
                            minWidth: 44,
                            minHeight: 44
                          }}
                          onClick={() => router.push('/dashboard/accounts')}
                        >
                          <Users sx={{ width: 24, height: 24, flexShrink: 0 }} />
                          <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                            Manage Accounts
                          </Typography>
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>

              {/* Recent Activity */}
              <Box>
                <Card>
                  <CardHeader>
                    <Typography variant="h6" component="h2" sx={{ color: 'text.primary' }}>
                      Recent Activity
                    </Typography>
                  </CardHeader>
                  <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%', 
                          bgcolor: 'success.main' 
                        }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Post published to Instagram
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%', 
                          bgcolor: 'info.main' 
                        }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          New comment on YouTube video
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%', 
                          bgcolor: 'warning.main' 
                        }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Scheduled post ready
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </SortableCollapsibleSection>
        )}

        {/* Content Performance */}
        {!isSectionHidden('content-performance') && (
          <SortableCollapsibleSection
            id="content-performance"
            title="Content Performance"
            defaultExpanded={false}
            onHide={handleHideSection}
          >
            <Card>
              <CardHeader>
                <Typography variant="h6" component="h2" sx={{ color: 'text.primary' }}>
                  Content Performance
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Your top performing content this week
                </Typography>
              </CardHeader>
              <CardContent>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
                  <Box>
                    <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ 
                        width: 48, 
                        height: 48, 
                        borderRadius: 1, 
                        bgcolor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <TrendingUp sx={{ color: 'white', width: 24, height: 24 }} />
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          Instagram Reel
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          2.4k views • 156 likes
                        </Typography>
                      </Box>
                      <Chip 
                        label="+12%" 
                        color="success" 
                        size="small" 
                        variant="outlined"
                      />
                    </Paper>
                  </Box>
                  <Box>
                    <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ 
                        width: 48, 
                        height: 48, 
                        borderRadius: 1, 
                        bgcolor: 'secondary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <MessageSquare sx={{ color: 'white', width: 24, height: 24 }} />
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          YouTube Short
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          1.8k views • 89 comments
                        </Typography>
                      </Box>
                      <Chip 
                        label="+8%" 
                        color="success" 
                        size="small" 
                        variant="outlined"
                      />
                    </Paper>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </SortableCollapsibleSection>
        );
      }
    })}
          </SortableContext>
        </DndContext>

        {/* Welcome Dialog */}
        <Dialog
          open={showWelcome}
          onClose={handleClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Welcome to CreatorFlow! 🎉
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              We're excited to help you grow your creator business. Here's what you can do to get started:
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Connect your social media accounts
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Create your first post
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Explore AI tools for content creation
              </Typography>
              <Typography component="li" variant="body2">
                Set up your monetization dashboard
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="outlined">
              Got it!
            </Button>
            <Button onClick={() => router.push('/dashboard/accounts')} variant="contained">
              Connect Accounts
            </Button>
          </DialogActions>
        </Dialog>

        {/* Feedback Dialog */}
        <Dialog
          open={showGettingStarted}
          onClose={() => setShowGettingStarted(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            How's CreatorFlow working for you?
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Share your feedback, suggestions, or report any issues..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowGettingStarted(false)} variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleFeedbackSubmit} variant="contained">
              Submit Feedback
            </Button>
          </DialogActions>
        </Dialog>

        <FeedbackWidget />
      </Box>
  );
} 