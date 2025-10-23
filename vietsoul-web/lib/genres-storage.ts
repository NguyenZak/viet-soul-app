import fs from 'fs';
import path from 'path';

const STORAGE_FILE = path.join(process.cwd(), 'data', 'genres.json');

// Ensure data directory exists
const dataDir = path.dirname(STORAGE_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export async function getLocalGenres() {
  try {
    if (!fs.existsSync(STORAGE_FILE)) {
      return [];
    }
    
    const data = fs.readFileSync(STORAGE_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading local genres:', error);
    return [];
  }
}

export async function addLocalGenre(genre: any) {
  try {
    const genres = await getLocalGenres();
    genres.push(genre);
    
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(genres, null, 2));
    return genre;
  } catch (error) {
    console.error('Error adding local genre:', error);
    throw error;
  }
}

export async function updateLocalGenre(id: number, updates: any) {
  try {
    const genres = await getLocalGenres();
    const index = genres.findIndex((g: any) => g.id === id);
    
    if (index === -1) {
      return null;
    }
    
    genres[index] = { ...genres[index], ...updates };
    
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(genres, null, 2));
    return genres[index];
  } catch (error) {
    console.error('Error updating local genre:', error);
    throw error;
  }
}

export async function deleteLocalGenre(id: number) {
  try {
    const genres = await getLocalGenres();
    const filteredGenres = genres.filter((g: any) => g.id !== id);
    
    if (filteredGenres.length === genres.length) {
      return false; // Genre not found
    }
    
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(filteredGenres, null, 2));
    return true;
  } catch (error) {
    console.error('Error deleting local genre:', error);
    throw error;
  }
}
