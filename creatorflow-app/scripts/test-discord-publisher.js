import DiscordPublisher from '../src/lib/publishers/discord.ts';
import dotenv from 'dotenv';

dotenv.config();

async function testDiscordPublisher() {
  console.log('🔍 Testing Discord Publisher...\n');

  const publisher = new DiscordPublisher();

  try {
    // Initialize the publisher
    console.log('🔐 Initializing Discord publisher...');
    await publisher.initialize();

    // Get available channels
    console.log('\n📋 Available channels:');
    const channels = await publisher.getAvailableChannels();
    channels.forEach(channel => {
      console.log(`- ${channel.name} (${channel.id}) in ${channel.guildName}`);
    });

    if (channels.length === 0) {
      console.log('❌ No channels available. Make sure the bot has proper permissions.');
      return;
    }

    // Test posting a simple message
    const testChannelId = channels[0].id; // Use the first available channel
    console.log(`\n📝 Testing message posting to channel: ${channels[0].name} (${testChannelId})`);

    const success = await publisher.post({
      content: '🧪 CreatorFlow Discord Publisher Test',
      title: 'CreatorFlow Test',
      description: 'This is a test message from the CreatorFlow Discord publisher',
      color: 0x00ff00,
      channelId: testChannelId
    });

    if (success) {
      console.log('✅ Message posted successfully!');
    } else {
      console.log('❌ Failed to post message');
    }

  } catch (error) {
    console.error('❌ Error testing Discord publisher:', error.message);
  } finally {
    // Clean up
    await publisher.disconnect();
    console.log('\n🔌 Disconnected from Discord');
  }
}

// Run the test
testDiscordPublisher().catch(console.error); 