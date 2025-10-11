'use client';

import { DragDropContentBuilder } from '@/components/content-builder/DragDropContentBuilder';
import { Box, Typography, Container, Paper, Grid, Chip, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon, PlayArrow as PlayArrowIcon, Code as CodeIcon, ColorLens as ColorLensIcon } from '@mui/icons-material';
import Link from 'next/link';

export default function ContentBuilderDemoPage() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Link href="/features-demo">
          <Button variant="outlined" startIcon={<ArrowBackIcon sx={{ width: 16, height: 16 }} />}>
            Back to Features
          </Button>
        </Link>
        <Typography variant="h3" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
          🎨 Content Builder Demo
        </Typography>
        <Chip 
          label="Phase 1 Complete" 
          color="success" 
          icon={<PlayArrowIcon sx={{ width: 16, height: 16 }} />}
        />
      </Box>

      {/* Feature Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CodeIcon sx={{ width: 20, height: 20 }} />
              Drag & Drop
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Intuitive drag-and-drop interface for arranging content blocks. Simply drag blocks to reorder them.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <ColorLensIcon sx={{ width: 20, height: 20 }} />
              Content Blocks
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Rich variety of content blocks: text, images, videos, hashtags, links, emojis, and CTAs.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              💾 Save & Load
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Auto-save functionality with manual save/load options. Export as text or JSON format.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Content Builder */}
      <Paper sx={{ height: '80vh', overflow: 'hidden' }}>
        <DragDropContentBuilder />
      </Paper>

      {/* Instructions */}
      <Box sx={{ mt: 3, p: 3, bgcolor: 'primary.main', color: 'primary.contrastText', borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          🚀 How to Use the Content Builder
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>1. Add Blocks:</strong> Click on any content type in the sidebar to add it to your content.
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>2. Drag & Drop:</strong> Drag blocks up or down to reorder them.
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>3. Edit Content:</strong> Click the edit button on any block to modify its content.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>4. Save Work:</strong> Your content auto-saves every 2 seconds, or click Save manually.
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>5. Export:</strong> Use Export to copy as text, or Export JSON for full data.
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>6. Templates:</strong> Load pre-built templates for quick content creation.
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
