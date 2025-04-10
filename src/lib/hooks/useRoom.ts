import { useEffect, useState } from 'react';
import { upsertRoom } from '../api/rooms';
import { isAddress } from 'viem';
import type { Database } from '../types/supabase';
import type { SupportedNetwork } from '../config';

type Room = Database['public']['Tables']['rooms']['Row'];

export function useRoom(roomName: string | null, ownerAddress: string | null) {
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [needsOwnerInput, setNeedsOwnerInput] = useState(false);

  useEffect(() => {
    if (!roomName) {
      setRoom(null);
      setIsLoading(false);
      setError(null);
      setNeedsOwnerInput(false);
      return;
    }

    let mounted = true;
    // console.log('Loading room:', roomName, 'with owner:', ownerAddress);

    async function loadOrCreateRoom() {
      try {
        setIsLoading(true);
        setError(null);
        
        // First try to get the room without creating it
        let roomData = null;

        // If it's a contract address, try both networks
        if (isAddress(roomName) && !ownerAddress) {
          // Try Polygon first
          // console.log('Attempting to detect owner on Polygon first');
          roomData = await upsertRoom(roomName, null, roomName, 'polygon');
          
          // If no owner found on Polygon, try Base
          if (!roomData) {
            // console.log('No owner found on Polygon, trying Base');
            roomData = await upsertRoom(roomName, null, roomName, 'base');
          }
        } else {
          // For non-contract rooms or when owner is provided
          roomData = await upsertRoom(roomName, ownerAddress, null);
        }
        
        if (!mounted) return;

        if (!roomData && !ownerAddress) {
          // console.log('Room needs owner input');
          setNeedsOwnerInput(true);
          setRoom(null);
        } else {
          // console.log('Room loaded:', roomData);
          setRoom(roomData);
          setNeedsOwnerInput(false);
        }
        setError(null);
      } catch (err) {
        // console.error('Room error:', err);
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to load room'));
          setRoom(null);
          setNeedsOwnerInput(false);
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