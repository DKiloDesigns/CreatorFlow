import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, PostStatus } from '@prisma/client';
import { getSession } from "@/auth";
import { requireApiKey } from '@/lib/apiKeyAuth';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    // Check for API key first
    const apiKeyHeader = req.headers.get('x-api-key');
    if (apiKeyHeader) {
        const auth = await requireApiKey(req);
        if ('user' in auth) {
            const userId = auth.user.id;
            return await getOverviewCounts(userId);
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

        return await getOverviewCounts(userId);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

async function getOverviewCounts(userId: string) {
    const [drafts, scheduled, published] = await Promise.all([
        prisma.post.count({
            where: { userId, status: PostStatus.DRAFT }
        }),
        prisma.post.count({
            where: { userId, status: PostStatus.SCHEDULED }
        }),
        prisma.post.count({
            where: { userId, status: PostStatus.PUBLISHED }
        })
    ]);

    return NextResponse.json({
        drafts,
        scheduled,
        published,
        total: drafts + scheduled + published
    });
} 