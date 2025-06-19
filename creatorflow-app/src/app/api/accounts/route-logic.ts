import { NextRequest } from 'next/server';

export async function handleGetAccounts({ req, getSession, prisma }: {
  req: NextRequest,
  getSession: (req: any) => Promise<any>,
  prisma: any
}) {
  const session = await getSession(req);
  if (!session?.user?.id) {
    return { status: 401, body: { error: 'Unauthorized' } };
  }
  try {
    const socialAccounts = await prisma.socialAccount.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        platform: true,
        username: true,
        status: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    return { status: 200, body: socialAccounts };
  } catch (error) {
    return { status: 500, body: { error: 'Internal Server Error' } };
  } finally {
    await prisma.$disconnect();
  }
}

export async function handlePostAccounts({ req, getSession, prisma }: {
  req: any,
  getSession: (req: any) => Promise<any>,
  prisma: any
}) {
  const session = await getSession(req);
  if (!session?.user?.id) {
    return { status: 401, body: { error: 'Unauthorized' } };
  }
  try {
    const accounts = await prisma.account.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        provider: true,
        providerAccountId: true,
      },
      orderBy: {
        provider: 'asc',
      },
    });
    return { status: 200, body: accounts };
  } catch (error) {
    return { status: 500, body: { error: 'Internal Server Error' } };
  } finally {
    await prisma.$disconnect();
  }
}

export async function handleDeleteAccount({ req, params, getSession, prisma }: {
  req: any,
  params: { accountId: string },
  getSession: (req: any) => Promise<any>,
  prisma: any
}) {
  const session = await getSession(req);
  const accountId = params.accountId;
  if (!session?.user?.id) {
    return { status: 401, body: { error: 'Unauthorized' } };
  }
  // Check if the account belongs to the user
  const account = await prisma.account.findUnique({ where: { id: accountId } });
  if (!account || account.userId !== session.user.id) {
    return { status: 404, body: { error: 'Account not found or not owned by user' } };
  }
  // Prevent disconnecting the last account
  const userAccounts = await prisma.account.findMany({ where: { userId: session.user.id } });
  if (userAccounts.length <= 1) {
    return { status: 400, body: { error: 'Cannot disconnect last authentication method' } };
  }
  await prisma.account.delete({ where: { id: accountId } });
  return { status: 200, body: { success: true } };
}

export async function handleConnectAccount({ req, params, getSession }: {
  req: any,
  params: { platform: string },
  getSession: (req: any) => Promise<any>
}) {
  const session = await getSession(req);
  const platform = params.platform?.toLowerCase();
  if (!session?.user?.id) {
    return { status: 401, body: { error: 'Unauthorized' } };
  }
  if (!platform) {
    return { status: 400, body: { error: 'Platform is required' } };
  }
  
  const supportedProviders = [
    'twitter', 'linkedin', 'instagram', 'tiktok', 'youtube',
    'facebook', 'pinterest', 'threads', 'whatsapp', 'messenger', 
    'wechat', 'telegram', 'reddit', 'snapchat', 'gmb',
    'discord', 'twitch', 'medium', 'substack',
    'mastodon', 'bluesky', 'vimeo', 'behance', 'dribbble'
  ];
  if (!supportedProviders.includes(platform)) {
    return { status: 400, body: { error: 'Unsupported platform' } };
  }

  // Generate OAuth URLs for each platform
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3001';
  const redirectUri = `${baseUrl}/api/auth/callback/${platform}`;
  
  let oauthUrl: string;
  
  switch (platform) {
    case 'twitter':
      const twitterClientId = process.env.TWITTER_CLIENT_ID;
      if (!twitterClientId) {
        return { status: 500, body: { error: 'Twitter OAuth not configured' } };
      }
      oauthUrl = `https://twitter.com/i/oauth2/authorize?` + new URLSearchParams({
        response_type: 'code',
        client_id: twitterClientId,
        redirect_uri: redirectUri,
        scope: 'tweet.read tweet.write users.read offline.access',
        state: session.user.id,
        code_challenge: 'challenge',
        code_challenge_method: 'plain',
      });
      break;
      
    case 'linkedin':
      const linkedinClientId = process.env.LINKEDIN_CLIENT_ID;
      if (!linkedinClientId) {
        return { status: 500, body: { error: 'LinkedIn OAuth not configured' } };
      }
      oauthUrl = `https://www.linkedin.com/oauth/v2/authorization?` + new URLSearchParams({
        response_type: 'code',
        client_id: linkedinClientId,
        redirect_uri: redirectUri,
        scope: 'r_liteprofile r_emailaddress w_member_social',
        state: session.user.id,
      });
      break;
      
    case 'instagram':
      const instagramClientId = process.env.INSTAGRAM_CLIENT_ID;
      if (!instagramClientId) {
        return { status: 500, body: { error: 'Instagram OAuth not configured' } };
      }
      oauthUrl = `https://api.instagram.com/oauth/authorize?` + new URLSearchParams({
        response_type: 'code',
        client_id: instagramClientId,
        redirect_uri: redirectUri,
        scope: 'user_profile,user_media',
        state: session.user.id,
      });
      break;
      
    case 'tiktok':
      const tiktokClientKey = process.env.TIKTOK_CLIENT_KEY;
      if (!tiktokClientKey) {
        return { status: 500, body: { error: 'TikTok OAuth not configured' } };
      }
      oauthUrl = `https://www.tiktok.com/v2/auth/authorize?` + new URLSearchParams({
        response_type: 'code',
        client_key: tiktokClientKey,
        redirect_uri: redirectUri,
        scope: 'user.info.basic,video.list',
        state: session.user.id,
      });
      break;
      
    case 'youtube':
      const youtubeClientId = process.env.GOOGLE_CLIENT_ID;
      if (!youtubeClientId) {
        return { status: 500, body: { error: 'YouTube OAuth not configured' } };
      }
      oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` + new URLSearchParams({
        response_type: 'code',
        client_id: youtubeClientId,
        redirect_uri: redirectUri,
        scope: 'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube',
        state: session.user.id,
        access_type: 'offline',
        prompt: 'consent',
      });
      break;

    case 'facebook':
      const facebookClientId = process.env.FACEBOOK_CLIENT_ID;
      if (!facebookClientId) {
        return { status: 500, body: { error: 'Facebook OAuth not configured' } };
      }
      oauthUrl = `https://www.facebook.com/v18.0/dialog/oauth?` + new URLSearchParams({
        response_type: 'code',
        client_id: facebookClientId,
        redirect_uri: redirectUri,
        scope: 'pages_manage_posts,pages_read_engagement,publish_to_groups',
        state: session.user.id,
      });
      break;

    case 'pinterest':
      const pinterestClientId = process.env.PINTEREST_CLIENT_ID;
      if (!pinterestClientId) {
        return { status: 500, body: { error: 'Pinterest OAuth not configured' } };
      }
      oauthUrl = `https://www.pinterest.com/oauth/?` + new URLSearchParams({
        response_type: 'code',
        client_id: pinterestClientId,
        redirect_uri: redirectUri,
        scope: 'boards:read,pins:read,pins:write',
        state: session.user.id,
      });
      break;

    case 'threads':
      // Threads uses Instagram's OAuth since it's part of Meta
      const threadsClientId = process.env.INSTAGRAM_CLIENT_ID;
      if (!threadsClientId) {
        return { status: 500, body: { error: 'Threads OAuth not configured (uses Instagram credentials)' } };
      }
      oauthUrl = `https://api.instagram.com/oauth/authorize?` + new URLSearchParams({
        response_type: 'code',
        client_id: threadsClientId,
        redirect_uri: redirectUri,
        scope: 'user_profile,user_media',
        state: session.user.id,
      });
      break;

    case 'whatsapp':
      const whatsappClientId = process.env.WHATSAPP_CLIENT_ID;
      if (!whatsappClientId) {
        return { status: 500, body: { error: 'WhatsApp OAuth not configured' } };
      }
      oauthUrl = `https://www.facebook.com/v18.0/dialog/oauth?` + new URLSearchParams({
        response_type: 'code',
        client_id: whatsappClientId,
        redirect_uri: redirectUri,
        scope: 'whatsapp_business_management',
        state: session.user.id,
      });
      break;

    case 'messenger':
      const messengerClientId = process.env.FACEBOOK_CLIENT_ID;
      if (!messengerClientId) {
        return { status: 500, body: { error: 'Messenger OAuth not configured (uses Facebook credentials)' } };
      }
      oauthUrl = `https://www.facebook.com/v18.0/dialog/oauth?` + new URLSearchParams({
        response_type: 'code',
        client_id: messengerClientId,
        redirect_uri: redirectUri,
        scope: 'pages_messaging,pages_manage_metadata',
        state: session.user.id,
      });
      break;

    case 'wechat':
      const wechatClientId = process.env.WECHAT_CLIENT_ID;
      if (!wechatClientId) {
        return { status: 500, body: { error: 'WeChat OAuth not configured' } };
      }
      oauthUrl = `https://open.weixin.qq.com/connect/qrconnect?` + new URLSearchParams({
        appid: wechatClientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'snsapi_login',
        state: session.user.id,
      });
      break;

    case 'telegram':
      const telegramClientId = process.env.TELEGRAM_CLIENT_ID;
      if (!telegramClientId) {
        return { status: 500, body: { error: 'Telegram OAuth not configured' } };
      }
      oauthUrl = `https://oauth.telegram.org/auth?` + new URLSearchParams({
        bot_id: telegramClientId,
        request_access: 'write',
        origin: baseUrl,
        return_to: redirectUri,
        state: session.user.id,
      });
      break;

    case 'reddit':
      const redditClientId = process.env.REDDIT_CLIENT_ID;
      if (!redditClientId) {
        return { status: 500, body: { error: 'Reddit OAuth not configured' } };
      }
      oauthUrl = `https://www.reddit.com/api/v1/authorize?` + new URLSearchParams({
        response_type: 'code',
        client_id: redditClientId,
        redirect_uri: redirectUri,
        scope: 'submit,read',
        state: session.user.id,
        duration: 'permanent',
      });
      break;

    case 'snapchat':
      const snapchatClientId = process.env.SNAPCHAT_CLIENT_ID;
      if (!snapchatClientId) {
        return { status: 500, body: { error: 'Snapchat OAuth not configured' } };
      }
      oauthUrl = `https://accounts.snapchat.com/accounts/oauth2/auth?` + new URLSearchParams({
        response_type: 'code',
        client_id: snapchatClientId,
        redirect_uri: redirectUri,
        scope: 'https://auth.snapchat.com/oauth2/api/user.display_name,https://auth.snapchat.com/oauth2/api/user.bitmoji.avatar',
        state: session.user.id,
      });
      break;

    case 'gmb':
      const gmbClientId = process.env.GOOGLE_CLIENT_ID;
      if (!gmbClientId) {
        return { status: 500, body: { error: 'Google My Business OAuth not configured (uses Google credentials)' } };
      }
      oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` + new URLSearchParams({
        response_type: 'code',
        client_id: gmbClientId,
        redirect_uri: redirectUri,
        scope: 'https://www.googleapis.com/auth/business.manage',
        state: session.user.id,
        access_type: 'offline',
        prompt: 'consent',
      });
      break;

    case 'discord':
      const discordClientId = process.env.DISCORD_CLIENT_ID;
      if (!discordClientId) {
        return { status: 500, body: { error: 'Discord OAuth not configured' } };
      }
      oauthUrl = `https://discord.com/api/oauth2/authorize?` + new URLSearchParams({
        response_type: 'code',
        client_id: discordClientId,
        redirect_uri: redirectUri,
        scope: 'identify guilds webhook.incoming',
        state: session.user.id,
      });
      break;

    case 'twitch':
      const twitchClientId = process.env.TWITCH_CLIENT_ID;
      if (!twitchClientId) {
        return { status: 500, body: { error: 'Twitch OAuth not configured' } };
      }
      oauthUrl = `https://id.twitch.tv/oauth2/authorize?` + new URLSearchParams({
        response_type: 'code',
        client_id: twitchClientId,
        redirect_uri: redirectUri,
        scope: 'user:read:email channel:read:subscriptions clips:edit',
        state: session.user.id,
        force_verify: 'true',
      });
      break;

    case 'medium':
      const mediumClientId = process.env.MEDIUM_CLIENT_ID;
      if (!mediumClientId) {
        return { status: 500, body: { error: 'Medium OAuth not configured' } };
      }
      oauthUrl = `https://medium.com/m/oauth/authorize?` + new URLSearchParams({
        response_type: 'code',
        client_id: mediumClientId,
        redirect_uri: redirectUri,
        scope: 'basicProfile publishPost',
        state: session.user.id,
      });
      break;

    case 'substack':
      const substackClientId = process.env.SUBSTACK_CLIENT_ID;
      if (!substackClientId) {
        return { status: 500, body: { error: 'Substack OAuth not configured' } };
      }
      oauthUrl = `https://substack.com/oauth/authorize?` + new URLSearchParams({
        response_type: 'code',
        client_id: substackClientId,
        redirect_uri: redirectUri,
        scope: 'read write',
        state: session.user.id,
      });
      break;

    case 'mastodon':
      const mastodonClientId = process.env.MASTODON_CLIENT_ID;
      const mastodonInstance = process.env.MASTODON_INSTANCE || 'mastodon.social';
      if (!mastodonClientId) {
        return { status: 500, body: { error: 'Mastodon OAuth not configured' } };
      }
      oauthUrl = `https://${mastodonInstance}/oauth/authorize?` + new URLSearchParams({
        response_type: 'code',
        client_id: mastodonClientId,
        redirect_uri: redirectUri,
        scope: 'read write follow',
        state: session.user.id,
      });
      break;

    case 'bluesky':
      const blueskyClientId = process.env.BLUESKY_CLIENT_ID;
      if (!blueskyClientId) {
        return { status: 500, body: { error: 'Bluesky OAuth not configured' } };
      }
      oauthUrl = `https://bsky.app/oauth/authorize?` + new URLSearchParams({
        response_type: 'code',
        client_id: blueskyClientId,
        redirect_uri: redirectUri,
        scope: 'com.atproto.repo com.atproto.server',
        state: session.user.id,
      });
      break;

    case 'vimeo':
      const vimeoClientId = process.env.VIMEO_CLIENT_ID;
      if (!vimeoClientId) {
        return { status: 500, body: { error: 'Vimeo OAuth not configured' } };
      }
      oauthUrl = `https://api.vimeo.com/oauth/authorize?` + new URLSearchParams({
        response_type: 'code',
        client_id: vimeoClientId,
        redirect_uri: redirectUri,
        scope: 'public private create edit delete',
        state: session.user.id,
      });
      break;

    case 'behance':
      const behanceClientId = process.env.BEHANCE_CLIENT_ID;
      if (!behanceClientId) {
        return { status: 500, body: { error: 'Behance OAuth not configured' } };
      }
      oauthUrl = `https://www.behance.net/v2/oauth/authorize?` + new URLSearchParams({
        response_type: 'code',
        client_id: behanceClientId,
        redirect_uri: redirectUri,
        scope: 'project_write collection_write',
        state: session.user.id,
      });
      break;

    case 'dribbble':
      const dribbbleClientId = process.env.DRIBBBLE_CLIENT_ID;
      if (!dribbbleClientId) {
        return { status: 500, body: { error: 'Dribbble OAuth not configured' } };
      }
      oauthUrl = `https://dribbble.com/oauth/authorize?` + new URLSearchParams({
        response_type: 'code',
        client_id: dribbbleClientId,
        redirect_uri: redirectUri,
        scope: 'public write',
        state: session.user.id,
      });
      break;
      
    default:
      return { status: 400, body: { error: 'Unsupported platform' } };
  }
  
  return { status: 200, body: { url: oauthUrl } };
}

export async function handleDeleteSocialAccount({ req, params, getSession, prisma }: {
  req: any,
  params: { accountId: string },
  getSession: (req: any) => Promise<any>,
  prisma: any
}) {
  const session = await getSession(req);
  const accountId = params.accountId;
  if (!session?.user?.id) {
    return { status: 401, body: { error: 'Unauthorized' } };
  }
  if (!accountId) {
    return { status: 400, body: { error: 'Account ID is required' } };
  }
  try {
    const account = await prisma.socialAccount.findUnique({
      where: { id: accountId },
      select: { userId: true },
    });
    if (!account) {
      return { status: 404, body: { error: 'Account not found' } };
    }
    if (account.userId !== session.user.id) {
      return { status: 403, body: { error: 'Forbidden' } };
    }
    await prisma.socialAccount.delete({ where: { id: accountId } });
    return { status: 200, body: { message: 'Account disconnected successfully' } };
  } catch (error) {
    return { status: 500, body: { error: 'Internal Server Error' } };
  } finally {
    await prisma.$disconnect();
  }
} 