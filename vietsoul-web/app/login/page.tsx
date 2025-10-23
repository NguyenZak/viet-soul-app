"use client";

import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/navigation";
import { Music, Lock, Mail, Eye, EyeOff, User, Headphones } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("demo@vietsoul.app");
  const [password, setPassword] = useState("demo123");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { login, register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        await login(email, password);
        router.push("/");
      } else {
        await register(email, password, name);
        router.push("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-blue-900 to-neutral-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo và Title */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/25">
            <Headphones className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-blue-100 mb-2">VietSoul</h1>
          <p className="text-blue-300 text-lg">Khám phá âm nhạc Việt Nam</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 ring-1 ring-white/10 shadow-2xl">
          <div className="flex mb-6 bg-blue-800/20 rounded-2xl p-1">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                isLogin
                  ? "bg-blue-600/40 text-blue-100 shadow-lg ring-1 ring-blue-500/30"
                  : "text-blue-300 hover:text-blue-100 hover:bg-blue-600/10"
              }`}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                !isLogin
                  ? "bg-blue-600/40 text-blue-100 shadow-lg ring-1 ring-blue-500/30"
                  : "text-blue-300 hover:text-blue-100 hover:bg-blue-600/10"
              }`}
            >
              Đăng ký
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Tên đầy đủ
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400 group-focus-within:text-blue-300 transition-colors" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-blue-500/20 rounded-2xl text-blue-100 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent focus:bg-white/10 transition-all duration-200"
                    placeholder="Nhập tên đầy đủ"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400 group-focus-within:text-blue-300 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-blue-500/20 rounded-2xl text-blue-100 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent focus:bg-white/10 transition-all duration-200"
                  placeholder="Nhập email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                Mật khẩu
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400 group-focus-within:text-blue-300 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-14 py-4 bg-white/5 border border-blue-500/20 rounded-2xl text-blue-100 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent focus:bg-white/10 transition-all duration-200"
                  placeholder="Nhập mật khẩu"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-4 animate-pulse">
                <p className="text-red-200 text-sm font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transform hover:-translate-y-0.5"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Đang xử lý...
                </div>
              ) : (
                isLogin ? "Đăng nhập" : "Đăng ký"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push("/admin/login")}
              className="text-blue-300 hover:text-blue-100 text-sm transition-colors hover:underline"
            >
              Đăng nhập Admin →
            </button>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 bg-blue-800/20 border border-blue-500/20 rounded-2xl p-5 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3">
            <Music className="w-4 h-4 text-blue-300" />
            <h3 className="text-blue-200 font-medium">Demo Credentials</h3>
          </div>
          <div className="text-blue-300 text-sm space-y-1">
            <p><strong>Email:</strong> demo@vietsoul.app</p>
            <p><strong>Password:</strong> demo123</p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/5 rounded-xl p-3 backdrop-blur-sm">
            <Music className="w-6 h-6 text-blue-400 mx-auto mb-1" />
            <p className="text-blue-300 text-xs">Nghe nhạc</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 backdrop-blur-sm">
            <User className="w-6 h-6 text-blue-400 mx-auto mb-1" />
            <p className="text-blue-300 text-xs">Tạo playlist</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 backdrop-blur-sm">
            <Headphones className="w-6 h-6 text-blue-400 mx-auto mb-1" />
            <p className="text-blue-300 text-xs">Khám phá</p>
          </div>
        </div>
      </div>
    </div>
  );
}