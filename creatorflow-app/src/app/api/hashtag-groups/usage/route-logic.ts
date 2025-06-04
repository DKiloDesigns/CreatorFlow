// Pure logic for hashtag group usage analytics, including scheduling/expiry enforcement

export async function handleRecordHashtagGroupUsage({ req, getSession, prisma }: { req: any, getSession: any, prisma: any }) {
  const session = await getSession(req);
  if (!session?.user?.id) return { status: 401, body: { error: 'Unauthorized' } };
  const { groupId, action = 'insert', type = 'hashtag' } = await req.json();
  if (!groupId) return { status: 400, body: { error: 'groupId required' } };
  try {
    // Fetch group to check scheduling/expiry/limit
    const group = await prisma.hashtagGroup.findUnique({ where: { id: groupId } });
    if (!group) return { status: 404, body: { error: 'Group not found' } };
    const now = new Date();
    if (group.activeFrom && now < group.activeFrom) {
      return { status: 403, body: { error: 'Group not yet active' } };
    }
    if (group.activeTo && now > group.activeTo) {
      return { status: 403, body: { error: 'Group expired' } };
    }
    if (group.usageLimit && group.usageCount >= group.usageLimit) {
      return { status: 403, body: { error: 'Usage limit reached' } };
    }
    // Increment usageCount
    await prisma.hashtagGroup.update({ where: { id: groupId }, data: { usageCount: { increment: 1 } } });
    // Record usage
    const usage = await prisma.templateUsage.create({ data: { hashtagGroupId: groupId, userId: session.user.id, action, type } });
    return { status: 201, body: usage };
  } catch (e) {
    return { status: 500, body: { error: 'Internal Server Error' } };
  }
}

export async function handleGetHashtagGroupUsage({ req, getSession, prisma }: { req: any, getSession: any, prisma: any }) {
  const session = await getSession(req);
  if (!session?.user?.id) return { status: 401, body: { error: 'Unauthorized' } };
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get('groupId');
  if (!groupId) return { status: 400, body: { error: 'groupId required' } };
  try {
    const usages = await prisma.templateUsage.findMany({ where: { hashtagGroupId: groupId }, orderBy: { usedAt: 'desc' } });
    const count = usages.length;
    const lastUsed = usages[0]?.usedAt || null;
    const perUser: Record<string, number> = {};
    usages.forEach((u: any) => { perUser[u.userId] = (perUser[u.userId] || 0) + 1; });
    return { status: 200, body: { count, lastUsed, perUser, history: usages } };
  } catch (e) {
    return { status: 500, body: { error: 'Internal Server Error' } };
  }
} 