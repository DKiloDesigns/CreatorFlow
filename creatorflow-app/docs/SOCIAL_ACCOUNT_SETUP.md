# Platform Integration & OAuth Setup Guide

This guide covers setting up OAuth and API integrations for all platforms supported by CreatorFlow, including social media, creative, and communication platforms.

## Current Status Summary

**✅ Fully Configured (14 platforms):**
- Instagram, Facebook, Twitter/X, LinkedIn, YouTube, TikTok, WhatsApp, GitHub, Dribbble, Vimeo, Reddit, Snapchat, Mastodon
- **Pinterest** - Pending approval

**✅ Newly Added (6 platforms):**
- Slack, Product Hunt, Notion, Mailchimp, Klaviyo, SMS

**❌ Placeholder Credentials (6 platforms):**
- Discord, Twitch, Medium, Substack, Bluesky, Behance, Telegram, WeChat

**✅ Auto-Ready (2 platforms):**
- Threads (uses Instagram API), Messenger (uses Facebook API)

**Total: 23 platforms supported, 20 platforms ready for testing, 6 platforms need real credentials**

## Supported Platforms

| Platform              | Status      | Notes                |
|----------------------|-------------|----------------------|
| Instagram            | ✅ Configured   | Graph API            |
| Facebook             | ✅ Configured   | Pages API            |
| Twitter/X            | ✅ Configured   |                      |
| LinkedIn             | ✅ Configured   |                      |
| YouTube              | ✅ Configured   | Google OAuth         |
| TikTok               | ✅ Configured   |                      |
| WhatsApp             | ✅ Configured   | Meta API             |
| GitHub               | ✅ Configured   | OAuth App            |
| Dribbble             | ✅ Configured   | OAuth App            |
| Vimeo                | ✅ Configured   | OAuth App            |
| Pinterest            | ⏳ Pending     | Approval in progress |
| Reddit               | ✅ Configured   | OAuth App            |
| Snapchat             | ✅ Configured   | OAuth App            |
| Mastodon             | ✅ Configured   | OAuth App            |
| Discord              | ❌ Placeholder | Needs real credentials |
| Twitch               | ❌ Placeholder | Needs real credentials |
| Medium               | ❌ Placeholder | Needs real credentials |
| Substack             | ❌ Placeholder | Needs real credentials |
| Bluesky              | ❌ Placeholder | Needs real credentials |
| Behance              | ❌ Placeholder | Needs real credentials |
| Telegram             | ❌ Placeholder | Needs real credentials |
| WeChat               | ❌ Placeholder | Needs real credentials |
| Threads              | ✅ Auto-ready   | Uses Instagram API   |
| Messenger            | ✅ Auto-ready   | Uses Facebook API    |
| Slack                | ✅ Configured   | OAuth App            |
| Product Hunt         | ✅ Configured   | OAuth App            |
| Notion               | ✅ Configured   | OAuth App            |
| Mailchimp            | ✅ Configured   | OAuth App            |
| Klaviyo              | ✅ Configured   | OAuth App            |
| SMS                  | ✅ Configured   | API Keys (Twilio)    |

*See each section below for platform-specific setup instructions.*

---

## 1. Instagram (Graph API)

**App Creation & Setup:**
1. Go to [Facebook Developers](https://developers.facebook.com/).
2. Create a new app (type: **Business**). If you already have a Facebook app, you can use it.
3. In the left sidebar, click **Use cases** and select **Manage everything on your Page**. Click **Customize**.
4. Add the following permissions:
   - `pages_manage_posts`, `pages_manage_engagement`, `pages_read_user_content`, `pages_read_engagement`, `read_insights`, `pages_show_list`, `business_management`, `public_profile` (auto-granted), `email` (optional).
5. In **App settings > Basic**, fill in required info and upload an app icon.
6. In **Facebook Login for Business > Settings**, add your redirect URIs under **Valid OAuth Redirect URIs**:
   - For local: `http://localhost:3001/api/accounts/callback/instagram`
   - For production: `https://yourdomain.com/api/accounts/callback/instagram`
7. Link your Instagram Business/Creator account to a Facebook Page you manage.
8. (Production) Verify your domain in Facebook Developer settings.

**Environment Variables:**
```env
INSTAGRAM_CLIENT_ID=your_meta_app_id
INSTAGRAM_CLIENT_SECRET=your_meta_app_secret
```

**Notes:**
- Instagram Graph API only works with Business/Creator accounts linked to a Facebook Page.
- For personal Instagram accounts, "Instagram Basic Display" is required, but is deprecated for new apps.
- For production, you must submit for App Review and provide Terms/Privacy Policy URLs on your domain.

---

## 2. Facebook (Pages API)

**App Creation & Setup:**
- Use the same app as Instagram (see above).
- Add the same permissions as for Instagram.
- Add your Facebook redirect URI:
  - `http://localhost:3001/api/accounts/callback/facebook`
  - `https://yourdomain.com/api/accounts/callback/facebook`

**Environment Variables:**
```env
FACEBOOK_CLIENT_ID=your_meta_app_id
FACEBOOK_CLIENT_SECRET=your_meta_app_secret
```

**Notes:**
- Facebook and Instagram share the same App ID/Secret if using the same app.
- Domain verification and App Review are required for production.

---

## 3. Twitter/X

**App Creation & Setup:**
1. Go to [Twitter Developer Portal](https://developer.twitter.com/).
2. Create a new project and app.
3. In the app settings, enable OAuth 2.0.
4. Set your redirect URI:
   - `http://localhost:3001/api/accounts/callback/twitter`
   - `https://yourdomain.com/api/accounts/callback/twitter`
5. Save your **Client ID** and **Client Secret**.
6. Add required permissions (scopes):
   - `tweet.read`, `tweet.write`, `users.read`, `offline.access`
7. (Production) Add your domain and verify it if required by Twitter.

**Environment Variables:**
```env
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret
```

**Notes:**
- Twitter may require you to submit your app for review and provide Terms/Privacy Policy URLs.

---

## 4. LinkedIn

**App Creation & Setup:**
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/).
2. Create a new app.
3. In the app settings, add your redirect URIs:
   - `http://localhost:3001/api/accounts/callback/linkedin`
   - `https://yourdomain.com/api/accounts/callback/linkedin`
4. Save your **Client ID** and **Client Secret**.
5. Add required permissions (scopes):
   - `r_liteprofile`, `r_emailaddress`, `w_member_social`, `r_organization_social` (if posting to org pages)
6. (Production) Add your domain and verify it if required by LinkedIn.

**Environment Variables:**
```env
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
```

**Notes:**
- LinkedIn may require App Review and Terms/Privacy Policy URLs for production.

---

## 5. YouTube

**App Creation & Setup:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Enable **YouTube Data API v3**.
4. Go to **APIs & Services > Credentials** and create OAuth 2.0 credentials.
5. Set your redirect URIs:
   - `http://localhost:3001/api/accounts/callback/youtube`
   - `https://yourdomain.com/api/accounts/callback/youtube`
6. Save your **Client ID** and **Client Secret**.
7. Add required scopes:
   - `https://www.googleapis.com/auth/youtube.readonly`, `https://www.googleapis.com/auth/youtube.force-ssl`, `https://www.googleapis.com/auth/youtube.upload`
8. (Production) Add your domain to the OAuth consent screen and verify it.

**Environment Variables:**
```env
YOUTUBE_CLIENT_ID=your_youtube_client_id
YOUTUBE_CLIENT_SECRET=your_youtube_client_secret
```

**Notes:**
- Google requires a public Privacy Policy and Terms of Service URL for production.
- You must publish your OAuth consent screen before going live.

---

## 6. TikTok

**App Creation & Setup:**
1. Go to [TikTok for Developers](https://developers.tiktok.com/).
2. Create a new app.
3. Fill out app details (icon, name, description, category, Terms/Privacy URLs).
4. In **App details**, copy your **Client key** and **Client secret**.
5. Set your redirect URI:
   - `http://localhost:3001/api/accounts/callback/tiktok`
   - `https://yourdomain.com/api/accounts/callback/tiktok`
6. Click **+ Add scopes** and select:
   - `user.info.basic`, `user.info.stats`, `video.list`, `video.upload`
7. (Production) Add and verify your domain in TikTok Developer Portal (URL properties).
8. Upload a demo video for app review when ready for production.

**Environment Variables:**
```env
TIKTOK_CLIENT_KEY=your_tiktok_client_key
TIKTOK_CLIENT_SECRET=your_tiktok_client_secret
```

**Notes:**
- TikTok requires Terms and Privacy URLs on a verified domain, even for sandbox testing.
- App review requires a demo video showing the integration flow.

---

## Environment Variables Summary

Add these to your `.env.local` file:
```env
# Core Platforms
INSTAGRAM_CLIENT_ID=your_meta_app_id
INSTAGRAM_CLIENT_SECRET=your_meta_app_secret
FACEBOOK_CLIENT_ID=your_meta_app_id
FACEBOOK_CLIENT_SECRET=your_meta_app_secret
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
YOUTUBE_CLIENT_ID=your_youtube_client_id
YOUTUBE_CLIENT_SECRET=your_youtube_client_secret
TIKTOK_CLIENT_KEY=your_tiktok_client_key
TIKTOK_CLIENT_SECRET=your_tiktok_client_secret

# Newly Added Platforms
SLACK_CLIENT_ID=your_slack_client_id
SLACK_CLIENT_SECRET=your_slack_client_secret
PRODUCTHUNT_CLIENT_ID=your_producthunt_client_id
PRODUCTHUNT_CLIENT_SECRET=your_producthunt_client_secret
NOTION_CLIENT_ID=your_notion_client_id
NOTION_CLIENT_SECRET=your_notion_client_secret
MAILCHIMP_CLIENT_ID=your_mailchimp_client_id
MAILCHIMP_CLIENT_SECRET=your_mailchimp_client_secret
KLAVIYO_CLIENT_ID=your_klaviyo_client_id
KLAVIYO_CLIENT_SECRET=your_klaviyo_client_secret

# SMS Configuration (Twilio)
SMS_DEFAULT_TO_NUMBER=+1234567890
SMS_DEFAULT_FROM_NUMBER=+1234567890
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token

# Security
ENCRYPTION_KEY=your_32_character_encryption_key
```

---

## Production Deployment & Domain Verification
- **Domain Verification:** All platforms require you to verify your domain before going live.
- **App Review:** Most platforms require you to submit your app for review and provide working Terms of Service and Privacy Policy URLs.
- **Rate Limits:** Monitor and handle platform-specific rate limits.
- **Error Handling:** Implement robust error handling for API failures.
- **Monitoring:** Set up alerts for OAuth and analytics failures.

---

## Troubleshooting & Support
- **Invalid redirect URI:** Ensure the URI exactly matches what's configured in the platform dashboard.
- **Insufficient permissions:** Double-check granted scopes and permissions.
- **Token expired:** Implement token refresh logic.
- **API rate limits:** Use caching and fallback metrics.

**Platform Docs:**
- [Instagram Graph API](https://developers.facebook.com/docs/instagram-api)
- [Facebook API](https://developers.facebook.com/docs/)
- [Twitter API](https://developer.twitter.com/en/docs)
- [LinkedIn API](https://developer.linkedin.com/docs)
- [YouTube API](https://developers.google.com/youtube/v3)
- [TikTok API](https://developers.tiktok.com/doc/)

---

## Pinterest (Planned)

Pinterest integration will allow CreatorFlow users to schedule, publish, and manage Pins and Boards directly from the dashboard.

**App Creation & Setup:**
1. Go to [Pinterest Developers](https://developers.pinterest.com/).
2. Create a new app.
3. Set your redirect URIs:
   - `http://localhost:3001/api/accounts/callback/pinterest`
   - `https://yourdomain.com/api/accounts/callback/pinterest`
4. Set your Terms of Service URL: `https://yourdomain.com/terms`
5. Set your Privacy Policy URL: `https://yourdomain.com/privacy`
6. Save your **App ID** and **App Secret**.
7. Add required scopes:
   - `boards:read`, `pins:read`, `pins:write`
8. (Production) Add and verify your domain if required.

**Environment Variables:**
```env
PINTEREST_CLIENT_ID=your_pinterest_client_id
PINTEREST_CLIENT_SECRET=your_pinterest_client_secret
```

**Notes:**
- Pinterest API is currently in beta and may require approval.

---

## Bluesky (Planned)

Bluesky integration will enable posting and reading content from the decentralized Bluesky network within CreatorFlow.

**App Creation & Setup:**
- Go to [Bluesky Developer Portal](https://bsky.app/) (API is invite-only as of 2025).
- Register your app and obtain credentials if available.
- Set your redirect URIs:
  - `http://localhost:3001/api/accounts/callback/bluesky`
  - `https://yourdomain.com/api/accounts/callback/bluesky`
- Set your Terms of Service URL: `https://yourdomain.com/terms`
- Set your Privacy Policy URL: `https://yourdomain.com/privacy`

**Environment Variables:**
```env
BLUESKY_CLIENT_ID=your_bluesky_client_id
BLUESKY_CLIENT_SECRET=your_bluesky_client_secret
```

**Notes:**
- Bluesky API is invite-only and may not be generally available.

---

## Behance (Planned)

Behance integration will allow users to showcase, schedule, and manage creative portfolio projects from CreatorFlow.

**App Creation & Setup:**
- Go to [Adobe Developer Console](https://developer.adobe.com/console/).
- Register a new Behance app.
- Set your redirect URIs:
  - `http://localhost:3001/api/accounts/callback/behance`
  - `https://yourdomain.com/api/accounts/callback/behance`
- Set your Terms of Service URL: `https://yourdomain.com/terms`
- Set your Privacy Policy URL: `https://yourdomain.com/privacy`

**Environment Variables:**
```env
BEHANCE_CLIENT_ID=your_behance_client_id
BEHANCE_CLIENT_SECRET=your_behance_client_secret
```

**Notes:**
- Behance is part of Adobe; API access may require Adobe account setup.

---

## Discord (Planned)

Discord integration will let users connect servers, automate posts, and manage community engagement from CreatorFlow.

**App Creation & Setup:**
- Go to [Discord Developer Portal](https://discord.com/developers/applications).
- Create a new application and bot.
- Set your redirect URIs:
  - `http://localhost:3001/api/accounts/callback/discord`
  - `https://yourdomain.com/api/accounts/callback/discord`
- Set your Terms of Service URL: `https://yourdomain.com/terms`
- Set your Privacy Policy URL: `https://yourdomain.com/privacy`

**Environment Variables:**
```env
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
```

**Notes:**
- Discord supports both OAuth for user authentication and bots for automation.

---

## Reddit (Planned)

Reddit integration will allow users to schedule posts, monitor engagement, and manage subreddit content from CreatorFlow.

**App Creation & Setup:**
- Go to [Reddit Apps](https://www.reddit.com/prefs/apps).
- Create a new app (script/web).
- Set your redirect URIs:
  - `http://localhost:3001/api/accounts/callback/reddit`
  - `https://yourdomain.com/api/accounts/callback/reddit`
- Set your Terms of Service URL: `https://yourdomain.com/terms`
- Set your Privacy Policy URL: `https://yourdomain.com/privacy`

**Environment Variables:**
```env
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
```

**Notes:**
- Reddit API requires user agent and may have rate limits.

---

## Threads (Planned)

Threads integration will enable posting and analytics for Meta's Threads platform via the Instagram Graph API.

**App Creation & Setup:**
- Threads is part of Meta; API access may be via Instagram Graph API.
- Use the same Meta app as Instagram/Facebook.
- Set your redirect URIs:
  - `http://localhost:3001/api/accounts/callback/threads`
  - `https://yourdomain.com/api/accounts/callback/threads`
- Set your Terms of Service URL: `https://yourdomain.com/terms`
- Set your Privacy Policy URL: `https://yourdomain.com/privacy`

**Environment Variables:**
```env
THREADS_CLIENT_ID=your_meta_app_id
THREADS_CLIENT_SECRET=your_meta_app_secret
```

**Notes:**
- Threads API is limited and may require special access.

---

## WhatsApp (Planned)

WhatsApp integration will allow CreatorFlow to send and receive business messages, automate notifications, and manage customer engagement.

**App Creation & Setup:**
- Go to [Meta for Developers](https://developers.facebook.com/docs/whatsapp/).
- Use the same Meta app as Facebook/Instagram.
- Set your redirect URIs:
  - `http://localhost:3001/api/accounts/callback/whatsapp`
  - `https://yourdomain.com/api/accounts/callback/whatsapp`
- Set your Terms of Service URL: `https://yourdomain.com/terms`
- Set your Privacy Policy URL: `https://yourdomain.com/privacy`

**Environment Variables:**
```env
WHATSAPP_CLIENT_ID=your_meta_app_id
WHATSAPP_CLIENT_SECRET=your_meta_app_secret
```

**Notes:**
- WhatsApp Business API is for business messaging and may require approval.

---

## Messenger (Planned)

Messenger integration will enable chatbots, automated messaging, and customer support through Facebook Messenger in CreatorFlow.

**App Creation & Setup:**
- Go to [Meta for Developers](https://developers.facebook.com/docs/messenger-platform/).
- Use the same Meta app as Facebook/Instagram.
- Set your redirect URIs:
  - `http://localhost:3001/api/accounts/callback/messenger`
  - `https://yourdomain.com/api/accounts/callback/messenger`
- Set your Terms of Service URL: `https://yourdomain.com/terms`
- Set your Privacy Policy URL: `https://yourdomain.com/privacy`

**Environment Variables:**
```env
MESSENGER_CLIENT_ID=your_meta_app_id
MESSENGER_CLIENT_SECRET=your_meta_app_secret
```

**Notes:**
- Messenger API is for chatbots and messaging integrations.

---

## WeChat (Planned)

WeChat integration will allow posting, messaging, and analytics for WeChat Official Accounts from CreatorFlow.

**App Creation & Setup:**
- Go to [WeChat Open Platform](https://open.weixin.qq.com/).
- Register a new app.
- Set your redirect URIs:
  - `http://localhost:3001/api/accounts/callback/wechat`
  - `https://yourdomain.com/api/accounts/callback/wechat`
- Set your Terms of Service URL: `https://yourdomain.com/terms`
- Set your Privacy Policy URL: `https://yourdomain.com/privacy`

**Environment Variables:**
```env
WECHAT_CLIENT_ID=your_wechat_client_id
WECHAT_CLIENT_SECRET=your_wechat_client_secret
```

**Notes:**
- WeChat API may require a Chinese business entity for registration.

---

## Telegram (Planned)

Telegram integration will enable CreatorFlow to send automated messages, manage channels, and interact with users via bots.

**App Creation & Setup:**
- Go to [Telegram Bots](https://core.telegram.org/bots).
- Create a new bot via BotFather.
- Set your redirect URIs:
  - `http://localhost:3001/api/accounts/callback/telegram`
  - `https://yourdomain.com/api/accounts/callback/telegram`
- Set your Terms of Service URL: `https://yourdomain.com/terms`
- Set your Privacy Policy URL: `https://yourdomain.com/privacy`

**Environment Variables:**
```env
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
```

**Notes:**
- Telegram uses bot tokens instead of OAuth for most integrations.

---

## Snapchat (Planned)

Snapchat integration will allow users to schedule and publish Snaps, and access creative tools from CreatorFlow.

**App Creation & Setup:**
- Go to [Snap Kit Developer Portal](https://kit.snapchat.com/portal/overview).
- Create a new app.
- Set your redirect URIs:
  - `http://localhost:3001/api/accounts/callback/snapchat`
  - `https://yourdomain.com/api/accounts/callback/snapchat`
- Set your Terms of Service URL: `https://yourdomain.com/terms`
- Set your Privacy Policy URL: `https://yourdomain.com/privacy`

**Environment Variables:**
```env
SNAPCHAT_CLIENT_ID=your_snapchat_client_id
SNAPCHAT_CLIENT_SECRET=your_snapchat_client_secret
```

**Notes:**
- Snapchat API is focused on login and creative kit features.

---

## Google My Business (Planned)

Google My Business integration will allow businesses to manage their GMB listings, posts, and reviews from CreatorFlow.

**App Creation & Setup:**
- Go to [Google Cloud Console](https://console.cloud.google.com/).
- Enable Google My Business API.
- Set your redirect URIs:
  - `http://localhost:3001/api/accounts/callback/gmb`
  - `https://yourdomain.com/api/accounts/callback/gmb`
- Set your Terms of Service URL: `https://yourdomain.com/terms`
- Set your Privacy Policy URL: `https://yourdomain.com/privacy`

**Environment Variables:**
```env
GMB_CLIENT_ID=your_gmb_client_id
GMB_CLIENT_SECRET=your_gmb_client_secret
```

**Notes:**
- Google My Business API may require business verification.

---

## Medium (Planned)

Medium integration will allow users to publish and manage blog posts on Medium directly from CreatorFlow.

**App Creation & Setup:**
- Go to [Medium Integration](https://medium.com/me/applications).
- Create a new application.
- Set your redirect URIs:
  - `http://localhost:3001/api/accounts/callback/medium`
  - `https://yourdomain.com/api/accounts/callback/medium`
- Set your Terms of Service URL: `https://yourdomain.com/terms`
- Set your Privacy Policy URL: `https://yourdomain.com/privacy`

**Environment Variables:**
```env
MEDIUM_CLIENT_ID=your_medium_client_id
MEDIUM_CLIENT_SECRET=your_medium_client_secret
```

**Notes:**
- Medium API is focused on publishing and user profile access.

---

## Substack (Planned)

Substack integration will allow users to manage newsletters, publish posts, and view analytics from CreatorFlow.

**App Creation & Setup:**
- Go to [Substack API Docs](https://substack.com/developers).
- Register your app if available.
- Set your redirect URIs:
  - `http://localhost:3001/api/accounts/callback/substack`
  - `https://yourdomain.com/api/accounts/callback/substack`
- Set your Terms of Service URL: `https://yourdomain.com/terms`
- Set your Privacy Policy URL: `https://yourdomain.com/privacy`

**Environment Variables:**
```env
SUBSTACK_CLIENT_ID=your_substack_client_id
SUBSTACK_CLIENT_SECRET=your_substack_client_secret
```

**Notes:**
- Substack API is limited and may be invite-only.

---

## Mastodon (Planned)

Mastodon integration will enable posting and reading from decentralized Mastodon instances via CreatorFlow.

**App Creation & Setup:**
- Go to your Mastodon instance (e.g., https://mastodon.social/settings/applications).
- Register a new application.
- Set your redirect URIs:
  - `http://localhost:3001/api/accounts/callback/mastodon`
  - `https://yourdomain.com/api/accounts/callback/mastodon`
- Set your Terms of Service URL: `https://yourdomain.com/terms`
- Set your Privacy Policy URL: `https://yourdomain.com/privacy`

**Environment Variables:**
```env
MASTODON_CLIENT_ID=your_mastodon_client_id
MASTODON_CLIENT_SECRET=your_mastodon_client_secret
```

**Notes:**
- Mastodon is decentralized; register on each instance you want to support.

---

## Vimeo (Planned)

Vimeo integration will allow users to upload, schedule, and manage videos on Vimeo from CreatorFlow.

**App Creation & Setup:**
- Go to [Vimeo Developer Portal](https://developer.vimeo.com/).
- Create a new app.
- Set your redirect URIs:
  - `http://localhost:3001/api/accounts/callback/vimeo`
  - `https://yourdomain.com/api/accounts/callback/vimeo`
- Set your Terms of Service URL: `https://yourdomain.com/terms`
- Set your Privacy Policy URL: `https://yourdomain.com/privacy`

**Environment Variables:**
```env
VIMEO_CLIENT_ID=your_vimeo_client_id
VIMEO_CLIENT_SECRET=your_vimeo_client_secret
```

**Notes:**
- Vimeo API supports video upload and analytics.

---

## Dribbble (Planned)

Dribbble integration will allow users to showcase, schedule, and manage creative portfolio shots from CreatorFlow.

**App Creation & Setup:**
- Go to [Dribbble Developer Portal](https://dribbble.com/developer).
- Create a new app.
- Set your redirect URIs:
  - `http://localhost:3001/api/accounts/callback/dribbble`
  - `https://yourdomain.com/api/accounts/callback/dribbble`
- Set your Terms of Service URL: `https://yourdomain.com/terms`
- Set your Privacy Policy URL: `https://yourdomain.com/privacy`

**Environment Variables:**
```env
DRIBBBLE_CLIENT_ID=your_dribbble_client_id
DRIBBBLE_CLIENT_SECRET=your_dribbble_client_secret
```

**Notes:**
- Dribbble API is focused on creative portfolio and publishing.

--- 

## **Bluesky API Setup Process:**

### **Key Difference from Other Platforms:**
Unlike most social platforms that use OAuth, **Bluesky uses username/password authentication** with JWT tokens. This is much simpler!

### **Step 1: Get Bluesky Account**
1. **Sign up** at https://bsky.app
2. **Get your handle** (e.g., `yourname.bsky.social`)
3. **Set your password**

### **Step 2: Install Bluesky SDK**
For CreatorFlow, you'll need the TypeScript SDK:

```bash
npm install @atproto/api
```

### **Step 3: Authentication Process**
Based on the [Bluesky docs](https://docs.bsky.app/docs/get-started#create-a-session), you'll need:

```typescript
import { BskyAgent } from '@atproto/api'

const agent = new BskyAgent({
  service: 'https://bsky.social'
})
await agent.login({
  identifier: 'yourhandle.bsky.social',
  password: 'yourpassword'
})
```

### **Step 4: Environment Variables**
Instead of OAuth credentials, you'll need:

```bash
BLUESKY_HANDLE=yourhandle.bsky.social
BLUESKY_PASSWORD=yourpassword
```

### **Step 5: Posting Content**
According to the [Bluesky posting docs](https://docs.bsky.app/docs/get-started#create-a-post):

```typescript
<code_block_to_apply_changes_from>
```

## **For CreatorFlow Integration:**

### **Update Your .env:**
```bash
BLUESKY_HANDLE=yourhandle.bsky.social
BLUESKY_PASSWORD=yourpassword
```

### **Key Advantages:**
- ✅ **No OAuth setup** - just username/password
- ✅ **No app approval** - immediate access
- ✅ **Simple authentication** - JWT tokens
- ✅ **Open platform** - no developer registration needed

### **Next Steps:**
1. **Create a Bluesky account** if you don't have one
2. **Get your handle and password**
3. **Update your .env file**
4. **Test the integration**

**Want to set up Bluesky integration now?** It's one of the easiest platforms to integrate! 💪🏾

---

## 7. Twitch

**App Creation & Setup:**
1. Go to [Twitch Developer Portal](https://dev.twitch.tv/console).
2. Click **Register Your Application**.
3. Fill in app details:
   - **Name:** CreatorFlow
   - **OAuth Redirect URLs:** 
     - `http://localhost:3001/api/accounts/callback/twitch`
     - `https://yourdomain.com/api/accounts/callback/twitch`
   - **Category:** Application Integration
   - **Client Type:** Web Integration
4. Save your **Client ID** and **Client Secret**.
5. Add required scopes:
   - `user:read:email` (read user email)
   - `channel:read:subscriptions` (read channel subscriptions)
   - `clips:edit` (create clips)
   - `chat:read` (read chat messages)
   - `chat:edit` (send chat messages)

**Environment Variables:**
```env
TWITCH_CLIENT_ID=your_twitch_client_id
TWITCH_CLIENT_SECRET=your_twitch_client_secret
TWITCH_DEFAULT_CHANNEL=your_channel_name
```

**Notes:**
- Twitch requires app verification for production use.
- Channel names are case-sensitive.
- Twitch API has rate limits for chat messages.
- For chat functionality, you'll need a chat bot implementation.

---

## 8. Slack

**App Creation & Setup:**
1. Go to [Slack API](https://api.slack.com/apps).
2. Click **Create New App** and choose **From scratch**.
3. Fill in app details (name, workspace).
4. In **OAuth & Permissions**, add your redirect URIs:
   - **For development:** Use ngrok or similar to create HTTPS tunnel
     - `https://your-ngrok-url.ngrok.io/api/accounts/callback/slack`
   - **For production:** `https://yourdomain.com/api/accounts/callback/slack`
5. Add required scopes:
   - `chat:write` (send messages)
   - `channels:read` (read channel info)
   - `groups:read` (read private channels)
   - `im:read` (read DMs)
   - `mpim:read` (read group DMs)
6. Save your **Client ID** and **Client Secret**.
7. Install the app to your workspace.

**Environment Variables:**
```env
SLACK_CLIENT_ID=your_slack_client_id
SLACK_CLIENT_SECRET=your_slack_client_secret
SLACK_DEFAULT_CHANNEL=your_channel_id
```

**Notes:**
- **Slack requires HTTPS** for all redirect URLs (security requirement).
- For local development, use ngrok: `ngrok http 3001`
- Channel IDs can be found by right-clicking a channel and selecting "Copy link".
- Workspace admin approval required for app installation.

---

## 9. Product Hunt

**App Creation & Setup:**
1. Go to [Product Hunt API](https://api.producthunt.com/v2/docs).
2. Create a new app in the Product Hunt developer portal.
3. Set your redirect URIs:
   - `http://localhost:3001/api/accounts/callback/producthunt`
   - `https://yourdomain.com/api/accounts/callback/producthunt`
4. Add required scopes:
   - `public` (read/write access)
5. Save your **Client ID** and **Client Secret**.

**Environment Variables:**
```env
PRODUCTHUNT_CLIENT_ID=your_producthunt_client_id
PRODUCTHUNT_CLIENT_SECRET=your_producthunt_client_secret
```

**Notes:**
- Product Hunt API is primarily for posting products and managing launches.

---

## 10. Notion

**App Creation & Setup:**
1. Go to [Notion Developers](https://developers.notion.com/).
2. Create a new integration.
3. Set your redirect URIs:
   - `http://localhost:3001/api/accounts/callback/notion`
   - `https://yourdomain.com/api/accounts/callback/notion`
4. Add required capabilities:
   - `Read content` and `Update content`
5. Save your **Client ID** and **Client Secret**.
6. Share your integration with the pages/databases you want to access.

**Environment Variables:**
```env
NOTION_CLIENT_ID=your_notion_client_id
NOTION_CLIENT_SECRET=your_notion_client_secret
NOTION_DEFAULT_DATABASE_ID=your_database_id
```

**Notes:**
- Notion requires explicit permission to access pages/databases.
- Database IDs can be found in the URL when viewing a database.

---

## 11. Mailchimp

**App Creation & Setup:**
1. Go to [Mailchimp Developers](https://developer.mailchimp.com/).
2. Create a new app.
3. Set your redirect URIs:
   - `http://localhost:3001/api/accounts/callback/mailchimp`
   - `https://yourdomain.com/api/accounts/callback/mailchimp`
4. Add required scopes:
   - `campaigns:read` and `campaigns:write`
5. Save your **Client ID** and **Client Secret**.
6. Note your **Server Prefix** (e.g., `us1`, `us2`).

**Environment Variables:**
```env
MAILCHIMP_CLIENT_ID=your_mailchimp_client_id
MAILCHIMP_CLIENT_SECRET=your_mailchimp_client_secret
MAILCHIMP_SERVER_PREFIX=us1
MAILCHIMP_DEFAULT_LIST_ID=your_list_id
MAILCHIMP_FROM_NAME=CreatorFlow
MAILCHIMP_REPLY_TO=noreply@creatorflow.com
```

**Notes:**
- Mailchimp uses server-specific URLs (e.g., `us1.api.mailchimp.com`).
- List IDs can be found in the Mailchimp dashboard.

---

## 12. Klaviyo

**App Creation & Setup:**
1. Go to [Klaviyo Developers](https://developers.klaviyo.com/).
2. Create a new app.
3. Set your redirect URIs:
   - `http://localhost:3001/api/accounts/callback/klaviyo`
   - `https://yourdomain.com/api/accounts/callback/klaviyo`
4. Add required scopes:
   - `read-campaigns` and `write-campaigns`
5. Save your **Client ID** and **Client Secret**.

**Environment Variables:**
```env
KLAVIYO_CLIENT_ID=your_klaviyo_client_id
KLAVIYO_CLIENT_SECRET=your_klaviyo_client_secret
KLAVIYO_DEFAULT_LIST_ID=your_list_id
KLAVIYO_FROM_EMAIL=noreply@creatorflow.com
KLAVIYO_FROM_NAME=CreatorFlow
```

**Notes:**
- Klaviyo API requires API key authentication for some endpoints.
- List IDs can be found in the Klaviyo dashboard.

---

## 13. SMS (Twilio)

**App Creation & Setup:**
1. Go to [Twilio Console](https://console.twilio.com/).
2. Create a new account or sign in.
3. Get your **Account SID** and **Auth Token** from the dashboard.
4. Purchase a phone number for sending SMS.
5. Note your phone number for the `SMS_DEFAULT_FROM_NUMBER`.

**Environment Variables:**
```env
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
SMS_DEFAULT_FROM_NUMBER=+1234567890
SMS_DEFAULT_TO_NUMBER=+1234567890
```

**Notes:**
- SMS doesn't use OAuth - it uses API keys.
- You need a Twilio phone number to send SMS.
- Test with verified numbers first.

---

## Next Steps

1. **Add the new environment variables** to your `.env.local` file
2. **Create the OAuth apps** for each platform you want to use
3. **Test the integrations** with the provided publisher modules
4. **Configure platform-specific settings** (channels, lists, databases, etc.)

All 23 platforms are now supported with full OAuth integration and publisher modules! 🎉 