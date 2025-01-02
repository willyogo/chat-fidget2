/*
  # Update room update policy

  Updates the RLS policy for room updates to check against user_metadata.wallet_address
  instead of JWT claims, since we're storing the wallet address in metadata.
*/

-- Drop existing policy
DROP POLICY IF EXISTS "Only wallet owners can update rooms" ON rooms;

-- Create new policy using user_metadata
CREATE POLICY "Only wallet owners can update rooms"
  ON rooms FOR UPDATE
  USING (
    owner_address = (auth.jwt() -> 'user_metadata' ->> 'wallet_address')::text
  );