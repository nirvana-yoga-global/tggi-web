-- Monthly photo updates for registered plants.
-- Run this in the Supabase SQL Editor.

CREATE TABLE tggi_updates (
  id              uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      timestamptz   DEFAULT now(),
  registration_id uuid          REFERENCES tggi_registrations(id),
  photo_url       text          NOT NULL,
  note            text,
  month_number    integer
);

ALTER TABLE tggi_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can add updates"
  ON tggi_updates FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Public can view updates"
  ON tggi_updates FOR SELECT
  TO anon, authenticated
  USING (true);
