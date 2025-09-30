'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Chip,
  Alert,
  AlertTitle,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Smartphone,
  Tablet,
  Monitor,
  Hand,
  Wifi,
  Battery,
  Zap,
  Eye,
  Settings,
  Play,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Upload,
  RefreshCw,
  WifiOff,
  BatteryLow,
  Volume2,
  VolumeX,
  Sun,
  Moon,
} from 'lucide-react';
import { MobileTestSuite } from '@/components/testing/mobile-test-suite';
import { PageHeader } from '@/components/ui/page-header';

export default function MobileTestPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [testResults, setTestResults] = useState<any[]>([]);

  const handleTestComplete = (results: any[]) => {
    setTestResults(results);
  };

  const deviceInfo = {
    type: isMobile ? 'mobile' : 'tablet',
    orientation: typeof window !== 'undefined' ? (window.innerHeight > window.innerWidth ? 'portrait' : 'landscape') : 'landscape',
    touchSupport: typeof window !== 'undefined' ? 'ontouchstart' in window : false,
    connectionType: typeof navigator !== 'undefined' ? (navigator as any).connection?.effectiveType || 'unknown' : 'unknown',
    reducedMotion: typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false,
    highContrast: typeof window !== 'undefined' ? window.matchMedia('(prefers-contrast: high)').matches : false,
  };

  const mobileFeatures = [
    {
      name: 'Touch Interactions',
      description: 'Swipe gestures, tap responses, and touch feedback',
      icon: <Hand />,
      status: 'active',
    },
    {
      name: 'Responsive Design',
      description: 'Adaptive layout for all screen sizes',
      icon: <Monitor />,
      status: 'active',
    },
    {
      name: 'Performance Optimization',
      description: 'Optimized for mobile performance',
      icon: <Zap />,
      status: 'active',
    },
    {
      name: 'PWA Features',
      description: 'Progressive Web App capabilities',
      icon: <Download />,
      status: 'active',
    },
    {
      name: 'Accessibility',
      description: 'WCAG 2.1 AA compliance',
      icon: <Eye />,
      status: 'active',
    },
    {
      name: 'Offline Support',
      description: 'Works without internet connection',
      icon: <WifiOff />,
      status: 'active',
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <PageHeader
        title="Mobile Testing & Optimization"
        subtitle="Comprehensive mobile testing suite for CreatorFlow's mobile experience"
        breadcrumbs={[
          { label: 'Mobile Testing', href: '/dashboard/mobile-test' }
        ]}
        icon={<Smartphone size={24} />}
      />

      {/* Device Information */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Current Device" />
            <CardContent>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    {deviceInfo.type === 'mobile' ? <Smartphone /> : 
                     deviceInfo.type === 'tablet' ? <Tablet /> : <Monitor />}
                  </ListItemIcon>
                  <ListItemText 
                    primary="Device Type" 
                    secondary={deviceInfo.type.charAt(0).toUpperCase() + deviceInfo.type.slice(1)} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <RefreshCw />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Orientation" 
                    secondary={deviceInfo.orientation.charAt(0).toUpperCase() + deviceInfo.orientation.slice(1)} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Hand />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Touch Support" 
                    secondary={deviceInfo.touchSupport ? 'Yes' : 'No'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Wifi />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Connection" 
                    secondary={deviceInfo.connectionType} 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Accessibility Settings" />
            <CardContent>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    {deviceInfo.reducedMotion ? <EyeOff /> : <Eye />}
                  </ListItemIcon>
                  <ListItemText 
                    primary="Reduced Motion" 
                    secondary={deviceInfo.reducedMotion ? 'Enabled' : 'Disabled'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    {deviceInfo.highContrast ? <Sun /> : <Moon />}
                  </ListItemIcon>
                  <ListItemText 
                    primary="High Contrast" 
                    secondary={deviceInfo.highContrast ? 'Enabled' : 'Disabled'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Settings />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Test Mode" 
                    secondary="Mobile UX Testing" 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Mobile Features Status */}
      <Card sx={{ mb: 4 }}>
        <CardHeader title="Mobile Features Status" />
        <CardContent>
          <Grid container spacing={2}>
            {mobileFeatures.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                  <Box sx={{ color: 'primary.main' }}>
                    {feature.icon}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      {feature.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Box>
                  <Chip
                    label={feature.status}
                    color="success"
                    size="small"
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Test Results Summary */}
      {testResults.length > 0 && (
        <Card sx={{ mb: 4 }}>
          <CardHeader title="Test Results Summary" />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="success.main">
                    {testResults.filter(t => t.status === 'passed').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tests Passed
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="error.main">
                    {testResults.filter(t => t.status === 'failed').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tests Failed
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4">
                    {testResults.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Tests
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Mobile Test Suite */}
      <Card>
        <CardHeader title="Mobile Test Suite" />
        <CardContent>
          <MobileTestSuite onTestComplete={handleTestComplete} />
        </CardContent>
      </Card>

      {/* Mobile UX Tips */}
      <Card sx={{ mt: 4 }}>
        <CardHeader title="Mobile UX Best Practices" />
        <CardContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            <AlertTitle>Touch Targets</AlertTitle>
            All interactive elements are at least 44px in size for easy touch interaction.
          </Alert>
          <Alert severity="info" sx={{ mb: 2 }}>
            <AlertTitle>Performance</AlertTitle>
            Optimized for mobile devices with lazy loading and efficient rendering.
          </Alert>
          <Alert severity="info">
            <AlertTitle>Accessibility</AlertTitle>
            Full keyboard navigation and screen reader support for inclusive design.
          </Alert>
        </CardContent>
      </Card>
    </Container>
  );
}
