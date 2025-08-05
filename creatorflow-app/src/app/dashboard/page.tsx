'use client';
import { useEffect, useState } from 'react';
import Link from "next/link"
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Button, 
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  Divider,
  Paper
} from '@mui/material';
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
import { 
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  Button as MuiButton,
  MuiStatsCard,
  MuiEnhancedNavigation,
  Dialog as MuiDialog,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  DialogActions as MuiDialogActions,
  LoadingSpinner as MuiLoadingSpinner
} from '@/components/ui/mui-components';
import { Tooltip } from '@mui/material';
import { Textarea } from '@/components/ui/textarea';
import { NotificationBadge } from '@/components/ui/notification-badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { EmptyState } from '@/components/ui/empty-state';
import { EnhancedNavigation, UserMenu, Breadcrumbs } from '@/components/ui/enhanced-nav';
import { AISetupReminder } from '@/components/ui/ai-setup-reminder';
import { useAPIKey } from '@/hooks/use-api-key';
import { FeedbackWidget } from '@/components/FeedbackWidget';

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { hasAPIKey } = useAPIKey();
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showGettingStarted, setShowGettingStarted] = useState(false);
  const [showAIReminder, setShowAIReminder] = useState(true);
  const [feedback, setFeedback] = useState('');
  const [stats, setStats] = useState({
    totalPosts: 0,
    connectedAccounts: 0,
    totalEngagement: 0,
    scheduledPosts: 0,
  });

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
        </Box>

        {/* AI Setup Reminder */}
        {!hasAPIKey && showAIReminder && (
          <AISetupReminder
            onSetup={() => router.push('/dashboard/ai-tools')}
            onDismiss={() => setShowAIReminder(false)}
          />
        )}

        {/* Enhanced Stats Grid */}
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

        {/* Quick Actions */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: { xs: 2, sm: 3 } }}>
          {/* Create Content */}
          <Box>
            <MuiCard sx={{ border: 0 }}>
              <MuiCardHeader>
                <MuiCardTitle sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  color: 'text.primary',
                  wordBreak: 'break-word'
                }}>
                  <Plus sx={{ width: 20, height: 20, flexShrink: 0 }} />
                  Quick Actions
                </MuiCardTitle>
              </MuiCardHeader>
              <MuiCardContent sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 } }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: { xs: 1, sm: 1.5 } }}>
                  <Box>
                    <MuiButton 
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
                    </MuiButton>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <MuiButton 
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
                    </MuiButton>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <MuiButton 
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
                    </MuiButton>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <MuiButton 
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
                    </MuiButton>
                  </Grid>
                </Box>
              </MuiCardContent>
            </MuiCard>
          </Box>

          {/* Recent Activity */}
          <Box>
            <MuiCard>
              <MuiCardHeader>
                <MuiCardTitle sx={{ color: 'text.primary' }}>
                  Recent Activity
                </MuiCardTitle>
              </MuiCardHeader>
              <MuiCardContent>
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
              </MuiCardContent>
            </MuiCard>
          </Box>
        </Box>

        {/* Content Performance */}
        <MuiCard>
          <MuiCardHeader>
            <MuiCardTitle sx={{ color: 'text.primary' }}>
              Content Performance
            </MuiCardTitle>
            <MuiCardDescription>
              Your top performing content this week
            </MuiCardDescription>
          </MuiCardHeader>
          <MuiCardContent>
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
              </Grid>
              <Grid item xs={12} md={6}>
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
          </MuiCardContent>
        </MuiCard>

        {/* Welcome Dialog */}
        <MuiDialog
          open={showWelcome}
          onClose={handleClose}
          maxWidth="sm"
          fullWidth
        >
          <MuiDialogTitle>
            Welcome to CreatorFlow! 🎉
          </MuiDialogTitle>
          <MuiDialogContent>
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
          </MuiDialogContent>
          <MuiDialogActions>
            <MuiButton onClick={handleClose} variant="outlined">
              Got it!
            </MuiButton>
            <MuiButton onClick={() => router.push('/dashboard/accounts')} variant="contained">
              Connect Accounts
            </MuiButton>
          </MuiDialogActions>
        </MuiDialog>

        {/* Feedback Dialog */}
        <MuiDialog
          open={showGettingStarted}
          onClose={() => setShowGettingStarted(false)}
          maxWidth="sm"
          fullWidth
        >
          <MuiDialogTitle>
            How's CreatorFlow working for you?
          </MuiDialogTitle>
          <MuiDialogContent>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Share your feedback, suggestions, or report any issues..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              sx={{ mt: 1 }}
            />
          </MuiDialogContent>
          <MuiDialogActions>
            <MuiButton onClick={() => setShowGettingStarted(false)} variant="outlined">
              Cancel
            </MuiButton>
            <MuiButton onClick={handleFeedbackSubmit} variant="contained">
              Submit Feedback
            </MuiButton>
          </MuiDialogActions>
        </MuiDialog>

        <FeedbackWidget />
      </Box>
  );
} 