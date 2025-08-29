'use client';

import React, { forwardRef } from 'react';
import { 
  Alert as MuiAlert,
  AlertProps as MuiAlertProps,
  AlertTitle,
  Box,
  IconButton,
  Collapse,
  Snackbar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Close,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';

// Styled MUI Alert
const StyledAlert = styled(MuiAlert)<{
  variant?: 'default' | 'outlined' | 'filled' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  severity?: 'success' | 'info' | 'warning' | 'error';
}>(({ theme, variant = 'default', size = 'md', severity = 'info' }) => ({
  ...(size === 'sm' && {
    padding: theme.spacing(1, 1.5),
    fontSize: '0.875rem',
    '& .MuiAlert-icon': {
      fontSize: '1.125rem',
    },
  }),
  ...(size === 'md' && {
    padding: theme.spacing(1.5, 2),
    fontSize: '1rem',
    '& .MuiAlert-icon': {
      fontSize: '1.25rem',
    },
  }),
  ...(size === 'lg' && {
    padding: theme.spacing(2, 2.5),
    fontSize: '1.125rem',
    '& .MuiAlert-icon': {
      fontSize: '1.5rem',
    },
  }),
  
  ...(variant === 'outlined' && {
    border: `1px solid ${theme.palette[severity].main}`,
    backgroundColor: 'transparent',
    color: theme.palette[severity].main,
    '& .MuiAlert-icon': {
      color: theme.palette[severity].main,
    },
  }),
  
  ...(variant === 'filled' && {
    backgroundColor: theme.palette[severity].main,
    color: theme.palette[severity].contrastText,
    '& .MuiAlert-icon': {
      color: theme.palette[severity].contrastText,
    },
  }),
  
  ...(variant === 'minimal' && {
    backgroundColor: theme.palette[severity].light,
    color: theme.palette[severity].dark,
    '& .MuiAlert-icon': {
      color: theme.palette[severity].main,
    },
  }),
}));

// Main Alert component
export interface AlertProps extends Omit<MuiAlertProps, 'variant'> {
  variant?: 'default' | 'outlined' | 'filled' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  severity?: 'success' | 'info' | 'warning' | 'error';
  title?: string;
  action?: React.ReactNode;
  onClose?: () => void;
  closable?: boolean;
  expandable?: boolean;
  children: React.ReactNode;
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ 
    variant = 'default',
    size = 'md',
    severity = 'info',
    title,
    action,
    onClose,
    closable = false,
    expandable = false,
    children,
    ...props 
  }, ref) => {
    const [expanded, setExpanded] = React.useState(false);
    
    const handleExpand = () => {
      setExpanded(!expanded);
    };
    
    const handleClose = () => {
      onClose?.();
    };
    
    const actionElements = [];
    
    if (expandable) {
      actionElements.push(
        <IconButton
          key="expand"
          size="small"
          onClick={handleExpand}
          aria-label={expanded ? 'Show less' : 'Show more'}
        >
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      );
    }
    
    if (closable) {
      actionElements.push(
        <IconButton
          key="close"
          size="small"
          onClick={handleClose}
          aria-label="Close"
        >
          <Close />
        </IconButton>
      );
    }
    
    if (action) {
      actionElements.push(action);
    }
    
    return (
      <StyledAlert
        ref={ref}
        variant={variant}
        size={size}
        severity={severity}
        action={actionElements.length > 0 ? actionElements : undefined}
        onClose={closable ? handleClose : undefined}
        {...props}
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        <Collapse in={!expandable || expanded} timeout="auto">
          {children}
        </Collapse>
      </StyledAlert>
    );
  }
);

Alert.displayName = 'Alert';

// Export MUI Alert components for use in other components
export { AlertTitle } from '@mui/material';

// AlertDescription component for consistent API
export const AlertDescription: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => (
  <Box sx={{ fontSize: '0.875rem', lineHeight: 1.625 }} {...props}>
    {children}
  </Box>
);

// Success Alert component
export interface SuccessAlertProps extends Omit<AlertProps, 'severity'> {
  title?: string;
  children: React.ReactNode;
}

export const SuccessAlert = forwardRef<HTMLDivElement, SuccessAlertProps>(
  ({ title, children, ...props }, ref) => {
    return (
      <Alert
        ref={ref}
        severity="success"
        title={title}
        {...props}
      >
        {children}
      </Alert>
    );
  }
);

SuccessAlert.displayName = 'SuccessAlert';

// Info Alert component
export interface InfoAlertProps extends Omit<AlertProps, 'severity'> {
  title?: string;
  children: React.ReactNode;
}

export const InfoAlert = forwardRef<HTMLDivElement, InfoAlertProps>(
  ({ title, children, ...props }, ref) => {
    return (
      <Alert
        ref={ref}
        severity="info"
        title={title}
        {...props}
      >
        {children}
      </Alert>
    );
  }
);

InfoAlert.displayName = 'InfoAlert';

// Warning Alert component
export interface WarningAlertProps extends Omit<AlertProps, 'severity'> {
  title?: string;
  children: React.ReactNode;
}

export const WarningAlert = forwardRef<HTMLDivElement, WarningAlertProps>(
  ({ title, children, ...props }, ref) => {
    return (
      <Alert
        ref={ref}
        severity="warning"
        title={title}
        {...props}
      >
        {children}
      </Alert>
    );
  }
);

WarningAlert.displayName = 'WarningAlert';

// Error Alert component
export interface ErrorAlertProps extends Omit<AlertProps, 'severity'> {
  title?: string;
  children: React.ReactNode;
}

export const ErrorAlert = forwardRef<HTMLDivElement, ErrorAlertProps>(
  ({ title, children, ...props }, ref) => {
    return (
      <Alert
        ref={ref}
        severity="error"
        title={title}
        {...props}
      >
        {children}
      </Alert>
    );
  }
);

ErrorAlert.displayName = 'ErrorAlert';

// Toast Alert component
export interface ToastAlertProps extends Omit<AlertProps, 'variant'> {
  open: boolean;
  onClose: () => void;
  autoHideDuration?: number;
  anchorOrigin?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  children: React.ReactNode;
}

export const ToastAlert = forwardRef<HTMLDivElement, ToastAlertProps>(
  ({ 
    open,
    onClose,
    autoHideDuration = 6000,
    anchorOrigin = { vertical: 'top', horizontal: 'right' },
    children,
    ...props 
  }, ref) => {
    return (
      <Snackbar
        open={open}
        autoHideDuration={autoHideDuration}
        onClose={onClose}
        anchorOrigin={anchorOrigin}
      >
        <Alert
          ref={ref}
          variant="filled"
          onClose={onClose}
          {...props}
        >
          {children}
        </Alert>
      </Snackbar>
    );
  }
);

ToastAlert.displayName = 'ToastAlert';

// Banner Alert component
export interface BannerAlertProps extends Omit<AlertProps, 'variant'> {
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const BannerAlert = forwardRef<HTMLDivElement, BannerAlertProps>(
  ({ fullWidth = false, children, ...props }, ref) => {
    return (
      <Box
        sx={{
          width: fullWidth ? '100%' : 'auto',
          position: 'relative',
        }}
      >
        <Alert
          ref={ref}
          variant="filled"
          size="lg"
          {...props}
        >
          {children}
        </Alert>
      </Box>
    );
  }
);

BannerAlert.displayName = 'BannerAlert';

// Dismissible Alert component
export interface DismissibleAlertProps extends Omit<AlertProps, 'closable'> {
  children: React.ReactNode;
}

export const DismissibleAlert = forwardRef<HTMLDivElement, DismissibleAlertProps>(
  ({ children, ...props }, ref) => {
    return (
      <Alert
        ref={ref}
        closable={true}
        {...props}
      >
        {children}
      </Alert>
    );
  }
);

DismissibleAlert.displayName = 'DismissibleAlert';
