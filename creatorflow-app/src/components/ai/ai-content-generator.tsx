/**
 * AI Content Generator Component
 * Interface for AI-powered content generation
 */

'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  Tabs,
  Tab,
  LinearProgress,
  Alert,
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
} from '@mui/material';
import {
  AutoFixHigh as AutoFixHighIcon,
  Lightbulb as LightbulbIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  ContentCopy as ContentCopyIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  PlayArrow as PlayArrowIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';

interface GeneratedContent {
  id: string;
  type: 'post' | 'caption' | 'hashtag' | 'idea';
  content: string;
  platform: string;
  tone: string;
  confidence: number;
  engagement: {
    predicted: number;
    factors: string[];
  };
  hashtags?: string[];
  emojis?: string[];
  metadata: {
    wordCount: number;
    characterCount: number;
    readabilityScore: number;
    sentimentScore: number;
  };
  createdAt: string;
}

interface ContentIdea {
  id: string;
  title: string;
  description: string;
  platform: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedEngagement: number;
  timeToCreate: number;
  requiredAssets: string[];
  trending: boolean;
  seasonal: boolean;
  hashtags: string[];
  createdAt: string;
}

export default function AIContentGenerator() {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>([]);
  const [hashtags, setHashtags] = useState<any[]>([]);
  const [selectedContent, setSelectedContent] = useState<GeneratedContent | null>(null);
  const [contentDialogOpen, setContentDialogOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    topic: '',
    platform: 'instagram',
    tone: 'professional',
    targetAudience: '',
    brandVoice: '',
    keywords: '',
    length: 'medium',
    includeEmojis: true,
    includeHashtags: true,
    count: 1
  });

  // Generate content
  const handleGenerateContent = async () => {
    if (!formData.topic.trim()) {
      alert('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/ai/content-generation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_post',
          data: {
            topic: formData.topic,
            platform: formData.platform,
            tone: formData.tone,
            targetAudience: formData.targetAudience,
            brandVoice: formData.brandVoice,
            keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k),
            length: formData.length,
            includeEmojis: formData.includeEmojis,
            includeHashtags: formData.includeHashtags
          }
        })
      });

      const result = await response.json();
      if (result.success) {
        setGeneratedContent(prev => [result.data, ...prev]);
      } else {
        alert(`Generation failed: ${result.message}`);
      }
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Generate bulk content
  const handleGenerateBulk = async () => {
    if (!formData.topic.trim()) {
      alert('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/ai/content-generation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_bulk_posts',
          data: {
            topic: formData.topic,
            platform: formData.platform,
            tone: formData.tone,
            targetAudience: formData.targetAudience,
            brandVoice: formData.brandVoice,
            keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k),
            length: formData.length,
            includeEmojis: formData.includeEmojis,
            includeHashtags: formData.includeHashtags,
            count: formData.count
          }
        })
      });

      const result = await response.json();
      if (result.success) {
        setGeneratedContent(prev => [...result.data, ...prev]);
      } else {
        alert(`Bulk generation failed: ${result.message}`);
      }
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Generate content ideas
  const handleGenerateIdeas = async () => {
    if (!formData.topic.trim()) {
      alert('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/ai/content-generation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_ideas',
          data: {
            topic: formData.topic,
            platform: formData.platform,
            tone: formData.tone
          }
        })
      });

      const result = await response.json();
      if (result.success) {
        setContentIdeas(result.data);
      } else {
        alert(`Ideas generation failed: ${result.message}`);
      }
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Generate hashtags
  const handleGenerateHashtags = async () => {
    if (!formData.topic.trim()) {
      alert('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/ai/content-generation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_hashtags',
          data: {
            topic: formData.topic,
            platform: formData.platform
          }
        })
      });

      const result = await response.json();
      if (result.success) {
        setHashtags(result.data);
      } else {
        alert(`Hashtags generation failed: ${result.message}`);
      }
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Copy content to clipboard
  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    // Show success message
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      default: return 'default';
    }
  };

  // Get confidence color
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'success';
    if (confidence >= 60) return 'warning';
    return 'error';
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h4" gutterBottom>
        AI Content Generator
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Generate engaging content, ideas, and hashtags using AI-powered tools.
      </Typography>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Content Generator" icon={<AutoFixHighIcon />} />
          <Tab label="Content Ideas" icon={<LightbulbIcon />} />
          <Tab label="Hashtag Research" icon={<TrendingUpIcon />} />
        </Tabs>
      </Box>

      {/* Content Generator Tab */}
      {activeTab === 0 && (
        <Box>
          {/* Generation Form */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Generate Content
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Topic"
                    value={formData.topic}
                    onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                    placeholder="What do you want to create content about?"
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Target Audience"
                    value={formData.targetAudience}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                    placeholder="e.g., young professionals, fitness enthusiasts"
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Keywords (comma-separated)"
                    value={formData.keywords}
                    onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                    placeholder="e.g., marketing, social media, growth"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Platform</InputLabel>
                    <Select
                      value={formData.platform}
                      onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value }))}
                      label="Platform"
                    >
                      <MenuItem value="instagram">Instagram</MenuItem>
                      <MenuItem value="facebook">Facebook</MenuItem>
                      <MenuItem value="twitter">Twitter</MenuItem>
                      <MenuItem value="linkedin">LinkedIn</MenuItem>
                      <MenuItem value="tiktok">TikTok</MenuItem>
                      <MenuItem value="youtube">YouTube</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Tone</InputLabel>
                    <Select
                      value={formData.tone}
                      onChange={(e) => setFormData(prev => ({ ...prev, tone: e.target.value }))}
                      label="Tone"
                    >
                      <MenuItem value="professional">Professional</MenuItem>
                      <MenuItem value="casual">Casual</MenuItem>
                      <MenuItem value="friendly">Friendly</MenuItem>
                      <MenuItem value="authoritative">Authoritative</MenuItem>
                      <MenuItem value="playful">Playful</MenuItem>
                      <MenuItem value="inspirational">Inspirational</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Length</InputLabel>
                    <Select
                      value={formData.length}
                      onChange={(e) => setFormData(prev => ({ ...prev, length: e.target.value }))}
                      label="Length"
                    >
                      <MenuItem value="short">Short</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="long">Long</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleGenerateContent}
                  disabled={loading}
                  startIcon={<AutoFixHighIcon />}
                >
                  Generate Content
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleGenerateBulk}
                  disabled={loading}
                  startIcon={<AddIcon />}
                >
                  Generate Bulk ({formData.count})
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Generated Content */}
          {generatedContent.length > 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Generated Content
              </Typography>
              <Grid container spacing={3}>
                {generatedContent.map((content) => (
                  <Grid item xs={12} md={6} key={content.id}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
                          </Typography>
                          <Chip
                            label={`${content.confidence}% confidence`}
                            color={getConfidenceColor(content.confidence)}
                            size="small"
                          />
                        </Box>
                        
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {content.content}
                        </Typography>

                        {content.hashtags && content.hashtags.length > 0 && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" color="text.secondary" gutterBottom>
                              Hashtags:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {content.hashtags.map((tag, index) => (
                                <Chip key={index} label={tag} size="small" />
                              ))}
                            </Box>
                          </Box>
                        )}

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
                            Predicted Engagement: {content.engagement.predicted}%
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {content.metadata.wordCount} words
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            startIcon={<ContentCopyIcon />}
                            onClick={() => handleCopyContent(content.content)}
                          >
                            Copy
                          </Button>
                          <Button
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={() => {
                              setSelectedContent(content);
                              setContentDialogOpen(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            startIcon={<ShareIcon />}
                            onClick={() => {/* Handle share */}}
                          >
                            Share
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      )}

      {/* Content Ideas Tab */}
      {activeTab === 1 && (
        <Box>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Generate Content Ideas
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  fullWidth
                  label="Topic"
                  value={formData.topic}
                  onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                  placeholder="What topic do you want ideas for?"
                />
                <Button
                  variant="contained"
                  onClick={handleGenerateIdeas}
                  disabled={loading}
                  startIcon={<LightbulbIcon />}
                >
                  Generate Ideas
                </Button>
              </Box>
            </CardContent>
          </Card>

          {contentIdeas.length > 0 && (
            <Grid container spacing={3}>
              {contentIdeas.map((idea) => (
                <Grid item xs={12} md={6} key={idea.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                          {idea.title}
                        </Typography>
                        <Chip
                          label={idea.difficulty}
                          color={getDifficultyColor(idea.difficulty)}
                          size="small"
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {idea.description}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
                          Engagement: {idea.estimatedEngagement}%
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
                          Time: {idea.timeToCreate}min
                        </Typography>
                        {idea.trending && (
                          <Chip label="Trending" color="success" size="small" />
                        )}
                      </Box>

                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                        {idea.hashtags.map((tag, index) => (
                          <Chip key={index} label={tag} size="small" />
                        ))}
                      </Box>

                      <Button
                        size="small"
                        startIcon={<PlayArrowIcon />}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, topic: idea.title }));
                          setActiveTab(0);
                        }}
                      >
                        Create Content
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {/* Hashtag Research Tab */}
      {activeTab === 2 && (
        <Box>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Hashtag Research
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  fullWidth
                  label="Topic"
                  value={formData.topic}
                  onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                  placeholder="What hashtags do you want to research?"
                />
                <Button
                  variant="contained"
                  onClick={handleGenerateHashtags}
                  disabled={loading}
                  startIcon={<TrendingUpIcon />}
                >
                  Research Hashtags
                </Button>
              </Box>
            </CardContent>
          </Card>

          {hashtags.length > 0 && (
            <Grid container spacing={3}>
              {hashtags.map((hashtag, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                          {hashtag.hashtag}
                        </Typography>
                        <Chip
                          label={`${hashtag.popularity}% popularity`}
                          color={hashtag.popularity > 70 ? 'success' : hashtag.popularity > 40 ? 'warning' : 'error'}
                          size="small"
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {hashtag.suggestedUse}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
                          Competition: {hashtag.competition}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
                          Trend: {hashtag.trend}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {hashtag.relatedHashtags.map((tag: string, tagIndex: number) => (
                          <Chip key={tagIndex} label={tag} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {/* Content Detail Dialog */}
      <Dialog
        open={contentDialogOpen}
        onClose={() => setContentDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedContent && (
          <>
            <DialogTitle>
              <Typography variant="h6">
                Content Details
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {selectedContent.content}
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Metrics
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Confidence: {selectedContent.confidence}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Predicted Engagement: {selectedContent.engagement.predicted}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Word Count: {selectedContent.metadata.wordCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Character Count: {selectedContent.metadata.characterCount}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Engagement Factors
                  </Typography>
                  {selectedContent.engagement.factors.map((factor, index) => (
                    <Chip key={index} label={factor} size="small" sx={{ mr: 1, mb: 1 }} />
                  ))}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setContentDialogOpen(false)}>
                Close
              </Button>
              <Button
                variant="contained"
                startIcon={<ContentCopyIcon />}
                onClick={() => {
                  handleCopyContent(selectedContent.content);
                  setContentDialogOpen(false);
                }}
              >
                Copy Content
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
