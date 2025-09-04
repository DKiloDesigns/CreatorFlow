import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { enterpriseManager } from '@/lib/enterprise-manager';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get('teamId');

    if (teamId) {
      // Get specific team
      const team = await enterpriseManager.getTeam(teamId);
      if (!team) {
        return NextResponse.json({ error: 'Team not found' }, { status: 404 });
      }

      // Check if user is member
      const isMember = team.members.some(member => member.userId === session.user.id);
      if (!isMember) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }

      return NextResponse.json({
        success: true,
        team,
      });
    } else {
      // Get user's teams
      const userTeams = await prisma.teamMember.findMany({
        where: { userId: session.user.id },
        include: {
          team: {
            include: {
              members: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });

      const teams = userTeams.map(ut => ({
        ...ut.team,
        settings: JSON.parse(ut.team.settings as string),
        members: ut.team.members.map(member => ({
          ...member,
          permissions: member.role, // Use role as permissions
        })),
      }));

      return NextResponse.json({
        success: true,
        teams,
        count: teams.length,
      });
    }

  } catch (error) {
    console.error('Get teams error:', error);
    return NextResponse.json({ error: 'Failed to get teams' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Team name required' }, { status: 400 });
    }

    const team = await enterpriseManager.createTeam(name, description || '', session.user.id);

    return NextResponse.json({
      success: true,
      team,
      message: 'Team created successfully',
    });

  } catch (error) {
    console.error('Create team error:', error);
    return NextResponse.json({ error: 'Failed to create team' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { teamId, updates } = await req.json();

    if (!teamId) {
      return NextResponse.json({ error: 'Team ID required' }, { status: 400 });
    }

    // Check if user is team owner or admin
    const teamMember = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId: session.user.id,
        },
      },
    });

    if (!teamMember || !['owner', 'admin'].includes(teamMember.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Update team
    const updatedTeam = await prisma.team.update({
      where: { id: teamId },
      data: {
        name: updates.name,
        description: updates.description,
        settings: updates.settings ? JSON.stringify(updates.settings) : undefined,
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      team: {
        ...updatedTeam,
        settings: JSON.parse(updatedTeam.settings as string),
        members: updatedTeam.members.map(member => ({
          ...member,
          permissions: member.role, // Use role as permissions
        })),
      },
      message: 'Team updated successfully',
    });

  } catch (error) {
    console.error('Update team error:', error);
    return NextResponse.json({ error: 'Failed to update team' }, { status: 500 });
  }
} 