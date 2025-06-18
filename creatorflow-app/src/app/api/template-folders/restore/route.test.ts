import { NextRequest } from 'next/server';
import { POST } from './route';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/auth';

// Mock dependencies
jest.mock('@/lib/prisma', () => ({
  prisma: {
    templateFolder: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock('@/auth', () => ({
  getSession: jest.fn(),
}));

jest.mock('@/lib/apiKeyAuth', () => ({
  requireApiKey: jest.fn(),
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockGetSession = getSession as jest.MockedFunction<typeof getSession>;

describe('TemplateFolder Restore API', () => {
  const mockUserId = 'user123';
  const mockSession = { user: { id: mockUserId } };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSession.mockResolvedValue(mockSession as any);
  });

  describe('POST /api/template-folders/restore', () => {
    it('restores a soft-deleted folder', async () => {
      const mockFolder = { id: 'fld1', name: 'Test Folder', isDeleted: true };
      const restoredFolder = { id: 'fld1', name: 'Test Folder', isDeleted: false, deletedAt: null };
      
      (mockPrisma.templateFolder.findUnique as jest.Mock).mockResolvedValue(mockFolder);
      (mockPrisma.templateFolder.update as jest.Mock).mockResolvedValue(restoredFolder);

      const req = { 
        json: async () => ({ folderId: 'fld1' }),
        headers: { get: () => null }
      } as any;

      const res = await POST(req);
      
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.data.isDeleted).toBe(false);
      expect(mockPrisma.templateFolder.update).toHaveBeenCalled();
    });

    it('returns 400 if folderId is missing', async () => {
      const req = { 
        json: async () => ({}),
        headers: { get: () => null }
      } as any;

      const res = await POST(req);
      
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe('Missing folderId');
    });

    it('returns 404 if folder not found', async () => {
      (mockPrisma.templateFolder.findUnique as jest.Mock).mockResolvedValue(null);

      const req = { 
        json: async () => ({ folderId: 'nonexistent' }),
        headers: { get: () => null }
      } as any;

      const res = await POST(req);
      
      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data.error).toBe('Folder not found');
    });

    it('returns 400 if folder is not deleted', async () => {
      const mockFolder = { id: 'fld1', name: 'Test Folder', isDeleted: false };
      (mockPrisma.templateFolder.findUnique as jest.Mock).mockResolvedValue(mockFolder);

      const req = { 
        json: async () => ({ folderId: 'fld1' }),
        headers: { get: () => null }
      } as any;

      const res = await POST(req);
      
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe('Folder is not deleted');
    });

    it('returns 401 if unauthorized', async () => {
      mockGetSession.mockResolvedValue(null);

      const req = { 
        json: async () => ({ folderId: 'fld1' }),
        headers: { get: () => null }
      } as any;

      const res = await POST(req);
      
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toBe('Unauthorized');
    });
  });
}); 