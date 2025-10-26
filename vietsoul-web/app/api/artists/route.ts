import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function GET() {
  try {
    const result = await query('SELECT * FROM artists ORDER BY id ASC');
    return NextResponse.json(result.rows);
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
    
    const result = await query(
      'INSERT INTO artists (name, bio, avatar_url, nationality) VALUES ($1, $2, $3, $4) RETURNING *',
      [body.name, body.bio, body.avatar_url || '/uploads/artists/default.jpg', body.nationality]
    );
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating artist:', error);
    return NextResponse.json(
      { error: 'Failed to create artist' },
      { status: 500 }
    );
  }
}
