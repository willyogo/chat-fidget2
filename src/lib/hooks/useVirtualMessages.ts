import { useState, useRef, useCallback, useEffect } from 'react';
import { useMessagesStore } from '../store/messages';

// Improved throttle with proper typing and cancelation
function throttle<T extends (...args: any[]) => void>(
  func: T, 
  limit: number
): [(...args: Parameters<T>) => void, () => void] {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastRun = 0;

  function cancel() {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  }

  function throttled(...args: Parameters<T>) {
    const now = Date.now();

    if (lastRun && now < lastRun + limit) {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        lastRun = now;
        func(...args);
      }, limit);
    } else {
      lastRun = now;
      func(...args);
    }
  }

  return [throttled, cancel];
}

const SCROLL_THRESHOLD = 50;
const LOAD_MORE_THRESHOLD = 200;

export function useVirtualMessages(roomId: string, loadingImages: number) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [initialScrollDone, setInitialScrollDone] = useState(false);
  const lastScrollTop = useRef(0);
  const isScrolling = useRef(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout>>();
  
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
    if (!scrollRef.current || isScrolling.current) return;
    
    isScrolling.current = true;
    const container = scrollRef.current;

    // Clear any existing scroll timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    // Use double RAF for more reliable scrolling
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!container) return;
        
        container.scrollTo({
          top: container.scrollHeight,
          behavior: smooth ? 'smooth' : 'auto'
        });
        
        // Reset scrolling flag after animation
        scrollTimeout.current = setTimeout(() => {
          isScrolling.current = false;
        }, smooth ? 300 : 50);
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