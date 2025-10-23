"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Track } from "./player";

export type UserPlaylist = {
  id: string;
  title: string;
  tracks: Track[];
};

type State = {
  playlists: UserPlaylist[];
  create: (title?: string) => string; // returns id
  remove: (id: string) => void;
  addTrack: (id: string, track: Track) => void;
  removeTrackAt: (id: string, index: number) => void;
};

export const useUserPlaylists = create<State>()(
  persist(
    (set, get) => ({
      playlists: [],
      create: (title = "Playlist mới") => {
        const id = `${Date.now().toString(36)}`;
        set((s) => ({ playlists: [...s.playlists, { id, title, tracks: [] }] }));
        return id;
      },
      remove: (id) => set((s) => ({ playlists: s.playlists.filter((p) => p.id !== id) })),
      addTrack: (id, track) =>
        set((s) => ({
          playlists: s.playlists.map((p) => (p.id === id ? { ...p, tracks: [...p.tracks, track] } : p)),
        })),
      removeTrackAt: (id, index) =>
        set((s) => ({
          playlists: s.playlists.map((p) =>
            p.id === id ? { ...p, tracks: p.tracks.filter((_, i) => i !== index) } : p
          ),
        })),
    }),
    { name: "vietsoul-user-playlists" }
  )
);


