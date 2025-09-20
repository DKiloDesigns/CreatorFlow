'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Chip,
  Button,
  Fade,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Lightbulb,
  X,
  ChevronRight,
  ChevronLeft,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

interface ContextualTip {
  id: string;
  title: string;
  content: string;
  category: string;
  page: string;
  priority: 'low' | 'medium' | 'high';
  dismissible: boolean;
  actionText?: string;
  actionUrl?: string;
}

interface ContextualTipsProps {
  currentPage: string;
  onTipAction?: (tipId: string, action: string) => void;
  className?: string;
}

// Tip database
const TIPS_DATABASE: ContextualTip[] = [
  {
    id: 'dashboard-welcome',
    title: 'Welcome to CreatorFlow! 🚀',
    content: 'Start by connecting your social media accounts to begin managing all your content from one place.',
    category: 'onboarding',
    page: 'dashboard',
    priority: 'high',
    dismissible: true,
    actionText: 'Connect Accounts',
    actionUrl: '/dashboard/settings/accounts'
  },
  {
    id: 'content-creation-tip',
    title: 'Pro Tip: Use AI Content Generator',
    content: 'Try our AI content generator to create engaging posts faster. It can suggest captions, hashtags, and even generate images!',
    category: 'feature',
    page: 'content',
    priority: 'medium',
    dismissible: true,
    actionText: 'Try AI Generator',
    actionUrl: '/dashboard/ai-content'
  },
  {
    id: 'scheduling-optimization',
    title: 'Optimize Your Posting Times',
    content: 'Use our AI-powered optimal timing feature to post when your audience is most active. This can increase engagement by up to 40%!',
    category: 'optimization',
    page: 'scheduling',
    priority: 'medium',
    dismissible: true,
    actionText: 'Set Optimal Times',
    actionUrl: '/dashboard/scheduling/optimize'
  },
  {
    id: 'analytics-insight',
    title: 'Check Your Analytics',
    content: 'Your latest post performed 25% better than average! Check your analytics to see what made it successful.',
    category: 'insight',
    page: 'analytics',
    priority: 'low',
    dismissible: true,
    actionText: 'View Analytics',
    actionUrl: '/dashboard/analytics'
  },
  {
    id: 'team-collaboration',
    title: 'Invite Your Team',
    content: 'Collaborate with team members by inviting them to your CreatorFlow workspace. You can assign roles and manage permissions.',
    category: 'collaboration',
    page: 'team',
    priority: 'medium',
    dismissible: true,
    actionText: 'Invite Team',
    actionUrl: '/dashboard/team/invite'
  },
  {
    id: 'mobile-app-tip',
    title: 'Download Our Mobile App',
    content: 'Manage your social media on the go with our mobile app. Available for iOS and Android with full feature parity.',
    category: 'mobile',
    page: 'dashboard',
    priority: 'low',
    dismissible: true,
    actionText: 'Download App',
    actionUrl: '/mobile'
  },
  {
    id: 'hashtag-research',
    title: 'Research Trending Hashtags',
    content: 'Use our hashtag research tool to find trending and relevant hashtags for your content. This can significantly boost your reach.',
    category: 'feature',
    page: 'content',
    priority: 'medium',
    dismissible: true,
    actionText: 'Research Hashtags',
    actionUrl: '/dashboard/tools/hashtags'
  },
  {
    id: 'content-calendar-tip',
    title: 'Plan Your Content Calendar',
    content: 'Use our content calendar to plan your posts weeks in advance. This helps maintain consistency and saves time.',
    category: 'planning',
    page: 'calendar',
    priority: 'medium',
    dismissible: true,
    actionText: 'Open Calendar',
    actionUrl: '/dashboard/calendar'
  }
];

export function ContextualTips({ currentPage, onTipAction, className }: ContextualTipsProps) {
  const [currentTip, setCurrentTip] = useState<ContextualTip | null>(null);
  const [tipIndex, setTipIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [dismissedTips, setDismissedTips] = useState<Set<string>>(new Set());
  const [userFeedback, setUserFeedback] = useState<Map<string, 'helpful' | 'not-helpful'>>(new Map());
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Get tips for current page
  const getTipsForPage = useCallback((page: string) => {
    return TIPS_DATABASE.filter(tip => 
      tip.page === page && !dismissedTips.has(tip.id)
    ).sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }, [dismissedTips]);

  // Cycle through tips
  const cycleTips = useCallback(() => {
    const pageTips = getTipsForPage(currentPage);
    if (pageTips.length === 0) {
      setIsVisible(false);
      return;
    }

    const nextIndex = (tipIndex + 1) % pageTips.length;
    setTipIndex(nextIndex);
    setCurrentTip(pageTips[nextIndex]);
    setIsVisible(true);
  }, [currentPage, tipIndex, getTipsForPage]);

  // Initialize tips for page
  useEffect(() => {
    const pageTips = getTipsForPage(currentPage);
    if (pageTips.length > 0) {
      setCurrentTip(pageTips[0]);
      setTipIndex(0);
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [currentPage, getTipsForPage]);

  // Auto-cycle tips every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      cycleTips();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [cycleTips]);

  // Load dismissed tips from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('creatorflow-dismissed-tips');
    if (saved) {
      try {
        setDismissedTips(new Set(JSON.parse(saved)));
      } catch (error) {
        console.error('Failed to load dismissed tips:', error);
      }
    }
  }, []);

  // Save dismissed tips to localStorage
  const saveDismissedTips = useCallback((tips: Set<string>) => {
    localStorage.setItem('creatorflow-dismissed-tips', JSON.stringify([...tips]));
  }, []);

  const handleDismiss = useCallback(() => {
    if (!currentTip) return;
    
    const newDismissed = new Set(dismissedTips);
    newDismissed.add(currentTip.id);
    setDismissedTips(newDismissed);
    saveDismissedTips(newDismissed);
    
    setIsVisible(false);
    onTipAction?.(currentTip.id, 'dismissed');
  }, [currentTip, dismissedTips, saveDismissedTips, onTipAction]);

  const handleFeedback = useCallback((feedback: 'helpful' | 'not-helpful') => {
    if (!currentTip) return;
    
    const newFeedback = new Map(userFeedback);
    newFeedback.set(currentTip.id, feedback);
    setUserFeedback(newFeedback);
    onTipAction?.(currentTip.id, feedback);
  }, [currentTip, userFeedback, onTipAction]);

  const handleAction = useCallback(() => {
    if (!currentTip?.actionUrl) return;
    
    onTipAction?.(currentTip.id, 'action-clicked');
    window.open(currentTip.actionUrl, '_blank');
  }, [currentTip, onTipAction]);

  const handleNext = useCallback(() => {
    cycleTips();
  }, [cycleTips]);

  if (!isVisible || !currentTip) {
    return null;
  }

  return (
    <Box className={className} sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}>
      <Fade in={isVisible} timeout={300}>
        <Paper
          elevation={8}
          sx={{
            maxWidth: isMobile ? 'calc(100vw - 32px)' : 400,
            p: 3,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
            }
          }}
        >
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2, position: 'relative', zIndex: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                flexShrink: 0
              }}
            >
              <Lightbulb size={18} />
            </Box>
            
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                {currentTip.title}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.4 }}>
                {currentTip.content}
              </Typography>
            </Box>
            
            {currentTip.dismissible && (
              <IconButton
                size="small"
                onClick={handleDismiss}
                sx={{ 
                  color: 'white',
                  ml: 1,
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
                }}
              >
                <X size={16} />
              </IconButton>
            )}
          </Box>

          {/* Category and Priority */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2, position: 'relative', zIndex: 1 }}>
            <Chip 
              label={currentTip.category} 
              size="small" 
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontSize: '0.75rem'
              }}
            />
            <Chip 
              label={currentTip.priority} 
              size="small" 
              sx={{ 
                bgcolor: currentTip.priority === 'high' ? 'rgba(255, 99, 99, 0.3)' : 
                        currentTip.priority === 'medium' ? 'rgba(255, 193, 7, 0.3)' : 
                        'rgba(40, 167, 69, 0.3)',
                color: 'white',
                fontSize: '0.75rem'
              }}
            />
          </Box>

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', position: 'relative', zIndex: 1 }}>
            {currentTip.actionText && currentTip.actionUrl && (
              <Button
                variant="contained"
                size="small"
                onClick={handleAction}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' },
                  textTransform: 'none',
                  fontSize: '0.875rem'
                }}
              >
                {currentTip.actionText}
              </Button>
            )}
            
            <Box sx={{ display: 'flex', gap: 0.5, ml: 'auto' }}>
              <IconButton
                size="small"
                onClick={() => handleFeedback('helpful')}
                sx={{ 
                  color: userFeedback.get(currentTip.id) === 'helpful' ? '#4caf50' : 'white',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
                }}
              >
                <ThumbsUp size={16} />
              </IconButton>
              
              <IconButton
                size="small"
                onClick={() => handleFeedback('not-helpful')}
                sx={{ 
                  color: userFeedback.get(currentTip.id) === 'not-helpful' ? '#f44336' : 'white',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
                }}
              >
                <ThumbsDown size={16} />
              </IconButton>
              
              <IconButton
                size="small"
                onClick={handleNext}
                sx={{ 
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
                }}
              >
                <ChevronRight size={16} />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
}
