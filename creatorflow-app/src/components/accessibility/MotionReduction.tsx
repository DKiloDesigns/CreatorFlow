'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Box } from '@mui/material';

interface MotionReductionContextType {
  prefersReducedMotion: boolean;
  setPrefersReducedMotion: (value: boolean) => void;
}

const MotionReductionContext = createContext<MotionReductionContextType | null>(null);

export const useMotionReduction = () => {
  const context = useContext(MotionReductionContext);
  if (!context) {
    throw new Error('useMotionReduction must be used within a MotionReductionProvider');
  }
  return context;
};

interface MotionReductionProviderProps {
  children: React.ReactNode;
}

export const MotionReductionProvider: React.FC<MotionReductionProviderProps> = ({ children }) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for user's motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <MotionReductionContext.Provider value={{ prefersReducedMotion, setPrefersReducedMotion }}>
      {children}
    </MotionReductionContext.Provider>
  );
};

// Hook for conditional animations
export const useConditionalAnimation = () => {
  const { prefersReducedMotion } = useMotionReduction();

  const getAnimationProps = (animationProps: any, reducedMotionProps: any = {}) => {
    if (prefersReducedMotion) {
      return {
        ...reducedMotionProps,
        transition: 'none',
        animation: 'none',
      };
    }
    return animationProps;
  };

  const getTransitionProps = (transitionProps: any, reducedMotionProps: any = {}) => {
    if (prefersReducedMotion) {
      return {
        ...reducedMotionProps,
        transition: 'none',
      };
    }
    return transitionProps;
  };

  return {
    prefersReducedMotion,
    getAnimationProps,
    getTransitionProps,
  };
};

// Component for conditional animations
interface ConditionalAnimationProps {
  children: React.ReactNode;
  animationProps?: any;
  reducedMotionProps?: any;
  className?: string;
}

export const ConditionalAnimation: React.FC<ConditionalAnimationProps> = ({
  children,
  animationProps = {},
  reducedMotionProps = {},
  className,
}) => {
  const { getAnimationProps } = useConditionalAnimation();

  const finalProps = getAnimationProps(animationProps, reducedMotionProps);

  return (
    <Box
      className={className}
      sx={finalProps}
    >
      {children}
    </Box>
  );
};

// Utility function for creating accessible animations
export const createAccessibleAnimation = (
  normalAnimation: any,
  reducedMotionAnimation: any = {}
) => {
  return {
    '@media (prefers-reduced-motion: no-preference)': normalAnimation,
    '@media (prefers-reduced-motion: reduce)': {
      ...reducedMotionAnimation,
      transition: 'none',
      animation: 'none',
    },
  };
};

// Common accessible animation presets
export const accessibleAnimations = {
  fadeIn: createAccessibleAnimation(
    {
      opacity: 0,
      animation: 'fadeIn 0.3s ease-in-out forwards',
      '@keyframes fadeIn': {
        from: { opacity: 0 },
        to: { opacity: 1 },
      },
    },
    {
      opacity: 1,
    }
  ),
  
  slideUp: createAccessibleAnimation(
    {
      transform: 'translateY(20px)',
      opacity: 0,
      animation: 'slideUp 0.3s ease-out forwards',
      '@keyframes slideUp': {
        from: { transform: 'translateY(20px)', opacity: 0 },
        to: { transform: 'translateY(0)', opacity: 1 },
      },
    },
    {
      transform: 'translateY(0)',
      opacity: 1,
    }
  ),
  
  scaleIn: createAccessibleAnimation(
    {
      transform: 'scale(0.9)',
      opacity: 0,
      animation: 'scaleIn 0.2s ease-out forwards',
      '@keyframes scaleIn': {
        from: { transform: 'scale(0.9)', opacity: 0 },
        to: { transform: 'scale(1)', opacity: 1 },
      },
    },
    {
      transform: 'scale(1)',
      opacity: 1,
    }
  ),
  
  bounce: createAccessibleAnimation(
    {
      animation: 'bounce 0.6s ease-in-out',
      '@keyframes bounce': {
        '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
        '40%, 43%': { transform: 'translate3d(0,-8px,0)' },
        '70%': { transform: 'translate3d(0,-4px,0)' },
        '90%': { transform: 'translate3d(0,-2px,0)' },
      },
    },
    {
      transform: 'translate3d(0,0,0)',
    }
  ),
};
