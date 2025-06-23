// Import from the generated Prisma client
import { Post, SocialAccount, PrismaClient } from '@prisma/client';
import { decrypt, encrypt } from '@/lib/crypto'; // Import crypto utils
import { TwitterApi, EUploadMimeType, SendTweetV2Params, TweetV2PostTweetResult, InlineErrorV2 } from 'twitter-api-v2'; // Import the library
// Consider using a library like twitter-api-v2 for easier interaction
// import { TwitterApi } from 'twitter-api-v2';
import { prisma } from '@/lib/prisma';
import { PlatformResult } from '../publishing';

const prismaClient = new PrismaClient(); // For updating tokens

// Ensure required environment variables are set for Twitter API interaction
if (!process.env.TWITTER_CLIENT_ID || !process.env.TWITTER_CLIENT_SECRET) {
    console.error('FATAL: TWITTER_CLIENT_ID or TWITTER_CLIENT_SECRET environment variables are missing.');
    // Consider throwing an error in production
}

// Define the expected return type for publisher functions
type PublishResult = PlatformResult;

// Add these types at the top of the file after the imports
interface TwitterError {
    message: string;
    code?: string;
    details?: string;
}

interface TwitterApiError {
    message: string;
    code?: string;
}

interface TwitterTweetResult {
    data: {
        id: string;
        text: string;
    };
    errors?: TwitterApiError[];
}

// Update TwitterTweetContent to match SendTweetV2Params
interface TwitterTweetContent {
    text: string;
    media?: {
        media_ids: string[];
    };
}

// --- Helper: Get Authenticated Twitter Client --- 
// Handles decryption, refresh logic, and returns an authenticated V2 client
async function getTwitterApiClient(account: SocialAccount): Promise<{ client: TwitterApi | null; error?: string }> {
    if (!account.encryptedAccessToken || !account.encryptedRefreshToken) {
        // Assuming OAuth 2.0 PKCE flow which provides both access & refresh tokens
        return { client: null, error: 'Missing encrypted access or refresh token' };
    }

    // 1. Decrypt Tokens
    const accessToken = decrypt(account.encryptedAccessToken);
    const refreshToken = decrypt(account.encryptedRefreshToken);

    if (!accessToken || !refreshToken) {
        return { client: null, error: 'Failed to decrypt access or refresh token' };
    }

    // 2. Initialize Client & Attempt Refresh if needed
    const client = new TwitterApi({ 
        clientId: process.env.TWITTER_CLIENT_ID!,
        clientSecret: process.env.TWITTER_CLIENT_SECRET!,
    });

    try {
        console.log(`[Twitter Publisher] Initializing client for account ${account.id}. Attempting refresh...`);
        const { 
            client: refreshedClient, 
            accessToken: newAccessToken, 
            refreshToken: newRefreshToken 
        } = await client.refreshOAuth2Token(refreshToken);
        console.log(`[Twitter Publisher] Token refresh successful for account ${account.id}.`);

        // 3. Update stored tokens in DB if they changed
        // Note: twitter-api-v2 handles expiry internally with the refreshed client
        if (newAccessToken !== accessToken || newRefreshToken !== refreshToken) {
            console.log(`[Twitter Publisher] Tokens changed after refresh for account ${account.id}. Updating DB...`);
            const encryptedNewAccess = encrypt(newAccessToken);
            const encryptedNewRefresh = newRefreshToken ? encrypt(newRefreshToken) : null; // Store new refresh token if provided

            if (encryptedNewAccess && encryptedNewRefresh) {
                try {
                    await prismaClient.socialAccount.update({
                        where: { id: account.id },
                        data: {
                            encryptedAccessToken: encryptedNewAccess,
                            encryptedRefreshToken: encryptedNewRefresh,
                            // tokenExpiresAt might not be needed if relying on library refresh, 
                            // but useful for manual checks or other flows.
                            // We don't get expiry from refreshOAuth2Token directly here.
                            status: 'active',
                        },
                    });
                    console.log(`[Twitter Publisher] Updated tokens in DB for account ${account.id}.`);
                } catch (dbError) {
                    console.error(`[Twitter Publisher] Failed to update refreshed token in DB for account ${account.id}:`, dbError);
                    // Proceed with the refreshed client, but log the DB error
                }
            } else {
                 console.error(`[Twitter Publisher] Failed to encrypt refreshed tokens for account ${account.id}. Cannot update DB.`);
                 // Decide if this should prevent publishing
                 // return { client: null, error: 'Failed to encrypt refreshed tokens.' };
            }
        }

        return { client: refreshedClient }; // Return the client ready for V2 API calls

    } catch (error: unknown) {
        const twitterError = error as TwitterError;
        console.error(`[Twitter Publisher] Failed to refresh token or initialize client for account ${account.id}:`, twitterError);
        // If refresh fails, mark account as needing re-auth
        if (twitterError.message?.includes('invalid_grant') || twitterError.message?.includes('invalid_request')) {
            try {
                await prismaClient.socialAccount.update({
                    where: { id: account.id },
                    data: { status: 'needs_reauth' }
                });
                console.log(`[Twitter Publisher] Marked account ${account.id} as needs_reauth due to refresh failure.`);
            } catch (dbError) {
                console.error('Failed to update account status:', dbError);
            }
            return { client: null, error: 'Failed to refresh token. Account needs re-authentication.' };
        } else {
            return { client: null, error: `Twitter client initialization/refresh error: ${twitterError.message}` };
        }
    }
}

// Helper to determine MIME type (example)
function getMimeType(url: string): EUploadMimeType | undefined {
    const extension = url.split('.').pop()?.toLowerCase();
    if (extension === 'jpg' || extension === 'jpeg') return EUploadMimeType.Jpeg;
    if (extension === 'png') return EUploadMimeType.Png;
    if (extension === 'gif') return EUploadMimeType.Gif;
    if (extension === 'webp') return EUploadMimeType.Webp;
    if (extension === 'mp4') return EUploadMimeType.Mp4;
    // Add other types as needed (e.g., EUploadMimeType.Mov)
    return undefined;
}

/**
 * Publishes a post to Twitter (X).
 * 
 * TODO: Implement actual Twitter API interaction.
 * - Requires handling OAuth 1.0a or OAuth 2.0 (PKCE for user context) token handling.
 * - Twitter API v2 is recommended.
 * - Handle text posting and media uploads (requires separate media upload step first).
 * 
 * @param post The post data from Prisma.
 * @param account The user's Twitter social account data (including encrypted tokens).
 * @returns A promise resolving to a PublishResult object.
 */
export async function publishToTwitter(
    post: Post,
    account: SocialAccount
): Promise<PublishResult> {
    // Remove debug logging
    const { client: apiClient, error: authError } = await getTwitterApiClient(account);

    if (authError || !apiClient) {
        return { platform: 'twitter', success: false, error: authError || 'Authentication failed' };
    }

    // --- Media Upload --- 
    const mediaIds: string[] = [];
    if (post.mediaUrls && post.mediaUrls.length > 0) {
        // Twitter API v2 allows attaching up to 4 images, 1 GIF, or 1 video per tweet.
        const mediaToUpload = post.mediaUrls.slice(0, 4); // Limit for safety, adjust based on type check

        for (const mediaUrl of mediaToUpload) {
            try {
                // 1. Fetch media from source URL
                const mediaResponse = await fetch(mediaUrl);
                if (!mediaResponse.ok) {
                    continue;
                }
                const mediaBuffer = Buffer.from(await mediaResponse.arrayBuffer());
                const mimeType = getMimeType(mediaUrl);
                if (!mimeType) {
                    continue;
                }
                // 2. Upload using the library
                const mediaId = await apiClient.v1.uploadMedia(mediaBuffer, { mimeType });
                mediaIds.push(mediaId);
            } catch (mediaError) {
                // Skip failed media
                continue;
            }
        }
    }

    // --- Post the Tweet ---
    try {
        let tweetResult;
        if (mediaIds.length > 0) {
            let mediaTuple: [string] | [string, string] | [string, string, string] | [string, string, string, string] | undefined = undefined;
            if (mediaIds.length === 1) mediaTuple = [mediaIds[0]];
            else if (mediaIds.length === 2) mediaTuple = [mediaIds[0], mediaIds[1]];
            else if (mediaIds.length === 3) mediaTuple = [mediaIds[0], mediaIds[1], mediaIds[2]];
            else if (mediaIds.length === 4) mediaTuple = [mediaIds[0], mediaIds[1], mediaIds[2], mediaIds[3]];
            tweetResult = await apiClient.v2.tweet({
                text: post.contentText || '',
                ...(mediaTuple && { media: { media_ids: mediaTuple } })
            });
        } else {
            tweetResult = await apiClient.v2.tweet({
                text: post.contentText || ''
            });
        }
        if (tweetResult && tweetResult.data && tweetResult.data.id) {
            return {
                platform: 'twitter',
                success: true,
                platformPostId: tweetResult.data.id,
            };
        } else {
            return {
                platform: 'twitter',
                success: false,
                error: 'Tweet posted but no tweet ID returned.'
            };
        }
    } catch (error: any) {
        return {
            platform: 'twitter',
            success: false,
            error: error?.message || 'Failed to post tweet.'
        };
    }
}

async function postTweet(client: TwitterApi, content: SendTweetV2Params): Promise<PublishResult> {
  try {
    const tweet = await client.v2.tweet(content);
    return {
      platform: 'twitter',
      success: true,
      platformPostId: tweet.data.id
    };
  } catch (error) {
    const twitterError = error as TwitterError;
    console.error('[Twitter Publisher] Error posting tweet:', twitterError);
    return {
      platform: 'twitter',
      success: false,
      error: twitterError.message || 'Unknown error occurred'
    };
  }
} 