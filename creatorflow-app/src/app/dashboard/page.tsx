'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { 
  Box, 
  Typography, 
  Button, 
  Card,
  CardHeader,
  CardContent,
  Grid,
  Container,
  Chip,
  Divider,
  Collapse,
  IconButton
} from '@mui/material';
import { 
  FileText, 
  Users, 
  BarChart2, 
  Calendar,
  Brain,
  Zap,
  TrendingUp,
  Plus,
  Settings,
  Home,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAPIKey } from '@/hooks/use-api-key';
import dynamic from 'next/dynamic';

// Lazy load heavy components
const MiniCalendar = dynamic(() => import('./_components/mini-calendar'), {
  loading: () => <div>Loading calendar...</div>,
  ssr: false
});

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { hasAPIKey } = useAPIKey();
  const [isLoading, setIsLoading] = useState(true);
  
  const [stats, setStats] = useState({
    totalPosts: 0,
    connectedAccounts: 0,
    totalEngagement: 0,
    scheduledPosts: 0,
    aiCredits: 100,
    planStatus: 'Pro'
  });

  // State for expandable sections
  const [contentHubExpanded, setContentHubExpanded] = useState(false);
  const [analyticsCenterExpanded, setAnalyticsCenterExpanded] = useState(false);

  // State for calendar modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [bulkScheduleModalOpen, setBulkScheduleModalOpen] = useState(false);

  useEffect(() => {
    // Simulate loading stats
    setTimeout(() => {
      setStats({
        totalPosts: 12,
        connectedAccounts: 3,
        totalEngagement: 15420,
        scheduledPosts: 5,
        aiCredits: 100,
        planStatus: 'Pro'
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4, pb: 8 }}>
      {/* Header Section */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
          Welcome back{session?.user?.name ? `, ${session.user.name}` : ''}! 👋
          </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Your content creation command center
          </Typography>
        
        {/* Quick Stats Bar */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' }, 
          gap: 3,
          mb: 4
        }}>
          <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'background.paper', borderRadius: 2, border: 1, borderColor: 'divider' }}>
            <Typography variant="h6" color="primary.main">{stats.totalPosts}</Typography>
            <Typography variant="caption" color="text.secondary">Posts This Month</Typography>
          </Box>
          <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'background.paper', borderRadius: 2, border: 1, borderColor: 'divider' }}>
            <Typography variant="h6" color="success.main">{stats.connectedAccounts}</Typography>
            <Typography variant="caption" color="text.secondary">Social Accounts</Typography>
          </Box>
          <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'background.paper', borderRadius: 2, border: 1, borderColor: 'divider' }}>
            <Typography variant="h6" color="info.main">{stats.totalEngagement.toLocaleString()}</Typography>
            <Typography variant="caption" color="text.secondary">Total Engagement</Typography>
          </Box>
          <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'background.paper', borderRadius: 2, border: 1, borderColor: 'divider' }}>
            <Typography variant="h6" color="warning.main">{stats.scheduledPosts}</Typography>
            <Typography variant="caption" color="text.secondary">Scheduled Posts</Typography>
          </Box>
          <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'background.paper', borderRadius: 2, border: 1, borderColor: 'divider' }}>
            <Typography variant="h6" color="secondary.main">{stats.aiCredits}</Typography>
            <Typography variant="caption" color="text.secondary">AI Credits</Typography>
          </Box>
          <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'background.paper', borderRadius: 2, border: 1, borderColor: 'divider' }}>
            <Typography variant="h6" color="success.main">{stats.planStatus}</Typography>
            <Typography variant="caption" color="text.secondary">Plan Status</Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation Hub - Main Section */}
      <Grid container spacing={4} sx={{ mb: 5 }}>
        {/* Content Hub */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              avatar={<FileText size={32} color="#1976d2" />}
              title="Content Hub"
              subheader="Create, manage, and schedule your content"
              action={
                <IconButton 
                  onClick={() => setContentHubExpanded(!contentHubExpanded)}
                  size="small"
                >
                  {contentHubExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </IconButton>
              }
              sx={{ cursor: 'pointer' }}
                            onClick={() => router.push('/dashboard/content')}
                          />
            <Collapse in={contentHubExpanded}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Access your content calendar, AI tools, and publishing automation
                              </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip label="Content Calendar" size="small" variant="outlined" />
                  <Chip label="AI Optimization" size="small" variant="outlined" />
                  <Chip label="Auto Publishing" size="small" variant="outlined" />
                              </Box>
                            </CardContent>
            </Collapse>
                          </Card>
        </Grid>

        {/* Analytics Center */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              avatar={<BarChart2 size={32} color="#2e7d32" />}
              title="Analytics Center"
              subheader="Track performance and insights"
              action={
                <IconButton 
                  onClick={() => setAnalyticsCenterExpanded(!analyticsCenterExpanded)}
                                size="small"
                >
                  {analyticsCenterExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </IconButton>
              }
              sx={{ cursor: 'pointer' }}
                                onClick={() => router.push('/dashboard/analytics')}
            />
            <Collapse in={analyticsCenterExpanded}>
                        <CardContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Monitor your content performance with advanced analytics and AI predictions
                          </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip label="Performance" size="small" variant="outlined" />
                  <Chip label="Predictions" size="small" variant="outlined" />
                  <Chip label="Audience" size="small" variant="outlined" />
                          </Box>
                        </CardContent>
            </Collapse>
                      </Card>
        </Grid>
      </Grid>



      {/* Content Calendar Widget */}
      <Box sx={{ mb: 5 }}>
        <MiniCalendar
          onCreatePost={() => router.push('/dashboard/content')}
          onBulkSchedule={() => router.push('/dashboard/content')}
          onViewFullCalendar={() => router.push('/dashboard/content')}
        />
      </Box>

      {/* Recent Activity Feed */}
      <Card sx={{ mb: 4 }}>
        <CardHeader
          title="Recent Activity"
          subheader="Your latest content and platform activity"
        />
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <FileText size={20} color="#1976d2" />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  New post published on Instagram
          </Typography>
                <Typography variant="caption" color="text.secondary">
                  2 hours ago • 24 likes, 3 comments
            </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Brain size={20} color="#2e7d32" />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  AI Content Optimization completed
            </Typography>
                <Typography variant="caption" color="text.secondary">
                  4 hours ago • 15% engagement improvement
            </Typography>
          </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Calendar size={20} color="#ed6c02" />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  3 posts scheduled for tomorrow
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  6 hours ago • Instagram, Twitter, LinkedIn
                </Typography>
              </Box>
            </Box>
    </Box>
        </CardContent>
      </Card>

      {/* Bottom Spacer */}
      <Box sx={{ height: { xs: '120px', sm: '60px' } }} />
    </Container>
  );
} 