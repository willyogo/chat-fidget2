/*
  # Add token network support
  
  1. Changes
    - Add `token_network` column to rooms table to track which network the token is on
    - Default to 'base' for existing tokens
    - Add check constraint to ensure valid networks
  
  2. Data Migration
    - Set existing token gates to use Base network
*/

-- Add token_network column with check constraint
ALTER TABLE rooms
ADD COLUMN token_network text;

-- Create an enum-like check constraint for network values
ALTER TABLE rooms
ADD CONSTRAINT valid_token_network
CHECK (token_network IS NULL OR token_network IN ('base', 'polygon'));

-- Set default network to 'base' for existing token gates
UPDATE rooms 
SET token_network = 'base' 
WHERE token_address IS NOT NULL AND token_network IS NULL;

-- Add trigger to ensure token_network is set when token_address is set
CREATE OR REPLACE FUNCTION ensure_token_network()
RETURNS trigger AS $$
BEGIN
  IF NEW.token_address IS NOT NULL AND NEW.token_network IS NULL THEN
    NEW.token_network := 'base';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_token_network
BEFORE INSERT OR UPDATE ON rooms
FOR EACH ROW
EXECUTE FUNCTION ensure_token_network();

-- Add comment explaining the column
COMMENT ON COLUMN rooms.token_network IS 'The blockchain network where the token contract is deployed (base or polygon)';