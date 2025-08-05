'use client';

import Link from "next/link";
import { FEATURES, HOW_IT_WORKS, TESTIMONIALS } from "@/data/landing";
import { FeatureCard } from "@/components/FeatureCard";
import { TestimonialCard } from "@/components/TestimonialCard";
import { useIsDarkMode } from "@/hooks/useIsDarkMode";
import { ThemeToggle } from "@/components/theme-toggle";
import { Footer } from "@/components/Footer";
import { 
  Button, 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader,
  AppBar,
  Toolbar,
  Chip
} from '@mui/material';


const PLANS = [
  {
    name: "Free",
    price: "$0/month",
    features: ["1 social account", "Basic analytics", "Community access"],
    cta: "Get Started",
    href: "/auth",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$12/month",
    features: ["5 social accounts", "Advanced analytics", "Monetization dashboard", "Priority support"],
    cta: "Start Free Trial",
    href: "/auth",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Contact us",
    features: ["Unlimited accounts", "Custom integrations", "Dedicated manager"],
    cta: "Contact Sales",
    href: "/contact",
    highlight: false,
  },
];

export default function Home() {
  const isDark = useIsDarkMode();
  
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', overflowX: 'hidden' }}>
      {/* Header with Logo and Theme Toggle */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          zIndex: 40
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', height: 64 }}>
            {/* Logo and Brand */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 44, minHeight: 44, textDecoration: 'none' }}>
                <Typography variant="h5" component="span" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                  CreatorFlow
                </Typography>
              </Link>
            </Box>

            {/* Right side actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Theme Toggle */}
              <Box sx={{ minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ThemeToggle isLandingPage={true} />
              </Box>
              
              {/* Sign In Link */}
              <Button
                component={Link}
                href="/auth"
                variant="text"
                sx={{
                  color: 'text.primary',
                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: 'action.hover'
                  },
                  minWidth: 44,
                  minHeight: 44,
                  borderRadius: 1
                }}
              >
                Sign In
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <Box
        component="header"
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 2, sm: 3 },
          py: { xs: 6, sm: 8 },
          borderBottom: 1,
          borderColor: 'divider',
          textAlign: 'center',
          gap: { xs: 2, sm: 3 }
        }}
      >
        <Typography 
          variant="h2" 
          component="h1"
          sx={{
            fontSize: { xs: '2rem', sm: '2.5rem', lg: '3rem' },
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color: 'text.primary',
            maxWidth: 'lg',
            mb: 2
          }}
        >
          Empower Your Content.{' '}
          <Box component="span" sx={{ color: 'primary.main' }}>
            Grow Your Audience.
          </Box>{' '}
          Monetize Your Passion.
        </Typography>
        
        <Typography 
          variant="body1"
          sx={{
            fontSize: { xs: '1rem', sm: '1.125rem' },
            color: 'text.secondary',
            maxWidth: 'md',
            mx: 'auto',
            mb: 3
          }}
        >
          The all-in-one platform for creators to plan, publish, analyze, and get paid—everywhere.
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          gap: { xs: 1.5, sm: 2 },
          justifyContent: 'center',
          width: { xs: '100%', sm: 'auto' }
        }}>
          <Button
            component={Link}
            href="/auth"
            variant="contained"
            size="large"
            sx={{
              background: 'linear-gradient(45deg, #3B82F6 30%, #8B5CF6 90%)',
              color: 'white',
              fontWeight: 600,
              borderRadius: 2,
              px: { xs: 3, sm: 4 },
              py: { xs: 1, sm: 1.5 },
              fontSize: { xs: '0.875rem', sm: '1rem' },
              width: { xs: '100%', sm: 'auto' },
              '&:hover': {
                background: 'linear-gradient(45deg, #2563EB 30%, #7C3AED 90%)'
              }
            }}
          >
            Start Free
          </Button>
          
          <Button
            component={Link}
            href="#how-it-works"
            variant="outlined"
            size="large"
            sx={{
              fontWeight: 600,
              borderRadius: 2,
              px: { xs: 3, sm: 4 },
              py: { xs: 1, sm: 1.5 },
              fontSize: { xs: '0.875rem', sm: '1rem' },
              width: { xs: '100%', sm: 'auto' },
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(45deg, #3B82F6 30%, #8B5CF6 90%)',
                borderRadius: 2,
                zIndex: 0
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 2,
                left: 2,
                right: 2,
                bottom: 2,
                background: isDark ? 'black' : 'white',
                borderRadius: 1.5,
                zIndex: 1
              },
              '& .MuiButton-label': {
                position: 'relative',
                zIndex: 2,
                color: isDark ? 'white' : 'black'
              }
            }}
          >
            See CreatorFlow in Action
          </Button>
        </Box>
      </Box>

      {/* Feature Highlights */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 8 } }} id="features">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(5, 1fr)' }, gap: { xs: 2, sm: 3 } }}>
          {FEATURES.map((feature) => (
            <Box key={feature.title}>
              <FeatureCard {...feature} plan={feature.plan} />
            </Box>
          ))}
        </Box>
      </Container>

      {/* Plans Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 8 } }} id="plans">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h2" sx={{ mb: 2, fontSize: { xs: '1.875rem', sm: '2.25rem' }, fontWeight: 'bold' }}>
            Choose Your Plan
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary' }}>
            Start free, upgrade when you're ready
          </Typography>
        </Box>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
          {PLANS.map((plan) => (
            <Box key={plan.name}>
              <Card
                sx={{
                  position: 'relative',
                  transform: plan.highlight ? 'scale(1.05)' : 'none',
                  transition: 'transform 0.2s ease-in-out',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {plan.highlight && (
                  <Chip
                    label="Most Popular"
                    sx={{
                      position: 'absolute',
                      top: -12,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'linear-gradient(45deg, #3B82F6 30%, #8B5CF6 90%)',
                      color: 'white',
                      fontWeight: 600,
                      zIndex: 1
                    }}
                  />
                )}
                
                <CardHeader
                  title={plan.name}
                  titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                  sx={{ pb: 1 }}
                />
                
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 2 }}>
                    {plan.price}
                  </Typography>
                  
                  <Box component="ul" sx={{ mb: 3, pl: 0, listStyle: 'none' }}>
                    {plan.features.map((feature, i) => (
                      <Box component="li" key={i} sx={{ 
                        fontSize: '0.875rem', 
                        color: 'text.primary',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 1
                      }}>
                        {feature}
                      </Box>
                    ))}
                  </Box>
                  
                  <Button
                    component={Link}
                    href={plan.href}
                    variant={plan.cta === "Start Free Trial" ? "contained" : "outlined"}
                    fullWidth
                    sx={{
                      mt: 'auto',
                      background: plan.cta === "Start Free Trial" 
                        ? 'linear-gradient(45deg, #3B82F6 30%, #8B5CF6 90%)'
                        : 'transparent',
                      '&:hover': {
                        background: plan.cta === "Start Free Trial"
                          ? 'linear-gradient(45deg, #2563EB 30%, #7C3AED 90%)'
                          : undefined
                      }
                    }}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>

      {/* How It Works */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 8 } }} id="how-it-works">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h2" sx={{ mb: 2, fontSize: { xs: '1.875rem', sm: '2.25rem' }, fontWeight: 'bold' }}>
            How It Works
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary' }}>
            Get started in minutes
          </Typography>
        </Box>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(5, 1fr)' }, gap: 3 }}>
          {HOW_IT_WORKS.map((step, index) => (
            <Box key={index}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    fontWeight: 'bold'
                  }}
                >
                  {index + 1}
                </Box>
                <Typography variant="body2">{step}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>

      {/* Testimonials */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 8 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h2" sx={{ mb: 2, fontSize: { xs: '1.875rem', sm: '2.25rem' }, fontWeight: 'bold' }}>
            What Creators Say
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary' }}>
            Join thousands of successful creators
          </Typography>
        </Box>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          {TESTIMONIALS.map((testimonial) => (
            <Box key={testimonial.author}>
              <TestimonialCard {...testimonial} />
            </Box>
          ))}
        </Box>
      </Container>

      {/* Trust & Transparency */}
      <Container maxWidth="md" sx={{ py: { xs: 6, sm: 8 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
            Trust & Transparency
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary' }}>
            No hidden fees. Your data, your way. <br />
            Built by creators, for creators.
          </Typography>
        </Box>
      </Container>

      <Footer />
    </Box>
  );
}
