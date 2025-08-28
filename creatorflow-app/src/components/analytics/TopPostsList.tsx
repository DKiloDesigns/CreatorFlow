'use client';

import React from 'react';
import { Card, CardContent, Box, Typography, Chip } from '@mui/material';
import { TrendingUp, Heart, MessageSquare, Share2, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';

interface Post {
  id: string;
  platform: string;
  engagement: number;
  content?: string;
  timestamp?: string;
}

interface TopPostsListProps {
  posts: Post[];
}

export function TopPostsList({ posts }: TopPostsListProps) {
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram sx={{ height: 16, width: 16 }} />;
      case 'twitter':
        return <Twitter sx={{ height: 16, width: 16 }} />;
      case 'linkedin':
        return <Linkedin sx={{ height: 16, width: 16 }} />;
      case 'youtube':
        return <Youtube sx={{ height: 16, width: 16 }} />;
      default:
        return <TrendingUp sx={{ height: 16, width: 16 }} />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return 'linear-gradient(45deg, #8B5CF6 30%, #EC4899 90%)';
      case 'twitter':
        return '#3B82F6';
      case 'linkedin':
        return '#2563EB';
      case 'youtube':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getEngagementColor = (engagement: number) => {
    if (engagement >= 100) return 'success.main';
    if (engagement >= 50) return 'warning.main';
    return 'error.main';
  };

  if (posts.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <TrendingUp sx={{ mx: 'auto', height: 48, width: 48, color: 'grey.400', mb: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 500, color: 'grey.900', mb: 1 }}>
          No Top Posts
        </Typography>
        <Typography variant="body2" sx={{ color: 'grey.500' }}>
          Start creating content to see your top performing posts here.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {posts.map((post, index) => (
        <Card key={post.id} sx={{ 
          '&:hover': { 
            boxShadow: 4,
            transition: 'box-shadow 0.2s ease-in-out'
          } 
        }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  width: 32, 
                  height: 32, 
                  borderRadius: '50%', 
                  bgcolor: 'grey.100' 
                }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'grey.600' }}>
                    #{index + 1}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ 
                    p: 0.5, 
                    borderRadius: 1,
                    background: getPlatformColor(post.platform)
                  }}>
                    {getPlatformIcon(post.platform)}
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'grey.900' }}>
                      Post {post.id}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'grey.500', textTransform: 'capitalize' }}>
                      {post.platform}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 'bold', 
                    color: getEngagementColor(post.engagement) 
                  }}>
                    {post.engagement.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'grey.500' }}>
                    engagement
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'grey.400' }}>
                  <Heart sx={{ height: 16, width: 16 }} />
                  <MessageSquare sx={{ height: 16, width: 16 }} />
                  <Share2 sx={{ height: 16, width: 16 }} />
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
      
      {posts.length > 0 && (
        <Box sx={{ mt: 2, p: 1.5, bgcolor: 'blue.50', borderRadius: 2 }}>
          <Typography variant="body2" sx={{ color: 'blue.700' }}>
            💡 <strong>Tip:</strong> Analyze your top posts to understand what resonates with your audience.
          </Typography>
        </Box>
      )}
    </Box>
  );
} 