import { supabase } from '../supabase';
import type { Database } from '../types/supabase';

type Message = Database['public']['Tables']['messages']['Row'];

export async function getMessages(roomId: string, limit = 50, before?: string): Promise<Message[]> {
  // Normalize room ID to lowercase
  const normalizedRoomId = roomId.toLowerCase();
  
  let query = supabase
    .from('messages')
    .select()
    .eq('room_id', normalizedRoomId)
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
  // Normalize room ID to lowercase
  const normalizedRoomId = roomId.toLowerCase();
  
  try {
    // Get Farcaster identity from Edge Function
    const response = await fetch(`${supabase.supabaseUrl}/functions/v1/farcaster`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabase.supabaseKey}`,
      },
      body: JSON.stringify({ address: userAddress.toLowerCase() }),
    });

    const data = await response.json();
    const user = data.result?.user;

    const { data: messageData, error } = await supabase
      .from('messages')
      .insert({
        room_id: normalizedRoomId,
        user_address: userAddress,
        content: content.trim(),
        farcaster_username: user?.username || null,
        farcaster_avatar: user?.pfp_url || null
      })
      .select()
      .single();

    if (error) throw error;
    return messageData;
  } catch (error) {
    console.error('Error sending message:', error);
    
    // Fallback: Send message without Farcaster data if lookup fails
    const { data, error: insertError } = await supabase
      .from('messages')
      .insert({
        room_id: normalizedRoomId,
        user_address: userAddress,
        content: content.trim(),
      })
      .select()
      .single();

    if (insertError) throw insertError;
    return data;
  }
}