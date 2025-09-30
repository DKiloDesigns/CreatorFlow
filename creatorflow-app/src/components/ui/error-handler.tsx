'use client';

import React, { Component, ReactNode } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  AlertTitle,
  Collapse,
  IconButton,
  Stack,
} from '@mui/material';
import {
  Error as ErrorIcon,
  Refresh,
  ExpandMore,
  ExpandLess,
  BugReport,
  Home,
} from '@mui/icons-material';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  showDetails: boolean;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  toggleDetails = () => {
    this.setState(prev => ({
      showDetails: !prev.showDetails,
    }));
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
          <Card>
            <CardContent>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
                <Typography variant="h4" gutterBottom>
                  Oops! Something went wrong
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  We're sorry, but something unexpected happened. Don't worry, our team has been notified.
                </Typography>
              </Box>

              <Stack spacing={2} sx={{ mb: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<Refresh />}
                  onClick={this.handleRetry}
                  fullWidth
                >
                  Try Again
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<Home />}
                  onClick={this.handleGoHome}
                  fullWidth
                >
                  Go to Home
                </Button>
              </Stack>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <Box>
                  <Button
                    startIcon={<BugReport />}
                    endIcon={this.state.showDetails ? <ExpandLess /> : <ExpandMore />}
                    onClick={this.toggleDetails}
                    size="small"
                    color="secondary"
                  >
                    {this.state.showDetails ? 'Hide' : 'Show'} Error Details
                  </Button>
                  
                  <Collapse in={this.state.showDetails}>
                    <Alert severity="error" sx={{ mt: 2 }}>
                      <AlertTitle>Error Details</AlertTitle>
                      <Typography variant="body2" component="pre" sx={{ 
                        whiteSpace: 'pre-wrap', 
                        fontSize: '0.75rem',
                        fontFamily: 'monospace',
                        overflow: 'auto',
                        maxHeight: 200,
                      }}>
                        {this.state.error.toString()}
                        {this.state.errorInfo?.componentStack}
                      </Typography>
                    </Alert>
                  </Collapse>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      );
    }

    return this.props.children;
  }
}

// Error display component for API errors
interface ErrorDisplayProps {
  error: Error | string;
  onRetry?: () => void;
  severity?: 'error' | 'warning' | 'info';
  title?: string;
  showRetry?: boolean;
}

export function ErrorDisplay({
  error,
  onRetry,
  severity = 'error',
  title,
  showRetry = true,
}: ErrorDisplayProps) {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorTitle = title || (severity === 'error' ? 'Error' : 'Warning');

  return (
    <Alert 
      severity={severity} 
      action={
        showRetry && onRetry && (
          <Button color="inherit" size="small" onClick={onRetry}>
            Retry
          </Button>
        )
      }
    >
      <AlertTitle>{errorTitle}</AlertTitle>
      {errorMessage}
    </Alert>
  );
}

// Network error component
interface NetworkErrorProps {
  onRetry?: () => void;
  message?: string;
}

export function NetworkError({ onRetry, message }: NetworkErrorProps) {
  return (
    <Box sx={{ textAlign: 'center', p: 4 }}>
      <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        Network Error
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        {message || 'Unable to connect to the server. Please check your internet connection and try again.'}
      </Typography>
      {onRetry && (
        <Button variant="contained" startIcon={<Refresh />} onClick={onRetry}>
          Retry Connection
        </Button>
      )}
    </Box>
  );
}

// Validation error component
interface ValidationErrorProps {
  errors: Record<string, string>;
  onClear?: () => void;
}

export function ValidationError({ errors, onClear }: ValidationErrorProps) {
  const errorEntries = Object.entries(errors);

  if (errorEntries.length === 0) return null;

  return (
    <Alert severity="error" sx={{ mb: 2 }}>
      <AlertTitle>Please fix the following errors:</AlertTitle>
      <ul style={{ margin: 0, paddingLeft: 20 }}>
        {errorEntries.map(([field, message]) => (
          <li key={field}>
            <strong>{field}:</strong> {message}
          </li>
        ))}
      </ul>
      {onClear && (
        <Button size="small" onClick={onClear} sx={{ mt: 1 }}>
          Clear Errors
        </Button>
      )}
    </Alert>
  );
}

// Error toast hook
export function useErrorToast() {
  const showError = (message: string, duration = 5000) => {
    // This would integrate with a toast notification system
    console.error('Error Toast:', message);
    // In a real implementation, this would show a toast notification
  };

  return { showError };
}
