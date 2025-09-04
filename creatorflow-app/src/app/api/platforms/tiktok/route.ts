import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, data } = await req.json();

    // Get user's TikTok account
    const socialAccount = await prisma.socialAccount.findFirst({
      where: {
        userId: session.user.id,
        platform: 'tiktok',
      },
    });

    if (!socialAccount?.encryptedAccessToken) {
      return NextResponse.json({ error: 'TikTok account not connected' }, { status: 400 });
    }

    // TODO: Decrypt the access token before using it
    const accessToken = socialAccount.encryptedAccessToken; // This should be decrypted

    switch (action) {
      case 'upload_video':
        return await handleVideoUpload(accessToken, data);
      
      case 'get_user_info':
        return await handleGetUserInfo(accessToken);
      
      case 'get_videos':
        return await handleGetVideos(accessToken, data);
      
      case 'create_post':
        return await handleCreatePost(accessToken, data);
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('TikTok API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handleVideoUpload(accessToken: string, data: any) {
  const { videoPath, title, description, privacyLevel } = data;

  try {
    // TikTok video upload implementation
    // Note: TikTok API requires specific authentication and upload flow
    const response = await fetch('https://open-api.tiktok.com/v2/video/upload/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        video_path: videoPath,
        title,
        description,
        privacy_level: privacyLevel || 'public',
      }),
    });

    if (!response.ok) {
      throw new Error('TikTok upload failed');
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      videoId: result.data.video_id,
      videoUrl: result.data.video_url,
    });

  } catch (error) {
    console.error('TikTok video upload error:', error);
    return NextResponse.json({ error: 'Failed to upload video to TikTok' }, { status: 500 });
  }
}

async function handleGetUserInfo(accessToken: string) {
  try {
    const response = await fetch('https://open-api.tiktok.com/v2/user/info/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get TikTok user info');
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      userInfo: result.data,
    });

  } catch (error) {
    console.error('Get TikTok user info error:', error);
    return NextResponse.json({ error: 'Failed to get user info' }, { status: 500 });
  }
}

async function handleGetVideos(accessToken: string, data: any) {
  const { maxCount = 20 } = data;

  try {
    const response = await fetch(`https://open-api.tiktok.com/v2/video/list/?max_count=${maxCount}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get TikTok videos');
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      videos: result.data.videos,
    });

  } catch (error) {
    console.error('Get TikTok videos error:', error);
    return NextResponse.json({ error: 'Failed to get videos' }, { status: 500 });
  }
}

async function handleCreatePost(accessToken: string, data: any) {
  const { text, hashtags, mentions } = data;

  try {
    const response = await fetch('https://open-api.tiktok.com/v2/post/create/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        hashtags,
        mentions,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create TikTok post');
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      postId: result.data.post_id,
      postUrl: result.data.post_url,
    });

  } catch (error) {
    console.error('Create TikTok post error:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
} 