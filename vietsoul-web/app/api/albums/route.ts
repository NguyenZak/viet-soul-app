import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function GET() {
  try {
    const result = await query('SELECT * FROM albums ORDER BY id ASC');
    return NextResponse.json(result.rows);
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
    
    const result = await query(
      'INSERT INTO albums (title, description, cover_url, release_date, artist_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [
        body.title, 
        body.description || '', 
        body.cover_url || '/uploads/albums/default.jpg',
        body.release_date || new Date().toISOString().split('T')[0],
        body.artist_id || null
      ]
    );
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating album:', error);
    return NextResponse.json(
      { error: 'Failed to create album' },
      { status: 500 }
    );
  }
}
