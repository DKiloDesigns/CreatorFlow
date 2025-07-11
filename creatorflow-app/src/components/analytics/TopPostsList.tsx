'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Instagram, 
  Twitter, 
  Linkedin, 
  Youtube, 
  TrendingUp,
  Heart,
  MessageSquare,
  Share2
} from 'lucide-react';

interface Post {
  id: string;
  engagement: number;
  platform: string;
}

interface TopPostsListProps {
  posts: Post[];
}

export function TopPostsList({ posts }: TopPostsListProps) {
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4" />;
      case 'youtube':
        return <Youtube className="h-4 w-4" />;
      default:
        return <TrendingUp className="h-4 w-4" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'twitter':
        return 'bg-blue-500';
      case 'linkedin':
        return 'bg-blue-600';
      case 'youtube':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getEngagementColor = (engagement: number) => {
    if (engagement >= 100) return 'text-green-600';
    if (engagement >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <TrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Top Posts</h3>
        <p className="text-gray-500">Start creating content to see your top performing posts here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post, index) => (
        <Card key={post.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                  <span className="text-sm font-bold text-gray-600">#{index + 1}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`p-1 rounded ${getPlatformColor(post.platform)}`}>
                    {getPlatformIcon(post.platform)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Post {post.id}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">
                      {post.platform}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className={`text-lg font-bold ${getEngagementColor(post.engagement)}`}>
                    {post.engagement.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">engagement</p>
                </div>
                <div className="flex items-center space-x-1 text-gray-400">
                  <Heart className="h-4 w-4" />
                  <MessageSquare className="h-4 w-4" />
                  <Share2 className="h-4 w-4" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {posts.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            💡 <strong>Tip:</strong> Analyze your top posts to understand what resonates with your audience.
          </p>
        </div>
      )}
    </div>
  );
} 