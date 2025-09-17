'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  TextField,
  Alert,
  AlertTitle,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import {
  Accessibility as AccessibilityIcon,
  Visibility as VisibilityIcon,
  Keyboard as KeyboardIcon,
  VolumeUp as VolumeUpIcon,
  TouchApp as TouchAppIcon,
} from '@mui/icons-material';
import {
  AccessibleModal,
  AccessibleFormField,
  useFormValidation,
  KeyboardNavigation,
  AccessibleButtonGroup,
  ContrastIssuesDisplay,
  useAccessibilityAnnouncements,
  ConditionalAnimation,
  accessibleAnimations,
} from '@/components/accessibility';

export default function AccessibilityPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const { validateField, getError, hasErrors } = useFormValidation();
  const { announceAction, announcePageChange } = useAccessibilityAnnouncements();

  // Announce page change on mount
  React.useEffect(() => {
    announcePageChange('Accessibility Testing Page');
  }, [announcePageChange]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const nameValid = validateField('name', formData.name, { required: true, minLength: 2 });
    const emailValid = validateField('email', formData.email, { 
      required: true, 
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ 
    });
    const messageValid = validateField('message', formData.message, { required: true, minLength: 10 });

    if (nameValid && emailValid && messageValid) {
      announceAction('Form submission', 'success');
      alert('Form submitted successfully!');
    } else {
      announceAction('Form submission', 'error');
    }
  };

  const handleButtonClick = (action: string) => {
    announceAction(action, 'success');
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.primary', fontWeight: 'bold' }}>
        <AccessibilityIcon color="primary" />
        Accessibility Testing & WCAG 2.1 AA Compliance
      </Typography>

      <Typography variant="body1" color="text.secondary" paragraph>
        This page demonstrates and tests all accessibility features implemented for WCAG 2.1 AA compliance.
      </Typography>

      <Grid container spacing={3}>
        {/* ARIA Live Regions Demo */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary', fontWeight: 'bold' }}>
                <VolumeUpIcon color="primary" />
                ARIA Live Regions
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Screen reader announcements for dynamic content changes.
              </Typography>
              
              <Stack spacing={2}>
                <Button
                  variant="contained"
                  onClick={() => handleButtonClick('Button clicked')}
                  sx={{ '&:focus': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 } }}
                >
                  Test Announcement
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={() => announceAction('Error simulation', 'error')}
                >
                  Test Error Announcement
                </Button>
                
                <Button
                  variant="text"
                  onClick={() => announceAction('Info message', 'info')}
                >
                  Test Info Announcement
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Focus Management Demo */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary', fontWeight: 'bold' }}>
                <KeyboardIcon color="primary" />
                Focus Management
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Keyboard navigation and focus trapping for modals.
              </Typography>
              
              <Button
                variant="contained"
                onClick={() => setModalOpen(true)}
                sx={{ '&:focus': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 } }}
              >
                Open Accessible Modal
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Form Validation Demo */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary', fontWeight: 'bold' }}>
                <TouchAppIcon color="primary" />
                Form Validation
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Accessible form fields with ARIA validation states.
              </Typography>
              
              <Box component="form" onSubmit={handleFormSubmit}>
                <AccessibleFormField
                  label="Name"
                  value={formData.name}
                  onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
                  error={getError('name')}
                  required
                  helperText="Enter your full name"
                />
                
                <AccessibleFormField
                  label="Email"
                  value={formData.email}
                  onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
                  error={getError('email')}
                  type="email"
                  required
                  helperText="Enter a valid email address"
                />
                
                <AccessibleFormField
                  label="Message"
                  value={formData.message}
                  onChange={(value) => setFormData(prev => ({ ...prev, message: value }))}
                  error={getError('message')}
                  multiline
                  rows={3}
                  required
                  minLength={10}
                  helperText="Enter at least 10 characters"
                />
                
                <Button
                  type="submit"
                  variant="contained"
                  disabled={hasErrors}
                  sx={{ mt: 2, '&:focus': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 } }}
                >
                  Submit Form
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Keyboard Navigation Demo */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary', fontWeight: 'bold' }}>
                <KeyboardIcon color="primary" />
                Keyboard Navigation
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Arrow key navigation for button groups and interactive elements.
              </Typography>
              
              <AccessibleButtonGroup
                orientation="horizontal"
                aria-label="Navigation buttons"
              >
                <Button variant="outlined">First</Button>
                <Button variant="outlined">Second</Button>
                <Button variant="outlined">Third</Button>
                <Button variant="outlined">Fourth</Button>
              </AccessibleButtonGroup>
            </CardContent>
          </Card>
        </Grid>

        {/* Motion Reduction Demo */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary', fontWeight: 'bold' }}>
                <VisibilityIcon color="primary" />
                Motion Reduction
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Respects user's motion preferences for reduced motion.
              </Typography>
              
              <ConditionalAnimation
                animationProps={accessibleAnimations.fadeIn}
                reducedMotionProps={{ opacity: 1 }}
              >
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                    borderRadius: 1,
                    textAlign: 'center',
                  }}
                >
                  This box respects motion preferences
                </Box>
              </ConditionalAnimation>
            </CardContent>
          </Card>
        </Grid>

        {/* Color Contrast Checker */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary', fontWeight: 'bold' }}>
                <VisibilityIcon color="primary" />
                Color Contrast Checker
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Automated color contrast checking for WCAG compliance.
              </Typography>
              
              <ContrastIssuesDisplay />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* WCAG Compliance Status */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', fontWeight: 'bold' }}>
            WCAG 2.1 AA Compliance Status
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Chip label="ARIA Live Regions" color="success" />
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  ✅ Implemented
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Chip label="Focus Management" color="success" />
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  ✅ Implemented
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Chip label="Form Validation" color="success" />
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  ✅ Implemented
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Chip label="Keyboard Navigation" color="success" />
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  ✅ Implemented
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Accessible Modal */}
      <AccessibleModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Accessible Modal Demo"
        ariaDescribedBy="modal-description"
      >
        <Typography id="modal-description" variant="body1" paragraph>
          This modal demonstrates proper focus management, keyboard navigation, and screen reader support.
        </Typography>
        
        <TextField
          fullWidth
          label="Test Input"
          placeholder="Try tabbing through this modal"
          sx={{ mb: 2 }}
        />
        
        <Alert severity="info" sx={{ mb: 2 }}>
          <AlertTitle>Accessibility Features</AlertTitle>
          • Focus is trapped within the modal
          • Tab navigation cycles through elements
          • Escape key closes the modal
          • Screen readers announce modal state changes
        </Alert>
      </AccessibleModal>
    </Box>
  );
}
