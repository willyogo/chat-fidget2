/*
  # Chat Application Schema

  1. New Tables
    - `rooms`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `owner_address` (text)
      - `created_at` (timestamp)
      - `token_address` (text, nullable)
      - `required_tokens` (numeric, nullable)
    
    - `messages`
      - `id` (uuid, primary key)
      - `room_id` (uuid, foreign key)
      - `user_address` (text)
      - `content` (text)
      - `created_at` (timestamp)
      - `farcaster_username` (text, nullable)
      - `farcaster_avatar` (text, nullable)

  2. Security
    - Enable RLS on both tables
    - Add policies for room access and message creation
*/

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  owner_address text NOT NULL,
  created_at timestamptz DEFAULT now(),
  token_address text,
  required_tokens numeric DEFAULT 0
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE,
  user_address text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  farcaster_username text,
  farcaster_avatar text
);

-- Enable RLS
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Room policies
CREATE POLICY "Anyone can view rooms"
  ON rooms
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only owner can update room"
  ON rooms
  FOR UPDATE
  TO authenticated
  USING (owner_address = auth.jwt()->>'sub');

-- Message policies
CREATE POLICY "Anyone can view messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (true);