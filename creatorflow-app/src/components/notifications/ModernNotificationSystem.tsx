'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  IconButton, 
  Badge, 
  Tooltip, 
  Fade,
  Zoom,
  keyframes,
  useTheme,
  alpha
} from '@mui/material';
import { Bell, Sparkles, Zap, Star, Heart } from 'lucide-react';
import Link from 'next/link';

// Enhanced keyframe animations
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-3px) rotate(1deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.15); opacity: 0.9; }
`;

const glow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 5px rgba(99, 102, 241, 0.3),
                0 0 10px rgba(99, 102, 241, 0.1);
  }
  50% { 
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.6),
                0 0 30px rgba(99, 102, 241, 0.4),
                0 0 40px rgba(99, 102, 241, 0.2);
  }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
  50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
`;

const ripple = keyframes`
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(4); opacity: 0; }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-8px); }
  60% { transform: translateY(-4px); }
`;

interface ModernNotificationSystemProps {
  unreadCount?: number;
  isActive?: boolean;
  href?: string;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
  variant?: 'floating' | 'glass' | 'neon' | 'minimal';
  showAnimations?: boolean;
  theme?: 'light' | 'dark' | 'auto';
}

export function ModernNotificationSystem({
  unreadCount = 0,
  isActive = false,
  href = '/dashboard/notifications/enhanced',
  onClick,
  size = 'medium',
  variant = 'floating',
  showAnimations = true,
  theme = 'auto'
}: ModernNotificationSystemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const muiTheme = useTheme();

  // Trigger sparkles when new notifications arrive
  useEffect(() => {
    if (unreadCount > 0 && showAnimations) {
      setShowSparkles(true);
      const timer = setTimeout(() => setShowSparkles(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [unreadCount, showAnimations]);

  const handleClick = () => {
    if (showAnimations) {
      setShowRipple(true);
      setTimeout(() => setShowRipple(false), 600);
    }
    if (onClick) onClick();
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { width: 36, height: 36, minWidth: 36, minHeight: 36 };
      case 'large':
        return { width: 56, height: 56, minWidth: 56, minHeight: 56 };
      default:
        return { width: 44, height: 44, minWidth: 44, minHeight: 44 };
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small': return 16;
      case 'large': return 28;
      default: return 20;
    }
  };

  const getVariantStyles = () => {
    const isDark = theme === 'dark' || (theme === 'auto' && muiTheme.palette.mode === 'dark');
    
    switch (variant) {
      case 'minimal':
        return {
          bgcolor: 'background.paper',
          color: 'text.primary',
          border: '1px solid',
          borderColor: 'divider',
          '&:hover': {
            bgcolor: 'action.hover',
            transform: 'scale(1.05)',
          }
        };
      case 'glass':
        return {
          background: isDark 
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
            : 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: isDark ? 'white' : 'primary.main',
          boxShadow: isDark 
            ? '0 8px 32px rgba(0, 0, 0, 0.3)'
            : '0 8px 32px rgba(99, 102, 241, 0.2)',
          '&:hover': {
            background: isDark 
              ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)'
              : 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
            transform: 'scale(1.1) translateY(-2px)',
            boxShadow: isDark 
              ? '0 12px 40px rgba(0, 0, 0, 0.4)'
              : '0 12px 40px rgba(99, 102, 241, 0.3)',
          }
        };
      case 'neon':
        return {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: '2px solid transparent',
          backgroundClip: 'padding-box',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 'inherit',
            padding: '2px',
            background: 'linear-gradient(135deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3)',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
          },
          animation: showAnimations ? `${glow} 2s ease-in-out infinite` : 'none',
          '&:hover': {
            transform: 'scale(1.15) translateY(-3px)',
            boxShadow: '0 15px 35px rgba(102, 126, 234, 0.6)',
          }
        };
      case 'floating':
      default:
        return {
          background: isActive 
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : isDark 
              ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
              : 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: isActive ? 'white' : (isDark ? 'white' : 'primary.main'),
          boxShadow: isActive 
            ? '0 8px 25px rgba(99, 102, 241, 0.4)'
            : '0 4px 15px rgba(0, 0, 0, 0.1)',
          animation: showAnimations && !isActive ? `${float} 3s ease-in-out infinite` : 'none',
          '&:hover': {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            transform: 'scale(1.1) translateY(-2px)',
            boxShadow: '0 12px 30px rgba(99, 102, 241, 0.5)',
          }
        };
    }
  };

  const getBadgeStyles = () => {
    if (unreadCount === 0) return {};
    
    return {
      '& .MuiBadge-badge': {
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
        color: 'white',
        fontWeight: 700,
        fontSize: '0.75rem',
        minWidth: 20,
        height: 20,
        borderRadius: '10px',
        border: '2px solid white',
        boxShadow: '0 4px 12px rgba(255, 107, 107, 0.4)',
        animation: showAnimations && unreadCount > 0 ? `${pulse} 1.5s ease-in-out infinite` : 'none',
      }
    };
  };

  const iconElement = (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...getSizeStyles()
      }}
    >
      {/* Ripple effect on click */}
      {showRipple && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'rgba(99, 102, 241, 0.3)',
            transform: 'translate(-50%, -50%)',
            animation: `${ripple} 0.6s ease-out`,
            zIndex: 0
          }}
        />
      )}

      {/* Sparkle effects for creative variants */}
      {showAnimations && showSparkles && (variant === 'floating' || variant === 'neon') && (
        <>
          <Fade in={showSparkles} timeout={500}>
            <Box
              sx={{
                position: 'absolute',
                top: -8,
                right: -8,
                animation: `${sparkle} 0.8s ease-in-out`,
                zIndex: 2
              }}
            >
              <Sparkles size={12} color="#ffd700" />
            </Box>
          </Fade>
          <Fade in={showSparkles} timeout={1000}>
            <Box
              sx={{
                position: 'absolute',
                bottom: -6,
                left: -6,
                animation: `${sparkle} 1s ease-in-out`,
                zIndex: 2
              }}
            >
              <Zap size={10} color="#ff6b6b" />
            </Box>
          </Fade>
          <Fade in={showSparkles} timeout={1500}>
            <Box
              sx={{
                position: 'absolute',
                top: -4,
                left: -4,
                animation: `${sparkle} 1.2s ease-in-out`,
                zIndex: 2
              }}
            >
              <Star size={8} color="#48dbfb" />
            </Box>
          </Fade>
        </>
      )}

      {/* Main icon */}
      <Bell size={getIconSize()} />
    </Box>
  );

  const buttonElement = (
    <IconButton
      component={href ? Link : 'button'}
      href={href}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        position: 'relative',
        borderRadius: '50%',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        ...getSizeStyles(),
        ...getVariantStyles(),
        ...getBadgeStyles(),
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: 2,
        }
      }}
      aria-label={unreadCount > 0 ? `${unreadCount} notifications` : 'Notifications'}
    >
      {iconElement}
    </IconButton>
  );

  return (
    <Tooltip 
      title={unreadCount > 0 ? `${unreadCount} unread notifications` : 'No new notifications'}
      placement="bottom"
      arrow
      PopperProps={{
        sx: {
          '& .MuiTooltip-tooltip': {
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            fontWeight: 500,
            fontSize: '0.875rem',
            borderRadius: '8px',
            boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)',
          }
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        {unreadCount > 0 ? (
          <Badge 
            badgeContent={unreadCount} 
            max={99}
            sx={getBadgeStyles()}
          >
            {buttonElement}
          </Badge>
        ) : (
          buttonElement
        )}
      </Box>
    </Tooltip>
  );
}

export default ModernNotificationSystem;
