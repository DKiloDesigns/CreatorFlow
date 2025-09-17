/**
 * Video Editor API Endpoint
 * Handle video editing and optimization requests
 */

import { NextRequest, NextResponse } from 'next/server';
import { VideoEditor } from '@/lib/video/video-editor';

const videoEditor = new VideoEditor();

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();

    switch (action) {
      case 'process_video':
        if (!data.videoUrl || !data.platform || !data.duration || !data.aspectRatio || !data.quality) {
          return NextResponse.json({
            success: false,
            message: 'Missing required fields: videoUrl, platform, duration, aspectRatio, quality'
          }, { status: 400 });
        }

        const processedVideo = await videoEditor.processVideo(data);
        return NextResponse.json({
          success: true,
          data: processedVideo,
          message: 'Video processed successfully'
        });

      case 'trim_video':
        if (!data.videoUrl || !data.startTime || !data.endTime || !data.platform) {
          return NextResponse.json({
            success: false,
            message: 'Missing required fields: videoUrl, startTime, endTime, platform'
          }, { status: 400 });
        }

        const trimmedVideo = await videoEditor.trimVideo(
          data.videoUrl,
          data.startTime,
          data.endTime,
          data.platform
        );
        return NextResponse.json({
          success: true,
          data: trimmedVideo,
          message: 'Video trimmed successfully'
        });

      case 'add_text_overlay':
        if (!data.videoUrl || !data.textOverlay || !data.platform) {
          return NextResponse.json({
            success: false,
            message: 'Missing required fields: videoUrl, textOverlay, platform'
          }, { status: 400 });
        }

        const videoWithText = await videoEditor.addTextOverlay(
          data.videoUrl,
          data.textOverlay,
          data.platform
        );
        return NextResponse.json({
          success: true,
          data: videoWithText,
          message: 'Text overlay added successfully'
        });

      case 'apply_filters':
        if (!data.videoUrl || !data.filters || !data.platform) {
          return NextResponse.json({
            success: false,
            message: 'Missing required fields: videoUrl, filters, platform'
          }, { status: 400 });
        }

        const filteredVideo = await videoEditor.applyFilters(
          data.videoUrl,
          data.filters,
          data.platform
        );
        return NextResponse.json({
          success: true,
          data: filteredVideo,
          message: 'Filters applied successfully'
        });

      case 'add_music':
        if (!data.videoUrl || !data.music || !data.platform) {
          return NextResponse.json({
            success: false,
            message: 'Missing required fields: videoUrl, music, platform'
          }, { status: 400 });
        }

        const videoWithMusic = await videoEditor.addMusic(
          data.videoUrl,
          data.music,
          data.platform
        );
        return NextResponse.json({
          success: true,
          data: videoWithMusic,
          message: 'Music added successfully'
        });

      case 'optimize_for_platform':
        if (!data.videoUrl || !data.platform) {
          return NextResponse.json({
            success: false,
            message: 'Missing required fields: videoUrl, platform'
          }, { status: 400 });
        }

        const optimizedVideo = await videoEditor.optimizeForPlatform(
          data.videoUrl,
          data.platform,
          data.quality
        );
        return NextResponse.json({
          success: true,
          data: optimizedVideo,
          message: 'Video optimized successfully'
        });

      case 'get_templates':
        const templates = await videoEditor.getVideoTemplates(data.platform, data.category);
        return NextResponse.json({
          success: true,
          data: templates,
          message: 'Video templates retrieved successfully'
        });

      case 'get_optimization':
        if (!data.platform) {
          return NextResponse.json({
            success: false,
            message: 'Missing required field: platform'
          }, { status: 400 });
        }

        const optimization = videoEditor.getPlatformOptimization(data.platform);
        return NextResponse.json({
          success: true,
          data: optimization,
          message: 'Platform optimization settings retrieved successfully'
        });

      case 'get_processing_status':
        if (!data.videoId) {
          return NextResponse.json({
            success: false,
            message: 'Missing required field: videoId'
          }, { status: 400 });
        }

        const status = videoEditor.getProcessingStatus(data.videoId);
        return NextResponse.json({
          success: true,
          data: { status },
          message: 'Processing status retrieved successfully'
        });

      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid action'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Video editor error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Video processing failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
