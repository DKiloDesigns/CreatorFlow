"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Fade,
  Zoom,
  Skeleton,
  Divider,
  Stack,
  Alert,
  AlertTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Badge,
  LinearProgress,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab
} from '@mui/material';
import {
  Refresh,
  TrendingUp,
  ContentCopy,
  Schedule,
  Analytics,
  Settings,
  CheckCircle,
  Warning,
  Info,
  Lightbulb,
  Add,
  Edit,
  Delete,
  Visibility,
  ThumbUp,
  Share,
  Message,
  CalendarToday,
  AccessTime,
  TrendingFlat,
  Rocket,
  Monitor,
  BarChart,
  Language,
  TrackChanges,
  Insights,
  Target,
  Speed,
  Timer,
  FlashOn,
  Star,
  StarBorder,
  ExpandMore,
  ExpandLess,
  PlayArrow,
  Pause,
  Stop,
  Save,
  Send,
  Image,
  VideoFile,
  Description,
  Tag,
  Event,
  Public,
  Lock,
  Group,
  Person,
  TrendingDown,
  TrendingUp as TrendingUpIcon,
  AutoAwesome,
  Palette,
  Tune,
  Compare,
  Assessment,
  Speed as SpeedIcon,
  EmojiEmotions,
  RecordVoiceOver,
  TextFields,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatQuote,
  FormatListBulleted,
  FormatListNumbered,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
  Transform,
  AutoFixHigh,
  ContentCut,
  ContentPaste,
  ContentPasteOff,
  ContentPasteSearch,
  ContentPasteOutlined,
  Download,
  Upload,
  CloudUpload,
  CloudDownload,
  CloudSync,
  CloudDone,
  CloudOff,
  CloudQueue,
  CloudCircle,
  Cloud,
  CloudDoneOutlined,
  CloudOffOutlined,
  CloudQueueOutlined,
  CloudCircleOutlined,
  CloudOutlined
} from '@/lib/mui-optimized-imports';
import { designTokens } from '@/lib/design-system';

// Content repurposing interfaces
interface OriginalContent {
  id: string;
  title: string;
  content: string;
  type: 'post' | 'article' | 'video' | 'image';
  platform: string;
  createdAt: string;
  tags: string[];
  hashtags: string[];
}

interface RepurposedContent {
  id: string;
  originalId: string;
  platform: string;
  title: string;
  content: string;
  format: string;
  length: number;
  hashtags: string[];
  optimized: boolean;
  engagementScore: number;
  createdAt: string;
  status: 'draft' | 'ready' | 'published';
}

interface RepurposingTemplate {
  id: string;
  name: string;
  description: string;
  fromPlatform: string;
  toPlatform: string;
  rules: RepurposingRule[];
  isActive: boolean;
}

interface RepurposingRule {
  id: string;
  type: 'length' | 'hashtags' | 'tone' | 'format' | 'media';
  action: string;
  value: any;
  priority: number;
}

interface ContentRepurposingEngineProps {
  onSave?: (repurposed: RepurposedContent[]) => void;
  onExport?: (content: RepurposedContent[]) => void;
  loading?: boolean;
  error?: string | null;
  className?: string;
}

export default function ContentRepurposingEngine({
  onSave,
  onExport,
  loading = false,
  error = null,
  className
}: ContentRepurposingEngineProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [originalContent, setOriginalContent] = useState<OriginalContent | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [repurposedContent, setRepurposedContent] = useState<RepurposedContent[]>([]);
  const [isRepurposing, setIsRepurposing] = useState(false);
  const [templates, setTemplates] = useState<RepurposingTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<RepurposingTemplate | null>(null);
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Partial<RepurposingTemplate>>({
    name: '',
    description: '',
    fromPlatform: '',
    toPlatform: '',
    rules: [],
    isActive: true
  });

  // Mock data for platforms
  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: '📷', maxLength: 2200, hashtags: 30 },
    { id: 'twitter', name: 'Twitter/X', icon: '🐦', maxLength: 280, hashtags: 2 },
    { id: 'facebook', name: 'Facebook', icon: '📘', maxLength: 63206, hashtags: 5 },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', maxLength: 3000, hashtags: 5 },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', maxLength: 2200, hashtags: 5 },
    { id: 'youtube', name: 'YouTube', icon: '📺', maxLength: 5000, hashtags: 15 }
  ];

  // Mock templates
  useEffect(() => {
    const mockTemplates: RepurposingTemplate[] = [
      {
        id: '1',
        name: 'Article to Social Posts',
        description: 'Convert long-form articles into engaging social media posts',
        fromPlatform: 'article',
        toPlatform: 'instagram',
        rules: [
          { id: '1', type: 'length', action: 'truncate', value: 2000, priority: 1 },
          { id: '2', type: 'hashtags', action: 'add', value: 10, priority: 2 },
          { id: '3', type: 'tone', action: 'casual', value: 'engaging', priority: 3 }
        ],
        isActive: true
      },
      {
        id: '2',
        name: 'Instagram to Twitter',
        description: 'Adapt Instagram posts for Twitter with character limits',
        fromPlatform: 'instagram',
        toPlatform: 'twitter',
        rules: [
          { id: '1', type: 'length', action: 'truncate', value: 250, priority: 1 },
          { id: '2', type: 'hashtags', action: 'reduce', value: 2, priority: 2 },
          { id: '3', type: 'format', action: 'thread', value: true, priority: 3 }
        ],
        isActive: true
      }
    ];
    setTemplates(mockTemplates);
  }, []);

  const handleRepurpose = async () => {
    if (!originalContent || selectedPlatforms.length === 0) return;

    setIsRepurposing(true);
    
    // Simulate AI repurposing
    await new Promise(resolve => setTimeout(resolve, 3000));

    const repurposed: RepurposedContent[] = selectedPlatforms.map(platformId => {
      const platform = platforms.find(p => p.id === platformId);
      if (!platform) return null;

      // Simulate content adaptation
      let adaptedContent = originalContent.content;
      let adaptedTitle = originalContent.title;

      // Length adaptation
      if (adaptedContent.length > platform.maxLength) {
        adaptedContent = adaptedContent.substring(0, platform.maxLength - 3) + '...';
      }

      // Hashtag adaptation
      const adaptedHashtags = originalContent.hashtags.slice(0, platform.hashtags);

      // Platform-specific formatting
      if (platformId === 'twitter' && adaptedContent.length > 250) {
        adaptedTitle = `Thread: ${adaptedTitle}`;
      }

      return {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        originalId: originalContent.id,
        platform: platformId,
        title: adaptedTitle,
        content: adaptedContent,
        format: platformId === 'twitter' ? 'thread' : 'single',
        length: adaptedContent.length,
        hashtags: adaptedHashtags,
        optimized: true,
        engagementScore: Math.floor(Math.random() * 30) + 70,
        createdAt: new Date().toISOString(),
        status: 'draft'
      };
    }).filter(Boolean) as RepurposedContent[];

    setRepurposedContent(repurposed);
    setIsRepurposing(false);
  };

  const handleCreateTemplate = () => {
    if (!newTemplate.name || !newTemplate.description) return;

    const template: RepurposingTemplate = {
      id: Date.now().toString(),
      name: newTemplate.name,
      description: newTemplate.description,
      fromPlatform: newTemplate.fromPlatform || '',
      toPlatform: newTemplate.toPlatform || '',
      rules: newTemplate.rules || [],
      isActive: newTemplate.isActive || true
    };

    setTemplates([...templates, template]);
    setShowCreateTemplate(false);
    setNewTemplate({
      name: '',
      description: '',
      fromPlatform: '',
      toPlatform: '',
      rules: [],
      isActive: true
    });
  };

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const getPlatformIcon = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    return platform?.icon || '📱';
  };

  const getPlatformName = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    return platform?.name || platformId;
  };

  return (
    <Box className={className} sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
        🔄 Content Repurposing Engine
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
        Automatically create platform-specific versions of your content. 
        Transform one piece of content into multiple optimized posts for different platforms.
      </Typography>

      <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
        <Tab label="Repurpose Content" icon={<Transform />} />
        <Tab label="Templates" icon={<AutoFixHigh />} />
        <Tab label="Results" icon={<ContentCopy />} />
      </Tabs>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Original Content
                </Typography>
                
                {!originalContent ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                      No content selected. Create or upload content to get started.
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => {
                        // Mock content creation
                        setOriginalContent({
                          id: '1',
                          title: 'Sample Article: The Future of Social Media Marketing',
                          content: 'Social media marketing is evolving rapidly. With new platforms emerging and algorithms constantly changing, marketers need to stay ahead of the curve. The key to success lies in understanding your audience, creating valuable content, and engaging authentically. In this comprehensive guide, we\'ll explore the latest trends, strategies, and tools that are shaping the future of social media marketing. From AI-powered content creation to advanced analytics, we\'ll cover everything you need to know to build a successful social media presence.',
                          type: 'article',
                          platform: 'blog',
                          createdAt: new Date().toISOString(),
                          tags: ['marketing', 'social media', 'strategy'],
                          hashtags: ['#SocialMediaMarketing', '#DigitalMarketing', '#ContentStrategy', '#MarketingTips', '#SocialMediaStrategy']
                        });
                      }}
                    >
                      Create Sample Content
                    </Button>
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {originalContent.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {originalContent.content.substring(0, 200)}...
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      {originalContent.hashtags.map((hashtag, index) => (
                        <Chip key={index} label={hashtag} size="small" />
                      ))}
                    </Box>
                    <Button
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={() => setOriginalContent(null)}
                    >
                      Change Content
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Target Platforms
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Select platforms to repurpose your content for
                </Typography>
                
                <Stack spacing={1}>
                  {platforms.map((platform) => (
                    <FormControlLabel
                      key={platform.id}
                      control={
                        <Switch
                          checked={selectedPlatforms.includes(platform.id)}
                          onChange={() => handlePlatformToggle(platform.id)}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2">{platform.icon}</Typography>
                          <Typography variant="body2">{platform.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            ({platform.maxLength} chars)
                          </Typography>
                        </Box>
                      }
                    />
                  ))}
                </Stack>

                <Button
                  variant="contained"
                  size="large"
                  onClick={handleRepurpose}
                  disabled={!originalContent || selectedPlatforms.length === 0 || isRepurposing}
                  startIcon={isRepurposing ? <CircularProgress size={20} /> : <Transform />}
                  sx={{ mt: 2 }}
                  fullWidth
                >
                  {isRepurposing ? 'Repurposing...' : 'Repurpose Content'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Repurposing Templates</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowCreateTemplate(true)}
              >
                Create Template
              </Button>
            </Box>
          </Grid>

          {templates.map((template) => (
            <Grid item xs={12} md={6} key={template.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6">{template.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {template.description}
                      </Typography>
                    </Box>
                    <Chip 
                      label={template.isActive ? 'Active' : 'Inactive'} 
                      color={template.isActive ? 'success' : 'default'} 
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2" sx={{ mb: 2 }}>
                    <strong>From:</strong> {template.fromPlatform} → <strong>To:</strong> {template.toPlatform}
                  </Typography>

                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Rules:</strong>
                  </Typography>
                  <List dense>
                    {template.rules.map((rule, index) => (
                      <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={`${rule.type}: ${rule.action}`} 
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button size="small" startIcon={<Edit />}>Edit</Button>
                    <Button size="small" startIcon={<Delete />} color="error">Delete</Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 2 && repurposedContent.length > 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Repurposed Content ({repurposedContent.length} versions)
            </Typography>
          </Grid>

          {repurposedContent.map((content) => (
            <Grid item xs={12} md={6} key={content.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getPlatformIcon(content.platform)} {getPlatformName(content.platform)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {content.title}
                      </Typography>
                    </Box>
                    <Chip 
                      label={`${content.engagementScore}%`} 
                      color={content.engagementScore >= 80 ? 'success' : content.engagementScore >= 60 ? 'warning' : 'error'} 
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {content.content}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    {content.hashtags.map((hashtag, index) => (
                      <Chip key={index} label={hashtag} size="small" />
                    ))}
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {content.length} characters • {content.format}
                    </Typography>
                    <Chip 
                      label={content.status} 
                      color={content.status === 'ready' ? 'success' : 'default'} 
                      size="small"
                    />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" startIcon={<Edit />}>Edit</Button>
                    <Button size="small" startIcon={<ContentCopy />}>Copy</Button>
                    <Button size="small" startIcon={<Share />}>Share</Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Template Dialog */}
      <Dialog open={showCreateTemplate} onClose={() => setShowCreateTemplate(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Repurposing Template</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Template Name"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>From Platform</InputLabel>
                <Select
                  value={newTemplate.fromPlatform}
                  onChange={(e) => setNewTemplate({...newTemplate, fromPlatform: e.target.value})}
                >
                  {platforms.map((platform) => (
                    <MenuItem key={platform.id} value={platform.id}>
                      {platform.icon} {platform.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>To Platform</InputLabel>
                <Select
                  value={newTemplate.toPlatform}
                  onChange={(e) => setNewTemplate({...newTemplate, toPlatform: e.target.value})}
                >
                  {platforms.map((platform) => (
                    <MenuItem key={platform.id} value={platform.id}>
                      {platform.icon} {platform.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={newTemplate.description}
                onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateTemplate(false)}>Cancel</Button>
          <Button onClick={handleCreateTemplate} variant="contained">Create Template</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
