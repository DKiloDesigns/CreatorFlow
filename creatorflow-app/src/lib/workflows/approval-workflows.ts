/**
 * Content Approval Workflows
 * Multi-level content approval processes
 */

export interface ApprovalWorkflow {
  id: string;
  name: string;
  description: string;
  type: 'content' | 'campaign' | 'template' | 'brand';
  steps: ApprovalStep[];
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface ApprovalStep {
  id: string;
  name: string;
  description: string;
  order: number;
  approvers: Approver[];
  conditions: ApprovalCondition[];
  timeout: number; // hours
  isRequired: boolean;
  canSkip: boolean;
  autoApprove: boolean;
  notifications: NotificationSettings;
}

export interface Approver {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  isRequired: boolean;
  canDelegate: boolean;
  delegateTo?: string;
}

export interface ApprovalCondition {
  type: 'content_type' | 'platform' | 'category' | 'author' | 'file_size' | 'content_length' | 'contains_keywords';
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'in' | 'not_in';
  value: any;
  description: string;
}

export interface NotificationSettings {
  email: boolean;
  inApp: boolean;
  slack: boolean;
  webhook?: string;
  reminderInterval: number; // hours
  escalationAfter: number; // hours
}

export interface ApprovalRequest {
  id: string;
  contentId: string;
  workflowId: string;
  title: string;
  description: string;
  content: string;
  metadata: {
    type: string;
    platform: string;
    category: string;
    author: string;
    fileSize: number;
    createdAt: string;
  };
  status: 'pending' | 'in_progress' | 'approved' | 'rejected' | 'cancelled' | 'expired';
  currentStep: number;
  steps: ApprovalStepStatus[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  submittedBy: string;
}

export interface ApprovalStepStatus {
  stepId: string;
  stepName: string;
  status: 'pending' | 'in_progress' | 'approved' | 'rejected' | 'skipped' | 'expired';
  approvers: Array<{
    approver: Approver;
    status: 'pending' | 'approved' | 'rejected' | 'delegated';
    comment?: string;
    timestamp: string;
  }>;
  startedAt?: string;
  completedAt?: string;
  timeoutAt?: string;
}

export interface ApprovalComment {
  id: string;
  requestId: string;
  stepId: string;
  author: string;
  content: string;
  isInternal: boolean;
  attachments: string[];
  createdAt: string;
}

export interface ApprovalAnalytics {
  totalRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  pendingRequests: number;
  averageApprovalTime: number; // hours
  averageStepsPerRequest: number;
  mostActiveApprovers: Array<{
    approver: Approver;
    requests: number;
    averageTime: number;
  }>;
  stepPerformance: Array<{
    step: ApprovalStep;
    averageTime: number;
    approvalRate: number;
    rejectionRate: number;
  }>;
  bottlenecks: Array<{
    step: ApprovalStep;
    averageDelay: number;
    commonIssues: string[];
  }>;
}

export class ApprovalWorkflowManager {
  private workflows: Map<string, ApprovalWorkflow> = new Map();
  private requests: Map<string, ApprovalRequest> = new Map();
  private comments: Map<string, ApprovalComment[]> = new Map();

  // Create workflow
  async createWorkflow(workflow: Omit<ApprovalWorkflow, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApprovalWorkflow> {
    const newWorkflow: ApprovalWorkflow = {
      ...workflow,
      id: `workflow_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.workflows.set(newWorkflow.id, newWorkflow);
    return newWorkflow;
  }

  // Get workflow
  async getWorkflow(workflowId: string): Promise<ApprovalWorkflow | null> {
    return this.workflows.get(workflowId) || null;
  }

  // Get workflows
  async getWorkflows(type?: string): Promise<ApprovalWorkflow[]> {
    let workflows = Array.from(this.workflows.values());

    if (type) {
      workflows = workflows.filter(w => w.type === type);
    }

    return workflows.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  // Update workflow
  async updateWorkflow(workflowId: string, updates: Partial<ApprovalWorkflow>): Promise<ApprovalWorkflow> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error('Workflow not found');
    }

    const updatedWorkflow = {
      ...workflow,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.workflows.set(workflowId, updatedWorkflow);
    return updatedWorkflow;
  }

  // Submit approval request
  async submitApprovalRequest(
    contentId: string,
    workflowId: string,
    title: string,
    description: string,
    content: string,
    metadata: any,
    submittedBy: string,
    priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium'
  ): Promise<ApprovalRequest> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error('Workflow not found');
    }

    const requestId = `request_${Date.now()}`;
    const now = new Date();
    const dueDate = new Date(now.getTime() + (workflow.steps[0]?.timeout || 24) * 60 * 60 * 1000);

    const request: ApprovalRequest = {
      id: requestId,
      contentId,
      workflowId,
      title,
      description,
      content,
      metadata: {
        ...metadata,
        createdAt: now.toISOString()
      },
      status: 'pending',
      currentStep: 0,
      steps: workflow.steps.map(step => ({
        stepId: step.id,
        stepName: step.name,
        status: 'pending',
        approvers: step.approvers.map(approver => ({
          approver,
          status: 'pending',
          timestamp: now.toISOString()
        }))
      })),
      priority,
      dueDate: dueDate.toISOString(),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      submittedBy
    };

    this.requests.set(requestId, request);
    await this.startApprovalStep(requestId, 0);

    return request;
  }

  // Get approval request
  async getApprovalRequest(requestId: string): Promise<ApprovalRequest | null> {
    return this.requests.get(requestId) || null;
  }

  // Get approval requests
  async getApprovalRequests(filters?: {
    status?: string;
    workflowId?: string;
    submittedBy?: string;
    approver?: string;
  }): Promise<ApprovalRequest[]> {
    let requests = Array.from(this.requests.values());

    if (filters) {
      if (filters.status) {
        requests = requests.filter(r => r.status === filters.status);
      }
      if (filters.workflowId) {
        requests = requests.filter(r => r.workflowId === filters.workflowId);
      }
      if (filters.submittedBy) {
        requests = requests.filter(r => r.submittedBy === filters.submittedBy);
      }
      if (filters.approver) {
        requests = requests.filter(r => 
          r.steps.some(step => 
            step.approvers.some(approver => approver.approver.id === filters.approver)
          )
        );
      }
    }

    return requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Approve step
  async approveStep(
    requestId: string,
    stepId: string,
    approverId: string,
    comment?: string
  ): Promise<boolean> {
    const request = this.requests.get(requestId);
    if (!request) {
      return false;
    }

    const step = request.steps.find(s => s.stepId === stepId);
    if (!step) {
      return false;
    }

    const approver = step.approvers.find(a => a.approver.id === approverId);
    if (!approver) {
      return false;
    }

    approver.status = 'approved';
    approver.comment = comment;
    approver.timestamp = new Date().toISOString();

    // Check if step is complete
    const requiredApprovers = step.approvers.filter(a => a.approver.isRequired);
    const approvedRequired = requiredApprovers.filter(a => a.status === 'approved');
    
    if (approvedRequired.length === requiredApprovers.length) {
      step.status = 'approved';
      step.completedAt = new Date().toISOString();
      
      // Move to next step or complete request
      await this.moveToNextStep(requestId);
    }

    request.updatedAt = new Date().toISOString();
    this.requests.set(requestId, request);

    return true;
  }

  // Reject step
  async rejectStep(
    requestId: string,
    stepId: string,
    approverId: string,
    comment: string
  ): Promise<boolean> {
    const request = this.requests.get(requestId);
    if (!request) {
      return false;
    }

    const step = request.steps.find(s => s.stepId === stepId);
    if (!step) {
      return false;
    }

    const approver = step.approvers.find(a => a.approver.id === approverId);
    if (!approver) {
      return false;
    }

    approver.status = 'rejected';
    approver.comment = comment;
    approver.timestamp = new Date().toISOString();

    step.status = 'rejected';
    step.completedAt = new Date().toISOString();
    request.status = 'rejected';
    request.updatedAt = new Date().toISOString();

    this.requests.set(requestId, request);

    return true;
  }

  // Skip step
  async skipStep(
    requestId: string,
    stepId: string,
    approverId: string,
    comment?: string
  ): Promise<boolean> {
    const request = this.requests.get(requestId);
    if (!request) {
      return false;
    }

    const step = request.steps.find(s => s.stepId === stepId);
    if (!step || !step.canSkip) {
      return false;
    }

    const approver = step.approvers.find(a => a.approver.id === approverId);
    if (!approver) {
      return false;
    }

    approver.status = 'approved'; // Treat skip as approval
    approver.comment = comment || 'Step skipped';
    approver.timestamp = new Date().toISOString();

    step.status = 'skipped';
    step.completedAt = new Date().toISOString();
    
    await this.moveToNextStep(requestId);

    request.updatedAt = new Date().toISOString();
    this.requests.set(requestId, request);

    return true;
  }

  // Add comment
  async addComment(
    requestId: string,
    stepId: string,
    author: string,
    content: string,
    isInternal: boolean = false,
    attachments: string[] = []
  ): Promise<ApprovalComment> {
    const comment: ApprovalComment = {
      id: `comment_${Date.now()}`,
      requestId,
      stepId,
      author,
      content,
      isInternal,
      attachments,
      createdAt: new Date().toISOString()
    };

    const comments = this.comments.get(requestId) || [];
    comments.push(comment);
    this.comments.set(requestId, comments);

    return comment;
  }

  // Get comments
  async getComments(requestId: string, stepId?: string): Promise<ApprovalComment[]> {
    const comments = this.comments.get(requestId) || [];
    
    if (stepId) {
      return comments.filter(c => c.stepId === stepId);
    }
    
    return comments.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  // Get analytics
  async getAnalytics(workflowId?: string): Promise<ApprovalAnalytics> {
    let requests = Array.from(this.requests.values());
    
    if (workflowId) {
      requests = requests.filter(r => r.workflowId === workflowId);
    }

    const totalRequests = requests.length;
    const approvedRequests = requests.filter(r => r.status === 'approved').length;
    const rejectedRequests = requests.filter(r => r.status === 'rejected').length;
    const pendingRequests = requests.filter(r => r.status === 'pending' || r.status === 'in_progress').length;

    // Calculate average approval time
    const completedRequests = requests.filter(r => r.status === 'approved' || r.status === 'rejected');
    const totalApprovalTime = completedRequests.reduce((sum, r) => {
      const start = new Date(r.createdAt);
      const end = new Date(r.updatedAt);
      return sum + (end.getTime() - start.getTime());
    }, 0);
    const averageApprovalTime = completedRequests.length > 0 ? totalApprovalTime / completedRequests.length / (1000 * 60 * 60) : 0;

    // Calculate average steps per request
    const totalSteps = requests.reduce((sum, r) => sum + r.steps.length, 0);
    const averageStepsPerRequest = totalRequests > 0 ? totalSteps / totalRequests : 0;

    // Most active approvers
    const approverActivity = new Map<string, { approver: Approver; requests: number; totalTime: number }>();
    requests.forEach(request => {
      request.steps.forEach(step => {
        step.approvers.forEach(approverStatus => {
          const approver = approverStatus.approver;
          const current = approverActivity.get(approver.id) || { approver, requests: 0, totalTime: 0 };
          current.requests++;
          approverActivity.set(approver.id, current);
        });
      });
    });

    const mostActiveApprovers = Array.from(approverActivity.values())
      .map(data => ({
        approver: data.approver,
        requests: data.requests,
        averageTime: 0 // TODO: Calculate actual average time
      }))
      .sort((a, b) => b.requests - a.requests)
      .slice(0, 10);

    return {
      totalRequests,
      approvedRequests,
      rejectedRequests,
      pendingRequests,
      averageApprovalTime: Math.round(averageApprovalTime * 100) / 100,
      averageStepsPerRequest: Math.round(averageStepsPerRequest * 100) / 100,
      mostActiveApprovers,
      stepPerformance: [], // TODO: Implement step performance analysis
      bottlenecks: [] // TODO: Implement bottleneck analysis
    };
  }

  // Private helper methods
  private async startApprovalStep(requestId: string, stepIndex: number): Promise<void> {
    const request = this.requests.get(requestId);
    if (!request) {
      return;
    }

    const workflow = this.workflows.get(request.workflowId);
    if (!workflow || !workflow.steps[stepIndex]) {
      return;
    }

    const step = workflow.steps[stepIndex];
    const stepStatus = request.steps[stepIndex];

    stepStatus.status = 'in_progress';
    stepStatus.startedAt = new Date().toISOString();
    stepStatus.timeoutAt = new Date(Date.now() + step.timeout * 60 * 60 * 1000).toISOString();

    request.currentStep = stepIndex;
    request.status = 'in_progress';
    request.updatedAt = new Date().toISOString();

    this.requests.set(requestId, request);

    // TODO: Send notifications to approvers
  }

  private async moveToNextStep(requestId: string): Promise<void> {
    const request = this.requests.get(requestId);
    if (!request) {
      return;
    }

    const workflow = this.workflows.get(request.workflowId);
    if (!workflow) {
      return;
    }

    const nextStepIndex = request.currentStep + 1;

    if (nextStepIndex < workflow.steps.length) {
      await this.startApprovalStep(requestId, nextStepIndex);
    } else {
      // All steps completed
      request.status = 'approved';
      request.updatedAt = new Date().toISOString();
      this.requests.set(requestId, request);
    }
  }
}
