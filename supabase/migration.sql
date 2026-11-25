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

-- 2. Wishes Table (public-facing live wishes)
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

-- Drop old policies if they exist
DROP POLICY IF EXISTS "Anyone can submit RSVP" ON rsvp;
DROP POLICY IF EXISTS "Admin can read all RSVP" ON rsvp;
DROP POLICY IF EXISTS "Admin can delete RSVP" ON rsvp;
DROP POLICY IF EXISTS "Anyone can submit wishes" ON wishes;
DROP POLICY IF EXISTS "Anyone can read wishes" ON wishes;
DROP POLICY IF EXISTS "Admin can delete wishes" ON wishes;

-- RSVP Policies:
CREATE POLICY "Anyone can submit RSVP"
  ON rsvp FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can read all RSVP"
  ON rsvp FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can delete RSVP"
  ON rsvp FOR DELETE
  TO authenticated
  USING (true);

-- Wishes Policies:
CREATE POLICY "Anyone can submit wishes"
  ON wishes FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read wishes"
  ON wishes FOR SELECT
  TO anon, authenticated
  USING (true);

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
