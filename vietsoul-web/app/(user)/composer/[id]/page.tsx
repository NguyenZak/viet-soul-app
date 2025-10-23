"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Play, Calendar, MapPin, Music } from "lucide-react";
import { fetchComposerBySlug } from "../../../../lib/api";
import { usePlayerStore } from "../../../../store/player";
import TrackCard from "../../../../components/TrackCard";
import { LoadingSkeleton } from "../../../../components/Loading";

type Composer = {
  id: number;
  name: string;
  slug: string;
  bio?: string;
  avatar_url?: string;
  birth_date?: string;
  nationality?: string;
};

type Track = {
  id: string;
  title: string;
  artist: string;
  coverUrl?: string;
  src: string;
  lrcUrl?: string;
  artist_id?: number;
  artist_name?: string;
  artist_avatar?: string;
  artist_slug?: string;
  album_id?: number;
  album_title?: string;
  album_cover?: string;
  album_slug?: string;
  genre_id?: number;
  genre_name?: string;
  genre_color?: string;
  genre_slug?: string;
  release_year?: number;
  duration?: number;
  file_size?: number;
};

type ComposerData = {
  composer: Composer;
  tracks: Track[];
};

export default function ComposerPage() {
  const params = useParams();
  const composerSlug = params.id as string;
  const [data, setData] = useState<ComposerData | null>(null);
  const [loading, setLoading] = useState(true);
  const setQueue = usePlayerStore((s) => s.setQueue);

  useEffect(() => {
    async function loadComposer() {
      try {
        const composerData = await fetchComposerBySlug(composerSlug);
        setData(composerData);
      } catch (error) {
        console.error('Error loading composer:', error);
      } finally {
        setLoading(false);
      }
    }
    loadComposer();
  }, [composerSlug]);

  const playAllTracks = () => {
    if (data?.tracks) {
      const tracks = data.tracks.map(track => ({
        id: track.id.toString(),
        title: track.title,
        artist: track.artist_name || track.artist,
        coverUrl: track.coverUrl,
        src: track.src,
        lrcUrl: track.lrcUrl,
        artist_id: track.artist_id,
        artist_name: track.artist_name,
        artist_avatar: track.artist_avatar,
        artist_slug: track.artist_slug,
        album_id: track.album_id,
        album_title: track.album_title,
        album_cover: track.album_cover,
        album_slug: track.album_slug,
        genre_id: track.genre_id,
        genre_name: track.genre_name,
        genre_color: track.genre_color,
        genre_slug: track.genre_slug,
        release_year: track.release_year,
        duration: track.duration,
        file_size: track.file_size,
      }));
      setQueue(tracks, 0);
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!data?.composer) {
    return <div className="text-neutral-400 p-4">Nhạc sĩ không tìm thấy.</div>;
  }

  const { composer, tracks } = data;

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-8">
        <div className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0 rounded-full overflow-hidden shadow-lg">
          {composer.avatar_url ? (
            <Image
              src={composer.avatar_url}
              alt={composer.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-neutral-700 flex items-center justify-center text-neutral-400">
              <Music size={96} />
            </div>
          )}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold mb-2">{composer.name}</h1>
          <div className="text-neutral-400 text-sm md:text-base mt-2 flex items-center justify-center md:justify-start gap-4">
            {composer.birth_date && (
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{new Date(composer.birth_date).getFullYear()}</span>
              </div>
            )}
            {composer.nationality && (
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>{composer.nationality}</span>
              </div>
            )}
            {tracks.length > 0 && (
              <div className="flex items-center gap-2">
                <Music size={16} />
                <span>{tracks.length} bài hát</span>
              </div>
            )}
          </div>
          {composer.bio && (
            <p className="text-neutral-400 mt-4 max-w-xl mx-auto md:mx-0">{composer.bio}</p>
          )}
          <button
            onClick={playAllTracks}
            className="mt-6 px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors flex items-center justify-center gap-2 mx-auto md:mx-0"
          >
            <Play size={20} fill="currentColor" />
            Phát tất cả
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Bài hát</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {tracks.map((track) => (
            <TrackCard
              key={track.id}
              track={track}
              onPlay={() => setQueue(tracks, tracks.findIndex(t => t.id === track.id))}
            />
          ))}
        </div>
      </div>
    </div>
  );
}


