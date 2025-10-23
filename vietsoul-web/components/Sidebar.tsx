"use client";

import { Home, Library, Users, Music, Disc, X, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore } from "../store/ui";
import { useUserPlaylists } from "../store/playlists";
import clsx from "clsx";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const closeSidebar = useUIStore((s) => s.closeSidebar);

  const NavLink = ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={clsx(
          "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 group",
          isActive
            ? "bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-blue-100 ring-1 ring-blue-500/20 shadow-lg"
            : "text-blue-300 hover:bg-blue-600/10 hover:text-blue-100 hover:scale-[1.02]"
        )}
        onClick={closeSidebar}
      >
        {children}
      </Link>
    );
  };

  return (
    <div className="h-full w-[280px] rounded-2xl bg-gradient-to-b from-blue-900/60 to-neutral-900/60 ring-1 ring-blue-500/20 p-4 flex flex-col gap-4 backdrop-blur-sm shadow-2xl">
      {/* Close Button for Mobile */}
      <button 
        className="md:hidden self-end w-8 h-8 grid place-items-center rounded-xl hover:bg-white/10 transition-colors" 
        onClick={closeSidebar}
      >
        <X size={16} />
      </button>

      {/* Logo */}
      <div className="flex items-center gap-3 px-2 py-2">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <Music className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">VietSoul</h1>
          <p className="text-xs text-blue-300">Music Player</p>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="rounded-2xl bg-blue-800/30 ring-1 ring-blue-400/20 p-3">
        <div className="px-2 py-2 mb-3">
          <div className="text-xs text-blue-300 font-medium uppercase tracking-wider">Khám phá</div>
        </div>
        <nav className="flex flex-col gap-1">
          <NavLink href="/">
            <Home size={20} />
            <span className="font-medium">Trang chủ</span>
          </NavLink>
          <NavLink href="/library">
            <Library size={20} />
            <span className="font-medium">Thư viện</span>
          </NavLink>
        </nav>
      </div>

      {/* Browse Section */}
      <div className="rounded-2xl bg-neutral-800/30 ring-1 ring-neutral-400/20 p-3">
        <div className="px-2 py-2 mb-3">
          <div className="text-xs text-neutral-300 font-medium uppercase tracking-wider">Duyệt</div>
        </div>
        <nav className="flex flex-col gap-1">
          <NavLink href="/artists">
            <Users size={20} />
            <span className="font-medium">Ca sĩ</span>
          </NavLink>
          <NavLink href="/genres">
            <Music size={20} />
            <span className="font-medium">Thể loại</span>
          </NavLink>
          <NavLink href="/albums">
            <Disc size={20} />
            <span className="font-medium">Albums</span>
          </NavLink>
        </nav>
      </div>

      {/* Playlists Section */}
      <div className="flex-1 rounded-2xl bg-neutral-800/30 ring-1 ring-neutral-400/20 p-3 overflow-hidden">
        <div className="flex items-center justify-between px-2 py-2 mb-3">
          <div className="text-xs text-neutral-300 font-medium uppercase tracking-wider">Playlists</div>
          <CreatePlaylistBtn />
        </div>
        <div className="overflow-auto">
          <UserPlaylistsList onClickItem={closeSidebar} />
        </div>
      </div>
    </div>
  );
}

function CreatePlaylistBtn() {
  const create = useUserPlaylists((s) => s.create);
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      create(title.trim());
      setTitle("");
      setIsCreating(false);
    }
  };

  if (isCreating) {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tên playlist"
          className="flex-1 px-2 py-1 text-xs bg-white/10 text-white placeholder-neutral-400 rounded-lg border border-white/20 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
          autoFocus
        />
        <button
          type="submit"
          className="px-2 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Tạo
        </button>
        <button
          type="button"
          onClick={() => {
            setIsCreating(false);
            setTitle("");
          }}
          className="px-2 py-1 text-xs bg-neutral-600 text-white rounded-lg hover:bg-neutral-700 transition-colors"
        >
          Hủy
        </button>
      </form>
    );
  }

  return (
    <button
      onClick={() => setIsCreating(true)}
      className="w-6 h-6 grid place-items-center rounded-lg bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 hover:text-blue-200 transition-colors"
    >
      <Plus size={14} />
    </button>
  );
}

function UserPlaylistsList({ onClickItem }: { onClickItem: () => void }) {
  const playlists = useUserPlaylists((s) => s.playlists);
  const pathname = usePathname();

  if (playlists.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-neutral-700/50 rounded-xl flex items-center justify-center mx-auto mb-3">
          <Music className="w-6 h-6 text-neutral-400" />
        </div>
        <p className="text-sm text-neutral-400 mb-2">Chưa có playlist</p>
        <p className="text-xs text-neutral-500">Tạo playlist đầu tiên của bạn</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {playlists.map((playlist) => {
        const isActive = pathname === `/collection/${playlist.id}`;
        return (
          <Link
            key={playlist.id}
            href={`/collection/${playlist.id}`}
            onClick={onClickItem}
            className={clsx(
              "block px-3 py-2 rounded-xl text-sm transition-all duration-200 hover:scale-[1.02]",
              isActive
                ? "bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-blue-100 ring-1 ring-blue-500/20"
                : "text-neutral-300 hover:bg-white/10 hover:text-white"
            )}
          >
            <div className="truncate font-medium">{playlist.title}</div>
            <div className="text-xs text-neutral-500">
              {playlist.tracks.length} bài hát
            </div>
          </Link>
        );
      })}
    </div>
  );
}