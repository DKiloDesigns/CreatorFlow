/**
 * Mobile Optimized Tool Wrapper
 * Provides mobile-specific optimizations for all tools
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Fab,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Badge,
  Chip,
  LinearProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  Favorite as FavoriteIcon,
  Bookmark as BookmarkIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface MobileOptimizedToolProps {
  children: React.ReactNode;
  title: string;
  description: string;
  toolType: string;
  onShare?: () => void;
  onDownload?: () => void;
  onFavorite?: () => void;
  isFavorited?: boolean;
  showProgress?: boolean;
  progress?: number;
  status?: 'idle' | 'loading' | 'success' | 'error';
  errorMessage?: string;
  successMessage?: string;
}

export default function MobileOptimizedTool({
  children,
  title,
  description,
  toolType,
  onShare,
  onDownload,
  onFavorite,
  isFavorited = false,
  showProgress = false,
  progress = 0,
  status = 'idle',
  errorMessage,
  successMessage
}: MobileOptimizedToolProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  const router = useRouter();

  // Handle touch gestures
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      // Swipe left - open drawer
      setDrawerOpen(true);
    } else if (isRightSwipe) {
      // Swipe right - close drawer
      setDrawerOpen(false);
    }
  };

  // Handle status changes
  useEffect(() => {
    if (status === 'success' && successMessage) {
      setSnackbarMessage(successMessage);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } else if (status === 'error' && errorMessage) {
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }, [status, successMessage, errorMessage]);

  const handleShare = async () => {
    if (onShare) {
      onShare();
    } else {
      // Default share behavior
      if (navigator.share) {
        try {
          await navigator.share({
            title: title,
            text: description,
            url: window.location.href
          });
        } catch (error) {
          console.log('Error sharing:', error);
        }
      } else {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
        setSnackbarMessage('Link copied to clipboard!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      }
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    }
    setSnackbarMessage('Download started!');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  const handleFavorite = () => {
    if (onFavorite) {
      onFavorite();
    }
    setSnackbarMessage(isFavorited ? 'Removed from favorites' : 'Added to favorites');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <LinearProgress sx={{ width: '100%' }} />;
      case 'success':
        return <CheckCircleIcon color="success" />;
      case 'error':
        return <ErrorIcon color="error" />;
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pb: { xs: 8, md: 0 }, // Add bottom padding for mobile navigation
        position: 'relative'
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Mobile Header */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          p: 2,
          display: { xs: 'flex', md: 'none' },
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" noWrap>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {description}
          </Typography>
        </Box>
        
        <IconButton onClick={() => setDrawerOpen(true)}>
          <MenuIcon />
        </IconButton>
      </Box>

      {/* Progress Bar */}
      {showProgress && (
        <Box sx={{ position: 'sticky', top: { xs: 64, md: 0 }, zIndex: 99 }}>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ height: 4 }}
          />
        </Box>
      )}

      {/* Status Indicator */}
      {status !== 'idle' && (
        <Box sx={{ position: 'sticky', top: { xs: 68, md: 4 }, zIndex: 99, p: 1 }}>
          {getStatusIcon()}
        </Box>
      )}

      {/* Main Content */}
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        {children}
      </Box>

      {/* Mobile Action Buttons */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 80,
          right: 16,
          zIndex: 1000,
          display: { xs: 'flex', md: 'none' },
          flexDirection: 'column',
          gap: 1
        }}
      >
        <Fab
          size="small"
          color="primary"
          onClick={handleShare}
          sx={{ boxShadow: 3 }}
        >
          <ShareIcon />
        </Fab>
        
        <Fab
          size="small"
          color="secondary"
          onClick={handleDownload}
          sx={{ boxShadow: 3 }}
        >
          <DownloadIcon />
        </Fab>
        
        <Fab
          size="small"
          color={isFavorited ? 'error' : 'default'}
          onClick={handleFavorite}
          sx={{ boxShadow: 3 }}
        >
          <FavoriteIcon />
        </Fab>
      </Box>

      {/* Mobile Drawer */}
      <SwipeableDrawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onOpen={() => setDrawerOpen(true)}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        <Box sx={{ width: 280, p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Tool Options</Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Divider sx={{ mb: 2 }} />
          
          <List>
            <ListItem button onClick={handleShare}>
              <ListItemIcon>
                <ShareIcon />
              </ListItemIcon>
              <ListItemText primary="Share Tool" />
            </ListItem>
            
            <ListItem button onClick={handleDownload}>
              <ListItemIcon>
                <DownloadIcon />
              </ListItemIcon>
              <ListItemText primary="Download Results" />
            </ListItem>
            
            <ListItem button onClick={handleFavorite}>
              <ListItemIcon>
                <FavoriteIcon color={isFavorited ? 'error' : 'inherit'} />
              </ListItemIcon>
              <ListItemText 
                primary={isFavorited ? 'Remove from Favorites' : 'Add to Favorites'} 
              />
            </ListItem>
            
            <ListItem button onClick={() => router.push('/tools')}>
              <ListItemIcon>
                <RefreshIcon />
              </ListItemIcon>
              <ListItemText primary="All Tools" />
            </ListItem>
            
            <ListItem button onClick={() => router.push('/dashboard/settings')}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
          </List>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Tool Type
            </Typography>
            <Chip label={toolType} color="primary" size="small" />
            
            <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
              Status
            </Typography>
            <Chip 
              label={status.charAt(0).toUpperCase() + status.slice(1)} 
              color={status === 'success' ? 'success' : status === 'error' ? 'error' : 'default'}
              size="small"
            />
          </Box>
        </Box>
      </SwipeableDrawer>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
