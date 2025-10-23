import { create } from 'zustand';

interface LibraryState {
  savedPlaylists: string[];
  savedTracks: string[];
  isSavedPlaylist: (id: string) => boolean;
  isSavedTrack: (id: string) => boolean;
  toggleSavePlaylist: (id: string) => void;
  toggleSaveTrack: (id: string) => void;
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  savedPlaylists: [],
  savedTracks: [],
  
  isSavedPlaylist: (id: string) => {
    return get().savedPlaylists.includes(id);
  },
  
  isSavedTrack: (id: string) => {
    return get().savedTracks.includes(id);
  },
  
  toggleSavePlaylist: (id: string) => {
    set((state) => ({
      savedPlaylists: state.savedPlaylists.includes(id)
        ? state.savedPlaylists.filter(savedId => savedId !== id)
        : [...state.savedPlaylists, id]
    }));
  },
  
  toggleSaveTrack: (id: string) => {
    set((state) => ({
      savedTracks: state.savedTracks.includes(id)
        ? state.savedTracks.filter(savedId => savedId !== id)
        : [...state.savedTracks, id]
    }));
  }
}));