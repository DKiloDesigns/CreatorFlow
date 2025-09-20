'use client';

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Zoom
} from '@mui/material';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

interface VisualTutorialStepProps {
  step: {
    id: string;
    title: string;
    description: string;
    content: string;
    hints?: string[];
    screenshot?: string;
    highlight?: {
      x: number;
      y: number;
      width: number;
      height: number;
      description: string;
    };
    beforeImage?: string;
    afterImage?: string;
    visualNotes?: string;
  };
  onNext?: () => void;
  onPrevious?: () => void;
  onClose?: () => void;
  showNavigation?: boolean;
}

export function VisualTutorialStep({
  step,
  onNext,
  onPrevious,
  onClose,
  showNavigation = true
}: VisualTutorialStepProps) {
  const [zoom, setZoom] = useState(1);
  const [showHighlight, setShowHighlight] = useState(true);
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleResetZoom = () => setZoom(1);

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setImageDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setImageDialogOpen(false);
    setSelectedImage(null);
  };

  const renderScreenshot = () => {
    if (!step.screenshot) return null;

    return (
      <Box sx={{ position: 'relative', mb: 3 }}>
        <Paper
          elevation={3}
          sx={{
            overflow: 'hidden',
            borderRadius: 2,
            cursor: 'pointer',
            '&:hover': {
              boxShadow: 6
            }
          }}
          onClick={() => handleImageClick(step.screenshot!)}
        >
          <Box
            sx={{
              position: 'relative',
              transform: `scale(${zoom})`,
              transformOrigin: 'top left',
              transition: 'transform 0.3s ease',
              width: '100%',
              height: 'auto',
              minHeight: 300
            }}
          >
            <img
              src={step.screenshot}
              alt={step.title}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block'
              }}
            />
            
            {/* Highlight overlay */}
            {step.highlight && showHighlight && (
              <Box
                sx={{
                  position: 'absolute',
                  left: `${step.highlight.x}px`,
                  top: `${step.highlight.y}px`,
                  width: `${step.highlight.width}px`,
                  height: `${step.highlight.height}px`,
                  border: '3px solid',
                  borderColor: 'primary.main',
                  borderRadius: 1,
                  backgroundColor: 'rgba(25, 118, 210, 0.1)',
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': {
                      boxShadow: '0 0 0 0 rgba(25, 118, 210, 0.7)'
                    },
                    '70%': {
                      boxShadow: '0 0 0 10px rgba(25, 118, 210, 0)'
                    },
                    '100%': {
                      boxShadow: '0 0 0 0 rgba(25, 118, 210, 0)'
                    }
                  }
                }}
              />
            )}

            {/* Highlight description tooltip */}
            {step.highlight && showHighlight && (
              <Tooltip
                title={step.highlight.description}
                placement="top"
                arrow
              >
                <Box
                  sx={{
                    position: 'absolute',
                    left: `${step.highlight.x + step.highlight.width + 10}px`,
                    top: `${step.highlight.y}px`,
                    backgroundColor: 'primary.main',
                    color: 'white',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    maxWidth: 200,
                    zIndex: 2
                  }}
                >
                  {step.highlight.description}
                </Box>
              </Tooltip>
            )}
          </Box>
        </Paper>

        {/* Zoom controls */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            display: 'flex',
            gap: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 1,
            p: 1
          }}
        >
          <Tooltip title="Zoom In">
            <IconButton size="small" onClick={handleZoomIn}>
              <ZoomIn size={16} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom Out">
            <IconButton size="small" onClick={handleZoomOut}>
              <ZoomOut size={16} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset Zoom">
            <IconButton size="small" onClick={handleResetZoom}>
              <RotateCcw size={16} />
            </IconButton>
          </Tooltip>
          <Tooltip title={showHighlight ? "Hide Highlight" : "Show Highlight"}>
            <IconButton size="small" onClick={() => setShowHighlight(!showHighlight)}>
              {showHighlight ? <EyeOff size={16} /> : <Eye size={16} />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    );
  };

  const renderBeforeAfter = () => {
    if (!step.beforeImage || !step.afterImage) return null;

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Before & After
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
              Before
            </Typography>
            <Paper
              elevation={2}
              sx={{
                overflow: 'hidden',
                borderRadius: 2,
                cursor: 'pointer',
                '&:hover': { boxShadow: 4 }
              }}
              onClick={() => handleImageClick(step.beforeImage!)}
            >
              <img
                src={step.beforeImage}
                alt="Before"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </Paper>
          </Box>
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
              After
            </Typography>
            <Paper
              elevation={2}
              sx={{
                overflow: 'hidden',
                borderRadius: 2,
                cursor: 'pointer',
                '&:hover': { boxShadow: 4 }
              }}
              onClick={() => handleImageClick(step.afterImage!)}
            >
              <img
                src={step.afterImage}
                alt="After"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </Paper>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
            {step.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {step.description}
          </Typography>
        </Box>
        {onClose && (
          <IconButton onClick={onClose} size="small">
            <X size={20} />
          </IconButton>
        )}
      </Box>

      {/* Visual content */}
      {renderScreenshot()}
      {renderBeforeAfter()}

      {/* Content */}
      <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: 'background.paper' }}>
        <Typography variant="body1" sx={{ lineHeight: 1.6, mb: 2 }}>
          {step.content}
        </Typography>

        {step.visualNotes && (
          <Box sx={{ mt: 2, p: 2, backgroundColor: 'primary.50', borderRadius: 1 }}>
            <Typography variant="body2" color="primary.dark" sx={{ fontStyle: 'italic' }}>
              💡 Visual Note: {step.visualNotes}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Hints */}
      {step.hints && step.hints.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            💡 Pro Tips
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {step.hints.map((hint, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <Chip
                  label={index + 1}
                  size="small"
                  color="primary"
                  sx={{ minWidth: 24, height: 24, fontSize: '0.75rem' }}
                />
                <Typography variant="body2" sx={{ flex: 1 }}>
                  {hint}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Navigation */}
      {showNavigation && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            startIcon={<ChevronLeft size={20} />}
            onClick={onPrevious}
            disabled={!onPrevious}
            variant="outlined"
          >
            Previous
          </Button>
          
          <Button
            endIcon={<ChevronRight size={20} />}
            onClick={onNext}
            disabled={!onNext}
            variant="contained"
          >
            Next
          </Button>
        </Box>
      )}

      {/* Image dialog */}
      <Dialog
        open={imageDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { backgroundColor: 'transparent', boxShadow: 'none' }
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              zIndex: 1,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)'
              }
            }}
          >
            <X size={20} />
          </IconButton>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Tutorial screenshot"
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '80vh',
                objectFit: 'contain'
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
