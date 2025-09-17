# Unified Publishing System

## Overview

The Unified Publishing System is a comprehensive solution for cross-platform content publishing and scheduling. It provides a single interface to publish content across multiple social media platforms, schedule posts for future publishing, and track performance analytics.

## Features

### 🚀 **Core Features**
- **Cross-Platform Publishing**: Publish to Instagram, YouTube, Twitter, TikTok, LinkedIn, and more
- **Content Scheduling**: Schedule posts for future publishing with precise timing
- **Media Management**: Upload and attach images, videos, and other media
- **Hashtag Management**: Add and manage hashtags for better discoverability
- **Location Tagging**: Add location information to posts
- **Real-time Analytics**: Track performance across all platforms
- **Platform Health Monitoring**: Monitor connection status and API health

### 🏗️ **Architecture**

#### **API Abstraction Layer**
- **PlatformAPIManager**: Centralized manager for all platform APIs
- **Platform-Specific APIs**: Individual API implementations for each platform
- **Unified Interface**: Consistent API across all platforms

#### **Content Publishing Service**
- **ContentPublishingService**: Handles publishing logic and scheduling
- **Scheduled Post Management**: Database-driven scheduling system
- **Analytics Aggregation**: Performance tracking and reporting

#### **Database Schema**
- **ScheduledPost**: Stores scheduled content and publishing results
- **PlatformIntegration**: Tracks platform connection status and health

## API Endpoints

### **Unified Platform API**
```
POST /api/platforms/unified
```

**Actions:**
- `create_post`: Create a post on specified platform
- `upload_media`: Upload media to platform
- `get_user_info`: Get user information from platform
- `get_analytics`: Get analytics data from platform
- `refresh_token`: Refresh access token
- `check_health`: Check platform health status

**Example Request:**
```json
{
  "platform": "instagram",
  "action": "create_post",
  "data": {
    "content": "Hello World! #test",
    "mediaUrls": ["https://example.com/image.jpg"],
    "hashtags": ["#test", "#hello"],
    "location": "New York, NY"
  }
}
```

### **Unified Publishing API**
```
POST /api/publish/unified
```

**Actions:**
- `publish_now`: Publish content immediately to selected platforms
- `schedule`: Schedule content for future publishing
- `process_scheduled`: Process scheduled posts (cron job)

**Example Request:**
```json
{
  "action": "publish_now",
  "data": {
    "content": "Hello World! #test",
    "platforms": ["instagram", "twitter", "linkedin"],
    "mediaUrls": ["https://example.com/image.jpg"],
    "hashtags": ["#test", "#hello"],
    "location": "New York, NY"
  }
}
```

### **Scheduled Posts Management**
```
GET /api/publish/unified?action=scheduled_posts&status=pending
DELETE /api/publish/unified?post_id=123
```

### **Analytics**
```
GET /api/publish/unified?action=analytics&start_date=2024-01-01&end_date=2024-12-31
```

## Platform Support

### **Currently Supported Platforms**

#### **Instagram**
- **API**: Instagram Graph API
- **Features**: Posts, Stories, Reels, Analytics
- **Media Types**: Images, Videos, Carousels
- **Requirements**: Instagram Business Account

#### **YouTube**
- **API**: YouTube Data API v3
- **Features**: Video uploads, Playlist management, Analytics
- **Media Types**: Videos only
- **Requirements**: YouTube Channel

#### **Twitter**
- **API**: Twitter API v2
- **Features**: Tweets, Media uploads, Analytics
- **Media Types**: Images, Videos
- **Requirements**: Twitter Developer Account

#### **TikTok**
- **API**: TikTok for Business API
- **Features**: Video uploads, Analytics
- **Media Types**: Videos only
- **Requirements**: TikTok Business Account

#### **LinkedIn**
- **API**: LinkedIn API v2
- **Features**: Posts, Media uploads, Analytics
- **Media Types**: Images, Videos
- **Requirements**: LinkedIn Developer Account

## Usage Examples

### **React Component Usage**

```tsx
import UnifiedPublisher from '@/components/publishing/unified-publisher';

function MyComponent() {
  const handlePublish = (results) => {
    console.log('Publishing results:', results);
  };

  const handleSchedule = (scheduledPostId) => {
    console.log('Scheduled post ID:', scheduledPostId);
  };

  return (
    <UnifiedPublisher
      onPublish={handlePublish}
      onSchedule={handleSchedule}
    />
  );
}
```

### **Direct API Usage**

```typescript
// Publish content immediately
const response = await fetch('/api/publish/unified', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'publish_now',
    data: {
      content: 'Hello World! #test',
      platforms: ['instagram', 'twitter'],
      mediaUrls: ['https://example.com/image.jpg'],
      hashtags: ['#test', '#hello'],
    },
  }),
});

const result = await response.json();
console.log('Publishing results:', result.result);
```

### **Scheduling Content**

```typescript
// Schedule content for future publishing
const response = await fetch('/api/publish/unified', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'schedule',
    data: {
      content: 'Scheduled post! #test',
      platforms: ['instagram', 'twitter', 'linkedin'],
      scheduledTime: '2024-12-25T10:00:00Z',
      mediaUrls: ['https://example.com/image.jpg'],
    },
  }),
});

const result = await response.json();
console.log('Scheduled post ID:', result.result.scheduledPostId);
```

## Configuration

### **Environment Variables**

```env
# Instagram
INSTAGRAM_CLIENT_ID=your_instagram_client_id
INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret

# YouTube/Google
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Twitter
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret

# TikTok
TIKTOK_CLIENT_KEY=your_tiktok_client_key
TIKTOK_CLIENT_SECRET=your_tiktok_client_secret

# LinkedIn
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# Cron Job
CRON_SECRET=your_cron_secret
```

### **Database Migration**

Run the following Prisma migration to add the required tables:

```bash
npx prisma db push
```

## Cron Job Setup

### **Vercel Cron Jobs**

Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/process-scheduled-posts",
      "schedule": "0 */5 * * *"
    }
  ]
}
```

### **Manual Cron Job**

Set up a cron job to call the endpoint every 5 minutes:

```bash
# Add to crontab
*/5 * * * * curl -X POST https://your-domain.com/api/cron/process-scheduled-posts -H "Authorization: Bearer your_cron_secret"
```

## Error Handling

### **Common Error Scenarios**

1. **Platform Not Connected**: User hasn't connected their social media account
2. **Token Expired**: Access token needs to be refreshed
3. **Rate Limited**: API rate limits exceeded
4. **Invalid Media**: Unsupported media type or size
5. **Network Error**: Connection issues with platform APIs

### **Error Response Format**

```json
{
  "success": false,
  "error": "Error message",
  "platform": "instagram",
  "action": "create_post"
}
```

## Monitoring and Analytics

### **Platform Health Monitoring**

```typescript
// Check platform health
const response = await fetch('/api/platforms/unified?action=platform_health&platform=instagram');
const health = await response.json();

if (health.healthy) {
  console.log('Instagram is connected and healthy');
} else {
  console.log('Instagram error:', health.error);
}
```

### **Publishing Analytics**

```typescript
// Get publishing analytics
const response = await fetch('/api/publish/unified?action=analytics');
const analytics = await response.json();

console.log('Total posts:', analytics.totalPosts);
console.log('Success rate:', analytics.successfulPosts / analytics.totalPosts);
console.log('Platform breakdown:', analytics.platformBreakdown);
```

## Security Considerations

1. **Token Encryption**: All access tokens are encrypted before storage
2. **API Rate Limiting**: Built-in rate limiting to prevent abuse
3. **Input Validation**: All inputs are validated and sanitized
4. **Cron Job Security**: Cron jobs require authentication
5. **Platform Permissions**: Minimal required permissions for each platform

## Performance Optimization

1. **Parallel Processing**: Multiple platforms processed simultaneously
2. **Caching**: Platform health and user info cached
3. **Error Retry**: Automatic retry for transient failures
4. **Database Indexing**: Optimized database queries
5. **Background Processing**: Scheduled posts processed in background

## Troubleshooting

### **Common Issues**

1. **"Platform not connected"**: User needs to connect their social media account
2. **"Token expired"**: Access token needs to be refreshed
3. **"Rate limited"**: Wait for rate limit to reset
4. **"Invalid media"**: Check media format and size requirements
5. **"Scheduling failed"**: Check scheduled time is in the future

### **Debug Mode**

Enable debug logging by setting:

```env
DEBUG_PUBLISHING=true
```

## Future Enhancements

1. **Additional Platforms**: Facebook, Pinterest, Snapchat, etc.
2. **Advanced Scheduling**: Recurring posts, optimal timing
3. **Content Templates**: Pre-built content templates
4. **A/B Testing**: Test different content variations
5. **Team Collaboration**: Multi-user content approval workflows
6. **AI Content Generation**: AI-powered content suggestions
7. **Advanced Analytics**: Detailed performance insights
8. **White-label Solutions**: Customizable branding

## Support

For technical support or feature requests, please contact the development team or create an issue in the project repository.

---

**Built with ❤️ for CreatorFlow - Making cross-platform content publishing simple and powerful.**
