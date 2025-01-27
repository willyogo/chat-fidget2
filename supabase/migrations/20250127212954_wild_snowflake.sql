/*
  # Convert owner addresses to lowercase

  1. Changes
    - Updates all existing room owner addresses to lowercase
    - Ensures consistent case handling for owner addresses

  2. Notes
    - Safe migration that preserves data while normalizing case
    - No data loss or structural changes
*/

-- Convert all existing owner addresses to lowercase
UPDATE rooms
SET owner_address = LOWER(owner_address)
WHERE owner_address != LOWER(owner_address);

-- Add a check constraint to ensure owner addresses are always lowercase
ALTER TABLE rooms
ADD CONSTRAINT owner_address_lowercase
CHECK (owner_address = LOWER(owner_address));

-- Add comment explaining the constraint
COMMENT ON CONSTRAINT owner_address_lowercase ON rooms IS 'Ensures owner addresses are always stored in lowercase format';