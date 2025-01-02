import { useEffect, useState } from 'react';
import { upsertRoom } from '../api/rooms';
import { isAddress } from 'viem';
import type { Database } from '../types/supabase';

type Room = Database['public']['Tables']['rooms']['Row'];

export function useRoom(roomName: string | null, ownerAddress: string | null) {
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [needsOwnerInput, setNeedsOwnerInput] = useState(false);

  useEffect(() => {
    if (!roomName) {
      setIsLoading(false);
      return;
    }

    let mounted = true;

    async function loadOrCreateRoom() {
      try {
        // First try to get the room without creating it
        const roomData = await upsertRoom(roomName, ownerAddress, isAddress(roomName) ? roomName : null);
        
        if (mounted) {
          if (!roomData && !ownerAddress) {
            setNeedsOwnerInput(true);
            setIsLoading(false);
            return;
          }
          setRoom(roomData);
          setError(null);
          setNeedsOwnerInput(false);
        }
      } catch (err) {
        console.error('Room error:', err);
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to load room'));
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadOrCreateRoom();
    return () => { mounted = false; };
  }, [roomName, ownerAddress]);

  return { room, isLoading, error, needsOwnerInput };
}