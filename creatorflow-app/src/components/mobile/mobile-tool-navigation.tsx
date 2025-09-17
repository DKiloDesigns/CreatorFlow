/**
 * Mobile Tool Navigation
 * Bottom tab navigation optimized for mobile devices
 */

'use client';

import React, { useState } from 'react';
import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Badge,
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  IconButton,
} from '@mui/material';
import {
  Home as HomeIcon,
  Calculate as CalculateIcon,
  Tag as TagIcon,
  Calendar as CalendarIcon,
  Assessment as AssessmentIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileToolNavigationProps {
  onInstallPrompt?: () => void;
  showInstallButton?: boolean;
}

const TOOLS = [
  {
    id: 'home',
    label: 'Home',
    icon: <HomeIcon />,
    path: '/tools',
    color: '#0066CC'
  },
  {
    id: 'calculator',
    label: 'Calculator',
    icon: <CalculateIcon />,
    path: '/tools/social-media-calculator',
    color: '#4CAF50'
  },
  {
    id: 'hashtag',
    label: 'Hashtags',
    icon: <TagIcon />,
    path: '/tools/hashtag-research',
    color: '#FF9800'
  },
  {
    id: 'templates',
    label: 'Templates',
    icon: <CalendarIcon />,
    path: '/tools/calendar-templates',
    color: '#9C27B0'
  },
  {
    id: 'audit',
    label: 'Audit',
    icon: <AssessmentIcon />,
    path: '/tools/social-media-audit',
    color: '#F44336'
  },
  {
    id: 'timing',
    label: 'Timing',
    icon: <ScheduleIcon />,
    path: '/tools/posting-time-optimizer',
    color: '#2196F3'
  },
  {
    id: 'predictor',
    label: 'Predictor',
    icon: <TrendingUpIcon />,
    path: '/tools/content-predictor',
    color: '#E91E63'
  }
];

const QUICK_ACTIONS = [
  {
    name: 'Download All Tools',
    icon: <DownloadIcon />,
    action: 'download'
  },
  {
    name: 'Share Tools',
    icon: <ShareIcon />,
    action: 'share'
  },
  {
    name: 'Settings',
    icon: <SettingsIcon />,
    action: 'settings'
  }
];

export default function MobileToolNavigation({ onInstallPrompt, showInstallButton = false }: MobileToolNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);

  // Find current tool index
  const currentToolIndex = TOOLS.findIndex(tool => tool.path === pathname);
  const currentValue = currentToolIndex >= 0 ? currentToolIndex : 0;

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    const tool = TOOLS[newValue];
    if (tool) {
      router.push(tool.path);
    }
  };

  const handleQuickAction = (action: string) => {
    setSpeedDialOpen(false);
    
    switch (action) {
      case 'download':
        // Trigger download of all tools data
        downloadAllToolsData();
        break;
      case 'share':
        // Share tools
        shareTools();
        break;
      case 'settings':
        // Open settings
        router.push('/dashboard/settings');
        break;
    }
  };

  const downloadAllToolsData = () => {
    const data = {
      tools: TOOLS,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'creatorflow-tools-data.json';
    a.click();
  };

  const shareTools = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'CreatorFlow Free Tools',
          text: 'Check out these amazing free social media tools!',
          url: window.location.origin + '/tools'
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.origin + '/tools');
    }
  };

  const handleInstall = () => {
    if (onInstallPrompt) {
      onInstallPrompt();
    }
  };

  return (
    <>
      {/* Bottom Navigation */}
      <Paper 
        sx={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          zIndex: 1000,
          display: { xs: 'block', md: 'none' }
        }} 
        elevation={3}
      >
        <BottomNavigation
          value={currentValue}
          onChange={handleChange}
          showLabels
          sx={{
            '& .MuiBottomNavigationAction-root': {
              minWidth: 'auto',
              padding: '6px 0',
              '&.Mui-selected': {
                color: 'primary.main',
              },
            },
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.75rem',
              fontWeight: 500,
              '&.Mui-selected': {
                fontSize: '0.75rem',
              },
            },
          }}
        >
          {TOOLS.slice(0, 4).map((tool, index) => (
            <BottomNavigationAction
              key={tool.id}
              label={tool.label}
              icon={
                <Box sx={{ color: tool.color }}>
                  {tool.icon}
                </Box>
              }
            />
          ))}
        </BottomNavigation>
      </Paper>

      {/* Speed Dial for additional tools */}
      <SpeedDial
        ariaLabel="Quick Actions"
        sx={{ 
          position: 'fixed', 
          bottom: 80, 
          right: 16,
          display: { xs: 'flex', md: 'none' }
        }}
        icon={<SpeedDialIcon />}
        onClose={() => setSpeedDialOpen(false)}
        onOpen={() => setSpeedDialOpen(true)}
        open={speedDialOpen}
      >
        {TOOLS.slice(4).map((tool) => (
          <SpeedDialAction
            key={tool.id}
            icon={tool.icon}
            tooltipTitle={tool.label}
            onClick={() => {
              setSpeedDialOpen(false);
              router.push(tool.path);
            }}
            sx={{ color: tool.color }}
          />
        ))}
        
        {QUICK_ACTIONS.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => handleQuickAction(action.action)}
          />
        ))}
      </SpeedDial>

      {/* Install Prompt Button */}
      {showInstallButton && (
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 16,
            left: 16,
            display: { xs: 'flex', md: 'none' }
          }}
          onClick={handleInstall}
        >
          <DownloadIcon />
        </Fab>
      )}

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        <Box sx={{ width: 280, p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">CreatorFlow Tools</Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Divider sx={{ mb: 2 }} />
          
          <List>
            {TOOLS.map((tool) => (
              <ListItem
                key={tool.id}
                button
                onClick={() => {
                  router.push(tool.path);
                  setDrawerOpen(false);
                }}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  backgroundColor: pathname === tool.path ? 'primary.light' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                  }
                }}
              >
                <ListItemIcon sx={{ color: tool.color }}>
                  {tool.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={tool.label}
                  primaryTypographyProps={{
                    fontWeight: pathname === tool.path ? 600 : 400
                  }}
                />
              </ListItem>
            ))}
          </List>
          
          <Divider sx={{ my: 2 }} />
          
          <List>
            {QUICK_ACTIONS.map((action) => (
              <ListItem
                key={action.name}
                button
                onClick={() => {
                  handleQuickAction(action.action);
                  setDrawerOpen(false);
                }}
              >
                <ListItemIcon>
                  {action.icon}
                </ListItemIcon>
                <ListItemText primary={action.name} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Mobile Menu Button */}
      <IconButton
        sx={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 1001,
          display: { xs: 'flex', md: 'none' },
          backgroundColor: 'background.paper',
          boxShadow: 2,
          '&:hover': {
            backgroundColor: 'background.paper',
          }
        }}
        onClick={() => setDrawerOpen(true)}
      >
        <MenuIcon />
      </IconButton>
    </>
  );
}
