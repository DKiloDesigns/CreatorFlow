/**
 * Smart Scheduling AI
 * ML-powered optimal posting time recommendations and content scheduling
 */

export interface SchedulingRequest {
  platform: string;
  content: string;
  targetAudience?: string;
  timezone: string;
  preferredTimes?: string[];
  avoidTimes?: string[];
  frequency: 'daily' | 'weekly' | 'monthly';
  duration: number; // days
}

export interface OptimalTimeSlot {
  time: string;
  day: string;
  confidence: number; // 0-100
  expectedEngagement: number;
  factors: string[];
  timezone: string;
}

export interface SchedulingRecommendation {
  platform: string;
  optimalSlots: OptimalTimeSlot[];
  alternativeSlots: OptimalTimeSlot[];
  bestDay: string;
  bestTime: string;
  reasoning: string;
  confidence: number;
  nextBestTime?: string;
}

export interface ContentPerformanceData {
  platform: string;
  contentId: string;
  publishedAt: string;
  engagement: number;
  reach: number;
  clicks: number;
  shares: number;
  comments: number;
  likes: number;
  audienceSize: number;
  contentType: string;
  hashtags: string[];
  timezone: string;
}

export interface AudienceInsights {
  platform: string;
  activeHours: Array<{
    hour: number;
    engagement: number;
    reach: number;
  }>;
  activeDays: Array<{
    day: string;
    engagement: number;
    reach: number;
  }>;
  timezone: string;
  peakTimes: string[];
  lowActivityTimes: string[];
  seasonalPatterns: Array<{
    month: string;
    engagement: number;
    recommendations: string[];
  }>;
}

export interface SchedulingStrategy {
  platform: string;
  strategy: 'aggressive' | 'moderate' | 'conservative';
  frequency: number; // posts per day
  timeSlots: OptimalTimeSlot[];
  contentMix: {
    educational: number;
    promotional: number;
    entertaining: number;
    behindScenes: number;
  };
  hashtagStrategy: {
    trending: number;
    niche: number;
    branded: number;
  };
}

export class SmartSchedulingAI {
  private performanceData: ContentPerformanceData[] = [];
  private audienceInsights: Map<string, AudienceInsights> = new Map();

  // Analyze historical performance data
  analyzePerformanceData(data: ContentPerformanceData[]): AudienceInsights {
    this.performanceData = data;
    
    const platformData = data.filter(d => d.platform === data[0]?.platform);
    const insights = this.calculateAudienceInsights(platformData);
    
    this.audienceInsights.set(data[0]?.platform || 'unknown', insights);
    return insights;
  }

  // Get optimal posting times
  getOptimalTimes(request: SchedulingRequest): SchedulingRecommendation {
    const platform = request.platform;
    const insights = this.audienceInsights.get(platform);
    
    if (!insights) {
      return this.getDefaultRecommendation(request);
    }

    const optimalSlots = this.calculateOptimalSlots(insights, request);
    const alternativeSlots = this.calculateAlternativeSlots(insights, request);
    
    const bestSlot = optimalSlots[0];
    const nextBestSlot = optimalSlots[1];

    return {
      platform,
      optimalSlots,
      alternativeSlots,
      bestDay: bestSlot?.day || 'Monday',
      bestTime: bestSlot?.time || '9:00 AM',
      reasoning: this.generateReasoning(insights, bestSlot),
      confidence: bestSlot?.confidence || 75,
      nextBestTime: nextBestSlot?.time
    };
  }

  // Generate content calendar
  generateContentCalendar(
    topics: string[],
    platforms: string[],
    duration: number,
    frequency: number
  ): Array<{
    date: string;
    platform: string;
    topic: string;
    timeSlot: OptimalTimeSlot;
    content: string;
    hashtags: string[];
  }> {
    const calendar: Array<any> = [];
    const startDate = new Date();
    
    for (let day = 0; day < duration; day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + day);
      
      for (let post = 0; post < frequency; post++) {
        const platform = platforms[post % platforms.length];
        const topic = topics[day % topics.length];
        
        const insights = this.audienceInsights.get(platform);
        const timeSlot = this.getBestTimeSlot(insights, platform, day);
        
        calendar.push({
          date: currentDate.toISOString().split('T')[0],
          platform,
          topic,
          timeSlot,
          content: `Content about ${topic}`,
          hashtags: this.generateHashtags(topic, platform)
        });
      }
    }
    
    return calendar;
  }

  // Get scheduling strategy
  getSchedulingStrategy(platform: string, audienceSize: number): SchedulingStrategy {
    const insights = this.audienceInsights.get(platform);
    
    let strategy: 'aggressive' | 'moderate' | 'conservative';
    let frequency: number;
    
    if (audienceSize > 100000) {
      strategy = 'aggressive';
      frequency = 3;
    } else if (audienceSize > 10000) {
      strategy = 'moderate';
      frequency = 2;
    } else {
      strategy = 'conservative';
      frequency = 1;
    }

    const timeSlots = this.calculateStrategyTimeSlots(insights, strategy);
    
    return {
      platform,
      strategy,
      frequency,
      timeSlots,
      contentMix: {
        educational: 40,
        promotional: 20,
        entertaining: 30,
        behindScenes: 10
      },
      hashtagStrategy: {
        trending: 30,
        niche: 50,
        branded: 20
      }
    };
  }

  // Predict content performance
  predictPerformance(
    content: string,
    platform: string,
    scheduledTime: string,
    audienceSize: number
  ): {
    expectedEngagement: number;
    expectedReach: number;
    confidence: number;
    factors: string[];
  } {
    const insights = this.audienceInsights.get(platform);
    const timeSlot = this.parseTimeSlot(scheduledTime);
    
    let baseEngagement = 0;
    let baseReach = 0;
    let confidence = 50;
    const factors: string[] = [];

    // Time-based factors
    if (insights) {
      const hourData = insights.activeHours.find(h => h.hour === timeSlot.hour);
      if (hourData) {
        baseEngagement = hourData.engagement;
        baseReach = hourData.reach;
        factors.push('optimal_time');
      }
    }

    // Content-based factors
    if (content.includes('?')) {
      baseEngagement += 10;
      factors.push('question_content');
    }
    
    if (content.includes('!')) {
      baseEngagement += 5;
      factors.push('excitement');
    }
    
    if (content.length > 100) {
      baseEngagement += 5;
      factors.push('detailed_content');
    }

    // Audience size factor
    const audienceFactor = Math.min(audienceSize / 10000, 2);
    baseEngagement *= audienceFactor;
    baseReach *= audienceFactor;

    // Confidence calculation
    if (insights) confidence += 20;
    if (factors.length > 2) confidence += 10;
    if (audienceSize > 1000) confidence += 10;

    return {
      expectedEngagement: Math.round(baseEngagement),
      expectedReach: Math.round(baseReach),
      confidence: Math.min(confidence, 95),
      factors
    };
  }

  // Private helper methods
  private calculateAudienceInsights(data: ContentPerformanceData[]): AudienceInsights {
    const platform = data[0]?.platform || 'unknown';
    
    // Calculate hourly engagement
    const hourlyData: Record<number, { engagement: number; reach: number; count: number }> = {};
    const dailyData: Record<string, { engagement: number; reach: number; count: number }> = {};
    
    data.forEach(item => {
      const date = new Date(item.publishedAt);
      const hour = date.getHours();
      const day = date.toLocaleDateString('en-US', { weekday: 'long' });
      
      if (!hourlyData[hour]) {
        hourlyData[hour] = { engagement: 0, reach: 0, count: 0 };
      }
      if (!dailyData[day]) {
        dailyData[day] = { engagement: 0, reach: 0, count: 0 };
      }
      
      hourlyData[hour].engagement += item.engagement;
      hourlyData[hour].reach += item.reach;
      hourlyData[hour].count++;
      
      dailyData[day].engagement += item.engagement;
      dailyData[day].reach += item.reach;
      dailyData[day].count++;
    });

    // Calculate averages
    const activeHours = Object.entries(hourlyData).map(([hour, data]) => ({
      hour: parseInt(hour),
      engagement: data.engagement / data.count,
      reach: data.reach / data.count
    })).sort((a, b) => b.engagement - a.engagement);

    const activeDays = Object.entries(dailyData).map(([day, data]) => ({
      day,
      engagement: data.engagement / data.count,
      reach: data.reach / data.count
    })).sort((a, b) => b.engagement - a.engagement);

    // Find peak times
    const peakTimes = activeHours.slice(0, 3).map(h => `${h.hour}:00`);
    const lowActivityTimes = activeHours.slice(-3).map(h => `${h.hour}:00`);

    return {
      platform,
      activeHours,
      activeDays,
      timezone: 'UTC',
      peakTimes,
      lowActivityTimes,
      seasonalPatterns: []
    };
  }

  private calculateOptimalSlots(insights: AudienceInsights, request: SchedulingRequest): OptimalTimeSlot[] {
    const slots: OptimalTimeSlot[] = [];
    
    insights.activeHours.slice(0, 5).forEach(hourData => {
      const time = `${hourData.hour.toString().padStart(2, '0')}:00`;
      const day = insights.activeDays[0]?.day || 'Monday';
      
      slots.push({
        time,
        day,
        confidence: Math.min(90, 60 + hourData.engagement),
        expectedEngagement: Math.round(hourData.engagement),
        factors: ['high_engagement', 'active_audience'],
        timezone: request.timezone
      });
    });
    
    return slots;
  }

  private calculateAlternativeSlots(insights: AudienceInsights, request: SchedulingRequest): OptimalTimeSlot[] {
    const slots: OptimalTimeSlot[] = [];
    
    insights.activeHours.slice(5, 10).forEach(hourData => {
      const time = `${hourData.hour.toString().padStart(2, '0')}:00`;
      const day = insights.activeDays[1]?.day || 'Tuesday';
      
      slots.push({
        time,
        day,
        confidence: Math.min(80, 50 + hourData.engagement),
        expectedEngagement: Math.round(hourData.engagement),
        factors: ['moderate_engagement', 'alternative_time'],
        timezone: request.timezone
      });
    });
    
    return slots;
  }

  private calculateStrategyTimeSlots(insights: AudienceInsights | undefined, strategy: string): OptimalTimeSlot[] {
    if (!insights) return [];
    
    const count = strategy === 'aggressive' ? 6 : strategy === 'moderate' ? 4 : 2;
    
    return insights.activeHours.slice(0, count).map(hourData => ({
      time: `${hourData.hour.toString().padStart(2, '0')}:00`,
      day: 'Monday',
      confidence: 75,
      expectedEngagement: Math.round(hourData.engagement),
      factors: ['strategy_based'],
      timezone: 'UTC'
    }));
  }

  private getBestTimeSlot(insights: AudienceInsights | undefined, platform: string, dayOffset: number): OptimalTimeSlot {
    if (!insights) {
      return {
        time: '9:00 AM',
        day: 'Monday',
        confidence: 50,
        expectedEngagement: 50,
        factors: ['default'],
        timezone: 'UTC'
      };
    }
    
    const hourData = insights.activeHours[dayOffset % insights.activeHours.length];
    const dayData = insights.activeDays[dayOffset % insights.activeDays.length];
    
    return {
      time: `${hourData.hour.toString().padStart(2, '0')}:00`,
      day: dayData.day,
      confidence: Math.min(90, 60 + hourData.engagement),
      expectedEngagement: Math.round(hourData.engagement),
      factors: ['ai_optimized'],
      timezone: 'UTC'
    };
  }

  private generateHashtags(topic: string, platform: string): string[] {
    const baseHashtags = ['#content', '#social', '#marketing'];
    const topicHashtags = topic.split(' ').map(word => `#${word.toLowerCase()}`);
    return [...baseHashtags, ...topicHashtags].slice(0, 5);
  }

  private generateReasoning(insights: AudienceInsights, slot: OptimalTimeSlot | undefined): string {
    if (!slot) return 'Based on general best practices';
    
    return `Your audience is most active at ${slot.time} on ${slot.day}. This time slot shows ${slot.expectedEngagement}% higher engagement than average.`;
  }

  private parseTimeSlot(timeString: string): { hour: number; minute: number } {
    const [time, period] = timeString.split(' ');
    const [hour, minute] = time.split(':').map(Number);
    
    if (period === 'PM' && hour !== 12) {
      return { hour: hour + 12, minute };
    } else if (period === 'AM' && hour === 12) {
      return { hour: 0, minute };
    }
    
    return { hour, minute };
  }

  private getDefaultRecommendation(request: SchedulingRequest): SchedulingRecommendation {
    const defaultSlots: OptimalTimeSlot[] = [
      {
        time: '9:00 AM',
        day: 'Monday',
        confidence: 60,
        expectedEngagement: 50,
        factors: ['default'],
        timezone: request.timezone
      },
      {
        time: '1:00 PM',
        day: 'Wednesday',
        confidence: 55,
        expectedEngagement: 45,
        factors: ['default'],
        timezone: request.timezone
      }
    ];

    return {
      platform: request.platform,
      optimalSlots: defaultSlots,
      alternativeSlots: [],
      bestDay: 'Monday',
      bestTime: '9:00 AM',
      reasoning: 'Based on general best practices for this platform',
      confidence: 60
    };
  }
}
