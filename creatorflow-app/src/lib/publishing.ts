// import { PrismaClient, Post, SocialAccount, PostStatus } from '@prisma/client'; // Adjust import path
import { PrismaClient, Post, SocialAccount, PostStatus } from '@prisma/client';
// import { publishToTwitter } from './publishers/twitter'; // Placeholder import
// import { publishToLinkedIn } from './publishers/linkedin'; // Placeholder import
// ... other platform imports

const prisma = new PrismaClient();

// Define a type for the expected structure of fetched post data
// This helps ensure we fetch everything needed
type PostWithDetails = Post & {
    user: {
        socialAccounts: SocialAccount[];
    };
};

// Add these types at the top of the file after the imports
export interface PlatformResult {
    platform: string;
    success: boolean;
    error?: string;
    platformPostId?: string;
}

export interface PlatformError extends Error {
    code?: string | number;
    details?: unknown;
}

/**
 * Orchestrates the publishing of a single post to its selected platforms.
 * Fetches necessary data, calls platform-specific publishers, and updates post status.
 * 
 * @param postId The ID of the post to publish.
 */
export async function publishPost(postId: string): Promise<void> {
    console.log(`[Publishing Service] Attempting to publish post ID: ${postId}`);

    let post: PostWithDetails | null = null;

    try {
        // 1. Fetch Post and related User/SocialAccount data
        post = await prisma.post.findUnique({
            where: { id: postId },
            include: {
                user: {
                    include: {
                        socialAccounts: true, // Get all connected accounts for the user
                    },
                },
            },
        });

        if (!post) {
            console.error(`[Publishing Service] Post not found: ${postId}`);
            // No post to update status for, just return
            return;
        }

        // Ensure the post is still meant to be published (e.g., not deleted or manually changed)
        // The cron job already set it to PUBLISHING, which is our entry point here.
        if (post.status !== PostStatus.PUBLISHING) {
            console.warn(`[Publishing Service] Post ${postId} is no longer in PUBLISHING state (current: ${post.status}). Skipping.`);
            return;
        }

        console.log(`[Publishing Service] Publishing post ${postId} for platforms: ${post.platforms.join(', ')}`);

        // 2. Iterate through target platforms and call specific publishers
        const platformResults: PlatformResult[] = [];
        let overallSuccess = true;

        for (const platform of post.platforms) {
            const targetAccount = post.user.socialAccounts.find(acc => acc.platform === platform && acc.status === 'active');

            if (!targetAccount) {
                console.error(`[Publishing Service] No active social account found for user ${post.userId} and platform ${platform}. Skipping platform.`);
                platformResults.push({ platform, success: false, error: 'No active account found for this platform.' });
                overallSuccess = false; // Mark overall failure if any platform fails
                continue;
            }

            console.log(`[Publishing Service]   -> Publishing to ${platform} via account ${targetAccount.id}`);
            let platformSuccess = false;
            let platformError: string | undefined = undefined;
            let platformPostId: string | undefined = undefined; // Store the ID returned by the platform API

            try {
                // --- Call Platform-Specific Publisher --- 
                // Replace with actual calls based on the platform string
                // These functions should handle API calls, token refresh (using encrypted tokens from targetAccount), etc.
                // They should return an object like { success: boolean, error?: string, platformPostId?: string }
                if (platform === 'twitter') {
                    // const result = await publishToTwitter(post, targetAccount);
                    // platformSuccess = result.success;
                    // platformError = result.error;
                    // platformPostId = result.platformPostId;
                    console.log(`      [Placeholder] Would publish to Twitter now.`);
                    platformSuccess = Math.random() > 0.1; // Simulate 90% success
                    if (!platformSuccess) platformError = 'Simulated Twitter API error.';
                    else platformPostId = `tw_${Date.now()}`;

                } else if (platform === 'linkedin') {
                    // const result = await publishToLinkedIn(post, targetAccount);
                    // platformSuccess = result.success;
                    // platformError = result.error;
                    // platformPostId = result.platformPostId;
                    console.log(`      [Placeholder] Would publish to LinkedIn now.`);
                    platformSuccess = Math.random() > 0.15; // Simulate 85% success
                    if (!platformSuccess) platformError = 'Simulated LinkedIn API error.';
                    else platformPostId = `li_${Date.now()}`;
                    
                } else {
                    console.warn(`[Publishing Service] No publisher implemented for platform: ${platform}`);
                    platformSuccess = false;
                    platformError = `Unsupported platform: ${platform}`;
                }
                // --- End Platform-Specific Call --- 

                platformResults.push({ platform, success: platformSuccess, error: platformError, platformPostId });
                if (!platformSuccess) {
                    overallSuccess = false;
                    console.error(`[Publishing Service]   -> Failed to publish to ${platform}: ${platformError || 'Unknown error'}`);
                }

            } catch (error: unknown) {
                const platformError = error as PlatformError;
                console.error(`[Publishing Service]   -> Unexpected error publishing to ${platform}:`, platformError);
                platformResults.push({ 
                    platform, 
                    success: false, 
                    error: platformError.message || 'Unexpected error during platform publishing.' 
                });
                overallSuccess = false;
            }
        }

        // 3. Update Post Status based on results
        const finalStatus = overallSuccess ? PostStatus.PUBLISHED : PostStatus.FAILED;
        const finalErrorMessage = !overallSuccess
            ? platformResults.filter(r => !r.success).map(r => `${r.platform}: ${r.error || 'Failed'}`).join('; ')
            : null;

        // Store platform-specific IDs
        const platformPostIds = platformResults
            .filter(r => r.success && r.platformPostId)
            .reduce((acc, r) => ({ ...acc, [r.platform]: r.platformPostId }), {});

        await prisma.post.update({
            where: { id: postId },
            data: {
                status: finalStatus,
                publishedAt: overallSuccess ? new Date() : null,
                errorMessage: finalErrorMessage,
                platformPostIds: platformPostIds // Store the returned IDs as JSON
            },
        });

        console.log(`[Publishing Service] Post ${postId} finished processing. Final status: ${finalStatus}`);

    } catch (error: unknown) {
        const platformError = error as PlatformError;
        console.error(`[Publishing Service] Critical error processing post ${postId}:`, platformError);
        // If we have the post object, try to mark it as FAILED
        if (post && post.status === PostStatus.PUBLISHING) { // Only update if it was in PUBLISHING state
            try {
                await prisma.post.update({
                    where: { id: postId },
                    data: {
                        status: PostStatus.FAILED,
                        errorMessage: `Critical error during processing: ${platformError.message || 'Unknown error'}`,
                    },
                });
                console.error(`[Publishing Service] Marked post ${postId} as FAILED due to critical error.`);
            } catch (updateError) {
                console.error(`[Publishing Service] Failed to update post ${postId} status to FAILED after critical error:`, updateError);
            }
        }
    } finally {
         // Ensure Prisma Client is disconnected
        // await prisma.$disconnect(); // Consider if needed
    }
} 