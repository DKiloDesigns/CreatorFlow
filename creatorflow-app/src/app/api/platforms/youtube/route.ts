import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/prisma';
import { google } from 'googleapis';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, data } = await req.json();

    // Get user's YouTube account
    const socialAccount = await prisma.socialAccount.findFirst({
      where: {
        userId: session.user.id,
        platform: 'youtube',
      },
    });

    if (!socialAccount?.accessToken) {
      return NextResponse.json({ error: 'YouTube account not connected' }, { status: 400 });
    }

    // Initialize YouTube API
    const oauth2Client = new google.auth.OAuth2(
      process.env.YOUTUBE_CLIENT_ID,
      process.env.YOUTUBE_CLIENT_SECRET,
      process.env.NEXTAUTH_URL + '/api/accounts/callback/youtube'
    );

    oauth2Client.setCredentials({
      access_token: socialAccount.accessToken,
      refresh_token: socialAccount.refreshToken,
    });

    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

    switch (action) {
      case 'upload_video':
        return await handleVideoUpload(youtube, data);
      
      case 'get_channels':
        return await handleGetChannels(youtube);
      
      case 'get_videos':
        return await handleGetVideos(youtube, data);
      
      case 'update_video':
        return await handleUpdateVideo(youtube, data);
      
      case 'delete_video':
        return await handleDeleteVideo(youtube, data);
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('YouTube API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handleVideoUpload(youtube: any, data: any) {
  const { title, description, tags, categoryId, privacyStatus, videoPath } = data;

  try {
    // Upload video file
    const response = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title,
          description,
          tags,
          categoryId: categoryId || '22', // People & Blogs
        },
        status: {
          privacyStatus: privacyStatus || 'private',
        },
      },
      media: {
        body: videoPath, // This would need to be a readable stream
      },
    });

    return NextResponse.json({
      success: true,
      videoId: response.data.id,
      videoUrl: `https://www.youtube.com/watch?v=${response.data.id}`,
    });

  } catch (error) {
    console.error('Video upload error:', error);
    return NextResponse.json({ error: 'Failed to upload video' }, { status: 500 });
  }
}

async function handleGetChannels(youtube: any) {
  try {
    const response = await youtube.channels.list({
      part: ['snippet', 'statistics'],
      mine: true,
    });

    return NextResponse.json({
      success: true,
      channels: response.data.items,
    });

  } catch (error) {
    console.error('Get channels error:', error);
    return NextResponse.json({ error: 'Failed to get channels' }, { status: 500 });
  }
}

async function handleGetVideos(youtube: any, data: any) {
  const { channelId, maxResults = 50 } = data;

  try {
    const response = await youtube.search.list({
      part: ['snippet'],
      channelId,
      maxResults,
      order: 'date',
      type: 'video',
    });

    return NextResponse.json({
      success: true,
      videos: response.data.items,
    });

  } catch (error) {
    console.error('Get videos error:', error);
    return NextResponse.json({ error: 'Failed to get videos' }, { status: 500 });
  }
}

async function handleUpdateVideo(youtube: any, data: any) {
  const { videoId, title, description, tags, privacyStatus } = data;

  try {
    const response = await youtube.videos.update({
      part: ['snippet', 'status'],
      requestBody: {
        id: videoId,
        snippet: {
          title,
          description,
          tags,
        },
        status: {
          privacyStatus,
        },
      },
    });

    return NextResponse.json({
      success: true,
      video: response.data,
    });

  } catch (error) {
    console.error('Update video error:', error);
    return NextResponse.json({ error: 'Failed to update video' }, { status: 500 });
  }
}

async function handleDeleteVideo(youtube: any, data: any) {
  const { videoId } = data;

  try {
    await youtube.videos.delete({
      id: videoId,
    });

    return NextResponse.json({
      success: true,
      message: 'Video deleted successfully',
    });

  } catch (error) {
    console.error('Delete video error:', error);
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 });
  }
} 