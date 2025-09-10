'use client';

import React, { useEffect, useRef, ReactNode } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Backdrop,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { FocusTrap } from './FocusTrap';
import { useAccessibilityAnnouncements } from './ARIALiveRegion';

interface AccessibleModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  fullWidth?: boolean;
  fullScreen?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  ariaDescribedBy?: string;
  ariaLabelledBy?: string;
}

export const AccessibleModal: React.FC<AccessibleModalProps> = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = true,
  fullScreen = false,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  ariaDescribedBy,
  ariaLabelledBy,
}) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { announceModalOpen, announceModalClose } = useAccessibilityAnnouncements();

  // Announce modal state changes
  const hasAnnounced = useRef(false);
  const lastAnnouncedState = useRef<{ open: boolean; title: string } | null>(null);

  useEffect(() => {
    const currentState = { open, title };
    
    // Only announce if the state has actually changed
    if (!lastAnnouncedState.current || 
        lastAnnouncedState.current.open !== open || 
        lastAnnouncedState.current.title !== title) {
      
      if (open && !hasAnnounced.current) {
        announceModalOpen(title);
        hasAnnounced.current = true;
        // Focus the title after a brief delay to ensure it's rendered
        setTimeout(() => {
          titleRef.current?.focus();
        }, 100);
      } else if (!open && hasAnnounced.current) {
        announceModalClose(title);
        hasAnnounced.current = false;
      }
      
      lastAnnouncedState.current = currentState;
    }
  }, [open, title, announceModalOpen, announceModalClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open && closeOnEscape) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [open, closeOnEscape, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [open]);

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (closeOnBackdropClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      fullScreen={fullScreen}
      aria-labelledby={ariaLabelledBy || 'modal-title'}
      aria-describedby={ariaDescribedBy}
      BackdropComponent={({ children, ...props }) => (
        <Backdrop
          {...props}
          onClick={handleBackdropClick}
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(2px)',
          }}
        >
          {children}
        </Backdrop>
      )}
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12), 0 11px 15px -7px rgba(0, 0, 0, 0.2)',
        },
      }}
    >
      <FocusTrap isActive={open} onEscape={closeOnEscape ? onClose : undefined}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '90vh',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <DialogTitle
              ref={titleRef}
              id="modal-title"
              sx={{
                m: 0,
                p: 0,
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'text.primary',
                '&:focus': {
                  outline: '2px solid',
                  outlineColor: 'primary.main',
                  outlineOffset: 2,
                  borderRadius: 1,
                },
              }}
              tabIndex={-1}
            >
              {title}
            </DialogTitle>
            <IconButton
              onClick={onClose}
              aria-label={`Close ${title} dialog`}
              sx={{
                ml: 2,
                '&:focus': {
                  outline: '2px solid',
                  outlineColor: 'primary.main',
                  outlineOffset: 2,
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Content */}
          <DialogContent
            sx={{
              p: 3,
              overflow: 'auto',
              flex: 1,
              '&:focus': {
                outline: 'none',
              },
            }}
          >
            {children}
          </DialogContent>

          {/* Actions */}
          {actions && (
            <DialogActions
              sx={{
                p: 2,
                borderTop: 1,
                borderColor: 'divider',
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
              {actions}
            </DialogActions>
          )}
        </Box>
      </FocusTrap>
    </Dialog>
  );
};
