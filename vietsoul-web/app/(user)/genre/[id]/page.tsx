"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Play, Music } from "lucide-react";
import { fetchGenreBySlug } from "../../../../lib/api";
import { usePlayerStore } from "../../../../store/player";
import TrackCard from "../../../../components/TrackCard";
import { LoadingSkeleton } from "../../../../components/Loading";

type Genre = {
  id: number;
  name: string;
  description?: string;
  color?: string;
  created_at: string;
  updated_at: string;
};

type Track = {
  id: number;
  title: string;
  artist: string;
  src: string;
  cover_url?: string;
  lrc_url?: string;
  artist_name?: string;
  artist_avatar?: string;
  composer_name?: string;
  composer_avatar?: string;
  album_title?: string;
  album_cover?: string;
  release_year?: number;
};

type GenreData = {
  genre: Genre;
  tracks: Track[];
};

export default function GenrePage() {
  const params = useParams();
  const genreSlug = params.id as string;
  const [data, setData] = useState<GenreData | null>(null);
  const [loading, setLoading] = useState(true);
  const setQueue = usePlayerStore((s) => s.setQueue);

  useEffect(() => {
    async function loadGenre() {
      try {
        const genreData = await fetchGenreBySlug(genreSlug);
        setData(genreData);
      } catch (error) {
        console.error('Error loading genre:', error);
      } finally {
        setLoading(false);
      }
    }
    loadGenre();
  }, [genreSlug]);

  const playAllTracks = () => {
    if (data?.tracks) {
      const tracks = data.tracks.map(track => ({
        id: track.id.toString(),
        title: track.title,
        artist: track.artist,
        coverUrl: track.cover_url,
        src: track.src,
        lrcUrl: track.lrc_url,
        genre_name: data.genre.name,
        genre_color: data.genre.color,
        release_year: track.release_year,
      }));
      setQueue(tracks, 0);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-end gap-6">
          <LoadingSkeleton className="w-48 h-48 rounded-full" />
          <div className="space-y-4 flex-1">
            <LoadingSkeleton className="h-8 w-64" />
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
        <h1 className="text-2xl font-semibold mb-4">Không tìm thấy thể loại</h1>
        <p className="text-neutral-400">Thể loại này có thể đã bị xóa hoặc không tồn tại.</p>
      </div>
    );
  }

  const { genre, tracks } = data;

  return (
    <div className="space-y-6">
      {/* Genre Header */}
      <div className="flex items-end gap-6">
        <div 
          className="w-48 h-48 rounded-full flex items-center justify-center text-6xl font-bold"
          style={{ backgroundColor: genre.color || '#666' }}
        >
          {genre.name.charAt(0)}
        </div>
        
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">{genre.name}</h1>
            <div className="flex items-center gap-4 text-sm text-neutral-400">
              <div className="flex items-center gap-1">
                <Music size={16} />
                {tracks.length} bài hát
              </div>
            </div>
          </div>
          
          {genre.description && (
            <p className="text-neutral-300 leading-relaxed max-w-2xl">
              {genre.description}
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
            Bài hát trong thể loại {genre.name}
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
                  genre_name: genre.name,
                  genre_color: genre.color,
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
