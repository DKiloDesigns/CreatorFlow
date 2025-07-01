import { prisma } from '@/lib/prisma';

interface LogAuditParams {
  action: string;
  actorId?: string;
  targetId?: string;
  targetType?: string;
  details?: any;
}

export async function logAudit({ action, actorId, targetId, targetType, details }: LogAuditParams) {
  await prisma.auditLog.create({
    data: {
      action,
      actorId,
      targetId,
      targetType,
      details,
    },
  });
} 