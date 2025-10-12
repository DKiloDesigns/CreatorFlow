'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  AccessTime as ClockIcon,
  Person as UserIcon,
  Star as StarIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  BookOutlined as BookOpenIcon,
  Psychology as BrainIcon,
  BarChart as BarChart3Icon,
  Group as UsersIcon,
  Bolt as ZapIcon
} from '@mui/icons-material';
import { InteractiveTutorial } from '@/components/ui/interactive-tutorial';
import { tutorials, getTutorialsByCategory, searchTutorials } from '@/lib/tutorials';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tutorial-tabpanel-${index}`}
      aria-labelledby={`tutorial-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function TutorialsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedTutorial, setSelectedTutorial] = useState<any>(null);
  const [tutorialsData, setTutorialsData] = useState(tutorials);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Filter tutorials
  useEffect(() => {
    let filtered = tutorials;
    
    if (searchQuery) {
      filtered = searchTutorials(searchQuery);
    }
    
    if (filterCategory !== 'all') {
      filtered = filtered.filter(tutorial => tutorial.category === filterCategory);
    }
    
    setTutorialsData(filtered);
  }, [searchQuery, filterCategory]);


  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleTutorialSelect = (tutorial: any) => {
    setSelectedTutorial(tutorial);
  };

  const handleTutorialComplete = () => {
    setSelectedTutorial(null);
    // Could add completion tracking here
  };

  const categories = [
    'all',
    'Getting Started',
    'Content Creation',
    'AI Tools',
    'Planning',
    'Analytics',
    'Team Management',
    'Mobile',
    'Automation'
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Getting Started':
        return <BookOpenIcon sx={{ fontSize: 20 }} />;
      case 'Content Creation':
        return <PlayIcon sx={{ fontSize: 20 }} />;
      case 'AI Tools':
        return <BrainIcon sx={{ fontSize: 20 }} />;
      case 'Planning':
        return <ClockIcon sx={{ fontSize: 20 }} />;
      case 'Analytics':
        return <BarChart3Icon sx={{ fontSize: 20 }} />;
      case 'Team Management':
        return <UsersIcon sx={{ fontSize: 20 }} />;
      case 'Mobile':
        return <ZapIcon sx={{ fontSize: 20 }} />;
      case 'Automation':
        return <ZapIcon sx={{ fontSize: 20 }} />;
      default:
        return <BookOpenIcon sx={{ fontSize: 20 }} />;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'background.paper', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
            Learn floai.studio
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4 }}>
            Master floai.studio with interactive tutorials and step-by-step guides
          </Typography>
          
          {/* Search and Filter */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mb: 3 }}>
            <TextField
              placeholder="Search tutorials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 300, flex: 1 }}
            />
            
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                label="Category"
              >
                {categories.map(category => (
                  <MenuItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant={isMobile ? 'scrollable' : 'standard'}
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab 
              label="Interactive Tutorials" 
              icon={<BookOpenIcon sx={{ fontSize: 20 }} />}
              iconPosition="start"
            />
          </Tabs>
        </Container>
      </Box>

      {/* Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Interactive Tutorials Tab */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            {tutorialsData.map((tutorial) => (
              <Grid item xs={12} sm={6} md={4} key={tutorial.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    '&:hover': { 
                      boxShadow: 4,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s ease-in-out'
                    }
                  }}
                  onClick={() => handleTutorialSelect(tutorial)}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      height: 200,
                      bgcolor: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      {getCategoryIcon(tutorial.category)}
                      <Typography variant="h4" sx={{ mt: 1 }}>
                        {tutorial.estimatedTime}m
                      </Typography>
                    </Box>
                  </CardMedia>
                  
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {tutorial.title}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, flexGrow: 1 }}>
                      {tutorial.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      <Chip 
                        label={tutorial.category} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                      />
                      <Chip 
                        label={tutorial.difficulty} 
                        size="small" 
                        color={tutorial.difficulty === 'beginner' ? 'success' : tutorial.difficulty === 'intermediate' ? 'warning' : 'error'}
                        variant="outlined" 
                      />
                      {tutorial.featured && (
                        <Chip 
                          icon={<StarIcon sx={{ fontSize: 16 }} />}
                          label="Featured" 
                          size="small" 
                          color="secondary"
                          variant="outlined" 
                        />
                      )}
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.secondary' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ClockIcon sx={{ fontSize: 16 }} />
                        <Typography variant="caption">{tutorial.estimatedTime} min</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <UserIcon sx={{ fontSize: 16 }} />
                        <Typography variant="caption">{tutorial.author}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

      </Container>

      {/* Interactive Tutorial Modal */}
      {selectedTutorial && (
        <InteractiveTutorial
          tutorialId={selectedTutorial.id}
          steps={selectedTutorial.steps}
          onComplete={handleTutorialComplete}
          onClose={() => setSelectedTutorial(null)}
          autoStart={false}
        />
      )}
    </Box>
  );
}
