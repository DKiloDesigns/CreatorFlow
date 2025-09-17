/**
 * Template Browser Component
 * Browse and search content templates
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Pagination,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Alert,
  Tabs,
  Tab,
  Badge,
  Avatar,
  Rating,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Star as StarIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Favorite as FavoriteIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Category as CategoryIcon,
  Business as BusinessIcon,
  Smartphone as SmartphoneIcon,
  Image as ImageIcon,
  VideoLibrary as VideoIcon,
  TextFields as TextIcon,
} from '@mui/icons-material';

interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  industry: string;
  platform: string;
  type: 'text' | 'image' | 'video' | 'carousel' | 'story';
  content: {
    text?: string;
    hashtags?: string[];
    mentions?: string[];
    callToAction?: string;
  };
  variables: any[];
  tags: string[];
  isPublic: boolean;
  isPremium: boolean;
  author: string;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  rating: number;
  downloads: number;
  metadata: {
    estimatedTime: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    bestFor: string[];
    requirements: string[];
  };
}

interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  industry: string;
  templateCount: number;
}

interface TemplateBrowserProps {
  onTemplateSelect?: (template: ContentTemplate) => void;
  onCreateTemplate?: () => void;
  showCreateButton?: boolean;
}

export default function TemplateBrowser({ 
  onTemplateSelect, 
  onCreateTemplate, 
  showCreateButton = true 
}: TemplateBrowserProps) {
  const [templates, setTemplates] = useState<ContentTemplate[]>([]);
  const [categories, setCategories] = useState<TemplateCategory[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState(0);

  const itemsPerPage = 12;

  // Load templates and categories
  useEffect(() => {
    loadTemplates();
    loadCategories();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedIndustry) params.append('industry', selectedIndustry);
      if (selectedPlatform) params.append('platform', selectedPlatform);
      if (selectedType) params.append('type', selectedType);
      if (sortBy) params.append('sortBy', sortBy);

      const response = await fetch(`/api/templates?${params}`);
      const data = await response.json();

      if (data.success) {
        setTemplates(data.templates);
        setIndustries(data.industries);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/analytics/filters?type=groups');
      const data = await response.json();

      if (data.success) {
        // Convert filter groups to categories
        const templateCategories = data.filterGroups.map((group: any) => ({
          id: group.id,
          name: group.name,
          description: group.description,
          icon: group.icon,
          color: group.color,
          industry: 'all',
          templateCount: 0
        }));
        setCategories(templateCategories);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  // Search and filter
  useEffect(() => {
    loadTemplates();
  }, [searchTerm, selectedCategory, selectedIndustry, selectedPlatform, selectedType, sortBy]);

  // Get platform icon
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <ImageIcon />;
      case 'youtube': return <VideoIcon />;
      case 'facebook': return <SmartphoneIcon />;
      case 'twitter': return <TextIcon />;
      default: return <SmartphoneIcon />;
    }
  };

  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon />;
      case 'video': return <VideoIcon />;
      case 'text': return <TextIcon />;
      default: return <TextIcon />;
    }
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'error';
      default: return 'default';
    }
  };

  // Handle template selection
  const handleTemplateSelect = (template: ContentTemplate) => {
    if (onTemplateSelect) {
      onTemplateSelect(template);
    } else {
      setSelectedTemplate(template);
      setPreviewOpen(true);
    }
  };

  // Handle favorite toggle
  const handleFavoriteToggle = (templateId: string) => {
    setFavorites(prev => 
      prev.includes(templateId) 
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  // Pagination
  const totalPages = Math.ceil(templates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTemplates = templates.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h4" gutterBottom>
            Content Templates
          </Typography>
          {showCreateButton && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onCreateTemplate}
              sx={{ minWidth: 150 }}
            >
              Create Template
            </Button>
          )}
        </Box>

        {/* Search and Filters */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            sx={{ minWidth: 300 }}
          />
          
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              label="Category"
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Industry</InputLabel>
            <Select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              label="Industry"
            >
              <MenuItem value="">All Industries</MenuItem>
              {industries.map((industry) => (
                <MenuItem key={industry} value={industry}>
                  {industry}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Platform</InputLabel>
            <Select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              label="Platform"
            >
              <MenuItem value="">All Platforms</MenuItem>
              <MenuItem value="instagram">Instagram</MenuItem>
              <MenuItem value="facebook">Facebook</MenuItem>
              <MenuItem value="youtube">YouTube</MenuItem>
              <MenuItem value="tiktok">TikTok</MenuItem>
              <MenuItem value="twitter">Twitter</MenuItem>
              <MenuItem value="linkedin">LinkedIn</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Sort By"
            >
              <MenuItem value="popular">Most Popular</MenuItem>
              <MenuItem value="newest">Newest</MenuItem>
              <MenuItem value="rating">Highest Rated</MenuItem>
              <MenuItem value="downloads">Most Downloaded</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Tabs */}
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 2 }}>
          <Tab label="All Templates" />
          <Tab label="My Favorites" />
          <Tab label="My Templates" />
        </Tabs>
      </Box>

      {/* Loading */}
      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Templates Grid */}
      <Grid container spacing={3}>
        {paginatedTemplates.map((template) => (
          <Grid item xs={12} sm={6} md={4} key={template.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getPlatformIcon(template.platform)}
                    <Typography variant="h6" noWrap>
                      {template.name}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tooltip title="Add to Favorites">
                      <IconButton
                        size="small"
                        onClick={() => handleFavoriteToggle(template.id)}
                        color={favorites.includes(template.id) ? 'error' : 'default'}
                      >
                        <FavoriteIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Preview">
                      <IconButton
                        size="small"
                        onClick={() => handleTemplateSelect(template)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                {/* Description */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {template.description}
                </Typography>

                {/* Tags */}
                <Box sx={{ display: 'flex', gap: 0.5, mb: 2, flexWrap: 'wrap' }}>
                  <Chip
                    label={template.category}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    label={template.industry}
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                  <Chip
                    label={template.metadata.difficulty}
                    size="small"
                    color={getDifficultyColor(template.metadata.difficulty) as any}
                    variant="outlined"
                  />
                </Box>

                {/* Stats */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                    <Typography variant="body2">
                      {template.rating.toFixed(1)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <DownloadIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      {template.downloads}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      {template.metadata.estimatedTime}min
                    </Typography>
                  </Box>
                </Box>

                {/* Author */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                    {template.author.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="caption" color="text.secondary">
                    {template.author}
                  </Typography>
                </Box>
              </CardContent>

              <CardActions>
                <Button
                  variant="contained"
                  onClick={() => handleTemplateSelect(template)}
                  fullWidth
                  startIcon={<AddIcon />}
                >
                  Use Template
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, page) => setCurrentPage(page)}
            color="primary"
          />
        </Box>
      )}

      {/* Template Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedTemplate?.name}
        </DialogTitle>
        <DialogContent>
          {selectedTemplate && (
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedTemplate.description}
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Template Content
                </Typography>
                <Box sx={{ 
                  backgroundColor: 'grey.100', 
                  p: 2, 
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap'
                }}>
                  {selectedTemplate.content.text}
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Variables
                </Typography>
                <Grid container spacing={1}>
                  {selectedTemplate.variables.map((variable) => (
                    <Grid item xs={12} sm={6} key={variable.id}>
                      <Chip
                        label={`${variable.label} (${variable.type})`}
                        size="small"
                        variant="outlined"
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Metadata
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip label={`${selectedTemplate.metadata.estimatedTime} min`} size="small" />
                  <Chip label={selectedTemplate.metadata.difficulty} size="small" />
                  <Chip label={selectedTemplate.platform} size="small" />
                  <Chip label={selectedTemplate.type} size="small" />
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>
            Close
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (selectedTemplate) {
                handleTemplateSelect(selectedTemplate);
                setPreviewOpen(false);
              }
            }}
          >
            Use Template
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
