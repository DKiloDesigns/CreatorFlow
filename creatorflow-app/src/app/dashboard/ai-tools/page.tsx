'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, CircularProgress, Card, CardContent, Button } from '@mui/material';
import { AutoAwesome, Rocket } from '@mui/icons-material';

export default function AIToolsRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect after 3 seconds
    const timer = setTimeout(() => {
      router.push('/dashboard/enhanced');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '60vh',
      textAlign: 'center',
      p: 3
    }}>
      <Card sx={{ maxWidth: 600, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <AutoAwesome sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          
          <Typography variant="h4" component="h1" gutterBottom color="primary.main">
            🚀 AI Tools Have Been Upgraded!
          </Typography>
          
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            We've moved your AI tools to our enhanced Phase 2 dashboard
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Your AI tools are now part of a comprehensive AI intelligence suite with real-time analytics, 
            advanced content optimization, and intelligent publishing workflows.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/dashboard/enhanced')}
              startIcon={<AutoAwesome />}
            >
              Go to Enhanced Dashboard
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              onClick={() => router.push('/dashboard/phase2-hub')}
              startIcon={<Rocket />}
            >
              Phase 2 Hub
            </Button>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
            Redirecting automatically in 3 seconds...
          </Typography>
          
          <CircularProgress size={20} sx={{ mt: 2 }} />
        </CardContent>
      </Card>

      {/* Bottom Spacer to Clear Bottom Navigation */}
      <Box sx={{
        height: { xs: '120px', sm: '40px' },
        width: '100%'
      }} />
    </Box>
  );
} 