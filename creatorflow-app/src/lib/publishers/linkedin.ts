import { PrismaClient, Post, SocialAccount } from '@/generated/prisma';
import { decrypt, encrypt } from '@/lib/crypto'; // Import crypto utils

const prisma = new PrismaClient(); // For updating tokens

// Define the expected return type for publisher functions
interface PublishResult {
    success: boolean;
    error?: string;
    platformPostId?: string; // The ID of the post created on the platform (URN for LinkedIn)
}

// --- Helper: Get Authenticated LinkedIn Client (Placeholder) ---
async function getLinkedInApiClient(account: SocialAccount): Promise<{ accessToken: string | null; error?: string }> {
    if (!account.encryptedAccessToken) {
        return { accessToken: null, error: 'Missing encrypted access token' };
    }

    // 1. Decrypt Tokens
    const accessToken = decrypt(account.encryptedAccessToken);
    const refreshToken = account.encryptedRefreshToken ? decrypt(account.encryptedRefreshToken) : null;

    if (!accessToken) {
        return { accessToken: null, error: 'Failed to decrypt access token' };
    }

    // 2. Check Expiry & Refresh (LinkedIn tokens typically last 60 days, refresh tokens 1 year)
    const isExpired = account.tokenExpiresAt ? new Date(account.tokenExpiresAt) < new Date() : false;
    let currentAccessToken = accessToken;

    if (isExpired) {
        console.log(`[LinkedIn Publisher] Token for account ${account.id} expired. Attempting refresh...`);
        if (!refreshToken) {
            return { accessToken: null, error: 'Token expired, but no refresh token available.' };
        }

        // --- Call LinkedIn API to refresh token --- 
        const clientId = process.env.LINKEDIN_CLIENT_ID;
        const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            console.error('[LinkedIn Publisher] Missing LINKEDIN_CLIENT_ID or LINKEDIN_CLIENT_SECRET environment variables.');
            return { accessToken: null, error: 'Server configuration error: Missing LinkedIn credentials.' };
        }

        try {
            console.log("[LinkedIn Publisher]   Attempting token refresh API call...");
            const tokenUrl = 'https://www.linkedin.com/oauth/v2/accessToken';
            const params = new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                client_id: clientId,
                client_secret: clientSecret,
            });

            const response = await fetch(tokenUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params.toString(),
            });

            const refreshData = await response.json();

            if (!response.ok) {
                 console.error(`[LinkedIn Publisher] Token refresh API error (${response.status}):`, refreshData);
                 throw new Error(refreshData.error_description || refreshData.error || 'Failed to refresh token via API');
            }
            
            console.log('[LinkedIn Publisher]   Token refresh API call successful.');
            // Structure based on LinkedIn docs:
            // { access_token: '...', expires_in: 5184000, refresh_token: '...', refresh_token_expires_in: ..., scope: '... } 
            const refreshResult = { 
                success: true,
                access_token: refreshData.access_token,
                expires_in: refreshData.expires_in, 
                refresh_token: refreshData.refresh_token, // May or may not be returned
                refresh_token_expires_in: refreshData.refresh_token_expires_in // May or may not be returned
            };
            // End of actual API call

            currentAccessToken = refreshResult.access_token;
            const newExpiry = new Date(Date.now() + (refreshResult.expires_in * 1000));
            // TODO: Handle refresh_token_expires_in if needed
            
            // --- Update SocialAccount in DB --- 
            const encryptedNewAccess = encrypt(refreshResult.access_token);
            // Use the new refresh token if provided, otherwise keep the old one
            const encryptedNewRefresh = refreshResult.refresh_token ? encrypt(refreshResult.refresh_token) : account.encryptedRefreshToken;

            if (encryptedNewAccess && encryptedNewRefresh) {
                try {
                    await prisma.socialAccount.update({
                        where: { id: account.id },
                        data: {
                            encryptedAccessToken: encryptedNewAccess,
                            encryptedRefreshToken: encryptedNewRefresh,
                            tokenExpiresAt: newExpiry,
                            status: 'active',
                        },
                    });
                    console.log(`[LinkedIn Publisher] Token for account ${account.id} refreshed and updated in DB.`);
                } catch (dbError) {
                    console.error(`[LinkedIn Publisher] Failed to update refreshed token in DB for account ${account.id}:`, dbError);
                    // Proceed with the refreshed token, but log the error
                }
            } else {
                console.error(`[LinkedIn Publisher] Failed to encrypt refreshed tokens for account ${account.id}. Cannot update DB.`);
                // return { accessToken: null, error: 'Failed to encrypt refreshed tokens.' };
            }

        } catch (refreshError: any) {
             // Refresh failed (Network error or API error handled above)
             console.error('[LinkedIn Publisher] Token refresh failed:', refreshError);
             try {
                 await prisma.socialAccount.update({
                     where: { id: account.id },
                     data: { status: 'needs_reauth' }
                 });
             } catch (dbError) { /* Log DB error */ }
            return { accessToken: null, error: `Failed to refresh expired LinkedIn token: ${refreshError.message}` };
        }
    }
    
    console.log(`[LinkedIn Publisher] Using access token (potentially refreshed) for account ${account.id}`);
    return { accessToken: currentAccessToken };
}

// --- Main Publish Function ---
export async function publishToLinkedIn(
    post: Post,
    account: SocialAccount
): Promise<PublishResult> {
    console.log(`[LinkedIn Publisher] Publishing post ${post.id} for user ${account.userId} to account ${account.platformUserId}`);

    const { accessToken, error: authError } = await getLinkedInApiClient(account);

    if (authError || !accessToken) {
        console.error(`[LinkedIn Publisher] Authentication failed for account ${account.id}: ${authError}`);
        return { success: false, error: authError || 'Authentication failed' };
    }

    const authorUrn = `urn:li:person:${account.platformUserId}`; // Needed for API calls
    let mediaUrn: string | null = null;

    // --- Media Upload (if necessary) --- 
    // LinkedIn requires registering media uploads first, then posting with the URN.
    if (post.mediaUrls && post.mediaUrls.length > 0) {
        // Note: LinkedIn post API usually handles one image/video at a time.
        // We'll just process the first media URL for this example.
        const mediaUrl = post.mediaUrls[0];
        console.log(`[LinkedIn Publisher] Processing media item: ${mediaUrl}`);
        try {
            // --- Implement actual LinkedIn media upload --- 
            
            // 1. Fetch Media from Cloudinary
            console.log("   [LinkedIn Publisher] Fetching media from Cloudinary...");
            const mediaResponse = await fetch(mediaUrl);
            if (!mediaResponse.ok) {
                 throw new Error(`Failed to fetch media from ${mediaUrl} (${mediaResponse.status}): ${mediaResponse.statusText}`);
            }
            const mediaBuffer = Buffer.from(await mediaResponse.arrayBuffer());
            const mediaContentType = mediaResponse.headers.get('content-type') || 'application/octet-stream';
            console.log(`   [LinkedIn Publisher] Fetched ${mediaBuffer.length} bytes, type: ${mediaContentType}`);

            // Determine LinkedIn recipe based on content type (basic example)
            let recipe = 'urn:li:digitalmediaRecipe:feedshare-image'; // Default to image
            if (mediaContentType.startsWith('video/')) {
                recipe = 'urn:li:digitalmediaRecipe:feedshare-video';
            }
            // Add more recipe types if needed (e.g., documents)

            // 2. Register Upload: POST to /v2/assets?action=registerUpload
             console.log(`   [LinkedIn Publisher] Registering upload with recipe: ${recipe}...`);
            const registerUploadBody = {
                registerUploadRequest: {
                    owner: authorUrn,
                    recipes: [recipe],
                    serviceRelationships: [{
                         relationshipType: "OWNER", 
                         identifier: "urn:li:userGeneratedContent" 
                    }],
                    // Optionally add fileSizeBytes: mediaBuffer.length
                }
            };
            const registerResponse = await fetch('https://api.linkedin.com/v2/assets?action=registerUpload', {
                 method: 'POST',
                 headers: {
                     'Authorization': `Bearer ${accessToken}`,
                     'Content-Type': 'application/json',
                     'X-Restli-Protocol-Version': '2.0.0'
                 },
                 body: JSON.stringify(registerUploadBody)
            });
            const registerData = await registerResponse.json();

            if (!registerResponse.ok || !registerData.value?.uploadMechanism?.['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest']?.uploadUrl || !registerData.value?.asset) {
                 console.error("   [LinkedIn Publisher] Failed to register upload:", registerData);
                 throw new Error(registerData.message || 'Failed to register media upload with LinkedIn API');
            }

            const uploadUrl = registerData.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
            const registeredAssetUrn = registerData.value.asset;
            console.log(`   [LinkedIn Publisher] Upload registration successful. Asset URN: ${registeredAssetUrn}, Upload URL: ${uploadUrl}`);

            // 3. Upload Media: PUT to uploadUrl
             console.log(`   [LinkedIn Publisher] Uploading media data to LinkedIn...`);
            const uploadResponse = await fetch(uploadUrl, {
                method: 'PUT',
                headers: {
                    // IMPORTANT: LinkedIn upload URLs often expect NO Auth header, but DO require correct Content-Type
                    // 'Authorization': `Bearer ${accessToken}`, // Usually NOT needed/wanted for the direct upload PUT
                    'Content-Type': mediaContentType,
                    // Potentially needed for videos: 'Content-Length': mediaBuffer.length.toString()
                },
                body: mediaBuffer
            });

            if (!uploadResponse.ok) {
                 // LinkedIn PUT upload often returns 201 on success, check response details
                 console.error(`   [LinkedIn Publisher] Media upload failed (${uploadResponse.status}):`, await uploadResponse.text());
                 throw new Error(`Media upload PUT request failed with status ${uploadResponse.status}`); 
            }
            
            console.log(`   [LinkedIn Publisher] Media uploaded successfully via PUT request (${uploadResponse.status}).`);
            mediaUrn = registeredAssetUrn; // Use the URN obtained from registration

            // Note: For videos, LinkedIn requires polling the asset URN GET /v2/assets/{assetURN} until processing is complete.
            // This is complex and not implemented here for brevity.
            if (recipe === 'urn:li:digitalmediaRecipe:feedshare-video') {
                 console.warn("   [LinkedIn Publisher] Video uploaded, but status polling is not implemented. Post might fail if video isn't processed yet.");
            }

        } catch (mediaError: any) {
            console.error(`[LinkedIn Publisher] Failed to process or upload media from ${mediaUrl}:`, mediaError);
            return { success: false, error: `Failed to upload media: ${mediaError.message}` };
        }
    }

    // --- Create Post --- 
    try {
        const postBody: any = {
            author: authorUrn,
            lifecycleState: "PUBLISHED",
            specificContent: {
                "com.linkedin.ugc.ShareContent": {
                    shareCommentary: {
                        text: post.contentText || ''
                    },
                    shareMediaCategory: mediaUrn ? "IMAGE" : "NONE" // Adjust based on media type (IMAGE, ARTICLE, VIDEO etc.)
                }
            },
            visibility: { 
                "com.linkedin.ugc.MemberNetworkVisibility": "CONNECTIONS" // Or PUBLIC, etc.
            }
        };

        if (mediaUrn) {
            postBody.specificContent["com.linkedin.ugc.ShareContent"].media = [
                { status: "READY", media: mediaUrn }
            ];
        }

        console.log('[LinkedIn Publisher] Posting content...', JSON.stringify(postBody));

        // --- Replace with actual API call --- 
        const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'X-Restli-Protocol-Version': '2.0.0' // Required header
            },
            body: JSON.stringify(postBody)
        });
        
         // // Simulate API call
         // await new Promise(resolve => setTimeout(resolve, 200));
         // const response = { 
         //     ok: Math.random() > 0.1, 
         //     status: 201,
         //     headers: new Headers({ 'x-restli-id': `urn:li:share:${Date.now()}` }),
         //     json: async () => ({ id: `urn:li:share:${Date.now()}` }), // id might be in header or body
         //     text: async () => 'Simulated API Error' 
         // }; // Placeholder

        if (!response.ok) {
            // Attempt to parse error response from LinkedIn
            let errorDetails = 'Unknown API Error';
            try {
                const errorData = await response.json();
                errorDetails = errorData.message || JSON.stringify(errorData);
            } catch (parseError) {
                errorDetails = await response.text(); // Fallback to raw text
            }
            console.error(`[LinkedIn Publisher] API Error (${response.status}): ${errorDetails}`);
            throw new Error(`LinkedIn API Error (${response.status}): ${errorDetails}`);
        }

        // LinkedIn usually returns the post ID (URN) in the x-restli-id header for UGC posts
        let platformPostId = response.headers.get('x-restli-id'); 
        if (!platformPostId) {
             console.warn('[LinkedIn Publisher] Could not find post URN in x-restli-id header. Trying body...');
             // Fallback to checking body if needed, structure might vary
             // Note: LinkedIn API might return 201 Created with an empty body but the ID in the header.
             try {
                 const resultData = await response.json();
                 platformPostId = resultData.id || resultData.value?.id; // Check common structures
             } catch(e) {
                 // Ignore error if body is empty or not JSON, rely on header check failure
             }
        }
        
        if (!platformPostId) {
             throw new Error('Failed to retrieve post URN from LinkedIn API response.');
        }

        console.log(`[LinkedIn Publisher] Successfully published post ${post.id}. Platform ID: ${platformPostId}`);
        
        return {
            success: true,
            platformPostId: platformPostId,
        };

    } catch (error: any) {
        console.error(`[LinkedIn Publisher] Failed to publish post ${post.id}:`, error);
        return {
            success: false,
            error: error.message || 'Unknown LinkedIn API error',
        };
    }
} 