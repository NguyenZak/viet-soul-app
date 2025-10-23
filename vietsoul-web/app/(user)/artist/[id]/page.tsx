"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Play, Calendar, MapPin, Music, Disc } from "lucide-react";
import { fetchArtistBySlug } from "../../../../lib/api";
import { usePlayerStore } from "../../../../store/player";
import TrackCard from "../../../../components/TrackCard";
import { LoadingSkeleton } from "../../../../components/Loading";

type Artist = {
  id: number;
  name: string;
  bio?: string;
  avatar_url?: string;
  birth_date?: string;
  nationality?: string;
  created_at: string;
  updated_at: string;
};

type Album = {
  id: number;
  title: string;
  description?: string;
  cover_url?: string;
  release_date?: string;
  track_count: number;
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
  album_title?: string;
  album_cover?: string;
  release_year?: number;
};

type ArtistData = {
  artist: Artist;
  tracks: Track[];
  albums: Album[];
};

export default function ArtistPage() {
  const params = useParams();
  const artistSlug = params.id as string;
  const [data, setData] = useState<ArtistData | null>(null);
  const [loading, setLoading] = useState(true);
  const setQueue = usePlayerStore((s) => s.setQueue);

  useEffect(() => {
    async function loadArtist() {
      try {
        const artistData = await fetchArtistBySlug(artistSlug);
        setData(artistData);
      } catch (error) {
        console.error('Error loading artist:', error);
      } finally {
        setLoading(false);
      }
    }
    loadArtist();
  }, [artistSlug]);

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
          <LoadingSkeleton className="w-48 h-48 rounded-full" />
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
        <h1 className="text-2xl font-semibold mb-4">Không tìm thấy ca sĩ</h1>
        <p className="text-neutral-400">Ca sĩ này có thể đã bị xóa hoặc không tồn tại.</p>
      </div>
    );
  }

  const { artist, tracks, albums } = data;

  return (
    <div className="space-y-6">
      {/* Artist Header */}
      <div className="flex items-end gap-6">
        <div className="w-48 h-48 rounded-full overflow-hidden bg-neutral-800/40 grid place-items-center">
          {artist.avatar_url ? (
            <Image 
              src={artist.avatar_url} 
              alt={artist.name} 
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
            <h1 className="text-4xl font-bold mb-2">{artist.name}</h1>
            <div className="flex items-center gap-4 text-sm text-neutral-400">
              {artist.nationality && (
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  {artist.nationality}
                </div>
              )}
              {artist.birth_date && (
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  {new Date(artist.birth_date).getFullYear()}
                </div>
              )}
            </div>
          </div>
          
          {artist.bio && (
            <p className="text-neutral-300 leading-relaxed max-w-2xl">
              {artist.bio}
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
            
            <div className="text-sm text-neutral-400">
              {tracks.length} bài hát • {albums.length} album
            </div>
          </div>
        </div>
      </div>

      {/* Albums Section */}
      {albums.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Disc size={24} />
            Albums
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {albums.map((album) => (
              <Link key={album.id} href={`/album/${album.slug}`} className="group cursor-pointer">
                <div className="aspect-square rounded-md overflow-hidden bg-neutral-800/40 mb-2">
                  {album.cover_url ? (
                    <Image 
                      src={album.cover_url} 
                      alt={album.title} 
                      width={200} 
                      height={200} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center">
                      <Disc size={48} className="text-neutral-400" />
                    </div>
                  )}
                </div>
                <div className="text-sm font-medium truncate">{album.title}</div>
                <div className="text-xs text-neutral-400">
                  {album.release_date && new Date(album.release_date).getFullYear()} • {album.track_count} bài
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Tracks Section */}
      {tracks.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Music size={24} />
            Bài hát phổ biến
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
