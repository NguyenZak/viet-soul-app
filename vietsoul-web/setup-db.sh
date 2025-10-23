#!/bin/bash

echo "🚀 Setting up VietSoul database..."

# Check if PostgreSQL is running
if ! pg_isready -q; then
    echo "❌ PostgreSQL is not running. Please start PostgreSQL first."
    echo "On macOS: brew services start postgresql"
    echo "On Ubuntu: sudo service postgresql start"
    exit 1
fi

# Create database if it doesn't exist
echo "📊 Creating database..."
createdb vietsoul 2>/dev/null || echo "Database already exists"

# Run schema
echo "📋 Running database schema..."
psql -d vietsoul -f ./lib/schema.sql

if [ $? -eq 0 ]; then
    echo "✅ Database setup completed successfully!"
    echo ""
    echo "📊 Database Summary:"
    echo "  - Database: vietsoul"
    echo "  - Tables: users, artists, composers, genres, albums, tracks, playlists"
    echo "  - Sample data: ✅ Inserted"
    echo ""
    echo "🚀 You can now start the application with: npm run dev"
else
    echo "❌ Database setup failed!"
    exit 1
fi