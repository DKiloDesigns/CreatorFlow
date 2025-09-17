/**
 * CreatorFlow Template Marketplace
 * Browse, purchase, and sell content templates
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  Avatar,
  Rating,
  Tabs,
  Tab,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
} from '@mui/material';
import {
  Store as StoreIcon,
  Download as DownloadIcon,
  Star as StarIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  NewReleases as NewReleasesIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  ExpandMore as ExpandMoreIcon,
  PlayArrow as PlayArrowIcon,
  ShoppingCart as ShoppingCartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  Visibility as VisibilityIcon,
  AttachMoney as AttachMoneyIcon,
  Category as CategoryIcon,
  CloudDownload as CloudDownloadIcon,
  CheckCircle as CheckCircleIcon,
  Lock as LockIcon,
} from '@mui/icons-material';

interface Template {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  category: 'social_media' | 'email' | 'presentation' | 'document' | 'design' | 'content';
  subcategory: string;
  platform: string[];
  contentType: 'text' | 'image' | 'video' | 'carousel' | 'story' | 'mixed';
  tags: string[];
  price: number;
  isFree: boolean;
  isPremium: boolean;
  thumbnail: string;
  previewImages: string[];
  fileUrl: string;
  fileSize: number;
  fileType: 'json' | 'csv' | 'pdf' | 'docx' | 'pptx' | 'psd' | 'ai' | 'sketch';
  downloads: number;
  rating: number;
  reviewCount: number;
  sales: number;
  revenue: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'archived';
  createdAt: string;
  featured: boolean;
  trending: boolean;
}

interface TemplateReview {
  id: string;
  templateId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  helpful: number;
  createdAt: string;
}

export default function TemplateMarketplace() {
  const [activeTab, setActiveTab] = useState(0);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedContentType, setSelectedContentType] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [reviews, setReviews] = useState<TemplateReview[]>([]);

  // Load templates
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Mock data
      const mockTemplates: Template[] = [
        {
          id: '1',
          title: 'Instagram Post Templates Pack',
          description: '50+ professional Instagram post templates for all industries',
          creatorId: 'creator1',
          creatorName: 'Sarah Johnson',
          creatorAvatar: '/avatars/sarah.jpg',
          category: 'social_media',
          subcategory: 'Instagram',
          platform: ['instagram'],
          contentType: 'image',
          tags: ['instagram', 'templates', 'posts', 'professional'],
          price: 29,
          isFree: false,
          isPremium: true,
          thumbnail: '/template-thumbnails/instagram-pack.jpg',
          previewImages: ['/template-preview/ig1.jpg', '/template-preview/ig2.jpg'],
          fileUrl: '/templates/instagram-pack.zip',
          fileSize: 15.2,
          fileType: 'psd',
          downloads: 1250,
          rating: 4.8,
          reviewCount: 89,
          sales: 1250,
          revenue: 36250,
          status: 'approved',
          createdAt: new Date().toISOString(),
          featured: true,
          trending: true
        },
        {
          id: '2',
          title: 'TikTok Video Scripts',
          description: '100 viral TikTok video scripts that get millions of views',
          creatorId: 'creator2',
          creatorName: 'Mike Chen',
          creatorAvatar: '/avatars/mike.jpg',
          category: 'content',
          subcategory: 'Scripts',
          platform: ['tiktok'],
          contentType: 'text',
          tags: ['tiktok', 'scripts', 'viral', 'content'],
          price: 0,
          isFree: true,
          isPremium: false,
          thumbnail: '/template-thumbnails/tiktok-scripts.jpg',
          previewImages: ['/template-preview/tk1.jpg'],
          fileUrl: '/templates/tiktok-scripts.pdf',
          fileSize: 2.1,
          fileType: 'pdf',
          downloads: 3200,
          rating: 4.6,
          reviewCount: 156,
          sales: 0,
          revenue: 0,
          status: 'approved',
          createdAt: new Date().toISOString(),
          featured: false,
          trending: true
        },
        {
          id: '3',
          title: 'LinkedIn Carousel Templates',
          description: 'Professional LinkedIn carousel templates for business content',
          creatorId: 'creator3',
          creatorName: 'Dr. Lisa Wang',
          creatorAvatar: '/avatars/lisa.jpg',
          category: 'social_media',
          subcategory: 'LinkedIn',
          platform: ['linkedin'],
          contentType: 'carousel',
          tags: ['linkedin', 'carousel', 'business', 'professional'],
          price: 49,
          isFree: false,
          isPremium: true,
          thumbnail: '/template-thumbnails/linkedin-carousel.jpg',
          previewImages: ['/template-preview/li1.jpg', '/template-preview/li2.jpg'],
          fileUrl: '/templates/linkedin-carousel.zip',
          fileSize: 8.7,
          fileType: 'psd',
          downloads: 450,
          rating: 4.9,
          reviewCount: 34,
          sales: 450,
          revenue: 22050,
          status: 'approved',
          createdAt: new Date().toISOString(),
          featured: true,
          trending: false
        }
      ];

      setTemplates(mockTemplates);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter templates
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = searchTerm === '' || 
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesPlatform = selectedPlatform === 'all' || template.platform.includes(selectedPlatform);
    const matchesContentType = selectedContentType === 'all' || template.contentType === selectedContentType;
    const matchesPrice = selectedPrice === 'all' || 
      (selectedPrice === 'free' && template.isFree) ||
      (selectedPrice === 'paid' && !template.isFree);

    return matchesSearch && matchesCategory && matchesPlatform && matchesContentType && matchesPrice;
  });

  // Sort templates
  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.downloads - a.downloads;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'trending':
        return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
      default:
        return 0;
    }
  });

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'social_media': return <PeopleIcon />;
      case 'email': return <AttachMoneyIcon />;
      case 'presentation': return <CategoryIcon />;
      case 'document': return <CategoryIcon />;
      case 'design': return <CategoryIcon />;
      case 'content': return <PlayArrowIcon />;
      default: return <CategoryIcon />;
    }
  };

  // Get file type icon
  const getFileTypeIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf': return <DescriptionIcon />;
      case 'psd': return <CategoryIcon />;
      case 'json': return <CategoryIcon />;
      case 'csv': return <CategoryIcon />;
      default: return <CloudDownloadIcon />;
    }
  };

  // Format file size
  const formatFileSize = (sizeInMB: number) => {
    if (sizeInMB < 1) {
      return `${(sizeInMB * 1024).toFixed(0)} KB`;
    }
    return `${sizeInMB.toFixed(1)} MB`;
  };

  // Format price
  const formatPrice = (price: number, isFree: boolean) => {
    if (isFree) return 'Free';
    return `$${price}`;
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Template Marketplace
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Discover and sell professional content templates created by the community
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<StoreIcon />}
          onClick={() => {/* Navigate to create template */}}
        >
          Sell Template
        </Button>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Browse Templates" icon={<StoreIcon />} />
          <Tab label="My Templates" icon={<CategoryIcon />} />
          <Tab label="My Purchases" icon={<ShoppingCartIcon />} />
        </Tabs>
      </Box>

      {/* Browse Templates Tab */}
      {activeTab === 0 && (
        <Box>
          {/* Search and Filters */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      label="Category"
                    >
                      <MenuItem value="all">All Categories</MenuItem>
                      <MenuItem value="social_media">Social Media</MenuItem>
                      <MenuItem value="email">Email</MenuItem>
                      <MenuItem value="presentation">Presentation</MenuItem>
                      <MenuItem value="document">Document</MenuItem>
                      <MenuItem value="design">Design</MenuItem>
                      <MenuItem value="content">Content</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Platform</InputLabel>
                    <Select
                      value={selectedPlatform}
                      onChange={(e) => setSelectedPlatform(e.target.value)}
                      label="Platform"
                    >
                      <MenuItem value="all">All Platforms</MenuItem>
                      <MenuItem value="instagram">Instagram</MenuItem>
                      <MenuItem value="tiktok">TikTok</MenuItem>
                      <MenuItem value="linkedin">LinkedIn</MenuItem>
                      <MenuItem value="facebook">Facebook</MenuItem>
                      <MenuItem value="twitter">Twitter</MenuItem>
                      <MenuItem value="youtube">YouTube</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Content Type</InputLabel>
                    <Select
                      value={selectedContentType}
                      onChange={(e) => setSelectedContentType(e.target.value)}
                      label="Content Type"
                    >
                      <MenuItem value="all">All Types</MenuItem>
                      <MenuItem value="text">Text</MenuItem>
                      <MenuItem value="image">Image</MenuItem>
                      <MenuItem value="video">Video</MenuItem>
                      <MenuItem value="carousel">Carousel</MenuItem>
                      <MenuItem value="story">Story</MenuItem>
                      <MenuItem value="mixed">Mixed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Price</InputLabel>
                    <Select
                      value={selectedPrice}
                      onChange={(e) => setSelectedPrice(e.target.value)}
                      label="Price"
                    >
                      <MenuItem value="all">All Prices</MenuItem>
                      <MenuItem value="free">Free</MenuItem>
                      <MenuItem value="paid">Paid</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={1}>
                  <FormControl fullWidth>
                    <InputLabel>Sort</InputLabel>
                    <Select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      label="Sort"
                    >
                      <MenuItem value="popular">Popular</MenuItem>
                      <MenuItem value="rating">Rating</MenuItem>
                      <MenuItem value="newest">Newest</MenuItem>
                      <MenuItem value="trending">Trending</MenuItem>
                      <MenuItem value="price-low">Price: Low to High</MenuItem>
                      <MenuItem value="price-high">Price: High to Low</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Template Grid */}
          <Grid container spacing={3}>
            {sortedTemplates.map((template) => (
              <Grid item xs={12} sm={6} md={4} key={template.id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: 6
                    }
                  }}
                  onClick={() => {
                    setSelectedTemplate(template);
                    setTemplateDialogOpen(true);
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={template.thumbnail}
                      alt={template.title}
                    />
                    {template.featured && (
                      <Chip
                        label="Featured"
                        color="primary"
                        size="small"
                        sx={{ position: 'absolute', top: 8, left: 8 }}
                      />
                    )}
                    {template.trending && (
                      <Chip
                        label="Trending"
                        color="success"
                        size="small"
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                      />
                    )}
                    <IconButton
                      sx={{ position: 'absolute', bottom: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.5)' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle favorite
                      }}
                    >
                      <FavoriteBorderIcon sx={{ color: 'white' }} />
                    </IconButton>
                  </Box>
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {getCategoryIcon(template.category)}
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                        {template.category}
                      </Typography>
                      <Box sx={{ flexGrow: 1 }} />
                      <Chip
                        label={template.contentType}
                        size="small"
                        variant="outlined"
                      />
                    </Box>

                    <Typography variant="h6" gutterBottom>
                      {template.title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                      {template.description}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar src={template.creatorAvatar} sx={{ width: 24, height: 24, mr: 1 }} />
                      <Typography variant="caption" color="text.secondary">
                        {template.creatorName}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Rating value={template.rating} precision={0.1} size="small" readOnly />
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                        ({template.reviewCount})
                      </Typography>
                      <Box sx={{ flexGrow: 1 }} />
                      <Typography variant="caption" color="text.secondary">
                        {template.downloads} downloads
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {getFileTypeIcon(template.fileType)}
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5, mr: 2 }}>
                        {formatFileSize(template.fileSize)}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {formatPrice(template.price, template.isFree)}
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={template.isFree ? <DownloadIcon /> : <ShoppingCartIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle purchase/download
                      }}
                    >
                      {template.isFree ? 'Download Free' : 'Purchase'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* My Templates Tab */}
      {activeTab === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            My Templates
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Manage your uploaded templates and track their performance.
          </Typography>

          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <StoreIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No templates uploaded yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Start earning by uploading your first template to the marketplace.
              </Typography>
              <Button
                variant="contained"
                onClick={() => {/* Navigate to create template */}}
              >
                Upload Template
              </Button>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* My Purchases Tab */}
      {activeTab === 2 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            My Purchases
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            View and download your purchased templates.
          </Typography>

          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <ShoppingCartIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No purchases yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Start building your template library by purchasing from the marketplace.
              </Typography>
              <Button
                variant="contained"
                onClick={() => setActiveTab(0)}
              >
                Browse Templates
              </Button>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Template Detail Dialog */}
      <Dialog
        open={templateDialogOpen}
        onClose={() => setTemplateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedTemplate && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" sx={{ flexGrow: 1 }}>
                  {selectedTemplate.title}
                </Typography>
                <IconButton onClick={() => setTemplateDialogOpen(false)}>
                  <ShareIcon />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={selectedTemplate.creatorAvatar} />
                <Box>
                  <Typography variant="subtitle1">{selectedTemplate.creatorName}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Template Creator
                  </Typography>
                </Box>
                <Box sx={{ flexGrow: 1 }} />
                <Typography variant="h6" color="primary">
                  {formatPrice(selectedTemplate.price, selectedTemplate.isFree)}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {selectedTemplate.description}
              </Typography>

              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Template Details
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <CategoryIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Category" 
                        secondary={selectedTemplate.category} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <PeopleIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Platforms" 
                        secondary={selectedTemplate.platform.join(', ')} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        {getFileTypeIcon(selectedTemplate.fileType)}
                      </ListItemIcon>
                      <ListItemText 
                        primary="File Type" 
                        secondary={selectedTemplate.fileType.toUpperCase()} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CloudDownloadIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="File Size" 
                        secondary={formatFileSize(selectedTemplate.fileSize)} 
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Performance
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <DownloadIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Downloads" 
                        secondary={selectedTemplate.downloads.toLocaleString()} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <StarIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Rating" 
                        secondary={`${selectedTemplate.rating}/5 (${selectedTemplate.reviewCount} reviews)`} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <AttachMoneyIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Sales" 
                        secondary={selectedTemplate.sales.toLocaleString()} 
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom>
                Tags
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {selectedTemplate.tags.map((tag, index) => (
                  <Chip key={index} label={tag} size="small" />
                ))}
              </Box>

              <Typography variant="h6" gutterBottom>
                Reviews
              </Typography>
              <List>
                {reviews.map((review) => (
                  <ListItem key={review.id}>
                    <ListItemIcon>
                      <Avatar src={review.userAvatar} sx={{ width: 32, height: 32 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle2" sx={{ mr: 1 }}>
                            {review.userName}
                          </Typography>
                          <Rating value={review.rating} size="small" readOnly />
                        </Box>
                      }
                      secondary={review.comment}
                    />
                  </ListItem>
                ))}
              </List>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setTemplateDialogOpen(false)}>
                Close
              </Button>
              <Button
                variant="contained"
                startIcon={selectedTemplate.isFree ? <DownloadIcon /> : <ShoppingCartIcon />}
                onClick={() => {
                  // Handle purchase/download
                  setTemplateDialogOpen(false);
                }}
              >
                {selectedTemplate.isFree ? 'Download Free' : 'Purchase'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Loading */}
      {loading && <LinearProgress sx={{ position: 'fixed', top: 0, left: 0, right: 0 }} />}
    </Box>
  );
}
