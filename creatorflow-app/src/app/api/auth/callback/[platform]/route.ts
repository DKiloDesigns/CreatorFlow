import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { prisma } from '@/lib/prisma';
import { encrypt } from '@/lib/crypto';

interface OAuthCallbackParams {
  platform: string;
}

export async function GET(request: NextRequest, { params }: { params: OAuthCallbackParams }) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state');

  // Get the current session to identify the user
  const session = await getSession(request);
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL('/signin?error=unauthorized', request.url));
  }

  if (error) {
    console.error(`OAuth error for ${params.platform}:`, error);
    return NextResponse.redirect(new URL(`/dashboard/accounts?error=oauth_failed&platform=${params.platform}`, request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL(`/dashboard/accounts?error=no_code&platform=${params.platform}`, request.url));
  }

  try {
    const platform = params.platform.toLowerCase();
    let tokenData: any;
    let userInfo: any;

    // Exchange authorization code for tokens based on platform
    switch (platform) {
      case 'twitter':
        tokenData = await exchangeTwitterTokens(code);
        userInfo = await getTwitterUserInfo(tokenData.access_token);
        break;
      case 'linkedin':
        tokenData = await exchangeLinkedInTokens(code);
        userInfo = await getLinkedInUserInfo(tokenData.access_token);
        break;
      case 'instagram':
        tokenData = await exchangeInstagramTokens(code);
        userInfo = await getInstagramUserInfo(tokenData.access_token);
        break;
      case 'tiktok':
        tokenData = await exchangeTikTokTokens(code);
        userInfo = await getTikTokUserInfo(tokenData.access_token);
        break;
      case 'youtube':
        tokenData = await exchangeYouTubeTokens(code);
        userInfo = await getYouTubeUserInfo(tokenData.access_token);
        break;
      case 'facebook':
        tokenData = await exchangeFacebookTokens(code);
        userInfo = await getFacebookUserInfo(tokenData.access_token);
        break;
      case 'pinterest':
        tokenData = await exchangePinterestTokens(code);
        userInfo = await getPinterestUserInfo(tokenData.access_token);
        break;
      case 'threads':
        tokenData = await exchangeInstagramTokens(code); // Threads uses Instagram OAuth
        userInfo = await getInstagramUserInfo(tokenData.access_token);
        break;
      case 'whatsapp':
        tokenData = await exchangeWhatsAppTokens(code);
        userInfo = await getWhatsAppUserInfo(tokenData.access_token);
        break;
      case 'messenger':
        tokenData = await exchangeFacebookTokens(code); // Messenger uses Facebook OAuth
        userInfo = await getFacebookUserInfo(tokenData.access_token);
        break;
      case 'wechat':
        tokenData = await exchangeWeChatTokens(code);
        userInfo = await getWeChatUserInfo(tokenData.access_token);
        break;
      case 'telegram':
        tokenData = await exchangeTelegramTokens(code);
        userInfo = await getTelegramUserInfo(tokenData.access_token);
        break;
      case 'reddit':
        tokenData = await exchangeRedditTokens(code);
        userInfo = await getRedditUserInfo(tokenData.access_token);
        break;
      case 'snapchat':
        tokenData = await exchangeSnapchatTokens(code);
        userInfo = await getSnapchatUserInfo(tokenData.access_token);
        break;
      case 'gmb':
        tokenData = await exchangeGoogleTokens(code); // GMB uses Google OAuth
        userInfo = await getGoogleMyBusinessUserInfo(tokenData.access_token);
        break;
      case 'discord':
        tokenData = await exchangeDiscordTokens(code);
        userInfo = await getDiscordUserInfo(tokenData.access_token);
        break;
      case 'twitch':
        tokenData = await exchangeTwitchTokens(code);
        userInfo = await getTwitchUserInfo(tokenData.access_token);
        break;
      case 'medium':
        tokenData = await exchangeMediumTokens(code);
        userInfo = await getMediumUserInfo(tokenData.access_token);
        break;
      case 'substack':
        tokenData = await exchangeSubstackTokens(code);
        userInfo = await getSubstackUserInfo(tokenData.access_token);
        break;
      case 'mastodon':
        tokenData = await exchangeMastodonTokens(code);
        userInfo = await getMastodonUserInfo(tokenData.access_token);
        break;
      case 'bluesky':
        tokenData = await exchangeBlueskyTokens(code);
        userInfo = await getBlueskyUserInfo(tokenData.access_token);
        break;
      case 'vimeo':
        tokenData = await exchangeVimeoTokens(code);
        userInfo = await getVimeoUserInfo(tokenData.access_token);
        break;
      case 'behance':
        tokenData = await exchangeBehanceTokens(code);
        userInfo = await getBehanceUserInfo(tokenData.access_token);
        break;
      case 'dribbble':
        tokenData = await exchangeDribbbleTokens(code);
        userInfo = await getDribbbleUserInfo(tokenData.access_token);
        break;
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }

    // Encrypt tokens before storing
    const encryptedAccessToken = encrypt(tokenData.access_token);
    const encryptedRefreshToken = tokenData.refresh_token ? encrypt(tokenData.refresh_token) : null;

    if (!encryptedAccessToken) {
      throw new Error('Failed to encrypt access token');
    }

    // Calculate token expiry
    const tokenExpiresAt = tokenData.expires_in 
      ? new Date(Date.now() + (tokenData.expires_in * 1000))
      : null;

    // Store or update the social account
    const socialAccount = await prisma.socialAccount.upsert({
      where: {
        userId_platform: {
          userId: session.user.id,
          platform: platform,
        },
      },
      update: {
        platformUserId: userInfo.id,
        username: userInfo.username || userInfo.name,
        encryptedAccessToken: encryptedAccessToken,
        encryptedRefreshToken: encryptedRefreshToken,
        tokenExpiresAt: tokenExpiresAt,
        scopes: tokenData.scope,
        status: 'active',
      },
      create: {
        userId: session.user.id,
        platform: platform,
        platformUserId: userInfo.id,
        username: userInfo.username || userInfo.name,
        encryptedAccessToken: encryptedAccessToken,
        encryptedRefreshToken: encryptedRefreshToken,
        tokenExpiresAt: tokenExpiresAt,
        scopes: tokenData.scope,
        status: 'active',
      },
    });

    console.log(`Successfully connected ${platform} account for user ${session.user.id}`);

    // Redirect back to accounts page with success message
    return NextResponse.redirect(new URL(`/dashboard/accounts?success=connected&platform=${platform}`, request.url));

  } catch (error) {
    console.error(`OAuth callback error for ${params.platform}:`, error);
    return NextResponse.redirect(new URL(`/dashboard/accounts?error=callback_failed&platform=${params.platform}`, request.url));
  }
}

// Platform-specific token exchange functions
async function exchangeTwitterTokens(code: string) {
  const clientId = process.env.TWITTER_CLIENT_ID;
  const clientSecret = process.env.TWITTER_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/twitter`;

  const response = await fetch('https://api.twitter.com/2/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      code_verifier: 'challenge', // In a real implementation, you'd store and retrieve the code verifier
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Twitter token exchange failed: ${error}`);
  }

  return await response.json();
}

async function exchangeLinkedInTokens(code: string) {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/linkedin`;

  const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId!,
      client_secret: clientSecret!,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`LinkedIn token exchange failed: ${error}`);
  }

  return await response.json();
}

async function exchangeInstagramTokens(code: string) {
  const clientId = process.env.INSTAGRAM_CLIENT_ID;
  const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/instagram`;

  const response = await fetch('https://api.instagram.com/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId!,
      client_secret: clientSecret!,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Instagram token exchange failed: ${error}`);
  }

  return await response.json();
}

async function exchangeTikTokTokens(code: string) {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/tiktok`;

  const response = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cache-Control': 'no-cache',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_key: clientKey!,
      client_secret: clientSecret!,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`TikTok token exchange failed: ${error}`);
  }

  return await response.json();
}

async function exchangeYouTubeTokens(code: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/youtube`;

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId!,
      client_secret: clientSecret!,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`YouTube token exchange failed: ${error}`);
  }

  return await response.json();
}

async function exchangeFacebookTokens(code: string) {
  const clientId = process.env.FACEBOOK_CLIENT_ID;
  const clientSecret = process.env.FACEBOOK_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/facebook`;

  const response = await fetch('https://graph.facebook.com/v15.0/oauth/access_token', {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Facebook token exchange failed: ${error}`);
  }

  return await response.json();
}

async function exchangePinterestTokens(code: string) {
  const clientId = process.env.PINTEREST_CLIENT_ID;
  const clientSecret = process.env.PINTEREST_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/pinterest`;

  const response = await fetch('https://api.pinterest.com/v1/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId!,
      client_secret: clientSecret!,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Pinterest token exchange failed: ${error}`);
  }

  return await response.json();
}

async function exchangeWhatsAppTokens(code: string) {
  const clientId = process.env.WHATSAPP_CLIENT_ID;
  const clientSecret = process.env.WHATSAPP_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/whatsapp`;

  const response = await fetch('https://api.whatsapp.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId!,
      client_secret: clientSecret!,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`WhatsApp token exchange failed: ${error}`);
  }

  return await response.json();
}

async function exchangeWeChatTokens(code: string) {
  const clientId = process.env.WECHAT_CLIENT_ID;
  const clientSecret = process.env.WECHAT_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/wechat`;

  const response = await fetch('https://api.wechat.com/oauth2/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId!,
      client_secret: clientSecret!,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`WeChat token exchange failed: ${error}`);
  }

  return await response.json();
}

async function exchangeTelegramTokens(code: string) {
  const clientId = process.env.TELEGRAM_CLIENT_ID;
  const clientSecret = process.env.TELEGRAM_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/telegram`;

  const response = await fetch('https://api.telegram.com/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId!,
      client_secret: clientSecret!,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Telegram token exchange failed: ${error}`);
  }

  return await response.json();
}

async function exchangeRedditTokens(code: string) {
  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/reddit`;

  const response = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId!,
      client_secret: clientSecret!,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Reddit token exchange failed: ${error}`);
  }

  return await response.json();
}

async function exchangeSnapchatTokens(code: string) {
  const clientId = process.env.SNAPCHAT_CLIENT_ID;
  const clientSecret = process.env.SNAPCHAT_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/snapchat`;

  const response = await fetch('https://api.snapchat.com/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId!,
      client_secret: clientSecret!,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Snapchat token exchange failed: ${error}`);
  }

  return await response.json();
}

async function exchangeGoogleTokens(code: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/gmb`;

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId!,
      client_secret: clientSecret!,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Google My Business token exchange failed: ${error}`);
  }

  return await response.json();
}

async function exchangeDiscordTokens(code: string) {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/discord`;

  const response = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId!,
      client_secret: clientSecret!,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Discord token exchange failed: ${error}`);
  }

  return await response.json();
}

async function exchangeTwitchTokens(code: string) {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/twitch`;

  const response = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId!,
      client_secret: clientSecret!,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Twitch token exchange failed: ${error}`);
  }

  return await response.json();
}

async function exchangeMediumTokens(code: string) {
  const clientId = process.env.MEDIUM_CLIENT_ID;
  const clientSecret = process.env.MEDIUM_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/medium`;

  const response = await fetch('https://api.medium.com/v1/tokens', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId!,
      client_secret: clientSecret!,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Medium token exchange failed: ${error}`);
  }

  return await response.json();
}

async function exchangeSubstackTokens(code: string) {
  const clientId = process.env.SUBSTACK_CLIENT_ID;
  const clientSecret = process.env.SUBSTACK_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/substack`;

  const response = await fetch('https://substack.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId!,
      client_secret: clientSecret!,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Substack token exchange failed: ${error}`);
  }

  return await response.json();
}

async function exchangeMastodonTokens(code: string) {
  const clientId = process.env.MASTODON_CLIENT_ID;
  const clientSecret = process.env.MASTODON_CLIENT_SECRET;
  const mastodonInstance = process.env.MASTODON_INSTANCE || 'mastodon.social';
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/mastodon`;

  const response = await fetch(`https://${mastodonInstance}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId!,
      client_secret: clientSecret!,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Mastodon token exchange failed: ${error}`);
  }

  return await response.json();
}

async function exchangeBlueskyTokens(code: string) {
  const clientId = process.env.BLUESKY_CLIENT_ID;
  const clientSecret = process.env.BLUESKY_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/bluesky`;

  const response = await fetch('https://bsky.app/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId!,
      client_secret: clientSecret!,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Bluesky token exchange failed: ${error}`);
  }

  return await response.json();
}

async function exchangeVimeoTokens(code: string) {
  const clientId = process.env.VIMEO_CLIENT_ID;
  const clientSecret = process.env.VIMEO_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/vimeo`;

  const response = await fetch('https://api.vimeo.com/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId!,
      client_secret: clientSecret!,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Vimeo token exchange failed: ${error}`);
  }

  return await response.json();
}

async function exchangeBehanceTokens(code: string) {
  const clientId = process.env.BEHANCE_CLIENT_ID;
  const clientSecret = process.env.BEHANCE_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/behance`;

  const response = await fetch('https://www.behance.net/v2/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId!,
      client_secret: clientSecret!,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Behance token exchange failed: ${error}`);
  }

  return await response.json();
}

async function exchangeDribbbleTokens(code: string) {
  const clientId = process.env.DRIBBBLE_CLIENT_ID;
  const clientSecret = process.env.DRIBBBLE_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/dribbble`;

  const response = await fetch('https://dribbble.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId!,
      client_secret: clientSecret!,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Dribbble token exchange failed: ${error}`);
  }

  return await response.json();
}

// Platform-specific user info functions
async function getTwitterUserInfo(accessToken: string) {
  const response = await fetch('https://api.twitter.com/2/users/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Twitter user info');
  }

  const data = await response.json();
  return {
    id: data.data.id,
    username: data.data.username,
    name: data.data.name,
  };
}

async function getLinkedInUserInfo(accessToken: string) {
  const response = await fetch('https://api.linkedin.com/v2/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch LinkedIn user info');
  }

  const data = await response.json();
  return {
    id: data.id,
    username: data.localizedFirstName + ' ' + data.localizedLastName,
    name: data.localizedFirstName + ' ' + data.localizedLastName,
  };
}

async function getInstagramUserInfo(accessToken: string) {
  const response = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`);

  if (!response.ok) {
    throw new Error('Failed to fetch Instagram user info');
  }

  const data = await response.json();
  return {
    id: data.id,
    username: data.username,
    name: data.username,
  };
}

async function getTikTokUserInfo(accessToken: string) {
  const response = await fetch('https://open.tiktokapis.com/v2/user/info/', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch TikTok user info');
  }

  const data = await response.json();
  return {
    id: data.data.user.open_id,
    username: data.data.user.display_name,
    name: data.data.user.display_name,
  };
}

async function getYouTubeUserInfo(accessToken: string) {
  const response = await fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch YouTube user info');
  }

  const data = await response.json();
  const channel = data.items[0];
  return {
    id: channel.id,
    username: channel.snippet.title,
    name: channel.snippet.title,
  };
}

async function getFacebookUserInfo(accessToken: string) {
  const response = await fetch('https://graph.facebook.com/v15.0/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Facebook user info');
  }

  const data = await response.json();
  return {
    id: data.id,
    username: data.name,
    name: data.name,
  };
}

async function getPinterestUserInfo(accessToken: string) {
  const response = await fetch('https://api.pinterest.com/v1/users/me/', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Pinterest user info');
  }

  const data = await response.json();
  return {
    id: data.data.id,
    username: data.data.username,
    name: data.data.first_name + ' ' + data.data.last_name,
  };
}

async function getWhatsAppUserInfo(accessToken: string) {
  const response = await fetch('https://api.whatsapp.com/v1/users/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch WhatsApp user info');
  }

  const data = await response.json();
  return {
    id: data.id,
    username: data.name,
    name: data.name,
  };
}

async function getWeChatUserInfo(accessToken: string) {
  const response = await fetch('https://api.wechat.com/oauth2/userinfo', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch WeChat user info');
  }

  const data = await response.json();
  return {
    id: data.id,
    username: data.name,
    name: data.name,
  };
}

async function getTelegramUserInfo(accessToken: string) {
  const response = await fetch('https://api.telegram.com/bot{telegram_bot_token}/getMe', {
    headers: {
      'Authorization': `Bot ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Telegram user info');
  }

  const data = await response.json();
  return {
    id: data.id,
    username: data.username,
    name: data.first_name + ' ' + data.last_name,
  };
}

async function getRedditUserInfo(accessToken: string) {
  const response = await fetch('https://www.reddit.com/api/v1/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Reddit user info');
  }

  const data = await response.json();
  return {
    id: data.id,
    username: data.name,
    name: data.name,
  };
}

async function getSnapchatUserInfo(accessToken: string) {
  const response = await fetch('https://api.snapchat.com/v1/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Snapchat user info');
  }

  const data = await response.json();
  return {
    id: data.id,
    username: data.name,
    name: data.name,
  };
}

async function getGoogleMyBusinessUserInfo(accessToken: string) {
  const response = await fetch('https://mybusiness.googleapis.com/v4/accounts/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Google My Business user info');
  }

  const data = await response.json();
  return {
    id: data.name,
    username: data.name,
    name: data.name,
  };
}

async function getDiscordUserInfo(accessToken: string) {
  const response = await fetch('https://discord.com/api/users/@me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Discord user info');
  }

  const data = await response.json();
  return {
    id: data.id,
    username: data.username,
    name: data.global_name || data.username,
  };
}

async function getTwitchUserInfo(accessToken: string) {
  const response = await fetch('https://api.twitch.tv/helix/users', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Client-Id': process.env.TWITCH_CLIENT_ID!,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Twitch user info');
  }

  const data = await response.json();
  const user = data.data[0];
  return {
    id: user.id,
    username: user.login,
    name: user.display_name,
  };
}

async function getMediumUserInfo(accessToken: string) {
  const response = await fetch('https://api.medium.com/v1/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Medium user info');
  }

  const data = await response.json();
  return {
    id: data.data.id,
    username: data.data.username,
    name: data.data.name,
  };
}

async function getSubstackUserInfo(accessToken: string) {
  const response = await fetch('https://substack.com/api/v1/user', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Substack user info');
  }

  const data = await response.json();
  return {
    id: data.id,
    username: data.username,
    name: data.name,
  };
}

async function getMastodonUserInfo(accessToken: string) {
  const mastodonInstance = process.env.MASTODON_INSTANCE || 'mastodon.social';
  const response = await fetch(`https://${mastodonInstance}/api/v1/accounts/verify_credentials`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Mastodon user info');
  }

  const data = await response.json();
  return {
    id: data.id,
    username: data.username,
    name: data.display_name || data.username,
  };
}

async function getBlueskyUserInfo(accessToken: string) {
  const response = await fetch('https://bsky.social/xrpc/com.atproto.server.getSession', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Bluesky user info');
  }

  const data = await response.json();
  return {
    id: data.did,
    username: data.handle,
    name: data.handle,
  };
}

async function getVimeoUserInfo(accessToken: string) {
  const response = await fetch('https://api.vimeo.com/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Vimeo user info');
  }

  const data = await response.json();
  return {
    id: data.uri.split('/').pop(),
    username: data.name,
    name: data.name,
  };
}

async function getBehanceUserInfo(accessToken: string) {
  const response = await fetch('https://www.behance.net/v2/users/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Behance user info');
  }

  const data = await response.json();
  return {
    id: data.user.id.toString(),
    username: data.user.username,
    name: data.user.display_name,
  };
}

async function getDribbbleUserInfo(accessToken: string) {
  const response = await fetch('https://api.dribbble.com/v2/user', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Dribbble user info');
  }

  const data = await response.json();
  return {
    id: data.id.toString(),
    username: data.username,
    name: data.name,
  };
} 