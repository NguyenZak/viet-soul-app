import { NextRequest, NextResponse } from 'next/server';
import { uploadTrackFiles } from '../../../lib/cloudinary';
import { createTrack } from '../../../lib/api';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
        const trackId = formData.get('trackId') as string;
        const title = formData.get('title') as string;
        const artist = formData.get('artist') as string;
        const genre = formData.get('genre') as string;
        const album = formData.get('album') as string;
        const artistId = formData.get('artistId') as string;
        const genreId = formData.get('genreId') as string;
        const albumId = formData.get('albumId') as string;
        const audio = formData.get('audio') as File;
        const cover = formData.get('cover') as File;
        const lyrics = formData.get('lyrics') as File;
        
        console.log('Upload request:', { trackId, title, artist, genre, album, audio: !!audio, cover: !!cover, lyrics: !!lyrics });
    
    if (!trackId) {
      return NextResponse.json(
        { error: 'Track ID is required' },
        { status: 400 }
      );
    }
    
    if (!title || !artist) {
      return NextResponse.json(
        { error: 'Title and Artist are required' },
        { status: 400 }
      );
    }
    
    const files = {
      audio: audio || null,
      cover: cover || null,
      lyrics: lyrics || null
    };
    
    // Upload files to Cloudinary
    const uploadResults = await uploadTrackFiles(files, trackId);
    
    console.log('Upload results:', uploadResults);
    
        // Create track in our local API
        const trackData = {
          title,
          artist,
          artist_id: artistId ? parseInt(artistId) : null,
          genre_id: genreId ? parseInt(genreId) : null,
          album_id: albumId ? parseInt(albumId) : null,
          src: uploadResults.audioUrl || '',
          cover_url: uploadResults.coverUrl || '/next.svg',
          lrc_url: uploadResults.lyricsUrl || null
        };
    
    console.log('Creating track:', trackData);
    
    try {
      const response = await fetch(`${request.nextUrl.origin}/api/tracks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trackData)
      });
      
      const createdTrack = await response.json();
      console.log('Track created:', createdTrack);
      
      return NextResponse.json({
        success: true,
        data: {
          ...uploadResults,
          track: createdTrack
        }
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Still return upload success even if DB fails
      return NextResponse.json({
        success: true,
        data: uploadResults,
        warning: 'Files uploaded but failed to save to database'
      });
    }
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed', details: error.message },
      { status: 500 }
    );
  }
}
