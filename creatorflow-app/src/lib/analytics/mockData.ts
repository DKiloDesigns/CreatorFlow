import { addDays, subDays, format } from 'date-fns';

interface TimeRange {
  startDate: Date;
  endDate: Date;
}

interface MockDataConfig {
  timeRange: TimeRange;
  platforms: string[];
  dataDensity: 'sparse' | 'normal' | 'dense';
  userId: string;
}

interface AnalyticsOverview {
  totalPosts: number;
  totalViews: number;
  totalEngagements: number;
  avgEngagementRate: number;
  totalReach: number;
  totalImpressions: number;
  avgClickThroughRate: number;
}

interface GrowthData {
  [platform: string]: Array<{
    date: string;
    followers: number;
    following: number;
    engagement: number;
  }>;
}

interface TopPost {
  id: string;
  content: string;
  platform: string;
  publishedAt: string;
  metrics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    reach: number;
    impressions: number;
    engagementRate: number;
  };
}

interface PlatformBreakdown {
  [platform: string]: {
    totalPosts: number;
    totalEngagement: number;
    avgEngagementRate: number;
    topPerformingPost?: TopPost | null;
    growth: number;
    audienceDemographics: {
      ageGroups: { [key: string]: number };
      gender: { [key: string]: number };
      locations: { [key: string]: number };
    };
  };
}

class MockDataService {
  private generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private generateDateRange(config: MockDataConfig): string[] {
    const { startDate, endDate } = config.timeRange;
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const dates: string[] = [];
    
    for (let i = 0; i < days; i++) {
      dates.push(format(addDays(startDate, i), 'yyyy-MM-dd'));
    }
    
    return dates;
  }

  private generateGrowthTrend(startValue: number, days: number, volatility: number): number[] {
    const values: number[] = [startValue];
    for (let i = 1; i < days; i++) {
      const change = this.generateRandomNumber(-volatility, volatility);
      values.push(Math.max(0, values[i - 1] + change));
    }
    return values;
  }

  generateOverviewData(config: MockDataConfig): AnalyticsOverview {
    const posts = this.generateRandomNumber(20, 100);
    const views = this.generateRandomNumber(1000, 10000) * posts;
    const engagements = this.generateRandomNumber(100, 1000) * posts;
    
    return {
      totalPosts: posts,
      totalViews: views,
      totalEngagements: engagements,
      avgEngagementRate: (engagements / posts) * 100,
      totalReach: views * 1.5,
      totalImpressions: views * 2,
      avgClickThroughRate: this.generateRandomNumber(1, 5)
    };
  }

  generateGrowthData(config: MockDataConfig): GrowthData {
    const dates = this.generateDateRange(config);
    const result: GrowthData = {};

    config.platforms.forEach(platform => {
      const startFollowers = this.generateRandomNumber(1000, 10000);
      const followerTrend = this.generateGrowthTrend(startFollowers, dates.length, 50);
      
      result[platform] = dates.map((date, index) => ({
        date,
        followers: followerTrend[index],
        following: Math.floor(followerTrend[index] * 0.8),
        engagement: this.generateRandomNumber(100, 1000)
      }));
    });

    return result;
  }

  generateTopPosts(config: MockDataConfig): TopPost[] {
    const posts: TopPost[] = [];
    const platforms = config.platforms;
    
    for (let i = 0; i < 5; i++) {
      const platform = platforms[this.generateRandomNumber(0, platforms.length - 1)];
      const views = this.generateRandomNumber(1000, 10000);
      const likes = Math.floor(views * 0.1);
      const comments = Math.floor(likes * 0.1);
      const shares = Math.floor(comments * 0.5);
      
      posts.push({
        id: `mock-post-${i}`,
        content: `This is a mock post ${i + 1} for ${platform}`,
        platform,
        publishedAt: format(subDays(new Date(), this.generateRandomNumber(1, 30)), 'yyyy-MM-dd'),
        metrics: {
          views,
          likes,
          comments,
          shares,
          reach: views * 1.5,
          impressions: views * 2,
          engagementRate: ((likes + comments + shares) / views) * 100
        }
      });
    }

    return posts.sort((a, b) => b.metrics.views - a.metrics.views);
  }

  generatePlatformBreakdown(config: MockDataConfig): PlatformBreakdown {
    const result: PlatformBreakdown = {};

    config.platforms.forEach(platform => {
      const posts = this.generateRandomNumber(10, 50);
      const totalEngagement = this.generateRandomNumber(1000, 5000);
      
      result[platform] = {
        totalPosts: posts,
        totalEngagement,
        avgEngagementRate: (totalEngagement / posts) * 100,
        topPerformingPost: this.generateTopPosts(config)[0],
        growth: this.generateRandomNumber(5, 20),
        audienceDemographics: {
          ageGroups: {
            '18-24': this.generateRandomNumber(20, 40),
            '25-34': this.generateRandomNumber(30, 50),
            '35-44': this.generateRandomNumber(10, 30),
            '45+': this.generateRandomNumber(5, 15)
          },
          gender: {
            'male': this.generateRandomNumber(30, 70),
            'female': this.generateRandomNumber(30, 70),
            'other': this.generateRandomNumber(1, 5)
          },
          locations: {
            'United States': this.generateRandomNumber(30, 60),
            'United Kingdom': this.generateRandomNumber(5, 15),
            'Canada': this.generateRandomNumber(5, 15),
            'Australia': this.generateRandomNumber(5, 15),
            'Other': this.generateRandomNumber(10, 30)
          }
        }
      };
    });

    return result;
  }
}

export const mockDataService = new MockDataService();
export type { MockDataConfig, AnalyticsOverview, GrowthData, TopPost, PlatformBreakdown }; 