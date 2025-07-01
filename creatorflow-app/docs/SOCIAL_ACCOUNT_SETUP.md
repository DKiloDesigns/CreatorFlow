# Social Account OAuth Setup Guide

This guide covers setting up OAuth applications for each social platform to enable real-time analytics integration in CreatorFlow.

## Overview

Real-time analytics require OAuth access tokens from each social platform. This guide provides step-by-step instructions for creating OAuth applications and configuring them in CreatorFlow.

## Platform-Specific Setup

### 1. Instagram

**OAuth App Setup:**
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or use existing app
3. Add Instagram Basic Display product
4. Configure OAuth redirect URI: `https://yourdomain.com/api/auth/callback/instagram`
5. Get App ID and App Secret

**Required Permissions:**
- `user_profile` - Basic profile info
- `user_media` - Access to user's media
- `instagram_basic` - Basic Instagram data

**API Endpoints Used:**
- `https://graph.instagram.com/me` - User profile
- `https://graph.instagram.com/me/media` - User media

### 2. Twitter/X

**OAuth App Setup:**
1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new app
3. Enable OAuth 2.0
4. Set redirect URI: `https://yourdomain.com/api/auth/callback/twitter`
5. Get Client ID and Client Secret

**Required Permissions:**
- `tweet.read` - Read tweets
- `users.read` - Read user profiles
- `offline.access` - Refresh tokens

**API Endpoints Used:**
- `https://api.twitter.com/2/users/me` - User profile with metrics

### 3. LinkedIn

**OAuth App Setup:**
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create a new app
3. Configure OAuth 2.0 settings
4. Set redirect URI: `https://yourdomain.com/api/auth/callback/linkedin`
5. Get Client ID and Client Secret

**Required Permissions:**
- `r_liteprofile` - Basic profile
- `r_organization_social` - Organization posts (if applicable)

**API Endpoints Used:**
- `https://api.linkedin.com/v2/me` - User profile

### 4. Facebook

**OAuth App Setup:**
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Configure OAuth redirect URI: `https://yourdomain.com/api/auth/callback/facebook`
5. Get App ID and App Secret

**Required Permissions:**
- `pages_read_engagement` - Read page insights
- `pages_show_list` - List user's pages
- `pages_manage_posts` - Manage page posts

**API Endpoints Used:**
- `https://graph.facebook.com/me` - User profile
- `https://graph.facebook.com/me/accounts` - User's pages
- `https://graph.facebook.com/v18.0/{page-id}/insights` - Page insights

### 5. YouTube

**OAuth App Setup:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable YouTube Data API v3
4. Create OAuth 2.0 credentials
5. Set redirect URI: `https://yourdomain.com/api/auth/callback/youtube`
6. Get Client ID and Client Secret

**Required Permissions:**
- `https://www.googleapis.com/auth/youtube.readonly` - Read YouTube data
- `https://www.googleapis.com/auth/youtube.force-ssl` - Force SSL

**API Endpoints Used:**
- `https://www.googleapis.com/youtube/v3/channels` - Channel statistics

### 6. TikTok

**OAuth App Setup:**
1. Go to [TikTok for Developers](https://developers.tiktok.com/)
2. Create a new app
3. Configure OAuth settings
4. Set redirect URI: `https://yourdomain.com/api/auth/callback/tiktok`
5. Get Client Key and Client Secret

**Required Permissions:**
- `user.info.basic` - Basic user info
- `user.info.stats` - User statistics

**API Endpoints Used:**
- `https://open.tiktokapis.com/v2/user/info/` - User profile

## Environment Variables

Add these to your `.env.local` file:

```env
# Instagram
INSTAGRAM_CLIENT_ID=your_instagram_client_id
INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret

# Twitter
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret

# LinkedIn
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# Facebook
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret

# YouTube
YOUTUBE_CLIENT_ID=your_youtube_client_id
YOUTUBE_CLIENT_SECRET=your_youtube_client_secret

# TikTok
TIKTOK_CLIENT_KEY=your_tiktok_client_key
TIKTOK_CLIENT_SECRET=your_tiktok_client_secret

# Encryption key for tokens
ENCRYPTION_KEY=your_32_character_encryption_key
```

## Testing OAuth Integration

### 1. Test Connection Flow

1. Navigate to `/dashboard/accounts`
2. Click "Connect" for any platform
3. Complete OAuth flow
4. Verify account appears as "Connected"

### 2. Test Real-time Analytics

1. Ensure you have connected accounts
2. Navigate to `/dashboard/analytics`
3. Check that real-time metrics are loading
4. Verify data accuracy against platform dashboards

### 3. API Testing

Test the real-time analytics endpoint:

```bash
# With session auth
curl -H "Cookie: next-auth.session-token=your_session_token" \
  http://localhost:3001/api/analytics/real-time

# With API key
curl -H "x-api-key: your_api_key" \
  http://localhost:3001/api/analytics/real-time
```

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI"**
   - Ensure redirect URI exactly matches what's configured in the OAuth app
   - Check for trailing slashes or protocol mismatches

2. **"Insufficient permissions"**
   - Verify all required permissions are granted during OAuth flow
   - Check platform-specific permission requirements

3. **"Token expired"**
   - Implement token refresh logic
   - Check token expiry times in database

4. **"API rate limits"**
   - Implement rate limiting and caching
   - Use fallback metrics when APIs are unavailable

### Debug Mode

Enable debug logging by setting:

```env
DEBUG_OAUTH=true
DEBUG_ANALYTICS=true
```

This will log detailed OAuth and analytics API calls for troubleshooting.

## Security Considerations

1. **Token Encryption**: All access tokens are encrypted before storage
2. **HTTPS Only**: OAuth callbacks must use HTTPS in production
3. **Token Refresh**: Implement automatic token refresh for long-lived sessions
4. **Scope Limitation**: Request only necessary permissions
5. **Regular Audits**: Periodically review and revoke unused tokens

## Production Deployment

1. **Domain Verification**: Verify your domain with each platform
2. **App Review**: Some platforms require app review for production use
3. **Rate Limits**: Monitor and handle platform-specific rate limits
4. **Error Handling**: Implement robust error handling for API failures
5. **Monitoring**: Set up alerts for OAuth and analytics failures

## Support

For platform-specific issues:
- [Instagram API Documentation](https://developers.facebook.com/docs/instagram-basic-display-api)
- [Twitter API Documentation](https://developer.twitter.com/en/docs)
- [LinkedIn API Documentation](https://developer.linkedin.com/docs)
- [Facebook API Documentation](https://developers.facebook.com/docs/)
- [YouTube API Documentation](https://developers.google.com/youtube/v3)
- [TikTok API Documentation](https://developers.tiktok.com/doc/) 