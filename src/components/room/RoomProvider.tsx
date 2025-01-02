import { createContext, useContext } from 'react';
import { useSearchParams } from './useSearchParams';
import { useRoom } from '../../lib/hooks/useRoom';
import type { Database } from '../../lib/types/supabase';

type Room = Database['public']['Tables']['rooms']['Row'];

type RoomContextType = {
  room: Room | null;
  isLoading: boolean;
  error: Error | null;
};

export const RoomContext = createContext<RoomContextType | undefined>(undefined);

export function RoomProvider({ children }: { children: React.ReactNode }) {
  const { roomName, ownerAddress } = useSearchParams();
  const { room, isLoading, error } = useRoom(roomName, ownerAddress);

  return (
    <RoomContext.Provider value={{ room, isLoading, error }}>
      {children}
    </RoomContext.Provider>
  );
}