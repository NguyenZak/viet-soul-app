# VietSoul - Cấu trúc Admin và User đã tách

## Tổng quan

Ứng dụng VietSoul đã được tách thành hai phần riêng biệt:
- **Phần Admin**: Quản lý hệ thống, bài hát, nghệ sĩ, albums, người dùng
- **Phần User**: Giao diện người dùng cuối để nghe nhạc

## Cấu trúc thư mục

```
app/
├── layout.tsx                 # Layout gốc chỉ chứa SessionProvider
├── page.tsx                   # Redirect đến trang chủ user
├── login/                     # Trang đăng nhập (dùng chung)
├── api/                       # API routes
├── admin/                     # Phần quản lý admin
│   ├── layout.tsx            # Layout riêng cho admin
│   ├── page.tsx              # Dashboard tổng quan
│   ├── tracks/               # Quản lý bài hát
│   ├── artists/              # Quản lý nghệ sĩ
│   ├── albums/               # Quản lý albums
│   ├── upload/               # Upload bài hát
│   ├── users/                # Quản lý người dùng
│   └── settings/             # Cài đặt hệ thống
└── (user)/                   # Phần người dùng
    ├── layout.tsx            # Layout riêng cho user
    ├── page.tsx              # Trang chủ
    ├── album/                # Chi tiết album
    ├── albums/               # Danh sách albums
    ├── artist/               # Chi tiết nghệ sĩ
    ├── artists/              # Danh sách nghệ sĩ
    ├── collection/           # Bộ sưu tập
    ├── composer/             # Chi tiết nhạc sĩ
    ├── composers/            # Danh sách nhạc sĩ
    ├── genre/                # Chi tiết thể loại
    ├── genres/               # Danh sách thể loại
    ├── library/              # Thư viện cá nhân
    ├── playlist/             # Chi tiết playlist
    ├── search/               # Tìm kiếm
    └── upload/               # Upload của user
```

## Components

### Admin Components
- `AdminSidebar.tsx`: Sidebar riêng cho admin với menu quản lý
- `AdminTopbar.tsx`: Topbar riêng cho admin với thông tin admin

### User Components  
- `Sidebar.tsx`: Sidebar cho người dùng (đã loại bỏ link admin)
- `Topbar.tsx`: Topbar cho người dùng
- Các components khác giữ nguyên

## Tính năng Admin

### Dashboard (`/admin`)
- Tổng quan hệ thống với thống kê
- Thao tác nhanh đến các chức năng quản lý
- Hoạt động gần đây

### Quản lý bài hát (`/admin/tracks`)
- Xem danh sách tất cả bài hát
- Phát thử bài hát
- Chỉnh sửa thông tin bài hát
- Xóa bài hát

### Quản lý nghệ sĩ (`/admin/artists`)
- Xem danh sách nghệ sĩ
- Thêm/sửa/xóa nghệ sĩ
- Quản lý thông tin nghệ sĩ

### Quản lý albums (`/admin/albums`)
- Xem danh sách albums
- Thêm/sửa/xóa albums
- Quản lý thông tin albums

### Upload (`/admin/upload`)
- Upload file âm thanh
- Upload hình ảnh bìa
- Upload file lời bài hát
- Drag & drop interface

### Quản lý người dùng (`/admin/users`)
- Xem danh sách người dùng
- Phân quyền người dùng
- Quản lý vai trò (admin, user, moderator)

### Cài đặt hệ thống (`/admin/settings`)
- Cài đặt chung (tên site, mô tả)
- Cài đặt upload (kích thước file, định dạng)
- Cài đặt thông báo
- Cài đặt giao diện

## Bảo mật

- Admin layout có kiểm tra authentication
- Redirect về `/login` nếu chưa đăng nhập
- Layout admin chỉ hiển thị khi user đã xác thực

## Routing

- `/admin/*`: Tất cả routes admin
- `/(user)/*`: Tất cả routes người dùng (Next.js route groups)
- `/login`: Trang đăng nhập dùng chung
- `/`: Redirect đến trang chủ user

## Cách sử dụng

1. **Người dùng thường**: Truy cập `/` để sử dụng ứng dụng
2. **Admin**: Truy cập `/admin` để quản lý hệ thống
3. **Đăng nhập**: Sử dụng `/login` để đăng nhập

## Lợi ích của việc tách

1. **Tách biệt rõ ràng**: Admin và user có giao diện hoàn toàn khác nhau
2. **Bảo mật tốt hơn**: Admin routes được bảo vệ riêng
3. **Dễ bảo trì**: Code được tổ chức theo chức năng
4. **UX tốt hơn**: Mỗi loại người dùng có trải nghiệm phù hợp
5. **Scalable**: Dễ dàng thêm tính năng mới cho từng phần
