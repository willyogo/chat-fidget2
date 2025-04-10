import { useState, useRef, useCallback, useEffect } from 'react';
import { useMessagesStore } from '../store/messages';

const SCROLL_THRESHOLD = 50;
const LOAD_MORE_THRESHOLD = 200;
const SCROLL_TIMEOUT = 300;

export function useVirtualMessages(roomId: string, loadingImages: number) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [initialScrollDone, setInitialScrollDone] = useState(false);
  const lastScrollTop = useRef(0);
  const isScrolling = useRef(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout>>();
  const scrollAttempts = useRef(0);
  const maxScrollAttempts = 3;
  
  const { 
    messages, 
    loadMoreMessages, 
    isLoadingMore, 
    hasMore, 
    isLoading 
  } = useMessagesStore();

  const isAtBottom = useCallback(() => {
    if (!scrollRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    return scrollHeight - scrollTop - clientHeight <= SCROLL_THRESHOLD;
  }, []);

  const scrollToBottom = useCallback((smooth = false) => {
    if (!scrollRef.current) return;

    // Clear any existing scroll timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    const performScroll = () => {
      if (!scrollRef.current) return;
      
      const container = scrollRef.current;
      const { scrollHeight, clientHeight } = container;
      const targetScroll = scrollHeight - clientHeight;

      container.scrollTo({
        top: targetScroll,
        behavior: smooth ? 'smooth' : 'auto'
      });

      // Verify scroll position after a short delay
      scrollTimeout.current = setTimeout(() => {
        if (!scrollRef.current) return;
        
        const { scrollTop, scrollHeight: newScrollHeight, clientHeight: newClientHeight } = scrollRef.current;
        const expectedPosition = newScrollHeight - newClientHeight;
        const scrollDiff = Math.abs(expectedPosition - scrollTop);

        // If we're not at the bottom and haven't exceeded max attempts, try again
        if (scrollDiff > SCROLL_THRESHOLD && scrollAttempts.current < maxScrollAttempts) {
          scrollAttempts.current++;
          performScroll();
        } else {
          isScrolling.current = false;
          scrollAttempts.current = 0;
        }
      }, SCROLL_TIMEOUT);
    };

    isScrolling.current = true;
    scrollAttempts.current = 0;
    
    // Use double RAF for more reliable scrolling
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        performScroll();
      });
    });
  }, []);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (isScrolling.current) return;

    const container = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = container;
    
    // Update last known scroll position
    lastScrollTop.current = scrollTop;

    // Check if we're at the bottom
    const atBottom = scrollHeight - scrollTop - clientHeight <= SCROLL_THRESHOLD;
    setShouldScrollToBottom(atBottom);

    // Load more messages when near top
    if (scrollTop < LOAD_MORE_THRESHOLD && hasMore && !isLoadingMore) {
      const prevHeight = scrollHeight;
      loadMoreMessages(roomId).then(() => {
        requestAnimationFrame(() => {
          if (scrollRef.current) {
            const newHeight = scrollRef.current.scrollHeight;
            const heightDiff = newHeight - prevHeight;
            scrollRef.current.scrollTop = lastScrollTop.current + heightDiff;
          }
        });
      });
    }
  }, [roomId, hasMore, isLoadingMore, loadMoreMessages]);

  // Initial scroll to bottom
  useEffect(() => {
    if (!isLoading && messages.length > 0 && !initialScrollDone && loadingImages === 0) {
      scrollToBottom();
      setShouldScrollToBottom(true);
      setInitialScrollDone(true);
    }
  }, [isLoading, messages.length, initialScrollDone, loadingImages, scrollToBottom]);

  // Auto-scroll for new messages when at bottom
  useEffect(() => {
    if (shouldScrollToBottom && initialScrollDone && loadingImages === 0) {
      scrollToBottom(true);
    }
  }, [messages.length, shouldScrollToBottom, initialScrollDone, loadingImages, scrollToBottom]);

  // Reset state on room change
  useEffect(() => {
    setInitialScrollDone(false);
    setShouldScrollToBottom(true);
    lastScrollTop.current = 0;
    isScrolling.current = false;
    scrollAttempts.current = 0;
    
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
  }, [roomId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  return {
    messages,
    scrollRef,
    handleScroll,
    scrollToBottom,
    isLoadingMore,
    hasMore,
    isAtBottom
  };
}