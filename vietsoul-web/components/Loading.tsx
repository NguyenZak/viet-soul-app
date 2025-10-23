export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "size-4",
    md: "size-6", 
    lg: "size-8"
  };

  return (
    <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-neutral-600 border-t-white`} />
  );
}

export function LoadingSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-white/10 rounded ${className}`} />
  );
}

export function TrackCardSkeleton() {
  return (
    <div className="group relative overflow-hidden rounded-md bg-white/5 ring-1 ring-white/10">
      <div className="aspect-square bg-white/10" />
      <div className="p-2 space-y-2">
        <div className="h-4 bg-white/10 rounded w-3/4" />
        <div className="h-3 bg-white/10 rounded w-1/2" />
      </div>
    </div>
  );
}

export function TrackRowSkeleton() {
  return (
    <div className="flex items-center gap-3 p-2 rounded hover:bg-white/5">
      <div className="size-10 bg-white/10 rounded" />
      <div className="flex-1 space-y-1">
        <div className="h-4 bg-white/10 rounded w-1/3" />
        <div className="h-3 bg-white/10 rounded w-1/4" />
      </div>
      <div className="h-4 bg-white/10 rounded w-16" />
    </div>
  );
}
