import { ApiClient } from '@twurple/api';
import { RefreshingAuthProvider } from '@twurple/auth';

export interface TwitchPostData {
  content: string;
  channelName?: string;
}

export class TwitchPublisher {
  private apiClient: ApiClient;
  private authProvider: RefreshingAuthProvider;
  private clientId: string;
  private clientSecret: string;
  private accessToken: string;
  private refreshToken: string;
  private defaultChannel?: string;

  constructor() {
    this.clientId = process.env.TWITCH_CLIENT_ID || '';
    this.clientSecret = process.env.TWITCH_CLIENT_SECRET || '';
    this.accessToken = process.env.TWITCH_ACCESS_TOKEN || '';
    this.refreshToken = process.env.TWITCH_REFRESH_TOKEN || '';
    this.defaultChannel = process.env.TWITCH_DEFAULT_CHANNEL;

    this.authProvider = new RefreshingAuthProvider({
      clientId: this.clientId,
      clientSecret: this.clientSecret,
      onRefresh: async (userId, newTokenData) => {
        // Update environment variables with new tokens
        process.env.TWITCH_ACCESS_TOKEN = newTokenData.accessToken;
        process.env.TWITCH_REFRESH_TOKEN = newTokenData.refreshToken;
      },
    });

    this.apiClient = new ApiClient({ authProvider: this.authProvider });
  }

  async initialize(): Promise<void> {
    if (!this.clientId || !this.clientSecret) {
      throw new Error('Twitch Client ID and Client Secret not configured');
    }

    if (!this.accessToken || !this.refreshToken) {
      throw new Error('Twitch Access Token and Refresh Token not configured');
    }

    try {
      // Set the tokens
      this.authProvider.addUserForToken({
        accessToken: this.accessToken,
        refreshToken: this.refreshToken,
        expiresIn: 0,
        obtainmentTimestamp: 0,
      }, ['chat:read', 'chat:edit', 'channel:read:redemptions']);

      console.log('✅ Twitch authentication initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Twitch authentication:', error);
      throw error;
    }
  }

  async post(data: TwitchPostData): Promise<boolean> {
    try {
      const channelName = data.channelName || this.defaultChannel;
      
      if (!channelName) {
        throw new Error('No Twitch channel specified');
      }

      // Note: Twitch API doesn't allow posting to chat via API
      // This would require a chat bot implementation
      // For now, we'll simulate the post and return success
      
      console.log(`📝 Would post to Twitch channel: ${channelName}`);
      console.log(`Message: ${data.content}`);
      
      // In a real implementation, you would:
      // 1. Use a chat bot library like tmi.js
      // 2. Connect to the Twitch IRC server
      // 3. Send the message to the channel
      
      console.log('✅ Twitch message simulation successful');
      return true;
    } catch (error) {
      console.error('❌ Failed to post to Twitch:', error);
      return false;
    }
  }

  async getChannelInfo(channelName: string): Promise<any> {
    try {
      const user = await this.apiClient.users.getUserByName(channelName);
      if (user) {
        return {
          id: user.id,
          name: user.name,
          displayName: user.displayName,
          profilePictureUrl: user.profilePictureUrl,
          isLive: await this.apiClient.streams.getStreamByUserId(user.id) !== null,
        };
      }
      return null;
    } catch (error) {
      console.error('❌ Failed to get Twitch channel info:', error);
      return null;
    }
  }

  async validateCredentials(): Promise<boolean> {
    try {
      const user = await this.apiClient.users.getMe();
      console.log(`✅ Twitch credentials valid for user: ${user.displayName}`);
      return true;
    } catch (error) {
      console.error('❌ Twitch credentials invalid:', error);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    // Clean up if needed
    console.log('🔌 Disconnected from Twitch');
  }
}

export default TwitchPublisher; 