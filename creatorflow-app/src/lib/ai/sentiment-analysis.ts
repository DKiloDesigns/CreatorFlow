/**
 * Sentiment Analysis AI
 * Real-time audience sentiment monitoring and content optimization
 */

export interface SentimentData {
  content: string;
  platform: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number; // 0-100
  emotions: Emotion[];
  keywords: Keyword[];
  recommendations: string[];
  timestamp: string;
}

export interface Emotion {
  name: string;
  intensity: number; // 0-100
  description: string;
}

export interface Keyword {
  word: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  importance: number; // 0-100
  context: string;
}

export interface AudienceSentiment {
  platform: string;
  overallSentiment: 'positive' | 'negative' | 'neutral';
  sentimentScore: number; // -100 to 100
  trend: 'improving' | 'declining' | 'stable';
  topEmotions: Emotion[];
  topKeywords: Keyword[];
  recommendations: string[];
  lastUpdated: string;
}

export interface SentimentAlert {
  id: string;
  type: 'negative_spike' | 'positive_spike' | 'sentiment_change' | 'crisis_detected';
  severity: 'low' | 'medium' | 'high' | 'critical';
  platform: string;
  content: string;
  sentiment: SentimentData;
  action: string;
  createdAt: string;
  acknowledged: boolean;
}

export interface SentimentTrend {
  date: string;
  sentimentScore: number;
  positiveCount: number;
  negativeCount: number;
  neutralCount: number;
  totalCount: number;
}

export class SentimentAnalysisAI {
  private sentimentHistory: SentimentData[] = [];
  private alerts: SentimentAlert[] = [];
  private trends: SentimentTrend[] = [];

  // Analyze content sentiment
  async analyzeContent(content: string, platform: string): Promise<SentimentData> {
    const sentiment = await this.performSentimentAnalysis(content);
    const emotions = this.extractEmotions(content);
    const keywords = this.extractKeywords(content);
    const recommendations = this.generateRecommendations(sentiment, emotions, keywords);

    const sentimentData: SentimentData = {
      content,
      platform,
      sentiment: sentiment.sentiment,
      confidence: sentiment.confidence,
      emotions,
      keywords,
      recommendations,
      timestamp: new Date().toISOString()
    };

    this.sentimentHistory.push(sentimentData);
    this.updateTrends(sentimentData);
    this.checkForAlerts(sentimentData);

    return sentimentData;
  }

  // Analyze audience sentiment over time
  analyzeAudienceSentiment(platform: string, timeRange: number = 7): AudienceSentiment {
    const platformData = this.sentimentHistory.filter(
      d => d.platform === platform && 
      new Date(d.timestamp) > new Date(Date.now() - timeRange * 24 * 60 * 60 * 1000)
    );

    if (platformData.length === 0) {
      return this.getDefaultSentiment(platform);
    }

    const sentimentScore = this.calculateOverallSentiment(platformData);
    const trend = this.calculateTrend(platformData);
    const topEmotions = this.getTopEmotions(platformData);
    const topKeywords = this.getTopKeywords(platformData);
    const recommendations = this.generateAudienceRecommendations(sentimentScore, trend, topEmotions);

    return {
      platform,
      overallSentiment: this.getSentimentCategory(sentimentScore),
      sentimentScore,
      trend,
      topEmotions,
      topKeywords,
      recommendations,
      lastUpdated: new Date().toISOString()
    };
  }

  // Get sentiment trends
  getSentimentTrends(platform: string, days: number = 30): SentimentTrend[] {
    return this.trends.filter(trend => {
      const trendDate = new Date(trend.date);
      const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      return trendDate >= cutoffDate;
    });
  }

  // Get active alerts
  getActiveAlerts(platform?: string): SentimentAlert[] {
    let alerts = this.alerts.filter(alert => !alert.acknowledged);
    
    if (platform) {
      alerts = alerts.filter(alert => alert.platform === platform);
    }
    
    return alerts.sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  }

  // Acknowledge alert
  acknowledgeAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      return true;
    }
    return false;
  }

  // Get sentiment insights
  getSentimentInsights(platform: string): {
    currentSentiment: string;
    trend: string;
    keyInsights: string[];
    recommendations: string[];
    riskLevel: 'low' | 'medium' | 'high';
  } {
    const audienceSentiment = this.analyzeAudienceSentiment(platform);
    const trends = this.getSentimentTrends(platform, 7);
    
    const keyInsights: string[] = [];
    const recommendations: string[] = [];

    // Analyze sentiment score
    if (audienceSentiment.sentimentScore > 50) {
      keyInsights.push('Your audience sentiment is very positive');
      recommendations.push('Continue current content strategy');
    } else if (audienceSentiment.sentimentScore < -50) {
      keyInsights.push('Your audience sentiment is very negative');
      recommendations.push('Review recent content and adjust strategy');
    } else {
      keyInsights.push('Your audience sentiment is neutral');
      recommendations.push('Focus on creating more engaging content');
    }

    // Analyze trend
    if (audienceSentiment.trend === 'improving') {
      keyInsights.push('Sentiment is improving over time');
      recommendations.push('Maintain current positive momentum');
    } else if (audienceSentiment.trend === 'declining') {
      keyInsights.push('Sentiment is declining');
      recommendations.push('Investigate recent content and audience feedback');
    }

    // Analyze emotions
    const topEmotion = audienceSentiment.topEmotions[0];
    if (topEmotion) {
      keyInsights.push(`Top emotion: ${topEmotion.name} (${topEmotion.intensity}% intensity)`);
    }

    // Calculate risk level
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (audienceSentiment.sentimentScore < -30) riskLevel = 'high';
    else if (audienceSentiment.sentimentScore < 0) riskLevel = 'medium';

    return {
      currentSentiment: audienceSentiment.overallSentiment,
      trend: audienceSentiment.trend,
      keyInsights,
      recommendations,
      riskLevel
    };
  }

  // Private helper methods
  private async performSentimentAnalysis(content: string): Promise<{ sentiment: 'positive' | 'negative' | 'neutral'; confidence: number }> {
    // Mock sentiment analysis - in production, this would call an AI service
    const positiveWords = ['great', 'amazing', 'love', 'excellent', 'fantastic', 'wonderful', 'awesome', 'perfect'];
    const negativeWords = ['bad', 'terrible', 'hate', 'awful', 'horrible', 'disappointing', 'worst', 'sucks'];
    
    const words = content.toLowerCase().split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;
    
    words.forEach(word => {
      if (positiveWords.includes(word)) positiveCount++;
      if (negativeWords.includes(word)) negativeCount++;
    });
    
    const totalWords = words.length;
    const positiveRatio = positiveCount / totalWords;
    const negativeRatio = negativeCount / totalWords;
    
    let sentiment: 'positive' | 'negative' | 'neutral';
    let confidence: number;
    
    if (positiveRatio > negativeRatio && positiveRatio > 0.1) {
      sentiment = 'positive';
      confidence = Math.min(95, 60 + positiveRatio * 100);
    } else if (negativeRatio > positiveRatio && negativeRatio > 0.1) {
      sentiment = 'negative';
      confidence = Math.min(95, 60 + negativeRatio * 100);
    } else {
      sentiment = 'neutral';
      confidence = 70;
    }
    
    return { sentiment, confidence };
  }

  private extractEmotions(content: string): Emotion[] {
    // Mock emotion extraction - in production, this would use NLP
    const emotions: Emotion[] = [];
    
    const emotionKeywords: Record<string, string[]> = {
      'joy': ['happy', 'excited', 'thrilled', 'delighted', 'cheerful'],
      'anger': ['angry', 'furious', 'mad', 'irritated', 'frustrated'],
      'sadness': ['sad', 'depressed', 'disappointed', 'gloomy', 'melancholy'],
      'fear': ['scared', 'afraid', 'worried', 'anxious', 'nervous'],
      'surprise': ['surprised', 'shocked', 'amazed', 'astonished', 'stunned'],
      'disgust': ['disgusted', 'revolted', 'sickened', 'repulsed', 'appalled']
    };
    
    const words = content.toLowerCase().split(/\s+/);
    
    Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
      const matches = keywords.filter(keyword => words.includes(keyword));
      if (matches.length > 0) {
        emotions.push({
          name: emotion,
          intensity: Math.min(100, matches.length * 20),
          description: `Detected ${emotion} based on keywords: ${matches.join(', ')}`
        });
      }
    });
    
    return emotions.sort((a, b) => b.intensity - a.intensity);
  }

  private extractKeywords(content: string): Keyword[] {
    // Mock keyword extraction - in production, this would use NLP
    const words = content.toLowerCase().split(/\s+/);
    const wordCount: Record<string, number> = {};
    
    words.forEach(word => {
      if (word.length > 3) { // Filter out short words
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    });
    
    return Object.entries(wordCount)
      .map(([word, count]) => ({
        word,
        sentiment: 'neutral' as const,
        importance: Math.min(100, count * 10),
        context: `Appears ${count} times in content`
      }))
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 10);
  }

  private generateRecommendations(
    sentiment: { sentiment: string; confidence: number },
    emotions: Emotion[],
    keywords: Keyword[]
  ): string[] {
    const recommendations: string[] = [];
    
    if (sentiment.sentiment === 'negative') {
      recommendations.push('Consider addressing negative sentiment in future content');
      recommendations.push('Focus on positive messaging and solutions');
    } else if (sentiment.sentiment === 'positive') {
      recommendations.push('Continue with positive messaging');
      recommendations.push('Leverage positive sentiment for engagement');
    }
    
    const topEmotion = emotions[0];
    if (topEmotion && topEmotion.intensity > 70) {
      recommendations.push(`High ${topEmotion.name} intensity detected - consider tone adjustment`);
    }
    
    if (keywords.length > 5) {
      recommendations.push('Content has many keywords - consider simplifying for clarity');
    }
    
    return recommendations;
  }

  private generateAudienceRecommendations(
    sentimentScore: number,
    trend: string,
    emotions: Emotion[]
  ): string[] {
    const recommendations: string[] = [];
    
    if (sentimentScore < -30) {
      recommendations.push('Audience sentiment is very negative - review recent content strategy');
      recommendations.push('Consider addressing concerns directly');
    } else if (sentimentScore > 30) {
      recommendations.push('Audience sentiment is very positive - maintain current strategy');
      recommendations.push('Leverage positive sentiment for increased engagement');
    }
    
    if (trend === 'declining') {
      recommendations.push('Sentiment is declining - investigate recent changes');
      recommendations.push('Consider audience feedback and adjust content approach');
    }
    
    const negativeEmotions = emotions.filter(e => ['anger', 'sadness', 'fear', 'disgust'].includes(e.name));
    if (negativeEmotions.length > 0) {
      recommendations.push('Negative emotions detected - focus on positive messaging');
    }
    
    return recommendations;
  }

  private calculateOverallSentiment(data: SentimentData[]): number {
    if (data.length === 0) return 0;
    
    const sentimentScores = data.map(d => {
      switch (d.sentiment) {
        case 'positive': return 1;
        case 'negative': return -1;
        default: return 0;
      }
    });
    
    const average = sentimentScores.reduce((sum, score) => sum + score, 0) / sentimentScores.length;
    return Math.round(average * 100);
  }

  private calculateTrend(data: SentimentData[]): 'improving' | 'declining' | 'stable' {
    if (data.length < 2) return 'stable';
    
    const recent = data.slice(-Math.floor(data.length / 2));
    const older = data.slice(0, Math.floor(data.length / 2));
    
    const recentScore = this.calculateOverallSentiment(recent);
    const olderScore = this.calculateOverallSentiment(older);
    
    const difference = recentScore - olderScore;
    
    if (difference > 10) return 'improving';
    if (difference < -10) return 'declining';
    return 'stable';
  }

  private getTopEmotions(data: SentimentData[]): Emotion[] {
    const emotionCount: Record<string, { count: number; totalIntensity: number }> = {};
    
    data.forEach(d => {
      d.emotions.forEach(emotion => {
        if (!emotionCount[emotion.name]) {
          emotionCount[emotion.name] = { count: 0, totalIntensity: 0 };
        }
        emotionCount[emotion.name].count++;
        emotionCount[emotion.name].totalIntensity += emotion.intensity;
      });
    });
    
    return Object.entries(emotionCount)
      .map(([name, data]) => ({
        name,
        intensity: Math.round(data.totalIntensity / data.count),
        description: `Average intensity: ${Math.round(data.totalIntensity / data.count)}%`
      }))
      .sort((a, b) => b.intensity - a.intensity)
      .slice(0, 5);
  }

  private getTopKeywords(data: SentimentData[]): Keyword[] {
    const keywordCount: Record<string, { count: number; totalImportance: number }> = {};
    
    data.forEach(d => {
      d.keywords.forEach(keyword => {
        if (!keywordCount[keyword.word]) {
          keywordCount[keyword.word] = { count: 0, totalImportance: 0 };
        }
        keywordCount[keyword.word].count++;
        keywordCount[keyword.word].totalImportance += keyword.importance;
      });
    });
    
    return Object.entries(keywordCount)
      .map(([word, data]) => ({
        word,
        sentiment: 'neutral' as const,
        importance: Math.round(data.totalImportance / data.count),
        context: `Appears in ${data.count} content pieces`
      }))
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 10);
  }

  private getSentimentCategory(score: number): 'positive' | 'negative' | 'neutral' {
    if (score > 20) return 'positive';
    if (score < -20) return 'negative';
    return 'neutral';
  }

  private updateTrends(sentimentData: SentimentData): void {
    const date = sentimentData.timestamp.split('T')[0];
    let trend = this.trends.find(t => t.date === date);
    
    if (!trend) {
      trend = {
        date,
        sentimentScore: 0,
        positiveCount: 0,
        negativeCount: 0,
        neutralCount: 0,
        totalCount: 0
      };
      this.trends.push(trend);
    }
    
    trend.totalCount++;
    if (sentimentData.sentiment === 'positive') trend.positiveCount++;
    else if (sentimentData.sentiment === 'negative') trend.negativeCount++;
    else trend.neutralCount++;
    
    trend.sentimentScore = this.calculateOverallSentiment(
      this.sentimentHistory.filter(d => d.timestamp.startsWith(date))
    );
  }

  private checkForAlerts(sentimentData: SentimentData): void {
    // Check for negative sentiment spike
    if (sentimentData.sentiment === 'negative' && sentimentData.confidence > 80) {
      this.createAlert({
        type: 'negative_spike',
        severity: 'high',
        platform: sentimentData.platform,
        content: sentimentData.content,
        sentiment: sentimentData,
        action: 'Review content and consider response strategy'
      });
    }
    
    // Check for crisis detection
    const crisisKeywords = ['crisis', 'scandal', 'controversy', 'backlash', 'outrage'];
    const hasCrisisKeywords = crisisKeywords.some(keyword => 
      sentimentData.content.toLowerCase().includes(keyword)
    );
    
    if (hasCrisisKeywords && sentimentData.sentiment === 'negative') {
      this.createAlert({
        type: 'crisis_detected',
        severity: 'critical',
        platform: sentimentData.platform,
        content: sentimentData.content,
        sentiment: sentimentData,
        action: 'Immediate crisis management required'
      });
    }
  }

  private createAlert(alertData: Omit<SentimentAlert, 'id' | 'createdAt' | 'acknowledged'>): void {
    const alert: SentimentAlert = {
      ...alertData,
      id: `alert_${Date.now()}`,
      createdAt: new Date().toISOString(),
      acknowledged: false
    };
    
    this.alerts.push(alert);
  }

  private getDefaultSentiment(platform: string): AudienceSentiment {
    return {
      platform,
      overallSentiment: 'neutral',
      sentimentScore: 0,
      trend: 'stable',
      topEmotions: [],
      topKeywords: [],
      recommendations: ['Insufficient data for sentiment analysis'],
      lastUpdated: new Date().toISOString()
    };
  }
}
