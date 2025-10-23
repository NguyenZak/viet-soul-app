"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Music, 
  Users, 
  Disc, 
  Settings, 
  BarChart3,
  Upload,
  Shield,
  Tags,
  X
} from "lucide-react";
import { useUIStore } from "../store/ui";

export default function AdminSidebar() {
  const pathname = usePathname();
  const closeSidebar = useUIStore((s) => s.closeSidebar);

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
          isActive 
            ? 'bg-white/10 text-white' 
            : 'text-neutral-400 hover:text-white hover:bg-white/5'
        }`}
      >
        {children}
      </Link>
    );
  };

  return (
    <div className="h-full w-[280px] rounded-lg bg-neutral-900/40 ring-1 ring-white/5 p-3 flex flex-col gap-3 md:relative transition-all duration-200 hover:bg-neutral-900/60">
      <button className="md:hidden self-end size-8 grid place-items-center rounded hover:bg-white/10" onClick={closeSidebar}>
        <X size={16} />
      </button>
      
      <div className="rounded-md bg-neutral-900/60 ring-1 ring-white/10 p-2">
        <div className="px-3 py-2 mb-2">
          <div className="text-xs text-neutral-400 font-medium">QUẢN LÝ</div>
        </div>
        <nav className="flex flex-col gap-1 text-sm">
          <NavLink href="/admin">
            <BarChart3 size={18} />
            <span>Tổng quan</span>
          </NavLink>
          <NavLink href="/admin/tracks">
            <Music size={18} />
            <span>Quản lý bài hát</span>
          </NavLink>
          <NavLink href="/admin/artists">
            <Users size={18} />
            <span>Quản lý nghệ sĩ</span>
          </NavLink>
          <NavLink href="/admin/genres">
            <Tags size={18} />
            <span>Quản lý thể loại</span>
          </NavLink>
          <NavLink href="/admin/albums">
            <Disc size={18} />
            <span>Quản lý albums</span>
          </NavLink>
          <NavLink href="/admin/users">
            <Shield size={18} />
            <span>Quản lý người dùng</span>
          </NavLink>
          <NavLink href="/admin/settings">
            <Settings size={18} />
            <span>Cài đặt hệ thống</span>
          </NavLink>
        </nav>
      </div>

      <div className="rounded-md bg-neutral-900/60 ring-1 ring-white/10 p-2">
        <div className="px-3 py-2 mb-2">
          <div className="text-xs text-neutral-400 font-medium">NGƯỜI DÙNG</div>
        </div>
        <nav className="flex flex-col gap-1 text-sm">
          <NavLink href="/">
            <Home size={18} />
            <span>Về trang chủ</span>
          </NavLink>
        </nav>
      </div>
    </div>
  );
}
