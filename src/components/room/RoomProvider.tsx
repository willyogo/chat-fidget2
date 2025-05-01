import { createContext, useEffect, useState, useCallback } from 'react';
import { useSearchParams } from './useSearchParams';
import { useRoom } from '../../lib/hooks/useRoom';
import { useRoomStore } from '../../lib/store/room';
import { isAddress } from 'viem';
import type { Database } from '../../lib/types/supabase';

type Room = Database['public']['Tables']['rooms']['Row'];

type RoomContextType = {
  room: Room | null;
  isLoading: boolean;
  error: Error | null;
  needsOwnerInput: boolean;
  setOwnerAddress: (address: string) => void;
};

export const RoomContext = createContext<RoomContextType | undefined>(undefined);

export function RoomProvider({ children }: { children: React.ReactNode }) {
  const { roomName, ownerAddress } = useSearchParams();
  const [manualOwnerAddress, setManualOwnerAddress] = useState<string | null>(null);
  const { room, isLoading, error, needsOwnerInput } = useRoom(
    roomName, 
    // Use URL owner parameter if valid, otherwise use manual input
    (ownerAddress && isAddress(ownerAddress)) ? ownerAddress.toLowerCase() : manualOwnerAddress
  );
  const { setRoom, setLoading, setError, subscribeToRoom, reset } = useRoomStore();

  // Memoize the setOwnerAddress callback
  const handleSetOwnerAddress = useCallback((address: string) => {
    setManualOwnerAddress(address);
  }, []);

  // Reset state when component unmounts or room name changes
  useEffect(() => {
    setManualOwnerAddress(null);
    return () => {
      reset();
    };
  }, [roomName, reset]);

  // Set up room subscription when we have a valid room
  useEffect(() => {
    if (!roomName) {
      return;
    }
    
    const unsubscribe = subscribeToRoom(roomName);
    
    return () => {
      unsubscribe();
    };
  }, [roomName, subscribeToRoom]);

  // Sync room state
  useEffect(() => {
    setRoom(room);
    setLoading(isLoading);
    setError(error);
  }, [room, isLoading, error, setRoom, setLoading, setError]);

  return (
    <RoomContext.Provider value={{
      room,
      isLoading,
      error,
      needsOwnerInput,
      setOwnerAddress: handleSetOwnerAddress
    }}>
      {children}
    </RoomContext.Provider>
  );
}