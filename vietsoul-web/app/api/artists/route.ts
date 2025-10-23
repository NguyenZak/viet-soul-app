import { NextRequest, NextResponse } from 'next/server';
import { getLocalArtists, addLocalArtist } from '../../../lib/artists-storage';

const API_BASE = 'http://localhost:3001/api';

export async function GET() {
  try {
    // First load from backend
    const res = await fetch(`${API_BASE}/artists`);
    const backendArtists = await res.json();
    
    // Transform to simpler format for frontend
    const simplifiedArtists = backendArtists.map((artist: any) => ({
      id: artist.id,
      name: artist.name,
      bio: artist.bio,
      avatar_url: artist.avatar_url,
      nationality: artist.nationality,
      track_count: artist.track_count
    }));
    
    // Merge with local artists
    const localArtists = await getLocalArtists();
    const allArtists = [...simplifiedArtists, ...localArtists];
    
    return NextResponse.json(allArtists);
  } catch (error) {
    console.error('Error fetching artists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artists' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Create new artist with local ID
    const newArtist = {
      id: Date.now(), // Simple ID generation
      name: body.name,
      bio: body.bio,
      avatar_url: body.avatar_url || '/uploads/artists/default.jpg',
      nationality: body.nationality,
      track_count: "0"
    };
    
    // Add to local storage
    await addLocalArtist(newArtist);
    
    return NextResponse.json(newArtist);
  } catch (error) {
    console.error('Error creating artist:', error);
    return NextResponse.json(
      { error: 'Failed to create artist' },
      { status: 500 }
    );
  }
}
