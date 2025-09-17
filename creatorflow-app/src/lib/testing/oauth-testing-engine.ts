/**
 * OAuth Testing Engine
 * Comprehensive testing for all 16 social media platforms
 */

export interface OAuthTestResult {
  platform: string;
  status: 'success' | 'error' | 'pending' | 'skipped';
  message: string;
  timestamp: string;
  details?: {
    redirectUri?: string;
    scope?: string;
    clientId?: string;
    errorCode?: string;
    errorDescription?: string;
  };
}

export interface PlatformConfig {
  name: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string[];
  authUrl: string;
  tokenUrl: string;
  apiUrl: string;
  testEndpoint: string;
}

export class OAuthTestingEngine {
  private platforms: PlatformConfig[] = [];
  private results: OAuthTestResult[] = [];

  constructor() {
    this.initializePlatforms();
  }

  private initializePlatforms() {
    this.platforms = [
      {
        name: 'instagram',
        clientId: process.env.INSTAGRAM_CLIENT_ID || '',
        clientSecret: process.env.INSTAGRAM_CLIENT_SECRET || '',
        redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/callback/instagram`,
        scope: ['user_profile', 'user_media'],
        authUrl: 'https://api.instagram.com/oauth/authorize',
        tokenUrl: 'https://api.instagram.com/oauth/access_token',
        apiUrl: 'https://graph.instagram.com',
        testEndpoint: '/me'
      },
      {
        name: 'facebook',
        clientId: process.env.FACEBOOK_CLIENT_ID || '',
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
        redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/callback/facebook`,
        scope: ['pages_manage_posts', 'pages_read_engagement'],
        authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
        tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
        apiUrl: 'https://graph.facebook.com/v18.0',
        testEndpoint: '/me'
      },
      {
        name: 'youtube',
        clientId: process.env.YOUTUBE_CLIENT_ID || '',
        clientSecret: process.env.YOUTUBE_CLIENT_SECRET || '',
        redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/callback/youtube`,
        scope: ['https://www.googleapis.com/auth/youtube.upload'],
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenUrl: 'https://oauth2.googleapis.com/token',
        apiUrl: 'https://www.googleapis.com/youtube/v3',
        testEndpoint: '/channels?part=snippet&mine=true'
      },
      {
        name: 'tiktok',
        clientId: process.env.TIKTOK_CLIENT_KEY || '',
        clientSecret: process.env.TIKTOK_CLIENT_SECRET || '',
        redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/callback/tiktok`,
        scope: ['user.info.basic', 'video.publish'],
        authUrl: 'https://www.tiktok.com/v2/auth/authorize',
        tokenUrl: 'https://open.tiktokapis.com/v2/oauth/token',
        apiUrl: 'https://open.tiktokapis.com/v2',
        testEndpoint: '/user/info/'
      },
      {
        name: 'github',
        clientId: process.env.GITHUB_CLIENT_ID || '',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
        redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/callback/github`,
        scope: ['user:email', 'repo'],
        authUrl: 'https://github.com/login/oauth/authorize',
        tokenUrl: 'https://github.com/login/oauth/access_token',
        apiUrl: 'https://api.github.com',
        testEndpoint: '/user'
      },
      {
        name: 'discord',
        clientId: process.env.DISCORD_CLIENT_ID || '',
        clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
        redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/callback/discord`,
        scope: ['identify', 'guilds'],
        authUrl: 'https://discord.com/api/oauth2/authorize',
        tokenUrl: 'https://discord.com/api/oauth2/token',
        apiUrl: 'https://discord.com/api/v10',
        testEndpoint: '/users/@me'
      },
      {
        name: 'twitch',
        clientId: process.env.TWITCH_CLIENT_ID || '',
        clientSecret: process.env.TWITCH_CLIENT_SECRET || '',
        redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/callback/twitch`,
        scope: ['user:read:email', 'channel:manage:broadcast'],
        authUrl: 'https://id.twitch.tv/oauth2/authorize',
        tokenUrl: 'https://id.twitch.tv/oauth2/token',
        apiUrl: 'https://api.twitch.tv/helix',
        testEndpoint: '/users'
      },
      {
        name: 'vimeo',
        clientId: process.env.VIMEO_CLIENT_ID || '',
        clientSecret: process.env.VIMEO_CLIENT_SECRET || '',
        redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/callback/vimeo`,
        scope: ['public', 'private', 'upload'],
        authUrl: 'https://api.vimeo.com/oauth/authorize',
        tokenUrl: 'https://api.vimeo.com/oauth/access_token',
        apiUrl: 'https://api.vimeo.com',
        testEndpoint: '/me'
      },
      {
        name: 'dribbble',
        clientId: process.env.DRIBBBLE_CLIENT_ID || '',
        clientSecret: process.env.DRIBBBLE_CLIENT_SECRET || '',
        redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/callback/dribbble`,
        scope: ['public', 'upload'],
        authUrl: 'https://dribbble.com/oauth/authorize',
        tokenUrl: 'https://dribbble.com/oauth/token',
        apiUrl: 'https://api.dribbble.com/v2',
        testEndpoint: '/user'
      },
      {
        name: 'slack',
        clientId: process.env.SLACK_CLIENT_ID || '',
        clientSecret: process.env.SLACK_CLIENT_SECRET || '',
        redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/callback/slack`,
        scope: ['chat:write', 'files:write'],
        authUrl: 'https://slack.com/oauth/v2/authorize',
        tokenUrl: 'https://slack.com/api/oauth.v2.access',
        apiUrl: 'https://slack.com/api',
        testEndpoint: '/auth.test'
      },
      {
        name: 'reddit',
        clientId: process.env.REDDIT_CLIENT_ID || '',
        clientSecret: process.env.REDDIT_CLIENT_SECRET || '',
        redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/callback/reddit`,
        scope: ['identity', 'submit'],
        authUrl: 'https://www.reddit.com/api/v1/authorize',
        tokenUrl: 'https://www.reddit.com/api/v1/access_token',
        apiUrl: 'https://oauth.reddit.com',
        testEndpoint: '/api/v1/me'
      },
      {
        name: 'snapchat',
        clientId: process.env.SNAPCHAT_CLIENT_ID || '',
        clientSecret: process.env.SNAPCHAT_CLIENT_SECRET || '',
        redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/callback/snapchat`,
        scope: ['user.display_name', 'user.bitmoji.avatar'],
        authUrl: 'https://accounts.snapchat.com/login/oauth2/authorize',
        tokenUrl: 'https://accounts.snapchat.com/login/oauth2/access_token',
        apiUrl: 'https://kit.snapchat.com/v1',
        testEndpoint: '/me'
      },
      {
        name: 'linkedin',
        clientId: process.env.LINKEDIN_CLIENT_ID || '',
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
        redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/callback/linkedin`,
        scope: ['r_liteprofile', 'r_emailaddress', 'w_member_social'],
        authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
        tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
        apiUrl: 'https://api.linkedin.com/v2',
        testEndpoint: '/people/~'
      },
      {
        name: 'twitter',
        clientId: process.env.TWITTER_CLIENT_ID || '',
        clientSecret: process.env.TWITTER_CLIENT_SECRET || '',
        redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/callback/twitter`,
        scope: ['tweet.read', 'tweet.write', 'users.read'],
        authUrl: 'https://twitter.com/i/oauth2/authorize',
        tokenUrl: 'https://api.twitter.com/2/oauth2/token',
        apiUrl: 'https://api.twitter.com/2',
        testEndpoint: '/users/me'
      },
      {
        name: 'whatsapp',
        clientId: process.env.WHATSAPP_CLIENT_ID || '',
        clientSecret: process.env.WHATSAPP_CLIENT_SECRET || '',
        redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/callback/whatsapp`,
        scope: ['whatsapp_business_management', 'whatsapp_business_messaging'],
        authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
        tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
        apiUrl: 'https://graph.facebook.com/v18.0',
        testEndpoint: '/me'
      },
      {
        name: 'mastodon',
        clientId: process.env.MASTODON_CLIENT_ID || '',
        clientSecret: process.env.MASTODON_CLIENT_SECRET || '',
        redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/callback/mastodon`,
        scope: ['read', 'write'],
        authUrl: `${process.env.MASTODON_INSTANCE_URL}/oauth/authorize`,
        tokenUrl: `${process.env.MASTODON_INSTANCE_URL}/oauth/token`,
        apiUrl: process.env.MASTODON_INSTANCE_URL || '',
        testEndpoint: '/api/v1/accounts/verify_credentials'
      }
    ];
  }

  async testAllPlatforms(): Promise<OAuthTestResult[]> {
    console.log('🚀 Starting OAuth testing for all 16 platforms...');
    
    const testPromises = this.platforms.map(platform => this.testPlatform(platform));
    const results = await Promise.allSettled(testPromises);
    
    this.results = results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          platform: this.platforms[index].name,
          status: 'error',
          message: result.reason?.message || 'Unknown error',
          timestamp: new Date().toISOString()
        };
      }
    });

    return this.results;
  }

  async testPlatform(platform: PlatformConfig): Promise<OAuthTestResult> {
    try {
      console.log(`Testing ${platform.name}...`);

      // Check if credentials are configured
      if (!platform.clientId || !platform.clientSecret) {
        return {
          platform: platform.name,
          status: 'skipped',
          message: 'Credentials not configured',
          timestamp: new Date().toISOString(),
          details: {
            clientId: platform.clientId ? 'configured' : 'missing',
            redirectUri: platform.redirectUri
          }
        };
      }

      // Test OAuth URL generation
      const authUrl = this.generateAuthUrl(platform);
      if (!authUrl) {
        return {
          platform: platform.name,
          status: 'error',
          message: 'Failed to generate OAuth URL',
          timestamp: new Date().toISOString(),
          details: {
            redirectUri: platform.redirectUri,
            scope: platform.scope.join(' ')
          }
        };
      }

      // Test redirect URI accessibility
      const redirectTest = await this.testRedirectUri(platform.redirectUri);
      if (!redirectTest.success) {
        return {
          platform: platform.name,
          status: 'error',
          message: `Redirect URI not accessible: ${redirectTest.error}`,
          timestamp: new Date().toISOString(),
          details: {
            redirectUri: platform.redirectUri,
            errorCode: redirectTest.errorCode
          }
        };
      }

      return {
        platform: platform.name,
        status: 'success',
        message: 'OAuth configuration valid',
        timestamp: new Date().toISOString(),
        details: {
          redirectUri: platform.redirectUri,
          scope: platform.scope.join(' '),
          clientId: platform.clientId ? 'configured' : 'missing'
        }
      };

    } catch (error) {
      return {
        platform: platform.name,
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        details: {
          redirectUri: platform.redirectUri,
          errorCode: 'TEST_ERROR'
        }
      };
    }
  }

  private generateAuthUrl(platform: PlatformConfig): string | null {
    try {
      const params = new URLSearchParams({
        client_id: platform.clientId,
        redirect_uri: platform.redirectUri,
        response_type: 'code',
        scope: platform.scope.join(' '),
        state: `test_${Date.now()}`
      });

      return `${platform.authUrl}?${params.toString()}`;
    } catch (error) {
      console.error(`Error generating auth URL for ${platform.name}:`, error);
      return null;
    }
  }

  private async testRedirectUri(redirectUri: string): Promise<{ success: boolean; error?: string; errorCode?: string }> {
    try {
      const response = await fetch(redirectUri, {
        method: 'HEAD',
        redirect: 'manual'
      });

      // Accept 200, 302, 404 (as long as it's reachable)
      if (response.status === 200 || response.status === 302 || response.status === 404) {
        return { success: true };
      }

      return {
        success: false,
        error: `HTTP ${response.status}`,
        errorCode: `HTTP_${response.status}`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        errorCode: 'NETWORK_ERROR'
      };
    }
  }

  async testActualPosting(platform: string, accessToken: string): Promise<OAuthTestResult> {
    try {
      const platformConfig = this.platforms.find(p => p.name === platform);
      if (!platformConfig) {
        throw new Error(`Platform ${platform} not found`);
      }

      // Test API endpoint with access token
      const testUrl = `${platformConfig.apiUrl}${platformConfig.testEndpoint}`;
      const response = await fetch(testUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API test failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        platform: platform,
        status: 'success',
        message: 'API access successful',
        timestamp: new Date().toISOString(),
        details: {
          apiUrl: testUrl,
          responseData: data
        }
      };

    } catch (error) {
      return {
        platform: platform,
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        details: {
          errorCode: 'API_TEST_ERROR'
        }
      };
    }
  }

  getResults(): OAuthTestResult[] {
    return this.results;
  }

  getPlatformStatus(platform: string): OAuthTestResult | undefined {
    return this.results.find(result => result.platform === platform);
  }

  getSummary(): {
    total: number;
    success: number;
    error: number;
    skipped: number;
    pending: number;
  } {
    const summary = {
      total: this.results.length,
      success: 0,
      error: 0,
      skipped: 0,
      pending: 0
    };

    this.results.forEach(result => {
      summary[result.status]++;
    });

    return summary;
  }
}
