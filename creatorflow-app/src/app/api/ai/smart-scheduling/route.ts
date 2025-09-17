/**
 * Smart Scheduling AI API Endpoint
 * Handle AI-powered scheduling and time optimization
 */

import { NextRequest, NextResponse } from 'next/server';
import { SmartSchedulingAI } from '@/lib/ai/smart-scheduling';

const schedulingAI = new SmartSchedulingAI();

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();

    switch (action) {
      case 'analyze_performance':
        if (!data.performanceData || !Array.isArray(data.performanceData)) {
          return NextResponse.json({
            success: false,
            message: 'Missing or invalid performance data'
          }, { status: 400 });
        }

        const insights = schedulingAI.analyzePerformanceData(data.performanceData);
        return NextResponse.json({
          success: true,
          data: insights,
          message: 'Performance data analyzed successfully'
        });

      case 'get_optimal_times':
        if (!data.platform || !data.timezone) {
          return NextResponse.json({
            success: false,
            message: 'Missing required fields: platform, timezone'
          }, { status: 400 });
        }

        const recommendation = schedulingAI.getOptimalTimes(data);
        return NextResponse.json({
          success: true,
          data: recommendation,
          message: 'Optimal times calculated successfully'
        });

      case 'generate_calendar':
        if (!data.topics || !data.platforms || !data.duration || !data.frequency) {
          return NextResponse.json({
            success: false,
            message: 'Missing required fields: topics, platforms, duration, frequency'
          }, { status: 400 });
        }

        const calendar = schedulingAI.generateContentCalendar(
          data.topics,
          data.platforms,
          data.duration,
          data.frequency
        );
        return NextResponse.json({
          success: true,
          data: calendar,
          message: 'Content calendar generated successfully'
        });

      case 'get_strategy':
        if (!data.platform || !data.audienceSize) {
          return NextResponse.json({
            success: false,
            message: 'Missing required fields: platform, audienceSize'
          }, { status: 400 });
        }

        const strategy = schedulingAI.getSchedulingStrategy(data.platform, data.audienceSize);
        return NextResponse.json({
          success: true,
          data: strategy,
          message: 'Scheduling strategy generated successfully'
        });

      case 'predict_performance':
        if (!data.content || !data.platform || !data.scheduledTime || !data.audienceSize) {
          return NextResponse.json({
            success: false,
            message: 'Missing required fields: content, platform, scheduledTime, audienceSize'
          }, { status: 400 });
        }

        const prediction = schedulingAI.predictPerformance(
          data.content,
          data.platform,
          data.scheduledTime,
          data.audienceSize
        );
        return NextResponse.json({
          success: true,
          data: prediction,
          message: 'Performance predicted successfully'
        });

      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid action'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Smart scheduling AI error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Scheduling analysis failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
