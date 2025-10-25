# 🎵 VietSoul - Vietnamese Music Streaming Platform

<div align="center">

**Modern music streaming platform for Vietnamese music**

[![Next.js](https://img.shields.io/badge/Next.js-15.0.3-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue)](https://www.postgresql.org/)

[Xem Demo](#-demo) · [Báo Lỗi](https://github.com/NguyenZak/viet-soul-app/issues) · [Yêu Cầu Tính Năng](https://github.com/NguyenZak/viet-soul-app/issues)

</div>

---

## 📖 Mục Lục

- [Giới Thiệu](#-giới-thiệu)
- [Tính Năng](#-tính-năng)
- [Cài Đặt Nhanh](#-cài-đặt-nhanh)
- [Hướng Dẫn Chi Tiết](#-hướng-dẫn-chi-tiết)
- [Deploy Production](#-deploy-production)
- [Cấu Trúc Project](#-cấu-trúc-project)
- [API Endpoints](#-api-endpoints)
- [Tech Stack](#-tech-stack)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 Giới Thiệu

VietSoul là một nền tảng streaming nhạc Việt Nam hiện đại, được xây dựng với Next.js 15, React 19, TypeScript, và PostgreSQL. Dự án cung cấp trải nghiệm nghe nhạc mượt mà với giao diện đẹp mắt và tính năng quản trị đầy đủ.

### ⭐ Điểm Nổi Bật

- 🎵 **Streaming chất lượng cao** - Audio player mượt mà với HLS support
- 🎨 **UI/UX hiện đại** - Giao diện đẹp, responsive, dark theme
- 🔐 **Admin Panel mạnh mẽ** - Quản lý toàn diện nội dung
- 📝 **Lyrics đồng bộ** - Hiển thị lời bài hát theo thời gian (.lrc)
- ☁️ **Cloud Storage** - Tích hợp Cloudinary cho media
- 🚀 **Performance cao** - Built với Next.js 15 và React Server Components

## ✨ Tính Năng

### 👤 User Features
- ✅ Streaming nhạc không giới hạn
- ✅ Tìm kiếm bài hát, ca sĩ, album, thể loại
- ✅ Tạo và quản lý playlists cá nhân
- ✅ Hiển thị lyrics đồng bộ với nhạc
- ✅ Player đầy đủ chức năng (play, pause, next, prev, shuffle, repeat)
- ✅ Queue management
- ✅ Volume control & seek bar
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ User authentication & profiles

### 🔐 Admin Features
- ✅ Quản lý tracks (create, read, update, delete)
- ✅ Quản lý artists & composers
- ✅ Quản lý genres & albums
- ✅ Quản lý users
- ✅ Upload media lên Cloudinary
- ✅ Dashboard với thống kê

## 🚀 Cài Đặt Nhanh

### Yêu Cầu Hệ Thống

- **Node.js:** 20.x trở lên
- **PostgreSQL:** 14 trở lên
- **npm:** 8.x trở lên

### 1️⃣ Clone Repository

```bash
git clone https://github.com/NguyenZak/viet-soul-app.git
cd viet-soul-app
```

### 2️⃣ Cài Đặt Dependencies

```bash
cd vietsoul-web
npm install --legacy-peer-deps
```

### 3️⃣ Setup Database

#### Option A: Tự động (macOS/Linux) ⚡

```bash
cd ..
chmod +x quick-db-setup.sh
./quick-db-setup.sh
```

#### Option B: Thủ công

```bash
# Tạo database
createdb vietsoul

# Import schema
cd vietsoul-web
psql -d vietsoul -f lib/schema.sql
```

### 4️⃣ Cấu hình Environment

Tạo file `vietsoul-web/.env.local`:

```env
# Database
DATABASE_URL=postgresql://localhost:5432/vietsoul

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-change-in-production

# Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 5️⃣ Start Development Server

```bash
# Cách 1: Dùng npm
cd vietsoul-web
npm run dev

# Cách 2: Dùng script tiện lợi (recommended)
cd ..
chmod +x start-dev.sh
./start-dev.sh
```

Mở trình duyệt tại: **http://localhost:3000** 🎉

## 📚 Hướng Dẫn Chi Tiết

### 📖 Tài Liệu Đầy Đủ

- **[vietsoul-web/README.md](vietsoul-web/README.md)** - Hướng dẫn development đầy đủ
- **[VERCEL_DEPLOY_GUIDE.md](VERCEL_DEPLOY_GUIDE.md)** - Hướng dẫn deploy production
- **[SETUP_DATABASE.sql](SETUP_DATABASE.sql)** - Database schema sẵn sàng

### 🔑 Admin Login

**Thông tin đăng nhập mặc định:**

```
URL:      http://localhost:3000/admin/login
Email:    admin@vietsoul.app
Password: admin123
```

⚠️ **Lưu ý:** Đổi password ngay sau khi setup!

### 📁 Files Hữu Ích

- `quick-db-setup.sh` - Script tự động setup database PostgreSQL
- `start-dev.sh` - Script start dev server với config đầy đủ
- `vietsoul-web/lib/schema.sql` - Database schema chi tiết

## 🌐 Deploy Production

### Deploy lên Vercel (Recommended)

#### Bước 1: Tạo Database Cloud

**Option 1: Neon (Recommended)**
1. Truy cập: https://neon.tech
2. Sign up với GitHub
3. Tạo project mới, region: **Singapore**
4. Copy **Connection String** (chọn Pooled)

**Option 2: Supabase**
1. Truy cập: https://supabase.com
2. Tạo project mới
3. Lấy connection string từ Settings → Database

#### Bước 2: Import Database Schema

1. Mở SQL Editor trong Neon/Supabase
2. Copy nội dung file `SETUP_DATABASE.sql`
3. Paste và Run

#### Bước 3: Deploy lên Vercel

```bash
# Cài Vercel CLI
npm i -g vercel

# Deploy
cd vietsoul-web
vercel
```

#### Bước 4: Cấu hình Environment Variables

Trên Vercel Dashboard → Settings → Environment Variables, thêm:

```env
DATABASE_URL=postgresql://... (từ Neon/Supabase)
JWT_SECRET=your-production-secret-key
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-production-nextauth-secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Bước 5: Redeploy

Click **Redeploy** trong Deployments tab.

✅ **Done!** App của bạn đã live! 🚀

## 📁 Cấu Trúc Project

```
VietSoul/
├── vietsoul-web/              # Next.js application
│   ├── app/                   # App Router
│   │   ├── (user)/           # User-facing pages
│   │   │   ├── page.tsx      # Homepage
│   │   │   ├── artist/[id]/  # Artist pages
│   │   │   ├── genre/[id]/   # Genre pages
│   │   │   └── album/[id]/   # Album pages
│   │   ├── admin/            # Admin panel
│   │   │   ├── login/        # Admin login
│   │   │   ├── tracks/       # Manage tracks
│   │   │   ├── artists/      # Manage artists
│   │   │   └── genres/       # Manage genres
│   │   └── api/              # API routes
│   │       ├── auth/         # Authentication
│   │       ├── tracks/       # Tracks API
│   │       ├── artists/      # Artists API
│   │       ├── genres/       # Genres API
│   │       └── upload/       # Media upload
│   ├── components/           # React components
│   ├── lib/                  # Utilities & helpers
│   │   ├── database.ts       # DB connection
│   │   ├── auth.ts           # Auth utilities
│   │   └── schema.sql        # Database schema
│   ├── store/                # Zustand stores
│   ├── hooks/                # Custom React hooks
│   ├── public/               # Static assets
│   └── package.json          # Dependencies
├── quick-db-setup.sh         # Database setup script
├── start-dev.sh              # Dev server script
├── SETUP_DATABASE.sql        # Production DB schema
├── VERCEL_DEPLOY_GUIDE.md    # Deploy guide
└── README.md                 # This file
```

## 🔌 API Endpoints

### Authentication

```http
POST   /api/auth/register    # Đăng ký user mới
POST   /api/auth/login       # Đăng nhập
GET    /api/auth/me          # Lấy thông tin user hiện tại
```

### Tracks

```http
GET    /api/tracks           # Lấy danh sách tracks
POST   /api/tracks           # Tạo track mới (admin)
PUT    /api/tracks           # Cập nhật track (admin)
DELETE /api/tracks?id=:id    # Xóa track (admin)
```

### Artists

```http
GET    /api/artists          # Lấy danh sách artists
POST   /api/artists          # Tạo artist (admin)
PUT    /api/artists/:id      # Cập nhật artist (admin)
DELETE /api/artists/:id      # Xóa artist (admin)
```

### Genres

```http
GET    /api/genres           # Lấy danh sách genres
POST   /api/genres           # Tạo genre (admin)
PUT    /api/genres/:id       # Cập nhật genre (admin)
DELETE /api/genres/:id       # Xóa genre (admin)
```

### Albums

```http
GET    /api/albums           # Lấy danh sách albums
POST   /api/albums           # Tạo album (admin)
PUT    /api/albums/:id       # Cập nhật album (admin)
DELETE /api/albums/:id       # Xóa album (admin)
```

### Upload

```http
POST   /api/upload           # Upload audio file
POST   /api/upload/cover     # Upload cover image
POST   /api/upload/avatar    # Upload avatar
```

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router, React Server Components)
- **UI Library:** React 19
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **State Management:** Zustand
- **Icons:** Lucide React
- **Animations:** Framer Motion (optional)

### Backend
- **Runtime:** Node.js 20
- **Database:** PostgreSQL 14+
- **ORM:** pg (node-postgres)
- **Authentication:** JWT + bcryptjs
- **Media Storage:** Cloudinary
- **Audio Streaming:** HLS.js

### DevOps
- **Hosting:** Vercel
- **Database:** Neon / Supabase
- **CDN:** Cloudinary
- **Version Control:** Git / GitHub

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

### Cách Contribute

1. Fork repository này
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Test before submitting PR
- Update documentation if needed

## 🐛 Troubleshooting

### Lỗi thường gặp:

**1. "DATABASE_URL not configured"**
```bash
# Kiểm tra file .env.local đã tồn tại và có DATABASE_URL
cat vietsoul-web/.env.local
```

**2. "Port 3000 already in use"**
```bash
# Kill process đang dùng port 3000
lsof -ti:3000 | xargs kill -9
```

**3. "Login không hoạt động"**
```bash
# Đảm bảo JWT_SECRET đã được set và restart dev server
# Clear localStorage trong browser (F12 → Console → localStorage.clear())
```

**4. "Database connection failed"**
```bash
# Kiểm tra PostgreSQL đang chạy
brew services list | grep postgresql
# Hoặc
psql -d vietsoul -c "SELECT 1"
```

## 📄 License

Project này được phát hành dưới [MIT License](LICENSE).

## 🙏 Credits

- [Next.js](https://nextjs.org/) - The React Framework
- [Vercel](https://vercel.com/) - Deployment Platform
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Lucide](https://lucide.dev/) - Beautiful Icons
- [Cloudinary](https://cloudinary.com/) - Media Management

## 📧 Contact

**NguyenZak**
- GitHub: [@NguyenZak](https://github.com/NguyenZak)
- Repository: [viet-soul-app](https://github.com/NguyenZak/viet-soul-app)

## ⭐ Support

Nếu project này hữu ích, hãy cho một ⭐ trên GitHub!

---

<div align="center">

**Made with ❤️ in Vietnam 🇻🇳**

</div>
