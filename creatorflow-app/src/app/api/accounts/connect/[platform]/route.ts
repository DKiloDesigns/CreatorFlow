import { NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { PrismaClient } from '@prisma/client';
import { randomBytes, createHash, randomUUID } from 'crypto';

const prisma = new PrismaClient();

// Platform-specific OAuth configurations
const PLATFORM_CONFIGS: Record<string, {
  name: string;
  authUrl: string;
  tokenUrl: string;
  scopes: string[];
  clientId?: string;
  clientSecret?: string;
  redirectUri: string;
  requiresInstance?: boolean;
}> = {
  instagram: {
    name: 'Instagram',
    authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
    scopes: ['instagram_basic', 'pages_show_list', 'pages_read_engagement'],
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
    authUrl: 'https://www.tiktok.com/auth/authorize/',
    tokenUrl: 'https://open.tiktokapis.com/v2/oauth/token/',
    scopes: ['user.info.basic', 'user.info.profile'],
    clientId: process.env.TIKTOK_CLIENT_KEY,
    clientSecret: process.env.TIKTOK_CLIENT_SECRET,
    redirectUri: `${process.env.NEXTAUTH_URL}/api/accounts/callback/tiktok`,
  },
  mastodon: {
    name: 'Mastodon',
    authUrl: 'https://[INSTANCE]/oauth/authorize',
    tokenUrl: 'https://[INSTANCE]/oauth/token',
    scopes: ['read', 'write', 'follow', 'push'],
    clientId: process.env.MASTODON_CLIENT_ID,
    clientSecret: process.env.MASTODON_CLIENT_SECRET,
    redirectUri: `${process.env.NEXTAUTH_URL}/api/accounts/callback/mastodon`,
    requiresInstance: true,
  },
  github: {
    name: 'GitHub',
    authUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    scopes: ['user:email', 'repo', 'public_repo'],
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    redirectUri: `${process.env.NEXTAUTH_URL}/api/accounts/callback/github`,
  },
  whatsapp: {
    name: 'WhatsApp',
    authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
    scopes: ['whatsapp_business_management', 'whatsapp_business_messaging'],
    clientId: process.env.WHATSAPP_CLIENT_ID,
    clientSecret: process.env.WHATSAPP_CLIENT_SECRET,
    redirectUri: `${process.env.NEXTAUTH_URL}/api/accounts/callback/whatsapp`,
  },
  reddit: {
    name: 'Reddit',
    authUrl: 'https://www.reddit.com/api/v1/authorize',
    tokenUrl: 'https://www.reddit.com/api/v1/access_token',
    scopes: ['identity', 'submit', 'read'],
    clientId: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_CLIENT_SECRET,
    redirectUri: `${process.env.NEXTAUTH_URL}/api/accounts/callback/reddit`,
  },
  snapchat: {
    name: 'Snapchat',
    authUrl: 'https://accounts.snapchat.com/login/oauth2/authorize',
    tokenUrl: 'https://accounts.snapchat.com/login/oauth2/access_token',
    scopes: ['user.display_name', 'user.bitmoji.avatar'],
    clientId: process.env.SNAPCHAT_CLIENT_ID,
    clientSecret: process.env.SNAPCHAT_CLIENT_SECRET,
    redirectUri: `${process.env.NEXTAUTH_URL}/api/accounts/callback/snapchat`,
  },
  discord: {
    name: 'Discord',
    authUrl: 'https://discord.com/api/oauth2/authorize',
    tokenUrl: 'https://discord.com/api/oauth2/token',
    scopes: ['identify', 'guilds'],
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    redirectUri: `${process.env.NEXTAUTH_URL}/api/accounts/callback/discord`,
  },
  twitch: {
    name: 'Twitch',
    authUrl: 'https://id.twitch.tv/oauth2/authorize',
    tokenUrl: 'https://id.twitch.tv/oauth2/token',
    scopes: ['user:read:email', 'channel:read:stream_key'],
    clientId: process.env.TWITCH_CLIENT_ID,
    clientSecret: process.env.TWITCH_CLIENT_SECRET,
    redirectUri: `${process.env.NEXTAUTH_URL}/api/accounts/callback/twitch`,
  },
  vimeo: {
    name: 'Vimeo',
    authUrl: 'https://api.vimeo.com/oauth/authorize',
    tokenUrl: 'https://api.vimeo.com/oauth/access_token',
    scopes: ['public', 'private', 'create', 'edit', 'delete', 'upload'],
    clientId: process.env.VIMEO_CLIENT_ID,
    clientSecret: process.env.VIMEO_CLIENT_SECRET,
    redirectUri: `${process.env.NEXTAUTH_URL}/api/accounts/callback/vimeo`,
  },
  dribbble: {
    name: 'Dribbble',
    authUrl: 'https://dribbble.com/oauth/authorize',
    tokenUrl: 'https://dribbble.com/oauth/token',
    scopes: ['public', 'upload'],
    clientId: process.env.DRIBBBLE_CLIENT_ID,
    clientSecret: process.env.DRIBBBLE_CLIENT_SECRET,
    redirectUri: `${process.env.NEXTAUTH_URL}/api/accounts/callback/dribbble`,
  },
  slack: {
    name: 'Slack',
    authUrl: 'https://slack.com/oauth/v2/authorize',
    tokenUrl: 'https://slack.com/api/oauth.v2.access',
    scopes: ['chat:write', 'channels:read', 'groups:read', 'im:read', 'mpim:read'],
    clientId: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
    redirectUri: `${process.env.NEXTAUTH_URL}/api/accounts/callback/slack`,
  },
};

export async function POST(request: Request) {
  try {
    // Extract platform from URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const platform = pathParts[pathParts.length - 1];
    
    
    // Get query parameters for instance-specific platforms and force re-auth
    const { searchParams } = url;
    const instance = searchParams.get('instance');
    const forceReauth = searchParams.get('force') === 'true';
    
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

    // Handle instance-specific platforms (like Mastodon)
    if (config.requiresInstance && !instance) {
      return NextResponse.json({ 
        error: `${config.name} requires an instance parameter` 
      }, { status: 400 });
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

    if (existingAccount && !forceReauth) {
      return NextResponse.json({ 
        error: `You already have a ${config.name} account connected`,
        existingAccount: {
          id: existingAccount.id,
          username: existingAccount.username,
          status: existingAccount.status
        }
      }, { status: 409 });
    }

    // If force re-auth and account exists, delete the existing account
    if (existingAccount && forceReauth) {
      await prisma.socialAccount.delete({
        where: { id: existingAccount.id }
      });
    }

    // Generate state parameter for security
    const state = randomUUID();
    
    // Generate PKCE parameters for TikTok
    let codeChallenge = '';
    let codeVerifier = '';
    if (platform === 'tiktok') {
      // Generate code verifier (43-128 characters, URL-safe)
      codeVerifier = randomBytes(32).toString('base64url');
      // Generate code challenge (SHA256 hash of code verifier, base64url encoded)
      codeChallenge = createHash('sha256').update(codeVerifier).digest('base64url');
    }
    
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
        // Store instance information for Mastodon and PKCE for TikTok
        ...(instance && { metadata: { instance } }),
        ...(platform === 'tiktok' && { metadata: { codeVerifier } }),
      },
    });

    // Build OAuth URL
    let authUrl = config.authUrl;
    
    // Handle instance-specific platforms (like Mastodon)
    if (config.requiresInstance && instance) {
      authUrl = authUrl.replace('[INSTANCE]', instance);
    }
    
    const params = new URLSearchParams({
      // Use client_key for TikTok, client_id for others
      ...(platform === 'tiktok' ? { client_key: config.clientId! } : { client_id: config.clientId! }),
      redirect_uri: config.redirectUri,
      response_type: 'code',
      scope: config.scopes.join(' '),
      state: state,
      // Add PKCE parameters for TikTok
      ...(platform === 'tiktok' && {
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
      }),
      // Force re-authorization if requested
      ...(forceReauth && { prompt: 'consent' }),
    });

    const finalAuthUrl = `${authUrl}?${params.toString()}`;
    
    // Debug logging for TikTok
    if (platform === 'tiktok') {
      console.log('TikTok OAuth URL:', finalAuthUrl);
      console.log('TikTok OAuth parameters:', Object.fromEntries(params));
    }

    return NextResponse.json({ 
      url: finalAuthUrl,
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