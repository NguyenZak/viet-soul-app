"use client";

import { Heart, Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume2, ListMusic, Mic2, Maximize2, Monitor } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePlayerStore } from "../store/player";
import { useLibraryStore } from "../store/library";
import { useAudioStreaming } from "../hooks/useAudioStreaming";
import QueuePanel from "./QueuePanel";
import LyricsPanel from "./LyricsPanel";

export default function PlayerBar() {
  const current = usePlayerStore((s) => s.current());
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const next = usePlayerStore((s) => s.next);
  const prev = usePlayerStore((s) => s.prev);
  const toggle = usePlayerStore((s) => s.toggle);
  const shuffle = usePlayerStore((s) => s.shuffle);
  const repeat = usePlayerStore((s) => s.repeat);
  const toggleShuffle = usePlayerStore((s) => s.toggleShuffle);
  const cycleRepeat = usePlayerStore((s) => s.cycleRepeat);
  const [showQueue, setShowQueue] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isVolumeHovered, setIsVolumeHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  const {
    audioRef,
    currentTime,
    duration,
    buffered,
    loading,
    error,
    seek,
    setVolume: setAudioVolume,
  } = useAudioStreaming(current?.src || '', isPlaying);

  const title = current?.title ?? "Bài hát demo";
  const artist = current?.artist ?? "Nghệ sĩ demo";
  const cover = current?.coverUrl ?? "/next.svg";
  const liked = useLibraryStore((s) => (current?.id ? s.isLiked(current.id) : false));
  const toggleLike = useLibraryStore((s) => s.toggleLike);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Volume sync
  useEffect(() => {
    if (mounted) {
      setAudioVolume(volume);
    }
  }, [volume, setAudioVolume, mounted]);

  // Media Session integration
  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    const ms = (navigator as any).mediaSession as MediaSession;
    ms.metadata = new window.MediaMetadata({
      title: current?.title || "",
      artist: current?.artist || "",
      artwork: current?.coverUrl
        ? [{ src: current.coverUrl, sizes: "300x300", type: "image/png" }]
        : [],
    });
    ms.setActionHandler?.("play", () => toggle());
    ms.setActionHandler?.("pause", () => toggle());
    ms.setActionHandler?.("previoustrack", () => prev());
    ms.setActionHandler?.("nexttrack", () => next());
    ms.setActionHandler?.("seekto", (d: any) => {
      if (typeof d.seekTime === "number") seek(d.seekTime);
    });
  }, [current?.id, current?.title, current?.artist, current?.coverUrl, toggle, prev, next, seek]);

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    seek(time);
  };

  const onVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  };

  const fmt = (s: number) => {
    if (!isFinite(s) || s < 0) s = 0;
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-r from-neutral-800 to-neutral-900 border-t border-neutral-700 z-50">
      <div className="h-full px-3 md:px-4 flex items-center justify-between">
        {/* Mobile Layout */}
        <div className="flex md:hidden items-center justify-between w-full">
          {/* Left Section - Track Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="size-12 bg-neutral-700 rounded-lg overflow-hidden ring-2 ring-white/20">
              <Image src={cover} alt="cover" width={48} height={48} className="w-full h-full object-cover dark:invert" />
            </div>
            
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-white truncate">{title}</div>
              <div className="text-xs text-neutral-300 truncate">{artist}</div>
              {loading && (
                <div className="flex items-center gap-1 text-xs text-green-400">
                  <div className="w-2 h-2 border border-green-400 border-t-transparent rounded-full animate-spin"></div>
                  Loading...
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Controls */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => current?.id && toggleLike(current.id)} 
              className={`p-2 ${liked ? "text-red-400" : "text-white hover:text-red-400"}`}
            >
              <Heart size={18} className={liked ? "fill-current" : ""} />
            </button>
            
            <button 
              onClick={toggle} 
              className="w-10 h-10 bg-white text-black rounded-lg flex items-center justify-center hover:scale-105 transition-transform ring-2 ring-white/20"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
            </button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between w-full">
          {/* Left Section - Track Info */}
          <div className="flex items-center gap-4 min-w-0 flex-1 max-w-[30%]">
            <div className="size-14 bg-neutral-800 rounded overflow-hidden">
              <Image src={cover} alt="cover" width={56} height={56} className="w-full h-full object-cover dark:invert" />
            </div>
            
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-white truncate">{title}</div>
              <div className="text-xs text-neutral-400 truncate">{artist}</div>
              {loading && (
                <div className="flex items-center gap-2 text-xs text-green-400">
                  <div className="w-3 h-3 border border-green-400 border-t-transparent rounded-full animate-spin"></div>
                  Đang tải...
                </div>
              )}
              {error && <div className="text-xs text-red-400">{error}</div>}
            </div>
            
            <button 
              onClick={() => current?.id && toggleLike(current.id)} 
              className={`p-1 ${liked ? "text-green-400" : "text-neutral-400 hover:text-white"}`}
            >
              <Heart size={16} className={liked ? "fill-current" : ""} />
            </button>
          </div>

          {/* Center Section - Controls */}
          <div className="flex flex-col items-center gap-2 flex-1 max-w-[40%]">
            {/* Control Buttons */}
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleShuffle} 
                className={`text-neutral-400 hover:text-white transition-colors ${shuffle ? "text-green-400" : ""}`}
              >
                <Shuffle size={16} />
              </button>
              
              <button 
                onClick={prev} 
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <SkipBack size={20} />
              </button>
              
              <button 
                onClick={toggle} 
                className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
              </button>
              
              <button 
                onClick={next} 
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <SkipForward size={20} />
              </button>
              
              <button 
                onClick={cycleRepeat} 
                className={`text-neutral-400 hover:text-white transition-colors ${repeat !== "off" ? "text-green-400" : ""}`}
                title={`Repeat: ${repeat}`}
              >
                <Repeat size={16} />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-3 w-full max-w-md">
              <span className="text-xs text-neutral-400 min-w-[40px]">{fmt(currentTime)}</span>
              <div className="relative flex-1 h-1">
                <div className="w-full h-full bg-neutral-600 rounded-full overflow-hidden">
                  <input
                    type="range"
                    min={0}
                    max={Math.max(1, duration)}
                    step={0.1}
                    value={Math.min(currentTime, duration || 0)}
                    onChange={onSeek}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-100"
                    style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <span className="text-xs text-neutral-400 min-w-[40px]">{fmt(duration)}</span>
            </div>
          </div>

          {/* Right Section - Additional Controls */}
          <div className="flex items-center gap-2 flex-1 max-w-[30%] justify-end">
            {current?.lrcUrl && (
              <button 
                onClick={() => setShowLyrics((v) => !v)} 
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <Mic2 size={16} />
              </button>
            )}
            
            <button 
              onClick={() => setShowQueue((v) => !v)} 
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <ListMusic size={16} />
            </button>
            
            <button className="text-neutral-400 hover:text-white transition-colors">
              <Monitor size={16} />
            </button>
            
            <div className="flex items-center gap-2">
              <Volume2 size={16} className="text-neutral-400" />
              <div 
                className="relative"
                onMouseEnter={() => setIsVolumeHovered(true)}
                onMouseLeave={() => setIsVolumeHovered(false)}
              >
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={onVolume}
                  className={`h-1 appearance-none bg-neutral-600 rounded-full outline-none transition-all duration-200 ${
                    isVolumeHovered ? "w-20" : "w-16"
                  } [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer`}
                />
              </div>
            </div>

            <button className="text-neutral-400 hover:text-white transition-colors">
              <Maximize2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Progress Bar */}
      <div className="md:hidden absolute bottom-0 left-0 right-0 h-1">
        <div className="w-full h-full bg-neutral-600">
          <div 
            className="h-full bg-white transition-all duration-100"
            style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
          />
        </div>
      </div>

      <audio ref={audioRef} className="hidden" onEnded={next} />
      
      {showLyrics && <LyricsPanel audio={audioRef.current} />}
      {showQueue && <QueuePanel onClose={() => setShowQueue(false)} />}
    </div>
  );
}


