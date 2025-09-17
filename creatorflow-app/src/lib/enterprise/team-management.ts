/**
 * Advanced Team Management System
 * Role-based access control and team collaboration
 */

export interface TeamManagementSystem {
  organizationId: string;
  teams: Team[];
  roles: Role[];
  permissions: Permission[];
  invitations: Invitation[];
  auditLog: AuditLogEntry[];
  settings: TeamManagementSettings;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  organizationId: string;
  members: TeamMember[];
  settings: TeamSettings;
  permissions: TeamPermissions;
  content: TeamContentSettings;
  analytics: TeamAnalytics;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface TeamMember {
  id: string;
  userId: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
  permissions: string[];
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  joinedAt: string;
  lastActiveAt: string;
  invitedBy: string;
  profile: {
    department?: string;
    title?: string;
    phone?: string;
    timezone: string;
    language: string;
    preferences: Record<string, any>;
  };
  activity: {
    totalPosts: number;
    totalEngagement: number;
    lastPostAt?: string;
    averageEngagement: number;
  };
}

export interface TeamSettings {
  general: {
    maxMembers: number;
    allowSelfJoin: boolean;
    requireApproval: boolean;
    defaultRole: string;
    visibility: 'private' | 'public' | 'organization';
  };
  notifications: {
    newMembers: boolean;
    roleChanges: boolean;
    contentUpdates: boolean;
    mentions: boolean;
    comments: boolean;
    approvals: boolean;
  };
  content: {
    allowCrossTeam: boolean;
    requireApproval: boolean;
    defaultVisibility: 'private' | 'team' | 'organization' | 'public';
    allowScheduling: boolean;
    allowPublishing: boolean;
    allowDrafting: boolean;
  };
  collaboration: {
    allowComments: boolean;
    allowMentions: boolean;
    allowSharing: boolean;
    allowTemplates: boolean;
    allowBrandKit: boolean;
  };
  security: {
    ipWhitelist: string[];
    sessionTimeout: number;
    require2FA: boolean;
    passwordPolicy: PasswordPolicy;
  };
}

export interface TeamPermissions {
  content: {
    create: boolean;
    edit: boolean;
    delete: boolean;
    publish: boolean;
    schedule: boolean;
    approve: boolean;
    view: boolean;
  };
  analytics: {
    view: boolean;
    export: boolean;
    share: boolean;
    createReports: boolean;
  };
  team: {
    invite: boolean;
    remove: boolean;
    edit: boolean;
    delete: boolean;
    viewMembers: boolean;
    manageRoles: boolean;
  };
  organization: {
    view: boolean;
    edit: boolean;
    admin: boolean;
    billing: boolean;
  };
  integrations: {
    connect: boolean;
    disconnect: boolean;
    configure: boolean;
    view: boolean;
  };
}

export interface TeamContentSettings {
  templates: {
    allowed: string[];
    custom: string[];
    shared: string[];
  };
  brandKit: {
    enabled: boolean;
    assets: string[];
    guidelines: string;
  };
  approval: {
    enabled: boolean;
    levels: ApprovalLevel[];
    autoApprove: boolean;
    timeout: number; // hours
  };
  scheduling: {
    enabled: boolean;
    maxAdvance: number; // days
    timezone: string;
    businessHours: {
      start: string;
      end: string;
      days: string[];
    };
  };
}

export interface ApprovalLevel {
  id: string;
  name: string;
  order: number;
  approvers: string[];
  conditions: {
    contentTypes: string[];
    platforms: string[];
    minEngagement?: number;
  };
  timeout: number; // hours
  autoApprove: boolean;
}

export interface TeamAnalytics {
  overview: {
    totalMembers: number;
    activeMembers: number;
    totalContent: number;
    totalEngagement: number;
    averageEngagement: number;
    topPerformer: string;
  };
  performance: {
    engagementRate: number;
    clickThroughRate: number;
    conversionRate: number;
    reachRate: number;
    growthRate: number;
  };
  trends: {
    daily: Array<{
      date: string;
      metrics: Record<string, number>;
    }>;
    weekly: Array<{
      week: string;
      metrics: Record<string, number>;
    }>;
    monthly: Array<{
      month: string;
      metrics: Record<string, number>;
    }>;
  };
  members: Array<{
    memberId: string;
    name: string;
    metrics: Record<string, number>;
    performance: number;
    rank: number;
  }>;
  content: Array<{
    contentId: string;
    title: string;
    author: string;
    metrics: Record<string, number>;
    performance: number;
    status: string;
  }>;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  organizationId: string;
  teamId?: string;
  permissions: string[];
  isDefault: boolean;
  isSystem: boolean;
  isCustom: boolean;
  hierarchy: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  resource: string;
  action: string;
  conditions?: Record<string, any>;
  isSystem: boolean;
  createdAt: string;
}

export interface Invitation {
  id: string;
  email: string;
  teamId: string;
  role: string;
  permissions: string[];
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  invitedBy: string;
  invitedAt: string;
  expiresAt: string;
  acceptedAt?: string;
  declinedAt?: string;
  message?: string;
  customPermissions?: string[];
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  organizationId: string;
  teamId?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface TeamManagementSettings {
  organization: {
    maxTeams: number;
    maxMembersPerTeam: number;
    allowCrossTeamContent: boolean;
    requireApprovalForPublishing: boolean;
    defaultRole: string;
  };
  security: {
    require2FA: boolean;
    sessionTimeout: number;
    ipWhitelist: string[];
    passwordPolicy: PasswordPolicy;
    auditRetention: number; // days
  };
  notifications: {
    email: boolean;
    inApp: boolean;
    sms: boolean;
    webhook: boolean;
  };
  integrations: {
    sso: boolean;
    ldap: boolean;
    activeDirectory: boolean;
    custom: boolean;
  };
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSymbols: boolean;
  maxAge: number; // days
  preventReuse: number; // number of previous passwords
  lockoutAttempts: number;
  lockoutDuration: number; // minutes
}

export interface TeamCollaboration {
  teamId: string;
  content: {
    shared: string[];
    drafts: string[];
    scheduled: string[];
    published: string[];
  };
  comments: Array<{
    id: string;
    contentId: string;
    author: string;
    message: string;
    timestamp: string;
    replies: Array<{
      id: string;
      author: string;
      message: string;
      timestamp: string;
    }>;
  }>;
  mentions: Array<{
    id: string;
    contentId: string;
    mentionedBy: string;
    mentionedUser: string;
    message: string;
    timestamp: string;
    read: boolean;
  }>;
  approvals: Array<{
    id: string;
    contentId: string;
    requestedBy: string;
    approver: string;
    status: 'pending' | 'approved' | 'rejected';
    message?: string;
    requestedAt: string;
    respondedAt?: string;
  }>;
}

export class TeamManagementEngine {
  private teams: Map<string, Team> = new Map();
  private roles: Map<string, Role> = new Map();
  private permissions: Map<string, Permission> = new Map();
  private invitations: Map<string, Invitation> = new Map();
  private auditLog: AuditLogEntry[] = [];
  private collaboration: Map<string, TeamCollaboration> = new Map();

  constructor() {
    this.initializePermissions();
    this.initializeRoles();
  }

  // Team Management
  async createTeam(
    organizationId: string,
    name: string,
    description: string,
    createdBy: string,
    settings?: Partial<TeamSettings>
  ): Promise<Team> {
    const teamId = `team_${Date.now()}`;
    
    const team: Team = {
      id: teamId,
      name,
      description,
      organizationId,
      members: [],
      settings: {
        general: {
          maxMembers: 50,
          allowSelfJoin: false,
          requireApproval: true,
          defaultRole: 'member',
          visibility: 'private'
        },
        notifications: {
          newMembers: true,
          roleChanges: true,
          contentUpdates: true,
          mentions: true,
          comments: true,
          approvals: true
        },
        content: {
          allowCrossTeam: false,
          requireApproval: true,
          defaultVisibility: 'team',
          allowScheduling: true,
          allowPublishing: false,
          allowDrafting: true
        },
        collaboration: {
          allowComments: true,
          allowMentions: true,
          allowSharing: true,
          allowTemplates: true,
          allowBrandKit: true
        },
        security: {
          ipWhitelist: [],
          sessionTimeout: 3600,
          require2FA: false,
          passwordPolicy: this.getDefaultPasswordPolicy()
        },
        ...settings
      },
      permissions: this.getDefaultTeamPermissions(),
      content: {
        templates: {
          allowed: [],
          custom: [],
          shared: []
        },
        brandKit: {
          enabled: false,
          assets: [],
          guidelines: ''
        },
        approval: {
          enabled: true,
          levels: [],
          autoApprove: false,
          timeout: 24
        },
        scheduling: {
          enabled: true,
          maxAdvance: 365,
          timezone: 'UTC',
          businessHours: {
            start: '09:00',
            end: '17:00',
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
          }
        }
      },
      analytics: this.initializeTeamAnalytics(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy
    };

    this.teams.set(teamId, team);
    this.collaboration.set(teamId, this.initializeCollaboration(teamId));
    
    await this.logAudit(createdBy, 'create_team', 'team', teamId, { name, description });
    
    return team;
  }

  async getTeam(teamId: string): Promise<Team | null> {
    return this.teams.get(teamId) || null;
  }

  async updateTeam(
    teamId: string,
    updates: Partial<Team>,
    userId: string
  ): Promise<Team> {
    const team = this.teams.get(teamId);
    if (!team) {
      throw new Error('Team not found');
    }

    const updatedTeam = {
      ...team,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.teams.set(teamId, updatedTeam);
    await this.logAudit(userId, 'update_team', 'team', teamId, updates);
    
    return updatedTeam;
  }

  async deleteTeam(teamId: string, userId: string): Promise<boolean> {
    const team = this.teams.get(teamId);
    if (!team) {
      return false;
    }

    this.teams.delete(teamId);
    this.collaboration.delete(teamId);
    await this.logAudit(userId, 'delete_team', 'team', teamId, { name: team.name });
    
    return true;
  }

  // Member Management
  async addTeamMember(
    teamId: string,
    userId: string,
    email: string,
    name: string,
    role: string,
    invitedBy: string,
    profile?: Partial<TeamMember['profile']>
  ): Promise<TeamMember> {
    const team = this.teams.get(teamId);
    if (!team) {
      throw new Error('Team not found');
    }

    const member: TeamMember = {
      id: `member_${Date.now()}`,
      userId,
      email,
      name,
      role,
      permissions: this.getRolePermissions(role),
      status: 'pending',
      joinedAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      invitedBy,
      profile: {
        timezone: 'UTC',
        language: 'en',
        preferences: {},
        ...profile
      },
      activity: {
        totalPosts: 0,
        totalEngagement: 0,
        averageEngagement: 0
      }
    };

    team.members.push(member);
    team.updatedAt = new Date().toISOString();
    
    this.teams.set(teamId, team);
    await this.logAudit(invitedBy, 'add_team_member', 'team_member', member.id, { email, role });
    
    return member;
  }

  async updateTeamMember(
    teamId: string,
    memberId: string,
    updates: Partial<TeamMember>,
    userId: string
  ): Promise<TeamMember> {
    const team = this.teams.get(teamId);
    if (!team) {
      throw new Error('Team not found');
    }

    const memberIndex = team.members.findIndex(m => m.id === memberId);
    if (memberIndex === -1) {
      throw new Error('Team member not found');
    }

    team.members[memberIndex] = {
      ...team.members[memberIndex],
      ...updates,
      id: memberId
    };
    team.updatedAt = new Date().toISOString();
    
    this.teams.set(teamId, team);
    await this.logAudit(userId, 'update_team_member', 'team_member', memberId, updates);
    
    return team.members[memberIndex];
  }

  async removeTeamMember(teamId: string, memberId: string, userId: string): Promise<boolean> {
    const team = this.teams.get(teamId);
    if (!team) {
      return false;
    }

    const memberIndex = team.members.findIndex(m => m.id === memberId);
    if (memberIndex === -1) {
      return false;
    }

    const member = team.members[memberIndex];
    team.members.splice(memberIndex, 1);
    team.updatedAt = new Date().toISOString();
    
    this.teams.set(teamId, team);
    await this.logAudit(userId, 'remove_team_member', 'team_member', memberId, { email: member.email });
    
    return true;
  }

  // Role Management
  async createRole(
    organizationId: string,
    name: string,
    description: string,
    permissions: string[],
    createdBy: string,
    teamId?: string
  ): Promise<Role> {
    const roleId = `role_${Date.now()}`;
    
    const role: Role = {
      id: roleId,
      name,
      description,
      organizationId,
      teamId,
      permissions,
      isDefault: false,
      isSystem: false,
      isCustom: true,
      hierarchy: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy
    };

    this.roles.set(roleId, role);
    await this.logAudit(createdBy, 'create_role', 'role', roleId, { name, permissions });
    
    return role;
  }

  async getRole(roleId: string): Promise<Role | null> {
    return this.roles.get(roleId) || null;
  }

  async updateRole(
    roleId: string,
    updates: Partial<Role>,
    userId: string
  ): Promise<Role> {
    const role = this.roles.get(roleId);
    if (!role) {
      throw new Error('Role not found');
    }

    if (role.isSystem) {
      throw new Error('Cannot modify system roles');
    }

    const updatedRole = {
      ...role,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.roles.set(roleId, updatedRole);
    await this.logAudit(userId, 'update_role', 'role', roleId, updates);
    
    return updatedRole;
  }

  async deleteRole(roleId: string, userId: string): Promise<boolean> {
    const role = this.roles.get(roleId);
    if (!role) {
      return false;
    }

    if (role.isSystem) {
      throw new Error('Cannot delete system roles');
    }

    this.roles.delete(roleId);
    await this.logAudit(userId, 'delete_role', 'role', roleId, { name: role.name });
    
    return true;
  }

  // Invitation Management
  async createInvitation(
    teamId: string,
    email: string,
    role: string,
    invitedBy: string,
    message?: string,
    customPermissions?: string[]
  ): Promise<Invitation> {
    const invitationId = `invitation_${Date.now()}`;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    
    const invitation: Invitation = {
      id: invitationId,
      email,
      teamId,
      role,
      permissions: this.getRolePermissions(role),
      status: 'pending',
      invitedBy,
      invitedAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
      message,
      customPermissions
    };

    this.invitations.set(invitationId, invitation);
    await this.logAudit(invitedBy, 'create_invitation', 'invitation', invitationId, { email, role });
    
    return invitation;
  }

  async acceptInvitation(invitationId: string, userId: string): Promise<boolean> {
    const invitation = this.invitations.get(invitationId);
    if (!invitation || invitation.status !== 'pending') {
      return false;
    }

    if (new Date() > new Date(invitation.expiresAt)) {
      invitation.status = 'expired';
      this.invitations.set(invitationId, invitation);
      return false;
    }

    invitation.status = 'accepted';
    invitation.acceptedAt = new Date().toISOString();
    
    this.invitations.set(invitationId, invitation);
    await this.logAudit(userId, 'accept_invitation', 'invitation', invitationId, { email: invitation.email });
    
    return true;
  }

  async declineInvitation(invitationId: string, userId: string): Promise<boolean> {
    const invitation = this.invitations.get(invitationId);
    if (!invitation || invitation.status !== 'pending') {
      return false;
    }

    invitation.status = 'declined';
    invitation.declinedAt = new Date().toISOString();
    
    this.invitations.set(invitationId, invitation);
    await this.logAudit(userId, 'decline_invitation', 'invitation', invitationId, { email: invitation.email });
    
    return true;
  }

  // Collaboration
  async addComment(
    teamId: string,
    contentId: string,
    author: string,
    message: string
  ): Promise<string> {
    const collaboration = this.collaboration.get(teamId);
    if (!collaboration) {
      throw new Error('Team collaboration not found');
    }

    const commentId = `comment_${Date.now()}`;
    const comment = {
      id: commentId,
      contentId,
      author,
      message,
      timestamp: new Date().toISOString(),
      replies: []
    };

    collaboration.comments.push(comment);
    this.collaboration.set(teamId, collaboration);
    
    return commentId;
  }

  async addMention(
    teamId: string,
    contentId: string,
    mentionedBy: string,
    mentionedUser: string,
    message: string
  ): Promise<string> {
    const collaboration = this.collaboration.get(teamId);
    if (!collaboration) {
      throw new Error('Team collaboration not found');
    }

    const mentionId = `mention_${Date.now()}`;
    const mention = {
      id: mentionId,
      contentId,
      mentionedBy,
      mentionedUser,
      message,
      timestamp: new Date().toISOString(),
      read: false
    };

    collaboration.mentions.push(mention);
    this.collaboration.set(teamId, collaboration);
    
    return mentionId;
  }

  async requestApproval(
    teamId: string,
    contentId: string,
    requestedBy: string,
    approver: string,
    message?: string
  ): Promise<string> {
    const collaboration = this.collaboration.get(teamId);
    if (!collaboration) {
      throw new Error('Team collaboration not found');
    }

    const approvalId = `approval_${Date.now()}`;
    const approval = {
      id: approvalId,
      contentId,
      requestedBy,
      approver,
      status: 'pending' as const,
      message,
      requestedAt: new Date().toISOString()
    };

    collaboration.approvals.push(approval);
    this.collaboration.set(teamId, collaboration);
    
    return approvalId;
  }

  // Analytics
  async getTeamAnalytics(teamId: string): Promise<TeamAnalytics> {
    const team = this.teams.get(teamId);
    if (!team) {
      throw new Error('Team not found');
    }

    // Mock analytics data - in real implementation, this would query actual data
    return {
      overview: {
        totalMembers: team.members.length,
        activeMembers: team.members.filter(m => m.status === 'active').length,
        totalContent: 250,
        totalEngagement: 15000,
        averageEngagement: 60,
        topPerformer: team.members[0]?.name || 'Unknown'
      },
      performance: {
        engagementRate: 3.6,
        clickThroughRate: 6.8,
        conversionRate: 2.56,
        reachRate: 8.2,
        growthRate: 15.5
      },
      trends: {
        daily: this.generateTrendData('daily', 30),
        weekly: this.generateTrendData('weekly', 12),
        monthly: this.generateTrendData('monthly', 6)
      },
      members: team.members.map((member, index) => ({
        memberId: member.id,
        name: member.name,
        metrics: {
          posts: Math.floor(Math.random() * 50) + 10,
          engagement: Math.floor(Math.random() * 1000) + 100,
          reach: Math.floor(Math.random() * 5000) + 500
        },
        performance: Math.floor(Math.random() * 100),
        rank: index + 1
      })),
      content: [
        {
          contentId: 'content1',
          title: 'Product Launch',
          author: 'John Doe',
          metrics: { engagement: 5000, reach: 15000, clicks: 250 },
          performance: 95,
          status: 'published'
        },
        {
          contentId: 'content2',
          title: 'Company Update',
          author: 'Jane Smith',
          metrics: { engagement: 3000, reach: 8000, clicks: 180 },
          performance: 78,
          status: 'scheduled'
        }
      ]
    };
  }

  // Audit Log
  async getAuditLog(
    organizationId: string,
    filters?: {
      userId?: string;
      action?: string;
      resource?: string;
      teamId?: string;
      dateRange?: { start: string; end: string };
      severity?: string;
      limit?: number;
    }
  ): Promise<AuditLogEntry[]> {
    let entries = this.auditLog.filter(entry => entry.organizationId === organizationId);

    if (filters) {
      if (filters.userId) {
        entries = entries.filter(entry => entry.userId === filters.userId);
      }
      if (filters.action) {
        entries = entries.filter(entry => entry.action === filters.action);
      }
      if (filters.resource) {
        entries = entries.filter(entry => entry.resource === filters.resource);
      }
      if (filters.teamId) {
        entries = entries.filter(entry => entry.teamId === filters.teamId);
      }
      if (filters.dateRange) {
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        entries = entries.filter(entry => {
          const timestamp = new Date(entry.timestamp);
          return timestamp >= startDate && timestamp <= endDate;
        });
      }
      if (filters.severity) {
        entries = entries.filter(entry => entry.severity === filters.severity);
      }
      if (filters.limit) {
        entries = entries.slice(0, filters.limit);
      }
    }

    return entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // Private helper methods
  private initializeTeamAnalytics(): TeamAnalytics {
    return {
      overview: {
        totalMembers: 0,
        activeMembers: 0,
        totalContent: 0,
        totalEngagement: 0,
        averageEngagement: 0,
        topPerformer: 'Unknown'
      },
      performance: {
        engagementRate: 0,
        clickThroughRate: 0,
        conversionRate: 0,
        reachRate: 0,
        growthRate: 0
      },
      trends: {
        daily: [],
        weekly: [],
        monthly: []
      },
      members: [],
      content: []
    };
  }

  private initializeCollaboration(teamId: string): TeamCollaboration {
    return {
      teamId,
      content: {
        shared: [],
        drafts: [],
        scheduled: [],
        published: []
      },
      comments: [],
      mentions: [],
      approvals: []
    };
  }

  private getDefaultTeamPermissions(): TeamPermissions {
    return {
      content: {
        create: true,
        edit: true,
        delete: false,
        publish: false,
        schedule: true,
        approve: false,
        view: true
      },
      analytics: {
        view: true,
        export: false,
        share: false,
        createReports: false
      },
      team: {
        invite: false,
        remove: false,
        edit: false,
        delete: false,
        viewMembers: true,
        manageRoles: false
      },
      organization: {
        view: true,
        edit: false,
        admin: false,
        billing: false
      },
      integrations: {
        connect: false,
        disconnect: false,
        configure: false,
        view: true
      }
    };
  }

  private getDefaultPasswordPolicy(): PasswordPolicy {
    return {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSymbols: false,
      maxAge: 90,
      preventReuse: 5,
      lockoutAttempts: 5,
      lockoutDuration: 30
    };
  }

  private initializePermissions(): void {
    const permissions: Permission[] = [
      // Content permissions
      { id: 'content_create', name: 'Create Content', description: 'Create new content', category: 'content', resource: 'content', action: 'create', isSystem: true, createdAt: new Date().toISOString() },
      { id: 'content_edit', name: 'Edit Content', description: 'Edit existing content', category: 'content', resource: 'content', action: 'edit', isSystem: true, createdAt: new Date().toISOString() },
      { id: 'content_delete', name: 'Delete Content', description: 'Delete content', category: 'content', resource: 'content', action: 'delete', isSystem: true, createdAt: new Date().toISOString() },
      { id: 'content_publish', name: 'Publish Content', description: 'Publish content to platforms', category: 'content', resource: 'content', action: 'publish', isSystem: true, createdAt: new Date().toISOString() },
      { id: 'content_schedule', name: 'Schedule Content', description: 'Schedule content for future publishing', category: 'content', resource: 'content', action: 'schedule', isSystem: true, createdAt: new Date().toISOString() },
      { id: 'content_approve', name: 'Approve Content', description: 'Approve content for publishing', category: 'content', resource: 'content', action: 'approve', isSystem: true, createdAt: new Date().toISOString() },
      
      // Analytics permissions
      { id: 'analytics_view', name: 'View Analytics', description: 'View analytics data', category: 'analytics', resource: 'analytics', action: 'view', isSystem: true, createdAt: new Date().toISOString() },
      { id: 'analytics_export', name: 'Export Analytics', description: 'Export analytics data', category: 'analytics', resource: 'analytics', action: 'export', isSystem: true, createdAt: new Date().toISOString() },
      { id: 'analytics_share', name: 'Share Analytics', description: 'Share analytics with others', category: 'analytics', resource: 'analytics', action: 'share', isSystem: true, createdAt: new Date().toISOString() },
      
      // Team permissions
      { id: 'team_invite', name: 'Invite Members', description: 'Invite new team members', category: 'team', resource: 'team', action: 'invite', isSystem: true, createdAt: new Date().toISOString() },
      { id: 'team_remove', name: 'Remove Members', description: 'Remove team members', category: 'team', resource: 'team', action: 'remove', isSystem: true, createdAt: new Date().toISOString() },
      { id: 'team_edit', name: 'Edit Team', description: 'Edit team settings', category: 'team', resource: 'team', action: 'edit', isSystem: true, createdAt: new Date().toISOString() },
      { id: 'team_delete', name: 'Delete Team', description: 'Delete team', category: 'team', resource: 'team', action: 'delete', isSystem: true, createdAt: new Date().toISOString() },
      
      // Organization permissions
      { id: 'org_view', name: 'View Organization', description: 'View organization details', category: 'organization', resource: 'organization', action: 'view', isSystem: true, createdAt: new Date().toISOString() },
      { id: 'org_edit', name: 'Edit Organization', description: 'Edit organization settings', category: 'organization', resource: 'organization', action: 'edit', isSystem: true, createdAt: new Date().toISOString() },
      { id: 'org_admin', name: 'Organization Admin', description: 'Full organization administration', category: 'organization', resource: 'organization', action: 'admin', isSystem: true, createdAt: new Date().toISOString() }
    ];

    permissions.forEach(permission => {
      this.permissions.set(permission.id, permission);
    });
  }

  private initializeRoles(): void {
    const roles: Role[] = [
      {
        id: 'admin',
        name: 'Administrator',
        description: 'Full access to all features',
        organizationId: 'system',
        permissions: ['content_create', 'content_edit', 'content_delete', 'content_publish', 'content_schedule', 'content_approve', 'analytics_view', 'analytics_export', 'analytics_share', 'team_invite', 'team_remove', 'team_edit', 'team_delete', 'org_view', 'org_edit', 'org_admin'],
        isDefault: false,
        isSystem: true,
        isCustom: false,
        hierarchy: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'system'
      },
      {
        id: 'manager',
        name: 'Manager',
        description: 'Manage team and content',
        organizationId: 'system',
        permissions: ['content_create', 'content_edit', 'content_publish', 'content_schedule', 'content_approve', 'analytics_view', 'analytics_export', 'team_invite', 'team_remove', 'team_edit', 'org_view'],
        isDefault: false,
        isSystem: true,
        isCustom: false,
        hierarchy: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'system'
      },
      {
        id: 'member',
        name: 'Member',
        description: 'Basic content creation and viewing',
        organizationId: 'system',
        permissions: ['content_create', 'content_edit', 'analytics_view'],
        isDefault: true,
        isSystem: true,
        isCustom: false,
        hierarchy: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'system'
      }
    ];

    roles.forEach(role => {
      this.roles.set(role.id, role);
    });
  }

  private getRolePermissions(roleId: string): string[] {
    const role = this.roles.get(roleId);
    return role?.permissions || [];
  }

  private async logAudit(
    userId: string,
    action: string,
    resource: string,
    resourceId: string,
    details: Record<string, any>,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'low'
  ): Promise<void> {
    const entry: AuditLogEntry = {
      id: `audit_${Date.now()}`,
      userId,
      action,
      resource,
      resourceId,
      details,
      ipAddress: '127.0.0.1', // Mock IP
      userAgent: 'CreatorFlow/1.0', // Mock user agent
      timestamp: new Date().toISOString(),
      organizationId: 'org_1', // Mock organization ID
      severity
    };

    this.auditLog.push(entry);
  }

  private generateTrendData(period: 'daily' | 'weekly' | 'monthly', count: number): Array<{ date: string; metrics: Record<string, number> }> {
    const data = [];
    const now = new Date();
    
    for (let i = count - 1; i >= 0; i--) {
      let date: Date;
      
      switch (period) {
        case 'daily':
          date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
          break;
        case 'weekly':
          date = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
          break;
        case 'monthly':
          date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          break;
      }
      
      data.push({
        date: date.toISOString().split('T')[0],
        metrics: {
          engagement: Math.floor(Math.random() * 1000) + 500,
          reach: Math.floor(Math.random() * 5000) + 2000,
          clicks: Math.floor(Math.random() * 100) + 50,
          conversions: Math.floor(Math.random() * 20) + 5
        }
      });
    }
    
    return data;
  }
}
