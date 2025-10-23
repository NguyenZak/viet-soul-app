# VietSoul - Vietnamese Music Streaming App

A modern Vietnamese music streaming application built with Next.js 15, PostgreSQL, and Cloudinary.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL
- npm or yarn

### 1. Install Dependencies
```bash
cd vietsoul-web
npm install --legacy-peer-deps
```

### 2. Setup Environment Variables
```bash
cd vietsoul-web
cp env.example .env.local
# Update the values in .env.local
```

### 3. Setup Database
```bash
cd vietsoul-web
./setup-db.sh
```

### 4. Start Development Server
```bash
cd vietsoul-web
npm run dev
```

## 🚀 Vercel Deployment

This is a monorepo structure. The Next.js app is located in the `vietsoul-web` directory.

### Vercel Configuration
- **Root Directory**: `vietsoul-web`
- **Build Command**: `npm run vercel-build`
- **Output Directory**: `.next`
- **Install Command**: `npm install --legacy-peer-deps`

### Environment Variables
Add these in Vercel dashboard:

```bash
# Database Configuration
DATABASE_URL=postgresql://user:password@host:port/database

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# NextAuth Configuration
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your_secret_key

# Vercel Specific
CI=false
SKIP_ENV_VALIDATION=true
NODE_ENV=production
```

## 📁 Project Structure

```
VietSoul/
├── vietsoul-web/          # Next.js application
│   ├── app/               # App Router
│   ├── components/        # React components
│   ├── lib/              # Utilities
│   ├── public/           # Static assets
│   ├── vercel.json       # Vercel config
│   └── package.json      # Dependencies
├── vercel.json           # Root Vercel config
└── package.json          # Root package.json
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Music Data
- `GET /api/tracks` - Get all tracks
- `POST /api/tracks` - Create track (admin)
- `PUT /api/tracks` - Update track (admin)
- `DELETE /api/tracks` - Delete track (admin)

## 📝 License

This project is licensed under the MIT License.
