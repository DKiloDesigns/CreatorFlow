import { NextRequest, NextResponse } from 'next/server';
import { 
  getVideoById, 
  getVideosByCategory, 
  getFeaturedVideos, 
  getVideosByDifficulty,
  searchVideos,
  getRelatedVideos
} from '@/lib/video-library';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const featured = searchParams.get('featured') === 'true';
    const search = searchParams.get('search');
    const related = searchParams.get('related');
    const limit = searchParams.get('limit');

    // Get specific video by ID
    if (id) {
      const video = getVideoById(id);
      if (!video) {
        return NextResponse.json({ error: 'Video not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, video });
    }

    // Get related videos
    if (related) {
      const videos = getRelatedVideos(related, limit ? parseInt(limit) : 3);
      return NextResponse.json({ success: true, videos });
    }

    // Get featured videos
    if (featured) {
      const videos = getFeaturedVideos();
      return NextResponse.json({ success: true, videos });
    }

    // Search videos
    if (search) {
      const videos = searchVideos(search);
      return NextResponse.json({ success: true, videos });
    }

    // Get videos by category
    if (category) {
      const videos = getVideosByCategory(category);
      return NextResponse.json({ success: true, videos });
    }

    // Get videos by difficulty
    if (difficulty) {
      const videos = getVideosByDifficulty(difficulty);
      return NextResponse.json({ success: true, videos });
    }

    // Get all videos
    const videos = getFeaturedVideos();
    return NextResponse.json({ success: true, videos });

  } catch (error) {
    console.error('Video API error:', error);
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
  }
}
