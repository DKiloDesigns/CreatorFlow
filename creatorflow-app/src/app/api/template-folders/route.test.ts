import {
  handleGetFolders,
  handleCreateFolder,
  handleUpdateFolder,
  handleDeleteFolder,
} from './route';

jest.mock('@auth/prisma-adapter', () => ({ PrismaAdapter: jest.fn() }));

describe('TemplateFolder CRUD logic', () => {
  const userId = 'user1';
  const baseSession = { user: { id: userId } };
  let prisma: any;
  let getSession: any;
  let req: any;

  beforeEach(() => {
    prisma = {
      templateFolder: {
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
    getSession = jest.fn().mockResolvedValue(baseSession);
    req = { json: jest.fn() };
  });

  describe('handleGetFolders', () => {
    it('returns 401 if not authorized', async () => {
      getSession = jest.fn().mockResolvedValue(null);
      const res = await handleGetFolders({ req, getSession, prisma });
      expect(res.status).toBe(401);
    });
    it('returns folders for user', async () => {
      prisma.templateFolder.findMany.mockResolvedValue([{ id: 'fld1' }]);
      const res = await handleGetFolders({ req, getSession, prisma });
      expect(res.status).toBe(200);
      expect(res.body[0].id).toBe('fld1');
    });
  });

  describe('handleCreateFolder', () => {
    it('returns 401 if not authorized', async () => {
      getSession = jest.fn().mockResolvedValue(null);
      req.json.mockResolvedValue({ name: 'A' });
      const res = await handleCreateFolder({ req, getSession, prisma });
      expect(res.status).toBe(401);
    });
    it('returns 400 if missing name', async () => {
      req.json.mockResolvedValue({});
      const res = await handleCreateFolder({ req, getSession, prisma });
      expect(res.status).toBe(400);
    });
    it('creates folder', async () => {
      req.json.mockResolvedValue({ name: 'A', parentId: 'p1' });
      prisma.templateFolder.create.mockResolvedValue({ id: 'fld1' });
      const res = await handleCreateFolder({ req, getSession, prisma });
      expect(res.status).toBe(201);
      expect(res.body.id).toBe('fld1');
    });
  });

  describe('handleUpdateFolder', () => {
    it('returns 401 if not authorized', async () => {
      getSession = jest.fn().mockResolvedValue(null);
      req.json.mockResolvedValue({ id: 'fld1', name: 'A' });
      const res = await handleUpdateFolder({ req, getSession, prisma });
      expect(res.status).toBe(401);
    });
    it('returns 400 if missing id', async () => {
      req.json.mockResolvedValue({});
      const res = await handleUpdateFolder({ req, getSession, prisma });
      expect(res.status).toBe(400);
    });
    it('updates folder', async () => {
      req.json.mockResolvedValue({ id: 'fld1', name: 'A', parentId: 'p1' });
      prisma.templateFolder.update.mockResolvedValue({ id: 'fld1' });
      const res = await handleUpdateFolder({ req, getSession, prisma });
      expect(res.status).toBe(200);
      expect(res.body.id).toBe('fld1');
    });
  });

  describe('handleDeleteFolder', () => {
    it('returns 401 if not authorized', async () => {
      getSession = jest.fn().mockResolvedValue(null);
      req.json.mockResolvedValue({ id: 'fld1' });
      const res = await handleDeleteFolder({ req, getSession, prisma });
      expect(res.status).toBe(401);
    });
    it('returns 400 if missing id', async () => {
      req.json.mockResolvedValue({});
      const res = await handleDeleteFolder({ req, getSession, prisma });
      expect(res.status).toBe(400);
    });
    it('deletes folder', async () => {
      req.json.mockResolvedValue({ id: 'fld1' });
      prisma.templateFolder.delete.mockResolvedValue({});
      const res = await handleDeleteFolder({ req, getSession, prisma });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
}); 