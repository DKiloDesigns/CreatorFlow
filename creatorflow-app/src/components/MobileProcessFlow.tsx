'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Card,
  CardContent,
  CardMedia,
  Button,
  Grid,
  useTheme,
  useMediaQuery,
  Chip,
  Fade,
  Slide
} from '@mui/material';
import { 
  Download as DownloadIcon,
  Smartphone as SmartphoneIcon,
  CameraAlt as CameraAltIcon,
  CalendarToday as CalendarTodayIcon,
  BarChart as BarChartIcon,
  AttachMoney as AttachMoneyIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  Bolt as BoltIcon,
  Group as GroupIcon
} from '@mui/icons-material';

interface ProcessStep {
  id: string;
  title: string;
  description: string;
  mobileDescription: string;
  icon: React.ReactNode;
  screenshot: string;
  features: string[];
  cta: string;
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    id: 'landing',
    title: 'Discover floai.studio',
    description: 'Explore our mobile-first platform',
    mobileDescription: 'Beautiful, responsive design optimized for mobile creators',
    icon: <SmartphoneIcon size={24} />,
    screenshot: '/mobile-screenshots/optimized/landing-page.jpg',
    features: [
      'Mobile-optimized interface',
      'Intuitive navigation',
      'Fast loading'
    ],
    cta: 'Explore Now'
  },
  {
    id: 'features',
    title: 'Explore Features',
    description: 'See all the tools available',
    mobileDescription: 'Comprehensive feature showcase designed for mobile',
    icon: <BoltIcon size={24} />,
    screenshot: '/mobile-screenshots/optimized/features.jpg',
    features: [
      'Content creation tools',
      'Analytics dashboard',
      'Community features',
      'Monetization tools'
    ],
    cta: 'View Features'
  },
  {
    id: 'pricing',
    title: 'Choose Your Plan',
    description: 'Select the perfect plan for you',
    mobileDescription: 'Transparent pricing with mobile-optimized plans',
    icon: <AttachMoneyIcon size={24} />,
    screenshot: '/mobile-screenshots/optimized/pricing.jpg',
    features: [
      'Free tier available',
      'Pro features',
      'Enterprise options',
      'No hidden fees'
    ],
    cta: 'View Plans'
  },
  {
    id: 'auth',
    title: 'Get Started',
    description: 'Sign up and start creating',
    mobileDescription: 'Quick and easy mobile signup process',
    icon: <GroupIcon size={24} />,
    screenshot: '/mobile-screenshots/optimized/auth.jpg',
    features: [
      'Quick signup',
      'Social login',
      'Mobile verification',
      'Instant access'
    ],
    cta: 'Sign Up Now'
  }
];

export default function MobileProcessFlow() {
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepClick = (step: number) => {
    setActiveStep(step);
  };

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
          <SmartphoneIcon size={32} />
          Your Mobile Creator Journey
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
          From download to monetization - all on your mobile device
        </Typography>
      </Box>

      <Grid container spacing={4}>
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
                  position: 'relative'
                }}
              >
                <CardMedia
                  component="img"
                  image={PROCESS_STEPS[activeStep].screenshot}
                  alt={PROCESS_STEPS[activeStep].title}
                  sx={{
                    height: 600,
                    objectFit: 'cover'
                  }}
                />
              </Card>
            </Fade>
          </Box>
        </Grid>

        {/* Process Steps */}
        <Grid item xs={12} md={6}>
          <Box sx={{ maxWidth: 600 }}>
            {PROCESS_STEPS.map((step, index) => (
              <Slide
                key={step.id}
                direction="left"
                in={true}
                timeout={600 + (index * 100)}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <Card
                  sx={{
                    mb: 2,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: activeStep === index ? 2 : 1,
                    borderColor: activeStep === index ? 'primary.main' : 'divider',
                    bgcolor: activeStep === index ? 'primary.50' : 'background.paper',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'primary.50',
                      transform: 'translateX(8px)'
                    }
                  }}
                  onClick={() => handleStepClick(index)}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: activeStep === index ? 'primary.main' : 'grey.200',
                          color: activeStep === index ? 'white' : 'text.secondary',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold'
                        }}
                      >
                        {activeStep > index ? <CheckCircleIcon size={20} /> : index + 1}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {step.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {step.description}
                        </Typography>
                      </Box>
                      {activeStep === index && (
                        <Chip
                          label="Current Step"
                          size="small"
                          sx={{
                            bgcolor: 'primary.main',
                            color: 'white',
                            fontWeight: 600
                          }}
                        />
                      )}
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                      {step.features.map((feature, featureIndex) => (
                        <Chip
                          key={featureIndex}
                          label={feature}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontSize: '0.75rem',
                            borderColor: 'primary.main',
                            color: 'primary.main'
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Slide>
            ))}

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ textTransform: 'none' }}
              >
                Previous
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={activeStep === PROCESS_STEPS.length - 1}
                endIcon={<ArrowForwardIcon size={16} />}
                sx={{
                  background: 'linear-gradient(45deg, #3B82F6 30%, #8B5CF6 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #2563EB 30%, #7C3AED 90%)'
                  }
                }}
              >
                {activeStep === PROCESS_STEPS.length - 1 ? 'Get Started' : 'Next Step'}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Mobile CTA */}
      <Box sx={{ textAlign: 'center', mt: 6 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
          Ready to Start Your Mobile Creator Journey?
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
              '&:hover': {
                background: 'linear-gradient(45deg, #2563EB 30%, #7C3AED 90%)'
              }
            }}
          >
            Download Mobile App
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{
              fontWeight: 600,
              borderRadius: 2,
              px: 4,
              py: 1.5,
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                borderColor: 'primary.dark',
                color: 'primary.dark',
                bgcolor: 'primary.50'
              }
            }}
          >
            Start Free Trial
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
