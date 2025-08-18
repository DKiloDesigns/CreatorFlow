"use client";

import React, { useState } from 'react';
import { Box, Typography, Container, Alert, Paper, Chip, useTheme, useMediaQuery } from '@mui/material';
import SacaCompliantContentTable from '@/components/ui/SacaCompliantContentTable';

// Sample data matching the original table structure
const sampleContentItems = [
  {
    id: '1',
    title: 'AI-powered content creation strategies for modern marketers',
    status: 'DRAFT' as const,
    platforms: ['LinkedIn', 'Twitter'],
    content: 'AI-powered content creation strategies for modern marketers'
  },
  {
    id: '2',
    title: 'How to optimize your social media presence in 2025',
    status: 'SCHEDULED' as const,
    platforms: ['Instagram', 'LinkedIn'],
    scheduledDate: '2025-08-16T00:00:00.000Z',
    content: 'How to optimize your social media presence in 2025'
  },
  {
    id: '3',
    title: 'The future of content marketing: AI and automation',
    status: 'PUBLISHED' as const,
    platforms: ['LinkedIn', 'Twitter', 'Facebook'],
    publishedDate: '2025-08-14T00:00:00.000Z',
    content: 'The future of content marketing: AI and automation'
  },
  {
    id: '4',
    title: 'Advanced hashtag strategies for maximum reach',
    status: 'DRAFT' as const,
    platforms: ['Instagram', 'TikTok', 'Twitter'],
    content: 'Advanced hashtag strategies for maximum reach'
  },
  {
    id: '5',
    title: 'Building authentic brand voice on social media',
    status: 'SCHEDULED' as const,
    platforms: ['LinkedIn', 'Facebook', 'Instagram'],
    scheduledDate: '2025-08-20T00:00:00.000Z',
    content: 'Building authentic brand voice on social media'
  }
];

export default function SacaDemoPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [items, setItems] = useState(sampleContentItems);

  const handleEdit = (id: string) => {
    console.log('Edit item:', id);
    // In a real app, this would open an edit form
  };

  const handleDuplicate = (id: string) => {
    console.log('Duplicate item:', id);
    // In a real app, this would create a copy
  };

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleView = (id: string) => {
    console.log('View item:', id);
    // In a real app, this would open a preview
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: theme.palette.background.default,
      pb: { xs: 12, sm: 8 }
    }}>
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 4 } }}>
        {/* Header Section */}
        <Box sx={{ mb: { xs: 4, sm: 5 } }}>
          <Typography 
            variant={isMobile ? "h4" : "h3"} 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              color: theme.palette.text.primary,
              textAlign: { xs: 'center', sm: 'left' }
            }}
          >
            SACA-Compliant Content Table
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            paragraph
            sx={{ 
              textAlign: { xs: 'center', sm: 'left' },
              maxWidth: '800px'
            }}
          >
            Experience our fully accessible, responsive content management table that automatically adapts between desktop table view and mobile horizontal scrolling cards.
          </Typography>
          
          <Alert 
            severity="info" 
            sx={{ 
              mb: 3,
              '& .MuiAlert-message': {
                width: '100%'
              }
            }}
          >
            <Typography variant="body2">
              <strong>New Mobile Experience:</strong> Horizontal scrolling cards with detailed modal views! 
              Tap any card on mobile to see full content details.
            </Typography>
          </Alert>
        </Box>

        {/* Content Table */}
        <Box sx={{ mb: 4 }}>
          <SacaCompliantContentTable
            items={items}
            onEdit={handleEdit}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
            onView={handleView}
          />
        </Box>

        {/* New Features Highlight */}
        <Paper 
          elevation={1} 
          sx={{ 
            p: { xs: 2, sm: 3 }, 
            mb: 4,
            bgcolor: theme.palette.primary[50], 
            borderRadius: 2,
            border: `1px solid ${theme.palette.primary[200]}`
          }}
        >
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            gutterBottom
            sx={{ 
              fontWeight: 600,
              color: theme.palette.primary.main,
              mb: 2
            }}
          >
            🆕 New Mobile Experience Features ✨
          </Typography>
          
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: 2
          }}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: theme.palette.primary.main }}>
                📱 Horizontal Scrolling Cards
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Smooth left-to-right scrolling<br/>
                • Fixed-width cards (280px) for consistency<br/>
                • Scroll snap for better UX<br/>
                • Custom scrollbar styling
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: theme.palette.primary.main }}>
                🔍 Detailed Modal Views
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Tap any card to open detailed modal<br/>
                • Complete content information<br/>
                • Direct action buttons<br/>
                • Keyboard accessible
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* SACA Compliance Checklist */}
        <Paper 
          elevation={1} 
          sx={{ 
            p: { xs: 2, sm: 3 }, 
            bgcolor: theme.palette.grey[50], 
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            mb: 4
          }}
        >
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            gutterBottom
            sx={{ 
              fontWeight: 600,
              color: theme.palette.text.primary,
              mb: 2
            }}
          >
            SACA Compliance Checklist ✅
          </Typography>
          
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 2
          }}>
            {[
              {
                title: 'ARIA Labels',
                description: 'All interactive elements have descriptive labels',
                icon: '🏷️'
              },
              {
                title: 'Keyboard Navigation',
                description: 'Full keyboard support with visible focus indicators',
                icon: '⌨️'
              },
              {
                title: 'Screen Reader Support',
                description: 'Proper roles, live regions, and announcements',
                icon: '🔊'
              },
              {
                title: 'Color Contrast',
                description: 'WCAG AA compliant color combinations',
                icon: '🎨'
              },
              {
                title: 'Semantic Structure',
                description: 'Proper table headers, scopes, and relationships',
                icon: '🏗️'
              },
              {
                title: 'Touch Targets',
                description: 'Minimum 44x44px for all interactive elements',
                icon: '👆'
              },
              {
                title: 'Error Prevention',
                description: 'Confirmation dialogs for destructive actions',
                icon: '⚠️'
              },
              {
                title: 'Responsive Design',
                description: 'Mobile-optimized with proper touch interactions',
                icon: '📱'
              },
              {
                title: 'Horizontal Scrolling',
                description: 'Smooth left-to-right card navigation on mobile',
                icon: '🔄'
              },
              {
                title: 'Modal Accessibility',
                description: 'Keyboard navigation and screen reader support',
                icon: '🔍'
              },
              {
                title: 'Scroll Indicators',
                description: 'Visual cues for horizontal scrolling',
                icon: '💡'
              },
              {
                title: 'Touch Gestures',
                description: 'Optimized for mobile touch interactions',
                icon: '👆'
              }
            ].map((feature, index) => (
              <Box 
                key={index}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: 1,
                  p: 1.5,
                  bgcolor: 'white',
                  borderRadius: 1,
                  border: `1px solid ${theme.palette.divider}`,
                  '&:hover': {
                    bgcolor: theme.palette.action.hover
                  }
                }}
              >
                <Typography variant="h6" sx={{ fontSize: '1.2rem' }}>
                  {feature.icon}
                </Typography>
                <Box>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      mb: 0.5
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ lineHeight: 1.4 }}
                  >
                    {feature.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>

        {/* Mobile vs Desktop Info */}
        <Box sx={{ mt: 4, p: 3, bgcolor: theme.palette.info[50], borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ color: theme.palette.info.main }}>
            Responsive Design Features 🎯
          </Typography>
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: 2
          }}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                📱 Mobile View (Horizontal Cards)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Horizontal scrolling card layout<br/>
                • Fixed-width cards (280px)<br/>
                • Tap to open detailed modal<br/>
                • Scroll snap and indicators<br/>
                • Touch-optimized interactions
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                🖥️ Desktop View (Table)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Traditional table layout<br/>
                • Hover effects and interactions<br/>
                • Compact action button layout<br/>
                • Full keyboard navigation<br/>
                • Efficient use of screen space
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Usage Instructions */}
        <Box sx={{ mt: 4, p: 3, bgcolor: theme.palette.success[50], borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ color: theme.palette.success.main }}>
            How to Use 📖
          </Typography>
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: 2
          }}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                📱 On Mobile Devices
              </Typography>
              <Typography variant="body2" color="text.secondary">
                1. Scroll horizontally to view all cards<br/>
                2. Tap any card to open detailed modal<br/>
                3. Use action buttons in modal or on cards<br/>
                4. Swipe gestures for smooth navigation
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                🖥️ On Desktop
              </Typography>
              <Typography variant="body2" color="text.secondary">
                1. View all content in table format<br/>
                2. Use keyboard navigation (Tab, Enter)<br/>
                3. Hover over rows for interactions<br/>
                4. Click action buttons directly
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
{/* Bottom Spacer to Clear Bottom Navigation */}
      <Box sx={{
        height: { xs: '120px', sm: '40px' },
        width: '100%'
      }} />
