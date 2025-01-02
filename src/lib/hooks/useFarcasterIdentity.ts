import { useEffect, useState } from 'react';
import { queryAirstack } from '../airstack/client';
import { GET_FARCASTER_IDENTITY } from '../airstack/queries';

type FarcasterIdentity = {
  username: string | null;
  avatar: string | null;
};

function findBestSocialMatch(socials: any[] | undefined) {
  if (!socials?.length) return null;
  
  // Find first entry with both username and avatar
  const complete = socials.find(s => s.profileName && s.profileImage);
  if (complete) return complete;
  
  // Otherwise return first entry with either username or avatar
  return socials.find(s => s.profileName || s.profileImage) || null;
}

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
        const { data } = await queryAirstack(GET_FARCASTER_IDENTITY, { 
          address: address.toLowerCase() 
        });
        
        if (!mounted) return;

        const bestMatch = findBestSocialMatch(data?.Socials?.Social);
        
        setIdentity({
          username: bestMatch?.profileName || null,
          avatar: bestMatch?.profileImage || null,
        });
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