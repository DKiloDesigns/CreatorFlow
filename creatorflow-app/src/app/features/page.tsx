'use client';

import { Box, Typography, Container, Paper, Grid, Button, Chip, Card, CardContent, IconButton } from '@mui/material';
import { PublicPageLayout } from '@/components/layout/PublicPageLayout';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PsychologyIcon from '@mui/icons-material/Psychology';
import BarChartIcon from '@mui/icons-material/BarChart';
import ShareIcon from '@mui/icons-material/Share';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import { useTheme } from '@mui/material/styles';

// Import Phase 2 components
import AIContentIntelligence from '@/components/ui/ai-content-intelligence';
import RealTimeAnalytics from '@/components/ui/real-time-analytics';
import MultiPlatformPublisher from '@/components/ui/multi-platform-publisher';

export default function FeaturesPage() {
  const router = useRouter();
  const theme = useTheme();
  
  const features = [
    {
      name: 'AI Content Intelligence',
      description: 'Advanced AI-powered content analysis, competitor intelligence, and trend prediction',
      icon: <PsychologyIcon sx={{ fontSize: 48 }} />,
      color: 'primary',
      route: '/dashboard/phase2-hub'
    },
    {
      name: 'Real-Time Analytics',
      description: 'Live performance tracking, A/B testing, and ROI optimization with real-time data',
      icon: <BarChartIcon sx={{ fontSize: 48 }} />,
      color: 'success',
      route: '/dashboard/phase2-hub'
    },
    {
      name: 'Multi-Platform Publisher',
      description: 'Create once, publish everywhere with intelligent optimization and real publishing APIs',
      icon: <ShareIcon sx={{ fontSize: 48 }} />,
      color: 'warning',
      route: '/dashboard/phase2-hub'
    },
    {
      name: 'Smart Content Workflow',
      description: '5-step guided content creation process with AI-powered suggestions and optimization',
      icon: <TrackChangesIcon sx={{ fontSize: 48 }} />,
      color: 'info',
      route: '/dashboard/phase2-hub'
    }
  ];

  return (
    <PublicPageLayout>
      {/* Hero Section */}
      <Box component="section" sx={{
        py: { xs: 8, md: 12 }, // Match Privacy page hero padding
        px: { xs: 4, sm: 3, lg: 4 }, // Ensure consistent horizontal padding here as well
        // pb: { xs: 2, md: 4 }, // No longer needed as py handles both top and bottom
        minHeight: '172px', // Decreased height as requested
        // Removed display: 'flex' and alignItems: 'center' as py handles vertical spacing
        background: theme.palette.mode === 'light' 
          ? 'linear-gradient(to right, #dbeafe, #e9d5ff)' 
          : 'linear-gradient(to right, rgba(30, 58, 138, 0.2), rgba(147, 51, 234, 0.2))',
      }}>
        <Container maxWidth="lg" sx={{ px: { xs: 4, sm: 3, lg: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="back"
              onClick={() => router.back()}
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Typography variant="h2" component="h1" sx={{ 
                fontWeight: 'bold', 
                color: theme.palette.text.primary, 
                fontSize: { xs: '2.5rem', sm: '3rem', lg: '3.125rem' }
              }}>
                Features
              </Typography>
            </Box>
            <Box sx={{ width: 48, mr: 2 }} /> {/* Spacer to balance the IconButton */}
          </Box>
          <Typography variant="h5" sx={{ 
            color: theme.palette.text.secondary, 
            mb: 4,
            textAlign: 'center', // Center the tagline text
            // Removed dark mode explicit override as theme.palette.text.secondary should handle it
          }}>
            Discover the powerful tools that empower your content creation journey.
          </Typography>
        </Container>
      </Box>

      {/* Features Grid */}
      <Box component="section" sx={{ py: 8, px: { xs: 4, sm: 3, lg: 4 }, bgcolor: theme.palette.background.default, /* Removed dark mode explicit override */ }}>
        <Container maxWidth="lg">
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                  onClick={() => router.push(feature.route)}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      mb: 2,
                      color: theme.palette[feature.color as 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'].main
                    }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {feature.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {feature.description}
                    </Typography>
                    <Button 
                      variant="outlined" 
                      size="small"
                      color={feature.color as 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'}
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(feature.route);
                      }}
                    >
                      Explore
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Status Summary (Optional - can remove if not relevant for public features page) */}
      <Box component="section" sx={{ py: 8, px: { xs: 4, sm: 3, lg: 4 } }}>
        <Container maxWidth="lg">
          <Paper sx={{ p: 3, bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              📊 Implementation Status
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>4</Typography>
                  <Typography variant="body2">✅ Completed</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>0</Typography>
                  <Typography variant="body2">🔄 In Progress</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>0</Typography>
                  <Typography variant="body2">❌ Failed</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>100%</Typography>
                  <Typography variant="body2">Complete</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </PublicPageLayout>
  );
}
