/*
  # Add room statistics

  1. New Views
    - `room_stats` - Aggregates message and user counts per room
      - `room_name` (text, primary key)
      - `message_count` (bigint)
      - `unique_users` (bigint)
      - `last_message_at` (timestamptz)

  2. Indexes
    - Index on messages(room_id, created_at) for efficient stats calculation
    - Index on messages(user_address) for unique user counting
*/

-- Create index for efficient stats calculation
CREATE INDEX IF NOT EXISTS messages_room_stats_idx 
ON messages(room_id, created_at);

CREATE INDEX IF NOT EXISTS messages_user_stats_idx 
ON messages(room_id, user_address);

-- Create materialized view for room statistics
CREATE MATERIALIZED VIEW room_stats AS
SELECT 
  room_id as room_name,
  COUNT(*) as message_count,
  COUNT(DISTINCT user_address) as unique_users,
  MAX(created_at) as last_message_at
FROM messages
GROUP BY room_id;

-- Create index on the materialized view
CREATE UNIQUE INDEX room_stats_room_name_idx ON room_stats(room_name);

-- Create function to refresh stats
CREATE OR REPLACE FUNCTION refresh_room_stats()
RETURNS trigger AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY room_stats;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to refresh stats
CREATE TRIGGER refresh_room_stats_trigger
AFTER INSERT OR UPDATE OR DELETE ON messages
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_room_stats();

-- Grant access to the view
GRANT SELECT ON room_stats TO public;