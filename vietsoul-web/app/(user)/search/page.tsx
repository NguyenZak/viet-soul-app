"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { mockSearch } from "../../../lib/search";
import TrackCard from "../../../components/TrackCard";
import Link from "next/link";

function SearchContent() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const [loading, setLoading] = useState(false);
  const [tracks, setTracks] = useState<any[]>([]);
  const [playlists, setPlaylists] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const result = await mockSearch(q);
        if (!mounted) return;
        setTracks(result.tracks);
        setPlaylists(result.playlists);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [q]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Tìm kiếm</h1>
        <div className="text-sm text-neutral-400">Kết quả cho: "{q}"</div>
      </div>

      {loading ? (
        <div className="text-neutral-400">Đang tìm kiếm...</div>
      ) : (
        <>
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Bài hát</h2>
            {tracks.length === 0 ? (
              <div className="text-neutral-400">Không có kết quả</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {tracks.map((t) => (
                  <TrackCard key={t.id} track={t} />
                ))}
              </div>
            )}
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Playlist</h2>
            {playlists.length === 0 ? (
              <div className="text-neutral-400">Không có kết quả</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {playlists.map((p) => (
                  <Link key={p.id} href={`/collection/${p.id}`} className="group">
                    <div className="aspect-square rounded-xl overflow-hidden bg-neutral-800/40 grid place-items-center mb-2">
                      <div className="text-4xl">🎵</div>
                    </div>
                    <div className="text-sm font-medium truncate">{p.title}</div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Tìm kiếm</h1>
        </div>
        <div className="text-neutral-400">Đang tải...</div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
