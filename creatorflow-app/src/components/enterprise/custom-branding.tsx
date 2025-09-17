/**
 * Custom Branding Component
 * More white-label customization options
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  IconButton,
  Tooltip,
  alpha,
  useTheme,
  Paper,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import {
  Palette as PaletteIcon,
  Upload as UploadIcon,
  Preview as PreviewIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Business as BusinessIcon,
  Image as ImageIcon,
  ColorLens as ColorLensIcon,
  Typography as TypographyIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface BrandingConfig {
  id: string;
  name: string;
  logo: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  customCSS: string;
  customDomain: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CustomBrandingProps {
  onConfigSave?: (config: BrandingConfig) => void;
  onConfigPreview?: (config: BrandingConfig) => void;
  className?: string;
}

export function CustomBranding({
  onConfigSave,
  onConfigPreview,
  className,
}: CustomBrandingProps) {
  const [config, setConfig] = useState<BrandingConfig>({
    id: 'default',
    name: 'Default Branding',
    logo: '',
    favicon: '',
    primaryColor: '#1976d2',
    secondaryColor: '#dc004e',
    accentColor: '#9c27b0',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    fontFamily: 'Roboto',
    customCSS: '',
    customDomain: '',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();

  const handleConfigChange = useCallback((field: keyof BrandingConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field]: value,
      updatedAt: new Date(),
    }));
  }, []);

  const handleSave = useCallback(() => {
    onConfigSave?.(config);
  }, [config, onConfigSave]);

  const handlePreview = useCallback(() => {
    onConfigPreview?.(config);
    setIsPreviewOpen(true);
  }, [config, onConfigPreview]);

  const PreviewDialog = () => (
    <Dialog
      open={isPreviewOpen}
      onClose={() => setIsPreviewOpen(false)}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>Branding Preview</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            p: 4,
            bgcolor: config.backgroundColor,
            color: config.textColor,
            fontFamily: config.fontFamily,
            minHeight: 400,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            {config.logo && (
              <Avatar
                src={config.logo}
                sx={{ width: 48, height: 48, mr: 2 }}
              />
            )}
            <Typography variant="h4" sx={{ color: config.primaryColor }}>
              CreatorFlow
            </Typography>
          </Box>
          
          <Typography variant="h6" gutterBottom>
            Welcome to Your Branded Experience
          </Typography>
          
          <Typography variant="body1" paragraph>
            This is how your application will look with your custom branding applied.
            All colors, fonts, and styling have been updated to match your brand identity.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              variant="contained"
              sx={{ bgcolor: config.primaryColor }}
            >
              Primary Action
            </Button>
            <Button
              variant="outlined"
              sx={{ 
                borderColor: config.secondaryColor,
                color: config.secondaryColor,
              }}
            >
              Secondary Action
            </Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsPreviewOpen(false)}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box className={className}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Custom Branding
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Customize your application's appearance and branding
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            startIcon={<PreviewIcon />}
            onClick={handlePreview}
            variant="outlined"
          >
            Preview
          </Button>
          <Button
            startIcon={<SaveIcon />}
            onClick={handleSave}
            variant="contained"
          >
            Save Changes
          </Button>
        </Box>
      </Box>

      {/* Branding Configuration */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Branding Configuration
              </Typography>
              
              <Stepper activeStep={activeStep} orientation="vertical">
                <Step>
                  <StepLabel>Basic Information</StepLabel>
                  <StepContent>
                    <TextField
                      fullWidth
                      label="Brand Name"
                      value={config.name}
                      onChange={(e) => handleConfigChange('name', e.target.value)}
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Custom Domain"
                      value={config.customDomain}
                      onChange={(e) => handleConfigChange('customDomain', e.target.value)}
                      margin="normal"
                      placeholder="app.yourcompany.com"
                    />
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        onClick={() => setActiveStep(1)}
                      >
                        Next
                      </Button>
                    </Box>
                  </StepContent>
                </Step>
                
                <Step>
                  <StepLabel>Logo & Assets</StepLabel>
                  <StepContent>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <Button
                        startIcon={<UploadIcon />}
                        variant="outlined"
                        onClick={() => {/* Handle logo upload */}}
                      >
                        Upload Logo
                      </Button>
                      <Button
                        startIcon={<UploadIcon />}
                        variant="outlined"
                        onClick={() => {/* Handle favicon upload */}}
                      >
                        Upload Favicon
                      </Button>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        onClick={() => setActiveStep(2)}
                      >
                        Next
                      </Button>
                    </Box>
                  </StepContent>
                </Step>
                
                <Step>
                  <StepLabel>Color Scheme</StepLabel>
                  <StepContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Primary Color"
                          type="color"
                          value={config.primaryColor}
                          onChange={(e) => handleConfigChange('primaryColor', e.target.value)}
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Secondary Color"
                          type="color"
                          value={config.secondaryColor}
                          onChange={(e) => handleConfigChange('secondaryColor', e.target.value)}
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Accent Color"
                          type="color"
                          value={config.accentColor}
                          onChange={(e) => handleConfigChange('accentColor', e.target.value)}
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Background Color"
                          type="color"
                          value={config.backgroundColor}
                          onChange={(e) => handleConfigChange('backgroundColor', e.target.value)}
                          margin="normal"
                        />
                      </Grid>
                    </Grid>
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        onClick={() => setActiveStep(3)}
                      >
                        Next
                      </Button>
                    </Box>
                  </StepContent>
                </Step>
                
                <Step>
                  <StepLabel>Typography & Styling</StepLabel>
                  <StepContent>
                    <TextField
                      fullWidth
                      label="Font Family"
                      value={config.fontFamily}
                      onChange={(e) => handleConfigChange('fontFamily', e.target.value)}
                      margin="normal"
                      select
                    >
                      <MenuItem value="Roboto">Roboto</MenuItem>
                      <MenuItem value="Open Sans">Open Sans</MenuItem>
                      <MenuItem value="Lato">Lato</MenuItem>
                      <MenuItem value="Montserrat">Montserrat</MenuItem>
                      <MenuItem value="Poppins">Poppins</MenuItem>
                    </TextField>
                    <TextField
                      fullWidth
                      label="Custom CSS"
                      value={config.customCSS}
                      onChange={(e) => handleConfigChange('customCSS', e.target.value)}
                      margin="normal"
                      multiline
                      rows={6}
                      placeholder="/* Add your custom CSS here */"
                    />
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        onClick={handleSave}
                      >
                        Save Configuration
                      </Button>
                    </Box>
                  </StepContent>
                </Step>
              </Stepper>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Preview
              </Typography>
              
              <Box
                sx={{
                  p: 2,
                  bgcolor: config.backgroundColor,
                  color: config.textColor,
                  fontFamily: config.fontFamily,
                  borderRadius: 1,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {config.logo && (
                    <Avatar
                      src={config.logo}
                      sx={{ width: 32, height: 32, mr: 1 }}
                    />
                  )}
                  <Typography variant="h6" sx={{ color: config.primaryColor }}>
                    {config.name}
                  </Typography>
                </Box>
                
                <Typography variant="body2" paragraph>
                  This is a preview of how your branding will appear.
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    variant="contained"
                    sx={{ bgcolor: config.primaryColor }}
                  >
                    Button
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{ 
                      borderColor: config.secondaryColor,
                      color: config.secondaryColor,
                    }}
                  >
                    Button
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <PreviewDialog />
    </Box>
  );
}

export default CustomBranding;
