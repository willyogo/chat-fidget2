-- Revoke existing trigger
DROP TRIGGER IF EXISTS refresh_room_stats_trigger ON messages;
DROP FUNCTION IF EXISTS refresh_room_stats();

-- Create function with security definer
CREATE OR REPLACE FUNCTION refresh_room_stats()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY room_stats;
  RETURN NULL;
END;
$$;

-- Recreate trigger
CREATE TRIGGER refresh_room_stats_trigger
AFTER INSERT OR UPDATE OR DELETE ON messages
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_room_stats();

-- Grant usage on room_stats to public
GRANT SELECT ON room_stats TO public;
GRANT USAGE ON SCHEMA public TO public;

-- Ensure authenticated users can insert messages
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'messages' 
    AND policyname = 'Authenticated users can insert messages'
  ) THEN
    CREATE POLICY "Authenticated users can insert messages"
      ON messages FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;