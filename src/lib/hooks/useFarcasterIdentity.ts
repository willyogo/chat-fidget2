import { useEffect, useState } from 'react';
import { supabase } from '../auth/supabase';

type FarcasterIdentity = {
  username: string | null;
  avatar: string | null;
};

export function useFarcasterIdentity(address: string | undefined) {
  const [identity, setIdentity] = useState<FarcasterIdentity>({ username: null, avatar: null });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!address) {
      setIsLoading(false);
      return;
    }

    let mounted = true;

    async function fetchIdentity() {
      try {
        const response = await fetch(`${supabase.supabaseUrl}/functions/v1/farcaster`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabase.supabaseKey}`,
          },
          body: JSON.stringify({ address: address.toLowerCase() }),
        });

        if (!response.ok) throw new Error('Failed to fetch Farcaster identity');
        
        const data = await response.json();
        
        if (!mounted) return;

        if (data.result?.user) {
          const { username, pfp_url } = data.result.user;
          setIdentity({
            username: username || null,
            avatar: pfp_url || null,
          });
        } else {
          setIdentity({ username: null, avatar: null });
        }
      } catch (error) {
        console.error('Error fetching Farcaster identity:', error);
        if (mounted) {
          setIdentity({ username: null, avatar: null });
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchIdentity();
    return () => { mounted = false; };
  }, [address]);

  return { identity, isLoading };
}