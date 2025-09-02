import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient, PostStatus } from '@prisma/client';
import { getSession } from "@/auth";
import { requireApiKey } from '@/lib/apiKeyAuth';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
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
    try {
        const session = await getSession(req);
        const userId = session?.user?.id;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized: User not logged in' }, { status: 401 });
        }

        return await fetchCalendarPosts(userId, startDate, endDate);
    } catch (error) {
        console.error('Calendar API error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

async function fetchCalendarPosts(userId: string, startDate: string | null, endDate: string | null) {
    try {
        // Default to current week if no dates provided
        const now = new Date();
        const start = startDate ? new Date(startDate) : new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        const end = endDate ? new Date(endDate) : new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);

        const posts = await prisma.post.findMany({
            where: {
                userId,
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
        console.error('Error fetching calendar posts:', error);
        return NextResponse.json({ error: 'Failed to fetch calendar posts' }, { status: 500 });
    }
}
