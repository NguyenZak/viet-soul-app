import type { Track } from "../store/player";

export type Album = {
  id: string;
  title: string;
  artist: string;
  year?: number;
  coverUrl?: string;
  tracks: Track[];
};

export const demoAlbums: Album[] = [
  {
    id: "demo-album",
    title: "VietSoul Demo Album",
    artist: "Various Artists",
    year: 2025,
    coverUrl: "/next.svg",
    tracks: [
      { id: "a1", title: "Intro", artist: "VietSoul", coverUrl: "/next.svg", src: "/demo/demo.mp3" },
      { id: "a2", title: "Chill Vibes", artist: "VietSoul", coverUrl: "/next.svg", src: "/demo/demo.mp3" },
      { id: "a3", title: "HLS Sample", artist: "VietSoul", coverUrl: "/next.svg", src: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" },
    ],
  },
];

export function getAlbumById(id: string): Album | undefined {
  return demoAlbums.find((a) => a.id === id);
}


