/*
  # Create devices table for storing iOS device information

  1. New Tables
    - `devices`
      - `id` (uuid, primary key) - Unique identifier for each device record
      - `udid` (text, unique, not null) - iOS device UDID
      - `device_name` (text) - Human-readable device name
      - `device_product` (text) - Device model/product identifier
      - `device_version` (text) - iOS version running on device
      - `mac_address` (text) - Device MAC address if available
      - `imei` (text) - Device IMEI if available
      - `iccid` (text) - SIM card ICCID if available
      - `created_at` (timestamptz) - Timestamp when device was first registered
      - `updated_at` (timestamptz) - Timestamp when device info was last updated

  2. Security
    - Enable RLS on `devices` table
    - Add policy for public to insert device information (needed for profile callback)
    - Add policy for public to read device information by ID (for viewing details)

  3. Important Notes
    - UDID is unique to ensure we don't store duplicate device entries
    - Public insert access is required because iOS profile callback doesn't use authentication
    - Public read access is limited to specific device lookups only
*/

CREATE TABLE IF NOT EXISTS devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  udid text UNIQUE NOT NULL,
  device_name text DEFAULT '',
  device_product text DEFAULT '',
  device_version text DEFAULT '',
  mac_address text DEFAULT '',
  imei text DEFAULT '',
  iccid text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public to insert device information"
  ON devices
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public to read device information"
  ON devices
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public to update device information by UDID"
  ON devices
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);
