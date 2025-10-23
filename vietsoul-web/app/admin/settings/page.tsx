"use client";

import { useState } from "react";
import { Save, Database, Bell, Shield, Palette } from "lucide-react";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: "VietSoul",
    siteDescription: "VietSoul – Spotify-like music streaming web app",
    allowRegistration: true,
    maxFileSize: 50,
    allowedFileTypes: ["mp3", "wav", "flac", "m4a"],
    maintenanceMode: false,
    emailNotifications: true,
    pushNotifications: true,
    theme: "dark"
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // TODO: Implement settings save logic
    setTimeout(() => {
      setSaving(false);
      // Show success message
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Cài đặt hệ thống</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Save size={16} />
          <span>{saving ? "Đang lưu..." : "Lưu thay đổi"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="rounded-lg bg-white/5 ring-1 ring-white/10 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="size-6 text-blue-400" />
            <h2 className="text-lg font-semibold">Cài đặt chung</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tên trang web</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Mô tả trang web</label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Cho phép đăng ký</label>
                <p className="text-xs text-neutral-400">Người dùng có thể tự đăng ký tài khoản</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowRegistration}
                  onChange={(e) => setSettings({...settings, allowRegistration: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* File Upload Settings */}
        <div className="rounded-lg bg-white/5 ring-1 ring-white/10 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="size-6 text-green-400" />
            <h2 className="text-lg font-semibold">Cài đặt upload</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Kích thước file tối đa (MB)</label>
              <input
                type="number"
                value={settings.maxFileSize}
                onChange={(e) => setSettings({...settings, maxFileSize: parseInt(e.target.value)})}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Định dạng file được phép</label>
              <div className="flex flex-wrap gap-2">
                {settings.allowedFileTypes.map((type, index) => (
                  <span key={index} className="px-2 py-1 bg-white/10 rounded text-sm">
                    .{type}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Chế độ bảo trì</label>
                <p className="text-xs text-neutral-400">Tạm thời tắt trang web</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="rounded-lg bg-white/5 ring-1 ring-white/10 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="size-6 text-yellow-400" />
            <h2 className="text-lg font-semibold">Thông báo</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Email thông báo</label>
                <p className="text-xs text-neutral-400">Gửi thông báo qua email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Push thông báo</label>
                <p className="text-xs text-neutral-400">Thông báo đẩy trên trình duyệt</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.pushNotifications}
                  onChange={(e) => setSettings({...settings, pushNotifications: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="rounded-lg bg-white/5 ring-1 ring-white/10 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="size-6 text-purple-400" />
            <h2 className="text-lg font-semibold">Giao diện</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Chủ đề</label>
              <select
                value={settings.theme}
                onChange={(e) => setSettings({...settings, theme: e.target.value})}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="dark">Tối</option>
                <option value="light">Sáng</option>
                <option value="auto">Tự động</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
