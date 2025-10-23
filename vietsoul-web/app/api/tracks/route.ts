import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage for demo purposes
// In production, this should be replaced with a real database
const tracks: any[] = [
  {
    id: "1",
    title: "Nắng ấm xa dần",
    artist: "Sơn Tùng M-TP",
    src: "/demo/demo.mp3",
    cover_url: "/next.svg",
    lrc_url: "/demo/demo.lrc",
    genre: "Pop",
    album: "Unknown",
    created_at: new Date().toISOString()
  },
  {
    id: "2", 
    title: "HLS Sample",
    artist: "Demo Artist",
    src: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    cover_url: "/next.svg",
    lrc_url: null,
    genre: "Electronic",
    album: "Unknown",
    created_at: new Date().toISOString()
  }
];

export async function GET() {
  return NextResponse.json(tracks);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newTrack = {
      id: Date.now().toString(),
      title: body.title,
      artist: body.artist,
      src: body.src || '',
      cover_url: body.cover_url || '/next.svg',
      lrc_url: body.lrc_url || null,
      genre: body.genre || 'Unknown',
      album: body.album || 'Unknown',
      created_at: new Date().toISOString()
    };
    
    tracks.push(newTrack);
    
    return NextResponse.json(newTrack);
  } catch (error) {
    console.error('Error creating track:', error);
    return NextResponse.json(
      { error: 'Failed to create track' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    const trackIndex = tracks.findIndex(track => track.id === id);
    if (trackIndex === -1) {
      return NextResponse.json(
        { error: 'Track not found' },
        { status: 404 }
      );
    }
    
    // Update track
    tracks[trackIndex] = {
      ...tracks[trackIndex],
      ...updateData,
      id: id // Ensure ID doesn't change
    };
    
    return NextResponse.json(tracks[trackIndex]);
  } catch (error) {
    console.error('Error updating track:', error);
    return NextResponse.json(
      { error: 'Failed to update track' },
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
    
    const trackIndex = tracks.findIndex(track => track.id === id);
    if (trackIndex === -1) {
      return NextResponse.json(
        { error: 'Track not found' },
        { status: 404 }
      );
    }
    
    const deletedTrack = tracks.splice(trackIndex, 1)[0];
    
    return NextResponse.json({ 
      success: true, 
      deletedTrack 
    });
  } catch (error) {
    console.error('Error deleting track:', error);
    return NextResponse.json(
      { error: 'Failed to delete track' },
      { status: 500 }
    );
  }
}