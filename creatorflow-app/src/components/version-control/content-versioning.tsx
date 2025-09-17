/**
 * Content Versioning Component
 * Git-like version control for content
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  Tooltip,
  Avatar,
  alpha,
  useTheme,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/material';
import {
  History as HistoryIcon,
  Compare as CompareIcon,
  Restore as RestoreIcon,
  Branch as BranchIcon,
  Merge as MergeIcon,
  Tag as TagIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface ContentVersion {
  id: string;
  contentId: string;
  version: string;
  title: string;
  description: string;
  content: any;
  author: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  createdAt: Date;
  isCurrent: boolean;
  isPublished: boolean;
  tags: string[];
  changes: VersionChange[];
  parentVersion?: string;
  branch?: string;
}

interface VersionChange {
  type: 'added' | 'modified' | 'deleted';
  field: string;
  oldValue?: any;
  newValue?: any;
  description: string;
}

interface ContentVersioningProps {
  contentId: string;
  currentContent?: any;
  onVersionCreate?: (version: ContentVersion) => void;
  onVersionRestore?: (versionId: string) => void;
  onVersionCompare?: (version1: string, version2: string) => void;
  className?: string;
}

export function ContentVersioning({
  contentId,
  currentContent,
  onVersionCreate,
  onVersionRestore,
  onVersionCompare,
  className,
}: ContentVersioningProps) {
  const [versions, setVersions] = useState<ContentVersion[]>([]);
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCompareDialogOpen, setIsCompareDialogOpen] = useState(false);
  const [newVersionTitle, setNewVersionTitle] = useState('');
  const [newVersionDescription, setNewVersionDescription] = useState('');
  const [viewMode, setViewMode] = useState<'timeline' | 'list'>('timeline');
  const theme = useTheme();

  // Mock data for demonstration
  const mockVersions: ContentVersion[] = [
    {
      id: 'v1',
      contentId,
      version: '1.0.0',
      title: 'Initial Version',
      description: 'First version of the content',
      content: { title: 'Original Title', body: 'Original content...' },
      author: {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        avatar: '/avatars/john.jpg',
      },
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      isCurrent: false,
      isPublished: true,
      tags: ['initial', 'published'],
      changes: [],
    },
    {
      id: 'v2',
      contentId,
      version: '1.1.0',
      title: 'Updated Headlines',
      description: 'Improved headlines and call-to-action',
      content: { title: 'Updated Title', body: 'Updated content with better headlines...' },
      author: {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        avatar: '/avatars/jane.jpg',
      },
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      isCurrent: false,
      isPublished: false,
      tags: ['improvement', 'headlines'],
      changes: [
        {
          type: 'modified',
          field: 'title',
          oldValue: 'Original Title',
          newValue: 'Updated Title',
          description: 'Updated main headline',
        },
        {
          type: 'added',
          field: 'cta',
          newValue: 'Learn More',
          description: 'Added call-to-action button',
        },
      ],
      parentVersion: 'v1',
    },
    {
      id: 'v3',
      contentId,
      version: '1.2.0',
      title: 'Current Version',
      description: 'Latest version with all improvements',
      content: { title: 'Final Title', body: 'Final content with all improvements...' },
      author: {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        avatar: '/avatars/john.jpg',
      },
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      isCurrent: true,
      isPublished: false,
      tags: ['current', 'final'],
      changes: [
        {
          type: 'modified',
          field: 'title',
          oldValue: 'Updated Title',
          newValue: 'Final Title',
          description: 'Final headline optimization',
        },
        {
          type: 'added',
          field: 'images',
          newValue: ['image1.jpg', 'image2.jpg'],
          description: 'Added supporting images',
        },
      ],
      parentVersion: 'v2',
    },
  ];

  useEffect(() => {
    setVersions(mockVersions);
  }, [contentId]);

  const handleCreateVersion = useCallback(() => {
    if (!newVersionTitle.trim()) return;

    const newVersion: ContentVersion = {
      id: `v${Date.now()}`,
      contentId,
      version: `${versions.length + 1}.0.0`,
      title: newVersionTitle,
      description: newVersionDescription,
      content: currentContent || {},
      author: {
        id: 'current-user',
        name: 'Current User',
        email: 'user@example.com',
      },
      createdAt: new Date(),
      isCurrent: true,
      isPublished: false,
      tags: ['draft'],
      changes: [],
    };

    // Mark previous version as not current
    setVersions(prev => 
      prev.map(v => ({ ...v, isCurrent: false })).concat(newVersion)
    );

    onVersionCreate?.(newVersion);
    setIsCreateDialogOpen(false);
    setNewVersionTitle('');
    setNewVersionDescription('');
  }, [newVersionTitle, newVersionDescription, currentContent, versions.length, contentId, onVersionCreate]);

  const handleRestoreVersion = useCallback((versionId: string) => {
    const version = versions.find(v => v.id === versionId);
    if (!version) return;

    // Mark this version as current
    setVersions(prev => 
      prev.map(v => ({ ...v, isCurrent: v.id === versionId }))
    );

    onVersionRestore?.(versionId);
  }, [versions, onVersionRestore]);

  const handleCompareVersions = useCallback(() => {
    if (selectedVersions.length !== 2) return;
    onVersionCompare?.(selectedVersions[0], selectedVersions[1]);
    setIsCompareDialogOpen(false);
    setSelectedVersions([]);
  }, [selectedVersions, onVersionCompare]);

  const handleVersionSelect = useCallback((versionId: string) => {
    setSelectedVersions(prev => {
      if (prev.includes(versionId)) {
        return prev.filter(id => id !== versionId);
      }
      if (prev.length < 2) {
        return [...prev, versionId];
      }
      return [versionId];
    });
  }, []);

  const getChangeIcon = (type: VersionChange['type']) => {
    switch (type) {
      case 'added': return <EditIcon color="success" />;
      case 'modified': return <EditIcon color="warning" />;
      case 'deleted': return <DeleteIcon color="error" />;
      default: return <EditIcon />;
    }
  };

  const getChangeColor = (type: VersionChange['type']) => {
    switch (type) {
      case 'added': return 'success';
      case 'modified': return 'warning';
      case 'deleted': return 'error';
      default: return 'default';
    }
  };

  const VersionTimeline = () => (
    <Timeline>
      {versions.map((version, index) => (
        <motion.div
          key={version.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <TimelineItem>
            <TimelineOppositeContent sx={{ flex: 0.2 }}>
              <Typography variant="caption" color="text.secondary">
                {version.createdAt.toLocaleDateString()}
              </Typography>
              <Typography variant="caption" display="block">
                {version.createdAt.toLocaleTimeString()}
              </Typography>
            </TimelineOppositeContent>
            
            <TimelineSeparator>
              <TimelineDot 
                color={version.isCurrent ? 'primary' : 'grey'} 
                variant={version.isCurrent ? 'filled' : 'outlined'}
              >
                <HistoryIcon />
              </TimelineDot>
              {index < versions.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            
            <TimelineContent>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6">
                      {version.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {version.isCurrent && (
                        <Chip label="Current" color="primary" size="small" />
                      )}
                      {version.isPublished && (
                        <Chip label="Published" color="success" size="small" />
                      )}
                      <IconButton size="small">
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {version.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Avatar sx={{ width: 24, height: 24 }}>
                      {version.author.name.charAt(0)}
                    </Avatar>
                    <Typography variant="caption">
                      {version.author.name} • v{version.version}
                    </Typography>
                  </Box>
                  
                  {version.changes.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Changes:
                      </Typography>
                      {version.changes.map((change, changeIndex) => (
                        <Box key={changeIndex} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          {getChangeIcon(change.type)}
                          <Typography variant="caption">
                            {change.description}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                  
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleVersionSelect(version.id)}
                    >
                      View
                    </Button>
                    {!version.isCurrent && (
                      <Button
                        size="small"
                        startIcon={<RestoreIcon />}
                        onClick={() => handleRestoreVersion(version.id)}
                      >
                        Restore
                      </Button>
                    )}
                    <Button
                      size="small"
                      startIcon={<CompareIcon />}
                      onClick={() => handleVersionSelect(version.id)}
                    >
                      Compare
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </TimelineContent>
          </TimelineItem>
        </motion.div>
      ))}
    </Timeline>
  );

  const VersionList = () => (
    <List>
      {versions.map((version) => (
        <motion.div
          key={version.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ListItem
            sx={{
              bgcolor: version.isCurrent ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
              borderRadius: 1,
              mb: 1,
              border: version.isCurrent ? `1px solid ${theme.palette.primary.main}` : '1px solid transparent',
            }}
          >
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6">
                    {version.title}
                  </Typography>
                  {version.isCurrent && (
                    <Chip label="Current" color="primary" size="small" />
                  )}
                  {version.isPublished && (
                    <Chip label="Published" color="success" size="small" />
                  )}
                </Box>
              }
              secondary={
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {version.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                    <Typography variant="caption">
                      {version.author.name} • v{version.version}
                    </Typography>
                    <Typography variant="caption">
                      {version.createdAt.toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              }
            />
            
            <ListItemSecondaryAction>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="View">
                  <IconButton size="small" onClick={() => handleVersionSelect(version.id)}>
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
                {!version.isCurrent && (
                  <Tooltip title="Restore">
                    <IconButton size="small" onClick={() => handleRestoreVersion(version.id)}>
                      <RestoreIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Compare">
                  <IconButton size="small" onClick={() => handleVersionSelect(version.id)}>
                    <CompareIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </ListItemSecondaryAction>
          </ListItem>
        </motion.div>
      ))}
    </List>
  );

  return (
    <Box className={className}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Content Versioning
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track and manage content versions with git-like control
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant={viewMode === 'timeline' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('timeline')}
            startIcon={<HistoryIcon />}
          >
            Timeline
          </Button>
          <Button
            variant={viewMode === 'list' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('list')}
            startIcon={<List />}
          >
            List
          </Button>
          <Button
            variant="contained"
            onClick={() => setIsCreateDialogOpen(true)}
            startIcon={<TagIcon />}
          >
            Create Version
          </Button>
        </Box>
      </Box>

      {/* Selected Versions Actions */}
      {selectedVersions.length > 0 && (
        <Card sx={{ mb: 3, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6">
                {selectedVersions.length} version{selectedVersions.length > 1 ? 's' : ''} selected
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {selectedVersions.length === 2 && (
                  <Button
                    variant="contained"
                    startIcon={<CompareIcon />}
                    onClick={() => setIsCompareDialogOpen(true)}
                  >
                    Compare
                  </Button>
                )}
                <Button
                  variant="outlined"
                  onClick={() => setSelectedVersions([])}
                >
                  Clear Selection
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Version Display */}
      <AnimatePresence mode="wait">
        {viewMode === 'timeline' ? (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <VersionTimeline />
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <VersionList />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Version Dialog */}
      <Dialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Version</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Version Title"
            value={newVersionTitle}
            onChange={(e) => setNewVersionTitle(e.target.value)}
            margin="normal"
            placeholder="e.g., Updated Headlines"
          />
          <TextField
            fullWidth
            label="Description"
            value={newVersionDescription}
            onChange={(e) => setNewVersionDescription(e.target.value)}
            margin="normal"
            multiline
            rows={3}
            placeholder="Describe the changes made in this version..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCreateDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateVersion}
            variant="contained"
            disabled={!newVersionTitle.trim()}
          >
            Create Version
          </Button>
        </DialogActions>
      </Dialog>

      {/* Compare Versions Dialog */}
      <Dialog
        open={isCompareDialogOpen}
        onClose={() => setIsCompareDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Compare Versions</DialogTitle>
        <DialogContent>
          <Typography>
            Comparing versions: {selectedVersions.join(' vs ')}
          </Typography>
          {/* Here you would implement the actual comparison view */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCompareDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ContentVersioning;
