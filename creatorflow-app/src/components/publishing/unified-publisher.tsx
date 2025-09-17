/**
 * Unified Content Publisher Component
 * Provides a single interface for publishing content across all platforms
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Chip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Schedule as ScheduleIcon,
  Publish as PublishIcon,
  Image as ImageIcon,
  Video as VideoIcon,
  Link as LinkIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

interface Platform {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  color: string;
}

interface PublishResult {
  platform: string;
  success: boolean;
  postId?: string;
  url?: string;
  error?: string;
}

interface UnifiedPublisherProps {
  onPublish?: (result: PublishResult[]) => void;
  onSchedule?: (scheduledPostId: string) => void;
}

export default function UnifiedPublisher({ onPublish, onSchedule }: UnifiedPublisherProps) {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResults, setPublishResults] = useState<PublishResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // Mock platforms data - in real app, this would come from API
  const [platforms] = useState<Platform[]>([
    { id: 'instagram', name: 'Instagram', icon: '📷', connected: true, color: '#E4405F' },
    { id: 'youtube', name: 'YouTube', icon: '📺', connected: true, color: '#FF0000' },
    { id: 'twitter', name: 'Twitter', icon: '🐦', connected: true, color: '#1DA1F2' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', connected: true, color: '#000000' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', connected: true, color: '#0077B5' },
    { id: 'facebook', name: 'Facebook', icon: '👥', connected: false, color: '#1877F2' },
  ]);

  const connectedPlatforms = platforms.filter(p => p.connected);

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleAddMedia = () => {
    setMediaUrls(prev => [...prev, '']);
  };

  const handleRemoveMedia = (index: number) => {
    setMediaUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleMediaUrlChange = (index: number, value: string) => {
    setMediaUrls(prev => prev.map((url, i) => i === index ? value : url));
  };

  const handleAddHashtag = () => {
    setHashtags(prev => [...prev, '']);
  };

  const handleRemoveHashtag = (index: number) => {
    setHashtags(prev => prev.filter((_, i) => i !== index));
  };

  const handleHashtagChange = (index: number, value: string) => {
    setHashtags(prev => prev.map((tag, i) => i === index ? value : url));
  };

  const handlePublish = async () => {
    if (!content.trim() || selectedPlatforms.length === 0) {
      return;
    }

    setIsPublishing(true);
    setActiveStep(1);

    try {
      const response = await fetch('/api/publish/unified', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: isScheduled ? 'schedule' : 'publish_now',
          data: {
            content,
            platforms: selectedPlatforms,
            mediaUrls: mediaUrls.filter(url => url.trim()),
            hashtags: hashtags.filter(tag => tag.trim()),
            location: location.trim() || undefined,
            scheduledTime: isScheduled ? scheduledTime : undefined,
          },
        }),
      });

      const result = await response.json();

      if (result.success) {
        if (isScheduled) {
          setPublishResults([{
            platform: 'all',
            success: true,
            postId: result.result.scheduledPostId,
          }]);
          onSchedule?.(result.result.scheduledPostId);
        } else {
          setPublishResults(result.result.results);
          onPublish?.(result.result.results);
        }
        setShowResults(true);
        setActiveStep(2);
      } else {
        throw new Error(result.error || 'Publishing failed');
      }
    } catch (error) {
      console.error('Publishing error:', error);
      setPublishResults([{
        platform: 'all',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }]);
      setShowResults(true);
      setActiveStep(2);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleReset = () => {
    setContent('');
    setSelectedPlatforms([]);
    setMediaUrls([]);
    setHashtags([]);
    setLocation('');
    setIsScheduled(false);
    setScheduledTime('');
    setPublishResults([]);
    setShowResults(false);
    setActiveStep(0);
  };

  const steps = [
    'Create Content',
    isScheduled ? 'Schedule Post' : 'Publish Now',
    'Results',
  ];

  return (
    <Card sx={{ maxWidth: 800, mx: 'auto' }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Unified Content Publisher
        </Typography>

        <Stepper activeStep={activeStep} orientation="vertical">
          <Step>
            <StepLabel>Create Content</StepLabel>
            <StepContent>
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Content"
                  placeholder="What's on your mind?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  sx={{ mb: 2 }}
                />

                {/* Media URLs */}
                <Typography variant="subtitle2" gutterBottom>
                  Media URLs
                </Typography>
                {mediaUrls.map((url, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="https://example.com/image.jpg"
                      value={url}
                      onChange={(e) => handleMediaUrlChange(index, e.target.value)}
                    />
                    <IconButton onClick={() => handleRemoveMedia(index)}>
                      <RemoveIcon />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddMedia}
                  size="small"
                  sx={{ mb: 2 }}
                >
                  Add Media
                </Button>

                {/* Hashtags */}
                <Typography variant="subtitle2" gutterBottom>
                  Hashtags
                </Typography>
                {hashtags.map((tag, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="#hashtag"
                      value={tag}
                      onChange={(e) => handleHashtagChange(index, e.target.value)}
                    />
                    <IconButton onClick={() => handleRemoveHashtag(index)}>
                      <RemoveIcon />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddHashtag}
                  size="small"
                  sx={{ mb: 2 }}
                >
                  Add Hashtag
                </Button>

                <TextField
                  fullWidth
                  label="Location (optional)"
                  placeholder="New York, NY"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  sx={{ mb: 2 }}
                />

                {/* Platform Selection */}
                <Typography variant="subtitle2" gutterBottom>
                  Select Platforms
                </Typography>
                <Grid container spacing={1} sx={{ mb: 2 }}>
                  {connectedPlatforms.map((platform) => (
                    <Grid item key={platform.id}>
                      <Chip
                        label={`${platform.icon} ${platform.name}`}
                        onClick={() => handlePlatformToggle(platform.id)}
                        color={selectedPlatforms.includes(platform.id) ? 'primary' : 'default'}
                        sx={{
                          backgroundColor: selectedPlatforms.includes(platform.id) 
                            ? platform.color 
                            : 'default',
                          color: selectedPlatforms.includes(platform.id) 
                            ? 'white' 
                            : 'default',
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>

                {/* Scheduling */}
                <FormControlLabel
                  control={
                    <Switch
                      checked={isScheduled}
                      onChange={(e) => setIsScheduled(e.target.checked)}
                    />
                  }
                  label="Schedule for later"
                />

                {isScheduled && (
                  <TextField
                    fullWidth
                    type="datetime-local"
                    label="Scheduled Time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ mt: 1 }}
                  />
                )}
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  onClick={handlePublish}
                  disabled={!content.trim() || selectedPlatforms.length === 0 || isPublishing}
                  startIcon={isPublishing ? <CircularProgress size={20} /> : isScheduled ? <ScheduleIcon /> : <PublishIcon />}
                >
                  {isPublishing ? 'Publishing...' : isScheduled ? 'Schedule' : 'Publish Now'}
                </Button>
                <Button onClick={handleReset}>
                  Reset
                </Button>
              </Box>
            </StepContent>
          </Step>

          <Step>
            <StepLabel>{isScheduled ? 'Scheduling' : 'Publishing'}</StepLabel>
            <StepContent>
              {isPublishing && (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <CircularProgress />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {isScheduled ? 'Scheduling your post...' : 'Publishing to platforms...'}
                  </Typography>
                </Box>
              )}
            </StepContent>
          </Step>

          <Step>
            <StepLabel>Results</StepLabel>
            <StepContent>
              {showResults && (
                <Box>
                  {publishResults.map((result, index) => (
                    <Alert
                      key={index}
                      severity={result.success ? 'success' : 'error'}
                      icon={result.success ? <CheckCircleIcon /> : <ErrorIcon />}
                      sx={{ mb: 1 }}
                    >
                      <Typography variant="body2">
                        <strong>{result.platform}:</strong>{' '}
                        {result.success ? (
                          result.url ? (
                            <a href={result.url} target="_blank" rel="noopener noreferrer">
                              View Post
                            </a>
                          ) : (
                            'Published successfully'
                          )
                        ) : (
                          result.error || 'Failed to publish'
                        )}
                      </Typography>
                    </Alert>
                  ))}
                  
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button variant="contained" onClick={handleReset}>
                      Create Another Post
                    </Button>
                    <Button onClick={() => setShowResults(false)}>
                      Close
                    </Button>
                  </Box>
                </Box>
              )}
            </StepContent>
          </Step>
        </Stepper>
      </CardContent>
    </Card>
  );
}
