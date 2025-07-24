import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

async function testDiscordBasic() {
  console.log('🔍 Testing Discord Basic Integration...\n');

  // Check if credentials are set
  const botToken = process.env.DISCORD_BOT_TOKEN;
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;

  if (!botToken || botToken === 'your_actual_bot_token_here') {
    console.log('❌ Discord Bot Token not configured');
    console.log('Please add your Discord Bot Token to .env file');
    return;
  }

  if (!clientId || clientId === 'your_discord_client_id') {
    console.log('❌ Discord Client ID not configured');
    console.log('Please add your Discord Client ID to .env file');
    return;
  }

  console.log('✅ Discord credentials found');
  console.log(`Client ID: ${clientId}`);
  console.log(`Bot Token: ${botToken.substring(0, 10)}...`);

  // Create Discord client
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  try {
    // Login with bot token
    console.log('\n🔐 Logging in to Discord...');
    await client.login(botToken);
    console.log('✅ Successfully logged in to Discord');

    // Get bot information
    console.log(`\n🤖 Bot Information:`);
    console.log(`Username: ${client.user.username}`);
    console.log(`ID: ${client.user.id}`);
    console.log(`Created: ${client.user.createdAt}`);

    // List available guilds (servers)
    console.log(`\n📋 Available Servers:`);
    client.guilds.cache.forEach(guild => {
      console.log(`- ${guild.name} (${guild.id})`);
    });

    // Test posting to a channel (you'll need to specify a channel ID)
    const testChannelId = process.env.DISCORD_TEST_CHANNEL_ID;
    
    if (testChannelId) {
      console.log(`\n📝 Testing message posting to channel ${testChannelId}...`);
      const channel = client.channels.cache.get(testChannelId);
      
      if (channel) {
        const testMessage = {
          content: '🧪 CreatorFlow Discord Integration Test',
          embeds: [{
            title: 'CreatorFlow Test',
            description: 'This is a test message from CreatorFlow Discord integration',
            color: 0x00ff00,
            timestamp: new Date().toISOString(),
            footer: {
              text: 'CreatorFlow Bot'
            }
          }]
        };

        await channel.send(testMessage);
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
    } else {
      console.log('\n💡 To test message posting, add DISCORD_TEST_CHANNEL_ID to your .env file');
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
    
    if (error.message.includes('Invalid token')) {
      console.log('\n💡 Make sure your Discord Bot Token is correct');
    } else if (error.message.includes('Missing Permissions')) {
      console.log('\n💡 Make sure your bot has the necessary permissions');
    }
  } finally {
    // Clean up
    if (client) {
      await client.destroy();
      console.log('\n🔌 Disconnected from Discord');
    }
  }
}

// Run the test
testDiscordBasic().catch(console.error); 