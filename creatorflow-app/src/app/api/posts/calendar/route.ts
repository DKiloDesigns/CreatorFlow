import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient, PostStatus } from '@prisma/client';
import { getSession } from "@/auth";
import { requireApiKey } from '@/lib/apiKeyAuth';
import { withAPIErrorHandling, APIErrors, createErrorResponse, handleDatabaseError } from '@/lib/api-error-handler';
import { validatePostQuery, USER_FIELD } from '@/lib/database-validation';

const prisma = new PrismaClient();

export const GET = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Check for API key first
    const apiKeyHeader = req.headers.get('x-api-key');
    if (apiKeyHeader) {
        const auth = await requireApiKey(req);
        if ('user' in auth) {
            const userId = auth.user.id;
            return await fetchCalendarPosts(userId, startDate, endDate);
        } else {
            return auth; // Error response from requireApiKey
        }
    }
    
    // Fallback to session auth
    const session = await getSession(req);
    console.log('Calendar API - Session:', session);
    const userId = session?.user?.id;
    console.log('Calendar API - UserId:', userId);

    if (!userId) {
        return NextResponse.json({ error: 'User not logged in' }, { status: 401 });
    }

    try {
        return await fetchCalendarPosts(userId, startDate, endDate);
    } catch (error) {
        console.error('Calendar API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};

async function fetchCalendarPosts(userId: string, startDate: string | null, endDate: string | null) {
    try {
        // Default to current week if no dates provided
        const now = new Date();
        const start = startDate ? new Date(startDate) : new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        const end = endDate ? new Date(endDate) : new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);

        // Validate date range
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw APIErrors.VALIDATION_ERROR('Invalid date format');
        }

        if (start > end) {
            throw APIErrors.VALIDATION_ERROR('Start date must be before end date');
        }

        const posts = await prisma.post.findMany({
            where: {
                userId: userId,
                OR: [
                    { scheduledAt: { gte: start, lte: end } },
                    { createdAt: { gte: start, lte: end } },
                    { publishedAt: { gte: start, lte: end } }
                ]
            },
            select: {
                id: true,
                contentText: true,
                mediaUrls: true,
                platforms: true,
                status: true,
                scheduledAt: true,
                publishedAt: true,
                createdAt: true,
                hashtags: true,
                views: true,
                likes: true,
                comments: true,
                shares: true
            },
            orderBy: {
                scheduledAt: 'asc'
            }
        });

        // Group posts by date for calendar display
        const postsByDate = posts.reduce((acc, post) => {
            const dateKey = post.scheduledAt ? 
                post.scheduledAt.toISOString().split('T')[0] : 
                post.createdAt.toISOString().split('T')[0];
            
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(post);
            return acc;
        }, {} as Record<string, typeof posts>);

        return NextResponse.json({
            posts: postsByDate,
            totalPosts: posts.length,
            dateRange: { start: start.toISOString(), end: end.toISOString() }
        });
    } catch (error) {
        if (error instanceof Error && error.message.includes('Prisma')) {
            handleDatabaseError(error);
        }
        throw error;
    }
}
