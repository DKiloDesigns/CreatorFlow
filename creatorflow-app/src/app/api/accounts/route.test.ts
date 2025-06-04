// Mock getSession to simulate authentication
jest.mock('@/auth', () => ({
  getSession: jest.fn(),
}));
// Mock Prisma client
jest.mock('@prisma/client', () => {
  const mPrisma = {
    account: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    $disconnect: jest.fn(),
    socialAccount: {
      findMany: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrisma) };
});

const { createMocks } = require('node-mocks-http');
const { GET, POST } = require('./route');
const { getSession } = require('@/auth');
const { PrismaClient } = require('@prisma/client');
const { handleGetAccounts, handlePostAccounts, handleDeleteAccount, handleConnectAccount, handleDeleteSocialAccount } = require('./route-logic');

const mockUser = { user: { id: 'user1' } };

describe('OAuth Account Management API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Integration tests for GET/POST handlers are skipped due to Next.js API route incompatibility with node-mocks-http.
  // See: https://github.com/vercel/next.js/discussions/32238
  // Use pure logic tests below for business/auth logic coverage.
  it.skip('should return unauthorized if not logged in (POST)', async () => {
    getSession.mockResolvedValueOnce(null);
    const { req, res } = createMocks({ method: 'POST' });
    await POST(req, res);
    expect(res._getStatusCode()).toBe(401);
  });

  it.skip('should list accounts for authenticated user (POST)', async () => {
    getSession.mockResolvedValueOnce(mockUser);
    PrismaClient().account.findMany.mockResolvedValueOnce([
      { id: 'a1', provider: 'github', providerAccountId: 'gh1' },
      { id: 'a2', provider: 'google', providerAccountId: 'g1' },
    ]);
    const { req, res } = createMocks({ method: 'POST' });
    await POST(req, res);
    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.length).toBe(2);
    expect(data[0].provider).toBe('github');
  });

  it.skip('should return unauthorized if not logged in (GET)', async () => {
    getSession.mockResolvedValueOnce(null);
    const { req, res } = createMocks({ method: 'GET' });
    await GET(req, res);
    expect(res._getStatusCode()).toBe(401);
  });

  it.skip('should list social accounts for authenticated user (GET)', async () => {
    getSession.mockResolvedValueOnce(mockUser);
    PrismaClient().socialAccount.findMany.mockResolvedValueOnce([
      { id: 's1', platform: 'twitter', username: 'twuser', status: 'active', createdAt: new Date() },
    ]);
    const { req, res } = createMocks({ method: 'GET' });
    await GET(req, res);
    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.length).toBe(1);
    expect(data[0].platform).toBe('twitter');
  });

  // Pure logic tests for handleGetAccounts
  it('handleGetAccounts: should return unauthorized if not logged in', async () => {
    const mockGetSession = jest.fn().mockResolvedValue(null);
    const mockPrisma = { socialAccount: { findMany: jest.fn() }, $disconnect: jest.fn() };
    const { status, body } = await handleGetAccounts({ req: {}, getSession: mockGetSession, prisma: mockPrisma });
    expect(status).toBe(401);
    expect(body.error).toBe('Unauthorized');
  });

  it('handleGetAccounts: should return accounts for authenticated user', async () => {
    const mockGetSession = jest.fn().mockResolvedValue({ user: { id: 'user1' } });
    const mockAccounts = [{ id: 's1', platform: 'twitter', username: 'twuser', status: 'active', createdAt: new Date() }];
    const mockPrisma = { socialAccount: { findMany: jest.fn().mockResolvedValue(mockAccounts) }, $disconnect: jest.fn() };
    const { status, body } = await handleGetAccounts({ req: {}, getSession: mockGetSession, prisma: mockPrisma });
    expect(status).toBe(200);
    expect(body).toEqual(mockAccounts);
  });

  // Pure logic tests for handlePostAccounts
  it('handlePostAccounts: should return unauthorized if not logged in', async () => {
    const mockGetSession = jest.fn().mockResolvedValue(null);
    const mockPrisma = { account: { findMany: jest.fn() }, $disconnect: jest.fn() };
    const { status, body } = await handlePostAccounts({ req: {}, getSession: mockGetSession, prisma: mockPrisma });
    expect(status).toBe(401);
    expect(body.error).toBe('Unauthorized');
  });

  it('handlePostAccounts: should return accounts for authenticated user', async () => {
    const mockGetSession = jest.fn().mockResolvedValue({ user: { id: 'user1' } });
    const mockAccounts = [{ id: 'a1', provider: 'github', providerAccountId: 'gh1' }];
    const mockPrisma = { account: { findMany: jest.fn().mockResolvedValue(mockAccounts) }, $disconnect: jest.fn() };
    const { status, body } = await handlePostAccounts({ req: {}, getSession: mockGetSession, prisma: mockPrisma });
    expect(status).toBe(200);
    expect(body).toEqual(mockAccounts);
  });

  // Pure logic tests for handleDeleteAccount
  it('handleDeleteAccount: should return unauthorized if not logged in', async () => {
    const mockGetSession = jest.fn().mockResolvedValue(null);
    const mockPrisma = { account: { findUnique: jest.fn(), findMany: jest.fn(), delete: jest.fn() }, $disconnect: jest.fn() };
    const { status, body } = await handleDeleteAccount({ req: {}, params: { accountId: 'a1' }, getSession: mockGetSession, prisma: mockPrisma });
    expect(status).toBe(401);
    expect(body.error).toBe('Unauthorized');
  });

  it('handleDeleteAccount: should return 404 if account not owned', async () => {
    const mockGetSession = jest.fn().mockResolvedValue({ user: { id: 'user1' } });
    const mockPrisma = { account: { findUnique: jest.fn().mockResolvedValue({ userId: 'other' }), findMany: jest.fn(), delete: jest.fn() }, $disconnect: jest.fn() };
    const { status, body } = await handleDeleteAccount({ req: {}, params: { accountId: 'a1' }, getSession: mockGetSession, prisma: mockPrisma });
    expect(status).toBe(404);
    expect(body.error).toBe('Account not found or not owned by user');
  });

  it('handleDeleteAccount: should return 400 if last account', async () => {
    const mockGetSession = jest.fn().mockResolvedValue({ user: { id: 'user1' } });
    const mockPrisma = {
      account: {
        findUnique: jest.fn().mockResolvedValue({ userId: 'user1' }),
        findMany: jest.fn().mockResolvedValue([{}]),
        delete: jest.fn()
      },
      $disconnect: jest.fn()
    };
    // Only one account
    mockPrisma.account.findMany.mockResolvedValueOnce([{}]);
    const { status, body } = await handleDeleteAccount({ req: {}, params: { accountId: 'a1' }, getSession: mockGetSession, prisma: mockPrisma });
    expect(status).toBe(400);
    expect(body.error).toBe('Cannot disconnect last authentication method');
  });

  it('handleDeleteAccount: should succeed if account is owned and not last', async () => {
    const mockGetSession = jest.fn().mockResolvedValue({ user: { id: 'user1' } });
    const mockPrisma = {
      account: {
        findUnique: jest.fn().mockResolvedValue({ userId: 'user1' }),
        findMany: jest.fn().mockResolvedValue([{}, {}]),
        delete: jest.fn().mockResolvedValue({})
      },
      $disconnect: jest.fn()
    };
    const { status, body } = await handleDeleteAccount({ req: {}, params: { accountId: 'a1' }, getSession: mockGetSession, prisma: mockPrisma });
    expect(status).toBe(200);
    expect(body.success).toBe(true);
  });

  // Pure logic tests for handleConnectAccount
  it('handleConnectAccount: should return unauthorized if not logged in', async () => {
    const mockGetSession = jest.fn().mockResolvedValue(null);
    const { status, body } = await handleConnectAccount({ req: {}, params: { platform: 'github' }, getSession: mockGetSession });
    expect(status).toBe(401);
    expect(body.error).toBe('Unauthorized');
  });

  it('handleConnectAccount: should return 400 if platform is missing', async () => {
    const mockGetSession = jest.fn().mockResolvedValue({ user: { id: 'user1' } });
    const { status, body } = await handleConnectAccount({ req: {}, params: { platform: '' }, getSession: mockGetSession });
    expect(status).toBe(400);
    expect(body.error).toBe('Platform is required');
  });

  it('handleConnectAccount: should return 400 if platform is unsupported', async () => {
    const mockGetSession = jest.fn().mockResolvedValue({ user: { id: 'user1' } });
    const { status, body } = await handleConnectAccount({ req: {}, params: { platform: 'facebook' }, getSession: mockGetSession });
    expect(status).toBe(400);
    expect(body.error).toBe('Unsupported platform');
  });

  it('handleConnectAccount: should return sign-in URL for supported provider', async () => {
    const mockGetSession = jest.fn().mockResolvedValue({ user: { id: 'user1' } });
    const { status, body } = await handleConnectAccount({ req: {}, params: { platform: 'github' }, getSession: mockGetSession });
    expect(status).toBe(200);
    expect(body.url).toContain('/api/auth/signin/github');
  });

  // Pure logic tests for handleDeleteSocialAccount
  it('handleDeleteSocialAccount: should return unauthorized if not logged in', async () => {
    const mockGetSession = jest.fn().mockResolvedValue(null);
    const mockPrisma = { socialAccount: { findUnique: jest.fn(), delete: jest.fn() }, $disconnect: jest.fn() };
    const { status, body } = await handleDeleteSocialAccount({ req: {}, params: { accountId: 's1' }, getSession: mockGetSession, prisma: mockPrisma });
    expect(status).toBe(401);
    expect(body.error).toBe('Unauthorized');
  });

  it('handleDeleteSocialAccount: should return 400 if accountId is missing', async () => {
    const mockGetSession = jest.fn().mockResolvedValue({ user: { id: 'user1' } });
    const mockPrisma = { socialAccount: { findUnique: jest.fn(), delete: jest.fn() }, $disconnect: jest.fn() };
    const { status, body } = await handleDeleteSocialAccount({ req: {}, params: { accountId: '' }, getSession: mockGetSession, prisma: mockPrisma });
    expect(status).toBe(400);
    expect(body.error).toBe('Account ID is required');
  });

  it('handleDeleteSocialAccount: should return 404 if account not found', async () => {
    const mockGetSession = jest.fn().mockResolvedValue({ user: { id: 'user1' } });
    const mockPrisma = { socialAccount: { findUnique: jest.fn().mockResolvedValue(null), delete: jest.fn() }, $disconnect: jest.fn() };
    const { status, body } = await handleDeleteSocialAccount({ req: {}, params: { accountId: 's1' }, getSession: mockGetSession, prisma: mockPrisma });
    expect(status).toBe(404);
    expect(body.error).toBe('Account not found');
  });

  it('handleDeleteSocialAccount: should return 403 if account not owned', async () => {
    const mockGetSession = jest.fn().mockResolvedValue({ user: { id: 'user1' } });
    const mockPrisma = { socialAccount: { findUnique: jest.fn().mockResolvedValue({ userId: 'other' }), delete: jest.fn() }, $disconnect: jest.fn() };
    const { status, body } = await handleDeleteSocialAccount({ req: {}, params: { accountId: 's1' }, getSession: mockGetSession, prisma: mockPrisma });
    expect(status).toBe(403);
    expect(body.error).toBe('Forbidden');
  });

  it('handleDeleteSocialAccount: should succeed if account is owned', async () => {
    const mockGetSession = jest.fn().mockResolvedValue({ user: { id: 'user1' } });
    const mockPrisma = { socialAccount: { findUnique: jest.fn().mockResolvedValue({ userId: 'user1' }), delete: jest.fn().mockResolvedValue({}) }, $disconnect: jest.fn() };
    const { status, body } = await handleDeleteSocialAccount({ req: {}, params: { accountId: 's1' }, getSession: mockGetSession, prisma: mockPrisma });
    expect(status).toBe(200);
    expect(body.message).toBe('Account disconnected successfully');
  });
}); 