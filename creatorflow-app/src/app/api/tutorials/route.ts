import { NextRequest, NextResponse } from 'next/server';
import { 
  getTutorialById, 
  getTutorialsByCategory, 
  getFeaturedTutorials, 
  getTutorialsByDifficulty,
  searchTutorials 
} from '@/lib/tutorials';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const featured = searchParams.get('featured') === 'true';
    const search = searchParams.get('search');

    // Get specific tutorial by ID
    if (id) {
      const tutorial = getTutorialById(id);
      if (!tutorial) {
        return NextResponse.json({ error: 'Tutorial not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, tutorial });
    }

    // Get featured tutorials
    if (featured) {
      const tutorials = getFeaturedTutorials();
      return NextResponse.json({ success: true, tutorials });
    }

    // Search tutorials
    if (search) {
      const tutorials = searchTutorials(search);
      return NextResponse.json({ success: true, tutorials });
    }

    // Get tutorials by category
    if (category) {
      const tutorials = getTutorialsByCategory(category);
      return NextResponse.json({ success: true, tutorials });
    }

    // Get tutorials by difficulty
    if (difficulty) {
      const tutorials = getTutorialsByDifficulty(difficulty);
      return NextResponse.json({ success: true, tutorials });
    }

    // Get all tutorials
    const tutorials = getFeaturedTutorials();
    return NextResponse.json({ success: true, tutorials });

  } catch (error) {
    console.error('Tutorial API error:', error);
    return NextResponse.json({ error: 'Failed to fetch tutorials' }, { status: 500 });
  }
}
