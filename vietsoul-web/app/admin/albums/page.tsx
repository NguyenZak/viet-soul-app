"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Trash2, Edit, Plus, X, Save, Upload, Image, Disc } from "lucide-react";
import { fetchAlbums, createAlbum, updateAlbum, deleteAlbum } from "../../../lib/api";

type Album = {
  id: number;
  title: string;
  artist: string;
  release_year: number;
  cover_url: string;
  track_count: string;
};

type AlbumFormData = {
  title: string;
  artist: string;
  release_year: number;
  cover_url: string;
};

export default function AdminAlbums() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [formData, setFormData] = useState<AlbumFormData>({
    title: "",
    artist: "",
    release_year: new Date().getFullYear(),
    cover_url: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadAlbums();
  }, []);

  const loadAlbums = async () => {
    try {
      const data = await fetchAlbums();
      setAlbums(data);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách album');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingAlbum(null);
    setFormData({
      title: "",
      artist: "",
      release_year: new Date().getFullYear(),
      cover_url: ""
    });
    setShowModal(true);
  };

  const handleEdit = (album: Album) => {
    setEditingAlbum(album);
    setFormData({
      title: album.title,
      artist: album.artist,
      release_year: album.release_year,
      cover_url: album.cover_url
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    // Check if it's a backend album
    if (id < 1000) {
      alert('Không thể xóa album từ hệ thống. Chỉ có thể xóa album do bạn tạo.');
      return;
    }

    if (!confirm('Bạn có chắc chắn muốn xóa album này?')) {
      return;
    }

    try {
      await deleteAlbum(id);
      await loadAlbums();
    } catch (err: any) {
      console.error('Delete error:', err);
      setError(err.message || 'Không thể xóa album');
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleCoverUpload = async () => {
    if (!selectedFile) return;

    setUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append('cover', selectedFile);

      const response = await fetch('/api/upload/cover', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (result.success) {
        setFormData(prev => ({ ...prev, cover_url: result.coverUrl }));
        setSelectedFile(null);
        setPreviewUrl("");
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        alert('Upload ảnh bìa thất bại: ' + result.error);
      }
    } catch (error) {
      console.error('Cover upload error:', error);
      alert('Upload ảnh bìa thất bại');
    } finally {
      setUploadingCover(false);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.artist) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setSubmitting(true);
    
    try {
      if (editingAlbum) {
        await updateAlbum(editingAlbum.id, formData);
      } else {
        await createAlbum(formData);
      }
      
      await loadAlbums();
      setShowModal(false);
      setFormData({
        title: "",
        artist: "",
        release_year: new Date().getFullYear(),
        cover_url: ""
      });
      setSelectedFile(null);
      setPreviewUrl("");
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      console.error('Submit error:', err);
      setError(err.message || 'Không thể lưu album');
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAlbum(null);
    setFormData({
      title: "",
      artist: "",
      release_year: new Date().getFullYear(),
      cover_url: ""
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
        <h1 className="text-2xl font-semibold">Quản lý album</h1>
        <div className="text-sm text-neutral-400">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Quản lý album</h1>
        <div className="p-4 rounded bg-red-500/20 text-red-300">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Quản lý album</h1>
        <button 
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          <span>Thêm album</span>
        </button>
      </div>

      <div className="rounded-lg bg-white/5 ring-1 ring-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left p-3 text-sm font-medium">Album</th>
                <th className="text-left p-3 text-sm font-medium">Nghệ sĩ</th>
                <th className="text-left p-3 text-sm font-medium">Năm phát hành</th>
                <th className="text-left p-3 text-sm font-medium">Số bài hát</th>
                <th className="text-left p-3 text-sm font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {albums.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-neutral-400">
                    Chưa có album nào
                  </td>
                </tr>
              ) : (
                albums.map((album) => (
                  <tr key={album.id} className="border-t border-white/10 hover:bg-white/5">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="size-12 bg-neutral-700 rounded overflow-hidden">
                          {album.cover_url ? (
                            <img 
                              src={album.cover_url} 
                              alt={album.title} 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Disc size={20} className="text-neutral-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{album.title}</div>
                          <div className="text-xs text-neutral-400">
                            {album.cover_url ? 'Có ảnh bìa' : 'Không có ảnh bìa'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-sm">{album.artist}</td>
                    <td className="p-3 text-sm text-neutral-400">{album.release_year}</td>
                    <td className="p-3 text-sm text-neutral-400">{album.track_count}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(album)}
                          className="size-8 grid place-items-center rounded bg-white/10 hover:bg-white/15"
                          title="Chỉnh sửa"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(album.id)}
                          className={`size-8 grid place-items-center rounded ${
                            album.id < 1000 
                              ? 'bg-white/5 text-neutral-500 cursor-not-allowed' 
                              : 'bg-white/10 hover:bg-white/15 text-red-400 hover:text-red-300'
                          }`}
                          title={album.id < 1000 ? "Không thể xóa album hệ thống" : "Xóa"}
                          disabled={album.id < 1000}
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
                {editingAlbum ? 'Chỉnh sửa album' : 'Thêm album mới'}
              </h2>
              <button
                onClick={closeModal}
                className="text-neutral-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form id="album-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Tên album *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Nhập tên album..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Nghệ sĩ *
                </label>
                <input
                  type="text"
                  value={formData.artist}
                  onChange={(e) => setFormData(prev => ({ ...prev, artist: e.target.value }))}
                  className="w-full px-3 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Nhập tên nghệ sĩ..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Năm phát hành
                </label>
                <input
                  type="number"
                  value={formData.release_year}
                  onChange={(e) => setFormData(prev => ({ ...prev, release_year: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Ảnh bìa
                </label>
                
                {/* Current Cover Preview */}
                {formData.cover_url && !previewUrl && (
                  <div className="mb-3">
                    <div className="text-xs text-neutral-400 mb-2">Ảnh hiện tại:</div>
                    <img 
                      src={formData.cover_url} 
                      alt="Current cover" 
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
                      onClick={handleCoverUpload}
                      disabled={uploadingCover}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploadingCover ? (
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
                    value={formData.cover_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, cover_url: e.target.value }))}
                    className="w-full px-3 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none text-sm"
                    placeholder="https://example.com/cover.jpg"
                  />
                </div>
              </div>
            </form>
            
            <div className="flex gap-3 p-6 pt-4 border-t border-neutral-700">
              <button
                type="submit"
                form="album-form"
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  const form = document.getElementById('album-form') as HTMLFormElement;
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
                    {editingAlbum ? 'Cập nhật' : 'Tạo mới'}
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