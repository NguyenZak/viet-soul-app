"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Trash2, Edit, Plus, X, Save, Palette } from "lucide-react";
import { fetchGenres, createGenre, updateGenre, deleteGenre } from "../../../lib/api";

type Genre = {
  id: number;
  name: string;
  description: string;
  color: string;
  track_count: string;
};

type GenreFormData = {
  name: string;
  description: string;
  color: string;
};

const COLOR_PRESETS = [
  { name: "Xanh dương", value: "#3B82F6" },
  { name: "Xanh lá", value: "#10B981" },
  { name: "Đỏ", value: "#EF4444" },
  { name: "Vàng", value: "#F59E0B" },
  { name: "Tím", value: "#8B5CF6" },
  { name: "Hồng", value: "#EC4899" },
  { name: "Cam", value: "#F97316" },
  { name: "Xám", value: "#6B7280" },
];

export default function AdminGenres() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
  const [formData, setFormData] = useState<GenreFormData>({
    name: "",
    description: "",
    color: "#3B82F6"
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadGenres();
  }, []);

  const loadGenres = async () => {
    try {
      const data = await fetchGenres();
      setGenres(data);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách thể loại');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingGenre(null);
    setFormData({
      name: "",
      description: "",
      color: "#3B82F6"
    });
    setShowModal(true);
  };

  const handleEdit = (genre: Genre) => {
    setEditingGenre(genre);
    setFormData({
      name: genre.name,
      description: genre.description,
      color: genre.color
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    // Check if it's a backend genre
    if (id < 1000) {
      alert('Không thể xóa thể loại từ hệ thống. Chỉ có thể xóa thể loại do bạn tạo.');
      return;
    }

    if (!confirm('Bạn có chắc chắn muốn xóa thể loại này?')) {
      return;
    }

    try {
      await deleteGenre(id);
      await loadGenres();
    } catch (err: any) {
      console.error('Delete error:', err);
      setError(err.message || 'Không thể xóa thể loại');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setSubmitting(true);
    
    try {
      if (editingGenre) {
        await updateGenre(editingGenre.id, formData);
      } else {
        await createGenre(formData);
      }
      
      await loadGenres();
      setShowModal(false);
      setFormData({
        name: "",
        description: "",
        color: "#3B82F6"
      });
    } catch (err: any) {
      console.error('Submit error:', err);
      setError(err.message || 'Không thể lưu thể loại');
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingGenre(null);
    setFormData({
      name: "",
      description: "",
      color: "#3B82F6"
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Quản lý thể loại</h1>
        <div className="text-sm text-neutral-400">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Quản lý thể loại</h1>
        <div className="p-4 rounded bg-red-500/20 text-red-300">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Quản lý thể loại</h1>
        <button 
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          <span>Thêm thể loại</span>
        </button>
      </div>

      <div className="rounded-lg bg-white/5 ring-1 ring-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left p-3 text-sm font-medium">Thể loại</th>
                <th className="text-left p-3 text-sm font-medium">Mô tả</th>
                <th className="text-left p-3 text-sm font-medium">Màu sắc</th>
                <th className="text-left p-3 text-sm font-medium">Số bài hát</th>
                <th className="text-left p-3 text-sm font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {genres.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-neutral-400">
                    Chưa có thể loại nào
                  </td>
                </tr>
              ) : (
                genres.map((genre) => (
                  <tr key={genre.id} className="border-t border-white/10 hover:bg-white/5">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: genre.color }}
                        ></div>
                        <div className="text-sm font-medium">{genre.name}</div>
                      </div>
                    </td>
                    <td className="p-3 text-sm text-neutral-400 max-w-xs truncate">
                      {genre.description}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded border border-white/20"
                          style={{ backgroundColor: genre.color }}
                        ></div>
                        <span className="text-xs text-neutral-400">{genre.color}</span>
                      </div>
                    </td>
                    <td className="p-3 text-sm text-neutral-400">{genre.track_count}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(genre)}
                          className="size-8 grid place-items-center rounded bg-white/10 hover:bg-white/15"
                          title="Chỉnh sửa"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(genre.id)}
                          className={`size-8 grid place-items-center rounded ${
                            genre.id < 1000 
                              ? 'bg-white/5 text-neutral-500 cursor-not-allowed' 
                              : 'bg-white/10 hover:bg-white/15 text-red-400 hover:text-red-300'
                          }`}
                          title={genre.id < 1000 ? "Không thể xóa thể loại hệ thống" : "Xóa"}
                          disabled={genre.id < 1000}
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

      {/* Modal */}
      {showModal && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[99999] p-4">
          <div className="bg-neutral-800 rounded-lg w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 pb-4 border-b border-neutral-700">
              <h2 className="text-lg font-semibold text-white">
                {editingGenre ? 'Chỉnh sửa thể loại' : 'Thêm thể loại mới'}
              </h2>
              <button
                onClick={closeModal}
                className="text-neutral-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form id="genre-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Tên thể loại *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Nhập tên thể loại..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Mô tả *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Nhập mô tả thể loại..."
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Màu sắc
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      className="w-12 h-8 rounded border border-neutral-600"
                    />
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      className="flex-1 px-3 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none text-sm"
                      placeholder="#3B82F6"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2">
                    {COLOR_PRESETS.map((preset) => (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, color: preset.value }))}
                        className={`p-2 rounded-lg border transition-colors ${
                          formData.color === preset.value 
                            ? 'border-white ring-2 ring-white/20' 
                            : 'border-neutral-600 hover:border-neutral-500'
                        }`}
                        style={{ backgroundColor: preset.value }}
                        title={preset.name}
                      >
                        <div className="w-full h-4 rounded"></div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </form>
            
            <div className="flex gap-3 p-6 pt-4 border-t border-neutral-700">
              <button
                type="submit"
                form="genre-form"
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  const form = document.getElementById('genre-form') as HTMLFormElement;
                  if (form) form.requestSubmit();
                }}
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    {editingGenre ? 'Cập nhật' : 'Tạo mới'}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700 transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
