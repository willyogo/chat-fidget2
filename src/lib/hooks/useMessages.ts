import { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '../supabase';
import { getMessages } from '../api/messages';
import type { Database } from '../types/supabase';

type Message = Database['public']['Tables']['messages']['Row'];

export function useMessages(roomId: string | undefined) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Load initial messages
  useEffect(() => {
    if (!roomId) {
      setIsLoading(false);
      return;
    }

    let mounted = true;

    async function loadInitialMessages() {
      try {
        const data = await getMessages(roomId);
        if (mounted) {
          setMessages(data);
          setHasMore(data.length === 50);
          setError(null);
        }
      } catch (err) {
        console.error('Error loading messages:', err);
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to load messages'));
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadInitialMessages();
    return () => { mounted = false; };
  }, [roomId]);

  // Load more messages
  const loadMore = useCallback(async () => {
    if (!roomId || !messages.length || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const oldestMessage = messages[0];
      const olderMessages = await getMessages(roomId, 50, oldestMessage.created_at);
      
      setMessages(prev => [...olderMessages, ...prev]);
      setHasMore(olderMessages.length === 50);
    } catch (err) {
      console.error('Error loading more messages:', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [roomId, messages, isLoadingMore]);

  // Subscribe to new messages
  useEffect(() => {
    if (!roomId) return;

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
          setMessages((current) => [...current, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [roomId]);

  return { 
    messages, 
    isLoading, 
    error, 
    hasMore, 
    isLoadingMore, 
    loadMore 
  };
}