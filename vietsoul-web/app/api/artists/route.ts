import { NextRequest, NextResponse } from 'next/server';
import { getLocalArtists, addLocalArtist } from '../../../lib/artists-storage';

export async function GET() {
  try {
    const localArtists = await getLocalArtists();
    return NextResponse.json(localArtists);
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
