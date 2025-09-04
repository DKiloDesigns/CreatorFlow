'use client';

import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { SmartNotificationCenter } from '@/components/notifications/SmartNotificationCenter';
import { CollaborationPanel } from '@/components/collaboration/CollaborationPanel';
import { DragDropContentBuilder } from '@/components/content-builder/DragDropContentBuilder';
import { Box, Typography, Container, Paper, Grid } from '@mui/material';

export default function TestFeaturesPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" sx={{ mb: 4, textAlign: 'center' }}>
        🚀 New Features Test Page
      </Typography>
      
      <Grid container spacing={4}>
        {/* Dark Mode Test */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              🌙 Dark Mode 2.0
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Test the new theme system with smooth transitions
            </Typography>
            <ThemeToggle variant="button" />
          </Paper>
        </Grid>

        {/* Smart Notifications Test */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              🔔 Smart Notifications
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              AI-powered notification system
            </Typography>
            <SmartNotificationCenter />
          </Paper>
        </Grid>

        {/* Collaboration Test */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              🤝 Real-time Collaboration
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Multi-user collaboration features
            </Typography>
            <CollaborationPanel />
          </Paper>
        </Grid>

        {/* Content Builder Test */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              🎨 Content Builder
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Drag & drop content creation
            </Typography>
            <Box sx={{ height: 200, border: '2px dashed', borderColor: 'divider', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Content Builder Component
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Full Content Builder */}
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            🎨 Full Content Builder
          </Typography>
          <Box sx={{ height: 400, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <DragDropContentBuilder />
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
