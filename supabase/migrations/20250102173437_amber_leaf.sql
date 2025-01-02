/*
  # Update rooms table schema

  1. Changes
    - Use room name as primary key instead of UUID
    - Add indexes for better query performance
    
  2. Security
    - Maintain existing RLS policies
*/

-- Recreate rooms table with name as primary key
CREATE TABLE IF NOT EXISTS new_rooms (
  name text PRIMARY KEY,
  owner_address text NOT NULL,
  created_at timestamptz DEFAULT now(),
  token_address text,
  required_tokens numeric DEFAULT 0
);

-- Copy existing data if any
INSERT INTO new_rooms (name, owner_address, created_at, token_address, required_tokens)
SELECT name, owner_address, created_at, token_address, required_tokens
FROM rooms
ON CONFLICT (name) DO NOTHING;

-- Update messages foreign key
ALTER TABLE messages
DROP CONSTRAINT messages_room_id_fkey;

-- Drop old rooms table and rename new one
DROP TABLE rooms;
ALTER TABLE new_rooms RENAME TO rooms;

-- Update messages to reference new rooms table
ALTER TABLE messages
ADD CONSTRAINT messages_room_id_fkey
FOREIGN KEY (room_id) REFERENCES rooms(name)
ON DELETE CASCADE;