import { Client, GatewayIntentBits, TextChannel, EmbedBuilder } from 'discord.js';

export interface DiscordPostData {
  content?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  color?: number;
  channelId?: string;
}

export class DiscordPublisher {
  private client: Client;
  private botToken: string;
  private defaultChannelId?: string;

  constructor() {
    this.botToken = process.env.DISCORD_BOT_TOKEN || '';
    this.defaultChannelId = process.env.DISCORD_DEFAULT_CHANNEL_ID;
    
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
  }

  async initialize(): Promise<void> {
    if (!this.botToken) {
      throw new Error('Discord Bot Token not configured');
    }

    try {
      await this.client.login(this.botToken);
      console.log('✅ Discord bot logged in successfully');
    } catch (error) {
      console.error('❌ Failed to login to Discord:', error);
      throw error;
    }
  }

  async post(data: DiscordPostData): Promise<boolean> {
    try {
      const channelId = data.channelId || this.defaultChannelId;
      
      if (!channelId) {
        throw new Error('No Discord channel ID specified');
      }

      const channel = this.client.channels.cache.get(channelId) as TextChannel;
      
      if (!channel) {
        throw new Error(`Channel ${channelId} not found or not accessible`);
      }

      // Create embed if title/description provided
      if (data.title || data.description) {
        const embed = new EmbedBuilder()
          .setColor(data.color || 0x00ff00)
          .setTimestamp();

        if (data.title) embed.setTitle(data.title);
        if (data.description) embed.setDescription(data.description);
        if (data.imageUrl) embed.setImage(data.imageUrl);

        await channel.send({
          content: data.content,
          embeds: [embed]
        });
      } else {
        // Send plain text message
        await channel.send(data.content || '');
      }

      console.log('✅ Message posted to Discord successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to post to Discord:', error);
      return false;
    }
  }

  async getAvailableChannels(): Promise<Array<{ id: string; name: string; guildName: string }>> {
    const channels: Array<{ id: string; name: string; guildName: string }> = [];
    
    this.client.guilds.cache.forEach(guild => {
      guild.channels.cache.forEach(channel => {
        if (channel.type === 0) { // Text channel
          channels.push({
            id: channel.id,
            name: channel.name,
            guildName: guild.name
          });
        }
      });
    });

    return channels;
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.destroy();
    }
  }
}

export default DiscordPublisher; 