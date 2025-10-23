import { NextRequest, NextResponse } from 'next/server';
import { uploadCover } from '../../../../lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('avatar') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Upload to Cloudinary
    const avatarUrl = await uploadCover(file, `artist_${Date.now()}`);
    
    return NextResponse.json({
      success: true,
      avatarUrl
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload avatar' },
      { status: 500 }
    );
  }
}
