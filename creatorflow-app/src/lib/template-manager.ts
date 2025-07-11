import { PrismaClient, PostStatus } from '@prisma/client';

const prisma = new PrismaClient();

export interface ContentTemplate {
  id: string;
  name: string;
  content: string;
  category: string;
  tags: string[];
  platforms: string[];
  hashtags: string[];
  mentions: string[];
  mediaUrls: string[];
  isFavorite: boolean;
  isPinned: boolean;
  usageLimit?: number;
  usageCount: number;
  activeFrom?: Date;
  activeTo?: Date;
  schedule: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
    interval?: number;
    daysOfWeek?: number[];
    timeOfDay?: string;
  };
}

export interface TemplateUsage {
  id: string;
  type: string;
  captionTemplateId: string | null;
  hashtagGroupId: string | null;
  userId: string;
  action: string;
  usedAt: Date;
}

// Add TemplateMetadata type and type guard
interface TemplateMetadata {
  platforms?: string[];
  hashtags?: string[];
  mentions?: string[];
  mediaUrls?: string[];
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
    interval?: number;
    daysOfWeek?: number[];
    timeOfDay?: string;
  };
}
function isTemplateMetadata(obj: any): obj is TemplateMetadata {
  return obj && typeof obj === 'object';
}

/**
 * Create a new content template
 */
export async function createTemplate(
  userId: string,
  templateData: Omit<ContentTemplate, 'id' | 'usageCount'>
): Promise<ContentTemplate> {
  const template = await prisma.captionTemplate.create({
    data: {
      userId,
      name: templateData.name,
      content: templateData.content,
      category: templateData.category,
      tags: templateData.tags,
      isFavorite: templateData.isFavorite,
      isPinned: templateData.isPinned,
      usageLimit: templateData.usageLimit,
      activeFrom: templateData.activeFrom,
      activeTo: templateData.activeTo,
      // Store additional metadata as JSON
      metadata: {
        platforms: templateData.platforms,
        hashtags: templateData.hashtags,
        mentions: templateData.mentions,
        mediaUrls: templateData.mediaUrls,
        schedule: templateData.schedule
      }
    }
  });

  const meta = isTemplateMetadata(template.metadata) ? template.metadata : {};
  return {
    id: template.id,
    name: template.name,
    content: template.content,
    category: template.category,
    tags: template.tags,
    platforms: meta.platforms || [],
    hashtags: meta.hashtags || [],
    mentions: meta.mentions || [],
    mediaUrls: meta.mediaUrls || [],
    isFavorite: template.isFavorite,
    isPinned: template.isPinned,
    usageLimit: template.usageLimit ?? undefined,
    usageCount: template.usageCount,
    activeFrom: template.activeFrom ?? undefined,
    activeTo: template.activeTo ?? undefined,
    schedule: meta.schedule || { frequency: 'weekly' }
  };
}

/**
 * Get all templates for a user
 */
export async function getUserTemplates(
  userId: string,
  filters?: {
    category?: string;
    isFavorite?: boolean;
    isPinned?: boolean;
    tags?: string[];
  }
): Promise<ContentTemplate[]> {
  const whereClause: any = { userId };

  if (filters?.category) {
    whereClause.category = filters.category;
  }
  if (filters?.isFavorite !== undefined) {
    whereClause.isFavorite = filters.isFavorite;
  }
  if (filters?.isPinned !== undefined) {
    whereClause.isPinned = filters.isPinned;
  }
  if (filters?.tags && filters.tags.length > 0) {
    whereClause.tags = { hasSome: filters.tags };
  }

  const templates = await prisma.captionTemplate.findMany({
    where: whereClause,
    orderBy: [
      { isPinned: 'desc' },
      { isFavorite: 'desc' },
      { updatedAt: 'desc' }
    ],
    select: {
      id: true,
      name: true,
      content: true,
      category: true,
      tags: true,
      isFavorite: true,
      isPinned: true,
      usageLimit: true,
      usageCount: true,
      activeFrom: true,
      activeTo: true,
      metadata: true
    }
  });

  return templates.map(template => {
    const meta = isTemplateMetadata(template.metadata) ? template.metadata : {};
    return {
      id: template.id,
      name: template.name,
      content: template.content,
      category: template.category,
      tags: template.tags,
      platforms: meta.platforms || [],
      hashtags: meta.hashtags || [],
      mentions: meta.mentions || [],
      mediaUrls: meta.mediaUrls || [],
      isFavorite: template.isFavorite,
      isPinned: template.isPinned,
      usageLimit: template.usageLimit ?? undefined,
      usageCount: template.usageCount,
      activeFrom: template.activeFrom ?? undefined,
      activeTo: template.activeTo ?? undefined,
      schedule: meta.schedule || { frequency: 'weekly' }
    };
  });
}

/**
 * Update a template
 */
export async function updateTemplate(
  templateId: string,
  userId: string,
  updates: Partial<ContentTemplate>
): Promise<ContentTemplate> {
  const existingTemplate = await prisma.captionTemplate.findFirst({
    where: { id: templateId, userId }
  });

  if (!existingTemplate) {
    throw new Error('Template not found or access denied');
  }

  const updateData: any = {
    name: updates.name,
    content: updates.content,
    category: updates.category,
    tags: updates.tags,
    isFavorite: updates.isFavorite,
    isPinned: updates.isPinned,
    usageLimit: updates.usageLimit,
    activeFrom: updates.activeFrom,
    activeTo: updates.activeTo
  };

  // Update metadata if provided
  if (updates.platforms || updates.hashtags || updates.mentions || updates.mediaUrls || updates.schedule) {
    updateData.metadata = {
      ...(typeof existingTemplate.metadata === 'object' && existingTemplate.metadata !== null ? existingTemplate.metadata : {}),
      platforms: updates.platforms,
      hashtags: updates.hashtags,
      mentions: updates.mentions,
      mediaUrls: updates.mediaUrls,
      schedule: updates.schedule
    };
  }

  const template = await prisma.captionTemplate.update({
    where: { id: templateId },
    data: updateData
  });

  const meta = isTemplateMetadata(template.metadata) ? template.metadata : {};
  return {
    id: template.id,
    name: template.name,
    content: template.content,
    category: template.category,
    tags: template.tags,
    platforms: meta.platforms || [],
    hashtags: meta.hashtags || [],
    mentions: meta.mentions || [],
    mediaUrls: meta.mediaUrls || [],
    isFavorite: template.isFavorite,
    isPinned: template.isPinned,
    usageLimit: template.usageLimit ?? undefined,
    usageCount: template.usageCount,
    activeFrom: template.activeFrom ?? undefined,
    activeTo: template.activeTo ?? undefined,
    schedule: meta.schedule || { frequency: 'weekly' }
  };
}

/**
 * Delete a template
 */
export async function deleteTemplate(templateId: string, userId: string): Promise<boolean> {
  const template = await prisma.captionTemplate.findFirst({
    where: { id: templateId, userId }
  });

  if (!template) {
    throw new Error('Template not found or access denied');
  }

  await prisma.captionTemplate.delete({
    where: { id: templateId }
  });

  return true;
}

/**
 * Use a template to create a post
 */
export async function useTemplate(
  templateId: string,
  userId: string,
  variations?: {
    content?: string;
    hashtags?: string[];
    mentions?: string[];
    platforms?: string[];
  }
): Promise<{ postId: string; usageId: string }> {
  const template = await prisma.captionTemplate.findFirst({
    where: { id: templateId, userId }
  });

  if (!template) {
    throw new Error('Template not found or access denied');
  }

  // Check usage limits
  if (template.usageLimit && template.usageCount >= template.usageLimit) {
    throw new Error('Template usage limit reached');
  }

  // Check active date range
  const now = new Date();
  if (template.activeFrom && now < template.activeFrom) {
    throw new Error('Template is not yet active');
  }
  if (template.activeTo && now > template.activeTo) {
    throw new Error('Template has expired');
  }

  // Create post using template
  const meta = isTemplateMetadata(template.metadata) ? template.metadata : {};
  const postData = {
    userId,
    contentText: variations?.content || template.content,
    platforms: variations?.platforms || meta.platforms || [],
    hashtags: variations?.hashtags || meta.hashtags || [],
    mentions: variations?.mentions || meta.mentions || [],
    mediaUrls: meta.mediaUrls || [],
    status: PostStatus.DRAFT
  };

  const post = await prisma.post.create({ data: postData });

  // Record template usage
  const usage = await prisma.templateUsage.create({
    data: {
      type: 'caption',
      captionTemplateId: templateId,
      userId,
      action: 'create_post',
      usedAt: now
    }
  });

  // Update template usage count
  await prisma.captionTemplate.update({
    where: { id: templateId },
    data: { usageCount: template.usageCount + 1 }
  });

  return { postId: post.id, usageId: usage.id };
}

/**
 * Get template usage history
 */
export async function getTemplateUsage(
  templateId: string,
  userId: string
): Promise<TemplateUsage[]> {
  const template = await prisma.captionTemplate.findFirst({
    where: { id: templateId, userId }
  });

  if (!template) {
    throw new Error('Template not found or access denied');
  }

  const usages = await prisma.templateUsage.findMany({
    where: { captionTemplateId: templateId },
    orderBy: { usedAt: 'desc' }
  });

  return usages.map(usage => ({
    id: usage.id,
    type: usage.type,
    captionTemplateId: usage.captionTemplateId,
    hashtagGroupId: usage.hashtagGroupId,
    userId: usage.userId,
    action: usage.action,
    usedAt: usage.usedAt
  }));
}

/**
 * Generate content variations from a template
 */
export function generateTemplateVariations(
  template: ContentTemplate,
  count: number = 3
): Array<{
  content: string;
  hashtags: string[];
  mentions: string[];
}> {
  const variations = [];

  for (let i = 0; i < count; i++) {
    // Simple variation logic - in production, this could use AI
    const variation = {
      content: template.content,
      hashtags: [...template.hashtags],
      mentions: [...template.mentions]
    };

    // Add some random hashtags if available
    const commonHashtags = ['#content', '#socialmedia', '#marketing', '#growth'];
    if (Math.random() > 0.5 && commonHashtags.length > 0) {
      const randomHashtag = commonHashtags[Math.floor(Math.random() * commonHashtags.length)];
      if (!variation.hashtags.includes(randomHashtag)) {
        variation.hashtags.push(randomHashtag);
      }
    }

    variations.push(variation);
  }

  return variations;
}

/**
 * Schedule recurring posts from templates
 */
export async function scheduleRecurringPosts(
  userId: string,
  templateId: string,
  schedule: {
    startDate: Date;
    endDate?: Date;
    frequency: 'daily' | 'weekly' | 'monthly';
    timeOfDay: string;
    platforms: string[];
  }
): Promise<string[]> {
  const template = await prisma.captionTemplate.findFirst({
    where: { id: templateId, userId }
  });

  if (!template) {
    throw new Error('Template not found or access denied');
  }

  const scheduledPostIds: string[] = [];
  let currentDate = new Date(schedule.startDate);
  const endDate = schedule.endDate || new Date();
  endDate.setDate(endDate.getDate() + 30); // Default to 30 days if no end date

  const [hours, minutes] = schedule.timeOfDay.split(':').map(Number);

  while (currentDate <= endDate) {
    // Set the time for this post
    const scheduledTime = new Date(currentDate);
    scheduledTime.setHours(hours, minutes, 0, 0);

    // Create the scheduled post
    const meta = isTemplateMetadata(template.metadata) ? template.metadata : {};
    const post = await prisma.post.create({
      data: {
        userId,
        contentText: template.content,
        platforms: schedule.platforms,
        hashtags: meta.hashtags || [],
        mentions: meta.mentions || [],
        mediaUrls: meta.mediaUrls || [],
        status: PostStatus.SCHEDULED,
        scheduledAt: scheduledTime
      }
    });

    scheduledPostIds.push(post.id);

    // Calculate next date based on frequency
    switch (schedule.frequency) {
      case 'daily':
        currentDate.setDate(currentDate.getDate() + 1);
        break;
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + 7);
        break;
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + 1);
        break;
    }
  }

  return scheduledPostIds;
} 