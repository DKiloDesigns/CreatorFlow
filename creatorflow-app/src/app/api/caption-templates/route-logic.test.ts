import {
  handleGetCaptionTemplates,
  handleCreateCaptionTemplate,
  handleUpdateCaptionTemplate,
  handleDeleteCaptionTemplate,
  handlePatchCaptionTemplate,
} from './route-logic';

describe('CaptionTemplate CRUD logic', () => {
  const userId = 'user1';
  const baseSession = { user: { id: userId } };
  let prisma: any;
  let getSession: any;
  let req: any;

  beforeEach(() => {
    prisma = {
      captionTemplate: {
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
    getSession = jest.fn().mockResolvedValue(baseSession);
    req = { json: jest.fn() };
  });

  describe('handleGetCaptionTemplates', () => {
    it('returns 401 if not authorized', async () => {
      getSession = jest.fn().mockResolvedValue(null);
      const res = await handleGetCaptionTemplates({ req, getSession, prisma });
      expect(res.status).toBe(401);
    });
    it('returns templates for user', async () => {
      prisma.captionTemplate.findMany.mockResolvedValue([{ id: 'tpl1' }]);
      const res = await handleGetCaptionTemplates({ req, getSession, prisma });
      expect(res.status).toBe(200);
      expect(res.body[0].id).toBe('tpl1');
    });
  });

  describe('handleCreateCaptionTemplate', () => {
    it('returns 401 if not authorized', async () => {
      getSession = jest.fn().mockResolvedValue(null);
      req.json.mockResolvedValue({ name: 'A', content: 'B' });
      const res = await handleCreateCaptionTemplate({ req, getSession, prisma });
      expect(res.status).toBe(401);
    });
    it('returns 400 if missing name/content', async () => {
      req.json.mockResolvedValue({});
      const res = await handleCreateCaptionTemplate({ req, getSession, prisma });
      expect(res.status).toBe(400);
    });
    it('creates template', async () => {
      req.json.mockResolvedValue({ name: 'A', content: 'B', category: 'C', tags: ['x'] });
      prisma.captionTemplate.create.mockResolvedValue({ id: 'tpl1' });
      const res = await handleCreateCaptionTemplate({ req, getSession, prisma });
      expect(res.status).toBe(201);
      expect(res.body.id).toBe('tpl1');
    });
  });

  describe('handleUpdateCaptionTemplate', () => {
    it('returns 401 if not authorized', async () => {
      getSession = jest.fn().mockResolvedValue(null);
      req.json.mockResolvedValue({ id: 'tpl1', name: 'A', content: 'B' });
      const res = await handleUpdateCaptionTemplate({ req, getSession, prisma });
      expect(res.status).toBe(401);
    });
    it('returns 400 if missing id', async () => {
      req.json.mockResolvedValue({});
      const res = await handleUpdateCaptionTemplate({ req, getSession, prisma });
      expect(res.status).toBe(400);
    });
    it('updates template', async () => {
      req.json.mockResolvedValue({ id: 'tpl1', name: 'A', content: 'B', category: 'C', tags: ['x'] });
      prisma.captionTemplate.update.mockResolvedValue({ id: 'tpl1' });
      const res = await handleUpdateCaptionTemplate({ req, getSession, prisma });
      expect(res.status).toBe(200);
      expect(res.body.id).toBe('tpl1');
    });
  });

  describe('handleDeleteCaptionTemplate', () => {
    it('returns 401 if not authorized', async () => {
      getSession = jest.fn().mockResolvedValue(null);
      req.json.mockResolvedValue({ id: 'tpl1' });
      const res = await handleDeleteCaptionTemplate({ req, getSession, prisma });
      expect(res.status).toBe(401);
    });
    it('returns 400 if missing id', async () => {
      req.json.mockResolvedValue({});
      const res = await handleDeleteCaptionTemplate({ req, getSession, prisma });
      expect(res.status).toBe(400);
    });
    it('deletes template', async () => {
      req.json.mockResolvedValue({ id: 'tpl1' });
      prisma.captionTemplate.delete.mockResolvedValue({});
      const res = await handleDeleteCaptionTemplate({ req, getSession, prisma });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('handlePatchCaptionTemplate', () => {
    it('returns 401 if not authorized', async () => {
      getSession = jest.fn().mockResolvedValue(null);
      req.json.mockResolvedValue({ id: 'tpl1', isFavorite: true });
      const res = await handlePatchCaptionTemplate({ req, getSession, prisma });
      expect(res.status).toBe(401);
    });
    it('returns 400 if missing id', async () => {
      req.json.mockResolvedValue({});
      const res = await handlePatchCaptionTemplate({ req, getSession, prisma });
      expect(res.status).toBe(400);
    });
    it('returns 400 if no fields to update', async () => {
      req.json.mockResolvedValue({ id: 'tpl1' });
      const res = await handlePatchCaptionTemplate({ req, getSession, prisma });
      expect(res.status).toBe(400);
    });
    it('patches favorite/pinned', async () => {
      req.json.mockResolvedValue({ id: 'tpl1', isFavorite: true, isPinned: false });
      prisma.captionTemplate.update.mockResolvedValue({ id: 'tpl1', isFavorite: true, isPinned: false });
      const res = await handlePatchCaptionTemplate({ req, getSession, prisma });
      expect(res.status).toBe(200);
      expect(res.body.isFavorite).toBe(true);
      expect(res.body.isPinned).toBe(false);
    });
  });
}); 