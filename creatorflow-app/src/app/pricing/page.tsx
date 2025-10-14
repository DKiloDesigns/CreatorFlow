'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { Box, Typography, Container, Grid, Card, CardContent, Button, IconButton } from '@mui/material';
import { PublicPageLayout } from '@/components/layout/PublicPageLayout';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTheme } from '@mui/material/styles';

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
          <Grid container spacing={4} justifyContent="center" sx={{ mt: '1px' }}> {/* Added 1px custom margin */}
            {/* Free Plan */}
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 1.5, color: 'text.primary' }}>Free</Typography>
                <Typography variant="h4" sx={{ mb: 2, color: 'text.secondary' }}>$0/month</Typography>
                <Box component="ul" sx={{ mb: 3, textAlign: 'left', pl: 2, flexGrow: 1, color: 'text.secondary' }}>
                  <Typography component="li" variant="body1" sx={{ mb: 1 }}>✓ 1 social account</Typography>
                  <Typography component="li" variant="body1" sx={{ mb: 1 }}>✓ Basic analytics</Typography>
                  <Typography component="li" variant="body1">✓ Community access</Typography>
                </Box>
                <Button variant="contained" fullWidth sx={{ mt: 'auto', bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}>Get Started</Button>
              </Card>
            </Grid>

            {/* Pro Plan */}
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', height: '100%', border: '2px solid', borderColor: 'primary.main', transform: { md: 'scale(1.05)' }, zIndex: 1 }}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 1.5, color: 'text.primary' }}>Pro</Typography>
                <Typography variant="h4" sx={{ mb: 2, color: 'text.secondary' }}>$12/month</Typography>
                <Box component="ul" sx={{ mb: 3, textAlign: 'left', pl: 2, flexGrow: 1, color: 'text.secondary' }}>
                  <Typography component="li" variant="body1" sx={{ mb: 1 }}>✓ 5 social accounts</Typography>
                  <Typography component="li" variant="body1" sx={{ mb: 1 }}>✓ Advanced analytics</Typography>
                  <Typography component="li" variant="body1" sx={{ mb: 1 }}>✓ Monetization dashboard</Typography>
                  <Typography component="li" variant="body1">✓ Priority support</Typography>
                </Box>
                <Button variant="contained" fullWidth sx={{ mt: 'auto', bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}>Start Free Trial</Button>
              </Card>
            </Grid>

            {/* Enterprise Plan */}
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 1.5, color: 'text.primary' }}>Enterprise</Typography>
                <Typography variant="h4" sx={{ mb: 2, color: 'text.secondary' }}>Contact us</Typography>
                <Box component="ul" sx={{ mb: 3, textAlign: 'left', pl: 2, flexGrow: 1, color: 'text.secondary' }}>
                  <Typography component="li" variant="body1" sx={{ mb: 1 }}>✓ Unlimited accounts</Typography>
                  <Typography component="li" variant="body1" sx={{ mb: 1 }}>✓ Custom integrations</Typography>
                  <Typography component="li" variant="body1">✓ Dedicated manager</Typography>
                </Box>
                <Button variant="contained" fullWidth sx={{ mt: 'auto', bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}>Contact Sales</Button>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </PublicPageLayout>
  );
} 