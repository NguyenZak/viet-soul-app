import { create } from 'zustand';

interface LibraryState {
  savedPlaylists: string[];
  savedTracks: string[];
  isSavedPlaylist: (id: string) => boolean;
  isSavedTrack: (id: string) => boolean;
  isLiked: (id: string) => boolean;
  toggleSavePlaylist: (id: string) => void;
  toggleSaveTrack: (id: string) => void;
  toggleLike: (id: string) => void;
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
  
  // Alias for isSavedTrack (compatibility)
  isLiked: (id: string) => {
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
  },
  
  // Alias for toggleSaveTrack (compatibility)
  toggleLike: (id: string) => {
    set((state) => ({
      savedTracks: state.savedTracks.includes(id)
        ? state.savedTracks.filter(savedId => savedId !== id)
        : [...state.savedTracks, id]
    }));
  }
}));