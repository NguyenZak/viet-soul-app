"use client";

import { useAuth } from "../hooks/useAuth";
import { LogOut, User } from "lucide-react";

export default function AdminTopbar() {
  const { user, logout } = useAuth();

  return (
    <div className="h-14 px-6 flex items-center justify-between border-b border-white/10">
      <div className="flex items-center gap-3">
        <div className="size-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <User size={16} className="text-white" />
        </div>
        <div>
          <div className="text-sm font-medium">Admin Panel</div>
          <div className="text-xs text-neutral-400">VietSoul Management</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-sm text-neutral-400">
          Xin chào, <span className="text-white font-medium">{user?.name}</span>
        </div>
        <button
          onClick={logout}
          className="size-8 grid place-items-center rounded bg-white/10 hover:bg-white/15 text-neutral-400 hover:text-white transition-colors"
          title="Đăng xuất"
        >
          <LogOut size={16} />
        </button>
      </div>
    </div>
  );
}
