import { handleGetSuggestions } from './route-logic';

describe('handleGetSuggestions', () => {
  const userId = 'user1';
  const baseSession = { user: { id: userId } };
  let prisma: any;
  let getSession: any;
  let req: any;

  beforeEach(() => {
    prisma = {
      templateUsage: {
        findMany: jest.fn(),
      },
      captionTemplate: {
        findMany: jest.fn(),
      },
    };
    getSession = jest.fn().mockResolvedValue(baseSession);
    req = { url: 'http://x' };
  });

  it('returns 401 if not authorized', async () => {
    getSession = jest.fn().mockResolvedValue(null);
    const res = await handleGetSuggestions({ req, getSession, prisma });
    expect(res.status).toBe(401);
  });

  it('returns recent suggestions if recent param is true and recent usages exist', async () => {
    req = { url: 'http://x?recent=true' };
    prisma.templateUsage.findMany.mockResolvedValue([
      { captionTemplateId: 'tpl1' },
      { captionTemplateId: 'tpl2' },
    ]);
    prisma.captionTemplate.findMany.mockResolvedValue([
      { id: 'tpl1' },
      { id: 'tpl2' },
    ]);
    const res = await handleGetSuggestions({ req, getSession, prisma });
    expect(prisma.templateUsage.findMany).toHaveBeenCalled();
    expect(prisma.captionTemplate.findMany).toHaveBeenCalledWith({ where: { id: { in: ['tpl1', 'tpl2'] } } });
    expect(res.status).toBe(200);
    expect(res.body.length).toBeLessThanOrEqual(5);
  });

  it('returns fallback suggestions if no recent usages', async () => {
    req = { url: 'http://x?recent=true' };
    prisma.templateUsage.findMany.mockResolvedValue([]);
    prisma.captionTemplate.findMany.mockResolvedValue([{ id: 'tpl3' }]);
    const res = await handleGetSuggestions({ req, getSession, prisma });
    expect(res.status).toBe(200);
    expect(res.body[0].id).toBe('tpl3');
  });

  it('filters by category if category param is present', async () => {
    req = { url: 'http://x?category=marketing' };
    prisma.captionTemplate.findMany.mockResolvedValue([{ id: 'tpl4', category: 'marketing' }]);
    const res = await handleGetSuggestions({ req, getSession, prisma });
    expect(prisma.captionTemplate.findMany).toHaveBeenCalledWith({
      where: { userId, category: 'marketing' },
      orderBy: [ { updatedAt: 'desc' } ],
      take: 5,
    });
    expect(res.status).toBe(200);
    expect(res.body[0].category).toBe('marketing');
  });

  it('returns 500 on error', async () => {
    prisma.captionTemplate.findMany.mockRejectedValue(new Error('fail'));
    const res = await handleGetSuggestions({ req, getSession, prisma });
    expect(res.status).toBe(500);
    expect(res.body.error).toMatch(/Internal Server Error/);
  });
}); 