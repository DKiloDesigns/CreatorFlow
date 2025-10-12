'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  useTheme,
  useMediaQuery,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
} from '@mui/material';
import { 
  Smartphone as SmartphoneIcon,
  Download as DownloadIcon,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  Notifications as NotificationsIcon,
  NotificationsOff as NotificationsOffIcon,
  Home as HomeIcon,
  Add as AddIcon,
  BarChart as BarChartIcon,
  Build as BuildIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Info as InfoIcon
} from '@mui/icons-material';

interface PWAFeature {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  toggle: () => void;
}

export default function PWAFeatures() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  // PWA Features
  const [pwaFeatures, setPwaFeatures] = useState<PWAFeature[]>([
    {
      id: 'offline',
      name: 'Offline Mode',
      description: 'Access core features even without internet',
      icon: <WifiOffIcon size={24} />,
      enabled: false,
      toggle: () => toggleFeature('offline')
    },
    {
      id: 'notifications',
      name: 'Push Notifications',
      description: 'Get notified about important updates',
      icon: <NotificationsIcon size={24} />,
      enabled: false,
      toggle: () => toggleFeature('notifications')
    },
    {
      id: 'shortcuts',
      name: 'App Shortcuts',
      description: 'Quick access to key features from home screen',
      icon: <HomeIcon size={24} />,
      enabled: true,
      toggle: () => toggleFeature('shortcuts')
    },
    {
      id: 'background-sync',
      name: 'Background Sync',
      description: 'Sync data when connection is restored',
      icon: <WifiIcon size={24} />,
      enabled: false,
      toggle: () => toggleFeature('background-sync')
    }
  ]);

  // Check if app is already installed
  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }
  }, []);

  // Listen for beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check notification permission
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const toggleFeature = (featureId: string) => {
    setPwaFeatures(prev => prev.map(feature => 
      feature.id === featureId 
        ? { ...feature, enabled: !feature.enabled }
        : feature
    ));
  };

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setShowInstallPrompt(false);
      }
      
      setDeferredPrompt(null);
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        new Notification('floai.studio', {
          body: 'You\'ll now receive notifications from floai.studio!',
          icon: '/icons/icon-192x192.png'
        });
      }
    }
  };

  const testOfflineMode = () => {
    // Simulate offline mode
    setIsOnline(false);
    setTimeout(() => setIsOnline(true), 3000);
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 8 } }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <SmartphoneIcon size={32} />
          Progressive Web App
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Install floai.studio as a native app on your mobile device
        </Typography>
      </Box>

      {/* Installation Status */}
      <Box sx={{ mb: 4 }}>
        {isInstalled ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            <CheckCircleIcon size={20} style={{ marginRight: 8 }} />
            floai.studio is installed as a PWA!
          </Alert>
        ) : (
          <Alert severity="info" sx={{ mb: 2 }}>
            <InfoIcon size={20} style={{ marginRight: 8 }} />
            Install floai.studio for a native app experience
          </Alert>
        )}

        {showInstallPrompt && !isInstalled && (
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<DownloadIcon size={20} />}
              onClick={handleInstall}
              sx={{
                background: 'linear-gradient(45deg, #3B82F6 30%, #8B5CF6 90%)',
                color: 'white',
                fontWeight: 600,
                borderRadius: 2,
                px: 4,
                py: 1.5,
                '&:hover': {
                  background: 'linear-gradient(45deg, #2563EB 30%, #7C3AED 90%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Install floai.studio App
            </Button>
          </Box>
        )}
      </Box>

      {/* PWA Features */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
          PWA Features
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
          {pwaFeatures.map((feature) => (
            <Card key={feature.id} sx={{ border: '1px solid', borderColor: 'grey.200' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {feature.icon}
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {feature.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </Box>
                  </Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={feature.enabled}
                        onChange={feature.toggle}
                        color="primary"
                      />
                    }
                    label=""
                  />
                </Box>
                
                {/* Feature-specific actions */}
                {feature.id === 'notifications' && feature.enabled && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={requestNotificationPermission}
                    disabled={notificationPermission === 'granted'}
                    sx={{ mt: 1 }}
                  >
                    {notificationPermission === 'granted' ? 'Enabled' : 'Enable Notifications'}
                  </Button>
                )}
                
                {feature.id === 'offline' && feature.enabled && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={testOfflineMode}
                    sx={{ mt: 1 }}
                  >
                    Test Offline Mode
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* App Shortcuts */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
          Quick Actions
        </Typography>
        
        <List>
          <ListItem sx={{ px: 0 }}>
            <ListItemIcon>
              <AddIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Create Content"
              secondary="Start creating new posts and content"
            />
          </ListItem>
          <ListItem sx={{ px: 0 }}>
            <ListItemIcon>
              <BarChartIcon color="secondary" />
            </ListItemIcon>
            <ListItemText
              primary="View Analytics"
              secondary="Check your performance metrics"
            />
          </ListItem>
          <ListItem sx={{ px: 0 }}>
            <ListItemIcon>
              <BuildIcon color="success" />
            </ListItemIcon>
            <ListItemText
              primary="Creator Tools"
              secondary="Access all your creator tools"
            />
          </ListItem>
        </List>
      </Box>

      {/* Connection Status */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Chip
          icon={isOnline ? <WifiIcon size={16} /> : <WifiOffIcon size={16} />}
          label={isOnline ? 'Online' : 'Offline'}
          color={isOnline ? 'success' : 'error'}
          sx={{ mb: 2 }}
        />
        <Typography variant="body2" color="text.secondary">
          {isOnline ? 'All features available' : 'Offline mode active - core features only'}
        </Typography>
      </Box>

      {/* Benefits */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
          Why Install as PWA?
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mt: 4 }}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <DownloadIcon size={48} color="#3B82F6" style={{ marginBottom: 16 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              Native App Feel
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Full-screen experience with native app-like performance
            </Typography>
          </Card>
          
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <WifiIcon size={48} color="#8B5CF6" style={{ marginBottom: 16 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              Offline Access
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Work even without internet connection
            </Typography>
          </Card>
          
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <NotificationsIcon size={48} color="#10B981" style={{ marginBottom: 16 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              Push Notifications
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Stay updated with real-time notifications
            </Typography>
          </Card>
        </Box>
      </Box>

      <Snackbar
        open={showInstallPrompt && !isInstalled}
        message="Install floai.studio for a better mobile experience!"
        action={
          <Button color="inherit" size="small" onClick={handleInstall}>
            Install
          </Button>
        }
      />
    </Container>
  );
}
