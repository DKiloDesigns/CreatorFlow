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
  Snackbar,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  Collapse,
  Paper,
  List,
  ListItem,
  ListItemButton,
  Checkbox,
  FormControlLabel,
  Slider,
  Chip as MuiChip
} from '@mui/material';
import { 
  Upload,
  Search,
  FilterList as Filter,
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
  Error as ErrorIcon,
  Sort,
  CalendarToday,
  Storage,
  Tag as Label,
  ExpandMore,
  ExpandLess,
  Clear,
  Timeline,
  CheckCircle as Brain,
  History,
  CloudDownload,
  Link
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
  versions?: FileVersion[];
  sharing?: FileSharing;
  storageProvider?: 'local' | 'aws-s3' | 'google-drive';
  externalId?: string;
}

interface FileVersion {
  id: string;
  version: number;
  url: string;
  size: number;
  uploadedAt: Date;
  changes: string;
  uploadedBy: string;
}

interface FileSharing {
  isPublic: boolean;
  shareLink?: string;
  permissions: {
    view: boolean;
    download: boolean;
    edit: boolean;
  };
  expiresAt?: Date;
  password?: string;
  allowedUsers?: string[];
}

const MediaLibrary = () => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'timeline'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  // Enhanced search and filtering states
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [dateFilter, setDateFilter] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  const [sizeFilter, setSizeFilter] = useState<{ min: number | null; max: number | null }>({ min: null, max: null });
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Bulk operations states
  const [bulkActionMenuAnchor, setBulkActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [bulkTagDialogOpen, setBulkTagDialogOpen] = useState(false);
  const [newBulkTag, setNewBulkTag] = useState('');
  
  // File organization states
  const [collections, setCollections] = useState<{ id: string; name: string; files: string[] }[]>([]);
  const [currentCollection, setCurrentCollection] = useState<string | null>(null);
  const [createCollectionDialogOpen, setCreateCollectionDialogOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  
  // Drag & drop states
  const [draggedFile, setDraggedFile] = useState<string | null>(null);
  const [dragOverCollection, setDragOverCollection] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Metadata editing states
  const [metadataDialogOpen, setMetadataDialogOpen] = useState(false);
  const [editingFile, setEditingFile] = useState<MediaFile | null>(null);
  const [fileMetadata, setFileMetadata] = useState({
    name: '',
    description: '',
    tags: [] as string[],
    customFields: {} as Record<string, string>
  });
  
  // AI analysis states
  const [aiAnalysisDialogOpen, setAiAnalysisDialogOpen] = useState(false);
  const [analyzingFile, setAnalyzingFile] = useState<MediaFile | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState({
    suggestedTags: [] as string[],
    description: '',
    confidence: 0,
    analysisType: '',
    processing: false
  });
  
  // Advanced preview states
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  
  // Batch processing states
  const [batchProcessingDialogOpen, setBatchProcessingDialogOpen] = useState(false);
  const [batchProcessing, setBatchProcessing] = useState({
    operation: 'resize',
    width: 1920,
    height: 1080,
    quality: 90,
    format: 'jpeg',
    processing: false,
    progress: 0
  });

  // Phase 3: File Versioning & History
  const [versionHistoryDialogOpen, setVersionHistoryDialogOpen] = useState(false);
  const [selectedFileVersions, setSelectedFileVersions] = useState<FileVersion[]>([]);
  const [uploadNewVersionDialogOpen, setUploadNewVersionDialogOpen] = useState(false);
  const [newVersionFile, setNewVersionFile] = useState<File | null>(null);
  const [versionChanges, setVersionChanges] = useState('');

  // Phase 3: Advanced Sharing
  const [sharingDialogOpen, setSharingDialogOpen] = useState(false);
  const [sharingSettings, setSharingSettings] = useState<FileSharing>({
    isPublic: false,
    permissions: { view: true, download: false, edit: false },
    expiresAt: undefined,
    password: '',
    allowedUsers: []
  });

  // Phase 3: External Storage
  const [storageProviders, setStorageProviders] = useState([
    { id: 'local', name: 'Local Storage', connected: true, quota: { used: '2.1 GB', total: '10 GB' } },
    { id: 'aws-s3', name: 'AWS S3', connected: false, quota: { used: '0 GB', total: 'Unlimited' } },
    { id: 'google-drive', name: 'Google Drive', connected: false, quota: { used: '0 GB', total: '15 GB' } }
  ]);
  const [storageDialogOpen, setStorageDialogOpen] = useState(false);
  const [migratingFile, setMigratingFile] = useState<string | null>(null);

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
        dimensions: { width: 1920, height: 1080 },
        versions: [
          {
            id: 'v1',
            version: 1,
            url: '/api/media/hero-image-v1.jpg',
            size: 1800000,
            uploadedAt: new Date('2024-01-15'),
            changes: 'Initial upload',
            uploadedBy: 'John Doe'
          },
          {
            id: 'v2',
            version: 2,
            url: '/api/media/hero-image-v2.jpg',
            size: 2048000,
            uploadedAt: new Date('2024-01-20'),
            changes: 'Updated colors and contrast',
            uploadedBy: 'Jane Smith'
          }
        ],
        sharing: {
          isPublic: true,
          shareLink: 'https://creatorflow.app/share/hero-image-abc123',
          permissions: { view: true, download: true, edit: false },
          expiresAt: new Date('2024-12-31')
        },
        storageProvider: 'local'
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
      },
      {
        id: '4',
        name: 'team-photo.jpg',
        type: 'image',
        size: 1536000,
        url: '/api/media/team-photo.jpg',
        thumbnail: 'https://via.placeholder.com/300x200/f59e0b/ffffff?text=Team+Photo',
        uploadedAt: new Date('2024-01-12'),
        tags: ['team', 'photo', 'about'],
        description: 'Team photo for about page',
        dimensions: { width: 1200, height: 800 }
      },
      {
        id: '5',
        name: 'podcast-intro.mp3',
        type: 'audio',
        size: 8192000,
        url: '/api/media/podcast-intro.mp3',
        uploadedAt: new Date('2024-01-11'),
        tags: ['podcast', 'audio', 'intro'],
        description: 'Podcast introduction audio',
        duration: 30
      },
      {
        id: '6',
        name: 'presentation-slides.pdf',
        type: 'document',
        size: 2560000,
        url: '/api/media/presentation-slides.pdf',
        uploadedAt: new Date('2024-01-10'),
        tags: ['presentation', 'slides', 'business'],
        description: 'Quarterly business presentation slides'
      }
    ];
    setFiles(mockFiles);
    
    // Extract unique tags for filtering
    const allTags = mockFiles.flatMap(file => file.tags);
    const uniqueTags = [...new Set(allTags)];
    setAvailableTags(uniqueTags);
  }, []);

  // Enhanced filtering and sorting logic
  const filteredAndSortedFiles = React.useMemo(() => {
    let filtered = files.filter(file => {
      // Search filter (name, tags, description)
      const matchesSearch = searchTerm === '' || 
        file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (file.description && file.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Type filter
      const matchesType = filterType === 'all' || file.type === filterType;
      
      // Date filter
      const matchesDate = (!dateFilter.start || file.uploadedAt >= dateFilter.start) &&
                         (!dateFilter.end || file.uploadedAt <= dateFilter.end);
      
      // Size filter
      const matchesSize = (!sizeFilter.min || file.size >= sizeFilter.min) &&
                         (!sizeFilter.max || file.size <= sizeFilter.max);
      
      // Tag filter
      const matchesTags = tagFilter.length === 0 || 
        tagFilter.some(filterTag => file.tags.includes(filterTag));
      
      // Collection filter
      const matchesCollection = !currentCollection || 
        collections.find(c => c.id === currentCollection)?.files.includes(file.id);
      
      return matchesSearch && matchesType && matchesDate && matchesSize && matchesTags && matchesCollection;
    });

    // Sort files
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = a.uploadedAt.getTime() - b.uploadedAt.getTime();
          break;
        case 'size':
          comparison = a.size - b.size;
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [files, searchTerm, filterType, dateFilter, sizeFilter, tagFilter, sortBy, sortOrder, collections, currentCollection]);

  // Generate search suggestions
  React.useEffect(() => {
    if (searchTerm.length > 1) {
      const suggestions = new Set<string>();
      
      files.forEach(file => {
        // Add file names that match
        if (file.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          suggestions.add(file.name);
        }
        
        // Add tags that match
        file.tags.forEach(tag => {
          if (tag.toLowerCase().includes(searchTerm.toLowerCase())) {
            suggestions.add(tag);
          }
        });
        
        // Add descriptions that match
        if (file.description && file.description.toLowerCase().includes(searchTerm.toLowerCase())) {
          const words = file.description.split(' ').filter(word => 
            word.toLowerCase().includes(searchTerm.toLowerCase())
          );
          words.forEach(word => suggestions.add(word));
        }
      });
      
      setSearchSuggestions(Array.from(suggestions).slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, files]);

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

  // Bulk operations
  const handleBulkDelete = () => {
    setFiles(prev => prev.filter(file => !selectedFiles.includes(file.id)));
    setSelectedFiles([]);
    setBulkActionMenuAnchor(null);
    setSnackbar({ open: true, message: `${selectedFiles.length} files deleted successfully!`, severity: 'success' });
  };

  const handleBulkDownload = () => {
    // In a real app, this would trigger a download
    setSnackbar({ open: true, message: `Preparing download for ${selectedFiles.length} files...`, severity: 'success' });
    setBulkActionMenuAnchor(null);
  };

  const handleBulkTag = () => {
    setBulkTagDialogOpen(true);
    setBulkActionMenuAnchor(null);
  };

  const handleAddBulkTag = () => {
    if (newBulkTag.trim()) {
      setFiles(prev => prev.map(file => 
        selectedFiles.includes(file.id) 
          ? { ...file, tags: [...file.tags, newBulkTag.trim()] }
          : file
      ));
      setNewBulkTag('');
      setBulkTagDialogOpen(false);
      setSnackbar({ open: true, message: `Tag "${newBulkTag}" added to ${selectedFiles.length} files!`, severity: 'success' });
    }
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === filteredAndSortedFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredAndSortedFiles.map(file => file.id));
    }
  };

  // Collection management
  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      const newCollection = {
        id: Date.now().toString(),
        name: newCollectionName.trim(),
        files: selectedFiles
      };
      setCollections(prev => [...prev, newCollection]);
      setNewCollectionName('');
      setCreateCollectionDialogOpen(false);
      setSelectedFiles([]);
      setSnackbar({ open: true, message: `Collection "${newCollectionName}" created with ${selectedFiles.length} files!`, severity: 'success' });
    }
  };

  const handleAddToCollection = (collectionId: string) => {
    setCollections(prev => prev.map(collection => 
      collection.id === collectionId 
        ? { ...collection, files: [...new Set([...collection.files, ...selectedFiles])] }
        : collection
    ));
    setSelectedFiles([]);
    setSnackbar({ open: true, message: `Files added to collection!`, severity: 'success' });
  };

  const handleRemoveFromCollection = (collectionId: string, fileId: string) => {
    setCollections(prev => prev.map(collection => 
      collection.id === collectionId 
        ? { ...collection, files: collection.files.filter(id => id !== fileId) }
        : collection
    ));
  };

  const handleDeleteCollection = (collectionId: string) => {
    setCollections(prev => prev.filter(collection => collection.id !== collectionId));
    if (currentCollection === collectionId) {
      setCurrentCollection(null);
    }
    setSnackbar({ open: true, message: 'Collection deleted!', severity: 'success' });
  };

  // Drag & drop handlers
  const handleDragStart = (fileId: string) => {
    setDraggedFile(fileId);
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setDraggedFile(null);
    setIsDragging(false);
    setDragOverCollection(null);
  };

  const handleDragOver = (e: React.DragEvent, collectionId: string | null) => {
    e.preventDefault();
    setDragOverCollection(collectionId);
  };

  const handleDrop = (e: React.DragEvent, targetCollectionId: string | null) => {
    e.preventDefault();
    
    if (!draggedFile) return;

    // If dropping on a collection
    if (targetCollectionId) {
      // Remove from current collection if it exists
      setCollections(prev => prev.map(collection => ({
        ...collection,
        files: collection.files.filter(id => id !== draggedFile)
      })));

      // Add to target collection
      setCollections(prev => prev.map(collection => 
        collection.id === targetCollectionId 
          ? { ...collection, files: [...collection.files, draggedFile] }
          : collection
      ));

      setSnackbar({ 
        open: true, 
        message: `File moved to collection!`, 
        severity: 'success' 
      });
    } else {
      // If dropping on "All Files", remove from all collections
      setCollections(prev => prev.map(collection => ({
        ...collection,
        files: collection.files.filter(id => id !== draggedFile)
      })));

      setSnackbar({ 
        open: true, 
        message: `File moved to All Files`, 
        severity: 'success' 
      });
    }

    handleDragEnd();
  };

  const handleFileReorder = (dragIndex: number, hoverIndex: number) => {
    const draggedItem = filteredAndSortedFiles[dragIndex];
    const newFiles = [...filteredAndSortedFiles];
    newFiles.splice(dragIndex, 1);
    newFiles.splice(hoverIndex, 0, draggedItem);
    
    // In a real app, you'd update the server with the new order
    setSnackbar({ 
      open: true, 
      message: `Files reordered!`, 
      severity: 'success' 
    });
  };

  // Metadata editing functions
  const handleEditMetadata = (file: MediaFile) => {
    setEditingFile(file);
    setFileMetadata({
      name: file.name,
      description: file.description || '',
      tags: [...file.tags],
      customFields: {
        'Camera': 'Canon EOS R5',
        'Lens': 'RF 24-70mm f/2.8L',
        'ISO': '100',
        'Aperture': 'f/2.8',
        'Shutter Speed': '1/125s',
        'Location': 'San Francisco, CA',
        'Photographer': 'John Doe'
      }
    });
    setMetadataDialogOpen(true);
  };

  const handleSaveMetadata = () => {
    if (!editingFile) return;

    setFiles(prev => prev.map(file => 
      file.id === editingFile.id 
        ? {
            ...file,
            name: fileMetadata.name,
            description: fileMetadata.description,
            tags: fileMetadata.tags
          }
        : file
    ));

    setMetadataDialogOpen(false);
    setSnackbar({ 
      open: true, 
      message: 'Metadata updated successfully!', 
      severity: 'success' 
    });
  };

  const handleAddCustomField = () => {
    const fieldName = prompt('Enter field name:');
    if (fieldName) {
      setFileMetadata(prev => ({
        ...prev,
        customFields: {
          ...prev.customFields,
          [fieldName]: ''
        }
      }));
    }
  };

  const handleRemoveCustomField = (fieldName: string) => {
    setFileMetadata(prev => {
      const newFields = { ...prev.customFields };
      delete newFields[fieldName];
      return {
        ...prev,
        customFields: newFields
      };
    });
  };

  // AI Analysis functions
  const handleAiAnalysis = async (file: MediaFile) => {
    setAnalyzingFile(file);
    setAiAnalysisDialogOpen(true);
    setAiAnalysis(prev => ({ ...prev, processing: true }));

    // Simulate AI analysis
    setTimeout(() => {
      const mockAnalysis = {
        suggestedTags: ['professional', 'business', 'modern', 'clean', 'corporate'],
        description: 'A professional business image with modern design elements, suitable for corporate presentations and marketing materials.',
        confidence: 87,
        analysisType: 'Image Content Analysis',
        processing: false
      };
      setAiAnalysis(mockAnalysis);
    }, 2000);
  };

  const handleApplyAiSuggestions = () => {
    if (!analyzingFile) return;

    setFiles(prev => prev.map(file => 
      file.id === analyzingFile.id 
        ? {
            ...file,
            tags: [...new Set([...file.tags, ...aiAnalysis.suggestedTags])],
            description: aiAnalysis.description || file.description
          }
        : file
    ));

    setAiAnalysisDialogOpen(false);
    setSnackbar({ 
      open: true, 
      message: 'AI suggestions applied successfully!', 
      severity: 'success' 
    });
  };

  const handleBulkAiAnalysis = async () => {
    if (selectedFiles.length === 0) return;

    setSnackbar({ 
      open: true, 
      message: `Starting AI analysis for ${selectedFiles.length} files...`, 
      severity: 'success' 
    });

    // Simulate bulk AI analysis
    setTimeout(() => {
      setFiles(prev => prev.map(file => 
        selectedFiles.includes(file.id) 
          ? {
              ...file,
              tags: [...file.tags, 'ai-analyzed', 'auto-tagged'],
              description: file.description || 'AI-analyzed content with enhanced metadata'
            }
          : file
      ));
      
      setSelectedFiles([]);
      setSnackbar({ 
        open: true, 
        message: `AI analysis completed for ${selectedFiles.length} files!`, 
        severity: 'success' 
      });
    }, 3000);
  };

  // Advanced preview functions
  const handlePreview = (file: MediaFile) => {
    setPreviewFile(file);
    setPreviewDialogOpen(true);
    setZoomLevel(100);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 400));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 25));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  // Batch processing functions
  const handleBatchProcessing = () => {
    if (selectedFiles.length === 0) return;
    setBatchProcessingDialogOpen(true);
  };

  const handleStartBatchProcessing = async () => {
    setBatchProcessing(prev => ({ ...prev, processing: true, progress: 0 }));
    
    // Simulate batch processing
    const interval = setInterval(() => {
      setBatchProcessing(prev => {
        const newProgress = prev.progress + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setSnackbar({ 
            open: true, 
            message: `Batch processing completed for ${selectedFiles.length} files!`, 
            severity: 'success' 
          });
          setSelectedFiles([]);
          setBatchProcessingDialogOpen(false);
          return { ...prev, processing: false, progress: 0 };
        }
        return { ...prev, progress: newProgress };
      });
    }, 200);
  };

  // Phase 3: File Versioning Handlers
  const handleViewVersionHistory = (file: MediaFile) => {
    setSelectedFileVersions(file.versions || []);
    setVersionHistoryDialogOpen(true);
  };

  const handleUploadNewVersion = (file: MediaFile) => {
    setUploadNewVersionDialogOpen(true);
    setVersionChanges('');
  };

  const handleVersionUpload = async () => {
    if (!newVersionFile) return;
    
    // Simulate version upload
    setSnackbar({
      open: true,
      message: `New version uploaded for ${newVersionFile.name}`,
      severity: 'success'
    });
    
    setUploadNewVersionDialogOpen(false);
    setNewVersionFile(null);
    setVersionChanges('');
  };

  // Phase 3: Advanced Sharing Handlers
  const handleOpenSharing = (file: MediaFile) => {
    setSharingSettings(file.sharing || {
      isPublic: false,
      permissions: { view: true, download: false, edit: false }
    });
    setSharingDialogOpen(true);
  };

  const handleSaveSharing = async () => {
    // Simulate saving sharing settings
    setSnackbar({
      open: true,
      message: 'Sharing settings updated successfully',
      severity: 'success'
    });
    setSharingDialogOpen(false);
  };

  const handleGenerateShareLink = () => {
    const shareLink = `https://creatorflow.app/share/${Math.random().toString(36).substr(2, 9)}`;
    setSharingSettings(prev => ({ ...prev, shareLink }));
  };

  // Phase 3: External Storage Handlers
  const handleOpenStorage = () => {
    setStorageDialogOpen(true);
  };

  const handleConnectStorage = (providerId: string) => {
    setStorageProviders(prev => 
      prev.map(p => p.id === providerId ? { ...p, connected: true } : p)
    );
    setSnackbar({
      open: true,
      message: `${storageProviders.find(p => p.id === providerId)?.name} connected successfully`,
      severity: 'success'
    });
  };

  const handleMigrateFile = (fileId: string, providerId: string) => {
    setMigratingFile(fileId);
    // Simulate migration
    setTimeout(() => {
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, storageProvider: providerId as any } : f
      ));
      setMigratingFile(null);
      setSnackbar({
        open: true,
        message: 'File migrated successfully',
        severity: 'success'
      });
    }, 2000);
  };

  // Helper function to determine image aspect ratio and grid span
  const getImageAspectRatio = (file: MediaFile) => {
    if (file.dimensions) {
      const { width, height } = file.dimensions;
      return width / height;
    }
    // Default aspect ratio for files without dimensions
    return 1;
  };

  const getGridSpan = (file: MediaFile) => {
    const aspectRatio = getImageAspectRatio(file);
    
    // Determine grid span based on aspect ratio
    if (aspectRatio > 2.5) {
      // Very wide images (panoramas) - span 2-3 columns
      return { xs: 12, sm: 8, md: 6, lg: 4 };
    } else if (aspectRatio > 1.5) {
      // Wide landscape images - span 1.5-2 columns
      return { xs: 12, sm: 6, md: 4, lg: 3 };
    } else if (aspectRatio < 0.7) {
      // Tall portrait images - span 1 column but taller
      return { xs: 12, sm: 6, md: 4, lg: 3 };
    } else {
      // Square or standard images - span 1 column
      return { xs: 12, sm: 6, md: 4, lg: 3 };
    }
  };

  const renderGridView = () => (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(3, 1fr)',
          sm: 'repeat(4, 1fr)', 
          md: 'repeat(6, 1fr)',
          lg: 'repeat(6, 1fr)'
        },
        gap: 2,
        width: '100%'
      }}
    >
      {filteredAndSortedFiles.map((file, index) => {
        const aspectRatio = getImageAspectRatio(file);
        const isWide = aspectRatio > 1.5;
        const isVeryWide = aspectRatio > 2.5;
        
        return (
          <Card 
            key={file.id}
            draggable
            onDragStart={() => handleDragStart(file.id)}
            onDragEnd={handleDragEnd}
            sx={{ 
              cursor: 'grab',
              border: selectedFiles.includes(file.id) ? '2px solid #1976d2' : '1px solid transparent',
              borderRadius: 2,
              overflow: 'hidden',
              '&:hover': { 
                boxShadow: 4,
                transform: 'scale(1.02)',
                '& .file-actions': { opacity: 1 }
              },
              transform: draggedFile === file.id ? 'rotate(5deg) scale(1.05)' : 'none',
              transition: 'all 0.2s ease-in-out',
              opacity: draggedFile === file.id ? 0.7 : 1,
              '&:active': { cursor: 'grabbing' },
              gridColumn: {
                xs: isVeryWide ? 'span 3' : isWide ? 'span 2' : 'span 1',
                sm: isVeryWide ? 'span 4' : isWide ? 'span 2' : 'span 1',
                md: isVeryWide ? 'span 3' : isWide ? 'span 2' : 'span 1',
                lg: isVeryWide ? 'span 3' : isWide ? 'span 2' : 'span 1'
              },
              position: 'relative',
              aspectRatio: isVeryWide ? '3/1' : isWide ? '2/1' : '1/1'
            }}
            onClick={() => handleFileSelect(file.id)}
          >
            {/* Visual Content */}
            <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
              {file.thumbnail ? (
                <img 
                  src={file.thumbnail} 
                  alt={file.name}
                  style={{ 
                    width: '100%', 
                    height: '100%',
                    objectFit: 'cover'
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
                    bgcolor: 'grey.100'
                  }}
                >
                  <Box sx={{ fontSize: 32 }}>
                    {getFileIcon(file.type)}
                  </Box>
                </Box>
              )}
              
              {/* Video Duration Badge */}
              {file.type === 'video' && file.duration && (
                <Chip 
                  label={formatDuration(file.duration)}
                  size="small"
                  sx={{ 
                    position: 'absolute', 
                    bottom: 8, 
                    right: 8,
                    bgcolor: 'rgba(0,0,0,0.8)',
                    color: 'white',
                    fontSize: '0.7rem'
                  }}
                />
              )}
              
              {/* File Type Badge */}
              <Chip 
                label={file.type.toUpperCase()}
                size="small"
                sx={{ 
                  position: 'absolute', 
                  top: 8, 
                  left: 8,
                  bgcolor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  fontSize: '0.65rem',
                  height: 20
                }}
              />
              
              {/* Selection Indicator */}
              {selectedFiles.includes(file.id) && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}
                >
                  ✓
                </Box>
              )}
              
              {/* Hover Actions */}
              <Box 
                className="file-actions"
                sx={{ 
                  position: 'absolute', 
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  bgcolor: 'rgba(0,0,0,0.5)',
                  display: 'flex', 
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  opacity: 0,
                  transition: 'opacity 0.2s ease-in-out'
                }}
              >
                <Tooltip title="Preview">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreview(file);
                    }}
                    sx={{ 
                      bgcolor: 'white',
                      color: 'text.primary',
                      '&:hover': { bgcolor: 'grey.100' }
                    }}
                  >
                    <Search />
                  </IconButton>
                </Tooltip>
                <Tooltip title="More Options">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditMetadata(file);
                    }}
                    sx={{ 
                      bgcolor: 'white',
                      color: 'text.primary',
                      '&:hover': { bgcolor: 'grey.100' }
                    }}
                  >
                    <MoreVert />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Card>
        );
      })}
    </Box>
  );

  const renderListView = () => (
    <Box>
      {filteredAndSortedFiles.map((file) => (
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

  const renderTimelineView = () => {
    // Group files by date
    const groupedFiles = filteredAndSortedFiles.reduce((groups, file) => {
      const date = file.uploadedAt.toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(file);
      return groups;
    }, {} as Record<string, MediaFile[]>);

    return (
      <Box>
        {Object.entries(groupedFiles)
          .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
          .map(([date, files]) => (
            <Box key={date} sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', borderBottom: 1, borderColor: 'divider', pb: 1 }}>
                {date}
              </Typography>
              <Grid container spacing={2}>
                {files.map((file) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={file.id}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        border: selectedFiles.includes(file.id) ? '2px solid #1976d2' : '1px solid #e0e0e0',
                        '&:hover': { boxShadow: 3 },
                        height: '100%'
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
                          {formatFileSize(file.size)} • {file.uploadedAt.toLocaleTimeString()}
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
            </Box>
          ))}
      </Box>
    );
  };

  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        py: { xs: 2, sm: 4 },
        pb: { xs: 12, sm: 4 }, // Add bottom padding for mobile bottom nav
        minHeight: '100vh',
        px: { xs: 1, sm: 2 },
        maxWidth: '100%',
        overflow: 'hidden'
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

      {/* Enhanced Toolbar */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: 2,
        mb: { xs: 2, sm: 3 }
      }}>
        {/* Main Toolbar Row */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: { xs: 2, sm: 2 }
        }}>
          {/* Search and Basic Filters */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 1, sm: 2 }, 
            flexWrap: 'wrap',
            flex: 1,
            minWidth: 0
          }}>
            {/* Enhanced Search with Suggestions */}
            <Box sx={{ position: 'relative', minWidth: { xs: 120, sm: 200 }, flex: 1 }}>
              <Autocomplete
                freeSolo
                options={searchSuggestions}
                value={searchTerm}
                onInputChange={(event, newValue) => {
                  setSearchTerm(newValue || '');
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search files..."
                    size="small"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Search sx={{ mr: 1, fontSize: 16 }} />
                    {option}
                  </Box>
                )}
                onClose={() => setShowSuggestions(false)}
                onOpen={() => setShowSuggestions(true)}
                open={showSuggestions && searchSuggestions.length > 0}
              />
            </Box>

            {/* Type Filter */}
            <FormControl size="small" sx={{ minWidth: { xs: 100, sm: 120 } }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={filterType}
                label="Type"
                onChange={(e) => setFilterType(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="image">Images</MenuItem>
                <MenuItem value="video">Videos</MenuItem>
                <MenuItem value="document">Docs</MenuItem>
                <MenuItem value="audio">Audio</MenuItem>
              </Select>
            </FormControl>

            {/* Sort Options */}
            <FormControl size="small" sx={{ minWidth: { xs: 100, sm: 120 } }}>
              <InputLabel>Sort</InputLabel>
              <Select
                value={sortBy}
                label="Sort"
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="date">Date</MenuItem>
                <MenuItem value="size">Size</MenuItem>
                <MenuItem value="type">Type</MenuItem>
              </Select>
            </FormControl>

            {/* Sort Order */}
            <IconButton
              size="small"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              <Sort sx={{ transform: sortOrder === 'desc' ? 'rotate(180deg)' : 'none' }} />
            </IconButton>
          </Box>

          {/* View and Action Buttons */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            flexWrap: 'wrap',
            justifyContent: { xs: 'center', sm: 'flex-end' }
          }}>
            <Button
              variant={viewMode === 'grid' ? 'contained' : 'outlined'}
              startIcon={<GridIcon />}
              onClick={() => setViewMode('grid')}
              size="small"
            >
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'contained' : 'outlined'}
              startIcon={<ListIcon />}
              onClick={() => setViewMode('list')}
              size="small"
            >
              List
            </Button>
            <Button
              variant={viewMode === 'timeline' ? 'contained' : 'outlined'}
              startIcon={<Timeline />}
              onClick={() => setViewMode('timeline')}
              size="small"
            >
              Timeline
            </Button>
            <Button
              variant="contained"
              startIcon={<CloudUpload />}
              onClick={() => setUploadDialogOpen(true)}
              size="small"
            >
              Upload
            </Button>
            <Button
              variant="outlined"
              startIcon={<CloudDownload />}
              onClick={handleOpenStorage}
              size="small"
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              Storage
            </Button>
          </Box>
        </Box>


        {/* Advanced Filters Button */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Filter />}
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            size="small"
          >
            Advanced Filters
          </Button>
        </Box>
      </Box>

      {/* Collections Sidebar */}
      {collections.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Collections
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label="All Files"
              color={currentCollection === null ? 'primary' : 'default'}
              onClick={() => setCurrentCollection(null)}
              clickable
              onDragOver={(e) => handleDragOver(e, null)}
              onDrop={(e) => handleDrop(e, null)}
              sx={{
                bgcolor: dragOverCollection === null && isDragging ? 'primary.100' : 'inherit',
                border: dragOverCollection === null && isDragging ? '2px dashed #1976d2' : 'none',
                transition: 'all 0.2s ease-in-out'
              }}
            />
            {collections.map((collection) => (
              <Chip
                key={collection.id}
                label={`${collection.name} (${collection.files.length})`}
                color={currentCollection === collection.id ? 'primary' : 'default'}
                onClick={() => setCurrentCollection(collection.id)}
                onDelete={() => handleDeleteCollection(collection.id)}
                clickable
                deleteIcon={<Delete />}
                onDragOver={(e) => handleDragOver(e, collection.id)}
                onDrop={(e) => handleDrop(e, collection.id)}
                sx={{
                  bgcolor: dragOverCollection === collection.id && isDragging ? 'primary.100' : 'inherit',
                  border: dragOverCollection === collection.id && isDragging ? '2px dashed #1976d2' : 'none',
                  transition: 'all 0.2s ease-in-out'
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Stats */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Chip 
          label={`${filteredAndSortedFiles.length} of ${files.length} files`} 
          color="primary" 
          variant="outlined" 
        />
        <Chip 
          label={`${formatFileSize(filteredAndSortedFiles.reduce((acc, file) => acc + file.size, 0))} total`} 
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
        {(searchTerm || filterType !== 'all' || tagFilter.length > 0 || dateFilter.start || dateFilter.end || sizeFilter.min || sizeFilter.max) && (
          <Chip 
            label="Filtered" 
            color="warning" 
            variant="outlined" 
            onDelete={() => {
              setSearchTerm('');
              setFilterType('all');
              setTagFilter([]);
              setDateFilter({ start: null, end: null });
              setSizeFilter({ min: null, max: null });
            }}
            deleteIcon={<Clear />}
          />
        )}
      </Box>

      {/* Bulk Actions Bar */}
      {selectedFiles.length > 0 && (
        <Paper sx={{ 
          p: 2, 
          mb: 3, 
          bgcolor: 'primary.50', 
          border: '1px solid',
          borderColor: 'primary.200'
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={handleSelectAll}
              >
                {selectedFiles.length === filteredAndSortedFiles.length ? 'Deselect All' : 'Select All'}
              </Button>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={handleBulkDownload}
                size="small"
              >
                Download
              </Button>
              <Button
                variant="outlined"
                startIcon={<Label />}
                onClick={handleBulkTag}
                size="small"
              >
                Add Tag
              </Button>
              <Button
                variant="outlined"
                startIcon={<FolderOpen />}
                onClick={() => setCreateCollectionDialogOpen(true)}
                size="small"
              >
                Create Collection
              </Button>
              <Button
                variant="outlined"
                startIcon={<Brain />}
                onClick={handleBulkAiAnalysis}
                size="small"
                color="success"
              >
                AI Analysis
              </Button>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={handleBatchProcessing}
                size="small"
                color="info"
              >
                Batch Process
              </Button>
              <Button
                variant="outlined"
                startIcon={<Delete />}
                onClick={handleBulkDelete}
                size="small"
                color="error"
              >
                Delete
              </Button>
              <Button
                variant="text"
                onClick={() => setSelectedFiles([])}
                size="small"
              >
                Clear
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      {/* File List */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <LinearProgress sx={{ width: '100%' }} />
        </Box>
      ) : filteredAndSortedFiles.length === 0 ? (
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
        viewMode === 'grid' ? renderGridView() : 
        viewMode === 'list' ? renderListView() : 
        renderTimelineView()
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

      {/* Bulk Tag Dialog */}
      <Dialog 
        open={bulkTagDialogOpen} 
        onClose={() => setBulkTagDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Tag to Selected Files</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Add a tag to {selectedFiles.length} selected file{selectedFiles.length > 1 ? 's' : ''}.
          </Typography>
          <TextField
            fullWidth
            label="Tag Name"
            value={newBulkTag}
            onChange={(e) => setNewBulkTag(e.target.value)}
            placeholder="Enter tag name..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddBulkTag();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkTagDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddBulkTag}
            variant="contained"
            disabled={!newBulkTag.trim()}
          >
            Add Tag
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Collection Dialog */}
      <Dialog 
        open={createCollectionDialogOpen} 
        onClose={() => setCreateCollectionDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Collection</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Create a collection with {selectedFiles.length} selected file{selectedFiles.length > 1 ? 's' : ''}.
          </Typography>
          <TextField
            fullWidth
            label="Collection Name"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            placeholder="Enter collection name..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleCreateCollection();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateCollectionDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateCollection}
            variant="contained"
            disabled={!newCollectionName.trim()}
          >
            Create Collection
          </Button>
        </DialogActions>
      </Dialog>

      {/* Advanced Metadata Editing Dialog */}
      <Dialog 
        open={metadataDialogOpen} 
        onClose={() => setMetadataDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            m: { xs: 1, sm: 2 },
            maxHeight: { xs: '95vh', sm: '90vh' },
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontWeight: 600
        }}>
          Edit File Metadata
        </DialogTitle>
        <DialogContent sx={{
          p: { xs: 2, sm: 3 },
          pb: { xs: 6, sm: 3 },
          maxWidth: '100%',
          overflow: 'hidden',
          '& *': { maxWidth: '100%' }
        }}>
          {editingFile && (
            <Box>
              {/* File Preview */}
              <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
                {editingFile.thumbnail ? (
                  <img 
                    src={editingFile.thumbnail} 
                    alt={editingFile.name}
                    style={{ 
                      width: 80, 
                      height: 80, 
                      objectFit: 'cover',
                      borderRadius: 8
                    }}
                  />
                ) : (
                  <Box 
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      bgcolor: 'grey.100',
                      borderRadius: 1
                    }}
                  >
                    {getFileIcon(editingFile.type)}
                  </Box>
                )}
                <Box>
                  <Typography variant="h6">{editingFile.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatFileSize(editingFile.size)} • {editingFile.type.toUpperCase()}
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={3}>
                {/* Basic Information */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Basic Information
                  </Typography>
                  <TextField
                    fullWidth
                    label="File Name"
                    value={fileMetadata.name}
                    onChange={(e) => setFileMetadata(prev => ({ ...prev, name: e.target.value }))}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Description"
                    value={fileMetadata.description}
                    onChange={(e) => setFileMetadata(prev => ({ ...prev, description: e.target.value }))}
                    multiline
                    rows={3}
                    sx={{ mb: 2 }}
                  />
                  <Autocomplete
                    multiple
                    options={availableTags}
                    value={fileMetadata.tags}
                    onChange={(event, newValue) => setFileMetadata(prev => ({ ...prev, tags: newValue }))}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <MuiChip
                          variant="outlined"
                          label={option}
                          {...getTagProps({ index })}
                          key={option}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Tags"
                        placeholder="Add tags..."
                      />
                    )}
                  />
                </Grid>

                {/* EXIF Data */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    EXIF Data
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {Object.entries(fileMetadata.customFields).map(([key, value]) => (
                      <Box key={key} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <TextField
                          label={key}
                          value={value}
                          onChange={(e) => setFileMetadata(prev => ({
                            ...prev,
                            customFields: {
                              ...prev.customFields,
                              [key]: e.target.value
                            }
                          }))}
                          size="small"
                          sx={{ flex: 1 }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveCustomField(key)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    ))}
                    <Button
                      variant="outlined"
                      startIcon={<Add />}
                      onClick={handleAddCustomField}
                      size="small"
                    >
                      Add Custom Field
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setMetadataDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveMetadata}
            variant="contained"
          >
            Save Metadata
          </Button>
        </DialogActions>
      </Dialog>

      {/* AI Analysis Dialog */}
      <Dialog 
        open={aiAnalysisDialogOpen} 
        onClose={() => setAiAnalysisDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            m: { xs: 1, sm: 2 },
            maxHeight: { xs: '95vh', sm: '90vh' },
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          fontWeight: 600
        }}>
          AI Content Analysis
        </DialogTitle>
        <DialogContent sx={{
          p: { xs: 2, sm: 3 },
          pb: { xs: 6, sm: 3 },
          maxWidth: '100%',
          overflow: 'hidden',
          '& *': { maxWidth: '100%' }
        }}>
          {analyzingFile && (
            <Box>
              {/* File Preview */}
              <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
                {analyzingFile.thumbnail ? (
                  <img 
                    src={analyzingFile.thumbnail} 
                    alt={analyzingFile.name}
                    style={{ 
                      width: 80, 
                      height: 80, 
                      objectFit: 'cover',
                      borderRadius: 8
                    }}
                  />
                ) : (
                  <Box 
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      bgcolor: 'grey.100',
                      borderRadius: 1
                    }}
                  >
                    {getFileIcon(analyzingFile.type)}
                  </Box>
                )}
                <Box>
                  <Typography variant="h6">{analyzingFile.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatFileSize(analyzingFile.size)} • {analyzingFile.type.toUpperCase()}
                  </Typography>
                </Box>
              </Box>

              {aiAnalysis.processing ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <LinearProgress sx={{ mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Analyzing Content...
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Our AI is examining your file to suggest tags and descriptions
                  </Typography>
                </Box>
              ) : (
                <Box>
                  {/* Analysis Results */}
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>
                        Suggested Tags
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                        {aiAnalysis.suggestedTags.map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            color="success"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                      
                      <Typography variant="h6" gutterBottom>
                        AI Description
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        {aiAnalysis.description}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>
                        Analysis Details
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Confidence:</Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {aiAnalysis.confidence}%
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Analysis Type:</Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {aiAnalysis.analysisType}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Processing Time:</Typography>
                          <Typography variant="body2" fontWeight="bold">
                            2.1s
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" gutterBottom>
                          Confidence Meter
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={aiAnalysis.confidence} 
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            bgcolor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: aiAnalysis.confidence > 80 ? 'success.main' : 
                                      aiAnalysis.confidence > 60 ? 'warning.main' : 'error.main'
                            }
                          }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAiAnalysisDialogOpen(false)}>
            Close
          </Button>
          {!aiAnalysis.processing && (
            <Button 
              onClick={handleApplyAiSuggestions}
              variant="contained"
              color="success"
            >
              Apply Suggestions
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Advanced Preview Dialog */}
      <Dialog 
        open={previewDialogOpen} 
        onClose={() => setPreviewDialogOpen(false)}
        maxWidth={false}
        fullWidth
        PaperProps={{
          sx: {
            m: 0,
            maxHeight: '100vh',
            height: '100vh',
            bgcolor: 'black',
            color: 'white'
          }
        }}
      >
        <DialogTitle sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: 'rgba(0,0,0,0.8)',
          color: 'white',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <Typography variant="h6">
            {previewFile?.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button
              size="small"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 25}
              sx={{ color: 'white', minWidth: 'auto', px: 1 }}
            >
              -
            </Button>
            <Typography variant="body2" sx={{ minWidth: 60, textAlign: 'center' }}>
              {zoomLevel}%
            </Typography>
            <Button
              size="small"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 400}
              sx={{ color: 'white', minWidth: 'auto', px: 1 }}
            >
              +
            </Button>
            <Button
              size="small"
              onClick={handleResetZoom}
              sx={{ color: 'white', minWidth: 'auto', px: 1 }}
            >
              Reset
            </Button>
            <IconButton
              onClick={() => setPreviewDialogOpen(false)}
              sx={{ color: 'white' }}
            >
              <Clear />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{
          p: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'black',
          overflow: 'hidden'
        }}>
          {previewFile && (
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              position: 'relative'
            }}>
              {previewFile.thumbnail ? (
                <img 
                  src={previewFile.thumbnail} 
                  alt={previewFile.name}
                  style={{ 
                    maxWidth: `${zoomLevel}%`,
                    maxHeight: `${zoomLevel}%`,
                    objectFit: 'contain',
                    transition: 'all 0.3s ease-in-out'
                  }}
                />
              ) : (
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'white',
                    textAlign: 'center'
                  }}
                >
                    {getFileIcon(previewFile.type)}
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    {previewFile.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatFileSize(previewFile.size)} • {previewFile.type.toUpperCase()}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Batch Processing Dialog */}
      <Dialog 
        open={batchProcessingDialogOpen} 
        onClose={() => !batchProcessing.processing && setBatchProcessingDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            m: { xs: 1, sm: 2 },
            maxHeight: { xs: '95vh', sm: '90vh' },
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          color: 'white',
          fontWeight: 600
        }}>
          Batch Processing
        </DialogTitle>
        <DialogContent sx={{
          p: { xs: 2, sm: 3 },
          pb: { xs: 6, sm: 3 },
          maxWidth: '100%',
          overflow: 'hidden',
          '& *': { maxWidth: '100%' }
        }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Process {selectedFiles.length} selected files with the following settings:
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Processing Options
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Operation</InputLabel>
                <Select
                  value={batchProcessing.operation}
                  label="Operation"
                  onChange={(e) => setBatchProcessing(prev => ({ ...prev, operation: e.target.value }))}
                >
                  <MenuItem value="resize">Resize Images</MenuItem>
                  <MenuItem value="compress">Compress Files</MenuItem>
                  <MenuItem value="convert">Convert Format</MenuItem>
                  <MenuItem value="optimize">Optimize for Web</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Width"
                type="number"
                value={batchProcessing.width}
                onChange={(e) => setBatchProcessing(prev => ({ ...prev, width: parseInt(e.target.value) || 0 }))}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Height"
                type="number"
                value={batchProcessing.height}
                onChange={(e) => setBatchProcessing(prev => ({ ...prev, height: parseInt(e.target.value) || 0 }))}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Quality (%)"
                type="number"
                value={batchProcessing.quality}
                onChange={(e) => setBatchProcessing(prev => ({ ...prev, quality: parseInt(e.target.value) || 0 }))}
                inputProps={{ min: 1, max: 100 }}
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth>
                <InputLabel>Output Format</InputLabel>
                <Select
                  value={batchProcessing.format}
                  label="Output Format"
                  onChange={(e) => setBatchProcessing(prev => ({ ...prev, format: e.target.value }))}
                >
                  <MenuItem value="jpeg">JPEG</MenuItem>
                  <MenuItem value="png">PNG</MenuItem>
                  <MenuItem value="webp">WebP</MenuItem>
                  <MenuItem value="original">Keep Original</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Preview & Progress
              </Typography>
              
              <Box sx={{ 
                border: '1px solid #e0e0e0', 
                borderRadius: 1, 
                p: 2, 
                mb: 2,
                bgcolor: 'grey.50'
              }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Processing Summary:
                </Typography>
                <Typography variant="body2">
                  • Files: {selectedFiles.length}
                </Typography>
                <Typography variant="body2">
                  • Operation: {batchProcessing.operation}
                </Typography>
                <Typography variant="body2">
                  • Dimensions: {batchProcessing.width} × {batchProcessing.height}
                </Typography>
                <Typography variant="body2">
                  • Quality: {batchProcessing.quality}%
                </Typography>
                <Typography variant="body2">
                  • Format: {batchProcessing.format.toUpperCase()}
                </Typography>
              </Box>

              {batchProcessing.processing && (
                <Box>
                  <Typography variant="body2" gutterBottom>
                    Processing Progress: {batchProcessing.progress}%
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={batchProcessing.progress} 
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Please don't close this dialog while processing...
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setBatchProcessingDialogOpen(false)}
            disabled={batchProcessing.processing}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleStartBatchProcessing}
            variant="contained"
            disabled={batchProcessing.processing}
            color="info"
          >
            {batchProcessing.processing ? 'Processing...' : 'Start Processing'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Phase 3: Version History Dialog */}
      <Dialog
        open={versionHistoryDialogOpen}
        onClose={() => setVersionHistoryDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Version History</DialogTitle>
        <DialogContent>
          <List>
            {selectedFileVersions.map((version) => (
              <ListItem key={version.id} divider>
                <ListItemButton>
                  <ListItemText
                    primary={`Version ${version.version}`}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {version.changes}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {version.uploadedBy} • {version.uploadedAt.toLocaleDateString()} • {formatFileSize(version.size)}
                        </Typography>
                      </Box>
                    }
                  />
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      // Download version
                    }}
                  >
                    <CloudDownload />
                  </IconButton>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVersionHistoryDialogOpen(false)}>Close</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              setVersionHistoryDialogOpen(false);
              setUploadNewVersionDialogOpen(true);
            }}
          >
            Upload New Version
          </Button>
        </DialogActions>
      </Dialog>

      {/* Phase 3: Upload New Version Dialog */}
      <Dialog
        open={uploadNewVersionDialogOpen}
        onClose={() => setUploadNewVersionDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Upload New Version</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <input
              type="file"
              onChange={(e) => setNewVersionFile(e.target.files?.[0] || null)}
              style={{ display: 'none' }}
              id="version-upload"
            />
            <label htmlFor="version-upload">
              <Button variant="outlined" component="span" startIcon={<CloudUpload />}>
                Select File
              </Button>
            </label>
            {newVersionFile && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected: {newVersionFile.name}
              </Typography>
            )}
          </Box>
          <TextField
            fullWidth
            label="Changes Made"
            multiline
            rows={3}
            value={versionChanges}
            onChange={(e) => setVersionChanges(e.target.value)}
            placeholder="Describe what changes were made in this version..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadNewVersionDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleVersionUpload}
            disabled={!newVersionFile}
          >
            Upload Version
          </Button>
        </DialogActions>
      </Dialog>

      {/* Phase 3: Advanced Sharing Dialog */}
      <Dialog
        open={sharingDialogOpen}
        onClose={() => setSharingDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Sharing Settings</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={sharingSettings.isPublic}
                  onChange={(e) => setSharingSettings(prev => ({ ...prev, isPublic: e.target.checked }))}
                />
              }
              label="Make file publicly accessible"
            />
          </Box>

          {sharingSettings.isPublic && (
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Share Link"
                value={sharingSettings.shareLink || ''}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleGenerateShareLink}>
                        <Link />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                helperText="Anyone with this link can access the file"
              />
            </Box>
          )}

          <Typography variant="subtitle2" gutterBottom>Permissions</Typography>
          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={sharingSettings.permissions.view}
                  onChange={(e) => setSharingSettings(prev => ({ 
                    ...prev, 
                    permissions: { ...prev.permissions, view: e.target.checked }
                  }))}
                />
              }
              label="Allow viewing"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={sharingSettings.permissions.download}
                  onChange={(e) => setSharingSettings(prev => ({ 
                    ...prev, 
                    permissions: { ...prev.permissions, download: e.target.checked }
                  }))}
                />
              }
              label="Allow downloading"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={sharingSettings.permissions.edit}
                  onChange={(e) => setSharingSettings(prev => ({ 
                    ...prev, 
                    permissions: { ...prev.permissions, edit: e.target.checked }
                  }))}
                />
              }
              label="Allow editing"
            />
          </Box>

          <TextField
            fullWidth
            label="Expiration Date (Optional)"
            type="date"
            value={sharingSettings.expiresAt ? sharingSettings.expiresAt.toISOString().split('T')[0] : ''}
            onChange={(e) => setSharingSettings(prev => ({ 
              ...prev, 
              expiresAt: e.target.value ? new Date(e.target.value) : undefined
            }))}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Password Protection (Optional)"
            type="password"
            value={sharingSettings.password || ''}
            onChange={(e) => setSharingSettings(prev => ({ ...prev, password: e.target.value }))}
            helperText="Require password to access the file"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSharingDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveSharing}>
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>

      {/* Phase 3: External Storage Dialog */}
      <Dialog
        open={storageDialogOpen}
        onClose={() => setStorageDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Storage Providers</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {storageProviders.map((provider) => (
              <Grid item xs={12} sm={6} key={provider.id}>
                <Card sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CloudUpload sx={{ mr: 1 }} />
                    <Typography variant="h6">{provider.name}</Typography>
                    <Chip 
                      label={provider.connected ? 'Connected' : 'Not Connected'} 
                      color={provider.connected ? 'success' : 'default'}
                      size="small"
                      sx={{ ml: 'auto' }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Used: {provider.quota.used} / {provider.quota.total}
                  </Typography>
                  {!provider.connected ? (
                    <Button 
                      variant="outlined" 
                      onClick={() => handleConnectStorage(provider.id)}
                      fullWidth
                    >
                      Connect
                    </Button>
                  ) : (
                    <Button 
                      variant="contained" 
                      onClick={() => {
                        // Show migration options
                      }}
                      fullWidth
                    >
                      Migrate Files
                    </Button>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStorageDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Advanced Filters Modal */}
      <Dialog
        open={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            m: { xs: 1, sm: 2 },
            maxHeight: { xs: '95vh', sm: '90vh' },
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontWeight: 600
        }}>
          Advanced Filters
        </DialogTitle>
        <DialogContent sx={{
          p: { xs: 2, sm: 3 },
          pb: { xs: 6, sm: 3 },
          maxWidth: '100%',
          overflow: 'hidden',
          '& *': { maxWidth: '100%' }
        }}>
          <Grid container spacing={3}>
            {/* Date Range Filter */}
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>
                Date Range
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                <TextField
                  type="date"
                  size="small"
                  label="From"
                  value={dateFilter.start ? dateFilter.start.toISOString().split('T')[0] : ''}
                  onChange={(e) => setDateFilter(prev => ({ ...prev, start: e.target.value ? new Date(e.target.value) : null }))}
                  InputLabelProps={{ shrink: true }}
                  sx={{ minWidth: 150 }}
                />
                <TextField
                  type="date"
                  size="small"
                  label="To"
                  value={dateFilter.end ? dateFilter.end.toISOString().split('T')[0] : ''}
                  onChange={(e) => setDateFilter(prev => ({ ...prev, end: e.target.value ? new Date(e.target.value) : null }))}
                  InputLabelProps={{ shrink: true }}
                  sx={{ minWidth: 150 }}
                />
              </Box>
            </Grid>

            {/* Size Filter */}
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>
                File Size (MB)
              </Typography>
              <Box sx={{ px: 2 }}>
                <Slider
                  value={[sizeFilter.min || 0, sizeFilter.max || 100]}
                  onChange={(e, newValue) => {
                    const [min, max] = newValue as number[];
                    setSizeFilter({ 
                      min: min * 1024 * 1024, 
                      max: max * 1024 * 1024 
                    });
                  }}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}MB`}
                  min={0}
                  max={100}
                  step={1}
                />
              </Box>
            </Grid>

            {/* Tag Filter */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Tags
              </Typography>
              <Autocomplete
                multiple
                options={availableTags}
                value={tagFilter}
                onChange={(event, newValue) => setTagFilter(newValue)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <MuiChip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                      key={option}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select tags..."
                    size="small"
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Clear />}
            onClick={() => {
              setSearchTerm('');
              setFilterType('all');
              setTagFilter([]);
              setDateFilter({ start: null, end: null });
              setSizeFilter({ min: null, max: null });
            }}
          >
            Clear All Filters
          </Button>
          <Button 
            onClick={() => setShowAdvancedFilters(false)}
            variant="contained"
          >
            Apply Filters
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
