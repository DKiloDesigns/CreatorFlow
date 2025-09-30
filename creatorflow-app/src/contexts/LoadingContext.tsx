'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Backdrop, CircularProgress, Box, Typography, LinearProgress } from '@mui/material';

interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
  type?: 'spinner' | 'linear' | 'skeleton';
}

interface LoadingContextType {
  loadingState: LoadingState;
  setLoading: (loading: boolean, message?: string, type?: 'spinner' | 'linear' | 'skeleton') => void;
  setProgress: (progress: number) => void;
  setMessage: (message: string) => void;
  clearLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    message: '',
    progress: 0,
    type: 'spinner',
  });

  const setLoading = useCallback((
    isLoading: boolean, 
    message?: string, 
    type: 'spinner' | 'linear' | 'skeleton' = 'spinner'
  ) => {
    setLoadingState(prev => ({
      ...prev,
      isLoading,
      message: message || prev.message,
      type,
      progress: isLoading ? prev.progress : 0,
    }));
  }, []);

  const setProgress = useCallback((progress: number) => {
    setLoadingState(prev => ({
      ...prev,
      progress: Math.max(0, Math.min(100, progress)),
    }));
  }, []);

  const setMessage = useCallback((message: string) => {
    setLoadingState(prev => ({
      ...prev,
      message,
    }));
  }, []);

  const clearLoading = useCallback(() => {
    setLoadingState({
      isLoading: false,
      message: '',
      progress: 0,
      type: 'spinner',
    });
  }, []);

  const value = {
    loadingState,
    setLoading,
    setProgress,
    setMessage,
    clearLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
      <GlobalLoadingOverlay />
    </LoadingContext.Provider>
  );
}

function GlobalLoadingOverlay() {
  const { loadingState } = useLoading();

  if (!loadingState.isLoading) return null;

  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      }}
      open={loadingState.isLoading}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        {loadingState.type === 'spinner' && (
          <CircularProgress size={60} thickness={4} />
        )}
        
        {loadingState.type === 'linear' && (
          <Box sx={{ width: 300 }}>
            <LinearProgress 
              variant="determinate" 
              value={loadingState.progress} 
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
        )}

        {loadingState.message && (
          <Typography variant="h6" sx={{ textAlign: 'center', maxWidth: 400 }}>
            {loadingState.message}
          </Typography>
        )}

        {loadingState.progress > 0 && loadingState.type === 'spinner' && (
          <Typography variant="body2" color="text.secondary">
            {Math.round(loadingState.progress)}%
          </Typography>
        )}
      </Box>
    </Backdrop>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

// Higher-order component for loading states
export function withLoading<T extends object>(
  Component: React.ComponentType<T>,
  loadingMessage?: string
) {
  return function WithLoadingComponent(props: T) {
    const { loadingState } = useLoading();
    
    if (loadingState.isLoading && loadingState.type === 'skeleton') {
      return <PageSkeleton />;
    }

    return <Component {...props} />;
  };
}

// Import PageSkeleton from skeleton-loaders
import { PageSkeleton } from '../components/ui/skeleton-loaders';
