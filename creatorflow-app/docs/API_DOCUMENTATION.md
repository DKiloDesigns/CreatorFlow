# CreatorFlow API Documentation

## Overview

The CreatorFlow API provides comprehensive endpoints for social media management, content creation, analytics, and team collaboration.

## Authentication

All API endpoints require authentication via session cookies or API keys.

### Session Authentication
Include session cookies in requests for web application access.

### API Key Authentication
Include the API key in the `x-api-key` header:
```
x-api-key: your-api-key-here
```

## Base URL

- **Development**: `http://localhost:3001/api`
- **Production**: `https://your-domain.com/api`

## Endpoints

### Authentication

#### `POST /api/auth/signup`
Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure-password"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### `POST /api/auth/forgot-password`
Request password reset.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

### Posts

#### `GET /api/posts`
Get user's posts with optional filtering.

**Query Parameters:**
- `status` (optional): Filter by post status (draft, scheduled, published)
- `platform` (optional): Filter by platform
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:**
```json
{
  "posts": [
    {
      "id": "post-id",
      "contentText": "Post content",
      "platforms": ["instagram", "twitter"],
      "status": "published",
      "publishedAt": "2025-01-15T10:30:00Z",
      "engagement": {
        "likes": 150,
        "comments": 25,
        "shares": 10
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

#### `POST /api/posts`
Create a new post.

**Request Body:**
```json
{
  "contentText": "Post content",
  "platforms": ["instagram", "twitter"],
  "scheduledAt": "2025-01-15T10:30:00Z",
  "hashtags": ["#socialmedia", "#content"],
  "mentions": ["@username"],
  "mediaUrls": ["https://example.com/image.jpg"]
}
```

#### `POST /api/posts/bulk-schedule`
Schedule multiple posts at once.

**Request Body:**
```json
{
  "posts": [
    {
      "content": "Post 1 content",
      "hashtags": ["#tag1"]
    },
    {
      "content": "Post 2 content",
      "hashtags": ["#tag2"]
    }
  ],
  "platforms": ["instagram", "twitter"],
  "startDate": "2025-01-15T10:00:00Z",
  "postingFrequency": "daily",
  "postingTime": "10:30"
}
```

### Analytics

#### `GET /api/analytics/overview`
Get analytics overview for the current user.

**Query Parameters:**
- `timeRange` (optional): Time range (7d, 30d, 90d, 1y)
- `platform` (optional): Filter by platform
- `mock` (optional): Use mock data for testing

**Response:**
```json
{
  "data": {
    "totalPosts": 45,
    "totalViews": 12500,
    "totalEngagements": 850,
    "avgEngagementRate": 6.8,
    "totalReach": 25000,
    "totalImpressions": 35000
  },
  "timestamp": "2025-01-15T10:30:00Z",
  "cached": false
}
```

#### `GET /api/analytics/advanced`
Get advanced analytics with detailed breakdowns.

**Query Parameters:**
- `timeRange` (optional): Time range (7d, 30d, 90d, 1y)
- `platform` (optional): Filter by platform

**Response:**
```json
{
  "totalPosts": 45,
  "totalEngagement": 850,
  "avgEngagementRate": 6.8,
  "totalReach": 25000,
  "totalImpressions": 35000,
  "platformBreakdown": [
    {
      "platform": "instagram",
      "posts": 20,
      "engagement": 400,
      "reach": 12000
    }
  ],
  "recentPerformance": [
    {
      "date": "2025-01-15",
      "posts": 2,
      "engagement": 45,
      "reach": 1200
    }
  ],
  "topPerformingPosts": [
    {
      "id": "post-id",
      "content": "Post content",
      "platform": "instagram",
      "engagement": 150,
      "reach": 5000
    }
  ]
}
```

### AI Tools

#### `POST /api/ai/generate-captions`
Generate AI-powered captions.

**Request Body:**
```json
{
  "content": "Product description",
  "platform": "instagram",
  "tone": "professional",
  "length": "medium"
}
```

**Response:**
```json
{
  "success": true,
  "captions": [
    {
      "text": "Generated caption text",
      "score": 85,
      "reasoning": "High engagement potential"
    }
  ]
}
```

#### `POST /api/ai/generate-hashtags`
Generate hashtag recommendations.

**Request Body:**
```json
{
  "content": "Post content",
  "platform": "instagram",
  "count": 10
}
```

#### `POST /api/ai/posting-times`
Get optimal posting time recommendations.

**Request Body:**
```json
{
  "platform": "instagram",
  "audience": "tech professionals",
  "timezone": "UTC"
}
```

### Templates

#### `GET /api/caption-templates`
Get user's content templates.

**Query Parameters:**
- `category` (optional): Filter by category
- `isFavorite` (optional): Filter by favorite status
- `tags` (optional): Filter by tags

#### `POST /api/caption-templates`
Create a new content template.

**Request Body:**
```json
{
  "name": "Template name",
  "content": "Template content",
  "category": "Marketing",
  "tags": ["social", "marketing"],
  "platforms": ["instagram", "twitter"],
  "hashtags": ["#social", "#marketing"],
  "mentions": ["@brand"],
  "isFavorite": false,
  "isPinned": false
}
```

### Teams

#### `GET /api/teams`
Get user's teams.

#### `POST /api/teams`
Create a new team.

**Request Body:**
```json
{
  "name": "Team name",
  "description": "Team description"
}
```

#### `POST /api/teams/{id}/invitations`
Invite user to team.

**Request Body:**
```json
{
  "email": "user@example.com",
  "role": "MEMBER"
}
```

### Health & Monitoring

#### `GET /api/health`
Get system health status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:30:00Z",
  "checks": {
    "database": true,
    "externalServices": true
  },
  "metrics": {
    "totalLogs": 1500,
    "totalMetrics": 500,
    "totalErrors": 5,
    "avgResponseTime": 245
  }
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Additional error details"
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Too Many Requests
- `500`: Internal Server Error

## Rate Limiting

API requests are rate limited to:
- **Authenticated users**: 100 requests per minute
- **API key users**: 1000 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248600
```

## Webhooks

### Stripe Webhooks

#### `POST /api/webhooks/stripe`
Handle Stripe webhook events for billing.

**Headers:**
```
stripe-signature: signature
```

## SDKs & Libraries

### JavaScript/TypeScript
```javascript
import { CreatorFlowAPI } from '@creatorflow/api';

const api = new CreatorFlowAPI({
  apiKey: 'your-api-key',
  baseURL: 'https://api.creatorflow.com'
});

// Get posts
const posts = await api.posts.list({
  status: 'published',
  platform: 'instagram'
});

// Create post
const post = await api.posts.create({
  contentText: 'Hello world!',
  platforms: ['instagram', 'twitter']
});
```

## Support

For API support:
- **Email**: api@creatorflow.com
- **Documentation**: https://docs.creatorflow.com
- **Status Page**: https://status.creatorflow.com 