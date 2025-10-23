import { NextRequest, NextResponse } from 'next/server';
import { updateLocalArtist, deleteLocalArtist } from '../../../../lib/artists-storage';

const API_BASE = 'http://localhost:3001/api';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const id = parseInt(params.id);
    
    // Check if it's a backend artist (numeric ID) or local artist
    if (id < 1000) {
      // This is a backend artist, we can't update it
      return NextResponse.json(
        { error: 'Cannot update backend artists' },
        { status: 400 }
      );
    }
    
    // Update local artist
    const updatedArtist = await updateLocalArtist(id, body);
    if (!updatedArtist) {
      return NextResponse.json(
        { error: 'Artist not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedArtist);
  } catch (error) {
    console.error('Error updating artist:', error);
    return NextResponse.json(
      { error: 'Failed to update artist' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    
    if (!id) {
      return NextResponse.json(
        { error: 'Artist ID is required' },
        { status: 400 }
      );
    }
    
    // Check if it's a backend artist (numeric ID) or local artist
    if (id < 1000) {
      // This is a backend artist, we can't delete it
      return NextResponse.json(
        { error: 'Cannot delete backend artists' },
        { status: 400 }
      );
    }
    
    // Delete local artist
    const success = await deleteLocalArtist(id);
    if (!success) {
      return NextResponse.json(
        { error: 'Artist not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting artist:', error);
    return NextResponse.json(
      { error: 'Failed to delete artist' },
      { status: 500 }
    );
  }
}
