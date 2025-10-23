import { NextRequest, NextResponse } from 'next/server';
import { query } from './database.js';

export async function GET() {
  try {
    const result = await query(`
      SELECT t.*, 
             a.name as artist_name, a.bio as artist_bio, a.avatar_url as artist_avatar, a.nationality as artist_nationality,
             c.name as composer_name, c.bio as composer_bio, c.avatar_url as composer_avatar, c.nationality as composer_nationality,
             al.title as album_title, al.description as album_description, al.cover_url as album_cover, al.release_date as album_release_date,
             g.name as genre_name, g.description as genre_description, g.color as genre_color
      FROM tracks t
      LEFT JOIN artists a ON t.artist_id = a.id
      LEFT JOIN composers c ON t.composer_id = c.id
      LEFT JOIN albums al ON t.album_id = al.id
      LEFT JOIN genres g ON t.genre_id = g.id
      ORDER BY t.created_at DESC
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching tracks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { title, artist, src, cover_url, lrc_url, genre, album } = body;
    
    if (!title || !artist || !src) {
      return NextResponse.json(
        { error: 'Title, artist, and src are required' },
        { status: 400 }
      );
    }

    const result = await query(
      'INSERT INTO tracks (title, artist, src, cover_url, lrc_url, genre, album) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, artist, src, cover_url || null, lrc_url || null, genre || 'Unknown', album || 'Unknown']
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating track:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Track ID is required' },
        { status: 400 }
      );
    }

    const fields = Object.keys(updateData);
    const values = Object.values(updateData);
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    
    const result = await query(
      `UPDATE tracks SET ${setClause} WHERE id = $1 RETURNING *`,
      [id, ...values]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Track not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating track:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Track ID is required' },
        { status: 400 }
      );
    }

    const result = await query('DELETE FROM tracks WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Track not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      deletedTrack: result.rows[0]
    });
  } catch (error) {
    console.error('Error deleting track:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}