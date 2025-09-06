'use client';

import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent,
  Button,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Badge,
  LinearProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { 
  Upload, 
  Search, 
  Filter, 
  GridView as GridIcon, 
  List as ListIcon,
  Image as ImageIcon,
  VideoFile as VideoIcon,
  Description as FileIcon,
  MoreVert,
  Download,
  Delete,
  Edit,
  Share,
  FolderOpen,
  Add,
  Refresh,
  CloudUpload,
  CheckCircle,
  Error as ErrorIcon
} from '@/lib/mui-optimized-imports';

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'audio';
  size: number;
  url: string;
  thumbnail?: string;
  uploadedAt: Date;
  tags: string[];
  description?: string;
  dimensions?: { width: number; height: number };
  duration?: number; // for videos/audio
}

const MediaLibrary = () => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Mock data for demonstration
  useEffect(() => {
    const mockFiles: MediaFile[] = [
      {
        id: '1',
        name: 'hero-image.jpg',
        type: 'image',
        size: 2048000,
        url: '/api/media/hero-image.jpg',
        thumbnail: 'https://via.placeholder.com/300x200/6366f1/ffffff?text=Hero+Image',
        uploadedAt: new Date('2024-01-15'),
        tags: ['hero', 'banner', 'marketing'],
        description: 'Main hero image for homepage',
        dimensions: { width: 1920, height: 1080 }
      },
      {
        id: '2',
        name: 'product-demo.mp4',
        type: 'video',
        size: 15728640,
        url: '/api/media/product-demo.mp4',
        thumbnail: 'https://via.placeholder.com/300x200/10b981/ffffff?text=Product+Demo',
        uploadedAt: new Date('2024-01-14'),
        tags: ['demo', 'product', 'tutorial'],
        description: 'Product demonstration video',
        duration: 120
      },
      {
        id: '3',
        name: 'brand-guidelines.pdf',
        type: 'document',
        size: 5120000,
        url: '/api/media/brand-guidelines.pdf',
        uploadedAt: new Date('2024-01-13'),
        tags: ['brand', 'guidelines', 'design'],
        description: 'Brand guidelines document'
      }
    ];
    setFiles(mockFiles);
  }, []);

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === 'all' || file.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon />;
      case 'video': return <VideoIcon />;
      case 'audio': return <FileIcon />;
      case 'document': return <FileIcon />;
      default: return <FileIcon />;
    }
  };

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setUploading(true);
    setUploadDialogOpen(true);
    setUploadProgress(0);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setUploadProgress(i);
    }

    setUploading(false);
    setSnackbar({ open: true, message: 'Files uploaded successfully!', severity: 'success' });
    setUploadDialogOpen(false);
  };

  const handleDelete = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
    setSelectedFiles(prev => prev.filter(id => id !== fileId));
    setSnackbar({ open: true, message: 'File deleted successfully!', severity: 'success' });
  };

  const renderGridView = () => (
    <Grid container spacing={2}>
      {filteredFiles.map((file) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={file.id}>
          <Card 
            sx={{ 
              cursor: 'pointer',
              border: selectedFiles.includes(file.id) ? '2px solid #1976d2' : '1px solid #e0e0e0',
              '&:hover': { boxShadow: 3 }
            }}
            onClick={() => handleFileSelect(file.id)}
          >
            <CardContent sx={{ p: 1 }}>
              <Box sx={{ position: 'relative', mb: 1 }}>
                {file.thumbnail ? (
                  <img 
                    src={file.thumbnail} 
                    alt={file.name}
                    style={{ 
                      width: '100%', 
                      height: 120, 
                      objectFit: 'cover',
                      borderRadius: 4
                    }}
                  />
                ) : (
                  <Box 
                    sx={{ 
                      width: '100%', 
                      height: 120, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      bgcolor: 'grey.100',
                      borderRadius: 1
                    }}
                  >
                    {getFileIcon(file.type)}
                  </Box>
                )}
                {file.type === 'video' && file.duration && (
                  <Chip 
                    label={formatDuration(file.duration)}
                    size="small"
                    sx={{ 
                      position: 'absolute', 
                      bottom: 8, 
                      right: 8,
                      bgcolor: 'rgba(0,0,0,0.7)',
                      color: 'white'
                    }}
                  />
                )}
              </Box>
              <Typography variant="body2" noWrap title={file.name}>
                {file.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatFileSize(file.size)}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                {file.tags.slice(0, 2).map((tag) => (
                  <Chip key={tag} label={tag} size="small" />
                ))}
                {file.tags.length > 2 && (
                  <Chip label={`+${file.tags.length - 2}`} size="small" />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderListView = () => (
    <Box>
      {filteredFiles.map((file) => (
        <Card 
          key={file.id}
          sx={{ 
            mb: 1,
            cursor: 'pointer',
            border: selectedFiles.includes(file.id) ? '2px solid #1976d2' : '1px solid #e0e0e0',
            '&:hover': { boxShadow: 2 }
          }}
          onClick={() => handleFileSelect(file.id)}
        >
          <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
            <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
              {getFileIcon(file.type)}
            </Box>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="subtitle1" noWrap>
                {file.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatFileSize(file.size)} • {file.uploadedAt.toLocaleDateString()}
              </Typography>
              {file.description && (
                <Typography variant="caption" color="text.secondary">
                  {file.description}
                </Typography>
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {file.tags.map((tag) => (
                <Chip key={tag} label={tag} size="small" />
              ))}
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        py: { xs: 2, sm: 4 },
        pb: { xs: 10, sm: 4 }, // Add bottom padding for mobile bottom nav
        minHeight: '100vh'
      }}
    >
      <Box sx={{ mb: { xs: 3, sm: 4 } }}>
        <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
          Media Library
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your media files, upload new content, and organize your assets.
        </Typography>
      </Box>

      {/* Toolbar */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: { xs: 2, sm: 3 },
        flexWrap: 'wrap',
        gap: { xs: 1, sm: 2 }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            size="small"
            sx={{ 
              minWidth: { xs: 150, sm: 200 },
              width: { xs: '100%', sm: 'auto' }
            }}
          />
          <TextField
            select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            size="small"
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="image">Images</MenuItem>
            <MenuItem value="video">Videos</MenuItem>
            <MenuItem value="document">Documents</MenuItem>
            <MenuItem value="audio">Audio</MenuItem>
          </TextField>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<GridIcon />}
            onClick={() => setViewMode('grid')}
            color={viewMode === 'grid' ? 'primary' : 'inherit'}
          >
            Grid
          </Button>
          <Button
            variant="outlined"
            startIcon={<ListIcon />}
            onClick={() => setViewMode('list')}
            color={viewMode === 'list' ? 'primary' : 'inherit'}
          >
            List
          </Button>
          <Button
            variant="contained"
            startIcon={<CloudUpload />}
            onClick={() => setUploadDialogOpen(true)}
            sx={{ ml: 2 }}
          >
            Upload
          </Button>
        </Box>
      </Box>

      {/* Stats */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Chip 
          label={`${files.length} files`} 
          color="primary" 
          variant="outlined" 
        />
        <Chip 
          label={`${formatFileSize(files.reduce((acc, file) => acc + file.size, 0))} total`} 
          color="secondary" 
          variant="outlined" 
        />
        {selectedFiles.length > 0 && (
          <Chip 
            label={`${selectedFiles.length} selected`} 
            color="success" 
            variant="outlined" 
          />
        )}
      </Box>

      {/* File List */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <LinearProgress sx={{ width: '100%' }} />
        </Box>
      ) : filteredFiles.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          border: '2px dashed #e0e0e0',
          borderRadius: 2
        }}>
          <FolderOpen sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No files found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Upload your first file to get started'
            }
          </Typography>
          <Button
            variant="contained"
            startIcon={<CloudUpload />}
            onClick={() => setUploadDialogOpen(true)}
          >
            Upload Files
          </Button>
        </Box>
      ) : (
        viewMode === 'grid' ? renderGridView() : renderListView()
      )}

      {/* Upload Dialog */}
      <Dialog 
        open={uploadDialogOpen} 
        onClose={() => !uploading && setUploadDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Upload Files</DialogTitle>
        <DialogContent>
          <Box sx={{ 
            border: '2px dashed #e0e0e0',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            mb: 2
          }}>
            <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Drag and drop files here
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              or click to browse
            </Typography>
            <input
              type="file"
              multiple
              onChange={handleUpload}
              style={{ display: 'none' }}
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button variant="contained" component="span">
                Choose Files
              </Button>
            </label>
          </Box>
          {uploading && (
            <Box>
              <Typography variant="body2" gutterBottom>
                Uploading... {uploadProgress}%
              </Typography>
              <LinearProgress variant="determinate" value={uploadProgress} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)} disabled={uploading}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MediaLibrary;
