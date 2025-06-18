import { expect, jest } from '@jest/globals';
import {
  handleGetFolders,
  handleCreateFolder,
  handleUpdateFolder,
  handleDeleteFolder,
  handleShareFolder,
  handleUnshareFolder,
  handleGetFolderTree,
  handleRestoreFolder,
} from './route-logic';

jest.mock('@auth/prisma-adapter', () => ({ PrismaAdapter: jest.fn() }));

describe('TemplateFolder CRUD logic', () => {
  const mockUserId = 'test-user';
  const mockSession = { user: { id: mockUserId } };
  const mockGetSession: any = jest.fn();
  (mockGetSession as any).mockResolvedValue(mockSession);
  const mockPrisma = {
    templateFolder: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
    },
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('handleGetFolders', () => {
    it('returns folders for user', async () => {
      const mockFolders = [{ id: 'fld1', name: 'Test Folder' }];
      mockPrisma.templateFolder.findMany.mockResolvedValue(mockFolders);
      
      const req = { url: 'http://localhost:3000/api/template-folders' } as any;
      const res = await handleGetFolders({ req, getSession: mockGetSession as () => Promise<any>, prisma: mockPrisma });
      
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.data[0].id).toBe('fld1');
      expect(mockPrisma.templateFolder.findMany).toHaveBeenCalled();
    });

    it('returns tree structure when tree=true', async () => {
      const mockFolders = [
        { id: 'fld1', name: 'Parent', parentId: null },
        { id: 'fld2', name: 'Child', parentId: 'fld1' }
      ];
      mockPrisma.templateFolder.findMany.mockResolvedValue(mockFolders);
      
      const req = { url: 'http://localhost:3000/api/template-folders?tree=true' } as any;
      const res = await handleGetFolders({ req, getSession: mockGetSession as () => Promise<any>, prisma: mockPrisma });
      
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.data).toHaveLength(1); // Only root folders
      expect(data.data[0].children).toHaveLength(1); // Child folder
    });

    it('returns 401 if unauthorized', async () => {
      (mockGetSession as any).mockResolvedValueOnce(null);
      
      const req = { url: 'http://localhost:3000/api/template-folders' } as any;
      const res = await handleGetFolders({ req, getSession: mockGetSession as () => Promise<any>, prisma: mockPrisma });
      
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toBe('Unauthorized');
    });
  });

  describe('handleGetFolderTree', () => {
    it('returns hierarchical folder structure', async () => {
      const mockFolders = [
        { id: 'fld1', name: 'Parent', parentId: null },
        { id: 'fld2', name: 'Child', parentId: 'fld1' },
        { id: 'fld3', name: 'Grandchild', parentId: 'fld2' }
      ];
      mockPrisma.templateFolder.findMany.mockResolvedValue(mockFolders);
      
      const req = { url: 'http://localhost:3000/api/template-folders' } as any;
      const res = await handleGetFolderTree({ req, getSession: mockGetSession as () => Promise<any>, prisma: mockPrisma });
      
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.data).toHaveLength(1); // Only root folders
      expect(data.data[0].children).toHaveLength(1); // Child folder
      expect(data.data[0].children[0].children).toHaveLength(1); // Grandchild folder
    });

    it('returns 401 if unauthorized', async () => {
      (mockGetSession as any).mockResolvedValueOnce(null);
      
      const req = { url: 'http://localhost:3000/api/template-folders' } as any;
      const res = await handleGetFolderTree({ req, getSession: mockGetSession as () => Promise<any>, prisma: mockPrisma });
      
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toBe('Unauthorized');
    });
  });

  describe('handleCreateFolder', () => {
    it('creates folder', async () => {
      const mockFolder = { id: 'fld1', name: 'Test Folder' };
      mockPrisma.templateFolder.create.mockResolvedValue(mockFolder);
      
      const req = { json: async () => ({ name: 'Test Folder' }) } as any;
      const res = await handleCreateFolder({ req, getSession: mockGetSession as () => Promise<any>, prisma: mockPrisma });
      
      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.data.id).toBe('fld1');
      expect(mockPrisma.templateFolder.create).toHaveBeenCalled();
    });

    it('returns 400 if name missing', async () => {
      const req = { json: async () => ({}) } as any;
      const res = await handleCreateFolder({ req, getSession: mockGetSession as () => Promise<any>, prisma: mockPrisma });
      
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe('Name required');
    });
  });

  describe('handleUpdateFolder', () => {
    it('updates folder name', async () => {
      const mockFolder = { id: 'fld1', name: 'Updated Folder' };
      mockPrisma.templateFolder.findUnique.mockResolvedValue(mockFolder);
      mockPrisma.templateFolder.update.mockResolvedValue(mockFolder);
      
      const req = { json: async () => ({ id: 'fld1', name: 'Updated Folder' }) } as any;
      const res = await handleUpdateFolder({ req, getSession: mockGetSession as () => Promise<any>, prisma: mockPrisma });
      
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.data.id).toBe('fld1');
      expect(mockPrisma.templateFolder.update).toHaveBeenCalled();
    });

    it('moves folder to new parent', async () => {
      const mockFolder = { id: 'fld1', name: 'Test Folder', parentId: null };
      const mockParentFolder = { id: 'parent1', name: 'Parent Folder' };
      mockPrisma.templateFolder.findUnique
        .mockResolvedValueOnce(mockFolder) // First call for the folder
        .mockResolvedValueOnce(mockParentFolder); // Second call for the parent
      mockPrisma.templateFolder.update.mockResolvedValue({ ...mockFolder, parentId: 'parent1' });
      
      const req = { json: async () => ({ id: 'fld1', parentId: 'parent1' }) } as any;
      const res = await handleUpdateFolder({ req, getSession: mockGetSession as () => Promise<any>, prisma: mockPrisma });
      
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.data.parentId).toBe('parent1');
      expect(mockPrisma.templateFolder.update).toHaveBeenCalled();
    });

    it('moves folder to root (null parent)', async () => {
      const mockFolder = { id: 'fld1', name: 'Test Folder', parentId: 'old-parent' };
      mockPrisma.templateFolder.findUnique.mockResolvedValue(mockFolder);
      mockPrisma.templateFolder.update.mockResolvedValue({ ...mockFolder, parentId: null });
      
      const req = { json: async () => ({ id: 'fld1', parentId: null }) } as any;
      const res = await handleUpdateFolder({ req, getSession: mockGetSession as () => Promise<any>, prisma: mockPrisma });
      
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.data.parentId).toBe(null);
      expect(mockPrisma.templateFolder.update).toHaveBeenCalled();
    });

    it('returns 404 if folder not found', async () => {
      mockPrisma.templateFolder.findUnique.mockResolvedValue(null);
      
      const req = { json: async () => ({ id: 'nonexistent', name: 'Updated Folder' }) } as any;
      const res = await handleUpdateFolder({ req, getSession: mockGetSession as () => Promise<any>, prisma: mockPrisma });
      
      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data.error).toBe('Folder not found');
    });

    it('returns 404 if parent folder not found', async () => {
      const mockFolder = { id: 'fld1', name: 'Test Folder' };
      mockPrisma.templateFolder.findUnique
        .mockResolvedValueOnce(mockFolder) // First call for the folder
        .mockResolvedValueOnce(null); // Second call for the parent (not found)
      
      const req = { json: async () => ({ id: 'fld1', parentId: 'nonexistent-parent' }) } as any;
      const res = await handleUpdateFolder({ req, getSession: mockGetSession as () => Promise<any>, prisma: mockPrisma });
      
      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data.error).toBe('Parent folder not found');
    });

    it('returns 400 if trying to move folder into itself', async () => {
      const mockFolder = { id: 'fld1', name: 'Test Folder' };
      mockPrisma.templateFolder.findUnique.mockResolvedValue(mockFolder);
      
      const req = { json: async () => ({ id: 'fld1', parentId: 'fld1' }) } as any;
      const res = await handleUpdateFolder({ req, getSession: mockGetSession as () => Promise<any>, prisma: mockPrisma });
      
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe('Cannot move folder into itself');
    });

    it('returns 400 if id missing', async () => {
      const req = { json: async () => ({ name: 'Updated Folder' }) } as any;
      const res = await handleUpdateFolder({ req, getSession: mockGetSession as () => Promise<any>, prisma: mockPrisma });
      
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe('Missing id');
    });
  });

  describe('handleDeleteFolder', () => {
    it('soft deletes folder', async () => {
      const mockFolder = { id: 'fld1', name: 'Test Folder', isDeleted: true, deletedAt: new Date() };
      mockPrisma.templateFolder.update.mockResolvedValue(mockFolder);

      const req = { json: async () => ({ id: 'fld1' }) } as any;
      const res = await handleDeleteFolder({ req, getSession: mockGetSession as () => Promise<any>, prisma: mockPrisma });
      
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.data.isDeleted).toBe(true);
      expect(mockPrisma.templateFolder.update).toHaveBeenCalled();
    });

    it('returns 400 if id missing', async () => {
      const req = { json: async () => ({}) } as any;
      const res = await handleDeleteFolder({ req, getSession: mockGetSession as () => Promise<any>, prisma: mockPrisma });
      
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe('Missing id');
    });
  });

  describe('handleRestoreFolder', () => {
    it('restores soft-deleted folder', async () => {
      const mockFolder = { id: 'fld1', name: 'Test Folder', isDeleted: true };
      const restoredFolder = { id: 'fld1', name: 'Test Folder', isDeleted: false, deletedAt: null };
      mockPrisma.templateFolder.findUnique.mockResolvedValue(mockFolder);
      mockPrisma.templateFolder.update.mockResolvedValue(restoredFolder);

      const req = { json: async () => ({ folderId: 'fld1' }) } as any;
      const res = await handleRestoreFolder({ req, getSession: mockGetSession as () => Promise<any>, prisma: mockPrisma });
      
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.data.isDeleted).toBe(false);
      expect(mockPrisma.templateFolder.update).toHaveBeenCalled();
    });

    it('returns 400 if folderId missing', async () => {
      const req = { json: async () => ({}) } as any;
      const res = await handleRestoreFolder({ req, getSession: mockGetSession as () => Promise<any>, prisma: mockPrisma });
      
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe('Missing folderId');
    });

    it('returns 404 if folder not found', async () => {
      mockPrisma.templateFolder.findUnique.mockResolvedValue(null);

      const req = { json: async () => ({ folderId: 'nonexistent' }) } as any;
      const res = await handleRestoreFolder({ req, getSession: mockGetSession as () => Promise<any>, prisma: mockPrisma });
      
      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data.error).toBe('Folder not found');
    });

    it('returns 400 if folder is not deleted', async () => {
      const mockFolder = { id: 'fld1', name: 'Test Folder', isDeleted: false };
      mockPrisma.templateFolder.findUnique.mockResolvedValue(mockFolder);

      const req = { json: async () => ({ folderId: 'fld1' }) } as any;
      const res = await handleRestoreFolder({ req, getSession: mockGetSession as () => Promise<any>, prisma: mockPrisma });
      
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe('Folder is not deleted');
    });
  });

  describe('handleShareFolder', () => {
    it('shares folder with user by userId', async () => {
      const mockFolder = { id: 'fld1', name: 'Test Folder', userId: mockUserId };
      mockPrisma.templateFolder.findUnique.mockResolvedValue(mockFolder);
      mockPrisma.templateFolder.update.mockResolvedValue(mockFolder);
      
      const req = { json: async () => ({ folderId: 'fld1', userId: 'user2' }) } as any;
      const res = await handleShareFolder({ req, getSession: mockGetSession as () => Promise<any>, prisma: mockPrisma });
      
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(mockPrisma.templateFolder.update).toHaveBeenCalled();
    });

    it('shares folder with email', async () => {
      const mockFolder = { id: 'fld1', name: 'Test Folder', userId: mockUserId };
      mockPrisma.templateFolder.findUnique.mockResolvedValue(mockFolder);
      mockPrisma.templateFolder.update.mockResolvedValue(mockFolder);
      
      const req = { json: async () => ({ folderId: 'fld1', email: 'test@example.com' }) } as any;
      const res = await handleShareFolder({ req, getSession: mockGetSession as () => Promise<any>, prisma: mockPrisma });
      
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(mockPrisma.templateFolder.update).toHaveBeenCalled();
    });

    it('returns 400 if missing folderId or user/email', async () => {
      const req = { json: async () => ({ folderId: 'fld1' }) } as any;
      const res = await handleShareFolder({ req, getSession: mockGetSession as () => Promise<any>, prisma: mockPrisma });
      
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe('Missing folderId or user/email');
    });

    it('returns 403 if not folder owner', async () => {
      const mockFolder = { id: 'fld1', name: 'Test Folder', userId: 'other-user' };
      mockPrisma.templateFolder.findUnique.mockResolvedValue(mockFolder);
      
      const req = { json: async () => ({ folderId: 'fld1', userId: 'user2' }) } as any;
      const res = await handleShareFolder({ req, getSession: mockGetSession as () => Promise<any>, prisma: mockPrisma });
      
      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.error).toBe('Forbidden');
    });
  });

  describe('handleUnshareFolder', () => {
    it('unshares folder with user by userId', async () => {
      const mockFolder = { id: 'fld1', name: 'Test Folder', userId: mockUserId };
      mockPrisma.templateFolder.findUnique.mockResolvedValue(mockFolder);
      mockPrisma.templateFolder.update.mockResolvedValue(mockFolder);
      
      const req = { json: async () => ({ folderId: 'fld1', userId: 'user2' }) } as any;
      const res = await handleUnshareFolder({ req, getSession: mockGetSession as () => Promise<any>, prisma: mockPrisma });
      
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(mockPrisma.templateFolder.update).toHaveBeenCalled();
    });

    it('unshares folder with email', async () => {
      const mockFolder = { 
        id: 'fld1', 
        name: 'Test Folder', 
        userId: mockUserId,
        sharedWithEmails: ['test@example.com', 'other@example.com']
      };
      mockPrisma.templateFolder.findUnique.mockResolvedValue(mockFolder);
      mockPrisma.templateFolder.update.mockResolvedValue(mockFolder);
      
      const req = { json: async () => ({ folderId: 'fld1', email: 'test@example.com' }) } as any;
      const res = await handleUnshareFolder({ req, getSession: mockGetSession as () => Promise<any>, prisma: mockPrisma });
      
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(mockPrisma.templateFolder.update).toHaveBeenCalled();
    });

    it('returns 400 if missing folderId or user/email', async () => {
      const req = { json: async () => ({ folderId: 'fld1' }) } as any;
      const res = await handleUnshareFolder({ req, getSession: mockGetSession as () => Promise<any>, prisma: mockPrisma });
      
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe('Missing folderId or user/email');
    });

    it('returns 403 if not folder owner', async () => {
      const mockFolder = { id: 'fld1', name: 'Test Folder', userId: 'other-user' };
      mockPrisma.templateFolder.findUnique.mockResolvedValue(mockFolder);
      
      const req = { json: async () => ({ folderId: 'fld1', userId: 'user2' }) } as any;
      const res = await handleUnshareFolder({ req, getSession: mockGetSession as () => Promise<any>, prisma: mockPrisma });
      
      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.error).toBe('Forbidden');
    });
  });
}); 