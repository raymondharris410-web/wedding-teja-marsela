-- =====================================================
-- FIX SUPABASE PERMISSIONS — COMPLETE FIX
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- =====================================================

-- =====================================================
-- STEP 1: GRANT TABLE PERMISSIONS (THIS WAS MISSING!)
-- =====================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- RSVP table: anon can INSERT, authenticated can SELECT/INSERT/DELETE
GRANT INSERT ON TABLE public.rsvp TO anon;
GRANT SELECT, INSERT, DELETE ON TABLE public.rsvp TO authenticated;

-- Wishes table: anon can INSERT and SELECT, authenticated can all
GRANT SELECT, INSERT ON TABLE public.wishes TO anon;
GRANT SELECT, INSERT, DELETE ON TABLE public.wishes TO authenticated;

-- Grant sequence usage (needed for auto-increment IDs)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- =====================================================
-- STEP 2: ENABLE RLS
-- =====================================================
ALTER TABLE rsvp ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 3: DROP OLD POLICIES & RECREATE
-- =====================================================
DROP POLICY IF EXISTS "Anyone can submit RSVP" ON rsvp;
DROP POLICY IF EXISTS "Admin can read all RSVP" ON rsvp;
DROP POLICY IF EXISTS "Admin can delete RSVP" ON rsvp;
DROP POLICY IF EXISTS "Anyone can submit wishes" ON wishes;
DROP POLICY IF EXISTS "Anyone can read wishes" ON wishes;
DROP POLICY IF EXISTS "Admin can delete wishes" ON wishes;

-- RSVP Policies
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

-- Wishes Policies
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
-- STEP 4: CLEAR DUMMY WISHES (100% LIVE ONLY!)
-- =====================================================
TRUNCATE TABLE wishes;

-- =====================================================
-- DONE! Test by submitting RSVP on the website.
-- =====================================================
