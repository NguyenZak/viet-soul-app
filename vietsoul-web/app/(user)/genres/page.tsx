"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchGenres } from "../../../lib/api";
import { Tags, Music } from "lucide-react";

type Genre = {
  id: number;
  name: string;
  description?: string;
  color?: string;
  track_count?: string | number;
};

export default function GenresIndexPage() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchGenres();
        setGenres(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Thể loại</h1>
        <div className="text-neutral-400">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Thể loại</h1>
        <div className="text-sm text-neutral-400 flex items-center gap-2">
          <Tags size={16} />
          {genres.length} thể loại
        </div>
      </div>

      {genres.length === 0 ? (
        <div className="text-center py-12 text-neutral-400">Chưa có thể loại</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {genres.map((genre) => (
            <Link key={genre.id} href={`/genre/${slugify(genre.name)}`} className="group">
              <div className="aspect-square rounded-xl overflow-hidden grid place-items-center mb-2" style={{ backgroundColor: genre.color || '#666' }}>
                <div className="text-4xl font-bold text-white/90">
                  {genre.name.charAt(0)}
                </div>
              </div>
              <div className="text-sm font-medium truncate">{genre.name}</div>
              <div className="text-xs text-neutral-300 truncate flex items-center gap-1">
                <Music size={12} />
                {genre.track_count ?? 0} bài hát
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function slugify(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}


