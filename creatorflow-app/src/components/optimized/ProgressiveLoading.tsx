'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Skeleton, 
  Card, 
  CardContent, 
  Typography,
  Fade,
  Slide
} from '@mui/material';

// Progressive loading wrapper
interface ProgressiveLoadingProps {
  children: React.ReactNode;
  loading: boolean;
  skeleton?: React.ReactNode;
  delay?: number;
  minDisplayTime?: number;
}

export function ProgressiveLoading({
  children,
  loading,
  skeleton,
  delay = 300,
  minDisplayTime = 500
}: ProgressiveLoadingProps) {
  const [showContent, setShowContent] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setShowSkeleton(false);
        setTimeout(() => setShowContent(true), delay);
      }, minDisplayTime);
      
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
      setShowSkeleton(true);
    }
  }, [loading, delay, minDisplayTime]);

  if (showSkeleton) {
    return (
      <Fade in={showSkeleton} timeout={200}>
        <Box>{skeleton}</Box>
      </Fade>
    );
  }

  return (
    <Slide direction="up" in={showContent} timeout={300}>
      <Box>{children}</Box>
    </Slide>
  );
}

// Skeleton components
export function CardSkeleton({ height = 200 }: { height?: number }) {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Box sx={{ ml: 2, flex: 1 }}>
            <Skeleton variant="text" width="60%" height={24} />
            <Skeleton variant="text" width="40%" height={16} />
          </Box>
        </Box>
        <Skeleton variant="rectangular" width="100%" height={height} />
        <Box sx={{ mt: 2 }}>
          <Skeleton variant="text" width="80%" height={20} />
          <Skeleton variant="text" width="60%" height={16} />
        </Box>
      </CardContent>
    </Card>
  );
}

export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <Box>
      {Array.from({ length: count }).map((_, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
            <Skeleton variant="circular" width={32} height={32} />
            <Box sx={{ ml: 2, flex: 1 }}>
              <Skeleton variant="text" width="70%" height={18} />
              <Skeleton variant="text" width="50%" height={14} />
            </Box>
            <Skeleton variant="rectangular" width={60} height={24} />
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', mb: 2 }}>
        {Array.from({ length: columns }).map((_, index) => (
          <Box key={index} sx={{ flex: 1, mr: 2 }}>
            <Skeleton variant="text" width="100%" height={24} />
          </Box>
        ))}
      </Box>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <Box key={rowIndex} sx={{ display: 'flex', mb: 1 }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Box key={colIndex} sx={{ flex: 1, mr: 2 }}>
              <Skeleton variant="text" width="100%" height={20} />
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
}

export function StatsSkeleton() {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" height={16} />
                <Skeleton variant="text" width="40%" height={32} sx={{ mt: 1 }} />
              </Box>
              <Skeleton variant="circular" width={40} height={40} />
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

// Lazy loading image component
interface LazyImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function LazyImage({
  src,
  alt,
  width,
  height,
  placeholder = '/placeholder.png',
  onLoad,
  onError
}: LazyImageProps) {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let observer: IntersectionObserver;
    let didCancel = false;

    if (imageRef && imageSrc === placeholder) {
      if (IntersectionObserver) {
        observer = new IntersectionObserver(
          entries => {
            entries.forEach(entry => {
              if (
                !didCancel &&
                (entry.intersectionRatio > 0 || entry.isIntersecting)
              ) {
                setImageSrc(src);
                observer.unobserve(imageRef);
              }
            });
          },
          {
            threshold: 0.01,
            rootMargin: '75%',
          }
        );
        observer.observe(imageRef);
      } else {
        setImageSrc(src);
      }
    }
    return () => {
      didCancel = true;
      if (observer && observer.unobserve) {
        observer.unobserve(imageRef);
      }
    };
  }, [src, imageSrc, imageRef]);

  return (
    <Box sx={{ position: 'relative', width, height }}>
      <Fade in={isLoaded} timeout={300}>
        <img
          ref={setImageRef}
          src={imageSrc}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          onLoad={() => {
            setIsLoaded(true);
            onLoad?.();
          }}
          onError={() => {
            setImageSrc(placeholder);
            onError?.();
          }}
        />
      </Fade>
      {!isLoaded && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'grey.100',
          }}
        >
          <Skeleton variant="rectangular" width="100%" height="100%" />
        </Box>
      )}
    </Box>
  );
}

// Progressive content loading
interface ProgressiveContentProps {
  children: React.ReactNode;
  loading: boolean;
  error?: string;
  emptyMessage?: string;
  isEmpty?: boolean;
  skeleton?: React.ReactNode;
}

export function ProgressiveContent({
  children,
  loading,
  error,
  emptyMessage = 'No data available',
  isEmpty = false,
  skeleton
}: ProgressiveContentProps) {
  if (loading) {
    return skeleton || <CardSkeleton />;
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Typography color="error" align="center">
            {error}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (isEmpty) {
    return (
      <Card>
        <CardContent>
          <Typography color="text.secondary" align="center">
            {emptyMessage}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
} 