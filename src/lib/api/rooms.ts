import { supabase } from '../auth/supabase';
import { isAddress } from 'viem';
import { getTokenOwner } from '../contracts/owner';
import type { Database } from '../types/supabase';
import type { SupportedNetwork } from '../config';

type Room = Database['public']['Tables']['rooms']['Row'];

export async function getRoom(name: string): Promise<Room | null> {
  // Normalize room name to lowercase
  const normalizedName = name.toLowerCase();
  
  const { data, error } = await supabase
    .from('rooms')
    .select()
    .eq('name', normalizedName)
    .single();
    
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function upsertRoom(
  name: string, 
  ownerAddress: string | null, 
  tokenAddress: string | null,
  network: SupportedNetwork = 'base'
): Promise<Room | null> {
  try {
    // Normalize room name to lowercase
    const normalizedName = name.toLowerCase();

    // First try to get existing room
    const existing = await getRoom(normalizedName);
    if (existing) return existing;

    // If no owner address is provided and room name is a contract address
    // try to get its owner
    if (!ownerAddress && isAddress(normalizedName)) {
      const contractOwner = await getTokenOwner(normalizedName, network);
      
      if (contractOwner) {
        ownerAddress = contractOwner;
      }
    }

    // If we still don't have an owner address, return null to prompt for input
    if (!ownerAddress) {
      return null;
    }

    // Create new room with normalized name
    const { data, error } = await supabase
      .from('rooms')
      .insert({
        name: normalizedName,
        owner_address: ownerAddress.toLowerCase(),
        token_address: tokenAddress,
        token_network: isAddress(normalizedName) ? network : null,
        required_tokens: 0,
        use_contract_avatar: isAddress(normalizedName)
      })
      .select()
      .single();

    if (error) {
      // If we hit a unique constraint error, try to get the room again
      // as it might have been created by another concurrent request
      if (error.code === '23505') {
        const existingRoom = await getRoom(normalizedName);
        if (existingRoom) return existingRoom;
      }
      throw error;
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function getPopularRooms(limit = 11): Promise<Room[]> {
  const { data, error } = await supabase
    .from('room_stats')
    .select(`
      room_name,
      message_count,
      unique_users,
      rooms (
        name,
        owner_address,
        token_address,
        token_network,
        required_tokens,
        avatar_url,
        use_contract_avatar
      )
    `)
    .order('message_count', { ascending: false })
    .limit(limit);

  if (error) throw error;

  return data.map(stat => ({
    ...stat.rooms,
    message_count: stat.message_count,
    unique_users: stat.unique_users
  }));
}