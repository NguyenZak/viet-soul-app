#!/bin/bash

# Vercel Build Script for VietSoul
echo "🚀 Starting Vercel build for VietSoul..."

# Set environment variables for Vercel
export CI=false
export SKIP_ENV_VALIDATION=true
export NODE_ENV=production

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf .next

# Run the build
echo "🔨 Running Next.js build..."
npm run build

# Check if build succeeded
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "🎉 VietSoul is ready for Vercel!"
else
    echo "❌ Build failed!"
    exit 1
fi

echo ""
echo "📊 Vercel Build Summary:"
echo "  - Build directory: .next/"
echo "  - Output mode: standalone"
echo "  - Ready for: Vercel deployment"
echo ""
echo "🚀 Your app is ready for Vercel!"
