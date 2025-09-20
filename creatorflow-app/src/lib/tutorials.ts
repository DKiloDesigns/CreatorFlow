/**
 * Tutorial Database
 * Interactive step-by-step tutorials for CreatorFlow features
 */

import { TutorialStep } from '@/components/ui/interactive-tutorial';

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in minutes
  prerequisites: string[];
  steps: TutorialStep[];
  tags: string[];
  featured: boolean;
  lastUpdated: string;
}

export const tutorials: Tutorial[] = [
  {
    id: 'creating-your-first-post',
    title: 'Creating Your First Post',
    description: 'Learn how to create and publish your first social media post using CreatorFlow.',
    category: 'Content Creation',
    difficulty: 'beginner',
    estimatedTime: 5,
    prerequisites: ['connected-accounts'],
    tags: ['posting', 'content', 'basics', 'getting-started'],
    featured: true,
    lastUpdated: '2025-01-18',
    steps: [
      {
        id: 'step-1',
        title: 'Open Content Creator',
        description: 'Navigate to the content creation tool',
        content: 'Let\'s start by opening the content creation tool. Click on the "Create Post" button in the main dashboard or use the keyboard shortcut Ctrl/Cmd + N.',
        action: {
          type: 'click',
          target: '[data-testid="create-post-button"]'
        },
        hints: [
          'Look for the blue "Create Post" button in the top navigation',
          'You can also use the + icon in the quick actions section',
          'The keyboard shortcut is Ctrl+N (Windows) or Cmd+N (Mac)'
        ],
        screenshot: '/tutorial-screenshots/dashboard-create-post.png',
        highlight: {
          x: 200,
          y: 80,
          width: 120,
          height: 40,
          description: 'Click the Create Post button to start creating content'
        },
        visualNotes: 'The Create Post button is prominently displayed in the main dashboard for easy access.'
      },
      {
        id: 'step-2',
        title: 'Select Your Platforms',
        description: 'Choose which social media accounts to post to',
        content: 'Select the social media platforms where you want to publish your post. You can choose multiple platforms at once.',
        action: {
          type: 'click',
          target: '[data-testid="platform-selector"]'
        },
        hints: [
          'Check the boxes next to the platforms you want to use',
          'You can select Instagram, Facebook, Twitter, LinkedIn, and more',
          'Each platform will show a preview of how your post will look'
        ],
        screenshot: '/tutorial-screenshots/platform-selection.png',
        highlight: {
          x: 100,
          y: 200,
          width: 300,
          height: 80,
          description: 'Select the social media platforms for your post'
        },
        visualNotes: 'Platform selection allows you to customize your content for each social media platform\'s specific requirements.'
      },
      {
        id: 'step-3',
        title: 'Write Your Caption',
        description: 'Add engaging text content for your post',
        content: 'Write your post caption in the text area. Make it engaging and relevant to your audience. You can use emojis and hashtags to increase engagement.',
        action: {
          type: 'input',
          target: '[data-testid="caption-input"]',
          value: 'Hello CreatorFlow! Excited to share my first post with you all! 🚀 #CreatorFlow #SocialMedia'
        },
        hints: [
          'Start with a hook to grab attention',
          'Include a call-to-action to encourage engagement',
          'Use 5-10 relevant hashtags for better discoverability',
          'Keep it authentic and true to your brand voice'
        ],
        screenshot: '/tutorial-screenshots/caption-input.png',
        highlight: {
          x: 50,
          y: 250,
          width: 400,
          height: 120,
          description: 'Type your post caption in the main text area'
        },
        beforeImage: '/tutorial-screenshots/caption-empty.png',
        afterImage: '/tutorial-screenshots/caption-filled.png',
        visualNotes: 'The caption input provides a rich text editor with hashtag suggestions and character count for each platform.'
      },
      {
        id: 'step-4',
        title: 'Add Media (Optional)',
        description: 'Upload images or videos to make your post more engaging',
        content: 'Click the media upload button to add photos or videos. High-quality visuals can significantly increase engagement.',
        action: {
          type: 'click',
          target: '[data-testid="media-upload-button"]'
        },
        hints: [
          'Supported formats: JPG, PNG, GIF, MP4, MOV',
          'For Instagram, use square images (1080x1080) for best results',
          'For Twitter, landscape images work well',
          'Add alt text for accessibility'
        ],
        screenshot: '/tutorial-screenshots/media-upload.png',
        highlight: {
          x: 300,
          y: 400,
          width: 100,
          height: 40,
          description: 'Click the media upload button to add images or videos'
        },
        visualNotes: 'The media upload feature supports drag-and-drop and provides automatic optimization for each platform.'
      },
      {
        id: 'step-5',
        title: 'Preview Your Post',
        description: 'See how your post will look on each platform',
        content: 'Use the preview feature to see exactly how your post will appear on each selected platform. This helps ensure your content looks perfect everywhere.',
        action: {
          type: 'click',
          target: '[data-testid="preview-button"]'
        },
        hints: [
          'Check character counts for each platform',
          'Verify that images display correctly',
          'Make sure hashtags are visible',
          'Test any links you included'
        ],
        screenshot: '/tutorial-screenshots/post-preview.png',
        highlight: {
          x: 200,
          y: 350,
          width: 100,
          height: 40,
          description: 'Click Preview to see how your post will look on each platform'
        },
        visualNotes: 'The preview feature shows real-time previews for each selected platform with accurate character counts and formatting.'
      },
      {
        id: 'step-6',
        title: 'Schedule or Publish',
        description: 'Choose when to publish your post',
        content: 'You can publish immediately or schedule for later. Use our AI-powered optimal timing suggestions for the best engagement.',
        action: {
          type: 'click',
          target: '[data-testid="publish-now-button"]'
        },
        hints: [
          'Publish now for immediate posting',
          'Schedule for optimal engagement times',
          'Use bulk scheduling for multiple posts',
          'Set up recurring posts for consistency'
        ],
        screenshot: '/tutorial-screenshots/publish-options.png',
        highlight: {
          x: 300,
          y: 500,
          width: 120,
          height: 40,
          description: 'Choose to publish now or schedule for later'
        },
        visualNotes: 'The publish options give you flexibility in when and how your content goes live across platforms.'
      }
    ]
  },
  {
    id: 'using-ai-content-generator',
    title: 'Using AI Content Generator',
    description: 'Master CreatorFlow\'s AI tools to create engaging content faster.',
    category: 'AI Tools',
    difficulty: 'intermediate',
    estimatedTime: 8,
    prerequisites: ['creating-your-first-post'],
    tags: ['ai', 'content-generation', 'automation', 'productivity'],
    featured: true,
    lastUpdated: '2025-01-18',
    steps: [
      {
        id: 'step-1',
        title: 'Access AI Tools',
        description: 'Navigate to the AI content generation section',
        content: 'Open the AI Content Generator from the main menu or use the AI button in the content creator.',
        action: {
          type: 'click',
          target: '[data-testid="ai-content-button"]'
        },
        hints: [
          'Look for the brain icon in the navigation',
          'You can also access it from the content creation page',
          'AI tools are available in the Pro plan'
        ]
      },
      {
        id: 'step-2',
        title: 'Choose Content Type',
        description: 'Select what type of content you want to generate',
        content: 'Choose from social media posts, blog articles, video scripts, or story content. Each type has different optimization settings.',
        action: {
          type: 'click',
          target: '[data-testid="content-type-selector"]'
        },
        hints: [
          'Social media posts are optimized for engagement',
          'Blog articles focus on SEO and readability',
          'Video scripts include visual cues and timing',
          'Story content is designed for short-form platforms'
        ]
      },
      {
        id: 'step-3',
        title: 'Describe Your Goal',
        description: 'Tell the AI what you want to achieve',
        content: 'Provide a clear description of your content goal. Be specific about your topic, audience, and desired outcome.',
        action: {
          type: 'input',
          target: '[data-testid="goal-input"]',
          value: 'Create an engaging Instagram post about sustainable fashion for eco-conscious millennials'
        },
        hints: [
          'Be specific about your target audience',
          'Mention the tone you want (professional, casual, funny)',
          'Include any key points you want to cover',
          'Specify the platform if it matters'
        ]
      },
      {
        id: 'step-4',
        title: 'Select Tone and Style',
        description: 'Choose the voice and personality for your content',
        content: 'Pick a tone that matches your brand voice. Options include professional, casual, inspirational, or humorous.',
        action: {
          type: 'click',
          target: '[data-testid="tone-selector"]'
        },
        hints: [
          'Professional: Business-focused, authoritative',
          'Casual: Friendly, conversational',
          'Inspirational: Motivational, uplifting',
          'Humorous: Funny, entertaining'
        ]
      },
      {
        id: 'step-5',
        title: 'Generate Content',
        description: 'Let AI create multiple content options',
        content: 'Click generate to create several variations of your content. Review and refine the options to find the best fit.',
        action: {
          type: 'click',
          target: '[data-testid="generate-button"]'
        },
        hints: [
          'AI will generate 3-5 different options',
          'Each option will have different angles and approaches',
          'You can regenerate if you\'re not satisfied',
          'Mix and match elements from different options'
        ]
      },
      {
        id: 'step-6',
        title: 'Review and Refine',
        description: 'Edit and customize the generated content',
        content: 'Review the AI-generated content and make any necessary adjustments. You can edit text, add your own voice, and customize hashtags.',
        action: {
          type: 'click',
          target: '[data-testid="edit-content-button"]'
        },
        hints: [
          'Always review AI content before publishing',
          'Add your personal touch and brand voice',
          'Check facts and claims for accuracy',
          'Customize hashtags for your specific audience'
        ]
      },
      {
        id: 'step-7',
        title: 'Save and Use',
        description: 'Save your content and use it in your posts',
        content: 'Save the final content to your library or use it directly in a new post. You can also save it as a template for future use.',
        action: {
          type: 'click',
          target: '[data-testid="save-content-button"]'
        },
        hints: [
          'Save successful content as templates',
          'Add to your content library for reuse',
          'Use directly in your posting workflow',
          'Share with team members if collaborating'
        ]
      }
    ]
  },
  {
    id: 'setting-up-content-calendar',
    title: 'Setting Up Your Content Calendar',
    description: 'Learn how to plan and organize your content with CreatorFlow\'s calendar system.',
    category: 'Planning',
    difficulty: 'beginner',
    estimatedTime: 10,
    prerequisites: ['creating-your-first-post'],
    tags: ['calendar', 'planning', 'scheduling', 'organization'],
    featured: true,
    lastUpdated: '2025-01-18',
    steps: [
      {
        id: 'step-1',
        title: 'Open Content Calendar',
        description: 'Navigate to the calendar view',
        content: 'Access the content calendar from the main dashboard. This is where you\'ll plan and organize all your content.',
        action: {
          type: 'click',
          target: '[data-testid="calendar-tab"]'
        },
        hints: [
          'Click on the calendar icon in the main navigation',
          'You can also access it from the content management section',
          'The calendar shows all your scheduled and published content'
        ]
      },
      {
        id: 'step-2',
        title: 'Choose Your View',
        description: 'Select calendar view (month, week, or day)',
        content: 'Choose between month, week, or day view based on your planning needs. Month view gives you the big picture, while day view shows detailed scheduling.',
        action: {
          type: 'click',
          target: '[data-testid="view-selector"]'
        },
        hints: [
          'Month view: Great for long-term planning',
          'Week view: Perfect for weekly content planning',
          'Day view: Detailed scheduling and time management',
          'You can switch views anytime'
        ]
      },
      {
        id: 'step-3',
        title: 'Create Content Blocks',
        description: 'Add content ideas and placeholders to your calendar',
        content: 'Drag and drop content ideas onto your calendar. You can create placeholders for different content types and themes.',
        action: {
          type: 'click',
          target: '[data-testid="add-content-block"]'
        },
        hints: [
          'Drag from the content library to calendar dates',
          'Create themed content blocks (e.g., "Motivation Monday")',
          'Use color coding for different content types',
          'Plan content series and campaigns'
        ]
      },
      {
        id: 'step-4',
        title: 'Set Optimal Posting Times',
        description: 'Configure AI-suggested optimal posting times',
        content: 'Use our AI to find the best times to post for each platform. This can significantly increase your engagement rates.',
        action: {
          type: 'click',
          target: '[data-testid="optimal-times-button"]'
        },
        hints: [
          'AI analyzes your audience activity patterns',
          'Different platforms have different optimal times',
          'You can override AI suggestions with your own times',
          'Optimal times update based on performance data'
        ]
      },
      {
        id: 'step-5',
        title: 'Create Recurring Content',
        description: 'Set up recurring posts for consistent content',
        content: 'Create recurring content series like "Tip Tuesday" or "Friday Favorites" to maintain consistency and save planning time.',
        action: {
          type: 'click',
          target: '[data-testid="recurring-content-button"]'
        },
        hints: [
          'Set up daily, weekly, or monthly recurring posts',
          'Create themed content series',
          'Use templates for consistent formatting',
          'Review and update recurring content regularly'
        ]
      },
      {
        id: 'step-6',
        title: 'Collaborate with Team',
        description: 'Invite team members to collaborate on content planning',
        content: 'Add team members to your calendar so they can contribute ideas, review content, and help with planning.',
        action: {
          type: 'click',
          target: '[data-testid="team-collaboration-button"]'
        },
        hints: [
          'Invite team members via email',
          'Assign different roles and permissions',
          'Use comments and notes for collaboration',
          'Set up approval workflows for content review'
        ]
      }
    ]
  },
  {
    id: 'analyzing-performance-metrics',
    title: 'Analyzing Performance Metrics',
    description: 'Learn how to interpret your analytics and optimize your content strategy.',
    category: 'Analytics',
    difficulty: 'intermediate',
    estimatedTime: 12,
    prerequisites: ['creating-your-first-post'],
    tags: ['analytics', 'metrics', 'optimization', 'strategy'],
    featured: true,
    lastUpdated: '2025-01-18',
    steps: [
      {
        id: 'step-1',
        title: 'Access Analytics Dashboard',
        description: 'Navigate to the analytics section',
        content: 'Open the analytics dashboard to view your performance metrics across all platforms.',
        action: {
          type: 'click',
          target: '[data-testid="analytics-tab"]'
        },
        hints: [
          'Click on the chart icon in the main navigation',
          'Analytics data may take 24-48 hours to appear',
          'You can view platform-specific or cross-platform analytics',
          'Set custom date ranges for detailed analysis'
        ]
      },
      {
        id: 'step-2',
        title: 'Understand Key Metrics',
        description: 'Learn about the most important performance indicators',
        content: 'Familiarize yourself with key metrics like reach, impressions, engagement rate, and click-through rate.',
        action: {
          type: 'click',
          target: '[data-testid="metrics-info-button"]'
        },
        hints: [
          'Reach: Unique users who saw your content',
          'Impressions: Total times your content was displayed',
          'Engagement Rate: (Likes + Comments + Shares) / Reach',
          'Click-Through Rate: Clicks / Impressions'
        ]
      },
      {
        id: 'step-3',
        title: 'Compare Platform Performance',
        description: 'See which platforms are performing best',
        content: 'Use the platform comparison view to identify your top-performing platforms and optimize your strategy accordingly.',
        action: {
          type: 'click',
          target: '[data-testid="platform-comparison-button"]'
        },
        hints: [
          'Look for platforms with highest engagement rates',
          'Consider audience size vs. engagement quality',
          'Focus more resources on top-performing platforms',
          'Investigate why certain platforms underperform'
        ]
      },
      {
        id: 'step-4',
        title: 'Identify Top Content',
        description: 'Find your best-performing posts',
        content: 'Review your top-performing content to understand what resonates with your audience and replicate successful patterns.',
        action: {
          type: 'click',
          target: '[data-testid="top-content-button"]'
        },
        hints: [
          'Look for common themes in top-performing posts',
          'Note the best posting times and days',
          'Identify successful content formats (images, videos, text)',
          'Create more content similar to your top performers'
        ]
      },
      {
        id: 'step-5',
        title: 'Analyze Audience Insights',
        description: 'Understand your audience demographics and behavior',
        content: 'Review audience insights to better understand who your content is reaching and when they\'re most active.',
        action: {
          type: 'click',
          target: '[data-testid="audience-insights-button"]'
        },
        hints: [
          'Check age, gender, and location demographics',
          'Identify peak activity times for your audience',
          'Look for audience interests and behaviors',
          'Use insights to create more targeted content'
        ]
      },
      {
        id: 'step-6',
        title: 'Set Up Automated Reports',
        description: 'Configure regular performance reports',
        content: 'Set up automated weekly or monthly reports to stay on top of your performance without manual checking.',
        action: {
          type: 'click',
          target: '[data-testid="automated-reports-button"]'
        },
        hints: [
          'Choose report frequency (weekly, monthly)',
          'Select which metrics to include',
          'Add team members to receive reports',
          'Customize report format and delivery method'
        ]
      }
    ]
  }
];

// Helper functions
export function getTutorialById(id: string): Tutorial | undefined {
  return tutorials.find(tutorial => tutorial.id === id);
}

export function getTutorialsByCategory(category: string): Tutorial[] {
  return tutorials.filter(tutorial => tutorial.category === category);
}

export function getFeaturedTutorials(): Tutorial[] {
  return tutorials.filter(tutorial => tutorial.featured);
}

export function getTutorialsByDifficulty(difficulty: string): Tutorial[] {
  return tutorials.filter(tutorial => tutorial.difficulty === difficulty);
}

export function searchTutorials(query: string): Tutorial[] {
  const searchTerm = query.toLowerCase();
  return tutorials.filter(tutorial => 
    tutorial.title.toLowerCase().includes(searchTerm) ||
    tutorial.description.toLowerCase().includes(searchTerm) ||
    tutorial.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
}
