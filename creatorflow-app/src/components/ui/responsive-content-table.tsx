'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Edit as EditIcon,
  ContentCopy as CopyIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

interface ContentItem {
  id: string;
  content: string;
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED';
  platforms: string[];
  scheduledDate?: string;
  publishedDate?: string;
}

interface ResponsiveContentTableProps {
  contentItems: ContentItem[];
  onEdit: (item: ContentItem) => void;
  onDuplicate: (item: ContentItem) => void;
  onDelete: (item: ContentItem) => void;
}

export default function ResponsiveContentTable({
  contentItems,
  onEdit,
  onDuplicate,
  onDelete
}: ResponsiveContentTableProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'default';
      case 'SCHEDULED':
        return 'info';
      case 'PUBLISHED':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'Draft';
      case 'SCHEDULED':
        return 'Scheduled';
      case 'PUBLISHED':
        return 'Published';
      default:
        return status;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Mobile view - Card-based layout
  if (isMobile) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {contentItems.map((item) => (
          <Card key={item.id} variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Content */}
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Content
                  </Typography>
                  <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                    {item.content}
                  </Typography>
                </Box>

                {/* Status */}
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Status
                  </Typography>
                  <Chip
                    label={getStatusLabel(item.status)}
                    size="small"
                    color={getStatusColor(item.status) as any}
                  />
                </Box>

                {/* Platforms */}
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Platforms
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {item.platforms.map((platform, index) => (
                      <Chip
                        key={index}
                        label={platform}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>

                {/* Date */}
                {(item.scheduledDate || item.publishedDate) && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      {item.status === 'SCHEDULED' ? 'Scheduled' : 'Published'}
                    </Typography>
                    <Typography variant="body2">
                      {item.status === 'SCHEDULED' 
                        ? `Scheduled: ${formatDate(item.scheduledDate)}`
                        : `Published: ${formatDate(item.publishedDate)}`
                      }
                    </Typography>
                  </Box>
                )}

                {/* Actions */}
                <Box sx={{ display: 'flex', gap: 1, pt: 1 }}>
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      onClick={() => onEdit(item)}
                      sx={{ color: 'primary.main' }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Duplicate">
                    <IconButton
                      size="small"
                      onClick={() => onDuplicate(item)}
                      sx={{ color: 'primary.main' }}
                    >
                      <CopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={() => onDelete(item)}
                      sx={{ color: 'error.main' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  // Desktop view - Table layout
  return (
    <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
      <Table sx={{ minWidth: 650 }} aria-label="content table">
        <TableHead>
          <TableRow sx={{ backgroundColor: 'grey.50' }}>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>
              Content
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>
              Status
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>
              Platforms
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>
              Scheduled / Published
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'text.secondary' }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {contentItems.map((item) => (
            <TableRow key={item.id} sx={{ '&:hover': { backgroundColor: 'grey.50' } }}>
              <TableCell>
                <Box sx={{ maxWidth: { xs: 200, sm: 300, md: 400 } }}>
                  <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                    {item.content}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  label={getStatusLabel(item.status)}
                  size="small"
                  color={getStatusColor(item.status) as any}
                />
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {item.platforms.map((platform, index) => (
                    <Chip
                      key={index}
                      label={platform}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
                  {item.status === 'SCHEDULED' 
                    ? `Scheduled: ${formatDate(item.scheduledDate)}`
                    : item.status === 'PUBLISHED'
                    ? `Published: ${formatDate(item.publishedDate)}`
                    : ''
                  }
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      onClick={() => onEdit(item)}
                      sx={{ color: 'primary.main' }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Duplicate">
                    <IconButton
                      size="small"
                      onClick={() => onDuplicate(item)}
                      sx={{ color: 'primary.main' }}
                    >
                      <CopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={() => onDelete(item)}
                      sx={{ color: 'error.main' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
