/**
 * Team Management Service
 * Comprehensive team collaboration and management system
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface Team {
  id: string;
  name: string;
  description?: string;
  slug: string;
  ownerId: string;
  settings: TeamSettings;
  subscription: TeamSubscription;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamSettings {
  allowInvites: boolean;
  requireApproval: boolean;
  maxMembers: number;
  defaultRole: string;
  branding: TeamBranding;
  features: TeamFeatures;
  notifications: TeamNotifications;
}

export interface TeamBranding {
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  customDomain?: string;
  favicon?: string;
  customCss?: string;
}

export interface TeamFeatures {
  analytics: boolean;
  scheduling: boolean;
  publishing: boolean;
  reporting: boolean;
  whiteLabel: boolean;
  apiAccess: boolean;
  customIntegrations: boolean;
  advancedAnalytics: boolean;
}

export interface TeamNotifications {
  email: boolean;
  slack: boolean;
  webhook?: string;
  channels: string[];
}

export interface TeamSubscription {
  plan: 'free' | 'pro' | 'enterprise' | 'custom';
  status: 'active' | 'inactive' | 'suspended' | 'cancelled';
  startDate: Date;
  endDate?: Date;
  features: string[];
  limits: TeamLimits;
}

export interface TeamLimits {
  maxMembers: number;
  maxPostsPerMonth: number;
  maxStorageGB: number;
  maxIntegrations: number;
  maxCustomBranding: boolean;
  maxAPIRequests: number;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: TeamRole;
  permissions: string[];
  status: 'active' | 'pending' | 'suspended' | 'removed';
  joinedAt: Date;
  invitedBy: string;
  lastActiveAt?: Date;
  metadata: any;
}

export interface TeamRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isDefault: boolean;
  isSystem: boolean;
  level: number; // 1-10, higher = more permissions
}

export interface TeamInvitation {
  id: string;
  teamId: string;
  email: string;
  role: string;
  invitedBy: string;
  token: string;
  expiresAt: Date;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  createdAt: Date;
}

export interface TeamActivity {
  id: string;
  teamId: string;
  userId: string;
  action: string;
  description: string;
  metadata: any;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

export class TeamManagementService {
  /**
   * Create a new team
   */
  async createTeam(
    ownerId: string,
    name: string,
    description?: string,
    settings?: Partial<TeamSettings>
  ): Promise<Team> {
    try {
      const slug = this.generateSlug(name);
      
      const team = await prisma.team.create({
        data: {
          name,
          description,
          slug,
          ownerId,
          settings: {
            allowInvites: true,
            requireApproval: false,
            maxMembers: 10,
            defaultRole: 'member',
            branding: {
              primaryColor: '#1976d2',
              secondaryColor: '#dc004e',
            },
            features: {
              analytics: true,
              scheduling: true,
              publishing: true,
              reporting: false,
              whiteLabel: false,
              apiAccess: false,
              customIntegrations: false,
              advancedAnalytics: false,
            },
            notifications: {
              email: true,
              slack: false,
              channels: [],
            },
            ...settings,
          },
          subscription: {
            plan: 'free',
            status: 'active',
            startDate: new Date(),
            features: ['analytics', 'scheduling', 'publishing'],
            limits: {
              maxMembers: 10,
              maxPostsPerMonth: 100,
              maxStorageGB: 1,
              maxIntegrations: 5,
              maxCustomBranding: false,
              maxAPIRequests: 1000,
            },
          },
          isActive: true,
        },
      });

      // Add owner as admin member
      await this.addTeamMember(team.id, ownerId, 'admin', ownerId);

      return this.mapTeam(team);
    } catch (error) {
      console.error('Create team error:', error);
      throw error;
    }
  }

  /**
   * Get team by ID or slug
   */
  async getTeam(identifier: string): Promise<Team | null> {
    try {
      const team = await prisma.team.findFirst({
        where: {
          OR: [
            { id: identifier },
            { slug: identifier },
          ],
        },
      });

      return team ? this.mapTeam(team) : null;
    } catch (error) {
      console.error('Get team error:', error);
      throw error;
    }
  }

  /**
   * Get user's teams
   */
  async getUserTeams(userId: string): Promise<Team[]> {
    try {
      const memberships = await prisma.teamMember.findMany({
        where: { userId, status: 'active' },
        include: { team: true },
      });

      return memberships.map(membership => this.mapTeam(membership.team));
    } catch (error) {
      console.error('Get user teams error:', error);
      throw error;
    }
  }

  /**
   * Update team settings
   */
  async updateTeamSettings(
    teamId: string,
    userId: string,
    settings: Partial<TeamSettings>
  ): Promise<Team> {
    try {
      // Check if user has permission to update team settings
      const member = await this.getTeamMember(teamId, userId);
      if (!member || !this.hasPermission(member, 'team:settings:update')) {
        throw new Error('Insufficient permissions');
      }

      const team = await prisma.team.update({
        where: { id: teamId },
        data: {
          settings: settings as any,
          updatedAt: new Date(),
        },
      });

      return this.mapTeam(team);
    } catch (error) {
      console.error('Update team settings error:', error);
      throw error;
    }
  }

  /**
   * Add team member
   */
  async addTeamMember(
    teamId: string,
    userId: string,
    role: string,
    invitedBy: string
  ): Promise<TeamMember> {
    try {
      const member = await prisma.teamMember.create({
        data: {
          teamId,
          userId,
          role,
          permissions: this.getRolePermissions(role),
          status: 'active',
          invitedBy,
          metadata: {},
        },
      });

      return this.mapTeamMember(member);
    } catch (error) {
      console.error('Add team member error:', error);
      throw error;
    }
  }

  /**
   * Invite team member
   */
  async inviteTeamMember(
    teamId: string,
    email: string,
    role: string,
    invitedBy: string
  ): Promise<TeamInvitation> {
    try {
      const token = this.generateInvitationToken();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      const invitation = await prisma.teamInvitation.create({
        data: {
          teamId,
          email,
          role,
          invitedBy,
          token,
          expiresAt,
          status: 'pending',
        },
      });

      // TODO: Send invitation email
      await this.sendInvitationEmail(invitation);

      return this.mapTeamInvitation(invitation);
    } catch (error) {
      console.error('Invite team member error:', error);
      throw error;
    }
  }

  /**
   * Accept team invitation
   */
  async acceptInvitation(
    token: string,
    userId: string
  ): Promise<TeamMember> {
    try {
      const invitation = await prisma.teamInvitation.findFirst({
        where: {
          token,
          status: 'pending',
          expiresAt: { gt: new Date() },
        },
      });

      if (!invitation) {
        throw new Error('Invalid or expired invitation');
      }

      // Check if user is already a member
      const existingMember = await prisma.teamMember.findFirst({
        where: {
          teamId: invitation.teamId,
          userId,
        },
      });

      if (existingMember) {
        throw new Error('User is already a team member');
      }

      // Add user to team
      const member = await this.addTeamMember(
        invitation.teamId,
        userId,
        invitation.role,
        invitation.invitedBy
      );

      // Update invitation status
      await prisma.teamInvitation.update({
        where: { id: invitation.id },
        data: { status: 'accepted' },
      });

      return member;
    } catch (error) {
      console.error('Accept invitation error:', error);
      throw error;
    }
  }

  /**
   * Get team members
   */
  async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    try {
      const members = await prisma.teamMember.findMany({
        where: { teamId },
        include: { user: true },
        orderBy: { joinedAt: 'desc' },
      });

      return members.map(member => this.mapTeamMember(member));
    } catch (error) {
      console.error('Get team members error:', error);
      throw error;
    }
  }

  /**
   * Update team member role
   */
  async updateMemberRole(
    teamId: string,
    memberId: string,
    newRole: string,
    updatedBy: string
  ): Promise<TeamMember> {
    try {
      // Check if updater has permission
      const updater = await this.getTeamMember(teamId, updatedBy);
      if (!updater || !this.hasPermission(updater, 'team:members:update')) {
        throw new Error('Insufficient permissions');
      }

      const member = await prisma.teamMember.update({
        where: { id: memberId },
        data: {
          role: newRole,
          permissions: this.getRolePermissions(newRole),
        },
      });

      return this.mapTeamMember(member);
    } catch (error) {
      console.error('Update member role error:', error);
      throw error;
    }
  }

  /**
   * Remove team member
   */
  async removeTeamMember(
    teamId: string,
    memberId: string,
    removedBy: string
  ): Promise<void> {
    try {
      // Check if remover has permission
      const remover = await this.getTeamMember(teamId, removedBy);
      if (!remover || !this.hasPermission(remover, 'team:members:remove')) {
        throw new Error('Insufficient permissions');
      }

      await prisma.teamMember.update({
        where: { id: memberId },
        data: { status: 'removed' },
      });
    } catch (error) {
      console.error('Remove team member error:', error);
      throw error;
    }
  }

  /**
   * Get team member
   */
  async getTeamMember(teamId: string, userId: string): Promise<TeamMember | null> {
    try {
      const member = await prisma.teamMember.findFirst({
        where: {
          teamId,
          userId,
          status: 'active',
        },
      });

      return member ? this.mapTeamMember(member) : null;
    } catch (error) {
      console.error('Get team member error:', error);
      throw error;
    }
  }

  /**
   * Check if user has permission
   */
  hasPermission(member: TeamMember, permission: string): boolean {
    return member.permissions.includes(permission) || member.permissions.includes('*');
  }

  /**
   * Get role permissions
   */
  private getRolePermissions(role: string): string[] {
    const rolePermissions: Record<string, string[]> = {
      owner: ['*'],
      admin: [
        'team:settings:update',
        'team:members:invite',
        'team:members:update',
        'team:members:remove',
        'team:content:create',
        'team:content:update',
        'team:content:delete',
        'team:analytics:view',
        'team:reports:create',
      ],
      manager: [
        'team:members:invite',
        'team:content:create',
        'team:content:update',
        'team:content:delete',
        'team:analytics:view',
        'team:reports:create',
      ],
      member: [
        'team:content:create',
        'team:content:update',
        'team:analytics:view',
      ],
      viewer: [
        'team:analytics:view',
      ],
    };

    return rolePermissions[role] || [];
  }

  /**
   * Generate team slug
   */
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  /**
   * Generate invitation token
   */
  private generateInvitationToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  /**
   * Send invitation email
   */
  private async sendInvitationEmail(invitation: any): Promise<void> {
    // TODO: Implement email service
    console.log(`Sending invitation email to ${invitation.email}`);
  }

  /**
   * Map database team to interface
   */
  private mapTeam(team: any): Team {
    return {
      id: team.id,
      name: team.name,
      description: team.description,
      slug: team.slug,
      ownerId: team.ownerId,
      settings: team.settings as TeamSettings,
      subscription: team.subscription as TeamSubscription,
      isActive: team.isActive,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
    };
  }

  /**
   * Map database team member to interface
   */
  private mapTeamMember(member: any): TeamMember {
    return {
      id: member.id,
      teamId: member.teamId,
      userId: member.userId,
      role: member.role,
      permissions: member.permissions,
      status: member.status,
      joinedAt: member.joinedAt,
      invitedBy: member.invitedBy,
      lastActiveAt: member.lastActiveAt,
      metadata: member.metadata,
    };
  }

  /**
   * Map database team invitation to interface
   */
  private mapTeamInvitation(invitation: any): TeamInvitation {
    return {
      id: invitation.id,
      teamId: invitation.teamId,
      email: invitation.email,
      role: invitation.role,
      invitedBy: invitation.invitedBy,
      token: invitation.token,
      expiresAt: invitation.expiresAt,
      status: invitation.status,
      createdAt: invitation.createdAt,
    };
  }
}

// Export singleton instance
export const teamManagementService = new TeamManagementService();
