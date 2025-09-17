/**
 * Enhanced Drag & Drop System
 * Improved drag and drop functionality across all components
 */

'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Fade,
  alpha,
  useTheme,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface DragDropZoneProps {
  children: React.ReactNode;
  onDrop: (files: File[], position?: { x: number; y: number }) => void;
  accept?: string[];
  maxFiles?: number;
  maxSize?: number; // in bytes
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

interface DragState {
  isDragOver: boolean;
  dragCounter: number;
  position: { x: number; y: number } | null;
}

export function EnhancedDragDropZone({
  children,
  onDrop,
  accept = [],
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB default
  disabled = false,
  className,
  style,
}: DragDropZoneProps) {
  const [dragState, setDragState] = useState<DragState>({
    isDragOver: false,
    dragCounter: 0,
    position: null,
  });
  const theme = useTheme();
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    if (file.size > maxSize) {
      return `File "${file.name}" is too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB.`;
    }

    // Check file type
    if (accept.length > 0) {
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      const mimeType = file.type;
      
      const isAccepted = accept.some(acceptedType => {
        if (acceptedType.startsWith('.')) {
          return fileExtension === acceptedType.toLowerCase();
        }
        return mimeType.startsWith(acceptedType);
      });

      if (!isAccepted) {
        return `File "${file.name}" is not supported. Accepted types: ${accept.join(', ')}`;
      }
    }

    return null;
  }, [accept, maxSize]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;

    setDragState(prev => ({
      ...prev,
      dragCounter: prev.dragCounter + 1,
      isDragOver: true,
      position: { x: e.clientX, y: e.clientY },
    }));
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;

    setDragState(prev => ({
      ...prev,
      dragCounter: prev.dragCounter - 1,
      isDragOver: prev.dragCounter <= 1 ? false : prev.isDragOver,
    }));
  }, [disabled]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;

    setDragState(prev => ({
      ...prev,
      position: { x: e.clientX, y: e.clientY },
    }));
  }, [disabled]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    
    // Validate files
    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
      } else {
        validFiles.push(file);
      }
    });

    // Check file count
    if (validFiles.length > maxFiles) {
      errors.push(`Too many files. Maximum ${maxFiles} files allowed.`);
    }

    if (errors.length > 0) {
      console.warn('Drag & Drop validation errors:', errors);
      // You could show a toast notification here
    }

    if (validFiles.length > 0) {
      const rect = dropZoneRef.current?.getBoundingClientRect();
      const position = rect ? {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      } : undefined;

      onDrop(validFiles, position);
    }

    setDragState({
      isDragOver: false,
      dragCounter: 0,
      position: null,
    });
  }, [disabled, validateFile, maxFiles, onDrop]);

  return (
    <Box
      ref={dropZoneRef}
      className={className}
      style={style}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      sx={{ position: 'relative' }}
    >
      {children}
      
      <AnimatePresence>
        {dragState.isDragOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1000,
              pointerEvents: 'none',
            }}
          >
            <Paper
              elevation={8}
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                border: `2px dashed ${theme.palette.primary.main}`,
                borderRadius: 2,
              }}
            >
              <Box sx={{ textAlign: 'center', p: 4 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Drop files here
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {accept.length > 0 && `Accepted types: ${accept.join(', ')}`}
                  {maxFiles > 1 && ` • Max ${maxFiles} files`}
                  {maxSize && ` • Max ${Math.round(maxSize / 1024 / 1024)}MB per file`}
                </Typography>
              </Box>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}

// Drag and Drop Item Component
interface DragItemProps {
  children: React.ReactNode;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: (e: React.DragEvent) => void;
  draggable?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function DragItem({
  children,
  onDragStart,
  onDragEnd,
  draggable = true,
  className,
  style,
}: DragItemProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = useCallback((e: React.DragEvent) => {
    setIsDragging(true);
    onDragStart(e);
  }, [onDragStart]);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    setIsDragging(false);
    onDragEnd(e);
  }, [onDragEnd]);

  return (
    <motion.div
      className={className}
      style={style}
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      animate={{
        scale: isDragging ? 1.05 : 1,
        rotate: isDragging ? 2 : 0,
        opacity: isDragging ? 0.8 : 1,
      }}
      transition={{
        duration: 0.2,
        ease: 'easeInOut',
      }}
      whileDrag={{
        scale: 1.05,
        rotate: 2,
        opacity: 0.8,
      }}
    >
      {children}
    </motion.div>
  );
}

// Sortable List Component
interface SortableListProps<T> {
  items: T[];
  onReorder: (newOrder: T[]) => void;
  renderItem: (item: T, index: number, isDragging: boolean) => React.ReactNode;
  keyExtractor: (item: T) => string;
  className?: string;
  style?: React.CSSProperties;
}

export function SortableList<T>({
  items,
  onReorder,
  renderItem,
  keyExtractor,
  className,
  style,
}: SortableListProps<T>) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', index.toString());
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    const dragIndex = parseInt(e.dataTransfer.getData('text/html'));
    
    if (dragIndex !== dropIndex) {
      const newItems = [...items];
      const draggedItem = newItems[dragIndex];
      
      // Remove dragged item
      newItems.splice(dragIndex, 1);
      
      // Insert at new position
      const adjustedDropIndex = dragIndex < dropIndex ? dropIndex - 1 : dropIndex;
      newItems.splice(adjustedDropIndex, 0, draggedItem);
      
      onReorder(newItems);
    }
    
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, [items, onReorder]);

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, []);

  return (
    <Box className={className} style={style}>
      {items.map((item, index) => (
        <motion.div
          key={keyExtractor(item)}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, index)}
          onDragEnd={handleDragEnd}
          animate={{
            scale: draggedIndex === index ? 1.05 : 1,
            opacity: draggedIndex === index ? 0.8 : 1,
            y: draggedIndex === index ? -4 : 0,
          }}
          transition={{
            duration: 0.2,
            ease: 'easeInOut',
          }}
          style={{
            border: dragOverIndex === index ? '2px dashed #1976d2' : '2px dashed transparent',
            borderRadius: 8,
            marginBottom: 8,
          }}
        >
          {renderItem(item, index, draggedIndex === index)}
        </motion.div>
      ))}
    </Box>
  );
}

// Hook for drag and drop functionality
export function useDragDrop() {
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev - 1);
    if (dragCounter <= 1) {
      setIsDragging(false);
    }
  }, [dragCounter]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, onDrop: (files: File[]) => void) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    onDrop(files);
    
    setIsDragging(false);
    setDragCounter(0);
  }, []);

  return {
    isDragging,
    dragHandlers: {
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
    },
  };
}

export default EnhancedDragDropZone;
