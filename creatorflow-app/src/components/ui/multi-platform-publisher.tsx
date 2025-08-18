'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardHeader,
  Chip,
  Button,
  CircularProgress,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Checkbox,
  FormGroup,
  Tabs,
  Tab,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';
import {
  Send,
  Schedule,
  CheckCircle,
  Error,
  Warning,
  Info,
  Edit,
  Delete,
  Visibility,
  Tag,
  Image,
  Language,
  Event,
  AccessTime,
  Settings,
  Add as AddIcon,
  Refresh,
  TrendingUp,
  BarChart,
  TrackChanges,
  FlashOn
} from '@mui/icons-material';
import { toast } from 'sonner';

interface PlatformConfig {
  name: string;
  connected: boolean;
  characterLimit: number;
  hashtagLimit: number;
  mediaSupport: 'image' | 'video' | 'both' | 'none';
  optimalPostingTimes: string[];
  engagementScore: number;
  status: 'active' | 'inactive' | 'error';
}

interface ContentItem {
  id: string;
  text: string;
  hashtags: string[];
  mediaUrls: string[];
  platforms: string[];
  scheduledAt?: Date;
  publishedAt?: Date;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  performance?: {
    impressions: number;
    engagement: number;
    clicks: number;
    reach: number;
  };
}

interface PublishingQueue {
  pending: ContentItem[];
  scheduled: ContentItem[];
  published: ContentItem[];
  failed: ContentItem[];
}

interface AutomationRule {
  id: string;
  name: string;
  enabled: boolean;
  conditions: {
    platform: string;
    timeOfDay: string;
    contentType: string;
    hashtagCount: number;
  };
  actions: {
    autoPost: boolean;
    autoOptimize: boolean;
    autoSchedule: boolean;
  };
}

export default function MultiPlatformPublisher() {
  const [activeTab, setActiveTab] = useState('composer');
  const [activeStep, setActiveStep] = useState(0);
  const [isPublishing, setIsPublishing] = useState(false);
  const [contentText, setContentText] = useState('');
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [scheduledTime, setScheduledTime] = useState<string>('');
  const [publishingQueue, setPublishingQueue] = useState<PublishingQueue>({
    pending: [],
    scheduled: [],
    published: [],
    failed: []
  });
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [availableHashtags, setAvailableHashtags] = useState<string[]>([]);
  const [platformConfigs, setPlatformConfigs] = useState<PlatformConfig[]>([]);

  // Fetch platform configurations
  const fetchPlatformConfigs = async () => {
    try {
      const response = await fetch('/api/platforms');
      if (response.ok) {
        const data = await response.json();
        setPlatformConfigs(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching platform configs:', error);
    }
  };

  // Fetch available hashtags
  const fetchHashtags = async () => {
    try {
      const response = await fetch('/api/ai/generate-hashtags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: contentText || 'social media content',
          platform: 'general',
          industry: 'technology'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAvailableHashtags(data.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching hashtags:', error);
    }
  };

  // Initialize data
  useEffect(() => {
    fetchPlatformConfigs();
  }, []);

  // Fetch hashtags when content changes
  useEffect(() => {
    if (contentText.length > 20) {
      fetchHashtags();
    }
  }, [contentText]);

  // Mock automation rules
  useEffect(() => {
    const mockRules: AutomationRule[] = [
      {
        id: '1',
        name: 'LinkedIn Professional Rule',
        enabled: true,
        conditions: {
          platform: 'LinkedIn',
          timeOfDay: '9:00 AM - 11:00 AM',
          contentType: 'professional',
          hashtagCount: 3
        },
        actions: {
          autoPost: true,
          autoOptimize: true,
          autoSchedule: false
        }
      }
    ];
    
    setAutomationRules(mockRules);
  }, []);

  // Mock publishing queue
  useEffect(() => {
    const mockQueue: PublishingQueue = {
      pending: [
        {
          id: '1',
          text: 'Excited to share our latest product launch! 🚀 #innovation #tech #launch',
          hashtags: ['#innovation', '#tech', '#launch'],
          mediaUrls: ['https://example.com/image1.jpg'],
          platforms: ['LinkedIn', 'Twitter'],
          status: 'draft'
        }
      ],
      scheduled: [],
      published: [
        {
          id: '3',
          text: 'Join us for our upcoming webinar on digital transformation! 📅 #webinar #digital #transformation',
          hashtags: ['#webinar', '#digital', '#transformation'],
          mediaUrls: [],
          platforms: ['LinkedIn', 'Twitter'],
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          status: 'published',
          performance: {
            impressions: 1250,
            engagement: 89,
            clicks: 45,
            reach: 890
          }
        }
      ],
      failed: []
    };
    
    setPublishingQueue(mockQueue);
  }, []);

  const handlePublish = async () => {
    if (!contentText.trim() || selectedPlatforms.length === 0) {
      toast.error('Please enter content and select platforms');
      return;
    }

    setIsPublishing(true);
    
    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: contentText,
          platforms: selectedPlatforms,
          hashtags: selectedHashtags,
          scheduledAt: scheduledTime ? new Date(scheduledTime) : undefined
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        if (scheduledTime) {
          toast.success('Content scheduled successfully!');
          const newScheduledItem: ContentItem = {
            id: Date.now().toString(),
            text: contentText,
            hashtags: selectedHashtags,
            mediaUrls: [],
            platforms: selectedPlatforms,
            scheduledAt: new Date(scheduledTime),
            status: 'scheduled'
          };
          
          setPublishingQueue(prev => ({
            ...prev,
            scheduled: [...prev.scheduled, newScheduledItem]
          }));
        } else {
          toast.success('Content published successfully!');
          const newPublishedItem: ContentItem = {
            id: Date.now().toString(),
            text: contentText,
            hashtags: selectedHashtags,
            mediaUrls: [],
            platforms: selectedPlatforms,
            publishedAt: new Date(),
            status: 'published'
          };
          
          setPublishingQueue(prev => ({
            ...prev,
            published: [newPublishedItem, ...prev.published]
          }));
        }
        
        // Reset form
        setContentText('');
        setSelectedHashtags([]);
        setSelectedPlatforms([]);
        setScheduledTime('');
        setActiveStep(0);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Publishing failed');
      }
    } catch (error) {
      console.error('Error publishing:', error);
      toast.error('Publishing failed. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Image />;
      case 'linkedin':
        return <Language />;
      case 'twitter':
        return <Tag />;
      case 'facebook':
        return <Language />;
      default:
        return <Language />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle color="success" />;
      case 'scheduled':
        return <Schedule color="info" />;
      case 'failed':
        return <Error color="error" />;
      default:
        return <Info color="warning" />;
    }
  };

  const renderContentComposer = () => (
    <Card>
      <CardHeader title="Content Composer" />
      <CardContent>
        <Stepper activeStep={activeStep} orientation="vertical">
          <Step>
            <StepLabel>Write Content</StepLabel>
            <StepContent>
              <TextField
                fullWidth
                multiline
                rows={6}
                placeholder="Write your content here... Use @mentions and #hashtags to increase engagement."
                value={contentText}
                onChange={(e) => setContentText(e.target.value)}
                sx={{ mb: 2 }}
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {contentText.length} characters
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedHashtags.length} hashtags selected
                </Typography>
              </Box>
              
              <Button
                variant="contained"
                onClick={() => setActiveStep(1)}
                disabled={!contentText.trim()}
              >
                Next: Select Platforms
              </Button>
            </StepContent>
          </Step>
          
          <Step>
            <StepLabel>Select Platforms</StepLabel>
            <StepContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Choose which platforms to publish to:
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                {platformConfigs.map((platform) => (
                  <Paper 
                    key={platform.name}
                    sx={{ 
                      p: 2, 
                      minWidth: 200,
                      border: '2px solid', 
                      borderColor: selectedPlatforms.includes(platform.name) ? 'primary.main' : 'divider',
                      bgcolor: selectedPlatforms.includes(platform.name) ? 'primary.50' : 'background.paper',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      if (selectedPlatforms.includes(platform.name)) {
                        setSelectedPlatforms(prev => prev.filter(p => p !== platform.name));
                      } else {
                        setSelectedPlatforms(prev => [...prev, platform.name]);
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      {getPlatformIcon(platform.name)}
                      <Typography variant="subtitle1" fontWeight="bold">
                        {platform.name}
                      </Typography>
                      <Chip 
                        label={platform.status} 
                        color={platform.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                    
                    <Typography variant="caption" color="text.secondary" display="block">
                      Character limit: {platform.characterLimit}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Hashtag limit: {platform.hashtagLimit}
                    </Typography>
                  </Paper>
                ))}
              </Box>
              
              <Box sx={{ mt: 2 }}>
                <Button onClick={() => setActiveStep(0)}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setActiveStep(2)}
                  disabled={selectedPlatforms.length === 0}
                  sx={{ ml: 1 }}
                >
                  Next: Optimize & Schedule
                </Button>
              </Box>
            </StepContent>
          </Step>
          
          <Step>
            <StepLabel>Optimize & Schedule</StepLabel>
            <StepContent>
              {/* Hashtag Selection */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Recommended Hashtags
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {availableHashtags.slice(0, 10).map((hashtag, index) => (
                    <Chip
                      key={index}
                      label={hashtag}
                      onClick={() => {
                        if (selectedHashtags.includes(hashtag)) {
                          setSelectedHashtags(prev => prev.filter(h => h !== hashtag));
                        } else {
                          setSelectedHashtags(prev => [...prev, hashtag]);
                        }
                      }}
                      color={selectedHashtags.includes(hashtag) ? 'primary' : 'default'}
                      variant={selectedHashtags.includes(hashtag) ? 'filled' : 'outlined'}
                      clickable
                    />
                  ))}
                </Box>
              </Box>
              
              {/* Scheduling */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Scheduling Options
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    fullWidth
                    type="datetime-local"
                    label="Schedule for later"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Or publish immediately by leaving this empty
                  </Typography>
                </Box>
              </Box>
              
              {/* Platform-specific optimization */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Platform Optimization
                </Typography>
                {selectedPlatforms.map((platform) => {
                  const config = platformConfigs.find(p => p.name === platform);
                  if (!config) return null;
                  
                  const isOverLimit = contentText.length > config.characterLimit;
                  const hashtagOverLimit = selectedHashtags.length > config.hashtagLimit;
                  
                  return (
                    <Alert 
                      key={platform} 
                      severity={isOverLimit || hashtagOverLimit ? 'warning' : 'info'}
                      sx={{ mb: 1 }}
                    >
                      <Typography variant="subtitle2" gutterBottom>
                        {platform} Optimization
                      </Typography>
                      {isOverLimit && (
                        <Typography variant="body2">
                          Content is {contentText.length - config.characterLimit} characters over the limit
                        </Typography>
                      )}
                      {hashtagOverLimit && (
                        <Typography variant="body2">
                          Too many hashtags. Limit: {config.hashtagLimit}
                        </Typography>
                      )}
                      {!isOverLimit && !hashtagOverLimit && (
                        <Typography variant="body2">
                          Content optimized for {platform}
                        </Typography>
                      )}
                    </Alert>
                  );
                })}
              </Box>
              
              <Box sx={{ mt: 2 }}>
                <Button onClick={() => setActiveStep(1)}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handlePublish}
                  disabled={isPublishing}
                  startIcon={isPublishing ? <CircularProgress size={20} /> : <Send />}
                  sx={{ ml: 1 }}
                >
                  {isPublishing ? 'Publishing...' : scheduledTime ? 'Schedule Post' : 'Publish Now'}
                </Button>
              </Box>
            </StepContent>
          </Step>
        </Stepper>
      </CardContent>
    </Card>
  );

  const renderPublishingQueue = () => (
    <Card>
      <CardHeader title="Publishing Queue" />
      <CardContent>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="Pending" value="pending" />
          <Tab label="Scheduled" value="scheduled" />
          <Tab label="Published" value="published" />
          <Tab label="Failed" value="failed" />
        </Tabs>
        
        <Box sx={{ mt: 2 }}>
          {activeTab === 'pending' && (
            <List>
              {publishingQueue.pending.map((item) => (
                <ListItem key={item.id} divider>
                  <ListItemIcon>
                    {getStatusIcon(item.status)}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    secondary={
                      <Box>
                        <Typography variant="caption" display="block">
                          Platforms: {item.platforms.join(', ')}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          {item.hashtags.map((tag, index) => (
                            <Chip key={index} label={tag} size="small" />
                          ))}
                        </Box>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton>
                      <Edit />
                    </IconButton>
                    <IconButton>
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
          
          {activeTab === 'published' && (
            <List>
              {publishingQueue.published.map((item) => (
                <ListItem key={item.id} divider>
                  <ListItemIcon>
                    {getStatusIcon(item.status)}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    secondary={
                      <Box>
                        <Typography variant="caption" display="block">
                          Published: {item.publishedAt?.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" display="block">
                          Platforms: {item.platforms.join(', ')}
                        </Typography>
                        {item.performance && (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="caption" display="block">
                              Impressions: {item.performance.impressions.toLocaleString()} | 
                              Engagement: {item.performance.engagement} | 
                              Clicks: {item.performance.clicks}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton>
                      <Visibility />
                    </IconButton>
                    <IconButton>
                      <BarChart />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  const renderAutomationSettings = () => (
    <Card>
      <CardHeader 
        title="Automation Settings" 
        action={
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
          >
            New Rule
          </Button>
        }
      />
      <CardContent>
        {automationRules.map((rule) => (
          <Paper key={rule.id} sx={{ p: 2, mb: 2, border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Switch
                checked={rule.enabled}
                onChange={(e) => {
                  setAutomationRules(prev => 
                    prev.map(r => r.id === rule.id ? { ...r, enabled: e.target.checked } : r)
                  );
                }}
              />
              <Typography variant="subtitle1" fontWeight="bold">
                {rule.name}
              </Typography>
              <Chip 
                label={rule.enabled ? 'Active' : 'Inactive'} 
                color={rule.enabled ? 'success' : 'default'}
                size="small"
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 4 }}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Conditions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Platform: {rule.conditions.platform}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Time: {rule.conditions.timeOfDay}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Actions
                </Typography>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox checked={rule.actions.autoPost} disabled />}
                    label="Auto Post"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={rule.actions.autoOptimize} disabled />}
                    label="Auto Optimize"
                  />
                </FormGroup>
              </Box>
            </Box>
          </Paper>
        ))}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          🚀 Multi-Platform Publisher
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Create once, publish everywhere with intelligent optimization
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
          <Chip icon={<Send />} label="Smart Publishing" color="primary" />
          <Chip icon={<Schedule />} label="Auto-Scheduling" color="success" />
          <Chip icon={<FlashOn />} label="AI Optimization" color="warning" />
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', gap: 3 }}>
        <Box sx={{ flex: 1 }}>
          {activeTab === 'composer' && renderContentComposer()}
          {activeTab === 'queue' && renderPublishingQueue()}
          {activeTab === 'automation' && renderAutomationSettings()}
        </Box>
        
        <Box sx={{ width: 300 }}>
          {/* Quick Stats */}
          <Card sx={{ mb: 3 }}>
            <CardHeader title="Quick Stats" />
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">Pending Posts</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {publishingQueue.pending.length}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">Scheduled Posts</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {publishingQueue.scheduled.length}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">Published Today</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {publishingQueue.published.filter(p => 
                    p.publishedAt && 
                    p.publishedAt.toDateString() === new Date().toDateString()
                  ).length}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Failed Posts</Typography>
                <Typography variant="body2" fontWeight="bold" color="error">
                  {publishingQueue.failed.length}
                </Typography>
              </Box>
            </CardContent>
          </Card>
          
          {/* Platform Status */}
          <Card>
            <CardHeader title="Platform Status" />
            <CardContent>
              {platformConfigs.map((platform) => (
                <Box key={platform.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getPlatformIcon(platform.name)}
                    <Typography variant="body2">
                      {platform.name}
                    </Typography>
                  </Box>
                  <Chip 
                    label={platform.status} 
                    color={platform.status === 'active' ? 'success' : platform.status === 'error' ? 'error' : 'default'}
                    size="small"
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Navigation Tabs */}
      <Box sx={{ mt: 4 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="Content Composer" value="composer" />
          <Tab label="Publishing Queue" value="queue" />
          <Tab label="Automation" value="automation" />
        </Tabs>
      </Box>
    </Box>
  );
}
