"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  Badge,
  Fade,
  Zoom,
  Tooltip,
  IconButton,
  Chip,
  Typography,
  Skeleton
} from '@mui/material';
import {
  Home,
  Analytics,
  Add,
  Schedule,
  Settings,
  Psychology,
  TrendingUp,
  Notifications,
  AccountCircle,
  ContentCopy,
  AutoAwesome,
  FlashOn,
  CheckCircle,
  Warning
} from '@/lib/mui-optimized-imports';
import { useRouter, usePathname } from 'next/navigation';
import { designTokens } from '@/lib/design-system';

// Navigation item interface
interface NavigationItem {
  key: string;
  label: string;
  icon: React.ComponentType<any>;
  path: string;
  badge?: number | string;
  aiEnhanced?: boolean;
  proFeature?: boolean;
  notification?: boolean;
  status?: 'success' | 'warning' | 'error' | 'info';
}

// Enhanced bottom navigation props
interface EnhancedBottomNavigationProps {
  showLabels?: boolean;
  compact?: boolean;
  aiInsights?: boolean;
  notifications?: number;
  proStatus?: 'free' | 'pro' | 'enterprise';
  onNavigate?: (path: string) => void;
  className?: string;
}

export default function EnhancedBottomNavigation({
  showLabels = true,
  compact = false,
  aiInsights = true,
  notifications = 0,
  proStatus = 'free',
  onNavigate,
  className
}: EnhancedBottomNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState(0);
  const [aiStatus, setAiStatus] = useState<'idle' | 'processing' | 'success' | 'warning'>('idle');

  // Navigation items with AI enhancements
  const navigationItems: NavigationItem[] = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      path: '/dashboard',
      aiEnhanced: true,
      status: 'success'
    },
    {
      key: 'analytics',
      label: 'Analytics',
      icon: Analytics,
      path: '/dashboard/analytics',
      aiEnhanced: true,
      proFeature: true,
      status: 'success'
    },
    {
      key: 'create',
      label: 'Create',
      icon: Add,
      path: '/dashboard/content',
      aiEnhanced: true,
      status: 'success'
    },
    {
      key: 'schedule',
      label: 'Schedule',
      icon: Schedule,
      path: '/dashboard/scheduling',
      aiEnhanced: true,
      status: 'success'
    },
    {
      key: 'ai-tools',
      label: 'AI Tools',
      icon: Psychology,
      path: '/dashboard/ai-tools',
      aiEnhanced: true,
      proFeature: true,
      status: 'success'
    }
  ];

  // Find current navigation item
  const currentItem = navigationItems.find(item => pathname.startsWith(item.path)) || navigationItems[0];

  // AI status simulation
  useEffect(() => {
    const aiStatusInterval = setInterval(() => {
      const statuses: Array<'idle' | 'processing' | 'success' | 'warning'> = ['idle', 'processing', 'success', 'warning'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      setAiStatus(randomStatus);
    }, 8000);

    return () => clearInterval(aiStatusInterval);
  }, []);

  const handleNavigation = (event: React.SyntheticEvent, newValue: number) => {
    const item = navigationItems[newValue];
    if (item) {
      setValue(newValue);
      if (onNavigate) {
        onNavigate(item.path);
      } else {
        router.push(item.path);
      }
    }
  };

  const getAiStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return designTokens.colors.success[500];
      case 'warning':
        return designTokens.colors.warning[500];
      case 'error':
        return designTokens.colors.error[500];
      case 'processing':
        return designTokens.colors.ai[500];
      default:
        return designTokens.colors.neutral[400];
    }
  };

  const getAiStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle fontSize="small" />;
      case 'warning':
        return <Warning fontSize="small" />;
      case 'processing':
        return <FlashOn fontSize="small" />;
      default:
        return <AutoAwesome fontSize="small" />;
    }
  };

  const renderNavigationAction = (item: NavigationItem, index: number) => {
    const IconComponent = item.icon;
    const isActive = pathname.startsWith(item.path);
    const isProFeature = item.proFeature && proStatus === 'free';

    return (
      <BottomNavigationAction
        key={item.key}
        label={showLabels ? item.label : undefined}
        icon={
          <Box sx={{ position: 'relative' }}>
            {/* Main Icon */}
            <IconComponent 
              sx={{ 
                fontSize: compact ? 20 : 24,
                color: isActive ? designTokens.colors.primary[600] : designTokens.colors.neutral[600],
                transition: designTokens.animation.micro.fadeIn
              }} 
            />
            
            {/* AI Enhancement Indicator */}
            {item.aiEnhanced && aiInsights && (
              <Box
                sx={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: getAiStatusColor(aiStatus),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid white',
                  boxShadow: designTokens.shadows.sm,
                  animation: aiStatus === 'processing' ? 'pulse 2s infinite' : 'none',
                  '@keyframes pulse': {
                    '0%': {
                      boxShadow: `0 0 0 0 ${getAiStatusColor(aiStatus)}40`
                    },
                    '70%': {
                      boxShadow: `0 0 0 6px ${getAiStatusColor(aiStatus)}00`
                    },
                    '100%': {
                      boxShadow: `0 0 0 0 ${getAiStatusColor(aiStatus)}00`
                    }
                  }
                }}
              >
                {getAiStatusIcon(aiStatus)}
              </Box>
            )}
            
            {/* Pro Feature Badge */}
            {isProFeature && (
              <Box
                sx={{
                  position: 'absolute',
                  top: -4,
                  left: -4,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid white',
                  boxShadow: designTokens.shadows.sm
                }}
              >
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontSize: '0.6rem',
                    fontWeight: designTokens.typography.fontWeight.bold,
                    color: 'white',
                    lineHeight: 1
                  }}
                >
                  PRO
                </Typography>
              </Box>
            )}
            
            {/* Notification Badge */}
            {item.notification && notifications > 0 && (
              <Badge
                badgeContent={notifications}
                sx={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  '& .MuiBadge-badge': {
                    backgroundColor: designTokens.colors.error[500],
                    color: 'white',
                    fontSize: '0.6rem',
                    minWidth: 16,
                    height: 16,
                    border: '2px solid white'
                  }
                }}
              />
            )}
          </Box>
        }
        sx={{
          minWidth: compact ? 60 : 80,
          color: isActive ? designTokens.colors.primary[600] : designTokens.colors.neutral[600],
          '&.Mui-selected': {
            color: designTokens.colors.primary[600],
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.75rem',
              fontWeight: designTokens.typography.fontWeight.medium
            }
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.7rem',
            transition: designTokens.animation.micro.fadeIn,
            color: 'inherit'
          },
          '&:hover': {
            color: designTokens.colors.primary[500],
            background: designTokens.colors.primary[50]
          }
        }}
      />
    );
  };

  return (
    <Fade in={true} timeout={300}>
      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: designTokens.zIndex.sticky,
          borderTop: `1px solid ${designTokens.colors.neutral[200]}`,
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}
        className={className}
      >
        {/* AI Status Bar (if enabled) */}
        {aiInsights && (
          <Box
            sx={{
              p: 1,
              background: 'linear-gradient(90deg, rgba(6, 182, 212, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
              borderBottom: `1px solid ${designTokens.colors.neutral[200]}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: getAiStatusColor(aiStatus),
                  animation: aiStatus === 'processing' ? 'pulse 2s infinite' : 'none'
                }}
              />
              <Typography 
                variant="caption" 
                sx={{ 
                  color: designTokens.colors.neutral[700],
                  fontWeight: designTokens.typography.fontWeight.medium,
                  fontSize: '0.7rem'
                }}
              >
                AI Status: {aiStatus.charAt(0).toUpperCase() + aiStatus.slice(1)}
              </Typography>
            </Box>
            
            {proStatus === 'free' && (
              <Chip
                label="Upgrade to Pro"
                size="small"
                variant="outlined"
                sx={{
                  borderColor: designTokens.colors.accent[400],
                  color: designTokens.colors.accent[600],
                  fontSize: '0.6rem',
                  height: 20,
                  '&:hover': {
                    borderColor: designTokens.colors.accent[500],
                    background: designTokens.colors.accent[50]
                  }
                }}
              />
            )}
          </Box>
        )}

        {/* Main Navigation */}
        <BottomNavigation
          value={value}
          onChange={handleNavigation}
          showLabels={showLabels}
          sx={{
            height: compact ? 64 : 72,
            background: 'transparent',
            '& .MuiBottomNavigationAction-root': {
              minWidth: compact ? 60 : 80,
              padding: compact ? '6px 0' : '8px 0'
            }
          }}
        >
          {navigationItems.map((item, index) => renderNavigationAction(item, index))}
        </BottomNavigation>
      </Paper>
    </Fade>
  );
}

// Export types for external use
export type { NavigationItem, EnhancedBottomNavigationProps };
