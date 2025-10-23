-- Create database schema for VietSoul
-- Run this script to set up the database

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tracks table
CREATE TABLE IF NOT EXISTS tracks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    src VARCHAR(500) NOT NULL,
    cover_url VARCHAR(500),
    lrc_url VARCHAR(500),
    duration INTEGER, -- in seconds
    file_size BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Playlists table
CREATE TABLE IF NOT EXISTS playlists (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cover_url VARCHAR(500),
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Playlist tracks junction table
CREATE TABLE IF NOT EXISTS playlist_tracks (
    id SERIAL PRIMARY KEY,
    playlist_id INTEGER REFERENCES playlists(id) ON DELETE CASCADE,
    track_id INTEGER REFERENCES tracks(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(playlist_id, track_id)
);

-- User likes table
CREATE TABLE IF NOT EXISTS user_likes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    track_id INTEGER REFERENCES tracks(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, track_id)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tracks_title ON tracks(title);
CREATE INDEX IF NOT EXISTS idx_tracks_artist ON tracks(artist);
CREATE INDEX IF NOT EXISTS idx_playlists_user_id ON playlists(user_id);
CREATE INDEX IF NOT EXISTS idx_playlist_tracks_playlist_id ON playlist_tracks(playlist_id);
CREATE INDEX IF NOT EXISTS idx_playlist_tracks_track_id ON playlist_tracks(track_id);
CREATE INDEX IF NOT EXISTS idx_user_likes_user_id ON user_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_likes_track_id ON user_likes(track_id);

-- Insert some demo data
INSERT INTO tracks (title, artist, src, cover_url, lrc_url) VALUES 
('Nắng ấm xa dần (Demo)', 'Sơn Tùng M-TP', '/uploads/demo.mp3', '/uploads/demo-cover.jpg', '/uploads/demo.lrc'),
('HLS Sample (Big Buck Bunny)', 'Demo', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', '/uploads/demo-cover.jpg', null),
('Nhạc chill demo', 'Demo Artist', '/uploads/demo.mp3', '/uploads/demo-cover.jpg', null)
ON CONFLICT DO NOTHING;

INSERT INTO playlists (title, description, cover_url, is_public) VALUES 
('VietSoul Hits', 'Những bản hit Việt được yêu thích', '/uploads/demo-cover.jpg', true),
('Chill Night', 'Nhạc chill thư giãn', '/uploads/demo-cover.jpg', true)
ON CONFLICT DO NOTHING;

-- Add tracks to playlists
INSERT INTO playlist_tracks (playlist_id, track_id, position) VALUES 
(1, 1, 1),
(1, 2, 2),
(2, 3, 1)
ON CONFLICT DO NOTHING;
