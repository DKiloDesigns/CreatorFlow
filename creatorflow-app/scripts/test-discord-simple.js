import { Client, GatewayIntentBits, EmbedBuilder } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

async function testDiscordSimple() {
  console.log('🔍 Testing Discord Simple Integration...\n');

  const botToken = process.env.DISCORD_BOT_TOKEN;
  const channelId = process.env.DISCORD_TEST_CHANNEL_ID;

  if (!botToken) {
    console.log('❌ Discord Bot Token not configured');
    return;
  }

  if (!channelId) {
    console.log('❌ Discord Test Channel ID not configured');
    return;
  }

  console.log('✅ Discord credentials found');
  console.log(`Channel ID: ${channelId}`);

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  try {
    console.log('\n🔐 Logging in to Discord...');
    await client.login(botToken);
    console.log('✅ Successfully logged in to Discord');

    console.log(`\n🤖 Bot Information:`);
    console.log(`Username: ${client.user.username}`);
    console.log(`ID: ${client.user.id}`);

    // List servers and channels
    console.log(`\n📋 Available Servers:`);
    client.guilds.cache.forEach(guild => {
      console.log(`- ${guild.name} (${guild.id})`);
      console.log('  Channels:');
      guild.channels.cache.forEach(channel => {
        if (channel.type === 0) { // Text channel
          console.log(`    - ${channel.name} (${channel.id})`);
        }
      });
    });

    // Try to post a message
    console.log(`\n📝 Testing message posting to channel ${channelId}...`);
    const channel = client.channels.cache.get(channelId);
    
    if (channel) {
      console.log(`Found channel: ${channel.name}`);
      
      // Create an embed
      const embed = new EmbedBuilder()
        .setTitle('CreatorFlow Test')
        .setDescription('This is a test message from CreatorFlow Discord integration')
        .setColor(0x00ff00)
        .setTimestamp()
        .setFooter({ text: 'CreatorFlow Bot' });

      await channel.send({
        content: '🧪 CreatorFlow Discord Integration Test',
        embeds: [embed]
      });
      
      console.log('✅ Test message sent successfully!');
    } else {
      console.log('❌ Could not find the specified channel');
      console.log('Available channels:');
      client.guilds.cache.forEach(guild => {
        guild.channels.cache.forEach(channel => {
          if (channel.type === 0) { // Text channel
            console.log(`- ${channel.name} (${channel.id}) in ${guild.name}`);
          }
        });
      });
    }

  } catch (error) {
    console.log('❌ Error testing Discord integration:');
    console.log(error.message);
  } finally {
    if (client) {
      await client.destroy();
      console.log('\n🔌 Disconnected from Discord');
    }
  }
}

// Run the test
testDiscordSimple().catch(console.error); 