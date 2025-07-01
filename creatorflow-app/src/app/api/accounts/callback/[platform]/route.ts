import { NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Platform-specific OAuth configurations (same as connect route)
const PLATFORM_CONFIGS = {
  instagram: {
    name: 'Instagram',
    tokenUrl: 'https://api.instagram.com/oauth/access_token',
    clientId: process.env.INSTAGRAM_CLIENT_ID,
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
    redirectUri: `${process.env.NEXTAUTH_URL}/api/accounts/callback/instagram`,
  },
  twitter: {
    name: 'X (Twitter)',
    tokenUrl: 'https://api.twitter.com/2/oauth2/token',
    clientId: process.env.TWITTER_CLIENT_ID,
    clientSecret: process.env.TWITTER_CLIENT_SECRET,
    redirectUri: `${process.env.NEXTAUTH_URL}/api/accounts/callback/twitter`,
  },
  linkedin: {
    name: 'LinkedIn',
    tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
    clientId: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    redirectUri: `${process.env.NEXTAUTH_URL}/api/accounts/callback/linkedin`,
  },
  facebook: {
    name: 'Facebook',
    tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
    clientId: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    redirectUri: `${process.env.NEXTAUTH_URL}/api/accounts/callback/facebook`,
  },
  youtube: {
    name: 'YouTube',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: `${process.env.NEXTAUTH_URL}/api/accounts/callback/youtube`,
  },
  tiktok: {
    name: 'TikTok',
    tokenUrl: 'https://open.tiktokapis.com/v2/oauth/token/',
    clientId: process.env.TIKTOK_CLIENT_ID,
    clientSecret: process.env.TIKTOK_CLIENT_SECRET,
    redirectUri: `${process.env.NEXTAUTH_URL}/api/accounts/callback/tiktok`,
  },
};

export async function GET(request: Request) {
  try {
    // Extract platform from URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const platform = pathParts[pathParts.length - 2];
    
    // Get query parameters
    const { searchParams } = url;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Handle OAuth errors
    if (error) {
      console.error('OAuth error:', error);
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard/accounts?error=oauth_failed&platform=${platform}`
      );
    }

    // Validate required parameters
    if (!code || !state) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard/accounts?error=no_code&platform=${platform}`
      );
    }

    // Get session
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard/accounts?error=unauthorized&platform=${platform}`
      );
    }

    // Validate platform
    const config = PLATFORM_CONFIGS[platform as keyof typeof PLATFORM_CONFIGS];
    if (!config) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard/accounts?error=unsupported_platform&platform=${platform}`
      );
    }

    // Find pending account with matching state
    const pendingAccount = await prisma.socialAccount.findFirst({
      where: {
        userId: session.user.id,
        platform: platform,
        status: 'pending',
        encryptedAccessToken: state, // State was stored here temporarily
      },
    });

    if (!pendingAccount) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard/accounts?error=invalid_state&platform=${platform}`
      );
    }

    // Exchange code for access token
    const tokenResponse = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: config.clientId!,
        client_secret: config.clientSecret!,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: config.redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', await tokenResponse.text());
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard/accounts?error=token_exchange_failed&platform=${platform}`
      );
    }

    const tokenData = await tokenResponse.json();

    // Extract user info based on platform
    let platformUserId = '';
    let username = '';

    try {
      switch (platform) {
        case 'instagram':
          // Instagram Basic Display API
          const instagramUserResponse = await fetch(
            `https://graph.instagram.com/me?fields=id,username&access_token=${tokenData.access_token}`
          );
          if (instagramUserResponse.ok) {
            const userData = await instagramUserResponse.json();
            platformUserId = userData.id;
            username = userData.username;
          }
          break;

        case 'twitter':
          // Twitter API v2
          const twitterUserResponse = await fetch(
            'https://api.twitter.com/2/users/me',
            {
              headers: {
                'Authorization': `Bearer ${tokenData.access_token}`,
              },
            }
          );
          if (twitterUserResponse.ok) {
            const userData = await twitterUserResponse.json();
            platformUserId = userData.data.id;
            username = userData.data.username;
          }
          break;

        case 'linkedin':
          // LinkedIn API
          const linkedinUserResponse = await fetch(
            'https://api.linkedin.com/v2/me',
            {
              headers: {
                'Authorization': `Bearer ${tokenData.access_token}`,
              },
            }
          );
          if (linkedinUserResponse.ok) {
            const userData = await linkedinUserResponse.json();
            platformUserId = userData.id;
            username = userData.localizedFirstName + ' ' + userData.localizedLastName;
          }
          break;

        case 'facebook':
          // Facebook Graph API
          const facebookUserResponse = await fetch(
            `https://graph.facebook.com/me?access_token=${tokenData.access_token}`
          );
          if (facebookUserResponse.ok) {
            const userData = await facebookUserResponse.json();
            platformUserId = userData.id;
            username = userData.name;
          }
          break;

        case 'youtube':
          // YouTube Data API
          const youtubeUserResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true&access_token=${tokenData.access_token}`
          );
          if (youtubeUserResponse.ok) {
            const userData = await youtubeUserResponse.json();
            if (userData.items?.[0]) {
              platformUserId = userData.items[0].id;
              username = userData.items[0].snippet.title;
            }
          }
          break;

        case 'tiktok':
          // TikTok API
          const tiktokUserResponse = await fetch(
            'https://open.tiktokapis.com/v2/user/info/',
            {
              headers: {
                'Authorization': `Bearer ${tokenData.access_token}`,
              },
            }
          );
          if (tiktokUserResponse.ok) {
            const userData = await tiktokUserResponse.json();
            platformUserId = userData.data.user.open_id;
            username = userData.data.user.display_name;
          }
          break;
      }
    } catch (userInfoError) {
      console.error('Failed to fetch user info:', userInfoError);
      // Continue with connection even if user info fetch fails
    }

    // Update account with tokens and user info
    await prisma.socialAccount.update({
      where: { id: pendingAccount.id },
      data: {
        platformUserId: platformUserId || 'unknown',
        username: username || 'Unknown User',
        encryptedAccessToken: tokenData.access_token, // In production, encrypt this
        encryptedRefreshToken: tokenData.refresh_token || null,
        tokenExpiresAt: tokenData.expires_in 
          ? new Date(Date.now() + tokenData.expires_in * 1000)
          : null,
        scopes: tokenData.scope || null,
        status: 'active',
      },
    });

    // Redirect back to accounts page with success
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/dashboard/accounts?success=connected&platform=${platform}`
    );

  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/dashboard/accounts?error=callback_failed&platform=unknown`
    );
  }
} 