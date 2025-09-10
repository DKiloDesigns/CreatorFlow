'use client';

import React, { useEffect, useRef, ReactNode } from 'react';
import { Box } from '@mui/material';

interface KeyboardNavigationProps {
  children: ReactNode;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onEnter?: () => void;
  onSpace?: () => void;
  onEscape?: () => void;
  onHome?: () => void;
  onEnd?: () => void;
  onPageUp?: () => void;
  onPageDown?: () => void;
  onTab?: (event: KeyboardEvent) => void;
  onShiftTab?: (event: KeyboardEvent) => void;
  disabled?: boolean;
  role?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

export const KeyboardNavigation: React.FC<KeyboardNavigationProps> = ({
  children,
  onArrowUp,
  onArrowDown,
  onArrowLeft,
  onArrowRight,
  onEnter,
  onSpace,
  onEscape,
  onHome,
  onEnd,
  onPageUp,
  onPageDown,
  onTab,
  onShiftTab,
  disabled = false,
  role = 'group',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle keys if this container or its children have focus
      if (!containerRef.current?.contains(document.activeElement)) return;

      switch (event.key) {
        case 'ArrowUp':
          if (onArrowUp) {
            event.preventDefault();
            onArrowUp();
          }
          break;
        case 'ArrowDown':
          if (onArrowDown) {
            event.preventDefault();
            onArrowDown();
          }
          break;
        case 'ArrowLeft':
          if (onArrowLeft) {
            event.preventDefault();
            onArrowLeft();
          }
          break;
        case 'ArrowRight':
          if (onArrowRight) {
            event.preventDefault();
            onArrowRight();
          }
          break;
        case 'Enter':
          if (onEnter) {
            event.preventDefault();
            onEnter();
          }
          break;
        case ' ':
          if (onSpace) {
            event.preventDefault();
            onSpace();
          }
          break;
        case 'Escape':
          if (onEscape) {
            event.preventDefault();
            onEscape();
          }
          break;
        case 'Home':
          if (onHome) {
            event.preventDefault();
            onHome();
          }
          break;
        case 'End':
          if (onEnd) {
            event.preventDefault();
            onEnd();
          }
          break;
        case 'PageUp':
          if (onPageUp) {
            event.preventDefault();
            onPageUp();
          }
          break;
        case 'PageDown':
          if (onPageDown) {
            event.preventDefault();
            onPageDown();
          }
          break;
        case 'Tab':
          if (event.shiftKey && onShiftTab) {
            onShiftTab(event);
          } else if (onTab) {
            onTab(event);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    disabled,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onEnter,
    onSpace,
    onEscape,
    onHome,
    onEnd,
    onPageUp,
    onPageDown,
    onTab,
    onShiftTab,
  ]);

  return (
    <Box
      ref={containerRef}
      role={role}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      tabIndex={disabled ? -1 : 0}
      sx={{
        '&:focus': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: 2,
          borderRadius: 1,
        },
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: 2,
        },
      }}
    >
      {children}
    </Box>
  );
};

// Hook for keyboard navigation state
export const useKeyboardNavigation = () => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const startNavigation = (itemCount: number) => {
    setTotalItems(itemCount);
    setCurrentIndex(0);
    setIsNavigating(true);
  };

  const stopNavigation = () => {
    setIsNavigating(false);
  };

  const moveUp = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : totalItems - 1));
  };

  const moveDown = () => {
    setCurrentIndex(prev => (prev < totalItems - 1 ? prev + 1 : 0));
  };

  const moveLeft = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : totalItems - 1));
  };

  const moveRight = () => {
    setCurrentIndex(prev => (prev < totalItems - 1 ? prev + 1 : 0));
  };

  const goToFirst = () => {
    setCurrentIndex(0);
  };

  const goToLast = () => {
    setCurrentIndex(totalItems - 1);
  };

  const goToIndex = (index: number) => {
    if (index >= 0 && index < totalItems) {
      setCurrentIndex(index);
    }
  };

  return {
    isNavigating,
    currentIndex,
    totalItems,
    startNavigation,
    stopNavigation,
    moveUp,
    moveDown,
    moveLeft,
    moveRight,
    goToFirst,
    goToLast,
    goToIndex,
  };
};

// Component for accessible button groups
interface AccessibleButtonGroupProps {
  children: ReactNode;
  orientation?: 'horizontal' | 'vertical';
  'aria-label'?: string;
  'aria-describedby'?: string;
}

export const AccessibleButtonGroup: React.FC<AccessibleButtonGroupProps> = ({
  children,
  orientation = 'horizontal',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
}) => {
  const { currentIndex, totalItems, startNavigation, stopNavigation, moveUp, moveDown, moveLeft, moveRight } = useKeyboardNavigation();
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Count children and set up refs
  useEffect(() => {
    const buttonCount = React.Children.count(children);
    setTotalItems(buttonCount);
    buttonRefs.current = buttonRefs.current.slice(0, buttonCount);
  }, [children]);

  // Focus current button
  useEffect(() => {
    if (isNavigating && buttonRefs.current[currentIndex]) {
      buttonRefs.current[currentIndex]?.focus();
    }
  }, [currentIndex, isNavigating]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || 
        event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      
      if (orientation === 'vertical') {
        if (event.key === 'ArrowUp') moveUp();
        if (event.key === 'ArrowDown') moveDown();
      } else {
        if (event.key === 'ArrowLeft') moveLeft();
        if (event.key === 'ArrowRight') moveRight();
      }
    }
  };

  const handleFocus = () => {
    startNavigation(totalItems);
  };

  const handleBlur = () => {
    stopNavigation();
  };

  return (
    <Box
      role="group"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      sx={{
        display: 'flex',
        flexDirection: orientation === 'vertical' ? 'column' : 'row',
        gap: 1,
        '& > *': {
          '&:focus': {
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: 2,
          },
        },
      }}
    >
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            ref: (el: HTMLButtonElement | null) => {
              buttonRefs.current[index] = el;
            },
            tabIndex: currentIndex === index ? 0 : -1,
          } as any);
        }
        return child;
      })}
    </Box>
  );
};
