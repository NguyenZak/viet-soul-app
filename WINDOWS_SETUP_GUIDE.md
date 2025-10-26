# 🪟 Hướng Dẫn Cài Đặt VietSoul Trên Windows

Hướng dẫn chi tiết từng bước để setup và chạy VietSoul trên Windows 10/11.

---

## 📋 Yêu Cầu Hệ Thống

- ✅ **Windows 10/11** (64-bit)
- ✅ **Ít nhất 4GB RAM**
- ✅ **Ít nhất 2GB ổ cứng trống**
- ✅ **Kết nối Internet** (để tải dependencies)

---

## 🔧 Bước 1: Cài Đặt Node.js

### 1.1. Download Node.js

1. Truy cập: https://nodejs.org/
2. Tải phiên bản **LTS (20.x)** - Nút màu xanh lá
3. Chọn file **Windows Installer (.msi)** 64-bit

### 1.2. Cài Đặt

1. Chạy file `.msi` vừa tải
2. Click **Next** → **Next** → **Next**
3. ✅ **Quan trọng**: Tick vào ô **"Automatically install necessary tools"**
4. Click **Install** → Chờ cài đặt xong
5. Click **Finish**

### 1.3. Kiểm Tra

Mở **PowerShell** (hoặc **Command Prompt**) và chạy:

```powershell
node --version
# Kết quả: v20.x.x

npm --version  
# Kết quả: 10.x.x hoặc cao hơn
```

✅ Nếu thấy version numbers → Cài đặt thành công!

---

## 🗄️ Bước 2: Cài Đặt PostgreSQL

### 2.1. Download PostgreSQL

1. Truy cập: https://www.postgresql.org/download/windows/
2. Click **"Download the installer"**
3. Chọn phiên bản **PostgreSQL 14** hoặc cao hơn (Windows x86-64)

### 2.2. Cài Đặt

1. Chạy file installer vừa tải
2. Click **Next**
3. **Installation Directory**: Để mặc định → **Next**
4. **Components**: Tick tất cả → **Next**
5. **Data Directory**: Để mặc định → **Next**
6. **Password**: 
   - Nhập password cho user `postgres` (ví dụ: `postgres123`)
   - ⚠️ **GHI NHỚ PASSWORD NÀY** - Sẽ cần dùng sau!
7. **Port**: Để mặc định `5432` → **Next**
8. **Locale**: Để mặc định → **Next**
9. Click **Next** → **Next** → **Finish**

### 2.3. Thêm PostgreSQL vào PATH (Quan Trọng!)

1. Mở **Start Menu** → Gõ `"Environment Variables"`
2. Click **"Edit the system environment variables"**
3. Click nút **"Environment Variables..."**
4. Trong **System variables**, tìm và chọn **Path** → Click **Edit**
5. Click **New** → Thêm:
   ```
   C:\Program Files\PostgreSQL\14\bin
   ```
6. Click **OK** → **OK** → **OK**

### 2.4. Kiểm Tra

**Mở PowerShell MỚI** (đóng cái cũ đi) và chạy:

```powershell
psql --version
# Kết quả: psql (PostgreSQL) 14.x
```

✅ Thành công!

---

## 🔐 Bước 3: Cài Đặt Git

### 3.1. Download Git

1. Truy cập: https://git-scm.com/download/win
2. Tải **64-bit Git for Windows Setup**

### 3.2. Cài Đặt

1. Chạy installer
2. Click **Next** qua tất cả các bước (dùng mặc định)
3. ✅ Đảm bảo tick: **"Git from the command line and also from 3rd-party software"**
4. Click **Install** → **Finish**

### 3.3. Kiểm Tra

Mở **PowerShell mới** và chạy:

```powershell
git --version
# Kết quả: git version 2.x.x
```

✅ Thành công!

---

## 📥 Bước 4: Clone Project Từ GitHub

### 4.1. Tạo Thư Mục Làm Việc

```powershell
# Tạo thư mục Projects (hoặc tên bạn muốn)
cd C:\Users\$env:USERNAME\Documents
mkdir Projects
cd Projects
```

### 4.2. Clone Repository

```powershell
git clone https://github.com/NguyenZak/viet-soul-app.git
cd viet-soul-app
```

✅ Project đã được tải về!

---

## 📦 Bước 5: Cài Đặt Dependencies

```powershell
# Di chuyển vào thư mục vietsoul-web
cd vietsoul-web

# Cài đặt packages
npm install --legacy-peer-deps
```

⏳ Đợi khoảng 3-5 phút để tải và cài đặt...

✅ Xong khi thấy dòng: `added xxx packages`

---

## 🗄️ Bước 6: Setup Database

### 6.1. Tạo Database

Mở **PowerShell** và chạy:

```powershell
# Kết nối vào PostgreSQL (nhập password bạn đã tạo ở bước 2.2)
psql -U postgres

# Trong psql console, chạy:
CREATE DATABASE vietsoul;

# Thoát psql
\q
```

### 6.2. Import Schema

```powershell
# Import schema vào database
psql -U postgres -d vietsoul -f lib/schema.sql
```

Nhập password khi được hỏi.

### 6.3. Tạo Admin User

```powershell
# Quay lại thư mục gốc
cd ..

# Tạo admin user
node create-admin.js
```

✅ Admin user đã được tạo!

---

## ⚙️ Bước 7: Cấu Hình Environment Variables

### 7.1. Tạo File `.env.local`

```powershell
# Di chuyển vào vietsoul-web
cd vietsoul-web

# Copy file example
copy env.example .env.local
```

### 7.2. Chỉnh Sửa File `.env.local`

Mở file `.env.local` bằng **Notepad** hoặc **VSCode** và cập nhật:

```env
# Database Configuration
# ⚠️ Thay YOUR_PASSWORD bằng password PostgreSQL bạn đã tạo
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/vietsoul

# JWT Secret
JWT_SECRET=vietsoul-super-secret-jwt-key-2024

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=vietsoul-nextauth-secret-2024

# Cloudinary (Optional - Để upload media)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Node Environment
NODE_ENV=development
```

**Ví dụ DATABASE_URL:**
```env
# Nếu password là "postgres123"
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/vietsoul
```

💾 **Lưu file** và đóng lại.

---

## 🚀 Bước 8: Khởi Động Development Server

### Cách 1: Dùng npm (Recommended cho Windows)

```powershell
# Đảm bảo bạn đang ở thư mục vietsoul-web
npm run dev
```

### Cách 2: Dùng Git Bash (Nếu muốn dùng script)

1. Cài **Git Bash** (đã có khi cài Git)
2. Mở **Git Bash**
3. Chạy:

```bash
cd "/c/Users/YOUR_USERNAME/Documents/Projects/viet-soul-app"
./start-dev.sh
```

### Kết Quả

Terminal sẽ hiển thị:

```
▲ Next.js 15.0.3
- Local:        http://localhost:3000
- Environments: .env.local

✓ Ready in 5s
```

✅ **Server đã chạy thành công!**

---

## ✅ Bước 9: Kiểm Tra Hoạt Động

### 9.1. Mở Trình Duyệt

1. Mở **Chrome** hoặc **Edge**
2. Truy cập: http://localhost:3000

✅ Bạn sẽ thấy trang chủ VietSoul!

### 9.2. Test Admin Login

1. Truy cập: http://localhost:3000/admin/login
2. Đăng nhập:
   ```
   Email:    admin@vietsoul.app
   Password: admin123
   ```
3. ✅ Vào được Admin Dashboard!

---

## 🐛 Troubleshooting (Xử Lý Lỗi)

### ❌ Lỗi: "Port 3000 already in use"

**PowerShell:**
```powershell
# Tìm process đang dùng port 3000
netstat -ano | findstr :3000

# Sẽ thấy kết quả như:
# TCP    0.0.0.0:3000    0.0.0.0:0    LISTENING    12345
# Số cuối (12345) là PID

# Kill process đó
taskkill /PID 12345 /F
```

**Hoặc dùng lệnh đơn giản hơn:**
```powershell
# Tìm và kill ngay
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
```

### ❌ Lỗi: "Cannot connect to database"

**Kiểm tra PostgreSQL đang chạy:**

1. Mở **Services** (Win + R → gõ `services.msc`)
2. Tìm **"postgresql-x64-14"** hoặc **"PostgreSQL 14"**
3. Nếu Status không phải **"Running"**:
   - Click chuột phải → **Start**

**Hoặc dùng PowerShell:**
```powershell
# Start PostgreSQL service
net start postgresql-x64-14
```

### ❌ Lỗi: "psql: command not found"

PostgreSQL chưa được thêm vào PATH. Làm theo **Bước 2.3** ở trên.

### ❌ Lỗi: "relation does not exist"

Database chưa có schema. Import lại:

```powershell
cd vietsoul-web
psql -U postgres -d vietsoul -f lib/schema.sql
```

### ❌ Lỗi: npm install failed

```powershell
# Xóa và cài lại
rm -r node_modules
rm package-lock.json
npm cache clean --force
npm install --legacy-peer-deps
```

---

## 🛠️ Tools Hữu Ích Cho Windows

### 1. **Windows Terminal** (Recommended)
- Tải từ Microsoft Store
- Terminal hiện đại, đẹp hơn CMD/PowerShell mặc định

### 2. **VSCode** (Code Editor)
- Tải từ: https://code.visualstudio.com/
- Extensions khuyên dùng:
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - Prettier - Code formatter
  - ESLint

### 3. **pgAdmin 4** (Database Manager)
- Đã có khi cài PostgreSQL
- Hoặc tải từ: https://www.pgadmin.org/download/
- Quản lý database bằng giao diện đồ họa

### 4. **Git GUI Tools**
- **GitHub Desktop**: https://desktop.github.com/
- **GitKraken**: https://www.gitkraken.com/
- Dễ sử dụng hơn Git command line

---

## 📁 Cấu Trúc Thư Mục Sau Khi Setup

```
C:\Users\YourName\Documents\Projects\
└── viet-soul-app\
    ├── vietsoul-web\
    │   ├── .env.local          ⚠️ Tự tạo
    │   ├── node_modules\       ⚠️ Tự sinh sau npm install
    │   ├── app\
    │   ├── components\
    │   ├── lib\
    │   ├── public\
    │   ├── package.json
    │   └── ...
    ├── create-admin.js
    ├── start-dev.sh            ⚠️ Dùng Git Bash
    ├── quick-db-setup.sh       ⚠️ Dùng Git Bash
    └── README.md
```

---

## 🚀 Chạy Project Trên Windows

### PowerShell (Recommended)

```powershell
# Di chuyển vào thư mục project
cd "C:\Users\YourName\Documents\Projects\viet-soul-app\vietsoul-web"

# Chạy dev server
npm run dev
```

### Command Prompt (CMD)

```cmd
cd C:\Users\YourName\Documents\Projects\viet-soul-app\vietsoul-web
npm run dev
```

### Git Bash (Nếu muốn dùng shell scripts)

```bash
cd /c/Users/YourName/Documents/Projects/viet-soul-app
./start-dev.sh
```

---

## 🌐 Truy Cập Ứng Dụng

Sau khi server chạy thành công:

### User Interface
- **Trang chủ**: http://localhost:3000
- **Đăng nhập**: http://localhost:3000/login
- **Thư viện**: http://localhost:3000/library
- **Nghệ sĩ**: http://localhost:3000/artists
- **Thể loại**: http://localhost:3000/genres
- **Albums**: http://localhost:3000/albums

### Admin Panel
- **Login**: http://localhost:3000/admin/login
- **Dashboard**: http://localhost:3000/admin
- **Quản lý bài hát**: http://localhost:3000/admin/tracks
- **Quản lý nghệ sĩ**: http://localhost:3000/admin/artists
- **Quản lý thể loại**: http://localhost:3000/admin/genres
- **Quản lý albums**: http://localhost:3000/admin/albums

### 🔐 Thông Tin Đăng Nhập
```
Email:    admin@vietsoul.app
Password: admin123
```

---

## 🔄 Dừng Server

Có 3 cách:

### Cách 1: Trong Terminal đang chạy server
- Nhấn **Ctrl + C**

### Cách 2: PowerShell
```powershell
# Tìm và kill process
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
```

### Cách 3: Task Manager
1. Nhấn **Ctrl + Shift + Esc**
2. Tab **Details**
3. Tìm **node.exe**
4. Click chuột phải → **End Task**

---

## 📝 Các Lệnh Thường Dùng

### Development

```powershell
# Khởi động dev server
npm run dev

# Build production
npm run build

# Start production server (sau khi build)
npm start

# Lint code
npm run lint
```

### Database

```powershell
# Kết nối vào database
psql -U postgres -d vietsoul

# Trong psql, các lệnh hữu ích:
\dt          # Xem danh sách tables
\d tracks    # Xem cấu trúc table tracks
SELECT * FROM tracks LIMIT 5;  # Xem dữ liệu

\q           # Thoát
```

### Git

```powershell
# Pull code mới nhất
git pull origin main

# Xem trạng thái
git status

# Xem log
git log --oneline -10
```

---

## 🎯 Checklist Setup Hoàn Chỉnh

- [ ] ✅ Cài Node.js 20.x
- [ ] ✅ Cài PostgreSQL 14+
- [ ] ✅ Cài Git
- [ ] ✅ Thêm PostgreSQL vào PATH
- [ ] ✅ Clone project từ GitHub
- [ ] ✅ Chạy `npm install --legacy-peer-deps`
- [ ] ✅ Tạo database `vietsoul`
- [ ] ✅ Import schema: `psql -U postgres -d vietsoul -f lib/schema.sql`
- [ ] ✅ Tạo admin user: `node create-admin.js`
- [ ] ✅ Tạo file `.env.local`
- [ ] ✅ Cập nhật DATABASE_URL trong `.env.local`
- [ ] ✅ Chạy `npm run dev`
- [ ] ✅ Mở http://localhost:3000
- [ ] ✅ Test login admin

---

## 💡 Tips Cho Windows Users

### 1. Sử dụng Windows Terminal
- Tải từ Microsoft Store
- Hỗ trợ tabs, đẹp hơn CMD/PowerShell cũ

### 2. VSCode Integrated Terminal
- Mở VSCode
- Terminal → New Terminal (Ctrl + `)
- Chạy lệnh npm trực tiếp trong VSCode

### 3. Shortcut Hữu Ích
- **Ctrl + C**: Dừng process
- **Ctrl + L**: Clear terminal
- **Ctrl + Shift + C**: Copy từ terminal
- **Ctrl + Shift + V**: Paste vào terminal

### 4. Path với Khoảng Trắng
Nếu path có khoảng trắng, dùng dấu ngoặc kép:
```powershell
cd "C:\Users\My Name\Documents\Projects\viet-soul-app"
```

---

## 🔧 Cấu Hình Cloudinary (Optional)

Nếu muốn upload audio/images:

1. Đăng ký tài khoản miễn phí: https://cloudinary.com/
2. Vào Dashboard → Copy thông tin:
   - Cloud Name
   - API Key
   - API Secret
3. Cập nhật trong `.env.local`:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

---

## 🐛 Lỗi Thường Gặp Trên Windows

### "execution of scripts is disabled"

Nếu gặp lỗi này khi chạy npm:

```powershell
# Mở PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### "ENOENT: no such file or directory"

```powershell
# Đảm bảo đang ở đúng thư mục
pwd
# Kết quả phải là: ...\viet-soul-app\vietsoul-web
```

### "Cannot find module"

```powershell
# Cài lại dependencies
rm -r node_modules
npm install --legacy-peer-deps
```

### Database connection failed

Kiểm tra:
1. PostgreSQL service đang chạy
2. Password trong DATABASE_URL đúng
3. Port 5432 không bị chặn bởi firewall

---

## 📺 Video Hướng Dẫn (Nếu Cần)

Bạn có thể quay video màn hình trong khi setup để:
- Dễ nhớ các bước
- Chia sẻ với team
- Dùng làm tài liệu tham khảo

**Tool quay video miễn phí:**
- OBS Studio: https://obsproject.com/
- Windows Game Bar: Win + G

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề:

1. 📖 Đọc [README.md](README.md)
2. 🔍 Tìm kiếm error message trên Google
3. 🐛 [Báo lỗi trên GitHub](https://github.com/NguyenZak/viet-soul-app/issues)

---

## 🎉 Hoàn Tất!

Bây giờ bạn đã có:
- ✅ Môi trường development hoàn chỉnh
- ✅ Database PostgreSQL đã setup
- ✅ Admin user đã sẵn sàng
- ✅ Dev server đang chạy

**Chúc bạn code vui vẻ! 🚀**

---

<div align="center">

Made with ❤️ for Windows Users 🪟

VietSoul Music Streaming Platform

</div>

