import { NextRequest, NextResponse } from 'next/server';
import { searchArticles, getArticlesByCategory, getFeaturedArticles, getArticleById } from '@/lib/help-articles';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const featured = searchParams.get('featured') === 'true';
    const id = searchParams.get('id');

    // Get specific article by ID
    if (id) {
      const article = getArticleById(id);
      if (!article) {
        return NextResponse.json({ error: 'Article not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, article });
    }

    // Get featured articles
    if (featured) {
      const articles = getFeaturedArticles();
      return NextResponse.json({ success: true, articles });
    }

    // Get articles by category
    if (category && !query) {
      const articles = getArticlesByCategory(category);
      return NextResponse.json({ success: true, articles });
    }

    // Search articles
    const articles = searchArticles(query, category || undefined);

    return NextResponse.json({ 
      success: true, 
      articles,
      total: articles.length,
      query: query || null,
      category: category || null
    });

  } catch (error) {
    console.error('Help search error:', error);
    return NextResponse.json({ error: 'Failed to search articles' }, { status: 500 });
  }
}
