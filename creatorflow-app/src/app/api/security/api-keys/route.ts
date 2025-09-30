import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { APIKeyManager, CreateAPIKeyRequest } from '@/lib/security/api-keys';
import { requireAPIKey } from '@/lib/security/api-keys';
import { z } from 'zod';

const createKeySchema = z.object({
  name: z.string().min(1).max(100),
  permissions: z.array(z.string()).min(1),
  rateLimit: z.object({
    requests: z.number().int().min(1).max(10000),
    windowMs: z.number().int().min(60000).max(86400000), // 1 minute to 24 hours
  }).optional(),
  expiresAt: z.string().datetime().optional(),
});

export async function GET(req: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user's API keys
    const keys = await APIKeyManager.getUserKeys(session.user.id);
    
    // Remove sensitive data
    const sanitizedKeys = keys.map(key => ({
      id: key.id,
      name: key.name,
      permissions: key.permissions,
      rateLimit: key.rateLimit,
      expiresAt: key.expiresAt,
      lastUsedAt: key.lastUsedAt,
      createdAt: key.createdAt,
      isActive: key.isActive,
    }));

    return NextResponse.json({ keys: sanitizedKeys });
  } catch (error) {
    console.error('Failed to get API keys:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve API keys' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = createKeySchema.parse(body);

    // Create API key
    const createRequest: CreateAPIKeyRequest = {
      name: validatedData.name,
      permissions: validatedData.permissions,
      rateLimit: validatedData.rateLimit,
      expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : undefined,
      createdBy: session.user.id,
    };

    const { key, apiKey } = await APIKeyManager.createKey(createRequest);

    // Return the key (only time it's returned in full)
    return NextResponse.json({
      key,
      apiKey: {
        id: apiKey.id,
        name: apiKey.name,
        permissions: apiKey.permissions,
        rateLimit: apiKey.rateLimit,
        expiresAt: apiKey.expiresAt,
        createdAt: apiKey.createdAt,
        isActive: apiKey.isActive,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          issues: error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    console.error('Failed to create API key:', error);
    return NextResponse.json(
      { error: 'Failed to create API key' },
      { status: 500 }
    );
  }
}
