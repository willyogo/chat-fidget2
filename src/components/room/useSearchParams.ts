import { useEffect, useState, useCallback } from 'react';

export function useSearchParams() {
  const [params, setParams] = useState(() => new URLSearchParams(window.location.search));

  useEffect(() => {
    function handleUrlChange() {
      const newParams = new URLSearchParams(window.location.search);
      setParams(newParams);
      // console.log('URL params changed:', Object.fromEntries(newParams.entries()));
    }

    // Listen for both popstate and pushstate events
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('pushstate', handleUrlChange);
    
    // Initial check
    handleUrlChange();
    
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('pushstate', handleUrlChange);
    };
  }, []);

  // Add a helper function to update URL params
  const updateParams = useCallback((key: string, value: string) => {
    const newParams = new URLSearchParams(window.location.search);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    window.history.pushState({}, '', `?${newParams.toString()}`);
    setParams(newParams);
  }, []);

  return {
    roomName: params.get('room'),
    ownerAddress: params.get('owner'),
    viewport: params.get('viewport'),
    updateParams
  };
}