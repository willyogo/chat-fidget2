import { useEffect, useState, useCallback } from 'react';

export function useSearchParams() {
  const [params, setParams] = useState(() => new URLSearchParams(window.location.search));

  useEffect(() => {
    function handleUrlChange() {
      setParams(new URLSearchParams(window.location.search));
    }

    // Listen for both popstate and pushstate events
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('pushstate', handleUrlChange);
    
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('pushstate', handleUrlChange);
    };
  }, []);

  // Add a helper function to update URL params
  const updateParams = useCallback((key: string, value: string) => {
    const newParams = new URLSearchParams(window.location.search);
    newParams.set(key, value);
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