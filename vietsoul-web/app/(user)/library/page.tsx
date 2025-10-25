"use client";

import Link from "next/link";
import { useUserPlaylists } from "../../../store/playlists";
import { useLibraryStore } from "../../../store/library";
import { usePlayerStore } from "../../../store/player";
import TrackRow from "../../../components/TrackRow";
import { Plus, Heart } from "lucide-react";

export default function LibraryPage() {
  const playlists = useUserPlaylists((s) => s.playlists);
  const create = useUserPlaylists((s) => s.create);
  const savedTracks = useLibraryStore((s) => s.savedTracks);
  const setQueue = usePlayerStore((s) => s.setQueue);

  const createAndGo = () => {
    const id = create("Playlist mới");
    location.href = `/collection/${id}`;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Thư viện</h1>
        <button onClick={createAndGo} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={16} /> Tạo playlist
        </button>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Playlist của bạn</h2>
        {playlists.length === 0 ? (
          <div className="text-neutral-400">Chưa có playlist. Bấm "Tạo playlist" để bắt đầu.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {playlists.map((p) => (
              <Link key={p.id} href={`/collection/${p.id}`} className="group">
                <div className="aspect-square rounded-xl overflow-hidden bg-neutral-800/40 grid place-items-center mb-2">
                  <div className="text-4xl">🎵</div>
                </div>
                <div className="text-sm font-medium truncate">{p.title}</div>
                <div className="text-xs text-neutral-400 truncate">{p.tracks.length} bài hát</div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2"><Heart size={16} className="text-pink-400" /> Bài hát đã thích</h2>
        {savedTracks.length === 0 ? (
          <div className="text-neutral-400">Chưa có bài hát yêu thích.</div>
        ) : (
          <div className="rounded-lg bg-white/5 ring-1 ring-white/10 divide-y divide-white/10">
            {savedTracks.map((t, i) => (
              <TrackRow key={t.id} track={t} index={i} onPlay={() => setQueue(savedTracks, i)} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}


