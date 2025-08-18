'use client';

import React from 'react';
import { Box, Typography, Container, Paper, Button } from '@mui/material';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SmartContentWorkflow from '../_components/smart-content-workflow';

export default function SmartWorkflowPage() {
  const router = useRouter();

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowLeft />}
          onClick={() => router.back()}
          sx={{ mb: 2 }}
        >
          Back to Content Dashboard
        </Button>
        
        <Paper sx={{ p: 3, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Sparkles style={{ fontSize: 32, color: 'var(--mui-palette-primary-main)' }} />
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                Smart Content Creation Workflow
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Create, optimize, and schedule content with AI-powered insights in a unified workflow
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button variant="contained" size="small">
              🚀 AI-Powered Ideation
            </Button>
            <Button variant="outlined" size="small">
              ✍️ Smart Creation
            </Button>
            <Button variant="outlined" size="small">
              🤖 AI Optimization
            </Button>
            <Button variant="outlined" size="small">
              📅 Smart Scheduling
            </Button>
            <Button variant="outlined" size="small">
              ✅ Review & Publish
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Workflow Component */}
      <SmartContentWorkflow />
    </Container>
  );
}
{/* Bottom Spacer to Clear Bottom Navigation */}
      <Box sx={{
        height: { xs: '120px', sm: '40px' },
        width: '100%'
      }} />
