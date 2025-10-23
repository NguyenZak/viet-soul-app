"use client";

import { useState, useEffect } from "react";
import { Trash2, Edit, Shield, User } from "lucide-react";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  last_login?: string;
};

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for now
    setUsers([
      {
        id: "1",
        name: "Admin User",
        email: "admin@vietsoul.app",
        role: "admin",
        created_at: "2024-01-01",
        last_login: "2024-01-15"
      },
      {
        id: "2",
        name: "John Doe",
        email: "john@example.com", 
        role: "user",
        created_at: "2024-01-02",
        last_login: "2024-01-14"
      },
      {
        id: "3",
        name: "Jane Smith",
        email: "jane@example.com",
        role: "user", 
        created_at: "2024-01-03",
        last_login: "2024-01-13"
      }
    ]);
    setLoading(false);
  }, []);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "text-red-400 bg-red-400/20";
      case "moderator":
        return "text-yellow-400 bg-yellow-400/20";
      default:
        return "text-blue-400 bg-blue-400/20";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Quản lý người dùng</h1>
        <div className="text-sm text-neutral-400">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Quản lý người dùng</h1>
        <div className="text-sm text-neutral-400">{users.length} người dùng</div>
      </div>

      <div className="rounded-lg bg-white/5 ring-1 ring-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left p-3 text-sm font-medium">Người dùng</th>
                <th className="text-left p-3 text-sm font-medium">Email</th>
                <th className="text-left p-3 text-sm font-medium">Vai trò</th>
                <th className="text-left p-3 text-sm font-medium">Đăng ký</th>
                <th className="text-left p-3 text-sm font-medium">Đăng nhập cuối</th>
                <th className="text-left p-3 text-sm font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-neutral-400">
                    Chưa có người dùng nào
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-t border-white/10 hover:bg-white/5">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="size-8 bg-white/10 rounded-full overflow-hidden grid place-items-center">
                          <User size={16} className="text-neutral-400" />
                        </div>
                        <div className="text-sm font-medium">{user.name}</div>
                      </div>
                    </td>
                    <td className="p-3 text-sm text-neutral-400">{user.email}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-neutral-400">
                      {new Date(user.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="p-3 text-sm text-neutral-400">
                      {user.last_login ? new Date(user.last_login).toLocaleDateString('vi-VN') : 'Chưa đăng nhập'}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <button
                          className="size-8 grid place-items-center rounded bg-white/10 hover:bg-white/15"
                          title="Chỉnh sửa"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="size-8 grid place-items-center rounded bg-white/10 hover:bg-white/15"
                          title="Phân quyền"
                        >
                          <Shield size={16} />
                        </button>
                        <button
                          className="size-8 grid place-items-center rounded bg-white/10 hover:bg-white/15 text-red-400 hover:text-red-300"
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
