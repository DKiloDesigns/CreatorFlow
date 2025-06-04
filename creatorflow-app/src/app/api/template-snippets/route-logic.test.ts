import {
  handleGetSnippets,
  handleCreateSnippet,
  handleUpdateSnippet,
  handleDeleteSnippet,
} from './route-logic';

describe('TemplateSnippet CRUD logic', () => {
  const userId = 'user1';
  const baseSession = { user: { id: userId } };
  let prisma: any;
  let getSession: any;
  let req: any;

  beforeEach(() => {
    prisma = {
      templateSnippet: {
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
    getSession = jest.fn().mockResolvedValue(baseSession);
    req = { json: jest.fn() };
  });

  describe('handleGetSnippets', () => {
    it('returns 401 if not authorized', async () => {
      getSession = jest.fn().mockResolvedValue(null);
      const res = await handleGetSnippets({ req, getSession, prisma });
      expect(res.status).toBe(401);
    });
    it('returns snippets for user', async () => {
      prisma.templateSnippet.findMany.mockResolvedValue([{ id: 'snip1' }]);
      const res = await handleGetSnippets({ req, getSession, prisma });
      expect(res.status).toBe(200);
      expect(res.body[0].id).toBe('snip1');
    });
  });

  describe('handleCreateSnippet', () => {
    it('returns 401 if not authorized', async () => {
      getSession = jest.fn().mockResolvedValue(null);
      req.json.mockResolvedValue({ name: 'A', content: 'B' });
      const res = await handleCreateSnippet({ req, getSession, prisma });
      expect(res.status).toBe(401);
    });
    it('returns 400 if missing name/content', async () => {
      req.json.mockResolvedValue({});
      const res = await handleCreateSnippet({ req, getSession, prisma });
      expect(res.status).toBe(400);
    });
    it('creates snippet', async () => {
      req.json.mockResolvedValue({ name: 'A', content: 'B' });
      prisma.templateSnippet.create.mockResolvedValue({ id: 'snip1' });
      const res = await handleCreateSnippet({ req, getSession, prisma });
      expect(res.status).toBe(201);
      expect(res.body.id).toBe('snip1');
    });
  });

  describe('handleUpdateSnippet', () => {
    it('returns 401 if not authorized', async () => {
      getSession = jest.fn().mockResolvedValue(null);
      req.json.mockResolvedValue({ id: 'snip1', name: 'A', content: 'B' });
      const res = await handleUpdateSnippet({ req, getSession, prisma });
      expect(res.status).toBe(401);
    });
    it('returns 400 if missing fields', async () => {
      req.json.mockResolvedValue({});
      const res = await handleUpdateSnippet({ req, getSession, prisma });
      expect(res.status).toBe(400);
    });
    it('updates snippet', async () => {
      req.json.mockResolvedValue({ id: 'snip1', name: 'A', content: 'B' });
      prisma.templateSnippet.update.mockResolvedValue({ id: 'snip1' });
      const res = await handleUpdateSnippet({ req, getSession, prisma });
      expect(res.status).toBe(200);
      expect(res.body.id).toBe('snip1');
    });
  });

  describe('handleDeleteSnippet', () => {
    it('returns 401 if not authorized', async () => {
      getSession = jest.fn().mockResolvedValue(null);
      req.json.mockResolvedValue({ id: 'snip1' });
      const res = await handleDeleteSnippet({ req, getSession, prisma });
      expect(res.status).toBe(401);
    });
    it('returns 400 if missing id', async () => {
      req.json.mockResolvedValue({});
      const res = await handleDeleteSnippet({ req, getSession, prisma });
      expect(res.status).toBe(400);
    });
    it('deletes snippet', async () => {
      req.json.mockResolvedValue({ id: 'snip1' });
      prisma.templateSnippet.delete.mockResolvedValue({});
      const res = await handleDeleteSnippet({ req, getSession, prisma });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
}); 