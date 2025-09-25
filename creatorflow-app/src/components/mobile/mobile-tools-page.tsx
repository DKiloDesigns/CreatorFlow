/**
 * Mobile Optimized Tools Page
 * Enhanced mobile experience for the tools landing page
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Badge,
  LinearProgress,
  Alert,
  Snackbar,
  IconButton,
  Drawer,
  Divider,
} from '@mui/material';
import {
  Calculate as CalculateIcon,
  Tag as TagIcon,
  Assessment as AssessmentIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Favorite as FavoriteIcon,
  Bookmark as BookmarkIcon,
  Settings as SettingsIcon,
  Info as InfoIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Star as StarIcon,
  Zap as ZapIcon,
  Target as TargetIcon,
  BarChart as BarChartIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePWA } from '@/hooks/usePWA';

const defaultTools = [
  {
    title: 'Social Media ROI Calculator',
    description: 'Calculate the true value of your social media presence',
    icon: <CalculateIcon sx={{ fontSize: 40 }} />,
    href: '/tools/social-media-calculator',
    features: ['Calculate annual value', 'Time analysis', 'ROI breakdown', 'Recommendations'],
    color: 'primary',
    category: 'Analytics',
    rating: 4.8,
    users: 1250
  },
  {
    title: 'Hashtag Research Tool',
    description: 'Discover trending hashtags and optimize reach',
    icon: <TagIcon sx={{ fontSize: 40 }} />,
    href: '/tools/hashtag-research',
    features: ['AI suggestions', 'Trending analysis', 'Platform specific', 'One-click copy'],
    color: 'secondary',
    category: 'Content',
    rating: 4.9,
    users: 2100
  },
  {
    title: 'Content Calendar Templates',
    description: 'Download professional templates for your industry',
    icon: <ScheduleIcon sx={{ fontSize: 40 }} />,
    href: '/tools/calendar-templates',
    features: ['Industry specific', 'Multiple formats', 'Customizable', 'Free downloads'],
    color: 'success',
    category: 'Planning',
    rating: 4.7,
    users: 1800
  },
  {
    title: 'Social Media Audit Tool',
    description: 'Get comprehensive strategy analysis',
    icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
    href: '/tools/social-media-audit',
    features: ['Strategy assessment', 'Performance analysis', 'Action plan', 'PDF reports'],
    color: 'warning',
    category: 'Analytics',
    rating: 4.6,
    users: 1650
  },
  {
    title: 'Posting Time Optimizer',
    description: 'Find optimal posting times for maximum engagement',
    icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
    href: '/tools/posting-time-optimizer',
    features: ['Optimal timing', 'Platform specific', 'Timezone support', 'Engagement analysis'],
    color: 'info',
    category: 'Optimization',
    rating: 4.8,
    users: 1950
  },
  {
    title: 'Content Performance Predictor',
    description: 'Predict content performance before posting',
    icon: <BarChartIcon sx={{ fontSize: 40 }} />,
    href: '/tools/content-predictor',
    features: ['Engagement predictions', 'Platform suggestions', 'Optimization tips', 'AI insights'],
    color: 'error',
    category: 'AI',
    rating: 4.9,
    users: 2200
  }
];

interface MobileToolsPageProps {
  tools?: any[];
  title?: string;
  subtitle?: string;
}

export default function MobileToolsPage({ 
  tools = defaultTools, 
  title = "Free Social Media Tools",
  subtitle = "Powerful tools to optimize your social media strategy"
}: MobileToolsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  
  const pwa = usePWA();

  // Calculate categories from tools
  const categories = React.useMemo(() => {
    const categoryCounts = tools.reduce((acc, tool) => {
      acc[tool.category] = (acc[tool.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categoryList = [
      { name: 'All', count: tools.length, color: 'default' },
      ...Object.entries(categoryCounts).map(([name, count]) => ({
        name,
        count,
        color: tools.find(t => t.category === name)?.color || 'default'
      }))
    ];

    return categoryList;
  }, [tools]);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('creatorflow-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage
  const saveFavorites = (newFavorites: string[]) => {
    setFavorites(newFavorites);
    localStorage.setItem('creatorflow-favorites', JSON.stringify(newFavorites));
  };

  const handleFavorite = (toolTitle: string) => {
    const newFavorites = favorites.includes(toolTitle)
      ? favorites.filter(fav => fav !== toolTitle)
      : [...favorites, toolTitle];
    
    saveFavorites(newFavorites);
    setSnackbarMessage(
      favorites.includes(toolTitle) 
        ? 'Removed from favorites' 
        : 'Added to favorites'
    );
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  const handleShare = async () => {
    try {
      await pwa.shareApp();
      setSnackbarMessage('Shared successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Error sharing');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleInstall = async () => {
    try {
      await pwa.installApp();
      setSnackbarMessage('App installed successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Error installing app');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const filteredTools = selectedCategory === 'All' 
    ? tools 
    : tools.filter(tool => tool.category === selectedCategory);

  const quickActions = [
    {
      name: 'Install App',
      icon: <DownloadIcon />,
      action: handleInstall,
      disabled: !pwa.isInstallable
    },
    {
      name: 'Share Tools',
      icon: <ShareIcon />,
      action: handleShare
    },
    {
      name: 'Favorites',
      icon: <FavoriteIcon />,
      action: () => setDrawerOpen(true)
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      {/* Mobile Header */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          p: 2,
          display: { xs: 'flex', md: 'none' },
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" noWrap>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {filteredTools.length} tools available
          </Typography>
        </Box>
        
        <IconButton onClick={() => setDrawerOpen(true)}>
          <MenuIcon />
        </IconButton>
      </Box>

      {/* PWA Status */}
      {pwa.updateAvailable && (
        <Alert 
          severity="info" 
          action={
            <Button color="inherit" size="small" onClick={pwa.updateApp}>
              Update
            </Button>
          }
          sx={{ m: 2 }}
        >
          App update available!
        </Alert>
      )}

      {!pwa.isOnline && (
        <Alert severity="warning" sx={{ m: 2 }}>
          You're offline. Some tools may not work properly.
        </Alert>
      )}

      <Container maxWidth="lg" sx={{ py: 2 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4, mt: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ 
            color: 'primary.main',
            background: 'linear-gradient(45deg, #0066CC, #00CC66)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}>
            {title}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            {subtitle}
          </Typography>
        </Box>

        {/* Category Filter */}
        <Box sx={{ mb: 3, overflowX: 'auto' }}>
          <Box sx={{ display: 'flex', gap: 1, pb: 1 }}>
            {categories.map((category) => (
              <Chip
                key={category.name}
                label={`${category.name} (${category.count})`}
                clickable
                color={selectedCategory === category.name ? 'primary' : 'default'}
                onClick={() => setSelectedCategory(category.name)}
                sx={{ minWidth: 'auto' }}
              />
            ))}
          </Box>
        </Box>

        {/* Tools Grid */}
        <Grid container spacing={2}>
          {filteredTools.map((tool, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    position: 'relative',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ color: `${tool.color}.main`, mr: 2 }}>
                        {tool.icon}
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          {tool.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Chip 
                            label={tool.category} 
                            size="small" 
                            color={tool.color as any}
                            variant="outlined"
                          />
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                            <Typography variant="body2" color="text.secondary">
                              {tool.rating}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => handleFavorite(tool.title)}
                        sx={{ color: favorites.includes(tool.title) ? 'error.main' : 'text.secondary' }}
                      >
                        <FavoriteIcon />
                      </IconButton>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {tool.description}
                    </Typography>

                    <List dense>
                      {tool.features.map((feature, featureIndex) => (
                        <ListItem key={featureIndex} sx={{ py: 0.5, px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={feature} 
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {tool.users ? tool.users.toLocaleString() : '0'} users
                      </Typography>
                    </Box>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      component={Link}
                      href={tool.href}
                      variant="contained"
                      endIcon={<ArrowForwardIcon />}
                      fullWidth
                      sx={{
                        background: `linear-gradient(45deg, #0066CC, #00CC66)`,
                        '&:hover': {
                          background: 'linear-gradient(45deg, #0052A3, #00B359)',
                        }
                      }}
                    >
                      Try Now
                    </Button>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Pro Features CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Paper sx={{ p: 4, mt: 4, textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <Typography variant="h5" gutterBottom>
              Ready to Take Your Social Media to the Next Level?
            </Typography>
            <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
              Upgrade to CreatorFlow Pro and unlock the full power
            </Typography>
            
            <Button
              component={Link}
              href="/dashboard"
              variant="contained"
              size="large"
              sx={{ 
                backgroundColor: 'white',
                color: 'primary.main',
                px: 4,
                py: 1.5,
                '&:hover': {
                  backgroundColor: 'grey.100'
                }
              }}
            >
              Try CreatorFlow Pro Free
            </Button>
          </Paper>
        </motion.div>
      </Container>

      {/* Speed Dial */}
      <SpeedDial
        ariaLabel="Quick Actions"
        sx={{ 
          position: 'fixed', 
          bottom: 16, 
          right: 16,
          display: { xs: 'flex', md: 'none' }
        }}
        icon={<SpeedDialIcon />}
        onClose={() => setSpeedDialOpen(false)}
        onOpen={() => setSpeedDialOpen(true)}
        open={speedDialOpen}
      >
        {quickActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.action}
            disabled={action.disabled}
          />
        ))}
      </SpeedDial>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        <Box sx={{ width: 280, p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Favorites</Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Divider sx={{ mb: 2 }} />
          
          {favorites.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No favorites yet. Tap the heart icon on tools to add them here.
            </Typography>
          ) : (
            <List>
              {favorites.map((favorite) => {
                const tool = tools.find(t => t.title === favorite);
                return tool ? (
                  <ListItem
                    key={favorite}
                    button
                    component={Link}
                    href={tool.href}
                    onClick={() => setDrawerOpen(false)}
                  >
                    <ListItemIcon sx={{ color: `${tool.color}.main` }}>
                      {tool.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={tool.title}
                      secondary={tool.description}
                    />
                  </ListItem>
                ) : null;
              })}
            </List>
          )}
        </Box>
      </Drawer>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
