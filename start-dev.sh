#!/bin/bash

echo "🚀 Starting VietSoul Dev Server..."
echo ""

# Kill any existing processes on port 3000
if lsof -ti:3000 >/dev/null 2>&1; then
    echo "🔄 Stopping existing dev server..."
    kill -9 $(lsof -ti:3000) 2>/dev/null
    sleep 1
fi

# Check if .env.local exists
if [ ! -f vietsoul-web/.env.local ]; then
    echo "⚠️  Warning: .env.local not found!"
    echo "   Creating .env.local with required variables..."
    cat > vietsoul-web/.env.local << 'EOF'
# Database
DATABASE_URL=postgresql://localhost:5432/vietsoul

# JWT Secret for authentication
JWT_SECRET=vietsoul-super-secret-jwt-key-2024

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=vietsoul-nextauth-secret-2024
EOF
    echo "✅ Created .env.local"
fi

echo ""
echo "📊 Environment:"
echo "  - Database: PostgreSQL (local)"
echo "  - Port: 3000"
echo "  - Mode: Development"
echo ""
echo "🔗 URLs:"
echo "  - User: http://localhost:3000"
echo "  - Admin: http://localhost:3000/admin/login"
echo ""
echo "🔐 Admin Login:"
echo "  - Email: admin@vietsoul.app"
echo "  - Password: admin123"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd vietsoul-web
npm run dev

