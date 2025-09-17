/**
 * Enterprise Teams API
 * Handles team management and collaboration
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { teamManagementService } from '@/lib/services/team-management';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const teams = await teamManagementService.getUserTeams(session.user.id);

    return NextResponse.json({
      success: true,
      teams,
    });

  } catch (error) {
    console.error('Get teams error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch teams' 
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, settings } = await req.json();

    if (!name) {
      return NextResponse.json({ 
        error: 'Team name is required' 
      }, { status: 400 });
    }

    const team = await teamManagementService.createTeam(
      session.user.id,
      name,
      description,
      settings
    );

    return NextResponse.json({
      success: true,
      team,
    });

  } catch (error) {
    console.error('Create team error:', error);
    return NextResponse.json({ 
      error: 'Failed to create team' 
    }, { status: 500 });
  }
}