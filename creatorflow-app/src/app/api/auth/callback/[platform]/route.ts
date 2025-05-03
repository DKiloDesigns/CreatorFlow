import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@/generated/prisma';
import { encryptToken } from '@/lib/encryption'; // Import the real encryption function

// TODO: Implement functions to exchange code for tokens for each platform
async function exchangeCodeForTokens(platform: string, code: string): Promise<any> {
  console.warn(`Token exchange logic for ${platform} is not implemented!`);
  // Replace with actual API calls to platform OAuth endpoints
  // Example structure:
  return {
    accessToken: `fake_access_token_${platform}_${Date.now()}`,
    refreshToken: `fake_refresh_token_${platform}_${Date.now()}`,
    expiresIn: 3600, // Example expiry
    // Include other relevant data like scopes, user ID, username if returned by platform
    platformUserId: `pid_${platform}_${Date.now()}`,
    username: `${platform}_user_${Date.now()}`
  };
}

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest, // Use NextRequest to easily access searchParams
  { params }: { params: { platform: string } }
) {
  const session = await auth();
  const platform = params.platform;
  const code = request.nextUrl.searchParams.get('code');
  // TODO: Handle state parameter validation for security
  // const state = request.nextUrl.searchParams.get('state');

  if (!session?.user?.id) {
    // Redirect to login or show error page if no session
    // For now, return JSON error
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!code) {
    return NextResponse.json({ error: 'Authorization code missing' }, { status: 400 });
  }

  if (!platform) {
    return NextResponse.json({ error: 'Platform missing' }, { status: 400 });
  }

  try {
    // 1. Check User Tier and Current Account Count
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true, _count: { select: { socialAccounts: true } } },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const currentCount = user._count.socialAccounts;
    const isFreeTier = user.plan === 'FREE'; // Or however plan is stored
    const limit = 2; // Free tier limit

    if (isFreeTier && currentCount >= limit) {
       // Redirect to accounts page with error message
      console.log(`User ${session.user.id} on FREE plan attempted to connect more than ${limit} accounts.`);
      // Construct redirect URL with error query param
      const redirectUrl = new URL('/dashboard/accounts', request.url); // Adjust dashboard path
      redirectUrl.searchParams.set('error', 'limit_reached');
      return NextResponse.redirect(redirectUrl);
    }

    // 2. Exchange code for tokens (Placeholder)
    const tokenData = await exchangeCodeForTokens(platform, code);
    if (!tokenData?.accessToken || !tokenData?.platformUserId || !tokenData?.username) {
        throw new Error('Failed to exchange code for tokens or get user info');
    }

    // 3. Encrypt tokens (Using the imported function)
    const encryptedAccessToken = encryptToken(tokenData.accessToken);
    const encryptedRefreshToken = tokenData.refreshToken ? encryptToken(tokenData.refreshToken) : null;
    const tokenExpiresAt = tokenData.expiresIn ? new Date(Date.now() + tokenData.expiresIn * 1000) : null;

    // Ensure encryption didn't fail
    if (!encryptedAccessToken || (tokenData.refreshToken && !encryptedRefreshToken)) {
      throw new Error('Token encryption failed');
    }

    // 4. Save SocialAccount to DB (using upsert for potential re-connections)
    await prisma.socialAccount.upsert({
      where: {
        userId_platform: { userId: session.user.id, platform: platform },
      },
      update: { // If user reconnects, update tokens/status
        platformUserId: tokenData.platformUserId,
        username: tokenData.username,
        encryptedAccessToken: encryptedAccessToken,
        encryptedRefreshToken: encryptedRefreshToken,
        tokenExpiresAt: tokenExpiresAt,
        scopes: tokenData.scopes, // Assuming scopes are returned
        status: 'active',
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        platform: platform,
        platformUserId: tokenData.platformUserId,
        username: tokenData.username,
        encryptedAccessToken: encryptedAccessToken,
        encryptedRefreshToken: encryptedRefreshToken,
        tokenExpiresAt: tokenExpiresAt,
        scopes: tokenData.scopes,
        status: 'active',
      },
    });

    // 5. Redirect user back to the accounts page (or dashboard)
    const redirectUrl = new URL('/dashboard/accounts', request.url); // Adjust dashboard path
    redirectUrl.searchParams.set('success', platform);
    return NextResponse.redirect(redirectUrl);

  } catch (error) {
    console.error(`Error handling OAuth callback for ${platform}:`, error);
    // Redirect to accounts page with generic error
    const redirectUrl = new URL('/dashboard/accounts', request.url); // Adjust dashboard path
    redirectUrl.searchParams.set('error', 'callback_failed');
    return NextResponse.redirect(redirectUrl);
  } finally {
    await prisma.$disconnect();
  }
} 