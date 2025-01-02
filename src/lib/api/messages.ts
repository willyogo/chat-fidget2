import { supabase } from '../supabase';
import { queryAirstack } from '../airstack/client';
import { GET_FARCASTER_IDENTITY } from '../airstack/queries';
import type { Database } from '../types/supabase';

type Message = Database['public']['Tables']['messages']['Row'];

export async function getMessages(roomId: string, limit = 50, before?: string): Promise<Message[]> {
  let query = supabase
    .from('messages')
    .select()
    .eq('room_id', roomId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (before) {
    query = query.lt('created_at', before);
  }

  const { data, error } = await query;
  if (error) throw error;
  
  // Return messages in ascending order for display
  return (data || []).reverse();
}

export async function sendMessage(
  roomId: string,
  userAddress: string,
  content: string
): Promise<Message> {
  const { data: farcasterData } = await queryAirstack(GET_FARCASTER_IDENTITY, { 
    address: userAddress.toLowerCase() 
  });
  
  const social = farcasterData?.Socials?.Social?.[0];

  const { data, error } = await supabase
    .from('messages')
    .insert({
      room_id: roomId,
      user_address: userAddress,
      content: content.trim(),
      farcaster_username: social?.profileName || null,
      farcaster_avatar: social?.profileImage || null
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}