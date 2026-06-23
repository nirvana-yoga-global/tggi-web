-- Run this in the Supabase SQL Editor.

-- 1. Add is_approved column to tggi_registrations (defaults false = pending review)
ALTER TABLE tggi_registrations
  ADD COLUMN IF NOT EXISTS is_approved boolean NOT NULL DEFAULT false;

-- 2. Create featured photos table for curated TGGI/NYG content
CREATE TABLE IF NOT EXISTS tggi_featured_photos (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz DEFAULT now(),
  plant_name  text        NOT NULL,
  category    text        NOT NULL,
  photo_url   text        NOT NULL,
  location    text,
  source_name text        DEFAULT 'Nirvana Yoga Global'
);

ALTER TABLE tggi_featured_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view featured photos"
  ON tggi_featured_photos FOR SELECT
  TO anon, authenticated
  USING (true);
