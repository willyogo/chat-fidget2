/*
  # Add storage for room avatars
  
  1. Create avatars bucket
  2. Set up storage policies for:
    - Public read access
    - Authenticated upload access
    - Owner delete access
*/

-- Create avatars bucket if it doesn't exist
DO $$
BEGIN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('avatars', 'avatars', true)
    ON CONFLICT (id) DO NOTHING;
END $$;

-- Set up storage policies
CREATE POLICY "Public read access for avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
TO public
WITH CHECK (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = 'room-avatars'
);

CREATE POLICY "Room owners can delete their avatars"
ON storage.objects FOR DELETE
TO public
USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = 'room-avatars'
);