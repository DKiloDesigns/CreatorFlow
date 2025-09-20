/**
 * Video Library Database
 * Tutorial videos and educational content for CreatorFlow
 */

import { VideoMetadata } from '@/components/ui/video-library';

export const videoLibrary: VideoMetadata[] = [
  {
    id: 'getting-started-overview',
    title: 'CreatorFlow Overview: Getting Started',
    description: 'Complete walkthrough of CreatorFlow\'s main features and how to get started with your first post.',
    url: '/videos/getting-started-overview.mp4',
    thumbnail: '/thumbnails/getting-started-overview.jpg',
    duration: 420, // 7 minutes
    category: 'Getting Started',
    difficulty: 'beginner',
    tags: ['overview', 'basics', 'onboarding', 'first-steps'],
    author: 'CreatorFlow Team',
    views: 15420,
    likes: 892,
    createdAt: '2025-01-15',
    featured: true,
    transcript: 'Welcome to CreatorFlow! In this video, we\'ll walk you through the main features and show you how to create your first post. Let\'s start by exploring the dashboard...',
    chapters: [
      { title: 'Introduction', startTime: 0, endTime: 30 },
      { title: 'Dashboard Overview', startTime: 30, endTime: 120 },
      { title: 'Creating Your First Post', startTime: 120, endTime: 300 },
      { title: 'Scheduling Content', startTime: 300, endTime: 380 },
      { title: 'Next Steps', startTime: 380, endTime: 420 }
    ]
  },
  {
    id: 'ai-content-generation',
    title: 'Mastering AI Content Generation',
    description: 'Learn how to use CreatorFlow\'s AI tools to create engaging content faster and more efficiently.',
    url: '/videos/ai-content-generation.mp4',
    thumbnail: '/thumbnails/ai-content-generation.jpg',
    duration: 600, // 10 minutes
    category: 'AI Tools',
    difficulty: 'intermediate',
    tags: ['ai', 'content-generation', 'automation', 'productivity'],
    author: 'CreatorFlow Team',
    views: 8930,
    likes: 567,
    createdAt: '2025-01-12',
    featured: true,
    transcript: 'AI content generation is one of CreatorFlow\'s most powerful features. In this tutorial, we\'ll show you how to create compelling content using our AI tools...',
    chapters: [
      { title: 'AI Tools Overview', startTime: 0, endTime: 60 },
      { title: 'Content Type Selection', startTime: 60, endTime: 150 },
      { title: 'Writing Effective Prompts', startTime: 150, endTime: 300 },
      { title: 'Refining AI Content', startTime: 300, endTime: 450 },
      { title: 'Best Practices', startTime: 450, endTime: 600 }
    ]
  },
  {
    id: 'content-calendar-setup',
    title: 'Setting Up Your Content Calendar',
    description: 'Plan and organize your content with CreatorFlow\'s powerful calendar system and scheduling tools.',
    url: '/videos/content-calendar-setup.mp4',
    thumbnail: '/thumbnails/content-calendar-setup.jpg',
    duration: 480, // 8 minutes
    category: 'Planning',
    difficulty: 'beginner',
    tags: ['calendar', 'planning', 'scheduling', 'organization'],
    author: 'CreatorFlow Team',
    views: 12350,
    likes: 734,
    createdAt: '2025-01-10',
    featured: true,
    transcript: 'A well-organized content calendar is essential for consistent social media success. Let\'s set up your CreatorFlow calendar...',
    chapters: [
      { title: 'Calendar Interface', startTime: 0, endTime: 90 },
      { title: 'Creating Content Blocks', startTime: 90, endTime: 240 },
      { title: 'Optimal Timing Setup', startTime: 240, endTime: 360 },
      { title: 'Team Collaboration', startTime: 360, endTime: 480 }
    ]
  },
  {
    id: 'analytics-deep-dive',
    title: 'Analytics Deep Dive: Understanding Your Performance',
    description: 'Master CreatorFlow\'s analytics to optimize your content strategy and maximize engagement.',
    url: '/videos/analytics-deep-dive.mp4',
    thumbnail: '/thumbnails/analytics-deep-dive.jpg',
    duration: 720, // 12 minutes
    category: 'Analytics',
    difficulty: 'advanced',
    tags: ['analytics', 'metrics', 'optimization', 'strategy'],
    author: 'CreatorFlow Team',
    views: 6780,
    likes: 423,
    createdAt: '2025-01-08',
    featured: true,
    transcript: 'Analytics are the key to understanding what works and what doesn\'t. Let\'s dive deep into CreatorFlow\'s analytics features...',
    chapters: [
      { title: 'Key Metrics Explained', startTime: 0, endTime: 120 },
      { title: 'Platform Comparison', startTime: 120, endTime: 300 },
      { title: 'Audience Insights', startTime: 300, endTime: 480 },
      { title: 'Content Performance Analysis', startTime: 480, endTime: 600 },
      { title: 'Optimization Strategies', startTime: 600, endTime: 720 }
    ]
  },
  {
    id: 'hashtag-research-mastery',
    title: 'Hashtag Research Mastery',
    description: 'Discover trending hashtags and optimize your content for maximum reach and engagement.',
    url: '/videos/hashtag-research-mastery.mp4',
    thumbnail: '/thumbnails/hashtag-research-mastery.jpg',
    duration: 360, // 6 minutes
    category: 'Content Creation',
    difficulty: 'intermediate',
    tags: ['hashtags', 'research', 'optimization', 'reach'],
    author: 'CreatorFlow Team',
    views: 9870,
    likes: 612,
    createdAt: '2025-01-05',
    featured: false,
    transcript: 'Hashtags are crucial for discoverability. Learn how to research and use hashtags effectively...',
    chapters: [
      { title: 'Hashtag Basics', startTime: 0, endTime: 60 },
      { title: 'Research Tools', startTime: 60, endTime: 180 },
      { title: 'Strategy Development', startTime: 180, endTime: 300 },
      { title: 'Implementation Tips', startTime: 300, endTime: 360 }
    ]
  },
  {
    id: 'team-collaboration',
    title: 'Team Collaboration and Workflow Management',
    description: 'Set up effective team workflows and collaboration features in CreatorFlow.',
    url: '/videos/team-collaboration.mp4',
    thumbnail: '/thumbnails/team-collaboration.jpg',
    duration: 540, // 9 minutes
    category: 'Team Management',
    difficulty: 'intermediate',
    tags: ['team', 'collaboration', 'workflow', 'management'],
    author: 'CreatorFlow Team',
    views: 5430,
    likes: 298,
    createdAt: '2025-01-03',
    featured: false,
    transcript: 'Working with a team? Learn how to set up effective collaboration workflows in CreatorFlow...',
    chapters: [
      { title: 'Team Setup', startTime: 0, endTime: 120 },
      { title: 'Role Management', startTime: 120, endTime: 240 },
      { title: 'Approval Workflows', startTime: 240, endTime: 360 },
      { title: 'Communication Tools', startTime: 360, endTime: 480 },
      { title: 'Best Practices', startTime: 480, endTime: 540 }
    ]
  },
  {
    id: 'mobile-app-tutorial',
    title: 'CreatorFlow Mobile App: Complete Guide',
    description: 'Master the CreatorFlow mobile app for managing your social media on the go.',
    url: '/videos/mobile-app-tutorial.mp4',
    thumbnail: '/thumbnails/mobile-app-tutorial.jpg',
    duration: 390, // 6.5 minutes
    category: 'Mobile',
    difficulty: 'beginner',
    tags: ['mobile', 'app', 'on-the-go', 'tutorial'],
    author: 'CreatorFlow Team',
    views: 11200,
    likes: 689,
    createdAt: '2025-01-01',
    featured: false,
    transcript: 'Take CreatorFlow with you wherever you go. Learn how to use our mobile app effectively...',
    chapters: [
      { title: 'App Installation', startTime: 0, endTime: 60 },
      { title: 'Account Setup', startTime: 60, endTime: 150 },
      { title: 'Creating Content', startTime: 150, endTime: 270 },
      { title: 'Scheduling Posts', startTime: 270, endTime: 390 }
    ]
  },
  {
    id: 'advanced-automation',
    title: 'Advanced Automation and Workflows',
    description: 'Set up sophisticated automation workflows to streamline your content creation process.',
    url: '/videos/advanced-automation.mp4',
    thumbnail: '/thumbnails/advanced-automation.jpg',
    duration: 900, // 15 minutes
    category: 'Automation',
    difficulty: 'advanced',
    tags: ['automation', 'workflows', 'advanced', 'productivity'],
    author: 'CreatorFlow Team',
    views: 4560,
    likes: 312,
    createdAt: '2024-12-28',
    featured: false,
    transcript: 'Take your productivity to the next level with advanced automation features...',
    chapters: [
      { title: 'Workflow Basics', startTime: 0, endTime: 120 },
      { title: 'Trigger Setup', startTime: 120, endTime: 300 },
      { title: 'Action Configuration', startTime: 300, endTime: 540 },
      { title: 'Conditional Logic', startTime: 540, endTime: 720 },
      { title: 'Testing and Optimization', startTime: 720, endTime: 900 }
    ]
  }
];

// Helper functions
export function getVideoById(id: string): VideoMetadata | undefined {
  return videoLibrary.find(video => video.id === id);
}

export function getVideosByCategory(category: string): VideoMetadata[] {
  return videoLibrary.filter(video => video.category === category);
}

export function getFeaturedVideos(): VideoMetadata[] {
  return videoLibrary.filter(video => video.featured);
}

export function getVideosByDifficulty(difficulty: string): VideoMetadata[] {
  return videoLibrary.filter(video => video.difficulty === difficulty);
}

export function searchVideos(query: string): VideoMetadata[] {
  const searchTerm = query.toLowerCase();
  return videoLibrary.filter(video => 
    video.title.toLowerCase().includes(searchTerm) ||
    video.description.toLowerCase().includes(searchTerm) ||
    video.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
}

export function getRelatedVideos(videoId: string, limit: number = 3): VideoMetadata[] {
  const video = getVideoById(videoId);
  if (!video) return [];

  return videoLibrary
    .filter(v => v.id !== videoId && v.category === video.category)
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}
