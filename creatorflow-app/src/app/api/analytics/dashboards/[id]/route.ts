/**
 * Individual Dashboard API
 * Handles individual dashboard operations
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dashboard = await prisma.customDashboard.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!dashboard) {
      return NextResponse.json({ error: 'Dashboard not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      dashboard: {
        id: dashboard.id,
        name: dashboard.name,
        description: dashboard.description,
        widgets: dashboard.widgets,
        isDefault: dashboard.isDefault,
        isPublic: dashboard.isPublic,
        createdAt: dashboard.createdAt,
        updatedAt: dashboard.updatedAt,
      },
    });

  } catch (error) {
    console.error('Get dashboard error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch dashboard' 
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

    const { name, description, widgets } = await req.json();

    const dashboard = await prisma.customDashboard.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!dashboard) {
      return NextResponse.json({ error: 'Dashboard not found' }, { status: 404 });
    }

    const updatedDashboard = await prisma.customDashboard.update({
      where: { id: params.id },
      data: {
        name: name || dashboard.name,
        description: description || dashboard.description,
        widgets: widgets || dashboard.widgets,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      dashboard: {
        id: updatedDashboard.id,
        name: updatedDashboard.name,
        description: updatedDashboard.description,
        widgets: updatedDashboard.widgets,
        isDefault: updatedDashboard.isDefault,
        isPublic: updatedDashboard.isPublic,
        createdAt: updatedDashboard.createdAt,
        updatedAt: updatedDashboard.updatedAt,
      },
    });

  } catch (error) {
    console.error('Update dashboard error:', error);
    return NextResponse.json({ 
      error: 'Failed to update dashboard' 
    }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dashboard = await prisma.customDashboard.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!dashboard) {
      return NextResponse.json({ error: 'Dashboard not found' }, { status: 404 });
    }

    if (dashboard.isDefault) {
      return NextResponse.json({ 
        error: 'Cannot delete default dashboard' 
      }, { status: 400 });
    }

    await prisma.customDashboard.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Dashboard deleted successfully',
    });

  } catch (error) {
    console.error('Delete dashboard error:', error);
    return NextResponse.json({ 
      error: 'Failed to delete dashboard' 
    }, { status: 500 });
  }
}
