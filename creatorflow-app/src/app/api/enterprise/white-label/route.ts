/**
 * White-Label API
 * Handles white-label customization and branding
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { whiteLabelService } from '@/lib/services/white-label';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get('team_id');

    if (!teamId) {
      return NextResponse.json({ 
        error: 'Team ID is required' 
      }, { status: 400 });
    }

    const config = await whiteLabelService.getWhiteLabelConfig(teamId);

    return NextResponse.json({
      success: true,
      config,
    });

  } catch (error) {
    console.error('Get white-label config error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch white-label configuration' 
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { teamId, config } = await req.json();

    if (!teamId || !config) {
      return NextResponse.json({ 
        error: 'Team ID and configuration are required' 
      }, { status: 400 });
    }

    const whiteLabelConfig = await whiteLabelService.createWhiteLabelConfig(teamId, config);

    return NextResponse.json({
      success: true,
      config: whiteLabelConfig,
    });

  } catch (error) {
    console.error('Create white-label config error:', error);
    return NextResponse.json({ 
      error: 'Failed to create white-label configuration' 
    }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { teamId, updates } = await req.json();

    if (!teamId || !updates) {
      return NextResponse.json({ 
        error: 'Team ID and updates are required' 
      }, { status: 400 });
    }

    const config = await whiteLabelService.updateWhiteLabelConfig(teamId, updates);

    return NextResponse.json({
      success: true,
      config,
    });

  } catch (error) {
    console.error('Update white-label config error:', error);
    return NextResponse.json({ 
      error: 'Failed to update white-label configuration' 
    }, { status: 500 });
  }
}
