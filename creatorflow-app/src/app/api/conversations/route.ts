import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { prisma } from '@/lib/prisma';
import { notificationTriggers } from '@/lib/notifications/notification-triggers';

// GET /api/conversations - Get user's conversations
export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: session.user.id,
            isActive: true
          }
        }
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                displayName: true
              }
            }
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                displayName: true,
                image: true
              }
            }
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            displayName: true,
            image: true
          }
        }
      },
      orderBy: { lastMessageAt: 'desc' },
      take: limit,
      skip: offset
    });

    // Get unread counts for each conversation
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conversation) => {
        const unreadCount = await prisma.message.count({
          where: {
            conversationId: conversation.id,
            senderId: { not: session.user.id },
            readBy: {
              none: {
                userId: session.user.id
              }
            }
          }
        });

        return {
          ...conversation,
          unreadCount
        };
      })
    );

    return NextResponse.json({
      conversations: conversationsWithUnread,
      hasMore: conversations.length === limit
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

// POST /api/conversations - Create a new conversation
export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { participantIds, name, type = 'DIRECT' } = body;

    if (!participantIds || !Array.isArray(participantIds) || participantIds.length === 0) {
      return NextResponse.json(
        { error: 'Participant IDs are required' },
        { status: 400 }
      );
    }

    // Add current user to participants
    const allParticipantIds = [session.user.id, ...participantIds];
    const uniqueParticipantIds = [...new Set(allParticipantIds)];

    // Check if direct conversation already exists between these users
    if (type === 'DIRECT' && uniqueParticipantIds.length === 2) {
      const existingConversation = await prisma.conversation.findFirst({
        where: {
          type: 'DIRECT',
          participants: {
            every: {
              userId: { in: uniqueParticipantIds }
            }
          }
        },
        include: {
          participants: true
        }
      });

      if (existingConversation) {
        return NextResponse.json({
          conversation: existingConversation,
          isExisting: true
        });
      }
    }

    // Create new conversation
    const conversation = await prisma.conversation.create({
      data: {
        name,
        type: type as 'DIRECT' | 'GROUP',
        createdById: session.user.id,
        participants: {
          create: uniqueParticipantIds.map(userId => ({
            userId,
            role: userId === session.user.id ? 'ADMIN' : 'MEMBER'
          }))
        }
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                displayName: true
              }
            }
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            displayName: true,
            image: true
          }
        }
      }
    });

    // Send conversation created notifications to participants (except creator)
    const otherParticipants = conversation.participants.filter(p => p.userId !== session.user.id);
    const participantNames = conversation.participants.map(p => p.user.displayName || p.user.name || 'Unknown');
    const createdByName = conversation.createdBy.displayName || conversation.createdBy.name || 'Unknown';

    for (const participant of otherParticipants) {
      await notificationTriggers.onConversationCreated(participant.userId, {
        conversationId: conversation.id,
        conversationName: conversation.name,
        participantNames,
        createdByName
      });
    }

    return NextResponse.json({
      conversation,
      isExisting: false
    });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}
