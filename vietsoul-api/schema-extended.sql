-- Extended schema for VietSoul with Artists, Composers, Genres
-- Run this script to add new tables and relationships

-- Artists table
CREATE TABLE IF NOT EXISTS artists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    avatar_url VARCHAR(500),
    birth_date DATE,
    nationality VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Composers table
CREATE TABLE IF NOT EXISTS composers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    avatar_url VARCHAR(500),
    birth_date DATE,
    nationality VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Genres table
CREATE TABLE IF NOT EXISTS genres (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7), -- hex color code
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Albums table
CREATE TABLE IF NOT EXISTS albums (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cover_url VARCHAR(500),
    release_date DATE,
    artist_id INTEGER REFERENCES artists(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Update tracks table to reference artists and composers
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS artist_id INTEGER REFERENCES artists(id) ON DELETE SET NULL;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS composer_id INTEGER REFERENCES composers(id) ON DELETE SET NULL;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS album_id INTEGER REFERENCES albums(id) ON DELETE SET NULL;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS genre_id INTEGER REFERENCES genres(id) ON DELETE SET NULL;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS release_year INTEGER;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS lyrics TEXT;

-- Track genres junction table (many-to-many)
CREATE TABLE IF NOT EXISTS track_genres (
    id SERIAL PRIMARY KEY,
    track_id INTEGER REFERENCES tracks(id) ON DELETE CASCADE,
    genre_id INTEGER REFERENCES genres(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(track_id, genre_id)
);

-- Artist collaborations junction table
CREATE TABLE IF NOT EXISTS track_artists (
    id SERIAL PRIMARY KEY,
    track_id INTEGER REFERENCES tracks(id) ON DELETE CASCADE,
    artist_id INTEGER REFERENCES artists(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'performer', -- performer, featured, producer, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(track_id, artist_id, role)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_artists_name ON artists(name);
CREATE INDEX IF NOT EXISTS idx_composers_name ON composers(name);
CREATE INDEX IF NOT EXISTS idx_genres_name ON genres(name);
CREATE INDEX IF NOT EXISTS idx_albums_title ON albums(title);
CREATE INDEX IF NOT EXISTS idx_albums_artist_id ON albums(artist_id);
CREATE INDEX IF NOT EXISTS idx_tracks_artist_id ON tracks(artist_id);
CREATE INDEX IF NOT EXISTS idx_tracks_composer_id ON tracks(composer_id);
CREATE INDEX IF NOT EXISTS idx_tracks_album_id ON tracks(album_id);
CREATE INDEX IF NOT EXISTS idx_tracks_genre_id ON tracks(genre_id);
CREATE INDEX IF NOT EXISTS idx_track_genres_track_id ON track_genres(track_id);
CREATE INDEX IF NOT EXISTS idx_track_genres_genre_id ON track_genres(genre_id);
CREATE INDEX IF NOT EXISTS idx_track_artists_track_id ON track_artists(track_id);
CREATE INDEX IF NOT EXISTS idx_track_artists_artist_id ON track_artists(artist_id);

-- Insert sample artists
INSERT INTO artists (name, bio, avatar_url, nationality) VALUES 
('Sơn Tùng M-TP', 'Ca sĩ, nhạc sĩ người Việt Nam nổi tiếng với phong cách âm nhạc hiện đại', '/uploads/artists/sontung.jpg', 'Việt Nam'),
('Đen Vâu', 'Rapper, nhạc sĩ người Việt Nam với phong cách rap độc đáo', '/uploads/artists/denvau.jpg', 'Việt Nam'),
('Bích Phương', 'Ca sĩ nữ nổi tiếng với giọng hát ngọt ngào', '/uploads/artists/bichphuong.jpg', 'Việt Nam'),
('Hoàng Thùy Linh', 'Ca sĩ, diễn viên đa tài', '/uploads/artists/hoangthuylinh.jpg', 'Việt Nam'),
('Mr. Siro', 'Ca sĩ với giọng nam trầm ấm', '/uploads/artists/mrsiro.jpg', 'Việt Nam')
ON CONFLICT DO NOTHING;

-- Insert sample composers
INSERT INTO composers (name, bio, avatar_url, nationality) VALUES 
('Nguyễn Văn Chung', 'Nhạc sĩ nổi tiếng với nhiều ca khúc hit', '/uploads/composers/nguyenvanchung.jpg', 'Việt Nam'),
('Đỗ Hiếu', 'Nhạc sĩ trẻ tài năng', '/uploads/composers/dohieu.jpg', 'Việt Nam'),
('Hoàng Huy Long', 'Nhạc sĩ với phong cách âm nhạc đa dạng', '/uploads/composers/hoanghuylong.jpg', 'Việt Nam'),
('Phạm Toàn Thắng', 'Nhạc sĩ chuyên về nhạc pop ballad', '/uploads/composers/phamtoanthang.jpg', 'Việt Nam')
ON CONFLICT DO NOTHING;

-- Insert sample genres
INSERT INTO genres (name, description, color) VALUES 
('Pop', 'Nhạc pop phổ biến', '#FF6B6B'),
('Rap/Hip-Hop', 'Nhạc rap và hip-hop', '#4ECDC4'),
('Ballad', 'Nhạc ballad tình cảm', '#45B7D1'),
('R&B', 'Rhythm and Blues', '#96CEB4'),
('Electronic', 'Nhạc điện tử', '#FFEAA7'),
('Rock', 'Nhạc rock', '#DDA0DD'),
('Jazz', 'Nhạc jazz', '#98D8C8'),
('Classical', 'Nhạc cổ điển', '#F7DC6F'),
('Folk', 'Nhạc dân ca', '#BB8FCE'),
('Indie', 'Nhạc indie', '#85C1E9')
ON CONFLICT DO NOTHING;

-- Insert sample albums
INSERT INTO albums (title, description, cover_url, release_date, artist_id) VALUES 
('Sky Tour', 'Album tổng hợp các hit của Sơn Tùng M-TP', '/uploads/albums/skytour.jpg', '2020-01-01', 1),
('Đen Vâu Collection', 'Tuyển tập các bài hát hay nhất của Đen Vâu', '/uploads/albums/denvau.jpg', '2021-06-15', 2),
('Bích Phương Hits', 'Album tổng hợp các ca khúc nổi tiếng', '/uploads/albums/bichphuong.jpg', '2019-12-01', 3)
ON CONFLICT DO NOTHING;

-- Update existing tracks with new relationships
UPDATE tracks SET artist_id = 1, composer_id = 1, album_id = 1, genre_id = 1, release_year = 2020 WHERE title = 'Nắng ấm xa dần (Demo)';
UPDATE tracks SET artist_id = 2, composer_id = 2, album_id = 2, genre_id = 2, release_year = 2021 WHERE title = 'HLS Sample (Big Buck Bunny)';
UPDATE tracks SET artist_id = 3, composer_id = 3, album_id = 3, genre_id = 3, release_year = 2019 WHERE title = 'Nhạc chill demo';

-- Add additional sample tracks with full metadata
INSERT INTO tracks (title, artist, src, cover_url, lrc_url, artist_id, composer_id, album_id, genre_id, release_year, lyrics) VALUES 
('Lạc Trôi', 'Sơn Tùng M-TP', '/uploads/tracks/lactroi.mp3', '/uploads/covers/lactroi.jpg', '/uploads/lyrics/lactroi.lrc', 1, 1, 1, 1, 2020, 'Lạc trôi trong đêm tối...'),
('Anh Đã Quen Với Cô Đơn', 'Soobin Hoàng Sơn', '/uploads/tracks/anhdaquen.mp3', '/uploads/covers/anhdaquen.jpg', null, 4, 4, 3, 3, 2019, 'Anh đã quen với cô đơn...'),
('Đừng Như Thói Quen', 'Jaykii', '/uploads/tracks/dungnhuthoiquen.mp3', '/uploads/covers/dungnhuthoiquen.jpg', null, 5, 2, 2, 4, 2021, 'Đừng như thói quen...')
ON CONFLICT DO NOTHING;
