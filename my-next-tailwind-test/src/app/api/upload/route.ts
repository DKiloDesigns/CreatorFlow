import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const form = formidable({ multiples: false });

  return new Promise((resolve, reject) => {
    form.parse(req as any, async (err: any, fields: any, files: any) => {
      if (err) {
        return resolve(NextResponse.json({ error: 'Error parsing form data' }, { status: 400 }));
      }
      const file = files.file;
      if (!file) {
        return resolve(NextResponse.json({ error: 'No file uploaded' }, { status: 400 }));
      }
      try {
        const upload = await cloudinary.uploader.upload((file as any).filepath, {
          folder: 'posts',
        });
        return resolve(NextResponse.json({ url: upload.secure_url }));
      } catch (e) {
        return resolve(NextResponse.json({ error: 'Cloudinary upload failed' }, { status: 500 }));
      }
    });
  });
} 