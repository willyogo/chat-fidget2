import { supabase } from '../supabase';
import { isAddress } from 'viem';
import { getTokenOwner } from '../contracts/owner';
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
  ownerAddress: string | null, 
  tokenAddress: string | null
): Promise<Room | null> {
  try {
    // First try to get existing room
    const existing = await getRoom(name);
    if (existing) return existing;

    // If no owner address is provided and room name is a contract address
    // try to get its owner
    if (!ownerAddress && isAddress(name)) {
      const contractOwner = await getTokenOwner(name);
      if (contractOwner) {
        ownerAddress = contractOwner;
      }
    }

    // If we still don't have an owner address, return null to prompt for input
    if (!ownerAddress) {
      return null;
    }

    // Create new room
    const { data, error } = await supabase
      .from('rooms')
      .insert({
        name,
        owner_address: ownerAddress,
        token_address: tokenAddress,
      })
      .select()
      .single();

    if (error) {
      // If we hit a unique constraint error, try to get the room again
      // as it might have been created by another concurrent request
      if (error.code === '23505') {
        const existingRoom = await getRoom(name);
        if (existingRoom) return existingRoom;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error upserting room:', error);
    throw error;
  }
}