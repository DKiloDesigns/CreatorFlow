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
  const supportedProviders = ['github', 'google', 'twitter', 'instagram'];
  if (!supportedProviders.includes(platform)) {
    return { status: 400, body: { error: 'Unsupported platform' } };
  }
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3001';
  const signInUrl = `${baseUrl}/api/auth/signin/${platform}`;
  return { status: 200, body: { url: signInUrl } };
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