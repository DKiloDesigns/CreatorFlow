/**
 * Command Palette Component
 * Global command search with Cmd+K shortcut
 */

'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Fade,
  alpha,
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Keyboard as KeyboardIcon,
  ArrowForward as ArrowForwardIcon,
  ContentCopy as ContentCopyIcon,
  Schedule as ScheduleIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Palette as PaletteIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Help as HelpIcon,
  ExitToApp as ExitToAppIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface Command {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  keywords: string[];
  action: (router: any) => void;
  shortcut?: string;
  isPro?: boolean;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

// Define all available commands outside component to prevent infinite loops
const COMMANDS: Command[] = [
    // Navigation Commands
    {
      id: 'nav-dashboard',
      title: 'Go to Dashboard',
      description: 'Navigate to the main dashboard',
      icon: <DashboardIcon />,
      category: 'Navigation',
      keywords: ['dashboard', 'home', 'main'],
      action: (router) => router.push('/dashboard'),
      shortcut: 'G D',
    },
    {
      id: 'nav-analytics',
      title: 'Go to Analytics',
      description: 'View analytics and performance metrics',
      icon: <AnalyticsIcon />,
      category: 'Navigation',
      keywords: ['analytics', 'metrics', 'performance', 'stats'],
      action: (router) => router.push('/dashboard/analytics'),
      shortcut: 'G A',
      isPro: true,
    },
    {
      id: 'nav-content',
      title: 'Go to Content',
      description: 'Manage content and posts',
      icon: <ContentCopyIcon />,
      category: 'Navigation',
      keywords: ['content', 'posts', 'create', 'manage'],
      action: (router) => router.push('/dashboard/content'),
      shortcut: 'G C',
    },
    {
      id: 'nav-scheduling',
      title: 'Go to Scheduling',
      description: 'Schedule and manage posts',
      icon: <ScheduleIcon />,
      category: 'Navigation',
      keywords: ['schedule', 'calendar', 'planning', 'timing'],
      action: (router) => router.push('/dashboard/scheduling'),
      shortcut: 'G S',
    },
    {
      id: 'nav-media',
      title: 'Go to Media Library',
      description: 'Manage media files and assets',
      icon: <UploadIcon />,
      category: 'Navigation',
      keywords: ['media', 'files', 'images', 'videos', 'assets'],
      action: (router) => router.push('/dashboard/media'),
      shortcut: 'G M',
    },
    {
      id: 'nav-settings',
      title: 'Go to Settings',
      description: 'Configure application settings',
      icon: <SettingsIcon />,
      category: 'Navigation',
      keywords: ['settings', 'preferences', 'config', 'options'],
      action: (router) => router.push('/dashboard/settings'),
      shortcut: 'G ,',
    },

    // Content Actions
    {
      id: 'create-post',
      title: 'Create New Post',
      description: 'Start creating a new social media post',
      icon: <AddIcon />,
      category: 'Content',
      keywords: ['create', 'new', 'post', 'content'],
      action: (router) => router.push('/dashboard/content?action=create'),
      shortcut: 'C N',
    },
    {
      id: 'bulk-schedule',
      title: 'Bulk Schedule Posts',
      description: 'Schedule multiple posts at once',
      icon: <ScheduleIcon />,
      category: 'Content',
      keywords: ['bulk', 'schedule', 'multiple', 'batch'],
      action: (router) => router.push('/dashboard/scheduling?action=bulk'),
      shortcut: 'C B',
    },
    {
      id: 'import-content',
      title: 'Import Content',
      description: 'Import content from external sources',
      icon: <DownloadIcon />,
      category: 'Content',
      keywords: ['import', 'upload', 'external', 'csv'],
      action: (router) => router.push('/dashboard/import-export?action=import'),
      shortcut: 'C I',
    },
    {
      id: 'export-content',
      title: 'Export Content',
      description: 'Export content to external formats',
      icon: <UploadIcon />,
      category: 'Content',
      keywords: ['export', 'download', 'backup', 'csv'],
      action: (router) => router.push('/dashboard/import-export?action=export'),
      shortcut: 'C E',
    },

    // AI Tools
    {
      id: 'ai-generate',
      title: 'AI Content Generator',
      description: 'Generate content using AI',
      icon: <PaletteIcon />,
      category: 'AI Tools',
      keywords: ['ai', 'generate', 'content', 'automation'],
      action: (router) => router.push('/dashboard/ai-tools'),
      shortcut: 'A G',
      isPro: true,
    },
    {
      id: 'ai-analyze',
      title: 'AI Analytics',
      description: 'Get AI-powered insights and recommendations',
      icon: <AnalyticsIcon />,
      category: 'AI Tools',
      keywords: ['ai', 'analyze', 'insights', 'recommendations'],
      action: (router) => router.push('/dashboard/analytics/advanced'),
      shortcut: 'A A',
      isPro: true,
    },

    // Account & Profile
    {
      id: 'profile',
      title: 'View Profile',
      description: 'View and edit your profile',
      icon: <PersonIcon />,
      category: 'Account',
      keywords: ['profile', 'account', 'user', 'me'],
      action: (router) => router.push('/dashboard/profile'),
      shortcut: 'P P',
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'View and manage notifications',
      icon: <NotificationsIcon />,
      category: 'Account',
      keywords: ['notifications', 'alerts', 'messages'],
      action: (router) => router.push('/dashboard/notifications'),
      shortcut: 'P N',
    },
    {
      id: 'security',
      title: 'Security Settings',
      description: 'Manage security and privacy settings',
      icon: <SecurityIcon />,
      category: 'Account',
      keywords: ['security', 'privacy', 'password', '2fa'],
      action: (router) => router.push('/dashboard/security'),
      shortcut: 'P S',
    },

    // Help & Support
    {
      id: 'help',
      title: 'Help Center',
      description: 'Get help and documentation',
      icon: <HelpIcon />,
      category: 'Help',
      keywords: ['help', 'support', 'docs', 'documentation'],
      action: (router) => router.push('/support'),
      shortcut: '?',
    },
    {
      id: 'shortcuts',
      title: 'Keyboard Shortcuts',
      description: 'View all available keyboard shortcuts',
      icon: <KeyboardIcon />,
      category: 'Help',
      keywords: ['shortcuts', 'keyboard', 'hotkeys', 'keys'],
      action: () => {
        // This would open a shortcuts modal
        console.log('Show keyboard shortcuts');
      },
      shortcut: '? K',
    },
  ];

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Filter commands based on query using useMemo to prevent infinite loops
  const filteredCommands = useMemo(() => {
    if (!query.trim()) {
      return COMMANDS;
    } else {
      const searchTerm = query.toLowerCase();
      return COMMANDS.filter(command => 
        command.title.toLowerCase().includes(searchTerm) ||
        command.description.toLowerCase().includes(searchTerm) ||
        command.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm)) ||
        command.category.toLowerCase().includes(searchTerm)
      );
    }
  }, [query]);

  // Reset selected index when query changes - using useRef to prevent dependency issues
  const prevQueryRef = useRef(query);
  useEffect(() => {
    if (prevQueryRef.current !== query) {
      setSelectedIndex(0);
      prevQueryRef.current = query;
    }
  }, [query]);

  // Handle keyboard navigation - simplified to prevent dependency loops
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!open) return;

    // Get current filtered commands at the time of the event
    const currentFilteredCommands = query.trim() 
      ? COMMANDS.filter(command => {
          const searchTerm = query.toLowerCase();
          return command.title.toLowerCase().includes(searchTerm) ||
                 command.description.toLowerCase().includes(searchTerm) ||
                 command.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm)) ||
                 command.category.toLowerCase().includes(searchTerm);
        })
      : COMMANDS;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => 
          prev < currentFilteredCommands.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : currentFilteredCommands.length - 1
        );
        break;
      case 'Enter':
        event.preventDefault();
        if (currentFilteredCommands[selectedIndex]) {
          currentFilteredCommands[selectedIndex].action(router);
          onClose();
        }
        break;
      case 'Escape':
        event.preventDefault();
        onClose();
        break;
    }
  }, [open, query, selectedIndex, router, onClose]);

  // Focus input when dialog opens
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setQuery('');
      setSelectedIndex(0);
      prevQueryRef.current = '';
    }
  }, [open]);

  // Add keyboard event listeners
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Group commands by category using useMemo to prevent recalculation
  const groupedCommands = useMemo(() => {
    return filteredCommands.reduce((acc, command) => {
      if (!acc[command.category]) {
        acc[command.category] = [];
      }
      acc[command.category].push(command);
      return acc;
    }, {} as Record<string, Command[]>);
  }, [filteredCommands]);

  const handleCommandClick = (command: Command) => {
    command.action(router);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '80vh',
          overflow: 'hidden',
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SearchIcon color="primary" />
          <Typography variant="h6" component="div">
            Command Palette
          </Typography>
          <Chip 
            label="⌘K" 
            size="small" 
            variant="outlined" 
            sx={{ ml: 'auto' }}
          />
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 2, pb: 1 }}>
          <TextField
            ref={inputRef}
            fullWidth
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: query && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setQuery('')}
                    edge="end"
                  >
                    <CloseIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
        </Box>

        <Box sx={{ maxHeight: '60vh', overflow: 'auto' }}>
          {Object.entries(groupedCommands).map(([category, categoryCommands]) => (
            <Box key={category}>
              <Box sx={{ px: 2, py: 1, bgcolor: 'grey.50' }}>
                <Typography variant="overline" color="text.secondary">
                  {category}
                </Typography>
              </Box>
              
              <List dense>
                {categoryCommands.map((command, index) => {
                  const globalIndex = filteredCommands.indexOf(command);
                  const isSelected = globalIndex === selectedIndex;
                  
                  return (
                    <ListItem key={command.id} disablePadding>
                      <ListItemButton
                        onClick={() => handleCommandClick(command)}
                        selected={isSelected}
                        sx={{
                          py: 1.5,
                          px: 2,
                          '&.Mui-selected': {
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            '&:hover': {
                              bgcolor: 'primary.dark',
                            },
                            '& .MuiListItemIcon-root': {
                              color: 'primary.contrastText',
                            },
                            '& .MuiListItemText-primary': {
                              color: 'primary.contrastText',
                            },
                            '& .MuiListItemText-secondary': {
                              color: 'primary.contrastText',
                              opacity: 0.8,
                            },
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          {command.icon}
                        </ListItemIcon>
                        
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {command.title}
                              {command.isPro && (
                                <Chip 
                                  label="Pro" 
                                  size="small" 
                                  color="secondary"
                                  sx={{ height: 20, fontSize: '0.7rem' }}
                                />
                              )}
                            </Box>
                          }
                          secondary={command.description}
                        />
                        
                        {command.shortcut && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {command.shortcut.split(' ').map((key, i) => (
                              <React.Fragment key={i}>
                                <Chip
                                  label={key}
                                  size="small"
                                  variant="outlined"
                                  sx={{ 
                                    height: 20, 
                                    fontSize: '0.7rem',
                                    minWidth: 20,
                                    '& .MuiChip-label': { px: 0.5 }
                                  }}
                                />
                                {i < command.shortcut!.split(' ').length - 1 && (
                                  <Typography variant="caption" sx={{ mx: 0.5 }}>
                                    +
                                  </Typography>
                                )}
                              </React.Fragment>
                            ))}
                          </Box>
                        )}
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          ))}
          
          {filteredCommands.length === 0 && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">
                No commands found for "{query}"
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

// Hook for using command palette
export function useCommandPalette() {
  const [open, setOpen] = useState(false);

  const openCommandPalette = () => setOpen(true);
  const closeCommandPalette = () => setOpen(false);

  // Global keyboard shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    open,
    openCommandPalette,
    closeCommandPalette,
  };
}

export default CommandPalette;
