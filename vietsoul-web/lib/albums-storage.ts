import fs from 'fs';
import path from 'path';

const STORAGE_FILE = path.join(process.cwd(), 'data', 'albums.json');

// Ensure data directory exists
const dataDir = path.dirname(STORAGE_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export async function getLocalAlbums() {
  try {
    if (!fs.existsSync(STORAGE_FILE)) {
      return [];
    }
    
    const data = fs.readFileSync(STORAGE_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading local albums:', error);
    return [];
  }
}

export async function addLocalAlbum(album: any) {
  try {
    const albums = await getLocalAlbums();
    albums.push(album);
    
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(albums, null, 2));
    return album;
  } catch (error) {
    console.error('Error adding local album:', error);
    throw error;
  }
}

export async function updateLocalAlbum(id: number, updates: any) {
  try {
    const albums = await getLocalAlbums();
    const index = albums.findIndex((a: any) => a.id === id);
    
    if (index === -1) {
      return null;
    }
    
    albums[index] = { ...albums[index], ...updates };
    
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(albums, null, 2));
    return albums[index];
  } catch (error) {
    console.error('Error updating local album:', error);
    throw error;
  }
}

export async function deleteLocalAlbum(id: number) {
  try {
    const albums = await getLocalAlbums();
    const filteredAlbums = albums.filter((a: any) => a.id !== id);
    
    if (filteredAlbums.length === albums.length) {
      return false; // Album not found
    }
    
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(filteredAlbums, null, 2));
    return true;
  } catch (error) {
    console.error('Error deleting local album:', error);
    throw error;
  }
}
