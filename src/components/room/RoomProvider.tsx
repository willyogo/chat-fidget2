import { createContext, useEffect, useState } from 'react';
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
  const { setRoom, setLoading, setError, subscribeToRoom } = useRoomStore();

  // Sync room loading state
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  // Sync room error state
  useEffect(() => {
    setError(error);
  }, [error, setError]);

  // Sync room data
  useEffect(() => {
    if (room) {
      setRoom(room);
    }
  }, [room, setRoom]);

  // Subscribe to room updates
  useEffect(() => {
    if (!roomName) return;
    
    const unsubscribe = subscribeToRoom(roomName);
    return () => unsubscribe();
  }, [roomName, subscribeToRoom]);

  // Use room data from store
  const roomData = useRoomStore((state) => ({
    room: state.room,
    isLoading: state.isLoading,
    error: state.error,
  }));

  return (
    <RoomContext.Provider value={{
      ...roomData,
      needsOwnerInput,
      setOwnerAddress: setManualOwnerAddress
    }}>
      {children}
    </RoomContext.Provider>
  );
}