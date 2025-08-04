import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { advancedIntegrations } from '@/lib/advanced-integrations';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const integrationId = searchParams.get('integrationId');
    const type = searchParams.get('type');

    if (integrationId) {
      // Get specific integration
      const integration = await advancedIntegrations.getIntegration(integrationId);
      if (!integration) {
        return NextResponse.json({ error: 'Integration not found' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        integration,
      });
    }

    if (type === 'metrics') {
      // Get integration metrics
      const metrics = await advancedIntegrations.getIntegrationMetrics();
      return NextResponse.json({
        success: true,
        metrics,
      });
    }

    // Get all integrations
    const integrations = await prisma.integration.findMany({
      include: {
        webhooks: true,
        credentials: true,
        events: {
          orderBy: { timestamp: 'desc' },
          take: 5,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedIntegrations = integrations.map(integration => ({
      ...integration,
      config: JSON.parse(integration.config),
      credentials: integration.credentials ? JSON.parse(integration.credentials) : null,
      webhooks: integration.webhooks.map(webhook => ({
        ...webhook,
        events: JSON.parse(webhook.events),
      })),
      syncSettings: JSON.parse(integration.syncSettings),
      health: JSON.parse(integration.health),
      events: integration.events.map(event => ({
        ...event,
        data: JSON.parse(event.data),
      })),
    }));

    return NextResponse.json({
      success: true,
      integrations: formattedIntegrations,
      count: formattedIntegrations.length,
    });

  } catch (error) {
    console.error('Get integrations error:', error);
    return NextResponse.json({ error: 'Failed to get integrations' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, data } = await req.json();

    switch (action) {
      case 'create_integration':
        const integration = await advancedIntegrations.createIntegration(data);
        return NextResponse.json({
          success: true,
          integration,
          message: 'Integration created successfully',
        });

      case 'create_webhook':
        const webhook = await advancedIntegrations.createWebhook(
          data.integrationId,
          data.webhook
        );
        return NextResponse.json({
          success: true,
          webhook,
          message: 'Webhook created successfully',
        });

      case 'store_credential':
        const credential = await advancedIntegrations.storeCredential(
          data.integrationId,
          data.credential
        );
        return NextResponse.json({
          success: true,
          credential,
          message: 'Credential stored successfully',
        });

      case 'start_sync':
        const sync = await advancedIntegrations.startSync(
          data.integrationId,
          data.mode
        );
        return NextResponse.json({
          success: true,
          sync,
          message: 'Sync started successfully',
        });

      case 'check_health':
        const health = await advancedIntegrations.checkIntegrationHealth(data.integrationId);
        return NextResponse.json({
          success: true,
          health,
          message: 'Health check completed',
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Advanced integrations POST error:', error);
    return NextResponse.json({ error: 'Failed to process integration action' }, { status: 500 });
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

    const integration = await advancedIntegrations.updateIntegration(integrationId, updates);

    return NextResponse.json({
      success: true,
      integration,
      message: 'Integration updated successfully',
    });

  } catch (error) {
    console.error('Update integration error:', error);
    return NextResponse.json({ error: 'Failed to update integration' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const integrationId = searchParams.get('integrationId');

    if (!integrationId) {
      return NextResponse.json({ error: 'Integration ID required' }, { status: 400 });
    }

    // Delete integration and related data
    await prisma.integration.delete({
      where: { id: integrationId },
    });

    return NextResponse.json({
      success: true,
      message: 'Integration deleted successfully',
    });

  } catch (error) {
    console.error('Delete integration error:', error);
    return NextResponse.json({ error: 'Failed to delete integration' }, { status: 500 });
  }
} 