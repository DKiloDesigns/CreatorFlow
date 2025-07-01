import { NextResponse } from 'next/server';
import { getSession } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Get session
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the social account
    const account = await prisma.socialAccount.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    const issues: string[] = [];
    let isHealthy = true;
    let metrics: any = {};

    // Check token expiry
    if (account.tokenExpiresAt) {
      const expiryDate = new Date(account.tokenExpiresAt);
      const now = new Date();
      const timeUntilExpiry = expiryDate.getTime() - now.getTime();
      const daysUntilExpiry = timeUntilExpiry / (1000 * 60 * 60 * 24);
      
      if (timeUntilExpiry < 0) {
        issues.push('Access token has expired');
        isHealthy = false;
      } else if (daysUntilExpiry < 1) {
        issues.push('Access token expires today');
        isHealthy = false;
      } else if (daysUntilExpiry < 7) {
        issues.push(`Access token expires in ${Math.ceil(daysUntilExpiry)} days`);
      }
    }

    // Check account status
    if (account.status !== 'active') {
      issues.push(`Account status is ${account.status}`);
      isHealthy = false;
    }

    // Test API connectivity and fetch basic metrics
    try {
      switch (account.platform) {
        case 'instagram':
          // Test Instagram Basic Display API
          const instagramResponse = await fetch(
            `https://graph.instagram.com/me?fields=id,username&access_token=${account.encryptedAccessToken}`
          );
          if (!instagramResponse.ok) {
            issues.push('Instagram API connection failed');
            isHealthy = false;
          } else {
            const userData = await instagramResponse.json();
            // Try to get basic metrics (if available)
            try {
              const metricsResponse = await fetch(
                `https://graph.instagram.com/me?fields=followers_count,media_count&access_token=${account.encryptedAccessToken}`
              );
              if (metricsResponse.ok) {
                const metricsData = await metricsResponse.json();
                metrics = {
                  followers: metricsData.followers_count,
                  posts: metricsData.media_count,
                };
              }
            } catch (metricsError) {
              // Metrics not available, but API is working
            }
          }
          break;

        case 'twitter':
          // Test Twitter API v2
          const twitterResponse = await fetch(
            'https://api.twitter.com/2/users/me?user.fields=public_metrics',
            {
              headers: {
                'Authorization': `Bearer ${account.encryptedAccessToken}`,
              },
            }
          );
          if (!twitterResponse.ok) {
            issues.push('Twitter API connection failed');
            isHealthy = false;
          } else {
            const userData = await twitterResponse.json();
            if (userData.data?.public_metrics) {
              metrics = {
                followers: userData.data.public_metrics.followers_count,
                following: userData.data.public_metrics.following_count,
                tweets: userData.data.public_metrics.tweet_count,
              };
            }
          }
          break;

        case 'linkedin':
          // Test LinkedIn API
          const linkedinResponse = await fetch(
            'https://api.linkedin.com/v2/me',
            {
              headers: {
                'Authorization': `Bearer ${account.encryptedAccessToken}`,
              },
            }
          );
          if (!linkedinResponse.ok) {
            issues.push('LinkedIn API connection failed');
            isHealthy = false;
          }
          break;

        case 'facebook':
          // Test Facebook Graph API
          const facebookResponse = await fetch(
            `https://graph.facebook.com/me?access_token=${account.encryptedAccessToken}`
          );
          if (!facebookResponse.ok) {
            issues.push('Facebook API connection failed');
            isHealthy = false;
          }
          break;

        case 'youtube':
          // Test YouTube Data API
          const youtubeResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true&access_token=${account.encryptedAccessToken}`
          );
          if (!youtubeResponse.ok) {
            issues.push('YouTube API connection failed');
            isHealthy = false;
          } else {
            const channelData = await youtubeResponse.json();
            if (channelData.items?.[0]?.statistics) {
              metrics = {
                subscribers: parseInt(channelData.items[0].statistics.subscriberCount || '0'),
                videos: parseInt(channelData.items[0].statistics.videoCount || '0'),
                views: parseInt(channelData.items[0].statistics.viewCount || '0'),
              };
            }
          }
          break;

        case 'tiktok':
          // Test TikTok API
          const tiktokResponse = await fetch(
            'https://open.tiktokapis.com/v2/user/info/',
            {
              headers: {
                'Authorization': `Bearer ${account.encryptedAccessToken}`,
              },
            }
          );
          if (!tiktokResponse.ok) {
            issues.push('TikTok API connection failed');
            isHealthy = false;
          }
          break;

        default:
          // For unsupported platforms, just check if we have valid tokens
          if (!account.encryptedAccessToken) {
            issues.push('No access token available');
            isHealthy = false;
          }
          break;
      }
    } catch (apiError) {
      console.error('API health check error:', apiError);
      issues.push('API connectivity test failed');
      isHealthy = false;
    }

    // Update account status if needed
    if (!isHealthy && account.status === 'active') {
      await prisma.socialAccount.update({
        where: { id: account.id },
        data: { status: 'needs_reauth' },
      });
    }

    return NextResponse.json({
      accountId: account.id,
      platform: account.platform,
      isHealthy,
      lastChecked: new Date().toISOString(),
      issues,
      metrics,
    });

  } catch (error) {
    console.error('Health check endpoint error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 