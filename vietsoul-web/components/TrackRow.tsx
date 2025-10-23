"use client";

import { Heart, Play } from "lucide-react";
import type { Track } from "../store/player";
import { usePlayerStore } from "../store/player";
import { useLibraryStore } from "../store/library";
import { useUserPlaylists } from "../store/playlists";

type Props = {
  track: Track;
  index: number;
  onPlayAt?: (index: number) => void;
};

export default function TrackRow({ track, index, onPlayAt }: Props) {
  const setIndex = usePlayerStore((s) => s.setIndex);
  const currentIndex = usePlayerStore((s) => s.currentIndex);
  const isActive = index === currentIndex;
  const enqueue = usePlayerStore((s) => s.enqueue);
  const insertNext = usePlayerStore((s) => s.insertNext);
  const playlists = useUserPlaylists((s) => s.playlists);
  const addTo = useUserPlaylists((s) => s.addTrack);
  return (
    <div className={`grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 px-3 py-2 rounded ${isActive ? "bg-white/10" : "hover:bg-white/5"}`}>
      <div className="w-6 text-right text-xs text-neutral-400">{index + 1}</div>
      <div className="min-w-0">
        <div className="text-sm truncate">{track.title}</div>
        <div className="text-xs text-neutral-400 truncate">{track.artist}</div>
      </div>
      <LikeBtn trackId={track.id} />
      <button
        onClick={() => (onPlayAt ? onPlayAt(index) : setIndex(index))}
        className="size-8 grid place-items-center rounded-full bg-white text-black"
      >
        <Play size={16} />
      </button>
      <div className="flex items-center gap-2">
        <button onClick={() => insertNext(track)} className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/15">Play next</button>
        <button onClick={() => enqueue(track)} className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/15">Add</button>
        <div className="relative group">
          <button className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/15">Add to playlist</button>
          <div className="absolute right-0 top-full mt-1 rounded bg-neutral-900/95 ring-1 ring-white/10 p-2 hidden group-hover:block z-10">
            {playlists.length === 0 ? (
              <div className="text-xs text-neutral-400">Chưa có playlist</div>
            ) : (
              playlists.map((p) => (
                <button key={p.id} onClick={() => addTo(p.id, track)} className="block text-left text-xs px-2 py-1 rounded hover:bg-white/10 w-full">{p.title}</button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LikeBtn({ trackId }: { trackId: string }) {
  const liked = useLibraryStore((s) => s.isLiked(trackId));
  const toggleLike = useLibraryStore((s) => s.toggleLike);
  return (
    <button onClick={() => toggleLike(trackId)} className={`size-8 grid place-items-center rounded-full ${liked ? "bg-green-500 text-black" : "bg-white/10 hover:bg-white/15"}`}>
      <Heart size={16} />
    </button>
  );
}


