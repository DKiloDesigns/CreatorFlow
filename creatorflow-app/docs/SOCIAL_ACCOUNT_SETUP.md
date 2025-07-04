# Platform Integration & OAuth Setup Guide

This guide covers setting up OAuth and API integrations for all platforms supported by CreatorFlow, including social media, creative, and communication platforms.

## Supported Platforms

| Platform              | Status      | Notes                |
|----------------------|-------------|----------------------|
| Instagram            | Supported   | Graph API            |
| Facebook             | Supported   | Pages API            |
| Twitter/X            | Supported   |                      |
| LinkedIn             | Supported   |                      |
| YouTube              | Supported   |                      |
| TikTok               | Supported   |                      |
| Pinterest            | Planned     | API in beta          |
| Bluesky              | Planned     | Invite-only API      |
| Behance              | Planned     | Adobe API            |
| Discord              | Planned     | Bot & OAuth          |
| Reddit               | Planned     | API registration     |
| Threads              | Planned     | Meta/Instagram API   |
| WhatsApp             | Planned     | Meta API             |
| Messenger            | Planned     | Meta API             |
| WeChat               | Planned     |                      |
| Telegram             | Planned     |                      |
| Snapchat             | Planned     |                      |
| Google My Business   | Planned     |                      |
| Medium               | Planned     |                      |
| Substack             | Planned     |                      |
| Mastodon             | Planned     |                      |
| Vimeo                | Planned     |                      |
| Dribbble             | Planned     |                      |

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