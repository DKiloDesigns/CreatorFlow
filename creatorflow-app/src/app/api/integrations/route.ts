import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { integrationManager } from '@/lib/integration-manager';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const provider = searchParams.get('provider');
    const type = searchParams.get('type');

    // Build where clause
    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (provider) {
      where.provider = provider;
    }
    
    if (type) {
      where.type = type;
    }

    // Get integrations
    const integrations = await prisma.integration.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Get integration health for each
    const integrationsWithHealth = await Promise.all(
      integrations.map(async (integration) => {
        const health = await integrationManager.checkIntegrationHealth(integration.id);
        return {
          id: integration.id,
          name: integration.name,
          type: integration.type,
          provider: integration.provider,
          config: JSON.parse(integration.config),
          status: integration.status,
          lastSync: integration.lastSync,
          errorCount: integration.errorCount,
          metadata: JSON.parse(integration.metadata),
          health,
        };
      })
    );

    return NextResponse.json({
      integrations: integrationsWithHealth,
      count: integrationsWithHealth.length,
    });

  } catch (error) {
    console.error('Get integrations error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, type, provider, config } = await req.json();

    // Validate required fields
    if (!name || !type || !provider) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create integration
    const integration = await integrationManager.createIntegration(name, type, provider, config);

    return NextResponse.json({
      success: true,
      integration,
      message: 'Integration created successfully',
    });

  } catch (error) {
    console.error('Create integration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { integrationId, updates } = await req.json();

    if (!integrationId) {
      return NextResponse.json({ error: 'Integration ID required' }, { status: 400 });
    }

    // Update integration
    const integration = await integrationManager.updateIntegration(integrationId, updates);

    if (!integration) {
      return NextResponse.json({ error: 'Integration not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      integration,
      message: 'Integration updated successfully',
    });

  } catch (error) {
    console.error('Update integration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 