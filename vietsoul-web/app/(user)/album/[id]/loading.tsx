export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-end gap-4">
        <div className="size-32 rounded-md bg-white/5 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-20 bg-white/5 rounded animate-pulse" />
          <div className="h-8 w-64 bg-white/5 rounded animate-pulse" />
          <div className="h-4 w-40 bg-white/5 rounded animate-pulse" />
        </div>
        <div className="size-12 rounded-full bg-white/5 animate-pulse" />
      </div>
      <div className="rounded-lg bg-white/5 ring-1 ring-white/10 divide-y divide-white/10">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-10 animate-pulse" />
        ))}
      </div>
    </div>
  );
}


