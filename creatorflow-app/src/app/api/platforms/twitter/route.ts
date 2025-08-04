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

    // Get user's Twitter account
    const socialAccount = await prisma.socialAccount.findFirst({
      where: {
        userId: session.user.id,
        platform: 'twitter',
      },
    });

    if (!socialAccount?.accessToken) {
      return NextResponse.json({ error: 'Twitter account not connected' }, { status: 400 });
    }

    switch (action) {
      case 'create_tweet':
        return await handleCreateTweet(socialAccount.accessToken, data);
      
      case 'upload_media':
        return await handleUploadMedia(socialAccount.accessToken, data);
      
      case 'get_user_info':
        return await handleGetUserInfo(socialAccount.accessToken);
      
      case 'get_tweets':
        return await handleGetTweets(socialAccount.accessToken, data);
      
      case 'retweet':
        return await handleRetweet(socialAccount.accessToken, data);
      
      case 'like_tweet':
        return await handleLikeTweet(socialAccount.accessToken, data);
      
      case 'get_analytics':
        return await handleGetAnalytics(socialAccount.accessToken, data);
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Twitter API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handleCreateTweet(accessToken: string, data: any) {
  const { text, mediaIds, replyToTweetId, quoteTweetId } = data;

  try {
    const tweetData: any = {
      text,
    };

    if (mediaIds && mediaIds.length > 0) {
      tweetData.media = { media_ids: mediaIds };
    }

    if (replyToTweetId) {
      tweetData.reply = { in_reply_to_tweet_id: replyToTweetId };
    }

    if (quoteTweetId) {
      tweetData.quote_tweet_id = quoteTweetId;
    }

    const response = await fetch('https://api.twitter.com/2/tweets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tweetData),
    });

    if (!response.ok) {
      throw new Error('Failed to create tweet');
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      tweetId: result.data.id,
      tweetUrl: `https://twitter.com/user/status/${result.data.id}`,
    });

  } catch (error) {
    console.error('Twitter tweet creation error:', error);
    return NextResponse.json({ error: 'Failed to create tweet' }, { status: 500 });
  }
}

async function handleUploadMedia(accessToken: string, data: any) {
  const { mediaPath, mediaType } = data;

  try {
    // Twitter media upload
    const response = await fetch('https://upload.twitter.com/1.1/media/upload.json', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        media_category: mediaType || 'tweet_image',
        media_data: mediaPath, // Base64 encoded media
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to upload media to Twitter');
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      mediaId: result.media_id_string,
    });

  } catch (error) {
    console.error('Twitter media upload error:', error);
    return NextResponse.json({ error: 'Failed to upload media' }, { status: 500 });
  }
}

async function handleGetUserInfo(accessToken: string) {
  try {
    const response = await fetch('https://api.twitter.com/2/users/me?user.fields=id,name,username,profile_image_url,public_metrics', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get Twitter user info');
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      userInfo: result.data,
    });

  } catch (error) {
    console.error('Get Twitter user info error:', error);
    return NextResponse.json({ error: 'Failed to get user info' }, { status: 500 });
  }
}

async function handleGetTweets(accessToken: string, data: any) {
  const { userId, maxResults = 10 } = data;

  try {
    const response = await fetch(`https://api.twitter.com/2/users/${userId}/tweets?max_results=${maxResults}&tweet.fields=created_at,public_metrics,entities`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get Twitter tweets');
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      tweets: result.data,
    });

  } catch (error) {
    console.error('Get Twitter tweets error:', error);
    return NextResponse.json({ error: 'Failed to get tweets' }, { status: 500 });
  }
}

async function handleRetweet(accessToken: string, data: any) {
  const { tweetId } = data;

  try {
    const response = await fetch('https://api.twitter.com/2/users/me/retweets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tweet_id: tweetId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to retweet');
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      retweetId: result.data.id,
    });

  } catch (error) {
    console.error('Twitter retweet error:', error);
    return NextResponse.json({ error: 'Failed to retweet' }, { status: 500 });
  }
}

async function handleLikeTweet(accessToken: string, data: any) {
  const { tweetId } = data;

  try {
    const response = await fetch('https://api.twitter.com/2/users/me/likes', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tweet_id: tweetId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to like tweet');
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      likeId: result.data.id,
    });

  } catch (error) {
    console.error('Twitter like error:', error);
    return NextResponse.json({ error: 'Failed to like tweet' }, { status: 500 });
  }
}

async function handleGetAnalytics(accessToken: string, data: any) {
  const { tweetId } = data;

  try {
    const response = await fetch(`https://api.twitter.com/2/tweets/${tweetId}?tweet.fields=public_metrics,non_public_metrics`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get Twitter analytics');
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      analytics: result.data,
    });

  } catch (error) {
    console.error('Get Twitter analytics error:', error);
    return NextResponse.json({ error: 'Failed to get analytics' }, { status: 500 });
  }
} 