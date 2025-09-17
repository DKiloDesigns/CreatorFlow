/**
 * Sentiment Analysis AI API Endpoint
 * Handle AI-powered sentiment analysis and monitoring
 */

import { NextRequest, NextResponse } from 'next/server';
import { SentimentAnalysisAI } from '@/lib/ai/sentiment-analysis';

const sentimentAI = new SentimentAnalysisAI();

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();

    switch (action) {
      case 'analyze_content':
        if (!data.content || !data.platform) {
          return NextResponse.json({
            success: false,
            message: 'Missing required fields: content, platform'
          }, { status: 400 });
        }

        const sentimentData = await sentimentAI.analyzeContent(data.content, data.platform);
        return NextResponse.json({
          success: true,
          data: sentimentData,
          message: 'Content sentiment analyzed successfully'
        });

      case 'analyze_audience':
        if (!data.platform) {
          return NextResponse.json({
            success: false,
            message: 'Missing required field: platform'
          }, { status: 400 });
        }

        const audienceSentiment = sentimentAI.analyzeAudienceSentiment(
          data.platform,
          data.timeRange || 7
        );
        return NextResponse.json({
          success: true,
          data: audienceSentiment,
          message: 'Audience sentiment analyzed successfully'
        });

      case 'get_trends':
        if (!data.platform) {
          return NextResponse.json({
            success: false,
            message: 'Missing required field: platform'
          }, { status: 400 });
        }

        const trends = sentimentAI.getSentimentTrends(data.platform, data.days || 30);
        return NextResponse.json({
          success: true,
          data: trends,
          message: 'Sentiment trends retrieved successfully'
        });

      case 'get_alerts':
        const alerts = sentimentAI.getActiveAlerts(data.platform);
        return NextResponse.json({
          success: true,
          data: alerts,
          message: 'Active alerts retrieved successfully'
        });

      case 'acknowledge_alert':
        if (!data.alertId) {
          return NextResponse.json({
            success: false,
            message: 'Missing required field: alertId'
          }, { status: 400 });
        }

        const acknowledged = sentimentAI.acknowledgeAlert(data.alertId);
        return NextResponse.json({
          success: acknowledged,
          message: acknowledged ? 'Alert acknowledged successfully' : 'Alert not found'
        });

      case 'get_insights':
        if (!data.platform) {
          return NextResponse.json({
            success: false,
            message: 'Missing required field: platform'
          }, { status: 400 });
        }

        const insights = sentimentAI.getSentimentInsights(data.platform);
        return NextResponse.json({
          success: true,
          data: insights,
          message: 'Sentiment insights retrieved successfully'
        });

      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid action'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Sentiment analysis AI error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Sentiment analysis failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
