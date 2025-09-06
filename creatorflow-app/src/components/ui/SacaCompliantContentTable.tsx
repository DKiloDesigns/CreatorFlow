"use client";

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Box,
  Typography,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
  useMediaQuery,
  Card,
  CardContent
} from '@mui/material';
import {
  Edit as EditIcon,
  ContentCopy as DuplicateIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Schedule as ScheduleIcon,
  CheckCircle as PublishedIcon,
  Drafts as DraftIcon,
  Close as CloseIcon
} from '@/lib/mui-optimized-imports';

interface ContentItem {
  id: string;
  title: string;
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED';
  platforms: string[];
  scheduledDate?: string;
  publishedDate?: string;
  content: string;
}

interface SacaCompliantContentTableProps {
  items: ContentItem[];
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  loading?: boolean;
  error?: string | null;
}

export default function SacaCompliantContentTable({
  items,
  onEdit,
  onDuplicate,
  onDelete,
  onView,
  loading = false,
  error = null
}: SacaCompliantContentTableProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [expandedStatus, setExpandedStatus] = useState<string | null>(null);

  // Status color mapping
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return {
          color: 'default' as const,
          icon: <DraftIcon fontSize="small" />,
          label: 'Draft - Content is being prepared'
        };
      case 'SCHEDULED':
        return {
          color: 'info' as const,
          icon: <ScheduleIcon fontSize="small" />,
          label: 'Scheduled - Content is queued for publication'
        };
      case 'PUBLISHED':
        return {
          color: 'success' as const,
          icon: <PublishedIcon fontSize="small" />,
          label: 'Published - Content is live on platforms'
        };
      default:
        return {
          color: 'default' as const,
          icon: <DraftIcon fontSize="small" />,
          label: 'Unknown status'
        };
    }
  };

  // Handle delete with confirmation
  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      onDelete(itemToDelete);
      setSnackbarMessage('Content item deleted successfully');
      setSnackbarOpen(true);
      setTimeout(() => setSnackbarOpen(false), 3000);
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  // Handle card click to open detail modal
  const handleCardClick = (item: ContentItem) => {
    setSelectedItem(item);
    setDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedItem(null);
    setExpandedStatus(null);
  };

  const handleStatusClick = (itemId: string) => {
    setExpandedStatus(expandedStatus === itemId ? null : itemId);
  };

  // Accessible action button
  const ActionButton = ({ 
    icon, 
    label, 
    onClick, 
    color = 'primary',
    disabled = false 
  }: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    color?: 'primary' | 'error' | 'default';
    disabled?: boolean;
  }) => (
    <Tooltip title={label} placement="top" arrow>
      <IconButton
        onClick={onClick}
        disabled={disabled}
        color={color}
        size="small"
        aria-label={label}
        sx={{
          minWidth: 44,
          minHeight: 44,
          '&:focus': {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: '2px'
          }
        }}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );

  if (loading) {
    return (
      <Box role="status" aria-live="polite" sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1">Loading content...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" role="alert" aria-live="assertive" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (items.length === 0) {
    return (
      <Box role="status" aria-live="polite" sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No content items found. Create your first content piece to get started.
        </Typography>
      </Box>
    );
  }

  // Mobile Card View with Horizontal Scrolling
  if (isMobile) {
    return (
      <>
        <style jsx>{`
          @keyframes pulse {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.1); }
            100% { opacity: 1; transform: scale(1); }
          }
        `}</style>
        
        {/* Mobile Cards Container */}
        <Box sx={{ 
          width: '100%',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          '&::-webkit-scrollbar': {
            height: 8,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: theme.palette.grey[100],
            borderRadius: 4,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.primary.main,
            borderRadius: 4,
          },
          pb: 2
        }}>
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            minWidth: 'max-content',
            px: 1
          }}>
            {items.map((item) => (
              <Card
                key={item.id}
                sx={{
                  width: 280,
                  minHeight: 220,
                  cursor: 'pointer',
                  scrollSnapAlign: 'start',
                  transition: 'all 0.2s ease-in-out',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[8],
                  },
                  '&:focus': {
                    outline: `2px solid ${theme.palette.primary.main}`,
                    outlineOffset: 2,
                  }
                }}
                onClick={() => handleCardClick(item)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(item);
                  }
                }}
              >
                <CardContent sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                  {/* Title and Actions in same row */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    mb: 2
                  }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        flex: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.2,
                        pr: 1
                      }}
                    >
                      {item.title}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                      <ActionButton
                        icon={<ViewIcon />}
                        label="View"
                        onClick={() => onView(item.id)}
                      />
                      <ActionButton
                        icon={<EditIcon />}
                        label="Edit"
                        onClick={() => onEdit(item.id)}
                      />
                    </Box>
                  </Box>
                  
                  {/* Status */}
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={item.status}
                      color={getStatusConfig(item.status).color}
                      size="small"
                    />
                  </Box>

                  {/* Platforms moved to bottom */}
                  <Box sx={{ mt: 'auto' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                      Platforms:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {item.platforms.slice(0, 3).map((platform, index) => (
                        <Chip
                          key={index}
                          label={platform}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                      {item.platforms.length > 3 && (
                        <Chip
                          label={`+${item.platforms.length - 3}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Scroll Indicator */}
        {items.length > 3 && (
          <Box sx={{ textAlign: 'center', mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              ← Scroll to see more content →
            </Typography>
          </Box>
        )}

        {/* Detail Modal */}
        <Dialog
          open={detailModalOpen}
          onClose={closeDetailModal}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Content Details</Typography>
              <IconButton onClick={closeDetailModal}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedItem && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h5" gutterBottom>{selectedItem.title}</Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Status & Platforms
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Tooltip title="Click to view schedule information" placement="top">
                      <Chip
                        label={selectedItem.status}
                        color={getStatusConfig(selectedItem.status).color}
                        onClick={() => handleStatusClick(selectedItem.id)}
                        sx={{ 
                          cursor: 'pointer',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            opacity: 0.8,
                            transform: 'scale(1.05)'
                          }
                        }}
                      />
                    </Tooltip>
                    {selectedItem.platforms.map((platform, index) => (
                      <Chip
                        key={index}
                        label={platform}
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>

                {/* Schedule Information - Only show when status is clicked */}
                {expandedStatus === selectedItem.id && (
                  <Box sx={{ 
                    mb: 4, 
                    mt: 2,
                    p: 3, 
                    bgcolor: 'primary.50', 
                    borderRadius: 2,
                    border: `2px solid ${theme.palette.primary.light}`,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`
                    }
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1, 
                      mb: 2 
                    }}>
                      <Box sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        animation: 'pulse 2s infinite'
                      }} />
                      <Typography variant="subtitle1" color="primary.main" sx={{ fontWeight: 600 }}>
                        📅 Schedule Information
                      </Typography>
                    </Box>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: 1.5 
                    }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        p: 1.5,
                        bgcolor: 'white',
                        borderRadius: 1,
                        border: `1px solid ${theme.palette.primary.light}`
                      }}>
                        <ScheduleIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          Scheduled: {selectedItem.scheduledDate}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        p: 1.5,
                        bgcolor: 'white',
                        borderRadius: 1,
                        border: `1px solid ${theme.palette.primary.light}`
                      }}>
                        <PublishedIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          Published: {selectedItem.publishedDate || 'Not yet published'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}

                {/* Content Preview with better spacing */}
                <Box sx={{ mb: 3, mt: 2 }}>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Content Preview
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    p: 2, 
                    bgcolor: 'grey.50', 
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontSize: '0.875rem'
                  }}>
                    {selectedItem.content}
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={closeDetailModal}>Close</Button>
            {selectedItem && (
              <>
                <Button
                  startIcon={<ViewIcon />}
                  onClick={() => {
                    onView(selectedItem.id);
                    closeDetailModal();
                  }}
                >
                  View Full
                </Button>
                <Button
                  startIcon={<EditIcon />}
                  variant="contained"
                  onClick={() => {
                    onEdit(selectedItem.id);
                    closeDetailModal();
                  }}
                >
                  Edit
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>
      </>
    );
  }

  // Desktop Table View
  return (
    <>
      <TableContainer 
        component={Paper} 
        elevation={1}
        sx={{ 
          borderRadius: 2,
          overflow: 'auto',
          '& .MuiTable-root': {
            minWidth: 800
          }
        }}
        role="region"
        aria-label="Content management table"
      >
        <Table 
          aria-label="Content items table"
          role="table"
          sx={{ 
            '& .MuiTableCell-root': {
              borderBottom: `1px solid ${theme.palette.divider}`,
              padding: 2
            }
          }}
        >
          <TableHead>
            <TableRow 
              sx={{ 
                backgroundColor: theme.palette.grey[50],
                '& .MuiTableCell-head': {
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  fontSize: '0.875rem'
                }
              }}
            >
              <TableCell scope="col" aria-label="Content title column" sx={{ minWidth: 200 }}>
                Content
              </TableCell>
              <TableCell scope="col" aria-label="Content status column" sx={{ minWidth: 100 }}>
                Status
              </TableCell>
              <TableCell scope="col" aria-label="Target platforms column" sx={{ minWidth: 120 }}>
                Platforms
              </TableCell>
              <TableCell scope="col" aria-label="Schedule or publication date column" sx={{ minWidth: 150 }}>
                Scheduled / Published
              </TableCell>
              <TableCell scope="col" aria-label="Action buttons column" sx={{ minWidth: 150 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => {
              const statusConfig = getStatusConfig(item.status);
              const rowId = `content-row-${item.id}`;
              
              return (
                <TableRow
                  key={item.id}
                  id={rowId}
                  hover
                  sx={{
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover
                    },
                    '&:focus-within': {
                      backgroundColor: theme.palette.action.selected
                    }
                  }}
                  role="row"
                  aria-labelledby={`${rowId}-title`}
                >
                  <TableCell 
                    scope="row"
                    id={`${rowId}-title`}
                    sx={{ 
                      maxWidth: 200,
                      wordBreak: 'break-word'
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      fontWeight={500}
                      color="text.primary"
                      sx={{ lineHeight: 1.4 }}
                    >
                      {item.title}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Chip
                      icon={statusConfig.icon}
                      label={item.status}
                      color={statusConfig.color}
                      size="small"
                      variant="filled"
                      aria-label={statusConfig.label}
                    />
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {item.platforms.map((platform, platformIndex) => (
                        <Chip
                          key={platformIndex}
                          label={platform}
                          size="small"
                          variant="outlined"
                          color="primary"
                          sx={{ fontSize: '0.75rem' }}
                          aria-label={`Platform: ${platform}`}
                        />
                      ))}
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {item.status === 'SCHEDULED' && item.scheduledDate && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <ScheduleIcon fontSize="small" />
                          Scheduled: {new Date(item.scheduledDate).toLocaleDateString()}
                        </Box>
                      )}
                      {item.status === 'PUBLISHED' && item.publishedDate && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PublishedIcon fontSize="small" />
                          Published: {new Date(item.publishedDate).toLocaleDateString()}
                        </Box>
                      )}
                      {item.status === 'DRAFT' && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <DraftIcon fontSize="small" />
                          Draft - No date set
                        </Box>
                      )}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <ActionButton
                        icon={<ViewIcon />}
                        label={`View ${item.title}`}
                        onClick={() => onView(item.id)}
                      />
                      <ActionButton
                        icon={<EditIcon />}
                        label={`Edit ${item.title}`}
                        onClick={() => onEdit(item.id)}
                      />
                      <ActionButton
                        icon={<DuplicateIcon />}
                        label={`Duplicate ${item.title}`}
                        onClick={() => onDuplicate(item.id)}
                      />
                      <ActionButton
                        icon={<DeleteIcon />}
                        label={`Delete ${item.title}`}
                        onClick={() => handleDeleteClick(item.id)}
                        color="error"
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        role="alertdialog"
      >
        <DialogTitle id="delete-dialog-title">
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <Typography id="delete-dialog-description">
            Are you sure you want to delete this content item? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            aria-label="Cancel deletion"
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDelete}
            color="error"
            variant="contained"
            aria-label="Confirm deletion"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        role="status"
        aria-live="polite"
      />
    </>
  );
}