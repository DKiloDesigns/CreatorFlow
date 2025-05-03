// import { Post, SocialAccount } from '@prisma/client'; // Adjust import path
import { Post, SocialAccount, PrismaClient } from '@/generated/prisma'; // Corrected import path
import { decrypt, encrypt } from '@/lib/crypto'; // Import crypto utils
import { TwitterApi, EUploadMimeType } from 'twitter-api-v2'; // Import the library
// Consider using a library like twitter-api-v2 for easier interaction
// import { TwitterApi } from 'twitter-api-v2';

const prisma = new PrismaClient(); // For updating tokens

// Ensure required environment variables are set for Twitter API interaction
if (!process.env.TWITTER_CLIENT_ID || !process.env.TWITTER_CLIENT_SECRET) {
    console.error('FATAL: TWITTER_CLIENT_ID or TWITTER_CLIENT_SECRET environment variables are missing.');
    // Consider throwing an error in production
}

// Define the expected return type for publisher functions
interface PublishResult {
    success: boolean;
    error?: string;
    platformPostId?: string; // The ID of the tweet created on the platform
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
                    await prisma.socialAccount.update({
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

    } catch (error: any) {
        console.error(`[Twitter Publisher] Failed to refresh token or initialize client for account ${account.id}:`, error);
        // If refresh fails, mark account as needing re-auth
        if (error.message?.includes('invalid_grant') || error.message?.includes('invalid_request')) {
            try {
                await prisma.socialAccount.update({
                    where: { id: account.id },
                    data: { status: 'needs_reauth' }
                });
                console.log(`[Twitter Publisher] Marked account ${account.id} as needs_reauth due to refresh failure.`);
            } catch (dbError) { /* Log DB error */ }
            return { client: null, error: 'Failed to refresh token. Account needs re-authentication.' };
        } else {
            return { client: null, error: `Twitter client initialization/refresh error: ${error.message}` };
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
    console.log(`[Twitter Publisher] Publishing post ${post.id} for user ${account.userId} to account ${account.username}`);

    const { client: apiClient, error: authError } = await getTwitterApiClient(account);

    if (authError || !apiClient) {
        console.error(`[Twitter Publisher] Authentication failed for account ${account.id}: ${authError}`);
        return { success: false, error: authError || 'Authentication failed' };
    }

    // --- Media Upload --- 
    const mediaIds: string[] = [];
    if (post.mediaUrls && post.mediaUrls.length > 0) {
        console.log(`[Twitter Publisher] Processing ${post.mediaUrls.length} media items...`);
        // Twitter API v2 allows attaching up to 4 images, 1 GIF, or 1 video per tweet.
        const mediaToUpload = post.mediaUrls.slice(0, 4); // Limit for safety, adjust based on type check

        for (const mediaUrl of mediaToUpload) {
            try {
                console.log(`[Twitter Publisher]   Uploading media from ${mediaUrl}...`);
                
                // 1. Fetch media from source URL
                const mediaResponse = await fetch(mediaUrl);
                if (!mediaResponse.ok) {
                    throw new Error(`Failed to fetch media (${mediaResponse.status}): ${mediaResponse.statusText}`);
                }
                const mediaBuffer = Buffer.from(await mediaResponse.arrayBuffer());
                const mimeType = getMimeType(mediaUrl);
                if (!mimeType) {
                     console.warn(`[Twitter Publisher]     Unsupported media type for URL: ${mediaUrl}. Skipping.`);
                     continue;
                }
                
                // 2. Upload using the library
                // Uses { media_category: 'tweet_image' } or 'tweet_video' etc. implicitly
                console.log(`[Twitter Publisher]     Uploading buffer with mime type: ${mimeType}`);
                const mediaId = await apiClient.v1.uploadMedia(mediaBuffer, { mimeType });
                mediaIds.push(mediaId);
                console.log(`[Twitter Publisher]     -> Uploaded media, ID: ${mediaId}`);

            } catch (mediaError: any) {
                console.error(`[Twitter Publisher] Failed to upload media from ${mediaUrl}:`, mediaError);
                // Decide if one media failure should stop the whole post
                return { success: false, error: `Failed to upload media: ${mediaError.message}` };
            }
        }
        console.log(`[Twitter Publisher] Finished processing media. IDs: ${mediaIds.join(', ')}`);
    }

    // --- Post Tweet --- 
    try {
        const tweetContent: { text: string; media?: { media_ids: string[] } } = { 
            text: post.contentText || '' 
        };
        if (mediaIds.length > 0) {
            tweetContent.media = { media_ids: mediaIds };
        }

        console.log('[Twitter Publisher] Posting tweet...', JSON.stringify(tweetContent));

        const result = await apiClient.v2.tweet(tweetContent);
        
        if (result.errors) {
            console.error('[Twitter Publisher] API Error posting tweet:', result.errors);
            throw new Error(`Twitter API Error: ${result.errors.map(e => e.message).join('; ')}`);
        }
        
        const platformPostId = result.data.id;
        console.log(`[Twitter Publisher] Successfully posted tweet. Platform ID: ${platformPostId}`);

        return {
            success: true,
            platformPostId: platformPostId,
        };

    } catch (error: any) {
        console.error(`[Twitter Publisher] Failed to post tweet for post ${post.id}:`, error);
        return {
            success: false,
            error: error.message || 'Unknown error posting tweet',
        };
    }
} 