'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Alert,
  AlertTitle,
  IconButton,
  Tooltip,
  Fade,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  Smartphone as SmartphoneIcon,
  DesktopWindows as MonitorIcon,
  Close as XIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as ClockIcon,
  Storage as HardDriveIcon,
  Bolt as ZapIcon,
  Security as ShieldIcon,
  Star as StarIcon,
} from '@mui/icons-material';

interface PWAEnhancementsProps {
  children: React.ReactNode;
}

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOnline: boolean;
  hasUpdate: boolean;
  installPrompt: any;
  updateAvailable: boolean;
}

export const PWAEnhancements: React.FC<PWAEnhancementsProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isOnline: true,
    hasUpdate: false,
    installPrompt: null,
    updateAvailable: false,
  });
  const [showInstallDialog, setShowInstallDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [installProgress, setInstallProgress] = useState(0);

  // Check if app is already installed
  useEffect(() => {
    const checkInstalled = () => {
      const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                         (window.navigator as any).standalone ||
                         document.referrer.includes('android-app://');
      
      setPwaState(prev => ({ ...prev, isInstalled }));
    };

    checkInstalled();
    window.addEventListener('appinstalled', checkInstalled);
    
    return () => window.removeEventListener('appinstalled', checkInstalled);
  }, []);

  // Listen for install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setPwaState(prev => ({
        ...prev,
        isInstallable: true,
        installPrompt: e,
      }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setPwaState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setPwaState(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check for updates
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SW_UPDATE_AVAILABLE') {
          setPwaState(prev => ({ ...prev, updateAvailable: true }));
          setShowUpdateDialog(true);
        }
      });
    }
  }, []);

  // Handle install
  const handleInstall = useCallback(async () => {
    if (!pwaState.installPrompt) return;

    setInstallProgress(0);
    const progressInterval = setInterval(() => {
      setInstallProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    try {
      const result = await pwaState.installPrompt.prompt();
      console.log('Install prompt result:', result);
      
      setPwaState(prev => ({
        ...prev,
        isInstallable: false,
        installPrompt: null,
      }));
      
      setInstallProgress(100);
      setShowInstallDialog(false);
    } catch (error) {
      console.error('Install failed:', error);
    }
  }, [pwaState.installPrompt]);

  // Handle update
  const handleUpdate = useCallback(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          window.location.reload();
        }
      });
    }
    setShowUpdateDialog(false);
  }, []);

  // Show install prompt after delay
  useEffect(() => {
    if (isMobile && pwaState.isInstallable && !pwaState.isInstalled) {
      const timer = setTimeout(() => {
        setShowInstallDialog(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isMobile, pwaState.isInstallable, pwaState.isInstalled]);

  return (
    <Box sx={{ position: 'relative' }}>
      {children}

      {/* Install Dialog */}
      <Dialog
        open={showInstallDialog}
        onClose={() => setShowInstallDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SmartphoneIcon />
          Install CreatorFlow
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            Install CreatorFlow on your device for a better experience:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <ZapIcon sx={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Faster loading" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <WifiOffIcon sx={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Works offline" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ShieldIcon sx={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Secure access" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <StarIcon sx={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Native app feel" />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowInstallDialog(false)} color="inherit">
            Not Now
          </Button>
          <Button
            onClick={handleInstall}
            variant="contained"
            sx={{ bgcolor: 'white', color: 'primary.main' }}
            startIcon={<DownloadIcon />}
          >
            Install
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Dialog */}
      <Dialog
        open={showUpdateDialog}
        onClose={() => setShowUpdateDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircleIcon color="primary" />
          Update Available
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            A new version of CreatorFlow is available with improvements and bug fixes.
          </Typography>
          <Alert severity="info" sx={{ mt: 2 }}>
            <AlertTitle>What's New</AlertTitle>
            • Performance improvements
            • New features
            • Bug fixes
            • Enhanced security
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUpdateDialog(false)}>
            Later
          </Button>
          <Button onClick={handleUpdate} variant="contained" startIcon={<DownloadIcon />}>
            Update Now
          </Button>
        </DialogActions>
      </Dialog>

      {/* Offline Indicator */}
      {!pwaState.isOnline && (
        <Fade in={!pwaState.isOnline}>
          <Alert
            severity="warning"
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1400,
              borderRadius: 0,
            }}
            icon={<WifiOffIcon />}
          >
            <AlertTitle>You're offline</AlertTitle>
            Some features may not be available. We'll sync when you're back online.
          </Alert>
        </Fade>
      )}

      {/* Install Progress */}
      {installProgress > 0 && installProgress < 100 && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1500,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            p: 1,
            textAlign: 'center',
          }}
        >
          <Typography variant="body2">
            Installing CreatorFlow... {installProgress}%
          </Typography>
        </Box>
      )}

      {/* PWA Status Indicator */}
      {isMobile && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1300,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          {pwaState.isInstalled && (
            <Tooltip title="Installed as PWA">
              <Chip
                icon={<CheckCircleIcon />}
                label="PWA"
                color="success"
                size="small"
                sx={{ bgcolor: 'background.paper' }}
              />
            </Tooltip>
          )}
          
          {pwaState.isInstallable && !pwaState.isInstalled && (
            <Tooltip title="Install CreatorFlow">
              <IconButton
                onClick={() => setShowInstallDialog(true)}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  boxShadow: 2,
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )}
    </Box>
  );
};
