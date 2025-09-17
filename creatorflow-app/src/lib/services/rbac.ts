/**
 * Role-Based Access Control (RBAC) Service
 * Granular permissions and security system
 */

import { PrismaClient } from '@prisma/client';
import { teamManagementService } from './team-management';

const prisma = new PrismaClient();

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
  conditions?: string[];
  isSystem: boolean;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isDefault: boolean;
  isSystem: boolean;
  level: number;
  teamId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPermission {
  userId: string;
  teamId?: string;
  permissions: string[];
  roles: string[];
  effectivePermissions: string[];
  expiresAt?: Date;
}

export interface AccessControlContext {
  userId: string;
  teamId?: string;
  resource: string;
  action: string;
  resourceId?: string;
  metadata?: any;
}

export interface AccessDecision {
  allowed: boolean;
  reason?: string;
  permissions?: string[];
  conditions?: string[];
}

export class RBACService {
  private static instance: RBACService;
  private permissionCache = new Map<string, Permission>();
  private roleCache = new Map<string, Role>();

  constructor() {
    if (RBACService.instance) {
      return RBACService.instance;
    }
    RBACService.instance = this;
    this.initializeSystemPermissions();
  }

  /**
   * Check if user has permission
   */
  async checkPermission(
    userId: string,
    resource: string,
    action: string,
    teamId?: string,
    resourceId?: string,
    metadata?: any
  ): Promise<AccessDecision> {
    try {
      const context: AccessControlContext = {
        userId,
        teamId,
        resource,
        action,
        resourceId,
        metadata,
      };

      // Get user's effective permissions
      const userPermissions = await this.getUserPermissions(userId, teamId);
      
      // Check direct permissions
      const directPermission = this.checkDirectPermission(userPermissions, resource, action);
      if (directPermission.allowed) {
        return directPermission;
      }

      // Check role-based permissions
      const rolePermission = await this.checkRolePermissions(userPermissions, resource, action, context);
      if (rolePermission.allowed) {
        return rolePermission;
      }

      // Check team-based permissions
      if (teamId) {
        const teamPermission = await this.checkTeamPermissions(userId, teamId, resource, action, context);
        if (teamPermission.allowed) {
          return teamPermission;
        }
      }

      // Check resource-specific permissions
      const resourcePermission = await this.checkResourcePermissions(userId, resource, action, resourceId, context);
      if (resourcePermission.allowed) {
        return resourcePermission;
      }

      return {
        allowed: false,
        reason: 'Insufficient permissions',
      };
    } catch (error) {
      console.error('Check permission error:', error);
      return {
        allowed: false,
        reason: 'Permission check failed',
      };
    }
  }

  /**
   * Get user's effective permissions
   */
  async getUserPermissions(userId: string, teamId?: string): Promise<UserPermission> {
    try {
      // Get user's roles
      const userRoles = await this.getUserRoles(userId, teamId);
      
      // Get permissions from roles
      const rolePermissions = new Set<string>();
      for (const roleId of userRoles) {
        const role = await this.getRole(roleId);
        if (role) {
          role.permissions.forEach(permission => rolePermissions.add(permission));
        }
      }

      // Get direct user permissions
      const directPermissions = await this.getDirectUserPermissions(userId, teamId);
      
      // Combine all permissions
      const allPermissions = new Set([...rolePermissions, ...directPermissions]);
      
      // Apply permission conditions and filters
      const effectivePermissions = await this.filterEffectivePermissions(
        Array.from(allPermissions),
        userId,
        teamId
      );

      return {
        userId,
        teamId,
        permissions: directPermissions,
        roles: userRoles,
        effectivePermissions,
      };
    } catch (error) {
      console.error('Get user permissions error:', error);
      throw error;
    }
  }

  /**
   * Create custom role
   */
  async createRole(
    name: string,
    description: string,
    permissions: string[],
    teamId?: string,
    level: number = 5
  ): Promise<Role> {
    try {
      const role = await prisma.role.create({
        data: {
          name,
          description,
          permissions,
          isDefault: false,
          isSystem: false,
          level,
          teamId,
        },
      });

      const mappedRole = this.mapRole(role);
      this.roleCache.set(role.id, mappedRole);
      
      return mappedRole;
    } catch (error) {
      console.error('Create role error:', error);
      throw error;
    }
  }

  /**
   * Update role permissions
   */
  async updateRolePermissions(
    roleId: string,
    permissions: string[],
    updatedBy: string
  ): Promise<Role> {
    try {
      // Check if user has permission to update roles
      const hasPermission = await this.checkPermission(
        updatedBy,
        'role',
        'update',
        undefined,
        roleId
      );

      if (!hasPermission.allowed) {
        throw new Error('Insufficient permissions to update role');
      }

      const role = await prisma.role.update({
        where: { id: roleId },
        data: {
          permissions,
          updatedAt: new Date(),
        },
      });

      const mappedRole = this.mapRole(role);
      this.roleCache.set(role.id, mappedRole);
      
      return mappedRole;
    } catch (error) {
      console.error('Update role permissions error:', error);
      throw error;
    }
  }

  /**
   * Assign role to user
   */
  async assignRoleToUser(
    userId: string,
    roleId: string,
    teamId?: string,
    assignedBy: string
  ): Promise<void> {
    try {
      // Check if assigner has permission
      const hasPermission = await this.checkPermission(
        assignedBy,
        'user',
        'assign_role',
        teamId
      );

      if (!hasPermission.allowed) {
        throw new Error('Insufficient permissions to assign role');
      }

      await prisma.userRole.create({
        data: {
          userId,
          roleId,
          teamId,
          assignedBy,
        },
      });
    } catch (error) {
      console.error('Assign role to user error:', error);
      throw error;
    }
  }

  /**
   * Remove role from user
   */
  async removeRoleFromUser(
    userId: string,
    roleId: string,
    teamId?: string,
    removedBy: string
  ): Promise<void> {
    try {
      // Check if remover has permission
      const hasPermission = await this.checkPermission(
        removedBy,
        'user',
        'remove_role',
        teamId
      );

      if (!hasPermission.allowed) {
        throw new Error('Insufficient permissions to remove role');
      }

      await prisma.userRole.deleteMany({
        where: {
          userId,
          roleId,
          teamId,
        },
      });
    } catch (error) {
      console.error('Remove role from user error:', error);
      throw error;
    }
  }

  /**
   * Get all permissions
   */
  async getAllPermissions(): Promise<Permission[]> {
    try {
      const permissions = await prisma.permission.findMany({
        orderBy: { name: 'asc' },
      });

      return permissions.map(permission => this.mapPermission(permission));
    } catch (error) {
      console.error('Get all permissions error:', error);
      throw error;
    }
  }

  /**
   * Get all roles
   */
  async getAllRoles(teamId?: string): Promise<Role[]> {
    try {
      const roles = await prisma.role.findMany({
        where: teamId ? { OR: [{ teamId }, { teamId: null }] } : {},
        orderBy: { level: 'desc' },
      });

      return roles.map(role => this.mapRole(role));
    } catch (error) {
      console.error('Get all roles error:', error);
      throw error;
    }
  }

  /**
   * Check direct permission
   */
  private checkDirectPermission(
    userPermissions: UserPermission,
    resource: string,
    action: string
  ): AccessDecision {
    const permissionName = `${resource}:${action}`;
    
    if (userPermissions.effectivePermissions.includes(permissionName) ||
        userPermissions.effectivePermissions.includes('*')) {
      return {
        allowed: true,
        permissions: [permissionName],
      };
    }

    return {
      allowed: false,
      reason: 'Direct permission not found',
    };
  }

  /**
   * Check role-based permissions
   */
  private async checkRolePermissions(
    userPermissions: UserPermission,
    resource: string,
    action: string,
    context: AccessControlContext
  ): Promise<AccessDecision> {
    for (const roleId of userPermissions.roles) {
      const role = await this.getRole(roleId);
      if (!role) continue;

      for (const permissionName of role.permissions) {
        if (this.matchesPermission(permissionName, resource, action)) {
          // Check role conditions
          const conditions = await this.checkRoleConditions(role, context);
          if (conditions.allowed) {
            return {
              allowed: true,
              permissions: [permissionName],
              conditions: conditions.conditions,
            };
          }
        }
      }
    }

    return {
      allowed: false,
      reason: 'Role permission not found',
    };
  }

  /**
   * Check team-based permissions
   */
  private async checkTeamPermissions(
    userId: string,
    teamId: string,
    resource: string,
    action: string,
    context: AccessControlContext
  ): Promise<AccessDecision> {
    try {
      const member = await teamManagementService.getTeamMember(teamId, userId);
      if (!member) {
        return {
          allowed: false,
          reason: 'User is not a team member',
        };
      }

      // Check team member permissions
      const permissionName = `${resource}:${action}`;
      if (member.permissions.includes(permissionName) || member.permissions.includes('*')) {
        return {
          allowed: true,
          permissions: [permissionName],
        };
      }

      return {
        allowed: false,
        reason: 'Team permission not found',
      };
    } catch (error) {
      console.error('Check team permissions error:', error);
      return {
        allowed: false,
        reason: 'Team permission check failed',
      };
    }
  }

  /**
   * Check resource-specific permissions
   */
  private async checkResourcePermissions(
    userId: string,
    resource: string,
    action: string,
    resourceId?: string,
    context?: AccessControlContext
  ): Promise<AccessDecision> {
    if (!resourceId) {
      return {
        allowed: false,
        reason: 'Resource ID required for resource-specific permissions',
      };
    }

    // Check if user owns the resource
    const resourceOwnership = await this.checkResourceOwnership(userId, resource, resourceId);
    if (resourceOwnership.allowed) {
      return {
        allowed: true,
        permissions: [`${resource}:own`],
      };
    }

    return {
      allowed: false,
      reason: 'Resource-specific permission not found',
    };
  }

  /**
   * Get user roles
   */
  private async getUserRoles(userId: string, teamId?: string): Promise<string[]> {
    try {
      const userRoles = await prisma.userRole.findMany({
        where: {
          userId,
          teamId: teamId || null,
        },
        select: { roleId: true },
      });

      return userRoles.map(ur => ur.roleId);
    } catch (error) {
      console.error('Get user roles error:', error);
      return [];
    }
  }

  /**
   * Get direct user permissions
   */
  private async getDirectUserPermissions(userId: string, teamId?: string): Promise<string[]> {
    try {
      const userPermissions = await prisma.userPermission.findMany({
        where: {
          userId,
          teamId: teamId || null,
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } },
          ],
        },
        select: { permission: true },
      });

      return userPermissions.map(up => up.permission);
    } catch (error) {
      console.error('Get direct user permissions error:', error);
      return [];
    }
  }

  /**
   * Get role by ID
   */
  private async getRole(roleId: string): Promise<Role | null> {
    if (this.roleCache.has(roleId)) {
      return this.roleCache.get(roleId)!;
    }

    try {
      const role = await prisma.role.findUnique({
        where: { id: roleId },
      });

      if (role) {
        const mappedRole = this.mapRole(role);
        this.roleCache.set(roleId, mappedRole);
        return mappedRole;
      }

      return null;
    } catch (error) {
      console.error('Get role error:', error);
      return null;
    }
  }

  /**
   * Check if permission matches resource and action
   */
  private matchesPermission(permission: string, resource: string, action: string): boolean {
    if (permission === '*') return true;
    
    const [permResource, permAction] = permission.split(':');
    if (permResource === '*' && permAction === action) return true;
    if (permResource === resource && permAction === '*') return true;
    if (permResource === resource && permAction === action) return true;
    
    return false;
  }

  /**
   * Check role conditions
   */
  private async checkRoleConditions(role: Role, context: AccessControlContext): Promise<AccessDecision> {
    // Implement role-specific conditions
    // For now, always allow if role has permission
    return {
      allowed: true,
      conditions: [],
    };
  }

  /**
   * Check resource ownership
   */
  private async checkResourceOwnership(
    userId: string,
    resource: string,
    resourceId: string
  ): Promise<AccessDecision> {
    try {
      // Check common ownership patterns
      const ownershipQueries: Record<string, any> = {
        'post': { userId, id: resourceId },
        'dashboard': { userId, id: resourceId },
        'report': { userId, id: resourceId },
        'team': { ownerId: userId, id: resourceId },
      };

      const query = ownershipQueries[resource];
      if (!query) {
        return {
          allowed: false,
          reason: 'Resource ownership check not implemented',
        };
      }

      const modelName = this.getModelName(resource);
      if (!modelName) {
        return {
          allowed: false,
          reason: 'Unknown resource type',
        };
      }

      const record = await (prisma as any)[modelName].findFirst({
        where: query,
      });

      return {
        allowed: !!record,
        reason: record ? 'User owns resource' : 'User does not own resource',
      };
    } catch (error) {
      console.error('Check resource ownership error:', error);
      return {
        allowed: false,
        reason: 'Ownership check failed',
      };
    }
  }

  /**
   * Filter effective permissions
   */
  private async filterEffectivePermissions(
    permissions: string[],
    userId: string,
    teamId?: string
  ): Promise<string[]> {
    // Apply any additional filtering logic here
    // For now, return all permissions
    return permissions;
  }

  /**
   * Get model name from resource
   */
  private getModelName(resource: string): string | null {
    const modelMap: Record<string, string> = {
      'post': 'scheduledPost',
      'dashboard': 'customDashboard',
      'report': 'reportConfig',
      'team': 'team',
      'user': 'user',
    };

    return modelMap[resource] || null;
  }

  /**
   * Initialize system permissions
   */
  private async initializeSystemPermissions(): Promise<void> {
    try {
      const systemPermissions = [
        // User permissions
        { name: 'user:read', description: 'Read user information', resource: 'user', action: 'read' },
        { name: 'user:update', description: 'Update user information', resource: 'user', action: 'update' },
        { name: 'user:delete', description: 'Delete user account', resource: 'user', action: 'delete' },
        
        // Team permissions
        { name: 'team:create', description: 'Create teams', resource: 'team', action: 'create' },
        { name: 'team:read', description: 'Read team information', resource: 'team', action: 'read' },
        { name: 'team:update', description: 'Update team settings', resource: 'team', action: 'update' },
        { name: 'team:delete', description: 'Delete teams', resource: 'team', action: 'delete' },
        { name: 'team:members:invite', description: 'Invite team members', resource: 'team', action: 'invite_members' },
        { name: 'team:members:update', description: 'Update team members', resource: 'team', action: 'update_members' },
        { name: 'team:members:remove', description: 'Remove team members', resource: 'team', action: 'remove_members' },
        
        // Content permissions
        { name: 'content:create', description: 'Create content', resource: 'content', action: 'create' },
        { name: 'content:read', description: 'Read content', resource: 'content', action: 'read' },
        { name: 'content:update', description: 'Update content', resource: 'content', action: 'update' },
        { name: 'content:delete', description: 'Delete content', resource: 'content', action: 'delete' },
        { name: 'content:publish', description: 'Publish content', resource: 'content', action: 'publish' },
        
        // Analytics permissions
        { name: 'analytics:read', description: 'View analytics', resource: 'analytics', action: 'read' },
        { name: 'analytics:export', description: 'Export analytics data', resource: 'analytics', action: 'export' },
        
        // Dashboard permissions
        { name: 'dashboard:create', description: 'Create dashboards', resource: 'dashboard', action: 'create' },
        { name: 'dashboard:read', description: 'View dashboards', resource: 'dashboard', action: 'read' },
        { name: 'dashboard:update', description: 'Update dashboards', resource: 'dashboard', action: 'update' },
        { name: 'dashboard:delete', description: 'Delete dashboards', resource: 'dashboard', action: 'delete' },
        
        // Report permissions
        { name: 'report:create', description: 'Create reports', resource: 'report', action: 'create' },
        { name: 'report:read', description: 'View reports', resource: 'report', action: 'read' },
        { name: 'report:update', description: 'Update reports', resource: 'report', action: 'update' },
        { name: 'report:delete', description: 'Delete reports', resource: 'report', action: 'delete' },
        { name: 'report:schedule', description: 'Schedule reports', resource: 'report', action: 'schedule' },
        
        // Role permissions
        { name: 'role:create', description: 'Create roles', resource: 'role', action: 'create' },
        { name: 'role:read', description: 'View roles', resource: 'role', action: 'read' },
        { name: 'role:update', description: 'Update roles', resource: 'role', action: 'update' },
        { name: 'role:delete', description: 'Delete roles', resource: 'role', action: 'delete' },
        { name: 'role:assign', description: 'Assign roles', resource: 'role', action: 'assign' },
      ];

      for (const perm of systemPermissions) {
        await prisma.permission.upsert({
          where: { name: perm.name },
          update: perm,
          create: {
            ...perm,
            isSystem: true,
          },
        });
      }
    } catch (error) {
      console.error('Initialize system permissions error:', error);
    }
  }

  /**
   * Map database permission to interface
   */
  private mapPermission(permission: any): Permission {
    return {
      id: permission.id,
      name: permission.name,
      description: permission.description,
      resource: permission.resource,
      action: permission.action,
      conditions: permission.conditions,
      isSystem: permission.isSystem,
    };
  }

  /**
   * Map database role to interface
   */
  private mapRole(role: any): Role {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: role.permissions,
      isDefault: role.isDefault,
      isSystem: role.isSystem,
      level: role.level,
      teamId: role.teamId,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }
}

// Export singleton instance
export const rbacService = new RBACService();
