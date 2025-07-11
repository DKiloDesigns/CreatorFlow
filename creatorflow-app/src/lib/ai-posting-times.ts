import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface OptimalPostingTime {
  platform: string;
  dayOfWeek: string;
  timeSlot: string;
  confidence: number;
  reasoning: string;
}

export interface PostingTimeAnalysis {
  platform: string;
  bestTimes: OptimalPostingTime[];
  audienceActivity: {
    peakHours: string[];
    lowActivityHours: string[];
  };
  recommendations: string[];
}

/**
 * AI-powered optimal posting time prediction based on historical data
 */
export async function predictOptimalPostingTimes(
  userId: string,
  platform: string,
  timeRange: '7d' | '30d' | '90d' = '30d'
): Promise<PostingTimeAnalysis> {
  try {
    // Get user's historical post data
    const startDate = new Date();
    if (timeRange === '7d') startDate.setDate(startDate.getDate() - 7);
    else if (timeRange === '30d') startDate.setDate(startDate.getDate() - 30);
    else if (timeRange === '90d') startDate.setDate(startDate.getDate() - 90);

    const posts = await prisma.post.findMany({
      where: {
        userId,
        platforms: { has: platform },
        status: 'PUBLISHED',
        publishedAt: { gte: startDate },
        engagementRate: { gt: 0 }
      },
      select: {
        publishedAt: true,
        engagementRate: true,
        likes: true,
        comments: true,
        shares: true,
        views: true
      }
    });

    if (posts.length === 0) {
      return getDefaultPostingTimes(platform);
    }

    // Analyze posting patterns and engagement
    const timeAnalysis = analyzePostingTimes(posts, platform);
    const engagementAnalysis = analyzeEngagementPatterns(posts);
    
    // Generate AI recommendations
    const recommendations = generateRecommendations(timeAnalysis, engagementAnalysis, platform);

    return {
      platform,
      bestTimes: timeAnalysis.bestTimes,
      audienceActivity: timeAnalysis.audienceActivity,
      recommendations
    };

  } catch (error) {
    console.error('Error predicting optimal posting times:', error);
    return getDefaultPostingTimes(platform);
  }
}

function analyzePostingTimes(posts: any[], platform: string) {
  const timeSlots: { [key: string]: { count: number; avgEngagement: number } } = {};
  
  posts.forEach(post => {
    if (!post.publishedAt) return;
    
    const date = new Date(post.publishedAt);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    const hour = date.getHours();
    const timeSlot = getTimeSlot(hour);
    const key = `${dayOfWeek}-${timeSlot}`;
    
    if (!timeSlots[key]) {
      timeSlots[key] = { count: 0, avgEngagement: 0 };
    }
    
    timeSlots[key].count++;
    timeSlots[key].avgEngagement += post.engagementRate || 0;
  });

  // Calculate average engagement for each time slot
  Object.keys(timeSlots).forEach(key => {
    timeSlots[key].avgEngagement /= timeSlots[key].count;
  });

  // Find best times (top 3 by engagement)
  const bestTimes = Object.entries(timeSlots)
    .sort(([,a], [,b]) => b.avgEngagement - a.avgEngagement)
    .slice(0, 3)
    .map(([timeSlot, data]) => {
      const [day, time] = timeSlot.split('-');
      return {
        platform,
        dayOfWeek: day,
        timeSlot: time,
        confidence: Math.min(data.avgEngagement * 10, 95), // Scale confidence
        reasoning: `Based on ${data.count} posts with ${data.avgEngagement.toFixed(2)}% avg engagement`
      };
    });

  // Determine audience activity patterns
  const peakHours = getPeakHours(posts);
  const lowActivityHours = getLowActivityHours(posts);

  return {
    bestTimes,
    audienceActivity: {
      peakHours,
      lowActivityHours
    }
  };
}

function analyzeEngagementPatterns(posts: any[]) {
  const engagementByHour: { [key: number]: number[] } = {};
  
  posts.forEach(post => {
    if (!post.publishedAt) return;
    
    const hour = new Date(post.publishedAt).getHours();
    if (!engagementByHour[hour]) {
      engagementByHour[hour] = [];
    }
    engagementByHour[hour].push(post.engagementRate || 0);
  });

  return engagementByHour;
}

function generateRecommendations(timeAnalysis: any, engagementAnalysis: any, platform: string): string[] {
  const recommendations = [];
  
  // Platform-specific recommendations
  switch (platform.toLowerCase()) {
    case 'instagram':
      recommendations.push(
        "Post during peak hours (2-4 PM) for maximum visibility",
        "Use Stories to maintain engagement between feed posts",
        "Weekends typically see higher engagement rates"
      );
      break;
    case 'twitter':
      recommendations.push(
        "Twitter engagement peaks during business hours (9 AM - 5 PM)",
        "Post during major events or trending topics for viral potential",
        "Use hashtags strategically to increase discoverability"
      );
      break;
    case 'linkedin':
      recommendations.push(
        "LinkedIn performs best during business hours (8 AM - 6 PM)",
        "Tuesday-Thursday see the highest engagement",
        "Professional content performs better than casual posts"
      );
      break;
    case 'tiktok':
      recommendations.push(
        "TikTok engagement peaks in the evening (7-9 PM)",
        "Trending sounds and challenges increase visibility",
        "Post consistently to maintain algorithm favor"
      );
      break;
    default:
      recommendations.push(
        "Test different posting times to find your audience's sweet spot",
        "Consistency is key - stick to a regular posting schedule",
        "Monitor engagement rates to optimize your strategy"
      );
  }

  // Data-driven recommendations
  if (timeAnalysis.bestTimes.length > 0) {
    const bestTime = timeAnalysis.bestTimes[0];
    recommendations.push(
      `Your best performing time is ${bestTime.dayOfWeek}s at ${bestTime.timeSlot} (${bestTime.confidence.toFixed(0)}% confidence)`
    );
  }

  if (timeAnalysis.audienceActivity.peakHours.length > 0) {
    recommendations.push(
      `Your audience is most active during: ${timeAnalysis.audienceActivity.peakHours.join(', ')}`
    );
  }

  return recommendations;
}

function getTimeSlot(hour: number): string {
  if (hour >= 6 && hour < 12) return 'Morning (6 AM - 12 PM)';
  if (hour >= 12 && hour < 17) return 'Afternoon (12 PM - 5 PM)';
  if (hour >= 17 && hour < 21) return 'Evening (5 PM - 9 PM)';
  return 'Night (9 PM - 6 AM)';
}

function getPeakHours(posts: any[]): string[] {
  const hourEngagement: { [key: number]: number } = {};
  
  posts.forEach(post => {
    if (!post.publishedAt) return;
    const hour = new Date(post.publishedAt).getHours();
    hourEngagement[hour] = (hourEngagement[hour] || 0) + (post.engagementRate || 0);
  });

  return Object.entries(hourEngagement)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([hour]) => `${hour}:00`);
}

function getLowActivityHours(posts: any[]): string[] {
  const hourEngagement: { [key: number]: number } = {};
  
  posts.forEach(post => {
    if (!post.publishedAt) return;
    const hour = new Date(post.publishedAt).getHours();
    hourEngagement[hour] = (hourEngagement[hour] || 0) + (post.engagementRate || 0);
  });

  return Object.entries(hourEngagement)
    .sort(([,a], [,b]) => a - b)
    .slice(0, 3)
    .map(([hour]) => `${hour}:00`);
}

function getDefaultPostingTimes(platform: string): PostingTimeAnalysis {
  const defaultTimes = {
    instagram: [
      { platform: 'instagram', dayOfWeek: 'Monday', timeSlot: 'Afternoon (12 PM - 5 PM)', confidence: 85, reasoning: 'Based on Instagram engagement patterns' },
      { platform: 'instagram', dayOfWeek: 'Wednesday', timeSlot: 'Evening (5 PM - 9 PM)', confidence: 80, reasoning: 'Mid-week peak engagement' },
      { platform: 'instagram', dayOfWeek: 'Friday', timeSlot: 'Afternoon (12 PM - 5 PM)', confidence: 75, reasoning: 'Weekend anticipation' }
    ],
    twitter: [
      { platform: 'twitter', dayOfWeek: 'Tuesday', timeSlot: 'Morning (6 AM - 12 PM)', confidence: 85, reasoning: 'Business hours engagement' },
      { platform: 'twitter', dayOfWeek: 'Thursday', timeSlot: 'Afternoon (12 PM - 5 PM)', confidence: 80, reasoning: 'Professional audience active' },
      { platform: 'twitter', dayOfWeek: 'Monday', timeSlot: 'Morning (6 AM - 12 PM)', confidence: 75, reasoning: 'Start of work week' }
    ],
    linkedin: [
      { platform: 'linkedin', dayOfWeek: 'Tuesday', timeSlot: 'Morning (6 AM - 12 PM)', confidence: 90, reasoning: 'Professional networking peak' },
      { platform: 'linkedin', dayOfWeek: 'Wednesday', timeSlot: 'Afternoon (12 PM - 5 PM)', confidence: 85, reasoning: 'Mid-week business activity' },
      { platform: 'linkedin', dayOfWeek: 'Thursday', timeSlot: 'Morning (6 AM - 12 PM)', confidence: 80, reasoning: 'Pre-weekend engagement' }
    ],
    tiktok: [
      { platform: 'tiktok', dayOfWeek: 'Friday', timeSlot: 'Evening (5 PM - 9 PM)', confidence: 85, reasoning: 'Weekend entertainment peak' },
      { platform: 'tiktok', dayOfWeek: 'Saturday', timeSlot: 'Evening (5 PM - 9 PM)', confidence: 80, reasoning: 'Weekend leisure time' },
      { platform: 'tiktok', dayOfWeek: 'Sunday', timeSlot: 'Evening (5 PM - 9 PM)', confidence: 75, reasoning: 'Sunday evening relaxation' }
    ]
  };

  return {
    platform,
    bestTimes: defaultTimes[platform as keyof typeof defaultTimes] || defaultTimes.instagram,
    audienceActivity: {
      peakHours: ['14:00', '15:00', '16:00'],
      lowActivityHours: ['02:00', '03:00', '04:00']
    },
    recommendations: [
      'Start with these recommended times and adjust based on your audience response',
      'Monitor engagement rates to find your optimal posting schedule',
      'Consider your audience\'s timezone when scheduling posts'
    ]
  };
} 