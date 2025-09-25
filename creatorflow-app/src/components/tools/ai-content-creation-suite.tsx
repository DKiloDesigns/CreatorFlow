'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Alert,
  LinearProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Switch,
  FormControlLabel,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  AutoAwesome,
  ContentCopy,
  Download,
  Share,
  Settings,
  PlayArrow,
  Pause,
  Stop,
  Refresh,
  Add,
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
  CheckCircle,
  Warning,
  Info,
  ExpandMore,
  SmartToy,
  Psychology,
  Palette,
  Language,
  Timeline,
  Group,
  Security,
  Speed,
  Analytics
} from '@mui/icons-material';

interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  platforms: string[];
  estimatedTime: string;
  complexity: 'Easy' | 'Medium' | 'Hard';
}

interface GeneratedContent {
  id: string;
  title: string;
  content: string;
  platform: string;
  status: 'Draft' | 'Review' | 'Approved' | 'Published';
  createdAt: string;
  metrics?: {
    engagement: number;
    reach: number;
    clicks: number;
  };
}

const contentTemplates: ContentTemplate[] = [
  {
    id: '1',
    name: 'Viral Video Script',
    description: 'AI-generated script for engaging short-form video content',
    category: 'Video',
    platforms: ['TikTok', 'Instagram Reels', 'YouTube Shorts'],
    estimatedTime: '5-10 min',
    complexity: 'Medium'
  },
  {
    id: '2',
    name: 'Blog Post Outline',
    description: 'Comprehensive outline for long-form blog content',
    category: 'Writing',
    platforms: ['WordPress', 'Medium', 'LinkedIn'],
    estimatedTime: '15-20 min',
    complexity: 'Easy'
  },
  {
    id: '3',
    name: 'Social Media Campaign',
    description: 'Multi-platform social media campaign strategy',
    category: 'Social',
    platforms: ['Instagram', 'Twitter', 'Facebook', 'LinkedIn'],
    estimatedTime: '30-45 min',
    complexity: 'Hard'
  },
  {
    id: '4',
    name: 'Email Newsletter',
    description: 'Professional email newsletter template',
    category: 'Email',
    platforms: ['Mailchimp', 'ConvertKit', 'Substack'],
    estimatedTime: '10-15 min',
    complexity: 'Easy'
  },
  {
    id: '5',
    name: 'Podcast Script',
    description: 'Structured script for podcast episodes',
    category: 'Audio',
    platforms: ['Spotify', 'Apple Podcasts', 'YouTube'],
    estimatedTime: '20-30 min',
    complexity: 'Medium'
  }
];

export default function AIContentCreationSuite() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null);
  const [generationSettings, setGenerationSettings] = useState({
    tone: 'Professional',
    length: 'Medium',
    creativity: 7,
    brandVoice: 'Consistent',
    targetAudience: 'General',
    includeHashtags: true,
    includeCallToAction: true
  });
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState('');

  const handleGenerateContent = async () => {
    if (!selectedTemplate) return;
    
    setIsGenerating(true);
    setGenerationProgress(0);
    
    // Simulate AI generation process
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          
          // Add generated content
          const newContent: GeneratedContent = {
            id: Date.now().toString(),
            title: `${selectedTemplate.name} - ${new Date().toLocaleDateString()}`,
            content: `Generated ${selectedTemplate.name} content with ${generationSettings.tone} tone and ${generationSettings.length} length. This is a sample of the AI-generated content that would be created based on your specifications.`,
            platform: selectedTemplate.platforms[0],
            status: 'Draft',
            createdAt: new Date().toISOString(),
            metrics: {
              engagement: Math.floor(Math.random() * 100),
              reach: Math.floor(Math.random() * 1000),
              clicks: Math.floor(Math.random() * 100)
            }
          };
          
          setGeneratedContent(prev => [newContent, ...prev]);
          setPreviewContent(newContent.content);
          setShowPreview(true);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleTemplateSelect = (template: ContentTemplate) => {
    setSelectedTemplate(template);
  };

  const handleSettingsChange = (setting: string, value: any) => {
    setGenerationSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Easy': return 'success';
      case 'Medium': return 'warning';
      case 'Hard': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom sx={{
          background: 'linear-gradient(45deg, #0066CC, #00CC66)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>
          AI Content Creation Suite
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Advanced AI-powered content generation for enterprise creators
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Generate high-quality, brand-consistent content across all platforms using our advanced AI models.
          </Typography>
        </Alert>
      </Box>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left Sidebar - Templates */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SmartToy color="primary" />
              Content Templates
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Choose from our library of AI-powered content templates
            </Typography>
            
            <List>
              {contentTemplates.map((template) => (
                <ListItem
                  key={template.id}
                  button
                  selected={selectedTemplate?.id === template.id}
                  onClick={() => handleTemplateSelect(template)}
                  sx={{
                    mb: 1,
                    borderRadius: 1,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      }
                    }
                  }}
                >
                  <ListItemIcon>
                    <AutoAwesome color={selectedTemplate?.id === template.id ? 'inherit' : 'primary'} />
                  </ListItemIcon>
                  <ListItemText
                    primary={template.name}
                    secondary={
                      <Box>
                        <Typography variant="caption" display="block">
                          {template.description}
                        </Typography>
                        <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {template.platforms.map((platform) => (
                            <Chip
                              key={platform}
                              label={platform}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          ))}
                        </Box>
                        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            {template.estimatedTime}
                          </Typography>
                          <Chip
                            label={template.complexity}
                            size="small"
                            color={getComplexityColor(template.complexity) as any}
                            sx={{ fontSize: '0.7rem' }}
                          />
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Main Content Area */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
              <Tab label="Generation Settings" />
              <Tab label="Content Library" />
              <Tab label="Analytics" />
              <Tab label="Team Collaboration" />
            </Tabs>

            {/* Generation Settings Tab */}
            {activeTab === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  AI Generation Settings
                </Typography>
                
                {selectedTemplate ? (
                  <Box>
                    <Alert severity="success" sx={{ mb: 3 }}>
                      <Typography variant="body2">
                        Selected: <strong>{selectedTemplate.name}</strong> - {selectedTemplate.description}
                      </Typography>
                    </Alert>

                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                          <InputLabel>Tone</InputLabel>
                          <Select
                            value={generationSettings.tone}
                            onChange={(e) => handleSettingsChange('tone', e.target.value)}
                          >
                            <MenuItem value="Professional">Professional</MenuItem>
                            <MenuItem value="Casual">Casual</MenuItem>
                            <MenuItem value="Friendly">Friendly</MenuItem>
                            <MenuItem value="Authoritative">Authoritative</MenuItem>
                            <MenuItem value="Humorous">Humorous</MenuItem>
                          </Select>
                        </FormControl>

                        <FormControl fullWidth sx={{ mb: 2 }}>
                          <InputLabel>Length</InputLabel>
                          <Select
                            value={generationSettings.length}
                            onChange={(e) => handleSettingsChange('length', e.target.value)}
                          >
                            <MenuItem value="Short">Short (1-2 min read)</MenuItem>
                            <MenuItem value="Medium">Medium (3-5 min read)</MenuItem>
                            <MenuItem value="Long">Long (5+ min read)</MenuItem>
                          </Select>
                        </FormControl>

                        <FormControl fullWidth sx={{ mb: 2 }}>
                          <InputLabel>Target Audience</InputLabel>
                          <Select
                            value={generationSettings.targetAudience}
                            onChange={(e) => handleSettingsChange('targetAudience', e.target.value)}
                          >
                            <MenuItem value="General">General Audience</MenuItem>
                            <MenuItem value="Professionals">Professionals</MenuItem>
                            <MenuItem value="Students">Students</MenuItem>
                            <MenuItem value="Entrepreneurs">Entrepreneurs</MenuItem>
                            <MenuItem value="Creators">Content Creators</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" gutterBottom>
                          Creativity Level: {generationSettings.creativity}/10
                        </Typography>
                        <Slider
                          value={generationSettings.creativity}
                          onChange={(e, value) => handleSettingsChange('creativity', value)}
                          min={1}
                          max={10}
                          step={1}
                          marks
                          sx={{ mb: 3 }}
                        />

                        <FormControlLabel
                          control={
                            <Switch
                              checked={generationSettings.includeHashtags}
                              onChange={(e) => handleSettingsChange('includeHashtags', e.target.checked)}
                            />
                          }
                          label="Include Hashtags"
                        />

                        <FormControlLabel
                          control={
                            <Switch
                              checked={generationSettings.includeCallToAction}
                              onChange={(e) => handleSettingsChange('includeCallToAction', e.target.checked)}
                            />
                          }
                          label="Include Call to Action"
                        />
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<AutoAwesome />}
                        onClick={handleGenerateContent}
                        disabled={isGenerating}
                        sx={{ px: 4, py: 1.5 }}
                      >
                        {isGenerating ? 'Generating...' : 'Generate Content'}
                      </Button>
                    </Box>

                    {isGenerating && (
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="body2" gutterBottom>
                          AI is generating your content... {generationProgress}%
                        </Typography>
                        <LinearProgress variant="determinate" value={generationProgress} />
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Alert severity="info">
                    <Typography variant="body2">
                      Please select a content template from the sidebar to begin generating content.
                    </Typography>
                  </Alert>
                )}
              </Box>
            )}

            {/* Content Library Tab */}
            {activeTab === 1 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">
                    Generated Content Library
                  </Typography>
                  <Button variant="outlined" startIcon={<Add />}>
                    New Content
                  </Button>
                </Box>

                {generatedContent.length > 0 ? (
                  <Grid container spacing={2}>
                    {generatedContent.map((content) => (
                      <Grid item xs={12} key={content.id}>
                        <Card>
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                              <Typography variant="h6">{content.title}</Typography>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Chip
                                  label={content.status}
                                  color={content.status === 'Published' ? 'success' : 'default'}
                                  size="small"
                                />
                                <IconButton size="small">
                                  <Edit />
                                </IconButton>
                                <IconButton size="small">
                                  <Delete />
                                </IconButton>
                              </Box>
                            </Box>
                            
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {content.content.substring(0, 150)}...
                            </Typography>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box sx={{ display: 'flex', gap: 2 }}>
                                <Typography variant="caption" color="text.secondary">
                                  Platform: {content.platform}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Created: {new Date(content.createdAt).toLocaleDateString()}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button size="small" startIcon={<Visibility />}>
                                  Preview
                                </Button>
                                <Button size="small" startIcon={<ContentCopy />}>
                                  Copy
                                </Button>
                                <Button size="small" startIcon={<Download />}>
                                  Export
                                </Button>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Alert severity="info">
                    <Typography variant="body2">
                      No generated content yet. Create your first piece using the Generation Settings tab.
                    </Typography>
                  </Alert>
                )}
              </Box>
            )}

            {/* Analytics Tab */}
            {activeTab === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Content Performance Analytics
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Analytics color="primary" sx={{ mr: 1 }} />
                          <Typography variant="h6">Total Content</Typography>
                        </Box>
                        <Typography variant="h4" color="primary">
                          {generatedContent.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Pieces generated this month
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Speed color="success" sx={{ mr: 1 }} />
                          <Typography variant="h6">Avg. Generation Time</Typography>
                        </Box>
                        <Typography variant="h4" color="success.main">
                          2.3 min
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Per content piece
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <CheckCircle color="warning" sx={{ mr: 1 }} />
                          <Typography variant="h6">Success Rate</Typography>
                        </Box>
                        <Typography variant="h4" color="warning.main">
                          94%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Content approved by team
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Team Collaboration Tab */}
            {activeTab === 3 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Team Collaboration Features
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Group color="primary" sx={{ mr: 1 }} />
                          <Typography variant="h6">Team Members</Typography>
                        </Box>
                        <List>
                          <ListItem>
                            <ListItemText
                              primary="John Doe"
                              secondary="Content Manager"
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              primary="Jane Smith"
                              secondary="Creative Director"
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              primary="Mike Johnson"
                              secondary="Social Media Specialist"
                            />
                          </ListItem>
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Security color="primary" sx={{ mr: 1 }} />
                          <Typography variant="h6">Permissions</Typography>
                        </Box>
                        <List>
                          <ListItem>
                            <ListItemText
                              primary="Content Generation"
                              secondary="All team members"
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              primary="Content Approval"
                              secondary="Managers only"
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              primary="Analytics Access"
                              secondary="All team members"
                            />
                          </ListItem>
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onClose={() => setShowPreview(false)} maxWidth="md" fullWidth>
        <DialogTitle>Content Preview</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {previewContent}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPreview(false)}>Close</Button>
          <Button variant="contained" startIcon={<ContentCopy />}>
            Copy Content
          </Button>
          <Button variant="contained" startIcon={<Download />}>
            Export
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
