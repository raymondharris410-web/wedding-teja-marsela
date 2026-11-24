-- =====================================================
-- SUPABASE MIGRATION: Wedding RSVP & Wishes
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- =====================================================

-- 1. RSVP Table
CREATE TABLE IF NOT EXISTS rsvp (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  guest_name    TEXT NOT NULL,
  whatsapp      TEXT,
  attendance    TEXT NOT NULL CHECK (attendance IN ('hadir', 'tidak_hadir')),
  guest_count   INTEGER DEFAULT 1 CHECK (guest_count >= 0 AND guest_count <= 10),
  message       TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- 2. Wishes Table (public-facing approved wishes)
CREATE TABLE IF NOT EXISTS wishes (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  guest_name    TEXT NOT NULL,
  message       TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on both tables
ALTER TABLE rsvp ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;

-- RSVP Policies:
-- Public visitors can INSERT only (submit RSVP)
-- They CANNOT read/update/delete any rows
CREATE POLICY "Anyone can submit RSVP"
  ON rsvp FOR INSERT
  TO anon
  WITH CHECK (true);

-- Authenticated users (admin) can read all RSVP
CREATE POLICY "Admin can read all RSVP"
  ON rsvp FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users (admin) can delete RSVP
CREATE POLICY "Admin can delete RSVP"
  ON rsvp FOR DELETE
  TO authenticated
  USING (true);

-- Wishes Policies:
-- Public visitors can INSERT wishes
CREATE POLICY "Anyone can submit wishes"
  ON wishes FOR INSERT
  TO anon
  WITH CHECK (true);

-- Public visitors can READ wishes (to display on page)
CREATE POLICY "Anyone can read wishes"
  ON wishes FOR SELECT
  TO anon
  USING (true);

-- Authenticated users (admin) can delete wishes
CREATE POLICY "Admin can delete wishes"
  ON wishes FOR DELETE
  TO authenticated
  USING (true);

-- =====================================================
-- INDEXES for performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_rsvp_created_at ON rsvp (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rsvp_attendance ON rsvp (attendance);
CREATE INDEX IF NOT EXISTS idx_wishes_created_at ON wishes (created_at DESC);

-- =====================================================
-- OPTIONAL SEED DATA: Template Wishes
-- =====================================================
INSERT INTO wishes (guest_name, message, created_at) VALUES
  ('Sarah Putri', 'Selamat menempuh hidup baru! Semoga menjadi keluarga yang diberkati Tuhan. God bless! 🙏', now() - interval '5 seconds'),
  ('Budi Santoso', 'Happy Wedding Teja & Marsela! Bahagia selalu ya! 💒', now() - interval '15 seconds'),
  ('Amanda Christine', 'Tuhan memberkati pernikahan kalian. Semoga cinta kalian kekal hingga akhir hayat 💕', now() - interval '30 seconds'),
  ('David Wijaya', 'Congratulations bro! Finally! Semoga bahagia selalu! 🎉', now() - interval '45 seconds'),
  ('Jessica Tanujaya', 'So happy for you both! May God shower you with endless blessings! ✨', now() - interval '50 seconds'),
  ('Michael Pranata', 'Best wishes for the lovely couple! Semoga menjadi keluarga Kristen yang kokoh 🙌', now() - interval '55 seconds');

