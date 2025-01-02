import { useEffect, useState } from 'react';
import { getTokenOwner } from '../contracts/erc20';
import { upsertRoom } from '../api/rooms';
import { isAddress } from 'viem';
import type { Database } from '../types/supabase';

type Room = Database['public']['Tables']['rooms']['Row'];

export function useRoom(roomName: string | null, ownerAddress: string | null) {
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!roomName) {
      setIsLoading(false);
      return;
    }

    async function loadOrCreateRoom() {
      try {
        // Determine owner address
        let finalOwnerAddress = ownerAddress;
        if (isAddress(roomName)) {
          const tokenOwner = await getTokenOwner(roomName);
          if (tokenOwner) {
            finalOwnerAddress = tokenOwner;
          }
        }

        // Use room name as fallback owner
        if (!finalOwnerAddress) {
          finalOwnerAddress = roomName;
        }

        // Upsert room (create if not exists, or get existing)
        const roomData = await upsertRoom(
          roomName,
          finalOwnerAddress,
          isAddress(roomName) ? roomName : null
        );
        
        setRoom(roomData);
        setError(null);
      } catch (err) {
        console.error('Room error:', err);
        setError(err instanceof Error ? err : new Error('Failed to load/create room'));
      } finally {
        setIsLoading(false);
      }
    }

    loadOrCreateRoom();
  }, [roomName, ownerAddress]);

  return { room, isLoading, error };
}