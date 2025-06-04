import { handleRecordHashtagGroupUsage, handleGetHashtagGroupUsage } from './route-logic';

describe('handleRecordHashtagGroupUsage', () => {
  const userId = 'user1';
  const baseSession = { user: { id: userId } };
  const baseGroup = {
    id: 'grp1',
    activeFrom: null,
    activeTo: null,
    usageLimit: null,
    usageCount: 0,
  };
  let prisma: any;
  let getSession: any;
  let req: any;

  beforeEach(() => {
    prisma = {
      hashtagGroup: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      templateUsage: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
    };
    getSession = jest.fn().mockResolvedValue(baseSession);
    req = { json: jest.fn(), url: 'http://x?groupId=grp1' };
  });

  it('returns 401 if not authorized', async () => {
    getSession = jest.fn().mockResolvedValue(null);
    req.json.mockResolvedValue({ groupId: 'grp1' });
    const res = await handleRecordHashtagGroupUsage({ req, getSession, prisma });
    expect(res.status).toBe(401);
  });

  it('returns 400 if groupId missing', async () => {
    req.json.mockResolvedValue({});
    const res = await handleRecordHashtagGroupUsage({ req, getSession, prisma });
    expect(res.status).toBe(400);
  });

  it('returns 404 if group not found', async () => {
    req.json.mockResolvedValue({ groupId: 'grp1' });
    prisma.hashtagGroup.findUnique.mockResolvedValue(null);
    const res = await handleRecordHashtagGroupUsage({ req, getSession, prisma });
    expect(res.status).toBe(404);
  });

  it('returns 403 if not yet active', async () => {
    req.json.mockResolvedValue({ groupId: 'grp1' });
    prisma.hashtagGroup.findUnique.mockResolvedValue({ ...baseGroup, activeFrom: new Date(Date.now() + 10000) });
    const res = await handleRecordHashtagGroupUsage({ req, getSession, prisma });
    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/not yet active/);
  });

  it('returns 403 if expired', async () => {
    req.json.mockResolvedValue({ groupId: 'grp1' });
    prisma.hashtagGroup.findUnique.mockResolvedValue({ ...baseGroup, activeTo: new Date(Date.now() - 10000) });
    const res = await handleRecordHashtagGroupUsage({ req, getSession, prisma });
    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/expired/);
  });

  it('returns 403 if usage limit reached', async () => {
    req.json.mockResolvedValue({ groupId: 'grp1' });
    prisma.hashtagGroup.findUnique.mockResolvedValue({ ...baseGroup, usageLimit: 2, usageCount: 2 });
    const res = await handleRecordHashtagGroupUsage({ req, getSession, prisma });
    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/limit/);
  });

  it('increments usageCount and records usage on success', async () => {
    req.json.mockResolvedValue({ groupId: 'grp1', action: 'insert', type: 'hashtag' });
    prisma.hashtagGroup.findUnique.mockResolvedValue({ ...baseGroup });
    prisma.hashtagGroup.update.mockResolvedValue({});
    prisma.templateUsage.create.mockResolvedValue({ id: 'usage1' });
    const res = await handleRecordHashtagGroupUsage({ req, getSession, prisma });
    expect(prisma.hashtagGroup.update).toHaveBeenCalledWith({ where: { id: 'grp1' }, data: { usageCount: { increment: 1 } } });
    expect(prisma.templateUsage.create).toHaveBeenCalledWith({ data: { hashtagGroupId: 'grp1', userId, action: 'insert', type: 'hashtag' } });
    expect(res.status).toBe(201);
    expect(res.body.id).toBe('usage1');
  });
});

describe('handleGetHashtagGroupUsage', () => {
  const userId = 'user1';
  let prisma: any;
  let getSession: any;
  let req: any;

  beforeEach(() => {
    prisma = {
      templateUsage: {
        findMany: jest.fn(),
      },
    };
    getSession = jest.fn().mockResolvedValue({ user: { id: userId } });
    req = { url: 'http://x?groupId=grp1' };
  });

  it('returns 401 if not authorized', async () => {
    getSession = jest.fn().mockResolvedValue(null);
    const res = await handleGetHashtagGroupUsage({ req, getSession, prisma });
    expect(res.status).toBe(401);
  });

  it('returns 400 if groupId missing', async () => {
    req = { url: 'http://x' };
    const res = await handleGetHashtagGroupUsage({ req, getSession, prisma });
    expect(res.status).toBe(400);
  });

  it('returns usage stats and history', async () => {
    const usages = [
      { id: 'u1', userId: 'user1', usedAt: new Date(), action: 'insert' },
      { id: 'u2', userId: 'user2', usedAt: new Date(), action: 'insert' },
      { id: 'u3', userId: 'user1', usedAt: new Date(), action: 'insert' },
    ];
    prisma.templateUsage.findMany.mockResolvedValue(usages);
    const res = await handleGetHashtagGroupUsage({ req, getSession, prisma });
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(3);
    expect(res.body.perUser).toBeDefined();
    if (res.body.perUser) {
      expect(res.body.perUser.user1).toBe(2);
      expect(res.body.perUser.user2).toBe(1);
    }
    expect(res.body.history.length).toBe(3);
  });
}); 