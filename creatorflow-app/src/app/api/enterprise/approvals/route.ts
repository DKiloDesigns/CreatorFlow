import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { enterpriseManager } from '@/lib/enterprise-manager';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const requestId = searchParams.get('requestId');
    const teamId = searchParams.get('teamId');
    const status = searchParams.get('status');

    if (requestId) {
      // Get specific approval request
      const request = await enterpriseManager.getApprovalRequest(requestId);
      if (!request) {
        return NextResponse.json({ error: 'Approval request not found' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        request,
      });
    } else {
      // Get user's approval requests
      const where: any = {};
      
      if (teamId) {
        where.workflow = { teamId };
      }
      
      if (status) {
        where.status = status;
      }

      // Get requests where user is requester or approver
      const requests = await prisma.approvalRequest.findMany({
        where: {
          OR: [
            { requesterId: session.user.id },
            {
              approvals: {
                some: {
                  approverId: session.user.id,
                },
              },
            },
          ],
          ...where,
        },
        include: {
          workflow: {
            include: {
              steps: true,
            },
          },
          approvals: {
            include: {
              step: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({
        success: true,
        requests: requests.map(request => ({
          ...request,
          workflow: {
            ...request.workflow,
            steps: request.workflow.steps,
          },
          approvals: request.approvals.map(approval => ({
            ...approval,
            step: approval.step,
          })),
        })),
        count: requests.length,
      });
    }

  } catch (error) {
    console.error('Get approvals error:', error);
    return NextResponse.json({ error: 'Failed to get approvals' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { workflowId, contentId } = await req.json();

    if (!workflowId || !contentId) {
      return NextResponse.json({ error: 'Workflow ID and content ID required' }, { status: 400 });
    }

    const request = await enterpriseManager.submitApprovalRequest(
      workflowId,
      session.user.id,
      contentId
    );

    return NextResponse.json({
      success: true,
      request,
      message: 'Approval request submitted successfully',
    });

  } catch (error) {
    console.error('Submit approval error:', error);
    return NextResponse.json({ error: 'Failed to submit approval request' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { requestId, approved, comment } = await req.json();

    if (!requestId) {
      return NextResponse.json({ error: 'Request ID required' }, { status: 400 });
    }

    // Check if user is authorized to approve
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
      return NextResponse.json({ error: 'Approval request not found' }, { status: 404 });
    }

    // Check if user is current approver
    const currentStep = request.workflow.steps.find(s => s.order === request.currentStep);
    if (!currentStep) {
      return NextResponse.json({ error: 'Invalid approval step' }, { status: 400 });
    }

    const currentApproval = request.approvals.find(a => a.stepId === currentStep.id);
    if (!currentApproval || currentApproval.approverId !== session.user.id) {
      return NextResponse.json({ error: 'Not authorized to approve this request' }, { status: 403 });
    }

    const updatedRequest = await enterpriseManager.approveContent(
      requestId,
      session.user.id,
      approved,
      comment
    );

    return NextResponse.json({
      success: true,
      request: updatedRequest,
      message: approved ? 'Content approved' : 'Content rejected',
    });

  } catch (error) {
    console.error('Approve content error:', error);
    return NextResponse.json({ error: 'Failed to approve content' }, { status: 500 });
  }
} 