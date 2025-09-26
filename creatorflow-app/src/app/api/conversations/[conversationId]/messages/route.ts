import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { prisma } from '@/lib/prisma';
import { notificationWebSocket } from '@/lib/websocket/notification-server';
import { notificationTriggers } from '@/lib/notifications/notification-triggers';

// GET /api/conversations/[conversationId]/messages - Get messages for a conversation
export async function GET(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const session = await getSession(request);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { conversationId } = params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const before = searchParams.get('before');

    // Verify user is participant in conversation
    const participant = await prisma.conversationParticipant.findFirst({
      where: {
        conversationId,
        userId: session.user.id,
        isActive: true
      }
    });

    if (!participant) {
      return NextResponse.json(
        { error: 'Conversation not found or access denied' },
        { status: 404 }
      );
    }

    const whereClause: any = {
      conversationId,
      isDeleted: false
    };

    if (before) {
      whereClause.createdAt = {
        lt: new Date(before)
      };
    }

    const messages = await prisma.message.findMany({
      where: whereClause,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            displayName: true,
            image: true
          }
        },
        replyTo: {
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
        reactions: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                displayName: true,
                image: true
              }
            }
          }
        },
        readBy: {
          where: {
            userId: session.user.id
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    });

    // Mark messages as read
    const unreadMessageIds = messages
      .filter(msg => msg.senderId !== session.user.id && msg.readBy.length === 0)
      .map(msg => msg.id);

    if (unreadMessageIds.length > 0) {
      await prisma.messageRead.createMany({
        data: unreadMessageIds.map(messageId => ({
          messageId,
          userId: session.user.id
        })),
        skipDuplicates: true
      });
    }

    return NextResponse.json({
      messages: messages.reverse(), // Return in chronological order
      hasMore: messages.length === limit
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST /api/conversations/[conversationId]/messages - Send a new message
export async function POST(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const session = await getSession(request);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { conversationId } = params;
    const body = await request.json();
    const { content, type = 'TEXT', replyToId, metadata } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      );
    }

    // Verify user is participant in conversation
    const participant = await prisma.conversationParticipant.findFirst({
      where: {
        conversationId,
        userId: session.user.id,
        isActive: true
      }
    });

    if (!participant) {
      return NextResponse.json(
        { error: 'Conversation not found or access denied' },
        { status: 404 }
      );
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: session.user.id,
        content: content.trim(),
        type: type as 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM',
        replyToId,
        metadata
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            displayName: true,
            image: true
          }
        },
        replyTo: {
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
        reactions: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                displayName: true,
                image: true
              }
            }
          }
        },
        readBy: {
          where: {
            userId: session.user.id
          }
        }
      }
    });

    // Update conversation's lastMessageAt
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: message.createdAt }
    });

    // Mark as read by sender
    await prisma.messageRead.create({
      data: {
        messageId: message.id,
        userId: session.user.id
      }
    });

    // Send real-time message to conversation participants
    await notificationWebSocket.sendMessageToConversation(conversationId, {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      content: message.content,
      type: message.type,
      createdAt: message.createdAt.toISOString(),
      sender: message.sender,
      replyTo: message.replyTo,
      reactions: message.reactions
    });

    // Send notifications to other participants
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: {
          where: {
            userId: { not: session.user.id },
            isActive: true
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                displayName: true
              }
            }
          }
        }
      }
    });

    if (conversation) {
      // Send message received notifications to other participants
      for (const participant of conversation.participants) {
        await notificationTriggers.onMessageReceived(participant.userId, {
          conversationId,
          messageId: message.id,
          senderName: message.sender.displayName || message.sender.name || 'Unknown',
          content: message.content,
          conversationName: conversation.name
        });
      }
    }

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
