/*
  # Add Room Avatars

  1. Schema Changes
    - Add `avatar_url` column to rooms table
    - Add `avatar_updated_at` column to track last manual update
    - Add `use_contract_avatar` boolean to control avatar source preference

  2. Security
    - Update RLS policies to allow avatar updates by room owners
*/

-- Add new columns to rooms table
ALTER TABLE rooms 
ADD COLUMN avatar_url text,
ADD COLUMN avatar_updated_at timestamptz,
ADD COLUMN use_contract_avatar boolean DEFAULT true;

-- Create policy for avatar updates
CREATE POLICY "Room owners can update avatars"
  ON rooms
  FOR UPDATE
  USING (owner_address = current_user)
  WITH CHECK (owner_address = current_user);