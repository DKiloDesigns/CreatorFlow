import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getSession } from '@/auth';
import { requireApiKey } from '@/lib/apiKeyAuth';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function DELETE(req: NextRequest) {
  // Auth: API key or session
  const apiKeyHeader = req.headers.get('x-api-key');
  let userId;
  if (apiKeyHeader) {
    const auth = await requireApiKey(req);
    if ('user' in auth) userId = auth.user.id;
    else return auth;
  } else {
    const session = await getSession(req);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    userId = session.user.id;
  }
  const { public_id } = await req.json();
  if (!public_id) return NextResponse.json({ error: 'public_id is required' }, { status: 400 });
  try {
    // Optionally: check if asset belongs to user by folder or metadata
    await cloudinary.uploader.destroy(public_id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return NextResponse.json({ error: 'Failed to delete asset' }, { status: 500 });
  }
} 