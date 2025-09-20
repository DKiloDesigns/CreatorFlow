'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Chip, 
  Button,
  Fade,
  Zoom,
  Paper
} from '@mui/material';
import { 
  YouTube, 
  Instagram, 
  MusicNote, 
  Twitter, 
  Chat, 
  Business,
  GitHub,
  PlayCircleFilled,
  VideoLibrary,
  Palette,
  Work,
  Forum,
  CameraAlt,
  LinkedIn,
  Phone,
  Public,
  CheckCircle,
  ArrowForward
} from '@mui/icons-material';

const PLATFORMS = [
  { 
    id: 'instagram', 
    name: 'Instagram', 
    icon: <Instagram />, 
    color: '#E4405F',
    features: ['Stories', 'Reels', 'Posts', 'IGTV', 'Shopping'],
    description: 'Visual content and stories'
  },
  { 
    id: 'youtube', 
    name: 'YouTube', 
    icon: <YouTube />, 
    color: '#FF0000',
    features: ['Videos', 'Shorts', 'Live', 'Community', 'Monetization'],
    description: 'Video content and monetization'
  },
  { 
    id: 'tiktok', 
    name: 'TikTok', 
    icon: <MusicNote />, 
    color: '#000000',
    features: ['Short Videos', 'Trends', 'Effects', 'Live', 'Ads'],
    description: 'Short-form video content'
  },
  { 
    id: 'twitter', 
    name: 'X (Twitter)', 
    icon: <Twitter />, 
    color: '#000000',
    features: ['Tweets', 'Threads', 'Spaces', 'Fleets', 'Analytics'],
    description: 'Real-time updates and engagement'
  },
  { 
    id: 'facebook', 
    name: 'Facebook', 
    icon: <Business />, 
    color: '#1877F2',
    features: ['Posts', 'Stories', 'Groups', 'Events', 'Marketplace'],
    description: 'Community and business pages'
  },
  { 
    id: 'linkedin', 
    name: 'LinkedIn', 
    icon: <LinkedIn />, 
    color: '#0A66C2',
    features: ['Articles', 'Posts', 'Videos', 'Events', 'Networking'],
    description: 'Professional networking'
  },
  { 
    id: 'discord', 
    name: 'Discord', 
    icon: <Chat />, 
    color: '#5865F2',
    features: ['Servers', 'Channels', 'Voice', 'Streaming', 'Bots'],
    description: 'Community and communication'
  },
  { 
    id: 'twitch', 
    name: 'Twitch', 
    icon: <PlayCircleFilled />, 
    color: '#9146FF',
    features: ['Live Streaming', 'Clips', 'VODs', 'Chat', 'Monetization'],
    description: 'Live streaming platform'
  },
  { 
    id: 'vimeo', 
    name: 'Vimeo', 
    icon: <VideoLibrary />, 
    color: '#1AB7EA',
    features: ['HD Videos', 'Live', 'Portfolio', 'Analytics', 'Monetization'],
    description: 'High-quality video hosting'
  },
  { 
    id: 'dribbble', 
    name: 'Dribbble', 
    icon: <Palette />, 
    color: '#EA4C89',
    features: ['Shots', 'Portfolio', 'Jobs', 'Teams', 'Pro'],
    description: 'Design inspiration and portfolio'
  },
  { 
    id: 'slack', 
    name: 'Slack', 
    icon: <Work />, 
    color: '#4A154B',
    features: ['Channels', 'DMs', 'Files', 'Integrations', 'Workflows'],
    description: 'Team communication'
  },
  { 
    id: 'reddit', 
    name: 'Reddit', 
    icon: <Forum />, 
    color: '#FF4500',
    features: ['Posts', 'Comments', 'Awards', 'Live', 'Communities'],
    description: 'Community discussions'
  },
  { 
    id: 'snapchat', 
    name: 'Snapchat', 
    icon: <CameraAlt />, 
    color: '#FFFC00',
    features: ['Snaps', 'Stories', 'Lenses', 'Spotlight', 'Maps'],
    description: 'Ephemeral content'
  },
  { 
    id: 'github', 
    name: 'GitHub', 
    icon: <GitHub />, 
    color: '#181717',
    features: ['Repositories', 'Issues', 'Pull Requests', 'Actions', 'Pages'],
    description: 'Code collaboration'
  },
  { 
    id: 'whatsapp', 
    name: 'WhatsApp', 
    icon: <Phone />, 
    color: '#25D366',
    features: ['Messages', 'Calls', 'Status', 'Groups', 'Business'],
    description: 'Messaging and calls'
  },
  { 
    id: 'mastodon', 
    name: 'Mastodon', 
    icon: <Public />, 
    color: '#6364FF',
    features: ['Toots', 'Boosts', 'Favorites', 'Lists', 'Federated'],
    description: 'Decentralized social network'
  }
];

const FEATURES_BY_PLATFORM = {
  'instagram': ['Visual Content', 'Stories', 'Reels', 'Shopping', 'Analytics'],
  'youtube': ['Video Upload', 'Live Streaming', 'Monetization', 'Community', 'Analytics'],
  'tiktok': ['Short Videos', 'Trends', 'Effects', 'Live', 'Ads'],
  'twitter': ['Tweets', 'Threads', 'Spaces', 'Analytics', 'Engagement'],
  'facebook': ['Posts', 'Stories', 'Groups', 'Events', 'Ads'],
  'linkedin': ['Articles', 'Posts', 'Networking', 'Jobs', 'Analytics'],
  'discord': ['Servers', 'Voice Chat', 'Streaming', 'Bots', 'Moderation'],
  'twitch': ['Live Streaming', 'Clips', 'Monetization', 'Chat', 'Analytics'],
  'vimeo': ['HD Videos', 'Portfolio', 'Live', 'Analytics', 'Monetization'],
  'dribbble': ['Portfolio', 'Inspiration', 'Jobs', 'Teams', 'Pro Tools'],
  'slack': ['Channels', 'Integrations', 'Workflows', 'Files', 'Calls'],
  'reddit': ['Communities', 'Discussions', 'Awards', 'Live', 'Moderation'],
  'snapchat': ['Snaps', 'Lenses', 'Stories', 'Maps', 'Spotlight'],
  'github': ['Repositories', 'Collaboration', 'Actions', 'Pages', 'Issues'],
  'whatsapp': ['Messages', 'Calls', 'Groups', 'Business', 'Status'],
  'mastodon': ['Toots', 'Federated', 'Lists', 'Moderation', 'Privacy']
};

export function PlatformSelector() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [showFeatures, setShowFeatures] = useState(false);

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const getRelevantFeatures = () => {
    const allFeatures = selectedPlatforms.flatMap(platformId => 
      FEATURES_BY_PLATFORM[platformId as keyof typeof FEATURES_BY_PLATFORM] || []
    );
    return [...new Set(allFeatures)]; // Remove duplicates
  };

  const relevantFeatures = getRelevantFeatures();

  return (
    <Box sx={{ 
      py: 8, 
      bgcolor: 'background.paper'
    }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ 
            fontWeight: 'bold', 
            mb: 2,
            color: 'text.primary'
          }}>
            Choose Your Platforms
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Select the platforms you use to see relevant CreatorFlow features
          </Typography>
        </Box>

        {/* Platform Grid */}
        <Grid container spacing={2} sx={{ mb: 6 }}>
          {PLATFORMS.map((platform) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={platform.id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: selectedPlatforms.includes(platform.id) ? 2 : 1,
                  borderColor: selectedPlatforms.includes(platform.id) 
                    ? platform.color 
                    : 'divider',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                    borderColor: platform.color
                  }
                }}
                onClick={() => handlePlatformToggle(platform.id)}
              >
                <CardContent sx={{ 
                  p: 2, 
                  textAlign: 'center',
                  bgcolor: selectedPlatforms.includes(platform.id) 
                    ? `${platform.color}10` 
                    : 'transparent'
                }}>
                  <Box sx={{ 
                    color: platform.color,
                    mb: 1,
                    '& .MuiSvgIcon-root': {
                      fontSize: '2rem'
                    }
                  }}>
                    {platform.icon}
                  </Box>
                  <Typography variant="body2" sx={{ 
                    fontWeight: 'bold',
                    color: 'text.primary'
                  }}>
                    {platform.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {platform.description}
                  </Typography>
                  {selectedPlatforms.includes(platform.id) && (
                    <CheckCircle sx={{ 
                      color: 'success.main', 
                      fontSize: '1.2rem',
                      mt: 0.5
                    }} />
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Selected Platforms Summary */}
        {selectedPlatforms.length > 0 && (
          <Fade in={selectedPlatforms.length > 0} timeout={500}>
            <Paper sx={{ p: 4, mb: 4, bgcolor: 'primary.50' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                Selected Platforms ({selectedPlatforms.length})
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                {selectedPlatforms.map(platformId => {
                  const platform = PLATFORMS.find(p => p.id === platformId);
                  return platform ? (
                    <Chip
                      key={platformId}
                      icon={platform.icon}
                      label={platform.name}
                      onDelete={() => handlePlatformToggle(platformId)}
                      sx={{
                        bgcolor: `${platform.color}20`,
                        color: platform.color,
                        fontWeight: 'bold'
                      }}
                    />
                  ) : null;
                })}
              </Box>
              <Button
                variant="contained"
                onClick={() => setShowFeatures(!showFeatures)}
                endIcon={<ArrowForward />}
                sx={{
                  background: 'linear-gradient(45deg, #3B82F6 30%, #8B5CF6 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #2563EB 30%, #7C3AED 90%)'
                  }
                }}
              >
                {showFeatures ? 'Hide' : 'Show'} Relevant Features
              </Button>
            </Paper>
          </Fade>
        )}

        {/* Relevant Features */}
        {showFeatures && relevantFeatures.length > 0 && (
          <Zoom in={showFeatures} timeout={500}>
            <Paper sx={{ p: 4, bgcolor: 'success.50' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                CreatorFlow Features for Your Platforms
              </Typography>
              <Grid container spacing={2}>
                {relevantFeatures.map((feature, index) => (
                  <Grid item xs={6} sm={4} md={3} key={index}>
                    <Chip
                      icon={<CheckCircle />}
                      label={feature}
                      color="success"
                      variant="outlined"
                      sx={{ 
                        width: '100%',
                        fontWeight: 'bold',
                        height: 40
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Ready to manage all {selectedPlatforms.length} platforms from one dashboard?
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{
                    py: 2,
                    px: 4,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #3B82F6 30%, #8B5CF6 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #2563EB 30%, #7C3AED 90%)',
                      transform: 'translateY(-2px)',
                      boxShadow: 4
                    }
                  }}
                >
                  Start Free Trial
                </Button>
              </Box>
            </Paper>
          </Zoom>
        )}

        {/* Call to Action */}
        {selectedPlatforms.length === 0 && (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              Select platforms above to see how CreatorFlow can help you manage them all
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}
