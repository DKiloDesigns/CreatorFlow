import { handleRecordCaptionTemplateUsage, handleGetCaptionTemplateUsage } from './route-logic';

describe('handleRecordCaptionTemplateUsage', () => {
  const userId = 'user1';
  const baseSession = { user: { id: userId } };
  const baseTemplate = {
    id: 'tpl1',
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
      captionTemplate: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      templateUsage: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
    };
    getSession = jest.fn().mockResolvedValue(baseSession);
    req = { json: jest.fn(), url: 'http://x?templateId=tpl1' };
  });

  it('returns 401 if not authorized', async () => {
    getSession = jest.fn().mockResolvedValue(null);
    req.json.mockResolvedValue({ templateId: 'tpl1' });
    const res = await handleRecordCaptionTemplateUsage({ req, getSession, prisma });
    expect(res.status).toBe(401);
  });

  it('returns 400 if templateId missing', async () => {
    req.json.mockResolvedValue({});
    const res = await handleRecordCaptionTemplateUsage({ req, getSession, prisma });
    expect(res.status).toBe(400);
  });

  it('returns 404 if template not found', async () => {
    req.json.mockResolvedValue({ templateId: 'tpl1' });
    prisma.captionTemplate.findUnique.mockResolvedValue(null);
    const res = await handleRecordCaptionTemplateUsage({ req, getSession, prisma });
    expect(res.status).toBe(404);
  });

  it('returns 403 if not yet active', async () => {
    req.json.mockResolvedValue({ templateId: 'tpl1' });
    prisma.captionTemplate.findUnique.mockResolvedValue({ ...baseTemplate, activeFrom: new Date(Date.now() + 10000) });
    const res = await handleRecordCaptionTemplateUsage({ req, getSession, prisma });
    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/not yet active/);
  });

  it('returns 403 if expired', async () => {
    req.json.mockResolvedValue({ templateId: 'tpl1' });
    prisma.captionTemplate.findUnique.mockResolvedValue({ ...baseTemplate, activeTo: new Date(Date.now() - 10000) });
    const res = await handleRecordCaptionTemplateUsage({ req, getSession, prisma });
    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/expired/);
  });

  it('returns 403 if usage limit reached', async () => {
    req.json.mockResolvedValue({ templateId: 'tpl1' });
    prisma.captionTemplate.findUnique.mockResolvedValue({ ...baseTemplate, usageLimit: 2, usageCount: 2 });
    const res = await handleRecordCaptionTemplateUsage({ req, getSession, prisma });
    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/limit/);
  });

  it('increments usageCount and records usage on success', async () => {
    req.json.mockResolvedValue({ templateId: 'tpl1', action: 'insert', type: 'caption' });
    prisma.captionTemplate.findUnique.mockResolvedValue({ ...baseTemplate });
    prisma.captionTemplate.update.mockResolvedValue({});
    prisma.templateUsage.create.mockResolvedValue({ id: 'usage1' });
    const res = await handleRecordCaptionTemplateUsage({ req, getSession, prisma });
    expect(prisma.captionTemplate.update).toHaveBeenCalledWith({ where: { id: 'tpl1' }, data: { usageCount: { increment: 1 } } });
    expect(prisma.templateUsage.create).toHaveBeenCalledWith({ data: { captionTemplateId: 'tpl1', userId, action: 'insert', type: 'caption' } });
    expect(res.status).toBe(201);
    expect(res.body.id).toBe('usage1');
  });
});

describe('handleGetCaptionTemplateUsage', () => {
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
    req = { url: 'http://x?templateId=tpl1' };
  });

  it('returns 401 if not authorized', async () => {
    getSession = jest.fn().mockResolvedValue(null);
    const res = await handleGetCaptionTemplateUsage({ req, getSession, prisma });
    expect(res.status).toBe(401);
  });

  it('returns 400 if templateId missing', async () => {
    req = { url: 'http://x' };
    const res = await handleGetCaptionTemplateUsage({ req, getSession, prisma });
    expect(res.status).toBe(400);
  });

  it('returns usage stats and history', async () => {
    const usages = [
      { id: 'u1', userId: 'user1', usedAt: new Date(), action: 'insert' },
      { id: 'u2', userId: 'user2', usedAt: new Date(), action: 'insert' },
      { id: 'u3', userId: 'user1', usedAt: new Date(), action: 'insert' },
    ];
    prisma.templateUsage.findMany.mockResolvedValue(usages);
    const res = await handleGetCaptionTemplateUsage({ req, getSession, prisma });
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