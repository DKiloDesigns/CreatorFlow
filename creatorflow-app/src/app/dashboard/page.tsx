'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { 
  Box, 
  Typography, 
  Button, 
  Chip,
  Paper,
  Card,
  CardHeader,
  CardContent,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Badge,
  Divider,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  VisibilityOff as HideIcon,
  DragIndicator as DragIcon,
  AutoAwesome
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
import { Plug } from 'lucide-react';
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
  CreditCard,
  Sparkles,
  Rocket,
  Shield
} from 'lucide-react';
import { useAPIKey } from '@/hooks/use-api-key';
import { FeedbackWidget } from '@/components/FeedbackWidget';
import { AISetupReminder } from '@/components/ui/ai-setup-reminder';

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
              <Box
                component="div"
                {...attributes}
                {...listeners}
                sx={{
                  color: 'text.secondary',
                  cursor: 'grab',
                  '&:active': { cursor: 'grabbing' },
                  '&:hover': { color: 'primary.main' },
                  p: 0.5,
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <DragIcon fontSize="small" />
              </Box>
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
              <Box
                component="div"
                onClick={(e) => {
                  e.stopPropagation();
                  handleHide();
                }}
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'error.main' },
                  p: 0.5,
                  borderRadius: 1,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <HideIcon fontSize="small" />
              </Box>
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
    'ai-intelligence-preview',
    'content-performance',
    'phase5-preview',
    'phase6-preview'
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
    <Box sx={{ pb: { xs: 8, sm: 4 } }}>
      {/* Welcome Header */}
      <Box sx={{ mb: 4 }}>
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
          onSetup={() => router.push('/dashboard/enhanced')}
          onDismiss={() => setShowAIReminder(false)}
        />
      )}

      {/* Enhanced Dashboard Promotion */}
      <Card sx={{ bgcolor: 'primary.50', border: '2px solid', borderColor: 'primary.main' }}>
        <CardContent sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom color="primary.main">
            🚀 Try Our Enhanced AI-Powered Dashboard!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Experience the next generation of content creation intelligence with Phase 2 features
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => router.push('/dashboard/enhanced')}
            startIcon={<AutoAwesome />}
            sx={{ mr: 2 }}
          >
            Launch Enhanced Dashboard
          </Button>
          <Button 
            variant="outlined" 
            size="large"
            onClick={() => router.push('/dashboard/phase2-hub')}
            startIcon={<Rocket />}
          >
            Phase 2 Hub
          </Button>
        </CardContent>
      </Card>

      {/* Drag & Drop Dashboard Sections */}
      <Box sx={{ pb: { xs: 12, sm: 8 } }}>
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
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: { xs: 1.5, sm: 2 }, mb: 3 }}>
                        <Box>
                          <MuiStatsCard
                            title="Total Posts"
                            value={stats.totalPosts}
                            description="Published this month"
                            icon={FileText}
                            trend={{ value: 12, isPositive: true, period: 'last month' }}
                            loading={isLoading}
                            onClick={() => router.push('/dashboard/content')}
                            aria-label="View total posts statistics"
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
                            onClick={() => router.push('/dashboard/enhanced')}
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
                                <Plus width={20} height={20} />
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
                                    <FileText width={24} height={24} />
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
                                    onClick={() => router.push('/dashboard/enhanced')}
                                  >
                                    <Brain width={24} height={24} />
                                    <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                                      AI Intelligence
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
                                    onClick={() => router.push('/dashboard/enhanced')}
                                  >
                                    <BarChart2 width={24} height={24} />
                                    <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                                      Live Analytics
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
                                    onClick={() => router.push('/dashboard/enhanced')}
                                  >
                                    <Sparkles width={24} height={24} />
                                    <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                                      Smart Workflow
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
                                       borderColor: 'secondary.main',
                                       '&:hover': {
                                         bgcolor: 'secondary.50',
                                         borderColor: 'secondary.dark'
                                       },
                                       minWidth: 44,
                                       minHeight: 44
                                     }}
                                     onClick={() => router.push('/dashboard/unified-demo')}
                                   >
                                     <AutoAwesome width={24} height={24} />
                                     <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                                       New Design
                                     </Typography>
                                   </Button>
                                 </Box>
                                 <Box>
                                   <Button
                                     variant="contained"
                                     fullWidth
                                     sx={{
                                       height: 64,
                                       display: 'flex',
                                       flexDirection: 'column',
                                       alignItems: 'center',
                                       justifyContent: 'center',
                                       gap: 1,
                                       background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)',
                                       color: 'white',
                                       borderColor: 'secondary.main',
                                       '&:hover': {
                                         background: 'linear-gradient(90deg, #2563EB, #7C3AED)'
                                       },
                                       minWidth: 44,
                                       minHeight: 44
                                     }}
                                     onClick={() => router.push('/dashboard/phase2-hub')}
                                   >
                                     <Brain width={24} height={24} />
                                     <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                                       Phase 2 Hub
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
                                    onClick={() => router.push('/dashboard/enhanced')}
                                  >
                                    <Rocket width={24} height={24} />
                                    <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                                      Phase 2 Hub
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
                                    onClick={() => router.push('/dashboard/enhanced')}
                                  >
                                    <AutoAwesome width={24} height={24} />
                                    <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                                      Enhanced Dashboard
                                    </Typography>
                                  </Button>
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        </Box>
                      </Box>
                    </SortableCollapsibleSection>
                  );

                case 'content-performance':
                  return (
                    <SortableCollapsibleSection
                      key={sectionId}
                      id={sectionId}
                      title="Content Performance"
                      defaultExpanded={true}
                      onHide={handleHideSection}
                    >
                      <Card>
                        <CardContent>
                          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                            Your content is performing well! Check out the enhanced dashboard for detailed analytics.
                          </Typography>
                          <Button 
                            variant="contained"
                            onClick={() => router.push('/dashboard/enhanced')}
                            startIcon={<TrendingUp />}
                          >
                            View Enhanced Analytics
                          </Button>
                        </CardContent>
                      </Card>
                    </SortableCollapsibleSection>
                  );

                case 'phase5-preview':
                  return (
                    <SortableCollapsibleSection
                      key={sectionId}
                      id={sectionId}
                      title="🚀 Phase 5: Advanced AI & Automation"
                      defaultExpanded={true}
                      onHide={handleHideSection}
                    >
                      <Card>
                        <CardContent>
                          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                            Experience the future of content creation with our advanced AI-powered features:
                          </Typography>
                          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2, mb: 3 }}>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                🤖 AI Content Optimizer
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Advanced content performance prediction and optimization
                              </Typography>
                              <Button 
                                variant="outlined"
                                size="small"
                                onClick={() => router.push('/dashboard/content')}
                                startIcon={<Brain />}
                              >
                                Try AI Optimization
                              </Button>
                            </Box>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                📊 Predictive Analytics
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                ML-powered forecasting and trend analysis
                              </Typography>
                              <Button 
                                variant="outlined"
                                size="small"
                                onClick={() => router.push('/dashboard/analytics')}
                                startIcon={<TrendingUp />}
                              >
                                View Predictions
                              </Button>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                ⚡ Automated Publisher
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Smart scheduling and cross-platform automation
                              </Typography>
                              <Button 
                                variant="outlined"
                                size="small"
                                onClick={() => router.push('/dashboard/content')}
                                startIcon={<Rocket />}
                              >
                                Setup Automation
                              </Button>
                            </Box>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                🔗 Integration Hub
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Advanced third-party platform integrations
                              </Typography>
                              <Button 
                                variant="outlined"
                                size="small"
                                onClick={() => router.push('/dashboard/integrations')}
                                startIcon={<Plug />}
                              >
                                Manage Integrations
                              </Button>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </SortableCollapsibleSection>
                  );

                case 'phase6-preview':
                  return (
                    <SortableCollapsibleSection
                      key={sectionId}
                      id={sectionId}
                      title="🏢 Phase 6: Enterprise Features & Scaling"
                      defaultExpanded={true}
                      onHide={handleHideSection}
                    >
                      <Card>
                        <CardContent>
                          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                            Scale your content creation with enterprise-grade features for teams and organizations:
                          </Typography>
                          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2, mb: 3 }}>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                👥 Team Management
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Multi-user collaboration, roles, permissions, and departments
                              </Typography>
                              <Button 
                                variant="outlined"
                                size="small"
                                onClick={() => router.push('/dashboard/team')}
                                startIcon={<Users />}
                              >
                                Manage Team
                              </Button>
                            </Box>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                📊 Enterprise Analytics
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Custom dashboards, automated reports, and white-label solutions
                              </Typography>
                              <Button 
                                variant="outlined"
                                size="small"
                                onClick={() => router.push('/dashboard/analytics')}
                                startIcon={<BarChart2 />}
                              >
                                View Analytics
                              </Button>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                🔌 API Management
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Developer tools, webhooks, rate limiting, and integrations
                              </Typography>
                              <Button 
                                variant="outlined"
                                size="small"
                                onClick={() => router.push('/dashboard/api')}
                                startIcon={<Plug />}
                              >
                                Manage APIs
                              </Button>
                            </Box>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                🔒 Advanced Security
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Enterprise-grade security, compliance, and threat intelligence
                              </Typography>
                              <Button 
                                variant="outlined"
                                size="small"
                                onClick={() => router.push('/dashboard/security')}
                                startIcon={<Shield />}
                              >
                                Security Dashboard
                              </Button>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </SortableCollapsibleSection>
                  );

                default:
                  return null;
              }
            })}
          </SortableContext>
        </DndContext>
      </Box>

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
              Try our enhanced AI-powered dashboard
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              Explore Phase 2 features for advanced content creation
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained">
            Get Started
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Widget */}
      <FeedbackWidget />

      {/* Bottom Spacer to Clear Bottom Navigation */}
      <Box sx={{
        height: { xs: '120px', sm: '40px' },
        width: '100%'
      }} />
    </Box>
  );
} 