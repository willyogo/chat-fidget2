import { useEffect, useState } from 'react';

export function useSearchParams() {
  const [params, setParams] = useState(() => new URLSearchParams(window.location.search));

  useEffect(() => {
    function handleUrlChange() {
      setParams(new URLSearchParams(window.location.search));
    }

    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  return {
    roomName: params.get('room'),
    ownerAddress: params.get('owner'),
  };
}