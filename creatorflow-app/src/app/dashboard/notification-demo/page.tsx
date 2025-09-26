'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Switch, 
  FormControlLabel,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Divider
} from '@mui/material';
import FloatingNotificationIcon from '@/components/notifications/FloatingNotificationIcon';
import ModernNotificationSystem from '@/components/notifications/ModernNotificationSystem';

export default function NotificationDemoPage() {
  const [unreadCount, setUnreadCount] = useState(3);
  const [isActive, setIsActive] = useState(false);
  const [showAnimations, setShowAnimations] = useState(true);
  const [size, setSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [variant, setVariant] = useState<'floating' | 'glass' | 'neon' | 'minimal'>('floating');
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');

  const handleAddNotification = () => {
    setUnreadCount(prev => prev + 1);
  };

  const handleClearNotifications = () => {
    setUnreadCount(0);
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        🎨 Modern Notification System Demo
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Experience the new floating notification icons with modern animations and creative styling.
      </Typography>

      {/* Controls */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Controls</Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography gutterBottom>Notification Count</Typography>
            <Slider
              value={unreadCount}
              onChange={(_, value) => setUnreadCount(value as number)}
              min={0}
              max={20}
              step={1}
              marks
              valueLabelDisplay="auto"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Size</InputLabel>
              <Select
                value={size}
                onChange={(e) => setSize(e.target.value as any)}
                label="Size"
              >
                <MenuItem value="small">Small</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="large">Large</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Variant</InputLabel>
              <Select
                value={variant}
                onChange={(e) => setVariant(e.target.value as any)}
                label="Variant"
              >
                <MenuItem value="floating">Floating</MenuItem>
                <MenuItem value="glass">Glass</MenuItem>
                <MenuItem value="neon">Neon</MenuItem>
                <MenuItem value="minimal">Minimal</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Theme</InputLabel>
              <Select
                value={theme}
                onChange={(e) => setTheme(e.target.value as any)}
                label="Theme"
              >
                <MenuItem value="auto">Auto</MenuItem>
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControlLabel
            control={
              <Switch
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
            }
            label="Active State"
          />
          
          <FormControlLabel
            control={
              <Switch
                checked={showAnimations}
                onChange={(e) => setShowAnimations(e.target.checked)}
              />
            }
            label="Animations"
          />
          
          <Button 
            variant="outlined" 
            onClick={handleAddNotification}
            size="small"
          >
            Add Notification
          </Button>
          
          <Button 
            variant="outlined" 
            onClick={handleClearNotifications}
            size="small"
          >
            Clear All
          </Button>
        </Box>
      </Paper>

      {/* Demo Grid */}
      <Grid container spacing={4}>
        {/* Floating Notification Icon */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Floating Notification Icon
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Original floating design with glassmorphism effects
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <FloatingNotificationIcon
                unreadCount={unreadCount}
                isActive={isActive}
                size={size}
                variant="creative"
              />
              
              <FloatingNotificationIcon
                unreadCount={unreadCount}
                isActive={isActive}
                size={size}
                variant="minimal"
              />
            </Box>
          </Paper>
        </Grid>

        {/* Modern Notification System */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Modern Notification System
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Enhanced system with multiple variants and themes
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <ModernNotificationSystem
                unreadCount={unreadCount}
                isActive={isActive}
                size={size}
                variant={variant}
                showAnimations={showAnimations}
                theme={theme}
              />
            </Box>
          </Paper>
        </Grid>

        {/* All Variants Showcase */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              All Variants Showcase
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Compare all available notification styles
            </Typography>
            
            <Grid container spacing={3} justifyContent="center">
              {(['floating', 'glass', 'neon', 'minimal'] as const).map((variantName) => (
                <Grid item key={variantName}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" display="block" sx={{ mb: 1, textTransform: 'capitalize' }}>
                      {variantName}
                    </Typography>
                    <ModernNotificationSystem
                      unreadCount={unreadCount}
                      isActive={isActive}
                      size="medium"
                      variant={variantName}
                      showAnimations={showAnimations}
                      theme={theme}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Size Comparison */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Size Comparison
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Different sizes for various use cases
            </Typography>
            
            <Grid container spacing={3} justifyContent="center" alignItems="center">
              {(['small', 'medium', 'large'] as const).map((sizeName) => (
                <Grid item key={sizeName}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" display="block" sx={{ mb: 1, textTransform: 'capitalize' }}>
                      {sizeName}
                    </Typography>
                    <ModernNotificationSystem
                      unreadCount={unreadCount}
                      isActive={isActive}
                      size={sizeName}
                      variant="floating"
                      showAnimations={showAnimations}
                      theme={theme}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
