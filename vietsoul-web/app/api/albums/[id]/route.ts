import { NextRequest, NextResponse } from 'next/server';
import { updateLocalAlbum, deleteLocalAlbum } from '../../../../lib/albums-storage';

const API_BASE = 'http://localhost:3001/api';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const id = parseInt(params.id);
    
    // Check if it's a backend album (numeric ID) or local album
    if (id < 1000) {
      // This is a backend album, we can't update it
      return NextResponse.json(
        { error: 'Cannot update backend albums' },
        { status: 400 }
      );
    }
    
    // Update local album
    const updatedAlbum = await updateLocalAlbum(id, body);
    if (!updatedAlbum) {
      return NextResponse.json(
        { error: 'Album not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedAlbum);
  } catch (error) {
    console.error('Error updating album:', error);
    return NextResponse.json(
      { error: 'Failed to update album' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    
    if (!id) {
      return NextResponse.json(
        { error: 'Album ID is required' },
        { status: 400 }
      );
    }
    
    // Check if it's a backend album (numeric ID) or local album
    if (id < 1000) {
      // This is a backend album, we can't delete it
      return NextResponse.json(
        { error: 'Cannot delete backend albums' },
        { status: 400 }
      );
    }
    
    // Delete local album
    const success = await deleteLocalAlbum(id);
    if (!success) {
      return NextResponse.json(
        { error: 'Album not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting album:', error);
    return NextResponse.json(
      { error: 'Failed to delete album' },
      { status: 500 }
    );
  }
}
