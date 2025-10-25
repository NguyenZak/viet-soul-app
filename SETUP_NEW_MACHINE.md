# 🚀 Hướng Dẫn Setup VietSoul Trên Máy Mới

Hướng dẫn chi tiết để clone và chạy VietSoul trên máy mới.

---

## 📋 Yêu Cầu Hệ Thống

Trước khi bắt đầu, đảm bảo máy của bạn đã cài đặt:

- ✅ **Git** - Version control
- ✅ **Node.js** 20.x hoặc cao hơn
- ✅ **npm** 8.x hoặc cao hơn  
- ✅ **PostgreSQL** 14 hoặc cao hơn

### Kiểm Tra Version

```bash
# Kiểm tra Git
git --version

# Kiểm tra Node.js
node --version

# Kiểm tra npm
npm --version

# Kiểm tra PostgreSQL
psql --version
```

---

## 🔧 Bước 1: Cài Đặt Dependencies (Nếu Chưa Có)

### macOS

```bash
# Cài Homebrew (nếu chưa có)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Cài Node.js
brew install node@20

# Cài PostgreSQL
brew install postgresql@14
brew services start postgresql@14
```

### Windows

1. **Node.js:** Tải từ https://nodejs.org/
2. **PostgreSQL:** Tải từ https://www.postgresql.org/download/windows/
3. **Git:** Tải từ https://git-scm.com/download/win

### Ubuntu/Debian

```bash
# Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# PostgreSQL
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# Git
sudo apt-get install git
```

---

## 📥 Bước 2: Clone Repository

```bash
# Clone project từ GitHub
git clone https://github.com/NguyenZak/viet-soul-app.git

# Di chuyển vào thư mục project
cd viet-soul-app
```

---

## 📦 Bước 3: Cài Đặt Dependencies

```bash
# Di chuyển vào thư mục vietsoul-web
cd vietsoul-web

# Cài đặt packages
npm install --legacy-peer-deps
```

**Lưu ý:** Flag `--legacy-peer-deps` cần thiết để resolve peer dependency conflicts.

---

## 🗄️ Bước 4: Setup Database

### Option A: Tự Động (macOS/Linux) ⚡ Recommended

```bash
# Quay lại thư mục gốc
cd ..

# Cho phép thực thi script
chmod +x quick-db-setup.sh

# Chạy script setup
./quick-db-setup.sh
```

Script này sẽ tự động:
- ✅ Tạo database `vietsoul`
- ✅ Import schema
- ✅ Tạo tài khoản admin mặc định

### Option B: Thủ Công

#### 1. Tạo Database

```bash
# Kết nối vào PostgreSQL
psql postgres

# Trong psql console:
CREATE DATABASE vietsoul;
\q
```

#### 2. Import Schema

```bash
# Import schema vào database
psql -d vietsoul -f vietsoul-web/lib/schema.sql
```

#### 3. Tạo Admin User

```bash
# Cách 1: Dùng script
node create-admin.js

# Cách 2: Thủ công với psql
psql -d vietsoul
```

Trong psql console:
```sql
INSERT INTO users (email, password_hash, name) 
VALUES (
  'admin@vietsoul.app',
  '$2b$10$sAFe2lOfALGfSjgswQCEm.t/OOuJPsqMMT2RF1zDeE7RZxA6iDxxO',
  'Admin'
);
```

---

## ⚙️ Bước 5: Cấu Hình Environment Variables

### 1. Tạo file `.env.local`

```bash
cd vietsoul-web
cp env.example .env.local
```

### 2. Cập nhật nội dung file `.env.local`

Mở file `.env.local` và cập nhật:

```env
# Database Configuration
DATABASE_URL=postgresql://localhost:5432/vietsoul

# JWT Secret (Đổi thành giá trị bảo mật của bạn)
JWT_SECRET=your-super-secret-jwt-key-change-this

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-change-this

# Cloudinary Configuration (Optional - để upload media)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Node Environment
NODE_ENV=development
```

⚠️ **Quan trọng:** 
- Đổi `JWT_SECRET` và `NEXTAUTH_SECRET` thành giá trị unique của bạn
- Nếu không dùng Cloudinary, có thể bỏ qua các biến CLOUDINARY_*

---

## 🚀 Bước 6: Khởi Động Development Server

### Cách 1: Dùng npm (Cơ bản)

```bash
cd vietsoul-web
npm run dev
```

### Cách 2: Dùng script tiện lợi (Recommended)

```bash
# Quay lại thư mục gốc
cd ..

# Cho phép thực thi
chmod +x start-dev.sh

# Chạy script
./start-dev.sh
```

Server sẽ chạy tại: **http://localhost:3000**

---

## ✅ Bước 7: Xác Nhận Setup Thành Công

### 1. Kiểm tra Homepage

Mở trình duyệt: **http://localhost:3000**

Bạn sẽ thấy trang chủ VietSoul

### 2. Test Admin Login

1. Truy cập: **http://localhost:3000/admin/login**
2. Đăng nhập với:
   ```
   Email:    admin@vietsoul.app
   Password: admin123
   ```
3. Sau khi login thành công, bạn sẽ được redirect vào Admin Dashboard

### 3. Kiểm tra Database

```bash
# Kết nối vào database
psql -d vietsoul

# Kiểm tra tables
\dt

# Kiểm tra admin user
SELECT id, email, name FROM users;

# Thoát
\q
```

---

## 🔍 Troubleshooting

### Lỗi: "Port 3000 already in use"

```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows (CMD)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Lỗi: "Cannot connect to database"

```bash
# Kiểm tra PostgreSQL đang chạy
# macOS
brew services list

# Start PostgreSQL nếu chưa chạy
brew services start postgresql@14

# Linux
sudo systemctl status postgresql
sudo systemctl start postgresql
```

### Lỗi: "relation does not exist"

```bash
# Import lại schema
cd vietsoul-web
psql -d vietsoul -f lib/schema.sql
```

### Lỗi: npm install failed

```bash
# Xóa node_modules và package-lock.json
rm -rf node_modules package-lock.json

# Clear npm cache
npm cache clean --force

# Install lại
npm install --legacy-peer-deps
```

### Lỗi: Login không hoạt động

1. Kiểm tra `JWT_SECRET` trong `.env.local`
2. Clear localStorage trong browser:
   ```javascript
   // Mở Console (F12) và chạy:
   localStorage.clear()
   ```
3. Restart dev server
4. Thử đăng nhập lại

---

## 📁 Cấu Trúc Thư Mục

Sau khi setup xong, cấu trúc sẽ như sau:

```
viet-soul-app/
├── vietsoul-web/
│   ├── .env.local          # ⚠️ File này bạn tự tạo
│   ├── node_modules/       # ⚠️ Được tạo sau npm install
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   └── package.json
├── create-admin.js
├── start-dev.sh
├── quick-db-setup.sh
└── README.md
```

---

## 🔐 Thông Tin Đăng Nhập Mặc Định

### Admin Panel
```
URL:      http://localhost:3000/admin/login
Email:    admin@vietsoul.app
Password: admin123
```

### User Interface
```
URL:      http://localhost:3000/login
Email:    admin@vietsoul.app
Password: admin123
```

⚠️ **Bảo mật:** Đổi password ngay sau khi setup xong!

---

## 📚 Tài Liệu Bổ Sung

- **README chính:** `README.md` - Tổng quan project
- **README dev:** `vietsoul-web/README.md` - Hướng dẫn development
- **Deploy guide:** `VERCEL_DEPLOY_GUIDE.md` - Hướng dẫn deploy production
- **Database schema:** `SETUP_DATABASE.sql` - Schema đầy đủ

---

## 🛠️ Các Script Hữu Ích

### Development

```bash
# Start dev server
npm run dev

# Build production
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

### Database

```bash
# Tạo admin user mới
node create-admin.js

# Kết nối vào database
psql -d vietsoul

# Backup database
pg_dump vietsoul > backup.sql

# Restore database
psql -d vietsoul < backup.sql
```

---

## 🔄 Pull Updates Từ GitHub

Sau này khi cần update code mới nhất:

```bash
# Di chuyển vào thư mục project
cd viet-soul-app

# Pull code mới nhất
git pull origin main

# Cài đặt dependencies mới (nếu có)
cd vietsoul-web
npm install --legacy-peer-deps

# Restart dev server
npm run dev
```

---

## 🤝 Development Workflow

### Làm việc với Git

```bash
# Tạo branch mới cho feature
git checkout -b feature/your-feature-name

# Thực hiện thay đổi...

# Commit changes
git add .
git commit -m "feat: your feature description"

# Push lên GitHub
git push origin feature/your-feature-name

# Tạo Pull Request trên GitHub
```

---

## 💡 Tips

1. **Hot Reload:** Next.js tự động reload khi bạn sửa code
2. **Database Viewer:** Dùng tool như pgAdmin hoặc DBeaver để quản lý database
3. **VSCode Extensions:** Cài đặt Prettier, ESLint cho trải nghiệm dev tốt hơn
4. **Console Logs:** Mở DevTools (F12) để debug

---

## 🆘 Cần Giúp Đỡ?

- 📖 Đọc [README.md](README.md)
- 🐛 [Báo lỗi trên GitHub](https://github.com/NguyenZak/viet-soul-app/issues)
- 💬 Liên hệ: [@NguyenZak](https://github.com/NguyenZak)

---

## ✅ Checklist Setup

- [ ] Cài đặt Node.js, PostgreSQL, Git
- [ ] Clone repository từ GitHub
- [ ] Cài đặt npm dependencies
- [ ] Tạo database `vietsoul`
- [ ] Import database schema
- [ ] Tạo admin user
- [ ] Tạo file `.env.local`
- [ ] Cấu hình environment variables
- [ ] Start dev server
- [ ] Test đăng nhập admin
- [ ] Test trang chủ user

---

<div align="center">

**Happy Coding! 🎉**

Made with ❤️ in Vietnam 🇻🇳

</div>

