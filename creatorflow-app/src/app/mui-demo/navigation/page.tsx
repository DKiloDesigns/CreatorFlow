'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import {
  Box,
  Container,
  Stack,
  Typography,
  Paper,
  Switch,
  FormControlLabel,
  Divider,
} from '@mui/material';
import { Grid } from '@mui/material';
import {
  MuiEnhancedNavigation,
  MuiBreadcrumbs,
  MuiStatsCard,
} from '@/components/ui/mui-components';
import {
  Users,
  TrendingUp,
  FileText,
  DollarSign,
  Eye,
  Heart,
  Share2,
  MessageCircle,
} from 'lucide-react';

export default function MuiNavigationDemo() {
  const { theme, setTheme } = useTheme();

  const statsData = [
    {
      title: 'Total Followers',
      value: '12.5K',
      description: 'Across all platforms',
      icon: Users,
      trend: { value: 12, isPositive: true, period: 'last month' },
      variant: 'success' as const,
    },
    {
      title: 'Engagement Rate',
      value: '8.2%',
      description: 'Average across posts',
      icon: TrendingUp,
      trend: { value: 5, isPositive: true, period: 'last week' },
      variant: 'success' as const,
    },
    {
      title: 'Posts This Month',
      value: '24',
      description: 'Content published',
      icon: FileText,
      trend: { value: 3, isPositive: false, period: 'last month' },
      variant: 'warning' as const,
    },
    {
      title: 'Revenue',
      value: '$2,450',
      description: 'This month',
      icon: DollarSign,
      trend: { value: 18, isPositive: true, period: 'last month' },
      variant: 'success' as const,
    },
    {
      title: 'Reach',
      value: '45.2K',
      description: 'Total impressions',
      icon: Eye,
      trend: { value: 22, isPositive: true, period: 'last week' },
      variant: 'success' as const,
    },
    {
      title: 'Likes',
      value: '3,240',
      description: 'Total likes received',
      icon: Heart,
      trend: { value: 8, isPositive: true, period: 'last week' },
      variant: 'success' as const,
    },
    {
      title: 'Shares',
      value: '156',
      description: 'Content shared',
      icon: Share2,
      trend: { value: 15, isPositive: true, period: 'last week' },
      variant: 'success' as const,
    },
    {
      title: 'Comments',
      value: '89',
      description: 'Total comments',
      icon: MessageCircle,
      trend: { value: 2, isPositive: false, period: 'last week' },
      variant: 'danger' as const,
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Mock AppBar */}
      <Paper 
        elevation={1}
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          backgroundColor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1 }}>
            <Typography variant="h6" fontWeight={600}>
              CreatorFlow
            </Typography>
            
            <MuiEnhancedNavigation />
            
            <FormControlLabel
              control={
                <Switch
                  checked={theme === 'dark'}
                  onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                />
              }
              label="Dark Mode"
            />
          </Box>
        </Container>
      </Paper>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <MuiBreadcrumbs />
        
        <Typography variant="h4" gutterBottom>
          MUI Navigation & Stats Demo
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Showcasing the MUI-enhanced navigation and stats card components with real data.
        </Typography>

        <Divider sx={{ mb: 4 }} />

        {/* Stats Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
          {statsData.map((stat, index) => (
            <Box key={index}>
              <MuiStatsCard
                title={stat.title}
                value={stat.value}
                description={stat.description}
                icon={stat.icon}
                trend={stat.trend}
                variant={stat.variant}
                onClick={() => console.log(`Clicked ${stat.title}`)}
              />
            </Box>
          ))}
        </Box>

        {/* Additional Demo Content */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom>
            Navigation Features
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Desktop Navigation
              </Typography>
              <Typography variant="body2" color="text.secondary">
                The navigation bar above demonstrates:
              </Typography>
              <Stack spacing={1} sx={{ mt: 2 }}>
                <Typography variant="body2">• Responsive design with mobile drawer</Typography>
                <Typography variant="body2">• Active state highlighting</Typography>
                <Typography variant="body2">• User menu with notifications</Typography>
                <Typography variant="body2">• Theme switching integration</Typography>
              </Stack>
            </Paper>
            
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Stats Cards
              </Typography>
              <Typography variant="body2" color="text.secondary">
                The stats cards above showcase:
              </Typography>
              <Stack spacing={1} sx={{ mt: 2 }}>
                <Typography variant="body2">• Multiple variants (success, warning, danger)</Typography>
                <Typography variant="body2">• Trend indicators with icons</Typography>
                <Typography variant="body2">• Loading states with skeletons</Typography>
                <Typography variant="body2">• Hover effects and interactions</Typography>
              </Stack>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
{/* Bottom Spacer to Clear Bottom Navigation */}
      <Box sx={{
        height: { xs: '120px', sm: '40px' },
        width: '100%'
      }} />
} 