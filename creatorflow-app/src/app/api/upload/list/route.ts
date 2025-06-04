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

export async function GET(req: NextRequest) {
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
  // List assets (optionally filter by user folder if you use per-user folders)
  try {
    // Example: list up to 100 images in the user's folder (if using per-user folders)
    // const folder = `users/${userId}`;
    // const result = await cloudinary.api.resources({ type: 'upload', prefix: folder, max_results: 100 });
    const result = await cloudinary.api.resources({ type: 'upload', max_results: 100 });
    const assets = result.resources.map((r: any) => ({
      public_id: r.public_id,
      url: r.secure_url,
      created_at: r.created_at,
      bytes: r.bytes,
      format: r.format,
      width: r.width,
      height: r.height,
      folder: r.folder,
    }));
    return NextResponse.json(assets);
  } catch (error) {
    console.error('Cloudinary list error:', error);
    return NextResponse.json({ error: 'Failed to list assets' }, { status: 500 });
  }
} 