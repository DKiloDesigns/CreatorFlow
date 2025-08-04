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

    // Get user's Instagram account
    const socialAccount = await prisma.socialAccount.findFirst({
      where: {
        userId: session.user.id,
        platform: 'instagram',
      },
    });

    if (!socialAccount?.accessToken) {
      return NextResponse.json({ error: 'Instagram account not connected' }, { status: 400 });
    }

    switch (action) {
      case 'create_post':
        return await handleCreatePost(socialAccount.accessToken, data);
      
      case 'create_story':
        return await handleCreateStory(socialAccount.accessToken, data);
      
      case 'create_reel':
        return await handleCreateReel(socialAccount.accessToken, data);
      
      case 'get_user_info':
        return await handleGetUserInfo(socialAccount.accessToken);
      
      case 'get_media':
        return await handleGetMedia(socialAccount.accessToken, data);
      
      case 'get_insights':
        return await handleGetInsights(socialAccount.accessToken, data);
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Instagram API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handleCreatePost(accessToken: string, data: any) {
  const { imageUrl, caption, hashtags, location } = data;

  try {
    // Instagram Graph API - Create Media Container
    const mediaResponse = await fetch(`https://graph.facebook.com/v18.0/me/media`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: accessToken,
        image_url: imageUrl,
        caption: caption,
        hashtags: hashtags,
        location_id: location,
      }),
    });

    if (!mediaResponse.ok) {
      throw new Error('Failed to create media container');
    }

    const mediaResult = await mediaResponse.json();
    const creationId = mediaResult.id;

    // Publish the media
    const publishResponse = await fetch(`https://graph.facebook.com/v18.0/me/media_publish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: accessToken,
        creation_id: creationId,
      }),
    });

    if (!publishResponse.ok) {
      throw new Error('Failed to publish media');
    }

    const publishResult = await publishResponse.json();

    return NextResponse.json({
      success: true,
      postId: publishResult.id,
      postUrl: `https://www.instagram.com/p/${publishResult.id}/`,
    });

  } catch (error) {
    console.error('Instagram post creation error:', error);
    return NextResponse.json({ error: 'Failed to create Instagram post' }, { status: 500 });
  }
}

async function handleCreateStory(accessToken: string, data: any) {
  const { imageUrl, caption, hashtags } = data;

  try {
    // Instagram Story creation
    const response = await fetch(`https://graph.facebook.com/v18.0/me/stories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: accessToken,
        image_url: imageUrl,
        caption: caption,
        hashtags: hashtags,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create Instagram story');
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      storyId: result.id,
    });

  } catch (error) {
    console.error('Instagram story creation error:', error);
    return NextResponse.json({ error: 'Failed to create Instagram story' }, { status: 500 });
  }
}

async function handleCreateReel(accessToken: string, data: any) {
  const { videoUrl, caption, hashtags, coverImageUrl } = data;

  try {
    // Instagram Reel creation
    const response = await fetch(`https://graph.facebook.com/v18.0/me/media`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: accessToken,
        media_type: 'REELS',
        video_url: videoUrl,
        caption: caption,
        hashtags: hashtags,
        cover_image_url: coverImageUrl,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create Instagram reel');
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      reelId: result.id,
    });

  } catch (error) {
    console.error('Instagram reel creation error:', error);
    return NextResponse.json({ error: 'Failed to create Instagram reel' }, { status: 500 });
  }
}

async function handleGetUserInfo(accessToken: string) {
  try {
    const response = await fetch(`https://graph.facebook.com/v18.0/me?fields=id,username,account_type,media_count&access_token=${accessToken}`);

    if (!response.ok) {
      throw new Error('Failed to get Instagram user info');
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      userInfo: result,
    });

  } catch (error) {
    console.error('Get Instagram user info error:', error);
    return NextResponse.json({ error: 'Failed to get user info' }, { status: 500 });
  }
}

async function handleGetMedia(accessToken: string, data: any) {
  const { limit = 25, mediaType } = data;

  try {
    let fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
    if (mediaType) {
      fields += `&media_type=${mediaType}`;
    }

    const response = await fetch(`https://graph.facebook.com/v18.0/me/media?fields=${fields}&limit=${limit}&access_token=${accessToken}`);

    if (!response.ok) {
      throw new Error('Failed to get Instagram media');
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      media: result.data,
    });

  } catch (error) {
    console.error('Get Instagram media error:', error);
    return NextResponse.json({ error: 'Failed to get media' }, { status: 500 });
  }
}

async function handleGetInsights(accessToken: string, data: any) {
  const { postId, metrics } = data;

  try {
    const metricsString = metrics ? metrics.join(',') : 'impressions,reach,engagement';
    const response = await fetch(`https://graph.facebook.com/v18.0/${postId}/insights?metric=${metricsString}&access_token=${accessToken}`);

    if (!response.ok) {
      throw new Error('Failed to get Instagram insights');
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      insights: result.data,
    });

  } catch (error) {
    console.error('Get Instagram insights error:', error);
    return NextResponse.json({ error: 'Failed to get insights' }, { status: 500 });
  }
} 