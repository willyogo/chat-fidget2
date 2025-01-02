import { create } from 'zustand';
import type { Database } from '../types/supabase';
import { supabase } from '../supabase';
import { getMessages } from '../api/messages';

type Message = Database['public']['Tables']['messages']['Row'];

type MessagesState = {
  messages: Message[];
  isLoading: boolean;
  error: Error | null;
  hasMore: boolean;
  isLoadingMore: boolean;
  addMessage: (message: Message) => void;
  loadMessages: (roomId: string) => Promise<void>;
  loadMoreMessages: (roomId: string) => Promise<void>;
  subscribeToRoom: (roomId: string) => () => void;
};

export const useMessagesStore = create<MessagesState>((set, get) => ({
  messages: [],
  isLoading: true,
  error: null,
  hasMore: true,
  isLoadingMore: false,

  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  loadMessages: async (roomId) => {
    try {
      const data = await getMessages(roomId);
      set({
        messages: data,
        hasMore: data.length === 50,
        error: null,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err : new Error('Failed to load messages'),
      });
    } finally {
      set({ isLoading: false });
    }
  },

  loadMoreMessages: async (roomId) => {
    const { messages, isLoadingMore } = get();
    if (!messages.length || isLoadingMore) return;

    set({ isLoadingMore: true });
    try {
      const oldestMessage = messages[0];
      const olderMessages = await getMessages(roomId, 50, oldestMessage.created_at);
      
      set((state) => ({
        messages: [...olderMessages, ...state.messages],
        hasMore: olderMessages.length === 50,
      }));
    } catch (err) {
      console.error('Error loading more messages:', err);
    } finally {
      set({ isLoadingMore: false });
    }
  },

  subscribeToRoom: (roomId) => {
    const subscription = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          get().addMessage(payload.new as Message);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  },
}));