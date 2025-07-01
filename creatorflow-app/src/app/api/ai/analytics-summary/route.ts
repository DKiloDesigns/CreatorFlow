import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
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
            return await generateAnalyticsSummary(userId);
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

        return await generateAnalyticsSummary(userId);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

async function generateAnalyticsSummary(userId: string) {
    try {
        // Get user's posts with analytics data
        const posts = await prisma.post.findMany({
            where: { 
                userId,
                status: 'PUBLISHED',
                publishedAt: {
                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
                }
            },
            select: {
                contentText: true,
                platforms: true,
                publishedAt: true,
                views: true,
                likes: true,
                comments: true,
                shares: true,
                reach: true,
                impressions: true,
                engagementRate: true,
            }
        });

        if (posts.length === 0) {
            return NextResponse.json({
                avgEngagement: '0%',
                bestTime: 'Not enough data',
                topPlatform: 'Not enough data',
                recommendations: [
                    'Start posting content to get insights',
                    'Try different content types',
                    'Engage with your audience'
                ],
                peakActivity: 'Not enough data',
                preferredContent: 'Not enough data',
                growthRate: '0%'
            });
        }

        // Calculate average engagement rate
        const totalEngagement = posts.reduce((sum, post) => sum + (post.engagementRate || 0), 0);
        const avgEngagement = (totalEngagement / posts.length * 100).toFixed(1) + '%';

        // Find top platform
        const platformStats: Record<string, number> = {};
        posts.forEach(post => {
            post.platforms.forEach(platform => {
                platformStats[platform] = (platformStats[platform] || 0) + (post.engagementRate || 0);
            });
        });
        const topPlatform = Object.entries(platformStats)
            .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Unknown';

        // Analyze posting times
        const hourStats: Record<number, number> = {};
        posts.forEach(post => {
            if (post.publishedAt) {
                const hour = new Date(post.publishedAt).getHours();
                hourStats[hour] = (hourStats[hour] || 0) + (post.engagementRate || 0);
            }
        });
        const bestHour = Object.entries(hourStats)
            .sort(([,a], [,b]) => b - a)[0]?.[0];
        const bestTime = bestHour ? `${bestHour}:00` : 'Not enough data';

        // Generate recommendations
        const recommendations = [];
        const avgViews = posts.reduce((sum, post) => sum + (post.views || 0), 0) / posts.length;
        const avgLikes = posts.reduce((sum, post) => sum + (post.likes || 0), 0) / posts.length;

        if (avgViews < 100) {
            recommendations.push('Focus on creating more engaging content');
        }
        if (avgLikes < 10) {
            recommendations.push('Try using trending hashtags and engaging captions');
        }
        if (posts.length < 10) {
            recommendations.push('Post more consistently to build audience');
        }
        if (recommendations.length === 0) {
            recommendations.push('Your content is performing well! Keep it up');
        }

        // Analyze content types
        const hasImages = posts.some(post => post.contentText && post.contentText.length < 100);
        const hasLongForm = posts.some(post => post.contentText && post.contentText.length > 200);
        const preferredContent = hasImages ? 'Visual' : hasLongForm ? 'Long-form' : 'Mixed';

        // Calculate growth rate (simplified)
        const recentPosts = posts.slice(0, Math.floor(posts.length / 2));
        const olderPosts = posts.slice(Math.floor(posts.length / 2));
        const recentAvg = recentPosts.reduce((sum, post) => sum + (post.engagementRate || 0), 0) / recentPosts.length;
        const olderAvg = olderPosts.reduce((sum, post) => sum + (post.engagementRate || 0), 0) / olderPosts.length;
        const growthRate = olderAvg > 0 ? `+${((recentAvg - olderAvg) / olderAvg * 100).toFixed(0)}%` : '+0%';

        // Determine peak activity
        const weekdayStats: Record<number, number> = {};
        posts.forEach(post => {
            if (post.publishedAt) {
                const day = new Date(post.publishedAt).getDay();
                weekdayStats[day] = (weekdayStats[day] || 0) + (post.engagementRate || 0);
            }
        });
        const peakDay = Object.entries(weekdayStats)
            .sort(([,a], [,b]) => b - a)[0]?.[0];
        const peakActivity = Number(peakDay) === 0 || Number(peakDay) === 6 ? 'Weekends' : 'Weekdays';

        return NextResponse.json({
            avgEngagement,
            bestTime,
            topPlatform,
            recommendations,
            peakActivity,
            preferredContent,
            growthRate
        });
    } catch (error) {
        console.error('Error generating analytics summary:', error);
        return NextResponse.json({ error: 'Failed to generate analytics summary' }, { status: 500 });
    }
} 