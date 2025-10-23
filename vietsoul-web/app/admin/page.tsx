"use client";

import { useAuth } from "../../hooks/useAuth";
import { BarChart3, Music, Users, Disc, Upload, Shield, Settings } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const { user } = useAuth();

  const stats = [
    { label: "Tổng bài hát", value: "1,234", icon: Music, color: "text-blue-400" },
    { label: "Nghệ sĩ", value: "89", icon: Users, color: "text-green-400" },
    { label: "Albums", value: "156", icon: Disc, color: "text-purple-400" },
    { label: "Người dùng", value: "2,456", icon: Shield, color: "text-orange-400" },
  ];

  const quickActions = [
    { label: "Quản lý bài hát", href: "/admin/tracks", icon: Music },
    { label: "Quản lý nghệ sĩ", href: "/admin/artists", icon: Users },
    { label: "Quản lý albums", href: "/admin/albums", icon: Disc },
    { label: "Upload bài hát", href: "/admin/upload", icon: Upload },
    { label: "Quản lý người dùng", href: "/admin/users", icon: Shield },
    { label: "Cài đặt hệ thống", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Tổng quan hệ thống</h1>
        <p className="text-neutral-400">Chào mừng trở lại, {user?.name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="rounded-lg bg-white/5 ring-1 ring-white/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400">{stat.label}</p>
                <p className="text-2xl font-semibold">{stat.value}</p>
              </div>
              <stat.icon className={`size-8 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="rounded-lg bg-white/5 ring-1 ring-white/10 p-4 hover:bg-white/10 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <action.icon className="size-6 text-neutral-400 group-hover:text-white transition-colors" />
                <span className="font-medium">{action.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Hoạt động gần đây</h2>
        <div className="rounded-lg bg-white/5 ring-1 ring-white/10 p-4">
          <div className="text-sm text-neutral-400">
            Chưa có hoạt động nào gần đây
          </div>
        </div>
      </div>
    </div>
  );
}
