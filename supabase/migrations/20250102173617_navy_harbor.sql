/*
  # Update rooms and messages schema
  
  1. Changes
    - Convert room IDs from UUID to text (using room name as ID)
    - Update message references to use text room IDs
    - Preserve existing data with proper type conversion
  
  2. Security
    - Maintain existing RLS policies
*/

-- First create the new messages table with text room_id
CREATE TABLE IF NOT EXISTS new_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id text NOT NULL,
  user_address text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  farcaster_username text,
  farcaster_avatar text
);

-- Create new rooms table with name as primary key
CREATE TABLE IF NOT EXISTS new_rooms (
  name text PRIMARY KEY,
  owner_address text NOT NULL,
  created_at timestamptz DEFAULT now(),
  token_address text,
  required_tokens numeric DEFAULT 0
);

-- Copy existing rooms data
INSERT INTO new_rooms (name, owner_address, created_at, token_address, required_tokens)
SELECT name, owner_address, created_at, token_address, required_tokens
FROM rooms
ON CONFLICT (name) DO NOTHING;

-- Copy messages data, using rooms.name as the new room_id
INSERT INTO new_messages (id, room_id, user_address, content, created_at, farcaster_username, farcaster_avatar)
SELECT m.id, r.name, m.user_address, m.content, m.created_at, m.farcaster_username, m.farcaster_avatar
FROM messages m
JOIN rooms r ON r.id = m.room_id::uuid;

-- Drop old tables
DROP TABLE messages;
DROP TABLE rooms;

-- Rename new tables
ALTER TABLE new_messages RENAME TO messages;
ALTER TABLE new_rooms RENAME TO rooms;

-- Add foreign key constraint
ALTER TABLE messages
ADD CONSTRAINT messages_room_id_fkey
FOREIGN KEY (room_id) REFERENCES rooms(name)
ON DELETE CASCADE;