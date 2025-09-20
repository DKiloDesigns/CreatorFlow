import { NextRequest, NextResponse } from 'next/server';
import { 
  getEnterpriseDocById, 
  getEnterpriseDocsByCategory, 
  getEnterpriseDocsByAudience,
  getFeaturedEnterpriseDocs,
  searchEnterpriseDocs
} from '@/lib/enterprise-docs';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const category = searchParams.get('category');
    const audience = searchParams.get('audience');
    const featured = searchParams.get('featured') === 'true';
    const search = searchParams.get('search');

    // Get specific document by ID
    if (id) {
      const doc = getEnterpriseDocById(id);
      if (!doc) {
        return NextResponse.json({ error: 'Document not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, doc });
    }

    // Get featured documents
    if (featured) {
      const docs = getFeaturedEnterpriseDocs();
      return NextResponse.json({ success: true, docs });
    }

    // Search documents
    if (search) {
      const docs = searchEnterpriseDocs(search);
      return NextResponse.json({ success: true, docs });
    }

    // Get documents by category
    if (category) {
      const docs = getEnterpriseDocsByCategory(category);
      return NextResponse.json({ success: true, docs });
    }

    // Get documents by audience
    if (audience) {
      const docs = getEnterpriseDocsByAudience(audience);
      return NextResponse.json({ success: true, docs });
    }

    // Get all documents
    const docs = getFeaturedEnterpriseDocs();
    return NextResponse.json({ success: true, docs });

  } catch (error) {
    console.error('Enterprise docs API error:', error);
    return NextResponse.json({ error: 'Failed to fetch enterprise documents' }, { status: 500 });
  }
}
