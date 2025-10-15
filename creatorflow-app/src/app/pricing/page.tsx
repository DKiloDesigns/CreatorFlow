'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { Box, Typography, Container, Grid, Card, CardContent, Button, IconButton } from '@mui/material';
import { PublicPageLayout } from '@/components/layout/PublicPageLayout';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTheme } from '@mui/material/styles';
import Link from 'next/link'; // Import Link
import { PLANS, WHITE_LABEL_PLANS } from '@/data/pricingPlans'; // Import centralized plans

export default function Pricing() {
  const router = useRouter();
  const theme = useTheme();
  return (
    <PublicPageLayout>
      <Box component="section" sx={{
        py: { xs: 8, md: 12 }, 
        px: { xs: 4, sm: 3, lg: 4 }, 
        background: theme.palette.mode === 'light' 
          ? 'linear-gradient(to right, #dbeafe, #e9d5ff)' 
          : 'linear-gradient(to right, rgba(30, 58, 138, 0.2), rgba(147, 51, 234, 0.2))', 
      }}>
        <Container maxWidth="lg">
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
              <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', color: theme.palette.text.primary, mb: 4 }}>
                Our Plans
              </Typography>
            </Box>
            <Box sx={{ width: 48, mr: 2 }} /> {/* Spacer to balance the IconButton */}
          </Box>
        </Container>
      </Box>

      {/* Pricing Plans Section (separated from hero) */}
      <Box component="section" sx={{ py: 8, px: { xs: 4, sm: 3, lg: 4 }, mt: { xs: 4, md: 8 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center" sx={{ mt: '1px' }}> {/* Adjusted margin-top for consistency */}
            {PLANS.map((plan, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card 
                  sx={{
                    p: 3, 
                    textAlign: 'center', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    height: '100%',
                    border: plan.highlight ? '2px solid' : '1px solid',
                    borderColor: plan.highlight ? 'primary.main' : 'divider',
                    transform: plan.highlight ? { md: 'scale(1.05)' } : 'none', // Highlight effect
                    zIndex: plan.highlight ? 1 : 'auto',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: plan.highlight ? { md: 'scale(1.07)' } : 'scale(1.02)',
                      boxShadow: 6,
                      borderColor: 'primary.dark'
                    }
                  }}
                >
                  <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 1.5, color: 'text.primary' }}>{plan.name}</Typography>
                  <Typography variant="h4" sx={{ mb: 2, color: 'text.secondary' }}>{plan.price}</Typography>
                  <Box component="ul" sx={{ mb: 3, textAlign: 'left', pl: 2, flexGrow: 1, color: 'text.secondary' }}>
                    {plan.features.map((feature, idx) => (
                      <Typography component="li" variant="body1" sx={{ mb: 1 }} key={idx}>✓ {feature}</Typography>
                    ))}
                  </Box>
                  <Button 
                    component={Link}
                    href={plan.href}
                    variant={plan.highlight ? "contained" : "outlined"}
                    fullWidth 
                    sx={{ mt: 'auto', bgcolor: plan.highlight ? 'primary.main' : undefined, '&:hover': { bgcolor: plan.highlight ? 'primary.dark' : undefined } }}
                  >
                    {plan.cta}
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* White-Label Plans Section */}
      <Box component="section" sx={{ py: 8, px: { xs: 4, sm: 3, lg: 4 }, bgcolor: theme.palette.background.default }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h4" component="h2" sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}>
              White-Label Solutions
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              Rebrand floai.studio as your own platform
            </Typography>
          </Box>
          <Grid container spacing={4} justifyContent="center">
            {WHITE_LABEL_PLANS.map((plan, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    border: plan.highlight ? '2px solid' : '1px solid',
                    borderColor: plan.highlight ? 'primary.main' : 'divider',
                    transform: plan.highlight ? { md: 'scale(1.05)' } : 'none',
                    zIndex: plan.highlight ? 1 : 'auto',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: plan.highlight ? { md: 'scale(1.07)' } : 'scale(1.02)',
                      boxShadow: 6,
                      borderColor: 'primary.dark'
                    }
                  }}
                >
                  <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 1.5, color: 'text.primary' }}>{plan.name}</Typography>
                  <Typography variant="h4" sx={{ mb: 2, color: 'text.secondary' }}>{plan.price}</Typography>
                  <Box component="ul" sx={{ mb: 3, textAlign: 'left', pl: 2, flexGrow: 1, color: 'text.secondary' }}>
                    {plan.features.map((feature, idx) => (
                      <Typography component="li" variant="body1" sx={{ mb: 1 }} key={idx}>✓ {feature}</Typography>
                    ))}
                  </Box>
                  <Button
                    component={Link}
                    href={plan.href}
                    variant={plan.highlight ? "contained" : "outlined"}
                    fullWidth
                    sx={{ mt: 'auto', bgcolor: plan.highlight ? 'primary.main' : undefined, '&:hover': { bgcolor: plan.highlight ? 'primary.dark' : undefined } }}
                  >
                    {plan.cta}
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </PublicPageLayout>
  );
} 