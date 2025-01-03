import { supabase } from '../supabase';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml'];

export async function uploadRoomAvatar(
  roomName: string,
  file: File,
  ownerAddress: string
): Promise<string> {
  // Validate file
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Only PNG, JPG, and SVG files are allowed.');
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File too large. Maximum size is 2MB.');
  }

  // Upload to Supabase Storage
  const fileName = `room-avatars/${roomName}-${Date.now()}`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);

  // Update room record
  const { error: updateError } = await supabase
    .from('rooms')
    .update({
      avatar_url: publicUrl,
      avatar_updated_at: new Date().toISOString(),
      use_contract_avatar: false
    })
    .eq('name', roomName)
    .eq('owner_address', ownerAddress.toLowerCase());

  if (updateError) throw updateError;

  return publicUrl;
}

export async function resetToContractAvatar(
  roomName: string,
  ownerAddress: string
): Promise<void> {
  const { error } = await supabase
    .from('rooms')
    .update({
      avatar_url: null,
      avatar_updated_at: null,
      use_contract_avatar: true
    })
    .eq('name', roomName)
    .eq('owner_address', ownerAddress.toLowerCase());

  if (error) throw error;
}