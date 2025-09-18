'use client';

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FEATURES, HOW_IT_WORKS, TESTIMONIALS } from "@/data/landing";
import { FeatureCard } from "@/components/FeatureCard";
import { TestimonialCard } from "@/components/TestimonialCard";
import MobileFeatureShowcase from "@/components/MobileFeatureShowcase";
import MobileProcessFlow from "@/components/MobileProcessFlow";
import InteractiveMobileDemo from "@/components/InteractiveMobileDemo";
import MobileAnimations from "@/components/MobileAnimations";
import PWAFeatures from "@/components/PWAFeatures";
import { useMinimalTheme } from "@/contexts/MinimalThemeContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
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
  Chip,
  Fade,
  Slide,
  Zoom
} from '@mui/material';
import { 
  Search, 
  Link as LinkIcon, 
  Create, 
  Schedule, 
  MonetizationOn 
} from '@mui/icons-material';

const PLANS = [
  {
    name: "Free",
    price: "$0/month",
    features: [
      "1 social account", 
      "Basic analytics", 
      "Community access",
      "2 free Academy courses",
      "Basic template marketplace access"
    ],
    cta: "Get Started",
    href: "/auth",
    highlight: false,
  },
  {
    name: "Creator",
    price: "$19/month",
    features: [
      "3 social accounts", 
      "Advanced analytics", 
      "Basic scheduling",
      "5 Academy courses included",
      "Full template marketplace access",
      "Email support"
    ],
    cta: "Start Free Trial",
    href: "/auth",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$49/month",
    features: [
      "All social accounts", 
      "Advanced analytics & insights", 
      "Advanced scheduling",
      "All Academy courses included",
      "Premium template marketplace",
      "Early access to new courses",
      "Priority support"
    ],
    cta: "Start Free Trial",
    href: "/auth",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "$199/month",
    features: [
      "Unlimited everything", 
      "White-label options", 
      "Custom integrations",
      "All Academy courses + custom training",
      "Enterprise template marketplace",
      "Dedicated support",
      "SLA guarantees"
    ],
    cta: "Contact Sales",
    href: "/contact",
    highlight: false,
  },
];

export default function ThemeAwareContent() {
  const { isDark } = useMinimalTheme();
  const headerRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const headerTop = headerRef.current.offsetTop;
        const scrollTop = window.scrollY;
        setIsSticky(scrollTop > headerTop);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: 'background.default', 
      overflowX: 'hidden'
    }}>
      {/* Header with Logo and Theme Toggle */}
      <Box
        ref={headerRef}
        sx={{
          position: isSticky ? 'fixed' : 'static',
          top: isSticky ? 0 : 'auto',
          left: 0,
          right: 0,
          zIndex: isSticky ? 1000 : 'auto',
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          backdropFilter: isSticky ? 'blur(8px)' : 'none',
          backgroundColor: isSticky ? (theme) => 
            theme.palette.mode === 'dark' 
              ? 'rgba(18, 18, 18, 0.8)' 
              : 'rgba(255, 255, 255, 0.8)' : 'background.paper',
          transition: 'all 0.3s ease',
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
                <ThemeToggle />
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
      </Box>

      {/* Spacer to prevent content jump when header becomes sticky */}
      {isSticky && <Box sx={{ height: 64 }} />}

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
          py: { xs: 8, sm: 10 }, // Increased top padding for mobile
          mt: { xs: 2, sm: 0 }, // Added top margin for mobile
          borderBottom: 1,
          borderColor: 'divider',
          textAlign: 'center',
          gap: { xs: 2, sm: 3 }
        }}
      >
        <Typography 
          variant="h1"
          component="h1"
          sx={{
            fontSize: { xs: '2.5rem', sm: '3.5rem', lg: '4.5rem' },
            fontWeight: 900,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            color: 'text.primary',
            maxWidth: 'lg',
            mb: 3
          }}
        >
          The Creator Economy's{' '}
          <Box component="span" sx={{ 
            color: 'primary.main',
            background: 'linear-gradient(45deg, #3B82F6 30%, #8B5CF6 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            All-in-One Platform
          </Box>
        </Typography>
        
        <Typography 
          variant="h5"
          sx={{
            fontSize: { xs: '1.125rem', sm: '1.25rem', lg: '1.5rem' },
            color: 'text.secondary',
            maxWidth: 'lg',
            mx: 'auto',
            mb: 4,
            fontWeight: 400,
            lineHeight: 1.6
          }}
        >
          Plan, publish, analyze, and monetize your content across all platforms. 
          <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>
            Join 50,000+ creators
          </Box>{' '}
          who are already growing their audience and revenue with CreatorFlow.
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
              fontWeight: 700,
              borderRadius: 3,
              px: { xs: 4, sm: 6 },
              py: { xs: 1.5, sm: 2 },
              fontSize: { xs: '1rem', sm: '1.125rem' },
              width: { xs: '100%', sm: 'auto' },
              minHeight: 56,
              boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(45deg, #2563EB 30%, #7C3AED 90%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 40px rgba(59, 130, 246, 0.4)'
              },
              '&:active': {
                transform: 'translateY(0)'
              }
            }}
          >
            🚀 Start Free Trial
          </Button>
          
          <Button
            component={Link}
            href="#how-it-works"
            variant="outlined"
            size="large"
            sx={{
              fontWeight: 600,
              borderRadius: 3,
              px: { xs: 4, sm: 6 },
              py: { xs: 1.5, sm: 2 },
              fontSize: { xs: '1rem', sm: '1.125rem' },
              width: { xs: '100%', sm: 'auto' },
              minHeight: 56,
              borderColor: 'primary.main',
              color: 'primary.main',
              borderWidth: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'primary.dark',
                color: 'primary.dark',
                bgcolor: 'primary.50',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(59, 130, 246, 0.2)'
              },
              '&:active': {
                transform: 'translateY(0)'
              }
            }}
          >
            📱 See CreatorFlow in Action
          </Button>
        </Box>
      </Box>

      {/* Feature Highlights */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 8 } }} id="features">
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: 'repeat(2, 1fr)', 
            sm: 'repeat(3, 1fr)', 
            lg: 'repeat(5, 1fr)' 
          }, 
          gap: { xs: 2, sm: 3 } 
        }}>
          {FEATURES.map((feature, index) => (
            <Fade in={true} timeout={600 + index * 100} key={feature.title}>
              <Box>
                <FeatureCard {...feature} plan={feature.plan} />
              </Box>
            </Fade>
          ))}
        </Box>
      </Container>

      {/* Modern How It Works - Single Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 8 } }} id="how-it-works">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            sx={{ 
              mb: 2, 
              fontSize: { xs: '1.875rem', sm: '2.25rem' }, 
              fontWeight: 'bold',
              color: 'text.primary'
            }}
          >
            How It Works
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4 }}>
            From discovery to monetization in 5 simple steps
          </Typography>
          
             {/* Social Proof Text */}
             <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap', mb: 4 }}>
               <Box sx={{ textAlign: 'center' }}>
                 <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>Growing Community</Typography>
                 <Typography variant="body2" color="text.secondary">New creators joining daily</Typography>
               </Box>
               <Box sx={{ textAlign: 'center' }}>
                 <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>Fresh Content</Typography>
                 <Typography variant="body2" color="text.secondary">Published every day</Typography>
               </Box>
               <Box sx={{ textAlign: 'center' }}>
                 <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>Reliable Platform</Typography>
                 <Typography variant="body2" color="text.secondary">Always available when you need it</Typography>
               </Box>
             </Box>
        </Box>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: 'repeat(2, 1fr)', 
            sm: 'repeat(3, 1fr)', 
            md: 'repeat(5, 1fr)' 
          }, 
          gap: { xs: 2, sm: 3 } 
        }}>
          {[
            {
              step: 1,
              title: 'Discover',
              description: 'Explore our mobile-first platform',
              icon: Search,
              features: ['Mobile-optimized', 'Intuitive design', 'Fast loading']
            },
            {
              step: 2,
              title: 'Connect',
              description: 'Link your social accounts',
              icon: LinkIcon,
              features: ['One-tap setup', 'Secure auth', 'Multi-platform']
            },
            {
              step: 3,
              title: 'Create',
              description: 'Use AI-powered content tools',
              icon: Create,
              features: ['AI generation', 'Templates', 'Brand consistency']
            },
            {
              step: 4,
              title: 'Schedule',
              description: 'Plan and automate posts',
              icon: Schedule,
              features: ['Smart timing', 'Cross-platform', 'Analytics']
            },
            {
              step: 5,
              title: 'Monetize',
              description: 'Unlock revenue streams',
              icon: MonetizationOn,
              features: ['Revenue tracking', 'Growth insights', 'Monetization tools']
            }
          ].map((item) => {
            const IconComponent = item.icon;
            return (
            <Card 
              key={item.step} 
              sx={{ 
                textAlign: 'center', 
                p: { xs: 2, sm: 2.5, md: 3 }, 
                height: '100%',
                minHeight: { xs: 140, sm: 160, md: 180 },
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '1px solid transparent',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                  border: '2px solid',
                  borderColor: 'primary.main'
                }
              }}
            >
              <Box sx={{ 
                width: { xs: 40, sm: 50, md: 60 }, 
                height: { xs: 40, sm: 50, md: 60 }, 
                borderRadius: '50%', 
                bgcolor: 'transparent', 
                color: 'text.primary', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                mx: 'auto', 
                mb: { xs: 1, sm: 1.5, md: 2 },
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                  color: 'primary.main'
                }
              }}>
                <IconComponent sx={{ fontSize: { xs: 20, sm: 24, md: 32 } }} />
              </Box>
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold', 
                  mb: { xs: 0.5, sm: 1 },
                  fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' }
                }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ 
                  mb: { xs: 1, sm: 1.5, md: 2 },
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  lineHeight: 1.3
                }}>
                  {item.description}
                </Typography>
              </Box>
              <Box sx={{ 
                display: { xs: 'none', sm: 'flex' }, 
                flexWrap: 'wrap', 
                gap: 0.5, 
                justifyContent: 'center',
                mt: 'auto'
              }}>
                {item.features.map((feature, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      px: 1,
                      py: 0.5,
                      bgcolor: 'action.hover',
                      color: 'text.secondary',
                      borderRadius: 1,
                      fontSize: { xs: '0.625rem', sm: '0.75rem' },
                      fontWeight: 500
                    }}
                  >
                    {feature}
                  </Box>
                ))}
              </Box>
            </Card>
            );
          })}
        </Box>
      </Container>

      {/* Customer Logos */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6 } }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Trusted by creators at these amazing companies
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: 4, 
            flexWrap: 'wrap',
            opacity: 0.7
          }}>
            {['Instagram', 'TikTok', 'YouTube', 'Twitter', 'LinkedIn', 'Pinterest'].map((platform) => (
              <Box
                key={platform}
                sx={{
                  px: 3,
                  py: 1,
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  border: 1,
                  borderColor: 'divider',
                  fontWeight: 600,
                  color: 'text.secondary',
                  fontSize: '0.875rem'
                }}
              >
                {platform}
              </Box>
            ))}
          </Box>
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

      {/* Plans Section - Moved above footer */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 8 } }} id="plans">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            sx={{ 
              mb: 2, 
              fontSize: { xs: '1.875rem', sm: '2.25rem' }, 
              fontWeight: 'bold',
              color: 'text.primary'
            }}
          >
            Choose Your Plan
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4 }}>
            Start free, upgrade when you&apos;re ready
          </Typography>
          
          {/* Trust Badges */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap', mb: 4 }}>
            <Chip label="✓ 14-day free trial" color="success" variant="outlined" />
            <Chip label="✓ No credit card required" color="success" variant="outlined" />
            <Chip label="✓ Cancel anytime" color="success" variant="outlined" />
          </Box>
        </Box>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
          {PLANS.map((plan, index) => (
            <Fade in={true} timeout={800 + index * 200} key={plan.name}>
              <Box>
                <Card
                  sx={{
                    position: 'relative',
                    transform: plan.highlight ? 'scale(1.05)' : 'none',
                    transition: 'all 0.3s ease',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 450,
                    overflow: 'visible',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: plan.highlight ? 'scale(1.08)' : 'scale(1.02)',
                      boxShadow: 8,
                      '& .pricing-cta': {
                        transform: 'scale(1.05)'
                      }
                    }
                  }}
                >
                <CardHeader
                  title={plan.name}
                  titleTypographyProps={{ 
                    variant: 'h5', 
                    fontWeight: 'bold',
                    sx: { fontSize: { xs: '1.25rem', sm: '1.5rem' } }
                  }}
                  sx={{ pb: 2, pt: 2 }}
                  action={
                    plan.highlight && (
                      <Chip
                        label="Most Popular"
                        size="small"
                        sx={{
                          background: 'linear-gradient(45deg, #3B82F6 30%, #8B5CF6 90%)',
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          height: 24
                        }}
                      />
                    )
                  }
                />
                
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', pt: 0 }}>
                  <Typography 
                    variant="h4" 
                    component="div" 
                    sx={{ 
                      fontWeight: 'bold', 
                      mb: 2,
                      fontSize: { xs: '1.75rem', sm: '2rem' }
                    }}
                  >
                    {plan.price}
                  </Typography>
                  
                  <Box component="ul" sx={{ mb: 3, pl: 0, listStyle: 'none', flexGrow: 1 }}>
                    {plan.features.map((feature, i) => (
                      <Box component="li" key={i} sx={{ 
                        fontSize: '0.875rem', 
                        color: 'text.primary',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 1,
                        lineHeight: 1.4
                      }}>
                        <Box 
                          component="span" 
                          sx={{ 
                            color: 'success.main',
                            fontSize: '1.25rem',
                            lineHeight: 1
                          }}
                        >
                          ✓
                        </Box>
                        {feature}
                      </Box>
                    ))}
                  </Box>
                  
                  <Button
                    component={Link}
                    href={plan.href}
                    variant={plan.cta === "Start Free Trial" ? "contained" : "outlined"}
                    fullWidth
                    size="large"
                    className="pricing-cta"
                    sx={{
                      mt: 'auto',
                      background: plan.cta === "Start Free Trial" 
                        ? 'linear-gradient(45deg, #3B82F6 30%, #8B5CF6 90%)'
                        : 'transparent',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: plan.cta === "Start Free Trial"
                          ? 'linear-gradient(45deg, #2563EB 30%, #7C3AED 90%)'
                          : undefined,
                        transform: 'translateY(-2px)',
                        boxShadow: plan.cta === "Start Free Trial" 
                          ? '0 8px 25px rgba(59, 130, 246, 0.3)'
                          : '0 4px 15px rgba(0,0,0,0.1)'
                      },
                      height: 48,
                      fontWeight: 600
                    }}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
              </Box>
            </Fade>
          ))}
        </Box>
      </Container>

      <Footer />
    </Box>
  );
}
