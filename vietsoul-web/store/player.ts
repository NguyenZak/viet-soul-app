import { create } from "zustand";

export type Track = {
  id: string;
  title: string;
  artist: string;
  coverUrl?: string;
  src: string; // can be mp3 or m3u8
  lrcUrl?: string; // optional synced lyrics
  // Extended metadata
  artist_id?: number;
  artist_name?: string;
  artist_bio?: string;
  artist_avatar?: string;
  artist_nationality?: string;
  composer_id?: number;
  composer_name?: string;
  composer_bio?: string;
  composer_avatar?: string;
  composer_nationality?: string;
  album_id?: number;
  album_title?: string;
  album_description?: string;
  album_cover?: string;
  album_release_date?: string;
  genre_id?: number;
  genre_name?: string;
  genre_description?: string;
  genre_color?: string;
  release_year?: number;
  lyrics?: string;
  duration?: number;
  file_size?: number;
};

type PlayerState = {
  queue: Track[];
  currentIndex: number; // -1 if none
  isPlaying: boolean;
  shuffle: boolean;
  repeat: "off" | "one" | "all";
  setQueue: (tracks: Track[], startIndex?: number) => void;
  play: (index?: number) => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  toggle: () => void;
  current: () => Track | null;
  enqueue: (tracks: Track[] | Track) => void;
  removeAt: (index: number) => void;
  clear: () => void;
  setIndex: (index: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  move: (from: number, to: number) => void;
  insertNext: (tracks: Track[] | Track) => void;
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  queue: [],
  currentIndex: -1,
  isPlaying: false,
  shuffle: false,
  repeat: "off",
  setQueue: (tracks, startIndex = 0) =>
    set({ queue: tracks, currentIndex: startIndex, isPlaying: true }),
  play: (index) =>
    set((s) => ({ currentIndex: index ?? s.currentIndex, isPlaying: true })),
  pause: () => set({ isPlaying: false }),
  next: () =>
    set((s) => {
      if (s.queue.length === 0) return { currentIndex: -1 } as any;
      if (s.repeat === "one") return { isPlaying: true } as any;
      if (s.shuffle) {
        const next = Math.floor(Math.random() * s.queue.length);
        return { currentIndex: next, isPlaying: true } as any;
      }
      const next = s.currentIndex + 1;
      if (next >= s.queue.length) {
        if (s.repeat === "all") return { currentIndex: 0, isPlaying: true } as any;
        return { isPlaying: false } as any;
      }
      return { currentIndex: next, isPlaying: true } as any;
    }),
  prev: () =>
    set((s) => ({
      currentIndex:
        s.queue.length === 0
          ? -1
          : (s.currentIndex - 1 + s.queue.length) % s.queue.length,
      isPlaying: true,
    })),
  toggle: () => set((s) => ({ isPlaying: !s.isPlaying })),
  current: () => {
    const s = get();
    if (s.currentIndex < 0 || s.currentIndex >= s.queue.length) return null;
    return s.queue[s.currentIndex];
  },
  enqueue: (tracks) =>
    set((s) => {
      const add = Array.isArray(tracks) ? tracks : [tracks];
      return { queue: [...s.queue, ...add] } as Partial<PlayerState> as any;
    }),
  removeAt: (index) =>
    set((s) => {
      if (index < 0 || index >= s.queue.length) return {} as any;
      const newQueue = s.queue.slice();
      newQueue.splice(index, 1);
      let newIndex = s.currentIndex;
      if (index < s.currentIndex) newIndex = s.currentIndex - 1;
      if (newQueue.length === 0) newIndex = -1;
      if (newIndex >= newQueue.length) newIndex = newQueue.length - 1;
      return { queue: newQueue, currentIndex: newIndex } as Partial<PlayerState> as any;
    }),
  clear: () => set({ queue: [], currentIndex: -1, isPlaying: false }),
  setIndex: (index) => set({ currentIndex: index, isPlaying: true }),
  toggleShuffle: () => set((s) => ({ shuffle: !s.shuffle })),
  cycleRepeat: () =>
    set((s) => ({ repeat: s.repeat === "off" ? "all" : s.repeat === "all" ? "one" : "off" })),
  move: (from, to) =>
    set((s) => {
      if (from < 0 || to < 0 || from >= s.queue.length || to >= s.queue.length) return {} as any;
      const arr = s.queue.slice();
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      let idx = s.currentIndex;
      if (from === idx) idx = to;
      else if (from < idx && to >= idx) idx -= 1;
      else if (from > idx && to <= idx) idx += 1;
      return { queue: arr, currentIndex: idx } as any;
    }),
  insertNext: (tracks) =>
    set((s) => {
      const add = Array.isArray(tracks) ? tracks : [tracks];
      if (s.currentIndex < 0) return { queue: add, currentIndex: 0, isPlaying: true } as any;
      const arr = s.queue.slice();
      const pos = Math.min(arr.length, s.currentIndex + 1);
      arr.splice(pos, 0, ...add);
      return { queue: arr } as any;
    }),
}));


