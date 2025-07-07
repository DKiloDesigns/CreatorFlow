import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Platform-specific token refresh configurations
const PLATFORM_CONFIGS = {
  instagram: {
    name: 'Instagram',
    tokenUrl: 'https://graph.instagram.com/refresh_access_token',
  },
  twitter: {
    name: 'X (Twitter)',
    tokenUrl: 'https://api.twitter.com/2/oauth2/token',
  },
  linkedin: {
    name: 'LinkedIn',
    tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
  },
  facebook: {
    name: 'Facebook',
    tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
  },
  youtube: {
    name: 'YouTube',
    tokenUrl: 'https://oauth2.googleapis.com/token',
  },
  tiktok: {
    name: 'TikTok',
    tokenUrl: 'https://open.tiktokapis.com/v2/oauth/token/',
  },
};

export async function POST(
  request: NextRequest,
  context: any
) {
  try {
    const { id } = context.params;
    
    // Get session
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the social account
    const account = await prisma.socialAccount.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    // Validate platform
    const config = PLATFORM_CONFIGS[account.platform as keyof typeof PLATFORM_CONFIGS];
    if (!config) {
      return NextResponse.json({ error: 'Unsupported platform' }, { status: 400 });
    }

    // Check if we have a refresh token
    if (!account.encryptedRefreshToken) {
      return NextResponse.json({ 
        error: 'No refresh token available. Please re-authorize your account.' 
      }, { status: 400 });
    }

    // Attempt to refresh the token
    let refreshResponse;
    let newTokenData;

    try {
      switch (account.platform) {
        case 'instagram':
          // Instagram Basic Display API refresh
          refreshResponse = await fetch(
            `${config.tokenUrl}?grant_type=ig_refresh_token&access_token=${account.encryptedAccessToken}`
          );
          break;

        case 'twitter':
          // Twitter OAuth 2.0 refresh
          refreshResponse = await fetch(config.tokenUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `Basic ${Buffer.from(
                `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`
              ).toString('base64')}`,
            },
            body: new URLSearchParams({
              grant_type: 'refresh_token',
              refresh_token: account.encryptedRefreshToken,
            }),
          });
          break;

        case 'linkedin':
          // LinkedIn OAuth 2.0 refresh
          refreshResponse = await fetch(config.tokenUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              grant_type: 'refresh_token',
              refresh_token: account.encryptedRefreshToken,
              client_id: process.env.LINKEDIN_CLIENT_ID!,
              client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
            }),
          });
          break;

        case 'facebook':
          // Facebook Graph API refresh
          refreshResponse = await fetch(
            `${config.tokenUrl}?grant_type=fb_exchange_token&client_id=${process.env.FACEBOOK_CLIENT_ID}&client_secret=${process.env.FACEBOOK_CLIENT_SECRET}&fb_exchange_token=${account.encryptedAccessToken}`
          );
          break;

        case 'youtube':
          // Google OAuth 2.0 refresh
          refreshResponse = await fetch(config.tokenUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              client_id: process.env.GOOGLE_CLIENT_ID!,
              client_secret: process.env.GOOGLE_CLIENT_SECRET!,
              grant_type: 'refresh_token',
              refresh_token: account.encryptedRefreshToken,
            }),
          });
          break;

        case 'tiktok':
          // TikTok OAuth 2.0 refresh
          refreshResponse = await fetch(config.tokenUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              client_key: process.env.TIKTOK_CLIENT_ID!,
              client_secret: process.env.TIKTOK_CLIENT_SECRET!,
              grant_type: 'refresh_token',
              refresh_token: account.encryptedRefreshToken,
            }),
          });
          break;

        default:
          return NextResponse.json({ error: 'Unsupported platform for token refresh' }, { status: 400 });
      }

      if (!refreshResponse.ok) {
        const errorText = await refreshResponse.text();
        console.error('Token refresh failed:', errorText);
        
        // Mark account as needing re-authorization
        await prisma.socialAccount.update({
          where: { id: account.id },
          data: { status: 'needs_reauth' },
        });

        return NextResponse.json({ 
          error: 'Token refresh failed. Please re-authorize your account.',
          details: errorText
        }, { status: 400 });
      }

      newTokenData = await refreshResponse.json();

    } catch (refreshError) {
      console.error('Token refresh error:', refreshError);
      
      // Mark account as needing re-authorization
      await prisma.socialAccount.update({
        where: { id: account.id },
        data: { status: 'needs_reauth' },
      });

      return NextResponse.json({ 
        error: 'Token refresh failed. Please re-authorize your account.' 
      }, { status: 500 });
    }

    // Update account with new tokens
    await prisma.socialAccount.update({
      where: { id: account.id },
      data: {
        encryptedAccessToken: newTokenData.access_token,
        encryptedRefreshToken: newTokenData.refresh_token || account.encryptedRefreshToken,
        tokenExpiresAt: newTokenData.expires_in 
          ? new Date(Date.now() + newTokenData.expires_in * 1000)
          : null,
        status: 'active',
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ 
      success: true,
      message: 'Token refreshed successfully',
      expiresAt: newTokenData.expires_in 
        ? new Date(Date.now() + newTokenData.expires_in * 1000).toISOString()
        : null,
    });

  } catch (error) {
    console.error('Token refresh endpoint error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 