#!/bin/bash

echo "🚀 VietSoul Database Auto Setup"
echo "================================"
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL chưa được cài đặt!"
    echo ""
    echo "📦 Để cài đặt PostgreSQL:"
    echo "   brew install postgresql@14"
    echo "   brew services start postgresql@14"
    exit 1
fi

echo "✅ PostgreSQL đã được cài đặt"
echo ""

# Database configuration
DB_NAME="vietsoul"
DB_USER="postgres"

echo "📋 Đang tạo database '$DB_NAME'..."

# Create database
createdb $DB_NAME 2>/dev/null || echo "⚠️  Database đã tồn tại, tiếp tục..."

echo "✅ Database đã sẵn sàng"
echo ""

echo "📊 Đang chạy schema..."
psql -d $DB_NAME -f vietsoul-web/lib/schema.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 HOÀN TẤT! Database đã được setup thành công!"
    echo ""
    echo "📝 Connection string của bạn:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "postgresql://localhost:5432/$DB_NAME"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "💾 Đã tạo:"
    echo "   - 8 tables"
    echo "   - 8 genres (Pop, Rock, Hip Hop, ...)"
    echo "   - 5 artists (Sơn Tùng M-TP, Đen Vâu, ...)"
    echo "   - 3 composers"
    echo ""
    echo "🔧 Để test local:"
    echo "   1. Update file .env.local:"
    echo "      DATABASE_URL=postgresql://localhost:5432/$DB_NAME"
    echo "   2. Run: npm run dev"
    echo ""
    echo "☁️  Để deploy lên Vercel:"
    echo "   1. Tạo database trên Neon: https://neon.tech"
    echo "   2. Copy connection string"
    echo "   3. Add vào Vercel Environment Variables"
else
    echo ""
    echo "❌ Có lỗi xảy ra khi chạy schema"
    exit 1
fi

