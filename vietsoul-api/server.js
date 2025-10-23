const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('./db');
const { generateToken, hashPassword, comparePassword, authenticateToken } = require('./auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Range request support for audio streaming
app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    // Parse range header
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    
    // Validate range
    if (start >= fileSize) {
      res.status(416).json({ error: 'Requested range not satisfiable' });
      return;
    }

    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(filePath, { start, end });
    
    // Set partial content headers
    res.status(206);
    res.set({
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': getContentType(filename),
      'Cache-Control': 'public, max-age=31536000', // 1 year cache
    });

    file.pipe(res);
  } else {
    // Full file request
    res.set({
      'Content-Length': fileSize,
      'Content-Type': getContentType(filename),
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=31536000',
    });
    
    fs.createReadStream(filePath).pipe(res);
  }
});

// Helper function to get content type
function getContentType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const types = {
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.ogg': 'audio/ogg',
    '.m4a': 'audio/mp4',
    '.aac': 'audio/aac',
    '.flac': 'audio/flac',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.lrc': 'text/plain',
  };
  return types[ext] || 'application/octet-stream';
}

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Check if user already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, hashedPassword, name]
    );

    const user = result.rows[0];
    const token = generateToken(user.id);

    res.json({ token, user });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const isValidPassword = await comparePassword(password, user.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id);
    res.json({ 
      token, 
      user: { id: user.id, email: user.email, name: user.name } 
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, name FROM users WHERE id = $1', [req.userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Routes
// Get all tracks with detailed information
app.get('/api/tracks', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.*, 
             a.name as artist_name, a.bio as artist_bio, a.avatar_url as artist_avatar, a.nationality as artist_nationality,
             c.name as composer_name, c.bio as composer_bio, c.avatar_url as composer_avatar, c.nationality as composer_nationality,
             al.title as album_title, al.description as album_description, al.cover_url as album_cover, al.release_date as album_release_date,
             g.name as genre_name, g.description as genre_description, g.color as genre_color
      FROM tracks t
      LEFT JOIN artists a ON t.artist_id = a.id
      LEFT JOIN composers c ON t.composer_id = c.id
      LEFT JOIN albums al ON t.album_id = al.id
      LEFT JOIN genres g ON t.genre_id = g.id
      ORDER BY t.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tracks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/tracks/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tracks WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Track not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching track:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/tracks', authenticateToken, upload.fields([
  { name: 'audio', maxCount: 1 },
  { name: 'cover', maxCount: 1 },
  { name: 'lyrics', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, artist } = req.body;
    const audioFile = req.files?.audio?.[0];
    const coverFile = req.files?.cover?.[0];
    const lyricsFile = req.files?.lyrics?.[0];

    if (!title || !artist || !audioFile) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await pool.query(
      'INSERT INTO tracks (title, artist, src, cover_url, lrc_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [
        title,
        artist,
        `/uploads/${audioFile.filename}`,
        coverFile ? `/uploads/${coverFile.filename}` : null,
        lyricsFile ? `/uploads/${lyricsFile.filename}` : null
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating track:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/playlists', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM playlists WHERE is_public = true ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching playlists:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/playlists/:id', async (req, res) => {
  try {
    const playlistResult = await pool.query('SELECT * FROM playlists WHERE id = $1', [req.params.id]);
    if (playlistResult.rows.length === 0) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    const tracksResult = await pool.query(`
      SELECT t.*, pt.position 
      FROM tracks t 
      JOIN playlist_tracks pt ON t.id = pt.track_id 
      WHERE pt.playlist_id = $1 
      ORDER BY pt.position
    `, [req.params.id]);

    const playlist = playlistResult.rows[0];
    playlist.tracks = tracksResult.rows;
    
    res.json(playlist);
  } catch (error) {
    console.error('Error fetching playlist:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/playlists', authenticateToken, async (req, res) => {
  try {
    const { title, description, trackIds } = req.body;
    
    const result = await pool.query(
      'INSERT INTO playlists (title, description, user_id, is_public) VALUES ($1, $2, $3, true) RETURNING *',
      [title || 'New Playlist', description || '', req.userId]
    );

    const playlist = result.rows[0];

    // Add tracks to playlist if provided
    if (trackIds && trackIds.length > 0) {
      for (let i = 0; i < trackIds.length; i++) {
        await pool.query(
          'INSERT INTO playlist_tracks (playlist_id, track_id, position) VALUES ($1, $2, $3)',
          [playlist.id, trackIds[i], i + 1]
        );
      }
    }

    res.json(playlist);
  } catch (error) {
    console.error('Error creating playlist:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ tracks: [], playlists: [] });
    
    const query = `%${q.toLowerCase()}%`;
    
    const tracksResult = await pool.query(
      'SELECT * FROM tracks WHERE LOWER(title) LIKE $1 OR LOWER(artist) LIKE $1 ORDER BY created_at DESC',
      [query]
    );
    
    const playlistsResult = await pool.query(
      'SELECT * FROM playlists WHERE (LOWER(title) LIKE $1 OR LOWER(description) LIKE $1) AND is_public = true ORDER BY created_at DESC',
      [query]
    );
    
    res.json({ 
      tracks: tracksResult.rows, 
      playlists: playlistsResult.rows 
    });
  } catch (error) {
    console.error('Error searching:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all artists
app.get('/api/artists', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*, 
             COUNT(t.id) as track_count,
             COUNT(DISTINCT al.id) as album_count
      FROM artists a
      LEFT JOIN tracks t ON a.id = t.artist_id
      LEFT JOIN albums al ON a.id = al.artist_id
      GROUP BY a.id
      ORDER BY track_count DESC, a.name ASC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching artists:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get artist by ID with tracks and albums
app.get('/api/artists/:id', async (req, res) => {
  try {
    const artistId = req.params.id;
    
    // Get artist info
    const artistResult = await pool.query('SELECT * FROM artists WHERE id = $1', [artistId]);
    if (artistResult.rows.length === 0) {
      return res.status(404).json({ error: 'Artist not found' });
    }
    
    // Get artist's tracks
    const tracksResult = await pool.query(`
      SELECT t.*, g.name as genre_name, g.color as genre_color,
             al.title as album_title, al.cover_url as album_cover
      FROM tracks t
      LEFT JOIN genres g ON t.genre_id = g.id
      LEFT JOIN albums al ON t.album_id = al.id
      WHERE t.artist_id = $1
      ORDER BY t.release_year DESC, t.title ASC
    `, [artistId]);
    
    // Get artist's albums
    const albumsResult = await pool.query(`
      SELECT al.*, COUNT(t.id) as track_count
      FROM albums al
      LEFT JOIN tracks t ON al.id = t.album_id
      WHERE al.artist_id = $1
      GROUP BY al.id
      ORDER BY al.release_date DESC
    `, [artistId]);
    
    res.json({
      artist: artistResult.rows[0],
      tracks: tracksResult.rows,
      albums: albumsResult.rows
    });
  } catch (error) {
    console.error('Error fetching artist:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all composers
app.get('/api/composers', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, 
             COUNT(t.id) as track_count
      FROM composers c
      LEFT JOIN tracks t ON c.id = t.composer_id
      GROUP BY c.id
      ORDER BY track_count DESC, c.name ASC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching composers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get composer by ID with tracks
app.get('/api/composers/:id', async (req, res) => {
  try {
    const composerId = req.params.id;
    
    // Get composer info
    const composerResult = await pool.query('SELECT * FROM composers WHERE id = $1', [composerId]);
    if (composerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Composer not found' });
    }
    
    // Get composer's tracks
    const tracksResult = await pool.query(`
      SELECT t.*, a.name as artist_name, a.avatar_url as artist_avatar,
             g.name as genre_name, g.color as genre_color,
             al.title as album_title, al.cover_url as album_cover
      FROM tracks t
      LEFT JOIN artists a ON t.artist_id = a.id
      LEFT JOIN genres g ON t.genre_id = g.id
      LEFT JOIN albums al ON t.album_id = al.id
      WHERE t.composer_id = $1
      ORDER BY t.release_year DESC, t.title ASC
    `, [composerId]);
    
    res.json({
      composer: composerResult.rows[0],
      tracks: tracksResult.rows
    });
  } catch (error) {
    console.error('Error fetching composer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all genres
app.get('/api/genres', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT g.*, 
             COUNT(t.id) as track_count
      FROM genres g
      LEFT JOIN tracks t ON g.id = t.genre_id
      GROUP BY g.id
      ORDER BY track_count DESC, g.name ASC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching genres:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get genre by ID with tracks
app.get('/api/genres/:id', async (req, res) => {
  try {
    const genreId = req.params.id;
    
    // Get genre info
    const genreResult = await pool.query('SELECT * FROM genres WHERE id = $1', [genreId]);
    if (genreResult.rows.length === 0) {
      return res.status(404).json({ error: 'Genre not found' });
    }
    
    // Get tracks in this genre
    const tracksResult = await pool.query(`
      SELECT t.*, a.name as artist_name, a.avatar_url as artist_avatar,
             c.name as composer_name, c.avatar_url as composer_avatar,
             al.title as album_title, al.cover_url as album_cover
      FROM tracks t
      LEFT JOIN artists a ON t.artist_id = a.id
      LEFT JOIN composers c ON t.composer_id = c.id
      LEFT JOIN albums al ON t.album_id = al.id
      WHERE t.genre_id = $1
      ORDER BY t.release_year DESC, t.title ASC
    `, [genreId]);
    
    res.json({
      genre: genreResult.rows[0],
      tracks: tracksResult.rows
    });
  } catch (error) {
    console.error('Error fetching genre:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all albums
app.get('/api/albums', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT al.*, 
             a.name as artist_name, a.avatar_url as artist_avatar,
             COUNT(t.id) as track_count
      FROM albums al
      LEFT JOIN artists a ON al.artist_id = a.id
      LEFT JOIN tracks t ON al.id = t.album_id
      GROUP BY al.id, a.name, a.avatar_url
      ORDER BY al.release_date DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching albums:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get album by ID with tracks
app.get('/api/albums/:id', async (req, res) => {
  try {
    const albumId = req.params.id;
    
    // Get album info
    const albumResult = await pool.query(`
      SELECT al.*, a.name as artist_name, a.bio as artist_bio, a.avatar_url as artist_avatar
      FROM albums al
      LEFT JOIN artists a ON al.artist_id = a.id
      WHERE al.id = $1
    `, [albumId]);
    if (albumResult.rows.length === 0) {
      return res.status(404).json({ error: 'Album not found' });
    }
    
    // Get album tracks
    const tracksResult = await pool.query(`
      SELECT t.*, g.name as genre_name, g.color as genre_color
      FROM tracks t
      LEFT JOIN genres g ON t.genre_id = g.id
      WHERE t.album_id = $1
      ORDER BY t.id ASC
    `, [albumId]);
    
    res.json({
      album: albumResult.rows[0],
      tracks: tracksResult.rows
    });
  } catch (error) {
    console.error('Error fetching album:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get artist by slug with tracks and albums
app.get('/api/artists/slug/:slug', async (req, res) => {
  try {
    const artistSlug = req.params.slug;
    
    // Get artist info
    const artistResult = await pool.query('SELECT * FROM artists WHERE slug = $1', [artistSlug]);
    if (artistResult.rows.length === 0) {
      return res.status(404).json({ error: 'Artist not found' });
    }
    
    // Get artist's tracks
    const tracksResult = await pool.query(`
      SELECT t.*, g.name as genre_name, g.color as genre_color,
             al.title as album_title, al.cover_url as album_cover
      FROM tracks t
      LEFT JOIN genres g ON t.genre_id = g.id
      LEFT JOIN albums al ON t.album_id = al.id
      WHERE t.artist_id = $1
      ORDER BY t.release_year DESC, t.title ASC
    `, [artistResult.rows[0].id]);
    
    // Get artist's albums
    const albumsResult = await pool.query(`
      SELECT al.*, COUNT(t.id) as track_count
      FROM albums al
      LEFT JOIN tracks t ON al.id = t.album_id
      WHERE al.artist_id = $1
      GROUP BY al.id
      ORDER BY al.release_date DESC
    `, [artistResult.rows[0].id]);
    
    res.json({
      artist: artistResult.rows[0],
      tracks: tracksResult.rows,
      albums: albumsResult.rows
    });
  } catch (error) {
    console.error('Error fetching artist:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get composer by slug with tracks
app.get('/api/composers/slug/:slug', async (req, res) => {
  try {
    const composerSlug = req.params.slug;
    
    // Get composer info
    const composerResult = await pool.query('SELECT * FROM composers WHERE slug = $1', [composerSlug]);
    if (composerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Composer not found' });
    }
    
    // Get composer's tracks
    const tracksResult = await pool.query(`
      SELECT t.*, a.name as artist_name, a.avatar_url as artist_avatar,
             g.name as genre_name, g.color as genre_color,
             al.title as album_title, al.cover_url as album_cover
      FROM tracks t
      LEFT JOIN artists a ON t.artist_id = a.id
      LEFT JOIN genres g ON t.genre_id = g.id
      LEFT JOIN albums al ON t.album_id = al.id
      WHERE t.composer_id = $1
      ORDER BY t.release_year DESC, t.title ASC
    `, [composerResult.rows[0].id]);
    
    res.json({
      composer: composerResult.rows[0],
      tracks: tracksResult.rows
    });
  } catch (error) {
    console.error('Error fetching composer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get genre by slug with tracks
app.get('/api/genres/slug/:slug', async (req, res) => {
  try {
    const genreSlug = req.params.slug;
    
    // Get genre info
    const genreResult = await pool.query('SELECT * FROM genres WHERE slug = $1', [genreSlug]);
    if (genreResult.rows.length === 0) {
      return res.status(404).json({ error: 'Genre not found' });
    }
    
    // Get tracks in this genre
    const tracksResult = await pool.query(`
      SELECT t.*, a.name as artist_name, a.avatar_url as artist_avatar,
             c.name as composer_name, c.avatar_url as composer_avatar,
             al.title as album_title, al.cover_url as album_cover
      FROM tracks t
      LEFT JOIN artists a ON t.artist_id = a.id
      LEFT JOIN composers c ON t.composer_id = c.id
      LEFT JOIN albums al ON t.album_id = al.id
      WHERE t.genre_id = $1
      ORDER BY t.release_year DESC, t.title ASC
    `, [genreResult.rows[0].id]);
    
    res.json({
      genre: genreResult.rows[0],
      tracks: tracksResult.rows
    });
  } catch (error) {
    console.error('Error fetching genre:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get album by slug with tracks
app.get('/api/albums/slug/:slug', async (req, res) => {
  try {
    const albumSlug = req.params.slug;
    
    // Get album info
    const albumResult = await pool.query(`
      SELECT al.*, a.name as artist_name, a.bio as artist_bio, a.avatar_url as artist_avatar
      FROM albums al
      LEFT JOIN artists a ON al.artist_id = a.id
      WHERE al.slug = $1
    `, [albumSlug]);
    if (albumResult.rows.length === 0) {
      return res.status(404).json({ error: 'Album not found' });
    }
    
    // Get album tracks
    const tracksResult = await pool.query(`
      SELECT t.*, g.name as genre_name, g.color as genre_color
      FROM tracks t
      LEFT JOIN genres g ON t.genre_id = g.id
      WHERE t.album_id = $1
      ORDER BY t.id ASC
    `, [albumResult.rows[0].id]);
    
    res.json({
      album: albumResult.rows[0],
      tracks: tracksResult.rows
    });
  } catch (error) {
    console.error('Error fetching album:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'OK', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', database: 'disconnected' });
  }
});

app.listen(PORT, () => {
  console.log(`VietSoul API server running on port ${PORT}`);
  console.log(`Database: ${process.env.DB_NAME || 'vietsoul'}`);
  console.log(`Range requests enabled for audio streaming`);
});