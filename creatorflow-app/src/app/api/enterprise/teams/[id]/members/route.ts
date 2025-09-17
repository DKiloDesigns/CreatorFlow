/**
 * Team Members API
 * Handles team member management
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

    const members = await teamManagementService.getTeamMembers(params.id);

    return NextResponse.json({
      success: true,
      members,
    });

  } catch (error) {
    console.error('Get team members error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch team members' 
    }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, role } = await req.json();

    if (!email || !role) {
      return NextResponse.json({ 
        error: 'Email and role are required' 
      }, { status: 400 });
    }

    const invitation = await teamManagementService.inviteTeamMember(
      params.id,
      email,
      role,
      session.user.id
    );

    return NextResponse.json({
      success: true,
      invitation,
    });

  } catch (error) {
    console.error('Invite team member error:', error);
    return NextResponse.json({ 
      error: 'Failed to invite team member' 
    }, { status: 500 });
  }
}
