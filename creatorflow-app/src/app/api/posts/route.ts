import { NextResponse, NextRequest } from 'next/server';
// Corrected import path based on generator output and tsconfig alias
import { PrismaClient, PostStatus } from '@prisma/client'; 
import { getSession } from "@/auth";
import { requireApiKey } from '@/lib/apiKeyAuth';
// import { getServerSession } from "next-auth/next" // Example import
// import { authOptions } from "@/lib/auth"; // Example import for auth config

const prisma = new PrismaClient();

// TODO: Replace this with actual session retrieval using NextAuth
// async function getUserIdFromSession(req: NextRequest): Promise<string | null> {
//     console.warn('Using placeholder session retrieval. Replace with actual NextAuth logic.');
//     // Example placeholder: Check for a specific header or return a fixed ID for testing
//     // const session = await getServerSession(authOptions); // Replace with actual call
//     // return session?.user?.id ?? null;
//     return 'clw8sdeo30000ic84h4nf2g8k'; // <<<--- REPLACE THIS HARDCODED ID
// }

export async function POST(req: NextRequest) {
    // Check for API key first
    const apiKeyHeader = req.headers.get('x-api-key');
    if (apiKeyHeader) {
        const auth = await requireApiKey(req);
        if ('user' in auth) {
            const userId = auth.user.id;
            const body = await req.json();
            const { contentText, mediaUrls, platforms, scheduledAt, status } = body;
            // Basic Validation
            if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
                return NextResponse.json({ error: 'Platforms are required' }, { status: 400 });
            }
            if (!contentText && (!mediaUrls || mediaUrls.length === 0)) {
                return NextResponse.json({ error: 'Post must have content or media' }, { status: 400 });
            }
            if (status && !Object.values(PostStatus).includes(status as PostStatus)) {
                return NextResponse.json({ error: 'Invalid post status' }, { status: 400 });
            }
            if (status === PostStatus.SCHEDULED && !scheduledAt) {
                return NextResponse.json({ error: 'Scheduled posts require a scheduledAt date' }, { status: 400 });
            }
            const postData: any = {
                userId,
                contentText: contentText || null,
                mediaUrls: mediaUrls || [],
                platforms,
                status: status || PostStatus.DRAFT,
                scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
            };
            const newPost = await prisma.post.create({ data: postData });
            return NextResponse.json(newPost, { status: 201 });
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

        const body = await req.json();
        const { contentText, mediaUrls, platforms, scheduledAt, status } = body;
        // Basic Validation
        if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
            return NextResponse.json({ error: 'Platforms are required' }, { status: 400 });
        }
        if (!contentText && (!mediaUrls || mediaUrls.length === 0)) {
            return NextResponse.json({ error: 'Post must have content or media' }, { status: 400 });
        }
        if (status && !Object.values(PostStatus).includes(status as PostStatus)) {
            return NextResponse.json({ error: 'Invalid post status' }, { status: 400 });
        }
        if (status === PostStatus.SCHEDULED && !scheduledAt) {
            return NextResponse.json({ error: 'Scheduled posts require a scheduledAt date' }, { status: 400 });
        }
        const postData: any = {
            userId,
            contentText: contentText || null,
            mediaUrls: mediaUrls || [],
            platforms,
            status: status || PostStatus.DRAFT,
            scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        };
        const newPost = await prisma.post.create({ data: postData });
        return NextResponse.json(newPost, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// --- GET Handler to Fetch Posts ---
export async function GET(req: NextRequest) {
    // Check for API key first
    const apiKeyHeader = req.headers.get('x-api-key');
    if (apiKeyHeader) {
        const auth = await requireApiKey(req);
        if ('user' in auth) {
            const userId = auth.user.id;
            return await getPostsWithFilters(req, userId);
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

        return await getPostsWithFilters(req, userId);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

async function getPostsWithFilters(req: NextRequest, userId: string) {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const platform = searchParams.get('platform');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: any = { userId };
    
    if (status && status !== 'ALL') {
        where.status = status;
    }
    
    if (platform && platform !== 'ALL') {
        where.platforms = { has: platform };
    }
    
    if (search) {
        where.OR = [
            { contentText: { contains: search, mode: 'insensitive' } },
        ];
    }

    // Get total count
    const total = await prisma.post.count({ where });

    // Get posts with pagination
    const posts = await prisma.post.findMany({
        where,
        select: {
            id: true,
            contentText: true,
            mediaUrls: true,
            platforms: true,
            status: true,
            scheduledAt: true,
            publishedAt: true,
            createdAt: true,
            updatedAt: true,
            views: true,
            likes: true,
            comments: true,
            shares: true,
            reach: true,
            impressions: true,
            engagementRate: true,
        },
        orderBy: [
            { scheduledAt: 'desc' },
            { publishedAt: 'desc' },
            { createdAt: 'desc' }
        ],
        skip,
        take: pageSize
    });

    return NextResponse.json({
        posts,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
    });
} 