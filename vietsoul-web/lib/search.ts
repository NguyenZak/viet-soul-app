import { searchTracks } from "./api";
import type { Track } from "../store/player";

export type SearchResult = {
  tracks: Track[];
  playlists: { id: string; title: string }[];
};

export async function mockSearch(q: string): Promise<SearchResult> {
  const qn = q.trim().toLowerCase();
  if (!qn) return { tracks: [], playlists: [] };
  
  try {
    const result = await searchTracks(qn);
    return {
      tracks: result.tracks || [],
      playlists: (result.playlists || []).map((p: any) => ({ id: p.id, title: p.title }))
    };
  } catch {
    return { tracks: [], playlists: [] };
  }
}


