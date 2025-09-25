'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  LinearProgress,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Business as BusinessIcon,
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Email as EmailIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Star as StarIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Category as CategoryIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface Partnership {
  id: string;
  brand: string;
  category: string;
  description: string;
  requirements: string[];
  compensation: string;
  audienceSize: string;
  location: string;
  type: 'sponsorship' | 'collaboration' | 'affiliate' | 'ambassador';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rating: number;
  isProOnly: boolean;
}

interface SearchFilters {
  category: string;
  audienceSize: string;
  location: string;
  partnershipType: string;
  difficulty: string;
}

const CATEGORIES = [
  'Fashion & Beauty', 'Technology', 'Food & Beverage', 'Fitness & Health',
  'Travel', 'Gaming', 'Education', 'Finance', 'Home & Garden', 'Automotive',
  'Entertainment', 'Sports', 'Lifestyle', 'Parenting', 'Business'
];

const AUDIENCE_SIZES = [
  '1K-10K', '10K-50K', '50K-100K', '100K-500K', '500K-1M', '1M+'
];

const PARTNERSHIP_TYPES = [
  'Sponsorship', 'Collaboration', 'Affiliate', 'Ambassador'
];

const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard'];

const FREE_PARTNERSHIPS: Partnership[] = [
  {
    id: '1',
    brand: 'EcoWear',
    category: 'Fashion & Beauty',
    description: 'Sustainable fashion brand looking for micro-influencers to promote eco-friendly clothing',
    requirements: ['1K+ followers', 'Fashion content', 'Eco-conscious audience'],
    compensation: '$50-200 per post',
    audienceSize: '1K-10K',
    location: 'Global',
    type: 'sponsorship',
    difficulty: 'Easy',
    rating: 4.2,
    isProOnly: false
  },
  {
    id: '2',
    brand: 'TechGadgets',
    category: 'Technology',
    description: 'Tech review opportunities for gadget enthusiasts',
    requirements: ['5K+ followers', 'Tech content', 'Honest reviews'],
    compensation: '$100-500 per review',
    audienceSize: '5K-50K',
    location: 'US, Canada',
    type: 'collaboration',
    difficulty: 'Medium',
    rating: 4.5,
    isProOnly: false
  },
  {
    id: '3',
    brand: 'FitLife',
    category: 'Fitness & Health',
    description: 'Fitness supplement brand seeking health-conscious creators',
    requirements: ['10K+ followers', 'Fitness content', 'Health focus'],
    compensation: '$200-800 per post',
    audienceSize: '10K-100K',
    location: 'Global',
    type: 'sponsorship',
    difficulty: 'Medium',
    rating: 4.3,
    isProOnly: false
  },
  {
    id: '4',
    brand: 'TravelVibes',
    category: 'Travel',
    description: 'Travel booking platform looking for travel content creators',
    requirements: ['25K+ followers', 'Travel content', 'High engagement'],
    compensation: '$500-2000 per post',
    audienceSize: '25K-500K',
    location: 'Global',
    type: 'collaboration',
    difficulty: 'Hard',
    rating: 4.7,
    isProOnly: true
  },
  {
    id: '5',
    brand: 'FoodieBox',
    category: 'Food & Beverage',
    description: 'Monthly food subscription box for food bloggers',
    requirements: ['5K+ followers', 'Food content', 'Recipe sharing'],
    compensation: 'Free products + $100-300',
    audienceSize: '5K-50K',
    location: 'US, UK',
    type: 'affiliate',
    difficulty: 'Easy',
    rating: 4.1,
    isProOnly: false
  }
];

export default function BrandPartnershipFinderFree() {
  const [filters, setFilters] = useState<SearchFilters>({
    category: '',
    audienceSize: '',
    location: '',
    partnershipType: '',
    difficulty: ''
  });
  
  const [searchResults, setSearchResults] = useState<Partnership[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [selectedPartnership, setSelectedPartnership] = useState<Partnership | null>(null);

  const handleFilterChange = (field: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = async () => {
    setIsSearching(true);
    
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Filter partnerships based on criteria
    let filtered = FREE_PARTNERSHIPS.filter(partnership => {
      if (filters.category && partnership.category !== filters.category) return false;
      if (filters.audienceSize && partnership.audienceSize !== filters.audienceSize) return false;
      if (filters.location && partnership.location !== filters.location) return false;
      if (filters.partnershipType && partnership.type !== filters.partnershipType.toLowerCase()) return false;
      if (filters.difficulty && partnership.difficulty !== filters.difficulty) return false;
      return true;
    });
    
    setSearchResults(filtered);
    setIsSearching(false);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEmailSubmitted(true);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'success';
      case 'Medium': return 'warning';
      case 'Hard': return 'error';
      default: return 'default';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sponsorship': return 'primary';
      case 'collaboration': return 'secondary';
      case 'affiliate': return 'success';
      case 'ambassador': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" gutterBottom sx={{ 
            color: 'primary.main',
            background: 'linear-gradient(45deg, #0066CC, #00CC66)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}>
            Brand Partnership Finder
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Discover brand partnership opportunities that match your audience
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              Free version shows basic opportunities. Upgrade to Pro for advanced matching and exclusive partnerships.
            </Typography>
          </Alert>
        </Box>
      </motion.div>

      {/* Search Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SearchIcon color="primary" />
              Find Your Perfect Match
            </Typography>

            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {CATEGORIES.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Audience Size</InputLabel>
                  <Select
                    value={filters.audienceSize}
                    onChange={(e) => handleFilterChange('audienceSize', e.target.value)}
                  >
                    <MenuItem value="">All Sizes</MenuItem>
                    {AUDIENCE_SIZES.map((size) => (
                      <MenuItem key={size} value={size}>
                        {size} followers
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Location</InputLabel>
                  <Select
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                  >
                    <MenuItem value="">All Locations</MenuItem>
                    <MenuItem value="Global">Global</MenuItem>
                    <MenuItem value="US, Canada">US, Canada</MenuItem>
                    <MenuItem value="US, UK">US, UK</MenuItem>
                    <MenuItem value="Europe">Europe</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Partnership Type</InputLabel>
                  <Select
                    value={filters.partnershipType}
                    onChange={(e) => handleFilterChange('partnershipType', e.target.value)}
                  >
                    <MenuItem value="">All Types</MenuItem>
                    {PARTNERSHIP_TYPES.map((type) => (
                      <MenuItem key={type} value={type.toLowerCase()}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleSearch}
                disabled={isSearching}
                startIcon={isSearching ? <LinearProgress size={20} /> : <SearchIcon />}
                sx={{ 
                  background: 'linear-gradient(45deg, #0066CC, #00CC66)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #0052A3, #00B359)',
                  }
                }}
              >
                {isSearching ? 'Searching...' : 'Find Partnerships'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search Results */}
      <AnimatePresence>
        {searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BusinessIcon color="primary" />
                  Partnership Opportunities ({searchResults.length})
                </Typography>

                <Grid container spacing={3}>
                  {searchResults.map((partnership) => (
                    <Grid item xs={12} md={6} key={partnership.id}>
                      <Paper 
                        sx={{ 
                          p: 3, 
                          cursor: 'pointer',
                          '&:hover': { boxShadow: 4 },
                          border: partnership.isProOnly ? 2 : 0,
                          borderColor: 'warning.main'
                        }}
                        onClick={() => setSelectedPartnership(partnership)}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Typography variant="h6">
                            {partnership.brand}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Chip
                              label={partnership.difficulty}
                              color={getDifficultyColor(partnership.difficulty) as any}
                              size="small"
                            />
                            {partnership.isProOnly && (
                              <Chip label="Pro Only" color="warning" size="small" />
                            )}
                          </Box>
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {partnership.description}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <CategoryIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {partnership.category}
                          </Typography>
                          <LocationIcon sx={{ fontSize: 16, color: 'text.secondary', ml: 2 }} />
                          <Typography variant="body2" color="text.secondary">
                            {partnership.location}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <MoneyIcon sx={{ fontSize: 16, color: 'success.main' }} />
                          <Typography variant="body2" color="success.main" sx={{ fontWeight: 'bold' }}>
                            {partnership.compensation}
                          </Typography>
                          <PeopleIcon sx={{ fontSize: 16, color: 'text.secondary', ml: 2 }} />
                          <Typography variant="body2" color="text.secondary">
                            {partnership.audienceSize}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <Chip
                            label={partnership.type}
                            color={getTypeColor(partnership.type) as any}
                            size="small"
                          />
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                            <Typography variant="body2" color="text.secondary">
                              {partnership.rating}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Typography variant="subtitle2" gutterBottom>
                          Requirements:
                        </Typography>
                        <List dense>
                          {partnership.requirements.map((req, index) => (
                            <ListItem key={index} sx={{ py: 0.5 }}>
                              <ListItemIcon>
                                <CheckCircleIcon color="success" sx={{ fontSize: 16 }} />
                              </ListItemIcon>
                              <ListItemText
                                primary={req}
                                primaryTypographyProps={{ variant: 'body2' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email Capture */}
      {!emailSubmitted ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card sx={{ mt: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Get More Partnership Opportunities
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Enter your email to receive weekly partnership opportunities and brand collaboration tips
              </Typography>
              <Box component="form" onSubmit={handleEmailSubmit} sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  size="small"
                />
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<EmailIcon />}
                  disabled={!email}
                >
                  Subscribe
                </Button>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <Alert severity="success" sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleIcon />
            <Typography>Subscribed! Check your email for partnership opportunities.</Typography>
          </Box>
        </Alert>
      )}

      {/* Pro Features CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Paper sx={{ p: 3, mt: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Typography variant="h6" gutterBottom>
            Unlock Exclusive Partnerships
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            CreatorFlow Pro gives you access to:
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <CheckCircleIcon sx={{ fontSize: 16 }} />
              Exclusive brand partnerships
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <CheckCircleIcon sx={{ fontSize: 16 }} />
              Advanced matching algorithm
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <CheckCircleIcon sx={{ fontSize: 16 }} />
              Direct brand communication
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <CheckCircleIcon sx={{ fontSize: 16 }} />
              Contract negotiation support
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="inherit"
            fullWidth
            startIcon={<ShareIcon />}
            sx={{ 
              backgroundColor: 'white',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'grey.100'
              }
            }}
          >
            Upgrade to Pro for Exclusive Access
          </Button>
        </Paper>
      </motion.div>
    </Box>
  );
}
