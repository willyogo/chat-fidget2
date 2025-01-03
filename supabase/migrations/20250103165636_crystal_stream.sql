-- Enable storage
CREATE EXTENSION IF NOT EXISTS "storage" SCHEMA "extensions";

-- Create avatars bucket
INSERT INTO storage.buckets (id, name)
VALUES ('avatars', 'avatars')
ON CONFLICT DO NOTHING;

-- Set up storage policy for avatars
CREATE POLICY "Avatar public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

CREATE POLICY "Avatar upload access"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Avatar delete access"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'avatars');