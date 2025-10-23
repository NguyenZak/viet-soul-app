#!/bin/bash

# VietSoul Database Setup Script
echo "🚀 Setting up VietSoul database..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL environment variable is not set"
    echo "Please set DATABASE_URL in your .env.local file"
    echo "Example: DATABASE_URL=postgresql://username:password@localhost:5432/vietsoul"
    exit 1
fi

# Load environment variables
if [ -f .env.local ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
fi

echo "📊 Database URL: $DATABASE_URL"

# Run the schema
echo "📋 Creating database schema..."
psql "$DATABASE_URL" -f lib/schema.sql

if [ $? -eq 0 ]; then
    echo "✅ Database schema created successfully!"
    echo ""
    echo "🎉 VietSoul database is ready!"
    echo ""
    echo "📊 Database includes:"
    echo "  - Users table for authentication"
    echo "  - Artists, Composers, Genres tables"
    echo "  - Albums and Tracks tables"
    echo "  - Playlists and Playlist_Tracks tables"
    echo "  - Sample data for genres and artists"
    echo ""
    echo "🚀 You can now start the application with: npm run dev"
else
    echo "❌ Database setup failed!"
    echo "Please check your DATABASE_URL and ensure PostgreSQL is running"
    exit 1
fi
