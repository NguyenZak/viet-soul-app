"use client";

import { useUserPlaylists } from "../../../../store/playlists";
import TrackRow from "../../../../components/TrackRow";
import { usePlayerStore } from "../../../../store/player";

type Props = { params: { id: string } };

export default function CollectionPage({ params }: Props) {
  const playlist = useUserPlaylists((s) => s.playlists.find((p) => p.id === params.id));
  const removeTrackAt = useUserPlaylists((s) => s.removeTrackAt);
  const setQueue = usePlayerStore((s) => s.setQueue);
  if (!playlist) return <div className="p-6">Playlist không tồn tại.</div>;
  return (
    <div className="space-y-6">
      <div className="flex items-end gap-4">
        <div className="size-32 rounded-md bg-white/10" />
        <div className="flex-1 min-w-0">
          <div className="text-xs text-neutral-400">Playlist của bạn</div>
          <h1 className="text-3xl font-bold truncate">{playlist.title}</h1>
          <div className="text-sm text-neutral-400 truncate">{playlist.tracks.length} bài hát</div>
        </div>
        <button onClick={() => playlist.tracks.length && setQueue(playlist.tracks, 0)} className="size-12 rounded-full bg-green-500 text-black grid place-items-center shadow-lg">▶</button>
      </div>
      <div className="rounded-lg bg-white/5 ring-1 ring-white/10 divide-y divide-white/10">
        {playlist.tracks.length === 0 ? (
          <div className="text-xs text-neutral-400 p-3">Trống</div>
        ) : (
          playlist.tracks.map((t, i) => (
            <div key={i} className="flex items-center justify-between">
              <TrackRow track={t} index={i} />
              <button onClick={() => removeTrackAt(playlist.id, i)} className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/15 mr-3">Xóa</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


