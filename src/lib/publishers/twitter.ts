import { TwitterApi, EUploadMimeType, SendTweetV2Params } from 'twitter-api-v2';
import { decrypt } from '@/lib/crypto';
import { _prisma } from '@/lib/prisma';
import type { _TweetV2PostTweetResult, _InlineErrorV2 } from 'twitter-api-v2';

// ... existing code ...

type _TwitterTweetResult = {
  // ... existing type definition ...
};

type _TwitterTweetContent = {
  // ... existing type definition ...
};

// ... existing code ...

const _postTweet = async () => {
  // ... existing code ...
};

// ... existing code ... 