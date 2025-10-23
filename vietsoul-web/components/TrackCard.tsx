"use client";

import Image from "next/image";
import { Heart, Play, MoreHorizontal } from "lucide-react";
import { Track, usePlayerStore } from "../store/player";
import { useLibraryStore } from "../store/library";
import { useUserPlaylists } from "../store/playlists";

type Props = {
  track: Track;
};

export default function TrackCard({ track }: Props) {
  const setQueue = usePlayerStore((s) => s.setQueue);
  const onPlay = () => setQueue([track], 0);
  const liked = useLibraryStore((s) => s.isLiked(track.id));
  const toggleLike = useLibraryStore((s) => s.toggleLike);
  const enqueue = usePlayerStore((s) => s.enqueue);
  const insertNext = usePlayerStore((s) => s.insertNext);
  const playlists = useUserPlaylists((s) => s.playlists);
  const addTo = useUserPlaylists((s) => s.addTrack);

  return (
    <div className="group relative bg-neutral-800 rounded-lg overflow-hidden hover:bg-neutral-700 transition-colors duration-200">
      {/* Cover Image */}
      <div className="relative aspect-square">
        <Image 
          src={track.coverUrl ?? "/next.svg"} 
          alt={track.title} 
          width={200} 
          height={200} 
          className="w-full h-full object-cover dark:invert" 
        />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <button
            onClick={onPlay}
            className="w-12 h-12 bg-green-500 text-black rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          >
            <Play size={20} className="ml-0.5" />
          </button>
        </div>

        {/* Like Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(track.id);
          }}
          className={`absolute top-3 right-3 w-7 h-7 rounded-full backdrop-blur-sm transition-all duration-200 flex items-center justify-center ${
            liked 
              ? "bg-green-500 text-white" 
              : "bg-black/40 text-white hover:bg-black/60"
          }`}
        >
          <Heart size={14} className={liked ? "fill-current" : ""} />
        </button>
      </div>

      {/* Track Info */}
      <div className="p-3">
        <h3 className="font-medium text-white truncate mb-1">
          {track.title}
        </h3>
        <p className="text-sm text-neutral-400 truncate">
          {track.artist}
        </p>
      </div>

      {/* More Options */}
      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="relative group/menu">
          <button 
            onClick={(e) => e.stopPropagation()} 
            className="w-8 h-8 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors flex items-center justify-center"
          >
            <MoreHorizontal size={16} />
          </button>
          <div className="absolute bottom-full mb-2 right-0 bg-neutral-900/95 backdrop-blur-sm ring-1 ring-white/10 rounded-lg p-2 hidden group-hover/menu:block min-w-[180px]">
            <div className="text-xs text-neutral-400 mb-2 px-2">Thêm vào playlist</div>
            {playlists.length === 0 ? (
              <div className="text-xs text-neutral-400 px-2">Chưa có playlist</div>
            ) : (
              playlists.map((p) => (
                <button
                  key={p.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    addTo(p.id, track);
                  }}
                  className="block w-full text-left text-xs px-2 py-1 rounded hover:bg-white/10 transition-colors"
                >
                  {p.title}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


