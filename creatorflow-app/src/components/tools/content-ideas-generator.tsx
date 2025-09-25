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
  Tooltip,
  Tabs,
  Tab
} from '@mui/material';
import {
  Lightbulb as LightbulbIcon,
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
  Schedule as ScheduleIcon,
  Category as CategoryIcon,
  Psychology as PsychologyIcon,
  AutoFixHigh as AutoFixHighIcon,
  ContentCopy as CopyIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface ContentIdea {
  id: string;
  title: string;
  description: string;
  platform: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedTime: string;
  engagement: number;
  trending: boolean;
  tags: string[];
  tips: string[];
}

interface GeneratorSettings {
  platforms: string[];
  categories: string[];
  audience: string;
  contentType: string;
  difficulty: string;
  trending: boolean;
  timeFrame: string;
}

const PLATFORMS = [
  'Instagram', 'Facebook', 'Twitter', 'LinkedIn', 'TikTok', 'YouTube', 'Pinterest', 'Snapchat'
];

const CATEGORIES = [
  'Lifestyle', 'Fashion', 'Food', 'Travel', 'Fitness', 'Tech', 'Business', 'Education',
  'Entertainment', 'Health', 'Beauty', 'Gaming', 'Art', 'Music', 'Sports'
];

const AUDIENCE_TYPES = [
  'Gen Z (18-24)', 'Millennials (25-40)', 'Gen X (41-56)', 'Boomers (57+)',
  'Students', 'Professionals', 'Parents', 'Entrepreneurs', 'Creators'
];

const CONTENT_TYPES = [
  'Posts', 'Stories', 'Reels', 'Videos', 'Live', 'Polls', 'Questions', 'Tutorials'
];

const TIME_FRAMES = [
  'This Week', 'Next Week', 'This Month', 'Next Month', 'Next 3 Months'
];

const CONTENT_IDEAS: ContentIdea[] = [
  {
    id: '1',
    title: 'Behind-the-Scenes Day in My Life',
    description: 'Document a typical day in your life, showing the real moments behind your content creation',
    platform: 'Instagram',
    category: 'Lifestyle',
    difficulty: 'Easy',
    estimatedTime: '2-3 hours',
    engagement: 85,
    trending: true,
    tags: ['day in life', 'behind the scenes', 'authentic', 'lifestyle'],
    tips: ['Use natural lighting', 'Keep it authentic', 'Show both good and challenging moments']
  },
  {
    id: '2',
    title: 'Quick Recipe Hack',
    description: 'Share a simple cooking hack or 30-second recipe that saves time',
    platform: 'TikTok',
    category: 'Food',
    difficulty: 'Easy',
    estimatedTime: '1 hour',
    engagement: 92,
    trending: true,
    tags: ['recipe hack', 'quick cooking', 'food tips', 'time saving'],
    tips: ['Use trending sounds', 'Keep it under 30 seconds', 'Show the before and after']
  },
  {
    id: '3',
    title: 'Industry Trend Analysis',
    description: 'Break down the latest trends in your industry with your expert opinion',
    platform: 'LinkedIn',
    category: 'Business',
    difficulty: 'Medium',
    estimatedTime: '3-4 hours',
    engagement: 78,
    trending: false,
    tags: ['industry trends', 'analysis', 'expert opinion', 'business'],
    tips: ['Use data to support your points', 'Include your unique perspective', 'Engage with comments']
  },
  {
    id: '4',
    title: 'Transformation Tuesday',
    description: 'Show a before/after transformation in your area of expertise',
    platform: 'Instagram',
    category: 'Fitness',
    difficulty: 'Medium',
    estimatedTime: '2-3 hours',
    engagement: 88,
    trending: true,
    tags: ['transformation', 'before after', 'progress', 'motivation'],
    tips: ['Use consistent lighting', 'Show the process', 'Include motivational message']
  },
  {
    id: '5',
    title: 'Ask Me Anything (AMA)',
    description: 'Host a live Q&A session where your audience can ask you anything',
    platform: 'Instagram',
    category: 'Education',
    difficulty: 'Easy',
    estimatedTime: '1 hour',
    engagement: 95,
    trending: false,
    tags: ['AMA', 'Q&A', 'live', 'interaction'],
    tips: ['Promote it in advance', 'Prepare some starter questions', 'Be authentic and honest']
  },
  {
    id: '6',
    title: 'Tutorial: Master a Skill',
    description: 'Create a step-by-step tutorial teaching a skill you excel at',
    platform: 'YouTube',
    category: 'Education',
    difficulty: 'Hard',
    estimatedTime: '4-6 hours',
    engagement: 82,
    trending: true,
    tags: ['tutorial', 'how to', 'education', 'skill building'],
    tips: ['Break it into clear steps', 'Use good lighting and audio', 'Include timestamps']
  }
];

export default function ContentIdeasGenerator() {
  const [settings, setSettings] = useState<GeneratorSettings>({
    platforms: ['Instagram', 'TikTok'],
    categories: ['Lifestyle', 'Fashion'],
    audience: 'Millennials (25-40)',
    contentType: 'Posts',
    difficulty: 'Easy',
    trending: true,
    timeFrame: 'This Week'
  });
  
  const [generatedIdeas, setGeneratedIdeas] = useState<ContentIdea[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleSettingsChange = (field: keyof GeneratorSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const generateIdeas = async () => {
    setIsGenerating(true);
    
    // Simulate generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Filter and generate ideas based on settings
    let filteredIdeas = CONTENT_IDEAS.filter(idea => {
      if (settings.platforms.length > 0 && !settings.platforms.includes(idea.platform)) return false;
      if (settings.categories.length > 0 && !settings.categories.includes(idea.category)) return false;
      if (settings.difficulty !== '' && idea.difficulty !== settings.difficulty) return false;
      if (settings.trending && !idea.trending) return false;
      return true;
    });
    
    // Shuffle and take first 6
    const shuffled = filteredIdeas.sort(() => 0.5 - Math.random());
    setGeneratedIdeas(shuffled.slice(0, 6));
    setIsGenerating(false);
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

  const getEngagementColor = (engagement: number) => {
    if (engagement >= 90) return 'success';
    if (engagement >= 80) return 'warning';
    return 'error';
  };

  const copyIdea = (idea: ContentIdea) => {
    const text = `${idea.title}\n\n${idea.description}\n\nPlatform: ${idea.platform}\nCategory: ${idea.category}\nDifficulty: ${idea.difficulty}\nEstimated Time: ${idea.estimatedTime}`;
    navigator.clipboard.writeText(text);
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
            Content Ideas Generator
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Get unlimited content ideas tailored to your audience and platform
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Never run out of content ideas again with AI-powered suggestions
          </Typography>
        </Box>
      </motion.div>

      {/* Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AutoFixHighIcon color="primary" />
              Customize Your Ideas
            </Typography>

            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Platforms</InputLabel>
                  <Select
                    multiple
                    value={settings.platforms}
                    onChange={(e) => handleSettingsChange('platforms', e.target.value)}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {PLATFORMS.map((platform) => (
                      <MenuItem key={platform} value={platform}>
                        {platform}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Categories</InputLabel>
                  <Select
                    multiple
                    value={settings.categories}
                    onChange={(e) => handleSettingsChange('categories', e.target.value)}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
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
                  <InputLabel>Target Audience</InputLabel>
                  <Select
                    value={settings.audience}
                    onChange={(e) => handleSettingsChange('audience', e.target.value)}
                  >
                    {AUDIENCE_TYPES.map((audience) => (
                      <MenuItem key={audience} value={audience}>
                        {audience}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Content Type</InputLabel>
                  <Select
                    value={settings.contentType}
                    onChange={(e) => handleSettingsChange('contentType', e.target.value)}
                  >
                    {CONTENT_TYPES.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Difficulty Level</InputLabel>
                  <Select
                    value={settings.difficulty}
                    onChange={(e) => handleSettingsChange('difficulty', e.target.value)}
                  >
                    <MenuItem value="">All Levels</MenuItem>
                    <MenuItem value="Easy">Easy</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Hard">Hard</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Time Frame</InputLabel>
                  <Select
                    value={settings.timeFrame}
                    onChange={(e) => handleSettingsChange('timeFrame', e.target.value)}
                  >
                    {TIME_FRAMES.map((frame) => (
                      <MenuItem key={frame} value={frame}>
                        {frame}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={settings.trending}
                      onChange={(e) => handleSettingsChange('trending', e.target.checked)}
                    />
                  }
                  label="Only show trending ideas"
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                size="large"
                onClick={generateIdeas}
                disabled={isGenerating}
                startIcon={isGenerating ? <LinearProgress size={20} /> : <LightbulbIcon />}
                sx={{ 
                  background: 'linear-gradient(45deg, #0066CC, #00CC66)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #0052A3, #00B359)',
                  }
                }}
              >
                {isGenerating ? 'Generating Ideas...' : 'Generate Content Ideas'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* Generated Ideas */}
      <AnimatePresence>
        {generatedIdeas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LightbulbIcon color="primary" />
                  Generated Content Ideas ({generatedIdeas.length})
                </Typography>

                <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
                  <Tab label="All Ideas" />
                  <Tab label="High Engagement" />
                  <Tab label="Trending" />
                  <Tab label="Quick Ideas" />
                </Tabs>

                <Grid container spacing={3}>
                  {generatedIdeas.map((idea) => (
                    <Grid item xs={12} md={6} key={idea.id}>
                      <Paper sx={{ p: 3, height: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Typography variant="h6" sx={{ flex: 1 }}>
                            {idea.title}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Chip
                              label={idea.difficulty}
                              color={getDifficultyColor(idea.difficulty) as any}
                              size="small"
                            />
                            {idea.trending && (
                              <Chip label="Trending" color="warning" size="small" />
                            )}
                          </Box>
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {idea.description}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Chip label={idea.platform} color="primary" size="small" />
                          <Chip label={idea.category} color="secondary" size="small" />
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <ScheduleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {idea.estimatedTime}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <TrendingUpIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            Engagement Score:
                          </Typography>
                          <Chip
                            label={`${idea.engagement}%`}
                            color={getEngagementColor(idea.engagement) as any}
                            size="small"
                          />
                        </Box>
                        
                        <Typography variant="subtitle2" gutterBottom>
                          Tags:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                          {idea.tags.map((tag, index) => (
                            <Chip key={index} label={tag} size="small" variant="outlined" />
                          ))}
                        </Box>
                        
                        <Typography variant="subtitle2" gutterBottom>
                          Pro Tips:
                        </Typography>
                        <List dense>
                          {idea.tips.map((tip, index) => (
                            <ListItem key={index} sx={{ py: 0.5 }}>
                              <ListItemIcon>
                                <InfoIcon color="info" sx={{ fontSize: 16 }} />
                              </ListItemIcon>
                              <ListItemText
                                primary={tip}
                                primaryTypographyProps={{ variant: 'body2' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                        
                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<CopyIcon />}
                            onClick={() => copyIdea(idea)}
                          >
                            Copy
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<RefreshIcon />}
                          >
                            Regenerate
                          </Button>
                        </Box>
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
                Get Unlimited Content Ideas
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Enter your email to receive daily content ideas and trending topics
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
            <Typography>Subscribed! Check your email for daily content ideas.</Typography>
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
            Unlock Unlimited Content Ideas
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            CreatorFlow Pro gives you:
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <CheckCircleIcon sx={{ fontSize: 16 }} />
              Unlimited content idea generation
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <CheckCircleIcon sx={{ fontSize: 16 }} />
              AI-powered content optimization
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <CheckCircleIcon sx={{ fontSize: 16 }} />
              Trending hashtag suggestions
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <CheckCircleIcon sx={{ fontSize: 16 }} />
              Content calendar integration
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
            Try CreatorFlow Pro Free
          </Button>
        </Paper>
      </motion.div>
    </Box>
  );
}
