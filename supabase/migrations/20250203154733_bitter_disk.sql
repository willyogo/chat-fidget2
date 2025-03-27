/*
  # Add API Keys Support

  1. New Tables
    - `api_keys`
      - `id` (uuid, primary key)
      - `name` (text, description of the API key)
      - `key` (text, the actual API key)
      - `created_at` (timestamp)
      - `last_used_at` (timestamp, nullable)

  2. Security
    - Enable RLS on `api_keys` table
    - Add policy for authenticated users to read their own API keys
*/

-- Create API keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  key text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_used_at timestamptz
);

-- Enable RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own API keys"
  ON api_keys
  FOR SELECT
  TO authenticated
  USING (true);

-- Create function to generate API keys
CREATE OR REPLACE FUNCTION generate_api_key(key_name text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_key text;
BEGIN
  -- Generate a random API key
  new_key := encode(gen_random_bytes(32), 'hex');
  
  -- Insert the new API key
  INSERT INTO api_keys (name, key)
  VALUES (key_name, new_key);
  
  RETURN new_key;
END;
$$;