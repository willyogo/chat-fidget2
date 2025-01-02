/*
  # Fix room update policy

  1. Changes
    - Drop existing update policy
    - Create new policy that checks against wallet_address in auth.jwt()
  
  2. Security
    - Only wallet owners can update their rooms
    - Uses auth.jwt() -> wallet_address for verification
*/

-- Drop the existing update policy
DROP POLICY IF EXISTS "Only owners can update rooms" ON rooms;

-- Create new policy that checks against wallet address in JWT claims
CREATE POLICY "Only wallet owners can update rooms"
  ON rooms FOR UPDATE
  USING (
    owner_address = (auth.jwt() ->> 'wallet_address')::text
  );