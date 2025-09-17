/**
 * Analytics Dashboards API
 * Handles custom dashboard creation and management
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { analyticsEngine } from '@/lib/services/analytics-engine';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dashboards = await analyticsEngine.getUserDashboards(session.user.id);

    return NextResponse.json({
      success: true,
      dashboards,
    });

  } catch (error) {
    console.error('Get dashboards error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch dashboards' 
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, widgets } = await req.json();

    if (!name || !widgets) {
      return NextResponse.json({ 
        error: 'Name and widgets are required' 
      }, { status: 400 });
    }

    const dashboard = await analyticsEngine.createCustomDashboard(
      session.user.id,
      name,
      description || '',
      widgets
    );

    return NextResponse.json({
      success: true,
      dashboard,
    });

  } catch (error) {
    console.error('Create dashboard error:', error);
    return NextResponse.json({ 
      error: 'Failed to create dashboard' 
    }, { status: 500 });
  }
}
