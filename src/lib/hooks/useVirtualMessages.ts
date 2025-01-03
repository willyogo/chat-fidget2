import { useState, useRef, useCallback } from 'react';
import { useMessagesStore } from '../store/messages';
import type { Message } from '../types/supabase';

const BATCH_SIZE = 50;
const BUFFER_SIZE = 20;

export function useVirtualMessages(roomId: string) {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: BATCH_SIZE });
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastScrollPosition = useRef<number>(0);
  const { messages, loadMoreMessages, isLoadingMore, hasMore } = useMessagesStore();

  // Get only the messages within the visible range plus buffer
  const visibleMessages = messages.slice(
    Math.max(0, visibleRange.start - BUFFER_SIZE),
    Math.min(messages.length, visibleRange.end + BUFFER_SIZE)
  );

  const handleScroll = useCallback(async (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = container;
    
    // Save last scroll position for maintaining position when loading older messages
    lastScrollPosition.current = scrollTop;

    // Check if scrolled near top and should load more
    if (scrollTop < 100 && hasMore && !isLoadingMore) {
      const prevHeight = scrollHeight;
      await loadMoreMessages(roomId);
      
      // Maintain scroll position after loading more messages
      if (scrollRef.current) {
        const newHeight = scrollRef.current.scrollHeight;
        const heightDiff = newHeight - prevHeight;
        scrollRef.current.scrollTop = lastScrollPosition.current + heightDiff;
      }
    }

    // Update visible range based on scroll position
    const itemHeight = 60; // Approximate height of a message
    const start = Math.floor(scrollTop / itemHeight);
    const end = start + Math.ceil(clientHeight / itemHeight);
    
    setVisibleRange({ start, end });
  }, [roomId, hasMore, isLoadingMore, loadMoreMessages]);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  return {
    messages: visibleMessages,
    allMessages: messages,
    scrollRef,
    handleScroll,
    scrollToBottom,
    isLoadingMore,
    hasMore
  };
}