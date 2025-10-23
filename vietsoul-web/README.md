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

## 🚀 Vercel Deployment

### 1. Connect to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select the `vietsoul-web` folder as the root directory

### 2. Configure Build Settings
In Vercel project settings:
- **Framework Preset**: Next.js
- **Build Command**: `npm run vercel-build`
- **Output Directory**: `.next`
- **Install Command**: `npm install --legacy-peer-deps`

### 3. Environment Variables
Add these environment variables in Vercel dashboard:

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

### 4. Deploy
1. Click "Deploy" in Vercel dashboard
2. Wait for build to complete
3. Your app will be available at `https://your-app.vercel.app`

## 🔧 Troubleshooting Vercel Build Issues

### Common Issues and Solutions:

#### 1. Module Not Found Error
**Problem**: `Module not found: Can't resolve '@/lib/database'`

**Solution**:
- Ensure all import paths use the `@/` alias correctly
- Check that files exist in the `lib/` directory
- Verify `tsconfig.json` has correct path mapping:
  ```json
  {
    "compilerOptions": {
      "paths": {
        "@/*": ["./*"]
      }
    }
  }
  ```

#### 2. Build Command Issues
**Problem**: Build fails with custom build script

**Solution**:
- Use `npm run vercel-build` as build command
- Ensure `vercel-build.sh` is executable: `chmod +x vercel-build.sh`
- Check that script handles the 500.html file creation

#### 3. Environment Variables
**Problem**: API routes fail due to missing environment variables

**Solution**:
- Add all required environment variables in Vercel dashboard
- Use `SKIP_ENV_VALIDATION=true` to bypass validation
- Ensure `DATABASE_URL` is properly formatted

#### 4. Case Sensitivity Issues
**Problem**: Build works locally but fails on Vercel

**Solution**:
- Configure Git to be case-sensitive: `git config core.ignorecase false`
- Ensure all file names and imports match exactly
- Check for duplicate files with different cases

### Build Scripts Explained:

#### `vercel-build.sh`
This script handles the Vercel-specific build process:
- Sets environment variables for Vercel
- Creates required directories
- Handles the 500.html file creation
- Runs the Next.js build
- Applies workarounds for known issues

#### `build.sh`
This script handles local builds:
- Similar to vercel-build.sh but for local development
- Creates build artifacts for production testing

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
├── public/                # Static assets
├── vercel.json           # Vercel configuration
├── vercel-build.sh       # Vercel build script
└── build.sh              # Local build script
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

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run setup-db` - Setup database
- `npm run vercel-build` - Build for Vercel
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