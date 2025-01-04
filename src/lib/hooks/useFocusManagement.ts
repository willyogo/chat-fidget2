import { useRef, useCallback, useEffect } from 'react';

export function useFocusManagement() {
  const elementRef = useRef<HTMLElement | null>(null);
  const focusTimeoutRef = useRef<number>();

  const focusElement = useCallback(() => {
    if (focusTimeoutRef.current) {
      window.clearTimeout(focusTimeoutRef.current);
    }

    // Use double RAF + timeout for maximum reliability across different browsers
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        focusTimeoutRef.current = window.setTimeout(() => {
          elementRef.current?.focus();
        }, 0);
      });
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (focusTimeoutRef.current) {
        window.clearTimeout(focusTimeoutRef.current);
      }
    };
  }, []);

  return {
    elementRef,
    focusElement
  };
}