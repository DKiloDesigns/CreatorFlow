'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Grid,
  Typography,
  IconButton,
  CircularProgress,
  Stack,
  Paper,
  Avatar,
  Tooltip,
  Fade
} from '@mui/material';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Close as CloseIcon } from '@mui/icons-material';

import { toast } from 'sonner';
import { 
  Search, 
  Filter, 
  Grid as GridIcon, 
  List, 
  Eye, 
  Download, 
  Trash2, 
  Copy,
  Image as ImageIcon,
  Video,
  Calendar,
  FileText,
  Loader2,
  RefreshCw
} from 'lucide-react';

interface MediaItem {
  id: string;
  name: string;
  url: string;
  thumbnailUrl?: string;
  type: 'image' | 'video';
  size: number;
  uploadedAt: string;
  tags: string[];
  description: string;
  publicId?: string;
  metadata?: any;
}

interface MediaLibraryProps {
  onSelect?: (media: MediaItem) => void;
  selectedMedia?: MediaItem[];
  multiple?: boolean;
}

export function MediaLibrary({ onSelect, selectedMedia = [], multiple = false }: MediaLibraryProps) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [filteredMedia, setFilteredMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'video'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  // Fetch media from API
  const fetchMedia = async (page = 1, refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString()
      });

      if (typeFilter !== 'all') {
        params.append('type', typeFilter);
      }

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`/api/media/upload?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch media');
      }

      const data = await response.json();
      
      if (refresh || page === 1) {
        setMedia(data.media);
      } else {
        setMedia(prev => [...prev, ...data.media]);
      }
      
      setPagination(data.pagination);
      setFilteredMedia(data.media);
    } catch (error) {
      console.error('Failed to fetch media:', error);
      toast.error('Failed to load media library');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchMedia(1);
  }, []);

  // Filter and sort media
  useEffect(() => {
    let filtered = media;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(item => item.type === typeFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'size':
          return b.size - a.size;
        case 'date':
        default:
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
      }
    });

    setFilteredMedia(filtered);
  }, [media, searchTerm, typeFilter, sortBy]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleSelect = (item: MediaItem) => {
    if (onSelect) {
      onSelect(item);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/media/upload?id=${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete media');
      }

      setMedia(prev => prev.filter(item => item.id !== id));
      toast.success('Media deleted successfully');
    } catch (error) {
      console.error('Failed to delete media:', error);
      toast.error('Failed to delete media');
    }
  };

  const handleDownload = (item: MediaItem) => {
    const link = document.createElement('a');
    link.href = item.url;
    link.download = item.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Download started');
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  const isSelected = (item: MediaItem) => {
    return selectedMedia.some(selected => selected.id === item.id);
  };

  const handleRefresh = () => {
    fetchMedia(1, true);
  };

  const handleLoadMore = () => {
    if (pagination.page < pagination.pages) {
      fetchMedia(pagination.page + 1);
    }
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: 256,
          flexDirection: 'column',
          gap: 2
        }}
      >
        <CircularProgress size={32} />
        <Typography variant="body2" color="text.secondary">
          Loading media library...
        </Typography>
      </Box>
    );
  }

  return (
    <>
    <Stack spacing={3}>
      {/* Header */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
            Media Library
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filteredMedia.length} of {pagination.total} items
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleRefresh}
            disabled={refreshing}
            startIcon={refreshing ? <CircularProgress size={16} /> : <RefreshCw size={16} />}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            startIcon={viewMode === 'grid' ? <List size={16} /> : <GridIcon size={16} />}
          >
            {viewMode === 'grid' ? 'List' : 'Grid'}
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <TextField
            placeholder="Search media..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: <Search size={16} sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Box>
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Type</InputLabel>
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as "image" | "video" | "all")}>
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="image">Images</MenuItem>
            <MenuItem value="video">Videos</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Sort By</InputLabel>
          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value as "date" | "name" | "size")}>
            <MenuItem value="date">Date</MenuItem>
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="size">Size</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Media Grid/List */}
      {viewMode === 'grid' ? (
        <Grid container spacing={2}>
          {filteredMedia.map((item) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={item.id}>
              <Card
                sx={{
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    boxShadow: 3,
                  },
                  ...(isSelected(item) && {
                    border: 2,
                    borderColor: 'primary.main',
                  }),
                }}
                onClick={() => handleSelect(item)}
              >
                <CardContent sx={{ p: 1.5 }}>
                  <Box
                    sx={{
                      aspectRatio: '1/1',
                      bgcolor: 'grey.100',
                      borderRadius: 1,
                      overflow: 'hidden',
                      mb: 1,
                      position: 'relative',
                    }}
                  >
                    {item.type === 'image' ? (
                      <img
                        src={item.thumbnailUrl || item.url}
                        alt={item.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'grey.200',
                        }}
                      >
                        <Video size={32} color="grey" />
                      </Box>
                    )}
                    
                    {/* Overlay Actions */}
                    <Fade in={true}>
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          bgcolor: 'rgba(0, 0, 0, 0.5)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 1,
                          opacity: 0,
                          '&:hover': {
                            opacity: 1,
                          },
                          transition: 'opacity 0.2s ease-in-out',
                        }}
                      >
                        <Tooltip title="Preview">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedItem(item);
                              setPreviewOpen(true);
                            }}
                            sx={{ color: 'white' }}
                          >
                            <Eye size={16} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(item);
                            }}
                            sx={{ color: 'white' }}
                          >
                            <Download size={16} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item.id);
                            }}
                            sx={{ color: 'white' }}
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Fade>
                  </Box>
                  
                  <Stack spacing={0.5}>
                    <Typography variant="body2" sx={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatFileSize(item.size)}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {item.tags.slice(0, 2).map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{ fontSize: '0.75rem', height: 20 }}
                        />
                      ))}
                      {item.tags.length > 2 && (
                        <Chip
                          label={`+${item.tags.length - 2}`}
                          size="small"
                          sx={{ fontSize: '0.75rem', height: 20 }}
                        />
                      )}
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Stack spacing={1}>
          {filteredMedia.map((item) => (
            <Card
              key={item.id}
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: 3,
                },
                ...(isSelected(item) && {
                  border: 2,
                  borderColor: 'primary.main',
                }),
              }}
              onClick={() => handleSelect(item)}
            >
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      bgcolor: 'grey.100',
                      borderRadius: 1,
                      overflow: 'hidden',
                      flexShrink: 0,
                    }}
                  >
                    {item.type === 'image' ? (
                      <img
                        src={item.thumbnailUrl || item.url}
                        alt={item.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Video size={24} color="grey" />
                      </Box>
                    )}
                  </Box>
                  
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.name}
                      </Typography>
                      <Chip
                        label={item.type}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ fontSize: '0.75rem', height: 20 }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {item.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {formatFileSize(item.size)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(item.uploadedAt)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {item.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{ fontSize: '0.75rem', height: 20 }}
                        />
                      ))}
                    </Box>
                  </Box>
                  
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      opacity: 0,
                      '&:hover': {
                        opacity: 1,
                      },
                      transition: 'opacity 0.2s ease-in-out',
                    }}
                  >
                    <Tooltip title="Preview">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedItem(item);
                          setPreviewOpen(true);
                        }}
                      >
                        <Eye size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Copy URL">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyUrl(item.url);
                        }}
                      >
                        <Copy size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(item);
                        }}
                      >
                        <Download size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {/* Load More Button */}
      {pagination.page < pagination.pages && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={handleLoadMore}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : undefined}
          >
            {loading ? 'Loading...' : 'Load More'}
          </Button>
        </Box>
      )}
    </Stack>

    {/* Preview Dialog */}
    <MuiDialog 
        open={previewOpen} 
        onClose={() => setPreviewOpen(false)}
        maxWidth="lg"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            m: { xs: 1, sm: 2 },
            maxHeight: { xs: '95vh', sm: '90vh' },
            overflow: 'hidden'
          }
        }}
      >
        <MuiDialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ wordBreak: 'break-word' }}>{selectedItem?.name}</Typography>
            <IconButton onClick={() => setPreviewOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </MuiDialogTitle>
        <MuiDialogContent sx={{ 
          p: { xs: 2, sm: 3 }, 
          pb: { xs: 6, sm: 3 },
          maxWidth: '100%',
          overflow: 'hidden',
          '& *': { maxWidth: '100%' }
        }}>
          {selectedItem && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: '100%', overflow: 'hidden' }}>
              <Box sx={{ 
                aspectRatio: '16/9', 
                bgcolor: 'grey.100', 
                borderRadius: 1, 
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {selectedItem.type === 'image' ? (
                  <img
                    src={selectedItem.url}
                    alt={selectedItem.name}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'contain',
                      maxWidth: '100%',
                      maxHeight: '100%'
                    }}
                  />
                ) : (
                  <video
                    src={selectedItem.url}
                    controls
                    style={{ 
                      width: '100%', 
                      height: '100%',
                      maxWidth: '100%',
                      maxHeight: '100%'
                    }}
                  />
                )}
              </Box>
              
              <Grid container spacing={2} sx={{ width: '100%', margin: 0 }}>
                <Grid item xs={12} sm={6} sx={{ minWidth: 0 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.5 }}>File Size</Typography>
                  <Typography variant="body2" color="text.secondary">{formatFileSize(selectedItem.size)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ minWidth: 0 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.5 }}>Upload Date</Typography>
                  <Typography variant="body2" color="text.secondary">{formatDate(selectedItem.uploadedAt)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ minWidth: 0 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.5 }}>Description</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
                    {selectedItem.description || 'No description'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ minWidth: 0 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.5 }}>Tags</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selectedItem.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
              
              <Box sx={{ 
                display: 'flex', 
                gap: 1, 
                flexDirection: { xs: 'column', sm: 'row' },
                pt: 2,
                borderTop: 1,
                borderColor: 'divider'
              }}>
                <Button
                  variant="outlined"
                  onClick={() => copyUrl(selectedItem.url)}
                  startIcon={<Copy size={16} />}
                  fullWidth
                >
                  Copy URL
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleDownload(selectedItem)}
                  startIcon={<Download size={16} />}
                  fullWidth
                >
                  Download
                </Button>
              </Box>
            </Box>
          )}
        </MuiDialogContent>
      </MuiDialog>
    </>
  );
} 