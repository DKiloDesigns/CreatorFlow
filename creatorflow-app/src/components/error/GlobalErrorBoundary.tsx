'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
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
  Chip,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Error as ErrorIcon,
  Refresh,
  ExpandMore,
  ExpandLess,
  BugReport,
  Home,
  Report,
  Build,
  Code,
  Warning,
} from '@mui/icons-material';
import { createError, ErrorCodes, logError, ErrorMonitor } from '@/lib/error-handler';
import { buildErrorRecovery, handleBuildError } from '@/lib/build-error-recovery';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
  errorId: string;
  recoverySuggestions: string[];
  buildHealth: { healthy: boolean; issues: string[] };
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  enableRecovery?: boolean;
  enableBuildErrorHandling?: boolean;
}

export class GlobalErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryCount = 0;
  private maxRetries = 3;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      errorId: '',
      recoverySuggestions: [],
      buildHealth: { healthy: true, issues: [] },
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError, enableBuildErrorHandling = true } = this.props;
    
    this.setState({
      error,
      errorInfo,
    });

    // Log error
    logError(error, 'ErrorBoundary');
    
    // Capture error for monitoring
    ErrorMonitor.captureException(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: 'GlobalErrorBoundary',
    });

    // Handle build errors if enabled
    if (enableBuildErrorHandling) {
      const buildError = handleBuildError(error, 'ErrorBoundary');
      this.setState({
        recoverySuggestions: buildErrorRecovery.getRecoverySuggestions(),
        buildHealth: buildErrorRecovery.getErrorStats(),
      });
    }

    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        showDetails: false,
        errorId: '',
        recoverySuggestions: [],
        buildHealth: { healthy: true, issues: [] },
      });
    } else {
      // Force page reload after max retries
      window.location.reload();
    }
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReportError = () => {
    const { error, errorInfo, errorId } = this.state;
    
    // In a real application, this would send to an error reporting service
    const errorReport = {
      errorId,
      error: {
        name: error?.name,
        message: error?.message,
        stack: error?.stack,
      },
      errorInfo: {
        componentStack: errorInfo?.componentStack,
      },
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    };

    console.log('Error Report:', errorReport);
    
    // Show success message
    alert('Error report generated and logged. Thank you for helping us improve!');
  };

  toggleDetails = () => {
    this.setState(prev => ({
      showDetails: !prev.showDetails,
    }));
  };

  render() {
    const { hasError, error, errorInfo, showDetails, errorId, recoverySuggestions, buildHealth } = this.state;
    const { fallback, enableRecovery = true } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      const isBuildError = error?.message?.includes('Module not found') || 
                          error?.message?.includes('Cannot find module') ||
                          error?.message?.includes('Module parse failed');

      return (
        <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
          <Card>
            <CardContent>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
                <Typography variant="h4" gutterBottom>
                  {isBuildError ? 'Build Error Detected' : 'Something went wrong'}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {isBuildError 
                    ? 'We detected a build error that prevented the application from loading properly.'
                    : 'We\'re sorry, but something unexpected happened. Our team has been notified.'
                  }
                </Typography>
                
                {errorId && (
                  <Chip 
                    label={`Error ID: ${errorId}`} 
                    size="small" 
                    color="secondary" 
                    sx={{ mb: 2 }}
                  />
                )}
              </Box>

              {/* Build Health Status */}
              {isBuildError && (
                <Alert 
                  severity={buildHealth.healthy ? 'success' : 'warning'} 
                  sx={{ mb: 3 }}
                  icon={<Build />}
                >
                  <AlertTitle>
                    Build Health: {buildHealth.healthy ? 'Healthy' : 'Issues Detected'}
                  </AlertTitle>
                  {buildHealth.issues.length > 0 && (
                    <ul>
                      {buildHealth.issues.map((issue, index) => (
                        <li key={index}>{issue}</li>
                      ))}
                    </ul>
                  )}
                </Alert>
              )}

              {/* Recovery Suggestions */}
              {recoverySuggestions.length > 0 && (
                <Alert severity="info" sx={{ mb: 3 }} icon={<BugReport />}>
                  <AlertTitle>Recovery Suggestions</AlertTitle>
                  <ul>
                    {recoverySuggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </Alert>
              )}

              <Stack spacing={2} sx={{ mb: 3 }}>
                {enableRecovery && (
                  <Button
                    variant="contained"
                    startIcon={<Refresh />}
                    onClick={this.handleRetry}
                    fullWidth
                    size="large"
                  >
                    {this.retryCount < this.maxRetries ? 'Try Again' : 'Reload Page'}
                  </Button>
                )}
                
                <Button
                  variant="outlined"
                  startIcon={<Home />}
                  onClick={this.handleGoHome}
                  fullWidth
                >
                  Go to Home
                </Button>

                <Button
                  variant="text"
                  startIcon={<Report />}
                  onClick={this.handleReportError}
                  fullWidth
                >
                  Report This Error
                </Button>
              </Stack>

              {/* Error Details */}
              {process.env.NODE_ENV === 'development' && error && (
                <Box>
                  <Button
                    startIcon={<BugReport />}
                    endIcon={showDetails ? <ExpandLess /> : <ExpandMore />}
                    onClick={this.toggleDetails}
                    size="small"
                    color="secondary"
                    fullWidth
                  >
                    {showDetails ? 'Hide' : 'Show'} Error Details
                  </Button>
                  
                  <Collapse in={showDetails}>
                    <Accordion sx={{ mt: 2 }}>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="subtitle2">Error Information</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Error Message:
                          </Typography>
                          <Typography 
                            variant="body2" 
                            component="pre" 
                            sx={{ 
                              whiteSpace: 'pre-wrap', 
                              fontSize: '0.75rem',
                              fontFamily: 'monospace',
                              overflow: 'auto',
                              maxHeight: 200,
                              bgcolor: 'grey.100',
                              p: 1,
                              borderRadius: 1,
                            }}
                          >
                            {error.toString()}
                          </Typography>
                        </Box>
                        
                        {errorInfo?.componentStack && (
                          <Box>
                            <Typography variant="subtitle2" gutterBottom>
                              Component Stack:
                            </Typography>
                            <Typography 
                              variant="body2" 
                              component="pre" 
                              sx={{ 
                                whiteSpace: 'pre-wrap', 
                                fontSize: '0.75rem',
                                fontFamily: 'monospace',
                                overflow: 'auto',
                                maxHeight: 200,
                                bgcolor: 'grey.100',
                                p: 1,
                                borderRadius: 1,
                              }}
                            >
                              {errorInfo.componentStack}
                            </Typography>
                          </Box>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  </Collapse>
                </Box>
              )}

              <Divider sx={{ my: 3 }} />
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  If this problem persists, please contact support with the Error ID above.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      );
    }

    return this.props.children;
  }
}

// HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Partial<ErrorBoundaryProps>
) {
  return function WithErrorBoundaryComponent(props: P) {
    return (
      <GlobalErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </GlobalErrorBoundary>
    );
  };
}

// Hook for error boundary context
export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
}
