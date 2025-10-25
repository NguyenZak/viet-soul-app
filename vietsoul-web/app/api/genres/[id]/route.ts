import { NextRequest, NextResponse } from 'next/server';
import { updateLocalGenre, deleteLocalGenre } from '../../../../lib/genres-storage';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const id = parseInt(params.id);
    
    // Update genre
    const updatedGenre = await updateLocalGenre(id, body);
    if (!updatedGenre) {
      return NextResponse.json(
        { error: 'Genre not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedGenre);
  } catch (error) {
    console.error('Error updating genre:', error);
    return NextResponse.json(
      { error: 'Failed to update genre' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    
    if (!id) {
      return NextResponse.json(
        { error: 'Genre ID is required' },
        { status: 400 }
      );
    }
    
    // Delete genre
    const success = await deleteLocalGenre(id);
    if (!success) {
      return NextResponse.json(
        { error: 'Genre not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting genre:', error);
    return NextResponse.json(
      { error: 'Failed to delete genre' },
      { status: 500 }
    );
  }
}
