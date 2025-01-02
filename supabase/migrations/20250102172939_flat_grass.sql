/*
  # Add public access policies

  1. Changes
    - Allow public access to rooms and messages tables
    - Remove authentication requirement for basic operations

  2. Security
    - Enable public read access to rooms
    - Enable public creation of rooms
    - Enable public read access to messages
    - Enable public creation of messages
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view rooms" ON rooms;
DROP POLICY IF EXISTS "Only owner can update room" ON rooms;
DROP POLICY IF EXISTS "Anyone can view messages" ON messages;
DROP POLICY IF EXISTS "Authenticated users can insert messages" ON messages;

-- Create new public policies for rooms
CREATE POLICY "Public read access for rooms"
  ON rooms FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public insert access for rooms"
  ON rooms FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Owner can update room"
  ON rooms FOR UPDATE
  TO public
  USING (owner_address = current_user);

-- Create new public policies for messages
CREATE POLICY "Public read access for messages"
  ON messages FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public insert access for messages"
  ON messages FOR INSERT
  TO public
  WITH CHECK (true);