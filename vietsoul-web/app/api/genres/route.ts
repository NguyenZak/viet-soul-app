import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function GET() {
  try {
    const result = await query('SELECT * FROM genres ORDER BY id ASC');
    return NextResponse.json(result.rows);
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
    
    const result = await query(
      'INSERT INTO genres (name, description, color) VALUES ($1, $2, $3) RETURNING *',
      [body.name, body.description, body.color || '#3B82F6']
    );
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating genre:', error);
    return NextResponse.json(
      { error: 'Failed to create genre' },
      { status: 500 }
    );
  }
}
