import { promises as fs } from 'fs';
import path from 'path';

const STORAGE_FILE = path.join(process.cwd(), 'data', 'artists.json');

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.dirname(STORAGE_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Load artists from file
async function loadArtists() {
  try {
    await ensureDataDir();
    const data = await fs.readFile(STORAGE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Save artists to file
async function saveArtists(artists: any[]) {
  await ensureDataDir();
  await fs.writeFile(STORAGE_FILE, JSON.stringify(artists, null, 2));
}

export async function getLocalArtists() {
  return await loadArtists();
}

export async function addLocalArtist(artist: any) {
  const artists = await loadArtists();
  artists.push(artist);
  await saveArtists(artists);
  return artist;
}

export async function updateLocalArtist(id: number, updateData: any) {
  const artists = await loadArtists();
  const index = artists.findIndex(a => a.id === id);
  if (index !== -1) {
    artists[index] = { ...artists[index], ...updateData };
    await saveArtists(artists);
    return artists[index];
  }
  return null;
}

export async function deleteLocalArtist(id: number) {
  const artists = await loadArtists();
  const index = artists.findIndex(a => a.id === id);
  if (index !== -1) {
    artists.splice(index, 1);
    await saveArtists(artists);
    return true;
  }
  return false;
}