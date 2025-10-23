"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

export function useAudioStreaming(src: string, isPlaying: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !src) return;

    const isHls = src.endsWith('.m3u8');
    
    // Setup HLS for .m3u8 files
    if (isHls && Hls.isSupported()) {
      hlsRef.current?.destroy();
      const hls = new Hls({
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 90,
      });
      
      hlsRef.current = hls;
      hls.attachMedia(audio);
      
      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        hls.loadSource(src);
      });
      
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error:', data);
        setError(`Streaming error: ${data.details}`);
      });
    } else if (isHls) {
      // Fallback for browsers without HLS support
      audio.src = src;
    } else {
      // Regular audio files with range request support
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      audio.src = src;
    }

    // Audio event listeners
    const handleLoadStart = () => setLoading(true);
    const handleCanPlay = () => setLoading(false);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime || 0);
    const handleDurationChange = () => setDuration(isFinite(audio.duration) ? audio.duration : 0);
    const handleProgress = () => {
      if (audio.buffered.length > 0) {
        setBuffered(audio.buffered.end(audio.buffered.length - 1));
      }
    };
    const handleError = () => {
      setError('Failed to load audio');
      setLoading(false);
    };

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('progress', handleProgress);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('progress', handleProgress);
      audio.removeEventListener('error', handleError);
    };
  }, [src]);

  // Play/pause control
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch((err) => {
        console.error('Play failed:', err);
        setError('Playback failed');
      });
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  const seek = (time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const setVolume = (volume: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  };

  return {
    audioRef,
    currentTime,
    duration,
    buffered,
    loading,
    error,
    seek,
    setVolume,
  };
}
