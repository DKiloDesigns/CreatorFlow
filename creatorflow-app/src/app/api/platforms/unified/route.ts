/**
 * Unified Platform API Endpoint
 * Provides consistent interface for all social media platforms
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { platformAPIManager } from '@/lib/api-abstraction/platform-api-manager';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { platform, action, data } = await req.json();

    if (!platform || !action) {
      return NextResponse.json({ 
        error: 'Platform and action are required' 
      }, { status: 400 });
    }

    const supportedPlatforms = platformAPIManager.getSupportedPlatforms();
    if (!supportedPlatforms.includes(platform.toLowerCase())) {
      return NextResponse.json({ 
        error: `Unsupported platform: ${platform}. Supported platforms: ${supportedPlatforms.join(', ')}` 
      }, { status: 400 });
    }

    let result;

    switch (action) {
      case 'create_post':
        result = await platformAPIManager.createPost(platform, session.user.id, data);
        break;
      
      case 'upload_media':
        result = await platformAPIManager.uploadMedia(platform, session.user.id, data);
        break;
      
      case 'get_user_info':
        result = await platformAPIManager.getUserInfo(platform, session.user.id);
        break;
      
      case 'get_analytics':
        result = await platformAPIManager.getAnalytics(platform, session.user.id, data);
        break;
      
      case 'refresh_token':
        // Get account ID from database
        const { PrismaClient } = await import('@prisma/client');
        const prisma = new PrismaClient();
        const account = await prisma.socialAccount.findFirst({
          where: {
            userId: session.user.id,
            platform: platform.toLowerCase(),
          },
        });
        
        if (!account) {
          return NextResponse.json({ 
            error: 'Account not found' 
          }, { status: 404 });
        }
        
        result = await platformAPIManager.refreshToken(platform, account.id);
        break;
      
      case 'check_health':
        const health = await platformAPIManager.checkPlatformHealth(platform, session.user.id);
        return NextResponse.json({
          success: true,
          platform,
          healthy: health.healthy,
          error: health.error,
        });
      
      default:
        return NextResponse.json({ 
          error: `Invalid action: ${action}. Supported actions: create_post, upload_media, get_user_info, get_analytics, refresh_token, check_health` 
        }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      platform,
      action,
      result,
    });

  } catch (error) {
    console.error('Unified platform API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    if (action === 'supported_platforms') {
      const supportedPlatforms = platformAPIManager.getSupportedPlatforms();
      return NextResponse.json({
        success: true,
        platforms: supportedPlatforms,
      });
    }

    if (action === 'platform_health') {
      const platform = searchParams.get('platform');
      if (!platform) {
        return NextResponse.json({ 
          error: 'Platform parameter is required' 
        }, { status: 400 });
      }

      const health = await platformAPIManager.checkPlatformHealth(platform, session.user.id);
      return NextResponse.json({
        success: true,
        platform,
        healthy: health.healthy,
        error: health.error,
      });
    }

    return NextResponse.json({ 
      error: 'Invalid action. Supported actions: supported_platforms, platform_health' 
    }, { status: 400 });

  } catch (error) {
    console.error('Unified platform API GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
