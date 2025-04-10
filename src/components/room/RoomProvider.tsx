import { createContext, useEffect, useState, useCallback } from 'react';
import { useSearchParams } from './useSearchParams';
import { useRoom } from '../../lib/hooks/useRoom';
import { useRoomStore } from '../../lib/store/room';
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
  const { roomName } = useSearchParams();
  const [manualOwnerAddress, setManualOwnerAddress] = useState<string | null>(null);
  const { room, isLoading, error, needsOwnerInput } = useRoom(roomName, manualOwnerAddress);
  const { setRoom, setLoading, setError, subscribeToRoom, reset } = useRoomStore();

  // Memoize the setOwnerAddress callback
  const handleSetOwnerAddress = useCallback((address: string) => {
    // console.log('Setting manual owner address:', address);
    setManualOwnerAddress(address);
  }, []);

  // Reset state when component unmounts or room name changes
  useEffect(() => {
    // console.log('Room name changed, resetting state:', roomName);
    setManualOwnerAddress(null);
    return () => {
      // console.log('RoomProvider unmounting, cleaning up');
      reset();
    };
  }, [roomName, reset]);

  // Set up room subscription when we have a valid room
  useEffect(() => {
    if (!roomName) {
      // console.log('No room name, skipping subscription');
      return;
    }
    
    // console.log('Setting up room subscription for:', roomName);
    const unsubscribe = subscribeToRoom(roomName);
    
    return () => {
      // console.log('Cleaning up room subscription for:', roomName);
      unsubscribe();
    };
  }, [roomName, subscribeToRoom]);

  // Sync room state
  useEffect(() => {
    // console.log('Syncing room state:', { room, isLoading, error });
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