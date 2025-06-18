import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

interface RouteContext {
  req: NextRequest;
  getSession: () => Promise<any>;
  prisma: PrismaClient;
}

export async function handleGetFolders({ req, getSession, prisma }: RouteContext) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const url = new URL(req.url);
    const includeTree = url.searchParams.get('tree') === 'true';
    const includeDeleted = url.searchParams.get('includeDeleted') === 'true';
    
    if (includeTree) {
      return handleGetFolderTree({ req, getSession, prisma });
    }
    
    const whereClause: any = { userId: session.user.id };
    if (!includeDeleted) {
      whereClause.isDeleted = false;
    }
    
    const folders = await prisma.templateFolder.findMany({ 
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        children: true,
        _count: {
          select: {
            children: true,
            captionTemplates: true,
            hashtagGroups: true
          }
        }
      }
    });
    
    return NextResponse.json({ data: folders });
  } catch (error) {
    console.error('Error getting folders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function handleGetFolderTree({ req, getSession, prisma }: RouteContext) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const url = new URL(req.url);
    const includeDeleted = url.searchParams.get('includeDeleted') === 'true';
    
    const whereClause: any = { userId: session.user.id };
    if (!includeDeleted) {
      whereClause.isDeleted = false;
    }
    
    // Get all folders for the user
    const allFolders = await prisma.templateFolder.findMany({ 
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            children: true,
            captionTemplates: true,
            hashtagGroups: true
          }
        }
      }
    });
    
    // Build tree structure
    const buildTree = (parentId: string | null): any[] => {
      return allFolders
        .filter(folder => folder.parentId === parentId)
        .map(folder => ({
          ...folder,
          children: buildTree(folder.id)
        }));
    };
    
    const tree = buildTree(null);
    
    return NextResponse.json({ data: tree });
  } catch (error) {
    console.error('Error getting folder tree:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function handleCreateFolder({ req, getSession, prisma }: RouteContext) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ error: 'Name required' }, { status: 400 });
    }
    
    const folder = await prisma.templateFolder.create({ 
      data: { 
        name: body.name,
        userId: session.user.id, 
      } 
    });
    
    return NextResponse.json({ data: folder }, { status: 201 });
  } catch (error) {
    console.error('Error creating folder:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function handleUpdateFolder({ req, getSession, prisma }: RouteContext) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }
    
    // Check if folder exists and user owns it
    const folder = await prisma.templateFolder.findUnique({
      where: { id: body.id, userId: session.user.id }
    });
    
    if (!folder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }
    
    // Prepare update data
    const updateData: any = {};
    
    if (body.name !== undefined) {
      updateData.name = body.name;
    }
    
    if (body.parentId !== undefined) {
      // Validate parent folder exists and user owns it (if not null)
      if (body.parentId !== null) {
        const parentFolder = await prisma.templateFolder.findUnique({
          where: { id: body.parentId, userId: session.user.id }
        });
        
        if (!parentFolder) {
          return NextResponse.json({ error: 'Parent folder not found' }, { status: 404 });
        }
        
        // Prevent circular reference: check if new parent is a descendant of current folder
        if (body.parentId === body.id) {
          return NextResponse.json({ error: 'Cannot move folder into itself' }, { status: 400 });
        }
        
        // Check for circular reference by traversing up the tree
        let currentParentId = body.parentId;
        while (currentParentId) {
          const currentParent = await prisma.templateFolder.findUnique({
            where: { id: currentParentId }
          });
          
          if (!currentParent) break;
          
          if (currentParent.parentId === body.id) {
            return NextResponse.json({ error: 'Cannot move folder: would create circular reference' }, { status: 400 });
          }
          
          currentParentId = currentParent.parentId;
        }
      }
      
      updateData.parentId = body.parentId;
    }
    
    const updatedFolder = await prisma.templateFolder.update({ 
      where: { id: body.id, userId: session.user.id }, 
      data: updateData 
    });
    
    return NextResponse.json({ data: updatedFolder });
  } catch (error) {
    console.error('Error updating folder:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function handleDeleteFolder({ req, getSession, prisma }: RouteContext) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }
    
    // Soft delete the folder
    const deletedFolder = await prisma.templateFolder.update({ 
      where: { id: body.id, userId: session.user.id },
      data: { 
        isDeleted: true,
        deletedAt: new Date()
      }
    });
    
    return NextResponse.json({ success: true, data: deletedFolder });
  } catch (error) {
    console.error('Error deleting folder:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function handleRestoreFolder({ req, getSession, prisma }: RouteContext) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    if (!body.folderId) {
      return NextResponse.json({ error: 'Missing folderId' }, { status: 400 });
    }
    
    // Check if folder exists and user owns it
    const folder = await prisma.templateFolder.findUnique({
      where: { id: body.folderId, userId: session.user.id }
    });
    
    if (!folder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }
    
    if (!folder.isDeleted) {
      return NextResponse.json({ error: 'Folder is not deleted' }, { status: 400 });
    }
    
    // Restore the folder
    const restoredFolder = await prisma.templateFolder.update({ 
      where: { id: body.folderId, userId: session.user.id },
      data: { 
        isDeleted: false,
        deletedAt: null
      }
    });
    
    return NextResponse.json({ success: true, data: restoredFolder });
  } catch (error) {
    console.error('Error restoring folder:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function handleShareFolder({ req, getSession, prisma }: RouteContext) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await req.json();
    const { folderId, userId, email } = body;
    if (!folderId || (!userId && !email)) {
      return NextResponse.json({ error: 'Missing folderId or user/email' }, { status: 400 });
    }
    // Only owner can share
    const folder = await prisma.templateFolder.findUnique({ where: { id: folderId } });
    if (!folder || folder.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    let updated;
    if (userId) {
      updated = await prisma.templateFolder.update({
        where: { id: folderId },
        data: { sharedWith: { connect: { id: userId } } }
      });
    } else if (email) {
      updated = await prisma.templateFolder.update({
        where: { id: folderId },
        data: { sharedWithEmails: { push: email } }
      });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error sharing folder:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function handleUnshareFolder({ req, getSession, prisma }: RouteContext) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await req.json();
    const { folderId, userId, email } = body;
    if (!folderId || (!userId && !email)) {
      return NextResponse.json({ error: 'Missing folderId or user/email' }, { status: 400 });
    }
    // Only owner can unshare
    const folder = await prisma.templateFolder.findUnique({ where: { id: folderId } });
    if (!folder || folder.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    let updated;
    if (userId) {
      updated = await prisma.templateFolder.update({
        where: { id: folderId },
        data: { sharedWith: { disconnect: { id: userId } } }
      });
    } else if (email) {
      // Remove email from array
      const newEmails = folder.sharedWithEmails.filter((e: string) => e !== email);
      updated = await prisma.templateFolder.update({
        where: { id: folderId },
        data: { sharedWithEmails: newEmails }
      });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error unsharing folder:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 