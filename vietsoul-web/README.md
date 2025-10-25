# 🎵 VietSoul - Music Streaming Platform

VietSoul là một nền tảng streaming nhạc Việt Nam hiện đại, được xây dựng với Next.js 15, PostgreSQL, và Cloudinary.

![Next.js](https://img.shields.io/badge/Next.js-15.0.3-black)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue)

## ✨ Tính Năng

- 🎵 **Streaming nhạc** - Phát nhạc trực tuyến mượt mà
- 🎤 **Quản lý nghệ sĩ** - Thông tin chi tiết về ca sĩ, nhạc sĩ
- 💿 **Albums & Playlists** - Tổ chức nhạc theo album và playlist
- 🎨 **Giao diện đẹp** - UI hiện đại, responsive
- 🔐 **Admin Panel** - Quản lý nội dung dễ dàng
- 📝 **Lyrics hiển thị** - Hiển thị lời bài hát đồng bộ (.lrc)
- 🎨 **Player tùy chỉnh** - Audio player với đầy đủ tính năng
- ☁️ **Cloud Storage** - Lưu trữ media trên Cloudinary

## 🚀 Bắt Đầu

### Yêu Cầu Hệ Thống

- Node.js 20.x trở lên
- PostgreSQL 14 trở lên
- npm 8.x trở lên

### 1. Clone Repository

```bash
git clone https://github.com/NguyenZak/viet-soul-app.git
cd viet-soul-app/vietsoul-web
```

### 2. Cài Đặt Dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Setup Database

#### Option 1: Dùng Script Tự Động (macOS/Linux)

```bash
# Đảm bảo PostgreSQL đã được cài đặt
brew install postgresql@14
brew services start postgresql@14

# Chạy script setup
cd ..
chmod +x quick-db-setup.sh
./quick-db-setup.sh
```

#### Option 2: Setup Thủ Công

```bash
# Tạo database
createdb vietsoul

# Import schema
psql -d vietsoul -f lib/schema.sql
```

### 4. Cấu Hình Environment Variables

Tạo file `.env.local`:

```bash
# Database
DATABASE_URL=postgresql://localhost:5432/vietsoul

# JWT Secret for authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-change-this-in-production

# Cloudinary (Optional - để upload media)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Lưu ý:** Thay đổi các giá trị `secret` trong production!

### 5. Tạo Admin User

```bash
# Sử dụng psql
psql -d vietsoul

# Trong psql console:
INSERT INTO users (email, password_hash, name) 
VALUES (
  'admin@vietsoul.app',
  '$2b$10$sAFe2lOfALGfSjgswQCEm.t/OOuJPsqMMT2RF1zDeE7RZxA6iDxxO',
  'Admin'
);
```

**Thông tin đăng nhập:**
- Email: `admin@vietsoul.app`
- Password: `admin123`

### 6. Chạy Development Server

```bash
npm run dev
```

Hoặc sử dụng script tiện lợi:

```bash
cd ..
chmod +x start-dev.sh
./start-dev.sh
```

Server sẽ chạy tại: http://localhost:3000

## 📱 Sử Dụng

### User Interface

- **Trang chủ:** http://localhost:3000
- **Nghệ sĩ:** http://localhost:3000/artist/[slug]
- **Thể loại:** http://localhost:3000/genre/[slug]
- **Album:** http://localhost:3000/album/[slug]

### Admin Panel

- **Login:** http://localhost:3000/admin/login
- **Dashboard:** http://localhost:3000/admin
- **Quản lý tracks:** http://localhost:3000/admin/tracks
- **Quản lý artists:** http://localhost:3000/admin/artists
- **Quản lý genres:** http://localhost:3000/admin/genres
- **Quản lý albums:** http://localhost:3000/admin/albums

**Đăng nhập Admin:**
- Email: `admin@vietsoul.app`
- Password: `admin123`

## 🏗️ Cấu Trúc Project

```
vietsoul-web/
├── app/                      # Next.js App Router
│   ├── (user)/              # User-facing pages
│   │   ├── page.tsx         # Trang chủ
│   │   ├── artist/[id]/     # Trang nghệ sĩ
│   │   ├── genre/[id]/      # Trang thể loại
│   │   └── album/[id]/      # Trang album
│   ├── admin/               # Admin pages
│   │   ├── login/           # Admin login
│   │   ├── tracks/          # Quản lý tracks
│   │   ├── artists/         # Quản lý artists
│   │   └── genres/          # Quản lý genres
│   └── api/                 # API routes
│       ├── auth/            # Authentication
│       ├── tracks/          # Tracks API
│       └── upload/          # Upload API
├── components/              # React components
├── lib/                     # Libraries & utilities
│   ├── database.ts          # Database connection
│   ├── auth.ts              # Authentication
│   └── schema.sql           # Database schema
├── store/                   # Zustand state management
├── hooks/                   # Custom React hooks
└── public/                  # Static assets
```

## 🛠️ Scripts

```bash
npm run dev          # Chạy development server
npm run build        # Build production
npm run start        # Chạy production server
npm run lint         # Chạy ESLint
npm run setup-db     # Setup database
```

## 🌐 Deploy Lên Production

### Deploy lên Vercel

1. **Tạo database trên Neon/Supabase:**
   - Truy cập: https://neon.tech hoặc https://supabase.com
   - Tạo project mới
   - Copy connection string

2. **Deploy lên Vercel:**
   ```bash
   # Cài Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

3. **Cấu hình Environment Variables trên Vercel:**
   - Vào Project Settings → Environment Variables
   - Thêm các biến:
     - `DATABASE_URL`
     - `JWT_SECRET`
     - `NEXTAUTH_URL` (URL production)
     - `NEXTAUTH_SECRET`
     - `CLOUDINARY_*` (nếu dùng)

4. **Import database schema:**
   - Copy nội dung `lib/schema.sql`
   - Chạy trong SQL Editor của Neon/Supabase

### Deploy Manual

Xem file `VERCEL_DEPLOY_GUIDE.md` để biết chi tiết.

## 📊 Database Schema

Database bao gồm các bảng:

- `users` - Người dùng
- `artists` - Ca sĩ
- `composers` - Nhạc sĩ
- `genres` - Thể loại
- `albums` - Albums
- `tracks` - Bài hát
- `playlists` - Playlists
- `playlist_tracks` - Tracks trong playlist

Xem chi tiết trong `lib/schema.sql`

## 🔐 Authentication

- Sử dụng **JWT** cho authentication
- Passwords được hash bằng **bcrypt**
- Session được lưu trong **localStorage**

## 📝 API Endpoints

### Authentication

```
POST /api/auth/login       # Đăng nhập
POST /api/auth/register    # Đăng ký
GET  /api/auth/me          # Lấy thông tin user hiện tại
```

### Tracks

```
GET    /api/tracks         # Lấy danh sách tracks
POST   /api/tracks         # Tạo track mới
PUT    /api/tracks         # Cập nhật track
DELETE /api/tracks?id=:id  # Xóa track
```

### Artists

```
GET    /api/artists        # Lấy danh sách artists
POST   /api/artists        # Tạo artist mới
PUT    /api/artists/:id    # Cập nhật artist
DELETE /api/artists/:id    # Xóa artist
```

### Genres

```
GET    /api/genres         # Lấy danh sách genres
POST   /api/genres         # Tạo genre mới
PUT    /api/genres/:id     # Cập nhật genre
DELETE /api/genres/:id     # Xóa genre
```

## 🎨 Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript
- **Styling:** Tailwind CSS 4
- **State Management:** Zustand
- **Database:** PostgreSQL
- **ORM:** pg (node-postgres)
- **Authentication:** JWT, bcrypt
- **Media Storage:** Cloudinary
- **Audio:** HTML5 Audio API, HLS.js

## 🐛 Troubleshooting

### Lỗi: "DATABASE_URL not configured"

Đảm bảo file `.env.local` đã được tạo và chứa `DATABASE_URL`.

### Lỗi: "Port 3000 already in use"

```bash
# Kill process đang dùng port 3000
lsof -ti:3000 | xargs kill -9
```

### Lỗi: Login không hoạt động

1. Kiểm tra `JWT_SECRET` đã được set trong `.env.local`
2. Restart dev server
3. Clear localStorage trong browser

### Lỗi: "relation does not exist"

Chạy lại schema:
```bash
psql -d vietsoul -f lib/schema.sql
```

## 📄 License

MIT License - Xem file LICENSE để biết chi tiết.

## 👥 Contributors

- **NguyenZak** - Initial work

## 🤝 Contributing

Pull requests are welcome! Để contribute:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📧 Contact

- GitHub: [@NguyenZak](https://github.com/NguyenZak)
- Repository: [viet-soul-app](https://github.com/NguyenZak/viet-soul-app)

---

Made with ❤️ in Vietnam 🇻🇳
