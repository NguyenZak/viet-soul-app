import { NextRequest, NextResponse } from 'next/server';
import { getLocalAlbums, addLocalAlbum } from '../../../lib/albums-storage';

export async function GET() {
  try {
    const localAlbums = await getLocalAlbums();
    return NextResponse.json(localAlbums);
  } catch (error) {
    console.error('Error fetching albums:', error);
    return NextResponse.json(
      { error: 'Failed to fetch albums' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Create new album with local ID
    const newAlbum = {
      id: Date.now(), // Simple ID generation
      title: body.title,
      artist: body.artist,
      release_year: body.release_year || new Date().getFullYear(),
      cover_url: body.cover_url || '/uploads/albums/default.jpg',
      track_count: "0"
    };
    
    // Add to local storage
    await addLocalAlbum(newAlbum);
    
    return NextResponse.json(newAlbum);
  } catch (error) {
    console.error('Error creating album:', error);
    return NextResponse.json(
      { error: 'Failed to create album' },
      { status: 500 }
    );
  }
}
