"use client";

import { useState, useEffect, Suspense } from "react";
import { Play, Heart } from "lucide-react";
import TrackCard from "../../components/TrackCard";
import type { Track } from "../../store/player";
import { fetchTracks } from "../../lib/api";

function HomePageContent() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTracks();
  }, []);

  const loadTracks = async () => {
    try {
      const data = await fetchTracks();
      // Check if data is an array (success) or error object
      if (Array.isArray(data)) {
        setTracks(data);
      } else {
        console.error('API returned non-array:', data);
        setTracks([]);
      }
    } catch (error) {
      console.error('Error loading tracks:', error);
      setTracks([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 p-8 ring-1 ring-white/10 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold text-white mb-2">Chào mừng đến với VietSoul</h1>
            <p className="text-blue-200 text-lg mb-6">Khám phá âm nhạc Việt Nam tuyệt vời</p>
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                <Play className="w-5 h-5 inline mr-2" />
                Phát ngẫu nhiên
              </button>
              <button className="px-6 py-3 bg-white/10 text-white font-semibold rounded-2xl hover:bg-white/20 transition-all duration-200 ring-1 ring-white/20">
                <Heart className="w-5 h-5 inline mr-2" />
                Yêu thích
              </button>
            </div>
          </div>
        </div>
        
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-400">Đang tải bài hát...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 p-8 ring-1 ring-white/10 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white mb-2">Chào mừng đến với VietSoul</h1>
          <p className="text-blue-200 text-lg mb-6">Khám phá âm nhạc Việt Nam tuyệt vời</p>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
              <Play className="w-5 h-5 inline mr-2" />
              Phát ngẫu nhiên
            </button>
            <button className="px-6 py-3 bg-white/10 text-white font-semibold rounded-2xl hover:bg-white/20 transition-all duration-200 ring-1 ring-white/20">
              <Heart className="w-5 h-5 inline mr-2" />
              Yêu thích
            </button>
          </div>
        </div>
      </div>

      {/* Recently Played */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Gần đây phát</h2>
          <button className="text-blue-300 hover:text-blue-100 text-sm font-medium transition-colors">
            Xem tất cả
          </button>
        </div>
        {tracks.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-neutral-700/50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Play className="w-8 h-8 text-neutral-400" />
            </div>
            <p className="text-neutral-400 mb-2">Chưa có bài hát nào</p>
            <p className="text-sm text-neutral-500">Hãy upload bài hát đầu tiên của bạn</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {tracks.slice(0, 6).map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>
        )}
      </section>

      {/* Trending Now */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Đang thịnh hành</h2>
          <button className="text-blue-300 hover:text-blue-100 text-sm font-medium transition-colors">
            Xem tất cả
          </button>
        </div>
        {tracks.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-neutral-700/50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Play className="w-8 h-8 text-neutral-400" />
            </div>
            <p className="text-neutral-400 mb-2">Chưa có bài hát nào</p>
            <p className="text-sm text-neutral-500">Hãy upload bài hát đầu tiên của bạn</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {tracks.map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>
        )}
      </section>

      {/* Made for You */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Dành cho bạn</h2>
          <button className="text-blue-300 hover:text-blue-100 text-sm font-medium transition-colors">
            Xem tất cả
          </button>
        </div>
        {tracks.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-neutral-700/50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Play className="w-8 h-8 text-neutral-400" />
            </div>
            <p className="text-neutral-400 mb-2">Chưa có bài hát nào</p>
            <p className="text-sm text-neutral-500">Hãy upload bài hát đầu tiên của bạn</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {tracks.slice(0, 4).map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  );
}
