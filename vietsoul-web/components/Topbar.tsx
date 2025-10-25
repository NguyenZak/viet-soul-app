"use client";

import { ChevronLeft, ChevronRight, Menu, Search, User } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useUIStore } from "../store/ui";
import { useAuth } from "../hooks/useAuth";

export default function Topbar() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [q, setQ] = useState("");
  const [mounted, setMounted] = useState(false);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const { user, logout } = useAuth();

  // Handle hydration
  useEffect(() => {
    setMounted(true);
    if (pathname === "/search") {
      setQ(params.get("q") ?? "");
    }
  }, []);

  // keep input in sync when navigating
  useEffect(() => {
    if (!mounted) return;
    if (pathname === "/search") setQ(params.get("q") ?? "");
    else setQ("");
  }, [pathname, params, mounted]);

  // debounce push
  useEffect(() => {
    if (q === "" && pathname !== "/search") return;
    const t = setTimeout(() => {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="h-14 flex items-center justify-between px-4 border-b border-white/10">
      <div className="flex items-center gap-2">
        <button className="size-8 grid place-items-center rounded-full bg-white/10 hover:bg-white/15 md:hidden" onClick={toggleSidebar}>
          <Menu size={18} />
        </button>
        <button className="size-8 grid place-items-center rounded-full bg-white/10 hover:bg-white/15">
          <ChevronLeft size={18} />
        </button>
        <button className="size-8 grid place-items-center rounded-full bg-white/10 hover:bg-white/15">
          <ChevronRight size={18} />
        </button>
        <div className="ml-2 flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 w-[280px]">
          <Search size={16} className="text-neutral-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm bài hát, nghệ sĩ, playlist..."
            className="bg-transparent outline-none text-sm flex-1 placeholder:text-neutral-500"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        {user ? (
          <>
            <div className="text-sm text-neutral-300 hidden sm:block">{user.name}</div>
            <button onClick={() => { logout(); router.replace('/login'); }} className="text-sm px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15">Đăng xuất</button>
          </>
        ) : (
          <button onClick={() => router.push('/login')} className="text-sm px-3 py-1.5 rounded-full bg-white text-black hover:opacity-90">Đăng nhập</button>
        )}
        <button className="size-8 grid place-items-center rounded-full bg-white/10 hover:bg-white/15">
          <User size={18} />
        </button>
      </div>
    </div>
  );
}