import { NextRequest, NextResponse } from 'next/server';
import { getLocalGenres, addLocalGenre } from '../../../lib/genres-storage';

const API_BASE = 'http://localhost:3001/api';

export async function GET() {
  try {
    // First load from backend
    const res = await fetch(`${API_BASE}/genres`);
    
    if (!res.ok) {
      console.error('Backend API error:', res.status, res.statusText);
      // If backend fails, just return local genres
      const localGenres = await getLocalGenres();
      return NextResponse.json(localGenres);
    }
    
    const backendGenres = await res.json();
    
    // Transform to simpler format for frontend
    const simplifiedGenres = backendGenres.map((genre: any) => ({
      id: genre.id,
      name: genre.name,
      description: genre.description,
      color: genre.color,
      track_count: genre.track_count
    }));
    
    // Merge with local genres
    const localGenres = await getLocalGenres();
    const allGenres = [...simplifiedGenres, ...localGenres];
    
    return NextResponse.json(allGenres);
  } catch (error) {
    console.error('Error fetching genres:', error);
    // If there's an error, try to return local genres
    try {
      const localGenres = await getLocalGenres();
      return NextResponse.json(localGenres);
    } catch (localError) {
      console.error('Error fetching local genres:', localError);
      return NextResponse.json(
        { error: 'Failed to fetch genres' },
        { status: 500 }
      );
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Create new genre with local ID
    const newGenre = {
      id: Date.now(), // Simple ID generation
      name: body.name,
      description: body.description,
      color: body.color || '#3B82F6',
      track_count: "0"
    };
    
    // Add to local storage
    await addLocalGenre(newGenre);
    
    return NextResponse.json(newGenre);
  } catch (error) {
    console.error('Error creating genre:', error);
    return NextResponse.json(
      { error: 'Failed to create genre' },
      { status: 500 }
    );
  }
}
