"use client";

import { X, Trash2, Play, ArrowUp, ArrowDown } from "lucide-react";
import { usePlayerStore } from "../store/player";

type Props = {
  onClose: () => void;
};

export default function QueuePanel({ onClose }: Props) {
  const queue = usePlayerStore((s) => s.queue);
  const currentIndex = usePlayerStore((s) => s.currentIndex);
  const removeAt = usePlayerStore((s) => s.removeAt);
  const move = usePlayerStore((s) => s.move);
  const setIndex = usePlayerStore((s) => s.setIndex);
  const onDragStart = (e: React.DragEvent<HTMLLIElement>, i: number) => {
    e.dataTransfer.setData("text/plain", String(i));
  };
  const onDrop = (e: React.DragEvent<HTMLLIElement>, i: number) => {
    const from = Number(e.dataTransfer.getData("text/plain"));
    move(from, i);
  };
  const onDragOver = (e: React.DragEvent) => e.preventDefault();

  return (
    <div className="fixed right-2 bottom-24 w-[380px] max-h-[60vh] rounded-lg bg-neutral-900/95 ring-1 ring-white/10 backdrop-blur p-3 flex flex-col animate-in slide-in-from-bottom-4 duration-200">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium">Hàng đợi phát</div>
        <button onClick={onClose} className="size-8 grid place-items-center rounded hover:bg-white/10">
          <X size={16} />
        </button>
      </div>
      <div className="overflow-auto">
        {queue.length === 0 ? (
          <div className="text-xs text-neutral-400 p-3">Trống</div>
        ) : (
          <ul className="flex flex-col">
            {queue.map((t, i) => (
              <li
                key={t.id}
                draggable
                onDragStart={(e) => onDragStart(e, i)}
                onDrop={(e) => onDrop(e, i)}
                onDragOver={onDragOver}
                className={`flex items-center justify-between px-2 py-2 rounded transition-all duration-200 ${i === currentIndex ? "bg-white/10" : "hover:bg-white/5"}`}
              >
                <div className="min-w-0">
                  <div className="text-sm truncate">{t.title}</div>
                  <div className="text-xs text-neutral-400 truncate">{t.artist}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => move(i, Math.max(0, i - 1))} className="size-8 grid place-items-center rounded hover:bg-white/10" title="Lên">
                    <ArrowUp size={16} />
                  </button>
                  <button onClick={() => move(i, Math.min(queue.length - 1, i + 1))} className="size-8 grid place-items-center rounded hover:bg-white/10" title="Xuống">
                    <ArrowDown size={16} />
                  </button>
                  <button onClick={() => setIndex(i)} className="size-8 grid place-items-center rounded bg-white text-black">
                    <Play size={16} />
                  </button>
                  <button onClick={() => removeAt(i)} className="size-8 grid place-items-center rounded hover:bg-white/10">
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}


