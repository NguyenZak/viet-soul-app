import { NextRequest, NextResponse } from 'next/server';
import { getLocalAlbums, addLocalAlbum } from '../../../lib/albums-storage';

const API_BASE = 'http://localhost:3001/api';

export async function GET() {
  try {
    // First load from backend
    const res = await fetch(`${API_BASE}/albums`);
    
    if (!res.ok) {
      console.error('Backend API error:', res.status, res.statusText);
      // If backend fails, just return local albums
      const localAlbums = await getLocalAlbums();
      return NextResponse.json(localAlbums);
    }
    
    const backendAlbums = await res.json();
    
    // Transform to simpler format for frontend
    const simplifiedAlbums = backendAlbums.map((album: any) => ({
      id: album.id,
      title: album.title,
      artist: album.artist,
      release_year: album.release_year,
      cover_url: album.cover_url,
      track_count: album.track_count
    }));
    
    // Merge with local albums
    const localAlbums = await getLocalAlbums();
    const allAlbums = [...simplifiedAlbums, ...localAlbums];
    
    return NextResponse.json(allAlbums);
  } catch (error) {
    console.error('Error fetching albums:', error);
    // If there's an error, try to return local albums
    try {
      const localAlbums = await getLocalAlbums();
      return NextResponse.json(localAlbums);
    } catch (localError) {
      console.error('Error fetching local albums:', localError);
      return NextResponse.json(
        { error: 'Failed to fetch albums' },
        { status: 500 }
      );
    }
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
