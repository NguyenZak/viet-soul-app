# VietSoul - Vietnamese Music Streaming App

A modern Vietnamese music streaming application built with Next.js 15, PostgreSQL, and Cloudinary.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL
- npm or yarn

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Setup Environment Variables
Copy `env.example` to `.env.local` and update the values:
```bash
cp env.example .env.local
```

### 3. Setup Database
```bash
# Start PostgreSQL (if not running)
brew services start postgresql  # macOS
# or
sudo service postgresql start    # Ubuntu

# Run database setup
./setup-db.sh
```

### 4. Start Development Server
```bash
npm run dev
```

## 🏗️ Build for Production

### Local Build
```bash
./build.sh
npm start
```

### Vercel Build
```bash
./vercel-build.sh
```

## 📁 Project Structure

```
vietsoul-web/
├── app/                    # Next.js App Router
│   ├── (user)/            # User-facing pages
│   ├── admin/             # Admin dashboard
│   └── api/               # API routes
├── components/            # React components
├── lib/                   # Utility libraries
│   ├── database.ts       # PostgreSQL connection
│   ├── auth.ts           # Authentication utilities
│   └── schema.sql        # Database schema
├── store/                 # Zustand state management
└── public/                # Static assets
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

### Other Endpoints
- `GET /api/artists` - Get all artists
- `GET /api/albums` - Get all albums
- `GET /api/genres` - Get all genres

## 🗄️ Database Schema

The application uses PostgreSQL with the following main tables:
- `users` - User accounts
- `artists` - Music artists
- `composers` - Music composers
- `genres` - Music genres
- `albums` - Music albums
- `tracks` - Music tracks
- `playlists` - User playlists

## 🚀 Deployment

### Vercel
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
```bash
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key-here
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your_secret_key
```

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run setup-db` - Setup database
- `./build.sh` - Build with workaround
- `./vercel-build.sh` - Build for Vercel

### Troubleshooting

#### Build Issues
If you encounter build errors related to missing files:
```bash
./build.sh  # Uses workaround for Next.js build issues
```

#### Database Connection Issues
1. Ensure PostgreSQL is running
2. Check DATABASE_URL in .env.local
3. Run `./setup-db.sh` to recreate database

#### Import Path Issues
The project uses `@/` alias for imports. If you see import errors:
1. Check tsconfig.json has path mapping
2. Use `@/lib/...` instead of relative paths

## 📝 License

This project is licensed under the MIT License.