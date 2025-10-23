-- Add slug columns to existing tables
-- Run this script to add slug support

-- Add slug columns
ALTER TABLE artists ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE;
ALTER TABLE composers ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE;
ALTER TABLE genres ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE;
ALTER TABLE albums ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE;

-- Create indexes for slug columns
CREATE INDEX IF NOT EXISTS idx_artists_slug ON artists(slug);
CREATE INDEX IF NOT EXISTS idx_composers_slug ON composers(slug);
CREATE INDEX IF NOT EXISTS idx_genres_slug ON genres(slug);
CREATE INDEX IF NOT EXISTS idx_albums_slug ON albums(slug);

-- Function to generate slug from Vietnamese text
CREATE OR REPLACE FUNCTION generate_slug(input_text TEXT) 
RETURNS TEXT AS $$
DECLARE
    slug TEXT;
BEGIN
    -- Convert to lowercase
    slug := LOWER(input_text);
    
    -- Replace Vietnamese characters
    slug := REPLACE(slug, 'á', 'a');
    slug := REPLACE(slug, 'à', 'a');
    slug := REPLACE(slug, 'ả', 'a');
    slug := REPLACE(slug, 'ã', 'a');
    slug := REPLACE(slug, 'ạ', 'a');
    slug := REPLACE(slug, 'ă', 'a');
    slug := REPLACE(slug, 'ắ', 'a');
    slug := REPLACE(slug, 'ằ', 'a');
    slug := REPLACE(slug, 'ẳ', 'a');
    slug := REPLACE(slug, 'ẵ', 'a');
    slug := REPLACE(slug, 'ặ', 'a');
    slug := REPLACE(slug, 'â', 'a');
    slug := REPLACE(slug, 'ấ', 'a');
    slug := REPLACE(slug, 'ầ', 'a');
    slug := REPLACE(slug, 'ẩ', 'a');
    slug := REPLACE(slug, 'ẫ', 'a');
    slug := REPLACE(slug, 'ậ', 'a');
    
    slug := REPLACE(slug, 'é', 'e');
    slug := REPLACE(slug, 'è', 'e');
    slug := REPLACE(slug, 'ẻ', 'e');
    slug := REPLACE(slug, 'ẽ', 'e');
    slug := REPLACE(slug, 'ẹ', 'e');
    slug := REPLACE(slug, 'ê', 'e');
    slug := REPLACE(slug, 'ế', 'e');
    slug := REPLACE(slug, 'ề', 'e');
    slug := REPLACE(slug, 'ể', 'e');
    slug := REPLACE(slug, 'ễ', 'e');
    slug := REPLACE(slug, 'ệ', 'e');
    
    slug := REPLACE(slug, 'í', 'i');
    slug := REPLACE(slug, 'ì', 'i');
    slug := REPLACE(slug, 'ỉ', 'i');
    slug := REPLACE(slug, 'ĩ', 'i');
    slug := REPLACE(slug, 'ị', 'i');
    
    slug := REPLACE(slug, 'ó', 'o');
    slug := REPLACE(slug, 'ò', 'o');
    slug := REPLACE(slug, 'ỏ', 'o');
    slug := REPLACE(slug, 'õ', 'o');
    slug := REPLACE(slug, 'ọ', 'o');
    slug := REPLACE(slug, 'ô', 'o');
    slug := REPLACE(slug, 'ố', 'o');
    slug := REPLACE(slug, 'ồ', 'o');
    slug := REPLACE(slug, 'ổ', 'o');
    slug := REPLACE(slug, 'ỗ', 'o');
    slug := REPLACE(slug, 'ộ', 'o');
    slug := REPLACE(slug, 'ơ', 'o');
    slug := REPLACE(slug, 'ớ', 'o');
    slug := REPLACE(slug, 'ờ', 'o');
    slug := REPLACE(slug, 'ở', 'o');
    slug := REPLACE(slug, 'ỡ', 'o');
    slug := REPLACE(slug, 'ợ', 'o');
    
    slug := REPLACE(slug, 'ú', 'u');
    slug := REPLACE(slug, 'ù', 'u');
    slug := REPLACE(slug, 'ủ', 'u');
    slug := REPLACE(slug, 'ũ', 'u');
    slug := REPLACE(slug, 'ụ', 'u');
    slug := REPLACE(slug, 'ư', 'u');
    slug := REPLACE(slug, 'ứ', 'u');
    slug := REPLACE(slug, 'ừ', 'u');
    slug := REPLACE(slug, 'ử', 'u');
    slug := REPLACE(slug, 'ữ', 'u');
    slug := REPLACE(slug, 'ự', 'u');
    
    slug := REPLACE(slug, 'ý', 'y');
    slug := REPLACE(slug, 'ỳ', 'y');
    slug := REPLACE(slug, 'ỷ', 'y');
    slug := REPLACE(slug, 'ỹ', 'y');
    slug := REPLACE(slug, 'ỵ', 'y');
    
    slug := REPLACE(slug, 'đ', 'd');
    
    -- Replace spaces and special characters with hyphens
    slug := REGEXP_REPLACE(slug, '[^a-z0-9]+', '-', 'g');
    
    -- Remove leading/trailing hyphens
    slug := TRIM(BOTH '-' FROM slug);
    
    RETURN slug;
END;
$$ LANGUAGE plpgsql;

-- Update existing records with slugs
UPDATE artists SET slug = generate_slug(name) WHERE slug IS NULL;
UPDATE composers SET slug = generate_slug(name) WHERE slug IS NULL;
UPDATE genres SET slug = generate_slug(name) WHERE slug IS NULL;
UPDATE albums SET slug = generate_slug(title) WHERE slug IS NULL;

-- Handle duplicate slugs by appending numbers
DO $$
DECLARE
    r RECORD;
    counter INTEGER;
    new_slug TEXT;
BEGIN
    -- Handle artists
    FOR r IN SELECT id, name FROM artists WHERE slug IN (
        SELECT slug FROM artists GROUP BY slug HAVING COUNT(*) > 1
    ) LOOP
        counter := 1;
        new_slug := generate_slug(r.name) || '-' || counter;
        
        WHILE EXISTS (SELECT 1 FROM artists WHERE slug = new_slug AND id != r.id) LOOP
            counter := counter + 1;
            new_slug := generate_slug(r.name) || '-' || counter;
        END LOOP;
        
        UPDATE artists SET slug = new_slug WHERE id = r.id;
    END LOOP;
    
    -- Handle composers
    FOR r IN SELECT id, name FROM composers WHERE slug IN (
        SELECT slug FROM composers GROUP BY slug HAVING COUNT(*) > 1
    ) LOOP
        counter := 1;
        new_slug := generate_slug(r.name) || '-' || counter;
        
        WHILE EXISTS (SELECT 1 FROM composers WHERE slug = new_slug AND id != r.id) LOOP
            counter := counter + 1;
            new_slug := generate_slug(r.name) || '-' || counter;
        END LOOP;
        
        UPDATE composers SET slug = new_slug WHERE id = r.id;
    END LOOP;
    
    -- Handle genres
    FOR r IN SELECT id, name FROM genres WHERE slug IN (
        SELECT slug FROM genres GROUP BY slug HAVING COUNT(*) > 1
    ) LOOP
        counter := 1;
        new_slug := generate_slug(r.name) || '-' || counter;
        
        WHILE EXISTS (SELECT 1 FROM genres WHERE slug = new_slug AND id != r.id) LOOP
            counter := counter + 1;
            new_slug := generate_slug(r.name) || '-' || counter;
        END LOOP;
        
        UPDATE genres SET slug = new_slug WHERE id = r.id;
    END LOOP;
    
    -- Handle albums
    FOR r IN SELECT id, title FROM albums WHERE slug IN (
        SELECT slug FROM albums GROUP BY slug HAVING COUNT(*) > 1
    ) LOOP
        counter := 1;
        new_slug := generate_slug(r.title) || '-' || counter;
        
        WHILE EXISTS (SELECT 1 FROM albums WHERE slug = new_slug AND id != r.id) LOOP
            counter := counter + 1;
            new_slug := generate_slug(r.title) || '-' || counter;
        END LOOP;
        
        UPDATE albums SET slug = new_slug WHERE id = r.id;
    END LOOP;
END $$;
