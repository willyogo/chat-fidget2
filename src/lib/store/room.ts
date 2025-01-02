import { create } from 'zustand';
import type { Database } from '../types/supabase';
import { supabase } from '../auth/supabase';

type Room = Database['public']['Tables']['rooms']['Row'];

type RoomState = {
  room: Room | null;
  isLoading: boolean;
  error: Error | null;
  currentChannel: string | null;
  setRoom: (room: Room | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  subscribeToRoom: (roomName: string) => () => void;
};

export const useRoomStore = create<RoomState>((set, get) => ({
  room: null,
  isLoading: false, // Changed from true to false
  error: null,
  currentChannel: null,

  setRoom: (room) => set({ room }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  subscribeToRoom: (roomName) => {
    const { currentChannel } = get();
    
    if (currentChannel) {
      supabase.channel(currentChannel).unsubscribe();
    }

    const channelName = `rooms:${roomName}`;
    const channel = supabase.channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rooms',
          filter: `name=eq.${roomName}`,
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            set({ room: payload.new as Room });
          }
        }
      )
      .subscribe();

    set({ currentChannel: channelName });

    return () => {
      channel.unsubscribe();
      set({ currentChannel: null });
    };
  },
}));