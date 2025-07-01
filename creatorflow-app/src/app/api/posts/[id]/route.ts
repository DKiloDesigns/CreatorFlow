import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, PostStatus } from '@prisma/client';
import { getSession } from "@/auth";
import { requireApiKey } from '@/lib/apiKeyAuth';

const prisma = new PrismaClient();

// Helper function to get user ID from request
async function getUserId(req: NextRequest): Promise<string | null> {
    const apiKeyHeader = req.headers.get('x-api-key');
    if (apiKeyHeader) {
        const auth = await requireApiKey(req);
        if ('user' in auth) {
            return auth.user.id;
        }
        return null;
    }
    
    const session = await getSession(req);
    return session?.user?.id || null;
}

// GET: Fetch a single post
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const userId = await getUserId(req);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const post = await prisma.post.findFirst({
            where: { id: params.id, userId },
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
                brandCollabId: true,
            }
        });

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// PUT: Update a post
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const userId = await getUserId(req);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { contentText, mediaUrls, platforms, scheduledAt, status } = body;

        // Verify post belongs to user
        const existingPost = await prisma.post.findFirst({
            where: { id: params.id, userId }
        });

        if (!existingPost) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        // Validate status if provided
        if (status && !Object.values(PostStatus).includes(status as PostStatus)) {
            return NextResponse.json({ error: 'Invalid post status' }, { status: 400 });
        }

        // Validate scheduledAt if status is SCHEDULED
        if (status === PostStatus.SCHEDULED && !scheduledAt) {
            return NextResponse.json({ error: 'Scheduled posts require a scheduledAt date' }, { status: 400 });
        }

        const updatedPost = await prisma.post.update({
            where: { id: params.id },
            data: {
                contentText: contentText !== undefined ? contentText : undefined,
                mediaUrls: mediaUrls !== undefined ? mediaUrls : undefined,
                platforms: platforms !== undefined ? platforms : undefined,
                status: status !== undefined ? status : undefined,
                scheduledAt: scheduledAt !== undefined ? new Date(scheduledAt) : undefined,
            }
        });

        return NextResponse.json(updatedPost);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE: Delete a post
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const userId = await getUserId(req);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Verify post belongs to user
        const existingPost = await prisma.post.findFirst({
            where: { id: params.id, userId }
        });

        if (!existingPost) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        await prisma.post.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ message: 'Post deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST: Duplicate a post
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    const userId = await getUserId(req);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Get the original post
        const originalPost = await prisma.post.findFirst({
            where: { id: params.id, userId }
        });

        if (!originalPost) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        // Create a duplicate with DRAFT status
        const duplicatedPost = await prisma.post.create({
            data: {
                userId,
                contentText: originalPost.contentText,
                mediaUrls: originalPost.mediaUrls,
                platforms: originalPost.platforms,
                status: PostStatus.DRAFT, // Always duplicate as draft
                // Don't copy scheduledAt, publishedAt, or analytics data
            }
        });

        return NextResponse.json(duplicatedPost, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
} 