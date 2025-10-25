"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchAlbums } from "../../../lib/api";
import { Disc, Users } from "lucide-react";

type Album = {
  id: number;
  title: string;
  artist: string;
  release_year?: number;
  cover_url?: string;
  track_count?: string | number;
};

export default function AlbumsIndexPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchAlbums();
        setAlbums(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Albums</h1>
        <div className="text-neutral-400">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Albums</h1>
        <div className="text-sm text-neutral-400 flex items-center gap-2">
          <Disc size={16} />
          {albums.length} albums
        </div>
      </div>

      {albums.length === 0 ? (
        <div className="text-center py-12 text-neutral-400">Chưa có album</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {albums.map((album) => (
            <Link key={album.id} href={`/album/${slugify(album.title)}`} className="group">
              <div className="aspect-square rounded-xl overflow-hidden bg-neutral-800/40 grid place-items-center mb-2">
                {album.cover_url ? (
                  <Image src={album.cover_url} alt={album.title} width={200} height={200} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <Disc size={48} className="text-neutral-400" />
                )}
              </div>
              <div className="text-sm font-medium truncate">{album.title}</div>
              <div className="text-xs text-neutral-400 truncate flex items-center gap-1">
                <Users size={12} />
                {album.artist}
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


