import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/prisma';
import { startOfDay, subDays, format } from 'date-fns';

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
    const range = parseInt(searchParams.get('range') || '30');
    const now = new Date();
    const start = startOfDay(subDays(now, range - 1));

    // Get EARLYBIRD100 promo code data
    const promoCode = await prisma.promoCode.findUnique({
      where: { code: 'EARLYBIRD100' },
    });

    if (!promoCode) {
      return NextResponse.json({ error: 'EARLYBIRD100 campaign not found' }, { status: 404 });
    }

    // Campaign metrics
    const campaignMetrics = {
      totalUses: promoCode.usedCount,
      maxUses: promoCode.maxUses || 100,
      remainingUses: (promoCode.maxUses || 100) - promoCode.usedCount,
      usagePercentage: ((promoCode.usedCount / (promoCode.maxUses || 100)) * 100).toFixed(1),
      isActive: promoCode.isActive,
      validFrom: promoCode.validFrom,
      validUntil: promoCode.validUntil,
    };

    // Trial user analytics
    const trialUsers = await prisma.user.findMany({
      where: {
        isTrialUser: true,
        promoCodeUsed: 'EARLYBIRD100',
        trialStartDate: { gte: start },
      },
      select: {
        id: true,
        email: true,
        name: true,
        trialStartDate: true,
        trialEndDate: true,
        createdAt: true,
        plan: true,
        stripeSubscriptionId: true,
      },
    });

    // Conversion metrics
    const convertedUsers = await prisma.user.findMany({
      where: {
        promoCodeUsed: 'EARLYBIRD100',
        isTrialUser: false,
        plan: { in: ['PRO', 'BUSINESS'] },
      },
      select: {
        id: true,
        email: true,
        name: true,
        trialStartDate: true,
        trialEndDate: true,
        plan: true,
        createdAt: true,
      },
    });

    // Daily signup trends
    const dailySignups = await prisma.$queryRawUnsafe<any[]>(`
      SELECT 
        DATE("trialStartDate") as date,
        COUNT(*) as signups
      FROM "User"
      WHERE "promoCodeUsed" = 'EARLYBIRD100' 
        AND "trialStartDate" >= $1
      GROUP BY DATE("trialStartDate")
      ORDER BY date ASC
    `, start);

    // Platform usage by trial users
    const platformUsage = await prisma.socialAccount.groupBy({
      by: ['platform'],
      _count: { platform: true },
      where: {
        userId: { in: trialUsers.map(u => u.id) },
      },
    });

    // Engagement metrics (posts created by trial users)
    const trialUserPosts = await prisma.post.count({
      where: {
        userId: { in: trialUsers.map(u => u.id) },
        createdAt: { gte: start },
      },
    });

    // Revenue impact
    const monthlyRevenue = await prisma.$queryRawUnsafe<any[]>(`
      SELECT 
        DATE_TRUNC('month', "createdAt") as month,
        COUNT(*) as conversions,
        SUM(CASE WHEN "plan" = 'PRO' THEN 29 ELSE 99 END) as estimated_revenue
      FROM "User"
      WHERE "promoCodeUsed" = 'EARLYBIRD100' 
        AND "isTrialUser" = false
        AND "plan" IN ('PRO', 'BUSINESS')
        AND "createdAt" >= $1
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month ASC
    `, start);

    return NextResponse.json({
      campaign: campaignMetrics,
      trialUsers: {
        total: trialUsers.length,
        active: trialUsers.filter(u => u.trialEndDate && new Date() < u.trialEndDate).length,
        expired: trialUsers.filter(u => u.trialEndDate && new Date() >= u.trialEndDate).length,
        list: trialUsers,
      },
      conversions: {
        total: convertedUsers.length,
        rate: trialUsers.length > 0 ? ((convertedUsers.length / trialUsers.length) * 100).toFixed(1) : '0',
        list: convertedUsers,
      },
      trends: {
        dailySignups,
        platformUsage,
        trialUserPosts,
        monthlyRevenue,
      },
      lastUpdated: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Campaign analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 