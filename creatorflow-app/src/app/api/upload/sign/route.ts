import { NextResponse, NextRequest } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getSession } from "@/auth";
import { requireApiKey } from '@/lib/apiKeyAuth';

// Configure Cloudinary (ensure env vars are set)
if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error("Error: Cloudinary environment variables are not set (check NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET).");
}

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true, // Use https
});

export async function POST(request: NextRequest) {
    // Check for API key first
    const apiKeyHeader = request.headers.get('x-api-key');
    if (apiKeyHeader) {
        const auth = await requireApiKey(request);
        if ('user' in auth) {
            const body = await request.json();
            const { paramsToSign } = body;
            if (!paramsToSign) {
                return NextResponse.json({ error: 'Parameters to sign are required' }, { status: 400 });
            }
            try {
                const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET! );
                return NextResponse.json({ signature, apiKey: process.env.CLOUDINARY_API_KEY });
            } catch (error) {
                console.error('Error generating Cloudinary signature:', error);
                return NextResponse.json({ error: 'Failed to generate upload signature' }, { status: 500 });
            }
        } else {
            return NextResponse.json(auth.body, { status: auth.status });
        }
    }
    // Fallback to session auth
    const session = await getSession(request);
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { paramsToSign } = body;

    if (!paramsToSign) {
        return NextResponse.json({ error: 'Parameters to sign are required' }, { status: 400 });
    }

    try {
        // Generate the signature using the Cloudinary SDK
        const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET! );
        
        // Return the signature and the API key (needed for client-side upload)
        return NextResponse.json({ 
            signature: signature, 
            apiKey: process.env.CLOUDINARY_API_KEY 
            // Timestamp is usually generated client-side when making the upload request,
            // but can be included here if generated server-side using paramsToSign['timestamp']
        });

    } catch (error) {
        console.error('Error generating Cloudinary signature:', error);
        return NextResponse.json({ error: 'Failed to generate upload signature' }, { status: 500 });
    }
} 