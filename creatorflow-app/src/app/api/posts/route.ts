import { NextResponse, NextRequest } from 'next/server';
// Corrected import path based on generator output and tsconfig alias
import { PrismaClient, PostStatus } from '@prisma/client'; 
import { getSession } from "@/auth";
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
    // Debug logging for session/cookie issues
    console.log('--- API DEBUG ---');
    console.log('HEADERS:', Object.fromEntries(req.headers.entries()));
    console.log('COOKIES:', req.cookies.getAll());
    try {
        const session = await getSession();
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
        // Validate status enum if provided
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
            status: status || PostStatus.DRAFT, // Default to DRAFT if not provided
            scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        };

        const newPost = await prisma.post.create({
            data: postData,
        });

        console.log(`Post created: ${newPost.id} by user ${userId}`);
        return NextResponse.json(newPost, { status: 201 }); // 201 Created

    } catch (error) {
        console.error('Error creating post:', error);
        if (error instanceof SyntaxError) { // Handle JSON parsing errors
             return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// --- GET Handler to Fetch Posts ---
export async function GET(req: NextRequest) {
    // Debug logging for session/cookie issues
    console.log('--- API DEBUG ---');
    console.log('HEADERS:', Object.fromEntries(req.headers.entries()));
    console.log('COOKIES:', req.cookies.getAll());
    try {
        const session = await getSession();
        console.log("GET /api/posts - Session:", session);
        const userId = session?.user?.id;

        if (!userId) {
            console.error("GET /api/posts - Unauthorized: userId is missing from session", session);
            return NextResponse.json({ error: 'Unauthorized: User not logged in' }, { status: 401 });
        }

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
                errorMessage: true,
                createdAt: true,
                updatedAt: true,
                // Do NOT include userId or user relation unless specifically needed
            },
            orderBy: {
                scheduledAt: 'asc' // Order by scheduled date
            }
        });

        return NextResponse.json(posts);

    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
} 