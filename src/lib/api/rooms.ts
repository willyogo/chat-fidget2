import { supabase } from '../supabase';
import type { Database } from '../types/supabase';

type Room = Database['public']['Tables']['rooms']['Row'];

export async function getRoom(name: string): Promise<Room | null> {
  const { data, error } = await supabase
    .from('rooms')
    .select()
    .eq('name', name)
    .single();
    
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function upsertRoom(
  name: string, 
  ownerAddress: string, 
  tokenAddress: string | null
): Promise<Room> {
  // First try to get existing room
  const existing = await getRoom(name);
  if (existing) return existing;

  // If no existing room, create new one
  const { data, error } = await supabase
    .from('rooms')
    .insert({
      name,
      owner_address: ownerAddress,
      token_address: tokenAddress,
    })
    .select()
    .single();
    
  if (error) throw error;
  if (!data) throw new Error('Failed to create room');
  
  return data;
}