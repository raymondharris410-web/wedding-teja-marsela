-- =====================================================
-- FIX SUPABASE POLICIES & CLEAR DUMMY DATA
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- =====================================================

-- 1. CLEAR DUMMY WISHES (Make it 100% Live!)
TRUNCATE TABLE wishes;

-- 2. DROP PREVIOUS RESTRICTIVE POLICIES
DROP POLICY IF EXISTS "Anyone can submit RSVP" ON rsvp;
DROP POLICY IF EXISTS "Admin can read all RSVP" ON rsvp;
DROP POLICY IF EXISTS "Admin can delete RSVP" ON rsvp;
DROP POLICY IF EXISTS "Anyone can submit wishes" ON wishes;
DROP POLICY IF EXISTS "Anyone can read wishes" ON wishes;
DROP POLICY IF EXISTS "Admin can delete wishes" ON wishes;

-- 3. RSVP POLICIES:
-- Both public visitors (anon) and logged in users can submit RSVP
CREATE POLICY "Anyone can submit RSVP"
  ON rsvp FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Authenticated admin can read all RSVP data
CREATE POLICY "Admin can read all RSVP"
  ON rsvp FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated admin can delete RSVP data
CREATE POLICY "Admin can delete RSVP"
  ON rsvp FOR DELETE
  TO authenticated
  USING (true);

-- 4. WISHES POLICIES:
-- Both public visitors (anon) and logged in users can submit wishes
CREATE POLICY "Anyone can submit wishes"
  ON wishes FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Both public visitors (anon) and admin (authenticated) can read wishes!
CREATE POLICY "Anyone can read wishes"
  ON wishes FOR SELECT
  TO anon, authenticated
  USING (true);

-- Authenticated admin can delete wishes
CREATE POLICY "Admin can delete wishes"
  ON wishes FOR DELETE
  TO authenticated
  USING (true);
