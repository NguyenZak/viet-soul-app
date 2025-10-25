"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchArtists } from "../../../lib/api";
import { Users, Music } from "lucide-react";

type Artist = {
  id: number;
  name: string;
  bio?: string;
  avatar_url?: string;
  nationality?: string;
  track_count?: string | number;
};

export default function ArtistsIndexPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchArtists();
        setArtists(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Ca sĩ</h1>
        <div className="text-neutral-400">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Ca sĩ</h1>
        <div className="text-sm text-neutral-400 flex items-center gap-2">
          <Users size={16} />
          {artists.length} nghệ sĩ
        </div>
      </div>

      {artists.length === 0 ? (
        <div className="text-center py-12 text-neutral-400">Chưa có nghệ sĩ</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {artists.map((artist) => (
            <Link key={artist.id} href={`/artist/${slugify(artist.name)}`} className="group">
              <div className="aspect-square rounded-xl overflow-hidden bg-neutral-800/40 grid place-items-center mb-2">
                {artist.avatar_url ? (
                  <Image src={artist.avatar_url} alt={artist.name} width={200} height={200} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <Users size={48} className="text-neutral-400" />
                )}
              </div>
              <div className="text-sm font-medium truncate">{artist.name}</div>
              <div className="text-xs text-neutral-400 truncate flex items-center gap-1">
                <Music size={12} />
                {artist.track_count ?? 0} bài hát
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


