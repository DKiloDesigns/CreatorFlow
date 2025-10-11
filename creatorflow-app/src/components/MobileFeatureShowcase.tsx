'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Fade,
  Zoom,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { 
  Smartphone as SmartphoneIcon,
  CameraAlt as CameraAltIcon,
  BarChart as BarChartIcon,
  Group as GroupIcon,
  Bolt as BoltIcon,
  CalendarToday as CalendarTodayIcon,
  ArrowForward as ArrowForwardIcon,
  PlayArrow as PlayArrowIcon,
  AttachMoney as AttachMoneyIcon
} from '@mui/icons-material';

interface MobileFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  screenshot: string;
  highlight: string;
  cta: string;
}

const MOBILE_FEATURES: MobileFeature[] = [
  {
    id: 'landing',
    title: 'Mobile-First Landing',
    description: 'Experience CreatorFlow the way it was meant to be used - optimized for mobile creators who live on their phones.',
    icon: <SmartphoneIcon sx={{ fontSize: 24 }} />,
    screenshot: '/mobile-screenshots/optimized/landing-page.jpg',
    highlight: 'Mobile-optimized',
    cta: 'Explore Features'
  },
  {
    id: 'features',
    title: 'Feature Showcase',
    description: 'Discover all the powerful tools and features designed specifically for mobile content creators.',
    icon: <BoltIcon sx={{ fontSize: 24 }} />,
    screenshot: '/mobile-screenshots/optimized/features.jpg',
    highlight: 'All-in-one',
    cta: 'See All Features'
  },
  {
    id: 'pricing',
    title: 'Simple Pricing',
    description: 'Choose the perfect plan for your creator journey. Transparent pricing with no hidden fees.',
    icon: <AttachMoneyIcon sx={{ fontSize: 24 }} />,
    screenshot: '/mobile-screenshots/optimized/pricing.jpg',
    highlight: 'Transparent',
    cta: 'View Plans'
  },
  {
    id: 'auth',
    title: 'Easy Signup',
    description: 'Get started in seconds with our streamlined mobile signup process. No complicated forms.',
    icon: <GroupIcon sx={{ fontSize: 24 }} />,
    screenshot: '/mobile-screenshots/optimized/auth.jpg',
    highlight: 'Quick setup',
    cta: 'Get Started'
  }
];

export default function MobileFeatureShowcase() {
  const [activeFeature, setActiveFeature] = useState<string>('landing');
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const activeFeatureData = MOBILE_FEATURES.find(f => f.id === activeFeature) || MOBILE_FEATURES[0];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 8 } }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant="h3" 
          component="h2" 
          sx={{ 
            mb: 2, 
            fontSize: { xs: '1.875rem', sm: '2.25rem' }, 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2
          }}
        >
          <SmartphoneIcon sx={{ fontSize: 32 }} />
          How It Works on Mobile
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 3 }}>
          Experience CreatorFlow the way it was meant to be used
        </Typography>
        <Chip
          label="Mobile-First Design"
          sx={{
            background: 'linear-gradient(45deg, #3B82F6 30%, #8B5CF6 90%)',
            color: 'white',
            fontWeight: 600,
            px: 2,
            py: 1
          }}
        />
      </Box>

      <Grid container spacing={4} alignItems="center">
        {/* Mobile Screenshot */}
        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <Fade in={true} timeout={800}>
              <Card
                sx={{
                  maxWidth: 300,
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  border: '8px solid',
                  borderColor: 'grey.200',
                  position: 'relative',
                  transform: hoveredFeature ? 'scale(1.02)' : 'scale(1)',
                  transition: 'transform 0.3s ease-in-out'
                }}
              >
                <CardMedia
                  component="img"
                  image={activeFeatureData.screenshot}
                  alt={activeFeatureData.title}
                  sx={{
                    height: 600,
                    objectFit: 'cover',
                    position: 'relative',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.02)'
                    }
                  }}
                />
                
                {/* Play Button Overlay */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'rgba(0,0,0,0.7)',
                    borderRadius: '50%',
                    p: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'rgba(0,0,0,0.8)',
                      transform: 'translate(-50%, -50%) scale(1.1)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <PlayArrowIcon sx={{ fontSize: 24, color: 'white' }} />
                </Box>
              </Card>
            </Fade>
          </Box>
        </Grid>

        {/* Feature List */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {MOBILE_FEATURES.map((feature, index) => (
              <Zoom
                key={feature.id}
                in={true}
                timeout={600 + (index * 100)}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: activeFeature === feature.id ? 2 : 1,
                    borderColor: activeFeature === feature.id ? 'primary.main' : 'divider',
                    bgcolor: activeFeature === feature.id ? 'primary.50' : 'background.paper',
                    transform: hoveredFeature === feature.id ? 'translateX(8px)' : 'translateX(0)',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'primary.50',
                      transform: 'translateX(8px)'
                    }
                  }}
                  onMouseEnter={() => setHoveredFeature(feature.id)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  onClick={() => setActiveFeature(feature.id)}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Box sx={{ color: 'primary.main' }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {feature.title}
                      </Typography>
                      {activeFeature === feature.id && (
                        <Chip
                          label="Active"
                          size="small"
                          sx={{
                            bgcolor: 'primary.main',
                            color: 'white',
                            fontWeight: 600
                          }}
                        />
                      )}
                    </Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                      {feature.description}
                    </Typography>
                    <Button
                      variant="text"
                      endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                      sx={{
                        p: 0,
                        textTransform: 'none',
                        fontWeight: 600,
                        color: 'primary.main',
                        '&:hover': {
                          bgcolor: 'transparent',
                          color: 'primary.dark'
                        }
                      }}
                    >
                      {feature.cta}
                    </Button>
                  </CardContent>
                </Card>
              </Zoom>
            ))}
          </Box>
        </Grid>
      </Grid>

      {/* Mobile CTA Section */}
      <Box sx={{ textAlign: 'center', mt: 6 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
          Ready to Create on Mobile?
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', maxWidth: 'md', mx: 'auto' }}>
          Join thousands of creators who are already using CreatorFlow to grow their audience and monetize their content.
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            sx={{
              background: 'linear-gradient(45deg, #3B82F6 30%, #8B5CF6 90%)',
              color: 'white',
              fontWeight: 600,
              borderRadius: 2,
              px: 4,
              py: 1.5,
              fontSize: { xs: '1rem', sm: '1.1rem' },
              minHeight: 48,
              '&:hover': {
                background: 'linear-gradient(45deg, #2563EB 30%, #7C3AED 90%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Start Free Trial
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{
              fontWeight: 600,
              borderRadius: 2,
              px: 4,
              py: 1.5,
              fontSize: { xs: '1rem', sm: '1.1rem' },
              minHeight: 48,
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                borderColor: 'primary.dark',
                color: 'primary.dark',
                bgcolor: 'primary.50',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(59, 130, 246, 0.2)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Download Mobile App
          </Button>
        </Box>
        
        {/* Mobile App Store Badges */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3, flexWrap: 'wrap' }}>
          <Chip
            label="📱 iOS App Store"
            sx={{
              bgcolor: 'black',
              color: 'white',
              fontWeight: 600,
              px: 2,
              py: 1,
              '&:hover': { bgcolor: 'grey.800' }
            }}
          />
          <Chip
            label="🤖 Google Play"
            sx={{
              bgcolor: 'black',
              color: 'white',
              fontWeight: 600,
              px: 2,
              py: 1,
              '&:hover': { bgcolor: 'grey.800' }
            }}
          />
        </Box>
      </Box>
    </Container>
  );
}
