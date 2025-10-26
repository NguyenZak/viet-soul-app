"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Trash2, Edit, Plus, X, Save, Upload, Image } from "lucide-react";
import { fetchArtists, createArtist, updateArtist, deleteArtist } from "../../../lib/api";

type Artist = {
  id: number;
  name: string;
  bio: string;
  avatar_url: string;
  nationality: string;
  track_count: string;
};

type ArtistFormData = {
  name: string;
  bio: string;
  nationality: string;
  avatar_url: string;
};

export default function AdminArtists() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [formData, setFormData] = useState<ArtistFormData>({
    name: "",
    bio: "",
    nationality: "",
    avatar_url: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadArtists();
  }, []);

  const loadArtists = async () => {
    try {
      const data = await fetchArtists();
      setArtists(data);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách nghệ sĩ');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingArtist(null);
    setFormData({
      name: "",
      bio: "",
      nationality: "",
      avatar_url: ""
    });
    setShowModal(true);
  };

  const handleEdit = (artist: Artist) => {
    setEditingArtist(artist);
    setFormData({
      name: artist.name,
      bio: artist.bio,
      nationality: artist.nationality,
      avatar_url: artist.avatar_url
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    // Check if it's a backend artist
    if (id < 1000) {
      alert('Không thể xóa nghệ sĩ từ hệ thống. Chỉ có thể xóa nghệ sĩ do bạn tạo.');
      return;
    }

    if (!confirm('Bạn có chắc chắn muốn xóa nghệ sĩ này?')) {
      return;
    }

    try {
      await deleteArtist(id);
      await loadArtists();
    } catch (err: any) {
      console.error('Delete error:', err);
      setError(err.message || 'Không thể xóa nghệ sĩ');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.bio || !formData.nationality) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setSubmitting(true);
    
    try {
      if (editingArtist) {
        await updateArtist(editingArtist.id, formData);
      } else {
        await createArtist(formData);
      }
      
      await loadArtists();
      setShowModal(false);
      setFormData({
        name: "",
        bio: "",
        nationality: "",
        avatar_url: ""
      });
    } catch (err: any) {
      setError(err.message || 'Không thể lưu nghệ sĩ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleAvatarUpload = async () => {
    if (!selectedFile) return;

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', selectedFile);

      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (result.success) {
        setFormData(prev => ({ ...prev, avatar_url: result.avatarUrl }));
        setSelectedFile(null);
        setPreviewUrl("");
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        alert('Upload avatar thất bại: ' + result.error);
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      alert('Upload avatar thất bại');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingArtist(null);
    setFormData({
      name: "",
      bio: "",
      nationality: "",
      avatar_url: ""
    });
    setSelectedFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Quản lý nghệ sĩ</h1>
        <div className="text-sm text-neutral-400">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Quản lý nghệ sĩ</h1>
        <div className="p-4 rounded bg-red-500/20 text-red-300">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Quản lý nghệ sĩ</h1>
        <button 
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          <span>Thêm nghệ sĩ</span>
        </button>
      </div>

      <div className="rounded-lg bg-white/5 ring-1 ring-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left p-3 text-sm font-medium">Nghệ sĩ</th>
                <th className="text-left p-3 text-sm font-medium">Quốc tịch</th>
                <th className="text-left p-3 text-sm font-medium">Số bài hát</th>
                <th className="text-left p-3 text-sm font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {artists.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-neutral-400">
                    Chưa có nghệ sĩ nào
                  </td>
                </tr>
              ) : (
                artists.map((artist) => (
                  <tr key={artist.id} className="border-t border-white/10 hover:bg-white/5">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="size-10 bg-white/10 rounded-full overflow-hidden grid place-items-center">
                          {artist.avatar_url ? (
                            <img src={artist.avatar_url} alt={artist.name} className="size-full object-cover" />
                          ) : (
                            <div className="text-xs text-neutral-400">👤</div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{artist.name}</div>
                          <div className="text-xs text-neutral-400">{artist.bio}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-sm text-neutral-400">{artist.nationality}</td>
                    <td className="p-3 text-sm text-neutral-400">{artist.track_count}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(artist)}
                          className="size-8 grid place-items-center rounded bg-white/10 hover:bg-white/15"
                          title="Chỉnh sửa"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(artist.id)}
                          className={`size-8 grid place-items-center rounded ${
                            artist.id < 1000 
                              ? 'bg-white/5 text-neutral-500 cursor-not-allowed' 
                              : 'bg-white/10 hover:bg-white/15 text-red-400 hover:text-red-300'
                          }`}
                          title={artist.id < 1000 ? "Không thể xóa nghệ sĩ hệ thống" : "Xóa"}
                          disabled={artist.id < 1000}
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
                {editingArtist ? 'Chỉnh sửa nghệ sĩ' : 'Thêm nghệ sĩ mới'}
              </h2>
              <button
                onClick={closeModal}
                className="text-neutral-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form id="artist-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Tên nghệ sĩ *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Mô tả *
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Quốc tịch *
                </label>
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={(e) => setFormData(prev => ({ ...prev, nationality: e.target.value }))}
                  className="w-full px-3 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Ảnh đại diện
                </label>
                
                {/* Current Avatar Preview */}
                {formData.avatar_url && !previewUrl && (
                  <div className="mb-3">
                    <div className="text-xs text-neutral-400 mb-2">Ảnh hiện tại:</div>
                    <img 
                      src={formData.avatar_url} 
                      alt="Current avatar" 
                      className="w-20 h-20 rounded-lg object-cover border border-neutral-600"
                    />
                  </div>
                )}

                {/* File Preview */}
                {previewUrl && (
                  <div className="mb-3">
                    <div className="text-xs text-neutral-400 mb-2">Ảnh mới:</div>
                    <div className="relative inline-block">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="w-20 h-20 rounded-lg object-cover border border-neutral-600"
                      />
                      <button
                        type="button"
                        onClick={removeSelectedFile}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                )}

                {/* File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                  className="hidden"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700 transition-colors text-sm flex items-center gap-2"
                  >
                    <Image size={16} />
                    Chọn ảnh
                  </button>

                  {selectedFile && (
                    <button
                      type="button"
                      onClick={handleAvatarUpload}
                      disabled={uploadingAvatar}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploadingAvatar ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Đang upload...
                        </>
                      ) : (
                        <>
                          <Upload size={16} />
                          Upload
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Manual URL Input */}
                <div className="mt-3">
                  <div className="text-xs text-neutral-400 mb-2">Hoặc nhập URL:</div>
                  <input
                    type="url"
                    value={formData.avatar_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, avatar_url: e.target.value }))}
                    className="w-full px-3 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none text-sm"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>

            </form>
            
            <div className="flex gap-3 p-6 pt-4 border-t border-neutral-700">
              <button
                type="submit"
                form="artist-form"
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  const form = document.getElementById('artist-form') as HTMLFormElement;
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
                    {editingArtist ? 'Cập nhật' : 'Thêm mới'}
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
