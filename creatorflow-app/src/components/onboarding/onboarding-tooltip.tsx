"use client";

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Chip,
  Button,
  Collapse,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Lightbulb,
  Close,
  CheckCircle,
  ArrowForwardIos,
  Help
} from '@mui/icons-material';
import { designTokens } from '@/lib/design-system';

interface OnboardingTooltipProps {
  id: string;
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
  onComplete?: () => void;
  onSkip?: () => void;
  showActions?: boolean;
  variant?: 'tip' | 'guide' | 'warning' | 'success';
}

export default function OnboardingTooltip({
  id,
  title,
  description,
  position = 'bottom',
  children,
  onComplete,
  onSkip,
  showActions = true,
  variant = 'tip'
}: OnboardingTooltipProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleComplete = () => {
    setIsVisible(false);
    onComplete?.();
  };

  const handleSkip = () => {
    setIsVisible(false);
    onSkip?.();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          background: designTokens.colors.success[50],
          borderColor: designTokens.colors.success[200],
          iconColor: designTokens.colors.success[600],
          titleColor: designTokens.colors.success[700]
        };
      case 'warning':
        return {
          background: designTokens.colors.warning[50],
          borderColor: designTokens.colors.warning[200],
          iconColor: designTokens.colors.warning[600],
          titleColor: designTokens.colors.warning[700]
        };
      case 'guide':
        return {
          background: designTokens.colors.ai[50],
          borderColor: designTokens.colors.ai[200],
          iconColor: designTokens.colors.ai[600],
          titleColor: designTokens.colors.ai[700]
        };
      default:
        return {
          background: designTokens.colors.info[50],
          borderColor: designTokens.colors.info[200],
          iconColor: designTokens.colors.info[600],
          titleColor: designTokens.colors.info[700]
        };
    }
  };

  const variantStyles = getVariantStyles();

  const getPositionStyles = () => {
    const baseStyles = {
      position: 'absolute' as const,
      zIndex: designTokens.zIndex.tooltip,
      maxWidth: isMobile ? 'calc(100vw - 32px)' : 320,
      minWidth: 280
    };

    switch (position) {
      case 'top':
        return {
          ...baseStyles,
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          mb: 2
        };
      case 'bottom':
        return {
          ...baseStyles,
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          mt: 2
        };
      case 'left':
        return {
          ...baseStyles,
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          mr: 2
        };
      case 'right':
        return {
          ...baseStyles,
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          ml: 2
        };
      default:
        return baseStyles;
    }
  };

  if (!isVisible) {
    return <>{children}</>;
  }

  return (
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
      {children}
      
      <Paper
        elevation={8}
        sx={{
          ...getPositionStyles(),
          background: variantStyles.background,
          border: `2px solid ${variantStyles.borderColor}`,
          borderRadius: designTokens.borderRadius.lg,
          p: 2,
          boxShadow: designTokens.shadows.lg
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: `${variantStyles.iconColor}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: variantStyles.iconColor,
              flexShrink: 0
            }}
          >
            {variant === 'success' ? (
              <CheckCircle sx={{ fontSize: 18 }} />
            ) : variant === 'guide' ? (
              <Help sx={{ fontSize: 18 }} />
            ) : (
              <Lightbulb sx={{ fontSize: 18 }} />
            )}
          </Box>
          
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: designTokens.typography.fontWeight.semibold,
                color: variantStyles.titleColor,
                mb: 0.5
              }}
            >
              {title}
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                color: designTokens.colors.neutral[700],
                lineHeight: 1.5
              }}
            >
              {description}
            </Typography>
          </Box>
          
          <IconButton
            size="small"
            onClick={() => setIsVisible(false)}
            sx={{
              color: designTokens.colors.neutral[500],
              p: 0.5,
              '&:hover': {
                background: `${designTokens.colors.neutral[500]}15`
              }
            }}
          >
            <Close sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>

        {/* Actions */}
        {showActions && (
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            {onSkip && (
              <Button
                size="small"
                variant="outlined"
                onClick={handleSkip}
                sx={{
                  borderColor: designTokens.colors.neutral[300],
                  color: designTokens.colors.neutral[600],
                  fontSize: '0.75rem',
                  py: 0.5,
                  px: 1.5
                }}
              >
                Skip
              </Button>
            )}
            
            {onComplete && (
              <Button
                size="small"
                variant="contained"
                onClick={handleComplete}
                endIcon={<ArrowForwardIos sx={{ fontSize: 14 }} />}
                sx={{
                  background: variantStyles.iconColor,
                  color: 'white',
                  fontSize: '0.75rem',
                  py: 0.5,
                  px: 1.5,
                  '&:hover': {
                    background: variantStyles.iconColor,
                    opacity: 0.9
                  }
                }}
              >
                Got it
              </Button>
            )}
          </Box>
        )}

        {/* Expandable Content */}
        <Collapse in={isExpanded}>
          <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${designTokens.colors.neutral[200]}` }}>
            <Typography variant="caption" sx={{ color: designTokens.colors.neutral[600] }}>
              Additional tips and guidance can be expanded here...
            </Typography>
          </Box>
        </Collapse>
      </Paper>
    </Box>
  );
}

// Higher-order component for wrapping elements with tooltips
export function withOnboardingTooltip<P extends object>(
  Component: React.ComponentType<P>,
  tooltipProps: Omit<OnboardingTooltipProps, 'children'>
) {
  return function WrappedComponent(props: P) {
    return (
      <OnboardingTooltip {...tooltipProps}>
        <Component {...props} />
      </OnboardingTooltip>
    );
  };
}
