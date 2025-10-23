# 🚀 Hướng Dẫn Deploy VietSoul Lên Vercel

## ✅ ĐÃ HOÀN THÀNH:
- ✓ Code đã fix hết lỗi
- ✓ Build thành công local
- ✓ Database local đã setup
- ✓ Có 10 genres + 8 artists

## 🎯 CÒN LẠI 3 BƯỚC ĐƠN GIẢN:

### Bước 1: Tạo Database Miễn Phí (2 phút)

1. **Mở:** https://console.neon.tech/signup
2. **Click:** "Sign up with GitHub" (nhanh nhất)
3. **Click:** "New Project" (nút màu xanh)
4. **Điền:**
   - Name: `vietsoul`
   - Region: **Singapore**
5. **Click:** "Create Project"
6. **Copy:** Connection string (chọn "Pooled connection")
   - Trông như: `postgresql://user:pass@ep-xxx.aws.neon.tech/neondb?sslmode=require`

### Bước 2: Chạy Database Schema (1 phút)

7. **Trong Neon Dashboard,** click **"SQL Editor"** (sidebar bên trái)
8. **Mở file:** `SETUP_DATABASE.sql` trong thư mục project
9. **Copy tất cả** (Cmd+A, Cmd+C)
10. **Paste** vào SQL Editor
11. **Click:** "Run" (hoặc Cmd+Enter)
12. **Chờ 5 giây** → Sẽ thấy "Query executed successfully"

### Bước 3: Add Database URL vào Vercel (1 phút)

13. **Vào:** https://vercel.com/dashboard
14. **Click:** Project "VietSoul"
15. **Click:** Tab "Settings" → "Environment Variables"
16. **Click:** "Add New"
17. **Nhập:**
    - Key: `DATABASE_URL`
    - Value: (paste connection string từ Neon)
    - Environment: Chọn **tất cả 3**: Production, Preview, Development
18. **Click:** "Save"

19. **Vào:** Tab "Deployments"
20. **Click:** "..." ở deployment mới nhất
21. **Click:** "Redeploy"
22. **Đợi ~1-2 phút**

## 🎉 XONG!

Website của bạn sẽ có:
- ✅ 10 thể loại nhạc
- ✅ 8 nghệ sĩ Việt Nam
- ✅ Database hoạt động
- ✅ Sẵn sàng upload tracks!

---

## 📊 Database Connection Strings:

**Local (đang dùng):**
```
postgresql://localhost:5432/vietsoul
```

**Production (Neon - cần add):**
```
postgresql://user:pass@ep-xxx.aws.neon.tech/neondb?sslmode=require
```

---

## 🆘 Nếu Cần Giúp:

**Không tạo được Neon account?**
→ Dùng Supabase: https://supabase.com/dashboard
→ Hoặc Vercel Postgres: Vercel Dashboard → Storage → Create

**Deploy bị lỗi?**
→ Check Build Logs trong Vercel Deployments tab
→ Đảm bảo DATABASE_URL đã được add vào Environment Variables

**Database không có data?**
→ Chạy lại file SETUP_DATABASE.sql trong SQL Editor

---

**Good luck! 🚀**

