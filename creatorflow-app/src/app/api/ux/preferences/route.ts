import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { uxManager } from '@/lib/ux-manager';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    if (category) {
      const preferences = await prisma.userPreference.findMany({
        where: {
          userId: session.user.id,
          category,
        },
        orderBy: { updatedAt: 'desc' },
      });

      return NextResponse.json({
        success: true,
        preferences: preferences.map(p => ({
          ...p,
          value: JSON.parse(p.value),
        })),
      });
    } else {
      const allPreferences = await uxManager.getUserPreferences(session.user.id);
      return NextResponse.json({
        success: true,
        preferences: allPreferences.map(p => ({
          ...p,
          value: JSON.parse(p.value),
        })),
      });
    }

  } catch (error) {
    console.error('Get preferences error:', error);
    return NextResponse.json({ error: 'Failed to get preferences' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { category, key, value } = await req.json();

    if (!category || !key) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await uxManager.setUserPreference(session.user.id, category, key, value);

    return NextResponse.json({
      success: true,
      message: 'Preference updated successfully',
    });

  } catch (error) {
    console.error('Set preference error:', error);
    return NextResponse.json({ error: 'Failed to set preference' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { preferences } = await req.json();

    if (!Array.isArray(preferences)) {
      return NextResponse.json({ error: 'Invalid preferences format' }, { status: 400 });
    }

    // Update multiple preferences
    for (const pref of preferences) {
      const { category, key, value } = pref;
      if (category && key) {
        await uxManager.setUserPreference(session.user.id, category, key, value);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Preferences updated successfully',
    });

  } catch (error) {
    console.error('Update preferences error:', error);
    return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 });
  }
} 