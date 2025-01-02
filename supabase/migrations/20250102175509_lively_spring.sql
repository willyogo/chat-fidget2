-- Drop existing policies
DROP POLICY IF EXISTS "Public read access for rooms" ON rooms;
DROP POLICY IF EXISTS "Public insert access for rooms" ON rooms;
DROP POLICY IF EXISTS "Owner can update room" ON rooms;
DROP POLICY IF EXISTS "Public read access for messages" ON rooms;
DROP POLICY IF EXISTS "Public insert access for messages" ON messages;

-- Create new public policies for rooms
CREATE POLICY "Anyone can read rooms"
  ON rooms FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create rooms"
  ON rooms FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update rooms"
  ON rooms FOR UPDATE
  USING (true);

-- Create new public policies for messages
CREATE POLICY "Anyone can read messages"
  ON messages FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create messages"
  ON messages FOR INSERT
  WITH CHECK (true);