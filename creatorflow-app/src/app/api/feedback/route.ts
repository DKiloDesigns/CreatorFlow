import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { category, rating, feedback, feature, source } = await req.json();

    if (!category || !rating || !feedback) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create feedback record
    const feedbackRecord = await prisma.feedback.create({
      data: {
        userId: session.user.id,
        category,
        rating: parseInt(rating),
        feedback,
        feature: feature || null,
        source: source || 'web',
        metadata: {
          isTrialUser: session.user.isTrialUser || false,
          promoCodeUsed: session.user.promoCodeUsed || null,
          plan: session.user.plan || 'BASIC',
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Feedback submitted successfully',
      id: feedbackRecord.id,
    });

  } catch (error) {
    console.error('Feedback submission error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin or marketing director
    const user = await prisma.user.findUnique({ 
      where: { id: session.user.id }, 
      select: { role: true, email: true } 
    });
    
    if (!user || (user.role !== 'ADMIN' && user.email !== 'renee@creatorflow.com')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const source = searchParams.get('source');
    const isTrialUser = searchParams.get('isTrialUser');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build where clause
    const where: any = {};
    if (category) where.category = category;
    if (source) where.source = source;
    if (isTrialUser) {
      where.metadata = {
        path: ['isTrialUser'],
        equals: isTrialUser === 'true',
      };
    }

    // Get feedback with user info
    const feedback = await prisma.feedback.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            isTrialUser: true,
            promoCodeUsed: true,
            plan: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    // Get analytics
    const analytics = await prisma.feedback.groupBy({
      by: ['category', 'rating'],
      _count: { rating: true },
      where,
    });

    // Calculate average ratings by category
    const avgRatings = await prisma.feedback.groupBy({
      by: ['category'],
      _avg: { rating: true },
      _count: { rating: true },
      where,
    });

    return NextResponse.json({
      feedback,
      analytics: {
        byRating: analytics,
        avgRatings,
        total: feedback.length,
      },
    });

  } catch (error) {
    console.error('Feedback retrieval error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 