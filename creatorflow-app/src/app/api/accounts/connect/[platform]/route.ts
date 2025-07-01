import { NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Platform-specific OAuth configurations
const PLATFORM_CONFIGS = {
  instagram: {
    name: 'Instagram',
    authUrl: 'https://api.instagram.com/oauth/authorize',
    tokenUrl: 'https://api.instagram.com/oauth/access_token',
    scopes: ['basic', 'comments', 'relationships', 'likes'],
    clientId: process.env.INSTAGRAM_CLIENT_ID,
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
    redirectUri: `${process.env.NEXTAUTH_URL}/api/accounts/callback/instagram`,
  },
  twitter: {
    name: 'X (Twitter)',
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    tokenUrl: 'https://api.twitter.com/2/oauth2/token',
    scopes: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
    clientId: process.env.TWITTER_CLIENT_ID,
    clientSecret: process.env.TWITTER_CLIENT_SECRET,
    redirectUri: `${process.env.NEXTAUTH_URL}/api/accounts/callback/twitter`,
  },
  linkedin: {
    name: 'LinkedIn',
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
    scopes: ['r_liteprofile', 'r_emailaddress', 'w_member_social'],
    clientId: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    redirectUri: `${process.env.NEXTAUTH_URL}/api/accounts/callback/linkedin`,
  },
  facebook: {
    name: 'Facebook',
    authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
    scopes: ['pages_manage_posts', 'pages_read_engagement', 'pages_show_list'],
    clientId: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    redirectUri: `${process.env.NEXTAUTH_URL}/api/accounts/callback/facebook`,
  },
  youtube: {
    name: 'YouTube',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scopes: ['https://www.googleapis.com/auth/youtube.upload', 'https://www.googleapis.com/auth/youtube'],
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: `${process.env.NEXTAUTH_URL}/api/accounts/callback/youtube`,
  },
  tiktok: {
    name: 'TikTok',
    authUrl: 'https://www.tiktok.com/v2/auth/authorize',
    tokenUrl: 'https://open.tiktokapis.com/v2/oauth/token/',
    scopes: ['user.info.basic', 'video.list', 'video.upload'],
    clientId: process.env.TIKTOK_CLIENT_ID,
    clientSecret: process.env.TIKTOK_CLIENT_SECRET,
    redirectUri: `${process.env.NEXTAUTH_URL}/api/accounts/callback/tiktok`,
  },
};

export async function POST(request: Request) {
  try {
    // Extract platform from URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const platform = pathParts[pathParts.length - 2];
    
    // Get session
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate platform
    const config = PLATFORM_CONFIGS[platform as keyof typeof PLATFORM_CONFIGS];
    if (!config) {
      return NextResponse.json({ error: 'Unsupported platform' }, { status: 400 });
    }

    // Check if client credentials are configured
    if (!config.clientId || !config.clientSecret) {
      return NextResponse.json({ 
        error: `${config.name} integration not configured. Please contact support.` 
      }, { status: 503 });
    }

    // Check if user already has this platform connected
    const existingAccount = await prisma.socialAccount.findUnique({
      where: {
        userId_platform: {
          userId: session.user.id,
          platform: platform,
        },
      },
    });

    if (existingAccount) {
      return NextResponse.json({ 
        error: `You already have a ${config.name} account connected` 
      }, { status: 409 });
    }

    // Generate state parameter for security
    const state = crypto.randomUUID();
    
    // Store state in database for verification
    await prisma.socialAccount.create({
      data: {
        userId: session.user.id,
        platform: platform,
        platformUserId: '', // Will be filled after OAuth
        username: '', // Will be filled after OAuth
        status: 'pending',
        encryptedAccessToken: state, // Temporarily store state here
        tokenExpiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes expiry
      },
    });

    // Build OAuth URL
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: 'code',
      scope: config.scopes.join(' '),
      state: state,
    });

    const authUrl = `${config.authUrl}?${params.toString()}`;

    return NextResponse.json({ 
      url: authUrl,
      platform: platform,
      platformName: config.name,
    });

  } catch (error) {
    console.error('OAuth connection error:', error);
    return NextResponse.json({ 
      error: 'Failed to initiate OAuth connection' 
    }, { status: 500 });
  }
}