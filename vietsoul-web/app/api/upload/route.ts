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
    
    // Check if audio was uploaded successfully
    if (!uploadResults.audioUrl) {
      return NextResponse.json({
        success: false,
        error: 'Audio file upload failed',
        details: 'No audio URL returned from upload'
      }, { status: 400 });
    }
    
        // Create track in our local API
        const trackData = {
          title,
          artist,
          artist_id: artistId ? parseInt(artistId) : null,
          genre_id: genreId ? parseInt(genreId) : null,
          album_id: albumId ? parseInt(albumId) : null,
          src: uploadResults.audioUrl,
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
      console.log('Track creation response:', { status: response.status, data: createdTrack });
      
      if (!response.ok) {
        console.error('Failed to create track:', createdTrack);
        return NextResponse.json({
          success: false,
          error: 'Failed to save track to database',
          details: createdTrack.error || 'Unknown error',
          data: uploadResults
        }, { status: 500 });
      }
      
      return NextResponse.json({
        success: true,
        data: {
          ...uploadResults,
          track: createdTrack
        }
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json({
        success: false,
        error: 'Failed to save track to database',
        details: dbError.message,
        data: uploadResults
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed', details: error.message },
      { status: 500 }
    );
  }
}
