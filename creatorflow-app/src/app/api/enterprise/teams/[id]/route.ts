/**
 * Individual Team API
 * Handles individual team operations
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { teamManagementService } from '@/lib/services/team-management';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const team = await teamManagementService.getTeam(params.id);

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      team,
    });

  } catch (error) {
    console.error('Get team error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch team' 
    }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { settings } = await req.json();

    const team = await teamManagementService.updateTeamSettings(
      params.id,
      session.user.id,
      settings
    );

    return NextResponse.json({
      success: true,
      team,
    });

  } catch (error) {
    console.error('Update team error:', error);
    return NextResponse.json({ 
      error: 'Failed to update team' 
    }, { status: 500 });
  }
}
