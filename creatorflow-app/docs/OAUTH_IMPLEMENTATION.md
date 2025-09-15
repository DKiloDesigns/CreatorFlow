# OAuth Implementation Documentation

**Last Updated:** September 12, 2025  
**Status:** Complete and Functional  

## Overview

This document outlines the complete OAuth implementation for CreatorFlow, including all supported platforms and the specific TikTok PKCE implementation.

## Supported Platforms

| Platform | Status | OAuth Flow | Special Requirements |
|----------|--------|------------|---------------------|
| Instagram | ✅ Active | Authorization Code | Basic Display API |
| Twitter | ✅ Active | Authorization Code | API v2 |
| LinkedIn | ✅ Active | Authorization Code | v2 API |
| Facebook | ✅ Active | Authorization Code | Graph API |
| YouTube | ✅ Active | Authorization Code | Data API v3 |
| TikTok | ✅ Active | Authorization Code + PKCE | Open API v2 |
| Mastodon | ✅ Active | Authorization Code | OAuth 2.0 |

## API Endpoints

### Connection Initiation
```
POST /api/accounts/connect/[platform]
```

**Supported Platforms:** `instagram`, `twitter`, `linkedin`, `facebook`, `youtube`, `tiktok`, `mastodon`

**Response:**
```json
{
  "url": "https://platform.com/oauth/authorize?...",
  "platform": "tiktok",
  "platformName": "TikTok"
}
```

### OAuth Callback
```
GET /api/accounts/callback/[platform]
```

**Process:**
1. Validates authorization code
2. Exchanges code for access token
3. Fetches user profile information
4. Updates account status to "active"
5. Redirects to accounts page

## TikTok PKCE Implementation

TikTok requires PKCE (Proof Key for Code Exchange) for security. Here's the implementation:

### 1. Code Verifier Generation
```typescript
const codeVerifier = crypto.randomBytes(32).toString('base64url');
```

### 2. Code Challenge Creation
```typescript
const codeChallenge = crypto.createHash('sha256')
  .update(codeVerifier)
  .digest('base64url');
```

### 3. Authorization URL Parameters
```typescript
const params = new URLSearchParams({
  client_id: config.clientId,
  redirect_uri: config.redirectUri,
  response_type: 'code',
  scope: config.scopes.join(' '),
  state: state,
  code_challenge: codeChallenge,
  code_challenge_method: 'S256'
});
```

### 4. Token Exchange
```typescript
const tokenParams = new URLSearchParams({
  client_id: config.clientId,
  client_secret: config.clientSecret,
  code: code,
  grant_type: 'authorization_code',
  redirect_uri: config.redirectUri,
  code_verifier: codeVerifier // From stored metadata
});
```

## Environment Variables

### Required for TikTok
```env
TIKTOK_CLIENT_KEY=your_client_key
TIKTOK_CLIENT_SECRET=your_client_secret
```

### Required for All Platforms
```env
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your_secret
```

## Database Schema

### SocialAccount Model
```prisma
model SocialAccount {
  id                    String   @id @default(cuid())
  userId                String
  platform              String
  platformUserId        String?
  username              String?
  encryptedAccessToken  String?
  encryptedRefreshToken String?
  tokenExpiresAt        DateTime?
  scopes                String?
  status                String   @default("pending")
  metadata              Json?
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}
```

### Metadata Usage
- **TikTok**: Stores `codeVerifier` for PKCE token exchange
- **Other Platforms**: Stores platform-specific data as needed

## Error Handling

### Common Error Scenarios
1. **Invalid Platform**: Returns 400 with "Unsupported platform"
2. **Missing Credentials**: Returns 500 with "Missing platform configuration"
3. **OAuth Failure**: Redirects to accounts page with error parameter
4. **Token Exchange Failure**: Logs error and redirects with failure message

### Debugging
- Comprehensive console logging throughout OAuth flow
- Error details logged to server console
- User-friendly error messages in UI

## Security Considerations

### PKCE Implementation
- Code verifier: 32 random bytes, base64url encoded
- Code challenge: SHA256 hash of verifier, base64url encoded
- Method: S256 (SHA256)

### Token Storage
- Access tokens stored in database (encrypted in production)
- Refresh tokens stored when available
- Token expiration tracked and handled

### State Parameter
- Random UUID generated for each OAuth flow
- Stored in database for validation
- Prevents CSRF attacks

## Testing

### Manual Testing
1. Click platform circle in UI
2. Verify redirect to OAuth provider
3. Complete authorization flow
4. Verify account shows as "active"
5. Test disconnect functionality

### API Testing
```bash
# Test connection initiation
curl -X POST http://localhost:3001/api/accounts/connect/tiktok \
  -H "Content-Type: application/json"

# Test account refresh
curl -X POST http://localhost:3001/api/accounts/[accountId]/refresh \
  -H "Content-Type: application/json"
```

## Troubleshooting

### Common Issues
1. **"Unsupported platform"**: Check platform extraction logic
2. **"Missing platform configuration"**: Verify environment variables
3. **"code_challenge" error**: Ensure PKCE implementation is complete
4. **Account stuck in "pending"**: Check callback processing and user profile fetch

### Debug Steps
1. Check server logs for error details
2. Verify environment variables are loaded
3. Test API endpoints directly
4. Check database for account status
5. Verify OAuth provider configuration

## Future Enhancements

### Planned Improvements
1. **Token Refresh**: Automatic token refresh before expiration
2. **Error Recovery**: Better error recovery and retry logic
3. **Analytics**: OAuth flow analytics and monitoring
4. **Rate Limiting**: API rate limiting and throttling
5. **Audit Logging**: Comprehensive audit trail for OAuth flows

### Additional Platforms
1. **Pinterest**: Business API integration
2. **Snapchat**: Snap Kit integration
3. **Twitch**: Helix API integration
4. **Discord**: Bot API integration

## Support

For issues or questions regarding OAuth implementation:
1. Check this documentation first
2. Review server logs for error details
3. Test API endpoints manually
4. Verify environment configuration
5. Contact development team if needed

---

**Note:** This implementation follows OAuth 2.0 best practices and includes PKCE support for enhanced security. All platforms are fully functional and tested.
