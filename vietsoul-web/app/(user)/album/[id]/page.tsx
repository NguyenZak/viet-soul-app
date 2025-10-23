"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Play, Calendar, Music, Users } from "lucide-react";
import { fetchAlbumBySlug } from "../../../../lib/api";
import { usePlayerStore } from "../../../../store/player";
import TrackCard from "../../../../components/TrackCard";
import { LoadingSkeleton } from "../../../../components/Loading";

type Album = {
  id: number;
  title: string;
  description?: string;
  cover_url?: string;
  release_date?: string;
  artist_name?: string;
  artist_bio?: string;
  artist_avatar?: string;
};

type Track = {
  id: number;
  title: string;
  artist: string;
  src: string;
  cover_url?: string;
  lrc_url?: string;
  genre_name?: string;
  genre_color?: string;
  release_year?: number;
};

type AlbumData = {
  album: Album;
  tracks: Track[];
};

export default function AlbumPage() {
  const params = useParams();
  const albumSlug = params.id as string;
  const [data, setData] = useState<AlbumData | null>(null);
  const [loading, setLoading] = useState(true);
  const setQueue = usePlayerStore((s) => s.setQueue);

  useEffect(() => {
    async function loadAlbum() {
      try {
        const albumData = await fetchAlbumBySlug(albumSlug);
        setData(albumData);
      } catch (error) {
        console.error('Error loading album:', error);
      } finally {
        setLoading(false);
      }
    }
    loadAlbum();
  }, [albumSlug]);

  const playAllTracks = () => {
    if (data?.tracks) {
      const tracks = data.tracks.map(track => ({
        id: track.id.toString(),
        title: track.title,
        artist: track.artist,
        coverUrl: track.cover_url,
        src: track.src,
        lrcUrl: track.lrc_url,
        genre_name: track.genre_name,
        genre_color: track.genre_color,
        release_year: track.release_year,
      }));
      setQueue(tracks, 0);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-end gap-6">
          <LoadingSkeleton className="w-48 h-48 rounded-md" />
          <div className="space-y-4 flex-1">
            <LoadingSkeleton className="h-8 w-64" />
            <LoadingSkeleton className="h-4 w-32" />
            <LoadingSkeleton className="h-20 w-full" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <LoadingSkeleton key={i} className="aspect-square" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-semibold mb-4">Không tìm thấy album</h1>
        <p className="text-neutral-400">Album này có thể đã bị xóa hoặc không tồn tại.</p>
      </div>
    );
  }

  const { album, tracks } = data;

  return (
    <div className="space-y-6">
      {/* Album Header */}
      <div className="flex items-end gap-6">
        <div className="w-48 h-48 rounded-md overflow-hidden bg-neutral-800/40 grid place-items-center">
          {album.cover_url ? (
            <Image 
              src={album.cover_url} 
              alt={album.title} 
              width={192} 
              height={192} 
              className="w-full h-full object-cover"
            />
          ) : (
            <Music size={64} className="text-neutral-400" />
          )}
        </div>
        
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">{album.title}</h1>
            <div className="flex items-center gap-4 text-sm text-neutral-400 mb-2">
              {album.artist_name && (
                <Link 
                  href={`/artist/${album.artist_name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  <Users size={16} />
                  {album.artist_name}
                </Link>
              )}
              {album.release_date && (
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  {new Date(album.release_date).getFullYear()}
                </div>
              )}
            </div>
            <div className="text-sm text-neutral-400">
              {tracks.length} bài hát
            </div>
          </div>
          
          {album.description && (
            <p className="text-neutral-300 leading-relaxed max-w-2xl">
              {album.description}
            </p>
          )}
          
          <div className="flex items-center gap-4">
            <button
              onClick={playAllTracks}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-green-500 text-black hover:opacity-90 transition-opacity"
            >
              <Play size={20} />
              Phát tất cả
            </button>
          </div>
        </div>
      </div>

      {/* Tracks Section */}
      {tracks.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Music size={24} />
            Danh sách bài hát
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {tracks.map((track) => (
              <TrackCard
                key={track.id}
                track={{
                  id: track.id.toString(),
                  title: track.title,
                  artist: track.artist,
                  coverUrl: track.cover_url,
                  src: track.src,
                  lrcUrl: track.lrc_url,
                  genre_name: track.genre_name,
                  genre_color: track.genre_color,
                  release_year: track.release_year,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}