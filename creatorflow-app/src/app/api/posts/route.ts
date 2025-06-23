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
            // Fetch posts for the logged-in user
            // Select only necessary fields to send to the client
            const posts = await prisma.post.findMany({
                where: {
                    userId: userId,
                    // Optionally filter by status if needed (e.g., exclude drafts from calendar)
                    status: {
                        not: PostStatus.DRAFT // Example: Don't fetch drafts for the calendar
                    }
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
                    updatedAt: true,
                },
                orderBy: {
                    scheduledAt: 'asc' // Order by scheduled date
                }
            });

            return NextResponse.json(posts);
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

        // Fetch posts for the logged-in user
        // Select only necessary fields to send to the client
        const posts = await prisma.post.findMany({
            where: {
                userId: userId,
                status: {
                    not: PostStatus.DRAFT
                }
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
                updatedAt: true,
            },
            orderBy: {
                scheduledAt: 'asc'
            }
        });

        return NextResponse.json(posts);

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
} 