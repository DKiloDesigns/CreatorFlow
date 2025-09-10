'use client';

import React, { useEffect, useRef, ReactNode } from 'react';
import { Box } from '@mui/material';

interface FocusTrapProps {
  children: ReactNode;
  isActive: boolean;
  onEscape?: () => void;
  initialFocusRef?: React.RefObject<HTMLElement>;
  returnFocusRef?: React.RefObject<HTMLElement>;
}

export const FocusTrap: React.FC<FocusTrapProps> = ({
  children,
  isActive,
  onEscape,
  initialFocusRef,
  returnFocusRef,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    // Store the previously focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Focus the initial element or the first focusable element
    const focusInitialElement = () => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
      } else {
        const firstFocusable = getFirstFocusableElement();
        if (firstFocusable) {
          firstFocusable.focus();
        }
      }
    };

    // Get the first focusable element within the trap
    const getFirstFocusableElement = (): HTMLElement | null => {
      if (!containerRef.current) return null;

      const focusableSelectors = [
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        'a[href]',
        '[tabindex]:not([tabindex="-1"])',
        '[contenteditable="true"]',
      ].join(', ');

      const focusableElements = containerRef.current.querySelectorAll(focusableSelectors);
      return focusableElements[0] as HTMLElement || null;
    };

    // Get the last focusable element within the trap
    const getLastFocusableElement = (): HTMLElement | null => {
      if (!containerRef.current) return null;

      const focusableSelectors = [
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        'a[href]',
        '[tabindex]:not([tabindex="-1"])',
        '[contenteditable="true"]',
      ].join(', ');

      const focusableElements = containerRef.current.querySelectorAll(focusableSelectors);
      return focusableElements[focusableElements.length - 1] as HTMLElement || null;
    };

    // Handle keyboard navigation
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        const firstFocusable = getFirstFocusableElement();
        const lastFocusable = getLastFocusableElement();

        if (event.shiftKey) {
          // Shift + Tab: move backwards
          if (document.activeElement === firstFocusable) {
            event.preventDefault();
            lastFocusable?.focus();
          }
        } else {
          // Tab: move forwards
          if (document.activeElement === lastFocusable) {
            event.preventDefault();
            firstFocusable?.focus();
          }
        }
      } else if (event.key === 'Escape' && onEscape) {
        onEscape();
      }
    };

    // Focus the initial element
    focusInitialElement();

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup function
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      
      // Return focus to the previously focused element
      if (returnFocusRef?.current) {
        returnFocusRef.current.focus();
      } else if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isActive, onEscape, initialFocusRef, returnFocusRef]);

  return (
    <Box
      ref={containerRef}
      sx={{
        '&:focus': {
          outline: 'none',
        },
      }}
    >
      {children}
    </Box>
  );
};

// Hook for managing focus trap state
export const useFocusTrap = (isActive: boolean) => {
  const [isTrapped, setIsTrapped] = React.useState(isActive);

  useEffect(() => {
    setIsTrapped(isActive);
  }, [isActive]);

  const activate = () => setIsTrapped(true);
  const deactivate = () => setIsTrapped(false);

  return {
    isTrapped,
    activate,
    deactivate,
  };
};
