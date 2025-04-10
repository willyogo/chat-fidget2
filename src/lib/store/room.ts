import { create } from 'zustand';
import type { Database } from '../types/supabase';
import { supabase } from '../auth/supabase';

type Room = Database['public']['Tables']['rooms']['Row'];

type RoomState = {
  room: Room | null;
  isLoading: boolean;
  error: Error | null;
  currentChannel: string | null;
  version: number;
  setRoom: (room: Room | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  subscribeToRoom: (roomName: string) => () => void;
  reset: () => void;
};

const initialState = {
  room: null,
  isLoading: true,
  error: null,
  currentChannel: null,
  version: 0,
};

export const useRoomStore = create<RoomState>()((set, get) => ({
  ...initialState,

  setRoom: (room) => {
    set(state => ({ 
      room: room ? { ...room } : null,
      version: state.version + 1
    }));
  },
  
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  
  reset: () => {
    const { currentChannel } = get();
    if (currentChannel) {
      supabase.channel(currentChannel).unsubscribe();
    }
    set({ ...initialState, version: get().version + 1 });
  },

  subscribeToRoom: (roomName) => {
    if (!roomName) {
      return () => {};
    }

    const { currentChannel } = get();
    if (currentChannel) {
      supabase.channel(currentChannel).unsubscribe();
    }

    const normalizedRoomName = roomName.toLowerCase();
    const channelName = `room:${normalizedRoomName}`;
    
    const channel = supabase.channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rooms',
          filter: `name=eq.${normalizedRoomName}`,
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            const updatedRoom = payload.new as Room;
            set(state => ({
              ...state,
              room: { ...updatedRoom },
              version: state.version + 1
            }));
          }
        }
      )
      .subscribe();

    set({ currentChannel: channelName });

    return () => {
      channel.unsubscribe();
      set(state => ({ 
        currentChannel: null,
        version: state.version + 1 
      }));
    };
  },
}));