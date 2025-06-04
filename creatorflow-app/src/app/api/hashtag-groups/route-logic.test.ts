import {
  handleGetHashtagGroups,
  handleCreateHashtagGroup,
  handleUpdateHashtagGroup,
  handleDeleteHashtagGroup,
  handlePatchHashtagGroup,
} from './route-logic';

describe('HashtagGroup CRUD logic', () => {
  const userId = 'user1';
  const baseSession = { user: { id: userId } };
  let prisma: any;
  let getSession: any;
  let req: any;

  beforeEach(() => {
    prisma = {
      hashtagGroup: {
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
    getSession = jest.fn().mockResolvedValue(baseSession);
    req = { json: jest.fn() };
  });

  describe('handleGetHashtagGroups', () => {
    it('returns 401 if not authorized', async () => {
      getSession = jest.fn().mockResolvedValue(null);
      const res = await handleGetHashtagGroups({ req, getSession, prisma });
      expect(res.status).toBe(401);
    });
    it('returns groups for user', async () => {
      prisma.hashtagGroup.findMany.mockResolvedValue([{ id: 'grp1' }]);
      const res = await handleGetHashtagGroups({ req, getSession, prisma });
      expect(res.status).toBe(200);
      expect(res.body[0].id).toBe('grp1');
    });
  });

  describe('handleCreateHashtagGroup', () => {
    it('returns 401 if not authorized', async () => {
      getSession = jest.fn().mockResolvedValue(null);
      req.json.mockResolvedValue({ name: 'A', hashtags: ['#x'] });
      const res = await handleCreateHashtagGroup({ req, getSession, prisma });
      expect(res.status).toBe(401);
    });
    it('returns 400 if missing name/hashtags', async () => {
      req.json.mockResolvedValue({});
      const res = await handleCreateHashtagGroup({ req, getSession, prisma });
      expect(res.status).toBe(400);
    });
    it('returns 400 if hashtags is not array', async () => {
      req.json.mockResolvedValue({ name: 'A', hashtags: 'notarray' });
      const res = await handleCreateHashtagGroup({ req, getSession, prisma });
      expect(res.status).toBe(400);
    });
    it('creates group', async () => {
      req.json.mockResolvedValue({ name: 'A', hashtags: ['#x'], category: 'C', tags: ['x'] });
      prisma.hashtagGroup.create.mockResolvedValue({ id: 'grp1' });
      const res = await handleCreateHashtagGroup({ req, getSession, prisma });
      expect(res.status).toBe(201);
      expect(res.body.id).toBe('grp1');
    });
  });

  describe('handleUpdateHashtagGroup', () => {
    it('returns 401 if not authorized', async () => {
      getSession = jest.fn().mockResolvedValue(null);
      req.json.mockResolvedValue({ id: 'grp1', name: 'A', hashtags: ['#x'] });
      const res = await handleUpdateHashtagGroup({ req, getSession, prisma });
      expect(res.status).toBe(401);
    });
    it('returns 400 if missing id', async () => {
      req.json.mockResolvedValue({});
      const res = await handleUpdateHashtagGroup({ req, getSession, prisma });
      expect(res.status).toBe(400);
    });
    it('updates group', async () => {
      req.json.mockResolvedValue({ id: 'grp1', name: 'A', hashtags: ['#x'], category: 'C', tags: ['x'] });
      prisma.hashtagGroup.update.mockResolvedValue({ id: 'grp1' });
      const res = await handleUpdateHashtagGroup({ req, getSession, prisma });
      expect(res.status).toBe(200);
      expect(res.body.id).toBe('grp1');
    });
  });

  describe('handleDeleteHashtagGroup', () => {
    it('returns 401 if not authorized', async () => {
      getSession = jest.fn().mockResolvedValue(null);
      req.json.mockResolvedValue({ id: 'grp1' });
      const res = await handleDeleteHashtagGroup({ req, getSession, prisma });
      expect(res.status).toBe(401);
    });
    it('returns 400 if missing id', async () => {
      req.json.mockResolvedValue({});
      const res = await handleDeleteHashtagGroup({ req, getSession, prisma });
      expect(res.status).toBe(400);
    });
    it('deletes group', async () => {
      req.json.mockResolvedValue({ id: 'grp1' });
      prisma.hashtagGroup.delete.mockResolvedValue({});
      const res = await handleDeleteHashtagGroup({ req, getSession, prisma });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('handlePatchHashtagGroup', () => {
    it('returns 401 if not authorized', async () => {
      getSession = jest.fn().mockResolvedValue(null);
      req.json.mockResolvedValue({ id: 'grp1', isFavorite: true });
      const res = await handlePatchHashtagGroup({ req, getSession, prisma });
      expect(res.status).toBe(401);
    });
    it('returns 400 if missing id', async () => {
      req.json.mockResolvedValue({});
      const res = await handlePatchHashtagGroup({ req, getSession, prisma });
      expect(res.status).toBe(400);
    });
    it('returns 400 if no fields to update', async () => {
      req.json.mockResolvedValue({ id: 'grp1' });
      const res = await handlePatchHashtagGroup({ req, getSession, prisma });
      expect(res.status).toBe(400);
    });
    it('patches favorite/pinned', async () => {
      req.json.mockResolvedValue({ id: 'grp1', isFavorite: true, isPinned: false });
      prisma.hashtagGroup.update.mockResolvedValue({ id: 'grp1', isFavorite: true, isPinned: false });
      const res = await handlePatchHashtagGroup({ req, getSession, prisma });
      expect(res.status).toBe(200);
      expect(res.body.isFavorite).toBe(true);
      expect(res.body.isPinned).toBe(false);
    });
  });
}); 