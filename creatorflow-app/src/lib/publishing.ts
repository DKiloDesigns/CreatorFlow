// import { PrismaClient, Post, SocialAccount, PostStatus } from '@prisma/client'; // Adjust import path
import { PrismaClient, Post, SocialAccount, PostStatus } from '@prisma/client';
import { publishToTwitter } from './publishers/twitter'; // Placeholder import
import { publishToLinkedIn } from './publishers/linkedin'; // Placeholder import
import { publishToInstagram } from './publishers/instagram';
import { publishToTikTok } from './publishers/tiktok';
import { publishToYouTube } from './publishers/youtube';
import { publishToFacebook } from './publishers/facebook';
import { publishToPinterest } from './publishers/pinterest';
import { publishToReddit } from './publishers/reddit';
import { publishToTelegram } from './publishers/telegram';
import { publishToDiscord } from './publishers/discord';
import { publishToTwitch } from './publishers/twitch';
import { publishToMedium } from './publishers/medium';
import { publishToSubstack } from './publishers/substack';
import { publishToMastodon } from './publishers/mastodon';
import { publishToBluesky } from './publishers/bluesky';
import { publishToVimeo } from './publishers/vimeo';
import { publishToBehance } from './publishers/behance';
import { publishToDribbble } from './publishers/dribbble';
// ... other platform imports

const prisma = new PrismaClient();

// Define a type for the expected structure of fetched post data
// This helps ensure we fetch everything needed
type PostWithDetails = Post & {
    user: {
        socialAccounts: SocialAccount[];
    };
    mediaUrls?: string[];
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

// Define the structure for the overall publishing result
export interface PublishingResult {
    postId: string;
    results: PlatformResult[];
    overallSuccess: boolean;
    errors: string[];
}

/**
 * Publishes a post to all connected social media platforms.
 * 
 * This function:
 * 1. Fetches the post details from the database
 * 2. Gets all connected social accounts for the user
 * 3. Publishes to each platform based on the post's target platforms
 * 4. Updates the post status and stores results
 * 
 * @param postId The ID of the post to publish
 * @param userId The ID of the user publishing the post
 * @returns A promise resolving to a PublishingResult object
 */
export async function publishPost(postId: string, userId: string): Promise<PublishingResult> {
    // 1. Fetch the post with all necessary details
    const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
            user: {
                include: {
                    socialAccounts: true,
                },
            },
        },
    }) as PostWithDetails | null;

    if (!post) {
        throw new Error(`Post ${postId} not found`);
    }

    if (post.userId !== userId) {
        throw new Error('User not authorized to publish this post');
    }

    // 2. Get all connected social accounts for the user
    const socialAccounts = await prisma.socialAccount.findMany({
        where: {
            userId: userId,
            status: 'active', // Only active accounts
        },
    });

    if (socialAccounts.length === 0) {
        throw new Error('No connected social media accounts found');
    }

    // 3. Initialize results tracking
    const results: PlatformResult[] = [];
    const errors: string[] = [];

    // 4. Publish to each platform
    for (const account of socialAccounts) {
        // Route to the appropriate publisher based on platform
        let result: PlatformResult;

        switch (account.platform.toLowerCase()) {
            case 'twitter':
                result = await publishToTwitter(post, account);
                break;
            case 'linkedin':
                result = await publishToLinkedIn(post, account);
                break;
            case 'instagram':
                result = await publishToInstagram(post, account);
                break;
            case 'tiktok':
                result = await publishToTikTok(post, account);
                break;
            case 'youtube':
                result = await publishToYouTube(post, account);
                break;
            case 'facebook':
                result = await publishToFacebook(post, account);
                break;
            case 'pinterest':
                result = await publishToPinterest(post, account);
                break;
            case 'reddit':
                result = await publishToReddit(post, account);
                break;
            case 'telegram':
                result = await publishToTelegram(post, account);
                break;
            case 'threads':
                // Threads uses Instagram's API
                result = await publishToInstagram(post, account);
                break;
            case 'whatsapp':
                // WhatsApp Business API implementation would go here
                result = { platform: 'whatsapp', success: false, error: 'WhatsApp publishing not yet implemented' };
                break;
            case 'messenger':
                // Messenger uses Facebook's API
                result = await publishToFacebook(post, account);
                break;
            case 'wechat':
                // WeChat API implementation would go here
                result = { platform: 'wechat', success: false, error: 'WeChat publishing not yet implemented' };
                break;
            case 'snapchat':
                // Snapchat API implementation would go here
                result = { platform: 'snapchat', success: false, error: 'Snapchat publishing not yet implemented' };
                break;
            case 'gmb':
                // Google My Business API implementation would go here
                result = { platform: 'gmb', success: false, error: 'Google My Business publishing not yet implemented' };
                break;
            case 'discord':
                result = await publishToDiscord(post, account);
                break;
            case 'twitch':
                result = await publishToTwitch(post, account);
                break;
            case 'medium':
                result = await publishToMedium(post, account);
                break;
            case 'substack':
                result = await publishToSubstack(post, account);
                break;
            case 'mastodon':
                result = await publishToMastodon(post, account);
                break;
            case 'bluesky':
                result = await publishToBluesky(post, account);
                break;
            case 'vimeo':
                result = await publishToVimeo(post, account);
                break;
            case 'behance':
                result = await publishToBehance(post, account);
                break;
            case 'dribbble':
                result = await publishToDribbble(post, account);
                break;
            default:
                result = {
                    platform: account.platform,
                    success: false,
                    error: `Unsupported platform: ${account.platform}`,
                };
        }

        results.push(result);

        if (!result.success) {
            errors.push(`${account.platform}: ${result.error}`);
        }
    }

    // 5. Determine overall success
    const successfulPublishes = results.filter(r => r.success).length;
    const overallSuccess = successfulPublishes > 0;

    // 6. Update post status based on results
    const newStatus = overallSuccess ? PostStatus.PUBLISHED : PostStatus.FAILED;
    await prisma.post.update({
        where: { id: postId },
        data: {
            status: newStatus,
            publishedAt: overallSuccess ? new Date() : null,
        },
    });

    return {
        postId,
        results,
        overallSuccess,
        errors,
    };
}

/**
 * Schedules a post for future publication.
 * 
 * This function:
 * 1. Validates the scheduled time
 * 2. Updates the post status to SCHEDULED
 * 3. Sets the scheduledAt timestamp
 * 
 * @param postId The ID of the post to schedule
 * @param scheduledAt The date/time when the post should be published
 * @param userId The ID of the user scheduling the post
 * @returns A promise resolving to a boolean indicating success
 */
export async function schedulePost(postId: string, scheduledAt: Date, userId: string): Promise<boolean> {
    // Validate the post exists and belongs to the user
    const post = await prisma.post.findUnique({
        where: { id: postId },
    });

    if (!post) {
        throw new Error(`Post ${postId} not found`);
    }

    if (post.userId !== userId) {
        throw new Error('User not authorized to schedule this post');
    }

    // Validate scheduled time is in the future
    if (scheduledAt <= new Date()) {
        throw new Error('Scheduled time must be in the future');
    }

    // Update the post
    await prisma.post.update({
        where: { id: postId },
        data: {
            status: PostStatus.SCHEDULED,
            scheduledAt: scheduledAt,
        },
    });

    return true;
}

/**
 * Cancels a scheduled post.
 * 
 * @param postId The ID of the post to cancel
 * @param userId The ID of the user canceling the post
 * @returns A promise resolving to a boolean indicating success
 */
export async function cancelScheduledPost(postId: string, userId: string): Promise<boolean> {
    const post = await prisma.post.findUnique({
        where: { id: postId },
    });

    if (!post) {
        throw new Error(`Post ${postId} not found`);
    }

    if (post.userId !== userId) {
        throw new Error('User not authorized to cancel this post');
    }

    if (post.status !== PostStatus.SCHEDULED) {
        throw new Error('Post is not scheduled');
    }

    await prisma.post.update({
        where: { id: postId },
        data: {
            status: PostStatus.DRAFT,
            scheduledAt: null,
        },
    });

    return true;
} 