import { NextRequest, NextResponse } from 'next/server';
import { getLocalGenres, addLocalGenre } from '../../../lib/genres-storage';

export async function GET() {
  try {
    const localGenres = await getLocalGenres();
    return NextResponse.json(localGenres);
  } catch (error) {
    console.error('Error fetching genres:', error);
    return NextResponse.json(
      { error: 'Failed to fetch genres' },
      { status: 500 }
    );
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
