/*
  # Update room policies to restrict updates to owners
  
  1. Changes
    - Drop existing update policy for rooms
    - Add new policy that only allows room owners to update their rooms
    
  2. Security
    - Ensures only room owners can modify room settings
    - Compares owner_address with the user's wallet address
*/

-- Drop the existing update policy
DROP POLICY IF EXISTS "Anyone can update rooms" ON rooms;

-- Create new policy that only allows owners to update their rooms
CREATE POLICY "Only owners can update rooms"
  ON rooms FOR UPDATE
  USING (owner_address = current_user);