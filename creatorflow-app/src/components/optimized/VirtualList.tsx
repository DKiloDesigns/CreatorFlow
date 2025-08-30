'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Typography } from '@mui/material';

interface VirtualListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
}

export function VirtualList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  overscan = 5,
  className
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(height);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(
      start + Math.ceil(containerHeight / itemHeight) + overscan,
      items.length
    );
    return { start: Math.max(0, start - overscan), end };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  // Calculate total height
  const totalHeight = useMemo(() => {
    return items.length * itemHeight;
  }, [items.length, itemHeight]);

  // Handle scroll
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  // Update container height on resize
  useEffect(() => {
    const handleResize = () => {
      setContainerHeight(height);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [height]);

  // Render visible items
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end).map((item, index) => {
      const actualIndex = visibleRange.start + index;
      return (
        <Box
          key={actualIndex}
          style={{
            position: 'absolute',
            top: actualIndex * itemHeight,
            height: itemHeight,
            width: '100%',
          }}
        >
          {renderItem(item, actualIndex)}
        </Box>
      );
    });
  }, [items, visibleRange, itemHeight, renderItem]);

  return (
    <Box
      sx={className ? { ...className } : {}}
      style={{
        height: containerHeight,
        overflow: 'auto',
        position: 'relative',
      }}
      onScroll={handleScroll}
    >
      <Box style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems}
      </Box>
    </Box>
  );
}

// Optimized virtual list with search
interface SearchableVirtualListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  searchTerm: string;
  searchFunction: (item: T, term: string) => boolean;
  overscan?: number;
  className?: string;
}

export function SearchableVirtualList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  searchTerm,
  searchFunction,
  overscan = 5,
  className
}: SearchableVirtualListProps<T>) {
  // Filter items based on search
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items;
    return items.filter(item => searchFunction(item, searchTerm));
  }, [items, searchTerm, searchFunction]);

  return (
    <VirtualList
      items={filteredItems}
      height={height}
      itemHeight={itemHeight}
      renderItem={renderItem}
      overscan={overscan}
      className={className}
    />
  );
}

// Infinite scroll virtual list
interface InfiniteVirtualListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  overscan?: number;
  className?: string;
}

export function InfiniteVirtualList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  onLoadMore,
  hasMore,
  loading,
  overscan = 5,
  className
}: InfiniteVirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(height);

  // Calculate if we should load more
  const shouldLoadMore = useMemo(() => {
    const scrollPosition = scrollTop + containerHeight;
    const totalHeight = items.length * itemHeight;
    return scrollPosition >= totalHeight - containerHeight && hasMore && !loading;
  }, [scrollTop, containerHeight, items.length, itemHeight, hasMore, loading]);

  // Load more when needed
  useEffect(() => {
    if (shouldLoadMore) {
      onLoadMore();
    }
  }, [shouldLoadMore, onLoadMore]);

  // Handle scroll
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  // Update container height on resize
  useEffect(() => {
    const handleResize = () => {
      setContainerHeight(height);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [height]);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(
      start + Math.ceil(containerHeight / itemHeight) + overscan,
      items.length
    );
    return { start: Math.max(0, start - overscan), end };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  // Calculate total height
  const totalHeight = useMemo(() => {
    return items.length * itemHeight;
  }, [items.length, itemHeight]);

  // Render visible items
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end).map((item, index) => {
      const actualIndex = visibleRange.start + index;
      return (
        <Box
          key={actualIndex}
          style={{
            position: 'absolute',
            top: actualIndex * itemHeight,
            height: itemHeight,
            width: '100%',
          }}
        >
          {renderItem(item, actualIndex)}
        </Box>
      );
    });
  }, [items, visibleRange, itemHeight, renderItem]);

  return (
    <Box
      sx={className ? { ...className } : {}}
      style={{
        height: containerHeight,
        overflow: 'auto',
        position: 'relative',
      }}
      onScroll={handleScroll}
    >
      <Box style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems}
      </Box>
      {loading && (
        <Box
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px',
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Loading more...
          </Typography>
        </Box>
      )}
    </Box>
  );
} 