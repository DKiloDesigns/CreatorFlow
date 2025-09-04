import { prisma } from '@/lib/prisma';
import { defaultCache as cache } from './cache';
import { performanceMonitor } from './performance-monitor';

interface Team {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  settings: any;
  members: TeamMember[];
}

interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  permissions: string[];
  joinedAt: Date;
  user: any;
}

interface Workspace {
  id: string;
  name: string;
  description: string;
  teamId: string;
  createdAt: Date;
  updatedAt: Date;
  settings: any;
  projects: Project[];
}

interface Project {
  id: string;
  name: string;
  description: string;
  workspaceId: string;
  status: 'active' | 'archived' | 'draft';
  createdAt: Date;
  updatedAt: Date;
  members: ProjectMember[];
}

interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  permissions: string[];
  joinedAt: Date;
}

interface ApprovalWorkflow {
  id: string;
  name: string;
  description: string;
  teamId: string;
  steps: ApprovalStep[];
  active: boolean;
  createdAt: Date;
}

interface ApprovalStep {
  id: string;
  workflowId: string;
  name: string;
  order: number;
  approverRole: string;
  required: boolean;
  autoApprove: boolean;
}

interface ApprovalRequest {
  id: string;
  workflowId: string;
  requesterId: string;
  contentId: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  currentStep: number;
  createdAt: Date;
  updatedAt: Date;
  approvals: Approval[];
}

interface Approval {
  id: string;
  requestId: string;
  approverId: string;
  stepId: string;
  status: 'pending' | 'approved' | 'rejected';
  comment?: string;
  createdAt: Date;
}

class EnterpriseManager {
  private cache: any;
  private performanceMonitor: any;

  constructor() {
    this.cache = cache;
    this.performanceMonitor = performanceMonitor;
  }

  // Team management
  async createTeam(name: string, description: string, ownerId: string): Promise<Team> {
    try {
      const team = await prisma.team.create({
        data: {
          name,
          description,
          ownerId,
          settings: JSON.stringify({
            allowInvites: true,
            requireApproval: false,
            maxMembers: 50,
          }),
        },
        include: {
          members: {
            include: {
              user: true,
            },
          },
        },
      });

      // Add owner as first member
      await prisma.teamMember.create({
        data: {
          teamId: team.id,
          userId: ownerId,
          role: 'owner',
          permissions: JSON.stringify(['*']),
        },
      });

      return {
        ...team,
        settings: JSON.parse(team.settings),
        members: team.members.map(member => ({
          ...member,
          permissions: JSON.parse(member.permissions),
        })) as any,
      } as any;
    } catch (error) {
      console.error('Error creating team:', error);
      throw new Error('Failed to create team');
    }
  }

  async getTeam(teamId: string): Promise<Team | null> {
    try {
      const team = await prisma.team.findUnique({
        where: { id: teamId },
        include: {
          members: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!team) return null;

      return {
        ...team,
        settings: JSON.parse(team.settings),
        members: team.members.map(member => ({
          ...member,
          permissions: JSON.parse(member.permissions),
        })) as any,
      } as any;
    } catch (error) {
      console.error('Error getting team:', error);
      return null;
    }
  }

  async addTeamMember(teamId: string, userId: string, role: string, permissions: string[]): Promise<TeamMember> {
    try {
      const member = await prisma.teamMember.create({
        data: {
          teamId,
          userId,
          role: role as any,
          permissions: JSON.stringify(permissions),
        },
        include: {
          user: true,
        },
      });

      return {
        ...member,
        permissions: JSON.parse(member.permissions),
      };
    } catch (error) {
      console.error('Error adding team member:', error);
      throw new Error('Failed to add team member');
    }
  }

  async updateTeamMemberRole(teamId: string, userId: string, role: string, permissions: string[]): Promise<TeamMember> {
    try {
      const member = await prisma.teamMember.update({
        where: {
          teamId_userId: {
            teamId,
            userId,
          },
        },
        data: {
          role: role as any,
          permissions: JSON.stringify(permissions),
        },
        include: {
          user: true,
        },
      });

      return {
        ...member,
        permissions: JSON.parse(member.permissions),
      };
    } catch (error) {
      console.error('Error updating team member role:', error);
      throw new Error('Failed to update team member role');
    }
  }

  // Workspace management
  async createWorkspace(name: string, description: string, teamId: string): Promise<Workspace> {
    try {
      const workspace = await prisma.workspace.create({
        data: {
          name,
          description,
          teamId,
          settings: JSON.stringify({
            allowPublicSharing: false,
            requireApproval: true,
            maxProjects: 100,
          }),
        },
        include: {
          projects: {
            include: {
              members: true,
            },
          },
        },
      });

      return {
        ...workspace,
        settings: JSON.parse(workspace.settings),
        projects: workspace.projects.map(project => ({
          ...project,
          members: project.members.map(member => ({
            ...member,
            permissions: JSON.parse(member.permissions),
          })),
        })),
      };
    } catch (error) {
      console.error('Error creating workspace:', error);
      throw new Error('Failed to create workspace');
    }
  }

  async getWorkspace(workspaceId: string): Promise<Workspace | null> {
    try {
      const workspace = await prisma.workspace.findUnique({
        where: { id: workspaceId },
        include: {
          projects: {
            include: {
              members: true,
            },
          },
        },
      });

      if (!workspace) return null;

      return {
        ...workspace,
        settings: JSON.parse(workspace.settings),
        projects: workspace.projects.map(project => ({
          ...project,
          members: project.members.map(member => ({
            ...member,
            permissions: JSON.parse(member.permissions),
          })),
        })),
      };
    } catch (error) {
      console.error('Error getting workspace:', error);
      return null;
    }
  }

  // Project management
  async createProject(name: string, description: string, workspaceId: string, ownerId: string): Promise<Project> {
    try {
      const project = await prisma.project.create({
        data: {
          name,
          description,
          workspaceId,
          status: 'active',
        },
        include: {
          members: true,
        },
      });

      // Add owner as first member
      await prisma.projectMember.create({
        data: {
          projectId: project.id,
          userId: ownerId,
          role: 'owner',
          permissions: JSON.stringify(['*']),
        },
      });

      return {
        ...project,
        members: project.members.map(member => ({
          ...member,
          permissions: JSON.parse(member.permissions),
        })),
      };
    } catch (error) {
      console.error('Error creating project:', error);
      throw new Error('Failed to create project');
    }
  }

  // Approval workflows
  async createApprovalWorkflow(name: string, description: string, teamId: string, steps: any[]): Promise<ApprovalWorkflow> {
    try {
      const workflow = await prisma.approvalWorkflow.create({
        data: {
          name,
          description,
          teamId,
          active: true,
          steps: {
            create: steps.map((step, index) => ({
              name: step.name,
              order: index + 1,
              approverRole: step.approverRole,
              required: step.required,
              autoApprove: step.autoApprove,
            })),
          },
        },
        include: {
          steps: true,
        },
      });

      return {
        ...workflow,
        steps: workflow.steps,
      };
    } catch (error) {
      console.error('Error creating approval workflow:', error);
      throw new Error('Failed to create approval workflow');
    }
  }

  async submitApprovalRequest(workflowId: string, requesterId: string, contentId: string): Promise<ApprovalRequest> {
    try {
      const workflow = await prisma.approvalWorkflow.findUnique({
        where: { id: workflowId },
        include: { steps: true },
      });

      if (!workflow) {
        throw new Error('Workflow not found');
      }

      const request = await prisma.approvalRequest.create({
        data: {
          workflowId,
          requesterId,
          contentId,
          status: 'pending',
          currentStep: 1,
        },
        include: {
          approvals: {
            include: {
              step: true,
            },
          },
        },
      });

      // Create initial approvals for first step
      const firstStep = workflow.steps.find(s => s.order === 1);
      if (firstStep) {
        await prisma.approval.create({
          data: {
            requestId: request.id,
            stepId: firstStep.id,
            status: 'pending',
          },
        });
      }

      return {
        ...request,
        approvals: request.approvals.map(approval => ({
          ...approval,
          step: approval.step,
        })),
      };
    } catch (error) {
      console.error('Error submitting approval request:', error);
      throw new Error('Failed to submit approval request');
    }
  }

  async approveContent(requestId: string, approverId: string, approved: boolean, comment?: string): Promise<ApprovalRequest> {
    try {
      const request = await prisma.approvalRequest.findUnique({
        where: { id: requestId },
        include: {
          workflow: {
            include: { steps: true },
          },
          approvals: {
            include: { step: true },
          },
        },
      });

      if (!request) {
        throw new Error('Approval request not found');
      }

      // Update current approval
      await prisma.approval.updateMany({
        where: {
          requestId,
          stepId: request.workflow.steps.find(s => s.order === request.currentStep)?.id,
        },
        data: {
          approverId,
          status: approved ? 'approved' : 'rejected',
          comment,
        },
      });

      if (!approved) {
        // Reject the request
        await prisma.approvalRequest.update({
          where: { id: requestId },
          data: { status: 'rejected' },
        });
      } else {
        // Check if all steps are complete
        const currentStep = request.workflow.steps.find(s => s.order === request.currentStep);
        const nextStep = request.workflow.steps.find(s => s.order === request.currentStep + 1);

        if (!nextStep) {
          // All steps complete, approve the request
          await prisma.approvalRequest.update({
            where: { id: requestId },
            data: { status: 'approved' },
          });
        } else {
          // Move to next step
          await prisma.approvalRequest.update({
            where: { id: requestId },
            data: { currentStep: request.currentStep + 1 },
          });

          // Create approval for next step
          await prisma.approval.create({
            data: {
              requestId,
              stepId: nextStep.id,
              status: 'pending',
            },
          });
        }
      }

      return await this.getApprovalRequest(requestId) as any;
    } catch (error) {
      console.error('Error approving content:', error);
      throw new Error('Failed to approve content');
    }
  }

  async getApprovalRequest(requestId: string): Promise<ApprovalRequest | null> {
    try {
      const request = await prisma.approvalRequest.findUnique({
        where: { id: requestId },
        include: {
          workflow: {
            include: { steps: true },
          },
          approvals: {
            include: { step: true },
          },
        },
      });

      if (!request) return null;

      return {
        ...request,
        approvals: request.approvals.map(approval => ({
          ...approval,
          step: approval.step,
        })),
      };
    } catch (error) {
      console.error('Error getting approval request:', error);
      return null;
    }
  }

  // Enterprise analytics
  async getTeamAnalytics(teamId: string): Promise<{
    memberCount: number;
    activeProjects: number;
    totalContent: number;
    approvalRate: number;
    averageResponseTime: number;
  }> {
    try {
      const [members, projects, content, approvals] = await Promise.all([
        prisma.teamMember.count({ where: { teamId } }),
        prisma.project.count({ where: { workspace: { teamId }, status: 'active' } }),
        prisma.post.count({ where: { userId: { in: await this.getTeamUserIds(teamId) } } }),
        prisma.approvalRequest.findMany({
          where: { workflow: { teamId } },
          include: { approvals: true },
        }),
      ]);

      const approvalRate = approvals.length > 0 
        ? (approvals.filter(a => a.status === 'approved').length / approvals.length) * 100 
        : 0;

      const averageResponseTime = approvals.length > 0
        ? approvals.reduce((sum, a) => {
            const createdAt = new Date(a.createdAt).getTime();
            const updatedAt = new Date(a.updatedAt).getTime();
            return sum + (updatedAt - createdAt);
          }, 0) / approvals.length / (1000 * 60 * 60) // Convert to hours
        : 0;

      return {
        memberCount: members,
        activeProjects: projects,
        totalContent: content,
        approvalRate,
        averageResponseTime,
      };
    } catch (error) {
      console.error('Error getting team analytics:', error);
      return {
        memberCount: 0,
        activeProjects: 0,
        totalContent: 0,
        approvalRate: 0,
        averageResponseTime: 0,
      };
    }
  }

  // Helper methods
  private async getTeamUserIds(teamId: string): Promise<string[]> {
    try {
      const members = await prisma.teamMember.findMany({
        where: { teamId },
        select: { userId: true },
      });
      return members.map(m => m.userId);
    } catch (error) {
      console.error('Error getting team user IDs:', error);
      return [];
    }
  }
}

// Export enterprise manager instance
export const enterpriseManager = new EnterpriseManager(); 