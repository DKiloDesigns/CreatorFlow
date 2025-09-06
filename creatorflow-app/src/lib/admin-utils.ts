import { prisma } from './prisma';

export interface AdminUser {
  id: string;
  name: string | null;
  email: string | null;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  lastLogin?: Date;
}

export class AdminUtils {
  /**
   * Get all users with their roles
   */
  static async getAllUsers(): Promise<AdminUser[]> {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        sessions: {
          select: {
            expires: true
          },
          orderBy: {
            expires: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as 'USER' | 'ADMIN',
      createdAt: user.createdAt,
      lastLogin: user.sessions[0]?.expires || undefined
    }));
  }

  /**
   * Promote a user to admin
   */
  static async promoteToAdmin(userId: string, promotedBy: string): Promise<{ success: boolean; message: string }> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, role: true }
      });

      if (!user) {
        return { success: false, message: 'User not found' };
      }

      if (user.role === 'ADMIN') {
        return { success: false, message: 'User is already an admin' };
      }

      await prisma.user.update({
        where: { id: userId },
        data: { role: 'ADMIN' }
      });

      // Log the promotion
      await prisma.auditLog.create({
        data: {
          action: 'USER_PROMOTED_TO_ADMIN',
          actorId: promotedBy,
          targetId: userId,
          details: {
            previousRole: 'USER',
            newRole: 'ADMIN',
            promotedBy
          }
        }
      });

      return { success: true, message: 'User promoted to admin successfully' };
    } catch (error) {
      console.error('Error promoting user to admin:', error);
      return { success: false, message: 'Failed to promote user' };
    }
  }

  /**
   * Demote an admin to regular user
   */
  static async demoteFromAdmin(userId: string, demotedBy: string): Promise<{ success: boolean; message: string }> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, role: true }
      });

      if (!user) {
        return { success: false, message: 'User not found' };
      }

      if (user.role !== 'ADMIN') {
        return { success: false, message: 'User is not an admin' };
      }

      await prisma.user.update({
        where: { id: userId },
        data: { role: 'USER' }
      });

      // Log the demotion
      await prisma.auditLog.create({
        data: {
          action: 'ADMIN_DEMOTED_TO_USER',
          actorId: demotedBy,
          targetId: userId,
          details: {
            previousRole: 'ADMIN',
            newRole: 'USER',
            demotedBy
          }
        }
      });

      return { success: true, message: 'Admin demoted to user successfully' };
    } catch (error) {
      console.error('Error demoting admin:', error);
      return { success: false, message: 'Failed to demote admin' };
    }
  }

  /**
   * Check if current user is admin
   */
  static async isAdmin(userId: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
      });

      return user?.role === 'ADMIN';
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }
}
