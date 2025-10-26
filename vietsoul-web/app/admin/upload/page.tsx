"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, Music, Image as ImageIcon, FileText, Check, X, Plus } from "lucide-react";
import { fetchArtists, fetchGenres, fetchAlbums } from "../../../lib/api";

type Artist = {
  id: number;
  name: string;
  nationality: string;
};

type Album = {
  id: number;
  title: string;
  artist: string;
};

type Genre = {
  id: number;
  name: string;
};

type UploadResult = {
  audioUrl?: string;
  coverUrl?: string;
  lyricsUrl?: string;
};

export default function AdminUploadPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [trackId, setTrackId] = useState("");
  const [trackInfo, setTrackInfo] = useState({
    title: "",
    artist: "",
    artistId: "",
    genre: "",
    genreId: "",
    album: "",
    albumId: "",
  });
  const [files, setFiles] = useState({
    audio: null as File | null,
    cover: null as File | null,
    lyrics: null as File | null,
  });
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

  const audioRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const lyricsRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [artistsData, genresData, albumsData] = await Promise.all([
        fetchArtists(),
        fetchGenres(),
        fetchAlbums(),
      ]);
      setArtists(artistsData);
      setGenres(genresData);
      setAlbums(albumsData);
    } catch (err: any) {
      setError(err.message || "Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (type: "audio" | "cover" | "lyrics", file: File) => {
    setFiles((prev) => ({ ...prev, [type]: file }));
    setUploadResult(null);
  };

  const removeFile = (type: "audio" | "cover" | "lyrics") => {
    setFiles((prev) => ({ ...prev, [type]: null }));
    const ref = type === "audio" ? audioRef : type === "cover" ? coverRef : lyricsRef;
    if (ref.current) ref.current.value = "";
  };

  const handleUpload = async () => {
    if (!trackId) {
      alert("Vui lòng nhập Track ID");
      return;
    }
    if (!trackInfo.title || !trackInfo.artistId || !trackInfo.genreId) {
      alert("Vui lòng nhập tên bài hát, chọn nghệ sĩ và thể loại");
      return;
    }
    if (!files.audio && !files.cover && !files.lyrics) {
      alert("Vui lòng chọn ít nhất một file để upload");
      return;
    }

    setUploading(true);

    try {
      const selectedArtist = artists.find((a) => a.id.toString() === trackInfo.artistId);
      const selectedGenre = genres.find((g) => g.id.toString() === trackInfo.genreId);
      const selectedAlbum = albums.find((a) => a.id.toString() === trackInfo.albumId);

      const artistName = selectedArtist?.name || "";
      const genreName = selectedGenre?.name || "";
      const albumName = selectedAlbum?.title || "";

      const formData = new FormData();
      formData.append("trackId", trackId);
      formData.append("title", trackInfo.title);
      formData.append("artist", artistName);
      formData.append("genre", genreName);
      formData.append("album", albumName);

      if (files.audio) formData.append("audio", files.audio);
      if (files.cover) formData.append("cover", files.cover);
      if (files.lyrics) formData.append("lyrics", files.lyrics);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        setUploadResult(result.data);
        setFiles({ audio: null, cover: null, lyrics: null });
        setTrackId("");
        setTrackInfo({ title: "", artist: "", artistId: "", genre: "", genreId: "", album: "", albumId: "" });
        if (audioRef.current) audioRef.current.value = "";
        if (coverRef.current) coverRef.current.value = "";
        if (lyricsRef.current) lyricsRef.current.value = "";
      } else {
        alert("Upload thất bại: " + (result.error || ""));
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload thất bại");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Upload bài hát</h1>
        <div className="text-sm text-neutral-400">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Upload bài hát</h1>
        <div className="flex items-center gap-3">
          <div className="text-sm text-neutral-400">Tạo bài hát mới</div>
          <div className="size-8 grid place-items-center rounded bg-blue-600 text-white">
            <Plus size={16} />
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded bg-red-500/20 text-red-300">{error}</div>
      )}

      <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Track ID</label>
            <input
              type="text"
              value={trackId}
              onChange={(e) => setTrackId(e.target.value)}
              placeholder="Nhập Track ID..."
              className="w-full px-3 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Tên bài hát *</label>
            <input
              type="text"
              value={trackInfo.title}
              onChange={(e) => setTrackInfo((p) => ({ ...p, title: e.target.value }))}
              placeholder="Nhập tên bài hát..."
              className="w-full px-3 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Nghệ sĩ *</label>
            <select
              value={trackInfo.artistId}
              onChange={(e) => setTrackInfo((p) => ({ ...p, artistId: e.target.value }))}
              className="w-full px-3 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
              required
            >
              <option value="">Chọn nghệ sĩ...</option>
              {artists.map((artist) => (
                <option key={artist.id} value={artist.id.toString()}>
                  {artist.name} ({artist.nationality})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Thể loại *</label>
            <select
              value={trackInfo.genreId}
              onChange={(e) => {
                const g = genres.find((x) => x.id.toString() === e.target.value);
                setTrackInfo((p) => ({ ...p, genreId: e.target.value, genre: g?.name || "" }));
              }}
              className="w-full px-3 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
              required
            >
              <option value="">Chọn thể loại...</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id.toString()}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Album</label>
            <select
              value={trackInfo.albumId}
              onChange={(e) => {
                const a = albums.find((x) => x.id.toString() === e.target.value);
                setTrackInfo((p) => ({ ...p, albumId: e.target.value, album: a?.title || "" }));
              }}
              className="w-full px-3 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Chọn album...</option>
              {albums.map((album) => (
                <option key={album.id} value={album.id.toString()}>
                  {album.title} - {album.artist}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="border border-neutral-600 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Music className="w-4 h-4 text-blue-400" />
              <h3 className="font-medium text-white text-sm">Audio File</h3>
            </div>
            <input ref={audioRef} type="file" accept="audio/*" onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFileSelect("audio", f);
            }} className="hidden" />
            <div className="space-y-2">
              <button onClick={() => audioRef.current?.click()} className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                <Upload className="w-4 h-4 inline mr-2" /> Chọn Audio
              </button>
              {files.audio && (
                <div className="flex items-center gap-2 text-green-400 text-xs">
                  <Check className="w-3 h-3" />
                  <span className="truncate">{files.audio.name}</span>
                  <button onClick={() => removeFile("audio")} className="text-red-400 hover:text-red-300">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="border border-neutral-600 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon className="w-4 h-4 text-green-400" />
              <h3 className="font-medium text-white text-sm">Ảnh Bìa</h3>
            </div>
            <input ref={coverRef} type="file" accept="image/*" onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFileSelect("cover", f);
            }} className="hidden" />
            <div className="space-y-2">
              <button onClick={() => coverRef.current?.click()} className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                <Upload className="w-4 h-4 inline mr-2" /> Chọn Ảnh Bìa
              </button>
              {files.cover && (
                <div className="flex items-center gap-2 text-green-400 text-xs">
                  <Check className="w-3 h-3" />
                  <span className="truncate">{files.cover.name}</span>
                  <button onClick={() => removeFile("cover")} className="text-red-400 hover:text-red-300">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="border border-neutral-600 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-purple-400" />
              <h3 className="font-medium text-white text-sm">Lời Bài Hát</h3>
            </div>
            <input ref={lyricsRef} type="file" accept=".lrc,.txt" onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFileSelect("lyrics", f);
            }} className="hidden" />
            <div className="space-y-2">
              <button onClick={() => lyricsRef.current?.click()} className="w-full px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                <Upload className="w-4 h-4 inline mr-2" /> Chọn Lời Bài Hát
              </button>
              {files.lyrics && (
                <div className="flex items-center gap-2 text-green-400 text-xs">
                  <Check className="w-3 h-3" />
                  <span className="truncate">{files.lyrics.name}</span>
                  <button onClick={() => removeFile("lyrics")} className="text-red-400 hover:text-red-300">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={handleUpload} disabled={uploading} className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            {uploading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Đang upload...
              </div>
            ) : (
              "Upload Bài Hát"
            )}
          </button>
        </div>

        {uploadResult && (
          <div className="mt-4 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
            <h3 className="font-medium text-green-400 mb-2">Upload thành công!</h3>
            <div className="space-y-1 text-sm">
              {uploadResult.audioUrl && (
                <div className="text-white">
                  <strong>Audio:</strong>
                  <a href={uploadResult.audioUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 ml-2">
                    Xem file
                  </a>
                </div>
              )}
              {uploadResult.coverUrl && (
                <div className="text-white">
                  <strong>Cover:</strong>
                  <a href={uploadResult.coverUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 ml-2">
                    Xem file
                  </a>
                </div>
              )}
              {uploadResult.lyricsUrl && (
                <div className="text-white">
                  <strong>Lyrics:</strong>
                  <a href={uploadResult.lyricsUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 ml-2">
                    Xem file
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


