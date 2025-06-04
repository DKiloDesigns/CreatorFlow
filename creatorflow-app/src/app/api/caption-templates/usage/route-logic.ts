// No import needed for TemplateUsage type

export async function handleRecordCaptionTemplateUsage({ req, getSession, prisma }: { req: any, getSession: any, prisma: any }) {
  const session = await getSession(req);
  if (!session?.user?.id) return { status: 401, body: { error: 'Unauthorized' } };
  const { templateId, action = 'insert', type = 'caption' } = await req.json();
  if (!templateId) return { status: 400, body: { error: 'templateId required' } };
  try {
    // Fetch template to check scheduling/expiry/limit
    const template = await prisma.captionTemplate.findUnique({ where: { id: templateId } });
    if (!template) return { status: 404, body: { error: 'Template not found' } };
    const now = new Date();
    if (template.activeFrom && now < template.activeFrom) {
      return { status: 403, body: { error: 'Template not yet active' } };
    }
    if (template.activeTo && now > template.activeTo) {
      return { status: 403, body: { error: 'Template expired' } };
    }
    if (template.usageLimit && template.usageCount >= template.usageLimit) {
      return { status: 403, body: { error: 'Usage limit reached' } };
    }
    // Increment usageCount
    await prisma.captionTemplate.update({ where: { id: templateId }, data: { usageCount: { increment: 1 } } });
    // Record usage
    const usage = await prisma.templateUsage.create({ data: { captionTemplateId: templateId, userId: session.user.id, action, type } });
    return { status: 201, body: usage };
  } catch (e) {
    return { status: 500, body: { error: 'Internal Server Error' } };
  }
}

export async function handleGetCaptionTemplateUsage({ req, getSession, prisma }: { req: any, getSession: any, prisma: any }) {
  const session = await getSession(req);
  if (!session?.user?.id) return { status: 401, body: { error: 'Unauthorized' } };
  const { searchParams } = new URL(req.url);
  const templateId = searchParams.get('templateId');
  if (!templateId) return { status: 400, body: { error: 'templateId required' } };
  try {
    const usages = await prisma.templateUsage.findMany({ where: { captionTemplateId: templateId }, orderBy: { usedAt: 'desc' } });
    const count = usages.length;
    const lastUsed = usages[0]?.usedAt || null;
    const perUser: Record<string, number> = {};
    usages.forEach((u: any) => { perUser[u.userId] = (perUser[u.userId] || 0) + 1; });
    return { status: 200, body: { count, lastUsed, perUser, history: usages } };
  } catch (e) {
    return { status: 500, body: { error: 'Internal Server Error' } };
  }
} 