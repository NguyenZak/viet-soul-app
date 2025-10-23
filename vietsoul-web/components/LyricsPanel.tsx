"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { parseLrc, LrcLine } from "../lib/lrc";

export default function LyricsPanel({ audio }: { audio: HTMLAudioElement | null }) {
  const [lines, setLines] = useState<LrcLine[]>([]);
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const load = async () => {
      const lrcUrl = (audio as any)?._currentLrcUrl as string | undefined;
      if (!lrcUrl) {
        setLines([]);
        return;
      }
      try {
        const res = await fetch(lrcUrl);
        const text = await res.text();
        setLines(parseLrc(text));
      } catch {
        setLines([]);
      }
    };
    load();
  }, [audio && (audio as any)._currentLrcUrl]);

  useEffect(() => {
    if (!audio) return;
    const onTime = () => {
      const t = audio.currentTime;
      if (lines.length === 0) return;
      let idx = lines.findIndex((l, i) => t < l.time && i > 0) - 1;
      if (idx < 0) idx = lines.length - 1;
      setActive((prev) => (prev !== idx ? idx : prev));
      const el = ref.current?.querySelector(`[data-i="${idx}"]`);
      if (el && ref.current) {
        ref.current.scrollTo({ top: (el as HTMLElement).offsetTop - 80, behavior: "smooth" });
      }
    };
    audio.addEventListener("timeupdate", onTime);
    return () => audio.removeEventListener("timeupdate", onTime);
  }, [audio, lines]);

  return (
    <div className="fixed inset-x-2 bottom-24 md:right-2 md:left-auto md:w-[420px] max-h-[50vh] rounded-lg bg-neutral-900/95 ring-1 ring-white/10 backdrop-blur p-3 overflow-auto" ref={ref}>
      {lines.length === 0 ? (
        <div className="text-xs text-neutral-400">Không có lời bài hát.</div>
      ) : (
        <div className="space-y-2">
          {lines.map((l, i) => (
            <div key={i} data-i={i} className={`text-sm ${i === active ? "text-white" : "text-neutral-400"}`}>{l.text}</div>
          ))}
        </div>
      )}
    </div>
  );
}


