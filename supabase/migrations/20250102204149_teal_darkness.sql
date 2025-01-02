/*
  # Enable realtime for messages

  1. Changes
    - Create publication for realtime if it doesn't exist
    - Add messages table to the publication
*/

-- Create the publication if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
  ) THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
END
$$;

-- Add messages table to the publication
ALTER PUBLICATION supabase_realtime ADD TABLE messages;