const API_BASE = '/api';

// Auth API
export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function register(email: string, password: string, name: string) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  });
  return res.json();
}

export async function getCurrentUser(token: string) {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return res.json();
}

// Music API
export async function fetchTracks() {
  // Use local API for now, can switch to backend later
  const res = await fetch('/api/tracks');
  return res.json();
}

export async function fetchArtists() {
  const res = await fetch('/api/artists');
  return res.json();
}

export async function createArtist(artistData: {
  name: string;
  bio: string;
  nationality: string;
  avatar_url?: string;
}) {
  const res = await fetch('/api/artists', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(artistData)
  });
  
  if (!res.ok) {
    throw new Error(`Failed to create artist: ${res.statusText}`);
  }
  
  return res.json();
}

export async function updateArtist(id: number, artistData: {
  name: string;
  bio: string;
  nationality: string;
  avatar_url?: string;
}) {
  const res = await fetch(`/api/artists/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(artistData)
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || `Failed to update artist: ${res.statusText}`);
  }
  
  return res.json();
}

export async function deleteArtist(id: number) {
  const res = await fetch(`/api/artists/${id}`, {
    method: 'DELETE'
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || `Failed to delete artist: ${res.statusText}`);
  }
  
  return res.json();
}

export async function fetchAlbums() {
  const res = await fetch('/api/albums');
  return res.json();
}

export async function createAlbum(albumData: {
  title: string;
  artist: string;
  release_year?: number;
  cover_url?: string;
}) {
  const res = await fetch('/api/albums', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(albumData)
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || `Failed to create album: ${res.statusText}`);
  }
  
  return res.json();
}

export async function updateAlbum(id: number, albumData: {
  title: string;
  artist: string;
  release_year?: number;
  cover_url?: string;
}) {
  const res = await fetch(`/api/albums/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(albumData)
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || `Failed to update album: ${res.statusText}`);
  }
  
  return res.json();
}

export async function deleteAlbum(id: number) {
  const res = await fetch(`/api/albums/${id}`, {
    method: 'DELETE'
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || `Failed to delete album: ${res.statusText}`);
  }
  
  return res.json();
}

export async function fetchGenres() {
  const res = await fetch('/api/genres');
  return res.json();
}

export async function createGenre(genreData: {
  name: string;
  description: string;
  color?: string;
}) {
  const res = await fetch('/api/genres', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(genreData)
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || `Failed to create genre: ${res.statusText}`);
  }
  
  return res.json();
}

export async function updateGenre(id: number, genreData: {
  name: string;
  description: string;
  color?: string;
}) {
  const res = await fetch(`/api/genres/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(genreData)
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || `Failed to update genre: ${res.statusText}`);
  }
  
  return res.json();
}

export async function deleteGenre(id: number) {
  const res = await fetch(`/api/genres/${id}`, {
    method: 'DELETE'
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || `Failed to delete genre: ${res.statusText}`);
  }
  
  return res.json();
}

export async function fetchPlaylists() {
  const res = await fetch(`${API_BASE}/playlists`);
  return res.json();
}

export async function fetchPlaylist(id: string) {
  const res = await fetch(`${API_BASE}/playlists/${id}`);
  return res.json();
}

export async function searchTracks(query: string) {
  const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
  return res.json();
}

export async function uploadTrack(formData: FormData, token: string) {
  const res = await fetch(`${API_BASE}/tracks`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData,
  });
  return res.json();
}

export async function createTrack(trackData: {
  title: string;
  artist: string;
  genre: string;
  src: string;
  cover_url?: string;
  lrc_url?: string;
}) {
  const res = await fetch(`${API_BASE}/tracks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(trackData),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to create track: ${res.statusText}`);
  }
  
  return res.json();
}

export async function updateTrack(id: string, trackData: {
  title: string;
  artist: string;
  genre: string;
  album: string;
  src?: string;
  cover_url?: string;
  lrc_url?: string;
}) {
  const res = await fetch('/api/tracks', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...trackData })
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || `Failed to update track: ${res.statusText}`);
  }
  
  return res.json();
}

export async function deleteTrack(id: string) {
  const res = await fetch(`/api/tracks?id=${id}`, {
    method: 'DELETE'
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || `Failed to delete track: ${res.statusText}`);
  }
  
  return res.json();
}

// Artists API with slug support

export async function fetchArtist(id: string) {
  const res = await fetch(`${API_BASE}/artists/${id}`);
  return res.json();
}

export async function fetchArtistBySlug(slug: string) {
  const res = await fetch(`${API_BASE}/artists/slug/${slug}`);
  return res.json();
}

// Composers API with slug support
export async function fetchComposers() {
  const res = await fetch(`${API_BASE}/composers`);
  return res.json();
}

export async function fetchComposer(id: string) {
  const res = await fetch(`${API_BASE}/composers/${id}`);
  return res.json();
}

export async function fetchComposerBySlug(slug: string) {
  const res = await fetch(`${API_BASE}/composers/slug/${slug}`);
  return res.json();
}

// Genres API with slug support
export async function fetchGenre(id: string) {
  const res = await fetch(`${API_BASE}/genres/${id}`);
  return res.json();
}

export async function fetchGenreBySlug(slug: string) {
  const res = await fetch(`${API_BASE}/genres/slug/${slug}`);
  return res.json();
}

// Albums API with slug support
export async function fetchAlbum(id: string) {
  const res = await fetch(`${API_BASE}/albums/${id}`);
  return res.json();
}

export async function fetchAlbumBySlug(slug: string) {
  const res = await fetch(`${API_BASE}/albums/slug/${slug}`);
  return res.json();
}

export async function createPlaylist(data: { title: string; description?: string; trackIds?: string[] }, token: string) {
  const res = await fetch(`${API_BASE}/playlists`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(data),
  });
  return res.json();
}