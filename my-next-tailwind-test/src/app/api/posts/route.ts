import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    contentText,
    status,
    mediaUrl,
    platforms = [],
    scheduledAt,
  } = body;
  const post = await prisma.post.create({
    data: {
      contentText,
      status,
      mediaUrl,
      platforms,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
    },
  });
  return NextResponse.json(post);
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const {
    id,
    contentText,
    status,
    mediaUrl,
    platforms = [],
    scheduledAt,
    views,
    likes,
    comments,
  } = body;
  const post = await prisma.post.update({
    where: { id },
    data: {
      contentText,
      status,
      mediaUrl,
      platforms,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      views,
      likes,
      comments,
    },
  });
  return NextResponse.json(post);
} 