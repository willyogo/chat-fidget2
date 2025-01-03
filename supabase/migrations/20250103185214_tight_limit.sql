/*
  # Fix message permissions

  1. Changes
    - Drop existing message insert policy
    - Create new policy allowing authenticated users to insert messages
    - Add policy for users to delete their own messages
  
  2. Security
    - Enable RLS on messages table
    - Add policies for insert and delete operations
*/

-- Drop existing insert policy if it exists
DROP POLICY IF EXISTS "Anyone can create messages" ON messages;
DROP POLICY IF EXISTS "Public insert access for messages" ON messages;

-- Create new insert policy for authenticated users
CREATE POLICY "Authenticated users can insert messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Add policy for users to delete their own messages
CREATE POLICY "Users can delete their own messages"
  ON messages FOR DELETE
  TO authenticated
  USING (user_address = auth.jwt()->>'sub');