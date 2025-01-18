import { create } from 'zustand';
import type { Database } from '../types/supabase';
import { supabase } from '../auth/supabase';

type Room = Database['public']['Tables']['rooms']['Row'];

type RoomState = {
  room: Room | null;
  isLoading: boolean;
  error: Error | null;
  currentChannel: string | null;
  version: number; // Add version counter
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

export const useRoomStore = create<RoomState>((set, get) => ({
  ...initialState,

  setRoom: (room) => {
    console.log('Setting room in store:', room);
    // Increment version and create new room reference
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
      console.log('Cleaning up channel on reset:', currentChannel);
      supabase.channel(currentChannel).unsubscribe();
    }
    console.log('Resetting room store to initial state');
    set({ ...initialState, version: get().version + 1 });
  },

  subscribeToRoom: (roomName) => {
    if (!roomName) {
      console.warn('Attempted to subscribe with empty room name');
      return () => {};
    }

    // Clean up any existing subscription
    const { currentChannel } = get();
    if (currentChannel) {
      console.log('Unsubscribing from previous channel:', currentChannel);
      supabase.channel(currentChannel).unsubscribe();
    }

    // Normalize room name for consistency
    const normalizedRoomName = roomName.toLowerCase();
    const channelName = `room:${normalizedRoomName}`;
    console.log('Creating new room subscription:', channelName);
    
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
          console.log('Room change event received:', payload.eventType, payload.new);
          if (payload.eventType === 'UPDATE') {
            const updatedRoom = payload.new as Room;
            console.log('Updating room in store:', updatedRoom);
            // Force a new object reference and increment version
            set(state => ({
              ...state,
              room: { ...updatedRoom },
              version: state.version + 1
            }));
          }
        }
      )
      .subscribe((status, err) => {
        console.log('Room subscription status:', status, err || '');
        if (err) {
          console.error('Room subscription error:', err);
        }
      });

    set({ currentChannel: channelName });

    return () => {
      console.log('Cleaning up room subscription:', channelName);
      channel.unsubscribe();
      set(state => ({ 
        currentChannel: null,
        version: state.version + 1 
      }));
    };
  },
}));