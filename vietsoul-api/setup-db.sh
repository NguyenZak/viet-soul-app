#!/bin/bash

# Setup script for VietSoul database
# Make sure PostgreSQL is running and you have access

echo "Setting up VietSoul database..."

# Create database if it doesn't exist
createdb vietsoul 2>/dev/null || echo "Database 'vietsoul' already exists or creation failed"

# Run schema
psql -d vietsoul -f schema.sql

echo "Database setup complete!"
echo "You can now start the API server with: npm run dev"
