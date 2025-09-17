/**
 * AI Content Generation API Endpoint
 * Handle AI-powered content generation requests
 */

import { NextRequest, NextResponse } from 'next/server';
import { AIContentGenerator } from '@/lib/ai/content-generation';

const aiGenerator = new AIContentGenerator(
  process.env.OPENAI_API_KEY || 'mock-key',
  process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
);

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();

    switch (action) {
      case 'generate_post':
        if (!data.topic || !data.platform || !data.tone) {
          return NextResponse.json({
            success: false,
            message: 'Missing required fields: topic, platform, tone'
          }, { status: 400 });
        }

        const post = await aiGenerator.generatePost(data);
        return NextResponse.json({
          success: true,
          data: post,
          message: 'Post generated successfully'
        });

      case 'generate_bulk_posts':
        if (!data.topic || !data.platform || !data.tone) {
          return NextResponse.json({
            success: false,
            message: 'Missing required fields: topic, platform, tone'
          }, { status: 400 });
        }

        const posts = await aiGenerator.generateBulkPosts(data);
        return NextResponse.json({
          success: true,
          data: posts,
          message: 'Bulk posts generated successfully'
        });

      case 'generate_ideas':
        if (!data.topic || !data.platform) {
          return NextResponse.json({
            success: false,
            message: 'Missing required fields: topic, platform'
          }, { status: 400 });
        }

        const ideas = await aiGenerator.generateContentIdeas(data);
        return NextResponse.json({
          success: true,
          data: ideas,
          message: 'Content ideas generated successfully'
        });

      case 'generate_hashtags':
        if (!data.topic || !data.platform) {
          return NextResponse.json({
            success: false,
            message: 'Missing required fields: topic, platform'
          }, { status: 400 });
        }

        const hashtags = await aiGenerator.generateHashtags(data);
        return NextResponse.json({
          success: true,
          data: hashtags,
          message: 'Hashtags generated successfully'
        });

      case 'optimize_content':
        if (!data.content || !data.platform) {
          return NextResponse.json({
            success: false,
            message: 'Missing required fields: content, platform'
          }, { status: 400 });
        }

        const optimization = await aiGenerator.optimizeContent(data.content, data.platform);
        return NextResponse.json({
          success: true,
          data: optimization,
          message: 'Content optimized successfully'
        });

      case 'analyze_performance':
        if (!data.content || !data.platform) {
          return NextResponse.json({
            success: false,
            message: 'Missing required fields: content, platform'
          }, { status: 400 });
        }

        const analysis = await aiGenerator.analyzeContentPerformance(data.content, data.platform);
        return NextResponse.json({
          success: true,
          data: analysis,
          message: 'Content analyzed successfully'
        });

      case 'generate_calendar':
        if (!data.topics || !data.platforms || !data.duration || !data.frequency) {
          return NextResponse.json({
            success: false,
            message: 'Missing required fields: topics, platforms, duration, frequency'
          }, { status: 400 });
        }

        const calendar = await aiGenerator.generateContentCalendar(
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

      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid action'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('AI content generation error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Content generation failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
