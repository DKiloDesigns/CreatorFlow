import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    
    if (!imageFile) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    // Validate file type
    if (!imageFile.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Invalid file type. Please upload an image.' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (imageFile.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Please upload an image smaller than 5MB.' }, { status: 400 });
    }

    // Convert file to base64 for storage
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = `data:${imageFile.type};base64,${buffer.toString('base64')}`;

    // Update user profile with new image
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: base64Image }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Profile image updated successfully' 
    });

  } catch (error) {
    console.error('Profile image upload error:', error);
    return NextResponse.json({ 
      error: 'Failed to upload profile image' 
    }, { status: 500 });
  }
} 