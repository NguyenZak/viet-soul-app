import { NextRequest, NextResponse } from 'next/server';
import { uploadCover } from '../../../../lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('cover') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Upload to Cloudinary
    const coverUrl = await uploadCover(file, `album_${Date.now()}`);
    
    return NextResponse.json({
      success: true,
      coverUrl
    });
  } catch (error) {
    console.error('Cover upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload cover' },
      { status: 500 }
    );
  }
}
